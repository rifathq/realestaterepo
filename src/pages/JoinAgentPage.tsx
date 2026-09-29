import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { 
  ShieldCheck, 
  Award, 
  TrendingUp, 
  Users, 
  ArrowRight, 
  CheckCircle2, 
  Building2, 
  Sparkles,
  DollarSign,
  FileCheck
} from 'lucide-react';
import { useMarketplace } from '../context/MarketplaceContext';

export const JoinAgentPage: React.FC = () => {
  const { notify } = useMarketplace();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    phone: '',
    currentBrokerage: '',
    licenseNumber: '',
    state: 'Illinois',
    yearsExperience: '5-10 years',
    volumeLastYear: '$10M - $25M',
    specialty: 'Modernist Residential',
    notes: ''
  });
  const [submitted, setSubmitted] = useState(false);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitted(true);
    notify('Advisory application received. An ESTRA Managing Principal will contact you within 24 hours.');
  };

  return (
    <div className="w-full">
      {/* Hero Banner */}
      <section className="bg-stone-950 text-white px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 border-b border-stone-800">
        <div className="max-w-4xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 bg-stone-900 border border-stone-800 text-stone-300 text-xs font-mono uppercase tracking-wider">
            <Sparkles className="w-3.5 h-3.5 text-stone-400" />
            <span>ESTRA Advisory Partnership</span>
          </div>
          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight font-architectural">
            Join as an ESTRA Real Estate Agent
          </h1>
          <p className="text-base sm:text-xl text-stone-300 max-w-2xl leading-relaxed">
            Represent premier architectural landmarks, modern residences, and commercial headquarters. Accelerate your career with proprietary deal flow, marketing syndication, and favorable split tiers.
          </p>
          <div className="pt-4 flex flex-wrap gap-4">
            <a
              href="#apply-form"
              className="px-6 py-3.5 bg-white text-stone-950 font-semibold text-sm hover:bg-stone-100 transition-colors inline-flex items-center gap-2 shadow-sm"
            >
              <span>Apply for Advisory Roster</span>
              <ArrowRight className="w-4 h-4" />
            </a>
            <Link
              to="/agents"
              className="px-6 py-3.5 border border-stone-700 text-white font-medium text-sm hover:bg-stone-900 transition-colors"
            >
              Explore Current Advisors
            </Link>
          </div>
        </div>
      </section>

      {/* Value Pillars */}
      <section className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-20 bg-stone-50 border-b border-stone-200">
        <div className="max-w-7xl mx-auto space-y-12">
          <div className="text-center max-w-2xl mx-auto space-y-2">
            <h2 className="text-2xl sm:text-3xl font-bold tracking-tight text-stone-950 font-architectural">
              Why Premier Agents Choose ESTRA
            </h2>
            <p className="text-sm sm:text-base text-stone-600">
              Designed by architects and top-producing brokers to eliminate administrative bottlenecks and elevate client advisory.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 sm:gap-8">
            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
                <DollarSign className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Competitive Splits & Caps</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Enjoy 85/15 to 95/5 commission tiers with a low annual company dollar cap, plus no junk franchise or desk fees.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
                <TrendingUp className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Curated Architectural Leads</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Direct verified inquiries from high-net-worth buyers, tech founders, and commercial tenants seeking specific architectural profiles.
              </p>
            </div>

            <div className="bg-white p-6 sm:p-8 border border-stone-200 shadow-xs space-y-3">
              <div className="w-10 h-10 bg-stone-100 flex items-center justify-center text-stone-900">
                <ShieldCheck className="w-5 h-5 stroke-[1.5]" />
              </div>
              <h3 className="text-lg font-bold text-stone-900">Full In-House Marketing</h3>
              <p className="text-sm text-stone-600 leading-relaxed">
                Dedicated architectural photographers, 3D laser scanning, bespoke print monographs, and digital distribution for every exclusive listing.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Application Form */}
      <section id="apply-form" className="px-4 sm:px-8 lg:px-12 xl:px-16 py-16 sm:py-24 bg-white">
        <div className="max-w-3xl mx-auto">
          <div className="border border-stone-200 p-8 sm:p-12 shadow-sm">
            {submitted ? (
              <div className="text-center py-12 space-y-4">
                <div className="w-16 h-16 bg-stone-100 text-stone-900 rounded-full flex items-center justify-center mx-auto">
                  <CheckCircle2 className="w-8 h-8 text-emerald-600" />
                </div>
                <h3 className="text-2xl font-bold text-stone-900 font-architectural">Application Submitted</h3>
                <p className="text-stone-600 text-sm max-w-md mx-auto">
                  Thank you for applying to the ESTRA Advisory Network. Our broker director will review your license and credentials and schedule a confidential discussion.
                </p>
                <div className="pt-4">
                  <Link
                    to="/agents"
                    className="inline-flex items-center gap-2 px-6 py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
                  >
                    <span>View Advisory Directory</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-6">
                <div className="border-b border-stone-200 pb-4">
                  <h3 className="text-xl font-bold text-stone-950 font-architectural">
                    Confidential Advisor Application
                  </h3>
                  <p className="text-xs sm:text-sm text-stone-500 mt-1">
                    All inquiries are held in strict confidence. Licensed brokers and associate agents across all major metros are encouraged to apply.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sarah Jenkins"
                      value={formData.fullName}
                      onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Email Address *
                    </label>
                    <input
                      type="email"
                      required
                      placeholder="s.jenkins@brokerage.com"
                      value={formData.email}
                      onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Phone Number *
                    </label>
                    <input
                      type="tel"
                      required
                      placeholder="+1 (312) 555-0192"
                      value={formData.phone}
                      onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Current Brokerage / Firm
                    </label>
                    <input
                      type="text"
                      placeholder="e.g. Independent or Brand Name"
                      value={formData.currentBrokerage}
                      onChange={(e) => setFormData({ ...formData, currentBrokerage: e.target.value })}
                      className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      State / Market *
                    </label>
                    <select
                      value={formData.state}
                      onChange={(e) => setFormData({ ...formData, state: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="Illinois (Chicago)">Illinois (Chicago)</option>
                      <option value="California (SF / LA)">California (SF / LA)</option>
                      <option value="New York (NYC / Boston)">New York (NYC / Boston)</option>
                      <option value="Washington (Seattle)">Washington (Seattle)</option>
                      <option value="Texas (Austin / Dallas)">Texas (Austin / Dallas)</option>
                      <option value="Other Market">Other Market</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Experience
                    </label>
                    <select
                      value={formData.yearsExperience}
                      onChange={(e) => setFormData({ ...formData, yearsExperience: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="1-3 years">1-3 years</option>
                      <option value="3-5 years">3-5 years</option>
                      <option value="5-10 years">5-10 years</option>
                      <option value="10+ years">10+ years</option>
                    </select>
                  </div>

                  <div>
                    <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                      Past 12mo Volume
                    </label>
                    <select
                      value={formData.volumeLastYear}
                      onChange={(e) => setFormData({ ...formData, volumeLastYear: e.target.value })}
                      className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                    >
                      <option value="Under $5M">Under $5M</option>
                      <option value="$5M - $10M">$5M - $10M</option>
                      <option value="$10M - $25M">$10M - $25M</option>
                      <option value="$25M+">$25M+</option>
                    </select>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                    Specialty Focus
                  </label>
                  <select
                    value={formData.specialty}
                    onChange={(e) => setFormData({ ...formData, specialty: e.target.value })}
                    className="w-full px-3 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  >
                    <option value="Modernist Residential">Modernist Residential</option>
                    <option value="Prime Commercial & HQ">Prime Commercial & HQ</option>
                    <option value="Waterfront & Estates">Waterfront & Estates</option>
                    <option value="Urban Land & Development">Urban Land & Development</option>
                    <option value="Luxury Leasing">Luxury Leasing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-mono uppercase text-stone-700 mb-1">
                    License Number & Additional Notes
                  </label>
                  <textarea
                    rows={3}
                    placeholder="Enter state real estate license number and brief background..."
                    value={formData.notes}
                    onChange={(e) => setFormData({ ...formData, notes: e.target.value })}
                    className="w-full px-3.5 py-2.5 bg-stone-50 border border-stone-200 text-sm text-stone-900 focus:outline-none focus:border-stone-900"
                  />
                </div>

                <button
                  type="submit"
                  className="w-full py-3.5 px-6 bg-stone-950 text-white font-medium text-sm hover:bg-stone-800 transition-colors flex items-center justify-center gap-2"
                >
                  <FileCheck className="w-4 h-4" />
                  <span>Submit Confidential Application</span>
                </button>
              </form>
            )}
          </div>
        </div>
      </section>
    </div>
  );
};
