'use client';

import Link from 'next/link';
import { MapPin, UserPlus, Package, ShoppingBag, Wallet } from 'lucide-react';
import {
  BarChart, Bar, XAxis, ResponsiveContainer, Tooltip,
} from 'recharts';
import { WalletStatCards } from '@/components/dashboard/WalletStatCards';

// MOCK ONLY — BACKEND_REQUIRED_LATER
const mockSC = {
  name:            'Greenleaf Jakarta Selatan',
  id:              'S200001',
  address:         'Jl. Fatmawati Raya No. 45, Jakarta Selatan',
  addressVerified: true,
};

const scWalletCards = [
  { label: 'E-wallet available',        value: 'RP 764.581.000', subtext: 'Ready to use' },
  { label: 'Frozen',                    value: 'RP 0',           subtext: 'No holds' },
  { label: 'Shopping vouchers',         value: 'RP 98.700.000',  subtext: 'Active' },
  { label: "This month's SC Incentive", value: 'RP 668.800.000', subtext: 'Paid Sep 25' },
];

const mockPerformance = {
  registration: {
    label:  'Registration performance',
    amount: 'RP 320.500.000',
    pv:     '1,240 PV',
    weekly: [
      { week: 'W1', value: 85 },
      { week: 'W2', value: 60 },
      { week: 'W3', value: 100 },
      { week: 'W4', value: 45 },
    ],
  },
  repurchase: {
    label:  'Repeat purchase performance',
    amount: 'RP 210.200.000',
    pv:     '860 PV',
    weekly: [
      { week: 'W1', value: 40 },
      { week: 'W2', value: 40 },
      { week: 'W3', value: 55 },
      { week: 'W4', value: 60 },
    ],
  },
};

const mockPendingMembers = [
  { id: 'RP47850333', cardLevel: 'Bronze', status: 'Pending' },
  { id: 'RP47850519', cardLevel: 'Bronze', status: 'Pending' },
  { id: 'RP47850602', cardLevel: 'Silver', status: 'Pending' },
];

const mockRecentOrders = [
  { orderId: '#GLF-9021', memberId: 'RP97850827', product: 'Radiance Glow Serum',  amount: 'RP 450.000',   status: 'Delivered' },
  { orderId: '#GLF-9033', memberId: 'RP47850519', product: 'Wellness Starter Kit', amount: 'RP 1.250.000', status: 'Processing' },
];

const SC_QUICK_ACTIONS = [
  { label: 'Register new member',    Icon: UserPlus,     bg: 'bg-primary-soft',                    iconColor: 'text-primary' },
  { label: 'Buy package for member', Icon: Package,      bg: 'bg-primary-soft',                    iconColor: 'text-primary' },
  { label: 'Store procurement',      Icon: ShoppingBag,  bg: 'bg-[#FFFBEB] dark:bg-[#2A2004]',    iconColor: 'text-gold' },
  { label: 'Recharge wallet',        Icon: Wallet,       bg: 'bg-[#FFFBEB] dark:bg-[#2A2004]',    iconColor: 'text-gold' },
] as const;

const CARD_LEVEL_STYLES: Record<string, string> = {
  Bronze: 'bg-[#FDF3E7] text-[#B8733A]',
  Silver: 'bg-[#F3F4F6] text-[#9CA3AF]',
  Gold:   'bg-[#FEF9C3] text-[#92400E]',
};

const STATUS_STYLES: Record<string, string> = {
  Delivered:  'bg-success/10 text-success',
  Processing: 'bg-warning/10 text-warning',
  Pending:    'bg-border text-text-muted',
};

interface ChartTooltipProps {
  active?:  boolean;
  payload?: Array<{ value: number }>;
  label?:   string;
}

function SimpleTooltip({ active, payload, label }: ChartTooltipProps) {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-surface border border-border rounded-lg px-2.5 py-1.5 text-xs shadow-md">
      <p className="text-text-muted">{label}</p>
      <p className="font-medium text-text">{payload[0]?.value} PV</p>
    </div>
  );
}

export function SCDashboard() {
  return (
    <div className="pt-14">

      {/* ── Section 1: SC Hero ───────────────────────────────── */}
      <div className="flex flex-col gap-1 mb-6">
        <div className="flex items-center gap-3 flex-wrap">
          <h1 className="text-2xl font-bold text-text">{mockSC.name}</h1>
          <span className="border border-gold text-gold text-xs font-medium px-3 py-0.5 rounded-full">
            Service Center
          </span>
        </div>
        <p className="text-sm text-text-muted">ID {mockSC.id}</p>
        <div className="flex items-center gap-1.5">
          <MapPin className="w-3.5 h-3.5 text-text-muted shrink-0" />
          <p className="text-sm text-text-muted">
            {mockSC.address}
            {mockSC.addressVerified && ' — address verified by company'}
          </p>
        </div>
      </div>

      {/* ── Section 2: 4 Stat Cards ──────────────────────────── */}
      <WalletStatCards cards={scWalletCards} />

      {/* ── Section 3: Performance This Month ───────────────── */}
      <div className="bg-surface border border-border rounded-xl p-6 mb-6">
        <h2 className="text-base font-semibold text-text mb-4">Performance This Month</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

          {/* Registration */}
          <div>
            <p className="text-xs text-text-muted mb-3">
              {mockPerformance.registration.label}
              <span className="block sm:inline sm:ml-1 text-primary font-medium">
                {mockPerformance.registration.amount} · {mockPerformance.registration.pv}
              </span>
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockPerformance.registration.weekly} barSize={28}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
                />
                <Tooltip content={<SimpleTooltip />} cursor={false} />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--primary))"
                  radius={[4, 4, 0, 0]}
                  background={{ fill: 'hsl(var(--primary-soft))' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>

          {/* Repurchase */}
          <div>
            <p className="text-xs text-text-muted mb-3">
              {mockPerformance.repurchase.label}
              <span className="block sm:inline sm:ml-1 text-primary font-medium">
                {mockPerformance.repurchase.amount} · {mockPerformance.repurchase.pv}
              </span>
            </p>
            <ResponsiveContainer width="100%" height={160}>
              <BarChart data={mockPerformance.repurchase.weekly} barSize={28}>
                <XAxis
                  dataKey="week"
                  axisLine={false}
                  tickLine={false}
                  tick={{ fontSize: 11, fill: 'hsl(var(--text-muted))' }}
                />
                <Tooltip content={<SimpleTooltip />} cursor={false} />
                <Bar
                  dataKey="value"
                  fill="hsl(var(--gold))"
                  radius={[4, 4, 0, 0]}
                  background={{ fill: '#FFFBEB' }}
                />
              </BarChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>

      {/* ── Section 4: Members Needing Action + Quick Actions ── */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 mb-6">

        {/* Members Needing Action */}
        <div className="lg:col-span-2 bg-surface border border-border rounded-xl p-6">
          <h2 className="text-base font-semibold text-text">Members Needing Action</h2>
          <p className="text-sm text-text-muted mb-4">Pending activations</p>
          <div className="divide-y divide-border">
            {mockPendingMembers.map(({ id, cardLevel, status }) => (
              <div key={id} className="flex items-center justify-between py-3">
                <div className="flex items-center gap-2 flex-wrap">
                  <span className="text-sm font-medium text-text">{id}</span>
                  <span className={`text-xs px-2 py-0.5 rounded-full ${CARD_LEVEL_STYLES[cardLevel] ?? 'bg-border text-text-muted'}`}>
                    {cardLevel}
                  </span>
                  <span className="border border-warning text-warning text-xs px-2 py-0.5 rounded-full">
                    {status}
                  </span>
                </div>
                <button
                  type="button"
                  className="bg-primary text-[#0F1F17] text-sm font-medium px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors shrink-0 ml-4"
                >
                  Activate
                </button>
              </div>
            ))}
          </div>
        </div>

        {/* SC Quick Actions */}
        <div className="grid grid-cols-2 gap-3 content-start">
          {SC_QUICK_ACTIONS.map(({ label, Icon, bg, iconColor }) => (
            <button
              key={label}
              type="button"
              className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-3 hover:border-primary transition-colors text-left"
            >
              <div className={`w-9 h-9 rounded-lg flex items-center justify-center ${bg}`}>
                <Icon className={`h-5 w-5 ${iconColor}`} />
              </div>
              <span className="text-sm font-medium text-text leading-snug">{label}</span>
            </button>
          ))}
        </div>
      </div>

      {/* ── Section 5: Recent Orders ─────────────────────────── */}
      <div className="bg-surface border border-border rounded-xl p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-base font-semibold text-text">Recent Orders Placed for Members</h2>
          <Link href="/orders" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="divide-y divide-border">
          {mockRecentOrders.map(({ orderId, memberId, product, amount, status }) => (
            <div key={orderId} className="py-3 text-sm">
              {/* Mobile card layout */}
              <div className="flex items-start justify-between gap-3 sm:hidden">
                <div className="min-w-0">
                  <p className="font-medium text-text">{orderId}</p>
                  <p className="text-xs text-text-muted mt-0.5 truncate">{memberId} · {product}</p>
                </div>
                <div className="text-right shrink-0">
                  <p className="font-medium text-text">{amount}</p>
                  <span className={`inline-block text-xs px-2 py-0.5 rounded-full mt-1 ${STATUS_STYLES[status] ?? 'bg-border text-text-muted'}`}>
                    {status}
                  </span>
                </div>
              </div>
              {/* Desktop grid layout */}
              <div className="hidden sm:grid sm:grid-cols-4 sm:items-center sm:gap-4">
                <span className="font-medium text-text">{orderId}</span>
                <span className="text-text-muted truncate">{memberId} · {product}</span>
                <span className="text-right font-medium text-text">{amount}</span>
                <span className="text-right">
                  <span className={`inline-block text-xs px-2.5 py-0.5 rounded-full ${STATUS_STYLES[status] ?? 'bg-border text-text-muted'}`}>
                    {status}
                  </span>
                </span>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
