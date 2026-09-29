import React, { useState, useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { 
  ChevronLeft,
  ChevronRight,
  Search,
  CheckCircle2, 
  ShieldCheck, 
  FileText, 
  Eye
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { RedfinPropertyCard } from '../components/property/RedfinPropertyCard';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { HeroSearchBar } from '../components/home/HeroSearchBar';

export const HomePage: React.FC = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [cardsPerView, setCardsPerView] = useState(3);

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

  const featuredProperties = PROPERTIES;
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
      
      {/* 1. HERO SECTION: Edge-to-edge full width and full screen height layout */}
      <section className="w-full">
        <div className="relative w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-18 xl:px-20 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16 bg-stone-950 text-white rounded-none border-0 overflow-hidden">
          
          {/* Background Image Layer with Custom Image */}
          <div 
            className="absolute inset-0 z-0 overflow-hidden pointer-events-none bg-stone-950 bg-cover bg-center bg-no-repeat"
            style={{
              backgroundImage: `url('/ChatGPT Image Sep 29, 2026, 06_40_53 AM.png')`,
              backgroundSize: 'cover',
              backgroundPosition: 'center',
              backgroundRepeat: 'no-repeat',
            }}
          >
            {/* Subtle dark overlay and vertical gradient to keep headline text, navigation, and search bar crisp & readable */}
            <div className="absolute inset-0 bg-black/60" />
            <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/65 to-stone-950/25" />
          </div>

          {/* Top Hero Kicker */}
          <div className="relative z-10 flex items-center justify-between">
            <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-stone-300 font-mono">
              <span className="w-2.5 h-2.5 rounded-full bg-white" />
              <span>ESTRA Digital Real Estate Marketplace</span>
            </div>
            <div className="hidden sm:block text-sm text-stone-400 font-mono">
              Q3/2026 Index
            </div>
          </div>

          {/* Center / Bottom Hero Typography: Scaled up hero heading and subtitle */}
          <div className="relative z-20 max-w-4xl my-auto py-8 sm:py-12">
            <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white font-architectural leading-[1.05] text-balance">
              Real Estate for Business & Living
            </h1>
            <p className="mt-5 sm:mt-6 text-base sm:text-xl lg:text-2xl text-stone-200 max-w-3xl font-normal leading-relaxed">
              Rent, purchase, and manage verified commercial headquarters, modern residences, and urban development parcels with institutional precision.
            </p>
            
            {/* Real Estate Hero Search Bar with Interactive Tabs & Red Circular Button */}
            <div className="mt-8 sm:mt-10 w-full max-w-xl relative z-40">
              <HeroSearchBar />
            </div>
          </div>

          {/* Hero Bottom Bar */}
          <div className="relative z-10 mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-400">
            <span>Verified Title Registration & Structural Due Diligence</span>
            <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
              <span>4,000+ Active Listings</span>
              <span className="hidden sm:inline">·</span>
              <span className="hidden sm:inline">24 Major Metropolitan Hubs</span>
            </div>
          </div>
        </div>
      </section>

      {/* 2. FEATURED PROPERTIES: Interactive 3-Card Carousel (Redfin Style) */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 sm:pt-12 pb-8 sm:py-10">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6">
          <div>
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
              Properties Worth Seeing
            </h2>
            <p className="text-xs sm:text-sm text-stone-500 mt-1">
              Curated architectural residences, corporate pavilions, and prime penthouses
            </p>
          </div>

          {/* Carousel Previous / Next Navigation Arrows (Redfin Style) */}
          <div className="flex items-center gap-2 self-start sm:self-auto">
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
              alt="ESTRA Advisory Building"
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
