'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { X, Download, CheckCircle2, XCircle, Clock, IndianRupee, Image as ImageIcon } from 'lucide-react';
import { rechargeRequests, type RechargeRequest, type RechargeStatus } from '@/data/mock/adminRecharge';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

const TIER_AVATAR: Record<string, string> = {
  Diamond: 'bg-cyan-500',
  Platinum: 'bg-puRPle-500',
  Gold:    'bg-yellow-500',
  Silver:  'bg-gray-400',
  Bronze:  'bg-orange-500',
};

const TIER_BADGE: Record<string, string> = {
  Diamond: 'bg-cyan-100 text-cyan-700',
  Platinum: 'bg-puRPle-100 text-puRPle-700',
  Gold:    'bg-yellow-100 text-yellow-700',
  Silver:  'bg-gray-100 text-gray-600',
  Bronze:  'bg-orange-100 text-orange-700',
};

const STATUS_BADGE: Record<RechargeStatus, string> = {
  pending:  'bg-amber-100 text-amber-700',
  approved: 'bg-green-100 text-green-700',
  rejected: 'bg-red-100 text-red-700',
};

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

function fmt(n: number) {
  return '₹' + n.toLocaleString('en-IN');
}

type FilterStatus = 'All' | RechargeStatus;

export default function RechargePage() {
  const [requests,      setRequests]      = useState<RechargeRequest[]>(rechargeRequests);
  const [filter,        setFilter]        = useState<FilterStatus>('All');
  const [search,        setSearch]        = useState('');
  const [page,          setPage]          = useState(1);

  // Drawer
  const [drawer,        setDrawer]        = useState<RechargeRequest | null>(null);
  const [drawerOpen,    setDrawerOpen]    = useState(false);

  // Approve modal
  const [approveTarget, setApproveTarget] = useState<RechargeRequest | null>(null);

  // Reject modal
  const [rejectTarget,  setRejectTarget]  = useState<RechargeRequest | null>(null);
  const [rejectReason,  setRejectReason]  = useState('');
  const [rejectErr,     setRejectErr]     = useState(false);

  // Toast
  const [toast,         setToast]         = useState<{ msg: string; type: 'green' | 'red' } | null>(null);

  function openDrawer(r: RechargeRequest) {
    setDrawer(r);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setDrawer(null), 300);
  }

  function showToast(msg: string, type: 'green' | 'red') {
    setToast({ msg, type });
    setTimeout(() => setToast(null), 3000);
  }

  // Stats (computed live)
  const pendingCount   = requests.filter((r) => r.status === 'pending').length;
  const approvedToday  = requests.filter((r) => r.status === 'approved' && r.submittedAt.startsWith('Oct 15')).length;
  const rejectedToday  = requests.filter((r) => r.status === 'rejected' && r.submittedAt.startsWith('Oct 15')).length;
  const pendingAmount  = requests.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0);

  // Filter
  const filtered = requests.filter((r) => {
    const matchStatus = filter === 'All' || r.status === filter;
    const q = search.toLowerCase();
    const matchSearch = !q ||
      r.memberName.toLowerCase().includes(q) ||
      r.memberId.toLowerCase().includes(q) ||
      r.transactionId.toLowerCase().includes(q);
    return matchStatus && matchSearch;
  });

  const totalPages   = Math.ceil(filtered.length / PAGE_SIZE);
  const paginated    = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);

  function doApprove(r: RechargeRequest) {
    setRequests((prev) => prev.map((x) => x.id === r.id ? { ...x, status: 'approved' } : x));
    setApproveTarget(null);
    closeDrawer();
    showToast(`✓ Recharge approved for ${r.memberName}`, 'green');
  }

  function doReject(r: RechargeRequest) {
    if (!rejectReason.trim()) { setRejectErr(true); return; }
    setRequests((prev) => prev.map((x) =>
      x.id === r.id ? { ...x, status: 'rejected', rejectionReason: rejectReason.trim() } : x
    ));
    setRejectTarget(null);
    setRejectReason('');
    setRejectErr(false);
    closeDrawer();
    showToast('✗ Recharge rejected', 'red');
  }

  const FILTER_TABS: FilterStatus[] = ['All', 'pending', 'approved', 'rejected'];

  return (
    <div className="space-y-6">

      {/* Header */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#0d2a18] px-4 sm:px-6 py-4 sm:py-5 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-white leading-tight">Recharge Verification</h1>
          <p className="text-sm text-white/50 mt-0.5">Review and approve member recharge requests</p>
        </div>
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl border border-white/30 text-white text-sm font-semibold hover:bg-white/10 transition-colors">
          <Download size={15} />
          Export
        </button>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {[
          { label: 'Pending',              value: pendingCount,        color: 'text-amber-600',  bg: 'bg-amber-50',  Icon: Clock },
          { label: 'Approved Today',       value: approvedToday,       color: 'text-green-600',  bg: 'bg-green-50',  Icon: CheckCircle2 },
          { label: 'Rejected Today',       value: rejectedToday,       color: 'text-red-600',    bg: 'bg-red-50',    Icon: XCircle },
          { label: 'Total Amount Pending', value: fmt(pendingAmount),  color: 'text-blue-600',   bg: 'bg-blue-50',   Icon: IndianRupee },
        ].map(({ label, value, color, bg, Icon }) => (
          <div key={label} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5 flex items-center gap-3">
            <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', bg)}>
              <Icon size={18} className={color} />
            </div>
            <div>
              <p className="text-xs text-gray-500 font-medium">{label}</p>
              <p className={cn('text-xl font-bold', color)}>{value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Filter bar */}
      <div className="flex flex-col sm:flex-row sm:items-center gap-3">
        {/* Search */}
        <div className="relative w-full sm:w-72">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            value={search}
            onChange={(e) => { setSearch(e.target.value); setPage(1); }}
            placeholder="Search by name, ID, transaction..."
            className="w-full pl-9 pr-4 h-9 rounded-full border border-gray-200 bg-white text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
          />
        </div>

        {/* Status pills */}
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1 flex-1">
          {FILTER_TABS.map((f) => (
            <button
              key={f}
              onClick={() => { setFilter(f); setPage(1); }}
              className={cn(
                'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-sm font-semibold transition-colors capitalize',
                filter === f
                  ? 'bg-green-600 text-[#0b1410]'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {f === 'All' ? 'All' : f.charAt(0).toUpperCase() + f.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['MEMBER', 'AMOUNT', 'TRANSACTION ID', 'BANK', 'SUBMITTED', 'STATUS', 'ACTIONS'].map((col) => (
                  <th key={col} className="text-left text-[11px] font-semibold text-gray-400 tracking-wider px-5 py-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">No requests found.</td>
                </tr>
              )}
              {paginated.map((r) => (
                <tr
                  key={r.id}
                  onClick={() => openDrawer(r)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  {/* Member */}
                  <td className="px-5 py-4">
                    <div className="flex items-center gap-3">
                      <div className={cn('w-9 h-9 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', TIER_AVATAR[r.tier] ?? 'bg-gray-400')}>
                        {initials(r.memberName)}
                      </div>
                      <div>
                        <p className="font-semibold text-gray-900 text-sm">{r.memberName}</p>
                        <p className="text-xs text-gray-400 font-mono">{r.memberId}</p>
                        <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full mt-0.5 inline-block', TIER_BADGE[r.tier] ?? 'bg-gray-100 text-gray-600')}>
                          {r.tier}
                        </span>
                      </div>
                    </div>
                  </td>

                  {/* Amount */}
                  <td className="px-5 py-4">
                    <span className="font-bold text-green-700 text-sm">{fmt(r.amount)}</span>
                  </td>

                  {/* Transaction ID */}
                  <td className="px-5 py-4">
                    <p className="font-mono text-sm text-gray-800">{r.transactionId}</p>
                    <p className="text-xs text-gray-400 mt-0.5">{r.bank}</p>
                  </td>

                  {/* Bank */}
                  <td className="px-5 py-4">
                    <span className="text-sm text-gray-700">{r.bank}</span>
                  </td>

                  {/* Submitted */}
                  <td className="px-5 py-4">
                    <p className="text-sm font-medium text-gray-800">{r.submittedAt.split(' ').slice(0, 3).join(' ')}</p>
                    <p className="text-xs text-gray-400">{r.submittedAt.split(' ').slice(3).join(' ')}</p>
                  </td>

                  {/* Status */}
                  <td className="px-5 py-4">
                    <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', STATUS_BADGE[r.status])}>
                      {r.status}
                    </span>
                  </td>

                  {/* Actions */}
                  <td className="px-5 py-4" onClick={(e) => e.stopPropagation()}>
                    {r.status === 'pending' ? (
                      <div className="flex items-center gap-2">
                        <button
                          onClick={() => setApproveTarget(r)}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-green-600 text-[#0b1410] text-xs font-semibold hover:bg-green-500 transition-colors"
                        >
                          <CheckCircle2 size={13} /> Approve
                        </button>
                        <button
                          onClick={() => { setRejectTarget(r); setRejectReason(''); setRejectErr(false); }}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg border border-red-400 text-red-600 text-xs font-semibold hover:bg-red-50 transition-colors"
                        >
                          <XCircle size={13} /> Reject
                        </button>
                      </div>
                    ) : (
                      <span className={cn('text-xs font-semibold italic', r.status === 'approved' ? 'text-green-600' : 'text-red-500')}>
                        {r.status === 'approved' ? '✓ Approved' : '✗ Rejected'}
                      </span>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden flex flex-col gap-3">
        {paginated.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">No requests found.</div>
        )}
        {paginated.map((r) => (
          <div
            key={r.id}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer"
            onClick={() => openDrawer(r)}
          >
            {/* Top: member + status */}
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-3">
                <div className={cn('w-10 h-10 rounded-full flex items-center justify-center text-white text-xs font-bold shrink-0', TIER_AVATAR[r.tier] ?? 'bg-gray-400')}>
                  {initials(r.memberName)}
                </div>
                <div>
                  <p className="font-semibold text-sm text-gray-900">{r.memberName}</p>
                  <p className="text-gray-400 text-xs font-mono">{r.memberId}</p>
                </div>
              </div>
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full capitalize', STATUS_BADGE[r.status])}>
                {r.status}
              </span>
            </div>

            {/* Middle: amount + bank + txn */}
            <div className="bg-gray-50 rounded-xl px-3 py-2.5 mb-3">
              <div className="flex justify-between mb-1.5">
                <div>
                  <p className="text-xs text-gray-500">Amount</p>
                  <p className="font-bold text-green-700 text-base">{fmt(r.amount)}</p>
                </div>
                <div className="text-right">
                  <p className="text-xs text-gray-500">Bank</p>
                  <p className="text-sm font-medium text-gray-700">{r.bank}</p>
                </div>
              </div>
              <div>
                <p className="text-xs text-gray-500">Transaction ID</p>
                <p className="text-xs font-mono text-gray-700">{r.transactionId}</p>
              </div>
            </div>

            {/* Bottom: tier + date + actions */}
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', TIER_BADGE[r.tier] ?? 'bg-gray-100 text-gray-600')}>
                  {r.tier}
                </span>
                <span className="text-xs text-gray-400">{r.submittedAt}</span>
              </div>
              {r.status === 'pending' && (
                <div className="flex gap-2" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setApproveTarget(r)}
                    className="bg-green-600 text-[#0b1410] text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-green-500 transition-colors"
                  >
                    ✓
                  </button>
                  <button
                    onClick={() => { setRejectTarget(r); setRejectReason(''); setRejectErr(false); }}
                    className="border border-red-300 text-red-500 text-xs px-3 py-1.5 rounded-lg font-semibold hover:bg-red-50 transition-colors"
                  >
                    ✗
                  </button>
                </div>
              )}
            </div>

            {r.status === 'rejected' && r.rejectionReason && (
              <div className="mt-2 bg-red-50 border border-red-100 rounded-lg px-3 py-2">
                <p className="text-xs text-red-600">Reason: {r.rejectionReason}</p>
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Pagination */}
      {totalPages > 0 && (
        <div className="flex items-center justify-center sm:justify-between gap-2">
          <p className="hidden sm:block text-xs text-gray-400">
            Showing {filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filtered.length)} of {filtered.length} requests
          </p>
          <div className="flex items-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="sm:hidden text-sm text-gray-500 px-2">{page}/{totalPages}</span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 rounded-lg border border-gray-200 text-xs font-semibold text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* ── APPROVE MODAL ── */}
      {approveTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setApproveTarget(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-4">Approve Recharge?</h3>
            <div className="space-y-2.5 text-sm mb-6">
              <div className="flex justify-between">
                <span className="text-gray-500">Member</span>
                <span className="font-semibold text-gray-900">{approveTarget.memberName} ({approveTarget.memberId})</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Amount</span>
                <span className="font-bold text-green-700">{fmt(approveTarget.amount)}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Transaction ID</span>
                <span className="font-mono text-gray-800">{approveTarget.transactionId}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-500">Bank</span>
                <span className="text-gray-800">{approveTarget.bank}</span>
              </div>
            </div>
            <div className="flex gap-3">
              <button
                onClick={() => doApprove(approveTarget)}
                className="flex-1 py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
              >
                Confirm Approve
              </button>
              <button
                onClick={() => setApproveTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── REJECT MODAL ── */}
      {rejectTarget && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={() => setRejectTarget(null)}>
          <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-md p-6" onClick={(e) => e.stopPropagation()}>
            <h3 className="text-base font-bold text-gray-900 mb-1">Reject Recharge</h3>
            <p className="text-sm text-gray-500 mb-4">
              {rejectTarget.memberName} · {fmt(rejectTarget.amount)}
            </p>
            <label className="block text-xs font-semibold text-gray-600 mb-1.5">Rejection Reason <span className="text-red-500">*</span></label>
            <textarea
              value={rejectReason}
              onChange={(e) => { setRejectReason(e.target.value); setRejectErr(false); }}
              placeholder="Enter rejection reason..."
              rows={3}
              className={cn(
                'w-full px-3.5 py-2.5 rounded-xl border text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 transition-shadow resize-none',
                rejectErr
                  ? 'border-red-400 focus:ring-red-400/30'
                  : 'border-gray-200 focus:ring-green-500/30 focus:border-green-500/40'
              )}
            />
            {rejectErr && <p className="text-xs text-red-500 mt-1">Rejection reason is required</p>}
            <div className="flex gap-3 mt-5">
              <button
                onClick={() => doReject(rejectTarget)}
                className="flex-1 py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors"
              >
                Confirm Reject
              </button>
              <button
                onClick={() => setRejectTarget(null)}
                className="flex-1 py-2.5 rounded-xl border border-gray-200 text-gray-600 text-sm font-semibold hover:bg-gray-50 transition-colors"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── DETAIL DRAWER ── */}
      {drawer && (
        <div className="fixed inset-0 z-40">
          <div
            className={cn('absolute inset-0 bg-black/30 transition-opacity duration-300', drawerOpen ? 'opacity-100' : 'opacity-0')}
            onClick={closeDrawer}
          />
          <div className={cn(
            'absolute bg-white shadow-2xl flex flex-col transition-transform duration-300',
            'inset-x-0 bottom-0 rounded-t-3xl max-h-[90vh] overflow-y-auto',
            'sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[420px] sm:rounded-none sm:max-h-full',
            drawerOpen ? 'translate-y-0 sm:translate-x-0' : 'translate-y-full sm:translate-x-full'
          )}>

            {/* Drawer header */}
            <div className="flex items-start justify-between gap-3 px-6 py-5 border-b border-gray-100">
              <div>
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="text-base font-bold text-gray-900">{drawer.memberName}</h3>
                  <span className={cn('text-[10px] font-bold px-1.5 py-0.5 rounded-full', TIER_BADGE[drawer.tier] ?? 'bg-gray-100 text-gray-600')}>
                    {drawer.tier}
                  </span>
                  <span className={cn('text-[10px] font-bold px-2 py-0.5 rounded-full capitalize', STATUS_BADGE[drawer.status])}>
                    {drawer.status}
                  </span>
                </div>
                <p className="text-xs text-gray-400 mt-0.5 font-mono">{drawer.id}</p>
              </div>
              <button onClick={closeDrawer} className="w-8 h-8 rounded-full hover:bg-gray-100 flex items-center justify-center text-gray-400 shrink-0">
                <X size={16} />
              </button>
            </div>

            <div className="flex-1 overflow-y-auto px-6 py-5 space-y-6">

              {/* Member Info */}
              <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Member Info</h4>
                <div className="space-y-2.5 text-sm">
                  {[
                    ['Member ID', drawer.memberId],
                    ['Phone',     drawer.phone],
                    ['Tier',      drawer.tier],
                  ].map(([label, value]) => (
                    <div key={label} className="flex justify-between">
                      <span className="text-gray-400">{label}</span>
                      <span className="font-medium text-gray-800">{value}</span>
                    </div>
                  ))}
                </div>
              </section>

              {/* Payment Details */}
              <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Payment Details</h4>
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Amount</span>
                    <span className="text-xl font-bold text-green-700">{fmt(drawer.amount)}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Transaction ID</span>
                    <span className="font-mono text-gray-800">{drawer.transactionId}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Bank</span>
                    <span className="text-gray-800">{drawer.bank}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-400">Submitted</span>
                    <span className="text-gray-800">{drawer.submittedAt}</span>
                  </div>
                </div>
              </section>

              {/* Screenshot */}
              <section>
                <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Screenshot</h4>
                {drawer.screenshot ? (
                  <img src={drawer.screenshot} alt="Payment screenshot" className="w-full rounded-xl border border-gray-200" />
                ) : (
                  <div className="h-32 bg-gray-50 rounded-xl border-2 border-dashed border-gray-200 flex flex-col items-center justify-center gap-2">
                    <ImageIcon size={24} className="text-gray-300" />
                    <p className="text-xs text-gray-400">No screenshot uploaded</p>
                  </div>
                )}
              </section>

              {/* Rejection reason */}
              {drawer.status === 'rejected' && drawer.rejectionReason && (
                <section>
                  <h4 className="text-xs font-bold text-gray-500 uppercase tracking-wider mb-3">Rejection Reason</h4>
                  <div className="bg-red-50 border border-red-200 rounded-xl px-4 py-3 text-sm text-red-700">
                    {drawer.rejectionReason}
                  </div>
                </section>
              )}
            </div>

            {/* Drawer footer — actions if pending */}
            {drawer.status === 'pending' && (
              <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
                <button
                  onClick={() => { setApproveTarget(drawer); closeDrawer(); }}
                  className="flex-1 py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
                >
                  Approve
                </button>
                <button
                  onClick={() => { setRejectTarget(drawer); setRejectReason(''); setRejectErr(false); closeDrawer(); }}
                  className="flex-1 py-2.5 rounded-xl border border-red-400 text-red-600 text-sm font-semibold hover:bg-red-50 transition-colors"
                >
                  Reject
                </button>
              </div>
            )}
          </div>
        </div>
      )}

      {/* Toast */}
      {toast && (
        <div className={cn(
          'fixed bottom-6 right-6 px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50 text-sm font-medium',
          toast.type === 'green' ? 'bg-green-600 text-white' : 'bg-red-600 text-white'
        )}>
          {toast.msg}
        </div>
      )}
    </div>
  );
}
