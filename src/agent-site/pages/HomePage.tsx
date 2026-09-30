import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AGENT, FIRM, DPOR_LOOKUP_URL, AFFILIATION } from '../profile';
import { useListings } from '../useListings';
import { ListingCard, OwnershipNotice, SectionHeading, TextLink } from '../components';

const HELP = [
  {
    title: 'Buying',
    body: 'From the first search to the keys, with one person who knows your file.',
    points: [
      "Search every home for sale through eXp Realty's search",
      'Tours on your schedule',
      'Offer strategy based on recent nearby sales',
      'Contract to closing, one point of contact',
    ],
    cta: { to: '/search', label: 'Start a home search' },
  },
  {
    title: 'Selling',
    body: 'A clear plan, an honest price, and no surprises on the way to closing.',
    points: [
      'Pricing from recent comparable sales',
      'A preparation and photography plan',
      'Listed with Bright within 2 days of signing',
      'Every offer reviewed with you, line by line',
    ],
    cta: { to: '/selling', label: 'Talk about selling' },
  },
  {
    title: 'Creative & investing',
    body: "When a bank loan doesn't fit, there are other ways to make a deal work.",
    points: [
      'Seller financing and lease options',
      'Subject-to and assumable loans',
      'Off-market homes I own, sold direct',
      'Written terms, attorney-reviewed',
    ],
    cta: { to: '/creative-financing', label: 'How creative financing works' },
  },
];

export const HomePage: React.FC = () => {
  const { listings, error } = useListings();
  const featured = (listings || []).filter((l) => !l.offMarket && l.status !== 'sold').slice(0, 3);
  const offMarket = (listings || []).filter((l) => l.offMarket).slice(0, 3);

  return (
    <>
      <section className="relative isolate overflow-hidden bg-stone-950 text-white">
        <video src="/hero-video.mp4" autoPlay loop muted playsInline className="absolute inset-0 w-full h-full object-cover -z-10" />
        <div className="absolute inset-0 -z-10 bg-gradient-to-t from-stone-950 via-stone-950/55 to-stone-950/25" />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 min-h-[72vh] flex flex-col justify-end pb-14 sm:pb-20 pt-24">
          <div className="text-[11px] sm:text-xs uppercase tracking-[0.24em] text-stone-300 font-semibold">
            {AGENT.name} · {FIRM.shortName}
          </div>
          <h1 className="mt-4 max-w-3xl text-4xl sm:text-6xl lg:text-7xl font-bold font-architectural leading-[1.04] text-balance">
            Northern Virginia homes, handled personally.
          </h1>
          <p className="mt-5 max-w-xl text-base sm:text-lg text-stone-200 leading-relaxed">
            Traditional sales and creative deals, from seller financing to subject-to, for buyers, sellers and
            investors across {AGENT.serving}.
          </p>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <Link to="/listings" className="inline-flex justify-center bg-white text-stone-950 hover:bg-stone-200 text-sm font-semibold px-6 py-3 transition-colors">
              See my listings
            </Link>
            <Link to="/off-market" className="inline-flex justify-center border border-white/40 hover:border-white text-white text-sm font-semibold px-6 py-3 transition-colors">
              Off-market deals
            </Link>
          </div>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
        <SectionHeading kicker="Listings" title="Homes I'm representing" action={<TextLink to="/listings">All listings</TextLink>} />
        {error && <p className="text-sm text-red-700">{error}</p>}
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {listings === null && !error
            ? [0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] bg-stone-200/60 animate-pulse" />)
            : featured.map((l) => <ListingCard key={l.id} listing={l} />)}
        </div>
        <p className="mt-8 text-sm text-stone-600">
          Looking for something else?{' '}
          <Link to="/search" className="font-semibold text-stone-950 underline underline-offset-4">Search every home for sale</Link>
        </p>
      </section>

      {offMarket.length > 0 && (
        <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-20">
          <SectionHeading kicker="Off-market" title="Homes with flexible terms" action={<TextLink to="/off-market">All off-market homes</TextLink>} />
          <div className="mb-6 max-w-3xl">
            <OwnershipNotice compact />
          </div>
          <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {offMarket.map((l) => (
              <ListingCard key={l.id} listing={l} />
            ))}
          </div>
        </section>
      )}

      <section className="bg-white border-y border-stone-200">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20">
          <SectionHeading kicker="How I can help" title="Traditional or creative, the same care" />
          <div className="grid gap-6 md:grid-cols-3">
            {HELP.map((h) => (
              <div key={h.title} className="border border-stone-200 p-7 sm:p-9 flex flex-col">
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

      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-20">
        <div className="border border-stone-300 bg-stone-100 p-7 sm:p-10 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-2xl sm:text-3xl font-bold font-architectural text-stone-950">Behind on your mortgage?</h2>
            <p className="mt-2 max-w-xl text-stone-700 leading-relaxed">
              You have more options than you think, starting with free ones. See them all, with no cost and no pressure.
            </p>
          </div>
          <Link to="/foreclosure-help" className="inline-flex justify-center bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 transition-colors shrink-0">
            See your options
          </Link>
        </div>
      </section>

      <section className="max-w-6xl mx-auto px-5 sm:px-8 py-20 grid gap-10 md:grid-cols-12 items-center">
        <div className="md:col-span-5">
          <div className="aspect-[4/5] bg-stone-200 overflow-hidden">
            <img src={AGENT.photo} alt={AGENT.name} className="w-full h-full object-cover object-top" />
          </div>
        </div>
        <div className="md:col-span-7">
          <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">About</div>
          <h2 className="mt-2 text-3xl sm:text-4xl font-bold font-architectural text-stone-950">{AGENT.name}</h2>
          <p className="mt-5 text-lg text-stone-700 leading-relaxed">
            I'm a Virginia-licensed real estate agent with {FIRM.shortName}, based in Arlington. I work with buyers and
            sellers across Northern Virginia, on traditional sales and creative ones, and keep things plain: clear
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
            <a href={DPOR_LOOKUP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-950">
              Verify my licence <ArrowUpRight className="w-3.5 h-3.5" />
            </a>
          </div>
        </div>
      </section>

      <section className="bg-stone-950 text-white">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 flex flex-col md:flex-row md:items-center justify-between gap-6">
          <div>
            <h2 className="text-3xl font-bold font-architectural">Thinking about buying or selling?</h2>
            <p className="mt-2 text-stone-300 max-w-xl">
              Tell me what you're looking for. I'll reply by email, and only call or text if you say that's okay.
            </p>
          </div>
          <Link to="/contact" className="inline-flex justify-center bg-white text-stone-950 hover:bg-stone-200 text-sm font-semibold px-6 py-3 transition-colors shrink-0">
            Get in touch
          </Link>
        </div>
      </section>
    </>
  );
};
