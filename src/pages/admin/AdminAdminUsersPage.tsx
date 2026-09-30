import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { ShieldCheck, Plus, CheckCircle2, UserCheck, Key, Lock } from 'lucide-react';

export const AdminAdminUsersPage: React.FC = () => {
  const [adminUsers, setAdminUsers] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const users = await api.users.list();
        setAdminUsers(users.filter((u: any) => u.role === 'super_admin' || u.role === 'admin'));
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          Administrative Access Control (RBAC)
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Authorized console principals with Super Admin access keys and full ledger execution rights.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Admin Principal</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Title</th>
                <th className="px-5 py-3.5">Security Level</th>
                <th className="px-5 py-3.5">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60">
              {adminUsers.map((u) => (
                <tr key={u.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-full bg-amber-500/20 border border-amber-500/40 text-amber-400 flex items-center justify-center font-bold text-xs">
                        {u.name?.slice(0, 2).toUpperCase() || 'AD'}
                      </div>
                      <div>
                        <div className="font-semibold text-white">{u.name}</div>
                        <div className="text-[11px] text-slate-400 font-mono">{u.email}</div>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-amber-500/20 text-amber-300 border border-amber-500/30">
                      Super Admin
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-300">{u.title || 'Managing Principal'}</td>
                  <td className="px-5 py-3.5 font-mono text-emerald-400 flex items-center gap-1.5">
                    <Key className="w-3.5 h-3.5" />
                    <span>Tier 1 Ledger Authority</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
                      Active
                    </span>
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
