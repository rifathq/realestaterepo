import type { JourneysConfig } from '../types';

// Concept preview for Dr. Hasanat M. Husain, built from photos published on vfgb.org.
// On UAT at MSD's request (2026-10-01), unlisted and clearly labelled as a concept, so it is
// never mistaken for his official site. Titles are VfGB's own; places and dates appear only
// where the titles state them. Replace with his originals and confirmed details once he agrees.
export const HASANAT_CONCEPT: JourneysConfig = {
  layout: 'journeys',
  slug: 'hasanat-concept',
  concept: { note: 'Concept preview by Digents for Dr. Hasanat M. Husain. Not his official site. Photos from vfgb.org, shown for review.' },
  theme: {
    paper: '#FBF7F7', ink: '#3E2A36', muted: '#6B4A5C', accent: '#E4A196', action: '#6E2E57', deep: '#2A1C24',
    headingFont: 'Nunito Sans', bodyFont: 'Lora',
  },
  person: {
    name: 'Dr. Hasanat M. Husain',
    role: 'President, Voice for Global Bangladeshis',
    org: { name: 'Voice for Global Bangladeshis', url: 'https://vfgb.org/' },
    intro: 'Meetings, gatherings and moments from the work of Voice for Global Bangladeshis, shared as they happen.',
    initials: 'HH',
  },
  journeys: [
  {
    "slug": "vfgb-president-dr-hasanat-m-husain-engages-in-key-official-m",
    "title": "VfGB President Dr. Hasanat M. Husain Engages in Key Official Meetings in Dhaka",
    "photos": [
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/Dr.-Hasanat-Husain-Engages-in-Key-Official-Meetings-in-Dhaka7.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/Dr.-Hasanat-Husain-Engages-in-Key-Official-Meetings-in-Dhaka5.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/Dr.-Hasanat-Husain-Engages-in-Key-Official-Meetings-in-Dhaka2.jpeg"
      }
    ],
    "place": "Dhaka",
    "coords": [
      23.8103,
      90.4125
    ]
  },
  {
    "slug": "vfgb-delegation-meets-opposition-leader-and-ameer-of-banglad",
    "title": "VfGB Delegation Meets Opposition Leader and Ameer of Bangladesh Jamaat-e-Islami Dr. Shafiqur Rahman",
    "photos": [
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/VfGB-Meets-Leader-of-Opposition5.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/VfGB-Meets-Leader-of-Opposition8.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/06/VfGB-Meets-Leader-of-Opposition1.jpeg"
      }
    ]
  },
  {
    "slug": "vfgb-delegation-meets-chief-advisor-prof-dr-muhammad-yunus",
    "title": "VfGB Delegation Meets Chief Advisor Prof. Dr. Muhammad Yunus",
    "photos": [
      {
        "src": "https://vfgb.org/wp-content/uploads/2024/12/VfGBs-courtesy-call-at-the-State-Guest-House-Jamuna.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2024/12/VfGBs-courtesy-call-at-the-State-Guest-House-Jamuna-1.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2024/12/VfGBs-courtesy-call-at-the-State-Guest-House-Jamuna-2.jpg"
      }
    ]
  },
  {
    "slug": "celebrating-the-50th-anniversary-of-bangladesh-s-independenc",
    "title": "Celebrating the 50th Anniversary of Bangladesh's Independence",
    "photos": [
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/VfGB-50-Years-of-Bangladesh17.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/VfGB-50-Years-of-Bangladesh11.jpeg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2022/03/WhatsApp-Image-2026-05-20-at-8.40.34-PM-7.jpeg"
      }
    ]
  },
  {
    "slug": "vfgb-residential-dhaka-2025",
    "title": "VfGB Residential Dhaka 2025",
    "photos": [
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image030.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image011.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image036.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image038.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image035.jpg"
      },
      {
        "src": "https://vfgb.org/wp-content/uploads/2026/05/image028.jpg"
      }
    ],
    "date": "2025",
    "place": "Dhaka",
    "coords": [
      23.8103,
      90.4125
    ]
  }
],
  footer: { lines: ['Concept preview by Digents, not the official site of Dr. Hasanat M. Husain or Voice for Global Bangladeshis.', 'Photos from vfgb.org, shown for review. Dates and places to confirm.'] },
};
