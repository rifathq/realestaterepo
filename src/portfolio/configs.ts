import type { PortfolioConfig } from './types';

const IMG = (id: string, w = 1400) => `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=80`;

// Masud's real portfolio. Every fact here is real; add impact numbers only when they are your own.
export const MASUD: PortfolioConfig = {
  slug: 'masud',
  accent: '#d9b36b',
  person: {
    name: 'Masud Haque',
    role: 'Real estate agent & investor',
    place: 'Arlington, Virginia',
    mission: 'I help Northern Virginia families and investors buy, sell and hold property, with traditional deals and creative ones.',
    photo: '/agent/masud-portrait-dark.jpg',
    initials: 'MH',
  },
  ctas: { primary: { label: 'Work with me', href: '/contact' }, secondary: { label: 'See my story', href: '#story' } },
  intro: {
    quote: 'Real estate should make sense to the person signing.',
    body: [
      "I'm a Virginia-licensed real estate salesperson with eXp Realty and an investor based in Arlington. I buy, hold and sell in Northern Virginia, and I work with sellers, buyers, investors and renters.",
      'I also lead technology at Digents as Visionary & CTO, building AI tools for small businesses. The site you are reading runs on that work.',
    ],
    facts: [
      { label: 'Licence', value: 'Virginia Salesperson #0225276696' },
      { label: 'Brokerage', value: 'eXp Realty LLC' },
      { label: 'Focus', value: 'Investor-friendly deals, creative financing, rentals' },
      { label: 'Community', value: 'Member of the SubTo community' },
    ],
  },
  stats: {
    items: [
      { value: '7', label: 'Deal structures I work with' },
      { value: '4', label: 'Ways to work with me' },
      { value: '2025', label: 'Licensed in Virginia' },
    ],
  },
  story: {
    title: 'My story, chapter by chapter',
    chapters: [
      {
        year: '2025',
        title: 'Licensed in Virginia',
        body: 'Earned my Virginia real estate salesperson licence and started working with buyers and sellers across Northern Virginia.',
        media: { kind: 'video', src: '/hero-video.mp4', alt: 'Aerial view of a Northern Virginia neighbourhood' },
      },
      {
        year: '2025',
        title: 'Joined eXp Realty',
        body: 'Affiliated with eXp Realty LLC, so every client has a full brokerage behind the deal and a search of every home for sale.',
        media: { kind: 'image', src: '/agent/masud-blazer.jpg', alt: 'Masud Haque', focus: 'top' },
      },
      {
        year: 'Ongoing',
        title: 'Investor first',
        body: 'Buying, holding and renting here myself, and working creative structures like Seller Finance, SubTo and Hybrid. Member of the SubTo community.',
        media: { kind: 'image', src: IMG('photo-1605276374104-dee2a0ed3cd6'), alt: 'A brick home in Northern Virginia' },
      },
      {
        year: '2026',
        title: 'Helping homeowners in trouble',
        body: 'Wrote a plain-English guide for homeowners behind on their mortgage: free HUD counseling first, every option second, and the protections Virginia law gives them.',
        media: { kind: 'image', src: IMG('photo-1570129477492-45c003edd2be'), alt: 'A family home with a porch' },
      },
      {
        year: 'Ongoing',
        title: 'Building with Digents',
        body: 'As Visionary & CTO of Digents, I build AI tools that help small businesses work faster. This site, its compliance checks and its listing feed are part of that work.',
      },
    ],
  },
  work: { kind: 'listings', title: 'What I have now', intro: 'Off-market deals, rentals and listings, live from my site.' },
  media: {
    title: 'Videos',
    items: [{ kind: 'video', src: '/hero-video.mp4', title: 'Northern Virginia from above', alt: 'Aerial view of a Northern Virginia neighbourhood' }],
  },
  contact: {
    title: 'Have a property, a deal or a question?',
    body: 'Investor, seller, buyer or renter, tell me what you need. I reply by email, and only call or text if you say so.',
    cta: { label: 'Get in touch', href: '/contact' },
  },
  footer: {
    lines: [
      'Masud Haque, Real Estate Agent · Licensed Salesperson in Virginia #0225276696',
      'eXp Realty LLC · 800 Corporate Dr, Ste 301, Stafford, VA 22554 · 866-825-7169',
      'Information deemed reliable but not guaranteed.',
    ],
    equalHousing: true,
  },
};

// Sample profiles: fictional people that show the same template in other professions.
// No stock faces; the template draws a monogram panel for them.
export const SAMPLE_DOCTOR: PortfolioConfig = {
  slug: 'sample-doctor',
  sample: true,
  accent: '#2dd4bf',
  person: {
    name: 'Dr. Sarah Malik',
    role: 'Family physician',
    place: 'Fairfax, Virginia',
    mission: 'Unhurried, evidence-based care for the whole family, from newborn checkups to managing chronic conditions.',
    initials: 'SM',
  },
  ctas: { primary: { label: 'Book a visit', href: '#contact' }, secondary: { label: 'My approach', href: '#story' } },
  intro: {
    quote: 'Good medicine starts with listening.',
    body: [
      'I practise family medicine because I like knowing patients over years, not minutes. Most visits end with a plan we both understand.',
      'I see children and adults, in person and by video, and I coordinate with specialists when you need one.',
    ],
    facts: [
      { label: 'Specialty', value: 'Family medicine' },
      { label: 'Languages', value: 'English, Urdu' },
      { label: 'Visits', value: 'In person and telehealth' },
      { label: 'Patients', value: 'Accepting new patients' },
    ],
  },
  stats: {
    note: 'Sample figures for the template demo.',
    items: [
      { value: '15', label: 'Years in practice' },
      { value: '20k+', label: 'Patient visits' },
      { value: '3', label: 'Community clinics served' },
    ],
  },
  story: {
    title: 'How I got here',
    chapters: [
      { year: '2006', title: 'Medical school', body: 'Trained with a focus on primary care and preventive medicine.' },
      { year: '2010', title: 'Family medicine residency', body: 'Three years caring for every age, from the delivery room to the nursing home.' },
      { year: '2016', title: 'A neighbourhood practice', body: 'Opened a small practice built around longer visits and same-week appointments.' },
      { year: 'Today', title: 'Free screenings', body: 'Run monthly blood-pressure and diabetes screenings at local community centres.' },
    ],
  },
  work: {
    kind: 'cards',
    title: 'Care I provide',
    intro: 'Most of what a family needs, in one place.',
    items: [
      { title: 'Annual physicals', body: 'A full check, screenings due for your age, and a plan for the year.', tag: 'Adults' },
      { title: 'Chronic care', body: 'Diabetes, blood pressure and asthma, managed together over time.', tag: 'Ongoing' },
      { title: 'Children', body: 'Well-child visits, vaccines and sick visits.', tag: 'Kids' },
      { title: 'Telehealth', body: 'Follow-ups and quick questions by video.', tag: 'Remote' },
    ],
  },
  contact: { title: 'New patients welcome', body: 'Call the office or send a message to book your first visit.', cta: { label: 'Book a visit', href: 'mailto:office@example.com' } },
  footer: { lines: ['Sample profile for the Digents portfolio template. Not a real practice.'] },
};

export const SAMPLE_COMMUNITY: PortfolioConfig = {
  slug: 'sample-community',
  sample: true,
  accent: '#fb923c',
  person: {
    name: 'Imran Chowdhury',
    role: 'Social worker & community organizer',
    place: 'Prince William County, Virginia',
    mission: 'Connecting families to food, housing and opportunity, one neighbourhood at a time.',
    initials: 'IC',
  },
  ctas: { primary: { label: 'Volunteer with us', href: '#contact' }, secondary: { label: 'See the work', href: '#story' } },
  intro: {
    quote: 'Nobody in this county should face a hard month alone.',
    body: [
      'I have spent eight years as a social worker and organizer here, working with families who are one missed paycheck from losing their footing.',
      'Most of what we do is simple: show up, connect people to help that already exists, and fill the gaps with neighbours.',
    ],
    facts: [
      { label: 'Role', value: 'Licensed social worker' },
      { label: 'Focus', value: 'Food security, housing, youth' },
      { label: 'Area', value: 'Prince William County' },
      { label: 'Volunteers', value: 'Always welcome' },
    ],
  },
  stats: {
    note: 'Sample figures for the template demo.',
    items: [
      { value: '12,000', label: 'Meals delivered' },
      { value: '300', label: 'Young people mentored' },
      { value: '45', label: 'Families helped into housing' },
      { value: '8', label: 'Years of service' },
    ],
  },
  story: {
    title: 'The work, year by year',
    chapters: [
      { year: '2018', title: 'A weekend food drive', body: 'Started with one folding table and twelve volunteers outside a church hall.' },
      { year: '2020', title: 'Meals through the pandemic', body: 'Turned the drive into home delivery when families could not leave the house.', media: { kind: 'video', src: '/hero-video.mp4', alt: 'Neighbourhood from above' } },
      { year: '2022', title: 'Youth mentoring', body: 'Paired teenagers with local professionals for weekly study and career sessions.' },
      { year: '2024', title: 'A housing help desk', body: 'Opened a walk-in desk that helps families apply for rental assistance and vouchers.' },
      { year: 'Today', title: 'A volunteer network', body: 'Training neighbourhood leads so the work keeps going without any one person.' },
    ],
  },
  work: {
    kind: 'cards',
    title: 'Programs',
    intro: 'Where the time goes each week.',
    items: [
      { title: 'Food delivery', body: 'Weekly groceries delivered to families who cannot travel.', tag: 'Weekly' },
      { title: 'Youth mentoring', body: 'Study help and career talks for ages 14 to 19.', tag: 'Youth' },
      { title: 'Housing help desk', body: 'Applications for rental assistance and housing vouchers.', tag: 'Walk-in' },
    ],
  },
  media: {
    title: 'Videos',
    items: [{ kind: 'video', src: '/hero-video.mp4', title: 'Our neighbourhood (sample video)', alt: 'Neighbourhood from above' }],
  },
  contact: { title: 'Help, or get help', body: 'Volunteer an hour, donate a meal, or ask for support. Every message gets a reply.', cta: { label: 'Send a message', href: 'mailto:hello@example.com' } },
  footer: { lines: ['Sample profile for the Digents portfolio template. Not a real person.'] },
};

export const PORTFOLIOS: PortfolioConfig[] = [MASUD, SAMPLE_DOCTOR, SAMPLE_COMMUNITY];
