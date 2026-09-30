import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Star, CheckCircle2, Eye, EyeOff } from 'lucide-react';

export const AdminReviewsPage: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadReviews = async () => {
    try {
      setLoading(true);
      const data = await api.reviews.list();
      setReviews(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadReviews();
  }, []);

  const togglePublish = async (id: string, currentStatus: string) => {
    const nextStatus = currentStatus === 'published' ? 'hidden' : 'published';
    try {
      await api.reviews.update(id, { status: nextStatus });
      showToast(`Review marked as ${nextStatus}.`);
      await loadReviews();
    } catch (err: any) {
      alert(err.message || 'Failed to update review status.');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Client Feedback & Verified Reviews
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Review institutional feedback and approve testimonials for public property listings.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {reviews.map((rev) => (
          <div
            key={rev.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-2">
                <div className="flex items-center gap-1 text-amber-400">
                  {Array.from({ length: rev.rating || 5 }).map((_, i) => (
                    <Star key={i} className="w-3.5 h-3.5 fill-current" />
                  ))}
                </div>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    rev.status === 'published'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {rev.status || 'published'}
                </span>
              </div>

              <h4 className="text-xs font-semibold text-white font-architectural mb-0.5">
                {rev.propertyTitle}
              </h4>
              <p className="text-[11px] text-slate-400 italic line-clamp-3 my-2">
                "{rev.comment}"
              </p>
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-semibold text-slate-200">{rev.authorName}</div>
                <div className="text-[10px] font-mono text-slate-500">{rev.date}</div>
              </div>

              <button
                onClick={() => togglePublish(rev.id, rev.status || 'published')}
                className="p-2 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-lg text-xs flex items-center gap-1 cursor-pointer"
                title="Toggle Visibility"
              >
                {rev.status === 'published' ? (
                  <>
                    <EyeOff className="w-3.5 h-3.5 text-slate-400" />
                    <span>Hide</span>
                  </>
                ) : (
                  <>
                    <Eye className="w-3.5 h-3.5 text-emerald-400" />
                    <span>Publish</span>
                  </>
                )}
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
