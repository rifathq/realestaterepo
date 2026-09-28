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
          <div className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-1">
            ESTRA Advisory Network
          </div>
          <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
            Licensed Real Estate Advisors
          </h1>
          <p className="text-xs sm:text-sm text-stone-500 mt-1">
            Partner with dedicated brokers specializing in commercial headquarters, residential architecture, and land entitlements
          </p>
        </div>

        <div className="text-xs font-mono text-stone-500">
          {filteredAgents.length} Licensed Advisors Available
        </div>
      </div>

      {/* Search & Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-4 p-4 bg-white border border-stone-200">
        <div className="flex-1 relative">
          <Search className="w-4 h-4 text-stone-400 absolute left-3 top-2.5 stroke-[1.5]" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search by advisor name, metropolitan city, or agency..."
            className="w-full text-xs pl-9 pr-3 py-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
          />
        </div>

        <div className="w-full sm:w-64">
          <select
            value={selectedSpecialty}
            onChange={(e) => setSelectedSpecialty(e.target.value)}
            className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
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
            className="bg-white border border-stone-200 p-6 flex flex-col justify-between hover:border-stone-400 transition-colors"
          >
            <div className="space-y-4">
              <div className="flex items-start gap-4">
                <img
                  src={agent.avatar}
                  alt={agent.name}
                  className="w-20 h-20 object-cover border border-stone-200 shrink-0"
                />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <span className="text-[11px] font-mono text-stone-400 uppercase">
                      {agent.licenseNumber}
                    </span>
                    <span className="text-[11px] text-emerald-800 font-semibold flex items-center gap-1">
                      <ShieldCheck className="w-3.5 h-3.5 stroke-[1.5]" />
                      <span>{agent.satisfactionRating}% Satisfaction</span>
                    </span>
                  </div>
                  <h3 className="text-xl font-bold text-stone-950 mt-1">
                    <Link to={`/agents/${agent.slug}`} className="hover:underline">
                      {agent.name}
                    </Link>
                  </h3>
                  <p className="text-xs text-stone-600 font-medium">{agent.role}</p>
                  <p className="text-xs text-stone-400 flex items-center gap-1 mt-0.5">
                    <MapPin className="w-3 h-3" />
                    <span>{agent.officeLocation}</span>
                  </p>
                </div>
              </div>

              <p className="text-xs text-stone-600 line-clamp-3 leading-relaxed">
                {agent.bio}
              </p>

              {/* Specializations: Zero-Pill, unboxed text */}
              <div className="text-xs text-stone-500 pt-2 border-t border-stone-100">
                <span className="font-semibold text-stone-700">Specializations: </span>
                <span>{agent.specializations.join(' · ')}</span>
              </div>
            </div>

            {/* Bottom bar with performance stats & CTAs */}
            <div className="pt-5 mt-5 border-t border-stone-100 flex flex-col sm:flex-row items-center justify-between gap-4">
              <div className="flex items-center gap-4 text-xs font-mono text-stone-600">
                <div>
                  <span className="font-bold text-stone-900">{agent.yearsExperience}</span> yrs exp.
                </div>
                <div>
                  <span className="font-bold text-stone-900">{agent.dealsClosed}</span> deals
                </div>
                <div>
                  <span className="font-bold text-stone-900">{agent.activeListingsCount}</span> active listings
                </div>
              </div>

              <div className="flex items-center gap-2 w-full sm:w-auto">
                <Link
                  to={`/agents/${agent.slug}`}
                  className="w-full sm:w-auto px-4 py-2 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors text-center"
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
