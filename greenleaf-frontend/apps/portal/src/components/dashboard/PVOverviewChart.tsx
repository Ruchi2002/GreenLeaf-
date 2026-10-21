'use client';

import {
  BarChart, Bar, XAxis, Tooltip,
  ResponsiveContainer,
} from 'recharts';

interface PVDataPoint {
  month:            string;
  registrationPV:   number;
  repurchasePV:     number;
}

interface PVOverviewChartProps {
  data: PVDataPoint[];
}

interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
  label?:   string;
}

function CustomTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-sm shadow-md">
      <p className="font-medium text-text mb-1">{label}</p>
      {payload.map((entry) => (
        <p key={entry.name} style={{ color: entry.color }} className="text-xs">
          {entry.name === 'registrationPV' ? 'Registration PV' : 'Repeat-purchase PV'}: {entry.value}
        </p>
      ))}
    </div>
  );
}

export function PVOverviewChart({ data }: PVOverviewChartProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-text">PV Overview</h2>
      <p className="text-xs text-text-muted mb-4">
        Registration PV vs repeat-purchase PV, last 6 months
      </p>

      <ResponsiveContainer width="100%" height={200}>
        <BarChart data={data} barSize={20} barGap={0}>
          <XAxis
            dataKey="month"
            axisLine={false}
            tickLine={false}
            tick={{ fontSize: 12, fill: 'hsl(var(--text-muted))' }}
          />
          <Tooltip content={<CustomTooltip />} cursor={{ fill: 'hsl(var(--border))' }} />
          <Bar
            dataKey="registrationPV"
            stackId="a"
            fill="hsl(var(--primary))"
          />
          <Bar
            dataKey="repurchasePV"
            stackId="a"
            fill="hsl(var(--gold))"
            radius={[4, 4, 0, 0]}
          />
        </BarChart>
      </ResponsiveContainer>

      {/* Custom legend */}
      <div className="flex gap-4 mt-3">
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'hsl(var(--primary))' }} />
          <span className="text-xs text-text-muted">Registration PV</span>
        </div>
        <div className="flex items-center gap-1.5">
          <span className="w-3 h-3 rounded-sm shrink-0" style={{ background: 'hsl(var(--gold))' }} />
          <span className="text-xs text-text-muted">Repeat-purchase PV</span>
        </div>
      </div>
    </div>
  );
}
