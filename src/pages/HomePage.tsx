import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { 
  Search, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Eye, 
  Building,
  KeyRound,
  ArrowUpRight
} from 'lucide-react';
import { PROPERTIES, PROPERTY_CATEGORIES, CITIES } from '../data/properties';
import { PropertyCard } from '../components/property/PropertyCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { HeroSearchBar } from '../components/home/HeroSearchBar';
import { PropertyCategory, ListingType } from '../types/property';

export const HomePage: React.FC = () => {
  // Featured section filter
  const [featuredTab, setFeaturedTab] = useState<'all' | 'Offices' | 'Villas' | 'Penthouses'>('all');

  const filteredFeatured = PROPERTIES.filter((p) => {
    if (featuredTab === 'all') return true;
    return p.category === featuredTab;
  });

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 w-full">
      
      {/* 1. HERO SECTION: Full-width edge-to-edge layout with scaled up typography */}
      <section className="pt-4 sm:pt-6 px-4 sm:px-8 lg:px-12 xl:px-16 w-full">
        <div className="relative rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-900 border border-stone-800 text-white min-h-[580px] sm:min-h-[680px] lg:min-h-[740px] flex flex-col justify-between p-6 sm:p-12 lg:p-18 xl:p-20 w-full">
          {/* Architectural facade backdrop */}
          <div className="absolute inset-0 z-0">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=2400&q=85"
              alt="ESTRA Architectural Headquarters"
              className="w-full h-full object-cover opacity-50 mix-blend-luminosity filter contrast-125"
            />
            {/* Measured contrast scrim */}
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/20" />
          </div>

          {/* Top Hero Kicker */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-stone-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>ESTRA Digital Real Estate Marketplace</span>
            </div>
            <div className="hidden sm:block text-sm text-stone-400 font-mono">
              Q3/2026 Index
            </div>
          </div>

          {/* Center / Bottom Hero Typography: Scaled up hero heading and subtitle */}
          <div className="relative z-10 max-w-4xl my-auto py-10 sm:py-16">
            <h1 className="text-5xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white font-architectural leading-[1.05] text-balance">
              Real Estate for Business & Living
            </h1>
            <p className="mt-6 text-lg sm:text-xl lg:text-2xl text-stone-200 max-w-3xl font-normal leading-relaxed">
              Rent, purchase, and manage verified commercial headquarters, modern residences, and urban development parcels with institutional precision.
            </p>
            
            {/* Real Estate Hero Search Bar with Interactive Tabs & Red Circular Button */}
            <div className="mt-8 sm:mt-10 w-full max-w-xl relative z-30">
              <HeroSearchBar />
            </div>
          </div>

          {/* Hero Bottom Bar */}
          <div className="relative z-0 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-400">
            <span>Verified Title Registration & Structural Due Diligence</span>
            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
              <span>4,000+ Active Listings</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">24 Major Metropolitan Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ESTRA / STATISTICS: Edge-to-edge full width with generous padding */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          {/* Left: About Text */}
          <div className="lg:col-span-6 space-y-6">
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
              About ESTRA
            </h2>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              ESTRA is a nationwide digital real estate marketplace and advisory platform operating since 2015. We partner with founders, enterprise corporations, and private investors to discover, lease, and acquire office, residential, warehouse, and land assets.
            </p>
            <p className="text-base sm:text-lg text-stone-600 leading-relaxed">
              Our multidisciplinary team unifies title verification, structural condition reviews, environmental compliance, and legal transaction escrow under one transparent digital platform.
            </p>
            <div className="pt-2">
              <Link
                to="/about"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950 border-b-2 border-stone-900 pb-0.5 hover:text-stone-700 transition-colors"
              >
                <span>Read Platform Charter & Verification Standards</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>
          </div>

          {/* Right: 2x2 Statistics Matrix */}
          <div className="lg:col-span-6 grid grid-cols-2 gap-8 sm:gap-14 pt-2 border-t lg:border-t-0 lg:border-l border-stone-200 lg:pl-16">
            <div>
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-950 font-mono tabular-nums">
                11+
              </div>
              <p className="text-sm sm:text-base text-stone-500 mt-2 font-medium">
                Years Operating in Marketplace
              </p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-950 font-mono tabular-nums">
                1,200+
              </div>
              <p className="text-sm sm:text-base text-stone-500 mt-2 font-medium">
                Closed Deals & Leases
              </p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-950 font-mono tabular-nums">
                4,200+
              </div>
              <p className="text-sm sm:text-base text-stone-500 mt-2 font-medium">
                Verified Properties in Database
              </p>
            </div>
            <div>
              <div className="text-5xl sm:text-6xl font-bold tracking-tight text-stone-950 font-mono tabular-nums">
                98%
              </div>
              <p className="text-sm sm:text-base text-stone-500 mt-2 font-medium">
                Institutional Client Satisfaction
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* 4. PROPERTY CATALOG: Full width edge-to-edge */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
              Property Catalog
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-1">
              Curated categories across corporate, industrial, and residential classes
            </p>
          </div>
          <Link
            to="/properties"
            className="text-sm font-semibold text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-1.5 self-start sm:self-auto"
          >
            <span>View All Asset Classes</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        </div>

        {/* Tall Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {PROPERTY_CATEGORIES.slice(0, 4).map((cat) => (
            <Link
              key={cat.name}
              to={`/properties?category=${cat.name}`}
              className="group block"
            >
              <div className="aspect-3/4 rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100 border border-stone-200 relative mb-3">
                <ImageWithFallback
                  src={cat.image}
                  alt={cat.name}
                  fallbackTitle={cat.name}
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-104"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-stone-950/75 via-transparent to-transparent opacity-80 group-hover:opacity-90 transition-opacity" />
                <div className="absolute bottom-5 left-5 right-5 text-white">
                  <span className="text-xs font-mono text-stone-300 block">
                    {cat.count}
                  </span>
                  <h3 className="text-xl font-bold tracking-tight mt-1">
                    {cat.name}
                  </h3>
                </div>
              </div>
              <p className="text-xs sm:text-sm text-stone-500 line-clamp-1">
                {cat.description}
              </p>
            </Link>
          ))}
        </div>
      </section>

      {/* 5. FEATURED PROPERTIES: Asymmetric Editorial Grid - Full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
              Properties Worth Seeing
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-1">
              Curated architectural residences, corporate pavilions, and prime penthouses
            </p>
          </div>

          {/* Interactive filter tabs */}
          <div className="flex items-center gap-1.5 p-1 bg-stone-100 border border-stone-200 self-start md:self-auto overflow-x-auto">
            {(['all', 'Offices', 'Villas', 'Penthouses'] as const).map((tab) => (
              <button
                key={tab}
                onClick={() => setFeaturedTab(tab)}
                className={`px-4 py-2 text-xs sm:text-sm font-medium transition-colors whitespace-nowrap ${
                  featuredTab === tab
                    ? 'bg-white text-stone-900 shadow-xs font-semibold'
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                {tab === 'all' ? 'All Curated' : tab}
              </button>
            ))}
          </div>
        </div>

        {/* Asymmetric Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {/* Marquee property if all or first available */}
          {filteredFeatured.map((property, idx) => (
            <PropertyCard
              key={property.id}
              property={property}
              isLargeFeatured={idx === 0}
              className={idx === 0 ? 'md:col-span-2 lg:col-span-2' : ''}
            />
          ))}
        </div>

        <div className="mt-10 text-center">
          <Link
            to="/properties"
            className="inline-flex items-center gap-2.5 px-8 py-3.5 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm"
          >
            <span>Browse Full Directory (4,200+ Listings)</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        </div>
      </section>

      {/* 6. HOW WE WORK: Full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
            How We Work
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1 max-w-xl">
            We have made the entire property search, verification, and transaction process as simple and transparent as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Tall architectural photo */}
          <div className="lg:col-span-5 relative aspect-4/5 lg:aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
              alt="ESTRA Advisory Building"
              className="w-full h-full object-cover"
            />
            {/* Consultation badge circular element */}
            <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-stone-900/85 backdrop-blur-xs text-white p-3 flex flex-col items-center justify-center text-center shadow-lg border border-stone-700">
              <span className="text-xs font-semibold tracking-tight uppercase leading-tight">
                Verified
              </span>
              <span className="text-[10px] text-stone-300 font-normal mt-0.5">
                Advisory Protocol
              </span>
            </div>
          </div>

          {/* Right: Step-by-step process list */}
          <div className="lg:col-span-7 space-y-7">
            
            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  01. Free Architectural Consultation
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Needs and spatial analysis. We identify structural requirements, square footage targets, zoning regulations, and financial caps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  02. Search & Selection of Verified Properties
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  We curate verified on-market and off-market opportunities strictly matched to your programmatic requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Eye className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  03. Private Viewing & Engineering Assessment
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Accompanied in-person walkthroughs or high-definition live virtual tours with technical MEP overviews and spatial evaluations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  04. Document Verification & Due Diligence
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Comprehensive review of title deeds, ownership rights, environmental reports, and building compliance documentation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  05. Transaction Support & Escrow Closing
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Full legal advisory and settlement assistance until final lease execution or title deed handover.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* 7. METROPOLITAN HUBS: City exploration cards - Full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
          <div>
            <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
              Explore Prime Regions
            </h2>
            <p className="text-sm sm:text-base text-stone-500 mt-1">
              Active marketplaces with verified listings across coastal and interior corridors
            </p>
          </div>
          <Link
            to="/properties"
            className="text-sm font-semibold text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-1.5"
          >
            <span>Explore All 24 Hubs</span>
            <ArrowRight className="w-4 h-4 stroke-[1.5]" />
          </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {CITIES.map((city) => (
            <Link
              key={city.name}
              to={`/properties?location=${city.name}`}
              className="group block relative aspect-4/3 overflow-hidden rounded-xl bg-stone-100 border border-stone-200"
            >
              <ImageWithFallback
                src={city.image}
                alt={city.name}
                fallbackTitle={city.name}
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-stone-950/80 via-stone-950/20 to-transparent" />
              <div className="absolute bottom-5 left-5 right-5 text-white">
                <span className="text-xs font-mono text-stone-300 block">
                  {city.count}
                </span>
                <h3 className="text-lg font-bold tracking-tight">
                  {city.name}
                </h3>
                <span className="text-xs text-stone-400">
                  {city.region}
                </span>
              </div>
            </Link>
          ))}
        </div>
      </section>

      {/* 8. THREE-PATH CONVERSION: Buy / Rent / Sell - Full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="border-t border-stone-200 pt-16">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            
            <div className="p-8 sm:p-10 bg-white border border-stone-200 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mb-5">
                  <KeyRound className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-stone-950">
                  Acquire Property
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
                  Discover verified residential estates, architectural pavilions, and corporate buildings with transparent pricing and title surveys.
                </p>
              </div>
              <Link
                to="/properties?type=buy"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950 hover:text-stone-700 transition-colors"
              >
                <span>Browse Properties For Sale</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

            <div className="p-8 sm:p-10 bg-white border border-stone-200 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-full bg-stone-100 text-stone-900 flex items-center justify-center mb-5">
                  <Building className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-stone-950">
                  Lease & Rent
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-2 leading-relaxed">
                  Executive offices, penthouses, and design ateliers on clear commercial and residential lease agreements.
                </p>
              </div>
              <Link
                to="/properties?type=rent"
                className="inline-flex items-center gap-2 text-sm font-semibold text-stone-950 hover:text-stone-700 transition-colors"
              >
                <span>Browse Properties For Lease</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

            <div className="p-8 sm:p-10 bg-stone-900 text-white border border-stone-800 flex flex-col justify-between space-y-6">
              <div>
                <div className="w-12 h-12 rounded-full bg-stone-800 text-white flex items-center justify-center mb-5">
                  <ArrowUpRight className="w-6 h-6 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold tracking-tight text-white">
                  List Your Property
                </h3>
                <p className="text-sm sm:text-base text-stone-300 mt-2 leading-relaxed">
                  Present your property to qualified investors, tenants, and institutions through ESTRA verified marketing network.
                </p>
              </div>
              <Link
                to="/sell"
                className="inline-flex items-center gap-2 text-sm font-semibold text-white hover:text-stone-300 transition-colors"
              >
                <span>Initiate Property Listing</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
