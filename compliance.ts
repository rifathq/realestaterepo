import fs from 'fs';
import path from 'path';
import type { Express, RequestHandler } from 'express';

// -------------------------------------------------------------
// COMPLIANCE CHECKS
// Reads the site's own source and data on every request, so each
// check reflects the code as it is right now.
// -------------------------------------------------------------

type Status = 'pass' | 'fix' | 'you';

interface Finding {
  text: string;
  where?: string;
}

interface Rule {
  label: string;
  url?: string;
}

interface Check {
  id: string;
  area: string;
  title: string;
  status: Status;
  rule: Rule;
  found: Finding[];
  fix: string;
}

interface Fact {
  key: string;
  group: string;
  label: string;
  value: string | null;
  status: 'verified' | 'decided' | 'confirm' | 'needed';
  source: string;
  sourceUrl?: string;
  note?: string;
}

const ROOT = process.cwd();
const SRC_DIR = path.resolve(ROOT, 'src');
const PROFILE_FILE = path.resolve(ROOT, 'data', 'compliance-profile.json');

const RULES: Record<string, Rule> = {
  advertising: {
    label: '18VAC135-20-190',
    url: 'https://law.lis.virginia.gov/admincode/title18/agency135/chapter20/section190/',
  },
  misrepresentation: {
    label: '18VAC135-20-300',
    url: 'https://law.lis.virginia.gov/admincode/title18/agency135/chapter20/section300/',
  },
  team: {
    label: '§ 54.1-2106.1',
    url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter21/section54.1-2106.1/',
  },
  reviews: {
    label: 'FTC 16 CFR 465',
    url: 'https://www.ecfr.gov/current/title-16/chapter-I/subchapter-D/part-465',
  },
  truthful: {
    label: 'FTC Act § 5',
    url: 'https://www.ftc.gov/business-guidance/resources/advertising-faqs-guide-small-business',
  },
  fairHousing: {
    label: 'Fair Housing Act § 3604(c)',
    url: 'https://www.law.cornell.edu/uscode/text/42/3604',
  },
  tcpa: {
    label: 'TCPA 47 U.S.C. 227',
    url: 'https://www.law.cornell.edu/uscode/text/47/227',
  },
  privacy: {
    label: 'FTC privacy guidance',
    url: 'https://www.ftc.gov/business-guidance/privacy-security',
  },
  bright: {
    label: 'Bright listing rules 2026',
    url: 'https://www.realestatenews.com/2026/07/09/brights-new-rules-aim-to-provide-more-options-more-control',
  },
  ownership: {
    label: '§ 54.1-2138.2',
    url: 'https://law.lis.virginia.gov/vacode/title54.1/chapter21/section54.1-2138.2/',
  },
  triggerTerms: {
    label: 'Reg Z § 1026.24',
    url: 'https://www.consumerfinance.gov/rules-policy/regulations/1026/24/',
  },
  foreclosure: {
    label: '12 CFR 1015 · § 59.1-200.1',
    url: 'https://www.ecfr.gov/current/title-12/chapter-X/part-1015',
  },
  launch: { label: 'Before launch' },
};

function listSourceFiles(dir: string): string[] {
  const out: string[] = [];
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) out.push(...listSourceFiles(full));
    else if (/\.(ts|tsx)$/.test(entry.name)) out.push(full);
  }
  return out;
}

function rel(file: string): string {
  return path.relative(ROOT, file);
}

function clean(line: string): string {
  const text = line.replace(/<[^>]+>/g, ' ').replace(/[{}]/g, ' ').replace(/\s+/g, ' ').trim();
  return text.length > 140 ? `${text.slice(0, 137)}…` : text;
}

function isComment(line: string): boolean {
  const t = line.trim();
  return t.startsWith('//') || t.startsWith('{/*') || t.startsWith('/*') || t.startsWith('*');
}

function scan(pattern: RegExp, files: string[]): Finding[] {
  const found: Finding[] = [];
  for (const file of files) {
    const lines = fs.readFileSync(file, 'utf-8').split('\n');
    lines.forEach((line, i) => {
      if (!isComment(line) && pattern.test(line)) {
        found.push({ text: clean(line), where: `${rel(file)}:${i + 1}` });
      }
    });
  }
  return found;
}

function loadProfile(): { checkedOn: string | null; facts: Fact[] } {
  try {
    const profile = JSON.parse(fs.readFileSync(PROFILE_FILE, 'utf-8'));
    return { checkedOn: profile.checkedOn || null, facts: profile.facts || [] };
  } catch {
    return { checkedOn: null, facts: [] };
  }
}

function runChecks(db: any, facts: Fact[]): Check[] {
  const srcFiles = listSourceFiles(SRC_DIR);
  const app = path.resolve(SRC_DIR, 'App.tsx');
  // The public site is the agent site when it exists; otherwise the original marketplace pages.
  const siteDir = path.resolve(SRC_DIR, 'agent-site');
  const agentSite = fs.existsSync(siteDir);
  const publicFiles = agentSite
    ? [...listSourceFiles(siteDir), app]
    : srcFiles.filter((f) => !/[\\/](admin|agent)[\\/]/.test(f));
  const footer = agentSite ? path.resolve(siteDir, 'SiteLayout.tsx') : path.resolve(SRC_DIR, 'components/layout/Footer.tsx');
  const header = agentSite ? path.resolve(siteDir, 'SiteLayout.tsx') : path.resolve(SRC_DIR, 'components/layout/Header.tsx');
  const profileFile = path.resolve(siteDir, 'profile.ts');
  const profileText = agentSite && fs.existsSync(profileFile) ? fs.readFileSync(profileFile, 'utf-8') : '';
  // The footer may print firm details from profile.ts (FIRM.name) instead of literal text.
  const footerShows = (literal: string, ref: RegExp) => {
    const text = fs.readFileSync(footer, 'utf-8');
    return (literal && text.toLowerCase().includes(literal.toLowerCase())) || (ref.test(text) && profileText.toLowerCase().includes(literal.toLowerCase()));
  };
  const server = path.resolve(ROOT, 'server.ts');
  const fact = (key: string) => facts.find((f) => f.key === key);
  const agentLicence = (fact('agentLicense')?.value || '').match(/#(\d+)/)?.[1] || '';
  const firmLicence = (fact('firm')?.value || '').match(/#(\d+)/)?.[1] || '';
  const settings = db.settings || {};
  const checks: Check[] = [];

  // --- Who is advertising -------------------------------------------------
  const firmShown = footerShows('eXp Realty', /FIRM\.(name|shortName)/);
  checks.push({
    id: 'firm-name',
    area: 'Who is advertising',
    title: "eXp Realty's name appears on every page",
    status: firmShown ? 'pass' : 'fix',
    rule: RULES.advertising,
    found: firmShown
      ? [{ text: 'The shared header and footer name eXp Realty LLC on every page.', where: rel(footer) }]
      : [{ text: 'The header and footer never name eXp Realty.' }],
    fix: 'Add "eXp Realty LLC" to the site footer (and header) so it shows on every page.',
  });

  const street = (fact('firmAddress')?.value || '').split(',')[0];
  const phoneDigits = (fact('firmPhone')?.value || '').replace(/\D/g, '');
  const footerText = fs.readFileSync(footer, 'utf-8');
  const hasOfficeContact =
    (street && footerShows(street.replace(/,.*$/, ''), /FIRM\.street/)) ||
    (phoneDigits && footerText.replace(/\D/g, '').includes(phoneDigits)) ||
    (/FIRM\.phone/.test(footerText) && profileText.includes(fact('firmPhone')?.value || '\u0000'));
  checks.push({
    id: 'office-contact',
    area: 'Who is advertising',
    title: "eXp's office contact is in the disclosure",
    status: hasOfficeContact ? 'pass' : 'fix',
    rule: RULES.advertising,
    found: hasOfficeContact
      ? [{ text: 'Footer carries the eXp office address or phone.', where: rel(footer) }]
      : [{ text: 'The footer has no eXp office address or phone number.', where: rel(footer) }],
    fix: 'Show the office contact details that eXp\'s written policy specifies, next to the firm name.',
  });

  const brokerageClaims = scan(
    /Licensed Real Estate Brokerage|Terms of Brokerage|Institutional Advisory|Licensed Advisors?\b|Licensed Broker\b/i,
    publicFiles,
  );
  if (settings.brokerageName && !/exp realty/i.test(settings.brokerageName)) {
    brokerageClaims.unshift({ text: `System settings: firm name "${settings.brokerageName}"`, where: 'data/db.json' });
  }
  if (settings.licenseId && ![agentLicence, firmLicence].some((n) => n && String(settings.licenseId).includes(n))) {
    brokerageClaims.unshift({ text: `System settings: licence ID "${settings.licenseId}" (FINRA regulates securities, not real estate)`, where: 'data/db.json' });
  }
  checks.push({
    id: 'brokerage-claims',
    area: 'Who is advertising',
    title: "Doesn't present itself as a brokerage",
    status: brokerageClaims.length ? 'fix' : 'pass',
    rule: RULES.advertising,
    found: brokerageClaims.length ? brokerageClaims : [{ text: 'No brokerage claims found.' }],
    fix: 'Remove brokerage wording and the invented licence ID. The licensed firm is eXp Realty LLC.',
  });

  const agents: any[] = db.agents || [];
  const invented = agents.filter((a) => !agentLicence || !String(a.licenseNumber || '').includes(agentLicence));
  checks.push({
    id: 'real-people',
    area: 'Who is advertising',
    title: 'Only real, licensed people are shown as agents',
    status: invented.length ? 'fix' : 'pass',
    rule: RULES.misrepresentation,
    found: invented.length
      ? invented.map((a) => ({ text: `${a.name} — licence "${a.licenseNumber}"`, where: 'data/db.json' }))
      : [{ text: 'Every agent shown carries a real licence number.' }],
    fix: 'Show only you, with licence #' + (agentLicence || '—') + '. Add others only when they are real, licensed eXp colleagues.',
  });

  const operatingName = fact('operatingName');
  const brandMentions = scan(/Digentic/i, publicFiles);
  checks.push({
    id: 'operating-name',
    area: 'Who is advertising',
    title: 'The name the site runs under is decided and licensed',
    status: operatingName?.value ? 'pass' : 'you',
    rule: RULES.team,
    found: operatingName?.value
      ? [{ text: operatingName.value }, { text: `The public site says "Digentic" in ${brandMentions.length} places.` }]
      : [
          { text: `The public site says "Digentic" in ${brandMentions.length} places.` },
          { text: 'DPOR licence lookup: no licence found for "Digentic".' },
        ],
    fix: 'Choose A (your name with eXp Realty) or B (Digentic Realty as a DPOR-licensed team under eXp).',
  });

  const recruiting = scan(/path="\/join-agent"/, [app]).map((f) => ({
    ...f,
    text: 'The site has a "Join as an agent" page at /join-agent.',
  }));
  checks.push({
    id: 'recruiting',
    area: 'Who is advertising',
    title: 'No recruiting of agents to an unlicensed firm',
    status: recruiting.length ? 'fix' : 'pass',
    rule: RULES.team,
    found: recruiting.length ? recruiting : [{ text: 'No agent-recruiting page.' }],
    fix: "Remove the Join page, or turn it into your eXp sponsor link if eXp allows it.",
  });

  // --- Honest advertising -------------------------------------------------
  const reviews: any[] = db.reviews || [];
  const unsourced = reviews.filter((r) => !r.sourceUrl);
  checks.push({
    id: 'reviews',
    area: 'Honest advertising',
    title: 'Every review comes from a real client',
    status: unsourced.length ? 'fix' : 'pass',
    rule: RULES.reviews,
    found: unsourced.length
      ? unsourced.map((r) => ({ text: `${r.authorName || 'Unknown'}: "${clean(r.comment || '').slice(0, 90)}…"`, where: 'data/db.json' }))
      : reviews.length
        ? [{ text: 'All reviews link to their source.' }]
        : [{ text: 'The site shows no reviews. Add only real client reviews later.' }],
    fix: 'Delete invented reviews. Publish only real client reviews, linked to Google or Zillow.',
  });

  const mlsClaims = scan(/\bMLS\b/, publicFiles);
  checks.push({
    id: 'mls-claim',
    area: 'Honest advertising',
    title: 'No claim of MLS data the site does not have',
    status: mlsClaims.length ? 'fix' : 'pass',
    rule: RULES.truthful,
    found: mlsClaims.length ? mlsClaims : [{ text: 'No MLS claims.' }],
    fix: 'Say what is true: your own listings here, and eXp\'s search for every other home.',
  });

  const verifiedClaims = scan(
    /Verified (Title|Ownership|Architectural|Client)|verified (homes|listings|architectural)|Structural Due Dil/i,
    publicFiles,
  );
  const verifiedBadges = (db.properties || []).filter((p: any) => p.verified);
  if (verifiedBadges.length) {
    verifiedClaims.push({ text: `${verifiedBadges.length} listings carry a "verified" badge`, where: 'data/db.json' });
  }
  checks.push({
    id: 'verified-claims',
    area: 'Honest advertising',
    title: '"Verified" claims have a real check behind them',
    status: verifiedClaims.length ? 'fix' : 'pass',
    rule: RULES.truthful,
    found: verifiedClaims.length ? verifiedClaims.slice(0, 8) : [{ text: 'No unsupported "verified" claims.' }],
    fix: 'Remove "verified" wording unless a real title or inspection check stands behind each one.',
  });

  const demoListings = (db.properties || []).filter(
    (p: any) => p.sample || (p.images || []).some((img: string) => /unsplash\.com/.test(img)),
  );
  checks.push({
    id: 'demo-listings',
    area: 'Honest advertising',
    title: 'Only real homes that are actually for sale',
    status: demoListings.length ? 'fix' : 'pass',
    rule: RULES.misrepresentation,
    found: demoListings.length
      ? demoListings.map((p: any) => ({
          text: `${p.title} — ${p.sample ? 'sample listing' : 'stock photos'}, no signed listing agreement`,
          where: 'data/db.json',
        }))
      : [{ text: 'No sample listings.' }],
    fix: 'Replace with your real listings. Each needs a signed listing agreement before it goes up.',
  });

  const statusSupport = scan(/Under Contract|under_contract|Coming Soon|coming_soon/i, srcFiles);
  checks.push({
    id: 'listing-status',
    area: 'Honest advertising',
    title: 'Listing status can be kept current',
    status: statusSupport.length ? 'pass' : 'fix',
    rule: RULES.advertising,
    found: statusSupport.length
      ? [{ text: 'Listings support Coming Soon, Active, Under Contract and Sold.', where: statusSupport[0].where }]
      : [{ text: 'Listings can only be "active". There is no Coming Soon, Under Contract or Sold.' }],
    fix: 'Add Coming Soon, Active, Under Contract and Sold, and update the site the moment status changes.',
  });

  // --- Fair housing & privacy ---------------------------------------------
  const eho = scan(/Equal Housing/i, [footer]);
  checks.push({
    id: 'equal-housing',
    area: 'Fair housing & privacy',
    title: 'Equal Housing Opportunity is shown',
    status: eho.length ? 'pass' : 'fix',
    rule: RULES.fairHousing,
    found: eho.length ? eho : [{ text: 'No Equal Housing Opportunity statement in the footer.' }],
    fix: 'Keep the Equal Housing Opportunity logo in the footer, and keep listing text free of steering language.',
  });

  const privacyRoute = scan(/path="\/privacy/, [app]);
  const privacyLink = scan(/privacy/i, [footer]);
  checks.push({
    id: 'privacy',
    area: 'Fair housing & privacy',
    title: 'A privacy policy exists before collecting leads',
    status: privacyRoute.length ? 'pass' : 'fix',
    rule: RULES.privacy,
    found: privacyRoute.length
      ? [{ text: 'Privacy page at /privacy, linked from the footer and every form.', where: privacyRoute[0].where }]
      : [{ text: privacyLink.length ? 'The footer mentions privacy, but no privacy page exists.' : 'No privacy page.', where: rel(app) }],
    fix: 'Add a privacy policy and terms page, linked from the footer and every form.',
  });

  const formFiles = publicFiles.filter((f) => /<form/.test(fs.readFileSync(f, 'utf-8')));
  const withConsent = formFiles.filter((f) => /consent|agree to be contacted|by submitting/i.test(fs.readFileSync(f, 'utf-8')));
  const missingConsent = formFiles.filter((f) => !withConsent.includes(f) && !/admin|agent[\\/]|AuthModal/.test(f));
  checks.push({
    id: 'lead-consent',
    area: 'Fair housing & privacy',
    title: 'Lead forms ask permission to call or text',
    status: missingConsent.length ? 'fix' : 'pass',
    rule: RULES.tcpa,
    found: missingConsent.length
      ? missingConsent.map((f) => ({ text: 'Form collects contact details with no consent wording', where: rel(f) }))
      : [{ text: 'Every lead form asks for consent.' }],
    fix: 'Add a consent line with a checkbox to each form before anyone is called or texted.',
  });

  // --- Bright MLS ------------------------------------------------------------
  const brightUse = scan(/bright-reso|brightmls/i, [...srcFiles, server]);
  checks.push({
    id: 'no-bright-feed',
    area: 'Bright MLS',
    title: "No Bright data feed, so Bright's licence fees don't apply",
    status: brightUse.length ? 'fix' : 'pass',
    rule: RULES.bright,
    found: brightUse.length ? brightUse : [{ text: 'The site pulls nothing from Bright.' }],
    fix: 'Keep it that way: your listings come from your own admin.',
  });

  const twoDay = scan(/listingAgreement|brightRegistered/i, [...srcFiles, server]);
  checks.push({
    id: 'bright-2day',
    area: 'Bright MLS',
    title: 'Each listing reaches Bright within 2 days of the signed agreement',
    status: twoDay.length ? 'pass' : 'fix',
    rule: RULES.bright,
    found: twoDay.length ? twoDay.slice(0, 3) : [{ text: 'Not built yet: no listing-agreement date or Bright deadline on listings.' }],
    fix: 'Record the listing-agreement date and start a 2-day countdown to Bright entry.',
  });

  const crm = fact('idxCrm');
  checks.push({
    id: 'idx-search',
    area: 'Bright MLS',
    title: "Search-all-homes uses eXp's included search",
    status: crm?.value ? 'pass' : 'you',
    rule: RULES.bright,
    found: [{ text: crm?.value ? `Using ${crm.value}` : 'Waiting on which eXp tool you use: BoldTrail or Lofty.' }],
    fix: 'Link the search page to your eXp BoldTrail or Lofty site, at no extra cost.',
  });

  // --- Investor & creative deals -----------------------------------------
  const ownerListings = (db.properties || []).filter((p: any) => p.ownership === 'agent');
  const detailFile = path.resolve(siteDir, 'pages/ListingDetailPage.tsx');
  const showsOwnerNotice =
    agentSite && fs.existsSync(detailFile) && /OwnershipNotice/.test(fs.readFileSync(detailFile, 'utf-8')) && /ownership interest/.test(profileText);
  checks.push({
    id: 'owner-disclosure',
    area: 'Investor & creative deals',
    title: 'Agent-owned homes say you are a licensee with an ownership interest',
    status: ownerListings.length === 0 || showsOwnerNotice ? 'pass' : 'fix',
    rule: RULES.ownership,
    found: ownerListings.length === 0
      ? [{ text: 'No agent-owned homes are advertised.' }]
      : showsOwnerNotice
        ? [{ text: `${ownerListings.length} agent-owned homes, each showing the ownership disclosure on its card and page.`, where: rel(detailFile) }]
        : ownerListings.map((p: any) => ({ text: `${p.title} is agent-owned but shows no disclosure`, where: 'data/db.json' })),
    fix: 'Show the licensee ownership disclosure on every agent-owned home, and give it in writing before discussing terms.',
  });

  // Truth in Lending: a down payment, payment amount or number of payments in an ad
  // requires the APR and full repayment terms beside it.
  const trigger = /\$\s?[\d,.]+\s?k?\s*(down|\/\s?mo\b|per month|a month|monthly)|\d+(\.\d+)?\s?%\s*(down|interest|apr)|\b\d+\s+(monthly\s+)?payments\b/i;
  const triggerHits: Finding[] = [];
  for (const p of db.properties || []) {
    const text = [p.title, p.tagline, p.description, ...(p.features || []), ...(p.financing || [])].join(' ');
    if (trigger.test(text)) triggerHits.push({ text: `${p.title}: "${clean(text.match(trigger)![0])}"`, where: 'data/db.json' });
  }
  triggerHits.push(...scan(trigger, publicFiles));
  checks.push({
    id: 'financing-terms',
    area: 'Investor & creative deals',
    title: 'Financing ads avoid down-payment and monthly-payment figures',
    status: triggerHits.length ? 'fix' : 'pass',
    rule: RULES.triggerTerms,
    found: triggerHits.length
      ? triggerHits.slice(0, 8)
      : [{ text: 'Financing appears as labels only (seller financing, subject-to, lease option), with terms on request.' }],
    fix: 'Remove down-payment, payment or rate figures, or add the APR and full repayment terms right next to them.',
  });

  const fcRoute = scan(/path="\/foreclosure-help"/, [app]);
  const fcFile = path.resolve(siteDir, 'pages/ForeclosureHelpPage.tsx');
  if (fcRoute.length && fs.existsSync(fcFile)) {
    const fcText = fs.readFileSync(fcFile, 'utf-8');
    const required: [string, RegExp][] = [
      ['"not associated with the government"', /not associated with the government/i],
      ['"your lender may not agree to change your loan"', /lender may not agree to change your loan/i],
      ['"you could lose your home"', /could lose your home/i],
      ['no upfront fees', /upfront fees/i],
      ['"you may stop working with me at any time"', /stop working with me at any time/i],
      ['free HUD counselor', /HUD/],
      ['payment promises in a written contract', /written contract/i],
      ['no forced arbitration', /arbitration/i],
    ];
    const missing = required.filter(([, re]) => !re.test(fcText)).map(([label]) => label);
    const marketingPages = ['ForeclosureHelpPage', 'HomePage', 'CreativeFinancingPage', 'OffMarketPage']
      .map((f) => path.resolve(siteDir, `pages/${f}.tsx`))
      .filter((f) => fs.existsSync(f));
    const risky = scan(/stop (your )?foreclosure|(?<!not )guarantee[ds]?\b|save your home/i, marketingPages);
    checks.push({
      id: 'foreclosure-disclosures',
      area: 'Investor & creative deals',
      title: 'Foreclosure help carries the required disclosures and no promises',
      status: missing.length || risky.length ? 'fix' : 'pass',
      rule: RULES.foreclosure,
      found: [
        ...missing.map((m) => ({ text: `Missing: ${m}`, where: rel(fcFile) })),
        ...risky,
        ...(missing.length || risky.length ? [] : [{ text: 'All federal and Virginia disclosures present; no "stop foreclosure" or guarantee claims.', where: rel(fcFile) }]),
      ],
      fix: 'Keep every disclosure on the page, charge nothing before settlement, and never promise to stop a foreclosure.',
    });
  }

  // --- Before launch -------------------------------------------------------
  const seeded = scan(/hashPassword\('[^']+'\)/, [server]).map((f) => ({
    ...f,
    text: 'Demo account created with a fixed password',
  }));
  checks.push({
    id: 'demo-logins',
    area: 'Before launch',
    title: 'No demo logins with passwords in the code',
    status: seeded.length ? 'fix' : 'pass',
    rule: RULES.launch,
    found: seeded.length ? seeded : [{ text: 'No seeded passwords.' }],
    fix: 'Remove the demo accounts and create your own admin login with a strong password.',
  });

  const approval = fact('brokerApproval');
  checks.push({
    id: 'broker-approval',
    area: 'Before launch',
    title: 'Your eXp broker has approved the site',
    status: approval?.value ? 'pass' : 'you',
    rule: RULES.advertising,
    found: [{ text: approval?.value ? `Approved: ${approval.value}` : 'Not yet. Send it once the fixes above are done.' }],
    fix: "Virginia requires your broker's supervision of all advertising. Keep the approval on file.",
  });

  return checks;
}

export function registerComplianceRoutes(app: Express, getDb: () => any, guard: RequestHandler) {
  app.get('/api/compliance', guard, (_req, res) => {
    const { checkedOn, facts } = loadProfile();
    const checks = runChecks(getDb(), facts);
    const summary = {
      total: checks.length,
      pass: checks.filter((c) => c.status === 'pass').length,
      fix: checks.filter((c) => c.status === 'fix').length,
      you: checks.filter((c) => c.status === 'you').length,
    };
    return res.json({ checkedAt: new Date().toISOString(), factsCheckedOn: checkedOn, facts, checks, summary });
  });
}
