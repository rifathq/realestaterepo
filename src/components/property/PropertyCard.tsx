import React from 'react';
import { Link } from 'react-router-dom';
import { Bookmark } from 'lucide-react';
import { Property } from '../../types/property';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface PropertyCardProps {
  property: Property;
  className?: string;
  isLargeFeatured?: boolean;
}

export const PropertyCard: React.FC<PropertyCardProps> = ({
  property,
  className = '',
  isLargeFeatured = false,
}) => {
  const { toggleSave, isSaved } = useMarketplace();
  const saved = isSaved(property.id);

  return (
    <article
      className={`group relative bg-white border border-stone-200 flex flex-col transition-all duration-200 hover:border-stone-400 ${className}`}
    >
      {/* Media container */}
      <div className="relative aspect-[16/10] max-h-[260px] w-full overflow-hidden bg-stone-100">
        <Link to={`/properties/${property.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={property.images[0]}
            alt={property.title}
            fallbackTitle={property.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-104"
          />
        </Link>

        {/* Top bar over image: clean unobtrusive status & action affordances */}
        <div className="absolute top-2.5 inset-x-2.5 flex items-center justify-between pointer-events-none">
          {/* Subtle status tag */}
          <span className="pointer-events-auto bg-stone-900/90 backdrop-blur-xs text-white text-[10px] sm:text-xs font-semibold px-2 py-0.5 tracking-tight uppercase">
            {property.listingType === 'buy' ? 'For Sale' : 'For Lease'}
          </span>

          <div className="flex items-center gap-1 pointer-events-auto">
            {/* Save / Favorite toggle */}
            <button
              onClick={(e) => {
                e.preventDefault();
                e.stopPropagation();
                toggleSave(property.id);
              }}
              className={`p-1.5 backdrop-blur-xs transition-colors ${
                saved
                  ? 'bg-stone-900 text-white'
                  : 'bg-white/90 text-stone-700 hover:bg-white hover:text-stone-950'
              }`}
              title={saved ? 'Remove from saved' : 'Save property'}
              aria-label="Toggle favorite"
            >
              <Bookmark className={`w-3.5 h-3.5 stroke-[1.5] ${saved ? 'fill-current' : ''}`} />
            </button>
          </div>
        </div>

        {/* Editorial highlight label if present */}
        {property.editorialHighlight && (
          <div className="absolute bottom-2.5 left-2.5 pointer-events-none">
            <span className="text-[11px] font-semibold text-white/95 bg-stone-950/80 backdrop-blur-xs px-2 py-0.5 tracking-tight">
              {property.editorialHighlight}
            </span>
          </div>
        )}
      </div>

      {/* Content section */}
      <div className="p-4 sm:p-5 flex-1 flex flex-col justify-between">
        <div>
          {/* Unboxed category and location metadata */}
          <div className="flex items-center gap-1.5 text-xs text-stone-600 font-medium mb-1.5 tracking-tight">
            <span className="text-stone-900 font-semibold">{property.category}</span>
            <span aria-hidden="true" className="text-stone-300">·</span>
            <span className="truncate">{property.location.neighborhood}, {property.location.city}</span>
          </div>

          {/* Title */}
          <h3 className="font-semibold tracking-tight text-stone-900 group-hover:text-stone-700 transition-colors line-clamp-1 text-base sm:text-lg">
            <Link to={`/properties/${property.slug}`}>
              {property.title}
            </Link>
          </h3>

          {/* Subtitle / Tagline */}
          <p className="text-xs sm:text-sm text-stone-600 line-clamp-2 mt-1.5 leading-relaxed">
            {property.tagline}
          </p>
        </div>

        {/* Specs bar & Price: Zero-Pill, unboxed text with typographic separators */}
        <div className="pt-3 mt-3.5 border-t border-stone-100 flex items-end justify-between gap-3">
          <div>
            <div className="flex flex-wrap items-center gap-1.5 text-xs sm:text-sm text-stone-800 font-mono font-medium tabular-nums">
              {property.specs.beds > 0 && (
                <>
                  <span>{property.specs.beds} Beds</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                </>
              )}
              {property.specs.baths > 0 && (
                <>
                  <span>{property.specs.baths} Baths</span>
                  <span aria-hidden="true" className="text-stone-300">·</span>
                </>
              )}
              {property.specs.sqft > 0 ? (
                <span>{property.specs.sqft.toLocaleString()} sqft</span>
              ) : (
                <span>{property.specs.lotSize}</span>
              )}
            </div>
            
            <div className="text-[11px] text-stone-500 font-medium mt-0.5">
              {property.specs.pricePerSqft > 0 && (
                <span>${property.specs.pricePerSqft}/sqft</span>
              )}
            </div>
          </div>

          <div className="text-right shrink-0">
            <span className="text-[11px] text-stone-500 block font-normal">
              {property.listingType === 'buy' ? 'Guide Price' : 'Monthly Rent'}
            </span>
            <span className="text-lg sm:text-xl font-bold text-stone-950 font-mono tabular-nums tracking-tight">
              {property.priceDisplay}
              {property.period && (
                <span className="text-xs font-normal text-stone-500">/mo</span>
              )}
            </span>
          </div>
        </div>
      </div>
    </article>
  );
};
