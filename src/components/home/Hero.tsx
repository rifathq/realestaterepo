import React from 'react';
import { HeroSearchBar } from './HeroSearchBar';

export const Hero: React.FC = () => {
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
            <span>DIGENTIC DIGITAL REAL ESTATE</span>
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
          <p className="mt-5 sm:mt-6 text-base sm:text-xl lg:text-2xl text-stone-200 max-w-3xl font-normal leading-relaxed">
            Rent, purchase, and manage verified commercial headquarters, modern residences, and urban development parcels with institutional precision.
          </p>

          {/* Real Estate Hero Search Bar with Interactive Tabs & Red Circular Button */}
          <div className="mt-8 sm:mt-10 w-full max-w-xl relative z-40">
            <HeroSearchBar />
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
