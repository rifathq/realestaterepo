import React, { useState, useEffect } from 'react';
import { api } from '../../services/api';
import { CalendarCheck, Search, CheckCircle2, Clock, XCircle, Phone, Mail, User } from 'lucide-react';

export const AdminAppointmentsPage: React.FC = () => {
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');
  const [statusFilter, setStatusFilter] = useState('All');
  const [toast, setToast] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(null), 3000);
  };

  const loadAppointments = async () => {
    try {
      setLoading(true);
      const data = await api.appointments.list();
      setAppointments(data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    loadAppointments();
  }, []);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.appointments.update(id, { status: newStatus });
      showToast(`Appointment status changed to "${newStatus}".`);
      await loadAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update status.');
    }
  };

  const filtered = appointments.filter((a) => {
    const matchesSearch =
      a.clientName?.toLowerCase().includes(search.toLowerCase()) ||
      a.propertyTitle?.toLowerCase().includes(search.toLowerCase()) ||
      a.clientEmail?.toLowerCase().includes(search.toLowerCase());
    const matchesStatus = statusFilter === 'All' || a.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

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
          Private Tours & Inspections Schedule
        </h1>
        <p className="text-xs text-slate-400 mt-1">
          Coordinate client walkthroughs, technical MEP inspections, and title audits.
        </p>
      </div>

      <div className="bg-slate-900/80 border border-slate-800 p-4 rounded-2xl flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="relative w-full sm:w-80">
          <Search className="w-4 h-4 text-slate-500 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by client or property..."
            className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-10 pr-3 py-2 text-xs text-white placeholder:text-slate-500 focus:outline-none focus:border-amber-500/50"
          />
        </div>

        <div className="flex items-center gap-2 w-full sm:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="bg-slate-950 border border-slate-800 text-xs text-slate-300 rounded-xl px-3 py-2 focus:outline-none focus:border-amber-500/50"
          >
            <option value="All">All Statuses ({appointments.length})</option>
            <option value="confirmed">Confirmed</option>
            <option value="pending">Pending</option>
            <option value="completed">Completed</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {filtered.map((apt) => (
          <div
            key={apt.id}
            className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
          >
            <div>
              <div className="flex items-center justify-between mb-3">
                <span className="text-[10px] font-mono uppercase tracking-wider text-slate-400">
                  {apt.type || 'Private Tour'}
                </span>
                <span
                  className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                    apt.status === 'confirmed'
                      ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                      : apt.status === 'pending'
                      ? 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                      : 'bg-slate-800 text-slate-400 border border-slate-700'
                  }`}
                >
                  {apt.status}
                </span>
              </div>

              <h4 className="text-sm font-bold text-white font-architectural line-clamp-1 mb-1">
                {apt.propertyTitle}
              </h4>

              <div className="p-3 bg-slate-950/60 rounded-xl border border-slate-800/80 space-y-1.5 text-xs text-slate-300 my-3">
                <div className="flex items-center gap-2">
                  <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                  <span className="font-semibold text-white truncate">{apt.clientName}</span>
                </div>
                <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                  <Mail className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                  <span className="truncate">{apt.clientEmail}</span>
                </div>
                {apt.clientPhone && (
                  <div className="flex items-center gap-2 font-mono text-[11px] text-slate-400">
                    <Phone className="w-3.5 h-3.5 text-slate-500 shrink-0" />
                    <span>{apt.clientPhone}</span>
                  </div>
                )}
              </div>

              {apt.notes && (
                <p className="text-[11px] text-slate-400 italic line-clamp-2">
                  "{apt.notes}"
                </p>
              )}
            </div>

            <div className="pt-3 border-t border-slate-800/80 flex items-center justify-between">
              <div>
                <div className="text-xs font-mono font-bold text-amber-400">{apt.date}</div>
                <div className="text-[10px] font-mono text-slate-500">{apt.time}</div>
              </div>

              <div className="flex items-center gap-1.5">
                {apt.status !== 'confirmed' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                    className="p-1.5 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs cursor-pointer"
                    title="Confirm Tour"
                  >
                    Confirm
                  </button>
                )}
                {apt.status !== 'cancelled' && (
                  <button
                    onClick={() => handleUpdateStatus(apt.id, 'cancelled')}
                    className="p-1.5 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs cursor-pointer"
                    title="Cancel Tour"
                  >
                    Cancel
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
