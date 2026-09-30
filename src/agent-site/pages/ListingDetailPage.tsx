import React from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { AGENT, FIRM, STATUS_LABEL } from '../profile';
import { useListings } from '../useListings';
import { LeadForm, SampleBadge, StatusBadge, placeLine } from '../components';

const STATUS_NOTE: Record<string, string> = {
  coming_soon: 'Coming Soon: showings start when the listing goes active.',
  under_contract: 'Under Contract: the seller has accepted an offer. Ask about similar homes.',
  sold: 'Sold. Ask me about similar homes nearby.',
};

export const ListingDetailPage: React.FC = () => {
  const { slug } = useParams();
  const { listings, error } = useListings();
  const listing = listings?.find((l) => l.slug === slug);

  if (error) return <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 text-sm text-red-700">{error}</div>;
  if (!listings) return <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20"><div className="h-96 bg-stone-200/60 animate-pulse" /></div>;
  if (!listing) {
    return (
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <h1 className="text-3xl font-bold font-architectural">This listing isn't available</h1>
        <p className="mt-3 text-stone-600">It may have been removed. <Link to="/listings" className="underline underline-offset-4">See current listings</Link>.</p>
      </div>
    );
  }

  const facts = [
    { label: 'Bedrooms', value: listing.specs.beds },
    { label: 'Bathrooms', value: listing.specs.baths },
    { label: 'Square feet', value: listing.specs.sqft.toLocaleString() },
    { label: 'Year built', value: listing.specs.yearBuilt },
    { label: 'Lot', value: listing.specs.lotSize },
  ];
  const note = STATUS_NOTE[listing.status];
  const listed = new Date(`${listing.listedDate}T12:00:00`).toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
  const askable = listing.status === 'active' || listing.status === 'coming_soon';

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 sm:py-14">
      <Link to="/listings" className="inline-flex items-center gap-1.5 text-sm text-stone-600 hover:text-stone-950">
        <ArrowLeft className="w-4 h-4" /> All listings
      </Link>

      <div className="mt-6 flex flex-col lg:flex-row lg:items-end justify-between gap-5">
        <div>
          <div className="flex gap-1.5">
            <span className="border border-stone-200"><StatusBadge status={listing.status} /></span>
            {listing.sample && <SampleBadge />}
          </div>
          <h1 className="mt-4 text-3xl sm:text-5xl font-bold font-architectural text-stone-950 text-balance">{listing.title}</h1>
          <p className="mt-2 text-stone-600">{listing.location.address.startsWith('Sample') ? 'Sample address · ' : `${listing.location.address} · `}{placeLine(listing)}</p>
        </div>
        <div className="lg:text-right">
          <div className="text-[11px] uppercase tracking-wide text-stone-500">{listing.status === 'sold' ? 'Sold' : 'List price'}</div>
          <div className="text-3xl sm:text-4xl font-bold font-architectural text-stone-950">{listing.priceDisplay}</div>
        </div>
      </div>

      <div className="mt-8 grid gap-2 md:grid-cols-3">
        <div className="md:col-span-2 aspect-[4/3] md:aspect-auto md:h-[460px] bg-stone-100 overflow-hidden">
          <img src={listing.images[0]} alt={listing.title} className="w-full h-full object-cover" />
        </div>
        <div className="grid gap-2">
          {listing.images[1] && (
            <div className="aspect-[4/3] md:aspect-auto md:h-[226px] bg-stone-100 overflow-hidden">
              <img src={listing.images[1]} alt={`${listing.title}, inside`} className="w-full h-full object-cover" />
            </div>
          )}
          <dl className="bg-white border border-stone-200 p-5 grid grid-cols-2 gap-x-4 gap-y-3 md:h-[226px] content-center">
            {facts.map((f) => (
              <div key={f.label}>
                <dt className="text-[11px] uppercase tracking-wide text-stone-500">{f.label}</dt>
                <dd className="text-sm font-semibold text-stone-900">{f.value}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      <div className="mt-12 grid gap-12 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {note && <div className="mb-8 border-l-2 border-stone-900 bg-white px-4 py-3 text-sm text-stone-700">{note}</div>}
          <h2 className="text-2xl font-bold font-architectural text-stone-950">About this home</h2>
          <p className="mt-4 text-stone-700 leading-relaxed">{listing.description}</p>

          {listing.features.length > 0 && (
            <>
              <h3 className="mt-10 text-lg font-semibold text-stone-950">Features</h3>
              <ul className="mt-4 grid sm:grid-cols-2 gap-3">
                {listing.features.map((f) => (
                  <li key={f} className="flex items-center gap-2.5 text-sm text-stone-800">
                    <Check className="w-4 h-4 text-stone-500" /> {f}
                  </li>
                ))}
              </ul>
            </>
          )}

          <div className="mt-12 border-t border-stone-200 pt-6 text-sm text-stone-600 leading-relaxed">
            <div className="font-semibold text-stone-900">Listed by {AGENT.name}, {FIRM.name}</div>
            <div>{AGENT.phone ? `${AGENT.phone} · ` : ''}{AGENT.email} · Office {FIRM.phone}</div>
            <div className="mt-2 text-xs text-stone-500">
              Status: {STATUS_LABEL[listing.status]} · Listed {listed}. Information deemed reliable but not guaranteed.
            </div>
          </div>
        </div>

        <aside className="lg:sticky lg:top-24 self-start bg-white border border-stone-200 p-6">
          <h2 className="text-lg font-semibold text-stone-950">{askable ? 'Ask about this home' : 'Ask about similar homes'}</h2>
          <p className="mt-1 mb-5 text-sm text-stone-600">
            {askable ? 'Questions, a showing, or a second look. I reply by email.' : 'Tell me what you liked and I will look for similar homes.'}
          </p>
          <LeadForm compact listing={{ id: listing.id, title: listing.title }} submitLabel={askable ? 'Ask Masud' : 'Send to Masud'} />
        </aside>
      </div>
    </div>
  );
};
