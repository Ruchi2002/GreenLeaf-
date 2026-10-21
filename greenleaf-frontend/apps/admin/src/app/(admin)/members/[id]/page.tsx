'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
// ── Tab mock data ─────────────────────────────────────────────────────────────

const memberOrders = [
  { id: 'GL-4820', product: 'Starter Kit Pro',   date: 'Oct 12, 2026', amount: 1200000, status: 'Completed'  },
  { id: 'GL-4651', product: 'Wellness Bundle',    date: 'Sep 28, 2026', amount: 840000,  status: 'Completed'  },
  { id: 'GL-4502', product: 'Skincare Set',       date: 'Sep 14, 2026', amount: 420000,  status: 'Completed'  },
  { id: 'GL-4388', product: 'Starter Kit',        date: 'Aug 30, 2026', amount: 280000,  status: 'Processing' },
  { id: 'GL-4201', product: 'Wellness Bundle',    date: 'Aug 10, 2026', amount: 840000,  status: 'Refunded'   },
  { id: 'GL-3998', product: 'Starter Kit Pro',    date: 'Jul 22, 2026', amount: 1200000, status: 'Completed'  },
  { id: 'GL-3801', product: 'Skincare Set',       date: 'Jun 15, 2026', amount: 420000,  status: 'Completed'  },
] as const;

const memberBonuses = [
  { month: 'October 2026',   type: 'Referral Bonus',    amount: 84000,  status: 'Approved', paidOn: 'Oct 10, 2026' },
  { month: 'October 2026',   type: 'Generation Bonus',  amount: 142000, status: 'Pending',  paidOn: '-'            },
  { month: 'September 2026', type: 'Referral Bonus',    amount: 76000,  status: 'Approved', paidOn: 'Sep 10, 2026' },
  { month: 'September 2026', type: 'Leadership Bonus',  amount: 210000, status: 'Approved', paidOn: 'Sep 10, 2026' },
  { month: 'August 2026',    type: 'Matching Bonus',    amount: 54000,  status: 'Approved', paidOn: 'Aug 10, 2026' },
  { month: 'August 2026',    type: 'Referral Bonus',    amount: 68000,  status: 'Approved', paidOn: 'Aug 10, 2026' },
  { month: 'July 2026',      type: 'Generation Bonus',  amount: 98000,  status: 'Approved', paidOn: 'Jul 10, 2026' },
];

const memberWallet = [
  { id: 'TXN-8821', type: 'Bonus Credit',      description: 'Referral Bonus — October',         date: 'Oct 10, 2026', amount: 84000,  flow: 'credit' },
  { id: 'TXN-8654', type: 'Withdrawal',         description: 'Bank Transfer to HDFC',            date: 'Oct 05, 2026', amount: 200000, flow: 'debit'  },
  { id: 'TXN-8490', type: 'Bonus Credit',       description: 'Leadership Bonus — September',     date: 'Sep 10, 2026', amount: 210000, flow: 'credit' },
  { id: 'TXN-8321', type: 'Withdrawal',         description: 'Bank Transfer to HDFC',            date: 'Sep 01, 2026', amount: 150000, flow: 'debit'  },
  { id: 'TXN-8102', type: 'Bonus Credit',       description: 'Referral Bonus — September',       date: 'Sep 10, 2026', amount: 76000,  flow: 'credit' },
  { id: 'TXN-7988', type: 'Manual Adjustment',  description: 'Admin adjustment by Amit Kumar',   date: 'Aug 20, 2026', amount: 10000,  flow: 'credit' },
  { id: 'TXN-7801', type: 'Bonus Credit',       description: 'Matching Bonus — August',          date: 'Aug 10, 2026', amount: 54000,  flow: 'credit' },
];

const memberActivity = [
  { id: 1,  action: 'Order Placed',        description: 'Placed order #GL-4820 for Starter Kit Pro',              date: 'Oct 12, 2026', time: '11:24 AM', icon: 'order'   },
  { id: 2,  action: 'Bonus Approved',      description: 'Referral Bonus ofRP84,000 approved for October',         date: 'Oct 10, 2026', time: '09:00 AM', icon: 'bonus'   },
  { id: 3,  action: 'Withdrawal Processed',description: 'Withdrawal ofRP2,00,000 to HDFC bank processed',         date: 'Oct 05, 2026', time: '02:15 PM', icon: 'wallet'  },
  { id: 4,  action: 'Profile Updated',     description: 'Phone number updated by member',                         date: 'Oct 02, 2026', time: '04:30 PM', icon: 'profile' },
  { id: 5,  action: 'Order Placed',        description: 'Placed order #GL-4651 for Wellness Bundle',              date: 'Sep 28, 2026', time: '10:10 AM', icon: 'order'   },
  { id: 6,  action: 'New Downline',        description: 'Added new downline member Ravi Shankar (GL-00891)',       date: 'Sep 20, 2026', time: '03:45 PM', icon: 'network' },
  { id: 7,  action: 'KYC Verified',        description: 'KYC documents verified and approved',                    date: 'Sep 15, 2026', time: '11:00 AM', icon: 'kyc'     },
  { id: 8,  action: 'Login',               description: 'Member logged in from Mumbai, India',                    date: 'Sep 14, 2026', time: '08:52 AM', icon: 'login'   },
  { id: 9,  action: 'Bonus Approved',      description: 'Leadership Bonus ofRP2,10,000 approved for September',   date: 'Sep 10, 2026', time: '09:00 AM', icon: 'bonus'   },
  { id: 10, action: 'Tier Upgraded',       description: 'Tier upgraded from Platinum to Diamond',                 date: 'Apr 12, 2024', time: '12:00 PM', icon: 'tier'    },
];
import Link from 'next/link';
import {
  Phone, Mail, MapPin, Calendar, Users,
  TrendingUp, ShoppingCart, Banknote, Wallet,
  ShieldOff, KeyRound, Megaphone,
  ArrowLeft, ArrowUp, ArrowDown, X, CheckCircle, Clock,
} from 'lucide-react';
import {
  mockMemberDetail, memberKPIs, networkTree, quickActions,
} from '@/data/mock/adminMemberDetail';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = {
  TrendingUp, ShoppingCart, Banknote, Wallet,
  ShieldOff, KeyRound, Megaphone,
  Phone, Mail, MapPin, Calendar, Users,
};

const PERSONAL_FIELDS = [
  { label: 'Phone',   value: mockMemberDetail.phone,   icon: 'Phone',    iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
  { label: 'Email',   value: mockMemberDetail.email,   icon: 'Mail',     iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  { label: 'City',    value: mockMemberDetail.city,    icon: 'MapPin',   iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
  { label: 'Joined',  value: mockMemberDetail.joined,  icon: 'Calendar', iconBg: 'bg-puRPle-100', iconColor: 'text-puRPle-600' },
  { label: 'Sponsor', value: mockMemberDetail.sponsor, icon: 'Users',    iconBg: 'bg-teal-100',   iconColor: 'text-teal-600'   },
];

const STATUS_BADGE: Record<string, string> = {
  Completed:  'text-green-700 bg-green-100',
  Processing: 'text-blue-700 bg-blue-100',
  Refunded:   'text-red-600 bg-red-100',
  Pending:    'text-amber-700 bg-amber-100',
};

const TABS = ['Overview', 'Orders', 'Bonuses', 'Wallet', 'Activity'];

const ORDERS_PAGE_SIZE = 5;

const ACTIVITY_DOT: Record<string, string> = {
  order:   'bg-blue-500',
  bonus:   'bg-green-500',
  wallet:  'bg-amber-500',
  profile: 'bg-puRPle-500',
  network: 'bg-cyan-500',
  kyc:     'bg-green-600',
  login:   'bg-gray-400',
  tier:    'bg-yellow-500',
};

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

export default function MemberDetailPage() {
  const [activeTab,      setActiveTab]      = useState('Overview');
  const [ordersPage,     setOrdersPage]     = useState(1);
  const [walletModal,    setWalletModal]    = useState(false);
  const [walletFlow,     setWalletFlow]     = useState<'credit' | 'debit'>('credit');
  const [walletAmount,   setWalletAmount]   = useState('');
  const [walletReason,   setWalletReason]   = useState('');
  const [walletToast,    setWalletToast]    = useState(false);

  const [walletBal, setWalletBal] = useState(420000);

  function applyAdjustment() {
    const amt = parseInt(walletAmount.replace(/\D/g, ''), 10);
    if (!isNaN(amt) && amt > 0) {
      setWalletBal((b) => walletFlow === 'credit' ? b + amt : Math.max(0, b - amt));
    }
    setWalletModal(false);
    setWalletAmount('');
    setWalletReason('');
    setWalletToast(true);
    setTimeout(() => setWalletToast(false), 3000);
  }

  const totalOrdeRPages = Math.ceil(memberOrders.length / ORDERS_PAGE_SIZE);
  const paginatedOrders = memberOrders.slice((ordersPage - 1) * ORDERS_PAGE_SIZE, ordersPage * ORDERS_PAGE_SIZE);

  const totalBonus   = memberBonuses.reduce((s, b) => s + b.amount, 0);
  const monthBonus   = memberBonuses.filter((b) => b.month === 'October 2026').reduce((s, b) => s + b.amount, 0);
  const pendingBonus = memberBonuses.filter((b) => b.status === 'Pending').reduce((s, b) => s + b.amount, 0);

  return (
    <div className="space-y-0">
      {/* Back link */}
      <div className="mb-4">
        <Link href="/members" className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors">
          <ArrowLeft size={15} /> Back to Members
        </Link>
      </div>

      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#14532d] px-4 sm:px-7 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar + name */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-cyan-400 to-cyan-600 flex items-center justify-center shrink-0 ring-4 ring-white/10">
              <span className="text-white text-xl sm:text-2xl font-bold">{mockMemberDetail.initials}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-[28px] font-bold text-white leading-tight mb-2">{mockMemberDetail.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
                  {mockMemberDetail.memberId}
                </span>
                <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-cyan-500/25 text-cyan-300">
                  {mockMemberDetail.tier}
                </span>
                <span className="inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/20 text-green-400">
                  <span className="w-1.5 h-1.5 rounded-full bg-green-400" />
                  {mockMemberDetail.status}
                </span>
              </div>
            </div>
          </div>

          {/* Edit button */}
          <button className="w-full sm:w-auto shrink-0 text-sm font-semibold px-5 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
            Edit Member
          </button>
        </div>

        {/* Tabs — scrollable on mobile */}
        <div className="flex gap-1 mt-6 -mb-6 pb-0 overflow-x-auto scrollbar-hide">
          {TABS.map((tab) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={cn(
                'px-4 py-2.5 text-sm font-medium rounded-t-lg transition-colors relative whitespace-nowrap shrink-0',
                activeTab === tab
                  ? 'text-white after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-white'
                  : 'text-white/50 hover:text-white/80'
              )}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      {/* Tab divider line */}
      <div className="h-px bg-gray-200" />

      {/* Tab content */}
      {activeTab === 'Overview' && (
        <div className="pt-6 space-y-6">
          {/* 3-col grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT — Personal Info */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Personal Info</h2>
              <div className="space-y-4">
                {PERSONAL_FIELDS.map((f) => {
                  const Icon = ICON_MAP[f.icon];
                  return (
                    <div key={f.label} className="flex items-center gap-3">
                      <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${f.iconBg}`}>
                        {Icon && <Icon size={16} className={f.iconColor} />}
                      </div>
                      <div className="min-w-0">
                        <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">{f.label}</p>
                        <p className="text-sm font-medium text-gray-900 truncate">{f.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* MIDDLE — KPI mini cards */}
            <div className="grid grid-cols-2 md:grid-cols-1 gap-3">
              {memberKPIs.map((kpi) => {
                const Icon = ICON_MAP[kpi.icon];
                return (
                  <div key={kpi.label} className="bg-white rounded-2xl shadow-sm p-4 flex items-center gap-4">
                    <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${kpi.iconBg}`}>
                      {Icon && <Icon size={18} className={kpi.iconColor} />}
                    </div>
                    <div>
                      <p className="text-xl font-bold text-gray-900 leading-none">{kpi.value}</p>
                      <p className="text-xs text-gray-500 mt-0.5">{kpi.label}</p>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* RIGHT — Network Tree + Quick Actions */}
            <div className="space-y-4">
              {/* Network Tree */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Network Tree</h2>

                {/* Sponsor row */}
                <div className="flex items-center justify-between mb-4 pb-4 border-b border-gray-100">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-full bg-gradient-to-br from-puRPle-400 to-puRPle-600 flex items-center justify-center">
                      <span className="text-white text-[11px] font-bold">{networkTree.sponsor.initials}</span>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">{networkTree.sponsor.name}</p>
                      <p className="text-[11px] text-gray-400">Sponsor</p>
                    </div>
                  </div>
                  <span className="text-xs text-gray-400 font-medium">{networkTree.sponsor.depth}</span>
                </div>

                {/* Downline tiers */}
                <div className="space-y-2.5">
                  {networkTree.downline.map((row) => (
                    <div key={row.tier} className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <span className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: row.color }} />
                        <span className="text-sm text-gray-700">{row.tier}</span>
                      </div>
                      <span className="text-sm font-semibold text-gray-900">{row.count}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Quick Actions */}
              <div className="bg-white rounded-2xl shadow-sm p-5">
                <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
                <div className="grid grid-cols-2 sm:grid-cols-1 gap-2">
                  {quickActions.map((action) => {
                    const Icon = ICON_MAP[action.icon];
                    return (
                      <button
                        key={action.label}
                        className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left"
                      >
                        <div className={`w-8 h-8 rounded-lg flex items-center justify-center shrink-0 ${action.iconBg}`}>
                          {Icon && <Icon size={15} className={action.iconColor} />}
                        </div>
                        <span className="text-sm font-medium text-gray-700">{action.label}</span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* Recent Orders */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <h2 className="text-base font-semibold text-gray-900">Recent Orders</h2>
            </div>
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['PRODUCT', 'DATE', 'AMOUNT', 'STATUS'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {memberOrders.map((order, idx) => (
                    <tr key={idx} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{order.product}</td>
                      <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{fmt(order.amount)}</td>
                      <td className="px-5 py-3.5">
                        <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${STATUS_BADGE[order.status]}`}>
                          {order.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {memberOrders.map((order, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{order.product}</span>
                    <span className={`text-xs font-semibold px-2 py-0.5 rounded-full ${STATUS_BADGE[order.status]}`}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{order.date}</span>
                    <span className="text-sm font-bold text-gray-900">{fmt(order.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'Orders' && (
        <div className="pt-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <span className="text-sm text-gray-500">{memberOrders.length} orders</span>
              <span className="text-sm font-bold text-gray-900">
                Total spent: {fmt(memberOrders.reduce((s, o) => s + o.amount, 0))}
              </span>
            </div>

            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['Order ID', 'Product', 'Date', 'Amount', 'Status', 'Action'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {paginatedOrders.map((order, i) => (
                    <tr key={order.id} className={cn('border-b border-gray-100 last:border-0 hover:bg-gray-50/40 transition-colors', i % 2 === 1 ? 'bg-gray-50/50' : '')}>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{order.id}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{order.product}</td>
                      <td className="px-5 py-3.5 text-gray-500">{order.date}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{fmt(order.amount)}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', STATUS_BADGE[order.status])}>
                          {order.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <Link href={`/orders/${order.id}`} className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                          View
                        </Link>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {paginatedOrders.map((order) => (
                <div key={order.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-gray-500">{order.id}</span>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[order.status])}>
                      {order.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{order.product}</span>
                    <span className="text-sm font-bold text-gray-900">{fmt(order.amount)}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{order.date}</span>
                    <Link href={`/orders/${order.id}`} className="text-xs font-semibold text-green-600 hover:text-green-700">
                      View
                    </Link>
                  </div>
                </div>
              ))}
            </div>

            {totalOrdeRPages > 1 && (
              <div className="px-5 py-4 border-t border-gray-100 flex items-center justify-between">
                <span className="text-xs text-gray-400">
                  Showing {(ordersPage - 1) * ORDERS_PAGE_SIZE + 1}–{Math.min(ordersPage * ORDERS_PAGE_SIZE, memberOrders.length)} of {memberOrders.length}
                </span>
                <div className="flex gap-2">
                  <button
                    onClick={() => setOrdersPage((p) => Math.max(1, p - 1))}
                    disabled={ordersPage === 1}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Prev
                  </button>
                  <button
                    onClick={() => setOrdersPage((p) => Math.min(totalOrdeRPages, p + 1))}
                    disabled={ordersPage === totalOrdeRPages}
                    className="px-3 py-1.5 text-xs font-medium border border-gray-200 rounded-lg text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
                  >
                    Next
                  </button>
                </div>
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── BONUSES TAB ────────────────────────────────────────────────────── */}
      {activeTab === 'Bonuses' && (
        <div className="pt-6 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            {[
              { label: 'Total Earned', value: totalBonus,   color: 'text-green-600', bg: 'bg-green-50' },
              { label: 'This Month',   value: monthBonus,   color: 'text-blue-600',  bg: 'bg-blue-50'  },
              { label: 'Pending',      value: pendingBonus, color: 'text-amber-600', bg: 'bg-amber-50' },
            ].map((s) => (
              <div key={s.label} className={cn('rounded-2xl shadow-sm p-5', s.bg)}>
                <p className={cn('text-2xl font-bold leading-none', s.color)}>{fmt(s.value)}</p>
                <p className="text-xs text-gray-500 mt-1">{s.label}</p>
              </div>
            ))}
          </div>

          {/* Table */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            {/* Desktop table */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['Month', 'Bonus Type', 'Amount', 'Status', 'Paid On'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">{col}</th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {memberBonuses.map((b, idx) => (
                    <tr key={idx} className="border-b border-gray-100 last:border-0 hover:bg-gray-50/40 transition-colors">
                      <td className="px-5 py-3.5 text-gray-600">{b.month}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{b.type}</td>
                      <td className={cn('px-5 py-3.5 font-semibold', b.status === 'Approved' ? 'text-green-700' : 'text-amber-600')}>
                        {fmt(b.amount)}
                      </td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', STATUS_BADGE[b.status])}>
                          {b.status}
                        </span>
                      </td>
                      <td className="px-5 py-3.5 text-gray-500">{b.paidOn}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile cards */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {memberBonuses.map((b, idx) => (
                <div key={idx} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-sm font-semibold text-gray-900">{b.type}</span>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[b.status])}>
                      {b.status}
                    </span>
                  </div>
                  <div className="flex items-center justify-between mb-1">
                    <span className="text-xs text-gray-400">{b.month}</span>
                    <span className={cn('text-sm font-bold', b.status === 'Approved' ? 'text-green-700' : 'text-amber-600')}>
                      {fmt(b.amount)}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400">Paid: {b.paidOn}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── WALLET TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'Wallet' && (
        <div className="pt-6 space-y-5">
          {/* Balance header */}
          <div className="bg-white rounded-2xl shadow-sm p-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
            <div>
              <p className="text-xs text-gray-400 font-semibold uppercase tracking-wide mb-1">Current Balance</p>
              <p className="text-3xl font-bold text-green-600">{fmt(walletBal)}</p>
            </div>
            <button
              onClick={() => setWalletModal(true)}
              className="w-full sm:w-auto border border-green-600 text-green-700 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-green-50 transition-colors"
            >
              Adjust Balance
            </button>
          </div>

          {/* Transactions */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden divide-y divide-gray-100">
            {memberWallet.map((txn) => (
              <div key={txn.id} className="flex items-center gap-4 px-5 py-4">
                {/* Icon */}
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', txn.flow === 'credit' ? 'bg-green-100' : 'bg-red-100')}>
                  {txn.flow === 'credit'
                    ? <ArrowUp size={16} className="text-green-600" />
                    : <ArrowDown size={16} className="text-red-600" />}
                </div>

                {/* Middle */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900">{txn.type}</p>
                  <p className="text-xs text-gray-500 truncate">{txn.description}</p>
                  <p className="text-[10px] text-gray-400 font-mono mt-0.5">{txn.id}</p>
                </div>

                {/* Right */}
                <div className="text-right shrink-0">
                  <p className={cn('text-sm font-bold', txn.flow === 'credit' ? 'text-green-600' : 'text-red-600')}>
                    {txn.flow === 'credit' ? '+' : '-'}{fmt(txn.amount)}
                  </p>
                  <p className="text-[10px] text-gray-400 mt-0.5">{txn.date}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ───────────────────────────────────────────────────── */}
      {activeTab === 'Activity' && (
        <div className="pt-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="relative">
              {/* Vertical line */}
              <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gray-200" />

              <div className="space-y-0">
                {memberActivity.map((item, i) => (
                  <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
                    {/* Dot */}
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white z-10', ACTIVITY_DOT[item.icon])}>
                      <span className="text-white text-xs font-bold">{item.icon === 'order' ? '🛒' : item.icon === 'bonus' ? '₹' : item.icon === 'wallet' ? '↑' : item.icon === 'profile' ? '✎' : item.icon === 'network' ? '⊕' : item.icon === 'kyc' ? '✓' : item.icon === 'login' ? '→' : '★'}</span>
                    </div>

                    {/* Content */}
                    <div className="flex-1 min-w-0 pt-1">
                      <div className="flex items-start justify-between gap-2">
                        <p className="text-sm font-semibold text-gray-900">{item.action}</p>
                        <span className="text-xs text-gray-400 shrink-0 whitespace-nowrap">{item.date} · {item.time}</span>
                      </div>
                      <p className="text-sm text-gray-500 mt-0.5">{item.description}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      )}

      {/* ── WALLET ADJUST MODAL ─────────────────────────────────────────────── */}
      {walletModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={() => setWalletModal(false)}>
          <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-base font-bold text-gray-900">Manual Wallet Adjustment</h3>
              <button onClick={() => setWalletModal(false)} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
                <X size={14} />
              </button>
            </div>

            {/* Credit / Debit toggle */}
            <div className="flex gap-1 bg-gray-100 p-1 rounded-xl mb-5">
              {(['credit', 'debit'] as const).map((f) => (
                <button
                  key={f}
                  onClick={() => setWalletFlow(f)}
                  className={cn('flex-1 py-1.5 rounded-lg text-sm font-semibold capitalize transition-all', walletFlow === f ? (f === 'credit' ? 'bg-green-600 text-white' : 'bg-red-500 text-white') : 'text-gray-500 hover:text-gray-700')}
                >
                  {f}
                </button>
              ))}
            </div>

            {/* Amount */}
            <div className="flex flex-col gap-1.5 mb-4">
              <label className="text-xs font-semibold text-gray-500">Amount</label>
              <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-400 transition-all">
                <span className="px-3 py-2.5 text-sm font-semibold text-gray-400 bg-gray-50 border-r border-gray-200">₹</span>
                <input
                  type="number"
                  value={walletAmount}
                  onChange={(e) => setWalletAmount(e.target.value)}
                  placeholder="0"
                  className="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none"
                />
              </div>
            </div>

            {/* Reason */}
            <div className="flex flex-col gap-1.5 mb-6">
              <label className="text-xs font-semibold text-gray-500">Reason</label>
              <textarea
                rows={3}
                value={walletReason}
                onChange={(e) => setWalletReason(e.target.value)}
                placeholder="Reason for adjustment..."
                className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all placeholder:text-gray-300"
              />
            </div>

            <button
              onClick={applyAdjustment}
              className="w-full bg-green-600 text-[#0b1410] font-semibold text-sm py-2.5 rounded-xl hover:bg-green-700 transition-colors"
            >
              Apply Adjustment
            </button>
          </div>
        </div>
      )}

      {/* Wallet toast */}
      {walletToast && (
        <div className="fixed top-5 right-5 z-[60] flex items-center gap-2 bg-[#0a1f13] text-green-400 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-green-500/30 pointer-events-none">
          <CheckCircle size={13} className="shrink-0" /> Wallet adjusted successfully
        </div>
      )}
    </div>
  );
}
