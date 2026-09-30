import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useMarketplace } from '../../context/MarketplaceContext';
import { api } from '../../services/api';
import {
  Building2,
  Plus,
  Search,
  Filter,
  Edit2,
  Trash2,
  ExternalLink,
  X,
  CheckCircle2,
  AlertCircle,
  Loader2,
} from 'lucide-react';

export const AdminPropertiesPage: React.FC = () => {
  const { reloadProperties } = useMarketplace();
  const [properties, setProperties] = useState<any[]>([]);
  const [agents, setAgents] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [categoryFilter, setCategoryFilter] = useState('All');

  // Modal States
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [deleteId, setDeleteId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Form State
  const [form, setForm] = useState({
    title: '',
    tagline: '',
    price: 5000000,
    priceDisplay: '$5,000,000',
    listingType: 'buy',
    category: 'Offices',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    zip: '94104',
    beds: 4,
    baths: 5,
    sqft: 6000,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    agentId: 'agent-demo',
    featured: true,
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3500);
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      const [propsData, agentsData] = await Promise.all([
        api.properties.list(),
        api.agents.list(),
      ]);
      setProperties(propsData);
      setAgents(agentsData);
    } catch (err) {
      console.error('Failed to load properties:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, []);

  const openCreateModal = () => {
    setEditingProperty(null);
    setForm({
      title: '',
      tagline: '',
      price: 6500000,
      priceDisplay: '$6,500,000',
      listingType: 'buy',
      category: 'Residential',
      address: '720 Panorama Terrace',
      city: 'San Francisco',
      state: 'CA',
      zip: '94114',
      beds: 4,
      baths: 5,
      sqft: 5200,
      description: 'Architect-designed modernist estate with panoramic city skyline and bay vistas.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      agentId: agents[0]?.id || 'agent-demo',
      featured: true,
    });
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProperty(p);
    setForm({
      title: p.title || '',
      tagline: p.tagline || '',
      price: p.price || 0,
      priceDisplay: p.priceDisplay || `$${p.price?.toLocaleString()}`,
      listingType: p.listingType || 'buy',
      category: p.category || 'Residential',
      address: p.location?.address || '',
      city: p.location?.city || 'San Francisco',
      state: p.location?.state || 'CA',
      zip: p.location?.zip || '94104',
      beds: p.specs?.beds || 0,
      baths: p.specs?.baths || 0,
      sqft: p.specs?.sqft || 0,
      description: Array.isArray(p.description) ? p.description.join(' ') : p.description || '',
      imageUrl: p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
      agentId: p.agentId || 'agent-demo',
      featured: !!p.featured,
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      const payload = {
        title: form.title,
        tagline: form.tagline,
        price: Number(form.price),
        priceDisplay: form.listingType === 'rent' ? `$${Number(form.price).toLocaleString()} / mo` : `$${Number(form.price).toLocaleString()}`,
        listingType: form.listingType,
        category: form.category,
        featured: form.featured,
        location: {
          address: form.address,
          city: form.city,
          state: form.state,
          zip: form.zip,
        },
        specs: {
          beds: Number(form.beds),
          baths: Number(form.baths),
          sqft: Number(form.sqft),
          pricePerSqft: form.sqft ? Math.round(Number(form.price) / Number(form.sqft)) : 0,
        },
        description: [form.description],
        images: [form.imageUrl],
        agentId: form.agentId,
        verified: true,
        verifiedBadgeText: 'Digentic Certified & Title Inspected',
      };

      if (editingProperty) {
        await api.properties.update(editingProperty.id, payload);
        showToast(`Updated "${form.title}" successfully.`);
      } else {
        await api.properties.create(payload);
        showToast(`Created listing "${form.title}".`);
      }

      setModalOpen(false);
      await loadProperties();
      await reloadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to save property.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId) return;
    try {
      await api.properties.delete(deleteId);
      showToast('Property deleted from public portal and ledger.');
      setDeleteId(null);
      await loadProperties();
      await reloadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to delete property.');
    }
  };

  const filtered = properties.filter((p) => {
    const matchesSearch =
      p.title?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.city?.toLowerCase().includes(search.toLowerCase()) ||
      p.location?.address?.toLowerCase().includes(search.toLowerCase());
    const matchesCategory = categoryFilter === 'All' || p.category === categoryFilter;
    return matchesSearch && matchesCategory;
  });

  return (
    <div className="space-y-6">
      {/* Toast Notification */}
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-slate-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2 animate-in fade-in">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
            Asset Portfolio Management
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Manage verified real estate assets, institutional office towers, and architectural estates.
          </p>
        </div>

        <button
          type="button"
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2.5 px-4 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer self-start sm:self-auto"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add New Asset</span>
        </button>
      </div>

      {/* Search & Filter Bar */}
      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, address, or city..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50 font-sans"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <Filter className="w-4 h-4 text-slate-400 shrink-0" />
          <select
            value={categoryFilter}
            onChange={(e) => setCategoryFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
          >
            <option value="All">All Categories ({properties.length})</option>
            <option value="Offices">Offices & Headquarters</option>
            <option value="Residential">Residential Villas</option>
            <option value="Penthouses">Penthouses</option>
            <option value="Waterfront">Waterfront Estates</option>
          </select>
        </div>
      </div>

      {/* Data Table */}
      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        {loading ? (
          <div className="p-12 text-center text-slate-500 flex flex-col items-center justify-center gap-3 font-mono text-xs">
            <Loader2 className="w-6 h-6 animate-spin text-amber-500" />
            <span>Loading verified ledger assets...</span>
          </div>
        ) : filtered.length === 0 ? (
          <div className="p-12 text-center text-slate-500 font-mono text-xs">
            No properties found matching your filter criteria.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Asset</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Assigned Agent</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-800/60">
                {filtered.map((p) => {
                  const agent = agents.find((a) => a.id === p.agentId);
                  return (
                    <tr key={p.id} className="hover:bg-slate-800/30 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <img
                            src={p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                            alt={p.title}
                            className="w-12 h-10 object-cover rounded-lg border border-slate-800 shrink-0"
                          />
                          <div className="min-w-0 max-w-xs">
                            <div className="font-semibold text-white truncate">{p.title}</div>
                            <div className="text-[10px] text-slate-400 truncate">{p.specs?.sqft?.toLocaleString()} sqft • {p.specs?.beds} beds</div>
                          </div>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">{p.category}</td>
                      <td className="px-5 py-3.5 text-slate-300 font-mono">
                        {p.location?.city}, {p.location?.state}
                      </td>
                      <td className="px-5 py-3.5 font-mono font-bold text-amber-400">
                        {p.priceDisplay || `$${p.price?.toLocaleString()}`}
                      </td>
                      <td className="px-5 py-3.5 text-slate-300">
                        {agent ? agent.name : p.agentId || 'Marcus Vance'}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                          {p.status || 'Active'}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-right">
                        <div className="flex items-center justify-end gap-2">
                          <Link
                            to={`/properties/${p.slug}`}
                            target="_blank"
                            className="p-1.5 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800 transition-colors"
                            title="View Public Listing"
                          >
                            <ExternalLink className="w-3.5 h-3.5" />
                          </Link>
                          <button
                            type="button"
                            onClick={() => openEditModal(p)}
                            className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Edit Listing"
                          >
                            <Edit2 className="w-3.5 h-3.5" />
                          </button>
                          <button
                            type="button"
                            onClick={() => setDeleteId(p.id)}
                            className="p-1.5 text-red-400 hover:text-red-300 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                            title="Delete Listing"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* CREATE / EDIT MODAL */}
      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-slate-900 border border-slate-800 rounded-2xl max-w-2xl w-full p-6 sm:p-8 shadow-2xl relative text-left my-8">
            <button
              onClick={() => setModalOpen(false)}
              className="absolute top-5 right-5 p-2 text-slate-400 hover:text-white rounded-full hover:bg-slate-800"
            >
              <X className="w-5 h-5" />
            </button>

            <h3 className="text-xl font-bold font-architectural text-white mb-1">
              {editingProperty ? 'Edit Property Asset' : 'Register New Architectural Listing'}
            </h3>
            <p className="text-xs text-slate-400 mb-6">
              Listing updates syndicate directly across the institutional public platform.
            </p>

            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Listing Title</label>
                  <input
                    type="text"
                    required
                    value={form.title}
                    onChange={(e) => setForm({ ...form, title: e.target.value })}
                    placeholder="e.g. The Monolith Glass Pavilion"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Architectural Tagline</label>
                  <input
                    type="text"
                    value={form.tagline}
                    onChange={(e) => setForm({ ...form, tagline: e.target.value })}
                    placeholder="e.g. Precision engineered glass facade with triple-height cantilevered atrium"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Listing Type</label>
                  <select
                    value={form.listingType}
                    onChange={(e) => setForm({ ...form, listingType: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="buy">For Sale (Acquisition)</option>
                    <option value="rent">For Lease (Rental)</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    <option value="Offices">Offices & Headquarters</option>
                    <option value="Residential">Residential Villa</option>
                    <option value="Penthouses">Penthouse</option>
                    <option value="Waterfront">Waterfront Estate</option>
                    <option value="Historic">Historic Restoration</option>
                  </select>
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">Assigned Advisory Agent</label>
                  <select
                    value={form.agentId}
                    onChange={(e) => setForm({ ...form, agentId: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  >
                    {agents.map((a) => (
                      <option key={a.id} value={a.id}>
                        {a.name} ({a.city || 'Licensed'})
                      </option>
                    ))}
                  </select>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Street Address</label>
                  <input
                    type="text"
                    required
                    value={form.address}
                    onChange={(e) => setForm({ ...form, address: e.target.value })}
                    placeholder="420 Montgomery Boulevard"
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div>
                  <label className="block font-semibold text-slate-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="grid grid-cols-2 gap-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">State</label>
                    <input
                      type="text"
                      required
                      value={form.state}
                      onChange={(e) => setForm({ ...form, state: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">ZIP</label>
                    <input
                      type="text"
                      required
                      value={form.zip}
                      onChange={(e) => setForm({ ...form, zip: e.target.value })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 font-mono"
                    />
                  </div>
                </div>

                <div className="grid grid-cols-3 gap-2 sm:col-span-2">
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Square Feet</label>
                    <input
                      type="number"
                      value={form.sqft}
                      onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Beds</label>
                    <input
                      type="number"
                      value={form.beds}
                      onChange={(e) => setForm({ ...form, beds: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                  <div>
                    <label className="block font-semibold text-slate-300 mb-1">Baths</label>
                    <input
                      type="number"
                      value={form.baths}
                      onChange={(e) => setForm({ ...form, baths: Number(e.target.value) })}
                      className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono focus:outline-none focus:border-amber-500"
                    />
                  </div>
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Primary Image URL</label>
                  <input
                    type="url"
                    required
                    value={form.imageUrl}
                    onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono text-[11px] focus:outline-none focus:border-amber-500"
                  />
                </div>

                <div className="sm:col-span-2">
                  <label className="block font-semibold text-slate-300 mb-1">Architectural Description</label>
                  <textarea
                    rows={3}
                    value={form.description}
                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                    className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white focus:outline-none focus:border-amber-500 leading-relaxed"
                  />
                </div>
              </div>

              <div className="pt-4 border-t border-slate-800 flex justify-end gap-3">
                <button
                  type="button"
                  onClick={() => setModalOpen(false)}
                  className="px-4 py-2.5 bg-slate-800 hover:bg-slate-700 text-slate-300 rounded-xl"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={submitting}
                  className="px-5 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase tracking-wider rounded-xl transition-all shadow-md disabled:opacity-50"
                >
                  {submitting ? 'Saving Property...' : editingProperty ? 'Save Changes' : 'Publish Asset'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* DELETE CONFIRMATION DIALOG */}
      {deleteId && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-slate-900 border border-red-500/30 rounded-2xl max-w-md w-full p-6 shadow-2xl text-center">
            <div className="w-12 h-12 rounded-xl bg-red-500/10 text-red-400 flex items-center justify-center mx-auto mb-4 border border-red-500/30">
              <Trash2 className="w-6 h-6" />
            </div>
            <h3 className="text-lg font-bold text-white mb-2">Delete Property Listing?</h3>
            <p className="text-xs text-slate-400 mb-6">
              This action will remove the property asset from the public marketplace and syndicate updates immediately.
            </p>
            <div className="flex justify-center gap-3">
              <button
                type="button"
                onClick={() => setDeleteId(null)}
                className="px-4 py-2 bg-slate-800 text-slate-300 rounded-xl text-xs"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={handleDelete}
                className="px-4 py-2 bg-red-600 hover:bg-red-500 text-white font-semibold rounded-xl text-xs"
              >
                Confirm Delete
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
