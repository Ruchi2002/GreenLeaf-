'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useEffect, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Moon, Sun, Mail, ArrowLeft } from 'lucide-react';
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel';

type Step = 1 | 2 | 3;

// MOCK ONLY — BACKEND_REQUIRED_LATER
function mockSendCode(_email: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
function mockVerifyCode(_email: string, _code: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1000));
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
function mockResetPassword(_email: string, _password: string): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, 1200));
}

export default function ForgotPasswordPage() {
  const router = useRouter();

  const [step,          setStep]          = useState<Step>(1);
  const [isDark,        setIsDark]        = useState(false);

  // Step 1
  const [email,         setEmail]         = useState('');
  const [emailError,    setEmailError]    = useState('');
  const [sendLoading,   setSendLoading]   = useState(false);

  // Step 2
  const [otp,           setOtp]           = useState(['', '', '', '', '', '']);
  const [otpError,      setOtpError]      = useState('');
  const [verifyLoading, setVerifyLoading] = useState(false);
  const [resendSeconds, setResendSeconds] = useState(0);
  const otpRefs = useRef<(HTMLInputElement | null)[]>([]);

  // Step 3
  const [newPw,         setNewPw]         = useState('');
  const [confirmPw,     setConfirmPw]     = useState('');
  const [showNew,       setShowNew]       = useState(false);
  const [showConfirm,   setShowConfirm]   = useState(false);
  const [pwError,       setPwError]       = useState('');
  const [resetLoading,  setResetLoading]  = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gl-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  // Countdown timer for resend
  useEffect(() => {
    if (resendSeconds <= 0) return;
    const id = setTimeout(() => setResendSeconds((s) => s - 1), 1000);
    return () => clearTimeout(id);
  }, [resendSeconds]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('gl-theme', next ? 'dark' : 'light');
  }

  // ── Step 1: send code ────────────────────────────────────────────────────────

  async function handleSendCode(e: React.FormEvent) {
    e.preventDefault();
    setEmailError('');
    if (!email.trim()) { setEmailError('Email is required.'); return; }
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setEmailError('Please enter a valid email address.');
      return;
    }
    setSendLoading(true);
    await mockSendCode(email);
    setSendLoading(false);
    setOtp(['', '', '', '', '', '']);
    setResendSeconds(60);
    setStep(2);
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }

  // ── Step 2: OTP input ────────────────────────────────────────────────────────

  function handleOtpChange(index: number, value: string) {
    const digit = value.replace(/\D/g, '').slice(-1);
    const next = [...otp];
    next[index] = digit;
    setOtp(next);
    setOtpError('');
    if (digit && index < 5) {
      otpRefs.current[index + 1]?.focus();
    }
  }

  function handleOtpKeyDown(index: number, e: React.KeyboardEvent<HTMLInputElement>) {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      otpRefs.current[index - 1]?.focus();
    }
  }

  function handleOtpPaste(e: React.ClipboardEvent<HTMLInputElement>) {
    e.preventDefault();
    const digits = e.clipboardData.getData('text').replace(/\D/g, '').slice(0, 6).split('');
    const next = [...otp];
    digits.forEach((d, i) => { next[i] = d; });
    setOtp(next);
    const focusIdx = Math.min(digits.length, 5);
    otpRefs.current[focusIdx]?.focus();
  }

  async function handleVerify(e: React.FormEvent) {
    e.preventDefault();
    setOtpError('');
    const code = otp.join('');
    if (code.length < 6) { setOtpError('Please enter all 6 digits.'); return; }
    setVerifyLoading(true);
    await mockVerifyCode(email, code);
    setVerifyLoading(false);
    setStep(3);
  }

  async function handleResend() {
    if (resendSeconds > 0) return;
    setSendLoading(true);
    await mockSendCode(email);
    setSendLoading(false);
    setOtp(['', '', '', '', '', '']);
    setResendSeconds(60);
    setTimeout(() => otpRefs.current[0]?.focus(), 80);
  }

  // ── Step 3: new password ─────────────────────────────────────────────────────

  async function handleReset(e: React.FormEvent) {
    e.preventDefault();
    setPwError('');
    if (newPw.length < 8) { setPwError('Password must be at least 8 characters.'); return; }
    if (newPw !== confirmPw) { setPwError('Passwords do not match.'); return; }
    setResetLoading(true);
    await mockResetPassword(email, newPw);
    setResetLoading(false);
    router.push('/login?reset=success');
  }

  // ── Render ───────────────────────────────────────────────────────────────────

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      {/* Right panel */}
      <div className="flex-1 bg-background flex flex-col min-h-screen md:min-h-0">

        {/* Mobile header */}
        <div className="flex items-center justify-between px-5 py-4 md:hidden border-b border-border">
          <div className="flex items-center gap-2">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-primary">
              <path d="M50 8 C20 28 20 88 50 108 C80 88 80 28 50 8 Z" fill="currentColor" />
            </svg>
            <span className="text-base font-bold text-text tracking-tight">Greenleaf</span>
          </div>
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-text-muted hover:text-text transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Desktop theme toggle */}
        <div className="hidden md:flex justify-end p-4 sm:p-6">
          <button
            onClick={toggleTheme}
            aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
            className="text-text-muted hover:text-text transition-colors"
          >
            {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
          </button>
        </div>

        {/* Centered form area */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-8 sm:pb-16">
          <div className="w-full max-w-[340px]">

            {/* ── Step 1: Enter email ── */}
            {step === 1 && (
              <>
                <div className="mb-8">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <Mail className="h-5 w-5 text-primary" />
                  </div>
                  <h1 className="text-[1.65rem] font-bold text-text leading-tight">Forgot Password</h1>
                  <p className="text-sm text-text-muted mt-1">Enter your registered email address</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleSendCode}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="fp-email" className="text-sm font-medium text-text">Email address</label>
                    <input
                      id="fp-email"
                      type="email"
                      value={email}
                      onChange={(e) => { setEmail(e.target.value); setEmailError(''); }}
                      placeholder="you@example.com"
                      autoComplete="email"
                      className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                    />
                    {emailError && <p className="text-xs text-danger mt-0.5">{emailError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={sendLoading}
                    className="mt-1 h-12 w-full rounded-lg bg-primary font-bold text-base text-[#0b1410] hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {sendLoading ? (
                      <span className="w-5 h-5 border-2 border-[#0b1410]/30 border-t-[#0b1410] rounded-full animate-spin" />
                    ) : 'Send Reset Code'}
                  </button>
                </form>

                <div className="mt-6 text-center">
                  <Link href="/login" className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors">
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back to Login
                  </Link>
                </div>
              </>
            )}

            {/* ── Step 2: Verify OTP ── */}
            {step === 2 && (
              <>
                <div className="mb-8">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary">
                      <rect x="3" y="4" width="18" height="16" rx="2" />
                      <path d="M3 9h18M9 15l2 2 4-4" />
                    </svg>
                  </div>
                  <h1 className="text-[1.65rem] font-bold text-text leading-tight">Check your email</h1>
                  <p className="text-sm text-text-muted mt-1">
                    We sent a 6-digit code to{' '}
                    <span className="font-medium text-text">{email}</span>
                  </p>
                </div>

                <form className="flex flex-col gap-6" onSubmit={handleVerify}>
                  {/* OTP boxes */}
                  <div className="flex flex-col gap-2">
                    <div className="flex gap-2 justify-between">
                      {otp.map((digit, i) => (
                        <input
                          key={i}
                          ref={(el) => { otpRefs.current[i] = el; }}
                          type="text"
                          inputMode="numeric"
                          maxLength={1}
                          value={digit}
                          onChange={(e) => handleOtpChange(i, e.target.value)}
                          onKeyDown={(e) => handleOtpKeyDown(i, e)}
                          onPaste={i === 0 ? handleOtpPaste : undefined}
                          className="w-full aspect-square max-w-[46px] rounded-lg border border-border bg-surface text-center text-lg font-bold text-text focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow caret-transparent"
                        />
                      ))}
                    </div>
                    {otpError && <p className="text-xs text-danger">{otpError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={verifyLoading}
                    className="h-12 w-full rounded-lg bg-primary font-bold text-base text-[#0b1410] hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {verifyLoading ? (
                      <span className="w-5 h-5 border-2 border-[#0b1410]/30 border-t-[#0b1410] rounded-full animate-spin" />
                    ) : 'Verify Code'}
                  </button>
                </form>

                <div className="mt-5 flex flex-col items-center gap-3">
                  <p className="text-sm text-text-muted">
                    Didn&apos;t receive it?{' '}
                    {resendSeconds > 0 ? (
                      <span className="text-text-muted">Resend in {resendSeconds}s</span>
                    ) : (
                      <button
                        onClick={handleResend}
                        disabled={sendLoading}
                        className="text-primary hover:opacity-75 transition-opacity font-medium disabled:opacity-50"
                      >
                        {sendLoading ? 'Sending…' : 'Resend Code'}
                      </button>
                    )}
                  </p>
                  <button
                    onClick={() => setStep(1)}
                    className="inline-flex items-center gap-1.5 text-sm text-text-muted hover:text-text transition-colors"
                  >
                    <ArrowLeft className="h-3.5 w-3.5" />
                    Back
                  </button>
                </div>
              </>
            )}

            {/* ── Step 3: New password ── */}
            {step === 3 && (
              <>
                <div className="mb-8">
                  <div className="w-11 h-11 rounded-2xl bg-primary/10 flex items-center justify-center mb-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5 text-primary">
                      <rect x="3" y="11" width="18" height="11" rx="2" />
                      <path d="M7 11V7a5 5 0 0 1 10 0v4" />
                    </svg>
                  </div>
                  <h1 className="text-[1.65rem] font-bold text-text leading-tight">Set new password</h1>
                  <p className="text-sm text-text-muted mt-1">Choose a password you haven&apos;t used before</p>
                </div>

                <form className="flex flex-col gap-5" onSubmit={handleReset}>
                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="new-pw" className="text-sm font-medium text-text">New Password</label>
                    <div className="relative">
                      <input
                        id="new-pw"
                        type={showNew ? 'text' : 'password'}
                        value={newPw}
                        onChange={(e) => { setNewPw(e.target.value); setPwError(''); }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-11 w-full rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowNew((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                        aria-label={showNew ? 'Hide password' : 'Show password'}
                      >
                        {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    <p className="text-xs text-text-muted">Minimum 8 characters</p>
                  </div>

                  <div className="flex flex-col gap-1.5">
                    <label htmlFor="confirm-pw" className="text-sm font-medium text-text">Confirm Password</label>
                    <div className="relative">
                      <input
                        id="confirm-pw"
                        type={showConfirm ? 'text' : 'password'}
                        value={confirmPw}
                        onChange={(e) => { setConfirmPw(e.target.value); setPwError(''); }}
                        placeholder="••••••••"
                        autoComplete="new-password"
                        className="h-11 w-full rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirm((v) => !v)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                        aria-label={showConfirm ? 'Hide password' : 'Show password'}
                      >
                        {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                      </button>
                    </div>
                    {pwError && <p className="text-xs text-danger mt-0.5">{pwError}</p>}
                  </div>

                  <button
                    type="submit"
                    disabled={resetLoading}
                    className="mt-1 h-12 w-full rounded-lg bg-primary font-bold text-base text-[#0b1410] hover:bg-primary/90 active:scale-[0.99] transition-all disabled:opacity-60 disabled:cursor-not-allowed flex items-center justify-center gap-2"
                  >
                    {resetLoading ? (
                      <span className="w-5 h-5 border-2 border-[#0b1410]/30 border-t-[#0b1410] rounded-full animate-spin" />
                    ) : 'Reset Password'}
                  </button>
                </form>
              </>
            )}

          </div>
        </div>
      </div>
    </div>
  );
}
