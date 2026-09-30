import React, { useCallback, useEffect, useMemo, useState } from 'react';
import { api } from '../../services/api';
import {
  Scale,
  CheckCircle2,
  CircleX,
  Clock3,
  ChevronDown,
  RefreshCw,
  ExternalLink,
  Wrench,
  BadgeCheck,
  HelpCircle,
  CircleDashed,
} from 'lucide-react';

type Status = 'pass' | 'fix' | 'you';
type FactStatus = 'verified' | 'decided' | 'confirm' | 'needed';

interface Finding {
  text: string;
  where?: string;
}

interface Check {
  id: string;
  area: string;
  title: string;
  status: Status;
  rule: { label: string; url?: string };
  found: Finding[];
  fix: string;
}

interface Fact {
  key: string;
  group: string;
  label: string;
  value: string | null;
  status: FactStatus;
  source: string;
  sourceUrl?: string;
  note?: string;
}

interface Report {
  checkedAt: string;
  factsCheckedOn: string | null;
  facts: Fact[];
  checks: Check[];
  summary: { total: number; pass: number; fix: number; you: number };
}

const STATUS_META: Record<Status, { label: string; icon: React.ElementType; text: string; dot: string; bar: string }> = {
  fix: { label: 'To fix', icon: CircleX, text: 'text-rose-400', dot: 'bg-rose-400', bar: 'bg-rose-500' },
  you: { label: 'Waiting on you', icon: Clock3, text: 'text-amber-400', dot: 'bg-amber-400', bar: 'bg-amber-500' },
  pass: { label: 'Passing', icon: CheckCircle2, text: 'text-emerald-400', dot: 'bg-emerald-400', bar: 'bg-emerald-500' },
};

const FACT_META: Record<FactStatus, { label: string; className: string; icon: React.ElementType }> = {
  verified: { label: 'Verified', className: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30', icon: BadgeCheck },
  decided: { label: 'Decided', className: 'text-emerald-300 bg-emerald-500/10 border-emerald-500/30', icon: CheckCircle2 },
  confirm: { label: 'Confirm', className: 'text-sky-300 bg-sky-500/10 border-sky-500/30', icon: HelpCircle },
  needed: { label: 'Needed', className: 'text-amber-300 bg-amber-500/10 border-amber-500/30', icon: CircleDashed },
};

const FILTERS: { key: 'all' | Status; label: string }[] = [
  { key: 'all', label: 'All' },
  { key: 'fix', label: 'To fix' },
  { key: 'you', label: 'Waiting on you' },
  { key: 'pass', label: 'Passing' },
];

function verdict(summary: Report['summary']) {
  if (summary.fix === 0 && summary.you === 0) {
    return { title: 'Ready to go live', body: 'Every check passes and your broker has approved the site.' };
  }
  if (summary.fix === 0) {
    return { title: 'Almost there', body: 'The site itself is clean. What remains is waiting on your details and decisions.' };
  }
  return {
    title: 'Not ready to go live',
    body: 'Fix the red items, send the amber details, then your eXp broker reviews the site.',
  };
}

const CheckRow: React.FC<{ check: Check; open: boolean; onToggle: () => void }> = ({ check, open, onToggle }) => {
  const meta = STATUS_META[check.status];
  const Icon = meta.icon;
  return (
    <li className="border-b border-slate-800/80 last:border-b-0">
      <button
        type="button"
        onClick={onToggle}
        aria-expanded={open}
        className="w-full flex items-start gap-3 px-4 sm:px-5 py-4 text-left hover:bg-slate-800/30 transition-colors"
      >
        <Icon className={`w-5 h-5 mt-0.5 shrink-0 ${meta.text}`} />
        <div className="min-w-0 flex-1">
          <div className="text-sm font-semibold text-white leading-snug">{check.title}</div>
          {!open && (
            <div className="text-xs text-slate-400 mt-1 truncate">
              {check.found[0]?.text}
              {check.found.length > 1 && <span className="text-slate-500"> · +{check.found.length - 1} more</span>}
            </div>
          )}
        </div>
        <span className="hidden sm:inline-flex shrink-0 text-[10px] font-mono text-slate-400 border border-slate-700 rounded-md px-1.5 py-0.5 mt-0.5">
          {check.rule.label}
        </span>
        <ChevronDown className={`w-4 h-4 mt-0.5 shrink-0 text-slate-500 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div className="px-4 sm:px-5 pb-5 pl-12 sm:pl-13 space-y-4">
          <div>
            <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-500 mb-2">What the site has now</div>
            <ul className="space-y-1.5">
              {check.found.map((f, i) => (
                <li key={i} className="text-xs text-slate-300 leading-relaxed">
                  <span>{f.text}</span>
                  {f.where && <span className="block font-mono text-[11px] text-slate-500 break-all">{f.where}</span>}
                </li>
              ))}
            </ul>
          </div>
          <div className="flex items-start gap-2 bg-slate-950/60 border border-slate-800 rounded-xl p-3">
            <Wrench className="w-3.5 h-3.5 mt-0.5 shrink-0 text-amber-400" />
            <p className="text-xs text-slate-200 leading-relaxed">{check.fix}</p>
          </div>
          {check.rule.url && (
            <a
              href={check.rule.url}
              target="_blank"
              rel="noreferrer"
              className="inline-flex items-center gap-1.5 text-[11px] text-slate-400 hover:text-amber-300"
            >
              <span>Read {check.rule.label}</span>
              <ExternalLink className="w-3 h-3" />
            </a>
          )}
        </div>
      )}
    </li>
  );
};

const FactRow: React.FC<{ fact: Fact }> = ({ fact }) => {
  const meta = FACT_META[fact.status];
  const Icon = meta.icon;
  return (
    <li className="py-3 border-b border-slate-800/80 last:border-b-0">
      <div className="flex items-center justify-between gap-3">
        <span className="text-[11px] font-semibold text-slate-400">{fact.label}</span>
        <span className={`inline-flex items-center gap-1 text-[10px] font-semibold border rounded-full px-2 py-0.5 ${meta.className}`}>
          <Icon className="w-3 h-3" />
          {meta.label}
        </span>
      </div>
      <div className={`text-xs mt-1 leading-snug ${fact.value ? 'text-white' : 'text-slate-500 italic'}`}>
        {fact.value || 'Not provided yet'}
      </div>
      <div className="text-[10px] text-slate-500 mt-1">
        {fact.sourceUrl ? (
          <a href={fact.sourceUrl} target="_blank" rel="noreferrer" className="hover:text-amber-300">
            {fact.source}
          </a>
        ) : (
          fact.source
        )}
        {fact.note && <span className="block text-slate-400 mt-0.5">{fact.note}</span>}
      </div>
    </li>
  );
};

const DisclosurePreview: React.FC<{ facts: Fact[] }> = ({ facts }) => {
  const get = (key: string) => facts.find((f) => f.key === key)?.value;
  const licence = get('agentLicense')?.match(/#(\d+)/)?.[1];
  const firmName = get('firm')?.split('·')[0]?.trim() || 'eXp Realty LLC';
  const address = get('firmAddress');
  const phone = get('firmPhone');
  return (
    <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
      <h3 className="text-sm font-semibold text-white">Disclosure preview</h3>
      <p className="text-[11px] text-slate-400 mt-1">How the required disclosure reads on every page. Final wording follows eXp's policy.</p>
      <div className="mt-4 bg-stone-50 text-stone-700 rounded-xl p-4 border border-stone-200 font-sans">
        <div className="text-sm font-semibold text-stone-900">{firmName}</div>
        <div className="text-[11px] leading-relaxed mt-0.5">
          {address || 'Office address'}
          {phone && <span> · {phone}</span>}
        </div>
        <div className="h-px bg-stone-200 my-3" />
        <div className="text-[11px] leading-relaxed">
          Masud Haque, Salesperson · Licensed in Virginia{licence && <span> · #{licence}</span>}
        </div>
        <div className="flex items-center gap-1.5 text-[10px] uppercase tracking-widest font-semibold text-stone-500 mt-3">
          <span className="inline-block w-3 h-3 border border-stone-400 rounded-[2px]" aria-hidden />
          Equal Housing Opportunity
        </div>
      </div>
    </div>
  );
};

export const AdminCompliancePage: React.FC = () => {
  const [report, setReport] = useState<Report | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | Status>('all');
  const [openId, setOpenId] = useState<string | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const data = await api.compliance.get();
      setReport(data);
    } catch (err: any) {
      setError(err.message || 'Could not run the checks.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    load();
  }, [load]);

  const grouped = useMemo(() => {
    if (!report) return [];
    const visible = report.checks.filter((c) => filter === 'all' || c.status === filter);
    const areas: { area: string; checks: Check[] }[] = [];
    for (const c of visible) {
      const bucket = areas.find((a) => a.area === c.area);
      if (bucket) bucket.checks.push(c);
      else areas.push({ area: c.area, checks: [c] });
    }
    return areas;
  }, [report, filter]);

  const factGroups = useMemo(() => {
    if (!report) return [];
    const groups: { group: string; facts: Fact[] }[] = [];
    for (const f of report.facts) {
      const bucket = groups.find((g) => g.group === f.group);
      if (bucket) bucket.facts.push(f);
      else groups.push({ group: f.group, facts: [f] });
    }
    return groups;
  }, [report]);

  const summary = report?.summary;
  const v = summary ? verdict(summary) : null;

  return (
    <div className="space-y-6 max-w-6xl">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4">
        <div>
          <div className="flex items-center gap-2 text-amber-400">
            <Scale className="w-4 h-4" />
            <span className="text-[10px] uppercase tracking-widest font-semibold">Virginia · FTC · Fair housing · Bright</span>
          </div>
          <h1 className="text-2xl font-bold font-architectural text-white tracking-tight mt-2">Compliance</h1>
          <p className="text-xs text-slate-400 mt-1 max-w-xl">
            Checks the site's own code and data against the rules that apply to your advertising, each time this page loads.
          </p>
        </div>
        <button
          type="button"
          onClick={load}
          disabled={loading}
          className="inline-flex items-center gap-2 py-2 px-3.5 bg-slate-900 hover:bg-slate-800 text-slate-100 border border-slate-700 font-semibold text-xs rounded-xl transition-all disabled:opacity-60 self-start sm:self-auto"
        >
          <RefreshCw className={`w-3.5 h-3.5 ${loading ? 'animate-spin' : ''}`} />
          <span>Re-run checks</span>
        </button>
      </div>

      {error && (
        <div className="bg-rose-500/10 border border-rose-500/30 rounded-2xl p-5 text-xs text-rose-200">
          Couldn't run the checks: {error}
        </div>
      )}

      {!report && loading && !error && (
        <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-8 text-xs text-slate-400">Running checks…</div>
      )}

      {report && summary && v && (
        <>
          <section className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 sm:p-7 shadow-xl">
            <div className="flex flex-col lg:flex-row lg:items-center gap-6 lg:gap-10">
              <div className="lg:w-2/5">
                <div className="text-xl sm:text-2xl font-bold font-architectural text-white">{v.title}</div>
                <p className="text-xs text-slate-400 mt-2 leading-relaxed">{v.body}</p>
              </div>
              <div className="flex-1">
                <div className="flex h-2.5 w-full overflow-hidden rounded-full bg-slate-800" role="img" aria-label={`${summary.pass} of ${summary.total} checks passing`}>
                  {(['pass', 'you', 'fix'] as Status[]).map((s) =>
                    summary[s] ? (
                      <div key={s} className={STATUS_META[s].bar} style={{ width: `${(summary[s] / summary.total) * 100}%` }} />
                    ) : null,
                  )}
                </div>
                <div className="grid grid-cols-3 gap-3 mt-4">
                  {(['fix', 'you', 'pass'] as Status[]).map((s) => (
                    <button
                      key={s}
                      type="button"
                      onClick={() => setFilter(filter === s ? 'all' : s)}
                      className={`text-left rounded-xl border px-3 py-2.5 transition-colors ${
                        filter === s ? 'border-slate-600 bg-slate-800/60' : 'border-slate-800 hover:border-slate-700'
                      }`}
                    >
                      <div className="text-xl sm:text-2xl font-bold font-architectural text-white">{summary[s]}</div>
                      <div className="flex items-center gap-1.5 text-[11px] text-slate-400 mt-0.5">
                        <span className={`w-1.5 h-1.5 rounded-full ${STATUS_META[s].dot}`} />
                        {STATUS_META[s].label}
                      </div>
                    </button>
                  ))}
                </div>
              </div>
            </div>
          </section>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-start">
            <section className="lg:col-span-2 space-y-4">
              <div className="flex items-center justify-between gap-3 flex-wrap">
                <div className="flex gap-1 bg-slate-900/80 border border-slate-800 rounded-xl p-1 overflow-x-auto no-scrollbar">
                  {FILTERS.map((f) => {
                    const count = f.key === 'all' ? summary.total : summary[f.key];
                    return (
                      <button
                        key={f.key}
                        type="button"
                        onClick={() => setFilter(f.key)}
                        className={`whitespace-nowrap text-xs font-semibold rounded-lg px-3 py-1.5 transition-colors ${
                          filter === f.key ? 'bg-amber-500 text-slate-950' : 'text-slate-400 hover:text-white'
                        }`}
                      >
                        {f.label} <span className="opacity-70">{count}</span>
                      </button>
                    );
                  })}
                </div>
                <span className="text-[11px] text-slate-500">
                  Checked {new Date(report.checkedAt).toLocaleTimeString([], { hour: 'numeric', minute: '2-digit' })}
                </span>
              </div>

              {grouped.length === 0 && (
                <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-6 text-xs text-slate-400">Nothing in this view.</div>
              )}

              {grouped.map(({ area, checks }) => (
                <div key={area} className="bg-slate-900/80 border border-slate-800 rounded-2xl shadow-xl overflow-hidden">
                  <div className="px-4 sm:px-5 py-3 border-b border-slate-800 flex items-center justify-between">
                    <h2 className="text-[11px] uppercase tracking-widest font-semibold text-slate-400">{area}</h2>
                    <div className="flex items-center gap-1">
                      {checks.map((c) => (
                        <span key={c.id} className={`w-1.5 h-1.5 rounded-full ${STATUS_META[c.status].dot}`} />
                      ))}
                    </div>
                  </div>
                  <ul>
                    {checks.map((c) => (
                      <CheckRow
                        key={c.id}
                        check={c}
                        open={openId === c.id}
                        onToggle={() => setOpenId(openId === c.id ? null : c.id)}
                      />
                    ))}
                  </ul>
                </div>
              ))}
            </section>

            <aside className="space-y-6 lg:sticky lg:top-6">
              <div className="bg-slate-900/80 border border-slate-800 rounded-2xl p-5 shadow-xl">
                <h3 className="text-sm font-semibold text-white">Details on file</h3>
                <p className="text-[11px] text-slate-400 mt-1">
                  {report.factsCheckedOn
                    ? `Looked up on ${new Date(`${report.factsCheckedOn}T12:00:00`).toLocaleDateString([], { month: 'short', day: 'numeric', year: 'numeric' })}. `
                    : ''}
                  Amber items come from you.
                </p>
                {factGroups.map(({ group, facts }) => (
                  <div key={group} className="mt-4">
                    <div className="text-[10px] uppercase tracking-widest font-semibold text-slate-500">{group}</div>
                    <ul>
                      {facts.map((f) => (
                        <FactRow key={f.key} fact={f} />
                      ))}
                    </ul>
                  </div>
                ))}
              </div>

              <DisclosurePreview facts={report.facts} />
            </aside>
          </div>
        </>
      )}
    </div>
  );
};
