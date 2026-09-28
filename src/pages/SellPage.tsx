import React, { useState } from 'react';
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
  Check
} from 'lucide-react';
import { PropertyCategory, ListingType } from '../types/property';
import { useMarketplace } from '../context/MarketplaceContext';

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

  const handleNext = () => {
    if (currentStep === 1 && !title.trim()) {
      notify('Please enter a property or project title');
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
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handlePrev = () => {
    if (currentStep > 1) {
      setCurrentStep(currentStep - 1);
      window.scrollTo({ top: 300, behavior: 'smooth' });
    }
  };

  const handleFinalSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const generatedRef = `EST-${Math.floor(100000 + Math.random() * 900000)}`;
    setReferenceId(generatedRef);
    setIsSubmitted(true);
    notify(`Listing proposal registered under dossier ${generatedRef}`);
  };

  return (
    <div className="pb-24">
      
      {/* Editorial Header */}
      <section className="bg-stone-900 text-white py-16 sm:py-24 border-b border-stone-800 w-full">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 text-center space-y-4">
          <div className="inline-flex items-center gap-2 text-xs uppercase tracking-widest text-stone-400 font-mono">
            <span className="w-2 h-2 rounded-full bg-white" />
            <span>ESTRA Advisory & Listing Services</span>
          </div>
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-bold tracking-tight text-white font-architectural">
            Put your property in front of the right people.
          </h1>
          <p className="text-stone-300 text-base sm:text-lg max-w-3xl mx-auto leading-relaxed">
            Market your commercial headquarters, residential estate, or land parcel to institutional buyers, corporate occupiers, and accredited private clients.
          </p>
        </div>
      </section>

      <div className="w-full max-w-5xl mx-auto px-4 sm:px-8 -mt-6">
        
        {/* Step Progress Bar */}
        <div className="bg-white border border-stone-200 p-4 sm:p-6 shadow-sm">
          <div className="flex items-center justify-between text-xs font-mono mb-3">
            <span className="text-stone-900 font-semibold">
              Step {currentStep} of {totalSteps}: {
                currentStep === 1 ? 'Asset Classification' :
                currentStep === 2 ? 'Geographic Location' :
                currentStep === 3 ? 'Technical Measurements' :
                currentStep === 4 ? 'Valuation & Terms' :
                currentStep === 5 ? 'Media & Documents' :
                'Principal Verification'
              }
            </span>
            <span className="text-stone-400">
              {Math.round((currentStep / totalSteps) * 100)}% Complete
            </span>
          </div>
          <div className="w-full bg-stone-100 h-1.5 overflow-hidden">
            <div 
              className="bg-stone-950 h-full transition-all duration-300"
              style={{ width: `${(currentStep / totalSteps) * 100}%` }}
            />
          </div>
        </div>

        {/* Workflow Card */}
        <div className="bg-white border border-stone-200 border-t-0 p-6 sm:p-10 shadow-sm mt-0">
          {isSubmitted ? (
            /* Submission Confirmation State */
            <div className="py-8 text-center space-y-6">
              <div className="w-16 h-16 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-8 h-8 stroke-[1.5]" />
              </div>
              
              <div className="space-y-2">
                <span className="text-xs font-mono uppercase tracking-wider text-stone-500">
                  Submission Verified
                </span>
                <h2 className="text-2xl sm:text-3xl font-bold text-stone-950">
                  Property Dossier {referenceId} Initiated
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-lg mx-auto leading-relaxed">
                  Thank you, <span className="font-semibold">{ownerName}</span>. Your listing proposal for <span className="font-semibold text-stone-900">{title || 'the specified asset'}</span> in {city} has been received.
                </p>
              </div>

              {/* Summary snapshot */}
              <div className="p-4 bg-stone-50 border border-stone-200 text-left max-w-md mx-auto space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Asset Class:</span>
                  <span className="font-semibold text-stone-900">{category}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Target Valuation:</span>
                  <span className="font-semibold text-stone-900">${price}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Area:</span>
                  <span className="font-semibold text-stone-900">{sqft} sqft</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Audit Status:</span>
                  <span className="text-emerald-700 font-sans font-semibold">Scheduled for Title Review</span>
                </div>
              </div>

              <div className="pt-4 flex flex-col sm:flex-row items-center justify-center gap-3">
                <Link
                  to="/properties"
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors"
                >
                  Explore Current Marketplace
                </Link>
                <button
                  type="button"
                  onClick={() => {
                    setIsSubmitted(false);
                    setCurrentStep(1);
                  }}
                  className="w-full sm:w-auto px-6 py-2.5 bg-stone-100 text-stone-800 text-xs font-medium hover:bg-stone-200 transition-colors"
                >
                  Submit Another Property
                </button>
              </div>
            </div>
          ) : (
            /* Multi-step Form */
            <form onSubmit={handleFinalSubmit} className="space-y-8">
              
              {/* Step 1: Asset Classification */}
              {currentStep === 1 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 1: Property Identification & Asset Class
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Specify the property title and classification for institutional categorization.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Property or Campus Title *
                    </label>
                    <input
                      type="text"
                      required
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      placeholder="e.g. The Apex Corporate Atrium or Point Lobos Coastal Villa"
                      className="w-full text-xs font-medium p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Transaction Intent *
                      </label>
                      <div className="grid grid-cols-2 gap-2">
                        <button
                          type="button"
                          onClick={() => setListingType('buy')}
                          className={`py-2 text-xs font-medium border text-center transition-colors ${
                            listingType === 'buy'
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-200 text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          For Sale (Fee Simple)
                        </button>
                        <button
                          type="button"
                          onClick={() => setListingType('rent')}
                          className={`py-2 text-xs font-medium border text-center transition-colors ${
                            listingType === 'rent'
                              ? 'bg-stone-900 text-white border-stone-900'
                              : 'border-stone-200 text-stone-700 hover:border-stone-400'
                          }`}
                        >
                          For Lease (Rental)
                        </button>
                      </div>
                    </div>

                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Asset Class *
                      </label>
                      <select
                        value={category}
                        onChange={(e) => setCategory(e.target.value as PropertyCategory)}
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      >
                        <option value="Offices">Offices & Commercial Headquarters</option>
                        <option value="Villas">Villas & Private Residences</option>
                        <option value="Apartments">Apartments & Multi-Family</option>
                        <option value="Penthouses">Crown Penthouses</option>
                        <option value="Industrial">Industrial & Logistics Depots</option>
                        <option value="Land">Development Parcels & Acreage</option>
                        <option value="Retail">High-Street Retail Stores</option>
                      </select>
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Architectural Design Idiom
                    </label>
                    <input
                      type="text"
                      value={architecturalStyle}
                      onChange={(e) => setArchitecturalStyle(e.target.value)}
                      placeholder="e.g. Modernist Steel & Glass, Mid-Century Organic, Brutalist Cast Concrete"
                      className="w-full text-xs p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Step 2: Location */}
              {currentStep === 2 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 2: Geographic & Municipal Location
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Exact address details for title deed verification and GIS mapping.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Street Address *
                    </label>
                    <input
                      type="text"
                      required
                      value={address}
                      onChange={(e) => setAddress(e.target.value)}
                      placeholder="e.g. 500 Howard Street, Suite 400"
                      className="w-full text-xs p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Neighborhood / District
                      </label>
                      <input
                        type="text"
                        value={neighborhood}
                        onChange={(e) => setNeighborhood(e.target.value)}
                        placeholder="e.g. Financial District"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Metropolitan City *
                      </label>
                      <input
                        type="text"
                        required
                        value={city}
                        onChange={(e) => setCity(e.target.value)}
                        placeholder="e.g. San Francisco"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        State / Postal Code
                      </label>
                      <div className="flex gap-2">
                        <input
                          type="text"
                          value={state}
                          onChange={(e) => setState(e.target.value)}
                          placeholder="CA"
                          className="w-16 text-xs p-2.5 border border-stone-200 bg-stone-50 uppercase focus:outline-none focus:border-stone-900"
                        />
                        <input
                          type="text"
                          value={zip}
                          onChange={(e) => setZip(e.target.value)}
                          placeholder="94105"
                          className="flex-1 text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                        />
                      </div>
                    </div>
                  </div>
                </div>
              )}

              {/* Step 3: Specs & Measurements */}
              {currentStep === 3 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 3: Technical Specs & Spatial Measurements
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Certified floor area measurements for technical appraisal.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Gross Floor Area (sqft) *
                      </label>
                      <input
                        type="number"
                        required
                        value={sqft}
                        onChange={(e) => setSqft(e.target.value)}
                        placeholder="e.g. 18500"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Bedrooms / Executive Suites
                      </label>
                      <input
                        type="number"
                        value={beds}
                        onChange={(e) => setBeds(e.target.value)}
                        placeholder="e.g. 4 (or 0 for office)"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Bathrooms / Restrooms
                      </label>
                      <input
                        type="number"
                        value={baths}
                        onChange={(e) => setBaths(e.target.value)}
                        placeholder="e.g. 6"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Parking Bay Capacity
                      </label>
                      <input
                        type="number"
                        value={parking}
                        onChange={(e) => setParking(e.target.value)}
                        placeholder="e.g. 24"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Year of Construction / Renovation
                      </label>
                      <input
                        type="number"
                        value={yearBuilt}
                        onChange={(e) => setYearBuilt(e.target.value)}
                        placeholder="e.g. 2024"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* Step 4: Pricing & Description */}
              {currentStep === 4 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 4: Valuation & Offering Terms
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Financial parameters and core marketing narrative.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Target Valuation / Offering Price ($ USD) *
                      </label>
                      <input
                        type="number"
                        required
                        value={price}
                        onChange={(e) => setPrice(e.target.value)}
                        placeholder="e.g. 14500000"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Monthly Operating / HOA Fees ($ USD)
                      </label>
                      <input
                        type="number"
                        value={hoaMonthly}
                        onChange={(e) => setHoaMonthly(e.target.value)}
                        placeholder="e.g. 1850"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900 font-mono"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Executive Tagline
                    </label>
                    <input
                      type="text"
                      value={tagline}
                      onChange={(e) => setTagline(e.target.value)}
                      placeholder="e.g. Triple-height glass pavilion with private landscaped courtyard and bay views"
                      className="w-full text-xs p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Detailed Architectural Narrative
                    </label>
                    <textarea
                      rows={4}
                      value={description}
                      onChange={(e) => setDescription(e.target.value)}
                      placeholder="Highlight materials, structural engineering, acoustic treatments, LEED certifications, and zoning permissions..."
                      className="w-full text-xs p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>
              )}

              {/* Step 5: Media & Documentation */}
              {currentStep === 5 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 5: Architectural Photography & Documents
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Submit professional photography URLs or schedule an ESTRA architectural photography session.
                    </p>
                  </div>

                  <div>
                    <label className="block text-xs font-medium text-stone-700 mb-1.5">
                      Primary Photograph URL (High-Resolution)
                    </label>
                    <input
                      type="url"
                      value={imageUrl}
                      onChange={(e) => setImageUrl(e.target.value)}
                      placeholder="https://images.unsplash.com/... or cloud asset link"
                      className="w-full text-xs p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                    <span className="text-[11px] text-stone-400 mt-1 block">
                      Leave blank to have an ESTRA verified architectural photographer visit the property.
                    </span>
                  </div>

                  {/* Document upload container */}
                  <div className="border border-dashed border-stone-300 p-8 text-center bg-stone-50/50 space-y-3">
                    <Upload className="w-8 h-8 text-stone-400 mx-auto stroke-[1.5]" />
                    <div>
                      <p className="text-xs font-semibold text-stone-900">
                        Upload Measured Floor Plans & Title Deed
                      </p>
                      <p className="text-[11px] text-stone-500">
                        Accepted formats: PDF, DWG, BIM (Max 50MB per file)
                      </p>
                    </div>
                    <button
                      type="button"
                      onClick={() => notify('Sample document package verified')}
                      className="px-3 py-1.5 bg-white border border-stone-300 text-stone-800 text-xs hover:border-stone-900 transition-colors"
                    >
                      Attach Verified PDFs
                    </button>
                  </div>
                </div>
              )}

              {/* Step 6: Contact Information */}
              {currentStep === 6 && (
                <div className="space-y-6">
                  <div>
                    <h3 className="text-lg font-bold text-stone-950">
                      Step 6: Principal or Listing Agent Verification
                    </h3>
                    <p className="text-xs text-stone-500 mt-0.5">
                      Official contact credentials for transaction escrow and verification clearance.
                    </p>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Principal Representative *
                      </label>
                      <input
                        type="text"
                        required
                        value={ownerName}
                        onChange={(e) => setOwnerName(e.target.value)}
                        placeholder="Full Name"
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Representation Entity
                      </label>
                      <select
                        value={ownerEntity}
                        onChange={(e) => setOwnerEntity(e.target.value)}
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      >
                        <option value="Property Owner / Principal">Property Owner / Principal</option>
                        <option value="Licensed Broker / Agency">Licensed Broker / Agency</option>
                        <option value="Institutional Asset Manager">Institutional Asset Manager</option>
                        <option value="Developer / General Partner">Developer / General Partner</option>
                      </select>
                    </div>
                  </div>

                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Official Email *
                      </label>
                      <input
                        type="email"
                        required
                        value={ownerEmail}
                        onChange={(e) => setOwnerEmail(e.target.value)}
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-stone-700 mb-1.5">
                        Direct Telephone *
                      </label>
                      <input
                        type="tel"
                        required
                        value={ownerPhone}
                        onChange={(e) => setOwnerPhone(e.target.value)}
                        className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                    </div>
                  </div>

                  <div className="p-4 bg-stone-50 border border-stone-200 flex items-start gap-3">
                    <ShieldCheck className="w-5 h-5 text-emerald-800 shrink-0 mt-0.5" />
                    <p className="text-xs text-stone-600 leading-relaxed">
                      By submitting this listing proposal, you certify that you hold legal authority or exclusive representation rights for the specified property asset. ESTRA will initiate public record title verification prior to syndication.
                    </p>
                  </div>
                </div>
              )}

              {/* Navigation Controls */}
              <div className="pt-6 border-t border-stone-200 flex items-center justify-between">
                {currentStep > 1 ? (
                  <button
                    type="button"
                    onClick={handlePrev}
                    className="px-4 py-2 text-xs font-medium text-stone-700 hover:text-stone-950 flex items-center gap-1.5 transition-colors"
                  >
                    <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
                    <span>Previous Step</span>
                  </button>
                ) : <div />}

                {currentStep < totalSteps ? (
                  <button
                    type="button"
                    onClick={handleNext}
                    className="px-6 py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 flex items-center gap-2 transition-colors"
                  >
                    <span>Continue to Step {currentStep + 1}</span>
                    <ArrowRight className="w-3.5 h-3.5 stroke-[1.5]" />
                  </button>
                ) : (
                  <button
                    type="submit"
                    className="px-8 py-3 bg-stone-900 text-white text-xs font-bold uppercase tracking-wider hover:bg-stone-800 transition-colors"
                  >
                    Submit for ESTRA Certification & Listing
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
