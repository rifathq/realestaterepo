import React, { useState, useMemo } from 'react';
import { Link } from 'react-router-dom';
import { Search, ChevronDown, MapPin, ShieldCheck, X } from 'lucide-react';
import { AGENTS } from '../data/agents';
import { Agent } from '../types/property';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

interface AgentsPageProps {
  defaultCity?: string;
}

export const AgentsPage: React.FC<AgentsPageProps> = ({ defaultCity }) => {
  const [searchQuery, setSearchQuery] = useState(defaultCity || '');
  const [selectedSpecialization, setSelectedSpecialization] = useState('All');

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

  return (
    <div className="w-full min-h-screen bg-stone-50">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-12">
        {/* 1. Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 pb-6 border-b border-stone-200">
          <div className="space-y-1.5">
            <div className="text-[11px] font-mono tracking-widest text-stone-500 uppercase font-semibold">
              ESTRA ADVISORY NETWORK
            </div>
            <h1 className="text-3xl sm:text-4xl lg:text-[44px] font-bold tracking-tight text-stone-950 font-sans">
              Licensed Real Estate Advisors
            </h1>
            <p className="text-sm sm:text-base text-stone-600 max-w-3xl font-normal">
              Partner with dedicated brokers specializing in commercial headquarters, residential architecture, and land entitlements.
            </p>
          </div>
          <div className="text-xs sm:text-sm font-mono text-stone-600 whitespace-nowrap md:pb-1">
            {filteredAgents.length} Licensed Advisor{filteredAgents.length === 1 ? '' : 's'} Available
          </div>
        </div>

        {/* 2. Search + Filter Bar */}
        <div className="bg-white border border-stone-200 p-3 sm:p-4 my-6 sm:my-8 flex flex-col md:flex-row gap-3 sm:gap-4 items-stretch md:items-center shadow-xs">
          {/* Search Input */}
          <div className="relative flex-1">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-400 stroke-[1.5]" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search by advisor name, metropolitan city, or agency..."
              className="w-full pl-10 pr-10 py-2.5 text-sm bg-white border border-stone-200 rounded-none focus:outline-none focus:border-stone-900 placeholder:text-stone-400 text-stone-900 transition-colors"
            />
            {searchQuery && (
              <button
                type="button"
                onClick={() => setSearchQuery('')}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-stone-400 hover:text-stone-700 p-1 cursor-pointer"
                aria-label="Clear search"
              >
                <X className="w-3.5 h-3.5" />
              </button>
            )}
          </div>

          {/* Specialization Filter Dropdown */}
          <div className="relative shrink-0">
            <select
              value={selectedSpecialization}
              onChange={(e) => setSelectedSpecialization(e.target.value)}
              className="w-full md:w-auto min-w-[240px] px-3.5 py-2.5 text-sm bg-white border border-stone-200 rounded-none focus:outline-none focus:border-stone-900 text-stone-800 cursor-pointer appearance-none pr-9 font-medium"
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
            <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 w-4 h-4 text-stone-500 pointer-events-none stroke-[1.5]" />
          </div>
        </div>

        {/* 3. Agent Grid */}
        {filteredAgents.length === 0 ? (
          <div className="bg-white border border-stone-200 p-12 text-center space-y-3">
            <div className="text-stone-400 font-mono text-xs uppercase tracking-wider font-semibold">
              No Advisors Found
            </div>
            <h3 className="text-lg font-bold text-stone-900">
              No licensed advisors match your current filter criteria
            </h3>
            <p className="text-xs sm:text-sm text-stone-500 max-w-md mx-auto">
              Try searching for a different advisor name, city (e.g. &ldquo;San Francisco&rdquo;, &ldquo;New York&rdquo;, &ldquo;Austin&rdquo;), or reset the specialization filter.
            </p>
            <button
              type="button"
              onClick={() => {
                setSearchQuery('');
                setSelectedSpecialization('All');
              }}
              className="mt-2 inline-flex items-center px-4 py-2 text-xs font-semibold bg-stone-950 text-white hover:bg-stone-800 transition-colors cursor-pointer"
            >
              Reset Filters
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {filteredAgents.map((agent) => (
              <article
                key={agent.id}
                className="bg-white border border-stone-200 p-6 sm:p-7 flex flex-col justify-between hover:border-stone-400 transition-colors duration-200 shadow-xs"
              >
                <div>
                  {/* Top Section */}
                  <div className="flex items-start justify-between gap-4">
                    <div className="flex items-start gap-4">
                      {/* Agent Profile Image */}
                      <div className="w-20 h-20 sm:w-24 sm:h-24 shrink-0 overflow-hidden bg-stone-100 border border-stone-200">
                        <ImageWithFallback
                          src={agent.avatar}
                          alt={agent.name}
                          fallbackTitle={agent.name}
                          className="w-full h-full object-cover"
                        />
                      </div>

                      {/* Credentials & Details */}
                      <div className="space-y-0.5">
                        <div className="text-[11px] font-mono text-stone-500 uppercase tracking-wider font-semibold">
                          {agent.licenseNumber}
                        </div>
                        <h2 className="text-xl sm:text-2xl font-bold text-stone-950 tracking-tight leading-tight">
                          <Link
                            to={`/agents/${agent.slug || agent.id}`}
                            className="hover:text-stone-700 transition-colors"
                          >
                            {agent.name}
                          </Link>
                        </h2>
                        <div className="text-xs sm:text-sm text-stone-600 font-medium">
                          {agent.role}
                        </div>
                        <div className="flex items-center gap-1.5 text-xs text-stone-500 pt-0.5">
                          <MapPin className="w-3.5 h-3.5 text-stone-400 shrink-0 stroke-[1.5]" />
                          <span>{agent.officeLocation}</span>
                        </div>
                      </div>
                    </div>

                    {/* Satisfaction Badge */}
                    <div className="shrink-0">
                      <span className="inline-flex items-center gap-1.5 px-2.5 py-1 text-xs font-semibold text-emerald-800 bg-emerald-50/70 border border-emerald-300 rounded">
                        <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2]" />
                        <span>{agent.satisfactionRating}% Satisfaction</span>
                      </span>
                    </div>
                  </div>

                  {/* Agent Description */}
                  <p className="mt-4 text-xs sm:text-sm text-stone-600 leading-relaxed font-normal">
                    {agent.bio}
                  </p>

                  {/* Specializations */}
                  <div className="mt-4 pt-3.5 border-t border-stone-100 text-xs text-stone-600">
                    <strong className="font-semibold text-stone-900">Specializations:</strong>{' '}
                    <span className="text-stone-700">{agent.specializations.join(' · ')}</span>
                  </div>
                </div>

                {/* Bottom Section: Stats & View Profile Button */}
                <div className="mt-6 pt-4 border-t border-stone-100 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                  <div className="flex items-center gap-3 sm:gap-4 text-xs font-mono text-stone-700">
                    <span>
                      <strong className="font-bold text-stone-950">{agent.yearsExperience}</strong> yrs exp.
                    </span>
                    <span>
                      <strong className="font-bold text-stone-950">
                        {agent.dealsClosed || agent.totalDeals}
                      </strong>{' '}
                      deals
                    </span>
                    <span>
                      <strong className="font-bold text-stone-950">{agent.activeListingsCount}</strong> active listings
                    </span>
                  </div>

                  <Link
                    to={`/agents/${agent.slug || agent.id}`}
                    className="inline-flex items-center justify-center px-4 py-2 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-colors whitespace-nowrap shadow-xs"
                  >
                    View Profile & Listings
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
