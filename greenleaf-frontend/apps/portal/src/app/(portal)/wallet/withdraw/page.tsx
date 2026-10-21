'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef } from 'react';
import Link from 'next/link';
import { Check } from 'lucide-react';
import { MOCK_WALLET_BALANCES, MOCK_BANK_ACCOUNTS } from '@/data/mock/wallet';

const PROCESSING_FEE = 6500;
const QUICK_AMOUNTS  = [500_000, 1_000_000, 5_000_000];

function formatRP(val: number): string {
  return 'RP ' + val.toLocaleString('id-ID');
}

function parseRP(str: string): number {
  return parseInt(str.replace(/[^0-9]/g, ''), 10) || 0;
}

// ── 6-digit PIN input ─────────────────────────────────────────────────────────

function PinInput({ value, onChange }: { value: string; onChange: (v: string) => void }) {
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  function handleKey(i: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace') {
      if (value[i]) {
        onChange(value.slice(0, i) + '' + value.slice(i + 1));
      } else if (i > 0) {
        inputRefs.current[i - 1]?.focus();
        onChange(value.slice(0, i - 1) + '' + value.slice(i));
      }
    }
  }

  function handleChange(i: number, e: React.ChangeEvent<HTMLInputElement>) {
    const digit = e.target.value.replace(/\D/g, '').slice(-1);
    if (!digit) return;
    const next = value.slice(0, i) + digit + value.slice(i + 1);
    onChange(next);
    if (i < 5) inputRefs.current[i + 1]?.focus();
  }

  return (
    <div className="flex gap-2 justify-start">
      {Array.from({ length: 6 }).map((_, i) => (
        <input
          key={i}
          ref={(el) => { inputRefs.current[i] = el; }}
          type="password"
          inputMode="numeric"
          maxLength={1}
          value={value[i] ?? ''}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKey(i, e)}
          className="w-10 h-10 rounded-xl border-2 text-center text-sm font-bold text-text bg-primary-soft/20 focus:outline-none focus:border-primary transition-colors"
          style={{ borderColor: value[i] ? 'hsl(var(--primary))' : undefined }}
        />
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function WithdrawPage() {
  const [amountStr,  setAmountStr]  = useState('');
  const [selectedBank, setSelectedBank] = useState(MOCK_BANK_ACCOUNTS[0]?.id ?? '');
  const [pin,        setPin]        = useState('');
  const [submitted,  setSubmitted]  = useState(false);

  const rawAmount   = parseRP(amountStr);
  const balance     = MOCK_WALLET_BALANCES.ewallet;
  const overBalance = rawAmount > balance;
  const youReceive  = rawAmount > PROCESSING_FEE ? rawAmount - PROCESSING_FEE : 0;
  const canSubmit   = rawAmount > 0 && !overBalance && selectedBank !== '' && pin.length === 6;

  function handleQuick(val: number) {
    setAmountStr(formatRP(val));
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!canSubmit) return;
    setSubmitted(true);
  }

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Back link */}
      <Link href="/wallet" className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-4">
        ← Back to Wallet
      </Link>

      {/* Header */}
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">Withdraw</h1>
        <p className="text-sm text-text-muted mt-0.5">Withdraw to your bank account</p>
      </div>

      {/* Available balance card */}
      <div className="relative bg-[#1a3728] rounded-2xl p-5 mb-4 overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <p className="text-sm text-white/70 mb-1">Available to withdraw</p>
        <p className="text-3xl font-bold text-white">{formatRP(balance)}</p>
      </div>

      {/* Success state */}
      {submitted ? (
        <div className="bg-surface border border-border rounded-2xl p-8 text-center flex-1 flex flex-col items-center justify-center">
          <div className="w-14 h-14 rounded-full bg-primary-soft flex items-center justify-center mb-4">
            <Check className="h-7 w-7 text-primary" strokeWidth={2.5} />
          </div>
          <p className="text-base font-semibold text-text mb-1">Withdrawal submitted!</p>
          <p className="text-sm text-text-muted mb-5">Processing takes 1–3 business days</p>
          <Link href="/wallet" className="inline-block bg-primary text-[#0b1410] rounded-xl px-6 py-2.5 text-sm font-semibold hover:bg-primary/90 transition-colors">
            Back to Wallet
          </Link>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="bg-surface border border-border rounded-2xl p-5 flex flex-col gap-5">

          {/* ── Amount ── */}
          <div>
            <label className="text-xs font-medium text-text-muted block mb-1.5">Withdrawal amount</label>
            <input
              type="text"
              value={amountStr}
              onChange={(e) => setAmountStr(e.target.value)}
              placeholder="RP 0"
              className="w-full rounded-xl bg-primary-soft/30 border-0 px-4 py-3 text-lg font-semibold text-text focus:outline-none focus:ring-2 focus:ring-primary/40 placeholder:text-text-muted"
            />
            {overBalance && (
              <p className="text-danger text-xs mt-1.5">Insufficient balance</p>
            )}
            {/* Quick chips */}
            <div className="flex gap-2 flex-wrap mt-2">
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

            {/* Fee + receive rows */}
            {rawAmount > 0 && (
              <div className="mt-3 flex flex-col gap-1.5 border-t border-border pt-3">
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">Processing fee</span>
                  <span className="text-text-muted">{formatRP(PROCESSING_FEE)}</span>
                </div>
                <div className="flex justify-between text-sm">
                  <span className="text-text-muted">You&apos;ll receive</span>
                  <span className="font-semibold text-text">{formatRP(youReceive)}</span>
                </div>
              </div>
            )}
          </div>

          {/* ── Bank account selector ── */}
          <div>
            <label className="text-xs font-medium text-text-muted block mb-2">Withdraw to</label>
            <div className="flex flex-col gap-2">
              {MOCK_BANK_ACCOUNTS.map((bank) => (
                <label
                  key={bank.id}
                  className={`flex items-center gap-3 rounded-xl border-2 px-4 py-3 cursor-pointer transition-colors ${
                    selectedBank === bank.id ? 'border-primary bg-primary-soft/20' : 'border-border hover:border-primary/40'
                  }`}
                >
                  <input
                    type="radio"
                    name="bank"
                    value={bank.id}
                    checked={selectedBank === bank.id}
                    onChange={() => setSelectedBank(bank.id)}
                    className="sr-only"
                  />
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-0.5">
                      <span className="text-sm font-bold text-text">{bank.bankName}</span>
                      {bank.isPrimary && (
                        <span className="bg-primary-soft text-primary text-xs px-2 py-0.5 rounded-full font-medium">Primary</span>
                      )}
                    </div>
                    <p className="text-xs text-text-muted">{'****' + bank.accountNo.slice(-4)} · {bank.accountName}</p>
                  </div>
                  {/* Radio indicator */}
                  <div className={`w-4 h-4 rounded-full border-2 flex items-center justify-center shrink-0 ${
                    selectedBank === bank.id ? 'border-primary' : 'border-border'
                  }`}>
                    {selectedBank === bank.id && (
                      <div className="w-2 h-2 rounded-full bg-primary" />
                    )}
                  </div>
                </label>
              ))}
            </div>
            <Link href="/profile/bank" className="inline-block mt-2 text-sm text-primary hover:underline">
              + Add bank account
            </Link>
          </div>

          {/* ── PIN ── */}
          <div>
            <label className="text-xs font-medium text-text-muted block mb-2">Payment password</label>
            <PinInput value={pin} onChange={setPin} />
          </div>

          {/* ── Submit ── */}
          <button
            type="submit"
            disabled={!canSubmit}
            className="w-full bg-primary text-[#0b1410] rounded-xl py-3.5 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-40 disabled:cursor-not-allowed"
          >
            Confirm Withdrawal
          </button>
        </form>
      )}
    </div>
  );
}
