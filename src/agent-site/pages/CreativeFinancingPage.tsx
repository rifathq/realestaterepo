import React from 'react';
import { Link } from 'react-router-dom';
import { AFFILIATION } from '../profile';
import { LeadForm } from '../components';

const OPTIONS = [
  {
    title: 'Seller financing',
    body: 'The seller acts as the lender, and the buyer pays the seller over time instead of a bank.',
    fit: "Buyers who don't fit a bank's box. Sellers who want steady income or a faster sale.",
  },
  {
    title: 'Subject-to existing loan',
    body: "The buyer takes title while the seller's mortgage stays in place, and the buyer makes its payments. It can keep a low interest rate.",
    fit: "Know the risk: the loan stays in the seller's name, and the lender can call it due after a transfer (the due-on-sale clause).",
  },
  {
    title: 'Lease option',
    body: 'Rent now, with the right to buy later at a price agreed today. Part of the rent can count toward the purchase if the contract says so.',
    fit: 'Buyers who need time to build credit or savings.',
  },
  {
    title: 'Wrap-around mortgage',
    body: "The seller's existing loan stays in place, and the seller finances the buyer with a new note that wraps around it.",
    fit: 'Sellers with a low-rate loan who want to earn on the spread. Carries the same due-on-sale risk.',
  },
  {
    title: 'Assumable loan',
    body: 'Many FHA, VA and USDA loans can be taken over by a qualified buyer with the lender’s approval, keeping the original rate.',
    fit: 'The lower-risk way to keep an existing rate, when the loan allows it.',
  },
  {
    title: 'Cash and quick close',
    body: 'A direct sale for cash, on your timeline, with no showings or repairs.',
    fit: 'Sellers who value speed and certainty over top price.',
  },
];

const SAFEGUARDS = [
  'Every term goes into a written contract, reviewed by a Virginia attorney or title company of your choice.',
  'Payments run through a third-party loan servicer, so both sides have a clean record.',
  'Seller financing follows federal and Virginia lending rules; a licensed mortgage loan originator is used where the law requires one.',
  'Subject-to and wrap deals come with a clear, written explanation of the due-on-sale risk.',
  'When I am a party to the deal, I tell you in writing that I am a licensee with an ownership interest.',
];

export const CreativeFinancingPage: React.FC = () => (
  <>
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Creative financing</div>
      <h1 className="mt-2 max-w-3xl text-4xl sm:text-5xl font-bold font-architectural text-stone-950 text-balance">
        More than one way to buy or sell a home
      </h1>
      <p className="mt-5 max-w-2xl text-lg text-stone-700 leading-relaxed">
        A bank loan isn't the only path. For some buyers and sellers a different structure works better: faster, more
        flexible, or the only way the numbers make sense. I do traditional sales and creative ones.
      </p>
      <p className="mt-3 text-sm text-stone-500">{AFFILIATION}.</p>

      <div className="mt-12 grid gap-px bg-stone-200 border border-stone-200 sm:grid-cols-2 lg:grid-cols-3">
        {OPTIONS.map((o) => (
          <div key={o.title} className="bg-white p-6 sm:p-7 flex flex-col">
            <h2 className="text-xl font-bold font-architectural text-stone-950">{o.title}</h2>
            <p className="mt-3 text-sm text-stone-700 leading-relaxed flex-1">{o.body}</p>
            <p className="mt-4 pt-4 border-t border-stone-100 text-xs text-stone-500 leading-relaxed">{o.fit}</p>
          </div>
        ))}
      </div>

      <div className="mt-14 grid gap-10 lg:grid-cols-12">
        <div className="lg:col-span-7">
          <h2 className="text-2xl font-bold font-architectural text-stone-950">How I keep it safe</h2>
          <ul className="mt-6 space-y-4">
            {SAFEGUARDS.map((s) => (
              <li key={s} className="flex gap-3 text-stone-800 leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 bg-stone-900 shrink-0" />
                {s}
              </li>
            ))}
          </ul>
          <p className="mt-8 text-sm text-stone-600 leading-relaxed border-l-2 border-stone-900 pl-4">
            I'm a real estate agent, not a lender, attorney or tax advisor. Creative financing isn't right for everyone,
            so please get independent legal and tax advice before you sign. The structures on this site describe how
            deals can work; they are not offers of credit.
          </p>
          <p className="mt-6 text-sm text-stone-600">
            See homes with flexible terms on the <Link to="/off-market" className="font-semibold text-stone-950 underline underline-offset-4">off-market page</Link>.
          </p>
        </div>
        <aside className="lg:col-span-5 self-start bg-white border border-stone-200 p-6 sm:p-8">
          <h2 className="text-xl font-bold font-architectural text-stone-950">Talk through your situation</h2>
          <p className="mt-1 mb-6 text-sm text-stone-600">Buying, selling or investing, tell me what you're working with.</p>
          <LeadForm compact defaultTopic="Creative financing" />
        </aside>
      </div>
    </div>
  </>
);
