import React, { useState, useEffect } from 'react';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import { CalendarCheck, CheckCircle2, User, Mail, Phone } from 'lucide-react';

export const AgentAppointmentsPage: React.FC = () => {
  const { user } = useAuth();
  const [appointments, setAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [toast, setToast] = useState<string | null>(null);

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
  }, [user]);

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      await api.appointments.update(id, { status: newStatus });
      setToast(`Tour status changed to ${newStatus}.`);
      setTimeout(() => setToast(null), 3000);
      await loadAppointments();
    } catch (err: any) {
      alert(err.message || 'Failed to update tour status.');
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
          Private Tour Itinerary
        </h1>
        <p className="text-xs text-neutral-400 mt-1">
          Scheduled client property viewings and advisory walkthroughs.
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {appointments.length === 0 ? (
          <div className="col-span-full p-12 text-center text-xs text-neutral-500 font-mono bg-neutral-900/80 rounded-2xl border border-neutral-800">
            No tours scheduled at this time.
          </div>
        ) : (
          appointments.map((apt) => (
            <div
              key={apt.id}
              className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-5 shadow-xl flex flex-col justify-between space-y-4"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <span className="text-[10px] font-mono uppercase tracking-wider text-neutral-400">
                    {apt.type || 'Private Walkthrough'}
                  </span>
                  <span
                    className={`px-2 py-0.5 rounded-full text-[10px] font-mono font-bold uppercase ${
                      apt.status === 'confirmed'
                        ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                    }`}
                  >
                    {apt.status}
                  </span>
                </div>

                <h4 className="text-sm font-bold text-white font-architectural line-clamp-1 mb-1">
                  {apt.propertyTitle}
                </h4>

                <div className="p-3 bg-neutral-950/60 rounded-xl border border-neutral-800/80 space-y-1.5 text-xs text-neutral-300 my-3">
                  <div className="flex items-center gap-2">
                    <User className="w-3.5 h-3.5 text-amber-400 shrink-0" />
                    <span className="font-semibold text-white">{apt.clientName}</span>
                  </div>
                  <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                    <Mail className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                    <span>{apt.clientEmail}</span>
                  </div>
                  {apt.clientPhone && (
                    <div className="flex items-center gap-2 font-mono text-[11px] text-neutral-400">
                      <Phone className="w-3.5 h-3.5 text-neutral-500 shrink-0" />
                      <span>{apt.clientPhone}</span>
                    </div>
                  )}
                </div>

                {apt.notes && (
                  <p className="text-[11px] text-neutral-400 italic line-clamp-2">
                    "{apt.notes}"
                  </p>
                )}
              </div>

              <div className="pt-3 border-t border-neutral-800/80 flex items-center justify-between">
                <div>
                  <div className="text-xs font-mono font-bold text-amber-400">{apt.date}</div>
                  <div className="text-[10px] font-mono text-neutral-500">{apt.time}</div>
                </div>

                <div className="flex items-center gap-1.5">
                  {apt.status !== 'confirmed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'confirmed')}
                      className="px-2.5 py-1 bg-emerald-500/20 hover:bg-emerald-500/30 text-emerald-300 rounded-lg text-xs cursor-pointer font-medium"
                    >
                      Confirm
                    </button>
                  )}
                  {apt.status !== 'completed' && (
                    <button
                      onClick={() => handleUpdateStatus(apt.id, 'completed')}
                      className="px-2.5 py-1 bg-neutral-800 hover:bg-neutral-700 text-neutral-300 rounded-lg text-xs cursor-pointer"
                    >
                      Complete
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};
