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
  phone: '(571) 236-9633' as string | null,
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

// Masud's eXp agent site (BoldTrail) carries the licensed search of every home for sale.
export const EXP_SITE_URL = 'https://masudhaque.exprealty.com/';
export const SEARCH_ALL_HOMES_URL = 'https://masudhaque.exprealty.com/index.php?advanced=1&beds=0&baths=0&min=0&max=100000000&rtype=map';

export const SOCIAL = [
  { label: 'Facebook', href: 'https://www.facebook.com/m4sudd' },
  { label: 'Instagram', href: 'https://www.instagram.com/m4sudd/' },
  { label: 'LinkedIn', href: 'https://www.linkedin.com/in/masudhaque/' },
  { label: 'X', href: 'https://www.x.com/masudx99' },
];

export const DPOR_LOOKUP_URL = 'https://dporweb.dpor.virginia.gov/LicenseLookup/';

export type ListingStatus = 'coming_soon' | 'active' | 'under_contract' | 'sold';

export const STATUS_LABEL: Record<ListingStatus, string> = {
  coming_soon: 'Coming Soon',
  active: 'Active',
  under_contract: 'Under Contract',
  sold: 'Sold',
};

export const STATUS_ORDER: ListingStatus[] = ['coming_soon', 'active', 'under_contract', 'sold'];
