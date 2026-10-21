'use client';

import { useEffect, useRef, useState, useCallback } from 'react';
import Link from 'next/link';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

// ── Theme hook ────────────────────────────────────────────────────────────────

function useLandingTheme() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    const saved = localStorage.getItem('gl-theme');
    const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
    const isDark = saved ? saved === 'dark' : prefersDark;
    setDark(isDark);
    document.documentElement.classList.toggle('dark', isDark);
  }, []);

  const toggle = useCallback(() => {
    setDark((prev) => {
      const next = !prev;
      document.documentElement.classList.toggle('dark', next);
      localStorage.setItem('gl-theme', next ? 'dark' : 'light');
      return next;
    });
  }, []);

  return { dark, toggle };
}

// ── Helpers ───────────────────────────────────────────────────────────────────

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

// ── Data ─────────────────────────────────────────────────────────────────────

const STATS = [
  { value: 50000, label: 'Active Members',   suffix: '+',   icon: '👥' },
  { value: 120,   label: '₹ Crore Paid Out', suffix: 'Cr+', prefix: '₹', icon: '💰' },
  { value: 500,   label: 'Service Centers',  suffix: '+',   icon: '🏪' },
  { value: 4,     label: 'Years Strong',     suffix: '',    icon: '⭐' },
];

const STEPS = [
  {
    num: '01',
    title: 'Register & Get Your Kit',
    desc: 'Sign up online in minutes. Choose your starter kit and receive it at your doorstep within 3 business days.',
    icon: '📦',
    color: 'from-emerald-500 to-green-600',
  },
  {
    num: '02',
    title: 'Build Your Network',
    desc: 'Invite friends and family. Use our binary placement system to grow your left and right teams strategically.',
    icon: '🌱',
    color: 'from-teal-500 to-emerald-600',
  },
  {
    num: '03',
    title: 'Earn Bonuses Monthly',
    desc: 'Get paid every month — retail profits, binary bonuses, leadership rewards and car fund incentives.',
    icon: '💎',
    color: 'from-green-500 to-teal-600',
  },
];

const PRODUCTS = [
  { name: 'Starter Kit Pro', price: '₹1,20,000', pv: 120, icon: '🌿', tag: 'Best Seller' },
  { name: 'Health Bundle',   price: '₹85,000',   pv: 80,  icon: '💊', tag: 'Popular' },
  { name: 'Beauty Pack',     price: '₹65,000',   pv: 60,  icon: '✨', tag: 'New' },
];

const TESTIMONIALS = [
  { name: 'Priya Sharma',  city: 'Mumbai',    earning: '₹45,000/month', text: 'In just 6 months, my Greenleaf income matched my coRPorate salary. The binary system is transparent and the support team is always there for you.' },
  { name: 'Rahul Verma',   city: 'Delhi',     earning: '₹1.2L/month',  text: 'Built a team of 150+ members across North India. The monthly bonuses keep growing. Best decision I ever made for my family\'s future.' },
  { name: 'Anjali Singh',  city: 'Bangalore', earning: '₹28,000/month', text: 'I started as a homemaker with zero business experience. Today I have a steady income and a financial independence I never imagined possible.' },
  { name: 'Deepak Patel',  city: 'Ahmedabad', earning: '₹2.1L/month',  text: 'The products sell themselves because they are genuinely premium. Greenleaf is the most honest network marketing company I have ever come across.' },
];

const NAV_LINKS = ['Home', 'About', 'Products', 'Join Us'] as const;

// ── LeafParticle (CSS animated) ───────────────────────────────────────────────

function LeafParticle({ top, left, dur, delay }: { top: string; left: string; dur: string; delay: string }) {
  return (
    <div
      className="absolute pointer-events-none select-none opacity-0"
      style={{ top, left, animation: `leaf-float ${dur} ${delay} ease-in-out infinite` }}
    >
      <svg viewBox="0 0 24 24" fill="currentColor" className="w-5 h-5 text-primary/30">
        <path d="M17 8C8 10 5.9 16.17 3.82 22L5.71 22C6.71 17.12 10.22 12.84 17 10.5V14L21 9L17 4V8Z" />
      </svg>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function LandingPage() {
  const { dark, toggle } = useLandingTheme();
  const [menuOpen, setMenuOpen] = useState(false);

  // Refs for GSAP
  const navRef      = useRef<HTMLElement>(null);
  const heroRef     = useRef<HTMLDivElement>(null);
  const headlineRef = useRef<HTMLHeadingElement>(null);
  const subRef      = useRef<HTMLParagraphElement>(null);
  const ctaRef      = useRef<HTMLDivElement>(null);
  const cardRef     = useRef<HTMLDivElement>(null);
  const statsRef    = useRef<HTMLDivElement>(null);
  const stepsRef    = useRef<HTMLDivElement>(null);
  const productsRef = useRef<HTMLDivElement>(null);
  const testimonialsRef = useRef<HTMLDivElement>(null);
  const counterRefs = useRef<(HTMLSpanElement | null)[]>([]);

  // Testimonial carousel
  const trackRef       = useRef<HTMLDivElement>(null);
  const carouselAnim   = useRef<gsap.core.Tween | null>(null);

  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);
    if (prefersReducedMotion()) return;

    const ctx = gsap.context(() => {
      // ── Navbar reveal ───────────────────────────────────────────────────────
      gsap.from(navRef.current, {
        y: -80,
        opacity: 0,
        duration: 0.9,
        ease: 'power3.out',
      });

      // ── Hero stagger ────────────────────────────────────────────────────────
      const tl = gsap.timeline({ delay: 0.4 });
      tl.from(headlineRef.current, {
        y: 60,
        opacity: 0,
        duration: 1,
        ease: 'power4.out',
      })
        .from(subRef.current, { y: 40, opacity: 0, duration: 0.8, ease: 'power3.out' }, '-=0.5')
        .from(ctaRef.current,  { y: 30, opacity: 0, duration: 0.7, ease: 'power3.out' }, '-=0.5')
        .from(cardRef.current, { x: 60, opacity: 0, duration: 0.9, ease: 'back.out(1.4)' }, '-=0.6');

      // ── Stats counter ────────────────────────────────────────────────────────
      counterRefs.current.forEach((el, i) => {
        if (!el) return;
        const target = STATS[i]?.value ?? 0;
        const obj = { val: 0 };
        gsap.to(obj, {
          val: target,
          duration: 2,
          ease: 'power2.out',
          scrollTrigger: {
            trigger: statsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
          onUpdate: () => {
            el.textContent = target >= 10000
              ? Math.round(obj.val).toLocaleString('en-IN')
              : String(Math.round(obj.val));
          },
        });
      });

      // ── How it works ─────────────────────────────────────────────────────────
      const steps = stepsRef.current?.querySelectorAll('.step-card');
      steps?.forEach((card, i) => {
        gsap.from(card, {
          x: i % 2 === 0 ? -80 : 80,
          opacity: 0,
          duration: 0.9,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: card,
            start: 'top 85%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── Products ─────────────────────────────────────────────────────────────
      const productCards = productsRef.current?.querySelectorAll('.product-card');
      productCards?.forEach((card, i) => {
        gsap.from(card, {
          y: 60,
          opacity: 0,
          scale: 0.92,
          duration: 0.8,
          delay: i * 0.12,
          ease: 'power3.out',
          scrollTrigger: {
            trigger: productsRef.current,
            start: 'top 80%',
            toggleActions: 'play none none none',
          },
        });
      });

      // ── Testimonials infinite scroll ─────────────────────────────────────────
      const track = trackRef.current;
      if (track) {
        const totalW = track.scrollWidth / 2;
        carouselAnim.current = gsap.to(track, {
          x: `-=${totalW}`,
          duration: 28,
          ease: 'none',
          repeat: -1,
          modifiers: {
            x: (x) => `${parseFloat(x) % totalW}px`,
          },
        });
        track.addEventListener('mouseenter', () => carouselAnim.current?.pause());
        track.addEventListener('mouseleave', () => carouselAnim.current?.play());
      }
    });

    return () => ctx.revert();
  }, []);

  // Leaf particles config (generated once)
  const particles = Array.from({ length: 12 }, (_, i) => ({
    top:   `${8 + (i * 7) % 82}%`,
    left:  `${3 + (i * 11) % 92}%`,
    dur:   `${5 + (i % 4)}s`,
    delay: `${((i * 0.7) % 4).toFixed(1)}s`,
  }));

  return (
    <div className="min-h-screen bg-background text-text overflow-x-hidden">
      <style>{`
        @keyframes leaf-float {
          0%, 100% { transform: translateY(0px) rotate(0deg); opacity: 0.4; }
          25%       { transform: translateY(-18px) rotate(12deg); opacity: 0.6; }
          50%       { transform: translateY(-8px) rotate(-8deg); opacity: 0.5; }
          75%       { transform: translateY(-22px) rotate(6deg); opacity: 0.7; }
        }
        @keyframes shimmer {
          0%   { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
        @keyframes pulse-ring {
          0%   { transform: scale(1); opacity: 0.6; }
          100% { transform: scale(1.8); opacity: 0; }
        }
        @media (prefers-reduced-motion: reduce) {
          * { animation-duration: 0.01ms !important; transition-duration: 0.01ms !important; }
        }
      `}</style>

      {/* ── Navbar ─────────────────────────────────────────────────────────── */}
      <nav
        ref={navRef}
        className="fixed top-0 left-0 right-0 z-50 backdrop-blur-md bg-background/80 border-b border-border"
      >
        <div className="max-w-7xl mx-auto px-5 sm:px-8 h-16 flex items-center justify-between gap-4">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
              <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                <path d="M17 8C8 10 5.9 16.17 3.82 22L5.71 22C6.71 17.12 10.22 12.84 17 10.5V14L21 9L17 4V8Z" />
              </svg>
            </div>
            <span className="font-bold text-base text-text tracking-tight">Greenleaf</span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden md:flex items-center gap-6 text-sm font-medium text-text-muted">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                className="hover:text-primary transition-colors"
              >
                {link}
              </a>
            ))}
          </div>

          {/* Right controls */}
          <div className="flex items-center gap-2.5">
            {/* Theme toggle */}
            <button
              onClick={toggle}
              aria-label="Toggle theme"
              className="w-9 h-9 rounded-full flex items-center justify-center text-text-muted hover:text-primary hover:bg-primary-soft transition-all"
            >
              {dark ? (
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="w-4.5 h-4.5 w-[18px] h-[18px]">
                  <circle cx="12" cy="12" r="5" /><line x1="12" y1="1" x2="12" y2="3" /><line x1="12" y1="21" x2="12" y2="23" />
                  <line x1="4.22" y1="4.22" x2="5.64" y2="5.64" /><line x1="18.36" y1="18.36" x2="19.78" y2="19.78" />
                  <line x1="1" y1="12" x2="3" y2="12" /><line x1="21" y1="12" x2="23" y2="12" />
                  <line x1="4.22" y1="19.78" x2="5.64" y2="18.36" /><line x1="18.36" y1="5.64" x2="19.78" y2="4.22" />
                </svg>
              ) : (
                <svg viewBox="0 0 24 24" fill="currentColor" className="w-[18px] h-[18px]">
                  <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z" />
                </svg>
              )}
            </button>

            {/* Login CTA */}
            <Link
              href="/login"
              className="hidden sm:flex items-center gap-1.5 bg-primary text-[#0b1410] font-semibold text-sm px-4 py-2 rounded-full hover:opacity-90 transition-all active:scale-95"
            >
              Login
            </Link>

            {/* Mobile hamburger */}
            <button
              onClick={() => setMenuOpen((v) => !v)}
              aria-label="Toggle menu"
              className="md:hidden w-9 h-9 rounded-full flex flex-col items-center justify-center gap-1 hover:bg-primary-soft transition-all"
            >
              <span className={`w-4.5 w-[18px] h-[1.5px] bg-text rounded-full transition-all duration-300 ${menuOpen ? 'rotate-45 translate-y-[5px]' : ''}`} />
              <span className={`w-4.5 w-[18px] h-[1.5px] bg-text rounded-full transition-all duration-300 ${menuOpen ? 'opacity-0' : ''}`} />
              <span className={`w-4.5 w-[18px] h-[1.5px] bg-text rounded-full transition-all duration-300 ${menuOpen ? '-rotate-45 -translate-y-[5px]' : ''}`} />
            </button>
          </div>
        </div>

        {/* Mobile drawer */}
        <div className={`md:hidden overflow-hidden transition-all duration-300 ${menuOpen ? 'max-h-64' : 'max-h-0'}`}>
          <div className="px-5 pb-5 pt-1 flex flex-col gap-3 border-t border-border bg-surface">
            {NAV_LINKS.map((link) => (
              <a
                key={link}
                href={`#${link.toLowerCase().replace(' ', '-')}`}
                onClick={() => setMenuOpen(false)}
                className="text-sm font-medium text-text-muted hover:text-primary py-1 transition-colors"
              >
                {link}
              </a>
            ))}
            <Link
              href="/login"
              onClick={() => setMenuOpen(false)}
              className="mt-1 bg-primary text-[#0b1410] font-semibold text-sm px-4 py-2.5 rounded-full text-center"
            >
              Login
            </Link>
          </div>
        </div>
      </nav>

      {/* ── Hero ───────────────────────────────────────────────────────────── */}
      <section
        id="home"
        ref={heroRef}
        className="relative min-h-screen flex items-center pt-16 overflow-hidden"
      >
        {/* Gradient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#0a1f13] via-[#0d2b1a] to-[#0b1410] dark:from-[#071209] dark:via-[#0a1a10] dark:to-[#040d08]" />
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_80%_50%_at_50%_-10%,rgba(52,194,116,0.15),transparent)]" />

        {/* Leaf particles */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          {particles.map((p, i) => (
            <LeafParticle key={i} top={p.top} left={p.left} dur={p.dur} delay={p.delay} />
          ))}
        </div>

        {/* Grid lines decoration */}
        <div className="absolute inset-0 opacity-[0.04]"
          style={{ backgroundImage: 'linear-gradient(rgba(52,194,116,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,194,116,1) 1px, transparent 1px)', backgroundSize: '64px 64px' }}
        />

        <div className="relative max-w-7xl mx-auto px-5 sm:px-8 py-24 flex flex-col lg:flex-row items-center gap-16 w-full">
          {/* Left text */}
          <div className="flex-1 text-center lg:text-left">
            <div className="inline-flex items-center gap-2 bg-primary/20 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-xs font-semibold mb-7">
              <span className="w-1.5 h-1.5 rounded-full bg-primary animate-pulse" />
              India&apos;s #1 Health &amp; Beauty Network
            </div>

            <h1
              ref={headlineRef}
              className="text-4xl sm:text-5xl lg:text-6xl xl:text-7xl font-extrabold leading-[1.08] tracking-tight text-white mb-6"
            >
              Grow Together,
              <br />
              <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34c274] to-[#6ee7a0]">
                Earn Together
              </span>
            </h1>

            <p
              ref={subRef}
              className="text-base sm:text-lg text-white/60 max-w-xl mx-auto lg:mx-0 mb-9 leading-relaxed"
            >
              Join India&apos;s fastest growing health &amp; beauty network.
              Build your team, earn bonuses, change lives.
            </p>

            <div ref={ctaRef} className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-3">
              <Link
                href="/login"
                className="group relative w-full sm:w-auto bg-primary text-[#0b1410] font-bold text-base px-8 py-3.5 rounded-full hover:opacity-90 transition-all active:scale-95 overflow-hidden"
              >
                <span className="relative z-10">Join Now</span>
                <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
              </Link>
              <a
                href="#how-it-works"
                className="w-full sm:w-auto border border-white/30 text-white font-semibold text-base px-8 py-3.5 rounded-full hover:bg-white/10 transition-all"
              >
                Learn More
              </a>
            </div>
          </div>

          {/* Right — floating earnings card */}
          <div className="lg:flex-shrink-0 w-full max-w-xs lg:max-w-sm" ref={cardRef}>
            <div className="relative">
              {/* Glow ring */}
              <div className="absolute inset-0 rounded-3xl bg-primary/20 blur-2xl scale-110" />

              <div className="relative bg-white/10 backdrop-blur-xl border border-white/20 rounded-3xl p-6 shadow-2xl">
                <div className="flex items-center justify-between mb-4">
                  <p className="text-white/60 text-xs font-medium">This Month&apos;s Earnings</p>
                  <span className="bg-green-500/20 text-green-400 text-[10px] font-bold px-2 py-0.5 rounded-full">+18%</span>
                </div>

                <p className="text-3xl font-extrabold text-white mb-1">₹2.84L</p>
                <p className="text-white/40 text-xs mb-5">earned this month</p>

                <div className="flex gap-3 mb-5">
                  {[
                    { label: 'Binary', val: '₹1.20L',  color: 'bg-green-500' },
                    { label: 'Retail', val: '₹98,000', color: 'bg-teal-500' },
                    { label: 'Leader', val: '₹66,000', color: 'bg-emerald-400' },
                  ].map((item) => (
                    <div key={item.label} className="flex-1 bg-white/5 rounded-xl p-2.5 text-center">
                      <p className="text-[10px] text-white/50 mb-1">{item.label}</p>
                      <p className="text-xs font-bold text-white">{item.val}</p>
                    </div>
                  ))}
                </div>

                {/* Mini bar chart */}
                <div className="flex items-end gap-1.5 h-12">
                  {[40, 55, 45, 70, 60, 85, 100].map((h, i) => (
                    <div
                      key={i}
                      className="flex-1 bg-primary/60 rounded-t-sm transition-all duration-1000"
                      style={{ height: `${h}%`, animationDelay: `${i * 0.1}s` }}
                    />
                  ))}
                </div>
                <p className="text-white/30 text-[10px] mt-1.5">Last 7 months</p>

                {/* Member info */}
                <div className="mt-4 pt-4 border-t border-white/10 flex items-center gap-2.5">
                  <div className="w-8 h-8 rounded-full bg-gradient-to-br from-green-400 to-emerald-600 flex items-center justify-center text-[11px] font-bold text-white">PS</div>
                  <div>
                    <p className="text-white text-xs font-semibold">Priya Sharma</p>
                    <p className="text-white/40 text-[10px]">Gold Member · Mumbai</p>
                  </div>
                  <div className="ml-auto">
                    <div className="relative w-2 h-2">
                      <span className="absolute inset-0 rounded-full bg-green-400 animate-ping opacity-75" />
                      <span className="relative block w-2 h-2 rounded-full bg-green-400" />
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Scroll indicator */}
        <div className="absolute bottom-8 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 text-white/30">
          <span className="text-[10px] tracking-widest font-semibold uppercase">Scroll</span>
          <div className="w-px h-8 bg-gradient-to-b from-white/30 to-transparent animate-pulse" />
        </div>
      </section>

      {/* ── Stats ──────────────────────────────────────────────────────────── */}
      <section id="about" className="py-20 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div
            ref={statsRef}
            className="grid grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-6"
          >
            {STATS.map((stat, i) => (
              <div
                key={stat.label}
                className="group bg-background border border-border rounded-2xl p-6 text-center hover:border-primary/40 hover:shadow-lg hover:shadow-primary/5 transition-all duration-300"
              >
                <div className="text-3xl mb-3">{stat.icon}</div>
                <p className="text-2xl sm:text-3xl font-extrabold text-text">
                  {stat.prefix ?? ''}
                  <span ref={(el) => { counterRefs.current[i] = el; }}>0</span>
                  {stat.suffix}
                </p>
                <p className="text-xs sm:text-sm text-text-muted mt-1.5 font-medium">{stat.label}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── How It Works ───────────────────────────────────────────────────── */}
      <section id="how-it-works" className="py-24 bg-background">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Simple Process</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-3">How It Works</h2>
            <p className="text-text-muted mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Three steps to financial freedom. Start your journey today.
            </p>
          </div>

          <div ref={stepsRef} className="grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
            {STEPS.map((step, i) => (
              <div
                key={step.num}
                className="step-card group relative bg-surface border border-border rounded-3xl p-7 hover:border-primary/40 hover:-translate-y-1 hover:shadow-xl hover:shadow-primary/8 transition-all duration-300"
              >
                <div className={`w-12 h-12 rounded-2xl bg-gradient-to-br ${step.color} flex items-center justify-center text-2xl mb-5 group-hover:scale-110 transition-transform duration-300`}>
                  {step.icon}
                </div>
                <span className="text-[11px] font-bold tracking-widest text-primary/50 uppercase">{step.num}</span>
                <h3 className="text-lg font-bold text-text mt-1 mb-3">{step.title}</h3>
                <p className="text-sm text-text-muted leading-relaxed">{step.desc}</p>

                {i < 2 && (
                  <div className="hidden md:block absolute -right-5 top-1/2 -translate-y-1/2 z-10">
                    <svg width="10" height="18" viewBox="0 0 10 18" fill="none">
                      <path d="M1 1L9 9L1 17" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="text-primary/40" />
                    </svg>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Products ───────────────────────────────────────────────────────── */}
      <section id="products" className="py-24 bg-surface">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="text-center mb-14">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Our Range</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-3">Featured Products</h2>
            <p className="text-text-muted mt-3 max-w-md mx-auto text-sm leading-relaxed">
              Premium health &amp; beauty products backed by science. Every purchase earns you PV.
            </p>
          </div>

          <div ref={productsRef} className="grid grid-cols-1 sm:grid-cols-3 gap-6">
            {PRODUCTS.map((p) => (
              <div
                key={p.name}
                className="product-card group bg-background border border-border rounded-3xl p-7 flex flex-col gap-4 hover:border-primary/50 hover:-translate-y-1.5 hover:shadow-xl hover:shadow-primary/10 transition-all duration-300 cursor-pointer"
              >
                <div className="flex items-start justify-between">
                  <div className="w-14 h-14 rounded-2xl bg-primary-soft flex items-center justify-center text-3xl group-hover:scale-110 transition-transform duration-300">
                    {p.icon}
                  </div>
                  <span className="text-[10px] font-bold bg-primary/10 text-primary px-2.5 py-1 rounded-full">{p.tag}</span>
                </div>
                <div>
                  <h3 className="font-bold text-text text-base">{p.name}</h3>
                  <p className="text-2xl font-extrabold text-text mt-1">{p.price}</p>
                </div>
                <div className="flex items-center justify-between mt-auto pt-3 border-t border-border">
                  <div className="flex items-center gap-1.5">
                    <div className="w-5 h-5 rounded-full bg-primary flex items-center justify-center">
                      <svg viewBox="0 0 24 24" fill="white" className="w-3 h-3">
                        <path d="M17 8C8 10 5.9 16.17 3.82 22L5.71 22C6.71 17.12 10.22 12.84 17 10.5V14L21 9L17 4V8Z" />
                      </svg>
                    </div>
                    <span className="text-sm font-bold text-primary">{p.pv} PV</span>
                  </div>
                  <span className="text-xs text-text-muted">per purchase</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── Testimonials ───────────────────────────────────────────────────── */}
      <section id="join-us" className="py-24 bg-background overflow-hidden">
        <div className="max-w-7xl mx-auto px-5 sm:px-8 mb-12">
          <div className="text-center">
            <span className="text-xs font-bold tracking-widest text-primary uppercase">Real Stories</span>
            <h2 className="text-3xl sm:text-4xl font-extrabold text-text mt-3">What Our Members Say</h2>
          </div>
        </div>

        {/* Carousel — GSAP animated */}
        <div className="overflow-hidden" ref={testimonialsRef}>
          <div ref={trackRef} className="flex gap-5 w-max">
            {[...TESTIMONIALS, ...TESTIMONIALS].map((t, i) => (
              <div
                key={i}
                className="w-[320px] sm:w-[360px] shrink-0 bg-surface border border-border rounded-3xl p-6 flex flex-col gap-4"
              >
                <div className="flex gap-0.5">
                  {Array.from({ length: 5 }).map((_, s) => (
                    <svg key={s} viewBox="0 0 20 20" fill="currentColor" className="w-4 h-4 text-[#f5c451]">
                      <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                    </svg>
                  ))}
                </div>
                <p className="text-sm text-text-muted leading-relaxed flex-1">&ldquo;{t.text}&rdquo;</p>
                <div className="flex items-center justify-between pt-3 border-t border-border">
                  <div className="flex items-center gap-2.5">
                    <div className="w-9 h-9 rounded-full bg-gradient-to-br from-primary to-forest flex items-center justify-center text-xs font-bold text-[#0b1410]">
                      {t.name.split(' ').map((w) => w[0]).join('').slice(0, 2)}
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-text">{t.name}</p>
                      <p className="text-xs text-text-muted">{t.city}</p>
                    </div>
                  </div>
                  <span className="text-xs font-bold text-primary bg-primary-soft px-2.5 py-1 rounded-full">{t.earning}</span>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA Banner ─────────────────────────────────────────────────────── */}
      <section className="py-24 bg-gradient-to-r from-[#0a1f13] via-[#0f3320] to-[#0a1f13] relative overflow-hidden">
        <div className="absolute inset-0 bg-[radial-gradient(ellipse_60%_80%_at_50%_50%,rgba(52,194,116,0.12),transparent)]" />
        <div className="absolute inset-0 opacity-5"
          style={{ backgroundImage: 'linear-gradient(rgba(52,194,116,1) 1px, transparent 1px), linear-gradient(90deg, rgba(52,194,116,1) 1px, transparent 1px)', backgroundSize: '40px 40px' }}
        />

        <div className="relative max-w-3xl mx-auto px-5 sm:px-8 text-center">
          <h2 className="text-3xl sm:text-5xl font-extrabold text-white mb-5 leading-tight">
            Ready to Start Your
            <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-[#34c274] to-[#6ee7a0]">Journey?</span>
          </h2>
          <p className="text-white/50 text-base mb-10 max-w-md mx-auto leading-relaxed">
            Join 50,000+ members already building their futures with Greenleaf.
          </p>
          <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
            <Link
              href="/login"
              className="group relative w-full sm:w-auto bg-primary text-[#0b1410] font-bold text-lg px-10 py-4 rounded-full hover:opacity-90 transition-all active:scale-95 overflow-hidden"
            >
              <span className="relative z-10">Join Now — It&apos;s Free</span>
              <span className="absolute inset-0 bg-white/20 -translate-x-full group-hover:translate-x-full transition-transform duration-500" />
            </Link>
            <Link
              href="/login"
              className="text-white/60 hover:text-white text-sm font-medium transition-colors"
            >
              Already a member? Login →
            </Link>
          </div>
        </div>
      </section>

      {/* ── Footer ─────────────────────────────────────────────────────────── */}
      <footer className="bg-surface border-t border-border py-14">
        <div className="max-w-7xl mx-auto px-5 sm:px-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-10 mb-12">
            {/* Brand */}
            <div className="sm:col-span-2 lg:col-span-1">
              <div className="flex items-center gap-2.5 mb-4">
                <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                  <svg viewBox="0 0 24 24" fill="white" className="w-5 h-5">
                    <path d="M17 8C8 10 5.9 16.17 3.82 22L5.71 22C6.71 17.12 10.22 12.84 17 10.5V14L21 9L17 4V8Z" />
                  </svg>
                </div>
                <span className="font-bold text-base text-text">Greenleaf</span>
              </div>
              <p className="text-sm text-text-muted leading-relaxed max-w-xs">
                Empowering Indians to build better health and financial futures through premium products and a proven business system.
              </p>
            </div>

            {/* Links */}
            <div>
              <p className="text-xs font-bold tracking-widest text-text uppercase mb-4">Company</p>
              <div className="flex flex-col gap-2.5">
                {['About', 'Products', 'Contact', 'Privacy Policy'].map((l) => (
                  <a key={l} href="#" className="text-sm text-text-muted hover:text-primary transition-colors">{l}</a>
                ))}
              </div>
            </div>

            <div>
              <p className="text-xs font-bold tracking-widest text-text uppercase mb-4">Members</p>
              <div className="flex flex-col gap-2.5">
                {['Member Login', 'Service Centers', 'Training', 'Support'].map((l) => (
                  <a key={l} href="#" className="text-sm text-text-muted hover:text-primary transition-colors">{l}</a>
                ))}
              </div>
            </div>

            {/* Social */}
            <div>
              <p className="text-xs font-bold tracking-widest text-text uppercase mb-4">Follow Us</p>
              <div className="flex gap-3">
                {/* Instagram */}
                <a href="#" aria-label="Instagram" className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all">
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.8" className="w-4 h-4">
                    <rect x="2" y="2" width="20" height="20" rx="5" ry="5" /><circle cx="12" cy="12" r="5" />
                    <circle cx="17.5" cy="6.5" r="1" fill="currentColor" stroke="none" />
                  </svg>
                </a>
                {/* WhatsApp */}
                <a href="#" aria-label="WhatsApp" className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347z" />
                    <path d="M12 0C5.373 0 0 5.373 0 12c0 2.025.507 3.933 1.395 5.61L0 24l6.545-1.367C8.185 23.491 10.063 24 12 24c6.627 0 12-5.373 12-12S18.627 0 12 0zm0 22c-1.847 0-3.584-.493-5.089-1.355l-.36-.214-3.752.984.998-3.648-.235-.374C2.614 15.77 2 13.95 2 12 2 6.477 6.477 2 12 2s10 4.477 10 10-4.477 10-10 10z" />
                  </svg>
                </a>
                {/* YouTube */}
                <a href="#" aria-label="YouTube" className="w-9 h-9 rounded-xl bg-background border border-border flex items-center justify-center text-text-muted hover:text-primary hover:border-primary/40 transition-all">
                  <svg viewBox="0 0 24 24" fill="currentColor" className="w-4 h-4">
                    <path d="M23.498 6.186a3.016 3.016 0 0 0-2.122-2.136C19.505 3.545 12 3.545 12 3.545s-7.505 0-9.377.505A3.017 3.017 0 0 0 .502 6.186C0 8.07 0 12 0 12s0 3.93.502 5.814a3.016 3.016 0 0 0 2.122 2.136c1.871.505 9.376.505 9.376.505s7.505 0 9.377-.505a3.015 3.015 0 0 0 2.122-2.136C24 15.93 24 12 24 12s0-3.93-.502-5.814zM9.545 15.568V8.432L15.818 12l-6.273 3.568z" />
                  </svg>
                </a>
              </div>
            </div>
          </div>

          <div className="pt-8 border-t border-border flex flex-col sm:flex-row items-center justify-between gap-3">
            <p className="text-sm text-text-muted">© 2026 Greenleaf. All rights reserved.</p>
            <div className="flex gap-5 text-xs text-text-muted">
              <a href="#" className="hover:text-primary transition-colors">Terms</a>
              <a href="#" className="hover:text-primary transition-colors">Privacy</a>
              <a href="#" className="hover:text-primary transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
}
