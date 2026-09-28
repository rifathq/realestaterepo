import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Bookmark, ArrowRight, Trash2, Search, SlidersHorizontal, Building2 } from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PropertyCard } from '../components/property/PropertyCard';

export const SavedPage: React.FC = () => {
  const { savedProperties, savedIds, toggleSave } = useMarketplace();
  const [activeTab, setActiveTab] = useState<'properties' | 'searches'>('properties');

  const mockSavedSearches = [
    {
      id: 'search-1',
      title: 'Commercial Headquarters & Offices in San Francisco',
      filters: 'Buy · Offices · Under $25M',
      date: 'Saved on Sep 18, 2026',
      link: '/properties?type=buy&category=Offices&location=San+Francisco'
    },
    {
      id: 'search-2',
      title: 'Crown Penthouses in New York Central Park',
      filters: 'Rent · Penthouses · $20k+/mo',
      date: 'Saved on Sep 12, 2026',
      link: '/properties?type=rent&category=Penthouses&location=New+York'
    }
  ];

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 pb-24 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-1">
            Client Portfolio
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
            Saved Properties & Dossiers
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Review bookmarked architectural assets, monitor price changes, and manage active market alerts
          </p>
        </div>

        {/* Tab switcher */}
        <div className="flex items-center gap-1 p-1 bg-stone-100 border border-stone-200">
          <button
            onClick={() => setActiveTab('properties')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'properties'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Assets ({savedProperties.length})
          </button>
          <button
            onClick={() => setActiveTab('searches')}
            className={`px-3 py-1.5 text-xs font-medium transition-colors ${
              activeTab === 'searches'
                ? 'bg-white text-stone-900 shadow-xs'
                : 'text-stone-600 hover:text-stone-900'
            }`}
          >
            Saved Searches ({mockSavedSearches.length})
          </button>
        </div>
      </div>

      {activeTab === 'properties' ? (
        savedProperties.length === 0 ? (
          /* Empty State */
          <div className="bg-white border border-stone-200 p-12 text-center max-w-md mx-auto space-y-4 my-12">
            <Bookmark className="w-12 h-12 text-stone-400 mx-auto stroke-[1.5]" />
            <h2 className="text-xl font-bold text-stone-950">
              No Saved Properties Yet
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 leading-relaxed">
              When exploring the ESTRA marketplace, click the bookmark icon on any residence, commercial campus, or development parcel to save it here for convenient review.
            </p>
            <div className="pt-2">
              <Link
                to="/properties"
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
              >
                <span>Discover Marketplace</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>
        ) : (
          /* Saved Grid */
          <div className="space-y-6">
            <div className="flex items-center justify-between text-xs text-stone-500">
              <span>{savedProperties.length} properties saved to your private ledger</span>
              <button
                onClick={() => {
                  savedProperties.forEach((p) => toggleSave(p.id));
                }}
                className="text-stone-600 hover:text-stone-950 underline"
              >
                Remove All Saved
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {savedProperties.map((property) => (
                <PropertyCard key={property.id} property={property} />
              ))}
            </div>
          </div>
        )
      ) : (
        /* Saved Searches List */
        <div className="max-w-3xl space-y-4">
          <p className="text-xs text-stone-500">
            Market alerts notify you when new verified properties matching these criteria are added to the ESTRA database.
          </p>

          <div className="space-y-3">
            {mockSavedSearches.map((search) => (
              <div
                key={search.id}
                className="bg-white border border-stone-200 p-5 flex flex-col sm:flex-row sm:items-center justify-between gap-4 hover:border-stone-400 transition-colors"
              >
                <div>
                  <div className="flex items-center gap-2 text-xs text-stone-400 font-mono mb-1">
                    <Search className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>{search.date}</span>
                  </div>
                  <h3 className="text-base font-bold text-stone-950">
                    {search.title}
                  </h3>
                  <p className="text-xs text-stone-600 mt-1">
                    Filters: <span className="font-mono">{search.filters}</span>
                  </p>
                </div>

                <div className="flex items-center gap-3">
                  <Link
                    to={search.link}
                    className="px-4 py-2 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors whitespace-nowrap"
                  >
                    View Current Results
                  </Link>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

    </div>
  );
};
