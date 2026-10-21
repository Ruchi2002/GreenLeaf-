'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';

// ── Mock data ─────────────────────────────────────────────────────────────────

const BANK_DETAILS = [
  { label: 'Bank name',       value: 'Bank Central Asia (BCA)' },
  { label: 'Account number',  value: '4821 0099 7710'          },
  { label: 'Account holder',  value: 'PT Greenleaf Indonesia'  },
] as const;

const REFERENCE_CODE = '12845390';

const QUICK_AMOUNTS = [500_000, 1_000_000, 5_000_000];

function formatRP(val: number): string {
  return 'RP ' + val.toLocaleString('id-ID');
}

// ── Copy button ───────────────────────────────────────────────────────────────

function CopyButton({ text }: { text: string }) {
  const [copied, setCopied] = useState(false);

  function handleCopy() {
    navigator.clipboard.writeText(text).catch(() => {});
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }

  return (
    <button
      onClick={handleCopy}
      className="shrink-0 bg-white/10 text-white text-xs px-3 py-1 rounded-lg hover:bg-white/20 transition-colors"
    >
      {copied ? 'Copied!' : 'Copy'}
    </button>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BankRechargePage() {
  const [rawAmount, setRawAmount] = useState('');
  const [focused,   setFocused]   = useState(false);
  const [submitted, setSubmitted] = useState(false);

  const displayValue = focused ? rawAmount : (rawAmount === '' ? 'RP 0' : rawAmount);

  function handleQuick(val: number) {
    setRawAmount(formatRP(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitted(true);
  }

  const isEmpty = rawAmount === '' || rawAmount === 'RP 0';

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)]">
      {/* Back link */}
      <Link
        href="/wallet"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-4"
      >
        ← Back to Wallet
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Bank Recharge</h1>
        <p className="text-sm text-text-muted mt-0.5">Top up your e-wallet via bank transfer</p>
      </div>

      {/* Bank details card */}
      <div className="bg-[#1a3728] rounded-2xl p-6 mb-4">
        <p className="text-sm text-white/70 mb-4">Transfer to</p>

        {/* Detail rows */}
        <div className="flex flex-col">
          {BANK_DETAILS.map(({ label, value }, i) => (
            <div
              key={label}
              className={`flex items-center justify-between py-3 ${i < BANK_DETAILS.length - 1 ? 'border-b border-white/10' : ''}`}
            >
              <div className="min-w-0 mr-4">
                <p className="text-xs text-white/60 mb-0.5">{label}</p>
                <p className="text-white font-semibold text-sm">{value}</p>
              </div>
              <CopyButton text={value} />
            </div>
          ))}
        </div>

        {/* Reference code box */}
        <div className="bg-white/10 rounded-xl p-4 mt-4">
          <p className="text-xs text-white/60 mb-1">Your unique reference code</p>
          <div className="flex items-center justify-between gap-3">
            <p className="text-white text-2xl font-bold tracking-widest">{REFERENCE_CODE}</p>
            <CopyButton text={REFERENCE_CODE} />
          </div>
          <p className="text-xs text-white/50 mt-1">Add this code in your transfer remarks</p>
        </div>
      </div>

      {/* Amount section */}
      {submitted ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center">
          <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center mx-auto mb-4">
            <Check className="h-7 w-7 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-base font-semibold text-text mb-1">Recharge request submitted!</p>
          <p className="text-sm text-text-muted mb-5">We&apos;ll verify your transfer within 24 hours</p>
          <Link
            href="/wallet"
            className="inline-block bg-primary text-[#0b1410] rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Back to Wallet
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-5">
          <p className="text-sm font-medium text-text mb-3">Amount transferred</p>

          {/* Amount input */}
          <input
            type="text"
            value={displayValue}
            onFocus={() => { setFocused(true); if (rawAmount === '') setRawAmount(''); }}
            onBlur={() => setFocused(false)}
            onChange={(e) => setRawAmount(e.target.value)}
            className="w-full rounded-xl bg-primary-soft/30 border-0 px-4 py-3 text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/40 mb-3"
          />

          {/* Quick chips */}
          <div className="flex gap-2 flex-wrap mb-4">
            {QUICK_AMOUNTS.map((val) => (
              <button
                key={val}
                type="button"
                onClick={() => handleQuick(val)}
                className="rounded-full border border-border px-3 py-1 text-xs text-text hover:border-primary hover:text-primary transition-colors"
              >
                {formatRP(val)}
              </button>
            ))}
          </div>

          {/* Submit */}
          <button
            type="submit"
            disabled={isEmpty}
            className="w-full bg-primary text-[#0b1410] rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Submit recharge request
          </button>
        </form>
      )}

      {/* 3-step process */}
      <div className="mt-8 flex items-start gap-0">
        {[
          { n: '1', label: 'Transfer money to the account above'     },
          { n: '2', label: 'Submit your recharge request here'        },
          { n: '3', label: 'Admin verifies, usually within 24 hours' },
        ].map(({ n, label }, i, arr) => (
          <div key={n} className="flex items-start flex-1 min-w-0">
            {/* Step */}
            <div className="flex flex-col items-center flex-1 min-w-0">
              <div className="w-8 h-8 rounded-full bg-primary-soft text-primary flex items-center justify-center text-sm font-semibold shrink-0">
                {n}
              </div>
              <p className="text-xs text-text-muted text-center mt-2 leading-relaxed px-1">{label}</p>
            </div>

            {/* Connector — skip after last */}
            {i < arr.length - 1 && (
              <div className="flex-none w-8 border-t border-dashed border-border mt-4" />
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
