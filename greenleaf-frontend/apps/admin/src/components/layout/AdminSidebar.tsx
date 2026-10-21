'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard, Users, ShoppingCart, Package, Banknote,
  Wallet, Settings, ClipboardList, BarChart2,
  Megaphone, RefreshCw, X, Store,
} from 'lucide-react';
import { cn } from '@/lib/utils';

const NAV = [
  { label: 'Dashboard',       href: '/dashboard',        icon: LayoutDashboard },
  { label: 'Members',         href: '/members',          icon: Users           },
  { label: 'Service Centers', href: '/service-centers',  icon: Store           },
  { label: 'Orders',          href: '/orders',           icon: ShoppingCart    },
  { label: 'Products',        href: '/products',      icon: Package         },
  { label: 'Bonus Mgmt',      href: '/bonus',         icon: Banknote        },
  { label: 'Wallet',          href: '/wallet',        icon: Wallet          },
  { label: 'Recharge',        href: '/recharge',      icon: RefreshCw       },
  { label: 'Settings',        href: '/settings',      icon: Settings        },
  { label: 'Audit Logs',      href: '/audit-logs',    icon: ClipboardList   },
  { label: 'Reports',         href: '/reports',       icon: BarChart2       },
  { label: 'Announcements',   href: '/announcements', icon: Megaphone       },
];

interface AdminSidebaRProps {
  open:    boolean;
  onClose: () => void;
}

export function AdminSidebar({ open, onClose }: AdminSidebaRProps) {
  const pathname = usePathname();

  return (
    <aside
      className={cn(
        'fixed top-0 left-0 h-full w-[220px] bg-[#0a1f13] z-40 flex flex-col',
        'transition-transform duration-300 ease-in-out',
        open ? 'translate-x-0' : '-translate-x-full',
        'lg:translate-x-0',
      )}
    >
      {/* Mobile close button */}
      <button
        onClick={onClose}
        className="lg:hidden absolute top-4 right-4 text-white/60 hover:text-white transition-colors"
        aria-label="Close menu"
      >
        <X size={20} />
      </button>

      {/* Logo */}
      <div className="px-5 pt-6 pb-7 flex items-center gap-2.5">
        <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-green-400 to-green-600 flex items-center justify-center shrink-0">
          <svg viewBox="0 0 20 20" fill="white" className="w-4 h-4">
            <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
          </svg>
        </div>
        <span className="text-white font-bold text-base tracking-tight">Greenleaf</span>
        <span className="ml-auto text-[10px] font-semibold px-1.5 py-0.5 rounded bg-green-500/20 text-green-400">ADMIN</span>
      </div>

      {/* Nav */}
      <nav className="flex-1 px-2 flex flex-col gap-0.5 overflow-y-auto">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              onClick={onClose}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm font-medium transition-all relative',
                isActive
                  ? 'text-[#22c55e] bg-gradient-to-r from-green-500/20 to-transparent border-l-2 border-[#22c55e] pl-[10px]'
                  : 'text-gray-400 hover:text-gray-200 hover:bg-white/5 border-l-2 border-transparent'
              )}
            >
              <Icon size={16} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </nav>

      {/* Admin profile */}
      <div className="mx-3 mb-4 mt-2 rounded-xl bg-white/5 p-3 flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shrink-0">
          <span className="text-white text-xs font-bold">AK</span>
        </div>
        <div className="min-w-0">
          <p className="text-white text-sm font-semibold leading-tight truncate">Amit Kumar</p>
          <p className="text-gray-400 text-xs truncate">Super Admin</p>
        </div>
      </div>
    </aside>
  );
}
