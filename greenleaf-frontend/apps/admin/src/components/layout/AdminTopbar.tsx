'use client';

import { Search, Bell, Menu } from 'lucide-react';

interface AdminTopbaRProps {
  onMenuClick: () => void;
}

export function AdminTopbar({ onMenuClick }: AdminTopbaRProps) {
  return (
    <header className="sticky top-0 z-20 h-14 bg-white border-b border-gray-200 flex items-center px-4 gap-3">
      {/* Hamburger — mobile only */}
      <button
        onClick={onMenuClick}
        className="lg:hidden p-2 rounded-lg hover:bg-gray-100 transition-colors shrink-0"
        aria-label="Open menu"
      >
        <Menu size={20} className="text-gray-600" />
      </button>

      {/* Search */}
      <div className="flex-1 max-w-lg relative">
        <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
        <input
          type="text"
          placeholder="Search members, orders, products..."
          className="w-full pl-10 pr-4 h-9 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
        />
      </div>

      <div className="flex items-center gap-3 ml-auto">
        {/* Notification bell */}
        <button className="relative w-9 h-9 flex items-center justify-center rounded-full hover:bg-gray-100 transition-colors">
          <Bell className="w-5 h-5 text-gray-500" />
          <span className="absolute top-1.5 right-1.5 w-2 h-2 rounded-full bg-red-500 ring-2 ring-white" />
        </button>

        {/* Avatar */}
        <div className="w-9 h-9 rounded-full bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shrink-0 cursor-pointer">
          <span className="text-white text-xs font-bold">AK</span>
        </div>
      </div>
    </header>
  );
}
