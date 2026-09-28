import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Heart, Share2, Check } from 'lucide-react';
import { Property } from '../../types/property';
import { useMarketplace } from '../../context/MarketplaceContext';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface RedfinPropertyCardProps {
  property: Property;
  className?: string;
}

export const RedfinPropertyCard: React.FC<RedfinPropertyCardProps> = ({
  property,
  className = '',
}) => {
  const { toggleSave, isSaved } = useMarketplace();
  const saved = isSaved(property.id);
  const [copied, setCopied] = useState(false);

  const handleShare = async (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    const shareUrl = `${window.location.origin}/properties/${property.slug}`;
    if (navigator.clipboard) {
      try {
        await navigator.clipboard.writeText(shareUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error('Failed to copy link:', err);
      }
    }
  };

  const handleToggleFavorite = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    toggleSave(property.id);
  };

  // Format specs in Redfin style: "3 beds · 1 bath · 1,042 sq ft"
  const renderSpecs = () => {
    const parts: string[] = [];

    if (property.specs.beds > 0) {
      parts.push(`${property.specs.beds} ${property.specs.beds === 1 ? 'bed' : 'beds'}`);
    }
    if (property.specs.baths > 0) {
      parts.push(`${property.specs.baths} ${property.specs.baths === 1 ? 'bath' : 'baths'}`);
    }
    if (property.specs.sqft > 0) {
      parts.push(`${property.specs.sqft.toLocaleString()} sq ft`);
    } else if (property.specs.lotSize) {
      parts.push(property.specs.lotSize);
    }

    if (parts.length === 0) {
      parts.push(property.category);
    }

    return parts.join(' · ');
  };

  const fullAddress = `${property.location.address}, ${property.location.city}, ${property.location.state} ${property.location.zip}`;

  return (
    <article
      className={`group relative bg-white rounded-2xl p-2.5 sm:p-3 border border-stone-200/90 hover:border-stone-300 hover:shadow-md transition-all duration-300 flex flex-col h-full ${className}`}
    >
      {/* Card Top: Image with rounded corners and floating badges */}
      <div className="relative aspect-[4/3] w-full rounded-xl sm:rounded-2xl overflow-hidden bg-stone-100">
        <Link to={`/properties/${property.slug}`} className="block w-full h-full">
          <ImageWithFallback
            src={property.images[0]}
            alt={property.title}
            fallbackTitle={property.title}
            className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-105"
          />
        </Link>

        {/* Floating Badges on Top Left */}
        <div className="absolute top-2.5 left-2.5 flex flex-wrap items-center gap-1.5 pointer-events-none">
          <span className="bg-stone-900/90 text-white text-[10px] sm:text-[11px] font-bold px-2 sm:px-2.5 py-0.5 sm:py-1 rounded-md tracking-wider uppercase backdrop-blur-xs shadow-xs">
            {property.listingType === 'buy' ? 'FOR SALE' : 'FOR LEASE'}
          </span>
          <span className="bg-white/95 text-stone-900 text-[9px] sm:text-[10px] font-semibold px-2 py-0.5 sm:py-1 rounded-md uppercase tracking-wider backdrop-blur-xs shadow-xs">
            3D WALKTHROUGH
          </span>
        </div>
      </div>

      {/* Card Bottom: Details */}
      <div className="pt-3 px-1 pb-1 flex flex-col justify-between flex-1">
        <div>
          {/* Row 1: Large bold price on left, subtle Share & Favorite/Heart on right */}
          <div className="flex items-center justify-between gap-2">
            <Link to={`/properties/${property.slug}`} className="block hover:opacity-90 transition-opacity">
              <span className="text-xl sm:text-2xl font-bold text-stone-950 font-architectural tracking-tight tabular-nums">
                {property.priceDisplay}
                {property.period === 'month' && (
                  <span className="text-xs font-normal text-stone-500">/mo</span>
                )}
              </span>
            </Link>

            <div className="flex items-center gap-1">
              {/* Share Button */}
              <button
                type="button"
                onClick={handleShare}
                className="relative p-2 rounded-full text-stone-500 hover:text-stone-900 hover:bg-stone-100 transition-colors cursor-pointer"
                title={copied ? 'Link copied!' : 'Share property'}
                aria-label="Share property link"
              >
                {copied ? (
                  <Check className="w-4 h-4 text-emerald-600 stroke-[2]" />
                ) : (
                  <Share2 className="w-4 h-4 stroke-[1.75]" />
                )}
                {copied && (
                  <span className="absolute -top-7 left-1/2 -translate-x-1/2 bg-stone-900 text-white text-[10px] px-1.5 py-0.5 rounded shadow-sm whitespace-nowrap">
                    Copied!
                  </span>
                )}
              </button>

              {/* Favorite / Heart Button */}
              <button
                type="button"
                onClick={handleToggleFavorite}
                className="p-2 rounded-full text-stone-500 hover:text-red-600 hover:bg-stone-100 transition-colors cursor-pointer"
                title={saved ? 'Remove from saved' : 'Save property'}
                aria-label={saved ? 'Remove from saved' : 'Save property'}
              >
                <Heart
                  className={`w-4 h-4 transition-colors ${
                    saved
                      ? 'fill-red-600 text-red-600 stroke-[2]'
                      : 'stroke-[1.75] hover:fill-red-100'
                  }`}
                />
              </button>
            </div>
          </div>

          {/* Row 2: Compact bed/bath/sqft specs in muted text */}
          <div className="text-xs sm:text-sm text-stone-600 font-medium mt-1">
            {renderSpecs()}
          </div>

          {/* Row 3: Full property address in clean single-line typography */}
          <div className="mt-1">
            <Link
              to={`/properties/${property.slug}`}
              className="text-xs sm:text-sm text-stone-500 hover:text-stone-800 transition-colors block truncate"
              title={fullAddress}
            >
              {fullAddress}
            </Link>
          </div>
        </div>
      </div>
    </article>
  );
};
