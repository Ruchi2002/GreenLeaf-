'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef, useEffect, useCallback } from 'react';
import { Check, X, XCircle } from 'lucide-react';
import {
  withdrawalsList, REJECT_REASONS,
  type Withdrawal, type WithdrawalStatus,
} from '../../../../data/mock/adminWithdrawals';
import { cn } from '@/lib/utils';

// ── Static maps ────────────────────────────────────────────────────────────────
const TIER_BADGE: Record<string, string> = {
  Diamond:  'bg-cyan-100 text-cyan-700',
  Platinum: 'bg-puRPle-100 text-puRPle-700',
  Gold:     'bg-yellow-100 text-yellow-700',
  Silver:   'bg-gray-100 text-gray-500',
};

const BORDER_LEFT: Record<WithdrawalStatus, string> = {
  Pending:  'border-l-amber-400',
  Approved: 'border-l-green-500',
  Rejected: 'border-l-red-400',
};

const STATUS_BADGE: Record<WithdrawalStatus, string> = {
  Pending:  'bg-amber-100 text-amber-700',
  Approved: 'bg-green-100 text-green-700',
  Rejected: 'bg-red-100 text-red-600',
};

type TabFilter = 'All' | WithdrawalStatus;

// ── Types ──────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; message: string; type: 'success' | 'error'; }
interface Counts    { pending: number; approved: number; rejected: number; }

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WithdrawalsPage() {
  const [items,        setItems]        = useState<Withdrawal[]>(withdrawalsList);
  const [counts,       setCounts]       = useState<Counts>({ pending: 23, approved: 8, rejected: 3 });
  const [activeTab,    setActiveTab]    = useState<TabFilter>('All');
  const [approveModal, setApproveModal] = useState<Withdrawal | null>(null);
  const [rejectModal,  setRejectModal]  = useState<Withdrawal | null>(null);
  const [rejectReason, setRejectReason] = useState('');
  const [rejectNote,   setRejectNote]   = useState('');
  const [drawerItem,   setDrawerItem]   = useState<Withdrawal | null>(null);
  const [drawerVisible,setDrawerVisible]= useState(false);
  const [currentPage,  setCurrentPage]  = useState(1);
  const [toasts,       setToasts]       = useState<ToastItem[]>([]);

  // ── Toast helper ──────────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastItem['type']) => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  // ── Drawer helpers ─────────────────────────────────────────────────────────
  function openDrawer(item: Withdrawal) {
    setDrawerItem(item);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerVisible(true)));
  }
  function closeDrawer() {
    setDrawerVisible(false);
    setTimeout(() => setDrawerItem(null), 300);
  }

  // ── Approve flow ──────────────────────────────────────────────────────────────
  function confirmApprove() {
    if (!approveModal) return;
    setItems((p) => p.map((i) => i.id === approveModal.id ? { ...i, status: 'Approved' } : i));
    setCounts((p) => ({ ...p, pending: p.pending - 1, approved: p.approved + 1 }));
    addToast(`✓ Withdrawal approved for ${approveModal.member}`, 'success');
    if (drawerItem?.id === approveModal.id) {
      setDrawerItem((p) => p ? { ...p, status: 'Approved' } : null);
    }
    setApproveModal(null);
    closeDrawer();
  }

  // ── Reject flow ───────────────────────────────────────────────────────────────
  function confirmReject() {
    if (!rejectModal) return;
    setItems((p) => p.map((i) => i.id === rejectModal.id ? { ...i, status: 'Rejected' } : i));
    setCounts((p) => ({ ...p, pending: p.pending - 1, rejected: p.rejected + 1 }));
    addToast('✗ Withdrawal rejected', 'error');
    setRejectModal(null);
    setRejectReason('');
    setRejectNote('');
    closeDrawer();
  }

  // ── Filtered + paginated list ─────────────────────────────────────────────────
  const PAGE_SIZE = 7;
  const filtered  = activeTab === 'All' ? items : items.filter((i) => i.status === activeTab);
  const totalPages = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated  = filtered.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE);

  const tabCounts: Record<TabFilter, number> = {
    All:      counts.pending + counts.approved + counts.rejected,
    Pending:  counts.pending,
    Approved: counts.approved,
    Rejected: counts.rejected,
  };

  const TAB_STYLE_ACTIVE: Record<TabFilter, string> = {
    All:      'bg-green-600 text-[#0b1410]',
    Pending:  'bg-amber-500 text-white',
    Approved: 'bg-green-600 text-[#0b1410]',
    Rejected: 'bg-red-600 text-white',
  };

  const TAB_STYLE_INACTIVE: Record<TabFilter, string> = {
    All:      'border-gray-200 text-gray-600',
    Pending:  'border-amber-300 text-amber-700',
    Approved: 'border-green-300 text-green-700',
    Rejected: 'border-red-300 text-red-600',
  };

  function handleCardApprove(item: Withdrawal, e: React.MouseEvent) {
    e.stopPropagation();
    setApproveModal(item);
  }

  function handleCardReject(item: Withdrawal, e: React.MouseEvent) {
    e.stopPropagation();
    setRejectModal(item);
    setRejectReason('');
    setRejectNote('');
  }

  return (
    <div className="space-y-6">
      {/* Toasts */}
      <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 pointer-events-none">
        {toasts.map((t) => (
          <div key={t.id} className={cn(
            'flex items-center gap-2 px-4 py-3 rounded-xl shadow-lg text-sm font-semibold pointer-events-auto',
            t.type === 'success' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
          )}>
            {t.type === 'success' ? <Check size={14} /> : <XCircle size={14} />}
            {t.message}
          </div>
        ))}
      </div>

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Withdrawal Queue</h1>
          <p className="text-sm text-gray-500 mt-0.5">Review and process member withdrawal requests.</p>
        </div>
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 border border-gray-200 bg-white text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
          ↓ Export
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-amber-500 leading-none mb-1">{counts.pending}</p>
          <p className="text-sm text-gray-400">Pending</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-green-600 leading-none mb-1">{counts.approved}</p>
          <p className="text-sm text-gray-400">Approved Today</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-red-500 leading-none mb-1">{counts.rejected}</p>
          <p className="text-sm text-gray-400">Rejected</p>
        </div>
        <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
          <p className="text-2xl sm:text-3xl font-bold text-gray-900 leading-none mb-1">₹184M</p>
          <p className="text-sm text-gray-400">Total Month</p>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
        {(['All', 'Pending', 'Approved', 'Rejected'] as TabFilter[]).map((tab) => (
          <button
            key={tab}
            onClick={() => { setActiveTab(tab); setCurrentPage(1); }}
            className={cn(
              'inline-flex items-center gap-2 px-4 py-1.5 rounded-full text-sm font-semibold border transition-colors whitespace-nowrap shrink-0',
              activeTab === tab ? TAB_STYLE_ACTIVE[tab] : cn('bg-white', TAB_STYLE_INACTIVE[tab], 'hover:bg-gray-50')
            )}
          >
            {tab}
            <span className={cn(
              'text-[11px] font-semibold px-1.5 py-0.5 rounded-full',
              activeTab === tab ? 'bg-black/10' : 'bg-gray-100 text-gray-500'
            )}>
              {tabCounts[tab]}
            </span>
          </button>
        ))}
      </div>

      {/* Withdrawal cards */}
      <div className="space-y-3">
        {filtered.length === 0 && (
          <div className="bg-white rounded-2xl p-16 text-center text-gray-400 text-sm">No withdrawals.</div>
        )}

        {paginated.map((item) => (
          <div
            key={item.id}
            onClick={() => openDrawer(item)}
            className={cn(
              'bg-white rounded-2xl border border-gray-100 border-l-4 cursor-pointer hover:shadow-md transition-shadow',
              BORDER_LEFT[item.status]
            )}
          >
            {/* Desktop row layout */}
            <div className="hidden md:flex items-center gap-4 px-5 py-4">
              {/* LEFT — Member info */}
              <div className="flex items-center gap-3 min-w-0 w-56 shrink-0">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', item.avatarBg)}>
                  <span className="text-white text-xs font-bold">{item.initials}</span>
                </div>
                <div className="min-w-0">
                  <p className="text-sm font-bold text-gray-900 leading-tight truncate">{item.member}</p>
                  <div className="flex items-center gap-1.5 mt-0.5 flex-wrap">
                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', TIER_BADGE[item.tier])}>
                      {item.tier}
                    </span>
                    <span className="text-[11px] font-mono text-gray-400">{item.ref}</span>
                  </div>
                </div>
              </div>

              {/* CENTER — Amount */}
              <div className="flex-1 text-center">
                <p className={cn('text-base font-semibold tabular-nums', item.status === 'Rejected' ? 'text-gray-300 line-through' : 'text-gray-900')}>
                  {item.amount}
                </p>
              </div>

              {/* RIGHT — Bank + date + actions */}
              <div className="flex items-center gap-5 shrink-0">
                <div className="flex items-center gap-2">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0', item.bankBg)}>
                    {item.bankCode}
                  </div>
                  <div>
                    <p className="text-xs font-semibold text-gray-700">{item.bank} Bank</p>
                    <p className="text-[11px] text-gray-400 font-mono">{item.accountMask}</p>
                  </div>
                </div>
                <div>
                  <p className="text-[11px] text-gray-400 leading-tight">Requested</p>
                  <p className="text-xs font-medium text-gray-700">{item.requestedAt}</p>
                </div>
                <div className="flex items-center gap-2" onClick={(e) => e.stopPropagation()}>
                  {item.status === 'Pending' && (
                    <>
                      <button onClick={(e) => handleCardApprove(item, e)}
                        className="flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-[#0b1410] text-xs font-semibold hover:bg-green-500 transition-colors">
                        <Check size={12} /> Approve
                      </button>
                      <button onClick={(e) => handleCardReject(item, e)}
                        className="px-3 py-1.5 rounded-lg border border-red-400 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                        Reject
                      </button>
                    </>
                  )}
                  {item.status !== 'Pending' && (
                    <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-lg', STATUS_BADGE[item.status])}>
                      {item.status}
                    </span>
                  )}
                </div>
              </div>
            </div>

            {/* Mobile stacked layout */}
            <div className="md:hidden p-4">
              {/* Top: member + amount + status */}
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center gap-3">
                  <div className={cn('w-10 h-10 rounded-full flex items-center justify-center shrink-0', item.avatarBg)}>
                    <span className="text-white text-xs font-bold">{item.initials}</span>
                  </div>
                  <div>
                    <p className="text-sm font-bold text-gray-900 leading-tight">{item.member}</p>
                    <span className={cn('text-[10px] font-semibold px-1.5 py-0.5 rounded-full', TIER_BADGE[item.tier])}>
                      {item.tier}
                    </span>
                  </div>
                </div>
                <div className="text-right">
                  <p className={cn('text-sm font-bold tabular-nums', item.status === 'Rejected' ? 'text-gray-300 line-through' : 'text-gray-900')}>
                    {item.amount}
                  </p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[item.status])}>
                    {item.status}
                  </span>
                </div>
              </div>

              {/* Middle: bank info */}
              <div className="flex items-center gap-3 bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
                <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-white text-[11px] font-bold shrink-0', item.bankBg)}>
                  {item.bankCode}
                </div>
                <div className="flex-1 min-w-0">
                  <p className="text-xs font-semibold text-gray-700">{item.bank} Bank</p>
                  <p className="text-[11px] text-gray-400 font-mono">{item.accountMask}</p>
                </div>
                <p className="text-xs text-gray-400 shrink-0">{item.requestedAt}</p>
              </div>

              {/* Bottom: actions */}
              {item.status === 'Pending' && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button onClick={(e) => handleCardApprove(item, e)}
                    className="flex-1 flex items-center justify-center gap-1 py-2 rounded-lg bg-green-600 text-[#0b1410] text-xs font-semibold hover:bg-green-500 transition-colors">
                    <Check size={12} /> Approve
                  </button>
                  <button onClick={(e) => handleCardReject(item, e)}
                    className="flex-1 py-2 rounded-lg border border-red-400 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors">
                    Reject
                  </button>
                </div>
              )}
              {item.status !== 'Pending' && (
                <p className="text-xs text-gray-400 text-center">Tap to view details</p>
              )}
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 1 && (
        <div className="flex items-center justify-center gap-1">
          {/* Mobile: prev · page/total · next */}
          <div className="flex sm:hidden items-center gap-2 w-full justify-between px-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ← Prev
            </button>
            <span className="text-sm font-semibold text-gray-500">{currentPage}/{totalPages}</span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="px-4 py-2 rounded-xl text-sm font-semibold bg-white border border-gray-200 text-gray-600 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              Next →
            </button>
          </div>

          {/* Desktop: page number buttons */}
          <div className="hidden sm:flex items-center gap-1">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage === 1}
              className="w-9 h-9 rounded-xl text-sm font-semibold transition-colors text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ‹
            </button>
            {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
              <button
                key={p}
                onClick={() => setCurrentPage(p)}
                className={cn(
                  'w-9 h-9 rounded-xl text-sm font-semibold transition-colors',
                  currentPage === p ? 'bg-gray-900 text-white' : 'text-gray-500 bg-white border border-gray-200 hover:bg-gray-50'
                )}
              >
                {p}
              </button>
            ))}
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage === totalPages}
              className="w-9 h-9 rounded-xl text-sm font-semibold transition-colors text-gray-500 bg-white border border-gray-200 hover:bg-gray-50 disabled:opacity-30 disabled:cursor-not-allowed"
            >
              ›
            </button>
          </div>
        </div>
      )}

      {/* ── Approve Modal ─────────────────────────────────────────────────── */}
      {approveModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setApproveModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Approve Withdrawal</h3>
              <button onClick={() => setApproveModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <p className="text-sm text-gray-500 mb-6">
              Approve <strong>{approveModal.amount}</strong> withdrawal for <strong>{approveModal.member}</strong>?
              {' '}Funds will be transferred to <strong>{approveModal.bank} Bank</strong> {approveModal.accountMask}.
            </p>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setApproveModal(null)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmApprove}
                className="px-5 py-2 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors">
                Approve
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Reject Modal ──────────────────────────────────────────────────── */}
      {rejectModal && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setRejectModal(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <div className="flex items-start justify-between mb-4">
              <h3 className="text-lg font-bold text-gray-900">Reject Withdrawal</h3>
              <button onClick={() => setRejectModal(null)} className="text-gray-400 hover:text-gray-600"><X size={18} /></button>
            </div>
            <div className="space-y-3 mb-5">
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Reason</label>
                <select
                  value={rejectReason}
                  onChange={(e) => setRejectReason(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400/60 transition-shadow cursor-pointer"
                >
                  <option value="" disabled>Select a reason</option>
                  {REJECT_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div>
                <textarea
                  value={rejectNote}
                  onChange={(e) => setRejectNote(e.target.value)}
                  rows={3}
                  placeholder="Add note..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-red-400/30 focus:border-red-400/60 transition-shadow"
                />
              </div>
            </div>
            <div className="flex gap-3 justify-end">
              <button onClick={() => setRejectModal(null)}
                className="px-5 py-2 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Cancel
              </button>
              <button onClick={confirmReject}
                className="px-5 py-2 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors">
                Reject Withdrawal
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Slide-over Drawer ─────────────────────────────────────────────── */}
      {drawerItem && (
        <div className="fixed inset-0 z-50">
          <div
            className={cn('absolute inset-0 bg-black/30 transition-opacity duration-300', drawerVisible ? 'opacity-100' : 'opacity-0')}
            onClick={closeDrawer}
          />
          <div className={cn(
            'absolute bg-white shadow-2xl transition-transform duration-300 flex flex-col',
            'inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh] overflow-y-auto',
            'sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:rounded-none sm:max-h-full',
            drawerVisible ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'
          )}>
            {/* Header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Withdrawal Details</h3>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 transition-colors"><X size={18} /></button>
            </div>

            {/* Body */}
            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5">
              {/* Member */}
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', drawerItem.avatarBg)}>
                  <span className="text-white text-sm font-bold">{drawerItem.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{drawerItem.member}</p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[drawerItem.tier])}>
                    {drawerItem.tier}
                  </span>
                </div>
              </div>

              {/* Amount */}
              <div className="bg-gray-50 rounded-xl p-4 text-center">
                <p className="text-xs text-gray-400 mb-1">Withdrawal Amount</p>
                <p className={cn('text-3xl font-bold tabular-nums', drawerItem.status === 'Rejected' ? 'text-gray-300 line-through' : 'text-gray-900')}>
                  {drawerItem.amount}
                </p>
              </div>

              {/* Details rows */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {[
                  { label: 'Reference',  value: drawerItem.ref                            },
                  { label: 'Bank',       value: `${drawerItem.bank} Bank`                 },
                  { label: 'Account',    value: drawerItem.accountMask                    },
                  { label: 'Requested',  value: drawerItem.requestedAt                    },
                  { label: 'Status',     value: drawerItem.status, isStatus: true         },
                ].map((row, i, arr) => (
                  <div key={row.label} className={cn('flex items-center justify-between px-4 py-3 text-sm', i < arr.length - 1 && 'border-b border-gray-100')}>
                    <span className="text-gray-400">{row.label}</span>
                    {row.isStatus ? (
                      <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_BADGE[drawerItem.status])}>
                        {drawerItem.status}
                      </span>
                    ) : (
                      <span className="font-semibold text-gray-900">{row.value}</span>
                    )}
                  </div>
                ))}
              </div>

              {/* Pending actions inside drawer */}
              {drawerItem.status === 'Pending' && (
                <div className="flex gap-2">
                  <button
                    onClick={(e) => { handleCardApprove(drawerItem, e); }}
                    className="flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
                  >
                    <Check size={14} /> Approve
                  </button>
                  <button
                    onClick={(e) => { handleCardReject(drawerItem, e); }}
                    className="flex-1 py-2.5 rounded-xl border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                  >
                    Reject
                  </button>
                </div>
              )}
            </div>

            {/* Footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button onClick={closeDrawer}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
