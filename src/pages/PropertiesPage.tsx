import React, { useState, useMemo, useEffect, useTransition } from 'react';
import { useSearchParams, Link, useNavigate } from 'react-router-dom';
import { 
  Filter, 
  LayoutGrid, 
  List, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Check,
  Building2,
  Search,
  Sparkles
} from 'lucide-react';
import { PROPERTIES, CITIES } from '../data/properties';
import { useMarketplace } from '../context/MarketplaceContext';
import { Property, PropertyCategory, ListingType } from '../types/property';
import { PropertyCard } from '../components/property/PropertyCard';
import { PropertyMapView } from '../components/property/PropertyMapView';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const PropertiesPage: React.FC = () => {
  const { properties } = useMarketplace();
  const sourceProperties = properties && properties.length > 0 ? properties : PROPERTIES;
  const [searchParams, setSearchParams] = useSearchParams();
  const navigate = useNavigate();
  const [isPending, startTransition] = useTransition();

  // Mobile filter drawer state
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);
  const [isFiltering, setIsFiltering] = useState(false);
  const [hoveredPropertyId, setHoveredPropertyId] = useState<string | null>(null);

  // --- Derive Filter State Directly From URL Search Params (Single Source of Truth) ---
  const typeParam = (searchParams.get('type') as ListingType | null) || 'all';
  const categoryParam = (searchParams.get('category') as PropertyCategory | null) || 'all';
  const cityParam = searchParams.get('city') || 'all';
  const locationParam = searchParams.get('location') || '';
  const qParam = searchParams.get('q') || '';
  const priceParam = searchParams.get('price') || 'all';
  const bedsParam = Number(searchParams.get('beds')) || 0;
  const sortParam = (searchParams.get('sort') as 'featured' | 'price-asc' | 'price-desc' | 'sqft-desc') || 'featured';
  const verifiedParam = searchParams.get('verified') === 'true';
  const viewMode = (searchParams.get('view') as 'grid' | 'list' | 'map') || 'grid';

  // Keyword text input (synced with qParam or locationParam if not a city)
  const initialSearchText = qParam || locationParam || '';
  const [searchInput, setSearchInput] = useState(initialSearchText);

  // Sync search input if URL changes externally (e.g., via navbar or back/forward)
  useEffect(() => {
    setSearchInput(qParam || locationParam || '');
  }, [qParam, locationParam]);

  // Unified Filter Updater that updates URL query parameters and triggers view refresh
  const updateFilters = (updates: Record<string, string | number | boolean | null | undefined>) => {
    setIsFiltering(true);
    startTransition(() => {
      setSearchParams((prev) => {
        const next = new URLSearchParams(prev);
        for (const [key, val] of Object.entries(updates)) {
          if (
            val === null || 
            val === undefined || 
            val === '' || 
            val === 'all' || 
            val === 0 || 
            val === false
          ) {
            next.delete(key);
          } else {
            next.set(key, String(val));
          }
        }
        return next;
      });
    });
    setTimeout(() => {
      setIsFiltering(false);
    }, 180);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const query = searchInput.trim();
    // If query matches a known city name, set city parameter
    const matchedCity = CITIES.find(c => c.name.toLowerCase() === query.toLowerCase());
    if (matchedCity) {
      updateFilters({ city: matchedCity.name, q: null, location: null });
    } else {
      updateFilters({ q: query || null, location: null });
    }
  };

  const resetFilters = () => {
    setIsFiltering(true);
    setSearchInput('');
    setSearchParams({}, { replace: true });
    setTimeout(() => {
      setIsFiltering(false);
    }, 180);
  };

  const categories: PropertyCategory[] = [
    'Offices', 
    'Villas', 
    'Apartments', 
    'Penthouses', 
    'Industrial', 
    'Land', 
    'Retail'
  ];

  // Price calculations based on priceParam
  const priceRange = useMemo(() => {
    if (priceParam === 'under-5m') return { min: 0, max: 5000000 };
    if (priceParam === '5m-15m') return { min: 5000000, max: 15000000 };
    if (priceParam === '15m-plus') return { min: 15000000, max: 50000000 };
    return { min: 0, max: 50000000 };
  }, [priceParam]);

  // Effective location query
  const effectiveQuery = (qParam || (locationParam && !CITIES.some(c => c.name.toLowerCase() === locationParam.toLowerCase()) ? locationParam : '')).toLowerCase().trim();
  const effectiveCity = cityParam !== 'all' 
    ? cityParam 
    : (locationParam && CITIES.some(c => c.name.toLowerCase() === locationParam.toLowerCase()) ? locationParam : 'all');

  // Filtered Properties Computation
  const filteredProperties = useMemo(() => {
    return sourceProperties.filter((p) => {
      // 1. Transaction Type (Buy vs Rent)
      if (typeParam !== 'all' && p.listingType !== typeParam) return false;
      
      // 2. Asset Category
      if (categoryParam !== 'all' && p.category !== categoryParam) return false;

      // 3. City Filter
      if (effectiveCity !== 'all' && p.location.city.toLowerCase() !== effectiveCity.toLowerCase()) {
        return false;
      }

      // 4. Keyword / Location Search Query
      if (effectiveQuery) {
        const matchTitle = p.title.toLowerCase().includes(effectiveQuery);
        const matchCity = p.location.city.toLowerCase().includes(effectiveQuery);
        const matchNeighborhood = p.location.neighborhood.toLowerCase().includes(effectiveQuery);
        const matchCategory = p.category.toLowerCase().includes(effectiveQuery);
        const matchTagline = p.tagline.toLowerCase().includes(effectiveQuery);
        if (!matchTitle && !matchCity && !matchNeighborhood && !matchCategory && !matchTagline) {
          return false;
        }
      }

      // 5. Price Band Filter
      if (p.price < priceRange.min || p.price > priceRange.max) return false;

      // 6. Minimum Bedrooms
      if (bedsParam > 0 && p.specs.beds < bedsParam) return false;

      // 7. Verified Only
      if (verifiedParam && !p.verified) return false;

      return true;
    }).sort((a, b) => {
      if (sortParam === 'price-asc') return a.price - b.price;
      if (sortParam === 'price-desc') return b.price - a.price;
      if (sortParam === 'sqft-desc') return b.specs.sqft - a.specs.sqft;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [typeParam, categoryParam, effectiveCity, effectiveQuery, priceRange, bedsParam, verifiedParam, sortParam]);

  // Active filter count for badges
  const activeFilterCount = 
    (typeParam !== 'all' ? 1 : 0) +
    (categoryParam !== 'all' ? 1 : 0) +
    (effectiveCity !== 'all' ? 1 : 0) +
    (effectiveQuery ? 1 : 0) +
    (priceParam !== 'all' ? 1 : 0) +
    (bedsParam > 0 ? 1 : 0) +
    (verifiedParam ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-8">
      
      {/* Top Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-1 flex items-center gap-2">
            <span>Digentic Verified Catalog</span>
            {isFiltering && (
              <span className="inline-flex items-center gap-1 text-emerald-800 text-[10px] font-semibold animate-pulse">
                <Sparkles className="w-3 h-3" />
                Updating view...
              </span>
            )}
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
            Marketplace Directory
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Showing <span className="font-semibold text-stone-900 font-mono">{filteredProperties.length}</span> verified properties across institutional and residential sectors
          </p>
        </div>

        {/* View toggles & Sort bar */}
        <div className="flex items-center gap-3">
          {/* Mobile filter trigger button */}
          <button
            type="button"
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3.5 py-2 text-xs font-semibold text-stone-900 bg-white border border-stone-200 flex items-center gap-2 hover:bg-stone-50 transition-colors shadow-xs"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortParam}
              onChange={(e) => updateFilters({ sort: e.target.value })}
              className="text-xs font-medium text-stone-900 bg-white border border-stone-200 py-2 px-3 focus:outline-none focus:border-stone-900"
            >
              <option value="featured">Featured First</option>
              <option value="price-desc">Valuation (High to Low)</option>
              <option value="price-asc">Valuation (Low to High)</option>
              <option value="sqft-desc">Floor Area (Largest)</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="flex items-center bg-stone-100 p-0.5 border border-stone-200">
            <button
              type="button"
              onClick={() => updateFilters({ view: 'grid' })}
              className={`p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ view: 'list' })}
              className={`p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              type="button"
              onClick={() => updateFilters({ view: 'map' })}
              className={`p-1.5 transition-colors ${
                viewMode === 'map' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Map View"
              aria-label="Map view"
            >
              <MapPin className="w-4 h-4 stroke-[1.5]" />
            </button>
          </div>
        </div>
      </div>

      {/* Main Layout: Sidebar Filters + Results */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        
        {/* Desktop Filter Sidebar */}
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-stone-200 p-5 space-y-6 sticky top-24">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Filters</span>
            </h2>
            {activeFilterCount > 0 && (
              <button
                type="button"
                onClick={resetFilters}
                className="text-[11px] text-stone-500 hover:text-stone-950 flex items-center gap-1 transition-colors"
              >
                <RotateCcw className="w-3 h-3 stroke-[1.5]" />
                <span>Reset ({activeFilterCount})</span>
              </button>
            )}
          </div>

          {/* Search text query */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Keyword or Location
            </label>
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchInput}
                onChange={(e) => setSearchInput(e.target.value)}
                placeholder="e.g. San Francisco, Penthouse..."
                className="w-full text-xs font-medium py-2 pl-3 pr-8 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
              />
              <button
                type="submit"
                className="absolute right-2 top-2 text-stone-400 hover:text-stone-950 transition-colors"
                title="Search"
              >
                <Search className="w-3.5 h-3.5" />
              </button>
            </form>
          </div>

          {/* Transaction Type: Buy / Rent / All */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Transaction Mode
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => updateFilters({ type: 'all' })}
                className={`py-1.5 text-xs font-medium transition-colors ${
                  typeParam === 'all' 
                    ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ type: 'buy' })}
                className={`py-1.5 text-xs font-medium transition-colors ${
                  typeParam === 'buy' 
                    ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => updateFilters({ type: 'rent' })}
                className={`py-1.5 text-xs font-medium transition-colors ${
                  typeParam === 'rent' 
                    ? 'bg-white text-stone-900 font-semibold shadow-xs' 
                    : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Rent
              </button>
            </div>
          </div>

          {/* Category */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Asset Category
            </label>
            <div className="space-y-1">
              <button
                type="button"
                onClick={() => updateFilters({ category: 'all' })}
                className={`w-full text-left text-xs py-1.5 px-2 flex items-center justify-between transition-colors ${
                  categoryParam === 'all' 
                    ? 'bg-stone-900 text-white font-medium' 
                    : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                <span className="font-mono text-[11px]">{sourceProperties.length}</span>
              </button>
              {categories.map((cat) => {
                const count = sourceProperties.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => updateFilters({ category: cat })}
                    className={`w-full text-left text-xs py-1.5 px-2 flex items-center justify-between transition-colors ${
                      categoryParam === cat 
                        ? 'bg-stone-900 text-white font-medium' 
                        : 'text-stone-700 hover:bg-stone-50'
                    }`}
                  >
                    <span>{cat}</span>
                    <span className="font-mono text-[11px]">{count}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Region / City */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Metropolitan Region
            </label>
            <select
              value={effectiveCity}
              onChange={(e) => updateFilters({ city: e.target.value, location: null })}
              className="w-full text-xs font-medium py-2 px-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
            >
              <option value="all">All Metropolitan Corridors</option>
              <option value="San Francisco">San Francisco, CA</option>
              <option value="New York">New York, NY</option>
              <option value="Seattle">Seattle, WA</option>
              <option value="Austin">Austin, TX</option>
              <option value="Carmel">Carmel, CA</option>
              <option value="Portland">Portland, OR</option>
              <option value="Cambridge">Cambridge, MA</option>
              <option value="Los Angeles">Los Angeles, CA</option>
            </select>
          </div>

          {/* Price Range Band */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Target Price Band
            </label>
            <select
              value={priceParam}
              onChange={(e) => updateFilters({ price: e.target.value })}
              className="w-full text-xs font-medium py-2 px-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
            >
              <option value="all">Any Valuation</option>
              <option value="under-5m">Under $5,000,000</option>
              <option value="5m-15m">$5,000,000 – $15,000,000</option>
              <option value="15m-plus">$15,000,000+</option>
            </select>
          </div>

          {/* Bedrooms */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Minimum Bedrooms
            </label>
            <div className="grid grid-cols-5 gap-1 text-center">
              {[0, 1, 2, 3, 4].map((num) => (
                <button
                  key={num}
                  type="button"
                  onClick={() => updateFilters({ beds: num })}
                  className={`py-1.5 text-xs font-mono transition-colors border ${
                    bedsParam === num 
                      ? 'bg-stone-900 text-white border-stone-900 font-semibold' 
                      : 'border-stone-200 text-stone-700 hover:border-stone-400'
                  }`}
                >
                  {num === 0 ? 'Any' : `${num}+`}
                </button>
              ))}
            </div>
          </div>

          {/* Verification toggle */}
          <div className="pt-2 border-t border-stone-100">
            <label className="flex items-center gap-2 cursor-pointer text-xs text-stone-700 select-none">
              <input
                type="checkbox"
                checked={verifiedParam}
                onChange={(e) => updateFilters({ verified: e.target.checked })}
                className="w-3.5 h-3.5 accent-stone-900"
              />
              <span>Digentic Certified & Title Inspected Only</span>
            </label>
          </div>

        </aside>

        {/* Results Area */}
        <main className="lg:col-span-9 min-h-[500px]">
          
          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone-100 border border-stone-200 text-xs animate-fade-in">
              <span className="text-stone-500 font-medium">Applied Criteria:</span>
              
              {typeParam !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>{typeParam === 'buy' ? 'For Sale' : 'For Lease'}</span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ type: 'all' })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {categoryParam !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>{categoryParam}</span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ category: 'all' })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {effectiveCity !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>{effectiveCity}</span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ city: 'all', location: null })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {effectiveQuery && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>"{effectiveQuery}"</span>
                  <button 
                    type="button"
                    onClick={() => {
                      setSearchInput('');
                      updateFilters({ q: null, location: null });
                    }}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {priceParam !== 'all' && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>
                    {priceParam === 'under-5m' ? 'Under $5M' : priceParam === '5m-15m' ? '$5M – $15M' : '$15M+'}
                  </span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ price: 'all' })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {bedsParam > 0 && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>{bedsParam}+ Beds</span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ beds: 0 })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              {verifiedParam && (
                <span className="inline-flex items-center gap-1.5 bg-white px-2.5 py-1 border border-stone-200 text-stone-900 shadow-2xs">
                  <span>Certified Only</span>
                  <button 
                    type="button"
                    onClick={() => updateFilters({ verified: false })}
                    title="Remove filter"
                    className="text-stone-400 hover:text-stone-900 transition-colors"
                  >
                    <X className="w-3 h-3 stroke-[2]" />
                  </button>
                </span>
              )}

              <button
                type="button"
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-950 underline ml-auto text-[11px] font-medium transition-colors"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results State */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center space-y-4 shadow-xs">
              <Building2 className="w-10 h-10 text-stone-400 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-bold text-stone-950">
                No Properties Match Your Filter Criteria
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Try widening your price valuation boundaries, adjusting your target asset class, or clearing specific keyword constraints.
              </p>
              <button
                type="button"
                onClick={resetFilters}
                className="px-5 py-2.5 bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors shadow-xs"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Interactive Map View with Markers */
            <div className={`space-y-6 transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              <PropertyMapView
                properties={filteredProperties}
                hoveredPropertyId={hoveredPropertyId}
                onHoverProperty={setHoveredPropertyId}
              />

              <div className="flex items-center justify-between pt-1">
                <div>
                  <h3 className="text-sm font-bold text-stone-900">
                    Properties on Map ({filteredProperties.length})
                  </h3>
                  <p className="text-xs text-stone-500">
                    Hover or click any card to highlight its marker pin on the map.
                  </p>
                </div>
              </div>

              {/* Synchronized Property Cards Grid */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <div
                    key={property.id}
                    onMouseEnter={() => setHoveredPropertyId(property.id)}
                    onMouseLeave={() => setHoveredPropertyId(null)}
                    className={`transition-all duration-200 ${
                      hoveredPropertyId === property.id
                        ? 'ring-2 ring-stone-950 ring-offset-2'
                        : ''
                    }`}
                  >
                    <PropertyCard property={property} />
                  </div>
                ))}
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            <div className={`space-y-4 transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              {filteredProperties.map((property) => (
                <article
                  key={property.id}
                  className="bg-white border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:border-stone-400 transition-colors shadow-2xs"
                >
                  <div className="w-full sm:w-64 h-48 sm:h-auto shrink-0 relative bg-stone-100 overflow-hidden">
                    <Link to={`/properties/${property.slug}`}>
                      <ImageWithFallback
                        src={property.images[0]}
                        alt={property.title}
                        fallbackTitle={property.title}
                        className="w-full h-full object-cover"
                      />
                    </Link>
                    <span className="absolute top-2 left-2 bg-stone-900/80 text-white text-[10px] px-2 py-0.5 uppercase tracking-tight">
                      {property.listingType === 'buy' ? 'For Sale' : 'For Lease'}
                    </span>
                  </div>

                  <div className="flex-1 flex flex-col justify-between">
                    <div>
                      <div className="text-xs text-stone-500 mb-1">
                        {property.category} · {property.location.neighborhood}, {property.location.city}
                      </div>
                      <h3 className="text-lg font-bold text-stone-950">
                        <Link to={`/properties/${property.slug}`} className="hover:underline">
                          {property.title}
                        </Link>
                      </h3>
                      <p className="text-xs text-stone-600 mt-1 line-clamp-2">
                        {property.tagline}
                      </p>
                    </div>

                    <div className="pt-4 mt-4 border-t border-stone-100 flex items-end justify-between">
                      <div className="text-xs font-mono text-stone-600">
                        {property.specs.beds > 0 && `${property.specs.beds} Beds · `}
                        {property.specs.baths > 0 && `${property.specs.baths} Baths · `}
                        {property.specs.sqft > 0 ? `${property.specs.sqft.toLocaleString()} sqft` : property.specs.lotSize}
                      </div>
                      <div className="text-right">
                        <span className="text-lg font-bold text-stone-950 font-mono">
                          {property.priceDisplay}
                        </span>
                        {property.period && (
                          <span className="text-xs text-stone-500 font-normal">/mo</span>
                        )}
                      </div>
                    </div>
                  </div>
                </article>
              ))}
            </div>
          ) : (
            /* Grid View (Standard) */
            <div className={`grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 transition-opacity duration-200 ${isFiltering ? 'opacity-50' : 'opacity-100'}`}>
              {filteredProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          )}

        </main>
      </div>

      {/* Mobile Filter Drawer */}
      {mobileFilterOpen && (
        <div className="fixed inset-0 z-50 bg-stone-900/50 backdrop-blur-xs flex justify-end">
          <div className="w-full max-w-sm bg-white h-full overflow-y-auto p-6 flex flex-col justify-between">
            <div className="space-y-6">
              <div className="flex items-center justify-between pb-4 border-b border-stone-200">
                <h3 className="text-base font-bold text-stone-900">Filters</h3>
                <button
                  type="button"
                  onClick={() => setMobileFilterOpen(false)}
                  className="p-1 text-stone-400 hover:text-stone-900"
                >
                  <X className="w-5 h-5 stroke-[1.5]" />
                </button>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-stone-600 block mb-1">
                  Transaction
                </label>
                <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 border border-stone-200">
                  {(['all', 'buy', 'rent'] as const).map((t) => (
                    <button
                      key={t}
                      type="button"
                      onClick={() => updateFilters({ type: t })}
                      className={`py-1.5 text-xs capitalize ${
                        typeParam === t ? 'bg-white font-semibold shadow-xs text-stone-950' : 'text-stone-600'
                      }`}
                    >
                      {t}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-stone-600 block mb-1">
                  Category
                </label>
                <select
                  value={categoryParam}
                  onChange={(e) => updateFilters({ category: e.target.value })}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50"
                >
                  <option value="all">All Categories</option>
                  {categories.map((c) => (
                    <option key={c} value={c}>{c}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-stone-600 block mb-1">
                  Metropolitan Hub
                </label>
                <select
                  value={effectiveCity}
                  onChange={(e) => updateFilters({ city: e.target.value, location: null })}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50"
                >
                  <option value="all">All Cities</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold uppercase text-stone-600 block mb-1">
                  Valuation Band
                </label>
                <select
                  value={priceParam}
                  onChange={(e) => updateFilters({ price: e.target.value })}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50"
                >
                  <option value="all">Any Valuation</option>
                  <option value="under-5m">Under $5M</option>
                  <option value="5m-15m">$5M – $15M</option>
                  <option value="15m-plus">$15M+</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                type="button"
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white text-xs font-medium"
              >
                Apply Filters ({filteredProperties.length} Results)
              </button>
              <button
                type="button"
                onClick={() => {
                  resetFilters();
                  setMobileFilterOpen(false);
                }}
                className="w-full py-2 bg-stone-100 text-stone-700 text-xs font-medium"
              >
                Reset All Filters
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
