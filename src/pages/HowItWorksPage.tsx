import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import { 
  Search, 
  BarChart3, 
  Calendar, 
  FileCheck, 
  KeyRound, 
  ArrowRight, 
  ShieldCheck, 
  Building,
  Upload,
  UserCheck
} from 'lucide-react';

export const HowItWorksPage: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const roleParam = searchParams.get('role');
  const validRoles: Array<'buyers' | 'renters' | 'sellers' | 'agents'> = ['buyers', 'renters', 'sellers', 'agents'];
  const activeRole: 'buyers' | 'renters' | 'sellers' | 'agents' = 
    validRoles.includes(roleParam as any) ? (roleParam as any) : 'buyers';

  const setActiveRole = (role: 'buyers' | 'renters' | 'sellers' | 'agents') => {
    setSearchParams({ role }, { replace: true });
  };

  const buyerSteps = [
    {
      step: '01',
      title: 'Curated Discovery & Architectural Filtering',
      desc: 'Filter properties by specific structural criteria: ceiling heights, daylight orientation, structural steel vs. timber framing, and verified zoning permissions.',
      icon: Search
    },
    {
      step: '02',
      title: 'Spatial & Valuation Analysis',
      desc: 'Examine detailed spatial specifications, price per square foot valuations, operational HOA expenditures, and verified building amenities.',
      icon: BarChart3
    },
    {
      step: '03',
      title: 'Accompanied In-Person or 4K Virtual Walkthrough',
      desc: 'Schedule a private viewing with an assigned Digentic broker. Experience mechanical, electrical, and structural systems with an engineering dossier in hand.',
      icon: Calendar
    },
    {
      step: '04',
      title: 'Audited Documentation & Title Review',
      desc: 'Access verified floor plans, Phase 1 environmental site reports, municipal tax certifications, and clear title warranties before placing an offer.',
      icon: FileCheck
    },
    {
      step: '05',
      title: 'Seamless Digital Offer & Escrow Closing',
      desc: 'Submit offers through standardized Digentic digital contracts with secure third-party escrow settlement and title insurance dispatch.',
      icon: KeyRound
    }
  ];

  const renterSteps = [
    {
      step: '01',
      title: 'Explore Prime Leases & Flexible Terms',
      desc: 'Browse design-forward lofts, corporate headquarters, and penthouse suites available for immediate or scheduled occupancy.',
      icon: Building
    },
    {
      step: '02',
      title: 'Schedule Immediate Accompanied Tour',
      desc: 'Pick your preferred inspection date and time directly through the platform. Meet a licensed advisor on-site or join an interactive video walk.',
      icon: Calendar
    },
    {
      step: '03',
      title: 'Digital Lease Verification & Deposit Escrow',
      desc: 'Submit corporate credit references, review standard lease covenants, and transfer deposits through secure banking protocols.',
      icon: ShieldCheck
    },
    {
      step: '04',
      title: 'Handover & Digital Key Allocation',
      desc: 'Complete property condition walk-through report and receive building security access credentials.',
      icon: KeyRound
    }
  ];

  const sellerSteps = [
    {
      step: '01',
      title: 'Submit Asset Dossier & Measured Specs',
      desc: 'Initiate a property listing by providing square footage, architectural plans, and ownership authority documentation.',
      icon: Upload
    },
    {
      step: '02',
      title: 'Digentic Title Audit & Architectural Photography',
      desc: 'Our technical team verifies ownership records with county registries and dispatches professional architectural photographers to document the space.',
      icon: FileCheck
    },
    {
      step: '03',
      title: 'Institutional Syndication & Targeted Presentation',
      desc: 'Your property is presented to verified private clients, family offices, and corporate occupiers across the Digentic marketplace network.',
      icon: ShieldCheck
    },
    {
      step: '04',
      title: 'Offer Negotiation & Escrow Settlement',
      desc: 'Receive qualified, audited purchase proposals or lease letters of intent backed by verified proof of funds.',
      icon: KeyRound
    }
  ];

  const agentSteps = [
    {
      step: '01',
      title: 'Advisory Accreditation & Licensing Verification',
      desc: 'Join the Digentic Advisory Network by verifying state brokerage licensing, historic transaction volume, and architectural domain expertise.',
      icon: UserCheck
    },
    {
      step: '02',
      title: 'Direct Client Assignment & Inbound Representation',
      desc: 'Receive qualified client inquiries, private tour requests, and institutional RFP mandates directly in your dedicated agent dashboard.',
      icon: Building
    },
    {
      step: '03',
      title: 'Closing Protocol & Commission Settlement',
      desc: 'Execute transactions through Digentic digital title escrow with instant commission settlement upon municipal recording.',
      icon: KeyRound
    }
  ];

  const currentSteps = 
    activeRole === 'buyers' ? buyerSteps :
    activeRole === 'renters' ? renterSteps :
    activeRole === 'sellers' ? sellerSteps : agentSteps;

  return (
    <div className="pb-24 space-y-16">
      
      {/* Header */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>Process & Verification Guide</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-architectural">
            From search to keys, made simpler.
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Understand the step-by-step transaction workflow whether you are acquiring, leasing, selling, or advising on architectural properties.
          </p>
        </div>
      </section>

      {/* Role Switcher */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8">
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 p-2 bg-stone-100 border border-stone-200 text-sm font-semibold">
          <button
            onClick={() => setActiveRole('buyers')}
            className={`py-3 transition-colors ${
              activeRole === 'buyers' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            For Property Buyers
          </button>
          <button
            onClick={() => setActiveRole('renters')}
            className={`py-3 transition-colors ${
              activeRole === 'renters' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            For Tenants & Renters
          </button>
          <button
            onClick={() => setActiveRole('sellers')}
            className={`py-3 transition-colors ${
              activeRole === 'sellers' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            For Property Owners
          </button>
          <button
            onClick={() => setActiveRole('agents')}
            className={`py-3 transition-colors ${
              activeRole === 'agents' ? 'bg-white text-stone-950 shadow-xs' : 'text-stone-600 hover:text-stone-950'
            }`}
          >
            For Licensed Brokers
          </button>
        </div>
      </div>

      {/* Steps List */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 space-y-6">
        {currentSteps.map((item, index) => {
          const IconComponent = item.icon;
          return (
            <div
              key={item.step}
              className="bg-white border border-stone-200 p-6 sm:p-8 flex flex-col sm:flex-row sm:items-start gap-6 hover:border-stone-400 transition-colors shadow-xs"
            >
              <div className="w-12 h-12 rounded-full bg-stone-900 text-white flex items-center justify-center shrink-0">
                <IconComponent className="w-5 h-5 stroke-[1.5]" />
              </div>

              <div className="flex-1 space-y-2">
                <div className="text-xs font-mono text-stone-400">
                  Step {item.step}
                </div>
                <h3 className="text-xl font-bold text-stone-950 tracking-tight font-architectural">
                  {item.title}
                </h3>
                <p className="text-sm sm:text-base text-stone-600 leading-relaxed">
                  {item.desc}
                </p>
              </div>
            </div>
          );
        })}
      </section>

      {/* Conversion CTA */}
      <section className="w-full max-w-5xl mx-auto px-4 sm:px-8 text-center pt-8">
        <div className="p-8 sm:p-12 bg-stone-100 border border-stone-200 space-y-4">
          <h3 className="text-2xl sm:text-3xl font-bold text-stone-950 font-architectural">
            Ready to begin your property search or listing?
          </h3>
          <p className="text-sm sm:text-base text-stone-600 max-w-xl mx-auto">
            Our advisory desk is available to assist with custom acquisition mandates, commercial valuations, and private tours.
          </p>
          <div className="flex flex-wrap items-center justify-center gap-4 pt-4">
            <Link
              to="/properties"
              className="px-8 py-3.5 bg-black hover:bg-neutral-900 active:scale-95 text-white font-medium text-sm border border-black shadow-md hover:shadow-lg transition-all duration-200 rounded-md"
            >
              Explore Catalog
            </Link>
            <Link
              to="/contact"
              className="px-8 py-3 bg-white border border-stone-300 text-stone-900 text-sm font-semibold hover:bg-stone-50 transition-colors"
            >
              Contact Advisory Desk
            </Link>
          </div>
        </div>
      </section>

    </div>
  );
};
