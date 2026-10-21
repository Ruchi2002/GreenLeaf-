'use client';

import { useParams } from 'next/navigation';
import Link from 'next/link';
import { Printer, Download } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_SC_ORDERS } from '@/data/mock/scOrders';
import type { SCOrderStatus, SCOrderType } from '@/data/mock/scOrders';

function formatRupiah(amount: number) {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function statusLabel(status: SCOrderStatus): string {
  return status.replace(/_/g, ' ').replace(/\b\w/g, (c) => c.toUpperCase());
}

function statusTextClass(status: SCOrderStatus): string {
  switch (status) {
    case 'pending_payment': return 'text-amber-700';
    case 'processing':      return 'text-blue-600';
    case 'shipped':         return 'text-primary';
    case 'completed':       return 'text-green-700';
    case 'cancelled':       return 'text-red-600';
  }
}

function statusBadgeClass(status: SCOrderStatus): string {
  switch (status) {
    case 'pending_payment': return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'processing':      return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'shipped':         return 'bg-primary-soft text-primary border border-primary/20';
    case 'completed':       return 'bg-green-50 text-green-700 border border-green-200';
    case 'cancelled':       return 'bg-red-50 text-red-600 border border-red-200';
  }
}

function typeLabel(type: SCOrderType): string {
  return type === 'gift' ? 'Gift Order' : 'Member Purchase';
}

function typeBadgeClass(type: SCOrderType): string {
  return type === 'gift'
    ? 'bg-puRPle-50 text-puRPle-700 border border-puRPle-200'
    : 'bg-blue-50 text-blue-600 border border-blue-200';
}

// ─── Diamond logo icon (matches sidebar) ─────────────────────────────────────

function DiamondIcon({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 20 20" fill="currentColor" className={className}>
      <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
    </svg>
  );
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function SCInvoicePage() {
  const params  = useParams<{ orderId: string }>();
  const orderId = params.orderId ?? '';
  const order   = MOCK_SC_ORDERS.find((o) => o.id === orderId) ?? null;

  if (!order) {
    return (
      <div className="pt-14 w-full flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-lg font-semibold text-text">Invoice not found.</p>
        <Link href="/sc/orders" className="text-primary text-sm hover:underline">
          ← Back to SC Orders
        </Link>
      </div>
    );
  }

  const subtotal = order.items.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <div className="pt-14 w-full">
      <style>{`
        @media print {
          body * { visibility: hidden; }
          #invoice-content, #invoice-content * { visibility: visible; }
          #invoice-content { position: absolute; left: 0; top: 0; width: 100%; }
        }
      `}</style>

      {/* Action bar — hidden on print */}
      <div className="flex items-center justify-between mb-6 print:hidden">
        <Link href="/sc/orders" className="text-sm text-primary hover:underline">
          ← Back to SC Orders
        </Link>
        <div className="flex items-center gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 border border-border rounded-xl px-5 py-2 text-sm text-text hover:bg-bg transition-colors"
          >
            <Printer size={15} />
            Print invoice
          </button>
          <button
            onClick={() => window.print()}
            className="flex items-center gap-2 bg-primary text-[#0b1410] font-semibold rounded-xl px-5 py-2 text-sm hover:bg-primary/90 transition-colors"
          >
            <Download size={15} />
            Download PDF
          </button>
        </div>
      </div>

      {/* Invoice card */}
      <div id="invoice-content" className="bg-surface border border-border rounded-2xl shadow-sm p-10 w-full">

        {/* ── Header ── */}
        <div className="flex items-start justify-between mb-8">
          {/* Left — SC info */}
          <div>
            <div className="flex items-center gap-2 mb-1">
              <DiamondIcon className="h-6 w-6 text-primary" />
              <span className="text-2xl font-bold text-text">Greenleaf</span>
            </div>
            <p className="text-sm text-text-muted">Service Center Invoice</p>
            <p className="text-sm text-text mt-3 font-medium">Robbin Hou</p>
            <p className="text-xs text-text-muted">RP97850827</p>
            <p className="text-xs text-text-muted">Jl. Sudirman No. 45, Jakarta Pusat</p>
          </div>

          {/* Right — invoice meta */}
          <div className="text-right">
            <p className="text-3xl font-bold text-primary">INVOICE</p>
            <p className="text-sm text-text-muted mt-1">#{order.id}</p>
            <p className="text-sm text-text-muted">Date: {order.date}</p>
            <span className={cn('inline-block mt-2 rounded-full px-3 py-0.5 text-xs', statusBadgeClass(order.status))}>
              {statusLabel(order.status)}
            </span>
          </div>
        </div>

        <div className="border-t border-border my-6" />

        {/* ── Bill To + Order Info ── */}
        <div className="grid grid-cols-2 gap-8">
          {/* Bill To */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-3">Bill To</p>
            <div className="flex items-center gap-3 mb-3">
              <div className="w-10 h-10 bg-primary-soft rounded-full flex items-center justify-center shrink-0">
                <span className="text-primary font-bold text-sm">{order.memberInitials}</span>
              </div>
              <div>
                <p className="font-semibold text-sm text-text">{order.memberName}</p>
                <p className="text-xs text-text-muted">{order.memberId}</p>
              </div>
            </div>
            <span className={cn('rounded-full px-3 py-0.5 text-xs', typeBadgeClass(order.type))}>
              {typeLabel(order.type)}
            </span>
          </div>

          {/* Order Details */}
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wider mb-2">Order Details</p>
            <div className="flex flex-col">
              {[
                { label: 'Order ID',    value: <span className="font-mono">{order.id}</span>              },
                { label: 'Order Date',  value: order.date                                                  },
                { label: 'Order Type',  value: typeLabel(order.type)                                       },
                { label: 'Status',      value: <span className={statusTextClass(order.status)}>{statusLabel(order.status)}</span> },
              ].map(({ label, value }) => (
                <div key={label} className="flex justify-between py-1 border-b border-border/50 last:border-0">
                  <span className="text-xs text-text-muted">{label}</span>
                  <span className="text-sm text-text">{value}</span>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* ── Items table ── */}
        <div className="mt-8 mb-6">
          {/* Table header */}
          <div className="bg-bg rounded-lg px-4 py-3 grid grid-cols-12 gap-2 text-xs font-semibold text-text-muted uppercase tracking-wider">
            <span className="col-span-5">Product</span>
            <span className="col-span-1 text-center">Qty</span>
            <span className="col-span-3 text-right">Unit Price</span>
            <span className="col-span-1 text-right">PV</span>
            <span className="col-span-2 text-right">Subtotal</span>
          </div>

          {/* Item rows */}
          {order.items.map((item, i) => (
            <div key={i} className="grid grid-cols-12 gap-2 px-4 py-4 border-b border-border/50 items-center">
              <span className="col-span-5 text-sm text-text font-medium">{item.name}</span>
              <span className="col-span-1 text-center text-sm text-text">{item.qty}</span>
              <span className="col-span-3 text-right text-sm text-text">{formatRupiah(item.price)}</span>
              <span className="col-span-1 text-right text-xs text-amber-600 font-medium">{item.pv}</span>
              <span className="col-span-2 text-right text-sm text-text font-medium">{formatRupiah(item.price * item.qty)}</span>
            </div>
          ))}
        </div>

        {/* ── Totals ── */}
        <div className="flex justify-end mt-4">
          <div className="w-72 space-y-2">
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Subtotal</span>
              <span className="text-text">{formatRupiah(subtotal)}</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-text-muted">Total PV</span>
              <span className="text-amber-600 font-semibold">{order.totalPV} PV</span>
            </div>
            <div className="border-t border-border my-2" />
            <div className="flex justify-between font-bold text-base">
              <span className="text-text">Total</span>
              <span className="text-primary">{formatRupiah(order.total)}</span>
            </div>
          </div>
        </div>

        {/* ── Footer ── */}
        <div className="mt-10 pt-6 border-t border-border flex items-center justify-between text-xs text-text-muted">
          <span>This invoice was generated by Greenleaf Portal · {order.date}</span>
          <span>Greenleaf — greenleafvip.com</span>
        </div>

      </div>
    </div>
  );
}
