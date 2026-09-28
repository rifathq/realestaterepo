import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Search, Phone, Mail, Award, ArrowRight, ShieldCheck, MapPin, Building2 } from 'lucide-react';
import { AGENTS } from '../data/agents';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AgentsPage: React.FC = () => {
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('all');

  const specialties = [
    'All Specializations',
    'Modernist Residential',
    'Prime Commercial',
    'Headquarters & Offices',
    'Waterfront Estates',
    'Urban Land & Development'
  ];

  const filteredAgents = AGENTS.filter((agent) => {
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      const matchName = agent.name.toLowerCase().includes(q);
      const matchLocation = agent.officeLocation.toLowerCase().includes(q);
      const matchRole = agent.role.toLowerCase().includes(q);
      if (!matchName && !matchLocation && !matchRole) return false;
    }

    if (selectedSpecialty !== 'all' && selectedSpecialty !== 'All Specializations') {
      if (!agent.specializations.includes(selectedSpecialty)) return false;
    }

    return true;
  });

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 pb-24 space-y-10">
      
      {/* Page Header */}
      <div className="border-b border-stone-200 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <div className="text-sm text-stone-500 uppercase tracking-widest font-mono mb-1.5">
            ESTRA Advisory Network
          </div>
          <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
            Licensed Real Estate Advisors
          </h1>
          <p className="text-sm sm:text-base text-stone-600 mt-1.5">
            Partner with dedicated brokers specializing in commercial headquarters, residential architecture, and land entitlements
          </p>
        </div>

        <div className="text-sm font-mono text-stone-600 font-medium">
          {filteredAgents.length} Licensed Advisors Available
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-5 bg-white border border-stone-200 shadow-xs">
        <div className="flex-1 relative">
          <Search className="w-4.5 h-4.5 text-stone-400 absolute left-3.5 top-3 stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by advisor name, metropolitan city, or agency..."
            className="w-full text-sm sm:text-base pl-10 pr-4 py-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="w-full sm:w-72">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full text-sm sm:text-base p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
          >
            {specialties.map((s) => (
              <option key={s} value={s}>{s}</option>
            ))}
          </select>
        </div>
      </div>

      {/* Agents Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredAgents.map((agent) => (
          <article
            key={agent.id}
            className="bg-white border border-stone-200 p-6 sm:p-7 flex flex-col justify-between hover:border-stone-400 transition-colors shadow-xs"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4 sm:gap-5">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-22 h-22 object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono text-stone-500 uppercase font-semibold">
                      {agent.licenseNumber}
                    </span>
                    <span className="text-xs text-emerald-800 font-semibold flex items-center gap-1 bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>{agent.satisfactionRating}% Satisfaction</span>
                    </span>
                  </div>
                  <h3 className="text-xl sm:text-2xl font-bold text-stone-950 mt-1 font-architectural">
                    <Link to={`/agents/${agent.slug}`} className="hover:underline">
                      {agent.name}
                    </Link>
                  </h3>
                  <p className="text-sm text-stone-700 font-medium">{agent.role}</p>
                  <p className="text-sm text-stone-500 flex items-center gap-1.5 mt-0.5">
                    <MapPin className="w-3.5 h-3.5" />
                    <span>{agent.officeLocation}</span>
                  </p>
                </div>
              </div>

              <p className="text-sm sm:text-base text-stone-600 line-clamp-3 leading-relaxed">
                {agent.bio}
              </p>

              {/* Specializations: Zero-Pill, unboxed text */}
              <div className="text-sm text-stone-600 pt-3 border-t border-stone-100">
                <span className="font-semibold text-stone-900">Specializations: </span>
                <span>{agent.specializations.join(' · ')}</span>
              </div>
            </div>

            {/* Bottom bar with performance stats & CTAs */}
            <div className="pt-5 mt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-sm font-mono text-stone-700">
                <div>
                  <span className="font-bold text-stone-950">{agent.yearsExperience}</span> yrs exp.
                </div>
                <div>
                  <span className="font-bold text-stone-950">{agent.dealsClosed}</span> deals
                </div>
                <div>
                  <span className="font-bold text-stone-950">{agent.activeListingsCount}</span> active listings
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={`/agents/${agent.slug}`}
                  className="w-full sm:w-auto px-5 py-2.5 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors text-center shadow-xs"
                >
                  View Profile & Listings
                </Link>
              </div>
            </div>
          </article>
        ))}
      </div>

    </div>
  );
};
