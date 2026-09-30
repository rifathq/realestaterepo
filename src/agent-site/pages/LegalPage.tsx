import React from 'react';
import { AGENT, FIRM } from '../profile';
import { DemoNote, EqualHousingMark } from '../components';

type Kind = 'privacy' | 'terms' | 'fair-housing';

const CONTENT: Record<Kind, { title: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'What I collect',
        body: 'When you use a form on this site, I collect what you type: your name, email address, phone number if you give it, and your message. I also record whether you agreed to be called or texted, and when.',
      },
      {
        heading: 'How I use it',
        body: `Only to reply to your inquiry and help with your real estate needs. Your details go to ${AGENT.name} at ${FIRM.name}. I don't sell or rent your information.`,
      },
      {
        heading: 'Calls and texts',
        body: 'I call or text only if you tick the consent box. Reply STOP to any text, or email me, and I will stop.',
      },
      {
        heading: 'Keeping and deleting',
        body: `I keep inquiries as long as needed to serve you and to meet ${FIRM.shortName}'s record-keeping duties. To see or delete your information, email ${AGENT.email}.`,
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: [
      {
        heading: 'About this site',
        body: `This site is advertising by ${AGENT.name}, a real estate salesperson licensed in Virginia (#${AGENT.licence}), affiliated with ${FIRM.name}, ${FIRM.street}, ${FIRM.cityStateZip}, ${FIRM.phone}.`,
      },
      {
        heading: 'Listing information',
        body: 'Listing details are believed accurate but are not guaranteed. Homes may go under contract or be withdrawn at any time. Nothing on this site is an offer or a contract.',
      },
      {
        heading: 'Other sites',
        body: `"Search all homes" opens ${FIRM.shortName}'s home search, which ${FIRM.shortName} operates under its own terms.`,
      },
    ],
  },
  'fair-housing': {
    title: 'Fair Housing',
    sections: [
      {
        heading: 'My commitment',
        body: 'I am pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation.',
      },
      {
        heading: 'Protected under federal and Virginia law',
        body: 'I do not discriminate on the basis of race, color, religion, national origin, sex, elderliness, familial status, source of funds, sexual orientation, gender identity, military status, or disability.',
      },
      {
        heading: 'Reporting a concern',
        body: 'You can contact the Virginia Fair Housing Office or the U.S. Department of Housing and Urban Development (HUD).',
      },
    ],
  },
};

export const LegalPage: React.FC<{ kind: Kind }> = ({ kind }) => {
  const page = CONTENT[kind];
  return (
    <div className="max-w-3xl mx-auto px-5 sm:px-8 py-14 sm:py-20">
      <DemoNote>Draft for review by your eXp broker before launch.</DemoNote>
      <div className="mt-10 flex items-center gap-4">
        {kind === 'fair-housing' && <EqualHousingMark className="w-12 h-12 text-stone-900 shrink-0" />}
        <h1 className="text-4xl sm:text-5xl font-bold font-architectural text-stone-950">{page.title}</h1>
      </div>
      <div className="mt-10 space-y-8">
        {page.sections.map((s) => (
          <section key={s.heading}>
            <h2 className="text-lg font-semibold text-stone-950">{s.heading}</h2>
            <p className="mt-2 text-stone-700 leading-relaxed">{s.body}</p>
          </section>
        ))}
      </div>
    </div>
  );
};
