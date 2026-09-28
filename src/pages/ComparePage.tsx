import React from 'react';
import { Link } from 'react-router-dom';
import { 
  Columns2, 
  X, 
  Plus, 
  ArrowRight, 
  Calendar, 
  ShieldCheck, 
  Building2,
  Trash2
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';
import { PROPERTIES } from '../data/properties';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const ComparePage: React.FC = () => {
  const { compareProperties, removeFromCompare, clearCompare, toggleCompare } = useMarketplace();

  // Non-compared properties available to add
  const availableToAdd = PROPERTIES.filter(
    (p) => !compareProperties.some((cp) => cp.id === p.id)
  );

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 pb-24 space-y-8">
      
      {/* Page Header */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b border-stone-200 pb-6">
        <div>
          <div className="text-sm text-stone-500 uppercase tracking-widest font-mono mb-1.5">
            Technical Evaluation
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
            Property Comparison Matrix
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1.5">
            Side-by-side architectural metrics, valuation benchmarks, and spatial dimensions
          </p>
        </div>

        {compareProperties.length > 0 && (
          <div className="flex items-center gap-3">
            <span className="text-sm font-mono text-stone-600 font-medium">
              {compareProperties.length} of 4 selected
            </span>
            <button
              onClick={clearCompare}
              className="text-sm text-stone-600 hover:text-stone-950 px-3.5 py-2 border border-stone-200 hover:bg-stone-50 transition-colors flex items-center gap-1.5 font-medium"
            >
              <Trash2 className="w-4 h-4 stroke-[1.5]" />
              <span>Clear Matrix</span>
            </button>
          </div>
        )}
      </div>

      {compareProperties.length === 0 ? (
        /* Empty State */
        <div className="bg-white border border-stone-200 p-12 text-center max-w-xl mx-auto space-y-4 my-12">
          <Columns2 className="w-12 h-12 text-stone-400 mx-auto stroke-[1.5]" />
          <h2 className="text-2xl font-bold text-stone-950 font-architectural">
            No Properties in Comparison Matrix
          </h2>
          <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
            Select up to 4 commercial or residential properties across the marketplace to analyze square footage, valuation per square foot, and structural highlights.
          </p>
          <div className="pt-2">
            <Link
              to="/properties"
              className="inline-flex items-center gap-2 px-6 py-3 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-sm"
            >
              <span>Explore Marketplace Catalog</span>
              <ArrowRight className="w-4 h-4 stroke-[1.5]" />
            </Link>
          </div>

          {/* Quick suggestions to add */}
          <div className="pt-8 text-left border-t border-stone-100">
            <span className="text-sm font-semibold text-stone-800 block mb-3">
              Recommended to Compare:
            </span>
            <div className="space-y-2">
              {PROPERTIES.slice(0, 3).map((p) => (
                <div
                  key={p.id}
                  className="flex items-center justify-between p-3 bg-stone-50 border border-stone-200 text-sm"
                >
                  <div className="truncate mr-3">
                    <span className="font-semibold text-stone-900">{p.title}</span>
                    <span className="text-stone-500 font-mono ml-2">({p.priceDisplay})</span>
                  </div>
                  <button
                    onClick={() => toggleCompare(p.id)}
                    className="px-3 py-1.5 bg-white border border-stone-300 text-stone-900 hover:bg-stone-900 hover:text-white transition-colors whitespace-nowrap text-xs font-semibold"
                  >
                    + Add
                  </button>
                </div>
              ))}
            </div>
          </div>
        </div>
      ) : (
        /* Comparison Table Matrix */
        <div className="space-y-8">
          
          <div className="overflow-x-auto border border-stone-200 bg-white">
            <table className="w-full text-left border-collapse min-w-[760px]">
              
              {/* Header: Images & Titles */}
              <thead>
                <tr className="border-b border-stone-200">
                  <th className="p-5 w-48 bg-stone-50 text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-500">
                    Property Asset
                  </th>
                  {compareProperties.map((p) => (
                    <th key={p.id} className="p-5 min-w-[240px] align-top relative">
                      <button
                        onClick={() => removeFromCompare(p.id)}
                        className="absolute top-2 right-2 p-1.5 text-stone-400 hover:text-stone-900 hover:bg-stone-100 transition-colors"
                        title="Remove from comparison"
                      >
                        <X className="w-4 h-4 stroke-[1.5]" />
                      </button>

                      <div className="aspect-16/10 mb-3 overflow-hidden bg-stone-100 border border-stone-200">
                        <Link to={`/properties/${p.slug}`}>
                          <ImageWithFallback
                            src={p.images[0]}
                            alt={p.title}
                            fallbackTitle={p.title}
                            className="w-full h-full object-cover"
                          />
                        </Link>
                      </div>

                      <div className="text-xs font-mono text-stone-500 uppercase font-semibold">
                        {p.category} · {p.listingType === 'buy' ? 'Sale' : 'Lease'}
                      </div>
                      <h3 className="text-base sm:text-lg font-bold text-stone-950 mt-1 line-clamp-1">
                        <Link to={`/properties/${p.slug}`} className="hover:underline">
                          {p.title}
                        </Link>
                      </h3>
                      <div className="text-lg sm:text-xl font-bold font-mono text-stone-900 mt-1">
                        {p.priceDisplay}
                      </div>

                      <div className="mt-3 flex items-center gap-2">
                        <Link
                          to={`/tour/${p.slug}`}
                          className="w-full py-2 text-center text-xs sm:text-sm font-semibold bg-stone-900 text-white hover:bg-stone-800 transition-colors"
                        >
                          Book Tour
                        </Link>
                      </div>
                    </th>
                  ))}
                  
                  {/* Slot for adding another property if under 4 */}
                  {compareProperties.length < 4 && (
                    <th className="p-5 min-w-[200px] bg-stone-50/50 border-l border-dashed border-stone-200 text-center align-middle">
                      <div className="space-y-3">
                        <Plus className="w-8 h-8 text-stone-400 mx-auto stroke-[1.5]" />
                        <span className="text-sm text-stone-600 block font-medium">
                          Add property ({4 - compareProperties.length} slots remaining)
                        </span>
                        {availableToAdd.length > 0 && (
                          <select
                            onChange={(e) => {
                              if (e.target.value) toggleCompare(e.target.value);
                            }}
                            defaultValue=""
                            className="text-sm p-2.5 border border-stone-200 bg-white max-w-[200px] truncate"
                          >
                            <option value="" disabled>Select property...</option>
                            {availableToAdd.map((p) => (
                              <option key={p.id} value={p.id}>{p.title}</option>
                            ))}
                          </select>
                        )}
                      </div>
                    </th>
                  )}
                </tr>
              </thead>

              {/* Body: Spec Comparison Rows */}
              <tbody className="divide-y divide-stone-100 text-sm">
                
                {/* Location */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Location</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-stone-900">
                      {p.location.neighborhood}, {p.location.city}, {p.location.state}
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Valuation / sqft */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Price / Sqft</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-mono font-semibold text-stone-950">
                      {p.specs.pricePerSqft > 0 ? `$${p.specs.pricePerSqft}/sf` : 'N/A (Acreage)'}
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Gross Area */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Floor / Land Area</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-mono text-stone-900">
                      {p.specs.sqft > 0 ? `${p.specs.sqft.toLocaleString()} sqft` : p.specs.lotSize}
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Beds & Baths */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Rooms & Facilities</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-mono text-stone-900">
                      {p.specs.beds > 0 ? `${p.specs.beds} Beds · ` : ''}{p.specs.baths} Baths
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Parking Bays */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Parking Capacity</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-mono text-stone-900">
                      {p.specs.parking} Vehicle Bays
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Year Built */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Year Built</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 font-mono text-stone-900">
                      {p.specs.yearBuilt}
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Architectural Style */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Architectural Style</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-stone-900">
                      {p.architecturalHighlights.style}
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Key Amenities */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Primary Amenities</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-stone-700">
                      <ul className="list-disc list-inside space-y-1">
                        {p.amenities.slice(0, 4).map((a, idx) => (
                          <li key={idx} className="truncate">{a}</li>
                        ))}
                      </ul>
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

                {/* Verification */}
                <tr>
                  <td className="p-3 bg-stone-50 font-medium text-stone-600">Audit Status</td>
                  {compareProperties.map((p) => (
                    <td key={p.id} className="p-3 text-emerald-800 font-medium flex items-center gap-1">
                      <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                      <span>{p.verifiedBadgeText}</span>
                    </td>
                  ))}
                  {compareProperties.length < 4 && <td className="bg-stone-50/30" />}
                </tr>

              </tbody>
            </table>
          </div>

        </div>
      )}

    </div>
  );
};
