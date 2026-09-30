import React, { useState, useRef, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { 
  Building2, 
  MapPin, 
  DollarSign, 
  Upload, 
  CheckCircle2, 
  ArrowRight, 
  ArrowLeft, 
  FileText, 
  ShieldCheck,
  Check,
  Landmark,
  Layers,
  Sparkles,
  Briefcase,
  Compass,
  ChevronDown,
  Info,
  KeyRound
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { PropertyCategory, ListingType } from '../types/property';
import { useMarketplace } from '../context/MarketplaceContext';

interface CategoryOption {
  value: PropertyCategory;
  label: string;
  tag: string;
  desc: string;
  icon: React.ComponentType<{ className?: string }>;
}

const CATEGORY_OPTIONS: CategoryOption[] = [
  {
    value: 'Offices',
    label: 'Offices & Commercial Headquarters',
    tag: 'Commercial Core',
    desc: 'High-rise towers, multi-tenant CBD campuses & corporate pavilions',
    icon: Building2,
  },
  {
    value: 'Villas',
    label: 'Villas & Private Residences',
    tag: 'Prime Residential',
    desc: 'Coastal estates, architectural mansions & custom compound acreage',
    icon: Landmark,
  },
  {
    value: 'Apartments',
    label: 'Apartments & Multi-Family Portfolios',
    tag: 'Investment Grade',
    desc: 'Bespoke condominium blocks & institutional multi-family assets',
    icon: Layers,
  },
  {
    value: 'Penthouses',
    label: 'Crown Penthouses & Sky Mansions',
    tag: 'Ultra-Luxury',
    desc: 'Panoramic skyline residences, multi-level terraces & private helipads',
    icon: Sparkles,
  },
  {
    value: 'Industrial',
    label: 'Industrial, Logistics & Data Infrastructure',
    tag: 'Infrastructure',
    desc: 'High-throughput fulfillment centers, data centers & specialized facilities',
    icon: Briefcase,
  },
  {
    value: 'Land',
    label: 'Development Parcels & Masterplanned Acreage',
    tag: 'Entitlements & Land',
    desc: 'Zoned metropolitan infill sites, master-planned tracts & ground leases',
    icon: Compass,
  },
  {
    value: 'Retail',
    label: 'High-Street Retail Stores & Flagships',
    tag: 'Prime Retail',
    desc: 'Flagship commercial storefronts, lifestyle retail centers & luxury malls',
    icon: Landmark,
  },
];

const ARCHITECTURAL_PRESETS = [
  'Modernist Steel & Glass',
  'Organic Mid-Century',
  'Brutalist Cast Concrete',
  'Neo-Classical Palladian',
  'Biophilic Contemporary',
  'Art Deco Revived',
];

const STEPS = [
  { id: 1, label: '01 Classification', short: 'Classification', desc: 'Asset & Intent' },
  { id: 2, label: '02 Location', short: 'Location', desc: 'GIS & Municipal' },
  { id: 3, label: '03 Specifications', short: 'Specs', desc: 'Spatial Audit' },
  { id: 4, label: '04 Valuation', short: 'Valuation', desc: 'Offering Terms' },
  { id: 5, label: '05 Media', short: 'Media', desc: 'Dossier & Plans' },
  { id: 6, label: '06 Verification', short: 'Verification', desc: 'Principal Authority' },
];

export const SellPage: React.FC = () => {
  const { notify } = useMarketplace();
  const [currentStep, setCurrentStep] = useState(1);
  const totalSteps = 6;

  // Form State
  const [title, setTitle] = useState('');
  const [category, setCategory] = useState<PropertyCategory>('Offices');
  const [listingType, setListingType] = useState<ListingType>('buy');
  const [architecturalStyle, setArchitecturalStyle] = useState('Contemporary Modernist');

  const [address, setAddress] = useState('');
  const [neighborhood, setNeighborhood] = useState('');
  const [city, setCity] = useState('San Francisco');
  const [state, setState] = useState('CA');
  const [zip, setZip] = useState('');

  const [sqft, setSqft] = useState('');
  const [beds, setBeds] = useState('');
  const [baths, setBaths] = useState('');
  const [parking, setParking] = useState('');
  const [yearBuilt, setYearBuilt] = useState('2023');

  const [price, setPrice] = useState('');
  const [hoaMonthly, setHoaMonthly] = useState('');
  const [tagline, setTagline] = useState('');
  const [description, setDescription] = useState('');

  const [imageUrl, setImageUrl] = useState('');
  const [ownerName, setOwnerName] = useState('Marcus Sterling');
  const [ownerEmail, setOwnerEmail] = useState('m.sterling@capital-group.com');
  const [ownerPhone, setOwnerPhone] = useState('+1 (415) 880-9921');
  const [ownerEntity, setOwnerEntity] = useState('Property Owner / Principal');

  const [isSubmitted, setIsSubmitted] = useState(false);
  const [referenceId, setReferenceId] = useState('');
  const [categoryDropdownOpen, setCategoryDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdown on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleNext = () => {
    if (currentStep === 1 && !title.trim()) {
      notify('Please enter a property or project designation');
      return;
    }
    if (currentStep === 2 && (!address.trim() || !city.trim())) {
      notify('Please specify the street address and metropolitan city');
      return;
    }
    if (currentStep === 3 && !sqft.trim()) {
      notify('Please specify the gross floor area in square feet');
      return;
    }
    if (currentStep === 4 && !price.trim()) {
      notify('Please specify the target offering valuation or lease price');
      return;
    }

    if (currentStep < totalSteps) {
      setCurrentStep(currentStep + 1);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 320, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `DIG-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);
    setIsSubmitted(true);
    notify(`Listing proposal registered under dossier ${generatedRef}`);
  };

  const selectedCategoryOption = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#0A0B0E] text-stone-100 pb-28 relative overflow-hidden selection:bg-amber-500 selection:text-black">
      
      {/* Ambient background glows */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[1100px] h-[500px] bg-gradient-to-b from-amber-500/10 via-amber-500/0 to-transparent blur-3xl pointer-events-none -z-10" />
      <div className="absolute top-96 right-0 w-[500px] h-[500px] bg-blue-500/5 blur-[120px] pointer-events-none -z-10" />

      {/* Editorial Header */}
      <section className="relative pt-16 sm:pt-24 pb-14 sm:pb-20 border-b border-white/[0.08] w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4 max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-white/[0.04] border border-white/[0.08] backdrop-blur-md">
            <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.6)]" />
            <span className="text-[11px] uppercase tracking-[0.2em] text-stone-300 font-mono font-medium">
              Digentic Advisory & Capital Markets
            </span>
          </div>

          <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-architectural leading-[1.08] text-balance">
            Institutional Intake & Asset Syndication
          </h1>

          <p className="text-stone-400 text-sm sm:text-base lg:text-lg max-w-2xl mx-auto font-normal leading-relaxed">
            Market your commercial headquarters, prime residential estate, or strategic development tract directly to accredited institutional funds, family offices, and sovereign capital.
          </p>
        </div>
      </section>

      {/* Wizard Shell */}
      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 -mt-8 relative z-10">
        
        {/* Sleek Institutional Stepper / Breadcrumbs */}
        <div className="bg-[#12151F]/90 backdrop-blur-xl border border-white/[0.08] rounded-2xl p-4 sm:p-5 shadow-2xl mb-6">
          {/* Desktop & Tablet Segmented Pill Breadcrumbs */}
          <div className="hidden md:grid grid-cols-6 gap-2">
            {STEPS.map((step) => {
              const isCurrent = step.id === currentStep;
              const isPast = step.id < currentStep;

              return (
                <button
                  key={step.id}
                  type="button"
                  onClick={() => {
                    if (isPast) setCurrentStep(step.id);
                  }}
                  disabled={!isPast}
                  className={`text-left p-2.5 rounded-xl border transition-all duration-200 relative ${
                    isCurrent
                      ? 'bg-gradient-to-r from-amber-500/15 to-amber-600/5 border-amber-400/50 shadow-[0_0_15px_rgba(251,191,36,0.15)] text-white'
                      : isPast
                      ? 'bg-white/[0.02] border-white/[0.1] text-stone-300 hover:border-amber-400/30 hover:bg-white/[0.04] cursor-pointer'
                      : 'bg-transparent border-white/[0.03] text-stone-600 cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center justify-between mb-1">
                    <span className={`text-[10px] font-mono uppercase tracking-wider font-semibold ${
                      isCurrent ? 'text-amber-400' : isPast ? 'text-stone-400' : 'text-stone-600'
                    }`}>
                      {step.short}
                    </span>
                    {isPast ? (
                      <Check className="w-3.5 h-3.5 text-amber-400 stroke-[2.5]" />
                    ) : isCurrent ? (
                      <span className="w-1.5 h-1.5 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24] animate-pulse" />
                    ) : (
                      <span className="w-1.5 h-1.5 rounded-full bg-stone-700" />
                    )}
                  </div>
                  <div className="text-xs font-semibold truncate text-stone-200">
                    {step.desc}
                  </div>
                </button>
              );
            })}
          </div>

          {/* Mobile Sleek Segmented Bar */}
          <div className="md:hidden space-y-3">
            <div className="flex items-center justify-between text-xs font-mono">
              <div className="flex items-center gap-2">
                <span className="text-amber-400 font-bold uppercase tracking-wider">
                  Stage 0{currentStep} / 0{totalSteps}
                </span>
                <span className="text-stone-600">·</span>
                <span className="text-stone-200 font-semibold">
                  {STEPS[currentStep - 1].short}
                </span>
              </div>
              <span className="text-stone-400 font-mono text-[11px]">
                {Math.round((currentStep / totalSteps) * 100)}%
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-amber-400'
                      : step.id === currentStep
                      ? 'bg-amber-400 shadow-[0_0_8px_rgba(251,191,36,0.8)]'
                      : 'bg-white/[0.08]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Wizard Main Card */}
        <div className="bg-[#12151F]/90 backdrop-blur-xl border border-white/[0.08] rounded-3xl p-6 sm:p-10 shadow-2xl relative overflow-hidden">
          
          {isSubmitted ? (
            /* Submission Confirmation State */
            <div className="py-8 text-center space-y-6 animate-in fade-in zoom-in-95 duration-200">
              <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-amber-400 to-amber-600 text-stone-950 flex items-center justify-center mx-auto shadow-[0_0_30px_rgba(251,191,36,0.35)]">
                <CheckCircle2 className="w-8 h-8 stroke-[2]" />
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-[0.2em] text-amber-400 font-semibold">
                  Dossier Clearance Active
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                  Property Dossier {referenceId} Initiated
                </h2>
                <p className="text-xs sm:text-sm text-stone-400 max-w-lg mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold text-stone-200">{ownerName}</span>. Your offering proposal for <span className="font-semibold text-white">{title || 'the designated asset'}</span> in {city} has been routed to our managing partners for title audit and underwriting.
                </p>
              </div>

              {/* Summary snapshot */}
              <div className="p-5 bg-[#171B26] border border-white/[0.08] rounded-2xl text-left max-w-md mx-auto space-y-2.5 text-xs font-mono">
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-stone-400">Asset Class:</span>
                  <span className="font-semibold text-stone-100">{category}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-stone-400">Transaction Intent:</span>
                  <span className="font-semibold text-amber-300">
                    {listingType === 'buy' ? 'Fee Simple Acquisition' : 'Long-Term Leasehold'}
                  </span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-stone-400">Target Valuation:</span>
                  <span className="font-semibold text-stone-100">${price}</span>
                </div>
                <div className="flex justify-between border-b border-white/[0.06] pb-2">
                  <span className="text-stone-400">Certified Area:</span>
                  <span className="font-semibold text-stone-100">{sqft} sqft</span>
                </div>
                <div className="flex justify-between items-center pt-0.5">
                  <span className="text-stone-400">Audit Status:</span>
                  <span className="text-emerald-400 font-sans font-semibold inline-flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
                    Scheduled for Due Diligence Review
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/properties"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-md active:scale-95 text-center"
                >
                  Explore Current Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white/[0.05] hover:bg-white/[0.1] text-stone-200 border border-white/[0.1] text-xs font-semibold transition-all cursor-pointer"
                >
                  Submit Another Property Dossier
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <form onSubmit={handleFinalSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                {/* STEP 1: Property Identification & Asset Class (Ultra-Premium Redesign) */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    {/* Step Title & Institutional Guidance */}
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <Sparkles className="w-3.5 h-3.5" />
                        <span>Stage 01 · Property Identification</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural tracking-tight">
                        Property Identification & Asset Class
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1.5 max-w-2xl leading-relaxed">
                        Establish the legal property designation, transaction conveyance structure, and institutional taxonomy for public syndication and private family office advisory.
                      </p>
                    </div>

                    {/* Transaction Intent: Modern Tactile Selector Cards */}
                    <div>
                      <div className="flex items-center justify-between mb-2.5">
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium">
                          Transaction Conveyance Structure *
                        </label>
                        <span className="text-[11px] text-stone-500 font-mono">
                          Direct Title vs. Leasehold
                        </span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {/* Option 1: Fee Simple Acquisition */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setListingType('buy')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setListingType('buy');
                          }}
                          className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
                            listingType === 'buy'
                              ? 'bg-[#181C29] border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.12)] ring-1 ring-amber-400/30'
                              : 'bg-[#141722]/60 border-white/[0.07] hover:border-white/[0.15] hover:bg-[#141722]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              listingType === 'buy'
                                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                                : 'bg-white/[0.05] text-stone-400 border border-white/[0.08]'
                            }`}>
                              <Landmark className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold border ${
                              listingType === 'buy'
                                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                                : 'bg-white/[0.04] text-stone-500 border-white/[0.06]'
                            }`}>
                              For Sale · Fee Simple
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                                Fee Simple Acquisition
                              </h3>
                              {listingType === 'buy' && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
                              )}
                            </div>
                            <p className="text-xs text-stone-400 mt-1 leading-normal">
                              Outright freehold divestment, owner-occupied conveyance, or institutional equity recapitalization.
                            </p>
                          </div>
                        </div>

                        {/* Option 2: Commercial Tenancy */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setListingType('rent')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setListingType('rent');
                          }}
                          className={`relative p-5 rounded-2xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
                            listingType === 'rent'
                              ? 'bg-[#181C29] border-amber-400/60 shadow-[0_0_25px_rgba(251,191,36,0.12)] ring-1 ring-amber-400/30'
                              : 'bg-[#141722]/60 border-white/[0.07] hover:border-white/[0.15] hover:bg-[#141722]'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-3">
                            <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                              listingType === 'rent'
                                ? 'bg-amber-400/15 text-amber-400 border border-amber-400/30'
                                : 'bg-white/[0.05] text-stone-400 border border-white/[0.08]'
                            }`}>
                              <Building2 className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            <span className={`text-[10px] font-mono uppercase tracking-wider px-2.5 py-0.5 rounded-full font-semibold border ${
                              listingType === 'rent'
                                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30'
                                : 'bg-white/[0.04] text-stone-500 border-white/[0.06]'
                            }`}>
                              For Lease · Tenancy
                            </span>
                          </div>

                          <div>
                            <div className="flex items-center gap-2">
                              <h3 className="text-sm sm:text-base font-bold text-white font-sans">
                                Long-Term Commercial Lease
                              </h3>
                              {listingType === 'rent' && (
                                <span className="w-2 h-2 rounded-full bg-amber-400 shadow-[0_0_6px_#FBBF24]" />
                              )}
                            </div>
                            <p className="text-xs text-stone-400 mt-1 leading-normal">
                              Triple-net (NNN), gross corporate campus lease, or multi-year luxury residential tenancy.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Property Title Input (Floating Luxury Input) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium">
                          Official Property or Campus Designation *
                        </label>
                        <span className="text-[11px] text-stone-500 font-mono">
                          Institutional nomenclature
                        </span>
                      </div>
                      <div className="relative group">
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="e.g., One Financial Plaza or The Highland Estate"
                          className="w-full text-sm sm:text-base font-medium p-4 sm:p-4.5 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 transition-all duration-200 shadow-inner group-hover:border-white/[0.18]"
                        />
                      </div>
                      <p className="text-[11px] text-stone-500 mt-1.5 flex items-center gap-1.5">
                        <Info className="w-3 h-3 text-stone-500" />
                        <span>Used across confidential marketing memorandums and buyer title registries.</span>
                      </p>
                    </div>

                    {/* Asset Class: Bespoke Luxury Dropdown */}
                    <div ref={dropdownRef} className="relative">
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium">
                          Primary Asset Class & Classification *
                        </label>
                        <span className="text-[11px] text-stone-500 font-mono">
                          Underwriting Taxonomy
                        </span>
                      </div>

                      {/* Dropdown Trigger */}
                      <button
                        type="button"
                        onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                        className="w-full flex items-center justify-between p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 hover:bg-[#181C2B] text-left transition-all duration-150 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 cursor-pointer"
                      >
                        <div className="flex items-center gap-3.5 min-w-0">
                          <div className="w-9 h-9 rounded-lg bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center shrink-0">
                            <selectedCategoryOption.icon className="w-4 h-4 stroke-[1.8]" />
                          </div>
                          <div className="truncate">
                            <div className="text-sm font-semibold text-white">
                              {selectedCategoryOption.label}
                            </div>
                            <div className="text-xs text-stone-400 truncate">
                              {selectedCategoryOption.desc}
                            </div>
                          </div>
                        </div>

                        <div className="flex items-center gap-3 shrink-0 ml-3">
                          <span className="hidden sm:inline-block text-[10px] font-mono uppercase tracking-wider text-amber-300 bg-amber-400/10 border border-amber-400/20 px-2.5 py-0.5 rounded-full font-semibold">
                            {selectedCategoryOption.tag}
                          </span>
                          <ChevronDown className={`w-4 h-4 text-stone-400 transition-transform duration-200 ${
                            categoryDropdownOpen ? 'rotate-180 text-white' : ''
                          }`} />
                        </div>
                      </button>

                      {/* Floating Glass Dropdown Menu */}
                      {categoryDropdownOpen && (
                        <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-[#151926] border border-white/[0.12] rounded-2xl shadow-2xl backdrop-blur-2xl p-2 space-y-1 max-h-80 overflow-y-auto animate-in fade-in slide-in-from-top-2 duration-150">
                          {CATEGORY_OPTIONS.map((item) => {
                            const isSelected = item.value === category;
                            const IconComponent = item.icon;

                            return (
                              <button
                                key={item.value}
                                type="button"
                                onClick={() => {
                                  setCategory(item.value);
                                  setCategoryDropdownOpen(false);
                                }}
                                className={`w-full flex items-center justify-between p-3 rounded-xl text-left transition-colors cursor-pointer ${
                                  isSelected
                                    ? 'bg-amber-400/15 text-white border border-amber-400/30'
                                    : 'text-stone-300 hover:bg-white/[0.05] hover:text-white border border-transparent'
                                }`}
                              >
                                <div className="flex items-center gap-3 min-w-0">
                                  <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${
                                    isSelected
                                      ? 'bg-amber-400 text-stone-950 font-bold'
                                      : 'bg-white/[0.06] text-stone-400'
                                  }`}>
                                    <IconComponent className="w-4 h-4 stroke-[1.8]" />
                                  </div>
                                  <div className="truncate">
                                    <div className="text-xs sm:text-sm font-semibold">
                                      {item.label}
                                    </div>
                                    <div className="text-[11px] text-stone-500 truncate">
                                      {item.desc}
                                    </div>
                                  </div>
                                </div>

                                <div className="flex items-center gap-2 shrink-0 ml-2">
                                  <span className="text-[10px] font-mono text-stone-400 uppercase tracking-wider bg-white/[0.04] px-2 py-0.5 rounded">
                                    {item.tag}
                                  </span>
                                  {isSelected && (
                                    <Check className="w-4 h-4 text-amber-400 stroke-[2.5]" />
                                  )}
                                </div>
                              </button>
                            );
                          })}
                        </div>
                      )}
                    </div>

                    {/* Architectural Design Idiom (Luxury Input with Quick Chips) */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium">
                          Architectural Design Idiom & Facade Language
                        </label>
                        <span className="text-[11px] text-stone-500 font-mono">
                          Stylistic Indexing
                        </span>
                      </div>
                      <input
                        type="text"
                        value={architecturalStyle}
                        onChange={(e) => setArchitecturalStyle(e.target.value)}
                        placeholder="e.g. Modernist Steel & Glass, Mid-Century Organic, Brutalist Cast Concrete"
                        className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 transition-all duration-200"
                      />

                      {/* Fast selection chips */}
                      <div className="flex flex-wrap items-center gap-1.5 mt-2.5">
                        <span className="text-[10px] font-mono uppercase tracking-wider text-stone-500 mr-1">
                          Curated Styles:
                        </span>
                        {ARCHITECTURAL_PRESETS.map((preset) => (
                          <button
                            key={preset}
                            type="button"
                            onClick={() => setArchitecturalStyle(preset)}
                            className={`text-[11px] px-2.5 py-1 rounded-lg border transition-colors cursor-pointer ${
                              architecturalStyle === preset
                                ? 'bg-amber-400/15 text-amber-300 border-amber-400/30 font-semibold'
                                : 'bg-white/[0.03] text-stone-400 border-white/[0.06] hover:text-stone-200 hover:border-white/[0.15]'
                            }`}
                          >
                            {preset}
                          </button>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 2: Location */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <MapPin className="w-3.5 h-3.5" />
                        <span>Stage 02 · Geographic Coordinate Audit</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                        Geographic & Municipal Location
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1">
                        Exact street coordinates for title deed cross-referencing, municipal zoning clearance, and GIS boundary mapping.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                        Street Address *
                      </label>
                      <input
                        type="text"
                        required
                        value={address}
                        onChange={(e) => setAddress(e.target.value)}
                        placeholder="e.g. 500 Howard Street, Suite 400"
                        className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 transition-all"
                      />
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Neighborhood / District
                        </label>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="e.g. Financial District"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Metropolitan City *
                        </label>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. San Francisco"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 focus:ring-2 focus:ring-amber-400/15 transition-all"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          State / Postal Code
                        </label>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="CA"
                            className="w-20 text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 uppercase focus:outline-none focus:border-amber-400/60 transition-all font-mono"
                          />
                          <input
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="94105"
                            className="flex-1 text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 transition-all font-mono"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 3: Technical Specs & Measurements */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <Layers className="w-3.5 h-3.5" />
                        <span>Stage 03 · Spatial Measurements</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                        Technical Specs & Spatial Measurements
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1">
                        Certified square footage audits and structural building capacity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Gross Floor Area (sqft) *
                        </label>
                        <input
                          type="number"
                          required
                          value={sqft}
                          onChange={(e) => setSqft(e.target.value)}
                          placeholder="e.g. 18500"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Executive Suites / Rooms
                        </label>
                        <input
                          type="number"
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Restrooms / Facilities
                        </label>
                        <input
                          type="number"
                          value={baths}
                          onChange={(e) => setBaths(e.target.value)}
                          placeholder="e.g. 6"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Dedicated Parking Capacity
                        </label>
                        <input
                          type="number"
                          value={parking}
                          onChange={(e) => setParking(e.target.value)}
                          placeholder="e.g. 24 bays"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Year of Commissioning
                        </label>
                        <input
                          type="number"
                          value={yearBuilt}
                          onChange={(e) => setYearBuilt(e.target.value)}
                          placeholder="e.g. 2024"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* Step 4: Valuation & Offering Terms */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <DollarSign className="w-3.5 h-3.5" />
                        <span>Stage 04 · Financial Capital Parameters</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                        Valuation & Offering Terms
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1">
                        Offering pricing, capital expenditure reserves, and underwriting narrative.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Target Offering Valuation ($ USD) *
                        </label>
                        <input
                          type="number"
                          required
                          value={price}
                          onChange={(e) => setPrice(e.target.value)}
                          placeholder="e.g. 14500000"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Estimated Monthly Opex / CAM ($ USD)
                        </label>
                        <input
                          type="number"
                          value={hoaMonthly}
                          onChange={(e) => setHoaMonthly(e.target.value)}
                          placeholder="e.g. 1850"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                        Executive Offering Tagline
                      </label>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Triple-height glass pavilion with private landscaped courtyard and bay views"
                        className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60"
                      />
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                        Architectural & Engineering Narrative
                      </label>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail materials, MEP certifications, acoustic insulation, structural spans, and LEED credits..."
                        className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 leading-relaxed"
                      />
                    </div>
                  </motion.div>
                )}

                {/* Step 5: Media & Documentation */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <Upload className="w-3.5 h-3.5" />
                        <span>Stage 05 · Visual Assets & Documents</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                        Architectural Photography & Documents
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1">
                        Submit high-resolution assets or commission a Digentic certified architectural media crew.
                      </p>
                    </div>

                    <div>
                      <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                        Primary Key Asset Photograph URL
                      </label>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or cloud asset link"
                        className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                      />
                      <span className="text-[11px] text-stone-500 mt-1.5 block">
                        Leave blank to request an on-site Digentic architectural photography and LiDAR scanning capture.
                      </span>
                    </div>

                    {/* Document upload container */}
                    <div className="border border-dashed border-white/[0.15] rounded-2xl p-8 text-center bg-[#151825]/50 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-amber-400/10 text-amber-400 border border-amber-400/20 flex items-center justify-center mx-auto">
                        <Upload className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-white">
                          Upload Certified Floor Plans & Title Deeds
                        </p>
                        <p className="text-xs text-stone-400 mt-0.5">
                          Supported packages: PDF, BIM/Revit, CAD DWG (Max 100MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => notify('Sample due diligence package attached')}
                        className="px-4 py-2 bg-white/[0.08] hover:bg-white/[0.15] border border-white/[0.15] text-white text-xs font-semibold rounded-xl transition-all cursor-pointer"
                      >
                        Attach Verified PDFs
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* Step 6: Principal Verification */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -8 }}
                    transition={{ duration: 0.28, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="border-b border-white/[0.08] pb-6">
                      <div className="flex items-center gap-2 font-mono text-[11px] text-amber-400 font-medium uppercase tracking-[0.2em] mb-2">
                        <ShieldCheck className="w-3.5 h-3.5" />
                        <span>Stage 06 · Principal Identity Clearance</span>
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                        Principal or Listing Broker Verification
                      </h2>
                      <p className="text-xs sm:text-sm text-stone-400 mt-1">
                        Authorized contact credentials for title escrow, legal NDA signature, and direct client introductions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Principal Legal Representative *
                        </label>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Full Legal Name"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Corporate / Advisory Entity
                        </label>
                        <input
                          type="text"
                          value={ownerEntity}
                          onChange={(e) => setOwnerEntity(e.target.value)}
                          placeholder="e.g. Managing Partner, Family Office Director"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Direct Corporate Email *
                        </label>
                        <input
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="m.sterling@capital-group.com"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                      <div>
                        <label className="block text-xs uppercase tracking-[0.15em] text-stone-300 font-mono font-medium mb-1.5">
                          Secure Telephone Line *
                        </label>
                        <input
                          type="tel"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="+1 (415) 880-9921"
                          className="w-full text-sm font-medium p-4 rounded-xl border border-white/[0.1] bg-[#141724]/90 text-stone-100 placeholder:text-stone-500 focus:outline-none focus:border-amber-400/60 font-mono"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-amber-400/10 border border-amber-400/20 text-xs text-amber-200/90 leading-relaxed">
                      By submitting this listing dossier, you certify that you hold certified legal authority or exclusive advisory rights for the specified property asset. Digentic Realty will initiate municipal title verification prior to syndicate release.
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>

              {/* Wizard Bottom Controls */}
              <div className="pt-6 border-t border-white/[0.08] flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-xl border border-white/[0.1] bg-white/[0.03] hover:bg-white/[0.08] text-stone-300 hover:text-white text-xs font-semibold transition-all cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Stage</span>
                  </button>
                ) : (
                  <div className="text-xs text-stone-500 font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-3.5 h-3.5 text-amber-400" />
                    <span>Encrypted Institutional Portal</span>
                  </div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-7 py-3 rounded-xl bg-gradient-to-r from-amber-400 to-amber-500 hover:from-amber-300 hover:to-amber-400 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(251,191,36,0.25)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer ml-auto"
                  >
                    <span>
                      {currentStep === 1
                        ? 'Continue to Location Details'
                        : currentStep === 2
                        ? 'Continue to Technical Specs'
                        : currentStep === 3
                        ? 'Continue to Valuation Terms'
                        : currentStep === 4
                        ? 'Continue to Media & Assets'
                        : 'Continue to Principal Review'}
                    </span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-xl bg-gradient-to-r from-emerald-400 to-emerald-500 hover:from-emerald-300 hover:to-emerald-400 text-stone-950 font-bold text-xs tracking-wide transition-all shadow-[0_0_20px_rgba(52,211,153,0.3)] hover:scale-[1.01] active:scale-[0.99] cursor-pointer ml-auto"
                  >
                    <span>Authorize & Initiate Dossier</span>
                    <CheckCircle2 className="w-4 h-4 stroke-[2.5]" />
                  </button>
                )}
              </div>
            </form>
          )}

        </div>
      </div>
    </div>
  );
};
