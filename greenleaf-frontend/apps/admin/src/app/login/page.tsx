'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';

const ADMIN_EMAIL    = 'admin@greenleaf.com';
const ADMIN_PASSWORD = 'Admin@123';

export default function AdminLoginPage() {
  const router = useRouter();
  const [email,        setEmail]        = useState('');
  const [password,     setPassword]     = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error,        setError]        = useState('');
  const [isDark,       setIsDark]       = useState(false);

  useEffect(() => {
    // Redirect if already logged in
    if (localStorage.getItem('gl-admin-token')) {
      router.replace('/dashboard');
      return;
    }
    const saved       = localStorage.getItem('gl-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const dark        = saved ? saved === 'dark' : prefersDark;
    setIsDark(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, [router]);

  function toggleTheme() {
    const next = !isDark;
    setIsDark(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('gl-theme', next ? 'dark' : 'light');
  }

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (email.trim() === ADMIN_EMAIL && password === ADMIN_PASSWORD) {
      localStorage.setItem('gl-admin-token', 'mock-admin-token');
      router.push('/dashboard');
    } else {
      setError('Invalid email or password');
    }
  }

  return (
    <div className="min-h-screen bg-background flex items-center justify-center px-4">

      {/* Theme toggle — top right */}
      <button
        onClick={toggleTheme}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
        className="fixed top-4 right-4 text-text-muted hover:text-text transition-colors"
      >
        {isDark ? <Sun className="h-5 w-5" /> : <Moon className="h-5 w-5" />}
      </button>

      <div className="w-full max-w-[380px]">

        {/* Logo + heading */}
        <div className="flex flex-col items-center mb-8">
          <div className="flex items-center gap-2 mb-6">
            <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className="h-8 w-8 text-primary">
              <path d="M50 8 C20 28 20 88 50 108 C80 88 80 28 50 8 Z" fill="currentColor" />
            </svg>
            <span className="text-xl font-bold text-text tracking-tight">Greenleaf</span>
          </div>
          <h1 className="text-[1.65rem] font-bold text-text leading-tight">Admin Login</h1>
          <p className="text-sm text-text-muted mt-1">Sign in to the admin panel</p>
        </div>

        {/* Card */}
        <div className="bg-surface border border-border rounded-2xl p-6 shadow-sm">
          <form className="flex flex-col gap-5" onSubmit={handleSubmit}>

            <div className="flex flex-col gap-1.5">
              <label htmlFor="email" className="text-sm font-medium text-text">
                Email
              </label>
              <input
                id="email"
                type="email"
                value={email}
                onChange={(e) => { setEmail(e.target.value); setError(''); }}
                placeholder="admin@greenleaf.com"
                autoComplete="email"
                className="h-11 w-full rounded-lg border border-border bg-background px-3 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
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
                  className="h-11 w-full rounded-lg border border-border bg-background px-3 pr-10 text-sm text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
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

            <button
              type="submit"
              className="mt-1 h-12 w-full rounded-lg bg-primary font-bold text-base text-[#0b1410] hover:bg-primary/90 active:scale-[0.99] transition-all"
            >
              Log In
            </button>
          </form>
        </div>

        {/* Mock hint */}
        <div className="mt-4 bg-surface border border-border rounded-xl p-4">
          <p className="text-[11px] font-bold text-text-muted uppercase tracking-widest mb-2">Demo credentials</p>
          <p className="text-xs text-text-muted font-mono">admin@greenleaf.com / Admin@123</p>
        </div>

      </div>
    </div>
  );
}
