import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { Activity, Clock, ShieldCheck, Terminal } from 'lucide-react';

export const AdminActivityPage: React.FC = () => {
  const [logs, setLogs] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    api.activity.list().then(setLogs).catch(console.error).finally(() => setLoading(false));
  }, []);

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
          System Audit & Security Activity Logs
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Cryptographically recorded session activities, listing mutations, and privilege escalation audits.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/60 border-b border-slate-800 text-slate-400 font-mono uppercase text-[10px] tracking-wider">
              <tr>
                <th className="px-5 py-3.5">Timestamp</th>
                <th className="px-5 py-3.5">User</th>
                <th className="px-5 py-3.5">Role</th>
                <th className="px-5 py-3.5">Action Executed</th>
                <th className="px-5 py-3.5">Entity</th>
                <th className="px-5 py-3.5">IP Address</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-800/60 font-mono text-xs">
              {logs.map((log) => (
                <tr key={log.id} className="hover:bg-slate-800/30 transition-colors">
                  <td className="px-5 py-3.5 text-slate-400 text-[11px]">
                    {new Date(log.timestamp).toLocaleString()}
                  </td>
                  <td className="px-5 py-3.5 text-white font-sans font-semibold">
                    {log.userName}
                  </td>
                  <td className="px-5 py-3.5">
                    <span className="text-[10px] uppercase font-bold text-amber-400">
                      {log.userRole}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-slate-200 font-sans">
                    {log.action}
                  </td>
                  <td className="px-5 py-3.5 text-slate-400">
                    <span className="text-emerald-400">{log.entity}</span> ({log.entityId})
                  </td>
                  <td className="px-5 py-3.5 text-slate-500 text-[11px]">
                    {log.ip || '127.0.0.1'}
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
