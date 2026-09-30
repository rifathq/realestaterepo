import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { FIRM, SEARCH_ALL_HOMES_URL } from '../profile';
import { DemoNote } from '../components';

export const SearchPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-12 lg:grid-cols-12">
    <div className="lg:col-span-7">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Search all homes</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950 text-balance">
        Search every home for sale
      </h1>
      <p className="mt-5 text-lg text-stone-700 leading-relaxed">
        This site shows the homes I represent. To see every other home on the market across Virginia, DC and Maryland,
        use {FIRM.shortName}'s home search. It opens in a new tab.
      </p>
      <a
        href={SEARCH_ALL_HOMES_URL}
        target="_blank"
        rel="noreferrer"
        className="mt-8 inline-flex items-center gap-2 bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 transition-colors"
      >
        Open home search <ArrowUpRight className="w-4 h-4" />
      </a>
      <p className="mt-6 text-sm text-stone-600">
        Found something you like? <Link to="/contact" className="font-semibold text-stone-950 underline underline-offset-4">Send me the link</Link> and
        I'll set up a showing.
      </p>
    </div>
    <div className="lg:col-span-5 space-y-4 self-end">
      <div className="bg-white border border-stone-200 p-6 text-sm text-stone-700 leading-relaxed">
        <div className="font-semibold text-stone-950">Why a separate search?</div>
        <p className="mt-2">
          Homes listed by other agents come through {FIRM.shortName}'s licensed search, which keeps every listing current
          and credits the agent who listed it.
        </p>
      </div>
      <DemoNote>
        This button will open your own {FIRM.shortName} search site (BoldTrail or Lofty), which your eXp tech fee already
        covers. Until you choose one, it opens exprealty.com.
      </DemoNote>
    </div>
  </div>
);
