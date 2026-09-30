import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { ListingStatus, STATUS_LABEL, STATUS_ORDER } from '../profile';
import { useListings } from '../useListings';
import { ListingCard } from '../components';

export const ListingsPage: React.FC = () => {
  const { listings, error } = useListings();
  const [filter, setFilter] = useState<'all' | ListingStatus>('all');
  const all = (listings || []).filter((l) => !l.offMarket);
  const visible = filter === 'all' ? all : all.filter((l) => l.status === filter);
  const count = (s: ListingStatus) => all.filter((l) => l.status === s).length;

  return (
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Listings</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950">My listings</h1>
      <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
        Homes I represent with eXp Realty. To see every home for sale in the area, use{' '}
        <Link to="/search" className="font-semibold text-stone-950 underline underline-offset-4">Search all homes</Link>. For homes I own
        with flexible terms, see <Link to="/off-market" className="font-semibold text-stone-950 underline underline-offset-4">off-market</Link>.
      </p>

      <div className="mt-8 flex gap-2 overflow-x-auto no-scrollbar pb-1" role="tablist" aria-label="Filter by status">
        {(['all', ...STATUS_ORDER] as const).map((s) => {
          const n = s === 'all' ? all.length : count(s);
          const active = filter === s;
          return (
            <button
              key={s}
              type="button"
              role="tab"
              aria-selected={active}
              onClick={() => setFilter(s)}
              className={`whitespace-nowrap text-sm px-4 py-2 border transition-colors ${
                active ? 'bg-stone-950 border-stone-950 text-white' : 'bg-white border-stone-300 text-stone-700 hover:border-stone-900'
              }`}
            >
              {s === 'all' ? 'All' : STATUS_LABEL[s]} <span className={active ? 'text-stone-400' : 'text-stone-400'}>{n}</span>
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

      {listings && visible.length === 0 && (
        <p className="mt-8 text-sm text-stone-600">No {filter === 'all' ? '' : STATUS_LABEL[filter as ListingStatus].toLowerCase()} listings right now.</p>
      )}
    </div>
  );
};
