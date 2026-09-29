import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';
import { Bookmark, Menu, X, User, ChevronDown } from 'lucide-react';
import { useMarketplace } from '../../context/MarketplaceContext';
import { useUserLocation } from '../../hooks/useUserLocation';

export const Header: React.FC = () => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [agentsDropdownOpen, setAgentsDropdownOpen] = useState(false);
  const [isMobileAgentsOpen, setIsMobileAgentsOpen] = useState(false);
  const agentsRef = useRef<HTMLDivElement>(null);
  const timerRef = useRef<NodeJS.Timeout | null>(null);

  const location = useLocation();
  const { savedIds, user, setAuthModalOpen } = useMarketplace();
  const { city: userCity, formattedLocation: userLocation } = useUserLocation();

  const dynamicCityLink = `/agents?city=${encodeURIComponent(userCity || userLocation || 'Arlington')}`;
  const isDynamicCityActive = (location.pathname === '/agents' && location.search.includes(encodeURIComponent(userCity || 'Arlington'))) || location.pathname === '/agents/arlington';

  // Close dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (agentsRef.current && !agentsRef.current.contains(e.target as Node)) {
        setAgentsDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
      if (timerRef.current) clearTimeout(timerRef.current);
    };
  }, []);

  // Close dropdown and mobile menu on route changes
  useEffect(() => {
    setAgentsDropdownOpen(false);
    setMobileMenuOpen(false);
    setIsMobileAgentsOpen(false);
  }, [location.pathname]);

  const handleMouseEnter = () => {
    if (timerRef.current) clearTimeout(timerRef.current);
    setAgentsDropdownOpen(true);
  };

  const handleMouseLeave = () => {
    timerRef.current = setTimeout(() => {
      setAgentsDropdownOpen(false);
    }, 180);
  };

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
      if (currentType === 'buy' || currentType === 'rent') return false;
      return true;
    }

    // For other paths
    return location.pathname === path || location.pathname.startsWith(`${path}/`);
  };

  const isAgentsActive = 
    location.pathname === '/agents' || 
    location.pathname.startsWith('/agents/') || 
    location.pathname === '/join-agent';

  const navLinksBefore = [
    { label: 'Buy', href: '/properties?type=buy' },
    { label: 'Rent', href: '/properties?type=rent' },
    { label: 'Sell', href: '/sell' },
    { label: 'Explore', href: '/properties' },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 bg-white/95 backdrop-blur-md border-b border-stone-200 transition-colors">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 h-20 sm:h-22 flex items-center justify-between">
          
          {/* Zone 1: Single text element wordmark */}
          <Link
            to="/"
            className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 font-architectural"
          >
            <span>Digentic Realty</span>
          </Link>

          {/* Zone 2: Clean text navigation links with interactive dropdown */}
          <nav className="hidden lg:flex items-center gap-6 xl:gap-8 text-sm font-medium text-neutral-600">
            {navLinksBefore.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                className={`transition-colors py-1 relative text-sm font-medium ${
                  isActive(link.href)
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
              >
                {link.label}
                {isActive(link.href) && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </Link>
            ))}

            {/* Interactive Agents Dropdown */}
            <div
              ref={agentsRef}
              className="relative"
              onMouseEnter={handleMouseEnter}
              onMouseLeave={handleMouseLeave}
            >
              <button
                type="button"
                onClick={() => setAgentsDropdownOpen((prev) => !prev)}
                className={`inline-flex items-center gap-1.5 py-1 transition-colors relative cursor-pointer select-none text-sm font-medium ${
                  isAgentsActive
                    ? 'text-neutral-900 font-semibold'
                    : 'text-neutral-600 hover:text-neutral-900'
                }`}
                aria-expanded={agentsDropdownOpen}
                aria-haspopup="true"
              >
                <span>Agents</span>
                <ChevronDown
                  className={`w-3.5 h-3.5 stroke-[2] transition-transform duration-200 ${
                    agentsDropdownOpen ? 'rotate-180 text-neutral-900' : 'text-neutral-400'
                  }`}
                />
                {isAgentsActive && (
                  <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
                )}
              </button>

              {/* Floating Dropdown Card */}
              {agentsDropdownOpen && (
                <div className="absolute top-full left-0 pt-2 w-64 z-50 animate-in fade-in duration-150">
                  <div className="bg-white rounded-xl shadow-lg border border-stone-200 p-2 space-y-1">
                    <Link
                      to="/agents"
                      onClick={() => setAgentsDropdownOpen(false)}
                      className={`block px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                        location.pathname === '/agents'
                          ? 'bg-stone-100 text-stone-950 font-semibold'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">Find an Agent</div>
                      <div className="text-xs text-stone-500 font-normal mt-0.5">Search top-rated agents nationwide</div>
                    </Link>

                    <Link
                      to={dynamicCityLink}
                      onClick={() => setAgentsDropdownOpen(false)}
                      className={`block px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                        isDynamicCityActive
                          ? 'bg-stone-100 text-stone-950 font-semibold'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">
                        Find agents in {userLocation || 'your area'}
                      </div>
                      <div className="text-xs text-stone-500 font-normal mt-0.5">
                        Local market specialists & luxury experts
                      </div>
                    </Link>

                    <div className="my-1 border-t border-stone-100" />

                    <Link
                      to="/join-agent"
                      onClick={() => setAgentsDropdownOpen(false)}
                      className={`block px-3.5 py-2.5 rounded-lg text-sm transition-colors ${
                        location.pathname === '/join-agent'
                          ? 'bg-stone-100 text-stone-950 font-semibold'
                          : 'text-stone-700 hover:text-stone-950 hover:bg-stone-50 font-medium'
                      }`}
                    >
                      <div className="font-semibold text-stone-900">Join as an Agent</div>
                      <div className="text-xs text-stone-500 font-normal mt-0.5">Partner with Digentic Advisory Network</div>
                    </Link>
                  </div>
                </div>
              )}
            </div>

            {/* How It Works Link */}
            <Link
              to="/how-it-works"
              className={`transition-colors py-1 relative text-sm font-medium ${
                isActive('/how-it-works')
                  ? 'text-neutral-900 font-semibold'
                  : 'text-neutral-600 hover:text-neutral-900'
              }`}
            >
              How It Works
              {isActive('/how-it-works') && (
                <span className="absolute bottom-0 left-0 right-0 h-0.5 bg-neutral-900" />
              )}
            </Link>
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
        <div className="lg:hidden fixed inset-0 z-40 top-20 bg-white border-b border-stone-200 flex flex-col p-6 overflow-y-auto">
          <div className="space-y-4 text-base font-medium text-stone-800 pb-6 border-b border-stone-200">
            {navLinksBefore.map((link) => (
              <Link
                key={link.label}
                to={link.href}
                onClick={() => setMobileMenuOpen(false)}
                className="block py-1 hover:text-stone-950"
              >
                {link.label}
              </Link>
            ))}

            {/* Agents Mobile Accordion */}
            <div className="py-1">
              <button
                type="button"
                onClick={() => setIsMobileAgentsOpen((prev) => !prev)}
                className="w-full flex items-center justify-between py-1 text-left text-base font-medium text-stone-800 hover:text-stone-950 cursor-pointer transition-colors"
                aria-expanded={isMobileAgentsOpen}
              >
                <span>Agents</span>
                <ChevronDown
                  className={`w-4 h-4 text-stone-500 transition-transform duration-200 ${
                    isMobileAgentsOpen ? 'rotate-180 text-stone-900' : ''
                  }`}
                />
              </button>

              {/* Collapsible Submenu Child Items */}
              {isMobileAgentsOpen && (
                <div className="mt-2 space-y-2.5 pl-4 border-l-2 border-stone-200 py-1 text-sm font-medium animate-in fade-in slide-in-from-top-1 duration-150">
                  <Link
                    to="/agents"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    Find an Agent
                  </Link>
                  <Link
                    to={dynamicCityLink}
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    Find agents in {userLocation || 'your area'}
                  </Link>
                  <Link
                    to="/join-agent"
                    onClick={() => setMobileMenuOpen(false)}
                    className="block text-stone-600 hover:text-stone-950 transition-colors"
                  >
                    Join as an Agent
                  </Link>
                </div>
              )}
            </div>

            <Link
              to="/how-it-works"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-stone-950"
            >
              How It Works
            </Link>
            <Link
              to="/about"
              onClick={() => setMobileMenuOpen(false)}
              className="block py-1 hover:text-stone-950"
            >
              About Digentic Realty
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

          <div className="pt-6">
            <button
              onClick={() => {
                setMobileMenuOpen(false);
                setAuthModalOpen(true);
              }}
              className="w-full py-2.5 px-4 text-xs font-medium text-stone-800 bg-stone-100 hover:bg-stone-200 border border-stone-200 transition-colors text-center"
            >
              {user ? `Signed in as ${user.name}` : 'Sign In to Account'}
            </button>
          </div>
        </div>
      )}
    </>
  );
};
