import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Building2, CheckCircle2, ArrowRight, Award, FileText, Users } from 'lucide-react';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AboutPage: React.FC = () => {
  return (
    <div className="pb-24 space-y-20">
      
      {/* Editorial Hero */}
      <section className="bg-stone-900 text-white py-20 sm:py-24 border-b border-stone-800 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>ESTRA Institutional Platform Charter</span>
          </div>
          <h1 className="text-4xl sm:text-6xl font-bold tracking-tight text-white font-architectural leading-tight">
            Elevating how architectural real estate is discovered and acquired.
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Founded to eliminate information asymmetry in commercial and luxury real estate. We combine rigorous engineering audits, verified ownership titles, and transparent valuation benchmarks.
          </p>
        </div>
      </section>

      {/* Core Mission & Image Split */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center">
          
          <div className="lg:col-span-6 relative aspect-4/3 rounded-xl overflow-hidden bg-stone-100 border border-stone-200">
            <ImageWithFallback
              src="https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80"
              alt="ESTRA Advisory Headquarters"
              className="w-full h-full object-cover"
            />
          </div>

          <div className="lg:col-span-6 space-y-5">
            <h2 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
              Architectural Transparency as a Standard
            </h2>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Real estate transactions are traditionally burdened by opaque pricing, outdated floor plans, and unverified broker claims. ESTRA was created to replace outdated brokerage conventions with a verified digital ledger.
            </p>
            <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
              Every asset listed on ESTRA undergoes a four-stage audit: municipal title deed cross-referencing, architectural square footage measurement, Phase 1 environmental review, and mechanical/electrical compliance verification.
            </p>
            <div className="pt-2">
              <Link
                to="/how-it-works"
                className="inline-flex items-center gap-1.5 text-xs font-semibold text-stone-950 border-b border-stone-900 pb-0.5 hover:text-stone-700"
              >
                <span>Explore the ESTRA Verification Protocol</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
              </Link>
            </div>
          </div>

        </div>
      </section>

      {/* Statistics Strip: Inspired by reference image */}
      <section className="bg-stone-100 py-16 border-y border-stone-200 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 text-center divide-x divide-stone-200">
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-stone-950 font-mono">11+</div>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">Years in Marketplace</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-stone-950 font-mono">1,200+</div>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">Successful Deals Closed</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-stone-950 font-mono">4,200+</div>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">Verified Active Assets</p>
            </div>
            <div>
              <div className="text-4xl sm:text-5xl font-bold text-stone-950 font-mono">98%</div>
              <p className="text-xs sm:text-sm text-stone-500 mt-2 font-medium">Client Trust Satisfaction</p>
            </div>
          </div>
        </div>
      </section>

      {/* Pillars of Integrity */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 space-y-10">
        <div className="text-center max-w-2xl mx-auto">
          <h2 className="text-3xl font-bold tracking-tight text-stone-950 font-architectural">
            The ESTRA Principles
          </h2>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Governing standards applied to every listing, transaction, and client advisory engagement
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          <div className="p-8 bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center mb-4">
              <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-stone-950">Zero-Speculation Verification</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              We do not publish speculative listings or unverified properties. Every offering is backed by certified public documentation, confirmed ownership, and actual architectural plans.
            </p>
          </div>

          <div className="p-8 bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center mb-4">
              <Building2 className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-stone-950">Architectural Distinction</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Our catalog focuses on properties exhibiting structural excellence: high-performance workplace envelopes, sustainable timber framing, and architecturally significant residences.
            </p>
          </div>

          <div className="p-8 bg-white border border-stone-200 space-y-3">
            <div className="w-10 h-10 rounded-full bg-stone-900 text-white flex items-center justify-center mb-4">
              <FileText className="w-5 h-5 stroke-[1.5]" />
            </div>
            <h3 className="text-lg font-bold text-stone-950">Transparent Escrow Protocol</h3>
            <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
              Transaction terms, closing costs, and brokerage commissions are disclosed upfront without hidden syndication fees or opaque markup layers.
            </p>
          </div>
        </div>
      </section>

      {/* Regional Advisory Hubs */}
      <section className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="p-8 sm:p-12 bg-stone-900 text-white border border-stone-800">
          <div className="max-w-2xl mb-8">
            <h2 className="text-2xl sm:text-3xl font-bold font-architectural">
              Metropolitan Advisory Hubs
            </h2>
            <p className="text-xs sm:text-sm text-stone-400 mt-1">
              ESTRA maintains dedicated private client advisory rooms across four key corporate regions.
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 text-xs font-mono">
            <div className="p-4 bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-stone-400 block">San Francisco (HQ)</span>
              <p className="font-semibold text-white">420 Montgomery St, Floor 14</p>
              <p className="text-stone-400">+1 (415) 890-2410</p>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-stone-400 block">New York City</span>
              <p className="font-semibold text-white">110 Central Park South, Suite 8</p>
              <p className="text-stone-400">+1 (212) 640-9120</p>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-stone-400 block">Seattle</span>
              <p className="font-semibold text-white">740 Bellevue Way NE, Suite 600</p>
              <p className="text-stone-400">+1 (206) 554-3891</p>
            </div>
            <div className="p-4 bg-stone-950 border border-stone-800 space-y-1">
              <span className="text-stone-400 block">Austin</span>
              <p className="font-semibold text-white">300 Colorado Street, Suite 1200</p>
              <p className="text-stone-400">+1 (512) 718-4902</p>
            </div>
          </div>
        </div>
      </section>

    </div>
  );
};
