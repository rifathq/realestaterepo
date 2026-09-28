import { Property } from '../types/property';

export const PROPERTIES: Property[] = [
  {
    id: 'prop-1',
    slug: 'the-monolith-glass-headquarters',
    title: 'The Monolith Glass Pavilion',
    tagline: 'Precision engineered glass facade with triple-height cantilevered atrium',
    price: 18500000,
    priceDisplay: '$18,500,000',
    listingType: 'buy',
    category: 'Offices',
    featured: true,
    editorialHighlight: 'Curated Architectural Marquee',
    location: {
      address: '420 Montgomery Financial Boulevard',
      neighborhood: 'Financial District',
      city: 'San Francisco',
      state: 'CA',
      zip: '94104',
      coordinates: { lat: 37.7925, lng: -122.4018 }
    },
    specs: {
      beds: 0,
      baths: 12,
      sqft: 28400,
      parking: 36,
      yearBuilt: 2023,
      floor: 14,
      lotSize: '0.85 Acres',
      pricePerSqft: 651,
      hoaMonthly: 3400
    },
    description: [
      'Commissioned by an international design practice, The Monolith stands as a masterwork of structural glass and carbon-neutral steel framing. Rising over the financial district, its faceted external envelope filters direct solar gain while welcoming boundless ambient daylight across four flexible working floors.',
      'A triple-height internal atrium connects executive lounges, private boardroom wings, and column-free open floors. The building features geothermal heat exchange, hospital-grade MERV-16 air filtration, and direct sub-grade secure elevator access from the private subterranean garage.'
    ],
    features: [
      'Triple-glazed low-emissivity glass curtain facade',
      'Column-free floor plates with 3.8m ceiling heights',
      'Private landscaped rooftop garden with city views',
      'Dedicated fiber-optic redundant infrastructure',
      'Subterranean automated 36-vehicle parking vault'
    ],
    amenities: [
      'Executive Dining Room',
      'Private Boardroom Suites',
      'Wellness Center & Showers',
      'Direct Elevator Access',
      'Bicycle Storage Hub',
      'EV Fast Charging Bays'
    ],
    architecturalHighlights: {
      architect: 'Kappe & Partners Architectural Studio',
      style: 'High-Tech Contemporary Structuralism',
      materials: ['Low-iron acoustic glass', 'Brushed anodized aluminum', 'Architectural cast concrete'],
      facing: 'North-East with panoramic bay vistas'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Certified & Title Inspected',
    agentId: 'agent-2',
    images: [
      'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80'
    ],
    floorPlanUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80',
    virtualTourAvailable: true,
    listedDate: '2026-08-14'
  },
  {
    id: 'prop-2',
    slug: 'solarium-cantilever-residence',
    title: 'Solarium Cantilever Villa',
    tagline: 'Brutalist concrete and warm cedar residence perched above the Pacific surf',
    price: 9400000,
    priceDisplay: '$9,400,000',
    listingType: 'buy',
    category: 'Villas',
    featured: true,
    editorialHighlight: 'Featured Coastal Residence',
    location: {
      address: '88 Cliffside Coast Road',
      neighborhood: 'Carmel Highlands',
      city: 'Carmel',
      state: 'CA',
      zip: '93923',
      coordinates: { lat: 36.5052, lng: -121.9388 }
    },
    specs: {
      beds: 4,
      baths: 5,
      sqft: 6850,
      parking: 3,
      yearBuilt: 2024,
      lotSize: '1.4 Acres',
      pricePerSqft: 1372,
      hoaMonthly: 450
    },
    description: [
      'Dramatically suspended over the granite bluffs of Carmel Highlands, the Solarium Villa orchestrates an uninterrupted dialogue between board-formed concrete and the Pacific ocean.',
      'Floor-to-ceiling motorized sliding glass walls recede completely into stone pockets, erasing the distinction between the minimalist interior salon and the heated infinity pool terrace.'
    ],
    features: [
      'Board-formed white concrete walls with marine sealant',
      'Seamless radiant terrazzo flooring throughout',
      '18-meter heated salt-water cantilevered infinity lap pool',
      'Custom Boffi kitchen with integrated Gaggenau 400 appliances',
      'Private subterranean wine cellar and tasting salon'
    ],
    amenities: [
      'Heated Infinity Pool',
      'Wine Cellar (1,200 bottles)',
      'Outdoor Kitchen & Fire Hearth',
      'Primary Suite Ocean Terrace',
      'Integrated Sonos Architectural Sound',
      'Dual Tesla Powerwall 3 Storage'
    ],
    architecturalHighlights: {
      architect: 'Studio Olson Kundig Associate Practice',
      style: 'Pacific Coastal Brutalism',
      materials: ['Board-formed concrete', 'Western Red Cedar', 'Flamed basalt stone'],
      facing: 'South-West Pacific oceanfront'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Verified Ownership & Engineering Surveyed',
    agentId: 'agent-1',
    images: [
      'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600566753376-12c8ab7fb75b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1600210492486-724fe5c67fb0?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: true,
    listedDate: '2026-08-28'
  },
  {
    id: 'prop-3',
    slug: 'skyline-duplex-penthouse',
    title: 'Skyline Duplex Penthouse 58',
    tagline: 'Crown residence with double-height salon overlooking Central Park',
    price: 38500,
    priceDisplay: '$38,500',
    period: 'month',
    listingType: 'rent',
    category: 'Penthouses',
    featured: true,
    editorialHighlight: 'Prime Metropolitan Rental',
    location: {
      address: '110 Central Park South, Tower 58',
      neighborhood: 'Midtown West',
      city: 'New York',
      state: 'NY',
      zip: '10019',
      coordinates: { lat: 40.7661, lng: -73.9786 }
    },
    specs: {
      beds: 3,
      baths: 4,
      sqft: 4950,
      parking: 2,
      yearBuilt: 2022,
      floor: 58,
      pricePerSqft: 8,
      hoaMonthly: 0
    },
    description: [
      'Occupying the 58th and 59th floors of one of Billionaires Row most celebrated boutique towers, this bespoke duplex offers an unbroken 360-degree panorama of Central Park, the Hudson River, and the Manhattan skyline.',
      'A sculptural bronze staircase floats within the double-height great room. The primary suite features dual book-matched Calacatta marble bathrooms and custom Molteni dressing suites.'
    ],
    features: [
      'Double-height 7.2-meter living room ceiling',
      'Private key-locked elevator vestibule',
      'Continuous 60-foot glass frontage facing Central Park',
      'Poliform kitchen with sculpted quartzite island',
      'White glove 24/7 concierge, doorman, and private valet'
    ],
    amenities: [
      '24/7 White Glove Concierge',
      'Private Tower Valet Parking',
      '75-Foot Indoor Saltwater Pool',
      'Private Residents Dining Club',
      'Spa and Sauna Suites',
      'High-Speed Private Lift'
    ],
    architecturalHighlights: {
      architect: 'Christian de Portzamparc Design',
      style: 'High Modernist Tower Penthouse',
      materials: ['French oak chevron floors', 'Calacatta Vagli marble', 'Bronze balustrades'],
      facing: 'Direct North onto Central Park'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Verified Lease & Direct Sponsor Offering',
    agentId: 'agent-2',
    images: [
      'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1560448204-e02f11c3d0e2?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1512917774080-9991f1c4c750?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: true,
    listedDate: '2026-09-02'
  },
  {
    id: 'prop-4',
    slug: 'the-meridian-creative-warehouse',
    title: 'Meridian Creative Depot',
    tagline: 'Restored brick and timber industrial loft with high-capacity loading bay',
    price: 5200000,
    priceDisplay: '$5,200,000',
    listingType: 'buy',
    category: 'Industrial',
    featured: false,
    location: {
      address: '1420 NW Lovejoy Industrial Corridor',
      neighborhood: 'Pearl District',
      city: 'Portland',
      state: 'OR',
      zip: '97209',
      coordinates: { lat: 45.5298, lng: -122.6865 }
    },
    specs: {
      beds: 0,
      baths: 6,
      sqft: 14800,
      parking: 14,
      yearBuilt: 1938,
      lotSize: '0.45 Acres',
      pricePerSqft: 351,
      hoaMonthly: 850
    },
    description: [
      'An authentic adaptive reuse milestone in the historic industrial precinct. Features original heavy Douglas fir timbers, sandblasted masonry walls, and updated seismic reinforcements.',
      'Zoned for flexible commercial, design atelier, media production, and boutique logistics distribution with two grade-level roll-up freight doors.'
    ],
    features: [
      'Original exposed Douglas fir post-and-beam construction',
      '6-meter clear ceiling heights with natural clerestory monitors',
      'Seismically retrofitted structural steel moment frames',
      '3-phase 800-amp high capacity electrical service',
      'Two oversized motorized loading docks'
    ],
    amenities: [
      'Drive-In Freight Bay',
      'Production Mezzanine',
      'Conference & Screening Room',
      'Secured Gated Yard',
      'Kitchenette & Cafe Area'
    ],
    architecturalHighlights: {
      architect: 'Historic Restoration by Fieldwork Architecture',
      style: 'Industrial Adaptive Timber & Brick',
      materials: ['Reclaimed Pacific fir', 'Original kiln-fired brick', 'Blackened structural steel'],
      facing: 'East / West dual orientation'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Certified Clear Environmental Phase 1',
    agentId: 'agent-3',
    images: [
      'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1504384308090-c894fdcc538d?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1524758631624-e2822e304c36?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: false,
    listedDate: '2026-07-20'
  },
  {
    id: 'prop-5',
    slug: 'bellevue-atrium-apartments',
    title: 'The Linear Terrace Flats',
    tagline: 'Minimalist Scandinavian apartments with private cedar loggias and garden courtyards',
    price: 4800,
    priceDisplay: '$4,800',
    period: 'month',
    listingType: 'rent',
    category: 'Apartments',
    featured: false,
    location: {
      address: '740 Bellevue Way NE',
      neighborhood: 'Downtown Park District',
      city: 'Seattle',
      state: 'WA',
      zip: '98004',
      coordinates: { lat: 47.6162, lng: -122.2014 }
    },
    specs: {
      beds: 2,
      baths: 2,
      sqft: 1420,
      parking: 1,
      yearBuilt: 2024,
      floor: 6,
      pricePerSqft: 3.38,
      hoaMonthly: 0
    },
    description: [
      'Engineered for acoustic silence and calm living, The Linear Terrace Flats present a rare residential offering adjoining Bellevue Downtown Park.',
      'Features sound-decoupled floor assemblies, custom Dinesen pale oak wide-plank floors, and private recessed cedar balconies overlooking the landscaped courtyard.'
    ],
    features: [
      'Triple-pane sound isolating windows with acoustic STC 48 rating',
      'Full-depth private recessed cedar loggia',
      'Integrated Bosch 800-series induction cooktop and oven',
      'Custom recessed architectural perimeter cove lighting'
    ],
    amenities: [
      'Quiet Work Atrium & Library',
      'Rooftop Wellness Terrace',
      'Concierge Parcel Lockers',
      'Underground Heated Parking',
      'Pet Grooming Salon'
    ],
    architecturalHighlights: {
      architect: 'Henning Larsen Nordic Studio',
      style: 'Warm Scandinavian Contemporary',
      materials: ['Dinesen pale Douglas fir', 'Honed quartzite', 'Ribbed acoustic acoustic felt'],
      facing: 'South-East morning light'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Verified Lease Terms',
    agentId: 'agent-3',
    images: [
      'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1502005229762-ee1b2b8ab98f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1493809842364-78817add7ffb?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: true,
    listedDate: '2026-08-01'
  },
  {
    id: 'prop-6',
    slug: 'austin-hill-country-development-parcel',
    title: 'Travis Crest Development Acreage',
    tagline: '42 elevated acres with uninterrupted lake panoramas and entitlement approvals',
    price: 12800000,
    priceDisplay: '$12,800,000',
    listingType: 'buy',
    category: 'Land',
    featured: false,
    location: {
      address: '18400 Lime Creek Road',
      neighborhood: 'Lake Travis Enclave',
      city: 'Austin',
      state: 'TX',
      zip: '78641',
      coordinates: { lat: 30.4578, lng: -97.9421 }
    },
    specs: {
      beds: 0,
      baths: 0,
      sqft: 0,
      parking: 0,
      yearBuilt: 2025,
      lotSize: '42.6 Acres',
      pricePerSqft: 7,
      hoaMonthly: 0
    },
    description: [
      'A singular private land holding overlooking the blue waters of Lake Travis. The parcel encompasses a dramatic limestone promontory surrounded by native heritage oaks.',
      'Approved for an ultra-private compound or an exclusive low-density residential architectural enclave with municipal utility district agreements in place.'
    ],
    features: [
      'Elevated 360-degree views reaching across Lake Travis',
      'Over 800 feet of natural limestone ridge frontage',
      'Vested development entitlements with flexible site plan',
      'Existing underground 3-phase power and water connections'
    ],
    amenities: [
      'Helipad Clearance Zone',
      'Gated Private Access Road',
      'Water Well Rights Secured',
      'Topographic Survey Complete'
    ],
    architecturalHighlights: {
      architect: 'Civil & Master Planning by Lake|Flato Planners',
      style: 'Native Hill Country Topographic Landscape',
      materials: ['Native Texas limestone', 'Cedar elm canopy', 'Natural springs'],
      facing: 'Unrestricted West sunset ridge'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Certified Title & Civil Entitlements',
    agentId: 'agent-4',
    images: [
      'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1506744038136-46273834b3fb?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: false,
    listedDate: '2026-06-15'
  },
  {
    id: 'prop-7',
    slug: 'beverly-flagship-retail-pavilion',
    title: 'Rodeo Modern Flagship Pavilions',
    tagline: 'High-visibility dual-level corner retail presence with travertine portico',
    price: 24000,
    priceDisplay: '$24,000',
    period: 'month',
    listingType: 'rent',
    category: 'Retail',
    featured: false,
    location: {
      address: '380 North Beverly Drive',
      neighborhood: 'Golden Triangle',
      city: 'Los Angeles',
      state: 'CA',
      zip: '90210',
      coordinates: { lat: 34.0689, lng: -118.4004 }
    },
    specs: {
      beds: 0,
      baths: 4,
      sqft: 3600,
      parking: 6,
      yearBuilt: 2021,
      floor: 1,
      pricePerSqft: 6.67,
      hoaMonthly: 1200
    },
    description: [
      'A definitive retail presence located on one of the most prestigious commercial thoroughfares in the world. Clad in vein-matched Roman travertine with 5.5-meter frameless glass display vitrines.',
      'Comprises a luminous ground-floor gallery floor, a private mezzanine VIP salon, and a dedicated rear courier/delivery vestibule.'
    ],
    features: [
      '5.5-meter frameless structural glass display frontage',
      'Honed Roman travertine facade cladding',
      'Private VIP client lounge mezzanine with espresso bar',
      'Dedicated rear delivery bay and commercial inventory vault'
    ],
    amenities: [
      'Rear Loading & Courier Access',
      'Integrated Security System & Vault',
      'Independent High-Efficiency HVAC',
      'Valet Customer Parking Access'
    ],
    architecturalHighlights: {
      architect: 'David Chipperfield Retail Practice',
      style: 'Monumental Minimalist Travertine',
      materials: ['Roman silver travertine', 'Extra-clear optiwhite glass', 'Patinated bronze hardware'],
      facing: 'Corner North-West prime foot-traffic angle'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Certified Commercial Lease',
    agentId: 'agent-1',
    images: [
      'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1567449303078-57ad995bd301?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1441986300917-64674bd600d8?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: true,
    listedDate: '2026-08-10'
  },
  {
    id: 'prop-8',
    slug: 'cambridge-laboratory-life-sciences-campus',
    title: 'Kendall Innovation Biocenter',
    tagline: 'Certified BSL-2 laboratory and research facility with vivarium infrastructure',
    price: 32000000,
    priceDisplay: '$32,000,000',
    listingType: 'buy',
    category: 'Offices',
    featured: false,
    location: {
      address: '250 Main Street Innovation Hub',
      neighborhood: 'Kendall Square',
      city: 'Cambridge',
      state: 'MA',
      zip: '02142',
      coordinates: { lat: 42.3624, lng: -71.0864 }
    },
    specs: {
      beds: 0,
      baths: 16,
      sqft: 46000,
      parking: 50,
      yearBuilt: 2023,
      floor: 7,
      pricePerSqft: 695,
      hoaMonthly: 6200
    },
    description: [
      'Positioned at the epicenter of global biotechnology in Kendall Square. This state-of-the-art facility incorporates 60/40 lab-to-office ratios with dedicated acid neutralization, 100% outside air systems, and floor-to-ceiling slab heights of 4.4 meters.',
      'Designed to accommodate rapid scale-up for computational biology, precision genomics, or clinical therapeutics.'
    ],
    features: [
      'Fully permitted BSL-2 laboratory infrastructure',
      '100% single-pass outside air with dedicated exhaust shafts',
      'Emergency diesel backup generators (2.5 MW total capacity)',
      'Vibration criteria conforming to VC-A standards'
    ],
    amenities: [
      'Central Chemical Storage & Waste Neutralization',
      'Sterile Autoclave Facilities',
      'Secure Freight Elevator Bank',
      'Auditorium & Symposium Hall',
      'Electric Fleet Charging Station'
    ],
    architecturalHighlights: {
      architect: 'Payette Life Science Architecture',
      style: 'Contemporary Research High-Tech',
      materials: ['Curtain wall with ceramic frit', 'Zinc composite panels', 'Polished concrete'],
      facing: 'Kendall Square direct plaza connection'
    },
    verified: true,
    verifiedBadgeText: 'ESTRA Certified Lab Specifications & Zoning',
    agentId: 'agent-2',
    images: [
      'https://images.unsplash.com/photo-1519999482648-25049ddd37b1?auto=format&fit=crop&w=1600&q=80',
      'https://images.unsplash.com/photo-1517502884422-41eaead166d4?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1497366754035-f200968a6e72?auto=format&fit=crop&w=1200&q=80'
    ],
    virtualTourAvailable: true,
    listedDate: '2026-07-05'
  }
];

export const PROPERTY_CATEGORIES = [
  {
    name: 'Offices',
    count: '4,200+ properties',
    description: 'Corporate headquarters, flexible ateliers, and collaborative campuses',
    image: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Villas',
    count: '1,800+ residences',
    description: 'Architectural estates, coastal pavilions, and private sanctuaries',
    image: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Apartments',
    count: '8,500+ flats',
    description: 'Refined urban apartments and design-forward residential lofts',
    image: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Penthouses',
    count: '620+ crown units',
    description: 'Skyline duplexes and panoramic tower terraces',
    image: 'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Industrial',
    count: '1,450+ facilities',
    description: 'Logistics hubs, adaptive warehouses, and production depots',
    image: 'https://images.unsplash.com/photo-1586528116311-ad8dd3c8310d?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Land',
    count: '2,100+ parcels',
    description: 'Master-planned acreage, commercial plots, and hillside parcels',
    image: 'https://images.unsplash.com/photo-1500382017468-9049fed747ef?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Retail',
    count: '980+ storefronts',
    description: 'Flagship boutiques, culinary spaces, and prominent street retail',
    image: 'https://images.unsplash.com/photo-1555396273-367ea4eb4db5?auto=format&fit=crop&w=800&q=80'
  }
];

export const CITIES = [
  {
    name: 'San Francisco',
    region: 'California, US',
    count: '1,420 listings',
    image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'New York',
    region: 'New York, US',
    count: '3,840 listings',
    image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Seattle',
    region: 'Washington, US',
    count: '980 listings',
    image: 'https://images.unsplash.com/photo-1502175353174-a7a70e73b362?auto=format&fit=crop&w=800&q=80'
  },
  {
    name: 'Austin',
    region: 'Texas, US',
    count: '1,120 listings',
    image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=800&q=80'
  }
];
