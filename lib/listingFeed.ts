import type { Express } from 'express';
import { AGENT, FIRM } from '../src/agent-site/profile';

// Public, read-only feed of this agent's listings. The Digentic Realty site
// pulls it so every listing appears there automatically, carrying its own
// "Listed by" attribution (agent, licence, brokerage) with it.
export function registerListingFeed(app: Express, getDb: () => any, port: number) {
  app.get('/api/feed/listings', (req, res) => {
    const siteUrl = (process.env.AGENT_SITE_URL || `${req.protocol}://${req.get('host') || `localhost:${port}`}`).replace(/\/$/, '');
    const absolute = (url: string) => (url.startsWith('http') ? url : `${siteUrl}${url}`);
    const listedBy = {
      agentId: AGENT.id,
      agentName: AGENT.name,
      agentTitle: AGENT.title,
      licence: `${AGENT.licensedIn} ${AGENT.licenceType} #${AGENT.licence}`,
      email: AGENT.email,
      phone: AGENT.phone,
      photo: absolute(AGENT.photo),
      siteUrl,
      brokerage: FIRM.name,
      brokerageLicence: FIRM.licence,
      brokerageOffice: `${FIRM.street}, ${FIRM.cityStateZip}`,
      brokeragePhone: FIRM.phone,
    };
    const listings = (getDb().properties || [])
      // Agent-owned homes and rentals stay on this site until Digentic can show the ownership disclosure.
      .filter((p: any) => p.agentId === AGENT.id && !p.offMarket && p.ownership !== 'agent')
      .map((p: any) => ({
        ...p,
        images: (p.images || []).map(absolute),
        url: `${siteUrl}/listings/${p.slug}`,
      }));
    res.set('Cache-Control', 'no-store');
    return res.json({ generatedAt: new Date().toISOString(), listedBy, listings });
  });
}
