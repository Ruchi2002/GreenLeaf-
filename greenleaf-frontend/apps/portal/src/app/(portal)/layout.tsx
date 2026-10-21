'use client';

import { useState } from 'react';
import { Menu } from 'lucide-react';
import { PortalRoleProvider } from '@/context/PortalRoleContext';
import { Sidebar }            from '@/components/layout/Sidebar';

import { TopControls }        from '@/components/layout/TopControls';

export default function PortalLayout({ children }: { children: React.ReactNode }) {
  const [drawerOpen, setDrawerOpen] = useState(false);

  return (
    <PortalRoleProvider>
      <div className="flex min-h-screen bg-background">
        {/* Sidebar — desktop: always visible; mobile: hidden (drawer handles it) */}
        <div className="hidden md:block">
          <Sidebar />
        </div>

        {/* Mobile sidebar drawer */}
        {drawerOpen && (
          <div className="fixed inset-0 z-50 md:hidden">
            {/* Backdrop */}
            <div
              className="absolute inset-0 bg-black/50"
              onClick={() => setDrawerOpen(false)}
            />
            {/* Drawer */}
            <div className="absolute left-0 top-0 h-full shadow-2xl">
              <Sidebar onClose={() => setDrawerOpen(false)} />
            </div>
          </div>
        )}

        {/* Main content */}
        <div className="flex-1 relative">
          {/* Mobile hamburger — top-left */}
          <button
            className="absolute top-4 left-4 z-10 md:hidden text-text-muted hover:text-text transition-colors"
            onClick={() => setDrawerOpen(true)}
            aria-label="Open menu"
          >
            <Menu className="h-6 w-6" />
          </button>

          {/* Top-right controls */}
          <div className="absolute top-4 right-4 z-10">
            <TopControls />
          </div>

          {/* Page content */}
          <main className="p-4 md:p-8">
            {children}
          </main>
        </div>


      </div>
    </PortalRoleProvider>
  );
}
