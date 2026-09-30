import React, { useState } from 'react';
import { Image as ImageIcon, Copy, Check, ExternalLink } from 'lucide-react';

const mediaAssets = [
  {
    title: 'The Monolith Glass Pavilion (Facade)',
    category: 'Commercial HQ',
    url: 'https://images.unsplash.com/photo-1486406146926-c627a92ad1ab?auto=format&fit=crop&w=1600&q=80',
    dimensions: '1600 × 1067',
  },
  {
    title: 'Solarium Cantilever Villa (Horizon Pool)',
    category: 'Residential',
    url: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1600&q=80',
    dimensions: '1600 × 1067',
  },
  {
    title: 'Tribeca Cast-Iron Sky Penthouse',
    category: 'Penthouses',
    url: 'https://images.unsplash.com/photo-1567496898669-ee935f5f647a?auto=format&fit=crop&w=1600&q=80',
    dimensions: '1600 × 1067',
  },
  {
    title: 'Potomac Riverfront Sanctuary (Palisades)',
    category: 'Waterfront',
    url: 'https://images.unsplash.com/photo-1613490493576-7fde63acd811?auto=format&fit=crop&w=1600&q=80',
    dimensions: '1600 × 1067',
  },
  {
    title: 'Lady Bird Lake Mass-Timber Campus',
    category: 'Offices',
    url: 'https://images.unsplash.com/photo-1545324418-cc1a3fa10c00?auto=format&fit=crop&w=1600&q=80',
    dimensions: '1600 × 1067',
  },
  {
    title: 'High-Tech Atrium & Lounges',
    category: 'Interiors',
    url: 'https://images.unsplash.com/photo-1497366216548-37526070297c?auto=format&fit=crop&w=1200&q=80',
    dimensions: '1200 × 800',
  },
];

export const AdminMediaPage: React.FC = () => {
  const [copiedUrl, setCopiedUrl] = useState<string | null>(null);

  const copyToClipboard = (url: string) => {
    navigator.clipboard.writeText(url);
    setCopiedUrl(url);
    setTimeout(() => setCopiedUrl(null), 2000);
  };

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Architectural Media & Asset Library
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-resolution photography, architectural schematics, and curated digital media.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {mediaAssets.map((asset, idx) => (
          <div
            key={idx}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl overflow-hidden shadow-xl flex flex-col justify-between group"
          >
            <div className="h-48 overflow-hidden relative">
              <img
                src={asset.url}
                alt={asset.title}
                className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
              />
              <span className="absolute top-3 left-3 px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-slate-950/80 text-amber-400 border border-slate-700">
                {asset.category}
              </span>
            </div>

            <div className="p-4 space-y-3">
              <div>
                <h4 className="text-xs font-semibold text-white truncate">{asset.title}</h4>
                <div className="text-[10px] font-mono text-slate-500 mt-0.5">{asset.dimensions}</div>
              </div>

              <div className="flex items-center justify-between pt-2 border-t border-slate-800 text-xs">
                <button
                  onClick={() => copyToClipboard(asset.url)}
                  className="inline-flex items-center gap-1.5 text-slate-300 hover:text-white cursor-pointer"
                >
                  {copiedUrl === asset.url ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-emerald-400" />
                      <span className="text-emerald-400 font-mono text-[11px]">Copied!</span>
                    </>
                  ) : (
                    <>
                      <Copy className="w-3.5 h-3.5 text-slate-400" />
                      <span className="text-[11px]">Copy URL</span>
                    </>
                  )}
                </button>

                <a
                  href={asset.url}
                  target="_blank"
                  rel="noreferrer"
                  className="p-1 text-slate-400 hover:text-white"
                >
                  <ExternalLink className="w-3.5 h-3.5" />
                </a>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
