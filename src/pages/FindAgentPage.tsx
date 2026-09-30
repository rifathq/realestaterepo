import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  MapPin, 
  ShieldCheck, 
  Star, 
  X, 
  ArrowRight, 
  Phone, 
  Mail, 
  Calendar, 
  CheckCircle2, 
  SlidersHorizontal,
  RotateCcw
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useMarketplace } from '../context/MarketplaceContext';

export const FindAgentPage: React.FC = () => {
  const { notify } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();

  // Search & Filter State
  const initialSearch = searchParams.get('q') || searchParams.get('search') || searchParams.get('city') || '';
  const initialLocation = searchParams.get('location') || (searchParams.get('city') ? searchParams.get('city')! : 'All Locations');
  
  const [searchQuery, setSearchQuery] = useState(initialSearch);
  const [transactionType, setTransactionType] = useState<'All' | 'Buy' | 'Sell' | 'Rent'>('All');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');
  const [selectedLanguage, setSelectedLanguage] = useState('All');
  const [selectedLocation, setSelectedLocation] = useState(initialLocation);
  const [selectedRating, setSelectedRating] = useState('All');
  const [sortBy, setSortBy] = useState<'recommended' | 'volume-desc' | 'deals-desc' | 'rating-desc' | 'name-asc'>('recommended');
  
  // Pagination State
  const [visibleCount, setVisibleCount] = useState(12);

  // Contact Modal State
  const [activeContactAgent, setActiveContactAgent] = useState<Agent | null>(null);
  const [contactMode, setContactMode] = useState<'inquiry' | 'call'>('inquiry');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactLookingFor, setContactLookingFor] = useState('Buy a Home');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync search query from URL if changed
  useEffect(() => {
    const urlCity = searchParams.get('city');
    const urlQ = searchParams.get('q') || searchParams.get('search');
    if (urlCity) {
      setSelectedLocation(urlCity);
      setSearchQuery(urlCity);
    } else if (urlQ) {
      setSearchQuery(urlQ);
    }
  }, [searchParams]);

  // Handle contact modal open
  const openContactModal = (agent: Agent, mode: 'inquiry' | 'call' = 'inquiry') => {
    setActiveContactAgent(agent);
    setContactMode(mode);
    setContactSubmitted(false);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactLookingFor('Buy a Home');
    setContactMessage(
      mode === 'call'
        ? `Hello ${agent.name}, I would like to schedule a 15-minute introductory call to discuss my real estate goals in ${agent.city || agent.officeLocation}.`
        : `Hello ${agent.name}, I am interested in advisory representation for properties in ${agent.city || agent.officeLocation}. Please reach out with next steps.`
    );
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      notify('Please provide your name and email address.');
      return;
    }
    setContactSubmitted(true);
    notify(
      contactMode === 'call'
        ? `Call request dispatched to ${activeContactAgent?.name}. You will receive a calendar invite shortly.`
        : `Inquiry successfully sent to ${activeContactAgent?.name}.`
    );
  };

  // Helper to parse volume into number for sorting
  const parseVolume = (volStr?: string): number => {
    if (!volStr) return 0;
    const clean = volStr.replace(/[^0-9.]/g, '');
    const num = parseFloat(clean) || 0;
    if (volStr.includes('M')) return num * 1_000_000;
    if (volStr.includes('K')) return num * 1_000;
    if (volStr.includes('B')) return num * 1_000_000_000;
    return num;
  };

  // Filter & Sort Logic
  const filteredAndSortedAgents = useMemo(() => {
    let result = AGENTS.filter((agent: Agent) => {
      // 1. Text Search query (matches name, city, state, neighborhood, address, zip, agency, specializations)
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = agent.name.toLowerCase().includes(q);
        const matchCity = agent.city?.toLowerCase().includes(q) ?? false;
        const matchState = agent.state?.toLowerCase().includes(q) ?? false;
        const matchOffice = agent.officeLocation.toLowerCase().includes(q);
        const matchAgency = agent.agency.toLowerCase().includes(q);
        const matchRole = agent.role.toLowerCase().includes(q);
        const matchNeighborhoods = agent.neighborhoods?.some((n) => n.toLowerCase().includes(q)) ?? false;
        const matchServiceAreas = agent.serviceAreas?.some((s) => s.toLowerCase().includes(q)) ?? false;
        const matchSpecs = agent.specializations.some((s) => s.toLowerCase().includes(q));

        if (
          !matchName &&
          !matchCity &&
          !matchState &&
          !matchOffice &&
          !matchAgency &&
          !matchRole &&
          !matchNeighborhoods &&
          !matchServiceAreas &&
          !matchSpecs
        ) {
          return false;
        }
      }

      // 2. Transaction Type Filter (All | Buy | Sell | Rent)
      if (transactionType !== 'All') {
        if (agent.dealType && agent.dealType !== 'Both') {
          if (transactionType === 'Buy' && agent.dealType !== 'Buy') return false;
          if (transactionType === 'Sell' && agent.dealType !== 'Sell') return false;
          if (transactionType === 'Rent' && agent.dealType !== 'Rent') return false;
        }
      }

      // 3. Specialization Filter
      if (selectedSpecialization !== 'All') {
        const specLower = selectedSpecialization.toLowerCase();
        const matchesSpec = agent.specializations.some((s) => s.toLowerCase().includes(specLower));
        const matchesRole = agent.role.toLowerCase().includes(specLower);
        if (!matchesSpec && !matchesRole) {
          if (specLower === 'luxury' && !agent.isLuxuryExpert) return false;
          if (specLower !== 'luxury') return false;
        }
      }

      // 4. Language Filter
      if (selectedLanguage !== 'All') {
        const langLower = selectedLanguage.toLowerCase();
        const matchesLang = agent.languages.some((l) => l.toLowerCase() === langLower);
        if (!matchesLang) return false;
      }

      // 5. Location Filter
      if (selectedLocation !== 'All Locations') {
        const locLower = selectedLocation.toLowerCase();
        const inCity = agent.city?.toLowerCase().includes(locLower) ?? false;
        const inOffice = agent.officeLocation.toLowerCase().includes(locLower);
        const inState = agent.state?.toLowerCase() === locLower;
        const inServices = agent.serviceAreas?.some((s) => s.toLowerCase().includes(locLower)) ?? false;
        if (!inCity && !inOffice && !inState && !inServices) return false;
      }

      // 6. Rating Filter
      if (selectedRating !== 'All') {
        const minRating = parseFloat(selectedRating);
        const agentRating = agent.rating || 4.8;
        if (agentRating < minRating) return false;
      }

      return true;
    });

    // Sorting
    result.sort((a, b) => {
      if (sortBy === 'volume-desc') {
        return parseVolume(b.salesVolume) - parseVolume(a.salesVolume);
      }
      if (sortBy === 'deals-desc') {
        return (b.totalDeals || b.dealsClosed || 0) - (a.totalDeals || a.dealsClosed || 0);
      }
      if (sortBy === 'rating-desc') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'name-asc') {
        return a.name.localeCompare(b.name);
      }
      // 'recommended': prioritize luxury experts, then total deals
      if ((b.isLuxuryExpert ? 1 : 0) !== (a.isLuxuryExpert ? 1 : 0)) {
        return (b.isLuxuryExpert ? 1 : 0) - (a.isLuxuryExpert ? 1 : 0);
      }
      return (b.totalDeals || 0) - (a.totalDeals || 0);
    });

    return result;
  }, [
    searchQuery,
    transactionType,
    selectedSpecialization,
    selectedLanguage,
    selectedLocation,
    selectedRating,
    sortBy,
  ]);

  // Active filters count for quick reset indicator
  const hasActiveFilters = 
    searchQuery.trim() !== '' ||
    transactionType !== 'All' ||
    selectedSpecialization !== 'All' ||
    selectedLanguage !== 'All' ||
    selectedLocation !== 'All Locations' ||
    selectedRating !== 'All';

  const clearAllFilters = () => {
    setSearchQuery('');
    setTransactionType('All');
    setSelectedSpecialization('All');
    setSelectedLanguage('All');
    setSelectedLocation('All Locations');
    setSelectedRating('All');
    setSortBy('recommended');
    setSearchParams({});
  };

  // Slice for pagination
  const displayedAgents = filteredAndSortedAgents.slice(0, visibleCount);
  const totalCount = filteredAndSortedAgents.length;
  const currentRange = totalCount === 0 ? '0' : `1–${Math.min(visibleCount, totalCount)}`;

  // Location display for results header
  const locationHeaderTitle = useMemo(() => {
    if (selectedLocation !== 'All Locations') {
      return ` in ${selectedLocation}`;
    }
    if (searchQuery.trim()) {
      return ` matching "${searchQuery}"`;
    }
    return '';
  }, [selectedLocation, searchQuery]);

  return (
    <div className="w-full min-h-screen bg-[#F7F6F1] text-[#111111] selection:bg-neutral-900 selection:text-white">
      {/* Container with refined spatial math */}
      <div className="max-w-[1580px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-14 space-y-8 sm:space-y-10">

        {/* 1. Page Intro / Hero Section */}
        <section className="space-y-4 max-w-4xl pt-2 sm:pt-4">
          <div className="inline-flex items-center gap-2 text-xs font-mono tracking-widest text-stone-500 uppercase">
            <span>ESTRA Real Estate Marketplace</span>
            <span aria-hidden="true">·</span>
            <span>Agent Directory</span>
          </div>

          <h1 className="text-3xl sm:text-4xl md:text-5xl font-bold tracking-tight text-stone-950 font-sans leading-[1.12]">
            Find the right real estate agent for your next move
          </h1>

          <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed max-w-2xl">
            Connect with verified real estate professionals who understand your market, your goals, and the property journey ahead.
          </p>
        </section>

        {/* 2. Agent Search & Filtering Area */}
        <section className="bg-white border border-[#DCDAD3] shadow-[0_1px_3px_rgba(0,0,0,0.03)] p-4 sm:p-5 space-y-4">
          {/* Top row: Search input + Primary Search Button + Transaction Type Pills */}
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            {/* Primary Search Field */}
            <div className="relative flex-1 flex items-center bg-[#FDFDFB] border border-stone-200 px-3.5 py-2.5 focus-within:border-black focus-within:ring-1 focus-within:ring-black transition-all">
              <Search className="w-4 h-4 text-stone-400 mr-2.5 shrink-0 stroke-[1.8]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="City, address, neighborhood, ZIP or agent"
                className="w-full bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none font-sans"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="text-stone-400 hover:text-stone-700 p-1 cursor-pointer transition-colors"
                  aria-label="Clear search query"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Primary CTA Search Button */}
            <button
              type="button"
              onClick={() => {
                // Focus / trigger view
                setVisibleCount(12);
              }}
              className="px-6 py-2.5 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-sm tracking-wide border border-black shadow-xs transition-all duration-200 cursor-pointer inline-flex items-center justify-center gap-2"
            >
              <span>Search</span>
            </button>

            {/* Compact Segmented Transaction Type Controls */}
            <div className="flex items-center p-1 bg-stone-100 border border-stone-200 self-start lg:self-center overflow-x-auto max-w-full">
              {(['All', 'Buy', 'Sell', 'Rent'] as const).map((type) => {
                const isActive = transactionType === type;
                return (
                  <button
                    key={type}
                    type="button"
                    onClick={() => {
                      setTransactionType(type);
                      setVisibleCount(12);
                    }}
                    className={`px-3.5 py-1.5 text-xs font-medium transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-black text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    {type}
                  </button>
                );
              })}
            </div>
          </div>

          {/* Bottom row: Compact Dropdown Filters */}
          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 pt-1 border-t border-stone-100">
            {/* Specialization Dropdown */}
            <div className="relative">
              <label htmlFor="filter-spec" className="sr-only">Specialization</label>
              <select
                id="filter-spec"
                value={selectedSpecialization}
                onChange={(e) => {
                  setSelectedSpecialization(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-[#FDFDFB] border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-black transition-colors"
              >
                <option value="All">All Specializations</option>
                <option value="Residential">Residential</option>
                <option value="Commercial">Commercial</option>
                <option value="Luxury">Luxury</option>
                <option value="Investment">Investment</option>
                <option value="Land">Land</option>
                <option value="New Construction">New Construction</option>
                <option value="Architecture">Modern Architecture</option>
                <option value="Historic">Historic Properties</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {/* Language Dropdown */}
            <div className="relative">
              <label htmlFor="filter-lang" className="sr-only">Language</label>
              <select
                id="filter-lang"
                value={selectedLanguage}
                onChange={(e) => {
                  setSelectedLanguage(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-[#FDFDFB] border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-black transition-colors"
              >
                <option value="All">All Languages</option>
                <option value="English">English</option>
                <option value="Spanish">Spanish</option>
                <option value="Mandarin">Mandarin</option>
                <option value="Greek">Greek</option>
                <option value="French">French</option>
                <option value="German">German</option>
                <option value="Italian">Italian</option>
                <option value="Cantonese">Cantonese</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {/* Location Dropdown */}
            <div className="relative">
              <label htmlFor="filter-loc" className="sr-only">Location</label>
              <select
                id="filter-loc"
                value={selectedLocation}
                onChange={(e) => {
                  setSelectedLocation(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-[#FDFDFB] border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-black transition-colors"
              >
                <option value="All Locations">Any Location</option>
                <option value="Chicago">Chicago, IL</option>
                <option value="New York">New York, NY</option>
                <option value="San Francisco">San Francisco, CA</option>
                <option value="Seattle">Seattle, WA</option>
                <option value="Arlington">Arlington, VA</option>
                <option value="Washington">Washington, DC</option>
                <option value="Austin">Austin, TX</option>
                <option value="Los Angeles">Los Angeles, CA</option>
                <option value="Miami">Miami, FL</option>
                <option value="Boston">Boston, MA</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>

            {/* Rating Filter Dropdown */}
            <div className="relative">
              <label htmlFor="filter-rating" className="sr-only">Rating</label>
              <select
                id="filter-rating"
                value={selectedRating}
                onChange={(e) => {
                  setSelectedRating(e.target.value);
                  setVisibleCount(12);
                }}
                className="w-full bg-[#FDFDFB] border border-stone-200 px-3 py-2 text-xs font-medium text-stone-800 appearance-none pr-8 cursor-pointer focus:outline-none focus:border-black transition-colors"
              >
                <option value="All">All Ratings</option>
                <option value="4.9">4.9+ Stars</option>
                <option value="4.8">4.8+ Stars</option>
                <option value="4.5">4.5+ Stars</option>
              </select>
              <ChevronDown className="absolute right-2.5 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-400 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 3. Results Header & Sorting Bar */}
        <section className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-2 border-b border-[#DCDAD3]">
          {/* Dynamic Results Counter */}
          <div className="flex items-center gap-3">
            <span className="text-sm font-medium text-stone-900">
              <strong className="font-semibold text-stone-950">{currentRange}</strong> of{' '}
              <strong className="font-semibold text-stone-950">{totalCount} agents</strong>
              <span className="text-stone-500 font-normal">{locationHeaderTitle}</span>
            </span>

            {hasActiveFilters && (
              <button
                type="button"
                onClick={clearAllFilters}
                className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-black font-medium transition-colors cursor-pointer ml-2 border-l border-stone-200 pl-3"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* Sort Control */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
            <span className="text-xs text-stone-500 font-medium">Sort by:</span>
            <div className="relative">
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as any)}
                className="bg-transparent text-xs font-semibold text-stone-900 pr-6 focus:outline-none cursor-pointer appearance-none tracking-tight"
                aria-label="Sort agents"
              >
                <option value="recommended">Recommended</option>
                <option value="volume-desc">Sales Volume (High to Low)</option>
                <option value="deals-desc">Total Deals (High to Low)</option>
                <option value="rating-desc">Highest Rating</option>
                <option value="name-asc">Name (A–Z)</option>
              </select>
              <ChevronDown className="absolute right-0 top-1/2 -translate-y-1/2 w-3.5 h-3.5 text-stone-500 pointer-events-none" />
            </div>
          </div>
        </section>

        {/* 4. Agent Grid */}
        {displayedAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
            {displayedAgents.map((agent: Agent) => {
              const primaryCoverage = agent.serviceAreas?.join(' · ') || agent.officeLocation;
              const spokenLanguages = agent.languages?.slice(0, 3).join(', ');

              return (
                <article
                  key={agent.id}
                  className="group bg-white border border-[#DCDAD3] hover:border-black/40 transition-all duration-200 flex flex-col justify-between shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md"
                >
                  {/* Upper Section: Portrait Image with overlay tags */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100 border-b border-[#DCDAD3]">
                    <ImageWithFallback
                      src={agent.avatar}
                      alt={`${agent.name} professional headshot`}
                      fallbackTitle={agent.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-top transition-transform duration-500 group-hover:scale-[1.03]"
                    />

                    {/* Subtle Overlay Badge (Zero-Pill discipline: refined rectangular tag) */}
                    <div className="absolute top-3 left-3 flex flex-col gap-1.5 items-start">
                      {agent.isLuxuryExpert && (
                        <span className="bg-stone-900/85 backdrop-blur-xs text-white text-[10px] font-semibold tracking-wider uppercase px-2.5 py-1">
                          Luxury Expert
                        </span>
                      )}
                      {agent.verified && !agent.isLuxuryExpert && (
                        <span className="bg-white/95 backdrop-blur-xs text-stone-900 border border-stone-200 text-[10px] font-semibold tracking-wider uppercase px-2 py-0.5 inline-flex items-center gap-1">
                          <ShieldCheck className="w-3 h-3 text-emerald-600 stroke-[2]" />
                          Verified
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Body Content Container */}
                  <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                    {/* Header info */}
                    <div className="space-y-1">
                      <div className="flex items-start justify-between gap-2">
                        <Link
                          to={`/agents/${agent.slug || agent.id}`}
                          className="font-sans text-lg font-bold text-stone-950 hover:underline tracking-tight transition-colors line-clamp-1"
                        >
                          {agent.name}
                        </Link>
                        {agent.verified && (
                          <span title="Verified ESTRA Advisor" className="shrink-0 text-emerald-600 mt-1">
                            <ShieldCheck className="w-4 h-4 stroke-[2]" />
                          </span>
                        )}
                      </div>

                      {/* Title & Service Location */}
                      <p className="text-xs text-stone-600 line-clamp-1">
                        {agent.role.split('&')[0].trim()} · {primaryCoverage}
                      </p>

                      {/* Agency / Email */}
                      <p className="text-xs text-stone-400 font-mono tracking-tight line-clamp-1">
                        {agent.email}
                      </p>
                    </div>

                    {/* Statistics Row (3-column layout per prompt spec) */}
                    <div className="grid grid-cols-3 gap-2 py-3 border-y border-stone-100 text-center">
                      {/* Sales Volume */}
                      <div className="text-left">
                        <div className="font-sans text-sm sm:text-base font-bold text-stone-950 tabular-nums leading-tight">
                          {agent.salesVolume || '$120M+'}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5">
                          Sales volume
                        </div>
                      </div>

                      {/* Total Deals */}
                      <div className="text-center border-x border-stone-100 px-1">
                        <div className="font-sans text-sm sm:text-base font-bold text-stone-950 tabular-nums leading-tight">
                          {agent.totalDeals || agent.dealsClosed || 120}
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5">
                          Total deals
                        </div>
                      </div>

                      {/* Average Rating */}
                      <div className="text-right">
                        <div className="font-sans text-sm sm:text-base font-bold text-stone-950 tabular-nums leading-tight inline-flex items-center gap-1 justify-end">
                          <span>{agent.rating?.toFixed(1) || '4.9'}</span>
                          <Star className="w-3 h-3 fill-stone-900 text-stone-900" />
                        </div>
                        <div className="text-[10px] text-stone-500 font-medium tracking-tight mt-0.5">
                          Avg rating
                        </div>
                      </div>
                    </div>

                    {/* Languages or Specialization summary */}
                    <div className="text-[11px] text-stone-500 space-y-0.5">
                      {spokenLanguages && (
                        <div className="line-clamp-1">
                          <span className="text-stone-400">Speaks:</span> {spokenLanguages}
                        </div>
                      )}
                      <div className="line-clamp-1">
                        <span className="text-stone-400">Focus:</span> {agent.specializations.slice(0, 2).join(' · ')}
                      </div>
                    </div>

                    {/* Card Actions: Primary Contact + Secondary View Profile */}
                    <div className="space-y-2 pt-1">
                      <button
                        type="button"
                        onClick={() => openContactModal(agent, 'inquiry')}
                        className="w-full py-2 px-4 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-xs transition-all duration-200 cursor-pointer text-center"
                      >
                        Contact
                      </button>

                      <Link
                        to={`/agents/${agent.slug || agent.id}`}
                        className="w-full py-1.5 text-center text-xs font-medium text-stone-600 hover:text-black transition-colors block tracking-tight"
                      >
                        View Profile & Dossier
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-white border border-[#DCDAD3] p-12 sm:p-16 text-center max-w-2xl mx-auto space-y-4 my-8">
            <div className="w-12 h-12 bg-stone-100 rounded-full flex items-center justify-center mx-auto text-stone-500">
              <Search className="w-6 h-6 stroke-[1.5]" />
            </div>
            <h3 className="text-xl font-bold text-stone-900 font-sans">
              No agents match your current search.
            </h3>
            <p className="text-sm text-stone-500 max-w-md mx-auto leading-relaxed">
              Try adjusting your location, specialization, or filters to discover more professionals across our nationwide network.
            </p>
            <div className="pt-2">
              <button
                type="button"
                onClick={clearAllFilters}
                className="px-6 py-2.5 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wide uppercase border border-black shadow-md transition-all duration-200 cursor-pointer"
              >
                Clear Filters
              </button>
            </div>
          </div>
        )}

        {/* 5. Pagination / Load More */}
        {totalCount > visibleCount && (
          <div className="pt-6 sm:pt-8 pb-12 flex flex-col items-center justify-center space-y-3">
            <button
              type="button"
              onClick={() => setVisibleCount((prev) => prev + 8)}
              className="px-8 py-3 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              Load More Agents
            </button>
            <p className="text-xs text-stone-500 font-mono">
              Showing {Math.min(visibleCount, totalCount)} of {totalCount} verified advisors
            </p>
          </div>
        )}
      </div>

      {/* 6. Contact Modal Experience */}
      {activeContactAgent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setActiveContactAgent(null)}
        >
          <div 
            className="bg-white border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Close Button */}
            <button
              type="button"
              onClick={() => setActiveContactAgent(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Modal Header with Agent Summary */}
            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-14 h-14 overflow-hidden rounded-full bg-stone-100 shrink-0 border border-stone-200">
                <ImageWithFallback
                  src={activeContactAgent.avatar}
                  alt={activeContactAgent.name}
                  fallbackTitle={activeContactAgent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <div className="inline-flex items-center gap-1.5 text-xs text-stone-500 font-medium">
                  <span>{activeContactAgent.agency}</span>
                  <span aria-hidden="true">·</span>
                  <span className="text-emerald-700 font-semibold">{activeContactAgent.licenseNumber}</span>
                </div>
                <h3 className="text-lg font-bold text-stone-950 font-sans">
                  Contact {activeContactAgent.name}
                </h3>
                <p className="text-xs text-stone-500">
                  {activeContactAgent.role}
                </p>
              </div>
            </div>

            {contactSubmitted ? (
              /* Success confirmation state */
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h4 className="text-xl font-bold text-stone-900 font-sans">
                  {contactMode === 'call' ? 'Call Request Scheduled' : 'Inquiry Dispatched'}
                </h4>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. {activeContactAgent.name} has received your request and will follow up with you at <strong>{contactEmail}</strong>.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setActiveContactAgent(null)}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-xs transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              /* Modal Form */
              <form onSubmit={handleContactSubmit} className="space-y-4">
                {/* Switch between inquiry and phone call */}
                <div className="flex border border-stone-200 p-0.5 bg-stone-50">
                  <button
                    type="button"
                    onClick={() => {
                      setContactMode('inquiry');
                      setContactMessage(`Hello ${activeContactAgent.name}, I am interested in advisory representation for properties in ${activeContactAgent.city || activeContactAgent.officeLocation}. Please reach out with next steps.`);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      contactMode === 'inquiry'
                        ? 'bg-black text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Direct Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setContactMode('call');
                      setContactMessage(`Hello ${activeContactAgent.name}, I would like to schedule a 15-minute introductory consultation to discuss acquisition options.`);
                    }}
                    className={`flex-1 py-1.5 text-xs font-medium transition-all cursor-pointer ${
                      contactMode === 'call'
                        ? 'bg-black text-white shadow-2xs font-semibold'
                        : 'text-stone-600 hover:text-stone-900'
                    }`}
                  >
                    Schedule a Call
                  </button>
                </div>

                {/* Form fields */}
                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Eleanor Vance"
                    className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black transition-colors"
                  />
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="name@company.com"
                      className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="block text-xs font-semibold text-stone-700">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black transition-colors"
                    />
                  </div>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    What are you looking for?
                  </label>
                  <select
                    value={contactLookingFor}
                    onChange={(e) => setContactLookingFor(e.target.value)}
                    className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black transition-colors cursor-pointer"
                  >
                    <option value="Buy a Home">Buy a Residence / Estate</option>
                    <option value="Sell a Property">Sell an Asset / Listing</option>
                    <option value="Commercial Lease">Commercial Office or Retail Lease</option>
                    <option value="Investment Advisory">Private Capital & Investment Advisory</option>
                    <option value="General Consultation">General Property Consultation</option>
                  </select>
                </div>

                <div className="space-y-1.5">
                  <label className="block text-xs font-semibold text-stone-700">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#FDFDFB] border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-black transition-colors resize-none"
                  />
                </div>

                <div className="pt-2 flex flex-col sm:flex-row items-center gap-3">
                  <button
                    type="submit"
                    className="w-full sm:flex-1 py-2.5 px-4 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-md transition-all cursor-pointer text-center"
                  >
                    {contactMode === 'call' ? 'Request Call Slot' : 'Send Inquiry'}
                  </button>
                  <button
                    type="button"
                    onClick={() => setActiveContactAgent(null)}
                    className="w-full sm:w-auto py-2.5 px-4 text-xs font-medium text-stone-600 hover:text-black border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
