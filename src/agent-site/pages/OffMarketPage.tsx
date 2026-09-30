import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { FINANCING_OPTIONS } from '../profile';
import { useListings } from '../useListings';
import { LeadForm, ListingCard, OwnershipNotice } from '../components';

export const OffMarketPage: React.FC = () => {
  const { listings, error } = useListings();
  const [filter, setFilter] = useState<string>('All');
  const offMarket = (listings || []).filter((l) => l.offMarket);
  const offered = FINANCING_OPTIONS.filter((o) => offMarket.some((l) => l.financing?.includes(o)));
  const visible = filter === 'All' ? offMarket : offMarket.filter((l) => l.financing?.includes(filter));

  return (
    <>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Off-market & creative terms</div>
        <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl font-bold font-architectural text-stone-950 text-balance">
          Homes you won't find on the usual sites
        </h1>
        <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
          Properties I own or control, sold directly, often with flexible terms like seller financing, subject-to or a
          lease option. Terms are different for every home, so ask and I'll walk you through them.{' '}
          <Link to="/creative-financing" className="font-semibold text-stone-950 underline underline-offset-4">How creative financing works</Link>
        </p>

        <div className="mt-8 max-w-3xl">
          <OwnershipNotice />
        </div>

        <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Filter by financing">
          {['All', ...offered].map((o) => {
            const active = filter === o;
            const n = o === 'All' ? offMarket.length : offMarket.filter((l) => l.financing?.includes(o)).length;
            return (
              <button
                key={o}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setFilter(o)}
                className={`whitespace-nowrap text-sm px-4 py-2 border transition-colors ${
                  active ? 'bg-stone-950 border-stone-950 text-white' : 'bg-white border-stone-300 text-stone-700 hover:border-stone-900'
                }`}
              >
                {o} <span className="text-stone-400">{n}</span>
              </button>
            );
          })}
        </div>

        {error && <p className="mt-8 text-sm text-red-700">{error}</p>}

        <div className="mt-8 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings === null && !error
            ? [0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] bg-stone-200/60 animate-pulse" />)
            : visible.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
        {listings && visible.length === 0 && <p className="mt-8 text-sm text-stone-600">No off-market homes with those terms right now.</p>}
      </div>

      <section className="bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold font-architectural text-stone-950">Get off-market deals first</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Tell me what you're looking for: area, budget, and whether you'd consider seller financing or taking over
              an existing loan. I'll send matching homes before they're offered anywhere else.
            </p>
          </div>
          <div className="lg:col-span-7">
            <LeadForm defaultTopic="Off-market homes" />
          </div>
        </div>
      </section>
    </>
  );
};
