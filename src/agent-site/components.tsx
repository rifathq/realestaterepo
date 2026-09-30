import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, CheckCircle2 } from 'lucide-react';
import { AGENT, FIRM, ListingStatus, STATUS_LABEL } from './profile';
import type { SiteListing } from './useListings';

const STATUS_DOT: Record<ListingStatus, string> = {
  coming_soon: 'bg-amber-500',
  active: 'bg-emerald-500',
  under_contract: 'bg-sky-600',
  sold: 'bg-stone-500',
};

export const StatusBadge: React.FC<{ status: ListingStatus }> = ({ status }) => (
  <span className="inline-flex items-center gap-1.5 bg-white/95 text-stone-900 text-[11px] font-semibold uppercase tracking-wide px-2 py-1">
    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[status]}`} />
    {STATUS_LABEL[status]}
  </span>
);

export const SampleBadge: React.FC = () => (
  <span className="inline-flex items-center bg-stone-900/85 text-white text-[11px] font-semibold uppercase tracking-wide px-2 py-1">
    Sample
  </span>
);

export const EqualHousingMark: React.FC<{ className?: string }> = ({ className = 'w-9 h-9' }) => (
  <svg viewBox="0 0 64 64" className={className} role="img" aria-label="Equal Housing Opportunity">
    <path d="M32 7 5 27h7v30h40V27h7L32 7Z" fill="none" stroke="currentColor" strokeWidth="3.5" strokeLinejoin="round" />
    <rect x="21" y="33" width="22" height="5" fill="currentColor" />
    <rect x="21" y="43" width="22" height="5" fill="currentColor" />
  </svg>
);

export const DemoNote: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="border border-dashed border-amber-400 bg-amber-50 text-amber-900 text-xs leading-relaxed px-4 py-3">
    <span className="font-semibold uppercase tracking-wide text-[10px] mr-2">Demo note</span>
    {children}
  </div>
);

export const SectionHeading: React.FC<{ kicker: string; title: string; action?: React.ReactNode }> = ({
  kicker,
  title,
  action,
}) => (
  <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-3 mb-8">
    <div>
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">{kicker}</div>
      <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-architectural text-stone-950">{title}</h2>
    </div>
    {action}
  </div>
);

export const TextLink: React.FC<{ to: string; children: React.ReactNode }> = ({ to, children }) => (
  <Link to={to} className="inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 hover:gap-2.5 transition-all">
    {children}
    <ArrowRight className="w-4 h-4" />
  </Link>
);

export function specLine(l: SiteListing) {
  return `${l.specs.beds} bd · ${l.specs.baths} ba · ${l.specs.sqft.toLocaleString()} sq ft`;
}

export function placeLine(l: SiteListing) {
  return `${l.location.neighborhood === l.location.city ? '' : `${l.location.neighborhood}, `}${l.location.city}, ${l.location.state} ${l.location.zip}`;
}

export const ListingCard: React.FC<{ listing: SiteListing }> = ({ listing }) => (
  <article className="group bg-white border border-stone-200 hover:border-stone-400 transition-colors">
    <Link to={`/listings/${listing.slug}`} className="block">
      <div className="relative aspect-[4/3] overflow-hidden bg-stone-100">
        <img
          src={listing.images[0]}
          alt={listing.title}
          loading="lazy"
          className="w-full h-full object-cover transition-transform duration-500 ease-out group-hover:scale-[1.03]"
        />
        <div className="absolute top-3 left-3 flex gap-1.5">
          <StatusBadge status={listing.status} />
          {listing.sample && <SampleBadge />}
        </div>
      </div>
      <div className="p-5">
        <div className="flex items-baseline justify-between gap-3">
          <div className="text-xl font-bold font-architectural text-stone-950">{listing.priceDisplay}</div>
          {listing.status === 'sold' && <span className="text-[11px] uppercase tracking-wide text-stone-500">Sold</span>}
        </div>
        <div className="text-sm text-stone-600 mt-1">{specLine(listing)}</div>
        <h3 className="mt-3 font-semibold text-stone-900">{listing.title}</h3>
        <p className="text-sm text-stone-500 mt-0.5">{placeLine(listing)}</p>
        <div className="mt-4 pt-3 border-t border-stone-100 text-[11px] text-stone-500">
          Listed by {AGENT.name} · {FIRM.name}
        </div>
      </div>
    </Link>
  </article>
);

const CONSENT_TEXT = `${AGENT.name} of ${FIRM.shortName} may call or text me at the number above about this inquiry, including by automated means. Consent is not a condition of buying or selling. Message and data rates may apply. Reply STOP to opt out.`;

const TOPICS = ['Buying a home', 'Selling a home', 'This listing', 'Something else'];

interface LeadFormProps {
  defaultTopic?: string;
  listing?: { id: string; title: string };
  submitLabel?: string;
  compact?: boolean;
}

export const LeadForm: React.FC<LeadFormProps> = ({ defaultTopic = 'Buying a home', listing, submitLabel = 'Send to Masud', compact }) => {
  const [form, setForm] = useState({ name: '', email: '', phone: '', topic: listing ? 'This listing' : defaultTopic, message: '' });
  const [consent, setConsent] = useState(false);
  const [website, setWebsite] = useState('');
  const [state, setState] = useState<'idle' | 'sending' | 'sent' | 'error'>('idle');
  const [error, setError] = useState('');

  const set = (key: keyof typeof form) => (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement>) =>
    setForm({ ...form, [key]: e.target.value });

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    setState('sending');
    setError('');
    try {
      const res = await fetch('/api/leads', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          clientName: form.name.trim(),
          clientEmail: form.email.trim(),
          clientPhone: form.phone.trim(),
          inquiryType: form.topic,
          message: form.message.trim(),
          propertyId: listing?.id,
          propertyTitle: listing?.title,
          agentId: AGENT.id,
          agentName: AGENT.name,
          source: 'agent-site',
          consentToCallOrText: consent,
          consentText: consent ? CONSENT_TEXT : null,
          consentAt: consent ? new Date().toISOString() : null,
          website,
        }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => ({}));
        throw new Error(data.error || 'Something went wrong. Please try again.');
      }
      setState('sent');
    } catch (err: any) {
      setError(err.message);
      setState('error');
    }
  };

  if (state === 'sent') {
    return (
      <div className="bg-white border border-stone-200 p-6">
        <CheckCircle2 className="w-6 h-6 text-emerald-600" />
        <div className="mt-3 font-semibold text-stone-950">Thanks, {form.name.split(' ')[0] || 'there'}.</div>
        <p className="text-sm text-stone-600 mt-1 leading-relaxed">
          Your message is with {AGENT.name}. You'll get a reply by email{consent ? ', or by phone or text as you allowed' : ''}.
        </p>
      </div>
    );
  }

  const input = 'w-full bg-white border border-stone-300 focus:border-stone-900 focus:outline-none px-3 py-2.5 text-sm text-stone-900 placeholder:text-stone-400';
  const label = 'block text-xs font-semibold text-stone-700 mb-1.5';

  return (
    <form onSubmit={submit} className="space-y-4" noValidate={false}>
      <div className={`grid gap-4 ${compact ? '' : 'sm:grid-cols-2'}`}>
        <div>
          <label className={label} htmlFor="lead-name">Name</label>
          <input id="lead-name" required autoComplete="name" value={form.name} onChange={set('name')} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="lead-email">Email</label>
          <input id="lead-email" type="email" required autoComplete="email" value={form.email} onChange={set('email')} className={input} />
        </div>
        <div>
          <label className={label} htmlFor="lead-phone">Phone <span className="font-normal text-stone-400">(optional)</span></label>
          <input id="lead-phone" type="tel" autoComplete="tel" value={form.phone} onChange={set('phone')} className={input} />
        </div>
        {!listing && (
          <div>
            <label className={label} htmlFor="lead-topic">I'm interested in</label>
            <select id="lead-topic" value={form.topic} onChange={set('topic')} className={input}>
              {TOPICS.filter((t) => t !== 'This listing').map((t) => (
                <option key={t}>{t}</option>
              ))}
            </select>
          </div>
        )}
      </div>
      <div>
        <label className={label} htmlFor="lead-message">Message</label>
        <textarea
          id="lead-message"
          rows={compact ? 3 : 4}
          value={form.message}
          onChange={set('message')}
          placeholder={listing ? `I'd like to know more about ${listing.title}.` : 'Tell me a little about what you are looking for.'}
          className={`${input} resize-y`}
        />
      </div>

      {/* Hidden from people; bots fill it in. */}
      <input
        type="text"
        name="website"
        tabIndex={-1}
        autoComplete="off"
        aria-hidden="true"
        value={website}
        onChange={(e) => setWebsite(e.target.value)}
        style={{ position: 'absolute', left: '-9999px' }}
      />

      <label className="flex items-start gap-3 text-xs text-stone-600 leading-relaxed cursor-pointer">
        <input
          type="checkbox"
          checked={consent}
          onChange={(e) => setConsent(e.target.checked)}
          className="mt-0.5 w-4 h-4 shrink-0 accent-stone-900"
        />
        <span>{CONSENT_TEXT}</span>
      </label>

      {state === 'error' && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={state === 'sending'}
        className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 transition-colors disabled:opacity-60"
      >
        {state === 'sending' ? 'Sending…' : submitLabel}
      </button>
      <p className="text-[11px] text-stone-500 leading-relaxed">
        By sending this form you agree to the <Link to="/privacy" className="underline underline-offset-2">Privacy Policy</Link>. Your details go
        only to {AGENT.name} at {FIRM.shortName} and are never sold.
      </p>
    </form>
  );
};
