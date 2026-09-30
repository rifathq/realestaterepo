import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../../context/AuthContext';
import { api } from '../../services/api';
import {
  Building2,
  Inbox,
  CalendarCheck,
  TrendingUp,
  Plus,
  ArrowRight,
  BadgeCheck,
  Star,
  Clock,
  CheckCircle2,
} from 'lucide-react';

export const AgentDashboardPage: React.FC = () => {
  const { user } = useAuth();
  const [stats, setStats] = useState<any>(null);
  const [leads, setLeads] = useState<any[]>([]);
  const [appointments, setAppointments] = useState<any[]>([]);
  const [properties, setProperties] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      try {
        const [statsData, leadsData, aptsData, propsData] = await Promise.all([
          api.stats.get(),
          api.leads.list(),
          api.appointments.list(),
          api.properties.list(),
        ]);
        setStats(statsData);
        setLeads(leadsData);
        setAppointments(aptsData);
        setProperties(propsData.filter((p) => p.agentId === user?.agentId));
      } catch (err) {
        console.error('Failed to load agent workspace:', err);
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [user]);

  if (loading) {
    return (
      <div className="space-y-6 animate-pulse">
        <div className="h-8 bg-neutral-900 rounded w-1/4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-28 bg-neutral-900 rounded-2xl" />
          ))}
        </div>
      </div>
    );
  }

  const cards = [
    {
      label: 'My Active Listings',
      value: stats?.assignedProperties || properties.length,
      detail: 'Assigned to your portfolio',
      icon: Building2,
      color: 'text-amber-400 bg-amber-500/10 border-amber-500/30',
    },
    {
      label: 'Active Client Inquiries',
      value: stats?.assignedLeads || leads.length,
      detail: `${stats?.newLeads || 0} requiring response`,
      icon: Inbox,
      color: 'text-sky-400 bg-sky-500/10 border-sky-500/30',
    },
    {
      label: 'Upcoming Private Tours',
      value: stats?.upcomingAppointments || appointments.length,
      detail: 'Scheduled walkthroughs',
      icon: CalendarCheck,
      color: 'text-emerald-400 bg-emerald-500/10 border-emerald-500/30',
    },
    {
      label: 'Career Volume Closed',
      value: stats?.careerVolume || '$380.5M',
      detail: `${stats?.dealsClosed || 324} deals completed`,
      icon: TrendingUp,
      color: 'text-purple-400 bg-purple-500/10 border-purple-500/30',
    },
  ];

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-xs font-mono uppercase tracking-widest text-amber-400 font-semibold">
              Digentic Advisor Workspace
            </span>
            <BadgeCheck className="w-4 h-4 text-amber-400" />
          </div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight">
            Welcome back, {user?.name}
          </h1>
          <p className="text-xs text-neutral-400 mt-1">
            Review your assigned asset listings, private tour itinerary, and client acquisition inquiries.
          </p>
        </div>

        <div className="flex items-center gap-3">
          <Link
            to="/agent/properties"
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-amber-500 hover:bg-amber-400 text-neutral-950 font-bold text-xs uppercase tracking-wider rounded-xl transition-all shadow-md"
          >
            <Plus className="w-4 h-4 stroke-[2.5]" />
            <span>New Listing</span>
          </Link>
          <Link
            to="/agent/appointments"
            className="inline-flex items-center gap-2 py-2 px-3.5 bg-neutral-900 hover:bg-neutral-800 text-neutral-200 border border-neutral-700 font-medium text-xs rounded-xl transition-all"
          >
            <CalendarCheck className="w-4 h-4 text-neutral-400" />
            <span>Tour Calendar</span>
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
              className="bg-neutral-900/80 border border-neutral-800 p-5 rounded-2xl shadow-xl flex flex-col justify-between"
            >
              <div className="flex items-center justify-between mb-3">
                <span className="text-xs font-semibold text-neutral-400">{c.label}</span>
                <div className={`w-8 h-8 rounded-xl border flex items-center justify-center ${c.color}`}>
                  <Icon className="w-4 h-4" />
                </div>
              </div>
              <div>
                <div className="text-2xl sm:text-3xl font-bold text-white font-architectural">
                  {c.value}
                </div>
                <div className="text-[11px] font-mono text-neutral-400 mt-1 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                  <span>{c.detail}</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Two Columns: My Leads & My Tours */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        {/* Assigned Inquiries */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <Inbox className="w-4 h-4 text-amber-400" />
                <h3 className="font-semibold text-sm text-white">Assigned Client Inquiries</h3>
              </div>
              <Link
                to="/agent/leads"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>View all</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-800/80 mt-2">
              {leads.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                  No active inquiries currently assigned.
                </div>
              ) : (
                leads.map((lead) => (
                  <div key={lead.id} className="py-3 flex items-start justify-between gap-4">
                    <div className="min-w-0 flex-1">
                      <div className="flex items-center gap-2">
                        <span className="text-xs font-semibold text-white">{lead.clientName}</span>
                        <span
                          className={`text-[9px] font-mono px-2 py-0.5 rounded uppercase font-bold ${
                            lead.status === 'new'
                              ? 'bg-sky-500/20 text-sky-300 border border-sky-500/30'
                              : 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30'
                          }`}
                        >
                          {lead.status}
                        </span>
                      </div>
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {lead.propertyTitle} • {lead.inquiryType}
                      </div>
                      <div className="text-[11px] text-neutral-500 font-mono mt-0.5">
                        {lead.clientEmail}
                      </div>
                    </div>
                    <span className="text-[10px] font-mono text-amber-400 font-bold shrink-0">
                      {lead.budget}
                    </span>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

        {/* Upcoming Walkthroughs */}
        <div className="bg-neutral-900/80 border border-neutral-800 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-neutral-800">
              <div className="flex items-center gap-2">
                <CalendarCheck className="w-4 h-4 text-emerald-400" />
                <h3 className="font-semibold text-sm text-white">Upcoming Private Tours</h3>
              </div>
              <Link
                to="/agent/appointments"
                className="text-xs text-amber-400 hover:text-amber-300 font-medium flex items-center gap-1"
              >
                <span>View calendar</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="divide-y divide-neutral-800/80 mt-2">
              {appointments.length === 0 ? (
                <div className="py-8 text-center text-xs text-neutral-500 font-mono">
                  No upcoming tours scheduled.
                </div>
              ) : (
                appointments.map((apt) => (
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
                      <div className="text-[11px] text-neutral-400 truncate mt-0.5">
                        {apt.propertyTitle}
                      </div>
                    </div>
                    <div className="text-right shrink-0">
                      <div className="text-xs font-mono font-semibold text-neutral-300">{apt.date}</div>
                      <div className="text-[10px] font-mono text-neutral-500">{apt.time}</div>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
