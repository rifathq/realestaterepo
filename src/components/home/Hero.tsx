import React, { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { HeroSearchBar, HeroSearchTab } from './HeroSearchBar';
import { CinematicBrandText } from '../common/CinematicBrandText';
import { useMarketplace } from '../../context/MarketplaceContext';

const TAB_MESSAGES: Record<HeroSearchTab, string> = {
  Buy: 'Find a home, property, or investment that fits your needs.',
  Mortgage: 'Explore financing options and estimate what you can afford.',
  Sell: 'List your property and connect with qualified buyers.',
  Rent: 'Discover verified homes and commercial spaces available for rent.',
};

export const Hero: React.FC = () => {
  const { content } = useMarketplace();
  const [activeTab, setActiveTab] = useState<HeroSearchTab>('Buy');

  return (
    <section className="relative isolate w-full min-h-screen overflow-hidden bg-stone-950 text-white flex flex-col justify-between">
      {/* Background Video */}
      <video
        src="/hero-video.mp4"
        autoPlay
        loop
        muted
        playsInline
        className="absolute inset-0 w-full h-full object-cover -z-10"
      />

      {/* Semi-transparent dark readability overlay and gradient */}
      <div className="absolute inset-0 bg-black/50 -z-10 pointer-events-none" />
      <div className="absolute inset-0 bg-gradient-to-t from-stone-950 via-stone-950/40 to-stone-950/20 -z-10 pointer-events-none" />

      {/* Hero content wrapped in container with relative z-10 so interactions and clicks work without issue */}
      <div className="relative z-10 w-full min-h-screen flex flex-col justify-between px-6 sm:px-12 lg:px-18 xl:px-20 pt-24 sm:pt-28 lg:pt-32 pb-12 sm:pb-16">
        {/* Top Hero Kicker */}
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3 text-sm uppercase tracking-widest text-stone-300 font-mono">
            <span className="w-2.5 h-2.5 rounded-full bg-white" />
            <CinematicBrandText
              text="DIGENTIC REALTY"
              theme="dark"
              letterSpacingStart="0.22em"
              letterSpacingEnd="0.12em"
              className="text-stone-200"
            />
          </div>
          <div className="hidden sm:block text-sm text-stone-400 font-mono">
            Q3/2026 Index
          </div>
        </div>

        {/* Center / Bottom Hero Typography */}
        <div className="max-w-4xl my-auto py-8 sm:py-12">
          <h1 className="text-4xl sm:text-6xl lg:text-7xl xl:text-8xl font-bold tracking-tight text-white font-architectural leading-[1.05] text-balance">
            Real Estate for Business & Living
          </h1>
          
          {/* Dynamic Message for selected tab with smooth 250ms fade + slight upward motion */}
          <div className="mt-5 sm:mt-6 min-h-[3rem] sm:min-h-[3.5rem] flex items-center">
            <AnimatePresence mode="wait" initial={false}>
              <motion.p
                key={activeTab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                className="text-base sm:text-xl lg:text-2xl text-stone-200 max-w-3xl font-normal leading-relaxed text-balance"
              >
                {TAB_MESSAGES[activeTab]}
              </motion.p>
            </AnimatePresence>
          </div>

          {/* Real Estate Hero Search Bar with Interactive Tabs & Red Circular Button */}
          <div className="mt-8 sm:mt-10 w-full max-w-xl relative z-40">
            <HeroSearchBar activeTab={activeTab} onTabChange={setActiveTab} />
          </div>
        </div>

        {/* Hero Bottom Bar */}
        <div className="mt-8 pt-6 border-t border-stone-800/80 flex flex-wrap items-center justify-between gap-4 text-xs sm:text-sm text-stone-400">
          <span>Verified Title Registration & Structural Due Diligence</span>
          <div className="flex items-center gap-6 font-mono text-xs sm:text-sm">
            <span>4,000+ Active Listings</span>
            <span className="hidden sm:inline">·</span>
            <span className="hidden sm:inline">24 Major Metropolitan Hubs</span>
          </div>
        </div>
      </div>
    </section>
  );
};

export default Hero;
