'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import { BarChart3, PieChart as PieChartIcon } from 'lucide-react';
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
    const manyBars = chart.data.length > 8;
    const unit = chart.valueUnit ?? '';
    const formatY = (v: number) => `${v.toLocaleString()}${unit}`;
    // Only show the per-category legend when bars carry distinct colors and
    // there are few enough to be meaningful (matches the source visuals,
    // which omit the legend for the many-bar revenue charts).
    const distinctColors = new Set(chart.data.map((d) => d.color)).size > 1;
    const showLegend = (hasBenchmark || distinctColors) && !manyBars;

    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-dawn-border bg-white">
        {chart.title && (
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
            <BarChart3 size={15} className="text-dawn-purple" />
            <p className="text-sm font-semibold text-dawn-navy">{chart.title}</p>
          </div>
        )}
        <div className="p-4">
        <ResponsiveContainer width="100%" height={manyBars ? 300 : 260}>
          <BarChart
            data={chart.data}
            margin={{ top: 5, right: 20, left: 10, bottom: manyBars ? 40 : 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" vertical={false} />
            <XAxis
              dataKey="name"
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              interval={0}
              angle={manyBars ? -45 : 0}
              textAnchor={manyBars ? 'end' : 'middle'}
              height={manyBars ? 60 : 30}
            />
            <YAxis
              tick={{ fontSize: 11, fill: '#64748b' }}
              axisLine={false}
              tickLine={false}
              tickFormatter={formatY}
              width={70}
            />
            <Tooltip
              formatter={(value) => formatY(Number(value))}
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Bar dataKey="value" name="Actual" radius={[4, 4, 0, 0]} maxBarSize={manyBars ? 18 : 44}>
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
                maxBarSize={manyBars ? 18 : 44}
              />
            )}
          </BarChart>
        </ResponsiveContainer>
        {showLegend && <BarChartLegend data={chart.data} showBenchmark={hasBenchmark} />}
        </div>
      </div>
    );
  }

  if (chart.type === 'donut') {
    const total = chart.data.reduce((sum, d) => sum + d.value, 0);
    return (
      <div className="mt-4 overflow-hidden rounded-xl border border-dawn-border bg-white">
        {chart.title && (
          <div className="flex items-center gap-2 border-b border-slate-200 bg-slate-50/80 px-4 py-3">
            <PieChartIcon size={15} className="text-dawn-purple" />
            <p className="text-sm font-semibold text-dawn-navy">{chart.title}</p>
          </div>
        )}
        <div className="p-4">
        <div className="flex flex-col items-center">
          <ResponsiveContainer width={200} height={200}>
            <PieChart>
              <Pie
                data={chart.data}
                cx="50%"
                cy="50%"
                innerRadius={55}
                outerRadius={85}
                paddingAngle={1}
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
        </div>
        <div className="mt-4 grid grid-cols-1 gap-2 sm:grid-cols-2">
          {chart.data.map((entry, index) => (
            <div
              key={entry.name}
              className="flex items-center gap-2 rounded-lg bg-slate-50/70 px-3 py-2"
            >
              <div
                className="h-2.5 w-2.5 shrink-0 rounded-full"
                style={{ backgroundColor: entry.color || DONUT_COLORS[index % DONUT_COLORS.length] }}
              />
              <span className="flex-1 truncate text-xs text-gray-600">{entry.name}</span>
              <span className="text-xs font-semibold text-dawn-navy">
                {entry.value}{chart.valueUnit ?? ''}
              </span>
            </div>
          ))}
        </div>
        {!chart.hideTotal && (
          <div className="mt-2 border-t border-gray-100 pt-1">
            <span className="text-[10px] uppercase tracking-wide text-gray-400">Total: {total} assets</span>
          </div>
        )}
        </div>
      </div>
    );
  }

  return null;
}
