import express, { Request, Response, NextFunction } from 'express';
import { createServer as createViteServer } from 'vite';
import path from 'path';
import fs from 'fs';
import crypto from 'crypto';
import { registerComplianceRoutes } from './compliance';
import { leadGuard } from './lib/leadGuard';
import { registerListingFeed } from './lib/listingFeed';
import { AGENT } from './src/agent-site/profile';

const PORT = Number(process.env.PORT) || 3000;
const DATA_DIR = path.resolve(process.cwd(), 'data');
const DB_FILE = path.resolve(DATA_DIR, 'db.json');

// Ensure data directory exists
if (!fs.existsSync(DATA_DIR)) {
  fs.mkdirSync(DATA_DIR, { recursive: true });
}

// Password hashing & verification
function hashPassword(password: string): string {
  const salt = crypto.randomBytes(16).toString('hex');
  const hash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
  return `${hash}:${salt}`;
}

function verifyPassword(password: string, storedHash: string): boolean {
  try {
    const [hash, salt] = storedHash.split(':');
    if (!hash || !salt) return false;
    const testHash = crypto.pbkdf2Sync(password, salt, 100000, 64, 'sha512').toString('hex');
    return crypto.timingSafeEqual(Buffer.from(hash, 'hex'), Buffer.from(testHash, 'hex'));
  } catch {
    return false;
  }
}

// In-Memory Sessions
interface SessionUser {
  id: string;
  email: string;
  name: string;
  role: 'super_admin' | 'agent' | 'client';
  agentId?: string;
  avatar?: string;
}

const activeSessions = new Map<string, { user: SessionUser; expiresAt: number }>();

function createSession(user: SessionUser): string {
  const token = crypto.randomBytes(32).toString('hex');
  activeSessions.set(token, {
    user,
    expiresAt: Date.now() + 7 * 24 * 60 * 60 * 1000, // 7 days
  });
  return token;
}

// Initial Database Seeding
function getInitialData() {
  return {
    users: [
      {
        id: 'user-admin',
        email: 'admin@demo.digenticrealty.com',
        name: 'Elena Rostova (Executive Director)',
        passwordHash: hashPassword('Admin@12345'),
        role: 'super_admin',
        title: 'Managing Principal & System Director',
        avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=400&q=80',
        status: 'active',
        createdAt: '2026-01-15T08:00:00.000Z',
      },
      {
        id: 'user-agent-demo',
        email: 'agent@demo.digenticrealty.com',
        name: 'Marcus Vance',
        passwordHash: hashPassword('Agent@12345'),
        role: 'agent',
        agentId: 'agent-demo',
        title: 'Senior Portfolio Advisor',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
        status: 'active',
        createdAt: '2026-02-01T10:00:00.000Z',
      },
      {
        id: 'user-agent-2',
        email: 'agent2@demo.digenticrealty.com',
        name: 'Rob Wittman',
        passwordHash: hashPassword('Agent2@12345'),
        role: 'agent',
        agentId: 'agent-rob-wittman',
        title: 'Principal Agent (Arlington)',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        status: 'active',
        createdAt: '2026-02-10T10:00:00.000Z',
      },
      {
        id: 'user-client-1',
        email: 'a.wright@firm-partners.com',
        name: 'Alexander Wright',
        passwordHash: hashPassword('Client@12345'),
        role: 'client',
        title: 'Institutional Investor',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=400&q=80',
        status: 'active',
        createdAt: '2026-03-12T14:30:00.000Z',
      },
    ],
    agents: [
      {
        id: 'agent-demo',
        slug: 'marcus-vance',
        name: 'Marcus Vance',
        role: 'Senior Portfolio Advisor',
        agency: 'Digentic Private Client Advisory',
        licenseNumber: 'CA-DRE #02198421',
        phone: '+1 (415) 890-5542',
        email: 'agent@demo.digenticrealty.com',
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
        bio: 'Specializing in commercial headquarters acquisitions and landmark penthouse estates across the West Coast corridor. Marcus brings 12+ years of institutional advisory experience to Digentic Realty.',
        yearsExperience: 12,
        activeListingsCount: 5,
        dealsClosed: 324,
        salesVolume: '$380.5M',
        rating: 4.9,
        city: 'San Francisco',
        state: 'CA',
        specializations: ['Commercial Headquarters', 'Prime Penthouses', 'Capital Markets'],
      },
      {
        id: 'agent-rob-wittman',
        slug: 'rob-wittman',
        name: 'Rob Wittman',
        role: 'Principal Agent',
        agency: 'Digentic Arlington Luxury Group',
        licenseNumber: 'VA-DRE #02258931',
        phone: '+1 (703) 891-4420',
        email: 'rob.wittman@digentic-realty.com',
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
        bio: 'Recognized as one of Northern Virginia’s top-producing luxury advisors. Rob specializes in architect-designed estates, historic restorations, and waterfront properties.',
        yearsExperience: 14,
        activeListingsCount: 9,
        dealsClosed: 513,
        salesVolume: '$320.1M',
        rating: 4.8,
        city: 'Arlington',
        state: 'VA',
        specializations: ['Luxury Residential', 'Historic Properties', 'New Development'],
      },
      {
        id: 'agent-anthony-lam',
        slug: 'anthony-lam',
        name: 'Anthony Lam',
        role: 'Principal Agent',
        agency: 'Digentic Capital Partners',
        licenseNumber: 'VA-DRE #02294108',
        phone: '+1 (703) 745-9210',
        email: 'anthony.lam@digentic-realty.com',
        avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
        bio: 'With over half a billion dollars in career transaction volume, Anthony represents discerning private buyers and tech executives.',
        yearsExperience: 16,
        activeListingsCount: 12,
        dealsClosed: 700,
        salesVolume: '$503.0M',
        rating: 4.9,
        city: 'Arlington',
        state: 'VA',
        specializations: ['Waterfront Estates', 'Modern Mansions', 'Commercial Relocation'],
      },
    ],
    properties: [
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
          coordinates: { lat: 37.7925, lng: -122.4018 },
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
          hoaMonthly: 3400,
        },
        description: [
          'Commissioned by an international design practice, The Monolith stands as a masterwork of structural glass and carbon-neutral steel framing.',
          'A triple-height internal atrium connects executive lounges, private boardroom wings, and column-free open floors.',
        ],
        features: [
          'Triple-glazed low-emissivity glass curtain facade',
          'Column-free floor plates with 3.8m ceiling heights',
          'Private landscaped rooftop garden with city views',
          'Dedicated fiber-optic redundant infrastructure',
        ],
        amenities: ['Executive Dining Room', 'Private Boardroom Suites', 'Wellness Center & Showers'],
        architecturalHighlights: {
          architect: 'Kappe & Partners Architectural Studio',
          style: 'High-Tech Contemporary Structuralism',
          materials: ['Low-iron acoustic glass', 'Brushed anodized aluminum'],
          facing: 'North-East with panoramic bay vistas',
        },
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
        agentId: 'agent-demo',
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80',
          'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
        ],
        virtualTourAvailable: true,
        listedDate: '2026-08-14',
      },
      {
        id: 'prop-2',
        slug: 'solarium-cantilever-residence',
        title: 'Solarium Cantilever Villa',
        tagline: 'Suspended post-tensioned concrete residence with horizon saltwater pool',
        price: 9200000,
        priceDisplay: '$9,200,000',
        listingType: 'buy',
        category: 'Residential',
        featured: true,
        editorialHighlight: 'Structural Landmark 2026',
        location: {
          address: '1840 Bel Air Crest Road',
          neighborhood: 'Bel Air Foothills',
          city: 'Los Angeles',
          state: 'CA',
          zip: '90077',
          coordinates: { lat: 34.0837, lng: -118.4485 },
        },
        specs: {
          beds: 5,
          baths: 7,
          sqft: 8650,
          parking: 4,
          yearBuilt: 2024,
          floor: 2,
          lotSize: '1.2 Acres',
          pricePerSqft: 1063,
          hoaMonthly: 620,
        },
        description: [
          'Engineered into a dramatic ridge line, this cantilevered villa floats effortlessly above the canyon.',
          'Custom millwork, Belgian minimalist glazing, and a 60-foot vanishing edge infinity pool.',
        ],
        features: ['Cantilevered 60-foot infinity saltwater pool', 'Crestron smart architectural lighting'],
        amenities: ['Private Wine Cellar', 'Canyon-view Screening Room', 'Outdoor Kitchen'],
        architecturalHighlights: {
          architect: 'Olson Kundig Associates',
          style: 'Organic Brutalism & Warm Minimalism',
          materials: ['Board-formed architectural concrete', 'Reclaimed cedar timber'],
          facing: 'South-facing with ocean horizon glimpse',
        },
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
        agentId: 'agent-demo',
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=1200&q=80',
        ],
        virtualTourAvailable: true,
        listedDate: '2026-07-28',
      },
      {
        id: 'prop-3',
        slug: 'tribeca-cast-iron-penthouse',
        title: 'The Tribeca Cast-Iron Sky Penthouse',
        tagline: 'Duplex loft with private wraparound zinc terrace and custom bronze hearth',
        price: 14750000,
        priceDisplay: '$14,750,000',
        listingType: 'buy',
        category: 'Penthouses',
        featured: true,
        editorialHighlight: 'Manhattan Heritage Landmark',
        location: {
          address: '74 Franklin Street, Penthouse A',
          neighborhood: 'Tribeca Historic District',
          city: 'New York',
          state: 'NY',
          zip: '10013',
          coordinates: { lat: 40.7183, lng: -74.0048 },
        },
        specs: {
          beds: 4,
          baths: 5,
          sqft: 6100,
          parking: 2,
          yearBuilt: 1894,
          floor: 6,
          pricePerSqft: 2418,
          hoaMonthly: 4120,
        },
        description: ['A crowning achievement atop one of Tribeca’s most photographed 19th-century cast-iron buildings.'],
        features: ['Original 1894 fluted Corinthian cast-iron columns', 'Direct keyed private dual elevators'],
        amenities: ['Private Keyed Elevator', 'Wraparound Zinc Terrace', '24/7 Concierge'],
        architecturalHighlights: {
          architect: 'Annabelle Selldorf Architects',
          style: 'Historic Restoration & Contemporary Loft',
          materials: ['Restored structural cast iron', 'Wide-plank white oak'],
          facing: 'Corner North/West exposure',
        },
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
        agentId: 'agent-anthony-lam',
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1502672260266-1c1ef2d93688?auto=format&fit=crop&w=1200&q=80',
        ],
        virtualTourAvailable: true,
        listedDate: '2026-09-02',
      },
      {
        id: 'prop-4',
        slug: 'potomac-waterfront-pavilion',
        title: 'Potomac Riverfront Sanctuary',
        tagline: 'Modern limestone estate directly on the Potomac Palisades in Arlington',
        price: 7850000,
        priceDisplay: '$7,850,000',
        listingType: 'buy',
        category: 'Waterfront',
        featured: true,
        editorialHighlight: 'Virginia Palisades Estate',
        location: {
          address: '3810 North River Road',
          neighborhood: 'Rivercrest Palisades',
          city: 'Arlington',
          state: 'VA',
          zip: '22207',
          coordinates: { lat: 38.9189, lng: -77.1264 },
        },
        specs: {
          beds: 6,
          baths: 8,
          sqft: 9400,
          parking: 4,
          yearBuilt: 2022,
          lotSize: '1.8 Acres',
          pricePerSqft: 835,
          hoaMonthly: 380,
        },
        description: ['Set high upon the granite palisades of Arlington overlooking the historic Potomac.'],
        features: ['Direct private deepwater dock riparian rights', 'Three-story glass curtain wall'],
        amenities: ['Private Boat Slip', 'Wine Tasting Room', 'Infinity Spa Overlook'],
        architecturalHighlights: {
          architect: 'Bohlin Cywinski Jackson',
          style: 'Palisades Modernist Architecture',
          materials: ['Indiana cut limestone', 'Standing seam zinc'],
          facing: 'Eastern sunrise over Georgetown spires',
        },
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
        agentId: 'agent-rob-wittman',
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1600607687939-ce8a6c25118c?auto=format&fit=crop&w=1200&q=80',
        ],
        virtualTourAvailable: true,
        listedDate: '2026-08-20',
      },
      {
        id: 'prop-5',
        slug: 'austin-lady-bird-creative-campus',
        title: 'Lady Bird Lake Tech Pavilion',
        tagline: 'Mass-timber modern commercial campus on the lakefront parkway',
        price: 65000,
        priceDisplay: '$65,000 / mo',
        listingType: 'rent',
        category: 'Offices',
        featured: true,
        editorialHighlight: 'Mass Timber Innovation',
        location: {
          address: '1100 Cesar Chavez Parkway West',
          neighborhood: 'Downtown Lakefront',
          city: 'Austin',
          state: 'TX',
          zip: '78701',
          coordinates: { lat: 30.2642, lng: -97.7471 },
        },
        specs: {
          beds: 0,
          baths: 8,
          sqft: 14200,
          parking: 28,
          yearBuilt: 2025,
          floor: 3,
          pricePerSqft: 55,
        },
        description: ['A forward-thinking commercial headquarters crafted entirely of Austrian spruce cross-laminated timber.'],
        features: ['PEFC-certified Austrian spruce mass timber structure', 'Private dock access on Lady Bird Lake'],
        amenities: ['Kayaking Launch Dock', 'On-site Artisan Cafe', 'Boardroom Suite'],
        architecturalHighlights: {
          architect: 'Michael Green Architecture',
          style: 'Contemporary Biophilic Timber Construction',
          materials: ['Cross-laminated timber', 'Corten weathered steel accents'],
          facing: 'South with uninterrupted lake views',
        },
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
        agentId: 'agent-demo',
        status: 'active',
        images: [
          'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
          'https://images.unsplash.com/photo-1497215728101-856f4ea42174?auto=format&fit=crop&w=1200&q=80',
        ],
        virtualTourAvailable: true,
        listedDate: '2026-09-08',
      },
    ],
    appointments: [
      {
        id: 'apt-101',
        propertyId: 'prop-1',
        propertyTitle: 'The Monolith Glass Pavilion',
        clientName: 'Alexander Wright',
        clientEmail: 'a.wright@firm-partners.com',
        clientPhone: '+1 (415) 555-0199',
        date: '2026-10-04',
        time: '14:00',
        type: 'Private Walkthrough',
        notes: 'Client requests Phase 1 environmental summary and structural engineering drawings before arrival.',
        status: 'confirmed',
        agentId: 'agent-demo',
        agentName: 'Marcus Vance',
        createdAt: '2026-09-28T09:15:00.000Z',
      },
      {
        id: 'apt-102',
        propertyId: 'prop-2',
        propertyTitle: 'Solarium Cantilever Villa',
        clientName: 'Victoria Chen',
        clientEmail: 'v.chen@sovereign-holdings.sg',
        clientPhone: '+1 (310) 555-8842',
        date: '2026-10-06',
        time: '11:00',
        type: 'Executive Inspection',
        notes: 'Private architectural tour with family principal. Security detail accompanying.',
        status: 'pending',
        agentId: 'agent-demo',
        agentName: 'Marcus Vance',
        createdAt: '2026-09-29T10:00:00.000Z',
      },
      {
        id: 'apt-103',
        propertyId: 'prop-4',
        propertyTitle: 'Potomac Riverfront Sanctuary',
        clientName: 'Julian Sterling',
        clientEmail: 'j.sterling@sterling-cap.com',
        clientPhone: '+1 (703) 555-3211',
        date: '2026-10-08',
        time: '15:30',
        type: 'Title & Survey Review',
        notes: 'Reviewing Potomac riverfront riparian water rights and dock expansion permits.',
        status: 'confirmed',
        agentId: 'agent-rob-wittman',
        agentName: 'Rob Wittman',
        createdAt: '2026-09-27T16:20:00.000Z',
      },
    ],
    leads: [
      {
        id: 'lead-201',
        propertyId: 'prop-1',
        propertyTitle: 'The Monolith Glass Pavilion',
        clientName: 'Global AI Ventures Advisory',
        clientEmail: 'realestate@globalai.tech',
        clientPhone: '+1 (415) 322-9011',
        inquiryType: 'Corporate Purchase',
        budget: '$18M - $22M',
        message: 'Looking to acquire a stand-alone corporate headquarters for our 120-person executive staff in downtown SF.',
        status: 'touring',
        agentId: 'agent-demo',
        agentName: 'Marcus Vance',
        createdAt: '2026-09-25T11:45:00.000Z',
      },
      {
        id: 'lead-202',
        propertyId: 'prop-2',
        propertyTitle: 'Solarium Cantilever Villa',
        clientName: 'David & Clara Thorne',
        clientEmail: 'thorne.family@crestview.org',
        clientPhone: '+1 (310) 902-1844',
        inquiryType: 'Residential Acquisition',
        budget: '$9.5M Cash',
        message: 'Interested in making an un-contingent offer on the Bel Air villa. Requesting preliminary title audit.',
        status: 'contacted',
        agentId: 'agent-demo',
        agentName: 'Marcus Vance',
        createdAt: '2026-09-28T14:10:00.000Z',
      },
      {
        id: 'lead-203',
        propertyId: 'prop-3',
        propertyTitle: 'The Tribeca Cast-Iron Sky Penthouse',
        clientName: 'Monroe Private Wealth LLC',
        clientEmail: 'advisory@monroewealth.com',
        clientPhone: '+1 (212) 488-9900',
        inquiryType: 'Client Representation',
        budget: '$15M',
        message: 'Representing an international sports figure relocating to Manhattan in Q4.',
        status: 'new',
        agentId: 'agent-anthony-lam',
        agentName: 'Anthony Lam',
        createdAt: '2026-09-29T08:30:00.000Z',
      },
      {
        id: 'lead-204',
        propertyId: 'prop-5',
        propertyTitle: 'Lady Bird Lake Tech Pavilion',
        clientName: 'SaaS Austin Scale',
        clientEmail: 'facilities@scaleaustin.io',
        clientPhone: '+1 (512) 809-4411',
        inquiryType: 'Commercial Lease',
        budget: '$70,000 / mo',
        message: 'Interested in a 5-year lease on the timber creative campus starting November 2026.',
        status: 'contacted',
        agentId: 'agent-demo',
        agentName: 'Marcus Vance',
        createdAt: '2026-09-26T17:15:00.000Z',
      },
      {
        id: 'lead-205',
        propertyId: 'prop-4',
        propertyTitle: 'Potomac Riverfront Sanctuary',
        clientName: 'Katherine Bradford',
        clientEmail: 'k.bradford@capitol-heritage.com',
        clientPhone: '+1 (703) 555-9082',
        inquiryType: 'Private Acquisition',
        budget: '$8.0M',
        message: 'Interested in scheduling a private river dock inspection and surveying the riparian parcel lines.',
        status: 'new',
        agentId: 'agent-rob-wittman',
        agentName: 'Rob Wittman',
        createdAt: '2026-09-29T09:45:00.000Z',
      },
    ],
    reviews: [
      {
        id: 'rev-1',
        propertyId: 'prop-1',
        propertyTitle: 'The Monolith Glass Pavilion',
        authorName: 'Harrison Reed (CFO, Apex Robotics)',
        authorTitle: 'Corporate Client',
        rating: 5,
        comment: 'Digentic handled our downtown campus transaction with military precision. Structural and MEP verification saved us weeks of due diligence.',
        date: '2026-08-30',
        status: 'published',
        agentId: 'agent-demo',
      },
      {
        id: 'rev-2',
        propertyId: 'prop-2',
        propertyTitle: 'Solarium Cantilever Villa',
        authorName: 'Dr. Evelyn Morales',
        authorTitle: 'Private Estate Owner',
        rating: 5,
        comment: 'The architectural curation at Digentic is second to none. Marcus Vance understood exactly what we wanted in an organic concrete sanctuary.',
        date: '2026-09-12',
        status: 'published',
        agentId: 'agent-demo',
      },
      {
        id: 'rev-3',
        propertyId: 'prop-4',
        propertyTitle: 'Potomac Riverfront Sanctuary',
        authorName: 'Senator Thomas Vance (Ret.)',
        authorTitle: 'Estate Buyer',
        rating: 5,
        comment: 'Rob Wittman and the Digentic team navigated the Potomac riparian rights flawlessly. The highest level of discreet institutional service.',
        date: '2026-09-18',
        status: 'published',
        agentId: 'agent-rob-wittman',
      },
    ],
    categories: [
      { id: 'cat-1', name: 'Offices & Commercial HQs', slug: 'offices', propertyCount: 14, description: 'LEED-certified and institutional headquarters campuses' },
      { id: 'cat-2', name: 'Architectural Residences', slug: 'residential', propertyCount: 28, description: 'Custom architect-designed modern villas and luxury residences' },
      { id: 'cat-3', name: 'Landmark Penthouses', slug: 'penthouses', propertyCount: 9, description: 'Skyline duplexes and full-floor crown residences' },
      { id: 'cat-4', name: 'Waterfront Estates', slug: 'waterfront', propertyCount: 12, description: 'Riparian rights, private docks, and ocean/riverfront parcels' },
      { id: 'cat-5', name: 'Development Parcels', slug: 'development', propertyCount: 6, description: 'Zoned urban plots with municipal entitlements' },
    ],
    locations: [
      { id: 'loc-1', city: 'San Francisco', state: 'CA', region: 'West Coast', activeListings: 18, image: 'https://images.unsplash.com/photo-1501594907352-04cda38ebc29?auto=format&fit=crop&w=600&q=80' },
      { id: 'loc-2', city: 'New York', state: 'NY', region: 'Tri-State', activeListings: 32, image: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?auto=format&fit=crop&w=600&q=80' },
      { id: 'loc-3', city: 'Arlington', state: 'VA', region: 'Capital Corridor', activeListings: 14, image: 'https://images.unsplash.com/photo-1557804506-669a67965ba0?auto=format&fit=crop&w=600&q=80' },
      { id: 'loc-4', city: 'Austin', state: 'TX', region: 'Southwest Hub', activeListings: 11, image: 'https://images.unsplash.com/photo-1531218150217-54595bc2b934?auto=format&fit=crop&w=600&q=80' },
      { id: 'loc-5', city: 'Chicago', state: 'IL', region: 'Midwest Metro', activeListings: 16, image: 'https://images.unsplash.com/photo-1494522855154-9297ac14b55f?auto=format&fit=crop&w=600&q=80' },
    ],
    settings: {
      brokerageName: 'Digentic Realty Institutional Advisory',
      licenseId: 'US-FINRA/DRE-98002',
      defaultCurrency: 'USD ($)',
      standardCommissionBuy: 2.25,
      standardCommissionRent: 8.0,
      notificationEmail: 'advisory@digenticrealty.com',
      systemStatus: 'Operational',
      maintenanceMode: false,
      requireMfaForAdmins: true,
      dataRetentionDays: 365,
    },
    content: {
      heroTitle: 'Real Estate for Business & Living',
      heroSubtitle: 'Rent, purchase, and manage verified commercial headquarters, modern residences, and urban development parcels with institutional precision.',
      heroKicker: 'Q3/2026 Index',
      charterText: 'Every asset listed on Digentic Realty undergoes a four-stage audit: municipal title deed cross-referencing, architectural square footage measurement, Phase 1 environmental review, and mechanical/electrical compliance verification.',
      contactDisclaimer: 'Digentic Realty advises private clients and luxury estates nationwide. All client inquiries are held under strict non-disclosure compliance.',
    },
    activity: [
      {
        id: 'act-1',
        userId: 'user-admin',
        userName: 'Elena Rostova',
        userRole: 'Super Admin',
        action: 'System Initialized',
        entity: 'Database Engine',
        entityId: 'db-core',
        timestamp: new Date().toISOString(),
        ip: '127.0.0.1',
      },
      {
        id: 'act-2',
        userId: 'user-admin',
        userName: 'Elena Rostova',
        userRole: 'Super Admin',
        action: 'Verified Title Audit Completed',
        entity: 'Property',
        entityId: 'prop-1',
        timestamp: new Date(Date.now() - 3600000).toISOString(),
        ip: '127.0.0.1',
      },
      {
        id: 'act-3',
        userId: 'user-agent-demo',
        userName: 'Marcus Vance',
        userRole: 'Agent',
        action: 'Tour Confirmed with Client',
        entity: 'Appointment',
        entityId: 'apt-101',
        timestamp: new Date(Date.now() - 7200000).toISOString(),
        ip: '127.0.0.1',
      },
    ],
  };
}

// Database helper functions
let dbCache: any = null;

function getDb() {
  if (dbCache) return dbCache;
  if (!fs.existsSync(DB_FILE)) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    dbCache = initial;
    return dbCache;
  }
  try {
    const content = fs.readFileSync(DB_FILE, 'utf-8');
    dbCache = JSON.parse(content);
    let modified = false;
    const initial = getInitialData();
    if (!dbCache.content) {
      dbCache.content = initial.content;
      modified = true;
    }
    if (!dbCache.users.some((u: any) => u.email === 'agent2@demo.digenticrealty.com')) {
      const agent2 = initial.users.find((u: any) => u.email === 'agent2@demo.digenticrealty.com');
      if (agent2) dbCache.users.push(agent2);
      modified = true;
    }
    if (!dbCache.leads.some((l: any) => l.id === 'lead-205')) {
      const lead205 = initial.leads.find((l: any) => l.id === 'lead-205');
      if (lead205) dbCache.leads.push(lead205);
      modified = true;
    }
    if (modified) {
      fs.writeFileSync(DB_FILE, JSON.stringify(dbCache, null, 2), 'utf-8');
    }
    return dbCache;
  } catch (err) {
    const initial = getInitialData();
    fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2), 'utf-8');
    dbCache = initial;
    return dbCache;
  }
}

function saveDb(data: any) {
  dbCache = data;
  fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
}

function logActivity(user: SessionUser, action: string, entity: string, entityId: string) {
  const db = getDb();
  const newLog = {
    id: `act-${Date.now()}-${Math.random().toString(36).substr(2, 4)}`,
    userId: user.id,
    userName: user.name,
    userRole: user.role === 'super_admin' ? 'Super Admin' : user.role === 'agent' ? 'Agent' : 'Client',
    action,
    entity,
    entityId,
    timestamp: new Date().toISOString(),
    ip: '127.0.0.1',
  };
  db.activity.unshift(newLog);
  if (db.activity.length > 200) db.activity = db.activity.slice(0, 200);
  saveDb(db);
}

// Authorization Middlewares
// The session token travels in X-Auth-Token, so the Authorization header stays free for a
// proxy's basic auth (UAT sits behind one). Bearer is still accepted.
function readToken(req: Request): string | null {
  const header = req.headers['x-auth-token'];
  if (typeof header === 'string' && header) return header;
  const authHeader = req.headers.authorization;
  return authHeader && authHeader.startsWith('Bearer ') ? authHeader.split(' ')[1] : null;
}

function authMiddleware(req: Request & { user?: SessionUser }, res: Response, next: NextFunction) {
  const token = readToken(req);
  if (!token) {
    return res.status(401).json({ error: 'Unauthorized: Missing or invalid authorization token.' });
  }
  const session = activeSessions.get(token);
  if (!session || session.expiresAt < Date.now()) {
    activeSessions.delete(token);
    return res.status(401).json({ error: 'Session expired or invalid. Please sign in again.' });
  }
  req.user = session.user;
  next();
}

function requireSuperAdmin(req: Request & { user?: SessionUser }, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'super_admin') {
      return res.status(403).json({ error: 'Forbidden: Super Admin privileges required.' });
    }
    next();
  });
}

function requireAgentOrAdmin(req: Request & { user?: SessionUser }, res: Response, next: NextFunction) {
  authMiddleware(req, res, () => {
    if (req.user?.role !== 'super_admin' && req.user?.role !== 'agent') {
      return res.status(403).json({ error: 'Forbidden: Agent or Super Admin privileges required.' });
    }
    next();
  });
}

// The seeded demo accounts have well-known passwords. When ADMIN_PASSWORD is set (UAT and
// beyond), the super admin gets that password (and ADMIN_EMAIL, if given) and every other
// account gets a random one, so the demo logins stop working.
function lockDemoLogins() {
  const password = process.env.ADMIN_PASSWORD;
  if (!password) return;
  const db = getDb();
  for (const user of db.users || []) {
    if (user.role === 'super_admin') {
      user.passwordHash = hashPassword(password);
      if (process.env.ADMIN_EMAIL) user.email = process.env.ADMIN_EMAIL;
    } else {
      user.passwordHash = hashPassword(crypto.randomBytes(24).toString('hex'));
    }
  }
  saveDb(db);
  console.log('[auth] demo logins locked');
}

async function startServer() {
  lockDemoLogins();
  const app = express();
  app.use(express.json());

  // -------------------------------------------------------------
  // AUTHENTICATION ROUTES
  // -------------------------------------------------------------
  app.post('/api/auth/login', (req, res) => {
    const { email, password } = req.body;
    if (!email || !password) {
      return res.status(400).json({ error: 'Email and password are required.' });
    }

    const db = getDb();
    const user = db.users.find((u: any) => u.email.toLowerCase() === email.trim().toLowerCase());
    if (!user) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    const isMatch = verifyPassword(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ error: 'Invalid email or password.' });
    }

    if (user.status === 'suspended') {
      return res.status(403).json({ error: 'Account suspended. Please contact institutional compliance.' });
    }

    const sessionUser: SessionUser = {
      id: user.id,
      email: user.email,
      name: user.name,
      role: user.role,
      agentId: user.agentId,
      avatar: user.avatar,
    };

    const token = createSession(sessionUser);
    logActivity(sessionUser, 'User Authenticated', 'Auth Session', sessionUser.id);

    return res.json({
      token,
      user: sessionUser,
    });
  });

  app.get('/api/auth/me', authMiddleware, (req: any, res) => {
    return res.json({ user: req.user });
  });

  app.post('/api/auth/logout', (req, res) => {
    const token = readToken(req);
    if (token) {
      const session = activeSessions.get(token);
      if (session) {
        logActivity(session.user, 'User Signed Out', 'Auth Session', session.user.id);
        activeSessions.delete(token);
      }
    }
    return res.json({ success: true, message: 'Logged out successfully.' });
  });

  // -------------------------------------------------------------
  // PROPERTIES API (Public Read, Admin / Agent Protected Write)
  // -------------------------------------------------------------
  app.get('/api/properties', (req, res) => {
    const db = getDb();
    const { category, type, search, agentId } = req.query;
    let list = [...db.properties];

    if (agentId) {
      list = list.filter((p) => p.agentId === String(agentId));
    }
    if (category) {
      list = list.filter((p) => p.category?.toLowerCase() === String(category).toLowerCase());
    }
    if (type) {
      list = list.filter((p) => p.listingType?.toLowerCase() === String(type).toLowerCase());
    }
    if (search) {
      const q = String(search).toLowerCase();
      list = list.filter(
        (p) =>
          p.title?.toLowerCase().includes(q) ||
          p.location?.city?.toLowerCase().includes(q) ||
          p.location?.address?.toLowerCase().includes(q)
      );
    }

    return res.json(list);
  });

  // Dedicated Agent Properties endpoint enforcing server-side ownership isolation
  app.get('/api/agent/properties', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    if (user.role === 'super_admin') {
      const { agentId } = req.query;
      return res.json(agentId ? db.properties.filter((p: any) => p.agentId === agentId) : db.properties);
    }
    // Strict isolation at database/service layer: Agent only sees their own listings
    return res.json(db.properties.filter((p: any) => p.agentId === user.agentId));
  });

  app.get('/api/agent/properties/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const property = db.properties.find(
      (p: any) => p.id === req.params.id || p.slug === req.params.id
    );
    if (!property) return res.status(404).json({ error: 'Property not found.' });
    if (user.role === 'agent' && property.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access property listings assigned to another advisor.' });
    }
    return res.json(property);
  });

  app.get('/api/properties/:id', (req, res) => {
    const db = getDb();
    const property = db.properties.find(
      (p: any) => p.id === req.params.id || p.slug === req.params.id
    );
    if (!property) return res.status(404).json({ error: 'Property not found.' });
    return res.json(property);
  });

  app.post('/api/properties', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const body = req.body;

    const newId = `prop-${Date.now()}`;
    const slug = (body.title || 'property')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    // If agent, enforce their assigned agentId
    const assignedAgentId = user.role === 'agent' ? user.agentId : body.agentId || AGENT.id;

    const newProperty = {
      ...body,
      id: newId,
      slug: `${slug}-${Date.now().toString(36).substr(2, 4)}`,
      agentId: assignedAgentId,
      status: body.status || 'active',
      // No certification claim unless someone actually checked it.
      verified: body.verified === true,
      verifiedBadgeText: body.verified === true ? body.verifiedBadgeText || '' : '',
      listedDate: new Date().toISOString().split('T')[0],
      createdAt: new Date().toISOString(),
    };

    db.properties.unshift(newProperty);
    saveDb(db);
    logActivity(user, `Property Created: ${newProperty.title}`, 'Property', newId);

    return res.status(201).json(newProperty);
  });

  app.put('/api/properties/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const index = db.properties.findIndex((p: any) => p.id === req.params.id);

    if (index === -1) return res.status(404).json({ error: 'Property not found.' });

    // Agent can only edit their own property
    if (user.role === 'agent' && db.properties[index].agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You can only edit properties assigned to you.' });
    }

    const propertyUpdates = { ...req.body };
    if (user.role === 'agent') {
      propertyUpdates.agentId = db.properties[index].agentId; // Preserve original agent ownership
    }

    db.properties[index] = {
      ...db.properties[index],
      ...propertyUpdates,
      id: req.params.id, // preserve id
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    logActivity(user, `Property Updated: ${db.properties[index].title}`, 'Property', req.params.id);
    return res.json(db.properties[index]);
  });

  app.delete('/api/properties/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const property = db.properties.find((p: any) => p.id === req.params.id);

    if (!property) return res.status(404).json({ error: 'Property not found.' });

    if (user.role === 'agent' && property.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You can only delete properties assigned to you.' });
    }

    db.properties = db.properties.filter((p: any) => p.id !== req.params.id);
    saveDb(db);
    logActivity(user, `Property Deleted: ${property.title}`, 'Property', req.params.id);
    return res.json({ success: true, message: 'Property deleted successfully.' });
  });

  // -------------------------------------------------------------
  // USERS API (Super Admin Only)
  // -------------------------------------------------------------
  app.get('/api/users', requireSuperAdmin, (req, res) => {
    const db = getDb();
    const sanitized = db.users.map((u: any) => {
      const { passwordHash, ...rest } = u;
      return rest;
    });
    return res.json(sanitized);
  });

  app.post('/api/users', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const { email, password, name, role, title, status } = req.body;

    if (!email || !password || !name) {
      return res.status(400).json({ error: 'Name, email, and password are required.' });
    }

    if (db.users.some((u: any) => u.email.toLowerCase() === email.toLowerCase())) {
      return res.status(409).json({ error: 'A user with this email already exists.' });
    }

    const newUser = {
      id: `user-${Date.now()}`,
      email,
      name,
      role: role || 'client',
      title: title || 'Registered Member',
      status: status || 'active',
      passwordHash: hashPassword(password),
      avatar: `https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80`,
      createdAt: new Date().toISOString(),
    };

    db.users.push(newUser);
    saveDb(db);
    logActivity(req.user, `User Created: ${name} (${role})`, 'User', newUser.id);

    const { passwordHash, ...sanitized } = newUser;
    return res.status(201).json(sanitized);
  });

  app.put('/api/users/:id', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const index = db.users.findIndex((u: any) => u.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'User not found.' });

    const updates = { ...req.body };
    if (updates.password) {
      updates.passwordHash = hashPassword(updates.password);
      delete updates.password;
    }

    db.users[index] = {
      ...db.users[index],
      ...updates,
      id: req.params.id,
    };

    saveDb(db);
    logActivity(req.user, `User Updated: ${db.users[index].name}`, 'User', req.params.id);

    const { passwordHash, ...sanitized } = db.users[index];
    return res.json(sanitized);
  });

  app.delete('/api/users/:id', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const user = db.users.find((u: any) => u.id === req.params.id);
    if (!user) return res.status(404).json({ error: 'User not found.' });

    if (user.email === 'admin@demo.digenticrealty.com') {
      return res.status(400).json({ error: 'The primary Demo Admin account cannot be deleted.' });
    }

    db.users = db.users.filter((u: any) => u.id !== req.params.id);
    saveDb(db);
    logActivity(req.user, `User Deleted: ${user.name}`, 'User', req.params.id);
    return res.json({ success: true, message: 'User deleted.' });
  });

  // -------------------------------------------------------------
  // AGENTS API (Public Read, Admin Full CRUD)
  // -------------------------------------------------------------
  app.get('/api/agents', (req, res) => {
    const db = getDb();
    return res.json(db.agents);
  });

  app.get('/api/agents/:id', (req, res) => {
    const db = getDb();
    const agent = db.agents.find((a: any) => a.id === req.params.id || a.slug === req.params.id);
    if (!agent) return res.status(404).json({ error: 'Agent not found.' });
    return res.json(agent);
  });

  app.post('/api/agents', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const newId = `agent-${Date.now()}`;
    const slug = (req.body.name || 'agent')
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');

    const newAgent = {
      ...req.body,
      id: newId,
      slug: `${slug}-${Date.now().toString(36).substr(2, 4)}`,
      rating: req.body.rating || 5.0,
      activeListingsCount: req.body.activeListingsCount || 0,
      dealsClosed: req.body.dealsClosed || 0,
      salesVolume: req.body.salesVolume || '$0M',
    };

    db.agents.push(newAgent);
    saveDb(db);
    logActivity(req.user, `Agent Appointed: ${newAgent.name}`, 'Agent', newId);
    return res.status(201).json(newAgent);
  });

  app.put('/api/agents/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const index = db.agents.findIndex((a: any) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Agent not found.' });

    // Agent can only update their own profile
    if (user.role === 'agent' && user.agentId !== req.params.id) {
      return res.status(403).json({ error: 'Forbidden: You can only update your own profile.' });
    }

    db.agents[index] = {
      ...db.agents[index],
      ...req.body,
      id: req.params.id,
    };

    saveDb(db);
    logActivity(user, `Agent Updated: ${db.agents[index].name}`, 'Agent', req.params.id);
    return res.json(db.agents[index]);
  });

  app.delete('/api/agents/:id', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    db.agents = db.agents.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    logActivity(req.user, `Agent Removed: ${req.params.id}`, 'Agent', req.params.id);
    return res.json({ success: true });
  });

  // -------------------------------------------------------------
  // APPOINTMENTS & TOURS API (Role-Based Filtering)
  // -------------------------------------------------------------
  app.get('/api/appointments', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;

    if (user.role === 'super_admin') {
      return res.json(db.appointments);
    }
    // Agent only gets their assigned appointments
    const agentAppointments = db.appointments.filter((a: any) => a.agentId === user.agentId);
    return res.json(agentAppointments);
  });

  app.post('/api/appointments', (req, res) => {
    const db = getDb();
    const newApt = {
      ...req.body,
      id: `apt-${Date.now()}`,
      status: req.body.status || 'pending',
      createdAt: new Date().toISOString(),
    };
    db.appointments.unshift(newApt);
    saveDb(db);
    return res.status(201).json(newApt);
  });

  app.put('/api/appointments/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const index = db.appointments.findIndex((a: any) => a.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Appointment not found.' });

    if (user.role === 'agent' && db.appointments[index].agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You can only update appointments assigned to you.' });
    }

    const aptUpdates = { ...req.body };
    if (user.role === 'agent') {
      aptUpdates.agentId = db.appointments[index].agentId; // Preserve original agent assignment
    }

    db.appointments[index] = {
      ...db.appointments[index],
      ...aptUpdates,
      id: req.params.id,
      updatedAt: new Date().toISOString(),
    };

    saveDb(db);
    logActivity(user, `Appointment Status: ${db.appointments[index].status}`, 'Appointment', req.params.id);
    return res.json(db.appointments[index]);
  });

  app.get('/api/appointments/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const apt = db.appointments.find((a: any) => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });

    if (user.role === 'agent' && apt.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access appointments assigned to another advisor.' });
    }
    return res.json(apt);
  });

  app.delete('/api/appointments/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const apt = db.appointments.find((a: any) => a.id === req.params.id);
    if (!apt) return res.status(404).json({ error: 'Appointment not found.' });

    if (user.role === 'agent' && apt.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete appointments assigned to another advisor.' });
    }

    db.appointments = db.appointments.filter((a: any) => a.id !== req.params.id);
    saveDb(db);
    logActivity(user, `Appointment Cancelled/Deleted: ${apt.clientName}`, 'Appointment', req.params.id);
    return res.json({ success: true, message: 'Appointment deleted.' });
  });

  // -------------------------------------------------------------
  // LEADS API (Role-Based Filtering)
  // -------------------------------------------------------------
  app.get('/api/leads', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;

    if (user.role === 'super_admin') {
      return res.json(db.leads);
    }
    const agentLeads = db.leads.filter((l: any) => l.agentId === user.agentId);
    return res.json(agentLeads);
  });

  app.get('/api/leads/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const lead = db.leads.find((l: any) => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });

    if (user.role === 'agent' && lead.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You cannot access leads assigned to another advisor.' });
    }
    return res.json(lead);
  });

  app.post('/api/leads', leadGuard, (req, res) => {
    const db = getDb();
    const newLead = {
      ...req.body,
      id: `lead-${Date.now()}`,
      status: 'new',
      createdAt: new Date().toISOString(),
    };
    db.leads.unshift(newLead);
    saveDb(db);
    return res.status(201).json(newLead);
  });

  app.put('/api/leads/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const index = db.leads.findIndex((l: any) => l.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Lead not found.' });

    if (user.role === 'agent' && db.leads[index].agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You can only manage leads assigned to you.' });
    }

    const leadUpdates = { ...req.body };
    if (user.role === 'agent') {
      leadUpdates.agentId = db.leads[index].agentId; // Preserve original agent assignment
    }

    db.leads[index] = {
      ...db.leads[index],
      ...leadUpdates,
      id: req.params.id,
    };

    saveDb(db);
    logActivity(user, `Lead Pipeline Updated: ${db.leads[index].clientName}`, 'Lead', req.params.id);
    return res.json(db.leads[index]);
  });

  app.delete('/api/leads/:id', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;
    const lead = db.leads.find((l: any) => l.id === req.params.id);
    if (!lead) return res.status(404).json({ error: 'Lead not found.' });

    if (user.role === 'agent' && lead.agentId !== user.agentId) {
      return res.status(403).json({ error: 'Forbidden: You cannot delete leads assigned to another advisor.' });
    }

    db.leads = db.leads.filter((l: any) => l.id !== req.params.id);
    saveDb(db);
    logActivity(user, `Lead Deleted: ${lead.clientName}`, 'Lead', req.params.id);
    return res.json({ success: true, message: 'Lead deleted.' });
  });

  // -------------------------------------------------------------
  // REVIEWS, CATEGORIES, LOCATIONS, SETTINGS, CONTENT, ACTIVITY LOGS
  // -------------------------------------------------------------
  app.get('/api/content', (req, res) => {
    const db = getDb();
    return res.json(db.content || getInitialData().content);
  });

  app.put('/api/content', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    db.content = { ...db.content, ...req.body };
    saveDb(db);
    logActivity(req.user, 'Website Content CMS Modified', 'Content', 'cms');
    return res.json(db.content);
  });
  app.get('/api/reviews', (req, res) => {
    const db = getDb();
    return res.json(db.reviews);
  });

  app.put('/api/reviews/:id', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const index = db.reviews.findIndex((r: any) => r.id === req.params.id);
    if (index === -1) return res.status(404).json({ error: 'Review not found.' });

    db.reviews[index] = { ...db.reviews[index], ...req.body, id: req.params.id };
    saveDb(db);
    return res.json(db.reviews[index]);
  });

  app.get('/api/categories', (req, res) => {
    const db = getDb();
    return res.json(db.categories);
  });

  app.post('/api/categories', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    const newCat = {
      id: `cat-${Date.now()}`,
      ...req.body,
      propertyCount: 0,
    };
    db.categories.push(newCat);
    saveDb(db);
    return res.status(201).json(newCat);
  });

  app.get('/api/locations', (req, res) => {
    const db = getDb();
    return res.json(db.locations);
  });

  app.get('/api/settings', requireSuperAdmin, (req, res) => {
    const db = getDb();
    return res.json(db.settings);
  });

  app.put('/api/settings', requireSuperAdmin, (req: any, res) => {
    const db = getDb();
    db.settings = { ...db.settings, ...req.body };
    saveDb(db);
    logActivity(req.user, 'System Platform Settings Modified', 'Settings', 'global');
    return res.json(db.settings);
  });

  app.get('/api/activity', requireSuperAdmin, (req, res) => {
    const db = getDb();
    return res.json(db.activity);
  });

  // Summary Metrics endpoint
  app.get('/api/stats', requireAgentOrAdmin, (req: any, res) => {
    const db = getDb();
    const user: SessionUser = req.user;

    if (user.role === 'super_admin') {
      const totalVolume = db.properties.reduce((sum: number, p: any) => sum + (p.price || 0), 0);
      return res.json({
        totalProperties: db.properties.length,
        activeListings: db.properties.filter((p: any) => p.status === 'active').length,
        totalSalesVolume: `$${(totalVolume / 1000000).toFixed(1)}M`,
        totalLeads: db.leads.length,
        newLeads: db.leads.filter((l: any) => l.status === 'new').length,
        totalAppointments: db.appointments.length,
        pendingAppointments: db.appointments.filter((a: any) => a.status === 'pending').length,
        totalAgents: db.agents.length,
        totalUsers: db.users.length,
      });
    }

    // Agent Stats
    const myProperties = db.properties.filter((p: any) => p.agentId === user.agentId);
    const myLeads = db.leads.filter((l: any) => l.agentId === user.agentId);
    const myAppointments = db.appointments.filter((a: any) => a.agentId === user.agentId);
    const agentProfile = db.agents.find((a: any) => a.id === user.agentId);

    return res.json({
      assignedProperties: myProperties.length,
      activeListings: myProperties.filter((p: any) => p.status === 'active').length,
      assignedLeads: myLeads.length,
      newLeads: myLeads.filter((l: any) => l.status === 'new').length,
      upcomingAppointments: myAppointments.filter((a: any) => a.status === 'confirmed').length,
      dealsClosed: agentProfile?.dealsClosed || 0,
      careerVolume: agentProfile?.salesVolume || '$0M',
      clientRating: agentProfile?.rating || 5.0,
    });
  });

  registerComplianceRoutes(app, getDb, requireSuperAdmin);
  registerListingFeed(app, getDb, PORT);

  // -------------------------------------------------------------
  // VITE / STATIC CLIENT MIDDLEWARE
  // -------------------------------------------------------------
  if (process.env.NODE_ENV === 'production') {
    const distPath = path.resolve(process.cwd(), 'dist');
    app.use(express.static(distPath));
    app.get('*', (req, res) => {
      res.sendFile(path.resolve(distPath, 'index.html'));
    });
  } else {
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: 'spa',
    });
    app.use(vite.middlewares);
  }

  app.listen(PORT, '0.0.0.0', () => {
    console.log(`[Digentic Enterprise] Server listening on http://0.0.0.0:${PORT}`);
  });
}

startServer().catch((err) => {
  console.error('Failed to start Digentic server:', err);
  process.exit(1);
});
