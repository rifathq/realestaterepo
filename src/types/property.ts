export type ListingType = 'buy' | 'rent';

export type PropertyCategory = 
  | 'Offices' 
  | 'Villas' 
  | 'Apartments' 
  | 'Penthouses' 
  | 'Retail' 
  | 'Industrial' 
  | 'Land';

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
