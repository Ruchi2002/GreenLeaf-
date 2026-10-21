'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Search, SlidersHorizontal, ShoppingCart, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { adminOrders, tabCounts, type OrderStatus, type CategoryTag } from '@/data/mock/adminOrders';
import { cn } from '@/lib/utils';

const TABS: (OrderStatus | 'All')[] = ['All', 'Pending', 'Processing', 'Completed', 'Cancelled'];

const STATUS_BORDER: Record<OrderStatus, string> = {
  Completed:  'border-l-green-500',
  Processing: 'border-l-blue-500',
  Pending:    'border-l-amber-500',
  Cancelled:  'border-l-red-400',
};

const STATUS_BADGE: Record<OrderStatus, string> = {
  Completed:  'bg-green-100 text-green-700',
  Processing: 'bg-blue-100 text-blue-700',
  Pending:    'bg-amber-100 text-amber-700',
  Cancelled:  'bg-red-100 text-red-600',
};

const STATUS_ICON: Record<OrderStatus, React.ElementType> = {
  Completed:  CheckCircle2,
  Processing: Clock,
  Pending:    Clock,
  Cancelled:  XCircle,
};

const CATEGORY_BADGE: Record<CategoryTag, string> = {
  Starter:  'bg-green-100 text-green-700',
  Wellness: 'bg-blue-100 text-blue-700',
  Beauty:   'bg-puRPle-100 text-puRPle-700',
};

const TAB_COUNT_STYLE: Record<string, string> = {
  All:        'bg-gray-100 text-gray-600',
  Pending:    'bg-amber-100 text-amber-700',
  Processing: 'bg-blue-100 text-blue-700',
  Completed:  'bg-green-100 text-green-700',
  Cancelled:  'bg-red-100 text-red-600',
};

export default function OrdersPage() {
  const [activeTab,   setActiveTab]   = useState<OrderStatus | 'All'>('All');
  const [search,      setSearch]      = useState('');
  const [approvedIds,      setApprovedIds]      = useState<Set<string>>(new Set());
  const [showMobileFilter, setShowMobileFilter] = useState(false);
  const router = useRouter();

  const filtered = adminOrders.filter((o) => {
    const matchTab    = activeTab === 'All' || o.status === activeTab;
    const matchSearch = !search ||
      o.member.toLowerCase().includes(search.toLowerCase()) ||
      o.orderId.toLowerCase().includes(search.toLowerCase()) ||
      o.product.toLowerCase().includes(search.toLowerCase());
    return matchTab && matchSearch;
  });

  function handleApprove(id: string) {
    setApprovedIds((prev) => new Set(prev).add(id));
  }

  return (
    <div className="space-y-6">
      {/* Header banner */}
      <div className="rounded-2xl bg-gradient-to-r from-[#0a1f13] to-[#14532d] px-4 sm:px-7 py-6">
        <div className="flex items-center gap-4 mb-1">
          <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center">
            <ShoppingCart size={20} className="text-green-300" />
          </div>
          <div>
            <div className="flex items-center gap-3">
              <h1 className="text-2xl font-bold text-white">Orders</h1>
              <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-500/25 text-green-400">
                {tabCounts.All} total
              </span>
            </div>
            <p className="text-sm text-green-200/70 mt-0.5">Review, approve, and manage all product orders.</p>
          </div>
        </div>
      </div>

      {/* Tabs + Search row */}
      <div className="bg-white rounded-2xl shadow-sm">
        {/* Tabs */}
        <div className="flex items-center gap-1 px-4 sm:px-5 pt-4 border-b border-gray-100 overflow-x-auto scrollbar-hide pb-0">
          {TABS.map((tab) => {
            const count = tabCounts[tab as keyof typeof tabCounts];
            return (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={cn(
                  'flex items-center gap-2 px-4 py-2.5 text-sm font-medium rounded-t-lg whitespace-nowrap transition-colors relative',
                  activeTab === tab
                    ? 'text-gray-900 after:absolute after:bottom-0 after:left-0 after:right-0 after:h-0.5 after:bg-gray-900'
                    : 'text-gray-400 hover:text-gray-600'
                )}
              >
                {tab}
                <span className={cn('text-[11px] font-semibold px-1.5 py-0.5 rounded-full', TAB_COUNT_STYLE[tab])}>
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        {/* Search + filter */}
        <div className="flex items-center gap-3 px-4 sm:px-5 py-4">
          <div className="relative flex-1 min-w-0">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400 pointer-events-none" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by member, order ID, or product..."
              className="w-full pl-10 pr-4 h-9 rounded-full border border-gray-200 bg-gray-50 text-sm text-gray-700 placeholder:text-gray-400 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
            />
          </div>
          <button
            onClick={() => setShowMobileFilter(true)}
            className="md:hidden ml-auto flex items-center gap-1.5 text-sm text-gray-600 border border-gray-200 bg-white rounded-full px-4 py-1.5 hover:bg-gray-50 transition-colors"
          >
            <SlidersHorizontal size={14} />
            Filters
          </button>
        </div>

        {/* Order cards */}
        <div className="px-4 sm:px-5 pb-4 sm:pb-5 space-y-3">
          {filtered.length === 0 && (
            <div className="py-16 text-center text-gray-400 text-sm">No orders found.</div>
          )}

          {filtered.map((order) => {
            const StatusIcon = STATUS_ICON[order.status];
            const isApproved = approvedIds.has(order.id);
            const showApprove = order.status === 'Pending' && !isApproved;

            return (
              <div
                key={order.id}
                className={cn(
                  'rounded-xl border border-gray-100 border-l-4 px-4 sm:px-5 py-4 hover:bg-gray-50/60 transition-colors',
                  STATUS_BORDER[order.status]
                )}
              >
                {/* Top row: order ID + status badge + amount */}
                <div className="flex items-start justify-between gap-2 mb-3">
                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="font-mono text-xs text-gray-500">{order.orderId}</span>
                      <span className={cn(
                        'inline-flex items-center gap-1 text-xs font-semibold px-2.5 py-0.5 rounded-full',
                        STATUS_BADGE[order.status]
                      )}>
                        <StatusIcon size={11} />
                        {isApproved ? 'Approved' : order.status}
                      </span>
                    </div>
                    <p className="text-xs text-gray-400 mt-0.5">{order.date}</p>
                  </div>
                  <p className="font-bold text-gray-900 text-sm whitespace-nowrap shrink-0">{order.amount}</p>
                </div>

                {/* Member + product row */}
                <div className="flex items-center gap-3 mb-3">
                  <div className={cn('w-9 h-9 rounded-full flex items-center justify-center shrink-0', order.avatarBg)}>
                    <span className="text-white text-xs font-bold">{order.initials}</span>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-semibold text-gray-900">{order.member}</p>
                    <div className="flex items-center gap-2 flex-wrap">
                      <p className="text-xs text-gray-500 truncate">{order.product}</p>
                      <span className={cn('text-[11px] font-semibold px-2 py-0.5 rounded-full shrink-0', CATEGORY_BADGE[order.category])}>
                        {order.category}
                      </span>
                    </div>
                  </div>
                  <p className="hidden sm:block text-xs font-semibold text-gray-500 shrink-0">{order.pv} PV</p>
                </div>

                {/* Actions */}
                <div className="flex gap-2 pt-3 border-t border-gray-100">
                  <button
                    onClick={() => router.push(`/orders/${order.id}`)}
                    className="flex-1 sm:flex-none border border-gray-200 text-gray-600 text-xs font-medium px-4 py-2 rounded-lg hover:bg-gray-50 transition-colors"
                  >
                    View Details
                  </button>
                  {showApprove && (
                    <button
                      onClick={() => handleApprove(order.id)}
                      className="flex-1 sm:flex-none bg-green-600 text-[#0b1410] text-xs font-semibold px-4 py-2 rounded-lg hover:bg-green-500 transition-colors"
                    >
                      Approve
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>

        {/* Pagination */}
        <div className="flex items-center justify-center sm:justify-between px-4 sm:px-5 py-3.5 border-t border-gray-100 gap-2">
          <p className="hidden sm:block text-sm text-gray-500">
            Showing 1–{filtered.length} of {tabCounts[activeTab as keyof typeof tabCounts] ?? tabCounts.All} orders
          </p>
          <div className="flex items-center gap-1">
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              ← Prev
            </button>
            <div className="hidden sm:flex items-center gap-1 mx-1">
              {[1, 2, 3, 4].map((p) => (
                <button
                  key={p}
                  className={cn(
                    'w-8 h-8 rounded-lg text-sm font-medium transition-colors',
                    p === 1 ? 'bg-gray-900 text-white' : 'text-gray-500 hover:bg-gray-100'
                  )}
                >
                  {p}
                </button>
              ))}
              <span className="px-1 text-gray-400 text-sm">…</span>
              <button className="w-8 h-8 rounded-lg text-sm font-medium text-gray-500 hover:bg-gray-100">8</button>
            </div>
            <span className="sm:hidden text-sm text-gray-500 px-3 py-1.5">1 / 8</span>
            <button className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm font-medium text-gray-600 hover:bg-gray-50 disabled:opacity-40 transition-colors">
              Next →
            </button>
          </div>
        </div>
      </div>

      {/* Mobile filter sheet */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">Filter by Status</h3>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg">✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {TABS.map((tab) => (
                <button
                  key={tab}
                  onClick={() => setActiveTab(tab)}
                  className={cn(
                    'px-4 py-2 rounded-full text-sm font-semibold transition-colors',
                    activeTab === tab
                      ? 'bg-green-600 text-[#0b1410]'
                      : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                  )}
                >
                  {tab} {tabCounts[tab]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-3 bg-green-600 text-[#0b1410] font-semibold rounded-xl text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
