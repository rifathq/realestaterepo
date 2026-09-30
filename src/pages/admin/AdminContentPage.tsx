import React, { useState, useEffect } from 'react';
import { FileText, Save, CheckCircle2 } from 'lucide-react';
import { api } from '../../services/api';

export const AdminContentPage: React.FC = () => {
  const [toast, setToast] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [content, setContent] = useState({
    heroTitle: 'Real Estate for Business & Living',
    heroKicker: 'Q3/2026 Index',
    charterText: 'Every asset listed on Digentic Realty undergoes a four-stage audit: municipal title deed cross-referencing, architectural square footage measurement, Phase 1 environmental review, and mechanical/electrical compliance verification.',
    contactDisclaimer: 'Digentic Realty advises private clients and luxury estates nationwide. All client inquiries are held under strict non-disclosure compliance.',
  });

  useEffect(() => {
    api.content.get().then((data) => {
      if (data) setContent(data);
    }).catch(console.error).finally(() => setLoading(false));
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.content.update(content);
      setToast('Website content published successfully to public website.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update content.');
    }
  };

  return (
    <div className="space-y-6 max-w-4xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Website Content & Charter CMS
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Manage homepage headings, due diligence charter disclosures, and advisory notices.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div>
          <label className="block font-semibold text-slate-300 mb-1.5 uppercase font-mono tracking-wider">
            Hero Heading (H1)
          </label>
          <input
            type="text"
            value={content.heroTitle}
            onChange={(e) => setContent({ ...content, heroTitle: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 text-sm"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1.5 uppercase font-mono tracking-wider">
            Institutional Charter Statement
          </label>
          <textarea
            rows={4}
            value={content.charterText}
            onChange={(e) => setContent({ ...content, charterText: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        <div>
          <label className="block font-semibold text-slate-300 mb-1.5 uppercase font-mono tracking-wider">
            Client Advisory Non-Disclosure Notice
          </label>
          <textarea
            rows={3}
            value={content.contactDisclaimer}
            onChange={(e) => setContent({ ...content, contactDisclaimer: e.target.value })}
            className="w-full bg-slate-950 border border-slate-800 rounded-xl p-3 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
          />
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Publish Content Updates</span>
          </button>
        </div>
      </form>
    </div>
  );
};
