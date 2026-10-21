'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutDashboard, ShoppingBag, Package, Wallet, User } from 'lucide-react';
import { cn } from '@/lib/utils';

const ITEMS = [
  { label: 'Dashboard', href: '/dashboard',  Icon: LayoutDashboard },
  { label: 'Shop',      href: '/shop',        Icon: ShoppingBag },
  { label: 'Orders',    href: '/orders',      Icon: Package },
  { label: 'E-Wallet',  href: '/wallet',      Icon: Wallet },
  { label: 'Profile',   href: '/profile',     Icon: User },
] as const;

export function MobileNav() {
  const pathname = usePathname();

  return (
    <nav className="md:hidden fixed bottom-0 left-0 right-0 z-50 bg-surface border-t border-border">
      <div className="flex items-center justify-around h-16 px-2">
        {ITEMS.map(({ label, href, Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={cn(
                'flex flex-col items-center gap-1 flex-1 py-2 transition-colors',
                isActive ? 'text-primary' : 'text-text-muted hover:text-text'
              )}
            >
              <Icon className="h-5 w-5" />
              <span className="text-[10px] font-medium leading-none">{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
