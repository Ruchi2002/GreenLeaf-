'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import Link from 'next/link';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { AuthLeftPanel } from '@/components/layout/AuthLeftPanel';

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_CREDENTIALS = [
  { id: 'member@greenleaf.com', password: 'Member@123', role: 'member' as const },
  { id: 'sc@greenleaf.com',     password: 'SC@123',     role: 'sc'     as const },
];

export default function LoginPage() {
  const router = useRouter();
  const [userId,       setUserId]       = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe,   setRememberMe]   = useState(false);
  const [error,        setError]        = useState('');
  const [isDark,       setIsDark]       = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gl-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('gl-theme', next ? 'dark' : 'light');
  }

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    const match = MOCK_CREDENTIALS.find(
      (c) => c.id === userId.trim() && c.password === password
    );
    if (!match) {
      setError('Invalid ID or password');
      return;
    }
    // MOCK ONLY — BACKEND_REQUIRED_LATER
    localStorage.setItem('gl-role', match.role);
    router.push(match.role === 'sc' ? '/sc/dashboard' : '/dashboard');
  }

  return (
    <div className="flex min-h-screen">
      <AuthLeftPanel />

      {/* Right form panel */}
      <div className="flex-1 bg-background flex flex-col min-h-screen md:min-h-0">

        {/* Mobile header — logo + theme toggle */}
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

        {/* Centered form */}
        <div className="flex-1 flex items-center justify-center px-4 sm:px-8 pb-8 sm:pb-16">
          <div className="w-full max-w-[340px]">

            <div className="mb-8">
              <h1 className="text-[1.65rem] font-bold text-text leading-tight">Welcome back</h1>
              <p className="text-sm text-text-muted mt-1">Log in to your Greenleaf account</p>
            </div>

            <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="user-id" className="text-sm font-medium text-text">
                  Email
                </label>
                <input
                  id="user-id"
                  type="email"
                  value={userId}
                  onChange={(e) => { setUserId(e.target.value); setError(''); }}
                  placeholder="you@greenleaf.com"
                  autoComplete="email"
                  className="h-11 w-full rounded-lg border border-border bg-surface px-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                />
              </div>

              <div className="flex flex-col gap-1.5">
                <label htmlFor="password" className="text-sm font-medium text-text">
                  Password
                </label>
                <div className="relative">
                  <input
                    id="password"
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => { setPassword(e.target.value); setError(''); }}
                    placeholder="••••••••"
                    autoComplete="current-password"
                    className="h-11 w-full rounded-lg border border-border bg-surface px-3 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword((v) => !v)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text transition-colors"
                    aria-label={showPassword ? 'Hide password' : 'Show password'}
                  >
                    {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                  </button>
                </div>
              </div>

              {error && (
                <p className="text-sm text-danger bg-danger/10 border border-danger/20 rounded-lg px-3 py-2.5">
                  {error}
                </p>
              )}

              <div className="flex items-center justify-between">
                <label className="flex items-center gap-2 text-sm text-text-muted cursor-pointer select-none">
                  <input
                    type="checkbox"
                    checked={rememberMe}
                    onChange={(e) => setRememberMe(e.target.checked)}
                    className="h-4 w-4 rounded border-border accent-primary cursor-pointer"
                  />
                  Remember me
                </label>
                <Link
                  href="/forgot-password"
                  className="text-sm text-info hover:opacity-75 transition-opacity"
                >
                  Forgot password?
                </Link>
              </div>

              <button
                type="submit"
                className="mt-1 h-12 w-full rounded-lg bg-primary font-bold text-base text-[#0b1410] hover:bg-primary/90 active:scale-[0.99] transition-all"
              >
                Log In
              </button>
            </form>

            {/* Mock hint */}
            <div className="mt-6 bg-surface border border-border rounded-xl p-4">
              <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">Demo credentials</p>
              <p className="text-xs text-text-muted font-mono">Member: member@greenleaf.com / Member@123</p>
              <p className="text-xs text-text-muted font-mono mt-1">SC: &nbsp;&nbsp;&nbsp;&nbsp;sc@greenleaf.com / SC@123</p>
            </div>

            <p className="mt-4 text-center text-xs text-text-muted">
              New member? Register through your nearest Service Center
            </p>

          </div>
        </div>
      </div>
    </div>
  );
}
