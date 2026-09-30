import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Inbox, Search, CheckCircle2, Mail, Phone, DollarSign } from 'lucide-react';

export const AdminLeadsPage: React.FC = () => {
  const [leads, setLeads] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

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
  }, []);

  const handleStatusChange = async (id: string, status: string) => {
    try {
      await api.leads.update(id, { status });
      showToast(`Lead pipeline updated to "${status}".`);
      await loadLeads();
    } catch (err: any) {
      alert(err.message || 'Failed to update lead.');
    }
  };

  const filtered = leads.filter(
    (l) =>
      l.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      l.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      l.inquiryType?.toLowerCase().includes(search.toLowerCase())
  );

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
          Client Inquiries & Acquisition Leads
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          High-net-worth buyers, corporate tenancy requests, and private family office inquiries.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search leads by client or property..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
        <span className="text-xs font-mono text-slate-400 hidden sm:inline">
          {filtered.length} Qualified Opportunities
        </span>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Client & Organization</th>
                <th className="px-5 py-3.5">Target Asset</th>
                <th className="px-5 py-3.5">Budget</th>
                <th className="px-5 py-3.5">Pipeline Stage</th>
                <th className="px-5 py-3.5 text-right">Update Stage</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((l) => (
                <tr key={l.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="font-semibold text-white">{l.clientName}</div>
                    <div className="text-[11px] text-slate-400 font-mono">{l.clientEmail}</div>
                    {l.clientPhone && (
                      <div className="text-[10px] text-slate-500 font-mono">{l.clientPhone}</div>
                    )}
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="text-white font-medium">{l.propertyTitle}</div>
                    <div className="text-[11px] text-amber-400 font-mono">{l.inquiryType}</div>
                    {l.message && (
                      <p className="text-[11px] text-slate-400 line-clamp-1 italic mt-1">
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
                          : l.status === 'contacted'
                          ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                          : l.status === 'touring'
                          ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
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
                      className="bg-slate-950 border border-slate-800 text-[11px] text-slate-300 rounded-lg px-2.5 py-1 focus:outline-none focus:border-amber-500"
                    >
                      <option value="new">New Inquiry</option>
                      <option value="contacted">Contacted</option>
                      <option value="touring">Touring Asset</option>
                      <option value="negotiating">In Due Diligence</option>
                      <option value="closed">Acquisition Closed</option>
                    </select>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};
