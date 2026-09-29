import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, MapPin, Calculator, Building2, X } from 'lucide-react';

export type HeroSearchTab = 'Buy' | 'Mortgage' | 'Sell' | 'Rent';

interface HeroSearchBarProps {
  className?: string;
  defaultTab?: HeroSearchTab;
  onSearch?: (tab: HeroSearchTab, query: string) => void;
}

export const HeroSearchBar: React.FC<HeroSearchBarProps> = ({
  className = '',
  defaultTab = 'Buy',
  onSearch,
}) => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<HeroSearchTab>(defaultTab);
  const [searchQuery, setSearchQuery] = useState('');
  const [isFocused, setIsFocused] = useState(false);
  const [showMortgageModal, setShowMortgageModal] = useState(false);

  const containerRef = useRef<HTMLDivElement>(null);

  const tabs: HeroSearchTab[] = ['Buy', 'Mortgage', 'Sell', 'Rent'];

  // Quick suggestions based on active tab
  const suggestions = [
    { label: 'San Francisco, CA', type: 'City', sub: '1,420+ verified listings' },
    { label: 'New York, NY', type: 'City', sub: '3,840+ verified listings' },
    { label: 'Seattle, WA', type: 'City', sub: '980+ verified listings' },
    { label: 'Austin, TX', type: 'City', sub: '1,120+ verified listings' },
    { label: 'Crown Penthouses', type: 'Category', sub: 'Panoramic skyline residences' },
    { label: 'Offices & Headquarters', type: 'Category', sub: 'Commercial grade campuses' },
  ];

  // Placeholder text dynamically tailored to the active tab
  const getPlaceholder = (tab: HeroSearchTab): string => {
    switch (tab) {
      case 'Buy':
        return 'City, Address, School, Agent, ZIP';
      case 'Mortgage':
        return 'City, ZIP, or Purchase Price (e.g. $1,500,000)';
      case 'Sell':
        return 'Enter your home address to start listing';
      case 'Rent':
        return 'City, Address, School, Building, ZIP';
      default:
        return 'City, Address, School, Agent, ZIP';
    }
  };

  const handleTabClick = (tab: HeroSearchTab) => {
    setActiveTab(tab);
  };

  const executeSearch = (queryToUse?: string) => {
    const query = (queryToUse !== undefined ? queryToUse : searchQuery).trim();

    if (onSearch) {
      onSearch(activeTab, query);
    }

    if (activeTab === 'Buy') {
      const params = new URLSearchParams();
      params.set('type', 'buy');
      if (query) params.set('location', query);
      navigate(`/properties?${params.toString()}`);
    } else if (activeTab === 'Rent') {
      const params = new URLSearchParams();
      params.set('type', 'rent');
      if (query) params.set('location', query);
      navigate(`/properties?${params.toString()}`);
    } else if (activeTab === 'Sell') {
      if (query) {
        navigate(`/sell?address=${encodeURIComponent(query)}`);
      } else {
        navigate('/sell');
      }
    } else if (activeTab === 'Mortgage') {
      setShowMortgageModal(true);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    executeSearch();
  };

  // Close suggestions dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsFocused(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div ref={containerRef} className={`w-full max-w-xl relative z-50 ${className}`}>
      
      {/* 1. TABS ROW (Top Row) - Compact heights & refined typography */}
      <div className="flex items-end overflow-x-auto no-scrollbar scroll-smooth gap-1 px-0.5 select-none">
        {tabs.map((tab) => {
          const isActive = activeTab === tab;
          return (
            <button
              key={tab}
              type="button"
              onClick={() => handleTabClick(tab)}
              className={`relative font-sans text-xs sm:text-sm transition-all duration-150 rounded-t-lg whitespace-nowrap cursor-pointer ${
                isActive
                  ? 'bg-white text-stone-950 font-bold px-4 sm:px-5 py-2 sm:py-2.5 shadow-2xs z-20 translate-y-[1px]'
                  : 'bg-[#ded7ce]/90 text-stone-800 font-medium px-3.5 sm:px-4 py-1.5 sm:py-2 hover:bg-[#eae3da] hover:text-stone-950 opacity-95'
              }`}
              style={{
                letterSpacing: '-0.01em',
              }}
            >
              {tab}
            </button>
          );
        })}
      </div>

      {/* 2. SEARCH INPUT CONTAINER (Bottom Row) - Compact height & balanced padding */}
      <form
        onSubmit={handleSubmit}
        className="relative z-10 bg-white rounded-b-2xl rounded-tr-lg shadow-2xl p-1.5 sm:p-2 pl-4 sm:pl-5 flex items-center transition-all duration-200 border border-stone-200/80 focus-within:ring-3 focus-within:ring-red-500/15 focus-within:border-stone-300"
      >
        {/* Text Input */}
        <div className="flex-1 mr-2 min-w-0">
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setIsFocused(true)}
            placeholder={getPlaceholder(activeTab)}
            className="w-full text-xs sm:text-sm text-stone-900 placeholder:text-stone-400 bg-transparent focus:outline-none font-normal tracking-tight py-1.5 sm:py-2 selection:bg-red-600 selection:text-white"
            autoComplete="off"
            spellCheck="false"
          />
        </div>

        {/* Clear input button if text exists */}
        {searchQuery && (
          <button
            type="button"
            onClick={() => setSearchQuery('')}
            className="p-1 text-stone-400 hover:text-stone-700 mr-1.5 rounded-full hover:bg-stone-100 transition-colors"
            title="Clear text"
          >
            <X className="w-3.5 h-3.5 stroke-[2]" />
          </button>
        )}

        {/* Action Button: Compact Vivid Red Circle with Search Icon */}
        <button
          type="submit"
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-red-600 hover:bg-red-700 active:scale-95 text-white flex items-center justify-center shrink-0 shadow-sm transition-all duration-150 cursor-pointer group"
          title={`Search ${activeTab}`}
          aria-label={`Search ${activeTab}`}
        >
          <Search className="w-4 h-4 stroke-[2.2] transition-transform group-hover:scale-105" />
        </button>
      </form>

      {/* 3. AUTOCOMPLETE / RECENT SUGGESTIONS DROPDOWN */}
      {isFocused && (
        <div 
          className="absolute left-0 right-0 top-full mt-2 z-50 bg-white rounded-xl shadow-2xl border border-stone-200 overflow-hidden text-left"
          style={{ backgroundColor: '#ffffff', opacity: 1 }}
        >
          <div className="p-3 bg-stone-50 border-b border-stone-200 flex items-center justify-between text-[11px] text-stone-600 font-medium">
            <span className="font-semibold text-stone-900">Popular Metropolitan Regions & Asset Classes</span>
            <span className="font-mono text-[10px] text-stone-500 uppercase tracking-wider">ESTRA Verified</span>
          </div>

          <div className="divide-y divide-stone-100 max-h-72 overflow-y-auto bg-white" style={{ backgroundColor: '#ffffff' }}>
            {suggestions.map((item, index) => (
              <button
                key={index}
                type="button"
                onMouseDown={() => {
                  setSearchQuery(item.label);
                  setIsFocused(false);
                  executeSearch(item.label);
                }}
                className="w-full px-4 py-3 text-left bg-white hover:bg-stone-50 flex items-center justify-between transition-colors group cursor-pointer"
              >
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full bg-stone-100 text-stone-700 flex items-center justify-center group-hover:bg-red-50 group-hover:text-red-600 transition-colors shrink-0">
                    {item.type === 'City' ? (
                      <MapPin className="w-4 h-4 stroke-[1.8]" />
                    ) : (
                      <Building2 className="w-4 h-4 stroke-[1.8]" />
                    )}
                  </div>
                  <div>
                    <span className="text-xs sm:text-sm font-semibold text-stone-900 group-hover:text-red-600 transition-colors block">
                      {item.label}
                    </span>
                    <span className="text-[11px] text-stone-500 block">{item.sub}</span>
                  </div>
                </div>

                <span className="text-[10px] font-mono text-stone-600 bg-stone-100 px-2 py-0.5 rounded font-medium group-hover:bg-red-50 group-hover:text-red-700">
                  {item.type}
                </span>
              </button>
            ))}
          </div>

          <div className="p-3 bg-stone-50 border-t border-stone-200 flex items-center justify-between text-xs text-stone-600">
            <span className="text-[11px]">Press <kbd className="px-1.5 py-0.5 bg-white border border-stone-300 rounded font-mono text-[10px] text-stone-800 shadow-2xs">Enter</kbd> to search</span>
            <button
              type="button"
              onMouseDown={() => {
                setIsFocused(false);
                executeSearch();
              }}
              className="text-red-600 hover:text-red-700 text-xs font-semibold cursor-pointer"
            >
              Search all listings &rarr;
            </button>
          </div>
        </div>
      )}

      {/* 4. MORTGAGE CALCULATOR MODAL */}
      {showMortgageModal && (
        <div className="fixed inset-0 z-50 bg-stone-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl max-w-lg w-full p-6 sm:p-8 shadow-2xl relative text-left border border-stone-200 space-y-5 animate-in fade-in zoom-in-95 duration-150">
            <button
              onClick={() => setShowMortgageModal(false)}
              className="absolute top-5 right-5 p-1 text-stone-400 hover:text-stone-900 rounded-full hover:bg-stone-100 transition-colors"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-red-50 text-red-600 flex items-center justify-center">
                <Calculator className="w-5 h-5 stroke-[2]" />
              </div>
              <div>
                <h3 className="text-xl font-bold text-stone-950 font-architectural">
                  ESTRA Mortgage Rate Advisory
                </h3>
                <p className="text-xs text-stone-500">
                  Institutional commercial & residential financing rates (Q3 2026)
                </p>
              </div>
            </div>

            <div className="p-4 bg-stone-50 rounded-xl border border-stone-200 space-y-3 font-mono text-xs">
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-600 font-sans">30-Year Fixed Residential:</span>
                <span className="font-bold text-stone-900">5.82% APR</span>
              </div>
              <div className="flex justify-between items-center pb-2 border-b border-stone-200">
                <span className="text-stone-600 font-sans">15-Year Fixed Residential:</span>
                <span className="font-bold text-stone-900">5.14% APR</span>
              </div>
              <div className="flex justify-between items-center">
                <span className="text-stone-600 font-sans">Commercial Debt / Bridge:</span>
                <span className="font-bold text-stone-900">SOFR + 2.15%</span>
              </div>
            </div>

            <div className="space-y-3">
              <label className="text-xs font-semibold text-stone-700 uppercase tracking-wider block">
                Target Loan or Property Value ($ USD)
              </label>
              <input
                type="text"
                defaultValue={searchQuery || '$2,500,000'}
                className="w-full text-base font-mono p-3 border border-stone-200 rounded-lg bg-stone-50 focus:outline-none focus:border-stone-900"
              />
            </div>

            <div className="pt-2 flex flex-col sm:flex-row gap-3">
              <button
                type="button"
                onClick={() => {
                  setShowMortgageModal(false);
                  navigate('/contact');
                }}
                className="w-full py-3 bg-red-600 hover:bg-red-700 text-white font-semibold text-sm rounded-lg transition-colors text-center"
              >
                Connect with Financing Specialist
              </button>
              <button
                type="button"
                onClick={() => setShowMortgageModal(false)}
                className="w-full sm:w-auto px-5 py-3 bg-stone-100 hover:bg-stone-200 text-stone-700 font-medium text-sm rounded-lg transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
