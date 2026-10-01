// A portfolio is one config. Every section is optional: leave it out and it does not render.
// The same template serves an agent, a doctor, a community worker or a creator.

export interface PortfolioMedia {
  kind: 'image' | 'video' | 'youtube';
  src: string; // image or video URL, or a YouTube video id
  alt: string;
  poster?: string;
  focus?: 'top' | 'center'; // where to keep the subject when the frame crops
}

export interface PortfolioConfig {
  slug: string;
  sample?: boolean; // shows a "Sample profile" badge everywhere
  accent: string; // one hex colour for highlights
  person: {
    name: string;
    role: string;
    place: string;
    mission: string;
    // A real photo, or omit it and the template draws a monogram panel instead of a stock face.
    photo?: string;
    initials: string;
  };
  ctas: { primary: { label: string; href: string }; secondary?: { label: string; href: string } };
  intro?: { quote: string; body: string[]; facts: { label: string; value: string }[] };
  stats?: { note?: string; items: { value: string; label: string }[] };
  story?: { title: string; chapters: { year: string; title: string; body: string; media?: PortfolioMedia }[] };
  work?:
    | { kind: 'listings'; title: string; intro: string }
    | { kind: 'cards'; title: string; intro: string; items: { title: string; body: string; tag?: string }[] };
  media?: { title: string; items: (PortfolioMedia & { title: string })[] };
  contact: { title: string; body: string; cta: { label: string; href: string } };
  footer: { lines: string[]; equalHousing?: boolean };
}

// "Journeys" layout: a photo-journey portfolio for people who travel, meet and share
// (community leaders, doctors on missions, organizers, creators). Light theme, albums first.
export interface JourneyPhoto {
  src: string;
  alt?: string; // falls back to "Photo n from <journey title>"
}

export interface Journey {
  slug: string;
  title: string;
  date?: string; // ISO date or just a year; leave out when unknown rather than guess
  place?: string;
  coords?: [number, number]; // lat, lng for the places map
  summary?: string;
  photos: JourneyPhoto[];
}

export interface JourneysTheme {
  paper: string; // page background
  ink: string; // main text
  muted: string; // secondary text, at least 4.5:1 on paper
  accent: string; // decorative fills (chips, rules, highlights)
  action: string; // buttons and links, white text on it at least 4.5:1
  deep: string; // footer background
  headingFont: string; // Google Fonts family
  bodyFont: string;
}

export interface JourneysConfig {
  layout: 'journeys';
  slug: string;
  sample?: boolean;
  // A private concept for a real person: built only in local development, never deployed.
  concept?: { note: string };
  theme: JourneysTheme;
  person: { name: string; role: string; org?: { name: string; url: string }; intro: string; photo?: string; initials: string };
  journeys: Journey[];
  about?: { body: string[] };
  links?: { label: string; href: string }[];
  footer: { lines: string[] };
}
