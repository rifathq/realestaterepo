import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  Calendar, 
  Clock, 
  Video, 
  MapPin, 
  CheckCircle2, 
  ArrowLeft, 
  Check, 
  User, 
  Building2,
  CalendarDays
} from 'lucide-react';
import { PROPERTIES } from '../data/properties';
import { AGENTS } from '../data/agents';
import { ImageWithFallback } from '../components/common/ImageWithFallback';
import { useMarketplace } from '../context/MarketplaceContext';

export const TourPage: React.FC = () => {
  const { property: slug } = useParams<{ property: string }>();
  const { notify } = useMarketplace();

  const property = PROPERTIES.find((p) => p.slug === slug) || PROPERTIES[0];
  const agent = AGENTS.find((a) => a.id === property.agentId) || AGENTS[0];

  const [tourType, setTourType] = useState<'in-person' | 'virtual'>('in-person');
  const [selectedDate, setSelectedDate] = useState('2026-10-06');
  const [selectedTime, setSelectedTime] = useState('11:00 AM');
  const [name, setName] = useState('Julian Rhodes');
  const [email, setEmail] = useState('j.rhodes@rhodes-holdings.com');
  const [phone, setPhone] = useState('+1 (415) 302-8104');
  const [attendees, setAttendees] = useState('2 People (Principal + Architect)');
  const [specialFocus, setSpecialFocus] = useState('Primary interest in MEP systems, floor loading capacity, and natural daylight orientation.');
  
  const [confirmed, setConfirmed] = useState(false);

  const availableTimes = [
    '09:30 AM',
    '11:00 AM',
    '01:30 PM',
    '03:00 PM',
    '04:30 PM'
  ];

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setConfirmed(true);
    notify(`Tour scheduled for ${property.title}`);
  };

  return (
    <div className="w-full px-4 sm:px-8 lg:px-12 xl:px-16 py-10 pb-24 space-y-8">
      
      {/* Back button */}
      <div>
        <Link
          to={`/properties/${property.slug}`}
          className="inline-flex items-center gap-1.5 text-xs text-stone-500 hover:text-stone-950 transition-colors"
        >
          <ArrowLeft className="w-3.5 h-3.5 stroke-[1.5]" />
          <span>Return to {property.title} Dossier</span>
        </Link>
      </div>

      {/* Header */}
      <div className="border-b border-stone-200 pb-6">
        <div className="text-xs text-stone-500 uppercase tracking-widest font-mono mb-1">
          Private Client Services
        </div>
        <h1 className="text-3xl sm:text-4xl font-bold tracking-tight text-stone-950 font-architectural">
          Schedule Private Tour
        </h1>
        <p className="text-xs sm:text-sm text-stone-500 mt-1">
          Arrange an accompanied physical walkthrough or a broadcast-quality interactive virtual presentation
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-start">
        
        {/* Left Side: Tour Form */}
        <div className="lg:col-span-7 bg-white border border-stone-200 p-6 sm:p-8">
          {confirmed ? (
            /* Confirmation Receipt */
            <div className="py-6 text-center space-y-6">
              <div className="w-14 h-14 rounded-full bg-stone-900 text-white flex items-center justify-center mx-auto">
                <CheckCircle2 className="w-7 h-7 stroke-[1.5]" />
              </div>

              <div className="space-y-1">
                <span className="text-xs font-mono text-emerald-800 uppercase tracking-wider">
                  Tour Reservation Confirmed
                </span>
                <h2 className="text-2xl font-bold text-stone-950">
                  {tourType === 'in-person' ? 'Private On-Site Viewing' : 'Interactive Virtual Presentation'}
                </h2>
                <p className="text-xs sm:text-sm text-stone-600 max-w-sm mx-auto">
                  A calendar invitation and technical access briefing have been dispatched to <span className="font-semibold text-stone-900">{email}</span>.
                </p>
              </div>

              <div className="p-4 bg-stone-50 border border-stone-200 text-left space-y-2 text-xs font-mono">
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Property:</span>
                  <span className="font-semibold text-stone-900 text-right">{property.title}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Date & Time:</span>
                  <span className="font-semibold text-stone-900">{selectedDate} at {selectedTime}</span>
                </div>
                <div className="flex justify-between border-b border-stone-200 pb-1.5">
                  <span className="text-stone-500">Host Advisor:</span>
                  <span className="font-semibold text-stone-900">{agent.name}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-stone-500">Access Pass:</span>
                  <span className="font-semibold text-stone-900">DIGENTIC-PASS-{(Math.random() * 100000).toFixed(0)}</span>
                </div>
              </div>

              <div className="pt-2 flex flex-col sm:flex-row gap-3">
                <Link
                  to={`/properties/${property.slug}`}
                  className="w-full py-2.5 bg-stone-900 text-white text-xs font-medium hover:bg-stone-800 transition-colors text-center"
                >
                  Return to Property Overview
                </Link>
                <button
                  type="button"
                  onClick={() => setConfirmed(false)}
                  className="w-full py-2.5 bg-stone-100 text-stone-800 text-xs font-medium hover:bg-stone-200 transition-colors"
                >
                  Adjust Booking Details
                </button>
              </div>
            </div>
          ) : (
            /* Booking Form */
            <form onSubmit={handleSubmit} className="space-y-6">
              
              {/* Tour Type Toggle */}
              <div>
                <label className="block text-xs font-semibold uppercase text-stone-600 mb-2">
                  Experience Format
                </label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setTourType('in-person')}
                    className={`p-3 text-left border transition-colors flex items-start gap-3 ${
                      tourType === 'in-person'
                        ? 'border-stone-950 bg-stone-900 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <MapPin className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">In-Person Walkthrough</span>
                      <span className="text-[11px] opacity-80 block mt-0.5">Accompanied on-site tour</span>
                    </div>
                  </button>

                  <button
                    type="button"
                    onClick={() => setTourType('virtual')}
                    className={`p-3 text-left border transition-colors flex items-start gap-3 ${
                      tourType === 'virtual'
                        ? 'border-stone-950 bg-stone-900 text-white'
                        : 'border-stone-200 bg-stone-50 text-stone-700 hover:border-stone-400'
                    }`}
                  >
                    <Video className="w-4 h-4 shrink-0 mt-0.5" />
                    <div>
                      <span className="text-xs font-bold block">Live Virtual Tour</span>
                      <span className="text-[11px] opacity-80 block mt-0.5">Interactive 4K video feed</span>
                    </div>
                  </button>
                </div>
              </div>

              {/* Date & Time */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                    Preferred Date
                  </label>
                  <div className="relative">
                    <input
                      type="date"
                      required
                      value={selectedDate}
                      onChange={(e) => setSelectedDate(e.target.value)}
                      className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 font-mono focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase text-stone-600 mb-1.5">
                    Time Window
                  </label>
                  <select
                    value={selectedTime}
                    onChange={(e) => setSelectedTime(e.target.value)}
                    className="w-full text-xs p-2.5 border border-stone-200 bg-stone-50 font-mono focus:outline-none focus:border-stone-900"
                  >
                    {availableTimes.map((t) => (
                      <option key={t} value={t}>{t}</option>
                    ))}
                  </select>
                </div>
              </div>

              {/* Attendee Details */}
              <div className="space-y-4 pt-2 border-t border-stone-100">
                <span className="text-xs font-semibold uppercase text-stone-600 block">
                  Lead Attendee Information
                </span>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">
                      Full Legal Name *
                    </label>
                    <input
                      type="text"
                      required
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">
                      Corporate / Personal Email *
                    </label>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">
                      Direct Mobile Number *
                    </label>
                    <input
                      type="tel"
                      required
                      value={phone}
                      onChange={(e) => setPhone(e.target.value)}
                      className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                  <div>
                    <label className="block text-[11px] font-medium text-stone-500 mb-1">
                      Party Composition
                    </label>
                    <input
                      type="text"
                      value={attendees}
                      onChange={(e) => setAttendees(e.target.value)}
                      placeholder="e.g. 2 People (Principal + Architect)"
                      className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-[11px] font-medium text-stone-500 mb-1">
                    Special Inquiries or Architectural Focus
                  </label>
                  <textarea
                    rows={2}
                    value={specialFocus}
                    onChange={(e) => setSpecialFocus(e.target.value)}
                    className="w-full text-xs p-2 border border-stone-200 bg-stone-50 focus:outline-none focus:border-stone-900"
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-3.5 bg-black hover:bg-neutral-900 active:scale-95 text-white text-xs font-medium tracking-tight border border-black shadow-md hover:shadow-lg transition-all duration-200 rounded-md cursor-pointer"
              >
                Confirm Private Viewing Request
              </button>
            </form>
          )}
        </div>

        {/* Right Side: Property Snapshot Card */}
        <aside className="lg:col-span-5 space-y-6">
          <div className="bg-white border border-stone-200 p-5 space-y-4">
            <span className="text-[11px] font-mono uppercase tracking-wider text-stone-400 block">
              Target Property Asset
            </span>

            <div className="aspect-16/10 overflow-hidden bg-stone-100 border border-stone-200">
              <ImageWithFallback
                src={property.images[0]}
                alt={property.title}
                fallbackTitle={property.title}
                className="w-full h-full object-cover"
              />
            </div>

            <div>
              <div className="text-xs text-stone-500">
                {property.category} · {property.location.neighborhood}, {property.location.city}
              </div>
              <h3 className="text-base font-bold text-stone-950 mt-0.5">
                {property.title}
              </h3>
              <div className="text-lg font-bold font-mono text-stone-900 mt-1">
                {property.priceDisplay}
                {property.period && <span className="text-xs text-stone-500 font-normal">/mo</span>}
              </div>
            </div>

            <div className="pt-3 border-t border-stone-100 text-xs text-stone-600 font-mono space-y-1">
              <div>Gross Area: {property.specs.sqft > 0 ? `${property.specs.sqft.toLocaleString()} sqft` : property.specs.lotSize}</div>
              <div>Year Built: {property.specs.yearBuilt}</div>
              <div>Architect: {property.architecturalHighlights.architect || 'Custom'}</div>
            </div>

            <div className="pt-3 border-t border-stone-100 flex items-center gap-3">
              <img
                src={agent.avatar}
                alt={agent.name}
                className="w-10 h-10 object-cover border border-stone-200"
              />
              <div className="text-xs">
                <span className="font-semibold text-stone-900 block">{agent.name}</span>
                <span className="text-stone-500 text-[11px]">{agent.role}</span>
              </div>
            </div>
          </div>
        </aside>

      </div>

    </div>
  );
};
