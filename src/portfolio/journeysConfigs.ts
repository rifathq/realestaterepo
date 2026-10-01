import type { JourneysConfig } from './types';

const U = (id: string, w = 1600) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Public sample: a fictional advocate with sample photos. Safe to deploy.
export const SAMPLE_JOURNEYS: JourneysConfig = {
  layout: 'journeys',
  slug: 'sample-journeys',
  sample: true,
  theme: {
    paper: '#F6F3EC', ink: '#13262B', muted: '#4A5B5F', accent: '#E0A13A', action: '#1F5560', deep: '#10221F',
    headingFont: 'DM Serif Display', bodyFont: 'DM Sans',
  },
  person: {
    name: 'Nadia Rahman',
    role: 'Diaspora community advocate',
    intro: 'Summits, town halls and community nights across four cities, shared as they happen.',
    initials: 'NR',
  },
  journeys: [
    {
      slug: 'diaspora-summit-london', title: 'Diaspora summit', date: '2026-05-16', place: 'London', coords: [51.5072, -0.1276],
      summary: 'Two days with community leaders on remittances, education and voting from abroad.',
      photos: [
        { src: U('photo-1505761671935-60b3a7427bad'), alt: 'Westminster and the Thames' },
        { src: U('photo-1540575467063-178a50c2df87'), alt: 'A full conference hall' },
        { src: U('photo-1475721027785-f74eccf877e2'), alt: 'A microphone on stage' },
        { src: U('photo-1513635269975-59663e0ac1ad'), alt: 'London from above' },
        { src: U('photo-1529655683826-aba9b3e77383'), alt: 'Big Ben at dusk' },
      ],
    },
    {
      slug: 'town-hall-new-york', title: 'Town hall with the community', date: '2026-03-08', place: 'New York', coords: [40.7128, -74.006],
      summary: 'An open evening to hear what families in Queens and the Bronx need most.',
      photos: [
        { src: U('photo-1485871981521-5b1fd3805eee'), alt: 'Manhattan at sunset' },
        { src: U('photo-1517457373958-b7bdd4587205'), alt: 'A crowd under string lights' },
        { src: U('photo-1496442226666-8d4d0e62e6e9'), alt: 'Times Square' },
        { src: U('photo-1534430480872-3498386e7856'), alt: 'The New York skyline' },
      ],
    },
    {
      slug: 'policy-meetings-washington', title: 'Policy meetings', date: '2025-10-21', place: 'Washington, DC', coords: [38.9072, -77.0369],
      summary: 'Meetings on visa backlogs and support for new arrivals.',
      photos: [
        { src: U('photo-1501466044931-62695aada8e9'), alt: 'The Capitol at the end of the avenue' },
        { src: U('photo-1515187029135-18ee286d815b'), alt: 'A meeting in a gallery room' },
        { src: U('photo-1523580494863-6f3031224c94'), alt: 'An evening event hall' },
      ],
    },
    {
      slug: 'youth-forum-toronto', title: 'Youth forum', date: '2025-07-12', place: 'Toronto', coords: [43.6532, -79.3832],
      summary: 'A day of workshops for young people starting careers far from home.',
      photos: [
        { src: U('photo-1517090504586-fde19ea6066f'), alt: 'Toronto skyline from the park' },
        { src: U('photo-1556761175-b413da4baf72'), alt: 'A workshop around laptops' },
        { src: U('photo-1559027615-cd4628902d4a'), alt: 'A volunteer at the venue' },
        { src: U('photo-1511578314322-379afb476865'), alt: 'The forum hall before doors opened' },
      ],
    },
    {
      slug: 'community-dinner-london', title: 'Community dinner', date: '2024-12-14', place: 'London', coords: [51.5072, -0.1276],
      summary: 'A winter dinner to thank the volunteers who made the year possible.',
      photos: [
        { src: U('photo-1528605248644-14dd04022da1'), alt: 'Friends around a long dinner table' },
        { src: U('photo-1469571486292-0ba58a3f068b'), alt: 'Hands joined in a circle' },
      ],
    },
  ],
  about: {
    body: [
      'Nadia works with diaspora families on education, remittances and civic participation.',
      'This is a sample profile: a fictional person with sample photos, showing the Journeys layout.',
    ],
  },
  footer: { lines: ['Sample profile for the Digents portfolio template. Not a real person; sample photos.'] },
};
