import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import { Briefcase, Plus, Search, Edit2, Trash2, ExternalLink, Star, X, CheckCircle2 } from 'lucide-react';

export const AdminAgentsPage: React.FC = () => {
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [modalOpen, setModalOpen] = useState(false);
  const [editingAgent, setEditingAgent] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    name: '',
    role: 'Principal Agent',
    agency: 'Digentic Private Client Advisory',
    licenseNumber: 'CA-DRE #02198421',
    phone: '+1 (415) 890-5542',
    email: '',
    city: 'San Francisco',
    state: 'CA',
    yearsExperience: 10,
    salesVolume: '$150M',
    dealsClosed: 120,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=400&q=80',
    bio: '',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAgents = async () => {
    try {
      setLoading(true);
      const data = await api.agents.list();
      setAgents(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAgents();
  }, []);

  const openCreateModal = () => {
    setEditingAgent(null);
    setForm({
      name: '',
      role: 'Principal Agent',
      agency: 'Digentic Advisory Group',
      licenseNumber: 'NY-DRE #0894210',
      phone: '+1 (212) 555-8820',
      email: '',
      city: 'New York',
      state: 'NY',
      yearsExperience: 8,
      salesVolume: '$80M',
      dealsClosed: 65,
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=400&q=80',
      bio: 'Representing institutional buyers and private family offices.',
    });
    setModalOpen(true);
  };

  const openEditModal = (a: any) => {
    setEditingAgent(a);
    setForm({
      name: a.name || '',
      role: a.role || '',
      agency: a.agency || '',
      licenseNumber: a.licenseNumber || '',
      phone: a.phone || '',
      email: a.email || '',
      city: a.city || '',
      state: a.state || '',
      yearsExperience: a.yearsExperience || 5,
      salesVolume: a.salesVolume || '$0M',
      dealsClosed: a.dealsClosed || 0,
      avatar: a.avatar || '',
      bio: a.bio || '',
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (editingAgent) {
        await api.agents.update(editingAgent.id, form);
        showToast(`Advisor ${form.name} updated.`);
      } else {
        await api.agents.create(form);
        showToast(`Advisor ${form.name} appointed.`);
      }
      setModalOpen(false);
      await loadAgents();
    } catch (err: any) {
      alert(err.message || 'Operation failed.');
    }
  };

  const handleDelete = async (id: string, name: string) => {
    if (!window.confirm(`Are you sure you want to remove advisor "${name}"?`)) return;
    try {
      await api.agents.delete(id);
      showToast(`Advisor "${name}" removed.`);
      await loadAgents();
    } catch (err: any) {
      alert(err.message || 'Failed to delete agent.');
    }
  };

  const filtered = agents.filter(
    (a) =>
      a.name?.toLowerCase().includes(search.toLowerCase()) ||
      a.city?.toLowerCase().includes(search.toLowerCase()) ||
      a.licenseNumber?.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-6">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
            Institutional Advisors & Agents
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage licensed managing principals, commission tiers, and regional broker designations.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Appoint Advisor</span>
        </button>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex items-center justify-between shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search advisors by name, license, or city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Advisor</th>
                <th className="px-5 py-3.5">License & Region</th>
                <th className="px-5 py-3.5">Deals Closed</th>
                <th className="px-5 py-3.5">Career Volume</th>
                <th className="px-5 py-3.5">Rating</th>
                <th className="px-5 py-3.5 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {filtered.map((a) => (
                <tr key={a.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <img
                        src={a.avatar}
                        alt={a.name}
                        className="w-10 h-10 object-cover rounded-full border border-slate-700 shrink-0"
                      />
                      <div>
                        <div className="font-semibold text-white">{a.name}</div>
                        <div className="text-[11px] text-slate-400">{a.role}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">
                    <div>{a.licenseNumber}</div>
                    <div className="text-[10px] text-slate-400">{a.city}, {a.state}</div>
                  </td>
                  <td className="px-5 py-3.5 font-mono text-slate-300">{a.dealsClosed} deals</td>
                  <td className="px-5 py-3.5 font-mono font-bold text-amber-400">{a.salesVolume}</td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-1 text-amber-400 font-mono font-bold">
                      <Star className="w-3.5 h-3.5 fill-current" />
                      <span>{a.rating || 4.9}</span>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link
                        to={`/agents/${a.slug}`}
                        target="_blank"
                        className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800"
                        title="View Public Profile"
                      >
                        <ExternalLink className="w-3.5 h-3.5" />
                      </Link>
                      <button
                        onClick={() => openEditModal(a)}
                        className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 cursor-pointer"
                        title="Edit Advisor"
                      >
                        <Edit2 className="w-3.5 h-3.5" />
                      </button>
                      <button
                        onClick={() => handleDelete(a.id, a.name)}
                        className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 cursor-pointer"
                        title="Remove Advisor"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-lg w-full p-6 shadow-2xl relative text-left">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white"
            >
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-lg font-bold font-architectural text-white mb-4">
              {editingAgent ? 'Edit Advisor Profile' : 'Appoint New Advisor'}
            </h3>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-2 gap-3">
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Full Name</label>
                  <input
                    type="text"
                    required
                    value={form.name}
                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">License Number</label>
                  <input
                    type="text"
                    required
                    value={form.licenseNumber}
                    onChange={(e) => setForm({ ...form, licenseNumber: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Phone</label>
                  <input
                    type="text"
                    value={form.phone}
                    onChange={(e) => setForm({ ...form, phone: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Career Volume</label>
                  <input
                    type="text"
                    value={form.salesVolume}
                    onChange={(e) => setForm({ ...form, salesVolume: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div className="col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Avatar Image URL</label>
                  <input
                    type="url"
                    value={form.avatar}
                    onChange={(e) => setForm({ ...form, avatar: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px]"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase rounded-xl"
                >
                  Save Advisor
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
