function BrandLeaf({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 100 120" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <path d="M50 8 C20 28 20 88 50 108 C80 88 80 28 50 8 Z" fill="currentColor" />
    </svg>
  );
}

export function AuthLeftPanel() {
  return (
    <div
      className="hidden lg:flex lg:w-[44%] flex-col justify-between p-10 relative overflow-hidden"
      style={{ background: 'radial-gradient(ellipse at 60% 38%, #1d4731 0%, #0b1410 68%)' }}
    >
      {/* Logo */}
      <div className="flex items-center gap-2.5 z-10">
        <BrandLeaf className="h-7 w-7 text-[#34C274]" />
        <span className="text-xl font-bold text-white tracking-tight">Greenleaf</span>
      </div>

      {/* Hero leaf with glow */}
      <div className="flex justify-center items-center z-10">
        <div className="relative">
          <div
            className="absolute inset-0 rounded-full blur-[80px] opacity-55"
            style={{ background: '#34C274', transform: 'scale(1.35)' }}
          />
          <BrandLeaf className="relative h-52 w-52 text-[#34C274]" />
        </div>
      </div>

      {/* Tagline + body copy + copyright */}
      <div className="z-10 space-y-3">
        <h2 className="text-[1.95rem] font-bold text-white leading-snug">
          Grow your wellness<br />business, together.
        </h2>
        <p className="text-sm leading-relaxed max-w-xs" style={{ color: 'rgba(255,255,255,0.50)' }}>
          Track your PV, your binary network, bonuses and e-wallet — all in one place for
          Members and Service Centers across India.
        </p>
        <p className="text-xs pt-2" style={{ color: 'rgba(255,255,255,0.30)' }}>
          © 2026 Greenleaf
        </p>
      </div>
    </div>
  );
}
