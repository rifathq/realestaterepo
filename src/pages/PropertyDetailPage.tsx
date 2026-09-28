import React, { useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { 
  Bookmark, 
  Columns2, 
  Share2, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  ArrowLeft, 
  Maximize2,
  Phone,
  Mail,
  FileCheck,
  Check,
  Building,
  UserCheck
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { AGENTS } from '../data/agents';
import { useMarketplace } from '../../src/context/MarketplaceContext';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { PropertyGalleryModal } from '../components/property/PropertyGalleryModal';
import { PropertyCard } from '../components/property/PropertyCard';

export const PropertyDetailPage: React.FC = () => {
  const { slug } = useParams<{ slug: string }>();
  const navigate = useNavigate();
  const { isSaved, toggleSave, isComparing, toggleCompare, notify } = useMarketplace();

  const property = PROPERTIES.find((p) => p.slug === slug);
  const agent = property ? AGENTS.find((a) => a.id === property.agentId) || AGENTS[0] : null;

  // Gallery state
  const [activeImageIndex, setActiveImageIndex] = useState(0);
  const [fullscreenOpen, setFullscreenOpen] = useState(false);

  // Inquire form state
  const [inquireName, setInquireName] = useState('');
  const [inquireEmail, setInquireEmail] = useState('');
  const [inquirePhone, setInquirePhone] = useState('');
  const [inquireMessage, setInquireMessage] = useState('I would like to request confidential offering documentation and arrange a technical walkthrough.');
  const [inquireSubmitted, setInquireSubmitted] = useState(false);

  if (!property) {
    return (
      <div className="max-w-7xl mx-auto px-4 py-24 text-center space-y-4">
        <h2 className="text-2xl font-bold text-stone-900">Property Not Found</h2>
        <p className="text-sm text-stone-500">The requested property listing does not exist or may have been unlisted.</p>
        <Link
          to="/properties"
          className="inline-flex items-center gap-2 px-4 py-2 bg-stone-900 text-white text-xs font-medium"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Return to Marketplace Directory</span>
        </Link>
      </div>
    );
  }

  const saved = isSaved(property.id);
  const comparing = isComparing(property.id);

  const handleShare = () => {
    if (navigator.clipboard) {
      navigator.clipboard.writeText(window.location.href);
      notify('Property dossier link copied to clipboard');
    } else {
      notify('Link copied to clipboard');
    }
  };

  const handleInquireSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setInquireSubmitted(true);
    notify(`Inquiry submitted to ${agent?.name || 'ESTRA Advisory'}`);
  };

  const similarProperties = PROPERTIES.filter(
    (p) => p.id !== property.id && (p.category === property.category || p.location.city === property.location.city)
  ).slice(0, 3);

  return (
    <div className="pb-24">
      
      {/* Top Breadcrumb & Actions Bar */}
      <div className="bg-white border-b border-stone-200">
        <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-3.5 flex items-center justify-between text-sm sm:text-base font-medium text-stone-600">
          <div className="flex items-center gap-2">
            <Link to="/properties" className="hover:text-stone-900 flex items-center gap-1.5 font-semibold">
              <ArrowLeft className="w-4 h-4 stroke-[1.5]" />
              <span>Catalog</span>
            </Link>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span className="text-stone-700">{property.category}</span>
            <span aria-hidden="true" className="text-stone-300">/</span>
            <span className="text-stone-950 font-semibold truncate max-w-xs sm:max-w-md">{property.title}</span>
          </div>

          <div className="flex items-center gap-2 sm:gap-3">
            <button
              onClick={handleShare}
              className="flex items-center gap-2 px-3.5 py-2 border border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50 transition-colors text-sm font-medium"
              title="Share listing"
            >
              <Share2 className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline">Share</span>
            </button>
            <button
              onClick={() => toggleCompare(property.id)}
              className={`flex items-center gap-2 px-3.5 py-2 border transition-colors text-sm font-medium ${
                comparing 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50'
              }`}
              title="Toggle compare"
            >
              <Columns2 className="w-4 h-4 stroke-[1.5]" />
              <span className="hidden sm:inline">{comparing ? 'In Comparison' : 'Compare'}</span>
            </button>
            <button
              onClick={() => toggleSave(property.id)}
              className={`flex items-center gap-2 px-3.5 py-2 border transition-colors text-sm font-medium ${
                saved 
                  ? 'bg-stone-900 text-white border-stone-900' 
                  : 'border-stone-200 text-stone-700 hover:text-stone-950 hover:bg-stone-50'
              }`}
              title="Save listing"
            >
              <Bookmark className={`w-4 h-4 stroke-[1.5] ${saved ? 'fill-current' : ''}`} />
              <span className="hidden sm:inline">{saved ? 'Saved' : 'Save'}</span>
            </button>
          </div>
        </div>
      </div>

      <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 pt-8 space-y-10">
        
        {/* Title & Valuation Header */}
        <div className="flex flex-col lg:flex-row lg:items-end justify-between gap-6 pb-6 border-b border-stone-200">
          <div className="space-y-2">
            <div className="flex items-center gap-3 text-sm text-stone-500 font-mono">
              <span className="bg-stone-900 text-white px-2.5 py-1 uppercase tracking-wider text-xs font-semibold">
                {property.listingType === 'buy' ? 'For Sale' : 'For Lease'}
              </span>
              <span>Ref: {property.slug.slice(0, 12).toUpperCase()}</span>
              <span>·</span>
              <span className="font-semibold text-stone-800">{property.category}</span>
            </div>
            <h1 className="text-3xl sm:text-5xl font-bold tracking-tight text-stone-950 font-architectural">
              {property.title}
            </h1>
            <p className="text-base sm:text-lg text-stone-600 flex items-center gap-2">
              <MapPin className="w-4.5 h-4.5 text-stone-400 stroke-[1.5] shrink-0" />
              <span>{property.location.address}, {property.location.neighborhood}, {property.location.city}, {property.location.state} {property.location.zip}</span>
            </p>
          </div>

          <div className="lg:text-right space-y-2">
            <span className="text-sm text-stone-500 block uppercase tracking-wider font-medium">
              {property.listingType === 'buy' ? 'Verified Offering Valuation' : 'Monthly Rental Rate'}
            </span>
            <div className="text-3xl sm:text-4xl lg:text-5xl font-bold text-stone-950 font-mono tracking-tight">
              {property.priceDisplay}
              {property.period && <span className="text-lg font-normal text-stone-500">/mo</span>}
            </div>
            <div className="flex items-center lg:justify-end gap-2 text-sm text-stone-500 font-mono">
              {property.specs.pricePerSqft > 0 && <span>${property.specs.pricePerSqft}/sqft</span>}
              {property.specs.hoaMonthly !== undefined && property.specs.hoaMonthly > 0 && (
                <>
                  <span>·</span>
                  <span>HOA ${property.specs.hoaMonthly}/mo</span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* Gallery Section */}
        <div className="space-y-3">
          <div className="relative aspect-16/9 w-full max-h-[560px] bg-stone-900 overflow-hidden group">
            <ImageWithFallback
              src={property.images[activeImageIndex]}
              alt={`${property.title} view`}
              fallbackTitle={property.title}
              className="w-full h-full object-cover"
            />
            <button
              onClick={() => setFullscreenOpen(true)}
              className="absolute bottom-4 right-4 px-4 py-2 bg-stone-950/85 hover:bg-stone-950 text-white text-sm font-semibold flex items-center gap-2 backdrop-blur-xs transition-colors shadow-sm"
            >
              <Maximize2 className="w-4 h-4 stroke-[1.5]" />
              <span>View Fullscreen Gallery ({property.images.length} Photographs)</span>
            </button>
          </div>

          {/* Thumbnail list */}
          <div className="grid grid-cols-4 sm:grid-cols-6 gap-2.5">
            {property.images.map((img, idx) => (
              <button
                key={idx}
                onClick={() => setActiveImageIndex(idx)}
                className={`relative aspect-4/3 overflow-hidden border transition-all ${
                  idx === activeImageIndex
                    ? 'border-stone-950 ring-2 ring-stone-950'
                    : 'border-stone-200 opacity-60 hover:opacity-100'
                }`}
              >
                <img
                  src={img}
                  alt={`Thumbnail ${idx + 1}`}
                  className="w-full h-full object-cover"
                />
              </button>
            ))}
          </div>
        </div>

        {/* Key Architectural Specs Bar */}
        <div className="bg-white border border-stone-200 p-6 sm:p-8 grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-6 text-center divide-y sm:divide-y-0 sm:divide-x divide-stone-100 font-mono">
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Bedrooms</span>
            <span className="text-2xl font-bold text-stone-900">{property.specs.beds || 'N/A'}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Bathrooms</span>
            <span className="text-2xl font-bold text-stone-900">{property.specs.baths}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Gross Area</span>
            <span className="text-2xl font-bold text-stone-900">
              {property.specs.sqft > 0 ? `${property.specs.sqft.toLocaleString()} sf` : property.specs.lotSize}
            </span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Parking</span>
            <span className="text-2xl font-bold text-stone-900">{property.specs.parking} Bays</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Year Built</span>
            <span className="text-2xl font-bold text-stone-900">{property.specs.yearBuilt}</span>
          </div>
          <div className="pt-2 sm:pt-0">
            <span className="text-xs uppercase tracking-wider text-stone-500 block font-sans font-semibold mb-1">Verification</span>
            <span className="text-sm font-bold text-emerald-800 flex items-center justify-center gap-1.5 mt-1 font-sans">
              <ShieldCheck className="w-4.5 h-4.5 stroke-[1.5]" />
              <span>Certified</span>
            </span>
          </div>
        </div>

        {/* Main Content: Details + Aside Tour/Inquire Box */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
          
          {/* Left Column: Dossier Content */}
          <div className="lg:col-span-8 space-y-12">
            
            {/* Overview & Description */}
            <section className="space-y-4">
              <h2 className="text-2xl font-bold tracking-tight text-stone-950 font-architectural">
                Architectural Overview
              </h2>
              <div className="space-y-4 text-stone-700 text-base sm:text-lg leading-relaxed">
                {property.description.map((paragraph, index) => (
                  <p key={index}>{paragraph}</p>
                ))}
              </div>
            </section>

            {/* Architectural Highlights */}
            <section className="space-y-4 pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-bold tracking-tight text-stone-950 font-architectural">
                Structural & Design Characteristics
              </h2>
              <div className="bg-stone-50 border border-stone-200 p-6 sm:p-7 grid grid-cols-1 sm:grid-cols-2 gap-6 text-sm">
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">Architectural Practice</span>
                  <span className="text-base font-semibold text-stone-900 mt-1 block">
                    {property.architecturalHighlights.architect || 'Private Commission'}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">Design Idiom</span>
                  <span className="text-base font-semibold text-stone-900 mt-1 block">
                    {property.architecturalHighlights.style}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">Primary Materiality</span>
                  <span className="text-base font-semibold text-stone-900 mt-1 block">
                    {property.architecturalHighlights.materials.join(' · ')}
                  </span>
                </div>
                <div>
                  <span className="text-stone-500 uppercase tracking-wider block font-mono text-xs font-semibold">Orientation & Light</span>
                  <span className="text-base font-semibold text-stone-900 mt-1 block">
                    {property.architecturalHighlights.facing}
                  </span>
                </div>
              </div>
            </section>

            {/* Features & Amenities */}
            <section className="space-y-6 pt-8 border-t border-stone-200">
              <h2 className="text-2xl font-bold tracking-tight text-stone-950 font-architectural">
                Features & Technical Specifications
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                {property.features.map((feat, idx) => (
                  <div key={idx} className="flex items-center gap-3 text-sm sm:text-base font-medium text-stone-800 p-3.5 bg-white border border-stone-200">
                    <Check className="w-4.5 h-4.5 text-stone-900 stroke-[2] shrink-0" />
                    <span>{feat}</span>
                  </div>
                ))}
              </div>

              <h3 className="text-sm sm:text-base font-bold uppercase tracking-wider text-stone-700 pt-3">
                Amenities & Building Infrastructure
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2.5">
                {property.amenities.map((amenity, idx) => (
                  <div key={idx} className="text-sm font-medium text-stone-700 py-2.5 px-3.5 bg-stone-50 border border-stone-200">
                    {amenity}
                  </div>
                ))}
              </div>
            </section>

            {/* Verification & Documents */}
            <section className="space-y-5 pt-8 border-t border-stone-200">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-2xl font-bold tracking-tight text-stone-950 font-architectural">
                    Verified Documentation & Title
                  </h2>
                  <p className="text-sm text-stone-500 mt-1">
                    Surveys and engineering audits completed prior to listing
                  </p>
                </div>
                <span className="text-sm font-mono font-medium text-emerald-800 bg-emerald-50 px-3 py-1.5 border border-emerald-200">
                  {property.verifiedBadgeText}
                </span>
              </div>

              <div className="space-y-2.5">
                {[
                  { title: 'Architectural Measured Floor Plans & Elevations', type: 'PDF', size: '14.2 MB' },
                  { title: 'Official County Title Deed & Ownership Verification', type: 'PDF', size: '2.8 MB' },
                  { title: 'Phase 1 Environmental Site Assessment & Seismic Survey', type: 'PDF', size: '8.4 MB' },
                  { title: 'Mechanical, Electrical, and Plumbing (MEP) Compliance Record', type: 'PDF', size: '5.1 MB' }
                ].map((doc, idx) => (
                  <div
                    key={idx}
                    className="p-4 bg-white border border-stone-200 flex items-center justify-between text-sm hover:border-stone-400 transition-colors"
                  >
                    <div className="flex items-center gap-3.5">
                      <FileCheck className="w-5 h-5 text-stone-700 stroke-[1.5]" />
                      <span className="font-medium text-stone-900">{doc.title}</span>
                    </div>
                    <div className="flex items-center gap-4 text-stone-500 font-mono text-sm">
                      <span>{doc.size}</span>
                      <button
                        onClick={() => notify(`Downloaded verified document: ${doc.title}`)}
                        className="text-stone-900 font-sans font-semibold underline hover:text-stone-600"
                      >
                        Download
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </section>

          </div>

          {/* Right Column: Tour Scheduling & Agent Contact Box */}
          <aside className="lg:col-span-4 space-y-6">
            
            {/* Primary Action Card: Schedule Tour */}
            <div className="bg-stone-900 text-white p-7 border border-stone-800 space-y-4">
              <div className="flex items-center gap-2 text-sm uppercase tracking-wider text-stone-400 font-mono">
                <Calendar className="w-4 h-4 stroke-[1.5]" />
                <span>Private Accompanied Tour</span>
              </div>
              <h3 className="text-xl sm:text-2xl font-bold font-architectural">
                Experience {property.title}
              </h3>
              <p className="text-sm sm:text-base text-stone-300 leading-relaxed">
                Schedule a confidential in-person walkthrough or an interactive 4K live video tour with a licensed advisor.
              </p>
              <Link
                to={`/tour/${property.slug}`}
                className="w-full py-3.5 bg-white hover:bg-stone-100 text-stone-950 text-sm sm:text-base font-semibold tracking-tight text-center block transition-colors shadow-sm"
              >
                Schedule Private Viewing
              </Link>
            </div>

            {/* Assigned Licensed Broker Card */}
            {agent && (
              <div className="bg-white border border-stone-200 p-6 sm:p-7 space-y-5">
                <div className="flex items-center justify-between pb-3 border-b border-stone-100">
                  <span className="text-xs font-mono uppercase tracking-wider text-stone-500 font-semibold">
                    Listing Broker
                  </span>
                  <span className="text-xs text-emerald-800 font-semibold bg-emerald-50 px-2 py-0.5 border border-emerald-200">
                    ESTRA Verified Partner
                  </span>
                </div>

                <div className="flex items-center gap-4">
                  <img
                    src={agent.avatar}
                    alt={agent.name}
                    className="w-16 h-16 object-cover border border-stone-200 shrink-0"
                  />
                  <div>
                    <h4 className="text-lg font-bold text-stone-950">
                      <Link to={`/agents/${agent.slug}`} className="hover:underline">
                        {agent.name}
                      </Link>
                    </h4>
                    <p className="text-sm text-stone-600 font-medium">{agent.role}</p>
                    <p className="text-xs text-stone-500 font-mono mt-0.5">{agent.licenseNumber}</p>
                  </div>
                </div>

                <div className="space-y-2 text-sm text-stone-700 font-mono pt-2">
                  <div className="flex items-center gap-2.5">
                    <Phone className="w-4 h-4 text-stone-400 stroke-[1.5]" />
                    <span>{agent.phone}</span>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Mail className="w-4 h-4 text-stone-400 stroke-[1.5]" />
                    <span>{agent.email}</span>
                  </div>
                </div>

                {/* Direct Inquire Form */}
                <div className="pt-3 border-t border-stone-100">
                  {inquireSubmitted ? (
                    <div className="p-4 bg-stone-50 border border-stone-200 text-center space-y-1.5">
                      <Check className="w-6 h-6 text-emerald-700 mx-auto" />
                      <p className="text-sm font-bold text-stone-900">Inquiry Dispatched</p>
                      <p className="text-xs text-stone-500">
                        {agent.name} will respond within 4 business hours.
                      </p>
                    </div>
                  ) : (
                    <form onSubmit={handleInquireSubmit} className="space-y-3.5">
                      <span className="text-sm font-bold text-stone-900 block">
                        Direct Broker Dossier Request
                      </span>
                      <input
                        type="text"
                        required
                        placeholder="Your Full Name"
                        value={inquireName}
                        onChange={(e) => setInquireName(e.target.value)}
                        className="w-full text-sm p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                      <input
                        type="email"
                        required
                        placeholder="Corporate / Personal Email"
                        value={inquireEmail}
                        onChange={(e) => setInquireEmail(e.target.value)}
                        className="w-full text-sm p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                      <input
                        type="tel"
                        placeholder="Direct Phone Number"
                        value={inquirePhone}
                        onChange={(e) => setInquirePhone(e.target.value)}
                        className="w-full text-sm p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                      <textarea
                        rows={3}
                        value={inquireMessage}
                        onChange={(e) => setInquireMessage(e.target.value)}
                        className="w-full text-sm p-3 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                      />
                      <button
                        type="submit"
                        className="w-full py-3 bg-stone-900 text-white text-sm font-semibold hover:bg-stone-800 transition-colors shadow-xs"
                      >
                        Request Complete Dossier
                      </button>
                    </form>
                  )}
                </div>

                <div className="pt-2 text-center">
                  <Link
                    to={`/agents/${agent.slug}`}
                    className="text-sm text-stone-600 hover:text-stone-950 underline font-medium"
                  >
                    View {agent.name.split(' ')[0]}'s Complete Advisory Portfolio ({agent.activeListingsCount} listings)
                  </Link>
                </div>
              </div>
            )}

          </aside>
        </div>

        {/* Similar Properties Section */}
        {similarProperties.length > 0 && (
          <section className="pt-16 border-t border-stone-200 space-y-6">
            <div>
              <h2 className="text-3xl font-bold tracking-tight text-stone-950 font-architectural">
                Similar Architectural Opportunities
              </h2>
              <p className="text-sm sm:text-base text-stone-500 mt-1">
                Other verified listings in {property.category} or nearby metropolitan hubs
              </p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {similarProperties.map((p) => (
                <PropertyCard key={p.id} property={p} />
              ))}
            </div>
          </section>
        )}

      </div>

      {/* Fullscreen Gallery Lightbox */}
      {fullscreenOpen && (
        <PropertyGalleryModal
          images={property.images}
          activeIndex={activeImageIndex}
          onClose={() => setFullscreenOpen(false)}
          onSelectIndex={setActiveImageIndex}
          title={property.title}
        />
      )}

    </div>
  );
};
