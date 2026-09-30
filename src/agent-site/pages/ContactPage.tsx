import React from 'react';
import { AGENT, FIRM } from '../profile';
import { LeadForm } from '../components';

export const ContactPage: React.FC = () => (
  <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-12 lg:grid-cols-12">
    <div className="lg:col-span-7">
      <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Contact</div>
      <h1 className="mt-2 text-4xl sm:text-5xl font-bold font-architectural text-stone-950">Let's talk</h1>
      <p className="mt-4 mb-10 text-lg text-stone-700 leading-relaxed">
        Buying, selling, or just have a question. Tell me a little and I'll reply by email.
      </p>
      <LeadForm />
    </div>
    <aside className="lg:col-span-5 lg:pt-24 space-y-8 text-sm">
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Email</div>
        <a href={`mailto:${AGENT.email}`} className="mt-2 block text-base font-semibold text-stone-950 break-words hover:underline underline-offset-4">
          {AGENT.email}
        </a>
      </div>
      <div>
        <div className="text-[11px] uppercase tracking-[0.2em] text-stone-500 font-semibold">Brokerage office</div>
        <div className="mt-2 text-stone-800 leading-relaxed">
          {FIRM.name}
          <br />
          {FIRM.street}
          <br />
          {FIRM.cityStateZip}
          <br />
          {FIRM.phone}
        </div>
      </div>
      <div className="border-l-2 border-stone-900 pl-4 text-stone-600 leading-relaxed">
        I only call or text if you tick the box on the form. You can change your mind at any time by replying STOP or
        emailing me.
      </div>
    </aside>
  </div>
);
