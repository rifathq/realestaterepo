import crypto from 'crypto';
import type { Request, Response, NextFunction } from 'express';
import { analyzeSpam, isHoneypotTripped, createRateLimiter, getClientIp } from './spamGuard';

// Public lead form protection: rate limit, honeypot, junk-text check.
// spamGuard.ts copied from digents-spam-guard/node/spamGuard.ts on 2026-09-30.
// Spam gets a fake success so bots stop retrying; nothing is stored.
const leadLimiter = createRateLimiter({ windowMs: 10 * 60_000, max: 5 });

export function leadGuard(req: Request, res: Response, next: NextFunction) {
  if (!leadLimiter.check(getClientIp(req as any)).allowed) {
    return res.status(429).json({ error: 'Too many requests. Please try again in a few minutes.' });
  }
  const body = req.body ?? {};
  const spam =
    isHoneypotTripped(body) ||
    analyzeSpam({ name: body.clientName, message: body.message, inquiry: body.inquiryType }).isSpam;
  if (spam) {
    return res.status(201).json({ id: `lead-${crypto.randomUUID()}`, status: 'new' });
  }
  next();
}
