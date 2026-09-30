import React, { useState, useMemo, useEffect } from 'react';
import { useLocation, useSearchParams, Link } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  Star, 
  X, 
  CheckCircle2, 
  Mail, 
  Phone, 
  ShieldCheck, 
  Award,
  Sparkles
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { useMarketplace } from '../context/MarketplaceContext';

interface AgentsPageProps {
  defaultCity?: string;
}

type DealTypeFilter = 'All' | 'Buy' | 'Sell';
type SortOption = 'recommended' | 'volume' | 'deals' | 'rating';

export const AgentsPage: React.FC<AgentsPageProps> = ({ defaultCity }) => {
  const location = useLocation();
  const [searchParams] = useSearchParams();
  const { notify } = useMarketplace();

  // Read city from query parameters (?city=...)
  const cityQuery = searchParams.get('city') || '';
  const isArlingtonPath = defaultCity === 'Arlington, VA' || location.pathname === '/agents/arlington';
  const initialSearch = cityQuery || (isArlingtonPath ? 'Arlington' : (defaultCity || ''));
  
  const [searchInput, setSearchInput] = useState(initialSearch);
  const [activeSearch, setActiveSearch] = useState(initialSearch);
  const [dealType, setDealType] = useState<DealTypeFilter>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [sortBy, setSortBy] = useState<SortOption>('recommended');
  const [sortDropdownOpen, setSortDropdownOpen] = useState(false);

  // Sync active search if query param changes externally
  useEffect(() => {
    if (cityQuery) {
      setSearchInput(cityQuery);
      setActiveSearch(cityQuery);
    }
  }, [cityQuery]);

  // Contact Modal State
  const [contactAgent, setContactAgent] = useState<Agent | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactPhone, setContactPhone] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // Available languages across agents
  const availableLanguages = ['All languages', 'English', 'Spanish', 'Mandarin', 'French', 'German', 'Italian', 'Korean'];

  // Handle Search Submission
  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setActiveSearch(searchInput.trim());
  };

  // Reset or clear search
  const handleClearSearch = () => {
    setSearchInput('');
    setActiveSearch('');
  };

  // Filter and Sort Agents
  const filteredAndSortedAgents = useMemo(() => {
    let result = AGENTS.filter((agent) => {
      // 1. Text Search (City, Address, Agent Name, State, Specialization)
      if (activeSearch.trim()) {
        const fullQuery = activeSearch.toLowerCase().trim();
        const cityPart = fullQuery.includes(',') ? fullQuery.split(',')[0].trim() : fullQuery;

        const matchName = agent.name.toLowerCase().includes(fullQuery);
        const matchLocation = agent.officeLocation.toLowerCase().includes(fullQuery) ||
                              agent.officeLocation.toLowerCase().includes(cityPart);
        const matchCity = (agent.city && (
          agent.city.toLowerCase().includes(fullQuery) || 
          agent.city.toLowerCase().includes(cityPart) ||
          cityPart.includes(agent.city.toLowerCase())
        )) ?? false;
        const matchState = agent.state?.toLowerCase().includes(fullQuery) ?? false;
        const matchSpecialization = agent.specializations.some((s) => s.toLowerCase().includes(fullQuery));
        const matchAgency = agent.agency.toLowerCase().includes(fullQuery);

        if (!matchName && !matchLocation && !matchCity && !matchState && !matchSpecialization && !matchAgency) {
          return false;
        }
      }

      // 2. Buy / Sell / All Filter
      if (dealType !== 'All') {
        if (agent.dealType && agent.dealType !== 'Both' && agent.dealType !== dealType) {
          return false;
        }
      }

      // 3. Language Filter
      if (selectedLanguage !== 'All' && selectedLanguage !== 'All languages') {
        if (!agent.languages.includes(selectedLanguage)) {
          return false;
        }
      }

      return true;
    });

    // Sort Logic
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
      // 'recommended' default: luxury experts first, then highest volume
      if (a.isLuxuryExpert && !b.isLuxuryExpert) return -1;
      if (!a.isLuxuryExpert && b.isLuxuryExpert) return 1;
      return (b.totalDeals || b.dealsClosed) - (a.totalDeals || a.dealsClosed);
    });
  }, [activeSearch, dealType, selectedLanguage, sortBy]);

  // Dynamic City Name for Heading
  const dynamicCity = useMemo(() => {
    if (activeSearch.toLowerCase().includes('arlington')) return 'Arlington, VA';
    if (activeSearch.toLowerCase().includes('chicago')) return 'Chicago, IL';
    if (activeSearch.toLowerCase().includes('san francisco')) return 'San Francisco, CA';
    if (activeSearch.toLowerCase().includes('new york')) return 'New York, NY';
    if (activeSearch.toLowerCase().includes('austin')) return 'Austin, TX';
    if (activeSearch.trim()) return activeSearch.trim();
    if (cityQuery) return cityQuery;
    if (isArlingtonPath) return 'Arlington, VA';
    return defaultCity || 'Arlington, VA';
  }, [activeSearch, cityQuery, isArlingtonPath, defaultCity]);

  // Contact Modal Handlers
  const handleOpenContact = (agent: Agent) => {
    setContactAgent(agent);
    setContactSubmitted(false);
    setContactMessage(`Hi ${agent.name}, I am interested in advisory services and listings in ${agent.city || 'Arlington, VA'}.`);
  };

  const handleSendContact = (e: React.FormEvent) => {
    e.preventDefault();
    setContactSubmitted(true);
    notify(`Inquiry successfully sent to ${contactAgent?.name}!`);
    setTimeout(() => {
      setContactAgent(null);
      setContactSubmitted(false);
    }, 2200);
  };

  const sortLabels: Record<SortOption, string> = {
    recommended: 'Recommended',
    volume: 'Sales Volume',
    deals: 'Total Deals',
    rating: 'Highest Rating'
  };

  return (
    <div className="w-full bg-[#fbfbfb] min-h-screen">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 space-y-8">
        
        {/* 1. Header & Intro Section */}
        <div className="space-y-3">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <Link
              to="/agents/advisors"
              className="inline-flex items-center gap-2 text-xs font-medium px-3.5 py-1.5 bg-black hover:bg-neutral-900 active:scale-95 text-white rounded-md border border-black shadow-md hover:shadow-lg transition-all duration-200 group"
            >
              <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
              <span className="text-white font-medium">Looking for verified brokers? Visit Licensed Advisors</span>
              <span className="text-white group-hover:translate-x-0.5 transition-transform">→</span>
            </Link>
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold tracking-tight text-neutral-900 leading-[1.15]">
            Find the most experienced real estate agents in {dynamicCity}
          </h1>
          <p className="text-sm sm:text-base text-neutral-600 max-w-3xl leading-relaxed">
            Digentic Realty agents close twice as many deals. We're local experts who know how to help you win in today's market.
          </p>
        </div>

        {/* 2. Search & Filter Bar */}
        <div className="space-y-4 pt-1">
          <div className="flex flex-col lg:flex-row items-stretch lg:items-center gap-3">
            
            {/* Search Input Box with Red Button */}
            <form onSubmit={handleSearchSubmit} className="flex-1 relative flex items-center">
              <div className="relative w-full flex items-center bg-white border border-neutral-300 rounded-md shadow-2xs focus-within:border-neutral-900 focus-within:ring-1 focus-within:ring-neutral-900 transition-all overflow-hidden pl-3.5 pr-2 py-1.5">
                <Search className="w-4 h-4 text-neutral-400 shrink-0 mr-2.5" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="City, Address, School, Agent, ZIP"
                  className="w-full text-xs sm:text-sm text-neutral-800 placeholder:text-neutral-400 focus:outline-none bg-transparent py-1"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={handleClearSearch}
                    className="p-1 mr-2 text-neutral-400 hover:text-neutral-700"
                    title="Clear"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
                <button
                  type="submit"
                  className="bg-[#d9383a] hover:bg-[#c22d2f] text-white text-xs sm:text-sm font-semibold px-4 sm:px-5 py-1.5 rounded-full transition-colors shadow-xs shrink-0 cursor-pointer"
                >
                  Search
                </button>
              </div>
            </form>

            {/* Filter Controls Row */}
            <div className="flex flex-wrap sm:flex-nowrap items-center gap-3">
              {/* Buy / Sell / All Segmented Buttons */}
              <div className="inline-flex rounded-md border border-neutral-300 overflow-hidden bg-white shadow-2xs text-xs sm:text-sm font-medium">
                <button
                  type="button"
                  onClick={() => setDealType('Buy')}
                  className={`px-4 sm:px-5 py-2 transition-colors border-r border-neutral-200 cursor-pointer ${
                    dealType === 'Buy'
                      ? 'bg-[#0c6b73] text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Buy
                </button>
                <button
                  type="button"
                  onClick={() => setDealType('Sell')}
                  className={`px-4 sm:px-5 py-2 transition-colors border-r border-neutral-200 cursor-pointer ${
                    dealType === 'Sell'
                      ? 'bg-[#0c6b73] text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  Sell
                </button>
                <button
                  type="button"
                  onClick={() => setDealType('All')}
                  className={`px-4 sm:px-5 py-2 transition-colors cursor-pointer ${
                    dealType === 'All'
                      ? 'bg-[#0c6b73] text-white font-semibold'
                      : 'text-neutral-700 hover:bg-neutral-50'
                  }`}
                >
                  All
                </button>
              </div>

              {/* Languages Dropdown */}
              <div className="relative">
                <select
                  value={selectedLanguage}
                  onChange={(e) => setSelectedLanguage(e.target.value)}
                  className="appearance-none bg-white border border-neutral-300 rounded-md px-3.5 pr-8 py-2 text-xs sm:text-sm font-medium text-neutral-700 hover:border-neutral-400 focus:outline-none focus:border-neutral-900 cursor-pointer shadow-2xs"
                >
                  {availableLanguages.map((lang) => (
                    <option key={lang} value={lang}>
                      {lang}
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500 absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none" />
              </div>
            </div>

          </div>

          {/* Results Summary Header & Sorting */}
          <div className="flex flex-wrap items-center justify-between text-xs sm:text-sm text-neutral-600 pt-2 border-b border-neutral-200 pb-3 gap-2">
            <div>
              <span className="font-semibold text-neutral-900">
                1–{filteredAndSortedAgents.length} of {filteredAndSortedAgents.length} agents in {dynamicCity}
              </span>
            </div>

            {/* Interactive Sort Dropdown */}
            <div className="relative">
              <button
                type="button"
                onClick={() => setSortDropdownOpen((prev) => !prev)}
                className="inline-flex items-center gap-1.5 text-neutral-700 hover:text-neutral-950 font-medium cursor-pointer"
              >
                <span>Sort:</span>
                <span className="text-[#0c6b73] font-semibold underline underline-offset-2">
                  {sortLabels[sortBy]}
                </span>
                <ChevronDown className="w-3.5 h-3.5 text-neutral-500" />
              </button>

              {sortDropdownOpen && (
                <div className="absolute right-0 top-full mt-1.5 w-44 bg-white border border-neutral-200 rounded-md shadow-lg py-1 z-30 text-xs">
                  {(['recommended', 'volume', 'deals', 'rating'] as SortOption[]).map((option) => (
                    <button
                      key={option}
                      type="button"
                      onClick={() => {
                        setSortBy(option);
                        setSortDropdownOpen(false);
                      }}
                      className={`w-full text-left px-3 py-2 transition-colors ${
                        sortBy === option
                          ? 'bg-neutral-100 font-semibold text-neutral-900'
                          : 'text-neutral-700 hover:bg-neutral-50'
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

        {/* 3. Agent Card Grid Layout (1 col mobile, 2 col tablet, 4 col desktop) */}
        {filteredAndSortedAgents.length === 0 ? (
          <div className="bg-white border border-neutral-200 rounded-xl p-12 text-center max-w-lg mx-auto space-y-4 my-8 shadow-xs">
            <Search className="w-10 h-10 text-neutral-400 mx-auto" />
            <h3 className="text-xl font-bold text-neutral-900">
              No local agents currently listed in {dynamicCity}
            </h3>
            <p className="text-sm text-neutral-600">
              Digentic Realty advises private clients and luxury estates nationwide. Browse our principal agents across all metropolitan markets.
            </p>
            <button
              onClick={() => {
                setSearchInput('');
                setActiveSearch('');
                setDealType('All');
                setSelectedLanguage('All');
              }}
              className="px-5 py-2.5 bg-black text-white text-xs font-medium rounded-md hover:bg-neutral-900 active:scale-95 border border-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
            >
              View All Nationwide Agents ({AGENTS.length})
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {filteredAndSortedAgents.map((agent) => (
              <div
                key={agent.id}
                className="bg-white border border-neutral-200 rounded-xl overflow-hidden shadow-2xs hover:shadow-md transition-all duration-200 flex flex-col group"
              >
                {/* Agent Photo Container */}
                <div className="relative aspect-4/3 sm:aspect-square w-full bg-neutral-100 overflow-hidden">
                  {/* LUXURY EXPERT Tag */}
                  <div className="absolute top-2.5 left-2.5 z-10">
                    <span className="inline-block bg-neutral-900/80 backdrop-blur-xs text-white text-[9px] sm:text-[10px] font-bold px-2 py-0.5 rounded-xs uppercase tracking-wider shadow-2xs">
                      LUXURY EXPERT
                    </span>
                  </div>

                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-full h-full object-cover object-top group-hover:scale-103 transition-transform duration-300"
                    loading="lazy"
                  />
                </div>

                {/* Agent Details Container */}
                <div className="p-4 sm:p-5 flex flex-col flex-1">
                  
                  {/* Full Name */}
                  <h3 className="font-bold text-base sm:text-lg text-neutral-900 tracking-tight leading-snug">
                    {agent.name}
                  </h3>

                  {/* Title & Location */}
                  <p className="text-xs text-neutral-600 mt-0.5 font-normal">
                    {agent.role} • {agent.city ? `${agent.city}, ${agent.state}` : agent.officeLocation.split('•')[0].trim()}
                  </p>

                  {/* Contact Email / Handle Link */}
                  <a
                    href={`mailto:${agent.email}`}
                    className="text-xs text-blue-600 hover:text-blue-800 hover:underline mt-0.5 truncate block font-normal transition-colors"
                  >
                    {agent.email}
                  </a>

                  {/* Performance Metrics: 3-Column Stat Bar */}
                  <div className="grid grid-cols-3 divide-x divide-neutral-200 text-left my-4 pt-3.5 border-t border-neutral-100">
                    {/* Sales Volume */}
                    <div className="pr-1.5">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900 block truncate">
                        {agent.salesVolume || '$180.0M'}
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-tight block truncate mt-0.5">
                        Sales volume
                      </span>
                    </div>

                    {/* Total Deals */}
                    <div className="px-2">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900 block">
                        {agent.totalDeals || agent.dealsClosed}
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-tight block truncate mt-0.5">
                        Total deals
                      </span>
                    </div>

                    {/* Avg Rating */}
                    <div className="pl-2">
                      <span className="font-bold text-xs sm:text-sm text-neutral-900 flex items-center gap-0.5">
                        <span>{agent.rating ? agent.rating.toFixed(1) : '4.8'}</span>
                        <span className="text-neutral-900 text-xs">★</span>
                      </span>
                      <span className="text-[10px] text-neutral-500 uppercase tracking-tight block truncate mt-0.5">
                        Avg rating
                      </span>
                    </div>
                  </div>

                  {/* Action Button */}
                  <div className="mt-auto pt-1">
                    <button
                      type="button"
                      onClick={() => handleOpenContact(agent)}
                      className="w-full py-2 px-4 rounded-full border border-neutral-300 hover:border-neutral-900 hover:bg-neutral-900 hover:text-white text-xs font-semibold text-neutral-800 transition-colors text-center cursor-pointer shadow-2xs"
                    >
                      Contact
                    </button>
                  </div>

                </div>
              </div>
            ))}
          </div>
        )}

      </div>

      {/* Interactive Contact Agent Modal */}
      {contactAgent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          role="dialog"
          aria-modal="true"
        >
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl border border-neutral-200 relative">
            <button
              onClick={() => setContactAgent(null)}
              className="absolute top-4 right-4 p-1.5 text-neutral-400 hover:text-neutral-900 rounded-full hover:bg-neutral-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-3">
                <div className="w-12 h-12 rounded-full bg-emerald-100 text-emerald-700 flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-6 h-6 stroke-[2]" />
                </div>
                <h3 className="text-xl font-bold text-neutral-900">Message Dispatched</h3>
                <p className="text-xs sm:text-sm text-neutral-600 max-w-xs mx-auto">
                  Your inquiry has been sent directly to {contactAgent.name}. They will reach out shortly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSendContact} className="space-y-4">
                <div className="flex items-center gap-3.5 pb-4 border-b border-neutral-100">
                  <img
                    src={contactAgent.avatar}
                    alt={contactAgent.name}
                    className="w-14 h-14 rounded-full object-cover border border-neutral-200"
                  />
                  <div>
                    <h3 className="font-bold text-lg text-neutral-900 leading-tight">
                      Contact {contactAgent.name}
                    </h3>
                    <p className="text-xs text-neutral-600">
                      {contactAgent.role} • {contactAgent.city || 'Arlington, VA'}
                    </p>
                    <p className="text-[11px] font-mono text-neutral-400 mt-0.5">
                      {contactAgent.licenseNumber}
                    </p>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Your Full Name
                    </label>
                    <input
                      type="text"
                      required
                      value={contactName}
                      onChange={(e) => setContactName(e.target.value)}
                      placeholder="Jane Doe"
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                  <div>
                    <label className="block text-xs font-semibold text-neutral-700 mb-1">
                      Phone Number
                    </label>
                    <input
                      type="tel"
                      value={contactPhone}
                      onChange={(e) => setContactPhone(e.target.value)}
                      placeholder="+1 (703) 555-0192"
                      className="w-full text-xs p-2.5 border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Email Address
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="jane@example.com"
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div>
                  <label className="block text-xs font-semibold text-neutral-700 mb-1">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    required
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-neutral-300 rounded-md focus:outline-none focus:border-neutral-900"
                  />
                </div>

                <div className="pt-2">
                  <button
                    type="submit"
                    className="w-full py-3 bg-black hover:bg-neutral-900 active:scale-95 text-white text-xs font-medium rounded-full border border-black shadow-md hover:shadow-lg transition-all duration-200 cursor-pointer"
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

export default AgentsPage;
