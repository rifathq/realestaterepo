import React, { useState } from 'react';
import { 
  Mail, 
  Phone, 
  MapPin, 
  Clock, 
  CheckCircle2, 
  Building2, 
  ShieldCheck, 
  Send 
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const ContactPage: React.FC = () => {
  const { notify } = useMarketplace();

  const [name, setName] = useState('');
  const [email, setEmail] = useState('');
  const [phone, setPhone] = useState('');
  const [organization, setOrganization] = useState('');
  const [reason, setReason] = useState('Property Acquisition');
  const [message, setMessage] = useState('');
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify('Inquiry dispatched to Digentic Advisory Team');
  };

  return (
    <div className="pb-24 space-y-16">
      
      {/* Header */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Digentic Advisory Services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-architectural">
            Connect with our Private Advisory Desk
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Inquire regarding confidential acquisitions, corporate relocations, institutional mandates, or property listing certifications.
          </p>
        </div>
      </section>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-start">
          
          {/* Left: Contact Form */}
          <div className="lg:col-span-7 bg-white border border-stone-200 p-6 sm:p-10 shadow-sm">
            {submitted ? (
              <div className="py-12 text-center space-y-4">
                <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
                </div>
                <h3 className="text-2xl font-bold text-stone-950 font-architectural">Inquiry Received</h3>
                <p className="text-sm sm:text-base text-stone-600 max-w-md mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-stone-900">{name}</span>. A Digentic advisory director will review your mandate and respond within 4 business hours.
                </p>
                <div className="pt-4">
                  <button
                    onClick={() => {
                      setSubmitted(false);
                      setMessage('');
                    }}
                    className="px-6 py-2.5 bg-stone-100 hover:bg-stone-200 text-stone-900 text-sm font-medium transition-colors"
                  >
                    Send Another Communication
                  </button>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <h2 className="text-2xl font-bold text-stone-950 tracking-tight font-architectural">
                    Direct Inquiry Form
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    All communications are treated with strict confidentiality.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      placeholder="e.g. Katherine Sterling"
                      className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Corporate / Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="name@organization.com"
                      className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Direct Telephone Number
                    </label>
                    <input
                      type="tel"
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      placeholder="+1 (xxx) xxx-xxxx"
                      className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                      Organization / Entity
                    </label>
                    <input
                      type="text"
                      value={organization}
                      onChange={(e) => setOrganization(e.target.value)}
                      placeholder="e.g. Sterling Capital Management"
                      className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Nature of Inquiry *
                  </label>
                  <select
                    value={reason}
                    onChange={(e) => setReason(e.target.value)}
                    className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                  >
                    <option value="Property Acquisition">Commercial or Residential Acquisition</option>
                    <option value="Property Leasing">Office, Logistics, or Residential Lease</option>
                    <option value="Listing Verification">List & Certify an Architectural Property</option>
                    <option value="Private Office Mandate">Private Wealth / Family Office Advisory</option>
                    <option value="Institutional Inquiry">Institutional Partnership & Escrow</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-stone-700 uppercase tracking-wider mb-1.5">
                    Message & Spatial Requirements *
                  </label>
                  <textarea
                    rows={4}
                    required
                    value={message}
                    onChange={(e) => setMessage(e.target.value)}
                    placeholder="Provide details on target markets, square footage requirements, valuation ranges, or specific listed assets..."
                    className="w-full text-sm sm:text-base p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-4 bg-black hover:bg-neutral-900 text-white font-medium text-sm tracking-tight border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer"
                >
                  <Send className="w-4 h-4 stroke-[1.5] text-white" />
                  <span>Transmit Confidential Inquiry</span>
                </button>
              </form>
            )}
          </div>

          {/* Right: Office Locations & Fast Info */}
          <div className="lg:col-span-5 space-y-6">
            
            {/* Quick Contact Box */}
            <div className="bg-stone-900 text-white p-6 sm:p-8 space-y-4">
              <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
                Primary Advisory Hub
              </span>
              <h3 className="text-xl font-bold font-architectural">
                Digentic Realty Headquarters
              </h3>
              <div className="space-y-3 text-xs text-stone-300 font-mono">
                <div className="flex items-start gap-2.5">
                  <MapPin className="w-4 h-4 text-stone-400 shrink-0 mt-0.5" />
                  <span>420 Montgomery Street, Floor 14, San Francisco, CA 94104</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>+1 (800) 419-3782 / +1 (415) 890-2410</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>advisory@digentic-realty.com</span>
                </div>
                <div className="flex items-center gap-2.5">
                  <Clock className="w-4 h-4 text-stone-400 shrink-0" />
                  <span>Mon – Fri: 08:00 – 19:00 PST</span>
                </div>
              </div>
            </div>

            {/* Other Offices */}
            <div className="bg-white border border-stone-200 p-6 space-y-4">
              <h4 className="text-xs font-bold uppercase tracking-wider text-stone-950">
                Regional Partner Bureaus
              </h4>
              <div className="space-y-3 divide-y divide-stone-100 text-xs">
                
                <div className="pt-2">
                  <span className="font-semibold text-stone-900 block">New York Metro</span>
                  <p className="text-stone-500 font-mono">110 Central Park South, Suite 8, New York, NY</p>
                  <p className="text-stone-400 font-mono text-[11px]">+1 (212) 640-9120</p>
                </div>

                <div className="pt-3">
                  <span className="font-semibold text-stone-900 block">Pacific Northwest</span>
                  <p className="text-stone-500 font-mono">740 Bellevue Way NE, Suite 600, Seattle, WA</p>
                  <p className="text-stone-400 font-mono text-[11px]">+1 (206) 554-3891</p>
                </div>

                <div className="pt-3">
                  <span className="font-semibold text-stone-900 block">Texas Capital Markets</span>
                  <p className="text-stone-500 font-mono">300 Colorado Street, Suite 1200, Austin, TX</p>
                  <p className="text-stone-400 font-mono text-[11px]">+1 (512) 718-4902</p>
                </div>

              </div>
            </div>

          </div>

        </div>
      </div>

    </div>
  );
};
