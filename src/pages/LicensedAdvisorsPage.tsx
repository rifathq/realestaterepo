import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  ShieldCheck, 
  Award, 
  Star, 
  X, 
  CheckCircle2, 
  Phone, 
  Mail, 
  MapPin, 
  ArrowRight,
  SlidersHorizontal,
  Building2,
  Sparkles,
  ExternalLink
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { useMarketplace } from '../context/MarketplaceContext';

type SortOption = 'recommended' | 'volume' | 'deals' | 'rating';

export const LicensedAdvisorsPage: React.FC = () => {
  const { notify } = useMarketplace();

  // Primary 9 licensed advisors (principals, managing directors, partners, and senior advisors)
  // Ordered with prominent advisors Elena Vance and Marcus Chen featured at the top
  const initialAdvisors = useMemo(() => {
    // Filter licensed advisors (exclude junior associate agents if any)
    const licensedOnly = AGENTS.filter((a) => !a.role.toLowerCase().includes('associate agent'));
    
    // Sort so Elena Vance and Marcus Chen are featured upfront, followed by the rest
    const featuredSlugs = ['elena-vance', 'marcus-chen'];
    return [...licensedOnly].sort((a, b) => {
      const aFeatured = featuredSlugs.indexOf(a.slug);
      const bFeatured = featuredSlugs.indexOf(b.slug);
      if (aFeatured !== -1 && bFeatured !== -1) return aFeatured - bFeatured;
      if (aFeatured !== -1) return -1;
      if (bFeatured !== -1) return 1;
      return (b.totalDeals || b.dealsClosed) - (a.totalDeals || a.dealsClosed);
    });
  }, []);

  const [searchTerm, setSearchTerm] = useState('');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All Specializations');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [sortOpen, setSortOpen] = useState(false);
  const [showOnlyVerified, setShowOnlyVerified] = useState(false);

  // Quick Inquire Modal State
  const [contactAdvisor, setContactAdvisor] = useState<Agent | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  // Extract all unique specializations across agents
  const allSpecializations = useMemo(() => {
    const set = new Set<string>();
    AGENTS.forEach((agent) => {
      agent.specializations?.forEach((spec) => set.add(spec));
    });
    return ['All Specializations', ...Array.from(set).sort()];
  }, []);

  // Filter and sort advisors
  const filteredAdvisors = useMemo(() => {
    let result = initialAdvisors.filter((agent) => {
      // 1. Search by advisor name, location, or agency
      if (searchTerm.trim()) {
        const query = searchTerm.toLowerCase().trim();
        const matchName = agent.name.toLowerCase().includes(query);
        const matchLocation = agent.officeLocation.toLowerCase().includes(query) ||
                              (agent.city && agent.city.toLowerCase().includes(query));
        const matchAgency = agent.agency.toLowerCase().includes(query);
        const matchLicense = agent.licenseNumber.toLowerCase().includes(query);
        const matchSpec = agent.specializations.some((s) => s.toLowerCase().includes(query));

        if (!matchName && !matchLocation && !matchAgency && !matchLicense && !matchSpec) {
          return false;
        }
      }

      // 2. Filter by specialization
      if (selectedSpecialization !== 'All Specializations') {
        const hasSpec = agent.specializations.some((s) => 
          s.toLowerCase() === selectedSpecialization.toLowerCase()
        );
        if (!hasSpec) return false;
      }

      // 3. Verified / Luxury expert only toggle
      if (showOnlyVerified && !agent.isLuxuryExpert) {
        return false;
      }

      return true;
    });

    // Sorting
    return result.sort((a, b) => {
      if (sortBy === 'volume') {
        const parseVol = (vol?: string) => {
          if (!vol) return 0;
          return parseFloat(vol.replace(/[^0-9.]/g, '')) || 0;
        };
        return parseVol(b.salesVolume) - parseVol(a.salesVolume);
      }
      if (sortBy === 'deals') {
        return (b.totalDeals || b.dealsClosed) - (a.totalDeals || a.dealsClosed);
      }
      if (sortBy === 'rating') {
        return (b.rating || (b.satisfactionRating / 20)) - (a.rating || (a.satisfactionRating / 20));
      }
      // 'recommended': Elena Vance and Marcus Chen first, then high rating & volume
      const featuredSlugs = ['elena-vance', 'marcus-chen'];
      const aIndex = featuredSlugs.indexOf(a.slug);
      const bIndex = featuredSlugs.indexOf(b.slug);
      if (aIndex !== -1 && bIndex !== -1) return aIndex - bIndex;
      if (aIndex !== -1) return -1;
      if (bIndex !== -1) return 1;
      return (b.totalDeals || b.dealsClosed) - (a.totalDeals || a.dealsClosed);
    });
  }, [initialAdvisors, searchTerm, selectedSpecialization, sortBy, showOnlyVerified]);

  const handleOpenContact = (agent: Agent) => {
    setContactAdvisor(agent);
    setSubmitted(false);
    setContactMessage(`Hello ${agent.name}, I would like to schedule a private advisory consultation regarding property acquisitions and active listings.`);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify(`Inquiry sent to ${contactAdvisor?.name}! An advisor will contact you within 2 business hours.`);
    setTimeout(() => {
      setContactAdvisor(null);
      setSubmitted(false);
    }, 2200);
  };

  const sortLabels: Record<SortOption, string> = {
    recommended: 'Recommended',
    volume: 'Sales Volume',
    deals: 'Total Deals',
    rating: 'Highest Rating'
  };

  // Formatted counter with leading zero, e.g. "09 LICENSED ADVISORS AVAILABLE"
  const formattedCount = String(filteredAdvisors.length).padStart(2, '0');

  return (
    <div className="w-full bg-[#fafafa] min-h-screen">
      {/* Top Header Section */}
      <section className="bg-white border-b border-stone-200 pt-10 sm:pt-14 pb-10">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="space-y-3 max-w-3xl">
              <div className="inline-flex items-center gap-2 px-2.5 py-1 bg-stone-100 text-stone-700 text-[11px] font-semibold tracking-wider uppercase border border-stone-200">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                <span>Verified Broker Directory</span>
              </div>
              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-stone-950 font-architectural">
                Licensed Real Estate Advisors
              </h1>
              <p className="text-stone-600 text-sm sm:text-base leading-relaxed">
                Explore verified real estate advisors and brokers specializing in luxury estates, prime commercial transactions, and private client representation across premier metropolitan corridors.
              </p>
            </div>

            {/* Quick stats counter pill */}
            <div className="shrink-0 bg-stone-900 text-white px-5 py-3.5 rounded-sm shadow-xs flex items-center gap-4">
              <div>
                <span className="font-mono text-2xl font-bold tracking-tight text-white block">
                  {formattedCount}
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  Licensed Advisors
                </span>
              </div>
              <div className="h-8 w-px bg-stone-700" />
              <div>
                <span className="font-mono text-sm font-bold text-emerald-400 block flex items-center gap-1">
                  100%
                </span>
                <span className="text-[10px] uppercase tracking-wider text-stone-400 font-semibold block">
                  State Regulated
                </span>
              </div>
            </div>
          </div>

          {/* Search Bar & Filters Strip */}
          <div className="mt-8 pt-6 border-t border-stone-100 grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
            {/* Search Input: "Search by advisor name..." */}
            <div className="lg:col-span-6 relative">
              <div className="relative flex items-center bg-white border border-stone-300 rounded-md focus-within:border-stone-900 focus-within:ring-1 focus-within:ring-stone-900 transition-all shadow-2xs overflow-hidden pl-3.5 pr-2 py-2">
                <Search className="w-4 h-4 text-stone-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  placeholder="Search by advisor name..."
                  className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none bg-transparent"
                />
                {searchTerm && (
                  <button
                    type="button"
                    onClick={() => setSearchTerm('')}
                    className="p-1 text-stone-400 hover:text-stone-700 transition-colors mr-1 cursor-pointer"
                    title="Clear search"
                  >
                    <X className="w-4 h-4" />
                  </button>
                )}
              </div>
            </div>

            {/* "All Specializations" Filter Dropdown */}
            <div className="lg:col-span-3 relative">
              <div className="relative">
                <select
                  value={selectedSpecialization}
                  onChange={(e) => setSelectedSpecialization(e.target.value)}
                  className="w-full appearance-none bg-white border border-stone-300 rounded-md px-3.5 pr-8 py-2.5 text-xs sm:text-sm font-medium text-stone-800 hover:border-stone-400 focus:outline-none focus:border-stone-900 focus:ring-1 focus:ring-stone-900 cursor-pointer shadow-2xs"
                  aria-label="Filter by specialization"
                >
                  {allSpecializations.map((spec) => (
                    <option key={spec} value={spec}>
                      {spec}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-4 h-4 text-stone-500 absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

            {/* Sort Dropdown */}
            <div className="lg:col-span-3 relative flex items-center justify-between lg:justify-end gap-2">
              <span className="text-xs text-stone-500 hidden sm:inline">Sort:</span>
              <div className="relative w-full lg:w-auto">
                <button
                  type="button"
                  onClick={() => setSortOpen((prev) => !prev)}
                  className="w-full lg:w-auto inline-flex items-center justify-between gap-2 px-3.5 py-2.5 bg-white border border-stone-300 rounded-md text-xs sm:text-sm font-medium text-stone-800 hover:border-stone-400 cursor-pointer shadow-2xs"
                >
                  <span className="font-semibold text-stone-900">{sortLabels[sortBy]}</span>
                  <ChevronDown className="w-4 h-4 text-stone-500" />
                </button>

                {sortOpen && (
                  <div className="absolute right-0 top-full mt-1.5 w-48 bg-white border border-stone-200 rounded-lg shadow-xl py-1 z-30 text-xs">
                    {(['recommended', 'volume', 'deals', 'rating'] as SortOption[]).map((option) => (
                      <button
                        key={option}
                        type="button"
                        onClick={() => {
                          setSortBy(option);
                          setSortOpen(false);
                        }}
                        className={`w-full text-left px-3.5 py-2 transition-colors ${
                          sortBy === option
                            ? 'bg-stone-100 font-semibold text-stone-950'
                            : 'text-stone-700 hover:bg-stone-50'
                        }`}
                      >
                        {sortLabels[option]}
                      </button>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Main Content Area */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-10 space-y-6">
        
        {/* Counter & Active Filter Bar */}
        <div className="flex flex-wrap items-center justify-between gap-3 pb-3 border-b border-stone-200">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs sm:text-sm font-bold tracking-wider text-stone-950 uppercase">
              {formattedCount} LICENSED ADVISORS AVAILABLE
            </span>
            {selectedSpecialization !== 'All Specializations' && (
              <span className="inline-flex items-center gap-1.5 text-xs bg-stone-200 text-stone-800 px-2.5 py-0.5 rounded-full">
                <span>{selectedSpecialization}</span>
                <button
                  onClick={() => setSelectedSpecialization('All Specializations')}
                  className="hover:text-stone-950"
                  title="Remove filter"
                >
                  <X className="w-3 h-3" />
                </button>
              </span>
            )}
          </div>

          {(searchTerm || selectedSpecialization !== 'All Specializations') && (
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('All Specializations');
              }}
              className="text-xs text-stone-500 hover:text-stone-950 underline underline-offset-2 transition-colors cursor-pointer"
            >
              Reset all filters
            </button>
          )}
        </div>

        {/* Empty State */}
        {filteredAdvisors.length === 0 ? (
          <div className="bg-white border border-stone-200 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4 my-10 shadow-xs">
            <Search className="w-10 h-10 text-stone-400 mx-auto" />
            <h3 className="text-xl font-bold text-stone-900">No Licensed Advisors Found</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              No verified advisors matched your filter criteria for "{searchTerm || selectedSpecialization}". Try adjusting your keywords or viewing all specializations.
            </p>
            <button
              onClick={() => {
                setSearchTerm('');
                setSelectedSpecialization('All Specializations');
              }}
              className="px-5 py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
            >
              Reset Filters & Show All Advisors
            </button>
          </div>
        ) : (
          /* Advisor Cards Grid */
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-7">
            {filteredAdvisors.map((advisor) => (
              <div
                key={advisor.id}
                className="bg-white border border-stone-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Advisor Photo & Visual Badges Container */}
                <div className="relative aspect-4/3 w-full bg-stone-100 overflow-hidden">
                  {/* Tag Badges: Status & License */}
                  <div className="absolute top-3 left-3 z-10 flex flex-col gap-1.5 items-start">
                    <span className="inline-flex items-center gap-1 bg-stone-950/85 backdrop-blur-xs text-white text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-xs">
                      <ShieldCheck className="w-3 h-3 text-emerald-400" />
                      <span>{advisor.isLuxuryExpert ? 'Luxury Specialist' : 'Verified Broker'}</span>
                    </span>
                  </div>

                  <div className="absolute top-3 right-3 z-10">
                    <span className="font-mono text-[10px] font-medium bg-white/95 backdrop-blur-xs text-stone-800 px-2 py-0.5 rounded-xs border border-stone-200 shadow-2xs">
                      {advisor.licenseNumber}
                    </span>
                  </div>

                  <img
                    src={advisor.avatar}
                    alt={advisor.name}
                    className="w-full h-full object-cover object-top group-hover:scale-102 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Advisor Card Details */}
                <div className="p-5 flex flex-col flex-1">
                  
                  {/* Name and Verification */}
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <h3 className="font-bold text-lg text-stone-950 tracking-tight leading-snug group-hover:text-stone-700 transition-colors">
                        {advisor.name}
                      </h3>
                      <p className="text-xs text-stone-600 mt-0.5 font-normal">
                        {advisor.role}
                      </p>
                    </div>
                    <div className="flex items-center gap-1 bg-amber-50 text-amber-900 border border-amber-200 px-1.5 py-0.5 rounded text-[11px] font-bold shrink-0">
                      <Star className="w-3 h-3 fill-amber-400 text-amber-500" />
                      <span>{advisor.rating ? advisor.rating.toFixed(1) : '4.9'}</span>
                    </div>
                  </div>

                  {/* Agency & Location */}
                  <div className="mt-2 text-xs text-stone-500 flex items-center gap-1.5 truncate">
                    <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0" />
                    <span className="truncate">{advisor.officeLocation || `${advisor.city}, ${advisor.state}`}</span>
                  </div>

                  {/* Specializations Tag Badges */}
                  <div className="mt-3.5 flex flex-wrap gap-1.5">
                    {advisor.specializations.slice(0, 3).map((spec) => (
                      <span
                        key={spec}
                        className="inline-block text-[10px] font-medium px-2 py-0.5 bg-stone-100 text-stone-700 rounded border border-stone-200"
                      >
                        {spec}
                      </span>
                    ))}
                  </div>

                  {/* Performance Metrics Bar: 3 Columns */}
                  <div className="grid grid-cols-3 divide-x divide-stone-200 text-left my-4 pt-3.5 border-t border-stone-100">
                    <div className="pr-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block truncate">
                        {advisor.salesVolume || '$145.0M'}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-tight block truncate mt-0.5">
                        Sales Volume
                      </span>
                    </div>

                    <div className="px-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        {advisor.totalDeals || advisor.dealsClosed}
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-tight block truncate mt-0.5">
                        Deals Closed
                      </span>
                    </div>

                    <div className="pl-2">
                      <span className="font-bold text-xs sm:text-sm text-stone-900 block">
                        {advisor.yearsExperience}+ Yrs
                      </span>
                      <span className="text-[10px] text-stone-500 uppercase tracking-tight block truncate mt-0.5">
                        Experience
                      </span>
                    </div>
                  </div>

                  {/* Click Actions: "View Profile & Listings" and "Contact" */}
                  <div className="mt-auto pt-2 space-y-2">
                    <Link
                      to={`/agents/${advisor.slug}`}
                      className="w-full inline-flex items-center justify-center gap-2 py-2.5 px-4 rounded-md bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold transition-colors shadow-2xs text-center cursor-pointer group/btn"
                    >
                      <span>View Profile & Listings</span>
                      <ArrowRight className="w-3.5 h-3.5 group-hover/btn:translate-x-0.5 transition-transform" />
                    </Link>

                    <button
                      type="button"
                      onClick={() => handleOpenContact(advisor)}
                      className="w-full py-2 px-4 rounded-md border border-stone-300 hover:border-stone-900 hover:bg-stone-50 text-xs font-semibold text-stone-800 transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Contact Advisor
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

        {/* Regulatory & Advisory Standards Banner */}
        <section className="mt-12 bg-white border border-stone-200 rounded-xl p-6 sm:p-8 shadow-xs">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-stone-100 rounded-lg text-stone-900 shrink-0">
                <ShieldCheck className="w-5 h-5 text-emerald-600" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">State DRE Licensed</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Every listed advisor maintains an active broker or managing principal license verified through state regulatory boards.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-stone-100 rounded-lg text-stone-900 shrink-0">
                <Award className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Fiduciary Standards</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Advisors adhere to stringent client confidentiality, bespoke contract negotiation, and fiduciary representation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-3.5">
              <div className="p-2.5 bg-stone-100 rounded-lg text-stone-900 shrink-0">
                <Building2 className="w-5 h-5 text-stone-800" />
              </div>
              <div>
                <h4 className="text-sm font-bold text-stone-900">Off-Market Access</h4>
                <p className="text-xs text-stone-500 mt-1 leading-relaxed">
                  Direct portfolio access to unlisted architectural landmarks, private estates, and institutional commercial inventory.
                </p>
              </div>
            </div>
          </div>
        </section>

      </main>

      {/* Interactive Contact Advisor Modal */}
      {contactAdvisor && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-stone-200 relative">
            <button
              onClick={() => setContactAdvisor(null)}
              className="absolute top-4 right-4 p-1.5 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {submitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold text-stone-900">Inquiry Dispatched</h3>
                <p className="text-xs sm:text-sm text-stone-600 max-w-xs mx-auto">
                  Your confidential advisory request has been delivered to {contactAdvisor.name}.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div className="flex items-center gap-3.5 pb-4 border-b border-stone-100">
                  <img
                    src={contactAdvisor.avatar}
                    alt={contactAdvisor.name}
                    className="w-14 h-14 rounded-full object-cover border border-stone-200"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-stone-900 leading-tight">
                      Contact {contactAdvisor.name}
                    </h3>
                    <p className="text-xs text-stone-600">
                      {contactAdvisor.role} • {contactAdvisor.city || 'Licensed Advisor'}
                    </p>
                    <p className="text-[11px] font-mono text-stone-400 mt-0.5">
                      {contactAdvisor.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (555) 019-2831"
                      className="w-full text-xs p-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 mb-1">
                    Consultation Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-300 rounded-md focus:outline-none focus:border-stone-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-2.5 bg-stone-900 hover:bg-stone-800 text-white text-xs font-semibold rounded-md transition-colors cursor-pointer"
                  >
                    Send Confidential Inquiry
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

export default LicensedAdvisorsPage;
