import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { Inbox, CheckCircle2, Phone, Mail } from 'lucide-react';

export const AgentLeadsPage: React.FC = () => {
  const { user } = useAuth();
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

  const loadLeads = async () => {
    try {
      setLoading(true);
      const data = await api.leads.list();
      setLeads(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadLeads();
  }, [user]);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.leads.update(id, { status });
      setToast(`Lead stage updated to ${status}.`);
      setTimeout(() => setToast(null), 3000);
      await loadLeads();
    } catch (err: any) {
      alert(err.message || 'Failed to update lead.');
    }
  };

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-neutral-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Assigned Inquiries & Acquisition Leads
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Direct buyer inquiries, corporate relocations, and private client inquiries assigned to you.
        </p>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
        {leads.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 font-mono">
            No active inquiries currently assigned.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Client</th>
                  <th className="px-5 py-3.5">Target Property</th>
                  <th className="px-5 py-3.5">Budget</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Update Stage</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {leads.map((l) => (
                  <tr key={l.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="font-semibold text-white">{l.clientName}</div>
                      <div className="text-[11px] text-neutral-400 font-mono">{l.clientEmail}</div>
                      {l.clientPhone && (
                        <div className="text-[10px] text-neutral-500 font-mono">{l.clientPhone}</div>
                      )}
                    </td>
                    <td className="px-5 py-3.5">
                      <div className="text-white font-medium">{l.propertyTitle}</div>
                      <div className="text-[11px] text-amber-400 font-mono">{l.inquiryType}</div>
                      {l.message && (
                        <p className="text-[11px] text-neutral-400 line-clamp-1 italic mt-1">
                          "{l.message}"
                        </p>
                      )}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-400">{l.budget}</td>
                    <td className="px-5 py-3.5">
                      <span
                        className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                          l.status === 'new'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {l.status}
                      </span>
                    </td>
                    <td className="px-5 py-3.5 text-right">
                      <select
                        value={l.status}
                        onChange={(e) => handleStatusChange(l.id, e.target.value)}
                        className="bg-neutral-950 border border-neutral-800 text-[11px] text-neutral-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
                      >
                        <option value="new">New</option>
                        <option value="contacted">Contacted</option>
                        <option value="touring">Touring</option>
                        <option value="closed">Closed</option>
                      </select>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </div>
  );
};
