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
          className="inline-flex items-center gap-2 px-4 py-2 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5] text-white" />
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
    <div className="w-full bg-[#F7F6F1] text-[#111111] min-h-screen selection:bg-[#4C5544] selection:text-[#F7F6F1]">
      <div className="max-w-[1580px] mx-auto px-4 sm:px-8 lg:px-12 xl:px-16 py-8 sm:py-12 space-y-8">
        
        {/* Breadcrumb / Back button */}
        <div>
          <Link
            to="/agents"
            className="inline-flex items-center gap-2 text-xs sm:text-sm font-medium text-[#5F625F] hover:text-[#111111] transition-colors"
          >
            <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
            <span>Back to Licensed Advisors</span>
          </Link>
        </div>

        {/* Advisor Profile Card */}
        <div className="bg-[#FDFDFB] border border-[#DCDAD3] p-6 sm:p-10 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-xs">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
            
            {/* Avatar & Fast Credentials */}
            <div className="lg:col-span-4 space-y-4">
              <div className="aspect-[4/5] w-full max-w-[280px] bg-stone-200 border border-[#DCDAD3] overflow-hidden">
                <ImageWithFallback
                  src={agent.avatar}
                  alt={agent.name}
                  fallbackTitle={agent.name}
                  className="w-full h-full object-cover object-top"
                />
              </div>
              
              <div className="space-y-2 text-xs sm:text-sm font-mono text-[#5F625F]">
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-[#5F625F] stroke-[1.5] shrink-0" />
                  <span>{agent.phone}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-[#5F625F] stroke-[1.5] shrink-0" />
                  <span className="truncate">{agent.email}</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <MapPin className="w-4 h-4 text-[#5F625F] stroke-[1.5] shrink-0" />
                  <span>{agent.officeLocation}</span>
                </div>
              </div>

              <div className="pt-2">
                <span className="text-[11px] text-[#5F625F] font-mono block uppercase tracking-wider font-semibold">
                  License / Registration:
                </span>
                <span className="text-sm font-mono font-bold text-[#111111]">
                  {agent.licenseNumber}
                </span>
              </div>
            </div>

            {/* Details & Biography */}
            <div className="lg:col-span-8 space-y-6">
              <div>
                <div className="flex items-center gap-2 text-xs font-mono text-[#4C5544] mb-1.5 font-medium">
                  <ShieldCheck className="w-4 h-4 text-[#4C5544] stroke-[2]" />
                  <span>ESTRA Advisory Network Certified · {agent.agency}</span>
                </div>
                <h1 className="font-sans text-3xl sm:text-4xl font-bold tracking-tight text-[#111111]">
                  {agent.name}
                </h1>
                <p className="text-sm sm:text-base font-medium text-[#5F625F] mt-1">
                  {agent.role}
                </p>
              </div>

              {/* Performance Matrix */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-5 bg-[#F7F6F1] border border-[#DCDAD3] text-center font-sans">
                <div>
                  <span className="text-2xl sm:text-3xl font-normal text-[#111111]">{agent.yearsExperience < 10 ? `0${agent.yearsExperience}` : agent.yearsExperience}</span>
                  <span className="text-xs text-[#5F625F] block font-sans font-medium mt-1">Years in Practice</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-normal text-[#111111]">
                    {agent.dealsClosed || agent.totalDeals}
                  </span>
                  <span className="text-xs text-[#5F625F] block font-sans font-medium mt-1">Transactions</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-normal text-[#111111]">{agent.activeListingsCount < 10 ? `0${agent.activeListingsCount}` : agent.activeListingsCount}</span>
                  <span className="text-xs text-[#5F625F] block font-sans font-medium mt-1">Active Listings</span>
                </div>
                <div>
                  <span className="text-2xl sm:text-3xl font-normal text-[#4C5544]">{agent.satisfactionRating}%</span>
                  <span className="text-xs text-[#5F625F] block font-sans font-medium mt-1">Client Satisfaction</span>
                </div>
              </div>

              {/* Biography */}
              <div className="space-y-2 text-[#5F625F] text-sm sm:text-base leading-relaxed">
                <h2 className="text-xs sm:text-sm font-mono uppercase tracking-wider text-[#111111] font-semibold">
                  Professional Background
                </h2>
                <p>{agent.bio}</p>
              </div>

              {/* Specializations & Languages */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pt-4 border-t border-[#DCDAD3] text-xs sm:text-sm">
                <div>
                  <span className="text-[#5F625F] uppercase tracking-wider block font-mono text-[11px] font-semibold">
                    Asset Specializations
                  </span>
                  <span className="text-[#111111] font-medium mt-1 block">
                    {agent.specializations.join(' · ')}
                  </span>
                </div>
                <div>
                  <span className="text-[#5F625F] uppercase tracking-wider block font-mono text-[11px] font-semibold">
                    Working Languages
                  </span>
                  <span className="text-[#111111] font-medium mt-1 block">
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
            <div className="flex items-center justify-between border-b border-[#DCDAD3] pb-4">
              <div>
                <h2 className="font-sans text-xl sm:text-2xl font-bold tracking-tight text-[#111111]">
                  Current Property Listings ({agentProperties.length})
                </h2>
                <p className="text-xs text-[#5F625F] mt-0.5">
                  Exclusive mandates and direct verified representations by {agent.name}
                </p>
              </div>
            </div>

            {agentProperties.length === 0 ? (
              <div className="p-8 bg-[#FDFDFB] border border-[#DCDAD3] text-center text-xs sm:text-sm text-[#5F625F] space-y-2">
                <p>No public on-market listings currently available.</p>
                <p className="text-[#5F625F] text-xs">
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
          <aside className="lg:col-span-4 bg-[#FDFDFB] border border-[#DCDAD3] p-6 space-y-4 shadow-[0_1px_3px_rgba(0,0,0,0.02)] rounded-xs">
            <div className="pb-3 border-b border-[#DCDAD3]">
              <h3 className="font-sans text-lg font-bold text-[#111111] tracking-tight">
                Request Private Consultation
              </h3>
              <p className="text-xs text-[#5F625F] mt-0.5">
                Direct inquiry dispatched to {agent.name}
              </p>
            </div>

            {submitted ? (
              <div className="py-8 text-center space-y-2 bg-[#F7F6F1] border border-[#DCDAD3] p-4">
                <CheckCircle2 className="w-8 h-8 text-[#4C5544] mx-auto" />
                <h4 className="text-sm font-bold text-[#111111]">Inquiry Dispatched</h4>
                <p className="text-xs text-[#5F625F]">
                  {agent.name} has received your consultation request and will reach out promptly.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-3">
                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5F625F] mb-1">
                    Full Name *
                  </label>
                  <input
                    type="text"
                    required
                    value={inquireName}
                    onChange={(e) => setInquireName(e.target.value)}
                    placeholder="Your Full Name"
                    className="w-full text-xs p-2.5 border border-[#DCDAD3] bg-white focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5F625F] mb-1">
                    Corporate / Personal Email *
                  </label>
                  <input
                    type="email"
                    required
                    value={inquireEmail}
                    onChange={(e) => setInquireEmail(e.target.value)}
                    placeholder="name@organization.com"
                    className="w-full text-xs p-2.5 border border-[#DCDAD3] bg-white focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5F625F] mb-1">
                    Phone Number
                  </label>
                  <input
                    type="tel"
                    value={inquirePhone}
                    onChange={(e) => setInquirePhone(e.target.value)}
                    placeholder="+1 (555) 000-0000"
                    className="w-full text-xs p-2.5 border border-[#DCDAD3] bg-white focus:outline-none focus:border-[#111111] transition-colors"
                  />
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5F625F] mb-1">
                    Advisory Mandate
                  </label>
                  <select
                    value={inquireType}
                    onChange={(e) => setInquireType(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#DCDAD3] bg-white focus:outline-none focus:border-[#111111] transition-colors cursor-pointer"
                  >
                    <option value="Acquisition Advisory">Acquisition Advisory</option>
                    <option value="Asset Disposition">Asset Disposition</option>
                    <option value="Commercial Lease">Commercial Lease</option>
                    <option value="Land Entitlement">Land Entitlement</option>
                    <option value="Off-Market Representation">Off-Market Representation</option>
                  </select>
                </div>

                <div>
                  <label className="block text-[11px] font-mono uppercase tracking-wider text-[#5F625F] mb-1">
                    Confidential Brief / Message
                  </label>
                  <textarea
                    rows={4}
                    value={inquireMessage}
                    onChange={(e) => setInquireMessage(e.target.value)}
                    className="w-full text-xs p-2.5 border border-[#DCDAD3] bg-white focus:outline-none focus:border-[#111111] transition-colors resize-none"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-2.5 px-4 bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5 text-white" />
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
