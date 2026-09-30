import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="bg-stone-900 text-stone-300 border-t border-stone-800">
      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-16 lg:py-20">
        <div className="grid grid-cols-1 md:grid-cols-12 gap-12 lg:gap-16">
          
          {/* Brand & Statement */}
          <div className="md:col-span-4 space-y-4">
            <Link to="/" className="text-2xl font-bold tracking-tight text-white font-architectural">
              Digentic Realty
            </Link>
            <p className="text-sm text-stone-400 max-w-sm leading-relaxed">
              A unified marketplace to discover, evaluate, and acquire verified architectural residences and commercial properties with total data transparency.
            </p>
            <div className="pt-2">
              <span className="inline-flex items-center gap-2 text-xs text-stone-400">
                <span className="w-2 h-2 rounded-full bg-emerald-400" />
                Licensed Real Estate Brokerage & Advisory
              </span>
            </div>
          </div>

          {/* Navigation Links */}
          <div className="md:col-span-2">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 mb-4">
              Marketplace
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/properties" className="hover:text-white transition-colors">
                  Explore All
                </Link>
              </li>
              <li>
                <Link to="/properties?type=buy" className="hover:text-white transition-colors">
                  Buy Property
                </Link>
              </li>
              <li>
                <Link to="/properties?type=rent" className="hover:text-white transition-colors">
                  Rent Property
                </Link>
              </li>
              <li>
                <Link to="/sell" className="hover:text-white transition-colors">
                  Sell & List
                </Link>
              </li>
            </ul>
          </div>

          {/* Platform & Advisory */}
          <div className="md:col-span-3">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 mb-4">
              Platform & Advisory
            </h4>
            <ul className="space-y-2.5 text-sm text-stone-400">
              <li>
                <Link to="/agents/advisors" className="hover:text-white transition-colors">
                  Licensed Advisors
                </Link>
              </li>
              <li>
                <Link to="/how-it-works" className="hover:text-white transition-colors">
                  How Digentic Works
                </Link>
              </li>
              <li>
                <Link to="/about" className="hover:text-white transition-colors">
                  About & Standards
                </Link>
              </li>
              <li>
                <Link to="/faq" className="hover:text-white transition-colors">
                  Marketplace FAQ
                </Link>
              </li>
              <li>
                <Link to="/contact" className="hover:text-white transition-colors">
                  Private Client Office
                </Link>
              </li>
            </ul>
          </div>

          {/* Metropolitan Hubs & Direct Inquiry */}
          <div className="md:col-span-3 space-y-4">
            <h4 className="text-xs font-semibold uppercase tracking-wider text-stone-100 mb-4">
              Direct Advisory
            </h4>
            <p className="text-xs text-stone-400 leading-relaxed">
              Inquire regarding off-market acquisitions, corporate relocations, or private viewings.
            </p>
            <div className="space-y-1.5 text-xs text-stone-300 font-mono">
              <p>+1 (800) 419-3782</p>
              <p>advisory@digentic-realty.com</p>
            </div>
            <Link
              to="/contact"
              className="inline-flex items-center gap-1.5 text-xs font-medium text-white hover:text-stone-300 pt-1 border-b border-stone-700 pb-0.5"
            >
              <span>Schedule Institutional Consultation</span>
              <ArrowUpRight className="w-3.5 h-3.5 stroke-[1.5]" />
            </Link>
          </div>

        </div>

        {/* Bottom bar */}
        <div className="mt-16 pt-8 border-t border-stone-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-stone-500">
          <p>© 2026 Digentic Realty Inc. All rights reserved.</p>
          <div className="flex items-center gap-6">
            <Link to="/faq" className="hover:text-stone-300 transition-colors">
              Equal Housing Opportunity
            </Link>
            <Link to="/faq" className="hover:text-stone-300 transition-colors">
              Privacy Policy
            </Link>
            <Link to="/faq" className="hover:text-stone-300 transition-colors">
              Terms of Brokerage
            </Link>
          </div>
        </div>

      </div>
    </footer>
  );
};
