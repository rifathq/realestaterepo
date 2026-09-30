// Single source for every name, licence and contact shown on the agent site.
// Values match data/compliance-profile.json (DPOR lookup, 30 Sep 2026).

export const AGENT = {
  id: 'agent-masud',
  name: 'Masud Haque',
  title: 'Real Estate Agent',
  licenceType: 'Salesperson',
  licensedIn: 'Virginia',
  licence: '0225276696',
  email: 'masud.haque@exprealty.com',
  phone: null as string | null,
  photo: '/agent/masud-haque.jpg',
  serving: 'Arlington and Northern Virginia',
};

export const FIRM = {
  name: 'eXp Realty LLC',
  shortName: 'eXp Realty',
  licence: '0226023254',
  street: '800 Corporate Dr, Ste 301',
  cityStateZip: 'Stafford, VA 22554',
  phone: '866-825-7169',
};

// Until the BoldTrail or Lofty site is chosen, "Search all homes" opens eXp's public search.
export const SEARCH_ALL_HOMES_URL = 'https://exprealty.com/';

export const DPOR_LOOKUP_URL = 'https://dporweb.dpor.virginia.gov/LicenseLookup/';

export type ListingStatus = 'coming_soon' | 'active' | 'under_contract' | 'sold';

export const STATUS_LABEL: Record<ListingStatus, string> = {
  coming_soon: 'Coming Soon',
  active: 'Active',
  under_contract: 'Under Contract',
  sold: 'Sold',
};

export const STATUS_ORDER: ListingStatus[] = ['coming_soon', 'active', 'under_contract', 'sold'];
