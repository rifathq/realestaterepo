import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Settings, Save, CheckCircle2, ShieldCheck } from 'lucide-react';

export const AdminSettingsPage: React.FC = () => {
  const [settings, setSettings] = useState<any>({
    brokerageName: 'Digentic Realty Institutional Advisory',
    licenseId: 'US-FINRA/DRE-98002',
    defaultCurrency: 'USD ($)',
    standardCommissionBuy: 2.25,
    standardCommissionRent: 8.0,
    notificationEmail: 'advisory@digenticrealty.com',
    systemStatus: 'Operational',
    maintenanceMode: false,
    requireMfaForAdmins: true,
    dataRetentionDays: 365,
  });
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    api.settings.get().then(setSettings).catch(console.error);
  }, []);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      await api.settings.update(settings);
      setToast('System settings saved and applied across platform.');
      setTimeout(() => setToast(null), 3000);
    } catch (err: any) {
      alert(err.message || 'Failed to save settings.');
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
          System & Platform Settings
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Global brokerage compliance, commission fee schedules, and security policy.
        </p>
      </div>

      <form onSubmit={handleSave} className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 sm:p-8 space-y-6 shadow-xl text-xs">
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div>
            <label className="block font-semibold text-slate-300 mb-1">Brokerage Corporate Legal Entity</label>
            <input
              type="text"
              value={settings.brokerageName}
              onChange={(e) => setSettings({ ...settings, brokerageName: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">FINRA / DRE Master License ID</label>
            <input
              type="text"
              value={settings.licenseId}
              onChange={(e) => setSettings({ ...settings, licenseId: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Standard Sales Brokerage Fee (%)</label>
            <input
              type="number"
              step="0.05"
              value={settings.standardCommissionBuy}
              onChange={(e) => setSettings({ ...settings, standardCommissionBuy: Number(e.target.value) })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>

          <div>
            <label className="block font-semibold text-slate-300 mb-1">Notification Dispatch Email</label>
            <input
              type="email"
              value={settings.notificationEmail}
              onChange={(e) => setSettings({ ...settings, notificationEmail: e.target.value })}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl p-2.5 text-white font-mono"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 space-y-3">
          <h4 className="font-semibold text-white uppercase font-mono tracking-wider text-[11px]">
            Security & Authentication Policies
          </h4>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">Require Multi-Factor Authentication (MFA)</div>
              <div className="text-[11px] text-slate-400">Enforce hardware or authenticator app tokens for all admin roles.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.requireMfaForAdmins}
              onChange={(e) => setSettings({ ...settings, requireMfaForAdmins: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
            />
          </div>

          <div className="flex items-center justify-between p-3 bg-slate-950/60 rounded-xl border border-slate-800">
            <div>
              <div className="font-semibold text-slate-200">Platform Maintenance Mode</div>
              <div className="text-[11px] text-slate-400">Temporarily display institutional maintenance notice on public portal.</div>
            </div>
            <input
              type="checkbox"
              checked={settings.maintenanceMode}
              onChange={(e) => setSettings({ ...settings, maintenanceMode: e.target.checked })}
              className="w-4 h-4 rounded text-amber-500 bg-slate-900 border-slate-700"
            />
          </div>
        </div>

        <div className="pt-4 border-t border-slate-800 flex justify-end">
          <button
            type="submit"
            className="inline-flex items-center gap-2 px-6 py-2.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold uppercase rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Save className="w-4 h-4" />
            <span>Save Settings</span>
          </button>
        </div>
      </form>
    </div>
  );
};
