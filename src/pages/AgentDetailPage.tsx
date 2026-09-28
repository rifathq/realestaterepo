import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  Award, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Building2,
  Calendar
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/property/PropertyCard';
import { useMarketplace } from '../context/MarketplaceContext';

export const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { notify } = useMarketplace();

  const agent = AGENTS.find((a) => a.slug === slug);

  const [inquireName, setInquireName] = useState('');
  const [inquireEmail, setInquireEmail] = useState('');
  const [inquirePhone, setInquirePhone] = useState('');
  const [inquireType, setInquireType] = useState('Acquisition Advisory');
  const [inquireMessage, setInquireMessage] = useState('I would like to arrange an introductory consultation regarding prospective properties in your coverage area.');
  const [submitted, setSubmitted] = useState(false);

  if (!agent) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Advisor Not Found</h2>
        <p className="text-sm text-stone-500">The requested broker profile does not exist or may have transferred offices.</p>
        <Link
          to="/agents"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Return to Advisory Directory</span>
        </Link>
      </div>
    );
  }

  // Agent's active listings
  const agentProperties = PROPERTIES.filter((p) => p.agentId === agent.id);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify(`Consultation request dispatched to ${agent.name}`);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 pb-24 space-y-12">
      
      {/* Back button */}
      <div>
        <Link
          to="/agents"
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>All Advisory Network Partners</span>
        </Link>
      </div>

      {/* Advisor Profile Card */}
      <div className="bg-white border border-stone-200 p-6 sm:p-10">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Avatar & Fast Credentials */}
          <div className="lg:col-span-4 space-y-4">
            <div className="aspect-square w-full max-w-[280px] bg-stone-100 border border-stone-200 overflow-hidden">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="space-y-2 text-xs font-mono text-stone-600">
              <div className="flex items-center gap-2">
                <Phone className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                <span>{agent.phone}</span>
              </div>
              <div className="flex items-center gap-2">
                <Mail className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                <span>{agent.email}</span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-stone-400 stroke-[1.5]" />
                <span>{agent.officeLocation}</span>
              </div>
            </div>

            <div className="pt-2">
              <span className="text-[11px] text-stone-400 font-mono block">State Licensing:</span>
              <span className="text-xs font-mono font-semibold text-stone-900">{agent.licenseNumber}</span>
            </div>
          </div>

          {/* Details & Biography */}
          <div className="lg:col-span-8 space-y-6">
            <div>
              <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 mb-1">
                <ShieldCheck className="w-4 h-4 stroke-[1.5]" />
                <span>ESTRA Certified Principal Advisor · {agent.agency}</span>
              </div>
              <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
                {agent.name}
              </h1>
              <p className="text-sm font-semibold text-stone-600 mt-1">
                {agent.role}
              </p>
            </div>

            {/* Performance Matrix */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 bg-stone-50 border border-stone-200 text-center font-mono">
              <div>
                <span className="text-2xl font-bold text-stone-950">{agent.yearsExperience}</span>
                <span className="text-[11px] text-stone-500 block font-sans">Years in Practice</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-stone-950">{agent.dealsClosed}</span>
                <span className="text-[11px] text-stone-500 block font-sans">Deals Closed</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-stone-950">{agent.activeListingsCount}</span>
                <span className="text-[11px] text-stone-500 block font-sans">Active Mandates</span>
              </div>
              <div>
                <span className="text-2xl font-bold text-emerald-800">{agent.satisfactionRating}%</span>
                <span className="text-[11px] text-stone-500 block font-sans">Client Rating</span>
              </div>
            </div>

            {/* Biography */}
            <div className="space-y-3 text-stone-700 text-xs sm:text-sm leading-relaxed">
              <h3 className="text-sm font-bold uppercase tracking-wider text-stone-950 font-sans">
                Professional Background
              </h3>
              <p>{agent.bio}</p>
            </div>

            {/* Specializations & Languages */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs">
              <div>
                <span className="text-stone-400 uppercase tracking-wider block font-mono">
                  Asset Specializations
                </span>
                <span className="text-stone-900 font-medium mt-1 block">
                  {agent.specializations.join(' · ')}
                </span>
              </div>
              <div>
                <span className="text-stone-400 uppercase tracking-wider block font-mono">
                  Working Languages
                </span>
                <span className="text-stone-900 font-medium mt-1 block">
                  {agent.languages.join(' · ')}
                </span>
              </div>
            </div>

          </div>

        </div>
      </div>

      {/* Main Grid: Active Listings + Consultation Booking */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left: Active Listings */}
        <div className="lg:col-span-8 space-y-6">
          <div className="flex items-center justify-between border-b border-stone-200 pb-4">
            <div>
              <h2 className="text-2xl font-bold tracking-tight text-stone-950 font-architectural">
                Active Listings by {agent.name.split(' ')[0]}
              </h2>
              <p className="text-xs text-stone-500 mt-0.5">
                Exclusive mandates and direct verified representations
              </p>
            </div>
            <span className="text-xs font-mono text-stone-500">
              {agentProperties.length} Properties
            </span>
          </div>

          {agentProperties.length === 0 ? (
            <div className="p-8 bg-white border border-stone-200 text-center text-xs text-stone-500">
              No current public on-market listings. Contact advisor for private off-market placement files.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              {agentProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          )}
        </div>

        {/* Right: Consultation Form */}
        <aside className="lg:col-span-4 bg-white border border-stone-200 p-6 space-y-4">
          <div className="pb-3 border-b border-stone-100">
            <h3 className="text-base font-bold text-stone-950">
              Request Private Consultation
            </h3>
            <p className="text-xs text-stone-500 mt-0.5">
              Direct connection with {agent.name}
            </p>
          </div>

          {submitted ? (
            <div className="py-6 text-center space-y-2">
              <CheckCircle2 className="w-8 h-8 text-emerald-700 mx-auto" />
              <h4 className="text-sm font-bold text-stone-900">Consultation Dispatched</h4>
              <p className="text-xs text-stone-500">
                {agent.name} will reach out to schedule an introductory conference.
              </p>
            </div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-3">
              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  value={inquireName}
                  onChange={(e) => setInquireName(e.target.value)}
                  placeholder="Your Full Name"
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Corporate / Personal Email *
                </label>
                <input
                  type="email"
                  required
                  value={inquireEmail}
                  onChange={(e) => setInquireEmail(e.target.value)}
                  placeholder="name@organization.com"
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Phone Number
                </label>
                <input
                  type="tel"
                  value={inquirePhone}
                  onChange={(e) => setInquirePhone(e.target.value)}
                  placeholder="+1 (xxx) xxx-xxxx"
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Mandate Objective
                </label>
                <select
                  value={inquireType}
                  onChange={(e) => setInquireType(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                >
                  <option value="Acquisition Advisory">Property Acquisition</option>
                  <option value="Leasing & Relocation">Commercial Lease / Relocation</option>
                  <option value="Listing Consultation">Asset Listing & Valuation</option>
                  <option value="Off-Market Portfolio">Confidential Off-Market Placement</option>
                </select>
              </div>

              <div>
                <label className="block text-[11px] font-medium text-stone-600 mb-1">
                  Scope & Requirements
                </label>
                <textarea
                  rows={3}
                  value={inquireMessage}
                  onChange={(e) => setInquireMessage(e.target.value)}
                  className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-stone-900 text-white text-xs font-semibold hover:bg-stone-800 transition-colors"
              >
                Schedule Consultation
              </button>
            </form>
          )}
        </aside>

      </div>

    </div>
  );
};
