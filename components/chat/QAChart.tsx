'use client';

import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer, Cell, PieChart, Pie } from 'recharts';
import type { ChartData } from '@/lib/types';

interface QAChartProps {
  chart: ChartData;
}

const DONUT_COLORS = ['#00a896', '#f59e0b', '#ef4444', '#6366f1'];

export default function QAChart({ chart }: QAChartProps) {
  if (chart.type === 'bar') {
    return (
      <div className="mt-4 bg-white border border-dawn-border rounded-xl p-4">
        {chart.title && (
          <p className="text-xs font-semibold text-dawn-navy mb-3 uppercase tracking-wide">{chart.title}</p>
        )}
        <ResponsiveContainer width="100%" height={220}>
          <BarChart data={chart.data} margin={{ top: 5, right: 20, left: 0, bottom: 5 }}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
            <XAxis dataKey="name" tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <YAxis tick={{ fontSize: 11, fill: '#64748b' }} axisLine={false} tickLine={false} />
            <Tooltip
              contentStyle={{ borderRadius: '12px', border: '1px solid #e2e8f0', fontSize: '12px' }}
            />
            <Legend wrapperStyle={{ fontSize: '11px' }} />
            <Bar dataKey="value" name="Actual" radius={[4, 4, 0, 0]}>
              {chart.data.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color || '#00a896'} />
              ))}
            </Bar>
            {chart.data.some(d => d.benchmark !== undefined) && (
              <Bar dataKey="benchmark" name="Benchmark" fill="#cbd5e1" radius={[4, 4, 0, 0]} />
            )}
          </BarChart>
        </ResponsiveContainer>
      </div>
    );
  }

  if (chart.type === 'donut') {
    const total = chart.data.reduce((sum, d) => sum + d.value, 0);
    return (
      <div className="mt-4 bg-white border border-dawn-border rounded-xl p-4">
        {chart.title && (
          <p className="text-xs font-semibold text-dawn-navy mb-3 uppercase tracking-wide">{chart.title}</p>
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
                  className="w-3 h-3 rounded-full shrink-0"
                  style={{ backgroundColor: entry.color || DONUT_COLORS[index % DONUT_COLORS.length] }}
                />
                <span className="text-xs text-gray-600 flex-1">{entry.name}</span>
                <span className="text-xs font-semibold text-dawn-navy">{entry.value}</span>
              </div>
            ))}
            <div className="pt-1 border-t border-gray-100">
              <span className="text-[10px] text-gray-400 uppercase tracking-wide">Total: {total} assets</span>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
