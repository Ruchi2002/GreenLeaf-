'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useMemo } from 'react';
import { Search } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSCOrders } from '@/hooks/useSCOrders';
import type { SCOrder, SCOrderStatus } from '@/data/mock/scOrders';

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// Simplified delivery status groups shown to user
type DeliveryGroup = 'all' | 'pending' | 'delivered' | 'cancelled';

const DELIVERY_TABS: { label: string; value: DeliveryGroup }[] = [
  { label: 'All',       value: 'all'       },
  { label: 'Pending',   value: 'pending'   },
  { label: 'Delivered', value: 'delivered' },
  { label: 'Cancelled', value: 'cancelled' },
];

function toGroup(status: SCOrderStatus): DeliveryGroup {
  if (status === 'cancelled')                                   return 'cancelled';
  if (status === 'shipped' || status === 'completed')           return 'delivered';
  return 'pending';
}

function statusLabel(status: SCOrderStatus): string {
  switch (status) {
    case 'pending_payment': return 'Pending Payment';
    case 'processing':      return 'Processing';
    case 'shipped':         return 'Shipped';
    case 'completed':       return 'Delivered';
    case 'cancelled':       return 'Cancelled';
  }
}

function statusBadgeClass(status: SCOrderStatus): string {
  switch (status) {
    case 'pending_payment': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'processing':      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'shipped':         return 'bg-primary-soft text-primary border border-primary/20';
    case 'completed':       return 'bg-green-50 text-green-700 border border-green-200';
    case 'cancelled':       return 'bg-red-50 text-red-600 border border-red-200';
    default:                return 'bg-border text-text-muted';
  }
}

// Parse "Oct 8, 2026" → Date for comparison
function parseDate(str: string): Date | null {
  const d = new Date(str);
  return isNaN(d.getTime()) ? null : d;
}

// Table row — desktop
function OrderTableRow({ order }: { order: SCOrder }) {
  const firstItem = order.items[0];
  const productLabel = order.items.length === 1
    ? firstItem?.name
    : `${firstItem?.name} +${order.items.length - 1} more`;

  return (
    <tr className="border-b border-border/60 last:border-0 hover:bg-primary/5 transition-colors">
      <td className="px-5 py-3.5 text-xs font-mono text-text-muted whitespace-nowrap">{order.id}</td>
      <td className="px-5 py-3.5">
        <div className="flex items-center gap-2">
          <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{order.memberInitials}</span>
          </div>
          <div>
            <p className="text-sm font-medium text-text whitespace-nowrap">{order.memberName}</p>
            <p className="text-xs text-text-muted">{order.memberId}</p>
          </div>
        </div>
      </td>
      <td className="px-5 py-3.5 text-sm text-text max-w-[180px]">
        <p className="truncate">{productLabel}</p>
      </td>
      <td className="px-5 py-3.5 text-sm font-semibold text-text whitespace-nowrap">{formatINR(order.total)}</td>
      <td className="px-5 py-3.5 text-sm text-text-muted whitespace-nowrap">{order.date}</td>
      <td className="px-5 py-3.5">
        <span className={cn('inline-block text-xs font-medium px-2.5 py-1 rounded-full whitespace-nowrap', statusBadgeClass(order.status))}>
          {statusLabel(order.status)}
        </span>
      </td>
    </tr>
  );
}

// Mobile card
function OrderMobileCard({ order }: { order: SCOrder }) {
  const firstItem = order.items[0];
  const productLabel = order.items.length === 1
    ? firstItem?.name
    : `${firstItem?.name} +${order.items.length - 1} more`;

  return (
    <div className="px-5 py-4 flex flex-col gap-1.5">
      <div className="flex items-center justify-between gap-2">
        <p className="text-sm font-semibold text-text">{order.memberName}</p>
        <span className={cn('text-xs font-medium px-2.5 py-1 rounded-full', statusBadgeClass(order.status))}>
          {statusLabel(order.status)}
        </span>
      </div>
      <p className="text-xs text-text-muted font-mono">{order.id}</p>
      <p className="text-xs text-text-muted truncate">{productLabel}</p>
      <div className="flex items-center justify-between mt-0.5">
        <p className="text-sm font-bold text-text">{formatINR(order.total)}</p>
        <p className="text-xs text-text-muted">{order.date}</p>
      </div>
    </div>
  );
}

// ─── Page ─────────────────────────────────────────────────────────────────────

export default function SCOrdersPage() {
  const { orders, loading } = useSCOrders();

  const [search,       setSearch]       = useState('');
  const [deliveryTab,  setDeliveryTab]  = useState<DeliveryGroup>('all');
  const [dateFrom,     setDateFrom]     = useState('');
  const [dateTo,       setDateTo]       = useState('');

  const filtered = useMemo(() => orders.filter((o: SCOrder) => {
    const matchSearch = search === ''
      || o.id.toLowerCase().includes(search.toLowerCase())
      || o.memberName.toLowerCase().includes(search.toLowerCase())
      || o.items.some((i) => i.name.toLowerCase().includes(search.toLowerCase()));

    const matchGroup = deliveryTab === 'all' || toGroup(o.status) === deliveryTab;

    const orderDate = parseDate(o.date);
    const from = dateFrom ? new Date(dateFrom) : null;
    const to   = dateTo   ? new Date(dateTo)   : null;
    const matchFrom = !from || !orderDate || orderDate >= from;
    const matchTo   = !to   || !orderDate || orderDate <= to;

    return matchSearch && matchGroup && matchFrom && matchTo;
  }), [orders, search, deliveryTab, dateFrom, dateTo]);

  function countByGroup(group: DeliveryGroup): number {
    if (group === 'all') return orders.length;
    return orders.filter((o: SCOrder) => toGroup(o.status) === group).length;
  }

  return (
    <div className="pt-14 w-full">
      {/* Header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">My Orders</h1>
        <p className="text-sm text-text-muted mt-0.5">Orders placed on behalf of your members</p>
      </div>

      {/* Filters row */}
      <div className="flex flex-wrap items-center gap-3 mb-4">
        {/* Search */}
        <div className="relative flex-1 min-w-[200px]">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted" size={16} />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by order ID, member or product"
            className="w-full border border-border rounded-xl pl-9 pr-4 py-2.5 text-sm bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
        </div>

        {/* Date range */}
        <div className="flex items-center gap-2 shrink-0">
          <span className="text-sm text-text-muted hidden sm:inline">From</span>
          <input
            type="date"
            value={dateFrom}
            onChange={(e) => setDateFrom(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          <span className="text-sm text-text-muted">–</span>
          <input
            type="date"
            value={dateTo}
            onChange={(e) => setDateTo(e.target.value)}
            className="border border-border rounded-lg px-3 py-2 text-sm bg-bg text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
          />
          {(dateFrom || dateTo) && (
            <button
              onClick={() => { setDateFrom(''); setDateTo(''); }}
              className="text-xs text-danger hover:text-danger/80 transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Status tabs */}
      <div className="flex gap-2 flex-wrap mb-5">
        {DELIVERY_TABS.map((tab) => {
          const count  = countByGroup(tab.value);
          const active = deliveryTab === tab.value;
          return (
            <button
              key={tab.value}
              onClick={() => setDeliveryTab(tab.value)}
              className={cn(
                'flex items-center gap-1.5 rounded-full px-4 py-1.5 text-sm border transition-colors',
                active
                  ? 'bg-primary text-[#0b1410] font-semibold border-primary'
                  : 'bg-bg border-border text-text-muted hover:bg-surface'
              )}
            >
              {tab.label}
              {count > 0 && (
                <span className={cn(
                  'text-xs font-bold px-1.5 py-0.5 rounded-full leading-none',
                  active ? 'bg-[#0b1410]/20 text-[#0b1410]' : 'bg-primary/15 text-primary'
                )}>
                  {count}
                </span>
              )}
            </button>
          );
        })}
      </div>

      {/* Table container */}
      <div className="bg-surface border border-border rounded-2xl overflow-hidden">

        {loading && (
          <div className="flex flex-col divide-y divide-border">
            {Array.from({ length: 4 }).map((_, i) => (
              <div key={i} className="flex items-center gap-4 px-5 py-4 animate-pulse">
                <div className="h-3 w-24 bg-border rounded" />
                <div className="flex-1 h-3 bg-border rounded" />
                <div className="h-3 w-20 bg-border rounded" />
              </div>
            ))}
          </div>
        )}

        {!loading && filtered.length === 0 && (
          <div className="py-16 text-center text-text-muted text-sm">No orders found.</div>
        )}

        {!loading && filtered.length > 0 && (
          <>
            {/* Desktop table */}
            <div className="hidden md:block overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-border bg-primary/5">
                    {['Order ID', 'Member', 'Product', 'Amount', 'Order Date', 'Status'].map((h) => (
                      <th key={h} className="text-left px-5 py-3 text-xs font-semibold text-text-muted whitespace-nowrap">
                        {h}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {filtered.map((order: SCOrder) => (
                    <OrderTableRow key={order.id} order={order} />
                  ))}
                </tbody>
              </table>
            </div>

            {/* Mobile cards */}
            <div className="md:hidden divide-y divide-border">
              {filtered.map((order: SCOrder) => (
                <OrderMobileCard key={order.id} order={order} />
              ))}
            </div>
          </>
        )}
      </div>

      {/* Row count */}
      {!loading && (
        <p className="text-xs text-text-muted mt-3 text-right">
          {filtered.length} order{filtered.length !== 1 ? 's' : ''} shown
        </p>
      )}
    </div>
  );
}
