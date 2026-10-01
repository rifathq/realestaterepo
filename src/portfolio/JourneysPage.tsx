import React, { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowLeft, Camera, Check, ChevronLeft, ChevronRight, Link2, MapPin, Share2, X } from 'lucide-react';
import type { Journey, JourneysConfig } from './types';
import { withBase } from '../lib/base';
import { DIGENTS_CONTACT_URL, DIGENTS_URL } from '../agent-site/profile';

// ---------- helpers ----------

const src = (s: string) => (s.startsWith('/') ? withBase(s) : s);
const altFor = (j: Journey, i: number) => j.photos[i]?.alt || `Photo ${i + 1} from ${j.title}`;
const albumPath = (cfg: JourneysConfig, j: Journey) => `/portfolio/${cfg.slug}/${j.slug}`;
const absoluteUrl = (path: string) => `${window.location.origin}${withBase(path)}`;

function formatDate(date?: string) {
  if (!date) return null;
  if (/^\d{4}$/.test(date)) return date;
  const d = new Date(`${date}T12:00:00`);
  return Number.isNaN(d.getTime()) ? date : d.toLocaleDateString([], { month: 'long', day: 'numeric', year: 'numeric' });
}

function metaLine(j: Journey) {
  return [formatDate(j.date), j.place, `${j.photos.length} photo${j.photos.length === 1 ? '' : 's'}`].filter(Boolean).join(' · ');
}

// Loads the person's Google Fonts once.
function useFonts(heading: string, body: string) {
  useEffect(() => {
    const id = `jr-fonts-${heading}-${body}`.replace(/\s+/g, '-');
    if (document.getElementById(id)) return;
    const fam = (f: string) => `family=${f.replace(/ /g, '+')}:ital,wght@0,400;0,600;0,700;1,400`;
    const link = document.createElement('link');
    link.id = id;
    link.rel = 'stylesheet';
    link.href = `https://fonts.googleapis.com/css2?${fam(heading)}&${fam(body)}&display=swap`;
    document.head.appendChild(link);
  }, [heading, body]);
}

// ---------- sharing ----------

const ShareRow: React.FC<{ url: string; text: string; compact?: boolean }> = ({ url, text, compact }) => {
  const [copied, setCopied] = useState(false);
  const enc = encodeURIComponent;
  const targets = [
    { label: 'WhatsApp', href: `https://wa.me/?text=${enc(`${text} ${url}`)}` },
    { label: 'Facebook', href: `https://www.facebook.com/sharer/sharer.php?u=${enc(url)}` },
    { label: 'X', href: `https://twitter.com/intent/tweet?url=${enc(url)}&text=${enc(text)}` },
    { label: 'LinkedIn', href: `https://www.linkedin.com/sharing/share-offsite/?url=${enc(url)}` },
  ];
  const copy = async () => {
    try {
      await navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch {
      window.prompt('Copy this link', url);
    }
  };
  const native = async () => {
    try {
      await navigator.share({ title: text, url });
    } catch {
      /* closed or not supported */
    }
  };
  const btn = 'inline-flex items-center gap-1.5 min-h-11 px-3.5 border border-[var(--ink)]/15 rounded-full text-sm font-semibold hover:border-[var(--action)] hover:text-[var(--action)] transition-colors';
  return (
    <div className="flex flex-wrap items-center gap-2">
      {typeof navigator !== 'undefined' && 'share' in navigator && (
        <button type="button" onClick={native} className={`${btn} bg-[var(--action)] text-white border-transparent hover:text-white hover:brightness-110`}>
          <Share2 className="w-4 h-4" /> Share
        </button>
      )}
      {targets.slice(0, compact ? 2 : 4).map((t) => (
        <a key={t.label} href={t.href} target="_blank" rel="noreferrer" className={btn}>
          {t.label}
        </a>
      ))}
      <button type="button" onClick={copy} className={btn}>
        {copied ? <Check className="w-4 h-4" /> : <Link2 className="w-4 h-4" />} {copied ? 'Copied' : 'Copy link'}
      </button>
    </div>
  );
};

// ---------- lightbox ----------

const Lightbox: React.FC<{ journey: Journey; index: number; onClose: () => void; onIndex: (i: number) => void }> = ({ journey, index, onClose, onIndex }) => {
  const n = journey.photos.length;
  const prev = useCallback(() => onIndex((index - 1 + n) % n), [index, n, onIndex]);
  const next = useCallback(() => onIndex((index + 1) % n), [index, n, onIndex]);
  const touch = useRef<number | null>(null);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
      if (e.key === 'ArrowLeft') prev();
      if (e.key === 'ArrowRight') next();
    };
    document.addEventListener('keydown', onKey);
    const overflow = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.removeEventListener('keydown', onKey);
      document.body.style.overflow = overflow;
    };
  }, [onClose, prev, next]);

  useEffect(() => {
    [index + 1, index - 1].forEach((i) => {
      const p = journey.photos[(i + n) % n];
      if (p) new Image().src = src(p.src);
    });
  }, [index, journey, n]);

  const nav = 'absolute top-1/2 -translate-y-1/2 w-12 h-12 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center';
  return (
    <div
      role="dialog"
      aria-modal="true"
      aria-label={`${journey.title}, photo ${index + 1} of ${n}`}
      className="fixed inset-0 z-[70] bg-black/95 flex flex-col"
      onTouchStart={(e) => (touch.current = e.touches[0].clientX)}
      onTouchEnd={(e) => {
        if (touch.current === null) return;
        const dx = e.changedTouches[0].clientX - touch.current;
        if (Math.abs(dx) > 50) (dx < 0 ? next : prev)();
        touch.current = null;
      }}
    >
      <div className="flex items-center justify-between px-4 h-14 text-white/80 text-sm shrink-0">
        <span>
          {index + 1} / {n}
        </span>
        <button type="button" onClick={onClose} aria-label="Close" className="w-11 h-11 flex items-center justify-center rounded-full hover:bg-white/10">
          <X className="w-6 h-6" />
        </button>
      </div>
      <div className="relative flex-1 min-h-0 flex items-center justify-center px-2 sm:px-16">
        <img src={src(journey.photos[index].src)} alt={altFor(journey, index)} className="max-w-full max-h-full object-contain" />
        {n > 1 && (
          <>
            <button type="button" onClick={prev} aria-label="Previous photo" className={`${nav} left-2 sm:left-4`}>
              <ChevronLeft className="w-6 h-6" />
            </button>
            <button type="button" onClick={next} aria-label="Next photo" className={`${nav} right-2 sm:right-4`}>
              <ChevronRight className="w-6 h-6" />
            </button>
          </>
        )}
      </div>
      <p className="px-4 py-4 text-center text-sm text-white/70 shrink-0">{altFor(journey, index)}</p>
    </div>
  );
};

// ---------- places map ----------

const PlacesMap: React.FC<{ cfg: JourneysConfig; places: { name: string; coords: [number, number]; journeys: Journey[] }[] }> = ({ cfg, places }) => {
  const el = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  useEffect(() => {
    let map: any;
    let cancelled = false;
    (async () => {
      const L = (await import('leaflet')).default;
      await import('leaflet/dist/leaflet.css');
      if (cancelled || !el.current) return;
      map = L.map(el.current, { scrollWheelZoom: false, dragging: !L.Browser.mobile, attributionControl: true });
      L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
        maxZoom: 18,
        attribution: '&copy; OpenStreetMap contributors',
      }).addTo(map);
      const bounds = L.latLngBounds([]);
      for (const p of places) {
        const photos = p.journeys.reduce((s, j) => s + j.photos.length, 0);
        const marker = L.circleMarker(p.coords, {
          radius: 8 + Math.min(14, photos),
          color: '#fff',
          weight: 2,
          fillColor: cfg.theme.action,
          fillOpacity: 0.9,
        }).addTo(map);
        marker.bindTooltip(`${p.name} · ${p.journeys.length} journey${p.journeys.length === 1 ? '' : 's'}`);
        marker.on('click', () => navigate(albumPath(cfg, p.journeys[0])));
        bounds.extend(p.coords);
      }
      map.fitBounds(bounds, { padding: [40, 40], maxZoom: 6 });
    })();
    return () => {
      cancelled = true;
      map?.remove();
    };
  }, [cfg, places, navigate]);
  return <div ref={el} className="w-full h-[320px] sm:h-[400px] rounded-2xl overflow-hidden z-0" aria-label="Map of places" />;
};

// ---------- page ----------

const Frame: React.FC<{ cfg: JourneysConfig; children: React.ReactNode }> = ({ cfg, children }) => {
  useFonts(cfg.theme.headingFont, cfg.theme.bodyFont);
  const t = cfg.theme;
  return (
    <div
      className="jr min-h-screen antialiased"
      style={
        {
          '--paper': t.paper,
          '--ink': t.ink,
          '--muted': t.muted,
          '--accent': t.accent,
          '--action': t.action,
          '--deep': t.deep,
          background: t.paper,
          color: t.ink,
          fontFamily: `'${t.bodyFont}', Georgia, serif`,
        } as React.CSSProperties
      }
    >
      <style>{`.jr .hf{font-family:'${t.headingFont}',system-ui,sans-serif}`}</style>
      {cfg.concept && (
        <div className="bg-[var(--accent)] text-[var(--ink)] text-xs sm:text-sm font-semibold text-center px-4 py-2">{cfg.concept.note}</div>
      )}
      {children}
      <footer className="bg-[var(--deep)] text-white/80">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-12 grid gap-6 sm:grid-cols-2">
          <div>
            <div className="hf text-xl text-white">{cfg.person.name}</div>
            <div className="text-sm mt-1">{cfg.person.role}</div>
            <div className="mt-4 space-y-1 text-xs text-white/70">
              {cfg.footer.lines.map((l) => (
                <p key={l}>{l}</p>
              ))}
            </div>
          </div>
          <div className="sm:text-right text-xs text-white/70 self-end">
            Website by{' '}
            <a href={DIGENTS_URL} target="_blank" rel="noreferrer" className="font-semibold text-white">Digents</a>
            {' · '}
            <a href={DIGENTS_CONTACT_URL} target="_blank" rel="noreferrer" className="underline underline-offset-2">Want a site like this?</a>
          </div>
        </div>
      </footer>
    </div>
  );
};

const Header: React.FC<{ cfg: JourneysConfig; back?: boolean; extra?: React.ReactNode; hasPlaces?: boolean }> = ({ cfg, back, extra, hasPlaces }) => (
  <header className="sticky top-0 z-40 bg-[var(--paper)]/90 backdrop-blur-md border-b border-[var(--ink)]/10">
    <div className="max-w-6xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
      {back ? (
        <Link to={`/portfolio/${cfg.slug}`} className="inline-flex items-center gap-2 min-h-11 text-sm font-semibold">
          <ArrowLeft className="w-4 h-4" /> All journeys
        </Link>
      ) : (
        <a href="#top" className="flex items-center gap-3 min-h-11">
          <span className="w-9 h-9 rounded-full bg-[var(--action)] text-white hf text-sm flex items-center justify-center">{cfg.person.initials}</span>
          <span className="hf font-semibold">{cfg.person.name}</span>
        </a>
      )}
      <nav className="flex items-center gap-1 text-sm">
        {!back && (
          <>
            <a href="#journeys" className="hidden sm:inline-flex items-center min-h-11 px-3 hover:text-[var(--action)]">Journeys</a>
            {hasPlaces && <a href="#places" className="hidden sm:inline-flex items-center min-h-11 px-3 hover:text-[var(--action)]">Places</a>}
            <a href="#about" className="hidden sm:inline-flex items-center min-h-11 px-3 hover:text-[var(--action)]">About</a>
          </>
        )}
        {extra}
      </nav>
    </div>
  </header>
);

export const JourneysPage: React.FC<{ cfg: JourneysConfig; switcher?: React.ReactNode }> = ({ cfg, switcher }) => {
  const journeys = cfg.journeys;
  const photoCount = journeys.reduce((s, j) => s + j.photos.length, 0);
  const places = useMemo(() => {
    const map = new Map<string, { name: string; coords: [number, number]; journeys: Journey[] }>();
    for (const j of journeys) {
      if (!j.place || !j.coords) continue;
      const p = map.get(j.place) || { name: j.place, coords: j.coords, journeys: [] };
      p.journeys.push(j);
      map.set(j.place, p);
    }
    return [...map.values()];
  }, [journeys]);
  const [placeFilter, setPlaceFilter] = useState<string | null>(null);
  const latest = journeys[0];
  const mosaic = journeys.flatMap((j) => j.photos.slice(0, 1).map((p, i) => ({ j, i, p }))).concat(journeys.flatMap((j) => j.photos.slice(1, 2).map((p) => ({ j, i: 1, p })))).slice(0, 5);
  const shown = placeFilter ? journeys.filter((j) => j.place === placeFilter) : journeys;
  // Year headers only where dates exist; undated journeys keep the author's order.
  const groups: { year: string | null; items: Journey[] }[] = [];
  for (const j of shown) {
    const year = j.date ? j.date.slice(0, 4) : null;
    const last = groups[groups.length - 1];
    if (last && last.year === year) last.items.push(j);
    else groups.push({ year, items: [j] });
  }
  const pageUrl = absoluteUrl(`/portfolio/${cfg.slug}`);

  useEffect(() => {
    document.title = `${cfg.person.name} · Journeys`;
  }, [cfg]);

  const tiles = ['col-span-4 row-span-4', 'col-span-2 row-span-2', 'col-span-2 row-span-2', 'col-span-3 row-span-2', 'col-span-3 row-span-2'];

  return (
    <Frame cfg={cfg}>
      <Header cfg={cfg} hasPlaces={places.length > 1} extra={<a href="#share" className="inline-flex items-center gap-1.5 min-h-11 px-4 rounded-full bg-[var(--action)] text-white font-semibold"><Share2 className="w-4 h-4" /> Share</a>} />
      {switcher}

      <section id="top" className="max-w-6xl mx-auto px-5 sm:px-8 pt-6 sm:pt-16 pb-14 grid gap-8 lg:gap-10 lg:grid-cols-12 items-center">
        <div className="lg:col-span-5">
          {cfg.sample && <span className="inline-block mb-4 text-[11px] font-semibold uppercase tracking-[0.16em] border border-[var(--ink)]/25 rounded-full px-3 py-1">Sample profile</span>}
          <div className="text-xs sm:text-sm font-semibold uppercase tracking-[0.16em] text-[var(--action)]">{cfg.person.role}</div>
          <h1 className="hf mt-3 text-5xl sm:text-6xl leading-[1.02] font-bold text-balance">{cfg.person.name}</h1>
          <p className="mt-5 text-lg text-[var(--muted)] leading-relaxed">{cfg.person.intro}</p>
          <dl className="mt-7 flex gap-8">
            {[
              [journeys.length, 'Journeys'],
              [photoCount, 'Photos'],
              ...(places.length > 1 ? [[places.length, 'Places']] : []),
            ].map(([v, l]) => (
              <div key={String(l)}>
                <dt className="sr-only">{l}</dt>
                <dd className="hf text-3xl font-bold">{v}</dd>
                <div className="text-xs uppercase tracking-[0.14em] text-[var(--muted)]">{l}</div>
              </div>
            ))}
          </dl>
          <div className="mt-8 flex flex-col sm:flex-row gap-3">
            <a href="#journeys" className="inline-flex justify-center items-center min-h-12 px-6 rounded-full bg-[var(--action)] text-white font-semibold hover:brightness-110">Browse journeys</a>
            <a href="#share" className="inline-flex justify-center items-center gap-2 min-h-12 px-6 rounded-full border border-[var(--ink)]/20 font-semibold hover:border-[var(--action)]">
              <Share2 className="w-4 h-4" /> Share this gallery
            </a>
          </div>
        </div>
        <div className="lg:col-span-7 order-first lg:order-none">
          <div className="grid grid-cols-6 grid-rows-6 gap-2 sm:gap-3 h-[300px] sm:h-[460px] lg:h-[520px]">
            {mosaic.map((m, k) => (
              <Link key={`${m.j.slug}-${m.i}`} to={albumPath(cfg, m.j)} className={`${tiles[k]} relative overflow-hidden rounded-xl group bg-[var(--ink)]/5`}>
                <img src={src(m.p.src)} alt={altFor(m.j, m.i)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                {k === 0 && (
                  <span className="absolute left-3 bottom-3 right-3 text-white text-sm font-semibold drop-shadow line-clamp-2">{m.j.title}</span>
                )}
                {k === 0 && <span className="absolute inset-0 bg-gradient-to-t from-black/50 via-transparent to-transparent pointer-events-none" />}
              </Link>
            ))}
          </div>
        </div>
      </section>

      {latest && (
        <section className="bg-white/60 border-y border-[var(--ink)]/10">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-8 lg:grid-cols-12 items-center">
            <Link to={albumPath(cfg, latest)} className="lg:col-span-7 block aspect-[4/3] overflow-hidden rounded-2xl group">
              <img src={src(latest.photos[0].src)} alt={altFor(latest, 0)} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
            </Link>
            <div className="lg:col-span-5">
              <span className="inline-block text-[11px] font-bold uppercase tracking-[0.16em] bg-[var(--accent)] text-[var(--ink)] rounded-full px-3 py-1">Latest</span>
              <h2 className="hf mt-4 text-3xl sm:text-4xl font-bold leading-tight text-balance">{latest.title}</h2>
              <p className="mt-3 text-sm text-[var(--muted)]">{metaLine(latest)}</p>
              {latest.summary && <p className="mt-4 text-lg leading-relaxed">{latest.summary}</p>}
              <div className="mt-6 flex gap-2">
                {latest.photos.slice(1, 5).map((p, i) => (
                  <Link key={p.src} to={albumPath(cfg, latest)} className="w-16 h-16 sm:w-20 sm:h-20 rounded-lg overflow-hidden">
                    <img src={src(p.src)} alt={altFor(latest, i + 1)} loading="lazy" className="w-full h-full object-cover" />
                  </Link>
                ))}
              </div>
              <div className="mt-7 flex flex-wrap gap-3 items-center">
                <Link to={albumPath(cfg, latest)} className="inline-flex items-center gap-2 min-h-12 px-6 rounded-full bg-[var(--action)] text-white font-semibold hover:brightness-110">
                  <Camera className="w-4 h-4" /> Open album
                </Link>
              </div>
              <div className="mt-4">
                <ShareRow compact url={absoluteUrl(albumPath(cfg, latest))} text={`${latest.title} · ${cfg.person.name}`} />
              </div>
            </div>
          </div>
        </section>
      )}

      <section id="journeys" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 scroll-mt-20">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
          <h2 className="hf text-3xl sm:text-4xl font-bold">All journeys</h2>
          {places.length > 1 && (
            <div className="flex gap-2 overflow-x-auto no-scrollbar -mx-5 px-5 sm:mx-0 sm:px-0" role="tablist" aria-label="Filter by place">
              {[null, ...places.map((p) => p.name)].map((name) => {
                const active = placeFilter === name;
                const count = name ? journeys.filter((j) => j.place === name).length : journeys.length;
                return (
                  <button
                    key={name || 'all'}
                    type="button"
                    role="tab"
                    aria-selected={active}
                    onClick={() => setPlaceFilter(name)}
                    className={`whitespace-nowrap min-h-11 px-4 rounded-full text-sm font-semibold border transition-colors ${active ? 'bg-[var(--ink)] text-[var(--paper)] border-[var(--ink)]' : 'border-[var(--ink)]/15 hover:border-[var(--ink)]'}`}
                  >
                    {name || 'All places'} <span className="opacity-60">{count}</span>
                  </button>
                );
              })}
            </div>
          )}
        </div>
        {groups.map((g, gi) => (
          <div key={`${g.year}-${gi}`} className="mt-10">
            {g.year && <div className="hf text-xl font-bold text-[var(--muted)] mb-4 border-b border-[var(--ink)]/10 pb-2">{g.year}</div>}
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {g.items.map((j) => (
                <Link key={j.slug} to={albumPath(cfg, j)} className="group block">
                  <div className="relative aspect-[4/3] overflow-hidden rounded-xl bg-[var(--ink)]/5">
                    <img src={src(j.photos[0].src)} alt={altFor(j, 0)} loading="lazy" className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-105" />
                    <span className="absolute top-3 right-3 inline-flex items-center gap-1 rounded-full bg-black/60 text-white text-xs font-semibold px-2.5 py-1">
                      <Camera className="w-3.5 h-3.5" /> {j.photos.length}
                    </span>
                  </div>
                  <div className="mt-3 text-xs text-[var(--muted)] flex items-center gap-1.5">
                    {j.place && <MapPin className="w-3.5 h-3.5" />}
                    {[j.place, formatDate(j.date)].filter(Boolean).join(' · ') || `${j.photos.length} photos`}
                  </div>
                  <h3 className="hf mt-1 text-lg font-bold leading-snug group-hover:text-[var(--action)] line-clamp-3">{j.title}</h3>
                </Link>
              ))}
            </div>
          </div>
        ))}
      </section>

      {places.length > 1 && (
        <section id="places" className="bg-white/60 border-y border-[var(--ink)]/10 scroll-mt-20">
          <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-8 lg:grid-cols-12">
            <div className="lg:col-span-4">
              <h2 className="hf text-3xl sm:text-4xl font-bold">Places</h2>
              <p className="mt-3 text-[var(--muted)]">Where the work has gone. Tap a place to open its latest album.</p>
              <ul className="mt-6 divide-y divide-[var(--ink)]/10 border-y border-[var(--ink)]/10">
                {places.map((p) => (
                  <li key={p.name}>
                    <Link to={albumPath(cfg, p.journeys[0])} className="flex items-center justify-between min-h-12 py-2 hover:text-[var(--action)]">
                      <span className="flex items-center gap-2 font-semibold"><MapPin className="w-4 h-4" /> {p.name}</span>
                      <span className="text-sm text-[var(--muted)]">{p.journeys.length} journey{p.journeys.length === 1 ? '' : 's'}</span>
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
            <div className="lg:col-span-8">
              <PlacesMap cfg={cfg} places={places} />
            </div>
          </div>
        </section>
      )}

      {(cfg.about || cfg.person.org) && (
        <section id="about" className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-20 grid gap-8 md:grid-cols-12 items-center scroll-mt-20">
          <div className="md:col-span-3">
            <div className="w-28 h-28 sm:w-36 sm:h-36 rounded-full overflow-hidden bg-[var(--action)] text-white hf text-4xl flex items-center justify-center">
              {cfg.person.photo ? <img src={src(cfg.person.photo)} alt={cfg.person.name} className="w-full h-full object-cover" /> : cfg.person.initials}
            </div>
          </div>
          <div className="md:col-span-9">
            <h2 className="hf text-3xl font-bold">About</h2>
            <div className="mt-4 space-y-3 text-lg leading-relaxed">
              {(cfg.about?.body || [cfg.person.intro]).map((p) => (
                <p key={p}>{p}</p>
              ))}
            </div>
            {cfg.person.org && (
              <a href={cfg.person.org.url} target="_blank" rel="noreferrer" className="mt-5 inline-flex items-center gap-2 min-h-11 font-semibold text-[var(--action)] underline underline-offset-4">
                {cfg.person.org.name}
              </a>
            )}
          </div>
        </section>
      )}

      <section id="share" className="bg-[var(--action)] text-white scroll-mt-20">
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-14 sm:py-16 flex flex-col lg:flex-row lg:items-center justify-between gap-6">
          <div>
            <h2 className="hf text-3xl sm:text-4xl font-bold">Share these moments</h2>
            <p className="mt-2 text-white/80">Send the whole gallery, or open an album and share just that day.</p>
          </div>
          <div className="[&_a]:border-white/40 [&_a]:text-white [&_button]:border-white/40 [&_button]:text-white [&_a:hover]:border-white [&_button:hover]:border-white">
            <ShareRow url={pageUrl} text={`${cfg.person.name} · Journeys`} />
          </div>
        </div>
      </section>
    </Frame>
  );
};

// Album page: every photo, a full-screen viewer, and a link to share just this day.
export const JourneyAlbumPage: React.FC<{ cfg: JourneysConfig; albumSlug: string }> = ({ cfg, albumSlug }) => {
  const idx = cfg.journeys.findIndex((j) => j.slug === albumSlug);
  const journey = cfg.journeys[idx];
  const [open, setOpen] = useState<number | null>(null);
  useEffect(() => {
    if (journey) document.title = `${journey.title} · ${cfg.person.name}`;
    window.scrollTo(0, 0);
  }, [journey, cfg]);

  if (!journey) {
    return (
      <Frame cfg={cfg}>
        <Header cfg={cfg} back />
        <div className="max-w-6xl mx-auto px-5 sm:px-8 py-24">
          <h1 className="hf text-3xl font-bold">This album isn't here</h1>
          <Link to={`/portfolio/${cfg.slug}`} className="mt-4 inline-block underline">See all journeys</Link>
        </div>
      </Frame>
    );
  }
  const nextJourney = cfg.journeys[(idx + 1) % cfg.journeys.length];

  return (
    <Frame cfg={cfg}>
      <Header cfg={cfg} back />
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pt-10 pb-8">
        <p className="text-sm text-[var(--muted)]">{metaLine(journey)}</p>
        <h1 className="hf mt-2 text-3xl sm:text-5xl font-bold leading-tight text-balance max-w-4xl">{journey.title}</h1>
        {journey.summary && <p className="mt-4 text-lg max-w-2xl leading-relaxed">{journey.summary}</p>}
        <div className="mt-6">
          <ShareRow url={absoluteUrl(albumPath(cfg, journey))} text={`${journey.title} · ${cfg.person.name}`} />
        </div>
      </section>
      <section className="max-w-6xl mx-auto px-5 sm:px-8 pb-16">
        <div className="columns-2 sm:columns-3 lg:columns-4 gap-3">
          {journey.photos.map((p, i) => (
            <button key={p.src} type="button" onClick={() => setOpen(i)} className="block w-full mb-3 overflow-hidden rounded-lg break-inside-avoid group" aria-label={`Open ${altFor(journey, i)}`}>
              <img src={src(p.src)} alt={altFor(journey, i)} loading="lazy" className="w-full h-auto transition-transform duration-500 group-hover:scale-[1.03]" />
            </button>
          ))}
        </div>
        {nextJourney && nextJourney !== journey && (
          <Link to={albumPath(cfg, nextJourney)} className="mt-12 flex items-center justify-between gap-4 border-t border-[var(--ink)]/10 pt-6 group">
            <span className="text-sm text-[var(--muted)]">Next journey</span>
            <span className="hf text-lg sm:text-xl font-bold group-hover:text-[var(--action)] text-right line-clamp-2">{nextJourney.title} →</span>
          </Link>
        )}
      </section>
      {open !== null && <Lightbox journey={journey} index={open} onIndex={setOpen} onClose={() => setOpen(null)} />}
    </Frame>
  );
};
