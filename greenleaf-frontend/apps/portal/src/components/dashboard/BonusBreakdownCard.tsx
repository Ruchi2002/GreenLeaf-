'use client';

import { PieChart, Pie, Cell, Tooltip } from 'recharts';

interface BonusItem {
  label:  string;
  amount: string;
}

interface BonusBreakdownCardProps {
  total:       string;
  earnedRaw:   number;
  remainderRaw: number;
  items:       BonusItem[];
}

interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ name: string; value: number; color: string }>;
}

function CustomTooltip({ active, payload }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  const entry = payload[0];
  return (
    <div className="bg-surface border border-border rounded-lg px-3 py-2 text-sm shadow-md">
      <p style={{ color: entry?.color ?? '#000' }} className="text-xs">
        {entry?.name}: {entry?.value?.toLocaleString('id-ID')}
      </p>
    </div>
  );
}

export function BonusBreakdownCard({ total, earnedRaw, remainderRaw, items }: BonusBreakdownCardProps) {
  const pieData = [
    { name: 'Earned',    value: earnedRaw,    color: 'hsl(var(--primary))' },
    { name: 'Remaining', value: remainderRaw, color: 'hsl(var(--gold))' },
  ];

  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-text mb-4">
        Bonus Breakdown — This Month
      </h2>

      {/* Donut chart */}
      <div className="flex justify-center mb-4">
        <div className="relative" style={{ width: 140, height: 140 }}>
          <PieChart width={140} height={140}>
            <Pie
              data={pieData}
              cx={65}
              cy={65}
              innerRadius={50}
              outerRadius={70}
              dataKey="value"
              strokeWidth={0}
            >
              {pieData.map((entry, i) => (
                <Cell key={i} fill={entry.color} />
              ))}
            </Pie>
            <Tooltip content={<CustomTooltip />} />
          </PieChart>
          {/* Center text */}
          <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
            <span className="text-base font-bold text-text leading-tight">{total}</span>
            <span className="text-xs text-text-muted">Total this month</span>
          </div>
        </div>
      </div>

      {/* Line items */}
      <div className="flex flex-col">
        {items.map(({ label, amount }) => (
          <div
            key={label}
            className="flex justify-between items-center py-2 border-b border-border last:border-0"
          >
            <span className="text-sm text-text-muted">{label}</span>
            <span className="text-sm font-medium text-text">{amount}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
