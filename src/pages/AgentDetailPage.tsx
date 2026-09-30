import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  CheckCircle2, 
  Send
} from 'lucide-react';
import { AGENTS } from '../data/agents';
import { PROPERTIES } from '../data/properties';
import { PropertyCard } from '../components/property/PropertyCard';
import { useMarketplace } from '../context/MarketplaceContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';

export const AgentDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const { notify, properties: dynamicProps } = useMarketplace();

  const agent = AGENTS.find((a) => a.slug === slug || a.id === slug);

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
        <p className="text-sm text-stone-500">The requested advisor profile does not exist or may have transferred offices.</p>
        <Link
          to="/agents"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-950 text-white text-xs font-semibold tracking-wide hover:bg-stone-800 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Return to Advisory Directory</span>
        </Link>
      </div>
    );
  }

  // Combine and match agent's active listings
  const allProperties = dynamicProps && dynamicProps.length > 0 ? dynamicProps : PROPERTIES;
  const agentProperties = allProperties.filter((p) => {
    return (
      p.agentId === agent.id ||
      p.agentId === agent.slug ||
      (agent.slug === 'elena-vance' && (p.agentId === 'agent-1' || p.agentId === 'agent-elena-vance')) ||
      (agent.slug === 'marcus-chen' && (p.agentId === 'agent-2' || p.agentId === 'agent-marcus-chen')) ||
      (agent.slug === 'sophia-alvarez' && (p.agentId === 'agent-3' || p.agentId === 'agent-sophia-alvarez')) ||
      (agent.slug === 'julian-keller' && (p.agentId === 'agent-4' || p.agentId === 'agent-julian-keller')) ||
      (agent.slug === 'alexander-wright' && (p.agentId === 'agent-5' || p.agentId === 'agent-alexander-wright')) ||
      (agent.slug === 'claire-dupont' && (p.agentId === 'agent-6' || p.agentId === 'agent-claire-dupont')) ||
      (agent.slug === 'rob-wittman' && p.agentId === 'agent-rob-wittman') ||
      (agent.slug === 'marcus-vance' && p.agentId === 'agent-demo')
    );
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify(`Consultation request dispatched to ${agent.name}`);
  };

  return (
    <div className="w-full bg-stone-50 min-h-screen">
      <div className="max-w-[1760px] mx-auto px-4 sm:px-6 lg:px-8 xl:px-12 py-8 sm:py-10 space-y-8">
        
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-semibold text-stone-600 hover:text-stone-950 transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            <span>Back to Licensed Advisors</span>
          </Link>
        </div>

        {/* Advisor Profile Card */}
        <div className="bg-white border border-stone-200 p-6 sm:p-10 shadow-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Avatar & Fast Credentials */}
            <div className="lg:col-span-4 space-y-4">
              <div className="aspect-square w-full max-w-[280px] bg-stone-100 border border-stone-200 overflow-hidden">
                <ImageWithFallback
                  src={agent.avatar}
                  alt={agent.name}
                  fallbackTitle={agent.name}
                  className="w-full h-full object-cover"
                />
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm font-mono text-stone-700">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-stone-400 stroke-[1.5] shrink-0" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-400 stroke-[1.5] shrink-0" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-400 stroke-[1.5] shrink-0" />
                  <span>{agent.officeLocation}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-stone-500 font-mono block uppercase tracking-wider font-semibold">
                  License / Registration:
                </span>
                <span className="text-sm font-mono font-bold text-stone-950">
                  {agent.licenseNumber}
                </span>
              </div>
            </div>

            {/* Details & Biography */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-emerald-800 mb-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-emerald-600 stroke-[2]" />
                  <span>ESTRA Advisory Network Certified · {agent.agency}</span>
                </div>
                <h1 className="text-3xl sm:text-4xl lg:text-5xl font-bold tracking-tight text-stone-950 font-sans">
                  {agent.name}
                </h1>
                <p className="text-sm sm:text-base font-medium text-stone-600 mt-1">
                  {agent.role}
                </p>
              </div>

              {/* Performance Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-stone-50 border border-stone-200 text-center font-mono">
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-stone-950">{agent.yearsExperience}</span>
                  <span className="text-xs text-stone-600 block font-sans font-medium mt-1">Years in Practice</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-stone-950">
                    {agent.dealsClosed || agent.totalDeals}
                  </span>
                  <span className="text-xs text-stone-600 block font-sans font-medium mt-1">Deals Closed</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-stone-950">{agent.activeListingsCount}</span>
                  <span className="text-xs text-stone-600 block font-sans font-medium mt-1">Active Listings</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-bold text-emerald-800">{agent.satisfactionRating}%</span>
                  <span className="text-xs text-stone-600 block font-sans font-medium mt-1">Client Satisfaction</span>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2 text-stone-700 text-sm sm:text-base leading-relaxed">
                <h2 className="text-xs sm:text-sm font-bold uppercase tracking-wider text-stone-950 font-sans">
                  Professional Background
                </h2>
                <p>{agent.bio}</p>
              </div>

              {/* Specializations & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-stone-100 text-xs sm:text-sm">
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">
                    Asset Specializations
                  </span>
                  <span className="text-stone-900 font-medium mt-1 block">
                    {agent.specializations.join(' · ')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">
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
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          
          {/* Left: Active Listings */}
          <div className="lg:col-span-8 space-y-6">
            <div className="flex items-center justify-between border-b border-stone-200 pb-4">
              <div>
                <h2 className="text-xl sm:text-2xl font-bold tracking-tight text-stone-950 font-sans">
                  Current Property Listings ({agentProperties.length})
                </h2>
                <p className="text-xs text-stone-500 mt-0.5">
                  Exclusive mandates and direct verified representations by {agent.name}
                </p>
              </div>
            </div>

            {agentProperties.length === 0 ? (
              <div className="p-8 bg-white border border-stone-200 text-center text-xs sm:text-sm text-stone-500 space-y-2">
                <p>No public on-market listings currently available.</p>
                <p className="text-stone-400 text-xs">
                  Contact advisor directly for confidential off-market placement memorandums.
                </p>
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
          <aside className="lg:col-span-4 bg-white border border-stone-200 p-6 space-y-4 shadow-xs">
            <div className="pb-3 border-b border-stone-100">
              <h3 className="text-base font-bold text-stone-950">
                Request Private Consultation
              </h3>
              <p className="text-xs text-stone-500 mt-0.5">
                Direct inquiry dispatched to {agent.name}
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2 bg-stone-50 border border-stone-200 p-4">
                <CheckCircle2 className="w-8 h-8 text-emerald-600 mx-auto" />
                <h4 className="text-sm font-bold text-stone-900">Inquiry Dispatched</h4>
                <p className="text-xs text-stone-500">
                  {agent.name} has received your consultation request and will reach out promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquireName}
                    onChange={(e) => setInquireName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full text-xs p-2.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Corporate / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquireEmail}
                    onChange={(e) => setInquireEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full text-xs p-2.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={inquirePhone}
                    onChange={(e) => setInquirePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-2.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Advisory Mandate
                  </label>
                  <select
                    value={inquireType}
                    onChange={(e) => setInquireType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors cursor-pointer"
                  >
                    <option value="Acquisition Advisory">Acquisition Advisory</option>
                    <option value="Asset Disposition">Asset Disposition</option>
                    <option value="Commercial Lease">Commercial Lease</option>
                    <option value="Land Entitlement">Land Entitlement</option>
                    <option value="Off-Market Representation">Off-Market Representation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-semibold uppercase tracking-wider text-stone-600 mb-1">
                    Confidential Brief / Message
                  </label>
                  <textarea
                    rows={4}
                    value={inquireMessage}
                    onChange={(e) => setInquireMessage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 bg-white focus:outline-none focus:border-stone-900 transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-stone-950 hover:bg-stone-800 text-white text-xs font-semibold tracking-wide transition-colors flex items-center justify-center gap-2 cursor-pointer shadow-xs"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>Send Advisory Request</span>
                </button>
              </form>
            )}
          </aside>
        </div>

      </div>
    </div>
  );
};
