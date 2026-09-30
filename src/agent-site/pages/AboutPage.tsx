import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowUpRight } from 'lucide-react';
import { AGENT, FIRM, DPOR_LOOKUP_URL } from '../profile';

export const AboutPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-12 md:grid-cols-12">
    <div className="md:col-span-5">
      <div className="aspect-[4/5] bg-stone-200 overflow-hidden">
        <img src={AGENT.photo} alt={AGENT.name} className="w-full h-full object-cover object-top" />
      </div>
    </div>
    <div className="md:col-span-7">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">About</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950">{AGENT.name}</h1>
      <p className="mt-1 text-stone-600">{AGENT.title} · {FIRM.name}</p>
      <div className="mt-8 space-y-5 text-lg text-stone-700 leading-relaxed">
        <p>
          I'm a Virginia-licensed real estate agent with {FIRM.shortName}, based in Arlington. I work with buyers and
          sellers across Northern Virginia.
        </p>
        <p>
          My approach is simple: clear numbers, honest advice, and quick replies. If a home isn't right for you, I'll say
          so. If a price doesn't make sense, I'll show you why.
        </p>
      </div>

      <div className="mt-10 bg-white border border-stone-200 divide-y divide-stone-200">
        {[
          ['Licence', `${AGENT.licenceType}, licensed in ${AGENT.licensedIn} · #${AGENT.licence}`],
          ['Brokerage', `${FIRM.name} · Firm #${FIRM.licence}`],
          ['Office', `${FIRM.street}, ${FIRM.cityStateZip} · ${FIRM.phone}`],
          ['Email', AGENT.email],
        ].map(([k, v]) => (
          <div key={k} className="grid grid-cols-[7rem_1fr] gap-4 px-5 py-3.5 text-sm">
            <span className="text-stone-500">{k}</span>
            <span className="text-stone-900 break-words">{v}</span>
          </div>
        ))}
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-6">
        <Link to="/contact" className="bg-stone-950 hover:bg-stone-800 text-white text-sm font-semibold px-6 py-3 transition-colors">
          Get in touch
        </Link>
        <a href={DPOR_LOOKUP_URL} target="_blank" rel="noreferrer" className="inline-flex items-center gap-1 text-sm text-stone-600 hover:text-stone-950">
          Verify my licence with DPOR <ArrowUpRight className="w-3.5 h-3.5" />
        </a>
      </div>
    </div>
  </div>
);
