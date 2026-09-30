import React from 'react';
import { LeadForm } from '../components';

const STEPS = [
  { title: 'We talk', body: 'What you need, your timing, and what matters most to you in a sale.' },
  { title: 'Pricing from recent sales', body: 'I pull comparable sales near you and walk you through them, so the price makes sense to you.' },
  { title: 'Preparation', body: 'Which repairs are worth doing, what to leave alone, staging and photography.' },
  {
    title: 'Listing',
    body: 'Your home goes into Bright, the shared listing service local agents use, within 2 days of signing the listing agreement. Coming Soon is available if you need time to prepare.',
  },
  { title: 'Offers to closing', body: 'Every offer reviewed with you line by line, then contract to closing with one point of contact.' },
];

export const SellingPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-14 lg:grid-cols-12">
    <div className="lg:col-span-7">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Selling</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950">Selling your home</h1>
      <p className="mt-5 text-lg text-stone-700 leading-relaxed">A clear plan, an honest price, and no surprises on the way to closing.</p>
      <ol className="mt-10 space-y-0 border-t border-stone-200">
        {STEPS.map((s, i) => (
          <li key={s.title} className="grid grid-cols-[3rem_1fr] gap-4 py-6 border-b border-stone-200">
            <span className="text-2xl font-bold font-architectural text-stone-300">{String(i + 1).padStart(2, '0')}</span>
            <div>
              <h2 className="font-semibold text-stone-950">{s.title}</h2>
              <p className="mt-1 text-sm text-stone-600 leading-relaxed">{s.body}</p>
            </div>
          </li>
        ))}
      </ol>
    </div>
    <aside className="lg:col-span-5 self-start lg:sticky lg:top-24 bg-white border border-stone-200 p-6 sm:p-8">
      <h2 className="text-xl font-bold font-architectural text-stone-950">Talk about selling</h2>
      <p className="mt-1 mb-6 text-sm text-stone-600">Tell me about your home and your timing. No obligation.</p>
      <LeadForm compact defaultTopic="Selling a home" />
    </aside>
  </div>
);
