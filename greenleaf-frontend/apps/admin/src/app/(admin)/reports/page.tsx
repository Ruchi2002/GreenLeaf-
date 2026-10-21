'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { Download } from 'lucide-react';
import {
  AreaChart, Area,
  BarChart, Bar,
  LineChart, Line,
  PieChart, Pie, Cell,
  XAxis, YAxis, CartesianGrid,
  Tooltip, Legend, ResponsiveContainer,
} from 'recharts';
import {
  monthlySummary, monthlyStats, topProducts, topMembers,
  type TopMember,
} from '@/data/mock/adminReports';
import { cn } from '@/lib/utils';

type Tab = 'overview' | 'products' | 'members' | 'bonus';
type Range = 'this_month' | 'last_3' | 'last_6' | 'this_year';

const TABS: { key: Tab; label: string }[] = [
  { key: 'overview',  label: '📊 Overview'      },
  { key: 'products',  label: '📦 Top Products'  },
  { key: 'members',   label: '👥 Top Members'   },
  { key: 'bonus',     label: '💰 Bonus Report'  },
];

const RANK_BADGE = (rank: number) =>
  rank === 1 ? 'bg-yellow-100 text-yellow-700' :
  rank === 2 ? 'bg-gray-100 text-gray-600'     :
  rank === 3 ? 'bg-orange-100 text-orange-600'  :
               'bg-gray-50 text-gray-500';

const TIER_BADGE: Record<TopMember['tier'], string> = {
  Diamond:  'bg-cyan-50 text-cyan-600',
  Platinum: 'bg-puRPle-50 text-puRPle-600',
  Gold:     'bg-yellow-50 text-yellow-600',
  Silver:   'bg-gray-100 text-gray-600',
  Bronze:   'bg-orange-50 text-orange-600',
};

const bonusBreakdown = [
  { name: 'Referral Bonus',    value: 284000, color: '#22c55e' },
  { name: 'Level Bonus',       value: 196000, color: '#6366f1' },
  { name: 'Leadership Bonus',  value: 150000, color: '#f59e0b' },
];

export default function ReportsPage() {
  const [activeTab,     setActiveTab]     = useState<Tab>('overview');
  const [selectedRange, setSelectedRange] = useState<Range>('this_month');

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Reports</h1>
          <p className="text-sm text-gray-500 mt-0.5">Business performance and analytics.</p>
        </div>
        <div className="flex gap-2 w-full sm:w-auto">
          <select
            value={selectedRange}
            onChange={(e) => setSelectedRange(e.target.value as Range)}
            className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
          >
            <option value="this_month">This Month</option>
            <option value="last_3">Last 3 Months</option>
            <option value="last_6">Last 6 Months</option>
            <option value="this_year">This Year</option>
          </select>
          <button className="flex items-center justify-center gap-1.5 bg-green-600 text-[#0b1410] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-500 transition-colors whitespace-nowrap">
            <Download size={14} />
            Export
          </button>
        </div>
      </div>

      {/* Summary stat cards */}
      <div className="grid grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-3">
        {monthlySummary.map((stat) => (
          <div key={stat.label} className="bg-white rounded-2xl p-4 shadow-sm">
            <p className="text-xs text-gray-500 mb-1 leading-tight">{stat.label}</p>
            <p className="text-lg sm:text-xl font-bold text-gray-900 leading-none">{stat.value}</p>
            <p className={cn('text-xs mt-1.5 font-semibold', stat.positive ? 'text-green-600' : 'text-red-500')}>
              {stat.change} vs last month
            </p>
          </div>
        ))}
      </div>

      {/* Tab nav */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {TABS.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            className={cn(
              'whitespace-nowrap shrink-0 px-4 py-2 rounded-xl text-sm font-medium transition-colors',
              activeTab === tab.key
                ? 'bg-green-600 text-[#0b1410]'
                : 'bg-white text-gray-600 hover:bg-gray-50 shadow-sm'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ── OVERVIEW TAB ── */}
      {activeTab === 'overview' && (
        <div className="space-y-4">

          {/* Revenue — Area Chart */}
          <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-base text-gray-900">Monthly Revenue Trend</h2>
              <span className="text-xs text-gray-400 bg-gray-50 px-3 py-1 rounded-full">Last 6 months</span>
            </div>
            <ResponsiveContainer width="100%" height={220}>
              <AreaChart data={monthlyStats}>
                <defs>
                  <linearGradient id="revenueGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%"  stopColor="#22c55e" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="#22c55e" stopOpacity={0}   />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                <YAxis
                  tick={{ fontSize: 11, fill: '#9ca3af' }}
                  axisLine={false}
                  tickLine={false}
                  tickFormatter={(v) => `₹${(v / 100000).toFixed(0)}L`}
                />
                <Tooltip
                  formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Revenue']}
                  contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                />
                <Area
                  type="monotone"
                  dataKey="revenue"
                  stroke="#22c55e"
                  strokeWidth={3}
                  fill="url(#revenueGrad)"
                  dot={{ fill: '#22c55e', strokeWidth: 2, r: 4 }}
                  activeDot={{ r: 6 }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>

          {/* Orders + New Members — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Orders — Bar Chart */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-bold text-base text-gray-900 mb-4">Monthly Orders</h2>
              <ResponsiveContainer width="100%" height={180}>
                <BarChart data={monthlyStats} barSize={32}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [Number(value), 'Orders']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="orders" fill="#6366f1" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

            {/* New Members — Line Chart */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-bold text-base text-gray-900 mb-4">New Members</h2>
              <ResponsiveContainer width="100%" height={180}>
                <LineChart data={monthlyStats}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis tick={{ fontSize: 11, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <Tooltip
                    formatter={(value) => [Number(value), 'Members']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Line
                    type="monotone"
                    dataKey="newMembers"
                    stroke="#f59e0b"
                    strokeWidth={3}
                    dot={{ fill: '#f59e0b', r: 4 }}
                    activeDot={{ r: 6 }}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}

      {/* ── TOP PRODUCTS TAB ── */}
      {activeTab === 'products' && (
        <div>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['RANK', 'PRODUCT', 'CATEGORY', 'UNITS SOLD', 'REVENUE'].map((col, i) => (
                      <th key={col} className={cn(
                        'text-[11px] font-semibold text-gray-400 tracking-wider px-4 py-3.5',
                        i >= 3 ? 'text-right' : 'text-left'
                      )}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topProducts.map((p) => (
                    <tr key={p.rank} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={cn('w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold', RANK_BADGE(p.rank))}>
                          {p.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 font-medium text-gray-900">{p.name}</td>
                      <td className="px-4 py-3.5">
                        <span className="px-2 py-0.5 rounded-full text-xs font-semibold bg-blue-50 text-blue-700">
                          {p.category}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right text-sm text-gray-700">{p.sold}</td>
                      <td className="px-4 py-3.5 text-right text-sm font-bold text-green-700">
                       RP{p.revenue.toLocaleString('en-IN')}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {topProducts.map((p) => (
              <div key={p.rank} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <span className={cn('w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold', RANK_BADGE(p.rank))}>
                  {p.rank}
                </span>
                <div className="flex-1 min-w-0">
                  <p className="font-semibold text-sm text-gray-900 truncate">{p.name}</p>
                  <span className="text-[10px] font-semibold px-1.5 py-0.5 rounded-full bg-blue-50 text-blue-700 mt-0.5 inline-block">
                    {p.category}
                  </span>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{p.sold} units sold</span>
                    <span className="text-sm font-bold text-green-700">₹{p.revenue.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── TOP MEMBERS TAB ── */}
      {activeTab === 'members' && (
        <div>
          {/* Desktop table */}
          <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['RANK', 'MEMBER', 'TIER', 'TOTAL PURCHASE', 'REFERRALS'].map((col, i) => (
                      <th key={col} className={cn(
                        'text-[11px] font-semibold text-gray-400 tracking-wider px-4 py-3.5',
                        i >= 3 ? 'text-right' : 'text-left'
                      )}>
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-50">
                  {topMembers.map((m) => (
                    <tr key={m.rank} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-4 py-3.5">
                        <span className={cn('w-7 h-7 rounded-full inline-flex items-center justify-center text-xs font-bold', RANK_BADGE(m.rank))}>
                          {m.rank}
                        </span>
                      </td>
                      <td className="px-4 py-3.5">
                        <p className="font-medium text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400 mt-0.5">{m.city}</p>
                      </td>
                      <td className="px-4 py-3.5">
                        <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', TIER_BADGE[m.tier])}>
                          {m.tier}
                        </span>
                      </td>
                      <td className="px-4 py-3.5 text-right font-bold text-green-700">
                       RP{m.totalPurchase.toLocaleString('en-IN')}
                      </td>
                      <td className="px-4 py-3.5 text-right text-gray-700">{m.referrals}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* Mobile cards */}
          <div className="md:hidden space-y-3">
            {topMembers.map((m) => (
              <div key={m.rank} className="bg-white rounded-2xl p-4 shadow-sm flex items-start gap-3">
                <span className={cn('w-8 h-8 rounded-full shrink-0 flex items-center justify-center text-sm font-bold', RANK_BADGE(m.rank))}>
                  {m.rank}
                </span>
                <div className="flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div>
                      <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                      <p className="text-xs text-gray-400">{m.city}</p>
                    </div>
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold shrink-0', TIER_BADGE[m.tier])}>
                      {m.tier}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mt-2">
                    <span className="text-xs text-gray-500">{m.referrals} referrals</span>
                    <span className="text-sm font-bold text-green-700">₹{m.totalPurchase.toLocaleString('en-IN')}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── BONUS REPORT TAB ── */}
      {activeTab === 'bonus' && (
        <div className="space-y-4">
          {/* Bonus summary cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
            {[
              { label: 'Total Bonus Paid',  value: '₹6,30,000', icon: '💰' },
              { label: 'Referral Bonus',    value: '₹2,84,000', icon: '👥' },
              { label: 'Level Bonus',       value: '₹1,96,000', icon: '📈' },
              { label: 'Leadership Bonus',  value: '₹1,50,000', icon: '⭐' },
            ].map((card) => (
              <div key={card.label} className="bg-white rounded-2xl p-4 sm:p-5 shadow-sm">
                <div className="flex items-center gap-2.5 mb-2">
                  <span className="text-xl">{card.icon}</span>
                  <p className="text-xs text-gray-500 leading-tight">{card.label}</p>
                </div>
                <p className="text-xl sm:text-2xl font-bold text-gray-900">{card.value}</p>
              </div>
            ))}
          </div>

          {/* Donut + Monthly Bonus Bar — side by side */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">

            {/* Donut — Bonus Breakdown */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-bold text-base text-gray-900 mb-4">Bonus Breakdown</h2>
              <ResponsiveContainer width="100%" height={220}>
                <PieChart>
                  <Pie
                    data={bonusBreakdown}
                    cx="50%"
                    cy="50%"
                    innerRadius={55}
                    outerRadius={85}
                    paddingAngle={4}
                    dataKey="value"
                  >
                    {bonusBreakdown.map((entry, index) => (
                      <Cell key={index} fill={entry.color} />
                    ))}
                  </Pie>
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, '']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Legend
                    iconType="circle"
                    iconSize={8}
                    formatter={(value) => <span style={{ fontSize: '12px', color: '#4b5563' }}>{value}</span>}
                  />
                </PieChart>
              </ResponsiveContainer>
            </div>

            {/* Monthly Bonus Payout — Bar Chart */}
            <div className="bg-white rounded-2xl p-4 sm:p-6 shadow-sm">
              <h2 className="font-bold text-base text-gray-900 mb-4">Monthly Bonus Payout</h2>
              <ResponsiveContainer width="100%" height={220}>
                <BarChart data={monthlyStats} barSize={28}>
                  <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
                  <XAxis dataKey="month" tick={{ fontSize: 12, fill: '#9ca3af' }} axisLine={false} tickLine={false} />
                  <YAxis
                    tick={{ fontSize: 11, fill: '#9ca3af' }}
                    axisLine={false}
                    tickLine={false}
                    tickFormatter={(v) => `₹${(v / 1000).toFixed(0)}K`}
                  />
                  <Tooltip
                    formatter={(value) => [`₹${Number(value).toLocaleString('en-IN')}`, 'Bonus Paid']}
                    contentStyle={{ borderRadius: '12px', border: 'none', boxShadow: '0 4px 20px rgba(0,0,0,0.1)' }}
                  />
                  <Bar dataKey="bonusPaid" fill="#f59e0b" radius={[6, 6, 0, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>

          </div>
        </div>
      )}
    </div>
  );
}
