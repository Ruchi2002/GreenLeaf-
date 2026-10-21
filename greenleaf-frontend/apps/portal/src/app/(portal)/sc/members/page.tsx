'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSCMembers } from '@/hooks/useSCMembers';
import type { CardLevel, MemberStatus, SCMember } from '@/data/mock/scMembers';

const STATUS_TABS: { label: string; value: MemberStatus | 'all' }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Activated', value: 'activated' },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Frozen',    value: 'frozen'    },
];

function cardBadgeClass(level: CardLevel): string {
  switch (level) {
    case 'bronze':   return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'silver':   return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'gold':     return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'platinum': return 'bg-purple-50 text-purple-700 border border-purple-200';
  }
}

function statusBadgeClass(status: MemberStatus): string {
  switch (status) {
    case 'pending':   return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'activated': return 'bg-primary-soft text-primary border border-primary/20';
    case 'frozen':    return 'bg-blue-50 text-blue-600 border border-blue-200';
    default:          return 'bg-border text-text-muted';
  }
}

function MemberRow({ member, onFreeze, onActivate }: {
  member:     SCMember;
  onFreeze:   (id: string) => void;
  onActivate: (id: string) => void;
}) {
  const router = useRouter();

  function goToDetail(e: React.MouseEvent) {
    // don't navigate when a button inside is clicked
    if ((e.target as HTMLElement).closest('button')) return;
    router.push('/sc/members/' + member.id);
  }

  return (
    <>
      {/* Desktop row */}
      <div
        className="hidden md:flex items-center gap-4 px-6 py-4 cursor-pointer hover:bg-primary-soft/30 transition-colors"
        onClick={goToDetail}
      >
        <div className="flex items-center gap-3 flex-1 min-w-0">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{member.initials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text truncate">{member.name}</p>
            <p className="text-xs text-text-muted">{member.memberId}</p>
          </div>
        </div>
        <div className="flex items-center gap-3 shrink-0 flex-wrap">
          <span className={cn('rounded-full px-3 py-0.5 text-xs font-medium capitalize', cardBadgeClass(member.cardLevel))}>
            {member.cardLevel.charAt(0).toUpperCase() + member.cardLevel.slice(1)}
          </span>
          <span className="text-xs text-text-muted min-w-[140px]">Sponsor: {member.sponsor ?? '—'}</span>
          <span className="text-xs text-text-muted min-w-[90px]">{member.joinDate}</span>
          <span className={cn('rounded-full px-3 py-0.5 text-xs capitalize', statusBadgeClass(member.status))}>
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </span>

          {member.status === 'pending' && (
            <button
              onClick={() => onActivate(member.id)}
              className="bg-primary text-[#0b1410] font-semibold text-xs px-4 py-1.5 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Activate
            </button>
          )}
          {member.status === 'activated' && (
            <>
              <button
                onClick={() => console.log('TODO: upgrade', member.memberId)}
                className="text-xs px-4 py-1.5 rounded-lg border border-border text-text hover:bg-bg transition-colors"
              >
                Upgrade
              </button>
              <button
                onClick={() => onFreeze(member.id)}
                className="text-xs px-4 py-1.5 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Freeze
              </button>
            </>
          )}
          {member.status === 'frozen' && (
            <button
              onClick={() => onActivate(member.id)}
              className="text-xs px-4 py-1.5 rounded-lg border border-primary/40 text-primary hover:bg-primary-soft transition-colors"
            >
              Unfreeze
            </button>
          )}
        </div>
      </div>

      {/* Mobile card */}
      <div
        className="md:hidden px-4 py-4 flex flex-col gap-3 cursor-pointer active:bg-primary-soft/20 transition-colors"
        onClick={goToDetail}
      >
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-sm font-bold text-primary">{member.initials}</span>
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-sm font-semibold text-text truncate">{member.name}</p>
            <p className="text-xs text-text-muted">{member.memberId}</p>
          </div>
          <span className={cn('rounded-full px-2.5 py-0.5 text-xs font-medium capitalize shrink-0', statusBadgeClass(member.status))}>
            {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
          </span>
        </div>
        <div className="flex flex-wrap gap-2 text-xs">
          <span className={cn('rounded-full px-2.5 py-0.5 font-medium capitalize', cardBadgeClass(member.cardLevel))}>
            {member.cardLevel.charAt(0).toUpperCase() + member.cardLevel.slice(1)}
          </span>
          <span className="text-text-muted">Sponsor: {member.sponsor ?? '—'}</span>
          <span className="text-text-muted">{member.joinDate}</span>
        </div>
        <div className="flex gap-2">
          {member.status === 'pending' && (
            <button
              onClick={() => onActivate(member.id)}
              className="flex-1 bg-primary text-[#0b1410] font-semibold text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors"
            >
              Activate
            </button>
          )}
          {member.status === 'activated' && (
            <>
              <button
                onClick={() => console.log('TODO: upgrade', member.memberId)}
                className="flex-1 text-xs py-2 rounded-lg border border-border text-text hover:bg-bg transition-colors"
              >
                Upgrade
              </button>
              <button
                onClick={() => onFreeze(member.id)}
                className="flex-1 text-xs py-2 rounded-lg border border-blue-300 text-blue-600 hover:bg-blue-50 transition-colors"
              >
                Freeze
              </button>
            </>
          )}
          {member.status === 'frozen' && (
            <button
              onClick={() => onActivate(member.id)}
              className="flex-1 text-xs py-2 rounded-lg border border-primary/40 text-primary hover:bg-primary-soft transition-colors"
            >
              Unfreeze
            </button>
          )}
        </div>
      </div>
    </>
  );
}

export default function MemberListPage() {
  const { members, loading, setMembers } = useSCMembers();

  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<MemberStatus | 'all'>('all');
  const [cardFilter,   setCardFilter]   = useState<CardLevel | 'any'>('any');

  const filtered = useMemo(() => members.filter((m) => {
    const matchSearch = search === ''
      || m.name.toLowerCase().includes(search.toLowerCase())
      || m.memberId.toLowerCase().includes(search.toLowerCase());
    const matchStatus = statusFilter === 'all' || m.status === statusFilter;
    const matchCard   = cardFilter   === 'any'  || m.cardLevel === cardFilter;
    return matchSearch && matchStatus && matchCard;
  }), [members, search, statusFilter, cardFilter]);

  function handleFreeze(id: string) {
    // MOCK ONLY — BACKEND_REQUIRED_LATER
    setMembers((prev: SCMember[]) => prev.map((m: SCMember) => m.id === id ? { ...m, status: 'frozen' as const } : m));
  }

  function handleActivate(id: string) {
    // MOCK ONLY — BACKEND_REQUIRED_LATER
    setMembers((prev: SCMember[]) => prev.map((m: SCMember) => m.id === id ? { ...m, status: 'activated' as const } : m));
  }

  return (
    <div className="pt-14 w-full">
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Member List</h1>
        <p className="text-sm text-text-muted mt-0.5">Members you sponsored or registered</p>
      </div>

      {/* Filter row */}
      <div className="flex items-center gap-3 w-full mb-4">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by member ID or name"
            className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-text-muted hidden sm:inline">Card:</span>
          <select
            value={cardFilter}
            onChange={(e) => setCardFilter(e.target.value as CardLevel | 'any')}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="any">Any level</option>
            <option value="bronze">Bronze</option>
            <option value="silver">Silver</option>
            <option value="gold">Gold</option>
            <option value="platinum">Platinum</option>
          </select>
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 mb-4 flex-wrap">
        {STATUS_TABS.map((tab) => (
          <button
            key={tab.value}
            onClick={() => setStatusFilter(tab.value)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm transition-colors border',
              statusFilter === tab.value
                ? 'bg-primary text-[#0b1410] font-semibold border-primary'
                : 'bg-bg border-border text-text-muted hover:bg-surface'
            )}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Member list card */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm w-full divide-y divide-border pb-2">
        {loading && (
          <div className="flex flex-col divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-6 py-4 animate-pulse">
                <div className="w-10 h-10 rounded-full bg-border shrink-0" />
                <div className="flex-1 flex flex-col gap-2">
                  <div className="h-3 w-32 bg-border rounded" />
                  <div className="h-2.5 w-24 bg-border/60 rounded" />
                </div>
                <div className="flex gap-2">
                  <div className="h-6 w-16 bg-border rounded-full" />
                  <div className="h-6 w-20 bg-border rounded" />
                </div>
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted text-sm">No members found.</div>
        )}

        {!loading && filtered.map((member) => (
          <MemberRow
            key={member.id}
            member={member}
            onFreeze={handleFreeze}
            onActivate={handleActivate}
          />
        ))}
      </div>
    </div>
  );
}
