import React from 'react';
import { Phone } from 'lucide-react';
import { AGENT, FIRM, AFFILIATION, HUD_COUNSELING_PHONE } from '../profile';
import { LeadForm } from '../components';

// Federal MARS rule (12 CFR 1015) disclosures for anyone promoting help to avoid
// foreclosure, plus Virginia's foreclosure-rescue protections (Va. Code § 59.1-200.1).
const DISCLOSURES = [
  `${AGENT.name} and ${FIRM.shortName} are not associated with the government, and my services are not approved by the government or your lender.`,
  'Even if you work with me, your lender may not agree to change your loan.',
  'If you stop paying your mortgage, you could lose your home and damage your credit.',
  'I never charge upfront fees. I am paid only at settlement, and only if a sale happens.',
  'You may stop working with me at any time.',
];

const OPTIONS = [
  { title: 'Catch up or set up a repayment plan', body: 'Your servicer may let you pay the missed amount at once (reinstatement) or spread it over a few months.' },
  { title: 'Forbearance or loan modification', body: 'A pause or a permanent change to your loan terms, arranged with your servicer. A HUD-approved counselor can help you apply, for free.' },
  { title: 'Sell and keep your equity', body: 'If there is time, a traditional sale with me as your agent can pay off the loan and put the rest in your pocket.' },
  { title: 'Short sale', body: 'If you owe more than the home is worth, your lender may accept less than the full payoff.' },
  { title: 'Sell subject-to your loan', body: 'A buyer, sometimes me, takes over your payments while your loan stays in your name. It can stop the missed payments, but it carries real risks that I will explain in writing.' },
  { title: 'Deed in lieu of foreclosure', body: 'You hand the home back to the lender by agreement, which can be gentler on your credit than a foreclosure.' },
];

const PROMISES = [
  'I tell you in writing that I am a licensed agent and, if I would be the buyer, that I am buying for myself.',
  'If I agree to make your mortgage payments, that promise is in the written contract, and I make them. I never collect rent from your home while skipping your payments.',
  'Any option for you to buy the home back is in a written contract with the price and terms.',
  'No forced arbitration. You keep every right the Virginia Consumer Protection Act gives you.',
  'Please have an attorney review any agreement before you sign.',
];

export const ForeclosureHelpPage: React.FC = () => (
  <>
    <section className="bg-stone-950 text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-400 font-semibold">Behind on your mortgage?</div>
        <h1 className="mt-3 max-w-3xl text-4xl sm:text-6xl font-bold font-architectural leading-[1.05] text-balance">
          You have more options than you think.
        </h1>
        <p className="mt-5 max-w-2xl text-lg text-stone-300 leading-relaxed">
          If you've missed payments or received a foreclosure notice, the earlier you act, the more choices you have. Here
          they are, starting with the free ones.
        </p>
      </div>
    </section>

    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-7 space-y-12">
        <section className="border border-stone-300 bg-white p-6">
          <h2 className="text-sm font-semibold uppercase tracking-wide text-stone-950">Please read first</h2>
          <ul className="mt-4 space-y-2.5">
            {DISCLOSURES.map((d) => (
              <li key={d} className="flex gap-3 text-sm text-stone-800 leading-relaxed">
                <span className="mt-2 w-1.5 h-1.5 bg-stone-900 shrink-0" />
                {d}
              </li>
            ))}
          </ul>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-architectural text-stone-950">Free help first</h2>
          <div className="mt-5 grid sm:grid-cols-2 gap-4">
            <a href={`tel:${HUD_COUNSELING_PHONE.replace(/\D/g, '')}`} className="block border border-stone-200 bg-white p-5 hover:border-stone-900 transition-colors">
              <Phone className="w-5 h-5 text-stone-500" />
              <div className="mt-3 font-semibold text-stone-950">HUD-approved housing counselor</div>
              <div className="text-sm text-stone-600">Free, nationwide · {HUD_COUNSELING_PHONE}</div>
            </a>
            <div className="border border-stone-200 bg-white p-5">
              <Phone className="w-5 h-5 text-stone-500" />
              <div className="mt-3 font-semibold text-stone-950">Your mortgage servicer</div>
              <div className="text-sm text-stone-600">The number is on your monthly statement. Ask what options you qualify for.</div>
            </div>
          </div>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-architectural text-stone-950">Your options</h2>
          <ol className="mt-6 border-t border-stone-200">
            {OPTIONS.map((o, i) => (
              <li key={o.title} className="grid grid-cols-[3rem_1fr] gap-4 py-5 border-b border-stone-200">
                <span className="text-2xl font-bold font-architectural text-stone-300">{String(i + 1).padStart(2, '0')}</span>
                <div>
                  <h3 className="font-semibold text-stone-950">{o.title}</h3>
                  <p className="mt-1 text-sm text-stone-600 leading-relaxed">{o.body}</p>
                </div>
              </li>
            ))}
          </ol>
        </section>

        <section>
          <h2 className="text-2xl font-bold font-architectural text-stone-950">If I'm the buyer, you're protected</h2>
          <ul className="mt-5 space-y-3">
            {PROMISES.map((p) => (
              <li key={p} className="flex gap-3 text-stone-800 leading-relaxed">
                <span className="mt-2.5 w-1.5 h-1.5 bg-amber-500 shrink-0" />
                {p}
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-stone-500">{AFFILIATION}.</p>
        </section>
      </div>

      <aside className="lg:col-span-5 self-start lg:sticky lg:top-24 bg-white border border-stone-200 p-6 sm:p-8">
        <h2 className="text-xl font-bold font-architectural text-stone-950">Talk it through, privately</h2>
        <p className="mt-1 mb-6 text-sm text-stone-600">
          Tell me where things stand. No cost, no pressure, and nothing is shared without your say.
        </p>
        <LeadForm compact defaultTopic="Facing foreclosure" />
      </aside>
    </div>
  </>
);
