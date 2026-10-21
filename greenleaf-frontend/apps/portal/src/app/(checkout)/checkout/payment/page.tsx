'use client';

import { useState, useEffect, useRef } from 'react';
import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';
import { cn } from '@/lib/utils';

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_ORDER = {
  orderNumber: 'FX222511281608962' + Math.floor(Math.random() * 10),
  total: 868000,
  paymentDeadlineSeconds: 40 * 60,
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_BALANCES = {
  ewallet: 765781000,
  voucher: 98700000,
};

type PaymentMethod = 'ewallet' | 'voucher';

function formatRupiah(amount: number) {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function formatCountdown(seconds: number): string {
  const m = Math.floor(seconds / 60).toString().padStart(2, '0');
  const s = (seconds % 60).toString().padStart(2, '0');
  return `${m}:${s}`;
}

function StepIndicator() {
  const steps = ['Cart', 'Confirm order', 'Payment'];
  const active = 2;

  return (
    <div className="flex items-center gap-0 mb-8">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center">
          <div className="flex items-center gap-2">
            <div className={cn(
              'w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
              i <= active
                ? 'bg-primary text-[#0b1410]'
                : 'bg-surface border-2 border-border text-text-muted'
            )}>
              {i < active ? <Check size={13} /> : i + 1}
            </div>
            <span className={cn(
              'text-sm',
              i === active ? 'font-semibold text-text' : 'text-text-muted'
            )}>
              {step}
            </span>
          </div>
          {i < steps.length - 1 && (
            <div className={cn(
              'h-px w-12 mx-2',
              i < active ? 'bg-primary' : 'bg-border'
            )} />
          )}
        </div>
      ))}
    </div>
  );
}

export default function PaymentPage() {
  const router = useRouter();
  const [selectedMethod,      setSelectedMethod]      = useState<PaymentMethod>('ewallet');
  const [pinDigits,           setPinDigits]           = useState<string[]>(['', '', '', '', '', '']);
  const [timeLeft,            setTimeLeft]            = useState(MOCK_ORDER.paymentDeadlineSeconds);
  const [insufficientBalance, setInsufficientBalance] = useState(false);
  const [paying,              setPaying]              = useState(false);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Countdown timer — MOCK ONLY
  useEffect(() => {
    if (timeLeft <= 0) return;
    const interval = setInterval(() => setTimeLeft((t) => t - 1), 1000);
    return () => clearInterval(interval);
  }, [timeLeft]);

  function handlePinInput(index: number, value: string) {
    // MOCK ONLY — never stored, processed, or transmitted
    if (!/^\d?$/.test(value)) return;
    const next = [...pinDigits];
    next[index] = value;
    setPinDigits(next);
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePinKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !pinDigits[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
  }

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  function handlePayNow() {
    if (pinDigits.some((d) => d === '')) return;
    setPaying(true);
    setTimeout(() => router.push('/checkout/success'), 1000);
  }

  const expired = timeLeft <= 0;
  const allPinFilled = pinDigits.every((d) => d !== '');

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="px-6 py-4 border-b border-border bg-surface flex items-center gap-2">
        <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
          <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
        </svg>
        <span className="text-base font-bold text-text">Greenleaf</span>
      </header>

      <div className="flex-1 flex flex-col items-center px-4 py-8">
        <div className="w-full max-w-lg">
          <StepIndicator />

          {/* Order placed banner */}
          <div className={cn(
            'rounded-2xl border px-5 py-4 mb-6',
            expired
              ? 'bg-danger/10 border-danger/30'
              : 'bg-primary/10 border-primary/30'
          )}>
            {expired ? (
              <p className="text-sm font-semibold text-danger">
                ✗ Payment deadline expired. Your order has been cancelled.
              </p>
            ) : (
              <>
                <p className="text-sm font-semibold text-primary">
                  ✓ Order placed! Order #{MOCK_ORDER.orderNumber}
                </p>
                <p className="text-sm text-text-muted mt-0.5">
                  Complete payment within{' '}
                  <span className="font-bold text-text">{formatCountdown(timeLeft)}</span>
                  {' '}or the order will be cancelled
                </p>
              </>
            )}
          </div>

          {!expired && (
            <>
              {/* Choose payment method */}
              <p className="text-sm font-semibold text-text mb-3">Choose payment method</p>

              <div className="flex flex-col gap-3 mb-6">
                <button
                  onClick={() => { setSelectedMethod('ewallet'); setInsufficientBalance(false); }}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-2xl border-2 transition-colors bg-surface',
                    selectedMethod === 'ewallet' ? 'border-primary' : 'border-border hover:border-primary/40'
                  )}
                >
                  <p className="text-sm font-bold text-text">E-wallet balance</p>
                  <p className={cn(
                    'text-sm mt-0.5',
                    insufficientBalance && selectedMethod === 'ewallet' ? 'text-danger' : 'text-text-muted'
                  )}>
                    Available {formatRupiah(MOCK_BALANCES.ewallet)}
                    {insufficientBalance && selectedMethod === 'ewallet' && ' — insufficient'}
                  </p>
                </button>

                <button
                  onClick={() => { setSelectedMethod('voucher'); setInsufficientBalance(false); }}
                  className={cn(
                    'w-full text-left px-5 py-4 rounded-2xl border-2 transition-colors bg-surface',
                    selectedMethod === 'voucher' ? 'border-primary' : 'border-border hover:border-primary/40'
                  )}
                >
                  <p className="text-sm font-bold text-text">Shopping voucher balance</p>
                  <p className={cn(
                    'text-sm mt-0.5',
                    insufficientBalance && selectedMethod === 'voucher' ? 'text-danger' : 'text-text-muted'
                  )}>
                    Available {formatRupiah(MOCK_BALANCES.voucher)}
                    {insufficientBalance && selectedMethod === 'voucher' && ' — insufficient'}
                  </p>
                </button>
              </div>

              {/* Amount to pay */}
              <div className="flex justify-between items-center text-sm mb-6 px-1">
                <span className="text-text-muted">Amount to pay</span>
                <span className="font-bold text-text text-base">{formatRupiah(MOCK_ORDER.total)}</span>
              </div>

              {/* Payment password — 6-digit PIN */}
              {/* MOCK ONLY — values never stored, processed, or transmitted */}
              <div className="mb-6">
                <p className="text-sm font-semibold text-text mb-3">Payment password</p>
                <div className="flex gap-3">
                  {pinDigits.map((digit, i) => (
                    <input
                      key={i}
                      ref={(el) => { inputRefs.current[i] = el; }}
                      type="password"
                      inputMode="numeric"
                      maxLength={1}
                      value={digit}
                      onChange={(e) => handlePinInput(i, e.target.value)}
                      onKeyDown={(e) => handlePinKeyDown(i, e)}
                      className="w-12 h-12 rounded-xl border-2 border-border bg-surface text-center text-lg font-bold text-text focus:outline-none focus:border-primary transition-colors"
                      aria-label={`PIN digit ${i + 1}`}
                    />
                  ))}
                </div>
              </div>

              {/* Pay now */}
              <button
                onClick={handlePayNow}
                disabled={paying || !allPinFilled}
                className="w-full py-3.5 rounded-xl bg-primary text-[#0b1410] text-sm font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
              >
                {paying ? 'Processing…' : 'Pay now'}
              </button>

              {/* Demo toggle */}
              <button
                onClick={() => setInsufficientBalance((v) => !v)}
                className="w-full mt-4 text-xs text-text-muted hover:text-text transition-colors text-center"
              >
                Simulate insufficient balance (demo)
              </button>
            </>
          )}

          {/* Expired CTA */}
          {expired && (
            <button
              onClick={() => router.push('/shop')}
              className="w-full py-3.5 rounded-xl bg-primary text-[#0b1410] text-sm font-bold hover:bg-primary/90 transition-colors"
            >
              Back to Shop
            </button>
          )}
        </div>
      </div>
    </div>
  );
}
