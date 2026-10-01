import React, { useEffect, useRef, useState } from 'react';
import { Link, useParams } from 'react-router-dom';
import { ArrowDown, ArrowRight, Play } from 'lucide-react';
import type { PortfolioConfig, PortfolioMedia } from './types';
import { MASUD, PORTFOLIOS } from './configs';
import { withBase } from '../lib/base';
import { useListings } from '../agent-site/useListings';
import { EqualHousingMark, ListingCard } from '../agent-site/components';
import { DIGENTS_CONTACT_URL, DIGENTS_URL } from '../agent-site/profile';

const src = (s: string) => (s.startsWith('/') ? withBase(s) : s);

// Internal paths use the router, "#" jumps scroll, everything else is a plain link.
const Go: React.FC<{ href: string; className?: string; children: React.ReactNode }> = ({ href, className, children }) =>
  href.startsWith('/') ? (
    <Link to={href} className={className}>{children}</Link>
  ) : (
    <a href={href} className={className} {...(href.startsWith('http') ? { target: '_blank', rel: 'noreferrer' } : {})}>{children}</a>
  );

const SampleBadge: React.FC = () => (
  <span className="inline-flex items-center border border-white/30 text-white/80 text-[11px] font-semibold uppercase tracking-[0.18em] px-2.5 py-1">
    Sample profile
  </span>
);

// No stock faces: people without a real photo get a designed monogram panel.
const Monogram: React.FC<{ initials: string; caption?: string }> = ({ initials, caption }) => (
  <div className="relative w-full h-full overflow-hidden bg-stone-900">
    <div className="absolute inset-0 opacity-60" style={{ background: 'radial-gradient(120% 80% at 70% 20%, var(--accent), transparent 60%)' }} />
    <div className="absolute inset-0" style={{ backgroundImage: 'repeating-radial-gradient(circle at 70% 20%, rgba(255,255,255,0.06) 0 1px, transparent 1px 28px)' }} />
    <div className="absolute inset-0 flex items-center justify-center">
      <span className="font-editorial text-[9rem] sm:text-[11rem] leading-none text-white/90">{initials}</span>
    </div>
    {caption && <span className="absolute bottom-4 left-4 text-[11px] uppercase tracking-[0.18em] text-white/60">{caption}</span>}
  </div>
);

const Media: React.FC<{ media: PortfolioMedia; className?: string }> = ({ media, className = '' }) => {
  const [playing, setPlaying] = useState(false);
  if (media.kind === 'image')
    return <img src={src(media.src)} alt={media.alt} loading="lazy" className={`w-full h-full object-cover ${media.focus === 'top' ? 'object-top' : ''} ${className}`} />;
  if (media.kind === 'video')
    return <video src={src(media.src)} poster={media.poster && src(media.poster)} autoPlay muted loop playsInline aria-label={media.alt} className={`w-full h-full object-cover ${className}`} />;
  return playing ? (
    <iframe
      src={`https://www.youtube-nocookie.com/embed/${media.src}?autoplay=1`}
      title={media.alt}
      allow="autoplay; encrypted-media; picture-in-picture"
      allowFullScreen
      className={`w-full h-full ${className}`}
    />
  ) : (
    <button type="button" onClick={() => setPlaying(true)} className={`relative w-full h-full ${className}`} aria-label={`Play ${media.alt}`}>
      <img src={`https://i.ytimg.com/vi/${media.src}/hqdefault.jpg`} alt="" className="w-full h-full object-cover" />
      <span className="absolute inset-0 flex items-center justify-center">
        <span className="w-16 h-16 rounded-full bg-black/70 flex items-center justify-center"><Play className="w-7 h-7 text-white" /></span>
      </span>
    </button>
  );
};

const Kicker: React.FC<{ children: React.ReactNode }> = ({ children }) => (
  <div className="text-[11px] sm:text-xs uppercase tracking-[0.24em] font-semibold text-[var(--accent)]">{children}</div>
);

const Header: React.FC<{ cfg: PortfolioConfig; demo?: boolean }> = ({ cfg, demo }) => {
  const [solid, setSolid] = useState(false);
  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener('scroll', onScroll, { passive: true });
    return () => window.removeEventListener('scroll', onScroll);
  }, []);
  return (
    <header className={`fixed top-0 inset-x-0 z-40 transition-colors ${solid ? 'bg-black/85 backdrop-blur-md border-b border-white/10' : 'bg-transparent'}`}>
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
        <a href="#top" className="flex items-center gap-3 min-h-11">
          <span className="w-9 h-9 border border-[var(--accent)] text-[var(--accent)] flex items-center justify-center font-editorial text-lg">{cfg.person.initials}</span>
          <span className="font-semibold text-white text-sm sm:text-base">{cfg.person.name}</span>
        </a>
        <Go href={cfg.ctas.primary.href} className="inline-flex items-center min-h-11 bg-[var(--accent)] text-black text-sm font-semibold px-4 hover:brightness-110 transition">
          {cfg.ctas.primary.label}
        </Go>
      </div>
      {demo && <TemplateSwitcher current={cfg.slug} />}
    </header>
  );
};

const Hero: React.FC<{ cfg: PortfolioConfig }> = ({ cfg }) => (
  <section id="top" className="relative min-h-[100svh] bg-black text-white pt-[6.5rem]">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 min-h-[calc(100svh-6.5rem)] grid gap-6 lg:gap-8 lg:grid-cols-12 items-end pb-10 sm:pb-16">
      <div className="order-2 lg:order-1 lg:col-span-7 pb-2">
        {cfg.sample && <div className="mb-5"><SampleBadge /></div>}
        <Kicker>{cfg.person.role} · {cfg.person.place}</Kicker>
        <h1 className="mt-4 font-editorial text-6xl sm:text-7xl lg:text-8xl leading-[0.92] tracking-tight text-balance">{cfg.person.name}</h1>
        <p className="mt-6 max-w-xl text-lg sm:text-xl text-stone-300 leading-relaxed">{cfg.person.mission}</p>
        <div className="mt-8 flex flex-col sm:flex-row gap-3">
          <Go href={cfg.ctas.primary.href} className="inline-flex justify-center items-center min-h-12 bg-[var(--accent)] text-black font-semibold px-7 hover:brightness-110 transition">
            {cfg.ctas.primary.label}
          </Go>
          {cfg.ctas.secondary && (
            <Go href={cfg.ctas.secondary.href} className="inline-flex justify-center items-center gap-2 min-h-12 border border-white/30 hover:border-white text-white font-semibold px-7 transition">
              {cfg.ctas.secondary.label} <ArrowDown className="w-4 h-4" />
            </Go>
          )}
        </div>
      </div>
      <div className="order-1 lg:order-2 lg:col-span-5">
        <div className="relative aspect-[4/5] max-h-[42svh] lg:max-h-none mx-auto w-auto lg:w-full max-w-sm lg:max-w-none overflow-hidden">
          {cfg.person.photo ? (
            <>
              <img src={src(cfg.person.photo)} alt={cfg.person.name} className="w-full h-full object-cover object-top" />
              <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-black to-transparent" />
            </>
          ) : (
            <Monogram initials={cfg.person.initials} caption="Designed panel, no stock photo" />
          )}
          <div className="absolute top-0 left-0 w-16 h-px bg-[var(--accent)]" />
          <div className="absolute top-0 left-0 h-16 w-px bg-[var(--accent)]" />
        </div>
      </div>
    </div>
  </section>
);

const Intro: React.FC<{ intro: NonNullable<PortfolioConfig['intro']> }> = ({ intro }) => (
  <section className="bg-black text-white border-t border-white/10">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28 grid gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        <Kicker>About</Kicker>
        <blockquote className="mt-5 font-editorial text-3xl sm:text-4xl leading-tight text-white">
          <span className="text-[var(--accent)]">“</span>
          {intro.quote}
          <span className="text-[var(--accent)]">”</span>
        </blockquote>
      </div>
      <div className="lg:col-span-7 space-y-5 text-lg text-stone-300 leading-relaxed">
        {intro.body.map((p) => (
          <p key={p}>{p}</p>
        ))}
        <dl className="pt-6 grid sm:grid-cols-2 gap-px bg-white/10 border border-white/10">
          {intro.facts.map((f) => (
            <div key={f.label} className="bg-black p-4">
              <dt className="text-[11px] uppercase tracking-[0.18em] text-stone-500">{f.label}</dt>
              <dd className="mt-1 text-sm text-white">{f.value}</dd>
            </div>
          ))}
        </dl>
      </div>
    </div>
  </section>
);

const Stats: React.FC<{ stats: NonNullable<PortfolioConfig['stats']> }> = ({ stats }) => (
  <section className="bg-stone-950 text-white border-y border-white/10">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-16 sm:py-20">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <Kicker>By the numbers</Kicker>
        {stats.note && <span className="text-xs text-stone-500">{stats.note}</span>}
      </div>
      <div className={`mt-8 grid gap-8 grid-cols-2 ${stats.items.length > 3 ? 'lg:grid-cols-4' : 'lg:grid-cols-3'}`}>
        {stats.items.map((s) => (
          <div key={s.label} className="border-t border-white/15 pt-5">
            <div className="font-editorial text-5xl sm:text-6xl text-[var(--accent)] leading-none">{s.value}</div>
            <div className="mt-3 text-sm text-stone-400">{s.label}</div>
          </div>
        ))}
      </div>
    </div>
  </section>
);

// Full-height chapters that snap into place, with a progress bar that follows the reader.
const Story: React.FC<{ story: NonNullable<PortfolioConfig['story']> }> = ({ story }) => {
  const [active, setActive] = useState(0);
  const refs = useRef<(HTMLElement | null)[]>([]);
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(Number((e.target as HTMLElement).dataset.index))),
      { rootMargin: '-45% 0px -45% 0px' },
    );
    refs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, [story]);
  const total = story.chapters.length;

  return (
    <section id="story" className="bg-black text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 pt-20 sm:pt-28">
        <Kicker>Story</Kicker>
        <h2 className="mt-3 font-editorial text-4xl sm:text-6xl leading-tight">{story.title}</h2>
      </div>
      <div className="sticky top-[6.5rem] z-30 bg-black/85 backdrop-blur-md border-b border-white/10 mt-10">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 h-11 flex items-center gap-4">
          <span className="text-xs text-stone-400 whitespace-nowrap">Chapter {active + 1} of {total}</span>
          <div className="flex-1 h-px bg-white/15 relative">
            <div className="absolute inset-y-0 left-0 bg-[var(--accent)] transition-all duration-500" style={{ width: `${((active + 1) / total) * 100}%`, height: 2, top: -0.5 }} />
          </div>
        </div>
      </div>
      {story.chapters.map((c, i) => (
        <article
          key={c.title}
          ref={(el) => {
            refs.current[i] = el;
          }}
          data-index={i}
          className="snap-start min-h-[88svh] flex items-center border-b border-white/10"
        >
          <div className={`max-w-6xl mx-auto px-5 sm:px-8 py-16 w-full grid gap-10 lg:grid-cols-12 items-center`}>
            <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-2' : ''}`}>
              <div className="flex items-center gap-4">
                <span className="font-editorial text-6xl sm:text-7xl leading-none text-transparent" style={{ WebkitTextStroke: '1px var(--accent)' }}>
                  {String(i + 1).padStart(2, '0')}
                </span>
                <span className="text-xs uppercase tracking-[0.2em] text-[var(--accent)] border border-[var(--accent)]/50 px-2.5 py-1">{c.year}</span>
              </div>
              <h3 className="mt-6 font-editorial text-4xl sm:text-5xl leading-tight">{c.title}</h3>
              <p className="mt-5 text-lg text-stone-300 leading-relaxed max-w-xl">{c.body}</p>
            </div>
            <div className={`lg:col-span-6 ${i % 2 ? 'lg:order-1' : ''}`}>
              <div className="aspect-[4/3] overflow-hidden bg-stone-900">
                {c.media ? (
                  <Media media={c.media} />
                ) : (
                  <div className="w-full h-full flex items-center justify-center" style={{ background: 'radial-gradient(90% 90% at 30% 30%, color-mix(in srgb, var(--accent) 35%, transparent), transparent 70%)' }}>
                    <span className="font-editorial text-7xl sm:text-8xl text-white/85">{c.year}</span>
                  </div>
                )}
              </div>
            </div>
          </div>
        </article>
      ))}
    </section>
  );
};

const Work: React.FC<{ work: NonNullable<PortfolioConfig['work']> }> = ({ work }) => {
  const { listings } = useListings();
  const items =
    work.kind === 'listings'
      ? [
          ...(listings || []).filter((l) => l.offMarket),
          ...(listings || []).filter((l) => l.listingType === 'rent' && l.status !== 'rented'),
          ...(listings || []).filter((l) => !l.offMarket && l.listingType !== 'rent' && l.status !== 'sold'),
        ].slice(0, 6)
      : [];
  return (
    <section className="bg-stone-950 text-white">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <div>
            <Kicker>Work</Kicker>
            <h2 className="mt-3 font-editorial text-4xl sm:text-5xl">{work.title}</h2>
            <p className="mt-3 text-stone-400 max-w-xl">{work.intro}</p>
          </div>
          {work.kind === 'listings' && (
            <Link to="/" className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold text-[var(--accent)]">
              Everything on my site <ArrowRight className="w-4 h-4" />
            </Link>
          )}
        </div>
        {work.kind === 'listings' ? (
          <div className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
            {listings === null ? [0, 1, 2].map((i) => <div key={i} className="aspect-[4/5] bg-white/5 animate-pulse" />) : items.map((l) => <ListingCard key={l.id} listing={l} />)}
          </div>
        ) : (
          <div className="mt-10 grid gap-px bg-white/10 border border-white/10 sm:grid-cols-2 lg:grid-cols-4">
            {work.items.map((it) => (
              <div key={it.title} className="bg-stone-950 p-6 flex flex-col">
                {it.tag && <span className="self-start text-[11px] uppercase tracking-[0.18em] text-[var(--accent)]">{it.tag}</span>}
                <h3 className="mt-3 text-xl font-semibold">{it.title}</h3>
                <p className="mt-2 text-sm text-stone-400 leading-relaxed">{it.body}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};

const Videos: React.FC<{ media: NonNullable<PortfolioConfig['media']> }> = ({ media }) => (
  <section className="bg-black text-white border-t border-white/10">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-20 sm:py-28">
      <Kicker>Media</Kicker>
      <h2 className="mt-3 font-editorial text-4xl sm:text-5xl">{media.title}</h2>
      <div className="mt-10 grid gap-6 sm:grid-cols-2">
        {media.items.map((m) => (
          <figure key={m.title}>
            <div className="aspect-video overflow-hidden bg-stone-900">
              <Media media={m} />
            </div>
            <figcaption className="mt-3 text-sm text-stone-400">{m.title}</figcaption>
          </figure>
        ))}
      </div>
    </div>
  </section>
);

const Contact: React.FC<{ cfg: PortfolioConfig }> = ({ cfg }) => (
  <section id="contact" className="bg-black text-white border-t border-white/10">
    <div className="max-w-4xl mx-auto px-5 sm:px-8 py-24 sm:py-32 text-center">
      <h2 className="font-editorial text-4xl sm:text-6xl leading-tight text-balance">{cfg.contact.title}</h2>
      <p className="mt-5 text-lg text-stone-300 max-w-2xl mx-auto">{cfg.contact.body}</p>
      <Go href={cfg.contact.cta.href} className="mt-10 inline-flex justify-center items-center min-h-12 bg-[var(--accent)] text-black font-semibold px-8 hover:brightness-110 transition">
        {cfg.contact.cta.label}
      </Go>
    </div>
  </section>
);

const Footer: React.FC<{ cfg: PortfolioConfig }> = ({ cfg }) => (
  <footer className="bg-stone-950 text-stone-500 border-t border-white/10">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 py-10 flex flex-col sm:flex-row gap-6 justify-between">
      <div className="space-y-1 text-xs leading-relaxed">
        {cfg.footer.lines.map((l) => (
          <p key={l}>{l}</p>
        ))}
      </div>
      <div className="flex items-start gap-3 text-xs">
        {cfg.footer.equalHousing && <EqualHousingMark className="w-8 h-8 text-stone-400 shrink-0" />}
        <p>
          Website by{' '}
          <a href={DIGENTS_URL} target="_blank" rel="noreferrer" className="font-semibold text-stone-300 hover:text-white">Digents</a>
          {' · '}
          <a href={DIGENTS_CONTACT_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2 hover:text-white">Want a site like this?</a>
        </p>
      </div>
    </div>
  </footer>
);

// Demo only: a slim row under the header to flip between profiles.
function TemplateSwitcher({ current }: { current: string }) {
  return (
    <nav aria-label="Template demo" className="border-t border-white/10 bg-white/[0.04]">
      <div className="max-w-6xl mx-auto px-5 sm:px-8 h-10 flex items-center gap-1 text-xs overflow-x-auto no-scrollbar">
        <span className="pr-2 text-stone-500 whitespace-nowrap">Template demo</span>
        {PORTFOLIOS.map((p) => (
          <Link
            key={p.slug}
            to={p.slug === 'masud' ? '/portfolio' : `/portfolio/${p.slug}`}
            className={`whitespace-nowrap min-h-8 inline-flex items-center px-3 font-semibold ${p.slug === current ? 'bg-white text-black' : 'text-stone-300 hover:text-white'}`}
          >
            {p.slug === 'masud' ? 'Masud' : p.slug === 'sample-doctor' ? 'Doctor' : 'Community'}
          </Link>
        ))}
      </div>
    </nav>
  );
}

export const PortfolioPage: React.FC = () => {
  const { slug } = useParams();
  const cfg = PORTFOLIOS.find((p) => p.slug === slug) || MASUD;

  useEffect(() => {
    const root = document.documentElement;
    const prev = root.style.scrollSnapType;
    root.style.scrollSnapType = 'y proximity';
    document.title = `${cfg.person.name} · ${cfg.person.role}`;
    window.scrollTo(0, 0);
    return () => {
      root.style.scrollSnapType = prev;
    };
  }, [cfg]);

  return (
    <div style={{ ['--accent' as any]: cfg.accent }} className="bg-black text-white font-sans antialiased selection:bg-[var(--accent)] selection:text-black">
      <Header cfg={cfg} demo />
      <Hero cfg={cfg} />
      {cfg.intro && <Intro intro={cfg.intro} />}
      {cfg.stats && <Stats stats={cfg.stats} />}
      {cfg.story && <Story story={cfg.story} />}
      {cfg.work && <Work work={cfg.work} />}
      {cfg.media && <Videos media={cfg.media} />}
      <Contact cfg={cfg} />
      <Footer cfg={cfg} />
    </div>
  );
};
