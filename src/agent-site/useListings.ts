import { useEffect, useState } from 'react';
import { AGENT, ListingStatus, STATUS_ORDER } from './profile';

export interface SiteListing {
  id: string;
  slug: string;
  title: string;
  tagline?: string;
  description: string;
  status: ListingStatus;
  price: number;
  priceDisplay: string;
  location: { address: string; neighborhood: string; city: string; state: string; zip: string };
  specs: { beds: number; baths: number; sqft: number; yearBuilt: number; lotSize: string };
  images: string[];
  features: string[];
  featured?: boolean;
  sample?: boolean;
  listedDate: string;
}

export function useListings() {
  const [listings, setListings] = useState<SiteListing[] | null>(null);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    let alive = true;
    fetch(`/api/properties?agentId=${encodeURIComponent(AGENT.id)}`)
      .then((res) => (res.ok ? res.json() : Promise.reject(new Error(`HTTP ${res.status}`))))
      .then((data: SiteListing[]) => {
        if (!alive) return;
        const sorted = [...data].sort(
          (a, b) => STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status),
        );
        setListings(sorted);
      })
      .catch(() => alive && setError('Listings could not be loaded. Please try again shortly.'));
    return () => {
      alive = false;
    };
  }, []);

  return { listings, error };
}
