'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { useParams } from 'next/navigation';
import Link from 'next/link';
import {
  ArrowLeft, Phone, Mail, MapPin, Calendar, User,
  Users, ShoppingCart, TrendingUp, Banknote,
  CheckCircle, ShieldOff, KeyRound, Megaphone,
} from 'lucide-react';
import { cn } from '@/lib/utils';

// ── Mock data ─────────────────────────────────────────────────────────────────

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_SC = {
  id:        'S200001',
  name:      'Greenleaf Jakarta Pusat',
  initials:  'GJ',
  ownerName: 'Sari Utami',
  city:      'Jakarta',
  address:   'Jl. Sudirman No. 45, Blok A, Jakarta Pusat 10220',
  phone:     '+62 812 3456 7890',
  email:     'sari.utami@greenleaf-id.com',
  joined:    '12 Jan 2024',
  status:    'Active' as 'Active' | 'Pending' | 'Suspended',
  members:   87,
  monthOrders: 14,
  revenue:   48500000,
  monthlyPV: 42500,
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_MEMBERS = [
  { id: 'm1', name: 'Budi Hartono',    memberId: 'RP85299518', joined: 'Jan 14, 2024', rank: 'Gold',     status: 'Active'   },
  { id: 'm2', name: 'Dewi Kusuma',     memberId: 'RP76379988', joined: 'Feb 2, 2024',  rank: 'Silver',   status: 'Active'   },
  { id: 'm3', name: 'Agus Prasetyo',   memberId: 'RP19978798', joined: 'Feb 19, 2024', rank: 'Bronze',   status: 'Active'   },
  { id: 'm4', name: 'Rina Wulandari',  memberId: 'RP47850333', joined: 'Mar 5, 2024',  rank: 'Platinum', status: 'Active'   },
  { id: 'm5', name: 'Hendra Kurnia',   memberId: 'RP28374950', joined: 'Mar 22, 2024', rank: 'Bronze',   status: 'Inactive' },
  { id: 'm6', name: 'Fitri Handayani', memberId: 'RP63920471', joined: 'Apr 8, 2024',  rank: 'Silver',   status: 'Active'   },
  { id: 'm7', name: 'Wahyu Santoso',   memberId: 'RP91847362', joined: 'Apr 30, 2024', rank: 'Bronze',   status: 'Active'   },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_ORDERS = [
  { id: 'GL-4820', member: 'Budi Hartono',    product: 'Starter Kit Pro',  amount: 1200000, date: 'Oct 12, 2026', status: 'Completed'  },
  { id: 'GL-4751', member: 'Rina Wulandari',  product: 'Wellness Bundle',  amount: 840000,  date: 'Oct 10, 2026', status: 'Completed'  },
  { id: 'GL-4683', member: 'Dewi Kusuma',     product: 'Skincare Set',     amount: 420000,  date: 'Oct 8, 2026',  status: 'Processing' },
  { id: 'GL-4601', member: 'Fitri Handayani', product: 'Starter Kit',      amount: 280000,  date: 'Oct 5, 2026',  status: 'Completed'  },
  { id: 'GL-4540', member: 'Agus Prasetyo',   product: 'Wellness Bundle',  amount: 840000,  date: 'Oct 2, 2026',  status: 'Completed'  },
  { id: 'GL-4488', member: 'Wahyu Santoso',   product: 'Starter Kit Pro',  amount: 1200000, date: 'Sep 28, 2026', status: 'Refunded'   },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_PERF = [
  { month: 'May',  pv: 31200 },
  { month: 'Jun',  pv: 34800 },
  { month: 'Jul',  pv: 38100 },
  { month: 'Aug',  pv: 36500 },
  { month: 'Sep',  pv: 40200 },
  { month: 'Oct',  pv: 42500 },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_ACTIVITY = [
  { id: 1,  action: 'Member Registered',  description: 'Wahyu Santoso (RP91847362) registered under this SC',          date: 'Apr 30, 2024', time: '10:15 AM', color: 'bg-green-500'  },
  { id: 2,  action: 'Order Placed',       description: 'Order #GL-4820 placed by Budi Hartono — Starter Kit Pro',      date: 'Oct 12, 2026', time: '11:24 AM', color: 'bg-blue-500'   },
  { id: 3,  action: 'Order Refunded',     description: 'Order #GL-4488 refunded for Wahyu Santoso',                    date: 'Sep 29, 2026', time: '02:10 PM', color: 'bg-red-400'    },
  { id: 4,  action: 'Password Reset',     description: 'SC owner password reset by admin Amit Kumar',                  date: 'Sep 15, 2026', time: '09:40 AM', color: 'bg-amber-500'  },
  { id: 5,  action: 'Profile Updated',    description: 'SC address updated by owner Sari Utami',                       date: 'Aug 20, 2026', time: '03:55 PM', color: 'bg-puRPle-500' },
  { id: 6,  action: 'Member Registered',  description: 'Fitri Handayani (RP63920471) registered under this SC',        date: 'Apr 8, 2024',  time: '11:00 AM', color: 'bg-green-500'  },
  { id: 7,  action: 'SC Approved',        description: 'Service Center approved by admin — status set to Active',      date: 'Jan 13, 2024', time: '10:00 AM', color: 'bg-emerald-600'},
  { id: 8,  action: 'SC Created',         description: 'Service Center S200001 created by Sari Utami',                 date: 'Jan 12, 2024', time: '04:30 PM', color: 'bg-gray-400'   },
];

// ── Helpers ───────────────────────────────────────────────────────────────────

const TABS = ['Overview', 'Members', 'Orders', 'Performance', 'Activity'];

const STATUS_CHIP: Record<string, string> = {
  Active:    'bg-green-100 text-green-700',
  Pending:   'bg-amber-100 text-amber-700',
  Suspended: 'bg-red-100 text-red-700',
};

const ORDER_STATUS_BADGE: Record<string, string> = {
  Completed:  'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Refunded:   'bg-red-100 text-red-600',
  Pending:    'bg-amber-100 text-amber-700',
};

const MEMBER_STATUS_DOT: Record<string, string> = {
  Active:   'bg-green-500',
  Inactive: 'bg-gray-400',
};

const MEMBER_STATUS_TEXT: Record<string, string> = {
  Active:   'text-green-700',
  Inactive: 'text-gray-500',
};

const RANK_BADGE: Record<string, string> = {
  Platinum: 'bg-puRPle-100 text-puRPle-700',
  Gold:     'bg-yellow-100 text-yellow-700',
  Silver:   'bg-gray-100 text-gray-600',
  Bronze:   'bg-orange-100 text-orange-700',
};

function fmtRP(n: number) {
  return 'RP ' + n.toLocaleString('id-ID');
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function ServiceCenterDetailPage() {
  useParams<{ id: string }>();   // id available for future real API calls

  const [activeTab, setActiveTab] = useState('Overview');
  const sc = MOCK_SC; // MOCK ONLY — BACKEND_REQUIRED_LATER

  const maxPV = Math.max(...MOCK_PERF.map((p) => p.pv));

  return (
    <div className="space-y-0">
      {/* Back link */}
      <div className="mb-4">
        <Link
          href="/service-centers"
          className="inline-flex items-center gap-1.5 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={15} /> Back to Service Centers
        </Link>
      </div>

      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#14532d] px-4 sm:px-7 py-6">
        <div className="flex flex-col sm:flex-row sm:items-center gap-4">
          {/* Avatar + info */}
          <div className="flex items-center gap-4 flex-1 min-w-0">
            <div className="w-16 sm:w-20 h-16 sm:h-20 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shrink-0 ring-4 ring-white/10">
              <span className="text-white text-xl sm:text-2xl font-bold">{sc.initials}</span>
            </div>
            <div className="min-w-0">
              <h1 className="text-xl sm:text-[26px] font-bold text-white leading-tight mb-2">{sc.name}</h1>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-white/10 text-white/70">
                  {sc.id}
                </span>
                <span className="text-xs text-white/60">{sc.city}</span>
                <span className={cn(
                  'inline-flex items-center gap-1.5 text-xs font-semibold px-2.5 py-0.5 rounded-full',
                  sc.status === 'Active'    ? 'bg-green-500/20 text-green-400' :
                  sc.status === 'Pending'   ? 'bg-amber-500/20 text-amber-400' :
                                             'bg-red-500/20 text-red-400'
                )}>
                  <span className={cn('w-1.5 h-1.5 rounded-full',
                    sc.status === 'Active'  ? 'bg-green-400' :
                    sc.status === 'Pending' ? 'bg-amber-400' : 'bg-red-400'
                  )} />
                  {sc.status}
                </span>
              </div>
            </div>
          </div>

          <button className="w-full sm:w-auto shrink-0 text-sm font-semibold px-5 py-2 rounded-xl border border-white/30 text-white hover:bg-white/10 transition-colors">
            Edit SC
          </button>
        </div>

        {/* Tabs */}
        <div className="flex gap-1 mt-6 -mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
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

      {/* Divider */}
      <div className="h-px bg-gray-200" />

      {/* ── OVERVIEW ─────────────────────────────────────────────────────────── */}
      {activeTab === 'Overview' && (
        <div className="pt-6 space-y-6">
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-5">

            {/* LEFT — Basic Info */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">SC Info</h2>
              <div className="space-y-4">
                {[
                  { label: 'Owner',   value: sc.ownerName, Icon: User,     iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
                  { label: 'Phone',   value: sc.phone,     Icon: Phone,    iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
                  { label: 'Email',   value: sc.email,     Icon: Mail,     iconBg: 'bg-puRPle-100', iconColor: 'text-puRPle-600' },
                  { label: 'City',    value: sc.city,      Icon: MapPin,   iconBg: 'bg-orange-100', iconColor: 'text-orange-600' },
                  { label: 'Address', value: sc.address,   Icon: MapPin,   iconBg: 'bg-orange-50',  iconColor: 'text-orange-400' },
                  { label: 'Joined',  value: sc.joined,    Icon: Calendar, iconBg: 'bg-gray-100',   iconColor: 'text-gray-500'   },
                ].map(({ label, value, Icon, iconBg, iconColor }) => (
                  <div key={label} className="flex items-start gap-3">
                    <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
                      <Icon size={16} className={iconColor} />
                    </div>
                    <div className="min-w-0">
                      <p className="text-[11px] text-gray-400 uppercase tracking-wide font-semibold">{label}</p>
                      <p className="text-sm font-medium text-gray-900 break-words">{value}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* MIDDLE — KPI cards */}
            <div className="grid grid-cols-2 gap-3 content-start">
              {[
                { label: 'Total Members',      value: sc.members.toString(),   Icon: Users,       iconBg: 'bg-green-100',  iconColor: 'text-green-700'  },
                { label: 'This Month Orders',  value: sc.monthOrders.toString(),Icon: ShoppingCart,iconBg: 'bg-blue-100',   iconColor: 'text-blue-700'   },
                { label: 'Total Revenue',      value: fmtRP(sc.revenue),       Icon: Banknote,    iconBg: 'bg-emerald-100',iconColor: 'text-emerald-700'},
                { label: 'Monthly PV',         value: sc.monthlyPV.toLocaleString('en-IN') + ' PV', Icon: TrendingUp, iconBg: 'bg-amber-100', iconColor: 'text-amber-700' },
              ].map(({ label, value, Icon, iconBg, iconColor }) => (
                <div key={label} className="bg-white rounded-2xl shadow-sm p-4">
                  <div className={`w-9 h-9 rounded-xl flex items-center justify-center mb-3 ${iconBg}`}>
                    <Icon size={17} className={iconColor} />
                  </div>
                  <p className="text-lg font-bold text-gray-900 leading-none">{value}</p>
                  <p className="text-xs text-gray-500 mt-1">{label}</p>
                </div>
              ))}
            </div>

            {/* RIGHT — Quick Actions */}
            <div className="bg-white rounded-2xl shadow-sm p-5">
              <h2 className="text-sm font-semibold text-gray-900 mb-4">Quick Actions</h2>
              <div className="flex flex-col gap-2">
                {sc.status === 'Pending' && (
                  <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl bg-green-600 text-[#0b1410] hover:bg-green-500 transition-colors text-left">
                    <CheckCircle size={16} className="shrink-0" />
                    <span className="text-sm font-semibold">Approve SC</span>
                  </button>
                )}
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-orange-50 transition-colors text-left border border-orange-200">
                  <ShieldOff size={16} className="text-orange-600 shrink-0" />
                  <span className="text-sm font-medium text-orange-700">Suspend SC</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <KeyRound size={16} className="text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">Reset Password</span>
                </button>
                <button className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-gray-50 transition-colors text-left">
                  <Megaphone size={16} className="text-gray-500 shrink-0" />
                  <span className="text-sm font-medium text-gray-700">Send Announcement</span>
                </button>
              </div>
            </div>
          </div>

          {/* Recent Members */}
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <h2 className="text-base font-semibold text-gray-900">Recent Members</h2>
              <button onClick={() => setActiveTab('Members')} className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                View all →
              </button>
            </div>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['NAME', 'MEMBER ID', 'JOINED', 'STATUS'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_MEMBERS.slice(0, 4).map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-medium text-gray-900">{m.name}</td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{m.memberId}</td>
                      <td className="px-5 py-3.5 text-gray-500">{m.joined}</td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('w-2 h-2 rounded-full', MEMBER_STATUS_DOT[m.status])} />
                          <span className={cn('text-xs font-medium', MEMBER_STATUS_TEXT[m.status])}>{m.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {MOCK_MEMBERS.slice(0, 4).map((m) => (
                <div key={m.id} className="border border-gray-100 rounded-xl p-3 flex items-center gap-3">
                  <div className="w-9 h-9 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-green-700">
                      {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                    </span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 truncate">{m.name}</p>
                    <p className="text-xs text-gray-400">{m.memberId} · {m.joined}</p>
                  </div>
                  <div className="flex items-center gap-1 shrink-0">
                    <span className={cn('w-1.5 h-1.5 rounded-full', MEMBER_STATUS_DOT[m.status])} />
                    <span className={cn('text-xs font-medium', MEMBER_STATUS_TEXT[m.status])}>{m.status}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── MEMBERS TAB ──────────────────────────────────────────────────────── */}
      {activeTab === 'Members' && (
        <div className="pt-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100">
              <p className="text-sm text-gray-500">{MOCK_MEMBERS.length} members registered under this SC</p>
            </div>
            {/* Desktop */}
            <div className="hidden md:block">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['NAME', 'MEMBER ID', 'JOINED', 'RANK', 'STATUS'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_MEMBERS.map((m) => (
                    <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-3">
                          <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                            <span className="text-[10px] font-bold text-green-700">
                              {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                            </span>
                          </div>
                          <span className="font-medium text-gray-900">{m.name}</span>
                        </div>
                      </td>
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{m.memberId}</td>
                      <td className="px-5 py-3.5 text-gray-500">{m.joined}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', RANK_BADGE[m.rank])}>
                          {m.rank}
                        </span>
                      </td>
                      <td className="px-5 py-3.5">
                        <div className="flex items-center gap-1.5">
                          <span className={cn('w-2 h-2 rounded-full', MEMBER_STATUS_DOT[m.status])} />
                          <span className={cn('text-xs font-medium', MEMBER_STATUS_TEXT[m.status])}>{m.status}</span>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {MOCK_MEMBERS.map((m) => (
                <div key={m.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center shrink-0">
                        <span className="text-[10px] font-bold text-green-700">
                          {m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase()}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-gray-900">{m.name}</p>
                        <p className="text-xs text-gray-400">{m.memberId}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1">
                      <span className={cn('w-1.5 h-1.5 rounded-full', MEMBER_STATUS_DOT[m.status])} />
                      <span className={cn('text-xs font-medium', MEMBER_STATUS_TEXT[m.status])}>{m.status}</span>
                    </div>
                  </div>
                  <div className="flex items-center justify-between text-xs text-gray-500">
                    <span>Joined {m.joined}</span>
                    <span className={cn('font-semibold px-2 py-0.5 rounded-full', RANK_BADGE[m.rank])}>{m.rank}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── ORDERS TAB ───────────────────────────────────────────────────────── */}
      {activeTab === 'Orders' && (
        <div className="pt-6">
          <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
            <div className="px-5 py-4 border-b border-gray-100 flex items-center justify-between">
              <p className="text-sm text-gray-500">{MOCK_ORDERS.length} orders from this SC</p>
              <p className="text-sm font-bold text-gray-900">
                Total: {fmtRP(MOCK_ORDERS.reduce((s, o) => s + o.amount, 0))}
              </p>
            </div>
            {/* Desktop */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-gray-100 bg-gray-50/60">
                    {['ORDER ID', 'MEMBER', 'PRODUCT', 'AMOUNT', 'DATE', 'STATUS'].map((col) => (
                      <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {MOCK_ORDERS.map((o) => (
                    <tr key={o.id} className="hover:bg-gray-50/50 transition-colors">
                      <td className="px-5 py-3.5 font-mono text-xs text-gray-500">{o.id}</td>
                      <td className="px-5 py-3.5 text-gray-900">{o.member}</td>
                      <td className="px-5 py-3.5 font-medium text-gray-900">{o.product}</td>
                      <td className="px-5 py-3.5 font-semibold text-gray-900">{fmtRP(o.amount)}</td>
                      <td className="px-5 py-3.5 text-gray-500 whitespace-nowrap">{o.date}</td>
                      <td className="px-5 py-3.5">
                        <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', ORDER_STATUS_BADGE[o.status])}>
                          {o.status}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
            {/* Mobile */}
            <div className="md:hidden flex flex-col gap-3 p-4">
              {MOCK_ORDERS.map((o) => (
                <div key={o.id} className="border border-gray-100 rounded-xl p-3">
                  <div className="flex items-center justify-between mb-1">
                    <span className="font-mono text-xs text-gray-400">{o.id}</span>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', ORDER_STATUS_BADGE[o.status])}>
                      {o.status}
                    </span>
                  </div>
                  <p className="text-sm font-semibold text-gray-900 mb-0.5">{o.product}</p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-400">{o.member} · {o.date}</span>
                    <span className="text-sm font-bold text-gray-900">{fmtRP(o.amount)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* ── PERFORMANCE TAB ──────────────────────────────────────────────────── */}
      {activeTab === 'Performance' && (
        <div className="pt-6 space-y-5">
          {/* Stat cards */}
          <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
            {[
              { label: 'Best Month PV',        value: Math.max(...MOCK_PERF.map((p) => p.pv)).toLocaleString('en-IN') + ' PV' },
              { label: 'Avg Monthly PV',        value: Math.round(MOCK_PERF.reduce((s, p) => s + p.pv, 0) / MOCK_PERF.length).toLocaleString('en-IN') + ' PV' },
              { label: 'Total Members',         value: sc.members.toString() },
              { label: 'Active Rate',           value: Math.round(MOCK_MEMBERS.filter((m) => m.status === 'Active').length / MOCK_MEMBERS.length * 100) + '%' },
            ].map((s) => (
              <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5">
                <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{s.value}</p>
                <p className="text-xs text-gray-500">{s.label}</p>
              </div>
            ))}
          </div>

          {/* PV bar chart */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <p className="text-sm font-semibold text-gray-900 mb-5">Monthly PV — last 6 months</p>
            <div className="flex items-end gap-3 h-40">
              {MOCK_PERF.map((m) => {
                const pct = Math.round((m.pv / maxPV) * 100);
                return (
                  <div key={m.month} className="flex flex-col items-center gap-1.5 flex-1">
                    <span className="text-[10px] font-semibold text-gray-500">
                      {m.pv.toLocaleString('en-IN')}
                    </span>
                    <div className="w-full rounded-t-lg bg-gradient-to-t from-green-600 to-green-400 transition-all duration-500" style={{ height: `${pct}%`, minHeight: '4px' }} />
                    <span className="text-[10px] text-gray-400">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <p className="text-[10px] text-gray-300 mt-3 text-center">
              Chart — BACKEND_REQUIRED_LATER (real data will replace mock)
            </p>
          </div>
        </div>
      )}

      {/* ── ACTIVITY TAB ─────────────────────────────────────────────────────── */}
      {activeTab === 'Activity' && (
        <div className="pt-6">
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <div className="relative">
              <div className="absolute left-[17px] top-4 bottom-4 w-0.5 bg-gray-200" />
              <div className="space-y-0">
                {MOCK_ACTIVITY.map((item) => (
                  <div key={item.id} className="flex gap-4 pb-6 last:pb-0">
                    <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0 ring-4 ring-white z-10 text-white text-xs font-bold', item.color)}>
                      {item.action[0]}
                    </div>
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
    </div>
  );
}
