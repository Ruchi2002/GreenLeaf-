'use client';

import Link from 'next/link';
import {
  Users, TrendingUp, ShoppingCart, Banknote,
  UseRPlus, Wallet, Megaphone, FileBarChart, ShieldCheck, ClipboardList,
} from 'lucide-react';
import {
  dashboardStats, revenueData, tierData, recentOrders, quickActions,
} from '@/data/mock/adminDashboard';

const ICON_MAP: Record<string, React.ElementType> = {
  Users, TrendingUp, ShoppingCart, Banknote,
  UseRPlus, Wallet, Megaphone, FileBarChart, ShieldCheck, ClipboardList,
};

const STATUS_STYLES: Record<string, string> = {
  Completed:  'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending:    'bg-yellow-100 text-yellow-700',
  Refunded:   'bg-red-100 text-red-600',
};

const TIER_STYLES: Record<string, string> = {
  Diamond: 'bg-puRPle-100 text-puRPle-700',
  Gold:    'bg-amber-100 text-amber-700',
  Silver:  'bg-gray-100 text-gray-600',
  Bronze:  'bg-orange-100 text-orange-700',
};

const maxRevenue = Math.max(...revenueData.map((d) => d.value));

function buildConic(tiers: typeof tierData) {
  let cursor = 0;
  return tiers.map((t) => {
    const start = cursor;
    cursor += t.pct * 3.6;
    return `${t.color} ${start}deg ${cursor}deg`;
  }).join(', ');
}

export default function AdminDashboardPage() {
  const conicGradient = buildConic(tierData);

  return (
    <div className="space-y-6">
      {/* Page header */}
      <div>
        <h1 className="text-xl md:text-2xl font-bold text-gray-900">Dashboard</h1>
        <p className="text-sm text-gray-500 mt-0.5">Welcome back, Amit. Here&apos;s what&apos;s happening today.</p>
      </div>

      {/* KPI cards */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4">
        {dashboardStats.map((stat) => {
          const Icon = ICON_MAP[stat.icon];
          return (
            <div
              key={stat.label}
              className={`rounded-2xl p-4 md:p-5 shadow-sm ${stat.dark ? 'bg-[#0a1f13] text-white' : 'bg-white text-gray-900'}`}
            >
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${stat.iconBg}`}>
                  {Icon && <Icon size={20} className={stat.iconColor} />}
                </div>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${stat.dark ? 'bg-green-500/20 text-green-400' : 'bg-green-100 text-green-700'}`}>
                  {stat.trend}
                </span>
              </div>
              <p className={`text-2xl md:text-3xl font-bold leading-none mb-1 ${stat.dark ? 'text-white' : 'text-gray-900'}`}>
                {stat.value}
              </p>
              <p className={`text-xs ${stat.dark ? 'text-green-300/70' : 'text-gray-500'}`}>{stat.label}</p>
            </div>
          );
        })}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 lg:gap-6">
        {/* Revenue trend — col-span-2 */}
        <div className="lg:col-span-2 bg-white rounded-2xl shadow-sm p-5">
          <div className="flex items-center justify-between mb-5">
            <div>
              <h2 className="text-base font-semibold text-gray-900">Revenue Trend</h2>
              <p className="text-xs text-gray-400 mt-0.5">Monthly revenue inRPM</p>
            </div>
          </div>
          <div className="flex items-end gap-2 h-40">
            {revenueData.map((d) => {
              const heightPct = (d.value / maxRevenue) * 100;
              return (
                <div key={d.month} className="flex-1 flex flex-col items-center gap-1.5 group">
                  <div className="relative w-full flex justify-center">
                    {/* Tooltip */}
                    <div className="absolute -top-8 hidden group-hover:flex bg-gray-900 text-white text-[11px] font-medium px-2 py-1 rounded-md whitespace-nowrap z-10">
                     RP{d.value}M
                    </div>
                    <div
                      className="w-full rounded-t-lg transition-opacity hover:opacity-90 cursor-default"
                      style={{
                        height: `${(heightPct / 100) * 140}px`,
                        background: 'linear-gradient(to top, #16a34a, #22c55e)',
                      }}
                    />
                  </div>
                  <span className="text-[11px] text-gray-400">{d.month}</span>
                </div>
              );
            })}
          </div>
        </div>

        {/* Tier breakdown */}
        <div className="bg-white rounded-2xl shadow-sm p-5">
          <h2 className="text-base font-semibold text-gray-900 mb-4">Tier Breakdown</h2>
          {/* Donut */}
          <div className="flex justify-center mb-5">
            <div className="relative w-32 h-32">
              <div
                className="w-32 h-32 rounded-full"
                style={{ background: `conic-gradient(${conicGradient})` }}
              />
              {/* Hole */}
              <div className="absolute inset-[18px] rounded-full bg-white flex flex-col items-center justify-center">
                <span className="text-[11px] font-bold text-gray-900 leading-tight text-center">2,431</span>
                <span className="text-[9px] text-gray-400">Members</span>
              </div>
            </div>
          </div>
          {/* Legend */}
          <div className="space-y-1.5">
            {tierData.map((t) => (
              <div key={t.label} className="flex items-center justify-between text-sm">
                <div className="flex items-center gap-2">
                  <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: t.color }} />
                  <span className="text-gray-700 text-xs">{t.label}</span>
                </div>
                <span className="text-gray-500 text-xs font-medium">{t.pct}%</span>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Recent orders */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-5 py-4 border-b border-gray-100">
          <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
          <Link href="/orders" className="text-sm text-green-600 hover:text-green-700 font-medium">
            View all →
          </Link>
        </div>
        {/* Desktop table */}
        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Order ID</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Member</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Product</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Amount</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Status</th>
                <th className="text-left px-5 py-3 text-xs font-semibold text-gray-500 uppercase tracking-wide">Date</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {recentOrders.map((order) => (
                <tr key={order.id} className="hover:bg-gray-50/50 transition-colors">
                  <td className="px-5 py-3.5">
                    <span className="font-mono text-xs text-gray-500">{order.id}</span>
                  </td>
                  <td className="px-5 py-3.5">
                    <div className="flex items-center gap-2.5">
                      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shrink-0">
                        <span className="text-white text-[11px] font-bold">{order.initials}</span>
                      </div>
                      <div>
                        <p className="font-medium text-gray-900 text-sm leading-tight">{order.member}</p>
                        <span className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-full ${TIER_STYLES[order.tier] ?? 'bg-gray-100 text-gray-600'}`}>
                          {order.tier}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className="px-5 py-3.5 text-gray-700 max-w-[160px] truncate">{order.product}</td>
                  <td className="px-5 py-3.5 font-semibold text-gray-900">{order.amount}</td>
                  <td className="px-5 py-3.5">
                    <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                      {order.status}
                    </span>
                  </td>
                  <td className="px-5 py-3.5 text-gray-500 text-xs">{order.date}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3 p-4">
          {recentOrders.map((order) => (
            <div key={order.id} className="bg-white border border-gray-100 rounded-xl p-3 shadow-sm">
              <div className="flex items-center justify-between mb-1.5">
                <span className="font-mono text-xs font-semibold text-gray-500">{order.id}</span>
                <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_STYLES[order.status]}`}>
                  {order.status}
                </span>
              </div>
              <div className="flex items-center justify-between mb-1">
                <span className="text-sm font-medium text-gray-900">{order.member}</span>
                <span className="text-sm font-semibold text-gray-900">{order.amount}</span>
              </div>
              <p className="text-xs text-gray-400">{order.date}</p>
            </div>
          ))}
        </div>
      </div>

      {/* Quick actions */}
      <div className="bg-white rounded-2xl shadow-sm p-5">
        <h2 className="text-base font-semibold text-gray-900 mb-4">Quick Actions</h2>
        <div className="grid grid-cols-3 sm:grid-cols-6 gap-3">
          {quickActions.map((action) => {
            const Icon = ICON_MAP[action.icon];
            return (
              <Link
                key={action.href}
                href={action.href}
                className={`flex flex-col items-center gap-2 p-4 rounded-xl transition-colors cursor-pointer ${action.bgClass}`}
              >
                <div className={`w-9 h-9 rounded-xl flex items-center justify-center ${action.bgClass.split(' ')[0]}`}>
                  {Icon && <Icon size={18} className={action.iconClass} />}
                </div>
                <span className="text-xs font-medium text-gray-700 text-center leading-tight">{action.label}</span>
              </Link>
            );
          })}
        </div>
      </div>
    </div>
  );
}
