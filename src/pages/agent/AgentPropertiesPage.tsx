import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { useMarketplace } from '../../context/MarketplaceContext';
import { api } from '../../services/api';
import { Building2, Plus, Edit2, ExternalLink, X, CheckCircle2 } from 'lucide-react';

export const AgentPropertiesPage: React.FC = () => {
  const { user } = useAuth();
  const { reloadProperties } = useMarketplace();
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [modalOpen, setModalOpen] = useState(false);
  const [editingProperty, setEditingProperty] = useState<any | null>(null);
  const [toast, setToast] = useState<string | null>(null);

  const [form, setForm] = useState({
    title: '',
    tagline: '',
    price: 3500000,
    listingType: 'buy',
    category: 'Residential',
    address: '',
    city: 'San Francisco',
    state: 'CA',
    zip: '94104',
    beds: 3,
    baths: 4,
    sqft: 4200,
    description: '',
    imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
  });

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadProperties = async () => {
    try {
      setLoading(true);
      // Strictly load agent-isolated listings directly from backend service
      const data = await api.agentProperties.list();
      setProperties(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadProperties();
  }, [user]);

  const openCreateModal = () => {
    setEditingProperty(null);
    setForm({
      title: '',
      tagline: '',
      price: 4200000,
      listingType: 'buy',
      category: 'Residential',
      address: '150 Presidio Heights Boulevard',
      city: 'San Francisco',
      state: 'CA',
      zip: '94118',
      beds: 4,
      baths: 4,
      sqft: 4600,
      description: 'Elegant custom estate with modernist architectural framing and floor-to-ceiling glass.',
      imageUrl: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=1200&q=80',
    });
    setModalOpen(true);
  };

  const openEditModal = (p: any) => {
    setEditingProperty(p);
    setForm({
      title: p.title || '',
      tagline: p.tagline || '',
      price: p.price || 0,
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
    });
    setModalOpen(true);
  };

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const payload = {
        title: form.title,
        tagline: form.tagline,
        price: Number(form.price),
        priceDisplay: form.listingType === 'rent' ? `$${Number(form.price).toLocaleString()} / mo` : `$${Number(form.price).toLocaleString()}`,
        listingType: form.listingType,
        category: form.category,
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
        agentId: user?.agentId,
        verified: true,
      };

      if (editingProperty) {
        await api.properties.update(editingProperty.id, payload);
        showToast(`Listing "${form.title}" updated.`);
      } else {
        await api.properties.create(payload);
        showToast(`Listing "${form.title}" published.`);
      }
      setModalOpen(false);
      await loadProperties();
      await reloadProperties();
    } catch (err: any) {
      alert(err.message || 'Failed to save property.');
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

      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
            My Portfolio Listings
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Properties currently represented under your advisory authority.
          </p>
        </div>

        <button
          onClick={openCreateModal}
          className="inline-flex items-center gap-2 py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md self-start sm:self-auto cursor-pointer"
        >
          <Plus className="w-4 h-4 stroke-[2.5]" />
          <span>Add Listing</span>
        </button>
      </div>

      <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl shadow-xl overflow-hidden">
        {properties.length === 0 ? (
          <div className="p-12 text-center text-xs text-neutral-500 font-mono">
            No properties currently assigned. Use "Add Listing" to list a new property.
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left text-xs">
              <thead className="bg-neutral-950/60 border-b border-neutral-800 text-neutral-400 font-mono uppercase text-[10px] tracking-wider">
                <tr>
                  <th className="px-5 py-3.5">Property</th>
                  <th className="px-5 py-3.5">Category</th>
                  <th className="px-5 py-3.5">Location</th>
                  <th className="px-5 py-3.5">Price</th>
                  <th className="px-5 py-3.5">Status</th>
                  <th className="px-5 py-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-neutral-800/60">
                {properties.map((p) => (
                  <tr key={p.id} className="hover:bg-neutral-800/30 transition-colors">
                    <td className="px-5 py-3.5">
                      <div className="flex items-center gap-3">
                        <img
                          src={p.images?.[0] || 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=200&q=80'}
                          alt={p.title}
                          className="w-12 h-10 object-cover rounded-lg border border-neutral-800 shrink-0"
                        />
                        <div className="min-w-0 max-w-xs">
                          <div className="font-semibold text-white truncate">{p.title}</div>
                          <div className="text-[10px] text-neutral-400 truncate">{p.specs?.sqft?.toLocaleString()} sqft • {p.specs?.beds} beds</div>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-3.5 text-neutral-300">{p.category}</td>
                    <td className="px-5 py-3.5 font-mono text-neutral-300">
                      {p.location?.city}, {p.location?.state}
                    </td>
                    <td className="px-5 py-3.5 font-mono font-bold text-amber-400">
                      {p.priceDisplay || `$${p.price?.toLocaleString()}`}
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
                          className="p-1.5 text-neutral-400 hover:text-white rounded-lg hover:bg-neutral-800"
                          title="View Public"
                        >
                          <ExternalLink className="w-3.5 h-3.5" />
                        </Link>
                        <button
                          onClick={() => openEditModal(p)}
                          className="p-1.5 text-amber-400 hover:text-amber-300 rounded-lg hover:bg-neutral-800 cursor-pointer"
                          title="Edit"
                        >
                          <Edit2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {modalOpen && (
        <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-xs flex items-center justify-center p-4 overflow-y-auto">
          <div className="bg-neutral-900 border border-neutral-800 rounded-2xl max-w-xl w-full p-6 sm:p-8 shadow-2xl relative text-left my-8">
            <button onClick={() => setModalOpen(false)} className="absolute top-5 right-5 p-2 text-neutral-400 hover:text-white">
              <X className="w-5 h-5" />
            </button>
            <h3 className="text-xl font-bold font-architectural text-white mb-4">
              {editingProperty ? 'Edit Property' : 'Add Property to Portfolio'}
            </h3>
            <form onSubmit={handleSave} className="space-y-4 text-xs">
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Title</label>
                <input
                  type="text"
                  required
                  value={form.title}
                  onChange={(e) => setForm({ ...form, title: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Price ($ USD)</label>
                  <input
                    type="number"
                    required
                    value={form.price}
                    onChange={(e) => setForm({ ...form, price: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Category</label>
                  <select
                    value={form.category}
                    onChange={(e) => setForm({ ...form, category: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
                  >
                    <option value="Residential">Residential Villa</option>
                    <option value="Offices">Offices & Headquarters</option>
                    <option value="Penthouses">Penthouse</option>
                    <option value="Waterfront">Waterfront Estate</option>
                  </select>
                </div>
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Address</label>
                <input
                  type="text"
                  required
                  value={form.address}
                  onChange={(e) => setForm({ ...form, address: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
                />
              </div>
              <div className="grid grid-cols-3 gap-3">
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">City</label>
                  <input
                    type="text"
                    required
                    value={form.city}
                    onChange={(e) => setForm({ ...form, city: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">State</label>
                  <input
                    type="text"
                    required
                    value={form.state}
                    onChange={(e) => setForm({ ...form, state: e.target.value })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
                <div>
                  <label className="block font-semibold text-neutral-300 mb-1">Sqft</label>
                  <input
                    type="number"
                    value={form.sqft}
                    onChange={(e) => setForm({ ...form, sqft: Number(e.target.value) })}
                    className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
                  />
                </div>
              </div>
              <div>
                <label className="block font-semibold text-neutral-300 mb-1">Image URL</label>
                <input
                  type="url"
                  value={form.imageUrl}
                  onChange={(e) => setForm({ ...form, imageUrl: e.target.value })}
                  className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono text-[11px]"
                />
              </div>
              <div className="pt-4 border-t border-neutral-800 flex justify-end gap-3">
                <button type="button" onClick={() => setModalOpen(false)} className="px-4 py-2 bg-neutral-800 text-neutral-300 rounded-xl">Cancel</button>
                <button type="submit" className="px-5 py-2 bg-amber-500 text-neutral-950 font-bold uppercase rounded-xl">Save</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
