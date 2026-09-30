import React, { useState, useMemo, useEffect, useRef } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  ChevronDown, 
  MapPin, 
  ShieldCheck, 
  X, 
  ArrowRight, 
  Navigation, 
  RotateCcw, 
  Check, 
  AlertCircle,
  Phone,
  Mail,
  CheckCircle2,
  Compass
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useMarketplace } from '../context/MarketplaceContext';

const SESSION_STORAGE_KEY = 'estra_advisor_session_location_v2';

interface AgentsPageProps {
  defaultCity?: string;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ defaultCity }) => {
  const { notify } = useMarketplace();
  const [searchParams] = useSearchParams();

  // Search & Filter state
  const queryParam = searchParams.get('city') || searchParams.get('q') || searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(defaultCity || queryParam || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  // Location state
  const [locationStatus, setLocationStatus] = useState<'detecting' | 'detected' | 'denied' | 'unavailable' | 'manual'>('detecting');
  const [detectedCity, setDetectedCity] = useState<string>('Detecting...');
  const [detectedFormatted, setDetectedFormatted] = useState<string>('Detecting your location...');
  const [isChangingLocation, setIsChangingLocation] = useState(false);
  const [manualCityInput, setManualCityInput] = useState('');
  const [showNearbyFallback, setShowNearbyFallback] = useState(false);

  // Contact Modal state for quick inquiries
  const [contactAgent, setContactAgent] = useState<Agent | null>(null);
  const [contactName, setContactName] = useState('');
  const [contactEmail, setContactEmail] = useState('');
  const [contactMessage, setContactMessage] = useState('');
  const [contactSubmitted, setContactSubmitted] = useState(false);

  // 1. Automatic Geolocation & Location Detection
  useEffect(() => {
    // Check if location was already stored in session
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        const cached = window.sessionStorage.getItem(SESSION_STORAGE_KEY);
        if (cached) {
          const parsed = JSON.parse(cached);
          if (parsed && parsed.city) {
            setDetectedCity(parsed.city);
            setDetectedFormatted(parsed.formatted || parsed.city);
            setLocationStatus(parsed.isManual ? 'manual' : 'detected');
            return;
          }
        }
      }
    } catch {
      // sessionStorage might be restricted
    }

    if (defaultCity) {
      setDetectedCity(defaultCity);
      setDetectedFormatted(defaultCity);
      setLocationStatus('manual');
      return;
    }

    // Trigger browser geolocation
    detectBrowserLocation();
  }, [defaultCity]);

  // Reverse geocoding helper (handles lat/lng -> readable city/area)
  const reverseGeocode = async (latitude: number, longitude: number): Promise<{ city: string; formatted: string } | null> => {
    try {
      const res = await fetch(`https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&zoom=10`, {
        headers: { 'Accept-Language': 'en' },
      });
      if (res.ok) {
        const data = await res.json();
        const addr = data.address || {};
        const city = addr.city || addr.town || addr.municipality || addr.village || addr.county || addr.state_district || '';
        const state = addr.state || '';
        const country = addr.country || '';
        
        let formatted = '';
        if (city && state && (country === 'United States' || country === 'USA')) {
          formatted = `${city}, ${state}`;
        } else if (city && country) {
          formatted = `${city}, ${country}`;
        } else {
          formatted = city || (data.display_name ? data.display_name.split(',').slice(0, 2).join(',') : '');
        }

        if (city) {
          return { city, formatted: formatted || city };
        }
      }
    } catch {
      // Try secondary service
    }

    try {
      const res2 = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=en`);
      if (res2.ok) {
        const data2 = await res2.json();
        const city = data2.city || data2.locality || data2.principalSubdivision || '';
        const country = data2.countryName || '';
        const formatted = country ? `${city}, ${country}` : city;
        if (city) {
          return { city, formatted };
        }
      }
    } catch {
      // Graceful fallback
    }

    return null;
  };

  // IP fallback detection
  const fallbackToIp = async () => {
    try {
      const res = await fetch('https://ipwho.is/');
      if (res.ok) {
        const data = await res.json();
        if (data && data.success !== false && data.city) {
          const city = data.city;
          const country = data.country || '';
          const region = data.region || data.region_code || '';
          const formatted = country === 'United States' && region ? `${city}, ${region}` : (country ? `${city}, ${country}` : city);
          setDetectedCity(city);
          setDetectedFormatted(formatted);
          saveLocationToSession(city, formatted, false);
          return;
        }
      }
    } catch {
      // Fallback
    }

    // Default hub if offline
    setDetectedCity('Chicago');
    setDetectedFormatted('Chicago, IL');
  };

  const detectBrowserLocation = () => {
    if (!navigator.geolocation) {
      setLocationStatus('unavailable');
      fallbackToIp();
      return;
    }

    setLocationStatus('detecting');

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords;
        const result = await reverseGeocode(latitude, longitude);
        if (result && result.city) {
          setDetectedCity(result.city);
          setDetectedFormatted(result.formatted);
          setLocationStatus('detected');
          saveLocationToSession(result.city, result.formatted, false);
        } else {
          fallbackToIp();
          setLocationStatus('detected');
        }
      },
      (error) => {
        // Handle permission denied or timeout smoothly without breaking page
        if (error.code === error.PERMISSION_DENIED) {
          setLocationStatus('denied');
        } else {
          setLocationStatus('unavailable');
        }
        fallbackToIp();
      },
      { timeout: 7000, maximumAge: 300000, enableHighAccuracy: false }
    );
  };

  const saveLocationToSession = (city: string, formatted: string, isManual: boolean) => {
    try {
      if (typeof window !== 'undefined' && window.sessionStorage) {
        window.sessionStorage.setItem(
          SESSION_STORAGE_KEY,
          JSON.stringify({ city, formatted, isManual })
        );
      }
    } catch {
      // Ignore
    }
  };

  const handleManualLocationSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!manualCityInput.trim()) return;

    const city = manualCityInput.trim();
    setDetectedCity(city);
    setDetectedFormatted(city);
    setLocationStatus('manual');
    saveLocationToSession(city, city, true);
    setIsChangingLocation(false);
    setManualCityInput('');
    setShowNearbyFallback(false);
    notify(`Location updated to ${city}`);
  };

  const selectPredefinedLocation = (city: string, formatted: string) => {
    setDetectedCity(city);
    setDetectedFormatted(formatted);
    setLocationStatus('manual');
    saveLocationToSession(city, formatted, true);
    setIsChangingLocation(false);
    setShowNearbyFallback(false);
    notify(`Location set to ${formatted}`);
  };

  // Helper to score and sort agents based on location proximity
  const getLocationScore = (agent: Agent, targetLoc: string): number => {
    const loc = targetLoc.toLowerCase().trim();
    if (!loc || loc === 'detecting...') return 0;

    const agentCity = (agent.city || '').toLowerCase();
    const office = agent.officeLocation.toLowerCase();
    const state = (agent.state || '').toLowerCase();

    // 1. Exact city match
    if (agentCity === loc || office.includes(loc)) {
      return 100;
    }

    // 2. Same metropolitan area / service areas
    if (agent.serviceAreas && agent.serviceAreas.some((s) => s.toLowerCase().includes(loc) || loc.includes(s.toLowerCase()))) {
      return 80;
    }
    if (agent.neighborhoods && agent.neighborhoods.some((n) => n.toLowerCase().includes(loc) || loc.includes(n.toLowerCase()))) {
      return 75;
    }

    // 3. Same state / region
    if (state && loc.includes(state)) {
      return 60;
    }

    // 4. Regional cluster
    if (
      (loc.includes('il') || loc.includes('chicago') || loc.includes('midwest')) &&
      (state === 'il' || office.includes('chicago'))
    ) {
      return 50;
    }

    if (
      (loc.includes('ca') || loc.includes('francisco') || loc.includes('angeles') || loc.includes('silicon')) &&
      (state === 'ca' || office.includes('california'))
    ) {
      return 50;
    }

    if (
      (loc.includes('va') || loc.includes('dc') || loc.includes('washington') || loc.includes('arlington')) &&
      (state === 'va' || state === 'dc' || office.includes('arlington') || office.includes('washington'))
    ) {
      return 50;
    }

    return 10;
  };

  // Filter & Sort agents
  const { filteredAgents, localMatchesCount, hasExactMatch } = useMemo(() => {
    const searchLower = searchQuery.toLowerCase().trim();
    const specLower = selectedSpecialization.toLowerCase();

    // 1. Filter by text search & specialization
    const list = AGENTS.filter((agent: Agent) => {
      // Text Search
      if (searchLower) {
        const matchName = agent.name.toLowerCase().includes(searchLower);
        const matchCity = agent.city?.toLowerCase().includes(searchLower) ?? false;
        const matchOffice = agent.officeLocation.toLowerCase().includes(searchLower);
        const matchAgency = agent.agency.toLowerCase().includes(searchLower);
        const matchTitle = agent.role.toLowerCase().includes(searchLower);
        const matchLicense = agent.licenseNumber.toLowerCase().includes(searchLower);
        const matchBio = agent.bio.toLowerCase().includes(searchLower);
        const matchSpecs = agent.specializations.some((s) => s.toLowerCase().includes(searchLower));

        if (!matchName && !matchCity && !matchOffice && !matchAgency && !matchTitle && !matchLicense && !matchBio && !matchSpecs) {
          return false;
        }
      }

      // Specialization Filter
      if (selectedSpecialization !== 'All') {
        if (specLower === 'residential') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('residential') || s.toLowerCase().includes('modernist'));
          if (!match) return false;
        } else if (specLower === 'commercial') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('commercial') || s.toLowerCase().includes('headquarters') || s.toLowerCase().includes('offices'));
          if (!match) return false;
        } else if (specLower === 'luxury') {
          if (!agent.isLuxuryExpert && !agent.specializations.some((s) => s.toLowerCase().includes('luxury'))) return false;
        } else if (specLower === 'land' || specLower === 'land & development') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('land') || s.toLowerCase().includes('development'));
          if (!match) return false;
        } else if (specLower === 'architecture') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('architecture') || s.toLowerCase().includes('modernist') || s.toLowerCase().includes('historic')) || agent.role.toLowerCase().includes('architectural');
          if (!match) return false;
        } else if (specLower === 'investment') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('investment') || s.toLowerCase().includes('capital') || s.toLowerCase().includes('syndication'));
          if (!match) return false;
        } else if (specLower === 'property management') {
          const match = agent.specializations.some((s) => s.toLowerCase().includes('management') || s.toLowerCase().includes('portfolios'));
          if (!match) return false;
        } else {
          const match = agent.specializations.some((s) => s.toLowerCase().includes(specLower));
          if (!match) return false;
        }
      }

      return true;
    });

    // 2. Count direct local matches
    const localMatches = list.filter((a) => getLocationScore(a, detectedCity) >= 70);
    const hasExact = localMatches.length > 0;

    // 3. Location sorting: Priority 1 to 5
    list.sort((a, b) => {
      const scoreA = getLocationScore(a, detectedCity);
      const scoreB = getLocationScore(b, detectedCity);
      if (scoreA !== scoreB) {
        return scoreB - scoreA;
      }
      // Secondary: Total deals / volume
      return (b.totalDeals || b.dealsClosed || 0) - (a.totalDeals || a.dealsClosed || 0);
    });

    return {
      filteredAgents: list,
      localMatchesCount: localMatches.length,
      hasExactMatch: hasExact,
    };
  }, [searchQuery, selectedSpecialization, detectedCity]);

  // Formatted count display
  const countDisplay = filteredAgents.length < 10 ? `0${filteredAgents.length}` : `${filteredAgents.length}`;

  const handleOpenContact = (agent: Agent) => {
    setContactAgent(agent);
    setContactName('');
    setContactEmail('');
    setContactMessage(`Hello ${agent.name}, I would like to inquire about real estate representation in ${agent.officeLocation}.`);
    setContactSubmitted(false);
  };

  const handleContactSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!contactName.trim() || !contactEmail.trim()) {
      notify('Please enter your name and email address.');
      return;
    }
    setContactSubmitted(true);
    notify(`Inquiry dispatched to ${contactAgent?.name}`);
  };

  return (
    <div className="w-full min-h-screen bg-[#F7F6F1] text-[#111111] selection:bg-[#4C5544] selection:text-[#F7F6F1]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-14 space-y-8">
        
        {/* 1. Page Header (Exact Reference Specification) */}
        <header className="pb-8 border-b border-[#DCDAD3]/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#5F625F] uppercase font-medium">
              ESTRA ADVISORY NETWORK
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-[0.18em] text-[#5F625F] uppercase">
              TRUSTED EXPERTS · PRECISION ASSETS
            </span>
          </div>

          <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 sm:gap-8 mt-2">
            <div className="max-w-2xl space-y-3">
              <h1 className="font-sans text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-[#111111] leading-[1.1]">
                Licensed Real Estate Advisors
              </h1>
              <p className="text-sm sm:text-base text-[#5F625F] font-normal leading-relaxed max-w-xl">
                Partner with dedicated brokers specializing in commercial headquarters, residential architecture, and land entitlements.
              </p>
            </div>

            {/* Big Elegant Stat on the Right */}
            <div className="flex items-center gap-3.5 self-start lg:self-end shrink-0 pl-0 lg:pl-8 lg:border-l border-[#DCDAD3]/80">
              <div className="font-sans text-4xl sm:text-5xl font-semibold tracking-tight text-[#111111] leading-none">
                {countDisplay}
              </div>
              <div className="text-[11px] sm:text-xs font-sans text-[#5F625F] uppercase tracking-wider leading-tight font-medium">
                Licensed Advisors<br />Available
              </div>
            </div>
          </div>
        </header>

        {/* 2. Location Indicator & Change Location Bar */}
        <section className="bg-white border border-[#DCDAD3] p-4 sm:p-4.5 rounded-xs flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          <div className="flex items-center gap-3">
            <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 ${
              locationStatus === 'detecting' ? 'bg-amber-100 text-amber-700 animate-pulse' : 'bg-stone-100 text-stone-900'
            }`}>
              <MapPin className="w-4 h-4 stroke-[1.8]" />
            </div>

            <div>
              <div className="text-[11px] font-mono uppercase tracking-wider text-stone-500 font-medium">
                Your location
              </div>
              <div className="text-sm font-bold text-stone-900 font-sans flex items-center gap-2">
                {locationStatus === 'detecting' ? (
                  <span className="text-amber-800 font-medium flex items-center gap-2">
                    <span className="w-2 h-2 rounded-full bg-amber-500 animate-ping inline-block" />
                    Detecting your location...
                  </span>
                ) : (
                  <span>{detectedFormatted || detectedCity}</span>
                )}
                {locationStatus === 'detected' && (
                  <span className="text-[10px] font-mono bg-emerald-50 text-emerald-700 px-1.5 py-0.5 border border-emerald-200 uppercase tracking-tight">
                    Detected via GPS
                  </span>
                )}
              </div>
            </div>
          </div>

          <div className="flex items-center gap-2.5 self-start sm:self-auto">
            <button
              type="button"
              onClick={() => setIsChangingLocation(true)}
              className="inline-flex items-center gap-1.5 px-4 py-2 text-xs font-semibold text-stone-900 bg-[#FDFDFB] hover:bg-stone-50 border border-[#DCDAD3] hover:border-black transition-all cursor-pointer shadow-2xs active:scale-95"
            >
              <Compass className="w-3.5 h-3.5 text-stone-600" />
              <span>Change Location</span>
            </button>

            {locationStatus === 'denied' && (
              <span className="text-[11px] text-stone-500 font-mono hidden md:inline-block">
                (Location permission denied · using regional center)
              </span>
            )}
          </div>
        </section>

        {/* 3. Search & Specialization Filter Bar */}
        <section className="bg-[#FDFDFB] border border-[#DCDAD3] rounded-xs flex flex-col md:flex-row items-stretch md:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center px-4 sm:px-5 py-3.5">
            <Search className="w-4 h-4 text-[#5F625F] mr-3 stroke-[1.6] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by advisor name, city, or agency..."
              className="w-full bg-transparent text-sm text-[#111111] placeholder:text-[#888880] focus:outline-none font-sans"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="text-[#5F625F] hover:text-[#111111] p-1 ml-2 cursor-pointer transition-colors"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Vertical Divider for desktop */}
          <div className="hidden md:block w-px h-8 bg-[#DCDAD3] shrink-0" />

          {/* Specialization Filter Dropdown */}
          <div className="relative md:w-72 shrink-0 px-4 sm:px-5 py-3.5 border-t md:border-t-0 border-[#DCDAD3]">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#111111] focus:outline-none cursor-pointer appearance-none pr-8 tracking-tight"
            >
              <option value="All">All Specializations</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Luxury">Luxury</option>
              <option value="Land">Land & Development</option>
              <option value="Architecture">Architecture</option>
              <option value="Investment">Investment</option>
              <option value="Property Management">Property Management</option>
            </select>
            <ChevronDown className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F625F] pointer-events-none stroke-[1.6]" />
          </div>
        </section>

        {/* 4. Location Context Heading / Status Notice */}
        <div className="space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
            <div>
              <h2 className="font-sans text-xl sm:text-2xl font-bold text-stone-900 tracking-tight flex items-center gap-2">
                <span>Agents near {detectedCity || 'your area'}</span>
                {hasExactMatch && (
                  <span className="text-xs font-mono font-normal text-emerald-800 bg-emerald-50 border border-emerald-200 px-2 py-0.5">
                    {localMatchesCount} Direct Regional Advisors
                  </span>
                )}
              </h2>
              <p className="text-xs sm:text-sm text-stone-500 mt-0.5">
                {hasExactMatch 
                  ? `Showing certified ESTRA brokers with active advisory coverage in ${detectedFormatted}.`
                  : `Direct regional presence in ${detectedFormatted} is supported by national advisory syndication.`}
              </p>
            </div>

            {(searchQuery || selectedSpecialization !== 'All') && (
              <button
                type="button"
                onClick={() => {
                  setSearchQuery('');
                  setSelectedSpecialization('All');
                }}
                className="inline-flex items-center gap-1.5 text-xs font-medium text-stone-600 hover:text-black self-start sm:self-auto"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Filters</span>
              </button>
            )}
          </div>

          {/* When no exact local matches exist in user's detected location (e.g. Sylhet, Dhaka, etc.) */}
          {!hasExactMatch && (
            <div className="bg-[#FDFDFB] border border-[#DCDAD3] p-6 sm:p-7 rounded-xs shadow-[0_1px_3px_rgba(0,0,0,0.02)] space-y-4">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                <div className="space-y-1 max-w-2xl">
                  <div className="inline-flex items-center gap-1.5 text-xs font-mono font-semibold text-stone-500 uppercase tracking-wider">
                    <AlertCircle className="w-3.5 h-3.5 text-amber-600" />
                    <span>Coverage Notice</span>
                  </div>
                  <h3 className="font-sans text-lg sm:text-xl font-bold text-stone-900">
                    No direct advisors found in {detectedFormatted || detectedCity}
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-600 leading-relaxed">
                    Our direct physical brokerage offices are currently established in major United States and international architectural hubs. Our senior partners handle cross-border wealth, acquisitions, and client representation.
                  </p>
                </div>

                <div className="flex flex-wrap items-center gap-3 shrink-0">
                  <button
                    type="button"
                    onClick={() => setIsChangingLocation(true)}
                    className="px-4 py-2 text-xs font-medium text-stone-800 bg-white hover:bg-stone-50 border border-stone-300 hover:border-black transition-colors"
                  >
                    Change Location
                  </button>
                  <button
                    type="button"
                    onClick={() => {
                      setShowNearbyFallback(true);
                      notify('Showing advisors in nearby & premier metropolitan areas');
                    }}
                    className="px-5 py-2 text-xs font-semibold bg-black hover:bg-neutral-900 text-white border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
                  >
                    Show advisors in nearby areas
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* 5. Agent Cards (Clean 2-Column Responsive Grid on Desktop / 1-Column on Mobile) */}
        {filteredAgents.length === 0 ? (
          <div className="bg-[#FDFDFB] border border-[#DCDAD3] p-12 sm:p-16 text-center space-y-3 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-xs my-8">
            <div className="text-[#5F625F] font-mono text-[11px] uppercase tracking-widest font-medium">
              NO ADVISORS FOUND
            </div>
            <h3 className="font-sans text-xl sm:text-2xl text-[#111111] font-bold tracking-tight">
              No advisors match your search criteria
            </h3>
            <p className="text-xs sm:text-sm text-[#5F625F] max-w-md mx-auto leading-relaxed">
              Try searching for a different metropolitan corridor, advisor name, or reset the specialization filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialization('All');
              }}
              className="mt-3 inline-flex items-center px-5 py-2.5 text-xs font-medium bg-black hover:bg-neutral-900 text-white border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer rounded-xs"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 sm:gap-7">
            {filteredAgents.map((agent) => {
              const satisfaction = agent.satisfactionRating || 99;
              const deals = agent.dealsClosed || agent.totalDeals || 142;
              const exp = agent.yearsExperience || 14;
              const listings = agent.activeListingsCount || 6;
              const isLocal = getLocationScore(agent, detectedCity) >= 70;

              return (
                <article
                  key={agent.id}
                  className={`group bg-[#FDFDFB] border ${
                    isLocal ? 'border-stone-400/80 ring-1 ring-stone-900/5' : 'border-[#DCDAD3]'
                  } hover:border-[#111111] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)] hover:shadow-md rounded-xs relative`}
                >
                  {isLocal && (
                    <div className="absolute top-0 right-6 -translate-y-1/2 bg-stone-900 text-white text-[9px] font-mono tracking-widest uppercase px-2.5 py-0.5 font-semibold">
                      Local Expert
                    </div>
                  )}

                  <div>
                    {/* Top Profile Section */}
                    <div className="flex flex-col sm:flex-row items-start gap-5 sm:gap-6">
                      {/* Portrait Image with subtle hover zoom */}
                      <div className="w-[125px] sm:w-[145px] aspect-[4/5] shrink-0 overflow-hidden bg-stone-200 border border-[#DCDAD3]/60 relative self-start">
                        <ImageWithFallback
                          src={agent.avatar}
                          alt={agent.name}
                          fallbackTitle={agent.name}
                          className="w-full h-full object-cover object-top transition-transform duration-350 ease-out group-hover:scale-[1.03]"
                        />
                      </div>

                      {/* Advisor Details */}
                      <div className="flex-1 min-w-0 space-y-1">
                        {/* Metadata Row: License & Subtle Verification */}
                        <div className="flex flex-wrap items-center justify-between gap-2 text-[11px] pb-1 border-b border-[#DCDAD3]/50">
                          <span className="font-mono text-[#5F625F] tracking-wider uppercase">
                            {agent.licenseNumber}
                          </span>
                          <div className="inline-flex items-center gap-1.5 text-[#5F625F] font-sans text-[11px] font-normal">
                            <ShieldCheck className="w-3.5 h-3.5 text-[#4C5544] stroke-[1.8]" />
                            <span>{satisfaction}% Satisfaction</span>
                          </div>
                        </div>

                        {/* Name */}
                        <h2 className="font-sans text-xl sm:text-2xl font-bold text-[#111111] tracking-tight leading-tight pt-1 group-hover:text-[#4C5544] transition-colors">
                          <Link to={`/agents/${agent.slug || agent.id}`}>
                            {agent.name}
                          </Link>
                        </h2>

                        {/* Professional Title */}
                        <div className="text-xs sm:text-[13px] font-medium text-[#111111] tracking-tight">
                          {agent.role}
                        </div>

                        {/* Location with subtle icon */}
                        <div className="flex items-center gap-1.5 text-xs text-[#5F625F] pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-[#5F625F] stroke-[1.5] shrink-0" />
                          <span>{agent.officeLocation.replace(' & ', ' · ').replace(' • ', ' · ')}</span>
                        </div>

                        {/* Bio (Concise 2-3 lines) */}
                        <p className="pt-2 text-xs sm:text-[13px] text-[#5F625F] leading-relaxed line-clamp-3 font-normal">
                          {agent.bio}
                        </p>

                        {/* Specializations as subtle uppercase metadata labels */}
                        <div className="pt-3 border-t border-[#DCDAD3]/60 text-[10px] sm:text-[11px] font-mono text-[#5F625F]">
                          <span className="font-semibold text-stone-700">Specializations: </span>
                          <span className="uppercase tracking-wider">
                            {agent.specializations.slice(0, 3).join(' · ')}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>

                  {/* Bottom Section: Separated Metrics & Refined CTA */}
                  <div className="mt-6 pt-4 border-t border-[#DCDAD3] flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                    {/* Three-Column Metrics */}
                    <div className="flex items-center text-left">
                      <div className="pr-4 sm:pr-5 border-r border-[#DCDAD3]">
                        <span className="block text-xl sm:text-2xl font-normal text-[#111111] font-sans leading-none">
                          {exp < 10 ? `0${exp}` : exp}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                          {exp} yrs exp.
                        </span>
                      </div>

                      <div className="px-4 sm:px-5 border-r border-[#DCDAD3]">
                        <span className="block text-xl sm:text-2xl font-normal text-[#111111] font-sans leading-none">
                          {deals}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                          {deals} deals
                        </span>
                      </div>

                      <div className="pl-4 sm:px-5 border-r border-[#DCDAD3]">
                        <span className="block text-xl sm:text-2xl font-normal text-[#111111] font-sans leading-none">
                          {listings < 10 ? `0${listings}` : listings}
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                          {listings} active listings
                        </span>
                      </div>

                      <div className="pl-4 sm:pl-5 hidden xl:block">
                        <span className="block text-xl sm:text-2xl font-semibold text-stone-900 font-sans leading-none">
                          {satisfaction}%
                        </span>
                        <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                          Satisfaction
                        </span>
                      </div>
                    </div>

                    {/* Action Buttons: View Profile & Listings + Quick Inquiry */}
                    <div className="flex items-center gap-2 self-stretch sm:self-auto">
                      <button
                        type="button"
                        onClick={() => handleOpenContact(agent)}
                        className="px-3.5 py-2.5 bg-white hover:bg-stone-100 text-stone-800 text-xs font-medium border border-stone-300 transition-colors cursor-pointer"
                        title="Contact Advisor"
                      >
                        Contact
                      </button>

                      <Link
                        to={`/agents/${agent.slug || agent.id}`}
                        className="flex-1 sm:flex-none inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 rounded-xs cursor-pointer whitespace-nowrap"
                      >
                        <span>View Profile & Listings</span>
                        <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-x-1" />
                      </Link>
                    </div>
                  </div>
                </article>
              );
            })}
          </div>
        )}

      </div>

      {/* 6. Change Location Modal */}
      {isChangingLocation && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setIsChangingLocation(false)}
        >
          <div 
            className="bg-white border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setIsChangingLocation(false)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close location modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="space-y-1.5">
              <div className="text-[11px] font-mono tracking-widest text-stone-500 uppercase font-semibold flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-stone-600" />
                <span>Geographic Discovery</span>
              </div>
              <h3 className="text-xl font-bold text-stone-950 font-sans">
                Enter your city or location
              </h3>
              <p className="text-xs text-stone-500">
                Specify your metropolitan market or country to discover advisors closest to your acquisition goals.
              </p>
            </div>

            {/* Input Form */}
            <form onSubmit={handleManualLocationSubmit} className="space-y-4">
              <div className="relative">
                <input
                  type="text"
                  required
                  value={manualCityInput}
                  onChange={(e) => setManualCityInput(e.target.value)}
                  placeholder="e.g. Sylhet, Dhaka, Chicago, New York, London..."
                  className="w-full bg-[#FDFDFB] border border-stone-300 px-4 py-2.5 text-sm text-stone-900 focus:outline-none focus:border-black font-sans transition-colors"
                  autoFocus
                />
              </div>

              <div className="flex items-center gap-2">
                <button
                  type="submit"
                  className="flex-1 py-2.5 px-4 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-sm active:scale-95 transition-all cursor-pointer"
                >
                  Set Location
                </button>
                <button
                  type="button"
                  onClick={() => {
                    detectBrowserLocation();
                    setIsChangingLocation(false);
                  }}
                  className="inline-flex items-center gap-1.5 py-2.5 px-4 bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-medium border border-stone-200 transition-colors cursor-pointer"
                >
                  <Navigation className="w-3.5 h-3.5 text-stone-700" />
                  <span>Use GPS</span>
                </button>
              </div>
            </form>

            {/* Predefined Popular Markets */}
            <div className="pt-2 border-t border-stone-100 space-y-2.5">
              <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider">
                Select Major Advisory Hub:
              </div>
              <div className="flex flex-wrap gap-2">
                {[
                  { city: 'Chicago', formatted: 'Chicago, IL' },
                  { city: 'New York', formatted: 'New York, NY' },
                  { city: 'San Francisco', formatted: 'San Francisco, CA' },
                  { city: 'Arlington', formatted: 'Arlington, VA' },
                  { city: 'Seattle', formatted: 'Seattle, WA' },
                  { city: 'Austin', formatted: 'Austin, TX' },
                  { city: 'Sylhet', formatted: 'Sylhet, Bangladesh' },
                  { city: 'Dhaka', formatted: 'Dhaka, Bangladesh' },
                ].map((item) => (
                  <button
                    key={item.city}
                    type="button"
                    onClick={() => selectPredefinedLocation(item.city, item.formatted)}
                    className="px-3 py-1.5 text-xs bg-stone-50 hover:bg-stone-900 hover:text-white border border-stone-200 hover:border-black transition-all cursor-pointer rounded-xs"
                  >
                    {item.formatted}
                  </button>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* 7. Quick Contact Modal */}
      {contactAgent && (
        <div 
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs animate-in fade-in duration-200"
          onClick={() => setContactAgent(null)}
        >
          <div 
            className="bg-white border border-stone-200 shadow-2xl max-w-lg w-full p-6 sm:p-8 space-y-6 relative max-h-[90vh] overflow-y-auto"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              type="button"
              onClick={() => setContactAgent(null)}
              className="absolute top-5 right-5 text-stone-400 hover:text-stone-900 transition-colors cursor-pointer"
              aria-label="Close modal"
            >
              <X className="w-5 h-5" />
            </button>

            <div className="flex items-center gap-4 pb-4 border-b border-stone-100">
              <div className="w-14 h-14 overflow-hidden rounded-full bg-stone-100 shrink-0 border border-stone-200">
                <ImageWithFallback
                  src={contactAgent.avatar}
                  alt={contactAgent.name}
                  fallbackTitle={contactAgent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              <div className="space-y-0.5">
                <div className="text-xs text-stone-500 font-mono">
                  {contactAgent.licenseNumber}
                </div>
                <h3 className="text-lg font-bold text-stone-950 font-sans">
                  Contact {contactAgent.name}
                </h3>
                <p className="text-xs text-stone-600">
                  {contactAgent.role} · {contactAgent.officeLocation}
                </p>
              </div>
            </div>

            {contactSubmitted ? (
              <div className="py-8 text-center space-y-4">
                <div className="w-14 h-14 bg-emerald-50 text-emerald-700 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 stroke-[1.8]" />
                </div>
                <h4 className="text-xl font-bold text-stone-900 font-sans">
                  Inquiry Dispatched
                </h4>
                <p className="text-sm text-stone-600 max-w-sm mx-auto leading-relaxed">
                  Thank you, <strong>{contactName}</strong>. {contactAgent.name} has received your inquiry and will follow up with you directly.
                </p>
                <div className="pt-2">
                  <button
                    type="button"
                    onClick={() => setContactAgent(null)}
                    className="px-6 py-2.5 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-xs transition-all cursor-pointer"
                  >
                    Done
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleContactSubmit} className="space-y-4">
                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Your Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={contactName}
                    onChange={(e) => setContactName(e.target.value)}
                    placeholder="e.g. Sarah Jenkins"
                    className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Email Address *
                  </label>
                  <input
                    type="email"
                    required
                    value={contactEmail}
                    onChange={(e) => setContactEmail(e.target.value)}
                    placeholder="name@company.com"
                    className="w-full bg-[#FDFDFB] border border-stone-200 px-3.5 py-2 text-sm text-stone-900 focus:outline-none focus:border-black"
                  />
                </div>

                <div className="space-y-1">
                  <label className="block text-xs font-semibold text-stone-700">
                    Message
                  </label>
                  <textarea
                    rows={3}
                    value={contactMessage}
                    onChange={(e) => setContactMessage(e.target.value)}
                    className="w-full bg-[#FDFDFB] border border-stone-200 p-3 text-sm text-stone-900 focus:outline-none focus:border-black resize-none"
                  />
                </div>

                <div className="pt-2 flex items-center gap-3">
                  <button
                    type="submit"
                    className="flex-1 py-2.5 px-4 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-xs tracking-wider uppercase border border-black shadow-md transition-all cursor-pointer text-center"
                  >
                    Send Direct Inquiry
                  </button>
                  <button
                    type="button"
                    onClick={() => setContactAgent(null)}
                    className="py-2.5 px-4 text-xs font-medium text-stone-600 hover:text-black border border-stone-200 hover:bg-stone-50 transition-colors cursor-pointer"
                  >
                    Cancel
                  </button>
                </div>
              </form>
            )}
          </div>
        </div>
      )}
    </div>
  );
};
