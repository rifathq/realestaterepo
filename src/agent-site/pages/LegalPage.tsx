import React from 'react';
import { AGENT, FIRM } from '../profile';
import { DemoNote, EqualHousingMark } from '../components';

type Kind = 'privacy' | 'terms' | 'fair-housing' | 'accessibility';

// Based on the policies eXp Realty's platform provides for Masud's eXp agent site
// (masudhaque.exprealty.com), kept in eXp's wording where it is true for this site.
// Changed only where that site works differently: no lender or marketing-partner
// sharing, requests go to Masud, and Virginia rather than Utah law.
const CONTACT = `${AGENT.email} or ${AGENT.phone || FIRM.phone}`;

const CONTENT: Record<Kind, { title: string; sections: { heading: string; body: string }[] }> = {
  privacy: {
    title: 'Privacy Policy',
    sections: [
      {
        heading: 'About this policy',
        body: `This privacy policy sets out how ${AGENT.name} of ${FIRM.name} uses and protects any information that you give when you use this website. I am committed to ensuring that your privacy is protected. Should I ask you to provide certain information by which you can be identified when using this website, you can be assured that it will only be used in accordance with this privacy statement. I may change this policy from time to time by updating this page. This policy is effective from 9/30/2026.`,
      },
      {
        heading: 'What I collect',
        body: 'What you type into a form on this site: your name, email address, phone number if you give it, and your message. If you tick the consent box, I also keep the consent wording and the time you agreed. To block spam, the site briefly checks the IP address a form is sent from.',
      },
      {
        heading: 'What I do with the information',
        body: `I use it to reply to your inquiry and to help you buy, sell or find a property. If you consent, eXp Realty and its independent contractor real estate professionals may contact you by email, phone or text, as the consent wording on the form describes.`,
      },
      {
        heading: 'Sharing',
        body: 'I will never sell your information. I do not share it with lenders or marketing partners unless you ask me to, for example for a mortgage pre-approval. Your mobile phone number will not be shared with third parties or affiliates for their marketing, and your opt-in consent to receive text messages will not be transferred to any third party. The companies that host and run this website process information only on my behalf.',
      },
      {
        heading: 'Calls and texts',
        body: `Your consent is not a condition of purchase, and you may revoke it at any time by replying to any of my texts to opt out, unsubscribing via email, or contacting me at ${CONTACT}. Standard message and data rates may apply. Please give a phone number that is your own.`,
      },
      {
        heading: 'Security',
        body: 'I am committed to ensuring that your information is secure. In order to prevent unauthorized access or disclosure, suitable physical, electronic and managerial procedures are in place to safeguard and secure the information collected online.',
      },
      {
        heading: 'Cookies',
        body: 'This site does not use advertising or tracking cookies. You can set your browser to decline cookies; the public pages work without them.',
      },
      {
        heading: 'Links to other websites',
        body: 'This website contains links to other websites, including my home search on masudhaque.exprealty.com. Once you use these links to leave this site, I do not have any control over that other website and cannot be responsible for the protection and privacy of any information you provide there. Those sites are not governed by this privacy statement; please read the privacy statement of the website in question.',
      },
      {
        heading: 'Controlling your personal information',
        body: `To see, correct or delete the information I hold about you, or to stop all contact, email or call me at ${CONTACT}. I will not treat you differently for making a request.`,
      },
      {
        heading: 'Visitors outside the United States',
        body: 'This site is intended for people in the United States. If you are a resident of the European Union and use the forms on this site, you consent to the collection of the information you submit, such as your name, email address and phone number.',
      },
    ],
  },
  terms: {
    title: 'Terms of Use',
    sections: [
      {
        heading: 'Please read these terms',
        body: 'Please read these terms carefully before using this site. The site is free to use. By using it you agree to these terms; if you do not agree, please do not use the site. I may update these terms at any time, and the version posted here is the one that applies.',
      },
      {
        heading: 'Who runs this site',
        body: `This site is advertising by ${AGENT.name}, a real estate salesperson licensed in Virginia (#${AGENT.licence}), affiliated with ${FIRM.name}, ${FIRM.street}, ${FIRM.cityStateZip}, ${FIRM.phone}.`,
      },
      {
        heading: 'Calls, texts and consent',
        body: `If you tick the consent box on a form, you agree to receive marketing communications about real estate brokerage services and properties you may buy, sell or rent, by email, telephone or text, including by automated technology, from eXp Realty and its independent contractor real estate professionals. Your consent is not a condition of purchase, and you may revoke it at any time by replying to a text to opt out, unsubscribing via email, or contacting me at ${CONTACT}. Standard message and data rates may apply. You certify that the phone number you give is your own.`,
      },
      {
        heading: 'Listing information',
        body: 'Listing details are believed accurate but are not guaranteed. Homes may go under contract or be withdrawn at any time. Nothing on this site is an offer or a contract.',
      },
      {
        heading: 'Copyright',
        body: 'The content, organization, graphics and design of this site are protected by copyright and other intellectual property laws. Copying, reproducing or republishing any part of the site without prior written permission is not allowed.',
      },
      {
        heading: 'Changes to content',
        body: 'I may edit or delete any content on this site, including these terms, at any time without notice.',
      },
      {
        heading: 'Disclaimer',
        body: 'The content and services on this site are provided "as is" and "as available", without warranties of any kind, express or implied. The information is for general purposes only and is not professional advice. It is your responsibility to evaluate the accuracy and completeness of any information on this site or on any website it links to.',
      },
      {
        heading: 'Limits',
        body: 'To the extent the law allows, I am not liable for any indirect, incidental, special or consequential damages that result from using or being unable to use this site, including damage caused by viruses in any file you download.',
      },
      {
        heading: 'Indemnification',
        body: `You agree to indemnify and hold harmless ${AGENT.name} and ${FIRM.name} from any claim, loss or expense, including reasonable attorney's fees, arising from your violation of these terms or your use of the site.`,
      },
      {
        heading: 'Third-party websites',
        body: `Links to other websites, including my home search on masudhaque.exprealty.com, are provided for convenience. Those sites have their own terms and privacy policies, and I am not responsible for their content. ${FIRM.shortName}'s home search is operated under its own terms.`,
      },
      {
        heading: 'Submissions',
        body: 'Suggestions and ideas you send about this site may be used without any obligation to you.',
      },
      {
        heading: 'Governing law',
        body: 'These terms are governed by the laws of the Commonwealth of Virginia.',
      },
    ],
  },
  accessibility: {
    title: 'Accessibility',
    sections: [
      {
        heading: 'My commitment',
        body: 'I want everyone, including people with disabilities, to be able to use this website. I aim to meet the Web Content Accessibility Guidelines (WCAG) 2.1 at level AA.',
      },
      {
        heading: 'Need help?',
        body: `Should you require assistance in navigating this website or searching for real estate, please call me at ${AGENT.phone || FIRM.phone} or email ${AGENT.email}.`,
      },
      {
        heading: 'Tell me what is hard to use',
        body: 'If any part of this site is hard to use with your device or assistive technology, let me know. I will fix it or get you the information another way.',
      },
    ],
  },
  'fair-housing': {
    title: 'Fair Housing Statement',
    sections: [
      {
        heading: 'Fair Housing Act',
        body: `${AGENT.name} and ${FIRM.name} fully support the principles of the Fair Housing Act (Title VIII of the Civil Rights Act of 1968), as amended, which generally prohibits discrimination in the sale, rental and financing of dwellings, and in other housing-related transactions, based on race, color, national origin, religion, sex, familial status (including children under the age of 18 living with parents or legal custodians, pregnant women, and people securing custody of children under the age of 18), and handicap (disability).`,
      },
      {
        heading: 'Virginia Fair Housing Law',
        body: 'Virginia law also protects elderliness, source of funds, sexual orientation, gender identity and military status.',
      },
      {
        heading: 'Equal housing opportunity',
        body: 'I am pledged to the letter and spirit of U.S. policy for the achievement of equal housing opportunity throughout the nation, and committed to an environment of diversity in everything I do.',
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
      <DemoNote>Based on the policies on your eXp agent site, changed only where this site works differently. Have your eXp broker review before launch.</DemoNote>
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
