'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { cn } from '@/lib/utils';
import { usePortalRole } from '@/context/PortalRoleContext';

const BASE_NAV = [
  { label: 'Dashboard',          href: '/dashboard',     exact: false },
  { label: 'Shop',               href: '/shop',          exact: false },
  { label: 'Orders',             href: '/orders',        exact: false },
  { label: 'My Network',         href: '/network',       exact: true  },
  { label: 'Team Performance',   href: '/network/team',  exact: false },
  { label: 'E-Wallet',           href: '/wallet',        exact: false },
  { label: 'Announcements',      href: '/announcements', exact: false },
  { label: 'Profile & Settings', href: '/profile',       exact: false },
] as const;

const SC_NAV = [
  { label: 'Dashboard',          href: '/sc/dashboard',       exact: false },
  { label: 'E-Wallet',           href: '/sc/wallet',          exact: false },
  { label: 'Register Member',    href: '/sc/register-member', exact: false },
  { label: 'Member List',        href: '/sc/members',         exact: false },
  { label: 'Purchasing Product', href: '/sc/purchase-gifts',  exact: false },
  { label: 'My Orders',          href: '/sc/orders',          exact: false },
] as const;

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
    </svg>
  );
}

export function Sidebar({ onClose }: { onClose?: () => void }) {
  const pathname = usePathname();
  const { role } = usePortalRole();
  const isSC = role === 'service_center';
  const nav = isSC ? SC_NAV : BASE_NAV;

  return (
    <aside className="w-56 md:w-44 h-screen sticky top-0 overflow-y-auto bg-surface border-r border-border flex flex-col">
      {/* Logo */}
      <div className="px-4 pt-6 pb-5 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <DiamondIcon className="h-5 w-5 text-primary" />
          <span className="font-semibold text-text text-sm">Greenleaf</span>
        </div>
        {onClose && (
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors md:hidden"
            aria-label="Close menu"
          >
            <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="h-5 w-5">
              <path d="M18 6L6 18M6 6l12 12" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        )}
      </div>

      {/* Role badge */}
      {isSC && (
        <div className="mx-4 mb-3 px-2.5 py-1 bg-primary-soft rounded-lg">
          <p className="text-[10px] font-bold tracking-widest text-primary uppercase">Service Center</p>
        </div>
      )}

      {/* Nav */}
      <nav className="flex flex-col gap-0.5">
        {nav.map(({ label, href, exact }) => {
          const isActive = exact
            ? pathname === href
            : pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'block mx-2 px-3 py-2 text-sm rounded-lg transition-colors',
                isActive
                  ? 'bg-primary-soft text-primary font-semibold'
                  : 'text-text-muted hover:text-text hover:bg-primary-soft/50'
              )}
            >
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Spacer + Log Out */}
      <div className="mt-auto px-4 pb-6 pt-4 border-t border-border">
        <Link
          href="/login"
          onClick={onClose}
          className="text-sm text-text-muted hover:text-danger transition-colors"
        >
          Log Out
        </Link>
      </div>
    </aside>
  );
}
