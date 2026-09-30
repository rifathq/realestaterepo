import React, { useState, useRef, useEffect } from 'react';
import { 
  MapPin, 
  Building2, 
  BadgeDollarSign, 
  Search, 
  ChevronDown, 
  Check,
  X
} from 'lucide-react';

export interface SearchFilterState {
  type: 'buy' | 'rent';
  location: string;
  category: string;
  price: string;
}

export interface HeroSearchFilterProps {
  onSearch?: (values: SearchFilterState) => void;
  defaultType?: 'buy' | 'rent';
  defaultLocation?: string;
  defaultCategory?: string;
  defaultPrice?: string;
  className?: string;
}

interface DropdownOption {
  label: string;
  value: string;
  badge?: string;
}

const ASSET_CLASS_OPTIONS: DropdownOption[] = [
  { label: 'All Asset Classes', value: 'all' },
  { label: 'Offices & Headquarters', value: 'Offices' },
  { label: 'Villas & Estates', value: 'Villas' },
  { label: 'Apartments & Flats', value: 'Apartments' },
  { label: 'Crown Penthouses', value: 'Penthouses' },
  { label: 'Industrial & Logistics', value: 'Industrial' },
  { label: 'Development Land', value: 'Land' },
  { label: 'Commercial Retail', value: 'Retail' },
];

const PRICE_RANGE_OPTIONS: DropdownOption[] = [
  { label: 'Any Valuation', value: 'all' },
  { label: 'Under $5,000,000', value: 'under-5m' },
  { label: '$5,000,000 – $15,000,000', value: '5m-15m' },
  { label: '$15,000,000+', value: '15m-plus' },
];

export const HeroSearchFilter: React.FC<HeroSearchFilterProps> = ({
  onSearch,
  defaultType = 'buy',
  defaultLocation = '',
  defaultCategory = 'all',
  defaultPrice = 'all',
  className = '',
}) => {
  const [activeTab, setActiveTab] = useState<'buy' | 'rent'>(defaultType);
  const [location, setLocation] = useState(defaultLocation);
  const [selectedCategory, setSelectedCategory] = useState(defaultCategory);
  const [selectedPrice, setSelectedPrice] = useState(defaultPrice);

  const [categoryOpen, setCategoryOpen] = useState(false);
  const [priceOpen, setPriceOpen] = useState(false);

  const categoryRef = useRef<HTMLDivElement>(null);
  const priceRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Close dropdowns on outside click or Escape
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (categoryRef.current && !categoryRef.current.contains(event.target as Node)) {
        setCategoryOpen(false);
      }
      if (priceRef.current && !priceRef.current.contains(event.target as Node)) {
        setPriceOpen(false);
      }
    };

    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') {
        setCategoryOpen(false);
        setPriceOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    document.addEventListener('keydown', handleKeyDown);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);

  const selectedCategoryLabel = 
    ASSET_CLASS_OPTIONS.find((opt) => opt.value === selectedCategory)?.label || 'All Asset Classes';

  const selectedPriceLabel = 
    PRICE_RANGE_OPTIONS.find((opt) => opt.value === selectedPrice)?.label || 'Any Valuation';

  const handleSubmit = (e?: React.FormEvent) => {
    if (e) e.preventDefault();
    setCategoryOpen(false);
    setPriceOpen(false);
    if (onSearch) {
      onSearch({
        type: activeTab,
        location: location.trim(),
        category: selectedCategory,
        price: selectedPrice,
      });
    }
  };

  return (
    <div className={`w-full max-w-5xl mx-auto ${className}`}>
      
      {/* Refined MLS Status Pill floating gracefully above the search panel */}
      <div className="flex items-center justify-center sm:justify-between px-2 mb-3.5">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-stone-900/80 backdrop-blur-md border border-white/15 text-stone-200 text-xs font-mono tracking-wider uppercase shadow-sm">
          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse shrink-0" />
          <span className="font-medium text-[11px] text-stone-200">Real-Time MLS & Private Listings</span>
          <span className="text-stone-500 hidden sm:inline">·</span>
          <span className="text-stone-400 font-normal hidden sm:inline">Title-Inspected Ledger</span>
        </div>

        <div className="hidden sm:flex items-center gap-4 text-xs font-mono text-white/80">
          <span>Updated Hourly</span>
          <span>·</span>
          <span>Verified Ownership</span>
        </div>
      </div>

      {/* Main Luxury Floating Search Panel */}
      <div className="w-full bg-[#fdfcfb] border border-stone-200/90 rounded-[22px] shadow-[0_25px_60px_-15px_rgba(28,25,23,0.12),0_4px_16px_-4px_rgba(28,25,23,0.04)] p-4 sm:p-5 lg:p-6 transition-all duration-300">
        
        {/* Card Header: Property Intent Pill Switch */}
        <div className="flex items-center justify-between pb-4 sm:pb-5 mb-3 border-b border-stone-100">
          <div className="inline-flex items-center p-1 bg-stone-100/90 rounded-xl border border-stone-200/50">
            <button
              type="button"
              onClick={() => setActiveTab('buy')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === 'buy'
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              Buy Properties
            </button>
            <button
              type="button"
              onClick={() => setActiveTab('rent')}
              className={`px-5 py-2 rounded-lg text-xs sm:text-sm tracking-tight transition-all duration-200 cursor-pointer ${
                activeTab === 'rent'
                  ? 'bg-white text-stone-950 font-semibold shadow-xs'
                  : 'text-stone-500 hover:text-stone-900 font-medium'
              }`}
            >
              Rent / Lease
            </button>
          </div>

          <div className="text-xs text-stone-400 font-mono hidden md:block">
            {activeTab === 'buy' ? 'Freehold & Equity Assets' : 'Corporate & Long-term Leases'}
          </div>
        </div>

        {/* Cohesive Search Filter Track */}
        <form onSubmit={handleSubmit}>
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-2 lg:gap-0 items-center bg-stone-50/70 rounded-xl p-1.5 sm:p-2 border border-stone-200/60">
            
            {/* Field 1: Metropolitan Area */}
            <div 
              onClick={() => inputRef.current?.focus()}
              className="lg:col-span-4 px-3.5 py-2.5 rounded-lg hover:bg-white focus-within:bg-white focus-within:shadow-xs transition-all relative cursor-text group"
            >
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-sans mb-0.5 select-none">
                Metropolitan Area
              </label>
              <div className="relative flex items-center">
                <MapPin className="w-4 h-4 text-stone-400 shrink-0 mr-2.5 stroke-[1.75] group-hover:text-stone-700 transition-colors" />
                <input
                  ref={inputRef}
                  type="text"
                  value={location}
                  onChange={(e) => setLocation(e.target.value)}
                  placeholder="San Francisco, New York..."
                  className="w-full bg-transparent text-sm sm:text-base font-medium text-stone-900 placeholder:text-stone-400 focus:outline-none truncate pr-6"
                />
                {location && (
                  <button
                    type="button"
                    onClick={(e) => {
                      e.stopPropagation();
                      setLocation('');
                    }}
                    className="absolute right-0 text-stone-400 hover:text-stone-700 p-0.5 cursor-pointer"
                    title="Clear location"
                  >
                    <X className="w-3.5 h-3.5" />
                  </button>
                )}
              </div>
            </div>

            {/* Subtle Divider */}
            <div className="hidden lg:block w-px h-8 bg-stone-200/80 mx-1 shrink-0" />

            {/* Field 2: Property Asset Class */}
            <div 
              ref={categoryRef}
              className="lg:col-span-3 px-3.5 py-2.5 rounded-lg hover:bg-white transition-all relative cursor-pointer group select-none"
            >
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-sans mb-0.5">
                Property Class
              </label>
              <button
                type="button"
                onClick={() => {
                  setCategoryOpen(!categoryOpen);
                  setPriceOpen(false);
                }}
                className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={categoryOpen}
              >
                <div className="flex items-center min-w-0 mr-2">
                  <Building2 className="w-4 h-4 text-stone-400 shrink-0 mr-2.5 stroke-[1.75] group-hover:text-stone-700 transition-colors" />
                  <span className="text-sm sm:text-base font-medium text-stone-900 truncate">
                    {selectedCategoryLabel}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                    categoryOpen ? 'rotate-180 text-stone-900' : 'group-hover:text-stone-700'
                  }`} 
                />
              </button>

              {/* Floating Popover Menu */}
              {categoryOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-64 sm:w-72 bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.06)] border border-stone-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 px-3 py-1.5 border-b border-stone-100 mb-1">
                    Select Asset Class
                  </div>
                  <div className="max-h-60 overflow-y-auto space-y-0.5">
                    {ASSET_CLASS_OPTIONS.map((opt) => {
                      const isSelected = selectedCategory === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedCategory(opt.value);
                            setCategoryOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors text-left cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white font-medium'
                              : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 shrink-0 ml-2 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Subtle Divider */}
            <div className="hidden lg:block w-px h-8 bg-stone-200/80 mx-1 shrink-0" />

            {/* Field 3: Target Price Range */}
            <div 
              ref={priceRef}
              className="lg:col-span-3 px-3.5 py-2.5 rounded-lg hover:bg-white transition-all relative cursor-pointer group select-none"
            >
              <label className="block text-[11px] font-semibold text-stone-500 uppercase tracking-wider font-sans mb-0.5">
                Target Price Range
              </label>
              <button
                type="button"
                onClick={() => {
                  setPriceOpen(!priceOpen);
                  setCategoryOpen(false);
                }}
                className="w-full flex items-center justify-between text-left focus:outline-none cursor-pointer"
                aria-haspopup="listbox"
                aria-expanded={priceOpen}
              >
                <div className="flex items-center min-w-0 mr-2">
                  <BadgeDollarSign className="w-4 h-4 text-stone-400 shrink-0 mr-2.5 stroke-[1.75] group-hover:text-stone-700 transition-colors" />
                  <span className="text-sm sm:text-base font-medium text-stone-900 truncate">
                    {selectedPriceLabel}
                  </span>
                </div>
                <ChevronDown 
                  className={`w-4 h-4 text-stone-400 shrink-0 transition-transform duration-200 ${
                    priceOpen ? 'rotate-180 text-stone-900' : 'group-hover:text-stone-700'
                  }`} 
                />
              </button>

              {/* Floating Popover Menu */}
              {priceOpen && (
                <div className="absolute top-full left-0 mt-2.5 w-64 sm:w-72 bg-white rounded-2xl shadow-[0_20px_40px_-10px_rgba(0,0,0,0.16),0_2px_8px_rgba(0,0,0,0.06)] border border-stone-200/90 p-2 z-50 animate-in fade-in zoom-in-95 duration-150">
                  <div className="text-[10px] uppercase font-mono tracking-wider text-stone-400 px-3 py-1.5 border-b border-stone-100 mb-1">
                    Select Target Valuation
                  </div>
                  <div className="space-y-0.5">
                    {PRICE_RANGE_OPTIONS.map((opt) => {
                      const isSelected = selectedPrice === opt.value;
                      return (
                        <button
                          key={opt.value}
                          type="button"
                          onClick={() => {
                            setSelectedPrice(opt.value);
                            setPriceOpen(false);
                          }}
                          className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg transition-colors text-left cursor-pointer ${
                            isSelected
                              ? 'bg-stone-900 text-white font-medium'
                              : 'text-stone-700 hover:bg-stone-100 hover:text-stone-900'
                          }`}
                        >
                          <span className="truncate">{opt.label}</span>
                          {isSelected && (
                            <Check className="w-3.5 h-3.5 shrink-0 ml-2 stroke-[2.5]" />
                          )}
                        </button>
                      );
                    })}
                  </div>
                </div>
              )}
            </div>

            {/* Action Button: Search Properties */}
            <div className="lg:col-span-2 p-1">
              <button
                type="submit"
                className="w-full bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium rounded-xl px-5 sm:px-6 py-3.5 border border-black shadow-md hover:shadow-lg transition-all duration-200 flex items-center justify-center gap-2.5 text-xs sm:text-sm whitespace-nowrap cursor-pointer group"
              >
                <Search className="w-4 h-4 shrink-0 stroke-[2] text-white transition-transform duration-200 group-hover:scale-110" />
                <span className="text-white font-medium">Search Properties</span>
              </button>
            </div>

          </div>
        </form>

      </div>
    </div>
  );
};

export default HeroSearchFilter;
