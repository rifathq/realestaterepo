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

export type ListingStatus = 'coming_soon' | 'active' | 'under_contract' | 'sold' | 'rented';

export const STATUS_LABEL: Record<ListingStatus, string> = {
  coming_soon: 'Coming Soon',
  active: 'Active',
  under_contract: 'Under Contract',
  sold: 'Sold',
  rented: 'Rented',
};

export const STATUS_ORDER: ListingStatus[] = ['coming_soon', 'active', 'under_contract', 'sold', 'rented'];

// Deal-type tags shown on listings. Labels only: no down payment, payment or rate
// figures, so ads stay clear of Truth in Lending trigger terms.
export const FINANCING_OPTIONS = ['Seller Finance', 'SubTo', 'Hybrid', 'Lease Option', 'Wrap', 'Assumable', 'Cash'];

export const FINANCING_HELP: Record<string, string> = {
  'Seller Finance': 'The seller carries the loan and you pay the seller over time.',
  SubTo: 'Buy subject to the existing mortgage, which stays in place.',
  Hybrid: "SubTo on the existing loan plus seller financing for the seller's equity.",
  'Lease Option': 'Rent now with the right to buy later at an agreed price.',
  Wrap: 'A new seller-financed note that wraps around the existing loan.',
  Assumable: "Take over the existing loan with the lender's approval.",
  Cash: 'A direct cash purchase.',
};

export const AFFILIATION = 'Member of the SubTo community of creative real estate investors and agents';

// Virginia § 54.1-2138.2: a licensee with an ownership interest must say so in writing.
export const OWNERSHIP_DISCLOSURE = `${AGENT.name} is a real estate salesperson licensed in ${AGENT.licensedIn} (#${AGENT.licence}) and has an ownership interest in this property, directly or through a company he owns. He is acting as a principal, not as the buyer's agent.`;

// HUD-approved housing counseling, free.
export const HUD_COUNSELING_PHONE = '(800) 569-4287';

// Who is reaching out. Each path pre-selects the topic on the contact form.
export const PERSONAS = [
  { key: 'seller', title: "I'm selling, or just curious", body: "What's my home worth? Would a creative offer beat a listing? Ask, no obligation.", topic: 'Selling or just curious' },
  { key: 'investor', title: "I'm an investor", body: 'Off-market deals, SubTo, Seller Finance and Hybrid terms, sent to you first.', topic: 'Investing' },
  { key: 'buyer', title: "I'm buying", body: 'A home to live in, with a bank loan or creative terms.', topic: 'Buying a home' },
  { key: 'renter', title: "I'm renting", body: 'See what is available now or join the waitlist for the next opening.', topic: 'Renting' },
];

export const DIGENTS_URL = 'https://digents.com/?utm_source=masud-agent-site&utm_medium=footer';
export const DIGENTS_CONTACT_URL = 'https://digents.com/contact?utm_source=masud-agent-site&utm_medium=footer';
