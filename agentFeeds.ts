import type { Express, RequestHandler } from 'express';

// -------------------------------------------------------------
// AGENT LISTING FEEDS
// Each agent runs their own site. Their listings flow onto this site
// automatically by pulling each agent's public feed (/api/feed/listings).
// Every listing keeps its "Listed by" attribution: agent, licence and the
// licensed brokerage, because Virginia requires the licensed firm on all
// advertising (18VAC135-20-190).
//
// AGENT_FEED_URLS                comma-separated feed URLs
// AGENT_FEED_INTERVAL_SECONDS    how often to re-sync (default 300)
// -------------------------------------------------------------

interface FeedStatus {
  url: string;
  lastSyncAt: string | null;
  listings: number;
  agentName: string | null;
  error: string | null;
}

const FEED_URLS = (process.env.AGENT_FEED_URLS || '')
  .split(',')
  .map((u) => u.trim())
  .filter(Boolean);
const INTERVAL_MS = Math.max(30, Number(process.env.AGENT_FEED_INTERVAL_SECONDS) || 300) * 1000;
const status = new Map<string, FeedStatus>();

function toProperty(listing: any, listedBy: any, feedUrl: string, takenSlugs: Set<string>) {
  const slug = takenSlugs.has(listing.slug) ? `${listing.slug}-${listedBy.agentId}` : listing.slug;
  const description = Array.isArray(listing.description) ? listing.description : [String(listing.description || '')];
  const highlights = listing.architecturalHighlights;
  return {
    ...listing,
    id: `${listedBy.agentId}--${listing.id}`,
    slug,
    category: listing.category || 'Houses',
    description,
    features: listing.features || [],
    amenities: listing.amenities || [],
    architecturalHighlights:
      highlights && !Array.isArray(highlights) && highlights.style
        ? highlights
        : { style: listing.category || 'House', materials: [], facing: '' },
    verified: false,
    verifiedBadgeText: '',
    agentId: listedBy.agentId,
    source: 'agent-feed',
    feedUrl,
    listingUrl: listing.url,
    listedBy,
  };
}

async function syncFeed(url: string, getDb: () => any, saveDb: (db: any) => void) {
  const entry: FeedStatus = status.get(url) || { url, lastSyncAt: null, listings: 0, agentName: null, error: null };
  try {
    const res = await fetch(url, { signal: AbortSignal.timeout(15000) });
    if (!res.ok) throw new Error(`Feed answered HTTP ${res.status}`);
    const feed = await res.json();
    if (!feed?.listedBy?.agentId || !feed?.listedBy?.brokerage || !Array.isArray(feed.listings)) {
      throw new Error('Feed is missing the agent, the brokerage or the listings.');
    }
    const db = getDb();
    const others = (db.properties || []).filter((p: any) => p.feedUrl !== url);
    const taken = new Set<string>(others.map((p: any) => p.slug));
    const fromFeed = feed.listings.map((l: any) => toProperty(l, feed.listedBy, url, taken));
    // Replace this feed's listings wholesale, so edits, status changes and removals all flow through.
    db.properties = [...fromFeed, ...others];
    saveDb(db);
    Object.assign(entry, {
      lastSyncAt: new Date().toISOString(),
      listings: fromFeed.length,
      agentName: feed.listedBy.agentName,
      error: null,
    });
  } catch (err: any) {
    // Keep the last good copy on screen; record the failure for the admin.
    entry.error = err?.message || 'Sync failed';
  }
  status.set(url, entry);
}

export async function syncAllAgentFeeds(getDb: () => any, saveDb: (db: any) => void) {
  for (const url of FEED_URLS) await syncFeed(url, getDb, saveDb);
}

export function startAgentFeeds(app: Express, getDb: () => any, saveDb: (db: any) => void, guard: RequestHandler) {
  app.get('/api/agent-feeds', guard, (_req, res) => res.json(FEED_URLS.map((u) => status.get(u) || { url: u, lastSyncAt: null })));
  app.post('/api/agent-feeds/sync', guard, async (_req, res) => {
    await syncAllAgentFeeds(getDb, saveDb);
    return res.json(FEED_URLS.map((u) => status.get(u)));
  });

  if (!FEED_URLS.length) return;
  syncAllAgentFeeds(getDb, saveDb);
  setInterval(() => syncAllAgentFeeds(getDb, saveDb), INTERVAL_MS);
}
