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
