'use client';

import { X, TrendingUp, TrendingDown } from 'lucide-react';
import { MARKET_METRICS, PERSONA_ENGAGEMENT, OPTIMIZATION_RECS } from '@/lib/mockData';

interface EffectivenessModalProps {
  onConfirm: () => void;
  onClose: () => void;
}

const KPI_DATA = [
  { label: 'Email Open Rate', value: '34%', trend: '↑ 8%', trendUp: true, benchmark: 'vs. 26% benchmark', color: 'text-dawn-teal' },
  { label: 'Email CTR', value: '12.4%', trend: '↑ 4.1%', trendUp: true, benchmark: 'vs. 8.3% benchmark', color: 'text-dawn-teal' },
  { label: 'DDA Engagement', value: '4.2 min', trend: '↑ 1.1 min', trendUp: true, benchmark: 'vs. 3.1 min avg', color: 'text-dawn-teal' },
  { label: 'Rx Switches', value: '223', trend: '+47 MoM', trendUp: true, benchmark: 'vs. 160 target', color: 'text-dawn-purple' },
];

const STATUS_CELL = {
  above: 'bg-dawn-green/10 text-dawn-green',
  near: 'bg-dawn-amber/10 text-dawn-amber',
  below: 'bg-dawn-red/10 text-dawn-red',
};

export default function EffectivenessModal({ onConfirm, onClose }: EffectivenessModalProps) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />
      <div className="relative flex max-h-[92vh] w-full max-w-6xl flex-col overflow-hidden rounded-2xl border border-[#e2e8f7] bg-white shadow-[0_24px_64px_rgba(15,23,42,0.2)] animate-scale-in">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-dawn-border">
          <div className="flex items-center gap-3">
            <div className="w-6 h-6 bg-dawn-navy rounded flex items-center justify-center">
              <span className="text-white font-serif text-xs font-bold">D</span>
            </div>
            <div>
              <h2 className="font-serif text-dawn-navy text-lg">Content Effectiveness</h2>
              <p className="text-xs text-gray-400">Stage 8 — Performance Analytics</p>
            </div>
          </div>
          <button onClick={onClose} className="text-gray-400 hover:text-dawn-navy cursor-pointer"><X size={20} /></button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

          {/* Section 1: KPI Cards */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Campaign KPIs</h3>
            <div className="grid grid-cols-2 gap-3">
              {KPI_DATA.map((kpi) => (
                <div key={kpi.label} className="bg-white border border-dawn-border rounded-xl p-4">
                  <p className="text-[10px] text-gray-400 uppercase tracking-wide mb-1">{kpi.label}</p>
                  <p className={`text-3xl font-bold font-serif leading-none ${kpi.color}`}>{kpi.value}</p>
                  <div className="flex items-center gap-1.5 mt-2">
                    {kpi.trendUp ? <TrendingUp size={12} className="text-dawn-green" /> : <TrendingDown size={12} className="text-dawn-red" />}
                    <span className={`text-xs font-semibold ${kpi.trendUp ? 'text-dawn-green' : 'text-dawn-red'}`}>{kpi.trend}</span>
                  </div>
                  <p className="text-[10px] text-gray-400 mt-0.5">{kpi.benchmark}</p>
                </div>
              ))}
            </div>
          </section>

          {/* Section 2: Market Comparison Table */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Market Comparison</h3>
            <div className="overflow-hidden rounded-xl border border-dawn-border">
              <table className="w-full text-xs">
                <thead>
                  <tr className="bg-gray-50 border-b border-dawn-border">
                    {['Market', 'Open Rate', 'CTR', 'DDA Time', 'Poster Downloads'].map((h) => (
                      <th key={h} className="px-3 py-2.5 text-left font-semibold text-gray-500 uppercase tracking-wide text-[10px]">{h}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {MARKET_METRICS.map((row) => (
                    <tr key={row.market} className="border-b border-dawn-border last:border-0">
                      <td className="px-3 py-2.5 font-semibold text-dawn-navy">{row.market}</td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_CELL[row.openRateStatus]}`}>{row.openRate}</span>
                      </td>
                      <td className="px-3 py-2.5">
                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-medium ${STATUS_CELL[row.ctrStatus]}`}>{row.ctr}</span>
                      </td>
                      <td className="px-3 py-2.5 text-gray-600">{row.ddaTime}</td>
                      <td className="px-3 py-2.5 text-gray-600">{row.posterDownloads}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </section>

          {/* Section 3: HCP Persona Performance */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">HCP Persona Performance</h3>
            <div className="grid grid-cols-2 gap-3">
              {PERSONA_ENGAGEMENT.map((p) => (
                <div key={p.persona} className="bg-white border border-dawn-border rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div>
                      <p className="text-xs font-semibold text-dawn-navy">{p.persona}</p>
                      <p className="text-[10px] text-gray-400">{p.type}</p>
                    </div>
                    <span className="text-sm font-bold" style={{ color: p.color }}>{p.score}%</span>
                  </div>
                  <div className="w-full bg-gray-100 rounded-full h-1.5">
                    <div
                      className="h-1.5 rounded-full transition-all duration-700"
                      style={{ width: `${p.score}%`, backgroundColor: p.color }}
                    />
                  </div>
                </div>
              ))}
            </div>
          </section>

          {/* Section 4: Auto-Tagging */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Audience Auto-Tagging</h3>
            <div className="bg-white border border-dawn-border rounded-xl p-4">
              <p className="text-xs text-gray-500 mb-3">HCP Email audience composition (US)</p>
              <div className="flex rounded-full overflow-hidden h-4 mb-3">
                <div className="bg-dawn-navy h-full" style={{ width: '45%' }} />
                <div className="bg-dawn-teal h-full" style={{ width: '35%' }} />
                <div className="bg-dawn-sky h-full border-l border-r border-white" style={{ width: '20%' }} />
              </div>
              <div className="flex gap-4">
                {[
                  { label: 'Prescribers', pct: '45%', color: 'bg-dawn-navy' },
                  { label: 'Specialists', pct: '35%', color: 'bg-dawn-teal' },
                  { label: 'Nurse Practitioners', pct: '20%', color: 'bg-dawn-sky border border-dawn-border' },
                ].map(({ label, pct, color }) => (
                  <div key={label} className="flex items-center gap-1.5">
                    <div className={`w-3 h-3 rounded-sm ${color}`} />
                    <span className="text-xs text-gray-600">{label} <strong className="text-dawn-navy">{pct}</strong></span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          {/* Section 5: Recommendations */}
          <section>
            <h3 className="text-xs font-semibold text-gray-400 uppercase tracking-wider mb-3">Optimization Recommendations</h3>
            <div className="bg-dawn-amber/5 border border-dawn-amber/20 rounded-xl p-4 space-y-3">
              {OPTIMIZATION_RECS.map((rec, i) => (
                <div key={i} className="bg-white rounded-lg border border-dawn-amber/20 p-3">
                  <p className="text-xs font-semibold text-dawn-navy mb-1">Finding {i + 1}</p>
                  <p className="text-xs text-gray-600 mb-2">{rec.finding}</p>
                  <p className="text-xs text-dawn-navy font-medium mb-1">→ {rec.action}</p>
                  <span className="inline-flex text-[10px] bg-dawn-green/10 text-dawn-green border border-dawn-green/20 rounded-full px-2 py-0.5">
                    {rec.impact}
                  </span>
                </div>
              ))}
            </div>
          </section>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-dawn-border bg-white flex justify-end gap-3">
          <button onClick={onClose} className="px-4 py-2 text-sm text-gray-500 hover:text-dawn-navy border border-dawn-border rounded-lg transition-colors cursor-pointer">Cancel</button>
          <button onClick={onConfirm} className="px-5 py-2 bg-dawn-teal text-white text-sm font-medium rounded-lg hover:bg-dawn-teal/90 transition-all shadow-sm cursor-pointer">
            Confirm & Continue →
          </button>
        </div>
      </div>
    </div>
  );
}
