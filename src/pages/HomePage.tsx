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
import { HeroSearchFilter, SearchFilterState } from '../components/home/HeroSearchFilter';
import { PropertyCategory, ListingType } from '../types/property';

export const HomePage: React.FC = () => {
  const navigate = useNavigate();
  
  // Featured section filter
  const [featuredTab, setFeaturedTab] = useState<'all' | 'Offices' | 'Villas' | 'Penthouses'>('all');
  const [showAllCategories, setShowAllCategories] = useState(false);

  const handleHeroSearch = (state: SearchFilterState) => {
    const params = new URLSearchParams();
    if (state.type) params.set('type', state.type);
    if (state.location) params.set('location', state.location);
    if (state.category && state.category !== 'all') params.set('category', state.category);
    if (state.price && state.price !== 'all') params.set('price', state.price);
    navigate(`/properties?${params.toString()}`);
  };

  const filteredFeatured = PROPERTIES.filter((p) => {
    if (featuredTab === 'all') return true;
    return p.category === featuredTab;
  });

  const displayedCategories = showAllCategories ? PROPERTY_CATEGORIES : PROPERTY_CATEGORIES.slice(0, 4);

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
            
            <div className="mt-10 flex flex-wrap items-center gap-4 sm:gap-6">
              <Link
                to="/properties"
                className="px-8 py-4 bg-white text-stone-950 font-semibold text-sm sm:text-base tracking-tight hover:bg-stone-100 transition-colors inline-flex items-center gap-2.5 shadow-md"
              >
                <span>Explore Properties</span>
                <ArrowRight className="w-4 h-4 stroke-[1.5]" />
              </Link>
              <Link
                to="/sell"
                className="px-8 py-4 bg-stone-900/80 text-white border border-stone-600 font-semibold text-sm sm:text-base tracking-tight hover:bg-stone-800 transition-colors backdrop-blur-xs"
              >
                List Your Property
              </Link>
            </div>
          </div>

          {/* Hero Bottom Bar */}
          <div className="relative z-10 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-400">
            <span>Verified Title Registration & Structural Due Diligence</span>
            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
              <span>4,000+ Active Listings</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">24 Major Metropolitan Hubs</span>
            </div>
          </div>
        </div>

        {/* 2. SEARCH EXPERIENCE & TRUST SIGNALS */}
        <div className="relative -mt-12 sm:-mt-16 w-full max-w-5xl mx-auto z-20 px-2 sm:px-4">
          <HeroSearchFilter onSearch={handleHeroSearch} />

          {/* Connected Marketplace Trust Signals */}
          <div className="mt-8 pt-7 border-t border-stone-200/80">
            <div className="grid grid-cols-2 md:grid-cols-4 gap-6 sm:gap-8 divide-y sm:divide-y-0 sm:divide-x divide-stone-200/80">
              <div className="pt-4 sm:pt-0 sm:px-5 first:pl-0 text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural tabular-nums">
                  11<span className="text-stone-400 font-sans font-light text-2xl sm:text-3xl lg:text-4xl">+</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1.5 tracking-tight">
                  Years in Marketplace
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Active advisory & brokerage platform
                </p>
              </div>

              <div className="pt-4 sm:pt-0 sm:px-5 text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural tabular-nums">
                  1,200<span className="text-stone-400 font-sans font-light text-2xl sm:text-3xl lg:text-4xl">+</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1.5 tracking-tight">
                  Closed Deals & Leases
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Institutional & residential transactions
                </p>
              </div>

              <div className="pt-4 sm:pt-0 sm:px-5 text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural tabular-nums">
                  4,200<span className="text-stone-400 font-sans font-light text-2xl sm:text-3xl lg:text-4xl">+</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1.5 tracking-tight">
                  Verified Properties
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
                  ESTRA audited title registration
                </p>
              </div>

              <div className="pt-4 sm:pt-0 sm:px-5 last:pr-0 text-left">
                <div className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural tabular-nums">
                  98<span className="text-stone-400 font-sans font-light text-2xl sm:text-3xl lg:text-4xl">%</span>
                </div>
                <div className="text-xs sm:text-sm font-semibold text-stone-900 mt-1.5 tracking-tight">
                  Client Satisfaction
                </div>
                <p className="text-[11px] sm:text-xs text-stone-500 mt-0.5 leading-relaxed">
                  Verified client approval rating
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 3. ABOUT ESTRA / PLATFORM CHARTER: Edge-to-edge full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="bg-stone-900 text-white rounded-3xl p-8 sm:p-12 lg:p-16 border border-stone-800 grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-12 items-center">
          <div className="lg:col-span-8 space-y-4">
            <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">
              ESTRA Platform Charter
            </div>
            <h2 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight font-architectural leading-tight">
              Institutional due diligence for every square foot.
            </h2>
            <p className="text-stone-300 text-sm sm:text-base max-w-2xl leading-relaxed">
              Operating nationwide since 2015, ESTRA unifies county deed ownership records, structural plan measurements, environmental site reviews, and legal transaction escrow under one transparent digital marketplace.
            </p>
          </div>
          <div className="lg:col-span-4 flex flex-col sm:flex-row lg:flex-col gap-3 justify-center">
            <Link
              to="/about"
              className="px-6 py-3.5 bg-white text-stone-950 font-semibold text-sm hover:bg-stone-100 transition-colors inline-flex items-center justify-center gap-2 text-center shadow-xs"
            >
              <span>Read Platform Charter</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
            <Link
              to="/how-it-works"
              className="px-6 py-3.5 bg-stone-800/80 text-white border border-stone-700 font-semibold text-sm hover:bg-stone-700 transition-colors inline-flex items-center justify-center gap-2 text-center"
            >
              <span>Verification Protocol</span>
            </Link>
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
          <div className="flex items-center gap-4 self-start sm:self-auto">
            <button
              onClick={() => setShowAllCategories(!showAllCategories)}
              className="text-xs sm:text-sm font-medium text-stone-600 hover:text-stone-950 transition-colors py-1 px-2.5 rounded-md hover:bg-stone-100 border border-stone-200"
            >
              {showAllCategories ? 'Show Featured' : `All Categories (${PROPERTY_CATEGORIES.length})`}
            </button>
            <Link
              to="/properties"
              className="text-sm font-semibold text-stone-900 hover:text-stone-600 transition-colors flex items-center gap-1.5"
            >
              <span>View All Asset Classes</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
          </div>
        </div>

        {/* Category Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 sm:gap-8">
          {displayedCategories.map((cat) => (
            <Link
              key={cat.name}
              to={`/properties?category=${cat.name}`}
              className="group relative overflow-hidden rounded-2xl aspect-[4/5] min-h-[380px] shadow-sm hover:shadow-xl transition-all duration-300 block border border-stone-800/10 focus:outline-none focus:ring-2 focus:ring-stone-900 focus:ring-offset-2"
            >
              {/* Background image filling entire card */}
              <img
                src={cat.image}
                alt={cat.name}
                loading="lazy"
                className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 ease-out group-hover:scale-105"
              />

              {/* Dark gradient overlay on top of image */}
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/30 to-transparent group-hover:from-black/85 transition-colors duration-300 pointer-events-none" />

              {/* Card text content */}
              <div className="relative z-10 flex flex-col justify-between h-full p-6 text-white">
                {/* Top: Property Count badge & subtle arrow affordance */}
                <div className="flex items-center justify-between gap-2">
                  <span className="text-xs font-mono font-medium tracking-wide text-white/90 bg-black/40 backdrop-blur-md px-3 py-1 rounded-full border border-white/15">
                    {cat.count}
                  </span>
                  <span className="w-8 h-8 rounded-full bg-white/10 backdrop-blur-md flex items-center justify-center text-white/80 group-hover:text-white group-hover:bg-white/20 transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5">
                    <ArrowUpRight className="w-4 h-4 stroke-[1.5]" />
                  </span>
                </div>

                {/* Bottom: Title & Description */}
                <div className="space-y-1.5">
                  <h3 className="text-2xl sm:text-3xl font-bold tracking-tight text-white font-architectural drop-shadow-xs">
                    {cat.name}
                  </h3>
                  <p className="text-sm text-stone-200 line-clamp-2 leading-relaxed drop-shadow-xs opacity-90 group-hover:opacity-100 transition-opacity">
                    {cat.description}
                  </p>
                </div>
              </div>
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
