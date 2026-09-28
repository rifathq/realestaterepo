import React, { useState } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Menu, X, User } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const location = useLocation();
  const { savedIds, user, setAuthModalOpen } = useMarketplace();

  const isActive = (href: string) => {
    const [path, query] = href.split('?');
    // If href is home '/'
    if (href === '/') {
      return location.pathname === '/' && !location.search;
    }

    // If href has query params (like '/properties?type=buy' or '/properties?type=rent')
    if (query) {
      if (location.pathname !== path) return false;
      const hrefParams = new URLSearchParams(query);
      const currentParams = new URLSearchParams(location.search);
      for (const [key, value] of hrefParams.entries()) {
        if (currentParams.get(key) !== value) return false;
      }
      return true;
    }

    // If href is '/properties' (Explore)
    if (href === '/properties') {
      if (location.pathname !== '/properties') return false;
      const currentParams = new URLSearchParams(location.search);
      const currentType = currentParams.get('type');
      // If user is explicitly on ?type=buy or ?type=rent, Buy/Rent is active, not Explore
      if (currentType === 'buy' || currentType === 'rent') return false;
      return true;
    }

    // For other paths like '/sell', '/agents', '/how-it-works'
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const navLinks = [
    { label: 'Buy', href: '/properties?type=buy' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Sell', href: '/sell' },
    { label: 'Explore', href: '/properties' },
    { label: 'Agents', href: '/agents' },
    { label: 'How It Works', href: '/how-it-works' },
  ];

  return (
    <>
      <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 sm:h-22 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 font-architectural"
          >
            <span>ESTRA</span>
          </Link>

          {/* Zone 2: Clean text navigation links */}
          <nav className="hidden lg:flex items-center gap-8 xl:gap-10 text-base font-medium text-stone-600">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors py-1 relative ${
                  isActive(link.href)
                    ? 'text-stone-950 font-semibold'
                    : 'hover:text-stone-950'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-stone-900" />
                )}
              </Link>
            ))}
          </nav>

          {/* Zone 3: Actions & utility affordances */}
          <div className="flex items-center gap-3 sm:gap-4">
            {/* Saved properties quick link */}
            <Link
              to="/saved"
              className="relative p-2.5 text-stone-600 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              title="Saved Properties"
              aria-label="Saved properties"
            >
              <Bookmark className="w-5 h-5 stroke-[1.5]" />
              {savedIds.length > 0 && (
                <span className="absolute top-1 right-1 w-4 h-4 text-[10px] font-bold bg-stone-900 text-white flex items-center justify-center">
                  {savedIds.length}
                </span>
              )}
            </Link>

            {/* Sign in / Account */}
            <button
              onClick={() => setAuthModalOpen(true)}
              className="hidden sm:flex items-center gap-2 px-4 py-2.5 text-sm font-medium text-stone-700 hover:text-stone-950 hover:bg-stone-100 border border-stone-200 transition-colors"
            >
              <User className="w-4 h-4 stroke-[1.5]" />
              <span>{user ? user.name.split(' ')[0] : 'Sign In'}</span>
            </button>

            {/* Mobile menu toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-stone-700 hover:text-stone-950 hover:bg-stone-100 transition-colors"
              aria-label="Toggle navigation menu"
            >
              {mobileMenuOpen ? (
                <X className="w-6 h-6 stroke-[1.5]" />
              ) : (
                <Menu className="w-6 h-6 stroke-[1.5]" />
              )}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-30 top-18 bg-white border-b border-stone-200 flex flex-col p-6 overflow-y-auto">
          <div className="space-y-4 text-base font-medium text-stone-800 pb-6 border-b border-stone-200">
            {navLinks.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-stone-950"
            >
              About ESTRA
            </Link>
            <Link
              to="/faq"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-stone-950"
            >
              FAQ
            </Link>
            <Link
              to="/contact"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-stone-950"
            >
              Contact Advisory
            </Link>
          </div>

          <div className="pt-6 space-y-3">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors text-center"
            >
              {user ? `Signed in as ${user.name}` : 'Sign In to Account'}
            </button>
            <Link
              to="/sell"
              onClick={() => setMobileMenuOpen(false)}
              className="block w-full py-2.5 px-4 text-xs font-medium text-white bg-stone-900 hover:bg-stone-800 transition-colors text-center"
            >
              List a Property
            </Link>
          </div>
        </div>
      )}
    </>
  );
};
