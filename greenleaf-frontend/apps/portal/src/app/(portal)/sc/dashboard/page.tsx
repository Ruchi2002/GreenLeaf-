'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid,
  Tooltip, ResponsiveContainer,
} from 'recharts';

// ── Mock data ─────────────────────────────────────────────────────────────────

const STAT_CARDS = [
  {
    label:   'Total Members Registered',
    value:   '142',
    subtext: 'Since SC activation',
    icon:    '👥',
  },
  {
    label:   'Wallet Balance',
    value:   '₹8,64,500',
    subtext: 'Available to withdraw',
    icon:    '💰',
  },
  {
    label:   'Registered This Month',
    value:   '12',
    subtext: 'October 2026',
    icon:    '📈',
  },
];

const MEMBERS_MONTHLY = [
  { period: 'Nov', value: 8  },
  { period: 'Dec', value: 11 },
  { period: 'Jan', value: 6  },
  { period: 'Feb', value: 9  },
  { period: 'Mar', value: 14 },
  { period: 'Apr', value: 10 },
  { period: 'May', value: 13 },
  { period: 'Jun', value: 7  },
  { period: 'Jul', value: 11 },
  { period: 'Aug', value: 15 },
  { period: 'Sep', value: 9  },
  { period: 'Oct', value: 12 },
];

const MEMBERS_YEARLY = [
  { period: '2022', value: 18  },
  { period: '2023', value: 34  },
  { period: '2024', value: 51  },
  { period: '2025', value: 87  },
  { period: '2026', value: 142 },
];

const ORDERS_MONTHLY = [
  { period: 'Nov', value: 22  },
  { period: 'Dec', value: 31  },
  { period: 'Jan', value: 18  },
  { period: 'Feb', value: 25  },
  { period: 'Mar', value: 39  },
  { period: 'Apr', value: 28  },
  { period: 'May', value: 34  },
  { period: 'Jun', value: 21  },
  { period: 'Jul', value: 30  },
  { period: 'Aug', value: 41  },
  { period: 'Sep', value: 26  },
  { period: 'Oct', value: 35  },
];

const ORDERS_YEARLY = [
  { period: '2022', value: 68  },
  { period: '2023', value: 124 },
  { period: '2024', value: 198 },
  { period: '2025', value: 287 },
  { period: '2026', value: 331 },
];

type OrderStatus = 'Delivered' | 'Processing' | 'Pending' | 'Cancelled';

interface RecentOrder {
  memberName: string;
  product:    string;
  amount:     string;
  date:       string;
  status:     OrderStatus;
}

const RECENT_ORDERS: RecentOrder[] = [
  { memberName: 'Priya Sharma',  product: 'Radiance Glow Serum',   amount: '₹1,450', date: 'Oct 20, 2026', status: 'Delivered'  },
  { memberName: 'Rahul Verma',   product: 'Wellness Starter Kit',   amount: '₹3,200', date: 'Oct 19, 2026', status: 'Processing' },
  { memberName: 'Anjali Singh',  product: 'Herbal Immunity Booster', amount: '₹890',  date: 'Oct 18, 2026', status: 'Delivered'  },
  { memberName: 'Deepak Patel',  product: 'Hair Revive Shampoo',    amount: '₹650',  date: 'Oct 17, 2026', status: 'Pending'    },
  { memberName: 'Sunita Kumari', product: 'Greenleaf Premium Kit',   amount: '₹5,500', date: 'Oct 15, 2026', status: 'Delivered'  },
];

const STATUS_STYLES: Record<OrderStatus, string> = {
  Delivered:  'bg-primary/10 text-primary',
  Processing: 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400',
  Pending:    'bg-border text-text-muted',
  Cancelled:  'bg-danger/10 text-danger',
};

// ── Sub-components ────────────────────────────────────────────────────────────

function ChartToggle({
  active,
  onChange,
}: {
  active: 'monthly' | 'yearly';
  onChange: (v: 'monthly' | 'yearly') => void;
}) {
  return (
    <div className="flex gap-1 bg-background border border-border rounded-lg p-0.5">
      {(['monthly', 'yearly'] as const).map((v) => (
        <button
          key={v}
          onClick={() => onChange(v)}
          className={`px-3 py-1 text-xs font-medium rounded-md transition-colors capitalize ${
            active === v
              ? 'bg-primary text-[#0b1410]'
              : 'text-text-muted hover:text-text'
          }`}
        >
          {v}
        </button>
      ))}
    </div>
  );
}

interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ value: number }>;
  label?:   string;
  unit?:    string;
}

function ChartTooltip({ active, payload, label, unit = '' }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-xl px-3 py-2 text-xs shadow-lg">
      <p className="text-text-muted mb-0.5">{label}</p>
      <p className="font-bold text-text">{payload[0]?.value}{unit && ` ${unit}`}</p>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SCDashboardPage() {
  const [membersView, setMembersView] = useState<'monthly' | 'yearly'>('monthly');
  const [ordersView,  setOrdersView]  = useState<'monthly' | 'yearly'>('monthly');

  const membersData = membersView === 'monthly' ? MEMBERS_MONTHLY : MEMBERS_YEARLY;
  const ordersData  = ordersView  === 'monthly' ? ORDERS_MONTHLY  : ORDERS_YEARLY;

  return (
    <div className="pt-14 w-full flex flex-col gap-6">

      {/* ── Header ── */}
      <div>
        <h1 className="text-2xl font-bold text-text">SC Dashboard</h1>
        <p className="text-sm text-text-muted mt-0.5">Greenleaf Service Center — Mumbai</p>
      </div>

      {/* ── Stat Cards ── */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
        {STAT_CARDS.map(({ label, value, subtext, icon }) => (
          <div key={label} className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-2">
            <div className="flex items-center justify-between">
              <span className="text-sm text-text-muted">{label}</span>
              <span className="text-xl">{icon}</span>
            </div>
            <span className="text-2xl font-bold text-text">{value}</span>
            <span className="text-xs text-text-muted">{subtext}</span>
          </div>
        ))}
      </div>

      {/* ── Charts row ── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">

        {/* Chart 1 — Members Registered */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-text">Members Registered</p>
              <p className="text-xs text-text-muted mt-0.5">
                {membersView === 'monthly' ? 'Last 12 months' : 'Last 5 years'}
              </p>
            </div>
            <ChartToggle active={membersView} onChange={setMembersView} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={membersData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip unit="members" />} cursor={{ fill: 'hsl(var(--primary-soft))' }} />
              <Bar dataKey="value" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>

        {/* Chart 2 — Orders Placed */}
        <div className="bg-surface border border-border rounded-2xl p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-sm font-semibold text-text">Orders Placed for Members</p>
              <p className="text-xs text-text-muted mt-0.5">
                {ordersView === 'monthly' ? 'Last 12 months' : 'Last 5 years'}
              </p>
            </div>
            <ChartToggle active={ordersView} onChange={setOrdersView} />
          </div>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersData} barSize={28} margin={{ top: 4, right: 4, left: -20, bottom: 0 }}>
              <CartesianGrid strokeDasharray="3 3" stroke="hsl(var(--border))" vertical={false} />
              <XAxis
                dataKey="period"
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
              />
              <YAxis
                axisLine={false}
                tickLine={false}
                tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
                allowDecimals={false}
              />
              <Tooltip content={<ChartTooltip unit="orders" />} cursor={{ fill: 'hsl(var(--primary-soft))' }} />
              <Bar dataKey="value" fill="#f59e0b" radius={[4, 4, 0, 0]} />
            </BarChart>
          </ResponsiveContainer>
        </div>
      </div>

      {/* ── Recent Orders Table ── */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="px-5 py-4 border-b border-border">
          <p className="text-sm font-semibold text-text">Recent Orders</p>
          <p className="text-xs text-text-muted mt-0.5">Last 5 orders placed for members</p>
        </div>

        {/* Desktop table */}
        <div className="hidden sm:block overflow-x-auto">
          <table className="w-full">
            <thead>
              <tr className="border-b border-border bg-primary/5">
                {['Member Name', 'Product', 'Amount', 'Date', 'Status'].map((h) => (
                  <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-muted">
                    {h}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody>
              {RECENT_ORDERS.map((order, i) => (
                <tr key={i} className="border-b border-border/60 last:border-0 hover:bg-primary/5 transition-colors">
                  <td className="px-5 py-3.5 text-sm font-medium text-text">{order.memberName}</td>
                  <td className="px-5 py-3.5 text-sm text-text-muted max-w-[180px] truncate">{order.product}</td>
                  <td className="px-5 py-3.5 text-sm font-semibold text-text">{order.amount}</td>
                  <td className="px-5 py-3.5 text-sm text-text-muted">{order.date}</td>
                  <td className="px-5 py-3.5">
                    <span className={`inline-block text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="sm:hidden divide-y divide-border">
          {RECENT_ORDERS.map((order, i) => (
            <div key={i} className="px-5 py-4 flex flex-col gap-1.5">
              <div className="flex items-center justify-between">
                <p className="text-sm font-semibold text-text">{order.memberName}</p>
                <span className={`text-xs font-medium px-2.5 py-1 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <p className="text-xs text-text-muted truncate">{order.product}</p>
              <div className="flex items-center justify-between mt-0.5">
                <p className="text-sm font-bold text-text">{order.amount}</p>
                <p className="text-xs text-text-muted">{order.date}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
