import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  MapPin, 
  ShieldCheck, 
  X, 
  ArrowRight,
  CheckCircle2, 
  Star,
  SlidersHorizontal,
  Mail,
  Phone,
  Calendar,
  Building2,
  Send,
  UserCheck
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useMarketplace } from '../context/MarketplaceContext';
import { useUserLocation } from '../hooks/useUserLocation';

const SPECIALIZATION_OPTIONS = [
  'All Specializations',
  'Luxury Residential',
  'Waterfront Estates',
  'Modernist Residential',
  'Commercial',
  'Penthouse Estates',
  'New Construction',
  'Historic Properties',
  'Adaptive Reuse',
  'Investment'
];

const LANGUAGE_OPTIONS = [
  'All Languages',
  'English',
  'Spanish',
  'Mandarin',
  'Cantonese',
  'French',
  'German',
  'Italian',
  'Greek'
];

const LOCATION_OPTIONS = [
  'Any Location',
  'Arlington, VA',
  'Washington DC',
  'San Francisco, CA',
  'Silicon Valley, CA',
  'New York, NY',
  'Miami, FL',
  'Chicago, IL'
];

export const FindAgentPage: React.FC = () => {
  const { notify } = useMarketplace();
  const [searchParams, setSearchParams] = useSearchParams();
  const { city: userCity, formattedLocation: userLocation } = useUserLocation();

  // Search & Filter State
  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [dealFilter, setDealFilter] = useState<'All' | 'Buy' | 'Sell' | 'Rent'>('All');
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('spec') || 'All Specializations');
  const [selectedLanguage, setSelectedLanguage] = useState('All Languages');
  const [selectedLocation, setSelectedLocation] = useState(searchParams.get('location') || 'Any Location');
  const [sortBy, setSortBy] = useState<'recommended' | 'volume-desc' | 'deals-desc' | 'rating-desc' | 'exp-desc'>('recommended');

  // Dropdown UI toggles
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [isLangOpen, setIsLangOpen] = useState(false);
  const [isLocOpen, setIsLocOpen] = useState(false);
  const [isSortOpen, setIsSortOpen] = useState(false);

  // Contact Modal State
  const [contactAgent, setContactAgent] = useState<Agent | null>(null);
  const [inquiryType, setInquiryType] = useState<'Buy' | 'Sell' | 'Consultation' | 'Valuation'>('Buy');
  const [timeline, setTimeline] = useState<'immediate' | '1-3-months' | '3-6-months' | 'curious'>('1-3-months');
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Sync initial query param if provided
  useEffect(() => {
    const locParam = searchParams.get('location') || searchParams.get('city');
    if (locParam && locParam !== selectedLocation) {
      setSelectedLocation(locParam);
    }
  }, [searchParams]);

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

  // Filter Agents
  const filteredAgents = useMemo(() => {
    const q = searchQuery.toLowerCase().trim();

    const list = AGENTS.filter((agent) => {
      // Freeform search (name, city, role, agency, bio, license, specializations, neighborhoods)
      if (q) {
        const matchName = agent.name.toLowerCase().includes(q);
        const matchCity = (agent.city || agent.officeLocation || '').toLowerCase().includes(q);
        const matchRole = agent.role.toLowerCase().includes(q);
        const matchLicense = (agent.licenseNumber || '').toLowerCase().includes(q);
        const matchBio = agent.bio.toLowerCase().includes(q);
        const matchSpecs = agent.specializations.some((s) => s.toLowerCase().includes(q));
        const matchNeighborhoods = (agent.neighborhoods || []).some((n) => n.toLowerCase().includes(q));
        const matchService = (agent.serviceAreas || []).some((s) => s.toLowerCase().includes(q));

        if (!matchName && !matchCity && !matchRole && !matchLicense && !matchBio && !matchSpecs && !matchNeighborhoods && !matchService) {
          return false;
        }
      }

      // Deal type filter: Buy / Sell / Rent / All
      if (dealFilter === 'Buy') {
        if (agent.dealType && agent.dealType === 'Sell') return false;
      } else if (dealFilter === 'Sell') {
        if (agent.dealType && agent.dealType === 'Buy') return false;
      } else if (dealFilter === 'Rent') {
        if (agent.dealType && (agent.dealType !== 'Both' && agent.dealType !== 'Rent')) return false;
      }

      // Specialization filter
      if (selectedSpec !== 'All Specializations') {
        const specLower = selectedSpec.toLowerCase();
        const hasSpec = agent.specializations.some((s) => 
          s.toLowerCase().includes(specLower) || specLower.includes(s.toLowerCase())
        );
        if (!hasSpec) return false;
      }

      // Language filter
      if (selectedLanguage !== 'All Languages') {
        const langLower = selectedLanguage.toLowerCase();
        const hasLang = agent.languages.some((l) => l.toLowerCase() === langLower);
        if (!hasLang) return false;
      }

      // Location filter
      if (selectedLocation !== 'Any Location') {
        const locLower = selectedLocation.toLowerCase();
        const matchAgentLoc = 
          (agent.city || '').toLowerCase().includes(locLower) ||
          (agent.officeLocation || '').toLowerCase().includes(locLower) ||
          (agent.serviceAreas || []).some((s) => s.toLowerCase().includes(locLower));
        if (!matchAgentLoc) return false;
      }

      return true;
    });

    // Sorting
    list.sort((a, b) => {
      if (sortBy === 'volume-desc') {
        return parseVolume(b.salesVolume) - parseVolume(a.salesVolume);
      }
      if (sortBy === 'deals-desc') {
        return (b.totalDeals || b.dealsClosed || 0) - (a.totalDeals || a.dealsClosed || 0);
      }
      if (sortBy === 'rating-desc') {
        return (b.rating || 0) - (a.rating || 0);
      }
      if (sortBy === 'exp-desc') {
        return (b.yearsExperience || 0) - (a.yearsExperience || 0);
      }
      return 0; // default recommendation order
    });

    return list;
  }, [searchQuery, dealFilter, selectedSpec, selectedLanguage, selectedLocation, sortBy]);

  const activeFiltersCount = useMemo(() => {
    let count = 0;
    if (dealFilter !== 'All') count++;
    if (selectedSpec !== 'All Specializations') count++;
    if (selectedLanguage !== 'All Languages') count++;
    if (selectedLocation !== 'Any Location') count++;
    if (searchQuery.trim()) count++;
    return count;
  }, [dealFilter, selectedSpec, selectedLanguage, selectedLocation, searchQuery]);

  const resetAllFilters = () => {
    setSearchQuery('');
    setDealFilter('All');
    setSelectedSpec('All Specializations');
    setSelectedLanguage('All Languages');
    setSelectedLocation('Any Location');
    setSortBy('recommended');
  };

  const handleOpenContact = (agent: Agent) => {
    setContactAgent(agent);
    setContactName('');
    setContactEmail('');
    setContactPhone('');
    setContactMessage(`Hello ${agent.name}, I would like to consult with you regarding prospective real estate advisory in your market coverage area.`);
    setContactSubmitted(false);
  };

  const handleSubmitContact = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      notify('Please provide your name and email address.');
      return;
    }
    setContactSubmitted(true);
    notify(`Inquiry sent to ${contactAgent?.name}. We will get back to you shortly.`);
  };

  return (
    <div className="w-full min-h-screen bg-white text-stone-900 selection:bg-stone-900 selection:text-white antialiased">
      {/* 1. Page Intro / Editorial Hero Section */}
      <section className="border-b border-stone-200 bg-stone-50/60">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16 lg:py-20">
          <div className="max-w-3xl space-y-4">
            <div className="inline-flex items-center gap-2 text-xs font-mono uppercase tracking-widest text-stone-500 font-medium">
              <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
              <span>ESTRA REAL ESTATE MARKETPLACE</span>
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-sans leading-[1.12]">
              Find the right real estate agent for your next move
            </h1>

            <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
              Connect with verified real estate professionals who understand your market, your goals, and the property journey ahead.
            </p>
          </div>
        </div>
      </section>

      {/* 2. Agent Search Area (Prominent horizontal search and filtering) */}
      <section className="bg-white border-b border-stone-200 sticky top-20 sm:top-22 z-20 backdrop-blur-md bg-white/95">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-5 space-y-4">
          
          {/* Top Row: Search input + Primary CTA */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            <div className="flex-1 relative flex items-center bg-stone-50 border border-stone-200 focus-within:border-stone-900 focus-within:bg-white rounded-lg transition-colors">
              <Search className="w-4 h-4 text-stone-400 ml-3.5 mr-2.5 shrink-0 stroke-[1.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="City, address, neighborhood, ZIP or agent"
                className="w-full py-2.5 pr-8 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-stone-400 hover:text-stone-700"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            <button
              type="button"
              className="bg-stone-900 hover:bg-black active:scale-95 text-white px-7 py-2.5 rounded-lg font-medium text-sm transition-all duration-150 cursor-pointer shrink-0 inline-flex items-center justify-center gap-2"
            >
              <Search className="w-4 h-4 stroke-[2]" />
              <span>Search</span>
            </button>
          </div>

          {/* Bottom Row: Filter Controls (Buy | Sell | Rent | All, Specialization, Language, Location) */}
          <div className="flex flex-wrap items-center justify-between gap-3 pt-1">
            <div className="flex flex-wrap items-center gap-2.5">
              
              {/* Segmented Filter: Buy / Sell / Rent / All */}
              <div className="inline-flex items-center bg-stone-100 p-1 rounded-lg border border-stone-200 text-xs font-medium">
                {(['All', 'Buy', 'Sell', 'Rent'] as const).map((type) => (
                  <button
                    key={type}
                    type="button"
                    onClick={() => setDealFilter(type)}
                    className={`px-3 py-1.5 rounded-md transition-all cursor-pointer ${
                      dealFilter === type
                        ? 'bg-white text-stone-950 font-semibold shadow-xs'
                        : 'text-stone-600 hover:text-stone-950'
                    }`}
                  >
                    {type}
                  </button>
                ))}
              </div>

              {/* Specialization Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsSpecOpen(!isSpecOpen);
                    setIsLangOpen(false);
                    setIsLocOpen(false);
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    selectedSpec !== 'All Specializations'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <span>{selectedSpec}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isSpecOpen ? 'rotate-180' : ''}`} />
                </button>

                {isSpecOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto">
                    {SPECIALIZATION_OPTIONS.map((spec) => (
                      <button
                        key={spec}
                        type="button"
                        onClick={() => {
                          setSelectedSpec(spec);
                          setIsSpecOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-stone-50 transition-colors ${
                          selectedSpec === spec ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-700'
                        }`}
                      >
                        {spec}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Language Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsLangOpen(!isLangOpen);
                    setIsSpecOpen(false);
                    setIsLocOpen(false);
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    selectedLanguage !== 'All Languages'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <span>{selectedLanguage}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isLangOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLangOpen && (
                  <div className="absolute left-0 top-full mt-1 w-48 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto">
                    {LANGUAGE_OPTIONS.map((lang) => (
                      <button
                        key={lang}
                        type="button"
                        onClick={() => {
                          setSelectedLanguage(lang);
                          setIsLangOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-stone-50 transition-colors ${
                          selectedLanguage === lang ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-700'
                        }`}
                      >
                        {lang}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Location Dropdown */}
              <div className="relative">
                <button
                  type="button"
                  onClick={() => {
                    setIsLocOpen(!isLocOpen);
                    setIsSpecOpen(false);
                    setIsLangOpen(false);
                    setIsSortOpen(false);
                  }}
                  className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-colors cursor-pointer ${
                    selectedLocation !== 'Any Location'
                      ? 'border-stone-900 bg-stone-50 text-stone-950 font-semibold'
                      : 'border-stone-200 bg-white text-stone-700 hover:border-stone-400'
                  }`}
                >
                  <MapPin className="w-3 h-3 text-stone-500 stroke-[1.5]" />
                  <span>{selectedLocation}</span>
                  <ChevronDown className={`w-3.5 h-3.5 text-stone-500 transition-transform ${isLocOpen ? 'rotate-180' : ''}`} />
                </button>

                {isLocOpen && (
                  <div className="absolute left-0 top-full mt-1 w-56 bg-white border border-stone-200 rounded-lg shadow-lg py-1 z-30 max-h-60 overflow-y-auto">
                    {LOCATION_OPTIONS.map((loc) => (
                      <button
                        key={loc}
                        type="button"
                        onClick={() => {
                          setSelectedLocation(loc);
                          setIsLocOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 text-xs font-medium hover:bg-stone-50 transition-colors ${
                          selectedLocation === loc ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-700'
                        }`}
                      >
                        {loc}
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {activeFiltersCount > 0 && (
                <button
                  type="button"
                  onClick={resetAllFilters}
                  className="text-xs text-stone-500 hover:text-stone-900 underline underline-offset-2 ml-1"
                >
                  Clear all ({activeFiltersCount})
                </button>
              )}
            </div>

            {/* Quick Link to Licensed Advisors Directory */}
            <Link
              to="/agents/advisors"
              className="text-xs font-medium text-stone-700 hover:text-stone-950 underline underline-offset-4 hidden lg:inline-flex items-center gap-1.5"
            >
              <span>Explore Licensed Advisors Directory</span>
              <ArrowRight className="w-3 h-3 stroke-[2]" />
            </Link>
          </div>
        </div>
      </section>

      {/* 3. Results Header & Sorting Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 border-b border-stone-200">
          <div>
            <h2 className="text-lg font-bold text-stone-950 tracking-tight">
              {filteredAgents.length > 0
                ? `Showing 1–${filteredAgents.length} of ${filteredAgents.length} verified real estate agents`
                : 'No agents found'}
            </h2>
            <p className="text-xs text-stone-500 mt-0.5">
              ESTRA Verified agents hold active state DRE licenses and verified career transaction volumes.
            </p>
          </div>

          {/* Sort By Dropdown */}
          <div className="relative self-start sm:self-auto">
            <div className="flex items-center gap-2 text-xs font-medium text-stone-600">
              <span>Sort by:</span>
              <button
                type="button"
                onClick={() => setIsSortOpen(!isSortOpen)}
                className="inline-flex items-center gap-1.5 font-semibold text-stone-900 bg-stone-100 hover:bg-stone-200 px-3 py-1.5 rounded-md border border-stone-200 transition-colors cursor-pointer"
              >
                <span>
                  {sortBy === 'recommended' && 'Recommended'}
                  {sortBy === 'volume-desc' && 'Sales Volume (High to Low)'}
                  {sortBy === 'deals-desc' && 'Total Deals Closed'}
                  {sortBy === 'rating-desc' && 'Highest Rated'}
                  {sortBy === 'exp-desc' && 'Years of Experience'}
                </span>
                <ChevronDown className="w-3.5 h-3.5 stroke-[2]" />
              </button>
            </div>

            {isSortOpen && (
              <div className="absolute right-0 top-full mt-1.5 w-60 bg-white border border-stone-200 rounded-lg shadow-xl py-1.5 z-30 text-xs font-medium">
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('recommended');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-stone-50 ${sortBy === 'recommended' ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-800'}`}
                >
                  Recommended
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('volume-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-stone-50 ${sortBy === 'volume-desc' ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-800'}`}
                >
                  Sales Volume (High to Low)
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('deals-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-stone-50 ${sortBy === 'deals-desc' ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-800'}`}
                >
                  Total Deals Closed
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('rating-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-stone-50 ${sortBy === 'rating-desc' ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-800'}`}
                >
                  Highest Rated
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setSortBy('exp-desc');
                    setIsSortOpen(false);
                  }}
                  className={`w-full text-left px-3.5 py-2 hover:bg-stone-50 ${sortBy === 'exp-desc' ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-800'}`}
                >
                  Years of Experience
                </button>
              </div>
            )}
          </div>
        </div>

        {/* 4. Agent Cards Grid (4-column responsive grid matching ESTRA design language) */}
        {filteredAgents.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 pt-8">
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden hover:border-stone-400 hover:shadow-md transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  {/* Portrait photo + Badges */}
                  <div className="relative aspect-[4/3] w-full overflow-hidden bg-stone-100">
                    <ImageWithFallback
                      src={agent.avatar}
                      alt={agent.name}
                      fallbackTitle={agent.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    />

                    {/* Top Badges */}
                    <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
                      <div className="bg-stone-950/85 backdrop-blur-xs text-white text-[9px] font-mono font-semibold uppercase tracking-wider px-2 py-0.5 rounded-xs flex items-center gap-1">
                        <CheckCircle2 className="w-2.5 h-2.5 text-emerald-400 stroke-[2.5]" />
                        <span>ESTRA VERIFIED</span>
                      </div>

                      {agent.isLuxuryExpert && (
                        <div className="bg-amber-950/85 text-amber-200 text-[8.5px] font-mono font-bold uppercase tracking-wider px-1.5 py-0.5 rounded-xs">
                          LUXURY
                        </div>
                      )}
                    </div>
                  </div>

                  {/* Body Content */}
                  <div className="p-4 sm:p-5 space-y-2.5">
                    {/* Agent Name */}
                    <div>
                      <Link
                        to={`/agents/${agent.slug || agent.id}`}
                        className="font-sans text-lg font-bold text-stone-950 tracking-tight leading-snug hover:text-stone-700 transition-colors block"
                      >
                        {agent.name}
                      </Link>

                      {/* Role & Location */}
                      <p className="text-xs text-stone-500 font-normal mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-stone-400 shrink-0 stroke-[1.5]" />
                        <span className="truncate">{agent.city || agent.officeLocation || 'Arlington, VA'}</span>
                      </p>
                    </div>

                    {/* License Number & Email */}
                    <div className="flex items-center justify-between text-[11px] font-mono text-stone-500 pt-0.5 border-t border-stone-100">
                      <span>{agent.licenseNumber.split('#')[0] || 'DRE'} #{agent.licenseNumber.split('#')[1] || '02194821'}</span>
                      <a
                        href={`mailto:${agent.email}`}
                        className="text-stone-700 hover:text-stone-950 hover:underline"
                        title={agent.email}
                      >
                        Email
                      </a>
                    </div>

                    {/* Metrics Grid: Sales Volume | Total Deals | Rating */}
                    <div className="grid grid-cols-3 text-left gap-1 py-2 bg-stone-50/80 rounded-lg px-2 border border-stone-100">
                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                          {agent.salesVolume || '$280M+'}
                        </div>
                        <div className="text-[8.5px] font-semibold text-stone-500 uppercase tracking-wider">
                          VOLUME
                        </div>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums">
                          {agent.totalDeals || agent.dealsClosed || 410}
                        </div>
                        <div className="text-[8.5px] font-semibold text-stone-500 uppercase tracking-wider">
                          DEALS
                        </div>
                      </div>

                      <div>
                        <div className="text-xs sm:text-sm font-bold text-stone-900 tabular-nums flex items-center gap-0.5">
                          <span>{agent.rating?.toFixed(1) || '4.9'}</span>
                          <Star className="w-3 h-3 fill-amber-400 text-amber-500 stroke-[1]" />
                        </div>
                        <div className="text-[8.5px] font-semibold text-stone-500 uppercase tracking-wider">
                          RATING
                        </div>
                      </div>
                    </div>

                    {/* Specializations Tags */}
                    <div className="flex flex-wrap gap-1 pt-1">
                      {agent.specializations.slice(0, 2).map((spec) => (
                        <span
                          key={spec}
                          className="inline-block px-2 py-0.5 text-[10px] font-medium bg-stone-100 text-stone-700 rounded-sm"
                        >
                          {spec}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Bottom Actions Row */}
                <div className="p-4 sm:p-5 pt-0 space-y-2">
                  <button
                    type="button"
                    onClick={() => handleOpenContact(agent)}
                    className="w-full py-2 px-3 bg-stone-900 hover:bg-black active:scale-95 text-white text-xs font-medium rounded-lg transition-all text-center cursor-pointer flex items-center justify-center gap-1.5"
                  >
                    <Mail className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Contact Agent</span>
                  </button>

                  <Link
                    to={`/agents/${agent.slug || agent.id}`}
                    className="w-full py-1.5 px-3 text-stone-700 hover:text-stone-950 hover:bg-stone-50 text-xs font-medium rounded-lg transition-colors text-center block"
                  >
                    View Profile & Listings →
                  </Link>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="border border-stone-200 rounded-xl p-12 text-center my-8 bg-stone-50/50 space-y-3">
            <h3 className="text-lg font-bold text-stone-900">
              No agents match your current filters
            </h3>
            <p className="text-xs text-stone-500 max-w-md mx-auto leading-relaxed">
              We couldn’t find an agent matching all your selected criteria. Try removing some filters or search for another city or neighborhood.
            </p>
            <button
              type="button"
              onClick={resetAllFilters}
              className="mt-2 px-4 py-2 bg-stone-900 hover:bg-black text-white text-xs font-medium rounded-md transition-colors"
            >
              Reset All Filters
            </button>
          </div>
        )}
      </main>

      {/* 5. Contact Agent Modal */}
      {contactAgent && (
        <div className="fixed inset-0 z-50 bg-black/60 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-white max-w-lg w-full rounded-xl border border-stone-200 shadow-2xl p-6 sm:p-8 space-y-5 my-8">
            {/* Modal Header */}
            <div className="flex items-start justify-between border-b border-stone-200 pb-4">
              <div className="flex items-center gap-3.5">
                <div className="w-12 h-12 rounded-full overflow-hidden bg-stone-100 shrink-0 border border-stone-200">
                  <ImageWithFallback
                    src={contactAgent.avatar}
                    alt={contactAgent.name}
                    containerClassName="w-full h-full"
                    className="w-full h-full object-cover object-top"
                  />
                </div>
                <div>
                  <h3 className="text-base font-bold text-stone-950 font-sans leading-tight">
                    Contact {contactAgent.name}
                  </h3>
                  <p className="text-xs text-stone-500 mt-0.5">
                    {contactAgent.role} · {contactAgent.licenseNumber}
                  </p>
                </div>
              </div>

              <button
                type="button"
                onClick={() => setContactAgent(null)}
                className="text-stone-400 hover:text-stone-700 p-1 rounded-md"
              >
                <X className="w-5 h-5 stroke-[1.5]" />
              </button>
            </div>

            {contactSubmitted ? (
              <div className="text-center py-8 space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h4 className="text-base font-bold text-stone-950">Inquiry Delivered</h4>
                <p className="text-xs text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. Your inquiry has been forwarded directly to <strong>{contactAgent.name}</strong>. You will receive a response within 24 hours.
                </p>
                <button
                  type="button"
                  onClick={() => setContactAgent(null)}
                  className="mt-4 px-5 py-2 bg-stone-900 text-white text-xs font-medium rounded-lg hover:bg-black"
                >
                  Done
                </button>
              </div>
            ) : (
              <form onSubmit={handleSubmitContact} className="space-y-4">
                {/* Inquiry Type Tabs */}
                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1.5">
                    How can {contactAgent.name.split(' ')[0]} help you?
                  </label>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
                    {[
                      { key: 'Buy', label: 'Buying a Home' },
                      { key: 'Sell', label: 'Selling Property' },
                      { key: 'Consultation', label: 'Private Advice' },
                      { key: 'Valuation', label: 'Valuation' },
                    ].map((item) => (
                      <button
                        key={item.key}
                        type="button"
                        onClick={() => setInquiryType(item.key as any)}
                        className={`py-2 px-2 text-xs font-medium rounded-md border text-center transition-colors cursor-pointer ${
                          inquiryType === item.key
                            ? 'bg-stone-900 text-white border-stone-900'
                            : 'bg-stone-50 border-stone-200 text-stone-700 hover:bg-stone-100'
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>

                {/* Name & Email */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Full Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="e.g. Jordan Sterling"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      value={contactEmail}
                      onChange={(e) => setContactEmail(e.target.value)}
                      placeholder="jordan@example.com"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                {/* Phone & Timeline */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Phone Number (optional)
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 000-0000"
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1">
                      Planning Timeline
                    </label>
                    <select
                      value={timeline}
                      onChange={(e) => setTimeline(e.target.value as any)}
                      className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-900 cursor-pointer"
                    >
                      <option value="immediate">Immediately</option>
                      <option value="1-3-months">Within 1 to 3 months</option>
                      <option value="3-6-months">Within 3 to 6 months</option>
                      <option value="curious">Just exploring options</option>
                    </select>
                  </div>
                </div>

                {/* Message */}
                <div>
                  <label className="block text-xs font-medium text-stone-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full px-3 py-2 bg-stone-50 border border-stone-200 rounded-md text-xs focus:outline-none focus:border-stone-900 resize-none"
                  />
                </div>

                {/* Submit Row */}
                <div className="pt-2 flex items-center justify-end gap-3">
                  <button
                    type="button"
                    onClick={() => setContactAgent(null)}
                    className="px-4 py-2 border border-stone-200 rounded-md text-xs font-medium text-stone-700 hover:bg-stone-50"
                  >
                    Cancel
                  </button>

                  <button
                    type="submit"
                    className="px-5 py-2 bg-stone-900 hover:bg-black active:scale-95 text-white rounded-md text-xs font-semibold transition-all inline-flex items-center gap-1.5"
                  >
                    <Send className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Send Inquiry</span>
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

export default FindAgentPage;
