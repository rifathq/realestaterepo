import React, { useState, useMemo, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { Search, ChevronDown, MapPin, ShieldCheck, X, ArrowRight } from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface AgentsPageProps {
  defaultCity?: string;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ defaultCity }) => {
  const [searchParams] = useSearchParams();
  const queryParam = searchParams.get('city') || searchParams.get('q') || searchParams.get('search') || '';
  const [searchQuery, setSearchQuery] = useState(defaultCity || queryParam || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

  useEffect(() => {
    if (defaultCity) {
      setSearchQuery(defaultCity);
    } else if (queryParam) {
      setSearchQuery(queryParam);
    }
  }, [defaultCity, queryParam]);

  // Filter agents based on search query and specialization
  const filteredAgents = useMemo(() => {
    return AGENTS.filter((agent: Agent) => {
      // 1. Text Search Filter
      if (searchQuery.trim()) {
        const query = searchQuery.toLowerCase().trim();
        const matchName = agent.name.toLowerCase().includes(query);
        const matchCity = agent.city?.toLowerCase().includes(query) ?? false;
        const matchState = agent.state?.toLowerCase().includes(query) ?? false;
        const matchOffice = agent.officeLocation.toLowerCase().includes(query);
        const matchAgency = agent.agency.toLowerCase().includes(query);
        const matchTitle = agent.role.toLowerCase().includes(query);
        const matchLicense = agent.licenseNumber.toLowerCase().includes(query);
        const matchBio = agent.bio.toLowerCase().includes(query);
        const matchSpecs = agent.specializations.some((s) => s.toLowerCase().includes(query));

        if (!matchName && !matchCity && !matchState && !matchOffice && !matchAgency && !matchTitle && !matchLicense && !matchBio && !matchSpecs) {
          return false;
        }
      }

      // 2. Specialization Filter
      if (selectedSpecialization !== 'All') {
        const specLower = selectedSpecialization.toLowerCase();

        if (specLower === 'residential') {
          const hasResidential = agent.specializations.some((s) =>
            s.toLowerCase().includes('residential') || s.toLowerCase().includes('modernist') || s.toLowerCase().includes('condos') || s.toLowerCase().includes('estates')
          );
          if (!hasResidential) return false;
        } else if (specLower === 'commercial') {
          const hasCommercial = agent.specializations.some((s) =>
            s.toLowerCase().includes('commercial') || s.toLowerCase().includes('offices') || s.toLowerCase().includes('headquarters') || s.toLowerCase().includes('retail')
          );
          if (!hasCommercial) return false;
        } else if (specLower === 'luxury') {
          const hasLuxury = agent.specializations.some((s) =>
            s.toLowerCase().includes('luxury') || s.toLowerCase().includes('penthouses') || s.toLowerCase().includes('waterfront')
          ) || agent.isLuxuryExpert;
          if (!hasLuxury) return false;
        } else if (specLower === 'investment') {
          const hasInvestment = agent.specializations.some((s) =>
            s.toLowerCase().includes('investment') || s.toLowerCase().includes('capital') || s.toLowerCase().includes('multi-family') || s.toLowerCase().includes('syndication')
          );
          if (!hasInvestment) return false;
        } else if (specLower === 'land & development') {
          const hasLand = agent.specializations.some((s) =>
            s.toLowerCase().includes('land') || s.toLowerCase().includes('development') || s.toLowerCase().includes('infill') || s.toLowerCase().includes('zoning')
          );
          if (!hasLand) return false;
        } else if (specLower === 'property management') {
          const hasManagement = agent.specializations.some((s) =>
            s.toLowerCase().includes('management') || s.toLowerCase().includes('portfolios') || s.toLowerCase().includes('infrastructure')
          );
          if (!hasManagement) return false;
        } else if (specLower === 'architecture') {
          const hasArch = agent.specializations.some((s) =>
            s.toLowerCase().includes('architecture') || s.toLowerCase().includes('modernist') || s.toLowerCase().includes('historic') || s.toLowerCase().includes('reuse')
          ) || agent.role.toLowerCase().includes('architectural');
          if (!hasArch) return false;
        } else if (specLower === 'corporate real estate') {
          const hasCorporate = agent.specializations.some((s) =>
            s.toLowerCase().includes('corporate') || s.toLowerCase().includes('headquarters') || s.toLowerCase().includes('logistics') || s.toLowerCase().includes('relocation')
          ) || agent.role.toLowerCase().includes('corporate');
          if (!hasCorporate) return false;
        } else {
          const matches = agent.specializations.some((s) => s.toLowerCase().includes(specLower));
          if (!matches) return false;
        }
      }

      return true;
    });
  }, [searchQuery, selectedSpecialization]);

  // Formatted count display
  const countString = filteredAgents.length < 10 ? `0${filteredAgents.length}` : `${filteredAgents.length}`;

  return (
    <div className="w-full min-h-screen bg-[#F7F6F1] text-[#111111] selection:bg-[#4C5544] selection:text-[#F7F6F1]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-10 sm:py-16">
        
        {/* Section Intro */}
        <header className="pb-8 sm:pb-12 border-b border-[#DCDAD3]/80">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 mb-3">
            <span className="text-[11px] font-mono tracking-[0.22em] text-[#5F625F] uppercase font-medium">
              ESTRA ADVISORY NETWORK
            </span>
            <span className="hidden sm:inline-block text-[11px] font-mono tracking-[0.18em] text-[#5F625F] uppercase">
              TRUSTED EXPERTS. BETTER DECISIONS.
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
                {countString}
              </div>
              <div className="text-[11px] sm:text-xs font-sans text-[#5F625F] uppercase tracking-wider leading-tight font-medium">
                Licensed Advisors<br />Available
              </div>
            </div>
          </div>
        </header>

        {/* Search + Filter Bar */}
        <div className="bg-[#FDFDFB] border border-[#DCDAD3] rounded-xs mt-8 sm:mt-10 mb-8 sm:mb-10 flex flex-col md:flex-row items-stretch md:items-center shadow-[0_1px_3px_rgba(0,0,0,0.02)] transition-colors">
          {/* Search Input */}
          <div className="relative flex-1 flex items-center px-4 sm:px-5 py-3.5">
            <Search className="w-4 h-4 text-[#5F625F] mr-3 stroke-[1.6] shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by advisor name, metropolitan city, or agency..."
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
          <div className="relative md:w-64 shrink-0 px-4 sm:px-5 py-3.5 border-t md:border-t-0 border-[#DCDAD3]">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full bg-transparent text-xs sm:text-sm font-medium text-[#111111] focus:outline-none cursor-pointer appearance-none pr-8 tracking-tight"
            >
              <option value="All">All Specializations</option>
              <option value="Residential">Residential</option>
              <option value="Commercial">Commercial</option>
              <option value="Luxury">Luxury</option>
              <option value="Investment">Investment</option>
              <option value="Land & Development">Land & Development</option>
              <option value="Property Management">Property Management</option>
              <option value="Architecture">Architecture</option>
              <option value="Corporate Real Estate">Corporate Real Estate</option>
            </select>
            <ChevronDown className="absolute right-4 sm:right-5 top-1/2 -translate-y-1/2 w-4 h-4 text-[#5F625F] pointer-events-none stroke-[1.6]" />
          </div>
        </div>

        {/* Advisor Grid */}
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
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="group bg-[#FDFDFB] border border-[#DCDAD3] hover:border-[#111111] p-6 sm:p-7 flex flex-col justify-between transition-all duration-300 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-xs"
              >
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
                          <span>Verified Advisor · {agent.satisfactionRating}% Client Satisfaction</span>
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
                      <div className="pt-3 border-t border-[#DCDAD3]/60 text-[10px] sm:text-[11px] font-mono uppercase tracking-wider text-[#5F625F]">
                        {agent.specializations.slice(0, 3).map((s) => s.toUpperCase()).join(' · ')}
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
                        {agent.yearsExperience < 10 ? `0${agent.yearsExperience}` : agent.yearsExperience}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                        Years Experience
                      </span>
                    </div>

                    <div className="px-4 sm:px-5 border-r border-[#DCDAD3]">
                      <span className="block text-xl sm:text-2xl font-normal text-[#111111] font-sans leading-none">
                        {agent.dealsClosed || agent.totalDeals}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                        Transactions
                      </span>
                    </div>

                    <div className="pl-4 sm:pl-5">
                      <span className="block text-xl sm:text-2xl font-normal text-[#111111] font-sans leading-none">
                        {agent.activeListingsCount < 10 ? `0${agent.activeListingsCount}` : agent.activeListingsCount}
                      </span>
                      <span className="text-[10px] sm:text-[11px] text-[#5F625F] block mt-1 tracking-tight">
                        Active Listings
                      </span>
                    </div>
                  </div>

                  {/* Refined CTA Button with moving arrow on card hover */}
                  <Link
                    to={`/agents/${agent.slug || agent.id}`}
                    className="inline-flex items-center justify-center gap-2 px-5 py-2.5 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 rounded-xs self-stretch sm:self-auto cursor-pointer whitespace-nowrap"
                  >
                    <span>View Profile & Listings</span>
                    <ArrowRight className="w-3.5 h-3.5 text-white transition-transform duration-200 group-hover:translate-x-1" />
                  </Link>
                </div>
              </article>
            ))}
          </div>
        )}

      </div>
    </div>
  );
};
