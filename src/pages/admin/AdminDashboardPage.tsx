import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { api } from '../../services/api';
import {
  Building2,
  TrendingUp,
  Inbox,
  CalendarCheck,
  Users,
  ShieldCheck,
  Plus,
  ArrowRight,
  ExternalLink,
  Clock,
  CheckCircle2,
  AlertCircle,
} from 'lucide-react';

export const AdminDashboardPage: React.FC = () => {
  const [stats, setStats] = useState<any>(null);
  const [recentLeads, setRecentLeads] = useState<any[]>([]);
  const [recentAppointments, setRecentAppointments] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, leadsData, aptsData] = await Promise.all([
          api.stats.get(),
          api.leads.list(),
          api.appointments.list(),
        ]);
        setStats(statsData);
        setRecentLeads(leadsData.slice(0, 5));
        setRecentAppointments(aptsData.slice(0, 5));
      } catch (err) {
        console.error('Failed to load admin dashboard data:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-slate-900 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-32 bg-slate-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'Portfolio Asset Value',
      value: stats?.totalSalesVolume || '$49.8M',
      change: '+14.2% QoQ',
      icon: TrendingUp,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'Active Listings',
      value: stats?.activeListings || 5,
      change: '100% Title Verified',
      icon: Building2,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'Qualified Inquiries',
      value: stats?.totalLeads || 4,
      change: `${stats?.newLeads || 1} awaiting review`,
      icon: Inbox,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      label: 'Scheduled Private Tours',
      value: stats?.totalAppointments || 3,
      change: '2 this week',
      icon: CalendarCheck,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header & Quick Action Buttons */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
            Institutional Asset Console
          </h1>
          <p className="text-xs text-slate-400 mt-1">
            Global portfolio oversight, verified listings, due diligence audits, and transaction pipeline.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/admin/properties"
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-slate-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md cursor-pointer"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>Add Property</span>
          </Link>
          <Link
            to="/admin/appointments"
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-black hover:bg-neutral-900 text-white border border-black font-medium text-xs rounded-xl shadow-md hover:shadow-lg active:scale-95 transition-all duration-200"
          >
            <CalendarCheck className="w-4 h-4 text-white" />
            <span>Tours Calendar</span>
          </Link>
        </div>
      </div>

      {/* Metrics Row */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((c) => {
          const Icon = c.icon;
          return (
            <div
              key={c.label}
              className="bg-slate-900/80 border border-slate-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-slate-400">{c.label}</span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                  {c.value}
                </div>
                <div className="text-[11px] font-mono text-slate-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" />
                  <span>{c.change}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Column Layout: Recent Leads & Scheduled Appointments */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Recent Client Leads */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-white">Recent Client Inquiries</h3>
              </div>
              <Link
                to="/admin/leads"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {recentLeads.map((lead) => (
                <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{lead.clientName}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          lead.status === 'new'
                            ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                            : lead.status === 'touring'
                            ? 'bg-purple-500/20 text-purple-300 border border-purple-500/30'
                            : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                        }`}
                      >
                        {lead.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {lead.propertyTitle} • {lead.inquiryType}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      {lead.clientEmail}
                    </div>
                  </div>
                  <span className="text-[10px] font-mono text-slate-500 shrink-0">
                    {lead.budget}
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Scheduled Private Walkthroughs */}
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-800">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Upcoming Private Tours</h3>
              </div>
              <Link
                to="/admin/appointments"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>View schedule</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-slate-800/80 mt-2">
              {recentAppointments.map((apt) => (
                <div key={apt.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-semibold text-white">{apt.clientName}</span>
                      <span
                        className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                          apt.status === 'confirmed'
                            ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                            : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                        }`}
                      >
                        {apt.status}
                      </span>
                    </div>
                    <div className="text-[11px] text-slate-400 truncate mt-0.5">
                      {apt.propertyTitle}
                    </div>
                    <div className="text-[11px] text-slate-500 font-mono mt-0.5">
                      Advisor: {apt.agentName || 'Marcus Vance'}
                    </div>
                  </div>
                  <div className="text-right shrink-0">
                    <div className="text-xs font-mono font-semibold text-slate-300">{apt.date}</div>
                    <div className="text-[10px] font-mono text-slate-500">{apt.time}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
