'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { Copy } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useOrders } from '@/hooks/useOrders';
import type { Order, OrderStatus } from '@/data/mock/orders';

const STATUS_TABS: { label: string; value: OrderStatus | 'all' }[] = [
  { label: 'All',              value: 'all'              },
  { label: 'Pending payment',  value: 'pending_payment'  },
  { label: 'Pending delivery', value: 'pending_delivery' },
  { label: 'Shipped',          value: 'shipped'          },
  { label: 'Completed',        value: 'completed'        },
];

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending_payment':  return 'Pending payment';
    case 'pending_delivery': return 'Pending delivery';
    case 'shipped':          return 'Shipped';
    case 'completed':        return 'Completed';
    case 'cancelled':        return 'Cancelled';
  }
}

function typeLabel(type: Order['type']): string {
  switch (type) {
    case 'personal':   return 'Personal';
    case 'help':       return 'Help Order';
    case 'sc_purchase': return 'SC Purchase';
  }
}

function statusBadgeClass(status: OrderStatus): string {
  switch (status) {
    case 'completed':        return 'bg-primary/10 text-primary border border-primary/30';
    case 'shipped':          return 'bg-primary/10 text-primary border border-primary/30';
    case 'pending_delivery': return 'bg-border text-text-muted border border-border';
    case 'pending_payment':  return 'bg-gold/10 text-gold border border-gold/30';
    case 'cancelled':        return 'bg-danger/10 text-danger border border-danger/30';
  }
}

function typeBadgeClass(type: Order['type']): string {
  switch (type) {
    case 'personal':    return 'bg-border text-text-muted';
    case 'help':        return 'bg-primary/10 text-primary';
    case 'sc_purchase': return 'bg-blue-100 text-blue-700 dark:bg-blue-950/40 dark:text-blue-400';
  }
}

function formatRupiah(amount: number) {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function countByStatus(orders: Order[], status: OrderStatus) {
  return orders.filter((o) => o.status === status).length;
}

export default function OrdersPage() {
  const router = useRouter();
  const { orders, loading } = useOrders();

  const [activeTab,   setActiveTab]   = useState<OrderStatus | 'all'>('all');
  const [typeFilter,  setTypeFilter]  = useState<Order['type'] | 'any'>('any');
  const [dateFilter,  setDateFilter]  = useState('');
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId,    setCopiedId]    = useState<string | null>(null);

  function copyOrderId(id: string) {
    // MOCK ONLY — display-only feedback
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  }

  const filtered = useMemo(() => orders.filter((order) => {
    const matchTab    = activeTab === 'all' || order.status === activeTab;
    const matchType   = typeFilter === 'any'  || order.type   === typeFilter;
    const matchSearch = searchQuery === '' || order.id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchTab && matchType && matchSearch;
  }), [orders, activeTab, typeFilter, searchQuery]);

  return (
    <div className="pt-14">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">My Orders</h1>
        <p className="text-sm text-text-muted mt-0.5">Track payments, deliveries and history</p>
      </div>

      {/* Status tabs — horizontal scroll, bleeds to screen edges on mobile */}
      <div className="flex gap-2 mb-4 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {STATUS_TABS.map((tab) => {
          const count = tab.value === 'all' ? null : countByStatus(orders, tab.value as OrderStatus);
          return (
            <button
              key={tab.value}
              onClick={() => setActiveTab(tab.value)}
              className={cn(
                'shrink-0 flex items-center gap-1.5 px-4 py-1.5 rounded-full text-sm font-medium transition-colors border',
                activeTab === tab.value
                  ? 'bg-primary text-[#0b1410] border-primary'
                  : 'bg-surface text-text border-border hover:border-primary/40'
              )}
            >
              {tab.label}
              {count !== null && count > 0 && (
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full leading-none',
                  activeTab === tab.value
                    ? 'bg-[#0b1410]/20 text-[#0b1410]'
                    : 'bg-primary/15 text-primary'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Filter row — type+date side by side on mobile, search below */}
      <div className="flex flex-col sm:flex-row gap-2 mb-5">
        <div className="flex gap-2">
          <select
            value={typeFilter}
            onChange={(e) => setTypeFilter(e.target.value as Order['type'] | 'any')}
            className="flex-1 sm:flex-none text-sm bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          >
            <option value="any">Type: any</option>
            <option value="personal">Personal</option>
            <option value="help">Help Order</option>
            <option value="sc_purchase">SC Purchase</option>
          </select>

          <input
            type="date"
            value={dateFilter}
            onChange={(e) => setDateFilter(e.target.value)}
            className="flex-1 sm:flex-none text-sm bg-surface border border-border rounded-lg px-3 py-2 text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search order number"
          className="sm:flex-1 text-sm bg-surface border border-border rounded-lg px-3 py-2 text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
        />
      </div>

      {/* Loading skeleton */}
      {loading && (
        <div className="flex flex-col gap-4">
          {Array.from({ length: 3 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-2xl px-5 py-4 animate-pulse">
              <div className="flex justify-between mb-3">
                <div className="h-4 w-32 bg-border rounded" />
                <div className="h-5 w-20 bg-border rounded-full" />
              </div>
              <div className="h-10 w-full bg-border/50 rounded-lg mt-3" />
              <div className="flex gap-2 mt-4">
                <div className="h-8 w-24 bg-border rounded-lg" />
                <div className="h-8 w-24 bg-border rounded-lg" />
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Order list */}
      {!loading && filtered.length === 0 && (
        <div className="text-center py-16 text-text-muted text-sm">No orders found.</div>
      )}

      {!loading && filtered.length > 0 && (
        <div className="flex flex-col gap-4 pb-8">
          {filtered.map((order) => (
            <div key={order.id} className="bg-surface border border-border rounded-2xl px-5 py-4">

              {/* Order header — row 1: ID + status badge */}
              <div className="flex items-center justify-between gap-2 mb-1.5">
                <div className="flex items-center gap-2 min-w-0">
                  <span className="text-sm font-bold text-text truncate">#{order.id}</span>
                  <button
                    onClick={() => copyOrderId(order.id)}
                    className="flex items-center gap-1 text-xs text-text-muted hover:text-primary transition-colors shrink-0"
                    title="Copy order number"
                  >
                    <Copy size={12} />
                    <span>{copiedId === order.id ? 'Copied!' : 'Copy'}</span>
                  </button>
                </div>
                <span className={cn('text-xs font-semibold px-3 py-1 rounded-full shrink-0', statusBadgeClass(order.status))}>
                  {statusLabel(order.status)}
                </span>
              </div>
              {/* Order header — row 2: type badge + date */}
              <div className="flex items-center gap-2 mb-1">
                <span className={cn('text-xs font-medium px-2 py-0.5 rounded-full', typeBadgeClass(order.type))}>
                  {typeLabel(order.type)}
                </span>
                <span className="text-xs text-text-muted">{order.date}</span>
              </div>

              {/* Items */}
              <div className="flex flex-col gap-2 border-t border-border mt-2 pt-3">
                {order.items.map((item) => (
                  <div key={item.id} className="flex items-center gap-3">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center">
                      <span className="text-[8px] text-primary/60 text-center font-medium leading-tight px-0.5">
                        {item.name.substring(0, 6)}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text">{item.name} × {item.qty}</p>
                      <p className="text-xs text-text-muted">{order.paymentMethod ?? 'E-Wallet'}</p>
                    </div>
                    <div className="text-right shrink-0">
                      <p className="text-sm font-bold text-text">{formatRupiah(item.price * item.qty)}</p>
                      {item.pv > 0 ? (
                        <p className="text-xs font-semibold text-gold">{item.pv * item.qty} PV</p>
                      ) : (
                        <p className="text-xs text-text-muted">0 PV</p>
                      )}
                    </div>
                  </div>
                ))}
              </div>

              {/* Action buttons */}
              <div className="flex items-center gap-2 mt-3 flex-wrap">
                {order.status === 'pending_payment' && (
                  <button
                    onClick={() => router.push('/checkout/payment')}
                    className="px-4 py-1.5 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
                  >
                    Pay now
                  </button>
                )}
                {order.status === 'pending_payment' && (
                  <button className="px-4 py-1.5 rounded-lg border border-border text-sm text-text hover:border-primary/40 transition-colors">
                    Cancel
                  </button>
                )}
                <button
                  onClick={() => router.push(`/orders/${order.id}`)}
                  className="px-4 py-1.5 rounded-lg border border-border text-sm text-text hover:border-primary/40 transition-colors"
                >
                  Order details
                </button>
                <button
                  onClick={() => router.push('/shop')}
                  className="px-4 py-1.5 rounded-lg border border-border text-sm text-text hover:border-primary/40 transition-colors"
                >
                  Buy again
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
