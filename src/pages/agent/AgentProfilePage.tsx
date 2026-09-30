import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { User, Save, CheckCircle2, BadgeCheck, Phone, Mail, Award } from 'lucide-react';

export const AgentProfilePage: React.FC = () => {
  const { user } = useAuth();
  const [profile, setProfile] = useState<any>({
    name: 'Marcus Vance',
    role: 'Senior Portfolio Advisor',
    agency: 'Digentic Private Client Advisory',
    licenseNumber: 'CA-DRE #02198421',
    phone: '+1 (415) 890-5542',
    email: 'agent@demo.digenticrealty.com',
    city: 'San Francisco',
    state: 'CA',
    yearsExperience: 12,
    salesVolume: '$380.5M',
    dealsClosed: 324,
    avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    bio: 'Specializing in commercial headquarters acquisitions and landmark penthouse estates across the West Coast corridor.',
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    if (user?.agentId) {
      api.agents.get(user.agentId).then((data) => {
        if (data) setProfile(data);
      }).catch(console.error);
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      if (user?.agentId) {
        await api.agents.update(user.agentId, profile);
      }
      setToast('Advisor profile updated successfully.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to update profile.');
    }
  };

  return (
    <div className="space-y-6 max-w-3xl">
      {toast && (
        <div className="fixed bottom-6 right-6 z-50 bg-emerald-500 text-neutral-950 px-4 py-3 rounded-xl shadow-2xl font-semibold text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4" />
          <span>{toast}</span>
        </div>
      )}

      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Licensed Advisor Profile
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Manage your credentials, professional bio, and public portfolio presentation.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div className="flex items-center gap-4 pb-4 border-b border-neutral-800">
          <img
            src={profile.avatar}
            alt={profile.name}
            className="w-16 h-16 rounded-full object-cover border-2 border-amber-500/50"
          />
          <div>
            <h3 className="text-base font-bold text-white font-architectural">{profile.name}</h3>
            <div className="text-[11px] font-mono text-amber-400">{profile.licenseNumber}</div>
            <div className="text-[11px] text-neutral-400">{profile.agency}</div>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Direct Phone</label>
            <input
              type="text"
              value={profile.phone}
              onChange={(e) => setProfile({ ...profile, phone: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Email</label>
            <input
              type="email"
              disabled
              value={profile.email}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-neutral-400 font-mono cursor-not-allowed opacity-75"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Primary Market City</label>
            <input
              type="text"
              value={profile.city}
              onChange={(e) => setProfile({ ...profile, city: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-neutral-300 mb-1">Years Licensed Experience</label>
            <input
              type="number"
              value={profile.yearsExperience}
              onChange={(e) => setProfile({ ...profile, yearsExperience: Number(e.target.value) })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-neutral-300 mb-1">Avatar Image URL</label>
            <input
              type="url"
              value={profile.avatar}
              onChange={(e) => setProfile({ ...profile, avatar: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white font-mono text-[11px]"
            />
          </div>

          <div className="sm:col-span-2">
            <label className="block font-semibold text-neutral-300 mb-1">Professional Advisory Biography</label>
            <textarea
              rows={4}
              value={profile.bio}
              onChange={(e) => setProfile({ ...profile, bio: e.target.value })}
              className="w-full bg-neutral-950 border border-neutral-800 rounded-xl p-2.5 text-white leading-relaxed"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-neutral-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Update Profile</span>
          </button>
        </div>
      </form>
    </div>
  );
};
