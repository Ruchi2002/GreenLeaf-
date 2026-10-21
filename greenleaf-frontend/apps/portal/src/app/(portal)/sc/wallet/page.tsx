'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import Link from 'next/link';
import { Eye, EyeOff, X } from 'lucide-react';
import { MOCK_WALLET_BALANCES } from '@/data/mock/wallet';

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

const QUICK_AMOUNTS = [100_000, 500_000, 1_000_000];

// ── Transfer Modal ────────────────────────────────────────────────────────────

function TransferModal({ onClose }: { onClose: () => void }) {
  const [recipientId, setRecipientId] = useState('');
  const [amount,      setAmount]      = useState('');
  const [note,        setNote]        = useState('');
  const [submitted,   setSubmitted]   = useState(false);

  const memberFound = recipientId.length >= 4;

  function handleQuick(val: number) {
    setAmount(formatINR(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
    setTimeout(() => { onClose(); }, 1500);
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10">
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Transfer</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-primary-soft transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {submitted ? (
          <div className="py-8 text-center">
            <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-3">
              <span className="text-primary text-xl font-bold">✓</span>
            </div>
            <p className="text-sm font-semibold text-text">Transfer submitted</p>
            <p className="text-xs text-text-muted mt-1">This is mock only — no real funds moved.</p>
          </div>
        ) : (
          <form onSubmit={handleSubmit} className="flex flex-col gap-4">
            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Recipient member ID</label>
              <input
                value={recipientId}
                onChange={(e) => setRecipientId(e.target.value)}
                placeholder="e.g. RP12345678"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-text bg-primary-soft/30 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted"
              />
              {memberFound && (
                <div className="flex items-center gap-3 mt-2 bg-primary-soft/40 rounded-xl px-3 py-2">
                  <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                    <span className="text-xs font-bold text-primary">RV</span>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-text">Rahul Verma</p>
                    <p className="text-xs text-text-muted">{recipientId}</p>
                  </div>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Amount</label>
              <input
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder="₹0"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-text bg-primary-soft/30 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted"
              />
              <div className="flex gap-2 mt-2 flex-wrap">
                {QUICK_AMOUNTS.map((val) => (
                  <button
                    key={val}
                    type="button"
                    onClick={() => handleQuick(val)}
                    className="rounded-full border border-border px-3 py-1 text-xs text-text-muted hover:border-primary hover:text-primary transition-colors"
                  >
                    {formatINR(val)}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="text-xs font-medium text-text-muted block mb-1.5">Note (optional)</label>
              <input
                value={note}
                onChange={(e) => setNote(e.target.value)}
                placeholder="Add a note"
                className="w-full rounded-xl px-4 py-2.5 text-sm text-text bg-primary-soft/30 border border-transparent focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted"
              />
            </div>

            <button
              type="submit"
              className="w-full bg-primary text-[#0b1410] rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors mt-1"
            >
              Continue
            </button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function SCWalletPage() {
  const [hidden,       setHidden]       = useState(false);
  const [transferOpen, setTransferOpen] = useState(false);

  const bal = MOCK_WALLET_BALANCES;

  function mask(val: number): string {
    return hidden ? '₹ ••••••••' : formatINR(val);
  }

  return (
    <>
      <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold text-text">E-Wallet &amp; Finance</h1>
            <p className="text-sm text-text-muted mt-0.5">Manage your balances, transfers and recharges</p>
          </div>
        </div>

        <div className="flex justify-end mb-3">
          <button
            onClick={() => setHidden((h) => !h)}
            className="flex items-center gap-1.5 text-xs text-text-muted hover:text-text transition-colors"
          >
            {hidden ? <Eye size={14} /> : <EyeOff size={14} />}
            {hidden ? 'Show balances' : 'Hide balances'}
          </button>
        </div>

        {/* Balance cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-5">
          <div className="relative rounded-2xl overflow-hidden p-6 bg-[#1a3728] text-white">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
            <div className="absolute bottom-4 right-4 opacity-40">
              <EyeOff size={18} className="text-white" />
            </div>
            <p className="text-sm text-white/70 mb-2">E-wallet available</p>
            <p className="text-3xl font-bold text-white mb-3">{mask(bal.ewallet)}</p>
            <p className="text-xs text-white/60">
              Frozen <span className="font-medium">{hidden ? '••••' : `₹${bal.frozen.toLocaleString('en-IN')}`}</span>
            </p>
          </div>

          <div className="relative rounded-2xl overflow-hidden p-6 bg-[#7a5c00] text-white">
            <div className="absolute top-0 right-0 w-32 h-32 rounded-full bg-white/5 -translate-y-8 translate-x-8" />
            <div className="absolute bottom-4 right-4 opacity-40">
              <EyeOff size={18} className="text-white" />
            </div>
            <p className="text-sm text-white/70 mb-2">Shopping vouchers</p>
            <p className="text-3xl font-bold text-white mb-3">{mask(bal.vouchers)}</p>
            <p className="text-xs text-white/60">
              Usable on <span className="italic underline">all repurchase items</span>
            </p>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 mb-5">
          <button
            onClick={() => setTransferOpen(true)}
            className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text hover:bg-primary-soft/40 transition-colors"
          >
            Transfer
          </button>
          <Link
            href="/wallet/topup"
            className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text hover:bg-primary-soft/40 transition-colors text-center"
          >
            Recharge
          </Link>
          <Link
            href="/wallet/withdraw"
            className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text hover:bg-primary-soft/40 transition-colors text-center"
          >
            Withdraw
          </Link>
          <Link
            href="/wallet/statement"
            className="rounded-xl border border-border bg-surface py-3 text-sm font-medium text-text hover:bg-primary-soft/40 transition-colors text-center"
          >
            Statement
          </Link>
        </div>

        {/* Secondary cards */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-6">
          <Link
            href="/wallet/bonuses"
            className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <p className="font-semibold text-sm text-text mb-1">Bonus Record</p>
            <p className="text-xs text-text-muted">View daily and monthly bonus history</p>
          </Link>
          <Link
            href="/wallet/recharge-history"
            className="bg-surface border border-border rounded-xl p-5 hover:border-primary/40 transition-colors cursor-pointer"
          >
            <p className="font-semibold text-sm text-text mb-1">My Recharges</p>
            <p className="text-xs text-text-muted">Track your recharge requests</p>
          </Link>
        </div>
      </div>

      {transferOpen && <TransferModal onClose={() => setTransferOpen(false)} />}
    </>
  );
}
