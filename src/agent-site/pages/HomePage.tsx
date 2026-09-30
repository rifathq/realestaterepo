import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight, ArrowUpRight } from 'lucide-react';
import { AGENT, FIRM, DPOR_LOOKUP_URL, AFFILIATION, FINANCING_OPTIONS, FINANCING_HELP, PERSONAS } from '../profile';
import { useListings } from '../useListings';
import { ListingCard, OwnershipNotice, SectionHeading, TextLink } from '../components';
import { withBase } from '../../lib/base';

const HELP = [
  {
    title: 'Investing',
    body: 'I invest here myself, so I look at deals the way you do.',
    points: ['Off-market homes, sent to you first', 'SubTo, Seller Finance and Hybrid structures', 'Rentals and value-add properties', 'Written terms, attorney-reviewed'],
    cta: { to: '/creative-financing', label: 'How the structures work' },
  },
  {
    title: 'Selling',
    body: 'A traditional listing or a creative offer, whichever nets you more.',
    points: ['Pricing from recent comparable sales', 'A direct offer on terms, if that fits better', 'Listed with Bright within 2 days of signing', 'Every offer reviewed with you, line by line'],
    cta: { to: '/selling', label: 'Talk about selling' },
  },
  {
    title: 'Buying',
    body: 'From the first search to the keys, with one person who knows your file.',
    points: ["Search every home for sale through eXp Realty's search", 'Creative terms when a bank loan does not fit', 'Offer strategy based on recent nearby sales', 'Contract to closing, one point of contact'],
    cta: { to: '/search', label: 'Start a home search' },
  },
];

export const HomePage: React.FC = () => {
  const { listings, error } = useListings();
  const all = listings || [];
  const offMarket = all.filter((l) => l.offMarket).slice(0, 3);
  const rentals = all
    .filter((l) => l.listingType === 'rent')
    .sort((a, b) => (a.status === 'rented' ? 1 : 0) - (b.status === 'rented' ? 1 : 0))
    .slice(0, 3);
  const traditional = all.filter((l) => !l.offMarket && l.listingType !== 'rent' && l.status !== 'sold').slice(0, 3);
  const loading = listings === null && !error;
  const skeleton = [0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] bg-stone-200/60 animate-pulse" />);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <video src={withBase('/hero-video.mp4')} autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/60 to-stone-950/25" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 min-h-[78vh] flex flex-col justify-end pb-14 sm:pb-20 pt-24">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-stone-300 font-semibold">
            {AGENT.name} · {FIRM.shortName}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-bold font-architectural leading-[1.04] text-balance">
            Investor-friendly real estate in Northern Virginia.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-stone-200 leading-relaxed">
            I invest here too. Off-market homes, creative terms and a traditional sale when that's the better fit, for
            investors, sellers, buyers and renters across {AGENT.serving}.
          </p>
          <ul className="mt-6 flex flex-wrap gap-2" aria-label="Deal types I work with">
            {FINANCING_OPTIONS.slice(0, 5).map((o) => (
              <li key={o} title={FINANCING_HELP[o]} className="text-xs font-semibold bg-white/10 border border-white/25 backdrop-blur-sm px-2.5 py-1">
                {o}
              </li>
            ))}
          </ul>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/off-market" className="inline-flex justify-center bg-white text-stone-950 hover:bg-stone-200 text-sm font-semibold px-6 py-3.5 transition-colors">
              See off-market deals
            </Link>
            <Link to="/contact?topic=seller" className="inline-flex justify-center border border-white/40 hover:border-white text-white text-sm font-semibold px-6 py-3.5 transition-colors">
              Get an offer on your home
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20">
        <SectionHeading kicker="Start here" title="How can I help you?" />
        <div className="grid gap-px bg-stone-200 border border-stone-200 sm:grid-cols-2 lg:grid-cols-4">
          {PERSONAS.map((p) => (
            <Link key={p.key} to={`/contact?topic=${p.key}`} className="group bg-white p-6 flex flex-col hover:bg-stone-50 transition-colors">
              <h3 className="text-lg font-bold font-architectural text-stone-950">{p.title}</h3>
              <p className="mt-2 text-sm text-stone-600 leading-relaxed flex-1">{p.body}</p>
              <span className="mt-5 inline-flex items-center gap-1.5 text-sm font-semibold text-stone-900 group-hover:gap-2.5 transition-all">
                Reach out <ArrowRight className="w-4 h-4" />
              </span>
            </Link>
          ))}
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <SectionHeading kicker="Off-market" title="Deals with flexible terms" action={<TextLink to="/off-market">All off-market deals</TextLink>} />
        <div className="mb-6 max-w-3xl">
          <OwnershipNotice compact />
        </div>
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{loading ? skeleton : offMarket.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
      </section>

      <section className="bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
          <SectionHeading kicker="How I can help" title="Investor first, and every client gets the same care" />
          <div className="grid gap-6 md:grid-cols-3">
            {HELP.map((h) => (
              <div key={h.title} className="border border-stone-200 p-7 flex flex-col">
                <h3 className="text-2xl font-bold font-architectural text-stone-950">{h.title}</h3>
                <p className="mt-2 text-stone-600 leading-relaxed">{h.body}</p>
                <ul className="mt-6 space-y-3 flex-1">
                  {h.points.map((p) => (
                    <li key={p} className="flex gap-3 text-sm text-stone-800">
                      <span className="mt-2 w-1.5 h-1.5 bg-stone-900 shrink-0" />
                      {p}
                    </li>
                  ))}
                </ul>
                <div className="mt-8">
                  <TextLink to={h.cta.to}>{h.cta.label}</TextLink>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {rentals.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-16 sm:pt-20">
          <SectionHeading kicker="Rentals" title="Homes for rent" action={<TextLink to="/rentals">All rentals and waitlist</TextLink>} />
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {rentals.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <SectionHeading kicker="Listings" title="Homes I'm representing" action={<TextLink to="/listings">All listings</TextLink>} />
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">{loading ? skeleton : traditional.map((l) => <ListingCard key={l.id} listing={l} />)}</div>
        <p className="mt-8 text-sm text-stone-600">
          Looking for something else?{' '}
          <Link to="/search" className="font-semibold text-stone-950 underline underline-offset-4">Search every home for sale</Link>
        </p>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8">
        <div className="border border-stone-300 bg-stone-100 p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-architectural text-stone-950">Behind on your mortgage?</h2>
            <p className="mt-2 max-w-xl text-stone-700 leading-relaxed">
              You have more options than you think, starting with free ones. See them all, with no cost and no pressure.
            </p>
          </div>
          <Link to="/foreclosure-help" className="inline-flex justify-center bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3.5 transition-colors shrink-0">
            See your options
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20 grid gap-10 md:grid-cols-12 items-center">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] bg-stone-200 overflow-hidden">
            <img src={withBase(AGENT.photo)} alt={AGENT.name} className="w-full h-full object-cover object-top" />
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">About</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-architectural text-stone-950">{AGENT.name}</h2>
          <p className="mt-5 text-lg text-stone-700 leading-relaxed">
            I'm a Virginia-licensed real estate agent with {FIRM.shortName} and an investor, based in Arlington. I buy,
            hold and sell here, work creative deals, and still do traditional sales. The approach stays plain: clear
            numbers, honest advice and quick replies.
          </p>
          <p className="mt-3 text-sm text-stone-500">{AFFILIATION}.</p>
          <dl className="mt-8 grid sm:grid-cols-2 gap-px bg-stone-200 border border-stone-200">
            <div className="bg-stone-50 p-4">
              <dt className="text-[11px] uppercase tracking-wide text-stone-500">Licence</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900">{AGENT.licenceType}, {AGENT.licensedIn} #{AGENT.licence}</dd>
            </div>
            <div className="bg-stone-50 p-4">
              <dt className="text-[11px] uppercase tracking-wide text-stone-500">Brokerage</dt>
              <dd className="mt-1 text-sm font-semibold text-stone-900">{FIRM.name}</dd>
            </div>
          </dl>
          <div className="mt-6 flex flex-wrap items-center gap-6">
            <TextLink to="/about">More about me</TextLink>
            <a href={DPOR_LOOKUP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-950 py-2">
              Verify my licence <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold font-architectural">Have a property, a deal or a question?</h2>
            <p className="mt-2 text-stone-300 max-w-xl">
              Investor, seller, buyer or renter, tell me what you need. I'll reply by email, and only call or text if you
              say that's okay.
            </p>
          </div>
          <Link to="/contact" className="inline-flex justify-center bg-white text-stone-950 hover:bg-stone-200 text-sm font-semibold px-6 py-3.5 transition-colors shrink-0">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
};
