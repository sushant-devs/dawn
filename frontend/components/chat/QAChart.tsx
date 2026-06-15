'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { ChartData } from '@/lib/types';

interface QAChartProps {
  chart: ChartData;
}

const DONUT_COLORS = ['#00a896', '#f59e0b', '#ef4444', '#6366f1'];

const CHART_COLORS = {
  benchmark: '#cbd5e1',
  fallback: '#00a896',
} as const;

function metricBarColor(color?: string) {
  return color ?? CHART_COLORS.fallback;
}

function BarChartLegend({
  data,
  showBenchmark,
}: {
  data: ChartData['data'];
  showBenchmark: boolean;
}) {
  return (
    <div className="mt-3 flex flex-wrap items-center justify-center gap-x-4 gap-y-2">
      {data.map((entry) => (
        <div key={entry.name} className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: metricBarColor(entry.color) }}
          />
          <span className="text-xs text-gray-600">{entry.name}</span>
        </div>
      ))}
      {showBenchmark && (
        <div className="flex items-center gap-1.5">
          <div
            className="h-3 w-3 shrink-0 rounded-sm"
            style={{ backgroundColor: CHART_COLORS.benchmark }}
          />
          <span className="text-xs text-gray-600">Benchmark</span>
        </div>
      )}
    </div>
  );
}

export default function QAChart({ chart }: QAChartProps) {
  if (chart.type === 'bar') {
    const hasBenchmark = chart.data.some((d) => d.benchmark !== undefined);

    return (
      <div className="mt-4 rounded-xl border border-dawn-border bg-white p-4">
        {chart.title && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dawn-navy">{chart.title}</p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Bar dataKey="value" name="Actual" radius={[4, 4, 0, 0]}>
              {chart.data.map((entry, index) => (
                <Cell key={`value-${index}`} fill={metricBarColor(entry.color)} />
              ))}
            </Bar>
            {hasBenchmark && (
              <Bar
                dataKey="benchmark"
                name="Benchmark"
                fill={CHART_COLORS.benchmark}
                radius={[4, 4, 0, 0]}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        <BarChartLegend data={chart.data} showBenchmark={hasBenchmark} />
      </div>
    );
  }

  if (chart.type === 'donut') {
    const total = chart.data.reduce((sum, d) => sum + d.value, 0);
    return (
      <div className="mt-4 rounded-xl border border-dawn-border bg-white p-4">
        {chart.title && (
          <p className="mb-3 text-xs font-semibold uppercase tracking-wide text-dawn-navy">{chart.title}</p>
        )}
        <div className="flex items-center gap-4">
          <ResponsiveContainer width={160} height={160}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={45}
                outerRadius={70}
                dataKey="value"
                stroke="none"
              >
                {chart.data.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={entry.color || DONUT_COLORS[index % DONUT_COLORS.length]} />
                ))}
              </Pie>
              <Tooltip contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }} />
            </PieChart>
          </ResponsiveContainer>
          <div className="flex-1 space-y-2">
            {chart.data.map((entry, index) => (
              <div key={entry.name} className="flex items-center gap-2">
                <div
                  className="h-3 w-3 shrink-0 rounded-full"
                  style={{ backgroundColor: entry.color || DONUT_COLORS[index % DONUT_COLORS.length] }}
                />
                <span className="flex-1 text-xs text-gray-600">{entry.name}</span>
                <span className="text-xs font-semibold text-dawn-navy">{entry.value}</span>
              </div>
            ))}
            <div className="border-t border-gray-100 pt-1">
              <span className="text-[10px] uppercase tracking-wide text-gray-400">Total: {total} assets</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
