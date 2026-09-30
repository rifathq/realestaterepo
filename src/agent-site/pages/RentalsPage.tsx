import React from 'react';
import { useListings } from '../useListings';
import { LeadForm, ListingCard, OwnershipNotice } from '../components';

export const RentalsPage: React.FC = () => {
  const { listings, error } = useListings();
  const rentals = (listings || []).filter((l) => l.listingType === 'rent');
  const available = rentals.filter((l) => l.status !== 'rented');
  const rented = rentals.filter((l) => l.status === 'rented');

  return (
    <>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Rentals</div>
        <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950">Homes for rent</h1>
        <p className="mt-4 max-w-2xl text-stone-600 leading-relaxed">
          Rentals I own and manage. See what's open now, or join the waitlist for a home that's currently rented.
          Housing vouchers and every lawful source of income are welcome.
        </p>
        <div className="mt-8 max-w-3xl">
          <OwnershipNotice compact />
        </div>

        {error && <p className="mt-8 text-sm text-red-700">{error}</p>}

        <h2 className="mt-12 text-2xl font-bold font-architectural text-stone-950">
          Available now <span className="text-stone-400 font-medium">{available.length}</span>
        </h2>
        <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings === null && !error
            ? [0, 1].map((i) => <div key={i} className="aspect-[4/5] bg-stone-200/60 animate-pulse" />)
            : available.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
        {listings && available.length === 0 && <p className="mt-4 text-sm text-stone-600">Nothing open right now. Join the waitlist below.</p>}

        {rented.length > 0 && (
          <>
            <h2 className="mt-14 text-2xl font-bold font-architectural text-stone-950">
              Currently rented <span className="text-stone-400 font-medium">{rented.length}</span>
            </h2>
            <p className="mt-2 text-sm text-stone-600">Leased today. Join the waitlist to hear first when one opens up.</p>
            <div className="mt-6 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {rented.map((l) => (
                <ListingCard key={l.id} listing={l} />
              ))}
            </div>
          </>
        )}
      </div>

      <section className="bg-white border-t border-stone-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 grid gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <h2 className="text-3xl font-bold font-architectural text-stone-950">Join the rental waitlist</h2>
            <p className="mt-3 text-stone-600 leading-relaxed">
              Tell me the area, the number of bedrooms and when you'd like to move. I'll let you know as soon as a match
              opens.
            </p>
          </div>
          <div className="lg:col-span-7">
            <LeadForm defaultTopic="Renting" />
          </div>
        </div>
      </section>
    </>
  );
};
