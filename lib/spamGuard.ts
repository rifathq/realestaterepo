/**
 * digents-spam-guard (Node/TypeScript) — canonical implementation.
 *
 * Basic bot/spam protection for any public form or write endpoint.
 * Zero runtime dependencies so it drops into any Express (v4/v5) app or
 * gets copied verbatim into a bundled service.
 *
 * DOCTRINE (memory: spam-guard-every-build): every public form/endpoint
 * we ship must be guarded. This is the shared building block — edit HERE,
 * then re-sync consumers (like payments-library: copy files OR import).
 *
 * Layers, cheapest-first:
 *   1. Honeypot     — a hidden field bots fill and humans can't see.
 *   2. Content junk — random-character-soup detection across text fields.
 *   3. Rate limit   — per-IP, in-memory, XFF-aware (works behind Traefik).
 *
 * Design choice: on a spam verdict the CALLER should return a *fake success*
 * (same shape/status as a real accept) and silently skip the insert/email,
 * so the bot believes it worked and stops retrying. Never reveal the block.
 *
 * See ../SPEC.md for the language-agnostic algorithm (for the PHP port).
 */

const VOWELS = new Set(["a", "e", "i", "o", "u"]);

// -------------------------------------------------------------------------
// 1. Honeypot
// -------------------------------------------------------------------------

/**
 * Trips if any honeypot key is present AND non-empty in the body. The form
 * renders these as visually-hidden inputs (CSS off-screen, aria-hidden,
 * tabindex=-1). A human leaves them blank; a naive bot fills every field.
 * Default keys are innocuous names bots love: "website", "url", "company_url".
 */
export function isHoneypotTripped(
  body: Record<string, unknown>,
  honeypotKeys: string[] = ["website", "url", "company_url", "hp_field"],
): boolean {
  for (const key of honeypotKeys) {
    const v = body?.[key];
    if (typeof v === "string" && v.trim().length > 0) return true;
  }
  return false;
}

// -------------------------------------------------------------------------
// 2. Content-junk (gibberish) detection
// -------------------------------------------------------------------------

/** Longest run of consecutive consonant letters in a token. */
function longestConsonantRun(token: string): number {
  let max = 0;
  let cur = 0;
  for (const ch of token.toLowerCase()) {
    if (ch >= "a" && ch <= "z" && !VOWELS.has(ch)) {
      cur += 1;
      if (cur > max) max = cur;
    } else {
      cur = 0;
    }
  }
  return max;
}

/** Number of internal lower<->upper case transitions among letters. */
function internalCaseSwitches(token: string): number {
  let switches = 0;
  let prev: "U" | "L" | null = null;
  for (const ch of token) {
    if (ch >= "A" && ch <= "Z") {
      if (prev === "L") switches += 1;
      prev = "U";
    } else if (ch >= "a" && ch <= "z") {
      if (prev === "U") switches += 1;
      prev = "L";
    } else {
      prev = null; // non-letter breaks the run (word boundary)
    }
  }
  return switches;
}

/** Ratio of vowels to letters (0..1). Returns 1 for no-letter strings. */
function vowelRatio(s: string): number {
  const letters = s.toLowerCase().replace(/[^a-z]/g, "");
  if (letters.length === 0) return 1;
  let v = 0;
  for (const ch of letters) if (VOWELS.has(ch)) v += 1;
  return v / letters.length;
}

/**
 * Is a single field random character-soup? A field is "junk" when it hits
 * >= 2 of three independent entropy signals. Each signal alone can appear in
 * a legit value (a long consonant cluster, a camelCase brand); requiring TWO
 * keeps false-positives near-zero. Empty/short fields are never junk.
 */
export function looksLikeGibberish(value: string | null | undefined): boolean {
  const v = (value ?? "").trim();
  if (v.length < 8) return false; // too short to be confidently random

  let signals = 0;
  // (a) many mid-word case flips: "zpePvilFBcdif" (7+), "iqeYnVBrfsB..." (many).
  //     Threshold is 4 — legit camelCase brands ("BestContracting", "PayPal")
  //     only have 2-3 boundary flips, so they pass; random soup has far more.
  if (internalCaseSwitches(v) >= 4) signals += 1;
  // (b) a long consonant run with no vowel relief
  if (longestConsonantRun(v) >= 4) signals += 1;
  // (c) a long single token with a below-natural vowel ratio
  if (!/\s/.test(v) && v.length >= 12 && vowelRatio(v) < 0.35) signals += 1;

  return signals >= 2;
}

export interface SpamAnalysis {
  isSpam: boolean;
  reasons: string[];
}

/**
 * Analyze a set of human-entered text fields (name, company, message, ...).
 * Verdict = spam when >= 2 fields look like gibberish. Requiring two junk
 * fields means a real person would have to type random character-soup into
 * two separate boxes — effectively impossible — so legit leads pass.
 */
export function analyzeSpam(
  fields: Record<string, string | null | undefined>,
  opts: { minJunkFields?: number } = {},
): SpamAnalysis {
  const minJunkFields = opts.minJunkFields ?? 2;
  const reasons: string[] = [];
  let junk = 0;
  for (const [name, value] of Object.entries(fields)) {
    if (looksLikeGibberish(value)) {
      junk += 1;
      reasons.push(`field "${name}" looks like random characters`);
    }
  }
  return { isSpam: junk >= minJunkFields, reasons };
}

// -------------------------------------------------------------------------
// 3. Per-IP rate limiter (in-memory, XFF-aware)
// -------------------------------------------------------------------------

/** Real client IP behind a reverse proxy (Traefik/Cloudflare) — first XFF hop. */
export function getClientIp(req: {
  headers?: Record<string, unknown>;
  socket?: { remoteAddress?: string };
  ip?: string;
}): string {
  const xff = req.headers?.["x-forwarded-for"];
  if (typeof xff === "string" && xff.length > 0) {
    const first = xff.split(",")[0]?.trim();
    if (first) return first;
  }
  return req.ip || req.socket?.remoteAddress || "unknown";
}

export interface RateLimiter {
  /** Records a hit for `ip`; returns whether it's allowed and how many remain. */
  check(ip: string): { allowed: boolean; remaining: number };
}

/**
 * Sliding-window per-IP limiter backed by a Map. No dependency, no Redis.
 * Fine for single-process services; swap for a shared store when a route is
 * load-balanced across processes. Prunes lazily on each check.
 */
export function createRateLimiter(opts: {
  windowMs: number;
  max: number;
}): RateLimiter {
  const { windowMs, max } = opts;
  const hits = new Map<string, number[]>();

  return {
    check(ip: string) {
      const nowMs = Date.now();
      const cutoff = nowMs - windowMs;
      const arr = (hits.get(ip) ?? []).filter((t) => t > cutoff);
      arr.push(nowMs);
      hits.set(ip, arr);

      // Opportunistic prune so the Map can't grow unbounded.
      if (hits.size > 5000) {
        for (const [k, v] of hits) {
          const kept = v.filter((t) => t > cutoff);
          if (kept.length === 0) hits.delete(k);
          else hits.set(k, kept);
        }
      }
      return { allowed: arr.length <= max, remaining: Math.max(0, max - arr.length) };
    },
  };
}
