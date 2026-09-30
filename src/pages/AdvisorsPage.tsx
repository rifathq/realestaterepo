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
  SlidersHorizontal,
  Compass
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useUserLocation } from '../hooks/useUserLocation';

const SPECIALIZATIONS = [
  'All Specializations',
  'Modernist Residential',
  'Prime Commercial',
  'Adaptive Reuse',
  'Luxury Residential',
  'Waterfront Estates',
  'Historic Properties',
  'New Construction',
  'Headquarters & Offices',
  'Investment Advisory',
];

export const AdvisorsPage: React.FC = () => {
  const [searchParams] = useSearchParams();
  const { city: hookCity, formattedLocation } = useUserLocation();

  const [searchQuery, setSearchQuery] = useState(searchParams.get('q') || searchParams.get('search') || '');
  const [selectedSpec, setSelectedSpec] = useState(searchParams.get('spec') || 'All Specializations');
  const [isSpecOpen, setIsSpecOpen] = useState(false);
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [isLocationModalOpen, setIsLocationModalOpen] = useState(false);
  const [customLocationInput, setCustomLocationInput] = useState('');

  // Location detection
  const currentCity = useMemo(() => {
    if (selectedLocation) return selectedLocation;
    if (hookCity) return hookCity;
    if (formattedLocation) return formattedLocation;
    return 'San Francisco & Silicon Valley';
  }, [selectedLocation, hookCity, formattedLocation]);

  // Filter advisors
  const filteredAdvisors = useMemo(() => {
    return AGENTS.filter((agent) => {
      // Search text
      if (searchQuery.trim()) {
        const q = searchQuery.toLowerCase().trim();
        const matchName = agent.name.toLowerCase().includes(q);
        const matchTitle = agent.role.toLowerCase().includes(q);
        const matchCity = (agent.city || agent.officeLocation || '').toLowerCase().includes(q);
        const matchAgency = (agent.agency || '').toLowerCase().includes(q);
        const matchBio = (agent.bio || '').toLowerCase().includes(q);
        const matchLicense = (agent.licenseNumber || '').toLowerCase().includes(q);
        const matchSpecs = agent.specializations.some((s) => s.toLowerCase().includes(q));

        if (!matchName && !matchTitle && !matchCity && !matchAgency && !matchBio && !matchLicense && !matchSpecs) {
          return false;
        }
      }

      // Specialization filter
      if (selectedSpec !== 'All Specializations') {
        const specLower = selectedSpec.toLowerCase();
        const hasSpec = agent.specializations.some((s) => 
          s.toLowerCase().includes(specLower) || specLower.includes(s.toLowerCase())
        );
        if (!hasSpec) return false;
      }

      return true;
    });
  }, [searchQuery, selectedSpec]);

  const handleApplyCustomLocation = (e: React.FormEvent) => {
    e.preventDefault();
    if (customLocationInput.trim()) {
      setSelectedLocation(customLocationInput.trim());
      setIsLocationModalOpen(false);
    }
  };

  return (
    <div className="min-h-screen bg-stone-50 text-stone-900 selection:bg-stone-900 selection:text-white">
      {/* 1. Header Section */}
      <section className="border-b border-stone-200 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12 sm:py-16">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
            <div className="max-w-3xl space-y-3">
              <div className="inline-flex items-center gap-2 text-[11px] font-mono uppercase tracking-widest text-stone-500 font-medium">
                <span className="w-1.5 h-1.5 rounded-full bg-stone-900" />
                <span>ESTRA ADVISORY NETWORK</span>
              </div>

              <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-sans">
                Licensed Real Estate Advisors
              </h1>

              <p className="text-base sm:text-lg text-stone-600 font-normal leading-relaxed">
                Partner with dedicated brokers specializing in commercial headquarters, residential architecture, and land entitlements.
              </p>
            </div>

            {/* Counter */}
            <div className="shrink-0 self-start md:self-end">
              <div className="inline-flex items-center gap-2 px-3.5 py-1.5 bg-stone-100 border border-stone-200 text-xs font-mono font-medium tracking-wide text-stone-800">
                <span className="w-2 h-2 rounded-full bg-emerald-500" />
                <span>
                  {String(filteredAdvisors.length).padStart(2, '0')} LICENSED ADVISORS AVAILABLE
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* 2. Location Indicator & Search Bar */}
      <section className="bg-white border-b border-stone-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6 space-y-4">
          {/* Location Bar */}
          <div className="flex flex-wrap items-center justify-between gap-3 text-xs sm:text-sm text-stone-600">
            <div className="flex items-center gap-2">
              <MapPin className="w-4 h-4 text-stone-900 stroke-[1.5]" />
              <span>
                Advisors near <strong className="text-stone-950 font-semibold">{currentCity}</strong>
              </span>
            </div>

            <div className="flex items-center gap-3">
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(true)}
                className="text-stone-900 underline underline-offset-4 hover:text-stone-700 font-medium cursor-pointer"
              >
                Change Location
              </button>
              {selectedLocation && (
                <button
                  type="button"
                  onClick={() => setSelectedLocation('')}
                  className="text-xs text-stone-500 hover:text-stone-800"
                >
                  (Reset to detected)
                </button>
              )}
            </div>
          </div>

          {/* Search & Specialization Filters */}
          <div className="flex flex-col sm:flex-row items-stretch gap-3">
            {/* Search Input */}
            <div className="flex-1 relative flex items-center bg-stone-50 border border-stone-200 focus-within:border-stone-900 focus-within:bg-white transition-colors">
              <Search className="w-4 h-4 text-stone-400 ml-3.5 mr-2 shrink-0 stroke-[1.5]" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search by advisor name, city, or agency..."
                className="w-full py-3 pr-8 bg-transparent text-sm text-stone-900 placeholder:text-stone-400 focus:outline-none"
              />
              {searchQuery && (
                <button
                  type="button"
                  onClick={() => setSearchQuery('')}
                  className="p-1 mr-2 text-stone-400 hover:text-stone-800"
                  aria-label="Clear search"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>

            {/* Specialization Dropdown */}
            <div className="relative min-w-[240px]">
              <button
                type="button"
                onClick={() => setIsSpecOpen(!isSpecOpen)}
                className="w-full flex items-center justify-between gap-3 px-4 py-3 bg-stone-50 border border-stone-200 text-sm font-medium text-stone-800 hover:bg-stone-100 transition-colors text-left"
              >
                <span className="truncate">{selectedSpec}</span>
                <ChevronDown className={`w-4 h-4 text-stone-500 shrink-0 transition-transform ${isSpecOpen ? 'rotate-180' : ''}`} />
              </button>

              {isSpecOpen && (
                <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-stone-200 shadow-lg py-1 z-30 max-h-64 overflow-y-auto">
                  {SPECIALIZATIONS.map((spec) => (
                    <button
                      key={spec}
                      type="button"
                      onClick={() => {
                        setSelectedSpec(spec);
                        setIsSpecOpen(false);
                      }}
                      className={`w-full text-left px-4 py-2.5 text-xs font-medium hover:bg-stone-50 transition-colors ${
                        selectedSpec === spec ? 'font-bold bg-stone-100 text-stone-950' : 'text-stone-700'
                      }`}
                    >
                      {spec}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      </section>

      {/* 3. Advisor Grid: 2 Columns Desktop / 1 Column Mobile */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-10 sm:py-14">
        {filteredAdvisors.length > 0 ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-8">
            {filteredAdvisors.map((advisor) => (
              <article
                key={advisor.id}
                className="bg-white border border-stone-200 p-6 sm:p-7 flex flex-col sm:flex-row gap-6 hover:border-stone-400 hover:shadow-sm transition-all duration-200"
              >
                {/* Advisor Avatar */}
                <div className="shrink-0 self-start sm:self-auto">
                  <div className="relative w-28 h-36 sm:w-32 sm:h-40 overflow-hidden bg-stone-100 border border-stone-200">
                    <ImageWithFallback
                      src={advisor.avatar}
                      alt={advisor.name}
                      fallbackTitle={advisor.name}
                      containerClassName="w-full h-full"
                      className="w-full h-full object-cover object-top"
                    />
                    <div className="absolute bottom-0 inset-x-0 bg-gradient-to-t from-black/60 to-transparent p-1.5">
                      <span className="text-[10px] text-white font-mono tracking-wider">
                        {advisor.licenseNumber.split('#')[0] || 'LICENSED'}
                      </span>
                    </div>
                  </div>
                </div>

                {/* Advisor Details */}
                <div className="flex-1 flex flex-col justify-between space-y-3">
                  <div>
                    {/* License Eyebrow */}
                    <div className="text-[11px] font-mono tracking-wider text-stone-500 uppercase">
                      {advisor.licenseNumber || 'CA-DRE #02194821'}
                    </div>

                    {/* Advisor Name */}
                    <Link
                      to={`/agents/${advisor.slug || advisor.id}`}
                      className="text-xl font-bold tracking-tight text-stone-950 hover:text-stone-700 transition-colors inline-block mt-0.5"
                    >
                      {advisor.name}
                    </Link>

                    {/* Title & Agency */}
                    <div className="text-xs font-semibold text-stone-800">
                      {advisor.role || 'Principal Architectural Broker'} · {advisor.agency || 'ESTRA Advisory'}
                    </div>

                    {/* Location */}
                    <div className="text-xs text-stone-500 mt-0.5 flex items-center gap-1">
                      <MapPin className="w-3 h-3 text-stone-400 stroke-[1.5]" />
                      <span>{advisor.officeLocation || advisor.city || currentCity}</span>
                    </div>

                    {/* Short Description */}
                    <p className="text-xs text-stone-600 leading-relaxed mt-2 line-clamp-3">
                      “{advisor.bio}”
                    </p>

                    {/* Specializations list */}
                    <div className="mt-3 text-xs text-stone-600">
                      <span className="font-semibold text-stone-800">Specializations: </span>
                      <span>{advisor.specializations.slice(0, 3).join(' · ')}</span>
                    </div>
                  </div>

                  {/* Metrics & Action Row */}
                  <div className="pt-3 border-t border-stone-100 flex flex-wrap items-center justify-between gap-3">
                    <div className="flex items-center gap-3 text-xs text-stone-700 font-medium">
                      <span>{advisor.yearsExperience || 14} yrs exp.</span>
                      <span className="text-stone-300">•</span>
                      <span>{advisor.totalDeals || advisor.dealsClosed || 142} deals</span>
                      <span className="text-stone-300">•</span>
                      <span>{advisor.activeListingsCount || 6} active listings</span>
                      <span className="text-stone-300">•</span>
                      <span className="text-emerald-700 font-semibold">
                        {advisor.satisfactionRating || 99}% Satisfaction
                      </span>
                    </div>

                    <Link
                      to={`/agents/${advisor.slug || advisor.id}`}
                      className="inline-flex items-center gap-1.5 px-4 py-2 bg-stone-900 hover:bg-black active:scale-95 text-white text-xs font-medium transition-all"
                    >
                      <span>View Profile & Listings</span>
                      <ArrowRight className="w-3 h-3 stroke-[2]" />
                    </Link>
                  </div>
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 bg-white border border-stone-200 p-8 space-y-3">
            <Compass className="w-8 h-8 text-stone-400 mx-auto stroke-[1.5]" />
            <h3 className="text-lg font-bold text-stone-900">No advisors match your search criteria</h3>
            <p className="text-xs text-stone-500 max-w-sm mx-auto">
              Try adjusting your search query or reset the specialization filter to view all verified brokers.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpec('All Specializations');
              }}
              className="mt-2 px-4 py-2 bg-stone-900 text-white text-xs font-medium hover:bg-black transition-colors"
            >
              Reset Filters
            </button>
          </div>
        )}
      </main>

      {/* Location Modal */}
      {isLocationModalOpen && (
        <div className="fixed inset-0 z-50 bg-black/50 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white max-w-md w-full border border-stone-200 shadow-2xl p-6 space-y-4">
            <div className="flex items-center justify-between border-b border-stone-200 pb-3">
              <h3 className="text-base font-bold text-stone-950 font-sans">Change Market Location</h3>
              <button
                type="button"
                onClick={() => setIsLocationModalOpen(false)}
                className="text-stone-400 hover:text-stone-700"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <p className="text-xs text-stone-600 leading-relaxed">
              Enter your desired metropolitan area, city, or state to discover licensed advisors in that region.
            </p>

            <form onSubmit={handleApplyCustomLocation} className="space-y-3">
              <input
                type="text"
                value={customLocationInput}
                onChange={(e) => setCustomLocationInput(e.target.value)}
                placeholder="e.g. San Francisco, CA or Arlington, VA"
                className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm focus:outline-none focus:border-stone-900"
                autoFocus
              />

              <div className="flex items-center justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setIsLocationModalOpen(false)}
                  className="px-4 py-2 border border-stone-200 text-xs font-medium text-stone-700 hover:bg-stone-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-stone-900 text-white text-xs font-medium hover:bg-black"
                >
                  Apply Location
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AdvisorsPage;
