'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { LayoutGrid, Gift, UseRPlus, ShieldCheck } from 'lucide-react';

const NAV = [
  { label: 'General',      href: '/settings/general',      icon: LayoutGrid  },
  { label: 'Bonus Config', href: '/settings/bonus',        icon: Gift        },
  { label: 'Registration', href: '/settings/registration', icon: UseRPlus    },
  { label: 'Security',     href: '/settings/security',     icon: ShieldCheck },
];

export default function SettingsLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();

  return (
    <div className="flex flex-col lg:flex-row gap-6 min-h-full">

      {/* Mobile: horizontal scrollable nav tabs */}
      <div className="lg:hidden flex gap-2 overflow-x-auto scrollbar-hide pb-1 bg-white rounded-2xl p-2 shadow-sm">
        {NAV.map(({ label, href, icon: Icon }) => {
          const isActive = pathname === href || pathname.startsWith(href + '/');
          return (
            <Link
              key={href}
              href={href}
              className={`whitespace-nowrap shrink-0 flex items-center gap-2 px-4 py-2 rounded-xl text-sm font-medium transition-colors ${
                isActive
                  ? 'bg-green-600 text-white'
                  : 'text-gray-600 hover:bg-gray-100'
              }`}
            >
              <Icon size={14} className="shrink-0" />
              {label}
            </Link>
          );
        })}
      </div>

      {/* Desktop: vertical sidebar */}
      <aside className="hidden lg:block w-[200px] shrink-0">
        <div className="bg-white rounded-2xl shadow-sm overflow-hidden sticky top-6">
          <div className="px-4 pt-5 pb-3">
            <p className="text-[10px] font-bold text-gray-400 uppercase tracking-widest">Settings</p>
          </div>
          <nav className="pb-3 flex flex-col">
            {NAV.map(({ label, href, icon: Icon }) => {
              const isActive = pathname === href || pathname.startsWith(href + '/');
              return (
                <Link
                  key={href}
                  href={href}
                  className={`flex items-center gap-2.5 px-4 py-2.5 text-sm font-medium transition-colors border-l-[3px] ${
                    isActive
                      ? 'border-green-600 text-green-700 bg-green-50'
                      : 'border-transparent text-gray-500 hover:text-gray-800 hover:bg-gray-50'
                  }`}
                >
                  <Icon size={15} className="shrink-0" />
                  {label}
                </Link>
              );
            })}
          </nav>
        </div>
      </aside>

      {/* Page content */}
      <div className="flex-1 min-w-0">{children}</div>
    </div>
  );
}
