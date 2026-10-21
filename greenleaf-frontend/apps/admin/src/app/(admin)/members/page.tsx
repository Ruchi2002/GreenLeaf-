'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, Users, UserCheck, UserPlus, Clock } from 'lucide-react';
import { memberStats, adminMembers, type MemberTier, type MemberStatus } from '@/data/mock/adminMembers';
import { cn } from '@/lib/utils';

const ICON_MAP: Record<string, React.ElementType> = { Users, UserCheck, UserPlus, Clock };

const TIER_AVATAR: Record<MemberTier, string> = {
  Diamond: 'bg-cyan-500',
  Platinum: 'bg-puRPle-500',
  Gold:    'bg-yellow-500',
  Silver:  'bg-gray-400',
  Bronze:  'bg-orange-500',
};

const TIER_BADGE: Record<MemberTier, string> = {
  Diamond: 'bg-cyan-100 text-cyan-700',
  Platinum:'bg-puRPle-100 text-puRPle-700',
  Gold:    'bg-yellow-100 text-yellow-700',
  Silver:  'bg-gray-100 text-gray-600',
  Bronze:  'bg-orange-100 text-orange-700',
};

const STATUS_DOT: Record<MemberStatus, string> = {
  'Active':      'bg-green-500',
  'KYC Pending': 'bg-amber-400',
  'Inactive':    'bg-gray-400',
};

const STATUS_TEXT: Record<MemberStatus, string> = {
  'Active':      'text-green-700',
  'KYC Pending': 'text-amber-700',
  'Inactive':    'text-gray-500',
};

const TIERS: (MemberTier | 'All Tiers')[] = ['All Tiers', 'Silver', 'Gold', 'Platinum', 'Diamond'];

const TIER_PILL_ACTIVE: Record<string, string> = {
  'All Tiers': 'bg-gray-900 text-white',
  'Silver':    'bg-gray-200 text-gray-700',
  'Gold':      'bg-yellow-400 text-yellow-900',
  'Platinum':  'bg-puRPle-500 text-white',
  'Diamond':   'bg-cyan-500 text-white',
};

const TIER_PILL_INACTIVE = 'bg-white border border-gray-200 text-gray-500 hover:bg-gray-50';

export default function MembersPage() {
  const router = useRouter();
  const [search,      setSearch]      = useState('');
  const [activeTier,  setActiveTier]  = useState<MemberTier | 'All Tiers'>('All Tiers');
  const [currentPage,      setCurrentPage]      = useState(1);
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = adminMembers.filter((m) => {
    const matchSearch = !search ||
      m.name.toLowerCase().includes(search.toLowerCase()) ||
      m.memberId.toLowerCase().includes(search.toLowerCase());
    const matchTier = activeTier === 'All Tiers' || m.tier === activeTier;
    return matchSearch && matchTier;
  });

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#14532d] px-7 py-6 flex items-center gap-4">
        <div>
          <div className="flex items-center gap-3 mb-1">
            <h1 className="text-2xl font-bold text-white">Members</h1>
            <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/25 text-green-400">
              2,431 total
            </span>
          </div>
          <p className="text-sm text-green-200/70">Manage your distributor network, tiers, and KYC status.</p>
        </div>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {memberStats.map((s) => {
          const Icon = ICON_MAP[s.icon];
          return (
            <div key={s.label} className="bg-white rounded-2xl p-5 shadow-sm">
              <div className="flex items-start justify-between mb-3">
                <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${s.iconBg}`}>
                  {Icon && <Icon size={20} className={s.iconColor} />}
                </div>
                <span className={cn(
                  'text-xs font-semibold px-2 py-0.5 rounded-full',
                  s.trendUp ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-600'
                )}>
                  {s.trend}
                </span>
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
        })}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">
        {/* Search */}
        <div className="relative w-full md:w-72 md:shrink-0">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search members by name or ID..."
            className="w-full pl-10 pr-4 h-9 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
          />
        </div>

        {/* Tier pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 flex-1 md:justify-center scrollbar-hide">
          {TIERS.map((tier) => (
            <button
              key={tier}
              onClick={() => setActiveTier(tier)}
              className={cn(
                'text-xs font-semibold px-3.5 py-1.5 rounded-full transition-colors',
                activeTier === tier ? TIER_PILL_ACTIVE[tier] : TIER_PILL_INACTIVE
              )}
            >
              {tier}
            </button>
          ))}
        </div>

        {/* Filters button — mobile only */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="md:hidden ml-auto flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
        >
          <SlidersHorizontal size={14} />
          Filters
        </button>
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['MEMBER', 'PHONE', 'TIER', 'PV PROGRESS', 'SPONSOR', 'JOINED', 'STATUS', 'ACTIONS'].map((col) => (
                  <th key={col} className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide whitespace-nowrap">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filtered.map((m) => {
                const pvPct = Math.min(100, Math.round((m.pvCurrent / m.pvMax) * 100));
                return (
                  <tr key={m.id} className="hover:bg-gray-50/50 transition-colors">
                    {/* Member */}
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <div className={`w-9 h-9 rounded-full ${TIER_AVATAR[m.tier]} flex items-center justify-center shrink-0`}>
                          <span className="text-white text-[11px] font-bold">{m.initials}</span>
                        </div>
                        <div>
                          <p className="font-semibold text-gray-900 text-sm leading-tight">{m.name}</p>
                          <p className="text-xs text-gray-400">{m.memberId}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{m.phone}</td>
                    <td className="px-5 py-4">
                      <span className={`text-xs font-semibold px-2.5 py-0.5 rounded-full ${TIER_BADGE[m.tier]}`}>
                        {m.tier}
                      </span>
                    </td>
                    <td className="px-5 py-4 min-w-[140px]">
                      <p className="text-xs text-gray-600 mb-1.5 whitespace-nowrap">
                        {m.pvCurrent.toLocaleString()} / {m.pvMax.toLocaleString()} PV
                      </p>
                      <div className="h-1.5 w-full rounded-full bg-gray-100 overflow-hidden">
                        <div className="h-full rounded-full bg-gradient-to-r from-green-500 to-green-400" style={{ width: `${pvPct}%` }} />
                      </div>
                    </td>
                    <td className="px-5 py-4 text-gray-600 text-sm whitespace-nowrap">{m.sponsor}</td>
                    <td className="px-5 py-4 text-gray-500 text-sm whitespace-nowrap">{m.joined}</td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-1.5">
                        <span className={`w-2 h-2 rounded-full ${STATUS_DOT[m.status]}`} />
                        <span className={`text-xs font-medium ${STATUS_TEXT[m.status]}`}>{m.status}</span>
                      </div>
                    </td>
                    <td className="px-5 py-4">
                      <div className="flex items-center gap-3">
                        <button
                          onClick={() => router.push(`/members/${m.id}`)}
                          className="text-xs font-semibold px-3 py-1.5 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition-colors"
                        >
                          View
                        </button>
                        <button className="text-xs font-medium text-gray-500 hover:text-gray-800 transition-colors">
                          Edit
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>

        {/* Desktop pagination */}
        <div className="flex items-center justify-between px-5 py-3.5 border-t border-gray-100">
          <p className="text-sm text-gray-500">
            Showing 1–{filtered.length} of 2,431 members
          </p>
          <div className="flex items-center gap-1">
            {[1, 2, 3, 4].map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={cn(
                  'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                  currentPage === p ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                )}
              >
                {p}
              </button>
            ))}
            <span className="px-1 text-gray-400 text-sm">…</span>
            <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">244</button>
          </div>
        </div>
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-3">
        {filtered.map((m) => {
          const pvPct = Math.min(100, Math.round((m.pvCurrent / m.pvMax) * 100));
          return (
            <div key={m.id} className="bg-white rounded-2xl p-4 shadow-sm border border-gray-100">
              {/* Avatar + name + badges */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={`w-10 h-10 rounded-full ${TIER_AVATAR[m.tier]} flex items-center justify-center shrink-0`}>
                    <span className="text-white text-xs font-bold">{m.initials}</span>
                  </div>
                  <div>
                    <p className="font-semibold text-sm text-gray-900">{m.name}</p>
                    <p className="text-gray-400 text-xs">{m.memberId}</p>
                  </div>
                </div>
                <div className="flex items-center gap-1.5 flex-wrap justify-end">
                  <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full ${TIER_BADGE[m.tier]}`}>{m.tier}</span>
                  <div className="flex items-center gap-1">
                    <span className={`w-1.5 h-1.5 rounded-full ${STATUS_DOT[m.status]}`} />
                    <span className={`text-[10px] font-medium ${STATUS_TEXT[m.status]}`}>{m.status}</span>
                  </div>
                </div>
              </div>

              {/* Phone + Sponsor */}
              <div className="flex items-center justify-between text-xs text-gray-500 mb-3">
                <span>{m.phone}</span>
                <span>Sponsor: {m.sponsor}</span>
              </div>

              {/* PV progress */}
              <div className="mb-3">
                <div className="flex justify-between text-xs text-gray-500 mb-1">
                  <span>PV Progress</span>
                  <span>{m.pvCurrent.toLocaleString('en-IN')} / {m.pvMax.toLocaleString('en-IN')} PV</span>
                </div>
                <div className="w-full bg-gray-100 rounded-full h-1.5 overflow-hidden">
                  <div className="bg-gradient-to-r from-green-500 to-green-400 h-1.5 rounded-full" style={{ width: `${pvPct}%` }} />
                </div>
              </div>

              {/* Joined + actions */}
              <div className="flex items-center justify-between">
                <span className="text-xs text-gray-400">Joined {m.joined}</span>
                <div className="flex gap-2">
                  <button
                    onClick={() => router.push(`/members/${m.id}`)}
                    className="bg-green-600 text-[#0b1410] text-xs font-semibold px-3 py-1.5 rounded-lg hover:bg-green-500 transition-colors"
                  >
                    View
                  </button>
                  <button className="border border-gray-200 text-gray-600 text-xs px-3 py-1.5 rounded-lg hover:bg-gray-50 transition-colors">
                    Edit
                  </button>
                </div>
              </div>
            </div>
          );
        })}

        {/* Mobile pagination */}
        <div className="flex items-center justify-center gap-3 mt-2">
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            ← Prev
          </button>
          <span className="text-sm text-gray-500">Page {currentPage}</span>
          <button
            onClick={() => setCurrentPage((p) => p + 1)}
            className="px-4 py-1.5 rounded-lg border border-gray-200 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
          >
            Next →
          </button>
        </div>
      </div>
      {/* Mobile filter sheet */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">Filter by Tier</h3>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg">✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {TIERS.map((tier) => (
                <button
                  key={tier}
                  onClick={() => setActiveTier(tier)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                    activeTier === tier ? TIER_PILL_ACTIVE[tier] : TIER_PILL_INACTIVE
                  )}
                >
                  {tier}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-3 bg-green-600 text-[#0b1410] font-semibold rounded-xl text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
