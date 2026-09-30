import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Eye,
  ArrowRight
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { useMarketplace } from '../context/MarketplaceContext';
import { RedfinPropertyCard } from '../components/property/RedfinPropertyCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { Hero } from '../components/home/Hero';

export const HomePage: React.FC = () => {
  const { properties } = useMarketplace();
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);
  const [showAllListings, setShowAllListings] = useState(false);

  // Touch tracking for mobile swipe
  const touchStartX = useRef<number | null>(null);
  const touchDeltaX = useRef<number>(0);

  // Responsive cards-per-view tracking (1 mobile, 2 tablet, 3 desktop)
  useEffect(() => {
    const handleResize = () => {
      if (typeof window !== 'undefined') {
        if (window.innerWidth >= 1024) {
          setCardsPerView(3);
        } else if (window.innerWidth >= 640) {
          setCardsPerView(2);
        } else {
          setCardsPerView(1);
        }
      }
    };

    handleResize();
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const featuredProperties = properties && properties.length > 0 ? properties : PROPERTIES;
  const maxIndex = Math.max(0, featuredProperties.length - cardsPerView);
  const validIndex = Math.min(currentIndex, maxIndex);

  const handlePrev = () => {
    setCurrentIndex((prev) => Math.max(0, prev - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => Math.min(maxIndex, prev + 1));
  };

  // Touch gestures for swipe
  const handleTouchStart = (e: React.TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchDeltaX.current = 0;
  };

  const handleTouchMove = (e: React.TouchEvent) => {
    if (touchStartX.current !== null) {
      touchDeltaX.current = e.touches[0].clientX - touchStartX.current;
    }
  };

  const handleTouchEnd = () => {
    if (touchStartX.current !== null) {
      if (touchDeltaX.current > 45 && validIndex > 0) {
        handlePrev();
      } else if (touchDeltaX.current < -45 && validIndex < maxIndex) {
        handleNext();
      }
    }
    touchStartX.current = null;
    touchDeltaX.current = 0;
  };

  return (
    <div className="space-y-24 sm:space-y-32 pb-24 w-full">
      
      {/* 1. HERO SECTION */}
      <Hero />

      {/* 2. FEATURED PROPERTIES: Interactive 3-Card Carousel (Redfin Style) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 pb-8 sm:py-10">
        <div className="flex items-end justify-between gap-4 mb-6">
          <div className="min-w-0 pr-2">
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
              Properties Worth Seeing
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Curated architectural residences, corporate pavilions, and prime penthouses
            </p>
          </div>

          {/* Carousel Previous / Next Navigation Arrows on the Far Right */}
          <div className="flex items-center gap-2 shrink-0">
            <button
              type="button"
              onClick={handlePrev}
              disabled={validIndex <= 0}
              aria-label="Previous properties"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${
                validIndex <= 0
                  ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50/50'
                  : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-2xs active:scale-95 cursor-pointer'
              }`}
            >
              <ChevronLeft className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>

            <button
              type="button"
              onClick={handleNext}
              disabled={validIndex >= maxIndex}
              aria-label="Next properties"
              className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full border flex items-center justify-center transition-all ${
                validIndex >= maxIndex
                  ? 'border-stone-200 text-stone-300 cursor-not-allowed bg-stone-50/50'
                  : 'border-stone-300 bg-white text-stone-800 hover:bg-stone-900 hover:text-white hover:border-stone-900 shadow-2xs active:scale-95 cursor-pointer'
              }`}
            >
              <ChevronRight className="w-4 h-4 sm:w-5 sm:h-5 stroke-[2]" />
            </button>
          </div>
        </div>

        {/* Carousel Viewport Container */}
        <div
          className="w-full overflow-hidden select-none"
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
        >
          <div
            className="flex gap-6 transition-transform duration-500 ease-out will-change-transform"
            style={{
              transform: `translateX(calc(-${validIndex} * ((100% + 24px) / ${cardsPerView})))`
            }}
          >
            {featuredProperties.map((property) => (
              <div
                key={property.id}
                className="shrink-0 w-full sm:w-[calc((100%-24px)/2)] lg:w-[calc((100%-48px)/3)]"
              >
                <RedfinPropertyCard property={property} />
              </div>
            ))}
          </div>
        </div>

        {/* Carousel Pagination Dots */}
        {maxIndex > 0 && (
          <div className="flex items-center justify-center gap-2 mt-6">
            {Array.from({ length: maxIndex + 1 }).map((_, index) => (
              <button
                key={index}
                type="button"
                onClick={() => setCurrentIndex(index)}
                aria-label={`Go to slide ${index + 1}`}
                className={`transition-all duration-300 rounded-full cursor-pointer ${
                  validIndex === index
                    ? 'w-6 h-2 bg-stone-900'
                    : 'w-2 h-2 bg-stone-300 hover:bg-stone-400'
                }`}
              />
            ))}
          </div>
        )}

        {/* Modern Luxury CTA: Explore All Listings */}
        <div className="mt-12 mb-8 flex flex-col items-center justify-center text-center">
          {/* Pill Badge indicating total count */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-slate-100/90 text-slate-700 border border-slate-200 text-xs font-mono font-medium mb-3.5 shadow-2xs">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span>120+ Verified Properties</span>
          </div>

          {/* Action Row */}
          <div className="flex flex-col sm:flex-row items-center gap-3">
            {/* Primary Action Button (Option A: Direct link to /explore catalog) */}
            <Link
              to="/explore"
              className="group inline-flex items-center gap-2.5 bg-slate-900 hover:bg-slate-800 text-white rounded-full px-8 py-3.5 text-sm font-medium transition-all duration-200 shadow-sm hover:shadow-md hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>Explore All Listings</span>
              <ArrowRight className="w-4 h-4 stroke-[2] transition-transform duration-200 group-hover:translate-x-1.5" />
            </Link>

            {/* In-page Toggle Button (Option B: Expands full grid in place) */}
            <button
              type="button"
              onClick={() => setShowAllListings((prev) => !prev)}
              className="inline-flex items-center gap-2 rounded-full px-6 py-3.5 text-sm font-medium text-slate-700 hover:text-slate-950 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 transition-all duration-200 shadow-2xs hover:-translate-y-0.5 active:translate-y-0 cursor-pointer"
            >
              <span>{showAllListings ? 'Collapse Grid' : 'Quick View All in Grid'}</span>
            </button>
          </div>

          {/* Subtle micro-copy */}
          <p className="text-xs text-slate-500 mt-3 font-normal tracking-tight">
            Updated in real-time · Full portfolio available
          </p>
        </div>

        {/* Option B: Expanded Grid View when toggled */}
        {showAllListings && (
          <div className="mt-8 pt-8 border-t border-slate-200 animate-in fade-in duration-300">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-6">
              <div>
                <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-slate-950 font-architectural">
                  Full Portfolio Showcase
                </h3>
                <p className="text-xs sm:text-sm text-slate-500 mt-0.5">
                  Displaying all verified architectural assets currently on-market
                </p>
              </div>
              <Link
                to="/explore"
                className="text-xs font-semibold text-slate-900 hover:text-amber-700 transition-colors inline-flex items-center gap-1 group self-start sm:self-auto"
              >
                <span>Open Advanced Filter Catalog</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {featuredProperties.map((property) => (
                <RedfinPropertyCard key={`grid-${property.id}`} property={property} />
              ))}
            </div>
          </div>
        )}
      </section>

      {/* 6. HOW WE WORK: Full width */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="mb-10">
          <h2 className="text-4xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
            How We Work
          </h2>
          <p className="text-sm sm:text-base text-stone-500 mt-1 max-w-xl">
            We have made the entire property search, verification, and transaction process as simple and transparent as possible.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-16 items-center">
          {/* Left: Tall architectural photo */}
          <div className="lg:col-span-5 relative aspect-4/5 lg:aspect-3/4 rounded-2xl sm:rounded-3xl overflow-hidden bg-stone-100 border border-stone-200">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1577495508048-b635879837f1?auto=format&fit=crop&w=1200&q=80"
              alt="Digentic Realty Advisory Building"
              className="w-full h-full object-cover"
            />
            {/* Consultation badge circular element */}
            <div className="absolute top-6 right-6 w-32 h-32 rounded-full bg-stone-900/85 backdrop-blur-xs text-white p-3 flex flex-col items-center justify-center text-center shadow-lg border border-stone-700">
              <span className="text-xs font-semibold tracking-tight uppercase leading-tight">
                Verified
              </span>
              <span className="text-[10px] text-stone-300 font-normal mt-0.5">
                Advisory Protocol
              </span>
            </div>
          </div>

          {/* Right: Step-by-step process list */}
          <div className="lg:col-span-7 space-y-7">
            
            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <CheckCircle2 className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  01. Free Architectural Consultation
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Needs and spatial analysis. We identify structural requirements, square footage targets, zoning regulations, and financial caps.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Search className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  02. Search & Selection of Verified Properties
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  We curate verified on-market and off-market opportunities strictly matched to your programmatic requirements.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <Eye className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  03. Private Viewing & Engineering Assessment
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Accompanied in-person walkthroughs or high-definition live virtual tours with technical MEP overviews and spatial evaluations.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5 pb-6 border-b border-stone-200">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <FileText className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  04. Document Verification & Due Diligence
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Comprehensive review of title deeds, ownership rights, environmental reports, and building compliance documentation.
                </p>
              </div>
            </div>

            <div className="flex items-start gap-5">
              <div className="w-12 h-12 shrink-0 rounded-full bg-stone-900 text-white flex items-center justify-center">
                <ShieldCheck className="w-6 h-6 stroke-[1.5]" />
              </div>
              <div>
                <h3 className="text-lg font-bold text-stone-950 tracking-tight">
                  05. Transaction Support & Escrow Closing
                </h3>
                <p className="text-sm sm:text-base text-stone-600 mt-1 leading-relaxed">
                  Full legal advisory and settlement assistance until final lease execution or title deed handover.
                </p>
              </div>
            </div>

          </div>
        </div>
      </section>

    </div>
  );
};
