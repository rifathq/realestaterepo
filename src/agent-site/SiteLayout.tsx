import React, { useEffect, useState } from 'react';
import { Link, NavLink, Outlet, useLocation } from 'react-router-dom';
import { Menu, X } from 'lucide-react';
import { AGENT, FIRM, DPOR_LOOKUP_URL } from './profile';
import { EqualHousingMark } from './components';

const NAV = [
  { to: '/listings', label: 'Listings' },
  { to: '/search', label: 'Search all homes' },
  { to: '/selling', label: 'Selling' },
  { to: '/about', label: 'About' },
];

const Brand: React.FC = () => (
  <Link to="/" className="flex items-center gap-3 shrink-0" aria-label={`${AGENT.name}, ${FIRM.shortName}`}>
    <span className="font-architectural font-bold text-[17px] sm:text-lg text-stone-950">{AGENT.name}</span>
    <span className="w-px h-5 bg-stone-300" aria-hidden />
    <span className="text-[17px] sm:text-lg font-semibold text-stone-700">{FIRM.shortName}</span>
  </Link>
);

const Header: React.FC = () => {
  const [open, setOpen] = useState(false);
  const location = useLocation();
  useEffect(() => setOpen(false), [location.pathname]);

  const linkClass = ({ isActive }: { isActive: boolean }) =>
    `text-sm transition-colors ${isActive ? 'text-stone-950 font-semibold' : 'text-stone-600 hover:text-stone-950'}`;

  return (
    <header className="sticky top-0 z-40 bg-stone-50/90 backdrop-blur-md border-b border-stone-200">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-6">
        <Brand />
        <nav className="hidden md:flex items-center gap-7" aria-label="Main">
          {NAV.map((n) => (
            <NavLink key={n.to} to={n.to} className={linkClass}>
              {n.label}
            </NavLink>
          ))}
          <Link to="/contact" className="bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-4 py-2 transition-colors">
            Contact
          </Link>
        </nav>
        <button
          type="button"
          className="md:hidden p-2 -mr-2 text-stone-800"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-label={open ? 'Close menu' : 'Open menu'}
        >
          {open ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
        </button>
      </div>
      {open && (
        <nav className="md:hidden border-t border-stone-200 bg-stone-50 px-5 py-4 flex flex-col gap-1" aria-label="Main">
          {[...NAV, { to: '/contact', label: 'Contact' }].map((n) => (
            <NavLink key={n.to} to={n.to} className={({ isActive }) => `py-2.5 text-base ${isActive ? 'font-semibold text-stone-950' : 'text-stone-700'}`}>
              {n.label}
            </NavLink>
          ))}
        </nav>
      )}
    </header>
  );
};

const Footer: React.FC = () => (
  <footer className="bg-stone-950 text-stone-400 border-t border-stone-800">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-10 md:grid-cols-12">
      <div className="md:col-span-5 space-y-5">
        <div>
          <div className="text-white font-semibold text-base">{FIRM.name}</div>
          <div className="text-sm leading-relaxed mt-1">
            {FIRM.street}, {FIRM.cityStateZip}
            <br />
            Office <a href={`tel:${FIRM.phone.replace(/\D/g, '')}`} className="text-stone-200 hover:text-white">{FIRM.phone}</a>
          </div>
        </div>
        <div className="h-px bg-stone-800" />
        <div className="text-sm leading-relaxed">
          <div className="text-stone-200">
            {AGENT.name}, {AGENT.title}
          </div>
          <div>
            Licensed {AGENT.licenceType} in {AGENT.licensedIn} · #{AGENT.licence}
          </div>
          <a href={`mailto:${AGENT.email}`} className="text-stone-200 hover:text-white">{AGENT.email}</a>
          <div className="mt-1">
            <a href={DPOR_LOOKUP_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">
              Verify licences with DPOR
            </a>
          </div>
        </div>
      </div>

      <div className="md:col-span-3">
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Site</div>
        <ul className="mt-4 space-y-2.5 text-sm">
          {[...NAV, { to: '/contact', label: 'Contact' }].map((n) => (
            <li key={n.to}>
              <Link to={n.to} className="hover:text-white">{n.label}</Link>
            </li>
          ))}
        </ul>
      </div>

      <div className="md:col-span-4">
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Legal</div>
        <ul className="mt-4 space-y-2.5 text-sm">
          <li><Link to="/privacy" className="hover:text-white">Privacy Policy</Link></li>
          <li><Link to="/terms" className="hover:text-white">Terms of Use</Link></li>
          <li><Link to="/fair-housing" className="hover:text-white">Fair Housing</Link></li>
        </ul>
        <div className="mt-6 flex items-start gap-3 text-stone-300">
          <EqualHousingMark className="w-9 h-9 shrink-0" />
          <p className="text-xs leading-relaxed text-stone-400">
            Equal Housing Opportunity. I am pledged to the letter and spirit of U.S. policy for the achievement of equal
            housing opportunity throughout the nation.
          </p>
        </div>
      </div>
    </div>
    <div className="border-t border-stone-800">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-5 text-[11px] leading-relaxed text-stone-500 flex flex-col sm:flex-row gap-2 sm:justify-between">
        <span>© {new Date().getFullYear()} {AGENT.name}. Listings shown are listings of {AGENT.name}, {FIRM.name}.</span>
        <span>Information deemed reliable but not guaranteed.</span>
      </div>
    </div>
  </footer>
);

export const SiteLayout: React.FC = () => (
  <div className="min-h-screen flex flex-col bg-stone-50 text-stone-900 font-sans antialiased selection:bg-stone-900 selection:text-white">
    <div className="bg-amber-400 text-stone-950 text-[11px] font-semibold tracking-wide text-center py-1.5 px-4">
      Demo site · sample listings · not published
    </div>
    <Header />
    <main className="flex-1">
      <Outlet />
    </main>
    <Footer />
  </div>
);
