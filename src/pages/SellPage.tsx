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
  ShieldCheck,
  Check,
  Landmark,
  Layers,
  Sparkles,
  Briefcase,
  Compass,
  ChevronDown,
  Info,
  Palette,
  FileCheck
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
    label: 'Office & Commercial Headquarters',
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
  'Contemporary Modernist',
  'Modernist Steel & Glass',
  'Organic Mid-Century',
  'Brutalist Cast Concrete',
  'Neo-Classical Palladian',
  'Biophilic Contemporary',
  'Art Deco Revived',
];

const STEPS = [
  { id: 1, label: '01 Classification', short: 'Classification', desc: 'Assets & Type' },
  { id: 2, label: '02 Location', short: 'Location', desc: 'Geography & Market' },
  { id: 3, label: '03 Specifications', short: 'Specs', desc: 'Size & Features' },
  { id: 4, label: '04 Valuation', short: 'Valuation', desc: 'Financials & ROI' },
  { id: 5, label: '05 Media', short: 'Media', desc: 'Photos & Documents' },
  { id: 6, label: '06 Verification', short: 'Verification', desc: 'Review & Submit' },
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
  const [archDropdownOpen, setArchDropdownOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);
  const archDropdownRef = useRef<HTMLDivElement>(null);

  // Close custom dropdowns on click outside
  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setCategoryDropdownOpen(false);
      }
      if (archDropdownRef.current && !archDropdownRef.current.contains(e.target as Node)) {
        setArchDropdownOpen(false);
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
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 180, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `EST-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);
    setIsSubmitted(true);
    notify(`Listing proposal registered under dossier ${generatedRef}`);
  };

  const selectedCategoryOption = CATEGORY_OPTIONS.find((c) => c.value === category) || CATEGORY_OPTIONS[0];

  return (
    <div className="min-h-screen bg-[#F7F6F1] text-[#111111] pb-28 relative font-sans selection:bg-[#4C5544] selection:text-[#F7F6F1] overflow-x-hidden">
      
      {/* Architectural Vignettes on the Outer Edges (matching reference screenshot) */}
      <div 
        className="hidden xl:block fixed top-0 left-0 w-[380px] 2xl:w-[440px] h-full pointer-events-none z-0 bg-cover bg-left-top opacity-35 mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1200&q=80")',
          maskImage: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to right, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
        }}
      />
      <div 
        className="hidden xl:block fixed top-0 right-0 w-[380px] 2xl:w-[440px] h-full pointer-events-none z-0 bg-cover bg-right-top opacity-30 mix-blend-multiply"
        style={{
          backgroundImage: 'url("https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80")',
          maskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)',
          WebkitMaskImage: 'linear-gradient(to left, rgba(0,0,0,0.85) 0%, rgba(0,0,0,0.3) 60%, transparent 100%)'
        }}
      />

      {/* Subtle Corner Editorial Micro-Labels (matching reference screenshot) */}
      <div className="hidden 2xl:flex fixed bottom-8 left-8 z-10 flex items-start gap-2.5 text-[10px] font-mono tracking-[0.22em] text-[#8C8B85] uppercase select-none pointer-events-none">
        <span className="w-0.5 h-6 bg-[#DCDAD3] shrink-0" />
        <div className="leading-tight">
          <span>INSTITUTIONAL</span><br />
          <span>REAL ESTATE SOLUTIONS</span>
        </div>
      </div>

      <div className="hidden 2xl:flex fixed bottom-8 right-8 z-10 text-[10px] font-mono tracking-[0.22em] text-[#8C8B85] uppercase text-right select-none pointer-events-none leading-tight">
        <span>CONNECTING</span><br />
        <span>PROPERTIES WITH</span><br />
        <span>CAPITAL</span>
      </div>

      {/* Main Editorial Header Section */}
      <section className="relative pt-12 sm:pt-16 pb-8 sm:pb-10 w-full z-10">
        <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-8">
          
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-2">
            <div className="space-y-3 max-w-2xl">
              {/* Eyebrow Label */}
              <div className="text-[11px] font-mono tracking-[0.22em] text-[#5F625F] uppercase font-medium">
                ESTRA REAL ESTATE MARKETPLACE
              </div>

              {/* Main Heading */}
              <h1 className="text-3xl sm:text-4xl lg:text-[46px] font-bold tracking-tight text-[#111111] leading-[1.08]">
                Institutional Intake &amp;<br />
                Asset Syndication
              </h1>

              {/* Supporting Text */}
              <p className="text-xs sm:text-sm text-[#5F625F] font-normal leading-relaxed max-w-xl pt-1">
                Market your commercial headquarters, prime residential estate, or strategic development asset directly to accredited institutional funds, family offices, and sovereign capital.
              </p>
            </div>

            {/* Right Side Editorial Callout (matching reference screenshot) */}
            <div className="hidden md:flex items-start gap-3 pl-8 self-end pb-1 border-l-2 border-[#D97706]/90 shrink-0">
              <div className="text-[10px] sm:text-[11px] font-mono tracking-[0.16em] text-[#5F625F] uppercase leading-relaxed font-medium">
                <span>PREMIUM ASSETS.</span><br />
                <span>INSTITUTIONAL CAPITAL.</span><br />
                <span>LASTING VALUE.</span>
              </div>
            </div>
          </div>

        </div>
      </section>

      {/* Main Form & Stepper Shell */}
      <div className="w-full max-w-[1180px] mx-auto px-4 sm:px-8 relative z-10 space-y-6">
        
        {/* Sleek Horizontal Stepper (matching reference screenshot) */}
        <div className="bg-white border border-[#DCDAD3] rounded-xl sm:rounded-2xl p-4 sm:p-5 shadow-[0_1px_3px_rgba(0,0,0,0.02)]">
          {/* Desktop & Tablet 6-Step Layout */}
          <div className="hidden md:grid grid-cols-6 items-center divide-x divide-[#E5E3DC]">
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
                  className={`px-3 py-1.5 text-left transition-all duration-200 relative ${
                    isPast ? 'cursor-pointer hover:opacity-90' : isCurrent ? 'cursor-default' : 'cursor-not-allowed opacity-60'
                  }`}
                >
                  <div className="flex items-center gap-3">
                    {/* Circular Step Number */}
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-mono font-bold shrink-0 transition-colors ${
                      isCurrent
                        ? 'border border-[#D97706] text-[#B45309] bg-[#FEF3C7]/40 ring-2 ring-[#D97706]/15'
                        : isPast
                        ? 'border border-[#D97706] text-white bg-[#D97706]'
                        : 'border border-[#DCDAD3] text-[#78716C] bg-white'
                    }`}>
                      {isPast ? <Check className="w-3.5 h-3.5 stroke-[2.5]" /> : step.id}
                    </div>

                    <div className="min-w-0">
                      <div className={`text-xs font-bold tracking-tight truncate ${
                        isCurrent ? 'text-[#B45309]' : isPast ? 'text-[#111111]' : 'text-[#78716C]'
                      }`}>
                        {step.short}
                      </div>
                      <div className="text-[10px] text-[#78716C] truncate font-normal">
                        {step.desc}
                      </div>
                    </div>
                  </div>

                  {/* Active bottom orange indicator line */}
                  {isCurrent && (
                    <div className="absolute -bottom-4 left-2 right-2 h-0.5 bg-[#D97706] rounded-full" />
                  )}
                </button>
              );
            })}
          </div>

          {/* Mobile Stepper Layout */}
          <div className="md:hidden space-y-2.5">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-[#D97706] text-white text-[11px] font-mono font-bold flex items-center justify-center">
                  {currentStep}
                </span>
                <span className="font-bold text-[#111111]">
                  {STEPS[currentStep - 1].short}
                </span>
                <span className="text-[#78716C] text-[11px]">
                  ({STEPS[currentStep - 1].desc})
                </span>
              </div>
              <span className="text-xs font-mono text-[#D97706] font-semibold">
                Step {currentStep} of {totalSteps}
              </span>
            </div>

            <div className="grid grid-cols-6 gap-1.5 pt-1">
              {STEPS.map((step) => (
                <div
                  key={step.id}
                  className={`h-1.5 rounded-full transition-all duration-300 ${
                    step.id < currentStep
                      ? 'bg-[#D97706]'
                      : step.id === currentStep
                      ? 'bg-[#F59E0B]'
                      : 'bg-[#E5E3DC]'
                  }`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Form Container Card (matching reference screenshot) */}
        <div className="bg-white border border-[#DCDAD3] rounded-2xl p-6 sm:p-10 lg:p-12 shadow-[0_4px_24px_rgba(0,0,0,0.02)]">
          {isSubmitted ? (
            /* Confirmation Receipt State */
            <div className="py-8 text-center space-y-6 max-w-xl mx-auto animate-in fade-in duration-300">
              <div className="w-16 h-16 rounded-full bg-[#FEF3C7] text-[#92400E] border border-amber-300 flex items-center justify-center mx-auto shadow-sm">
                <FileCheck className="w-8 h-8 stroke-[1.8]" />
              </div>

              <div className="space-y-2">
                <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#FEF3C7] border border-amber-300 text-xs font-mono text-[#92400E] font-bold uppercase tracking-wider">
                  <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                  <span>Dossier Registered: {referenceId}</span>
                </div>
                <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                  Intake Dossier Transmitted
                </h2>
                <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed">
                  Your asset submission for <span className="font-semibold text-[#111111]">{title || 'the designated property'}</span> has been committed to the ESTRA Underwriting Ledger.
                </p>
              </div>

              <div className="bg-[#FAF9F5] border border-[#DCDAD3] rounded-xl p-5 text-left text-xs space-y-3 font-mono">
                <div className="flex justify-between items-center pb-2 border-b border-[#DCDAD3]">
                  <span className="text-[#5F625F]">Asset Classification:</span>
                  <span className="text-[#111111] font-semibold">{selectedCategoryOption.label}</span>
                </div>
                <div className="flex justify-between items-center pb-2 border-b border-[#DCDAD3]">
                  <span className="text-[#5F625F]">Conveyance Intent:</span>
                  <span className="text-[#111111] font-semibold">
                    {listingType === 'buy' ? 'Fee Simple Acquisition' : 'Long-Term Commercial Lease'}
                  </span>
                </div>
                <div className="flex justify-between items-center">
                  <span className="text-[#5F625F]">Audit Status:</span>
                  <span className="text-[#B45309] font-sans font-semibold inline-flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                    Scheduled for Due Diligence Review
                  </span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/properties"
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-black hover:bg-neutral-900 text-white font-medium text-xs tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 text-center"
                >
                  Explore Current Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-7 py-3 rounded-xl bg-white hover:bg-slate-50 text-slate-700 border border-[#DCDAD3] text-xs font-semibold transition-all cursor-pointer"
                >
                  Submit Another Property Dossier
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <form onSubmit={handleFinalSubmit} className="space-y-8">
              <AnimatePresence mode="wait">
                
                {/* STEP 1: Property Identification & Asset Class (matching reference screenshot) */}
                {currentStep === 1 && (
                  <motion.div
                    key="step-1"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-8"
                  >
                    {/* Step Title & Guidance */}
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        ASSET IDENTIFICATION
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Property Identification &amp; Asset Class
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Initiate the legal, property, and asset class details for your property to enable the transaction and generate timely offers, advisors, and syndication interest.
                      </p>
                    </div>

                    {/* Section 1: Transaction Conveyance Structure */}
                    <div className="pt-2">
                      <div className="flex items-center justify-between mb-2.5">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            TRANSACTION CONVEYANCE STRUCTURE
                          </label>
                        </div>
                        <span className="text-[11px] text-[#78716C] font-normal">
                          Select the transaction structure
                        </span>
                      </div>

                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Option 1: Fee Simple Acquisition */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setListingType('buy')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setListingType('buy');
                          }}
                          className={`relative p-5 sm:p-6 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
                            listingType === 'buy'
                              ? 'bg-[#FFFDF5] border-[#D97706] shadow-xs ring-1 ring-[#D97706]/40'
                              : 'bg-white border-[#DCDAD3] hover:border-[#111111]/40 hover:bg-[#FAF9F5] shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              listingType === 'buy'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300'
                                : 'bg-[#F1F5F9] text-slate-600 border border-[#DCDAD3]'
                            }`}>
                              <Landmark className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            {/* Radio indicator */}
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                              listingType === 'buy'
                                ? 'border-2 border-[#D97706] bg-white'
                                : 'border border-[#CBD5E1] bg-white'
                            }`}>
                              {listingType === 'buy' && (
                                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-[#111111] font-sans">
                              Fee Simple Acquisition
                            </h3>
                            <p className="text-xs text-[#5F625F] mt-1 leading-relaxed">
                              Direct purchase of the property, including land and improvements, with full ownership rights.
                            </p>
                          </div>
                        </div>

                        {/* Option 2: Commercial Lease */}
                        <div
                          role="button"
                          tabIndex={0}
                          onClick={() => setListingType('rent')}
                          onKeyDown={(e) => {
                            if (e.key === 'Enter' || e.key === ' ') setListingType('rent');
                          }}
                          className={`relative p-5 sm:p-6 rounded-xl border transition-all duration-200 cursor-pointer select-none text-left flex flex-col justify-between ${
                            listingType === 'rent'
                              ? 'bg-[#FFFDF5] border-[#D97706] shadow-xs ring-1 ring-[#D97706]/40'
                              : 'bg-white border-[#DCDAD3] hover:border-[#111111]/40 hover:bg-[#FAF9F5] shadow-xs'
                          }`}
                        >
                          <div className="flex items-start justify-between gap-3 mb-4">
                            <div className={`w-10 h-10 rounded-lg flex items-center justify-center transition-colors ${
                              listingType === 'rent'
                                ? 'bg-[#FEF3C7] text-[#92400E] border border-amber-300'
                                : 'bg-[#F1F5F9] text-slate-600 border border-[#DCDAD3]'
                            }`}>
                              <Layers className="w-5 h-5 stroke-[1.8]" />
                            </div>

                            {/* Radio indicator */}
                            <div className={`w-4 h-4 rounded-full flex items-center justify-center transition-colors ${
                              listingType === 'rent'
                                ? 'border-2 border-[#D97706] bg-white'
                                : 'border border-[#CBD5E1] bg-white'
                            }`}>
                              {listingType === 'rent' && (
                                <span className="w-2 h-2 rounded-full bg-[#D97706]" />
                              )}
                            </div>
                          </div>

                          <div>
                            <h3 className="text-base font-bold text-[#111111] font-sans">
                              Long-Term Commercial Lease
                            </h3>
                            <p className="text-xs text-[#5F625F] mt-1 leading-relaxed">
                              Long-term lease arrangement for commercial use, with defined terms and conditions.
                            </p>
                          </div>
                        </div>
                      </div>
                    </div>

                    {/* Section 2: Official Property or Campus Designation */}
                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            OFFICIAL PROPERTY OR CAMPUS DESIGNATION
                          </label>
                        </div>
                        <span className="text-[11px] text-[#78716C] font-normal">
                          Select the designation type
                        </span>
                      </div>
                      
                      <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3.5 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all shadow-2xs">
                        <Building2 className="w-5 h-5 text-[#5F625F] mr-3 shrink-0 stroke-[1.7]" />
                        <input
                          type="text"
                          required
                          value={title}
                          onChange={(e) => setTitle(e.target.value)}
                          placeholder="Gov, One Financial Plaza or The Highland Estate"
                          className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111111] placeholder:text-slate-400 focus:outline-none"
                        />
                        <ChevronDown className="w-4 h-4 text-slate-400 shrink-0 ml-2 pointer-events-none" />
                      </div>
                      
                      <p className="text-[11px] text-[#78716C] mt-1.5 font-normal">
                        Official property or campus designation for institutional and strategic assets.
                      </p>
                    </div>

                    {/* Section 3: Two Column Row: Primary Asset Class + Architectural Style */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-1">
                      
                      {/* Column 1: Primary Asset Class & Classification */}
                      <div ref={dropdownRef} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                            <label className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                              PRIMARY ASSET CLASS &amp; CLASSIFICATION
                            </label>
                          </div>
                          <span className="text-[11px] text-[#78716C] font-normal">
                            Choose the primary asset class
                          </span>
                        </div>

                        {/* Dropdown Trigger */}
                        <button
                          type="button"
                          onClick={() => setCategoryDropdownOpen(!categoryDropdownOpen)}
                          className="w-full flex items-center justify-between bg-[#F8FAFC] hover:bg-white border border-[#CBD5E1] rounded-xl px-4 py-3.5 text-left transition-all duration-150 focus:outline-none focus:border-[#D97706] focus:ring-2 focus:ring-[#D97706]/20 cursor-pointer shadow-2xs"
                        >
                          <div className="flex items-center gap-3 min-w-0">
                            <selectedCategoryOption.icon className="w-5 h-5 text-[#92400E] shrink-0 stroke-[1.8]" />
                            <span className="text-sm font-semibold text-[#111111] truncate">
                              {selectedCategoryOption.label}
                            </span>
                          </div>

                          <ChevronDown className={`w-4 h-4 text-slate-500 shrink-0 transition-transform duration-200 ${
                            categoryDropdownOpen ? 'rotate-180 text-slate-900' : ''
                          }`} />
                        </button>

                        <p className="text-[11px] text-[#78716C] mt-1.5 font-normal">
                          Select the main asset class and classification for the property.
                        </p>

                        {/* Floating Dropdown Menu */}
                        {categoryDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-[#DCDAD3] rounded-xl shadow-xl p-2 space-y-1 max-h-80 overflow-y-auto animate-in fade-in duration-150">
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
                                  className={`w-full flex items-center justify-between p-3 rounded-lg text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FFFDF5] text-[#111111] border border-[#D97706]/50'
                                      : 'text-slate-700 hover:bg-[#FAF9F5] hover:text-slate-950 border border-transparent'
                                  }`}
                                >
                                  <div className="flex items-center gap-3 min-w-0">
                                    <div className={`w-7 h-7 rounded-md flex items-center justify-center shrink-0 ${
                                      isSelected
                                        ? 'bg-[#FEF3C7] text-[#92400E]'
                                        : 'bg-[#F1F5F9] text-slate-600'
                                    }`}>
                                      <IconComponent className="w-4 h-4 stroke-[1.8]" />
                                    </div>
                                    <div className="truncate">
                                      <div className="text-xs sm:text-sm font-semibold text-[#111111]">
                                        {item.label}
                                      </div>
                                      <div className="text-[11px] text-[#78716C] truncate">
                                        {item.desc}
                                      </div>
                                    </div>
                                  </div>

                                  <div className="flex items-center gap-2 shrink-0 ml-2">
                                    <span className="text-[10px] font-mono text-slate-600 uppercase tracking-wider bg-slate-100 px-2 py-0.5 rounded border border-[#E2E8F0]">
                                      {item.tag}
                                    </span>
                                    {isSelected && (
                                      <Check className="w-4 h-4 text-[#D97706] stroke-[2.5]" />
                                    )}
                                  </div>
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                      {/* Column 2: Architectural Design Idiom & Facade Language */}
                      <div ref={archDropdownRef} className="relative">
                        <div className="flex items-center justify-between mb-2">
                          <div className="flex items-center gap-2">
                            <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                            <label className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                              ARCHITECTURAL DESIGN IDIOM &amp; FACADE LANGUAGE
                            </label>
                          </div>
                          <span className="text-[11px] text-[#78716C] font-normal">
                            Select the design idiom
                          </span>
                        </div>

                        <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3.5 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all shadow-2xs">
                          <Palette className="w-5 h-5 text-[#92400E] mr-3 shrink-0 stroke-[1.8]" />
                          <input
                            type="text"
                            value={architecturalStyle}
                            onChange={(e) => setArchitecturalStyle(e.target.value)}
                            onFocus={() => setArchDropdownOpen(true)}
                            placeholder="Contemporary Modernist"
                            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111111] placeholder:text-slate-400 focus:outline-none"
                          />
                          <button
                            type="button"
                            onClick={() => setArchDropdownOpen(!archDropdownOpen)}
                            className="text-slate-500 hover:text-slate-800 p-0.5 ml-2 cursor-pointer"
                          >
                            <ChevronDown className={`w-4 h-4 transition-transform duration-200 ${archDropdownOpen ? 'rotate-180' : ''}`} />
                          </button>
                        </div>

                        <p className="text-[11px] text-[#78716C] mt-1.5 font-normal">
                          Choose the architectural style and facade language.
                        </p>

                        {/* Presets dropdown */}
                        {archDropdownOpen && (
                          <div className="absolute top-full left-0 right-0 mt-2 z-50 bg-white border border-[#DCDAD3] rounded-xl shadow-xl p-2 space-y-1 max-h-60 overflow-y-auto animate-in fade-in duration-150">
                            {ARCHITECTURAL_PRESETS.map((preset) => {
                              const isSelected = architecturalStyle === preset;
                              return (
                                <button
                                  key={preset}
                                  type="button"
                                  onClick={() => {
                                    setArchitecturalStyle(preset);
                                    setArchDropdownOpen(false);
                                  }}
                                  className={`w-full flex items-center justify-between px-3 py-2 text-xs sm:text-sm rounded-lg text-left transition-colors cursor-pointer ${
                                    isSelected
                                      ? 'bg-[#FFFDF5] text-[#111111] font-semibold border border-[#D97706]/50'
                                      : 'text-slate-700 hover:bg-[#FAF9F5] hover:text-slate-950 border border-transparent'
                                  }`}
                                >
                                  <span>{preset}</span>
                                  {isSelected && <Check className="w-4 h-4 text-[#D97706] stroke-[2.5]" />}
                                </button>
                              );
                            })}
                          </div>
                        )}
                      </div>

                    </div>
                  </motion.div>
                )}

                {/* STEP 2: Geographic & Municipal Location */}
                {currentStep === 2 && (
                  <motion.div
                    key="step-2"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        GEOGRAPHIC AUDIT
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Geographic &amp; Municipal Location
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Exact street coordinates for title deed cross-referencing, municipal zoning clearance, and GIS boundary mapping.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] sm:text-xs uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            STREET ADDRESS *
                          </label>
                        </div>
                        <span className="text-[11px] text-[#78716C]">Physical parcel location</span>
                      </div>
                      
                      <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3.5 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all shadow-2xs">
                        <MapPin className="w-5 h-5 text-[#5F625F] mr-3 shrink-0 stroke-[1.7]" />
                        <input
                          type="text"
                          required
                          value={address}
                          onChange={(e) => setAddress(e.target.value)}
                          placeholder="e.g. 500 Howard Street, Suite 400"
                          className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111111] placeholder:text-slate-400 focus:outline-none"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            NEIGHBORHOOD / DISTRICT
                          </label>
                        </div>
                        <input
                          type="text"
                          value={neighborhood}
                          onChange={(e) => setNeighborhood(e.target.value)}
                          placeholder="e.g. Financial District"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white focus:ring-2 focus:ring-[#D97706]/20 transition-all shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            METROPOLITAN CITY *
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={city}
                          onChange={(e) => setCity(e.target.value)}
                          placeholder="e.g. San Francisco"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white focus:ring-2 focus:ring-[#D97706]/20 transition-all shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            STATE / POSTAL CODE
                          </label>
                        </div>
                        <div className="flex gap-2">
                          <input
                            type="text"
                            value={state}
                            onChange={(e) => setState(e.target.value)}
                            placeholder="CA"
                            className="w-20 text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] uppercase focus:outline-none focus:border-[#D97706] focus:bg-white transition-all font-mono shadow-2xs text-center"
                          />
                          <input
                            type="text"
                            value={zip}
                            onChange={(e) => setZip(e.target.value)}
                            placeholder="94105"
                            className="flex-1 text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white transition-all font-mono shadow-2xs"
                          />
                        </div>
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 3: Technical Specs & Spatial Measurements */}
                {currentStep === 3 && (
                  <motion.div
                    key="step-3"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        SPATIAL AUDIT
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Technical Specs &amp; Spatial Measurements
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Certified square footage audits and structural building capacity.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            GROSS FLOOR AREA (SQFT) *
                          </label>
                        </div>
                        <input
                          type="number"
                          required
                          value={sqft}
                          onChange={(e) => setSqft(e.target.value)}
                          placeholder="e.g. 18500"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            EXECUTIVE SUITES / ROOMS
                          </label>
                        </div>
                        <input
                          type="number"
                          value={beds}
                          onChange={(e) => setBeds(e.target.value)}
                          placeholder="e.g. 4"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            RESTROOMS / FACILITIES
                          </label>
                        </div>
                        <input
                          type="number"
                          value={baths}
                          onChange={(e) => setBaths(e.target.value)}
                          placeholder="e.g. 6"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            DEDICATED PARKING CAPACITY
                          </label>
                        </div>
                        <input
                          type="number"
                          value={parking}
                          onChange={(e) => setParking(e.target.value)}
                          placeholder="e.g. 24 bays"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            YEAR OF COMMISSIONING
                          </label>
                        </div>
                        <input
                          type="number"
                          value={yearBuilt}
                          onChange={(e) => setYearBuilt(e.target.value)}
                          placeholder="e.g. 2024"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>
                    </div>
                  </motion.div>
                )}

                {/* STEP 4: Valuation & Offering Terms */}
                {currentStep === 4 && (
                  <motion.div
                    key="step-4"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        FINANCIAL AUDIT
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Valuation &amp; Offering Terms
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Offering pricing, capital expenditure reserves, and underwriting narrative.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            TARGET OFFERING VALUATION ($ USD) *
                          </label>
                        </div>
                        <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3.5 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all shadow-2xs">
                          <DollarSign className="w-4 h-4 text-[#5F625F] mr-2 shrink-0 stroke-[2]" />
                          <input
                            type="number"
                            required
                            value={price}
                            onChange={(e) => setPrice(e.target.value)}
                            placeholder="e.g. 14500000"
                            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111111] placeholder:text-slate-400 focus:outline-none font-mono"
                          />
                        </div>
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            ESTIMATED MONTHLY OPEX / CAM ($ USD)
                          </label>
                        </div>
                        <div className="relative flex items-center bg-[#F8FAFC] border border-[#CBD5E1] rounded-xl px-4 py-3.5 focus-within:border-[#D97706] focus-within:bg-white focus-within:ring-2 focus-within:ring-[#D97706]/20 transition-all shadow-2xs">
                          <DollarSign className="w-4 h-4 text-[#5F625F] mr-2 shrink-0 stroke-[2]" />
                          <input
                            type="number"
                            value={hoaMonthly}
                            onChange={(e) => setHoaMonthly(e.target.value)}
                            placeholder="e.g. 1850"
                            className="w-full bg-transparent text-sm sm:text-base font-medium text-[#111111] placeholder:text-slate-400 focus:outline-none font-mono"
                          />
                        </div>
                      </div>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                        <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                          EXECUTIVE OFFERING TAGLINE
                        </label>
                      </div>
                      <input
                        type="text"
                        value={tagline}
                        onChange={(e) => setTagline(e.target.value)}
                        placeholder="e.g. Triple-height glass pavilion with private landscaped courtyard and bay views"
                        className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white shadow-2xs"
                      />
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                        <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                          ARCHITECTURAL &amp; ENGINEERING NARRATIVE
                        </label>
                      </div>
                      <textarea
                        rows={4}
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="Detail materials, MEP certifications, acoustic insulation, structural spans, and LEED credits..."
                        className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white leading-relaxed shadow-2xs resize-none"
                      />
                    </div>
                  </motion.div>
                )}

                {/* STEP 5: Visual Assets & Documents */}
                {currentStep === 5 && (
                  <motion.div
                    key="step-5"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        VISUAL ASSETS
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Architectural Photography &amp; Documents
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Submit high-resolution assets or commission an ESTRA certified architectural media crew.
                      </p>
                    </div>

                    <div>
                      <div className="flex items-center gap-2 mb-2">
                        <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                        <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                          PRIMARY KEY ASSET PHOTOGRAPH URL
                        </label>
                      </div>
                      <input
                        type="url"
                        value={imageUrl}
                        onChange={(e) => setImageUrl(e.target.value)}
                        placeholder="https://images.unsplash.com/... or cloud asset link"
                        className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                      />
                      <span className="text-[11px] text-[#78716C] mt-1.5 block">
                        Leave blank to request an on-site ESTRA architectural photography and LiDAR scanning capture.
                      </span>
                    </div>

                    {/* Document upload box */}
                    <div className="border border-dashed border-[#CBD5E1] rounded-xl p-8 text-center bg-[#FAF9F5] hover:bg-[#F5F4EE] transition-colors space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-[#FEF3C7] text-[#92400E] border border-amber-300 flex items-center justify-center mx-auto shadow-2xs">
                        <Upload className="w-6 h-6 stroke-[1.8]" />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-[#111111]">
                          Upload Certified Floor Plans &amp; Title Deeds
                        </p>
                        <p className="text-xs text-[#78716C] mt-0.5">
                          Supported packages: PDF, BIM/Revit, CAD DWG (Max 100MB)
                        </p>
                      </div>
                      <button
                        type="button"
                        onClick={() => notify('Sample due diligence package attached')}
                        className="px-4 py-2 bg-white hover:bg-slate-50 border border-[#CBD5E1] text-[#111111] text-xs font-semibold rounded-lg shadow-2xs transition-all cursor-pointer"
                      >
                        Attach Verified PDFs
                      </button>
                    </div>
                  </motion.div>
                )}

                {/* STEP 6: Principal Identity Clearance */}
                {currentStep === 6 && (
                  <motion.div
                    key="step-6"
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -6 }}
                    transition={{ duration: 0.22, ease: [0.16, 1, 0.3, 1] }}
                    className="space-y-6"
                  >
                    <div className="space-y-1.5 pb-2">
                      <div className="text-[11px] font-mono tracking-[0.2em] text-[#B45309] uppercase font-bold">
                        PRINCIPAL CLEARANCE
                      </div>
                      <h2 className="text-2xl sm:text-3xl font-bold text-[#111111] font-sans tracking-tight">
                        Principal or Listing Broker Verification
                      </h2>
                      <p className="text-xs sm:text-sm text-[#5F625F] leading-relaxed max-w-3xl">
                        Authorized contact credentials for title escrow, legal NDA signature, and direct client introductions.
                      </p>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            PRINCIPAL LEGAL REPRESENTATIVE *
                          </label>
                        </div>
                        <input
                          type="text"
                          required
                          value={ownerName}
                          onChange={(e) => setOwnerName(e.target.value)}
                          placeholder="Full Legal Name"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            CORPORATE / ADVISORY ENTITY
                          </label>
                        </div>
                        <input
                          type="text"
                          value={ownerEntity}
                          onChange={(e) => setOwnerEntity(e.target.value)}
                          placeholder="e.g. Managing Partner, Family Office Director"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            DIRECT CORPORATE EMAIL *
                          </label>
                        </div>
                        <input
                          type="email"
                          required
                          value={ownerEmail}
                          onChange={(e) => setOwnerEmail(e.target.value)}
                          placeholder="m.sterling@capital-group.com"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>

                      <div>
                        <div className="flex items-center gap-2 mb-2">
                          <span className="w-1.5 h-1.5 rounded-full bg-[#D97706] shrink-0" />
                          <label className="text-[11px] uppercase tracking-[0.14em] text-[#111111] font-mono font-bold">
                            SECURE TELEPHONE LINE *
                          </label>
                        </div>
                        <input
                          type="tel"
                          required
                          value={ownerPhone}
                          onChange={(e) => setOwnerPhone(e.target.value)}
                          placeholder="+1 (415) 880-9921"
                          className="w-full text-sm font-medium p-3.5 rounded-xl border border-[#CBD5E1] bg-[#F8FAFC] text-[#111111] placeholder:text-slate-400 focus:outline-none focus:border-[#D97706] focus:bg-white font-mono shadow-2xs"
                        />
                      </div>
                    </div>

                    <div className="p-4 rounded-xl bg-[#FEF3C7]/40 border border-amber-300 text-xs text-[#92400E] leading-relaxed font-medium">
                      By submitting this listing dossier, you certify that you hold certified legal authority or exclusive advisory rights for the specified property asset. ESTRA Realty will initiate municipal title verification prior to syndicate release.
                    </div>
                  </motion.div>
                )}

              </AnimatePresence>

              {/* Wizard Bottom Controls (matching reference screenshot) */}
              <div className="pt-6 border-t border-[#DCDAD3] flex items-center justify-between gap-4">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="inline-flex items-center gap-2 px-5 py-3 rounded-lg border border-[#DCDAD3] bg-white hover:bg-slate-50 text-slate-700 hover:text-slate-950 text-xs font-semibold transition-all shadow-2xs cursor-pointer"
                  >
                    <ArrowLeft className="w-4 h-4" />
                    <span>Previous Stage</span>
                  </button>
                ) : (
                  <div className="text-xs text-[#78716C] font-mono flex items-center gap-1.5">
                    <ShieldCheck className="w-4 h-4 text-[#D97706]" />
                    <span>Encrypted Institutional Portal</span>
                  </div>
                )}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-black hover:bg-neutral-900 text-white font-medium text-xs sm:text-sm tracking-wide border border-black shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer ml-auto"
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
                    className="inline-flex items-center gap-2 px-8 py-3.5 rounded-lg bg-emerald-600 hover:bg-emerald-700 text-white font-semibold text-xs sm:text-sm tracking-wide shadow-md hover:shadow-lg active:scale-95 transition-all duration-200 cursor-pointer ml-auto"
                  >
                    <span>Authorize &amp; Initiate Dossier</span>
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
