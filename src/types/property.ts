export type ListingType = 'buy' | 'rent';

export type PropertyCategory = 
  | 'Offices' 
  | 'Villas' 
  | 'Apartments' 
  | 'Penthouses' 
  | 'Retail' 
  | 'Industrial' 
  | 'Land'
  | 'Houses';

// Attribution carried by listings that come from an agent's own site.
export interface ListedBy {
  agentId: string;
  agentName: string;
  agentTitle: string;
  licence: string;
  email: string;
  phone: string | null;
  photo: string;
  siteUrl: string;
  brokerage: string;
  brokerageLicence: string;
  brokerageOffice: string;
  brokeragePhone: string;
}

export const LISTING_STATUS_LABEL: Record<string, string> = {
  coming_soon: 'Coming Soon',
  active: 'Active',
  under_contract: 'Under Contract',
  sold: 'Sold',
};

export interface PropertyLocation {
  address: string;
  neighborhood: string;
  city: string;
  state: string;
  zip: string;
  coordinates: {
    lat: number;
    lng: number;
  };
}

export interface PropertySpecs {
  beds: number;
  baths: number;
  sqft: number;
  parking: number;
  yearBuilt: number;
  floor?: number;
  lotSize?: string;
  pricePerSqft: number;
  hoaMonthly?: number;
}

export interface PropertyDocument {
  id: string;
  title: string;
  fileType: 'PDF' | 'DWG' | 'DOC';
  size: string;
  verifiedDate: string;
}

export interface Property {
  id: string;
  slug: string;
  title: string;
  tagline: string;
  price: number;
  priceDisplay: string;
  period?: 'month' | 'total';
  listingType: ListingType;
  category: PropertyCategory;
  location: PropertyLocation;
  specs: PropertySpecs;
  featured?: boolean;
  editorialHighlight?: string;
  description: string[];
  features: string[];
  amenities: string[];
  architecturalHighlights: {
    architect?: string;
    style: string;
    materials: string[];
    facing: string;
  };
  verified: boolean;
  verifiedBadgeText: string;
  agentId: string;
  images: string[];
  floorPlanUrl?: string;
  virtualTourAvailable: boolean;
  listedDate: string;
  status?: string;
  source?: 'agent-feed';
  listingUrl?: string;
  listedBy?: ListedBy;
}

export interface Agent {
  id: string;
  slug: string;
  name: string;
  role: string;
  agency: string;
  licenseNumber: string;
  phone: string;
  email: string;
  avatar: string;
  bio: string;
  yearsExperience: number;
  activeListingsCount: number;
  dealsClosed: number;
  satisfactionRating: number;
  specializations: string[];
  languages: string[];
  officeLocation: string;
  salesVolume?: string;
  totalDeals?: number;
  rating?: number;
  reviewsCount?: number;
  isLuxuryExpert?: boolean;
  dealType?: 'Buy' | 'Sell' | 'Rent' | 'Both';
  city?: string;
  state?: string;
  neighborhoods?: string[];
  serviceAreas?: string[];
  verified?: boolean;
}

export interface FilterState {
  searchQuery: string;
  listingType: ListingType | 'all';
  category: PropertyCategory | 'all';
  city: string;
  minPrice: number;
  maxPrice: number;
  minBeds: number;
  minBaths: number;
  minSqft: number;
  sortBy: 'featured' | 'price-asc' | 'price-desc' | 'newest' | 'sqft-desc';
}
