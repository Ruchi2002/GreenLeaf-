'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef, useEffect, useCallback } from 'react';
import Link from 'next/link';
import {
  Wallet, ArrowDownCircle, ArrowUpCircle, Send,
  Search, X, Check, XCircle, ArrowRight,
} from 'lucide-react';
import {
  walletStats, walletTransactions, walletAdjustments, walletMembers, ADJUST_REASONS,
  type WalletTransaction, type WalletAdjustment, type WalletMember,
} from '../../../data/mock/adminWallet';
import { cn } from '@/lib/utils';

// ── Static maps ────────────────────────────────────────────────────────────────
const ICON_MAP: Record<string, React.ElementType> = { Wallet, ArrowDownCircle, ArrowUpCircle, Send };

const TIER_BADGE: Record<string, string> = {
  Diamond:  'bg-cyan-100 text-cyan-700',
  Platinum: 'bg-puRPle-100 text-puRPle-700',
  Gold:     'bg-yellow-100 text-yellow-700',
  Silver:   'bg-gray-100 text-gray-500',
};

const TX_PILL: Record<string, string> = {
  Bonus:      'bg-green-100 text-green-700',
  Withdrawal: 'bg-amber-100 text-amber-700',
  Recharge:   'bg-blue-100 text-blue-700',
};

// ── Types ──────────────────────────────────────────────────────────────────────
interface ToastItem { id: number; message: string; type: 'success' | 'error'; }

// ── Main page ─────────────────────────────────────────────────────────────────
export default function WalletPage() {
  // Drawer
  const [drawerTx,      setDrawerTx]      = useState<WalletTransaction | null>(null);
  const [drawerVisible, setDrawerVisible] = useState(false);

  // Form
  const [search,          setSearch]          = useState('');
  const [searchOpen,      setSearchOpen]      = useState(false);
  const [selectedMember,  setSelectedMember]  = useState<WalletMember | null>(null);
  const [adjustType,      setAdjustType]      = useState<'credit' | 'debit'>('credit');
  const [amount,          setAmount]          = useState('');
  const [reason,          setReason]          = useState('');
  const [note,            setNote]            = useState('');
  const [fieldErrors,     setFieldErrors]     = useState({ member: false, amount: false });
  const [isShaking,       setIsShaking]       = useState(false);
  const [showSuccess,     setShowSuccess]     = useState(false);

  // Data
  const [adjustments, setAdjustments] = useState<WalletAdjustment[]>(walletAdjustments);
  const [toasts,      setToasts]      = useState<ToastItem[]>([]);

  const searchRef = useRef<HTMLDivElement>(null);

  // Close search dropdown on outside click
  useEffect(() => {
    function handler(e: MouseEvent) {
      if (searchRef.current && !searchRef.current.contains(e.target as Node)) setSearchOpen(false);
    }
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // ── Drawer helpers ────────────────────────────────────────────────────────────
  function openDrawer(tx: WalletTransaction) {
    setDrawerTx(tx);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerVisible(true)));
  }
  function closeDrawer() {
    setDrawerVisible(false);
    setTimeout(() => setDrawerTx(null), 300);
  }

  // ── Toast helper ──────────────────────────────────────────────────────────────
  const addToast = useCallback((message: string, type: ToastItem['type'] = 'success') => {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, type }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }, []);

  // ── Search filter ─────────────────────────────────────────────────────────────
  const filteredMembers = walletMembers.filter((m) =>
    m.name.toLowerCase().includes(search.toLowerCase()) ||
    m.id.toLowerCase().includes(search.toLowerCase())
  );

  // ── Form submit ───────────────────────────────────────────────────────────────
  function handleSubmit() {
    const errors = {
      member: !selectedMember,
      amount: !amount || parseFloat(amount) <= 0,
    };
    setFieldErrors(errors);
    if (errors.member || errors.amount) {
      setIsShaking(false);
      requestAnimationFrame(() => {
        requestAnimationFrame(() => {
          setIsShaking(true);
          setTimeout(() => setIsShaking(false), 400);
        });
      });
      return;
    }
    setShowSuccess(true);
  }

  function handleConfirm() {
    if (!selectedMember) return;
    const raw = parseFloat(amount);
    const display = raw >= 1_000_000
      ? `₹${(raw / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
      : raw >= 1_000 ? `₹${Math.round(raw / 1_000)}K` : `₹${raw}`;

    const newAdj: WalletAdjustment = {
      id:       `adj-${Date.now()}`,
      member:   selectedMember.name,
      initials: selectedMember.initials,
      avatarBg: selectedMember.avatarBg,
      reason:   reason || 'Manual correction',
      date:     'Oct 13',
      amount:   display,
      isCredit: adjustType === 'credit',
    };

    setAdjustments((p) => [newAdj, ...p]);
    setShowSuccess(false);
    setSelectedMember(null);
    setSearch('');
    setAmount('');
    setReason('');
    setNote('');
    setFieldErrors({ member: false, amount: false });
    addToast(`✓RP${amount} ${adjustType === 'credit' ? 'credit' : 'debit'} applied to ${selectedMember.name}`, 'success');
  }

  const pendingTxId = (id: string) => `TXN-${(10000 + parseInt(id) * 4337).toString().slice(0, 5)}`;

  return (
    <div className="space-y-6">
      {/* Shake keyframe */}
      <style>{`
        @keyframes shake {
          0%,100%{transform:translateX(0)}
          20%{transform:translateX(-5px)}
          40%{transform:translateX(5px)}
          60%{transform:translateX(-5px)}
          80%{transform:translateX(5px)}
        }
        .field-shake{animation:shake 0.4s ease-in-out}
      `}</style>

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
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Wallet Operations</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage member wallets and transactions.</p>
        </div>
        <Link
          href="/wallet/withdrawals"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors"
        >
          <ArrowDownCircle size={15} />
          Withdrawal Queue
          <ArrowRight size={14} />
        </Link>
      </div>

      {/* Stats row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {walletStats.map((s) => {
          const Icon = ICON_MAP[s.icon];
          const isPending = s.label === 'Pending Withdrawals';
          const card = (
            <div className={cn('bg-white rounded-2xl shadow-sm p-4 sm:p-5', isPending && 'cursor-pointer hover:shadow-md transition-shadow hover:border-amber-200 border border-transparent')}>
              <div className="flex items-start gap-3 mb-3">
                <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.iconBg)}>
                  {Icon && <Icon size={20} className={s.iconColor} />}
                </div>
                {isPending && (
                  <span className="ml-auto text-[11px] font-semibold text-amber-600 flex items-center gap-0.5">
                    View <ArrowRight size={11} />
                  </span>
                )}
              </div>
              <p className="text-2xl font-bold text-gray-900 leading-none mb-1">{s.value}</p>
              <p className="text-xs text-gray-500">{s.label}</p>
            </div>
          );
          return isPending
            ? <Link key={s.label} href="/wallet/withdrawals">{card}</Link>
            : <div key={s.label}>{card}</div>;
        })}
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_380px] gap-5 items-start">

        {/* ── LEFT — Transaction Feed ─────────────────────────────────────── */}
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden">
          <div className="px-4 sm:px-5 py-4 border-b border-gray-100">
            <h2 className="text-base font-semibold text-gray-900">Transaction Feed</h2>
          </div>

          {/* Desktop rows */}
          <div className="hidden md:block divide-y divide-gray-100">
            {walletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-5 py-3.5 hover:bg-gray-50/60 transition-colors"
              >
                {/* Avatar */}
                <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', tx.avatarBg)}>
                  <span className="text-white text-[11px] font-bold">{tx.initials}</span>
                </div>

                {/* Name + date */}
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 flex-wrap">
                    <p className="text-sm font-semibold text-gray-900 leading-tight">{tx.member}</p>
                    <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[tx.tier])}>
                      {tx.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mt-0.5">{tx.date}</p>
                </div>

                {/* Type pill + amount + view */}
                <div className="flex items-center gap-3 shrink-0">
                  <span className={cn('text-xs font-semibold px-2.5 py-0.5 rounded-full', TX_PILL[tx.type])}>
                    {tx.type}
                  </span>
                  <span className={cn('text-sm font-bold tabular-nums min-w-[60px] text-right', tx.isCredit ? 'text-green-600' : 'text-red-500')}>
                    {tx.isCredit ? '+' : '-'}{tx.amount}
                  </span>
                  <div className="flex items-center gap-1.5">
                    <span className="w-2 h-2 rounded-full bg-green-500 shrink-0" />
                    <button
                      onClick={() => openDrawer(tx)}
                      className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors"
                    >
                      View
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* Mobile cards */}
          <div className="md:hidden divide-y divide-gray-100">
            {walletTransactions.map((tx) => (
              <div
                key={tx.id}
                className="flex items-center gap-3 px-4 py-3.5 hover:bg-gray-50/60 transition-colors cursor-pointer"
                onClick={() => openDrawer(tx)}
              >
                {/* Flow indicator */}
                <div className={cn(
                  'w-10 h-10 rounded-full flex items-center justify-center shrink-0 text-lg',
                  tx.isCredit ? 'bg-green-100 text-green-600' : 'bg-red-100 text-red-500'
                )}>
                  {tx.isCredit ? '↑' : '↓'}
                </div>

                {/* Info */}
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-semibold text-gray-900 truncate">{tx.member}</p>
                  <p className="text-xs text-gray-400 truncate">{tx.type} · {tx.date}</p>
                </div>

                {/* Amount + type pill */}
                <div className="text-right shrink-0">
                  <p className={cn('text-sm font-bold', tx.isCredit ? 'text-green-600' : 'text-red-500')}>
                    {tx.isCredit ? '+' : '-'}{tx.amount}
                  </p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TX_PILL[tx.type])}>
                    {tx.type}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* ── RIGHT — Adjustment + Recent ────────────────────────────────── */}
        <div className="space-y-4">

          {/* Manual Wallet Adjustment */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Manual Wallet Adjustment</h2>
            <div className="space-y-3">

              {/* Search member */}
              <div ref={searchRef} className="relative">
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Search Member</label>
                <div className={cn(
                  'flex items-center h-10 rounded-xl border bg-white overflow-hidden transition-all',
                  fieldErrors.member ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200',
                  isShaking && fieldErrors.member && 'field-shake'
                )}>
                  <Search size={14} className="ml-3 text-gray-400 shrink-0" />
                  <input
                    type="text"
                    value={selectedMember ? selectedMember.name : search}
                    onChange={(e) => {
                      setSearch(e.target.value);
                      setSelectedMember(null);
                      setSearchOpen(true);
                      setFieldErrors((p) => ({ ...p, member: false }));
                    }}
                    onFocus={() => setSearchOpen(true)}
                    placeholder="Type name or member ID..."
                    className="flex-1 px-2 text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none bg-transparent"
                  />
                  {selectedMember && (
                    <button onClick={() => { setSelectedMember(null); setSearch(''); }}
                      className="mr-2 text-gray-400 hover:text-gray-600">
                      <X size={13} />
                    </button>
                  )}
                </div>

                {/* Dropdown */}
                {searchOpen && !selectedMember && filteredMembers.length > 0 && (
                  <div className="absolute left-0 right-0 top-full mt-1 z-20 bg-white rounded-xl shadow-lg border border-gray-100 py-1 max-h-48 overflow-y-auto">
                    {filteredMembers.map((m) => (
                      <button
                        key={m.id}
                        onMouseDown={() => { setSelectedMember(m); setSearch(''); setSearchOpen(false); setFieldErrors((p) => ({ ...p, member: false })); }}
                        className="w-full flex items-center gap-2.5 px-3 py-2 hover:bg-gray-50 text-left"
                      >
                        <div className={cn('w-7 h-7 rounded-full flex items-center justify-center shrink-0', m.avatarBg)}>
                          <span className="text-white text-[10px] font-bold">{m.initials}</span>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-900 leading-tight">{m.name}</p>
                          <p className="text-[11px] text-gray-400">{m.id}</p>
                        </div>
                      </button>
                    ))}
                  </div>
                )}
              </div>

              {/* Adjustment type toggle */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Adjustment Type</label>
                <div className="flex gap-2">
                  <button
                    onClick={() => setAdjustType('credit')}
                    className={cn(
                      'flex-1 h-9 rounded-xl text-sm font-semibold border transition-colors',
                      adjustType === 'credit'
                        ? 'bg-green-600 text-[#0b1410] border-green-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    + Credit
                  </button>
                  <button
                    onClick={() => setAdjustType('debit')}
                    className={cn(
                      'flex-1 h-9 rounded-xl text-sm font-semibold border transition-colors',
                      adjustType === 'debit'
                        ? 'bg-red-600 text-white border-red-600'
                        : 'bg-white text-gray-500 border-gray-200 hover:bg-gray-50'
                    )}
                  >
                    – Debit
                  </button>
                </div>
              </div>

              {/* Amount */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Amount (₹)</label>
                <div className={cn(
                  'flex h-10 rounded-xl border overflow-hidden transition-all',
                  fieldErrors.amount ? 'border-red-400 ring-2 ring-red-200' : 'border-gray-200',
                  isShaking && fieldErrors.amount && 'field-shake'
                )}>
                  <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-500 shrink-0">₹</span>
                  <input
                    type="number"
                    value={amount}
                    onChange={(e) => { setAmount(e.target.value); setFieldErrors((p) => ({ ...p, amount: false })); }}
                    placeholder="0"
                    className="flex-1 px-3 text-sm text-gray-800 bg-white focus:outline-none placeholder:text-gray-300"
                  />
                </div>
              </div>

              {/* Reason */}
              <div>
                <label className="block text-xs font-semibold text-gray-500 mb-1.5">Reason</label>
                <select
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  className="w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow cursor-pointer"
                >
                  <option value="" disabled>Select a reason</option>
                  {ADJUST_REASONS.map((r) => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>

              {/* Note */}
              <div>
                <textarea
                  value={note}
                  onChange={(e) => setNote(e.target.value)}
                  rows={2}
                  placeholder="Add internal note..."
                  className="w-full px-3.5 py-2.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
                />
              </div>

              {/* Submit */}
              <button
                onClick={handleSubmit}
                className="w-full py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
              >
                Submit Adjustment
              </button>
            </div>
          </div>

          {/* Recent Adjustments */}
          <div className="bg-white rounded-2xl shadow-sm p-5">
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Recent Adjustments</h2>
            <div className="space-y-3">
              {adjustments.slice(0, 5).map((adj) => (
                <div key={adj.id} className="flex items-center gap-3">
                  <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0', adj.avatarBg)}>
                    <span className="text-white text-[10px] font-bold">{adj.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900 leading-tight truncate">{adj.member}</p>
                    <p className="text-[11px] text-gray-400 truncate">{adj.reason} · {adj.date}</p>
                  </div>
                  <span className={cn('text-sm font-bold tabular-nums shrink-0', adj.isCredit ? 'text-green-600' : 'text-red-500')}>
                    {adj.isCredit ? '+' : '-'}{adj.amount}
                  </span>
                </div>
              ))}
            </div>
            <div className="mt-4 pt-3 border-t border-gray-100 text-right">
              <button className="text-xs font-semibold text-green-600 hover:text-green-700 transition-colors">
                View All →
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* ── Slide-over Drawer ─────────────────────────────────────────────── */}
      {drawerTx && (
        <div className="fixed inset-0 z-50">
          <div
            className={cn('absolute inset-0 bg-black/30 transition-opacity duration-300', drawerVisible ? 'opacity-100' : 'opacity-0')}
            onClick={closeDrawer}
          />
          {/* Mobile: bottom sheet | Desktop: right slide-over */}
          <div className={cn(
            'absolute bg-white shadow-2xl overflow-y-auto transition-transform duration-300 flex flex-col',
            'inset-x-0 bottom-0 rounded-t-3xl max-h-[85vh]',
            'sm:inset-y-0 sm:right-0 sm:left-auto sm:w-96 sm:rounded-none sm:max-h-full',
            drawerVisible
              ? 'translate-y-0 sm:translate-x-0'
              : 'translate-y-full sm:translate-x-full'
          )}>
            {/* Drawer header */}
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <h3 className="text-base font-semibold text-gray-900">Transaction Details</h3>
              <button onClick={closeDrawer} className="text-gray-400 hover:text-gray-600 transition-colors">
                <X size={18} />
              </button>
            </div>

            {/* Drawer body */}
            <div className="flex-1 px-6 py-5 space-y-5">
              {/* Member */}
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', drawerTx.avatarBg)}>
                  <span className="text-white text-sm font-bold">{drawerTx.initials}</span>
                </div>
                <div>
                  <p className="font-bold text-gray-900">{drawerTx.member}</p>
                  <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[drawerTx.tier])}>
                    {drawerTx.tier}
                  </span>
                </div>
              </div>

              {/* Details */}
              <div className="rounded-xl border border-gray-100 overflow-hidden">
                {[
                  { label: 'Transaction ID', value: pendingTxId(drawerTx.id) },
                  { label: 'Type',           value: drawerTx.type            },
                  { label: 'Amount',         value: `${drawerTx.isCredit ? '+' : '-'}${drawerTx.amount}` },
                  { label: 'Date',           value: drawerTx.date            },
                  { label: 'Status',         value: 'Completed'              },
                ].map((row, i, arr) => (
                  <div key={row.label} className={cn('flex items-center justify-between px-4 py-3 text-sm', i < arr.length - 1 && 'border-b border-gray-100')}>
                    <span className="text-gray-500">{row.label}</span>
                    <span className={cn(
                      'font-semibold',
                      row.label === 'Amount'
                        ? drawerTx.isCredit ? 'text-green-600' : 'text-red-500'
                        : row.label === 'Status' ? 'text-green-600'
                        : 'text-gray-900'
                    )}>
                      {row.value}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Drawer footer */}
            <div className="px-6 py-4 border-t border-gray-100">
              <button
                onClick={closeDrawer}
                className="w-full py-2.5 rounded-xl border border-gray-200 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* ── Success Modal ─────────────────────────────────────────────────── */}
      {showSuccess && selectedMember && (
        <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm"
          onClick={() => setShowSuccess(false)}>
          <div className="bg-white w-full sm:max-w-sm rounded-t-3xl sm:rounded-2xl shadow-xl p-6" onClick={(e) => e.stopPropagation()}>
            {/* Icon */}
            <div className="w-12 h-12 rounded-full bg-green-100 flex items-center justify-center mx-auto mb-4">
              <Check size={22} className="text-green-600" />
            </div>
            <h3 className="text-lg font-bold text-gray-900 text-center mb-2">Adjustment Submitted</h3>
            <p className="text-sm text-gray-500 text-center mb-1">
              <span className={cn('font-semibold', adjustType === 'credit' ? 'text-green-600' : 'text-red-500')}>
               RP{amount} {adjustType === 'credit' ? 'Credit' : 'Debit'}
              </span>{' '}
              applied to <strong>{selectedMember.name}</strong>.
            </p>
            <p className="text-xs text-gray-400 text-center mb-6">
              This will be reflected in their wallet immediately.
            </p>
            <button
              onClick={handleConfirm}
              className="w-full py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
            >
              OK
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
