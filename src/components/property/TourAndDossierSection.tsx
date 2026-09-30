import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  Calendar, 
  ArrowRight, 
  ShieldCheck, 
  Phone, 
  Mail, 
  Copy, 
  Check, 
  Lock, 
  Clock, 
  CheckCircle2
} from 'lucide-react';
import { Property, Agent } from '../../types/property';
import { ImageWithFallback } from '../common/ImageWithFallback';

interface TourAndDossierSectionProps {
  property: Property;
  agent: Agent;
  notify: (msg: string) => void;
}

export const TourAndDossierSection: React.FC<TourAndDossierSectionProps> = ({
  property,
  agent,
  notify
}) => {
  const [inquireName, setInquireName] = useState('');
  const [inquireEmail, setInquireEmail] = useState('');
  const [inquirePhone, setInquirePhone] = useState('');
  const [inquireMessage, setInquireMessage] = useState(
    'I would like to request confidential offering documentation, zoning title files, and arrange a private technical walkthrough.'
  );
  const [inquireSubmitted, setInquireSubmitted] = useState(false);
  const [copiedField, setCopiedField] = useState<'phone' | 'email' | null>(null);

  const handleCopy = (type: 'phone' | 'email', value: string) => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(value);
    }
    setCopiedField(type);
    notify(`${type === 'phone' ? 'Phone number' : 'Broker email'} copied to clipboard`);
    setTimeout(() => {
      setCopiedField(null);
    }, 2000);
  };

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquireSubmitted(true);
    notify(`Dossier request submitted to ${agent.name}`);
  };

  return (
    <aside className="space-y-6">
      {/* 1. Primary Action Card: Experience Property / Tour */}
      <div className="bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 text-white rounded-2xl p-6 sm:p-7 border border-slate-700/60 shadow-xl relative overflow-hidden space-y-5">
        {/* Subtle Luxury Ambient Radial Highlights */}
        <div className="absolute top-0 right-0 -mr-12 -mt-12 w-48 h-48 rounded-full bg-amber-500/10 blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-0 -ml-12 -mb-12 w-40 h-40 rounded-full bg-blue-500/10 blur-3xl pointer-events-none" />

        {/* Badge */}
        <div className="flex items-center justify-between">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full text-xs font-semibold text-amber-400 bg-amber-400/10 border border-amber-400/25 tracking-wider uppercase font-mono shadow-2xs">
            <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)] animate-pulse" />
            <span>Private Accompanied Tour</span>
          </div>
          <span className="text-[11px] font-mono text-slate-400 hidden sm:inline-block">
            In-Person or 4K Virtual
          </span>
        </div>

        {/* Heading & Subtext */}
        <div className="space-y-2">
          <h3 className="text-xl sm:text-2xl font-bold tracking-tight text-white font-sans leading-tight">
            Experience {property.title}
          </h3>
          <p className="text-xs sm:text-sm text-slate-300 leading-relaxed font-normal">
            Schedule a confidential in-person walkthrough or an interactive 4K live video tour with a licensed advisor.
          </p>
        </div>

        {/* Key Reassurance Badges */}
        <div className="grid grid-cols-2 gap-2 pt-1 pb-1 text-[11px] text-slate-300 font-mono">
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2.5]" />
            <span>Direct Principal Escort</span>
          </div>
          <div className="flex items-center gap-1.5">
            <Check className="w-3.5 h-3.5 text-amber-400 shrink-0 stroke-[2.5]" />
            <span>Confidential NDA Tier</span>
          </div>
        </div>

        {/* White CTA Button with Lift Transition */}
        <Link
          to={`/tour/${property.slug}`}
          className="w-full py-3.5 px-4 bg-white hover:bg-slate-50 text-slate-950 text-xs sm:text-sm font-semibold tracking-tight text-center rounded-xl transition-all duration-200 shadow-md hover:shadow-xl hover:-translate-y-0.5 active:translate-y-0 active:scale-[0.99] flex items-center justify-center gap-2.5 group cursor-pointer font-sans"
        >
          <Calendar className="w-4 h-4 text-slate-900 group-hover:scale-110 transition-transform stroke-[2]" />
          <span>Schedule Private Viewing</span>
          <ArrowRight className="w-4 h-4 text-slate-700 group-hover:translate-x-0.5 transition-transform" />
        </Link>
      </div>

      {/* 2. Listing Broker Profile & Direct Dossier Request Card */}
      <div className="bg-white border border-slate-200/90 rounded-2xl p-6 sm:p-7 space-y-6 shadow-sm shadow-slate-100">
        
        {/* Card Header Row: Verified Partner Badge */}
        <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
          <span className="text-[11px] font-mono uppercase tracking-wider font-semibold text-slate-500">
            Listing Broker
          </span>
          <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-800 text-[11px] font-semibold tracking-wide font-sans shadow-2xs">
            <ShieldCheck className="w-3.5 h-3.5 text-emerald-600 stroke-[2.2]" />
            <span>Digentic Verified Partner</span>
          </span>
        </div>

        {/* Broker Identity Block */}
        <div className="flex items-start gap-4">
          <div className="w-16 h-16 rounded-2xl overflow-hidden border border-slate-200 bg-slate-100 shadow-2xs shrink-0">
            <ImageWithFallback
              src={agent.avatar}
              alt={agent.name}
              fallbackTitle={agent.name}
              className="w-full h-full object-cover"
            />
          </div>
          <div className="min-w-0 flex-1 space-y-1">
            <h4 className="text-base sm:text-lg font-bold text-slate-900 tracking-tight leading-snug">
              <Link
                to={`/agents/${agent.slug}`}
                className="hover:text-slate-700 transition-colors"
              >
                {agent.name}
              </Link>
            </h4>
            <p className="text-xs text-slate-600 font-medium truncate">{agent.role}</p>
            <div className="pt-0.5">
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-slate-100 text-slate-600 font-mono text-[10px] font-semibold uppercase tracking-wider border border-slate-200/70">
                {agent.licenseNumber}
              </span>
            </div>
          </div>
        </div>

        {/* Interactive Contact Details (Pill Action Buttons) */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-1 xl:grid-cols-2 gap-2 pt-0.5">
          {/* Phone Link & Copy */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs font-mono">
            <a
              href={`tel:${agent.phone}`}
              className="flex items-center gap-2 text-slate-800 hover:text-slate-950 font-medium truncate min-w-0"
              title="Click to dial"
            >
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Phone className="w-3 h-3 text-slate-700 stroke-[2]" />
              </div>
              <span className="truncate">{agent.phone}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy('phone', agent.phone)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0 ml-1.5"
              title="Copy phone number"
              aria-label="Copy phone number"
            >
              {copiedField === 'phone' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>

          {/* Email Link & Copy */}
          <div className="flex items-center justify-between p-2.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-slate-100/70 transition-colors text-xs font-mono">
            <a
              href={`mailto:${agent.email}`}
              className="flex items-center gap-2 text-slate-800 hover:text-slate-950 font-medium truncate min-w-0"
              title="Click to compose email"
            >
              <div className="w-6 h-6 rounded-lg bg-white border border-slate-200 flex items-center justify-center shrink-0 shadow-2xs">
                <Mail className="w-3 h-3 text-slate-700 stroke-[2]" />
              </div>
              <span className="truncate">{agent.email}</span>
            </a>
            <button
              type="button"
              onClick={() => handleCopy('email', agent.email)}
              className="p-1 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0 ml-1.5"
              title="Copy email address"
              aria-label="Copy email address"
            >
              {copiedField === 'email' ? (
                <Check className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
              ) : (
                <Copy className="w-3.5 h-3.5" />
              )}
            </button>
          </div>
        </div>

        {/* Direct Broker Dossier Request Form */}
        <div className="pt-4 border-t border-slate-100 space-y-4">
          <div className="flex items-center justify-between">
            <div>
              <h5 className="text-sm font-bold text-slate-900 tracking-tight font-sans">
                Direct Broker Dossier Request
              </h5>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Confidential title, zoning, and MEP specifications packet
              </p>
            </div>
            <span className="inline-flex items-center gap-1 text-[10px] font-mono font-medium text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200/80">
              <Clock className="w-3 h-3" />
              <span>~4h Turnaround</span>
            </span>
          </div>

          {inquireSubmitted ? (
            <div className="p-5 rounded-xl bg-emerald-50/90 border border-emerald-200 text-center space-y-2 animate-in fade-in duration-200">
              <div className="w-10 h-10 rounded-full bg-emerald-100 text-emerald-700 border border-emerald-200 flex items-center justify-center mx-auto shadow-2xs">
                <CheckCircle2 className="w-5 h-5 stroke-[2.2]" />
              </div>
              <h6 className="text-xs font-bold text-slate-900 font-sans">
                Dossier Request Dispatched
              </h6>
              <p className="text-[11px] text-slate-600 leading-normal">
                Your confidential request has been routed to <span className="font-semibold text-slate-800">{agent.name}</span>. The comprehensive investment memorandum will be delivered to your email shortly.
              </p>
            </div>
          ) : (
            <form onSubmit={handleInquireSubmit} className="space-y-3.5">
              {/* Full Name */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-[0.1em] font-mono mb-1.5">
                  Full Name *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Julian Rhodes"
                  value={inquireName}
                  onChange={(e) => setInquireName(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all duration-150 shadow-2xs"
                />
              </div>

              {/* Corporate Email */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-[0.1em] font-mono mb-1.5">
                  Corporate / Personal Email *
                </label>
                <input
                  type="email"
                  required
                  placeholder="name@organization.com"
                  value={inquireEmail}
                  onChange={(e) => setInquireEmail(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all duration-150 shadow-2xs"
                />
              </div>

              {/* Direct Phone Number */}
              <div>
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-[0.1em] font-mono mb-1.5">
                  Direct Phone Number
                </label>
                <input
                  type="tel"
                  placeholder="+1 (555) 000-0000"
                  value={inquirePhone}
                  onChange={(e) => setInquirePhone(e.target.value)}
                  className="w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all duration-150 shadow-2xs"
                />
              </div>

              {/* Confidential Requirements Textarea */}
              <div className="space-y-1">
                <label className="block text-xs font-semibold text-slate-700 uppercase tracking-[0.1em] font-mono">
                  Confidential Inquiry / Requirements *
                </label>
                <textarea
                  rows={3}
                  required
                  maxLength={500}
                  value={inquireMessage}
                  onChange={(e) => setInquireMessage(e.target.value)}
                  className="min-h-[96px] w-full text-xs sm:text-sm p-3 rounded-xl border border-slate-200 bg-slate-50/70 text-slate-900 placeholder:text-slate-400 focus:outline-none focus:bg-white focus:border-slate-900 focus:ring-2 focus:ring-slate-900/10 transition-all duration-150 shadow-2xs resize-none"
                />
                <div className="flex justify-between items-center text-[10px] text-slate-400 font-mono pt-0.5">
                  <span className="flex items-center gap-1">
                    <Lock className="w-3 h-3 text-slate-400" />
                    <span>Confidential & NDA Protected</span>
                  </span>
                  <span>{inquireMessage.length}/500</span>
                </div>
              </div>

              {/* Submit Button */}
              <button
                type="submit"
                className="w-full py-3.5 px-4 bg-slate-950 hover:bg-slate-900 active:scale-[0.99] text-white text-xs sm:text-sm font-semibold rounded-xl transition-all duration-150 shadow-md hover:shadow-lg flex items-center justify-center gap-2 cursor-pointer group font-sans"
              >
                <Lock className="w-3.5 h-3.5 text-slate-400 group-hover:text-amber-400 transition-colors" />
                <span>Request Complete Dossier</span>
                <ArrowRight className="w-4 h-4 text-slate-300 group-hover:translate-x-1 transition-transform" />
              </button>
            </form>
          )}
        </div>

        {/* Footer Link to Broker's Portfolio */}
        <div className="pt-2 text-center border-t border-slate-100">
          <Link
            to={`/agents/${agent.slug}`}
            className="inline-flex items-center gap-1.5 text-xs text-slate-600 hover:text-slate-950 font-medium transition-colors group"
          >
            <span>
              View {agent.name.split(' ')[0]}&apos;s Complete Advisory Portfolio ({agent.activeListingsCount} listings)
            </span>
            <ArrowRight className="w-3.5 h-3.5 text-slate-400 group-hover:translate-x-0.5 transition-transform" />
          </Link>
        </div>
      </div>
    </aside>
  );
};
