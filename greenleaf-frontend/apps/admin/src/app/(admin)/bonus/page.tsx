'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useEffect, useRef, useCallback } from 'react';
import { Zap, CalendarDays, MoreHorizontal, X, Check, Eye, RotateCcw, XCircle } from 'lucide-react';
import { bonusTypeCards, bonusPayouts, type BonusStatus, type MemberTier } from '../../../data/mock/adminBonus';
import { cn } from '@/lib/utils';

// ── Types ──────────────────────────────────────────────────────────────────────
type LocalStatus = BonusStatus | 'Rejected';

interface LocalPayout {
  id: string; member: string; initials: string; avatarBg: string;
  tier: MemberTier; rb: string | null; gb: string | null;
  sb: string | null; ls: string | null; total: string;
  status: LocalStatus;
}

interface ToastItem { id: number; message: string; type: 'success' | 'error' | 'warning'; }

// ── Static maps ───────────────────────────────────────────────────────────────
const STATUS_BADGE: Record<LocalStatus, string> = {
  Approved:   'bg-green-100 text-green-700',
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Rejected:   'bg-red-100 text-red-600',
};

const TIER_BADGE: Record<MemberTier, string> = {
  Diamond:  'bg-cyan-100 text-cyan-700',
  Platinum: 'bg-puRPle-100 text-puRPle-700',
  Gold:     'bg-yellow-100 text-yellow-700',
  Silver:   'bg-gray-100 text-gray-500',
};

const MONTHS = ['July 2026','August 2026','September 2026','October 2026','November 2026'];

const BONUS_CODE_LABEL: Record<string, string> = {
  RB: 'Sponsor', GB: 'Group', SB: 'Layer', LS: 'Leadership', MS: 'Rebate',
};

// ── DonutRing ─────────────────────────────────────────────────────────────────
function DonutRing({ pct }: { pct: number }) {
  const r = 14, c = 2 * Math.PI * r;
  return (
    <svg width="36" height="36" viewBox="0 0 36 36" className="-rotate-90">
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.2)" strokeWidth="4" />
      <circle cx="18" cy="18" r={r} fill="none" stroke="rgba(255,255,255,0.85)" strokeWidth="4"
        strokeDasharray={c} strokeDashoffset={c - (pct / 100) * c} strokeLinecap="round" />
    </svg>
  );
}

// ── Modal backdrop ─────────────────────────────────────────────────────────────
function Modal({ children, onClose }: { children: React.ReactNode; onClose: () => void }) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
      onClick={onClose}>
      <div className="bg-white w-full sm:max-w-md rounded-t-3xl sm:rounded-2xl shadow-xl p-6 max-h-[90vh] overflow-y-auto" onClick={(e) => e.stopPropagation()}>
        {children}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────
export default function BonusPage() {
  const [month,        setMonth]        = useState('October 2026');
  const [monthOpen,    setMonthOpen]    = useState(false);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);
  const [payouts,      setPayouts]      = useState<LocalPayout[]>(bonusPayouts);
  const [openMenuId,   setOpenMenuId]   = useState<string | null>(null);
  const [detailRow,    setDetailRow]    = useState<LocalPayout | null>(null);
  const [showRunModal,         setShowRunModal]         = useState(false);
  const [showApproveAllModal,  setShowApproveAllModal]  = useState(false);
  const [toasts,       setToasts]       = useState<ToastItem[]>([]);

  const monthRef = useRef<HTMLDivElement>(null);
  const menuRef  = useRef<HTMLDivElement>(null);

  // Close month dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (monthRef.current && !monthRef.current.contains(e.target as Node)) setMonthOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Close row menu on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (menuRef.current && !menuRef.current.contains(e.target as Node)) setOpenMenuId(null);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Toast helpers ────────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message, type }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }, []);

  // ── Status mutations ─────────────────────────────────────────────────────────
  function updateStatus(id: string, status: LocalStatus) {
    setPayouts((prev) => prev.map((p) => p.id === id ? { ...p, status } : p));
  }

  function handleApproveRow(id: string) {
    updateStatus(id, 'Approved');
    setOpenMenuId(null);
    addToast('✓ Bonus payout approved', 'success');
  }

  function handleRejectRow(id: string) {
    updateStatus(id, 'Rejected');
    setOpenMenuId(null);
    addToast('Payout rejected', 'error');
  }

  function handleReverseRow(id: string) {
    updateStatus(id, 'Pending');
    setOpenMenuId(null);
    addToast('Payout reversed to pending', 'warning');
  }

  function handleApproveAll() {
    setPayouts((prev) => prev.map((p) => p.status === 'Pending' ? { ...p, status: 'Approved' } : p));
    setShowApproveAllModal(false);
    addToast('✓ 2 bonus payouts approved successfully', 'success');
  }

  function handleRunConfirm() {
    setShowRunModal(false);
    addToast(`✓ Bonus calculation started for ${month}`, 'success');
  }

  // ── Filtered rows ─────────────────────────────────────────────────────────────
  const pendingCount = payouts.filter((p) => p.status === 'Pending').length;

  const codeToField: Record<string, keyof LocalPayout> = {
    RB: 'rb', GB: 'gb', SB: 'sb', LS: 'ls',
  };

  const filteredPayouts = activeFilter
    ? payouts.filter((p) => {
        const field = codeToField[activeFilter];
        return field ? p[field] !== null : true;
      })
    : payouts;

  return (
    <div className="space-y-6">

      {/* ── Toasts ─────────────────────────────────────────────────────────── */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold pointer-events-auto',
            'animate-in slide-in-from-right-4 duration-300',
            t.type === 'success' ? 'bg-green-600 text-white' :
            t.type === 'error'   ? 'bg-red-600 text-white'   : 'bg-amber-500 text-white'
          )}>
            {t.type === 'success' ? <Check size={14} /> : t.type === 'error' ? <XCircle size={14} /> : <RotateCcw size={14} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* ── Header row ─────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <div className="flex items-center gap-3 flex-wrap">
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Bonus Management</h1>

            {/* Month dropdown */}
            <div className="relative" ref={monthRef}>
              <button
                onClick={() => setMonthOpen((v) => !v)}
                className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full border border-gray-200 bg-white text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors"
              >
                <CalendarDays size={14} className="text-gray-400" />
                {month}
                <span className="text-gray-400 text-xs">▾</span>
              </button>
              {monthOpen && (
                <div className="absolute left-0 top-full mt-1.5 z-30 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[180px]">
                  {MONTHS.map((m) => (
                    <button
                      key={m}
                      onClick={() => { setMonth(m); setMonthOpen(false); }}
                      className={cn(
                        'w-full text-left px-4 py-2 text-sm transition-colors',
                        m === month ? 'text-green-700 font-semibold bg-green-50' : 'text-gray-700 hover:bg-gray-50'
                      )}
                    >
                      {m}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </div>
          <p className="text-sm text-gray-500 mt-0.5">Calculate and approve member bonuses.</p>
        </div>

        <button
          onClick={() => setShowRunModal(true)}
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#0a1f13] text-green-400 text-sm font-semibold hover:bg-[#0f2d1a] transition-colors"
        >
          <Zap size={15} />
          Run Bonus Calculation
        </button>
      </div>

      {/* ── Bonus type cards ───────────────────────────────────────────────── */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-5 gap-3 sm:gap-4">
        {bonusTypeCards.map((card) => {
          const isActive = activeFilter === card.code;
          return (
            <button
              key={card.code}
              onClick={() => setActiveFilter(isActive ? null : card.code)}
              className={cn(
                'rounded-2xl bg-gradient-to-br p-3 sm:p-5 flex flex-col gap-2 sm:gap-3 text-left transition-all',
                card.gradient,
                isActive ? 'ring-2 ring-white ring-offset-2 ring-offset-transparent scale-[1.02]' : 'hover:scale-[1.01]'
              )}
            >
              <div className="flex items-start justify-between">
                <p className="text-[10px] sm:text-[11px] font-semibold uppercase tracking-widest text-white/60 leading-none">
                  {card.code} · {card.name}
                </p>
                <div className="hidden sm:block"><DonutRing pct={card.pct} /></div>
              </div>
              <div>
                <p className="text-xl sm:text-3xl font-bold text-white leading-none">{card.amount}</p>
                <p className="text-[10px] sm:text-xs text-white/60 mt-1">{card.members.toLocaleString()} members</p>
              </div>
              <div className="h-1.5 rounded-full bg-white/20 overflow-hidden mt-auto">
                <div className="h-full rounded-full bg-white/70" style={{ width: `${card.pct}%` }} />
              </div>
            </button>
          );
        })}
      </div>

      {/* ── Payouts table ──────────────────────────────────────────────────── */}
      <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="flex items-center justify-between px-4 sm:px-6 py-4 border-b border-gray-100">
          <div className="flex items-center gap-2">
            <h2 className="text-base font-semibold text-gray-900">
              Bonus Payouts — <span className="text-gray-500 font-medium">{month}</span>
            </h2>
            {activeFilter && (
              <span className="inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                {activeFilter}
                <button onClick={() => setActiveFilter(null)} className="ml-0.5 hover:text-green-900">×</button>
              </span>
            )}
          </div>
          {pendingCount > 0 && (
            <button
              onClick={() => setShowApproveAllModal(true)}
              className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-xl bg-amber-500 text-white text-xs font-semibold hover:bg-amber-400 transition-colors"
            >
              Approve All Pending
            </button>
          )}
        </div>

        <div className="hidden md:block overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Member</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-green-600 uppercase tracking-wide">RB</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-green-600 uppercase tracking-wide">GB</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-amber-600 uppercase tracking-wide">SB</th>
                <th className="text-right px-4 py-3 text-[11px] font-semibold text-puRPle-600 uppercase tracking-wide">LS</th>
                <th className="text-right px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Total</th>
                <th className="text-left px-5 py-3 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Status</th>
                <th className="w-10 px-3 py-3" />
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {filteredPayouts.map((row) => (
                <tr
                  key={row.id}
                  className="hover:bg-gray-50/50 transition-colors cursor-pointer group"
                  onClick={() => setDetailRow(row)}
                >
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', row.avatarBg)}>
                        <span className="text-white text-[11px] font-bold">{row.initials}</span>
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm leading-tight">{row.member}</p>
                        <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[row.tier])}>
                          {row.tier}
                        </span>
                      </div>
                    </div>
                  </td>
                  <td className={cn('px-4 py-4 text-right tabular-nums', row.rb ? 'text-green-700 font-semibold' : 'text-gray-300')}>
                    {row.rb ?? '—'}
                  </td>
                  <td className={cn('px-4 py-4 text-right tabular-nums', row.gb ? 'text-green-700 font-semibold' : 'text-gray-300')}>
                    {row.gb ?? '—'}
                  </td>
                  <td className={cn('px-4 py-4 text-right tabular-nums', row.sb ? 'text-green-700 font-semibold' : 'text-gray-300')}>
                    {row.sb ?? '—'}
                  </td>
                  <td className={cn('px-4 py-4 text-right tabular-nums', row.ls ? 'text-green-700 font-semibold' : 'text-gray-300')}>
                    {row.ls ?? '—'}
                  </td>
                  <td className="px-5 py-4 text-right font-bold text-gray-900 tabular-nums">{row.total}</td>
                  <td className="px-5 py-4">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_BADGE[row.status])}>
                      {row.status}
                    </span>
                  </td>

                  {/* ⋯ menu */}
                  <td className="px-3 py-4 relative" onClick={(e) => e.stopPropagation()}>
                    <div className="relative" ref={openMenuId === row.id ? menuRef : undefined}>
                      <button
                        onClick={() => setOpenMenuId(openMenuId === row.id ? null : row.id)}
                        className="w-7 h-7 rounded-lg flex items-center justify-center text-gray-300 hover:text-gray-600 hover:bg-gray-100 opacity-0 group-hover:opacity-100 transition-all"
                      >
                        <MoreHorizontal size={15} />
                      </button>

                      {openMenuId === row.id && (
                        <div className="absolute right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 min-w-[160px]">
                          {(row.status === 'Pending') && (
                            <>
                              <button onClick={() => handleApproveRow(row.id)}
                                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-green-700 hover:bg-green-50">
                                <Check size={13} /> Approve
                              </button>
                              <button onClick={() => handleRejectRow(row.id)}
                                className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                                <XCircle size={13} /> Reject
                              </button>
                            </>
                          )}
                          {row.status === 'Approved' && (
                            <button onClick={() => handleReverseRow(row.id)}
                              className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-red-600 hover:bg-red-50">
                              <RotateCcw size={13} /> Reverse
                            </button>
                          )}
                          <button onClick={() => { setDetailRow(row); setOpenMenuId(null); }}
                            className="w-full text-left flex items-center gap-2 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50">
                            <Eye size={13} /> View Details
                          </button>
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        {/* Mobile cards */}
        <div className="md:hidden flex flex-col gap-3 p-4">
          {filteredPayouts.map((row) => (
            <div key={row.id} className="border border-gray-100 rounded-2xl p-4">
              {/* Member + Status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', row.avatarBg)}>
                    <span className="text-white text-[11px] font-bold">{row.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-semibold text-gray-900">{row.member}</p>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[row.tier])}>
                      {row.tier}
                    </span>
                  </div>
                </div>
                <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_BADGE[row.status])}>
                  {row.status}
                </span>
              </div>

              {/* Bonus breakdown + Total */}
              <div className="flex items-center justify-between bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <div className="flex gap-1.5 flex-wrap">
                  {(['rb','gb','sb','ls'] as const).map((key) => row[key] ? (
                    <span key={key} className="text-[10px] font-semibold text-gray-600 bg-white border border-gray-200 px-2 py-0.5 rounded-full">
                      {key.toUpperCase()}
                    </span>
                  ) : null)}
                </div>
                <p className="text-sm font-bold text-green-700 shrink-0">{row.total}</p>
              </div>

              {/* Actions */}
              <div className="flex gap-2">
                <button
                  onClick={() => setDetailRow(row)}
                  className="flex-1 border border-gray-200 text-gray-600 text-xs font-medium py-2 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Details ⋯
                </button>
                {row.status === 'Pending' && (
                  <button
                    onClick={() => handleApproveRow(row.id)}
                    className="flex-1 bg-green-600 text-[#0b1410] text-xs font-semibold py-2 rounded-lg hover:bg-green-500 transition-colors"
                  >
                    Approve
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>

        <div className="px-4 sm:px-6 py-3.5 border-t border-gray-100 flex flex-col sm:flex-row items-center sm:justify-between gap-2">
          <p className="text-sm text-gray-400">Showing {filteredPayouts.length} of {payouts.length} members</p>
          <button className="text-sm font-semibold text-green-600 hover:text-green-700 transition-colors">
            View Full Report →
          </button>
        </div>
      </div>

      {/* ── Run Calculation Modal ──────────────────────────────────────────── */}
      {showRunModal && (
        <Modal onClose={() => setShowRunModal(false)}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Run Bonus Calculation</h3>
            <button onClick={() => setShowRunModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            This will calculate bonuses for all eligible members for <strong>{month}</strong>. This action cannot be undone.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowRunModal(false)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleRunConfirm}
              className="px-5 py-2 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors">
              Confirm &amp; Run
            </button>
          </div>
        </Modal>
      )}

      {/* ── Approve All Modal ──────────────────────────────────────────────── */}
      {showApproveAllModal && (
        <Modal onClose={() => setShowApproveAllModal(false)}>
          <div className="flex items-start justify-between mb-4">
            <h3 className="text-lg font-bold text-gray-900">Approve All Pending Bonuses</h3>
            <button onClick={() => setShowApproveAllModal(false)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>
          <p className="text-sm text-gray-500 mb-6">
            You are about to approve <strong>2 pending</strong> bonus payouts totalling <strong>₹3.7M</strong>.
          </p>
          <div className="flex gap-3 justify-end">
            <button onClick={() => setShowApproveAllModal(false)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Cancel
            </button>
            <button onClick={handleApproveAll}
              className="px-5 py-2 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors">
              Approve All
            </button>
          </div>
        </Modal>
      )}

      {/* ── Detail Modal ────────────────────────────────────────────────────── */}
      {detailRow && (
        <Modal onClose={() => setDetailRow(null)}>
          <div className="flex items-start justify-between mb-5">
            <div className="flex items-center gap-3">
              <div className={cn('w-11 h-11 rounded-full flex items-center justify-center shrink-0', detailRow.avatarBg)}>
                <span className="text-white text-sm font-bold">{detailRow.initials}</span>
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base leading-tight">{detailRow.member}</p>
                <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[detailRow.tier])}>
                  {detailRow.tier}
                </span>
              </div>
            </div>
            <button onClick={() => setDetailRow(null)} className="text-gray-400 hover:text-gray-600">
              <X size={18} />
            </button>
          </div>

          <h4 className="text-xs font-semibold text-gray-400 uppercase tracking-wide mb-3">Bonus Breakdown</h4>
          <div className="rounded-xl border border-gray-100 overflow-hidden mb-5">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-gray-50/80 border-b border-gray-100">
                  <th className="text-left px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Type</th>
                  <th className="text-right px-4 py-2.5 text-[11px] font-semibold text-gray-400 uppercase tracking-wide">Amount</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-gray-100">
                {(['rb','gb','sb','ls'] as const).map((key) => {
                  const code  = key.toUpperCase();
                  const label = BONUS_CODE_LABEL[code] ?? code;
                  const val   = detailRow[key];
                  if (!val) return null;
                  return (
                    <tr key={key}>
                      <td className="px-4 py-2.5 text-gray-700 font-medium">{code} – {label}</td>
                      <td className="px-4 py-2.5 text-right font-semibold text-green-700 tabular-nums">{val}</td>
                    </tr>
                  );
                })}
                <tr className="bg-gray-50/60 border-t border-gray-200">
                  <td className="px-4 py-3 font-bold text-gray-900">Total</td>
                  <td className="px-4 py-3 text-right font-bold text-gray-900 tabular-nums">{detailRow.total}</td>
                </tr>
              </tbody>
            </table>
          </div>

          <div className="flex justify-end">
            <button onClick={() => setDetailRow(null)}
              className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
              Close
            </button>
          </div>
        </Modal>
      )}
    </div>
  );
}
