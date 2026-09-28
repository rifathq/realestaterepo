import React, { useState, useMemo, useEffect } from 'react';
import { useSearchParams, Link } from 'react-router-dom';
import { 
  Filter, 
  LayoutGrid, 
  List, 
  MapPin, 
  SlidersHorizontal, 
  X, 
  RotateCcw,
  Check,
  Building2
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { Property, PropertyCategory, ListingType } from '../types/property';
import { PropertyCard } from '../components/property/PropertyCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const PropertiesPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();

  // View mode
  const [viewMode, setViewMode] = useState<'grid' | 'list' | 'map'>('grid');
  const [mobileFilterOpen, setMobileFilterOpen] = useState(false);

  // Active filters from query params or state
  const typeParam = searchParams.get('type') as ListingType | null;
  const categoryParam = searchParams.get('category') as PropertyCategory | null;
  const locationParam = searchParams.get('location') || '';

  const [searchQuery, setSearchQuery] = useState(locationParam);
  const [selectedType, setSelectedType] = useState<ListingType | 'all'>(typeParam || 'all');
  const [selectedCategory, setSelectedCategory] = useState<PropertyCategory | 'all'>(categoryParam || 'all');
  const [selectedCity, setSelectedCity] = useState(locationParam || 'all');
  const [minPrice, setMinPrice] = useState<number>(0);
  const [maxPrice, setMaxPrice] = useState<number>(50000000);
  const [minBeds, setMinBeds] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'featured' | 'price-asc' | 'price-desc' | 'sqft-desc'>('featured');
  const [verifiedOnly, setVerifiedOnly] = useState(false);

  // Keep query sync
  useEffect(() => {
    if (typeParam) setSelectedType(typeParam);
    if (categoryParam) setSelectedCategory(categoryParam);
    if (locationParam) {
      setSearchQuery(locationParam);
      setSelectedCity(locationParam);
    }
  }, [typeParam, categoryParam, locationParam]);

  const categories: PropertyCategory[] = [
    'Offices', 
    'Villas', 
    'Apartments', 
    'Penthouses', 
    'Industrial', 
    'Land', 
    'Retail'
  ];

  const filteredProperties = useMemo(() => {
    return PROPERTIES.filter((p) => {
      // Type
      if (selectedType !== 'all' && p.listingType !== selectedType) return false;
      
      // Category
      if (selectedCategory !== 'all' && p.category !== selectedCategory) return false;

      // Location / Search query
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase();
        const matchTitle = p.title.toLowerCase().includes(query);
        const matchCity = p.location.city.toLowerCase().includes(query);
        const matchNeighborhood = p.location.neighborhood.toLowerCase().includes(query);
        const matchCategory = p.category.toLowerCase().includes(query);
        if (!matchTitle && !matchCity && !matchNeighborhood && !matchCategory) return false;
      }

      // City filter
      if (selectedCity !== 'all' && p.location.city !== selectedCity) return false;

      // Price
      if (p.price < minPrice || p.price > maxPrice) return false;

      // Beds
      if (minBeds > 0 && p.specs.beds < minBeds) return false;

      // Verified
      if (verifiedOnly && !p.verified) return false;

      return true;
    }).sort((a, b) => {
      if (sortBy === 'price-asc') return a.price - b.price;
      if (sortBy === 'price-desc') return b.price - a.price;
      if (sortBy === 'sqft-desc') return b.specs.sqft - a.specs.sqft;
      return (b.featured ? 1 : 0) - (a.featured ? 1 : 0);
    });
  }, [selectedType, selectedCategory, searchQuery, selectedCity, minPrice, maxPrice, minBeds, verifiedOnly, sortBy]);

  const resetFilters = () => {
    setSelectedType('all');
    setSelectedCategory('all');
    setSelectedCity('all');
    setSearchQuery('');
    setMinPrice(0);
    setMaxPrice(50000000);
    setMinBeds(0);
    setVerifiedOnly(false);
    setSortBy('featured');
    setSearchParams({});
  };

  const activeFilterCount = (selectedType !== 'all' ? 1 : 0) +
    (selectedCategory !== 'all' ? 1 : 0) +
    (selectedCity !== 'all' ? 1 : 0) +
    (searchQuery ? 1 : 0) +
    (minBeds > 0 ? 1 : 0) +
    (verifiedOnly ? 1 : 0);

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-8">
      
      {/* Top Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-1">
            ESTRA Verified Catalog
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
          {/* Mobile filter trigger */}
          <button
            onClick={() => setMobileFilterOpen(true)}
            className="lg:hidden px-3 py-2 text-xs font-medium text-stone-900 bg-white border border-stone-200 flex items-center gap-1.5"
          >
            <SlidersHorizontal className="w-3.5 h-3.5 stroke-[1.5]" />
            <span>Filters {activeFilterCount > 0 ? `(${activeFilterCount})` : ''}</span>
          </button>

          {/* Sort selector */}
          <div className="flex items-center gap-2">
            <span className="text-xs text-stone-400 hidden sm:inline">Sort:</span>
            <select
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as any)}
              className="text-xs font-medium text-stone-900 bg-white border border-stone-200 py-2 px-3 focus:outline-none focus:border-stone-900"
            >
              <option value="featured">Featured First</option>
              <option value="price-desc">Valuation (High to Low)</option>
              <option value="price-asc">Valuation (Low to High)</option>
              <option value="sqft-desc">Floor Area (Largest)</option>
            </select>
          </div>

          {/* View mode toggle */}
          <div className="hidden sm:flex items-center bg-stone-100 p-0.5 border border-stone-200">
            <button
              onClick={() => setViewMode('grid')}
              className={`p-1.5 transition-colors ${
                viewMode === 'grid' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="Grid View"
              aria-label="Grid view"
            >
              <LayoutGrid className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-1.5 transition-colors ${
                viewMode === 'list' ? 'bg-white text-stone-900 shadow-xs' : 'text-stone-500 hover:text-stone-900'
              }`}
              title="List View"
              aria-label="List view"
            >
              <List className="w-4 h-4 stroke-[1.5]" />
            </button>
            <button
              onClick={() => setViewMode('map')}
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
        <aside className="hidden lg:block lg:col-span-3 bg-white border border-stone-200 p-5 space-y-6">
          <div className="flex items-center justify-between pb-3 border-b border-stone-100">
            <h2 className="text-xs font-bold uppercase tracking-wider text-stone-950 flex items-center gap-1.5">
              <Filter className="w-3.5 h-3.5 stroke-[1.5]" />
              <span>Filters</span>
            </h2>
            {activeFilterCount > 0 && (
              <button
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
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="e.g. San Francisco, Penthouse..."
              className="w-full text-xs font-medium py-2 px-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
            />
          </div>

          {/* Transaction Type: Buy / Rent / All */}
          <div>
            <label className="block text-[11px] font-semibold text-stone-600 uppercase tracking-wider mb-1.5">
              Transaction Mode
            </label>
            <div className="grid grid-cols-3 gap-1 p-1 bg-stone-100 border border-stone-200">
              <button
                type="button"
                onClick={() => setSelectedType('all')}
                className={`py-1 text-xs font-medium transition-colors ${
                  selectedType === 'all' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                All
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('buy')}
                className={`py-1 text-xs font-medium transition-colors ${
                  selectedType === 'buy' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
                }`}
              >
                Buy
              </button>
              <button
                type="button"
                onClick={() => setSelectedType('rent')}
                className={`py-1 text-xs font-medium transition-colors ${
                  selectedType === 'rent' ? 'bg-white text-stone-900 font-semibold shadow-xs' : 'text-stone-600 hover:text-stone-900'
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
                onClick={() => setSelectedCategory('all')}
                className={`w-full text-left text-xs py-1.5 px-2 flex items-center justify-between transition-colors ${
                  selectedCategory === 'all' ? 'bg-stone-900 text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
                }`}
              >
                <span>All Categories</span>
                <span className="font-mono text-[11px]">{PROPERTIES.length}</span>
              </button>
              {categories.map((cat) => {
                const count = PROPERTIES.filter((p) => p.category === cat).length;
                return (
                  <button
                    key={cat}
                    type="button"
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left text-xs py-1.5 px-2 flex items-center justify-between transition-colors ${
                      selectedCategory === cat ? 'bg-stone-900 text-white font-medium' : 'text-stone-700 hover:bg-stone-50'
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
              value={selectedCity}
              onChange={(e) => setSelectedCity(e.target.value)}
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
                  onClick={() => setMinBeds(num)}
                  className={`py-1.5 text-xs font-mono transition-colors border ${
                    minBeds === num 
                      ? 'bg-stone-900 text-white border-stone-900' 
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
                checked={verifiedOnly}
                onChange={(e) => setVerifiedOnly(e.target.checked)}
                className="w-3.5 h-3.5 accent-stone-900"
              />
              <span>ESTRA Certified & Title Inspected Only</span>
            </label>
          </div>

        </aside>

        {/* Results Area */}
        <main className="lg:col-span-9">
          
          {/* Active Filter Pills Bar */}
          {activeFilterCount > 0 && (
            <div className="flex flex-wrap items-center gap-2 mb-6 p-3 bg-stone-100 border border-stone-200 text-xs">
              <span className="text-stone-500 font-medium">Applied Criteria:</span>
              {selectedType !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 border border-stone-200 text-stone-900">
                  {selectedType === 'buy' ? 'For Sale' : 'For Lease'}
                  <button onClick={() => setSelectedType('all')}><X className="w-3 h-3 stroke-[1.5]" /></button>
                </span>
              )}
              {selectedCategory !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 border border-stone-200 text-stone-900">
                  {selectedCategory}
                  <button onClick={() => setSelectedCategory('all')}><X className="w-3 h-3 stroke-[1.5]" /></button>
                </span>
              )}
              {selectedCity !== 'all' && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 border border-stone-200 text-stone-900">
                  {selectedCity}
                  <button onClick={() => setSelectedCity('all')}><X className="w-3 h-3 stroke-[1.5]" /></button>
                </span>
              )}
              {searchQuery && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 border border-stone-200 text-stone-900">
                  "{searchQuery}"
                  <button onClick={() => setSearchQuery('')}><X className="w-3 h-3 stroke-[1.5]" /></button>
                </span>
              )}
              {minBeds > 0 && (
                <span className="inline-flex items-center gap-1 bg-white px-2.5 py-1 border border-stone-200 text-stone-900">
                  {minBeds}+ Beds
                  <button onClick={() => setMinBeds(0)}><X className="w-3 h-3 stroke-[1.5]" /></button>
                </span>
              )}
              <button
                onClick={resetFilters}
                className="text-stone-500 hover:text-stone-950 underline ml-auto text-[11px]"
              >
                Clear All
              </button>
            </div>
          )}

          {/* Results State */}
          {filteredProperties.length === 0 ? (
            <div className="bg-white border border-stone-200 p-12 text-center space-y-4">
              <Building2 className="w-10 h-10 text-stone-400 mx-auto stroke-[1.5]" />
              <h3 className="text-lg font-bold text-stone-950">
                No Properties Match Your Filter Criteria
              </h3>
              <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
                Try widening your price valuation boundaries, adjusting your target asset class, or clearing specific keyword constraints.
              </p>
              <button
                onClick={resetFilters}
                className="px-4 py-2 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                Reset All Filters
              </button>
            </div>
          ) : viewMode === 'map' ? (
            /* Map View representation */
            <div className="space-y-6">
              <div className="bg-stone-900 text-white p-6 border border-stone-800 relative rounded-lg overflow-hidden min-h-[360px] flex flex-col justify-between">
                <div className="z-10">
                  <div className="text-xs uppercase tracking-widest text-stone-400 font-mono">
                    Interactive Regional Viewport
                  </div>
                  <h3 className="text-xl font-bold mt-1">Geographic Density Overview</h3>
                  <p className="text-xs text-stone-400 mt-1 max-w-lg">
                    Displaying coordinates for {filteredProperties.length} active listings across metropolitan districts.
                  </p>
                </div>

                {/* Stylized Architectural Blueprint Map Matrix */}
                <div className="z-10 grid grid-cols-2 sm:grid-cols-4 gap-3 my-6">
                  {filteredProperties.map((p) => (
                    <Link
                      key={p.id}
                      to={`/properties/${p.slug}`}
                      className="p-3 bg-stone-950/80 border border-stone-700 hover:border-white transition-colors group"
                    >
                      <div className="text-[10px] text-stone-400 font-mono truncate">
                        {p.location.city}
                      </div>
                      <div className="text-xs font-semibold text-white group-hover:text-stone-200 truncate">
                        {p.title}
                      </div>
                      <div className="text-[11px] text-stone-300 font-mono mt-1">
                        {p.priceDisplay}
                      </div>
                    </Link>
                  ))}
                </div>

                <div className="z-10 text-[11px] text-stone-500 font-mono">
                  Coordinates verified via municipal planning registries
                </div>
              </div>

              {/* Underlying cards */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {filteredProperties.map((property) => (
                  <PropertyCard key={property.id} property={property} />
                ))}
              </div>
            </div>
          ) : viewMode === 'list' ? (
            /* List View */
            <div className="space-y-4">
              {filteredProperties.map((property) => (
                <article
                  key={property.id}
                  className="bg-white border border-stone-200 p-4 sm:p-5 flex flex-col sm:flex-row gap-5 hover:border-stone-400 transition-colors"
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
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
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
                      onClick={() => setSelectedType(t)}
                      className={`py-1.5 text-xs capitalize ${
                        selectedType === t ? 'bg-white font-semibold shadow-xs' : 'text-stone-600'
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
                  value={selectedCategory}
                  onChange={(e) => setSelectedCategory(e.target.value as any)}
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
                  value={selectedCity}
                  onChange={(e) => setSelectedCity(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50"
                >
                  <option value="all">All Cities</option>
                  <option value="San Francisco">San Francisco</option>
                  <option value="New York">New York</option>
                  <option value="Seattle">Seattle</option>
                  <option value="Austin">Austin</option>
                </select>
              </div>
            </div>

            <div className="pt-6 border-t border-stone-200 space-y-2">
              <button
                onClick={() => setMobileFilterOpen(false)}
                className="w-full py-3 bg-stone-900 text-white text-xs font-medium"
              >
                Apply Filters ({filteredProperties.length} Results)
              </button>
              <button
                onClick={resetFilters}
                className="w-full py-2 bg-stone-100 text-stone-700 text-xs font-medium"
              >
                Reset
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
