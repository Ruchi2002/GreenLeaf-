'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import Link from 'next/link';
import { useParams } from 'next/navigation';
import {
  Clock, CheckCircle2, Package, Phone, Mail, CreditCard, ArrowLeft,
} from 'lucide-react';
import { orderDetails, type TimelineStatus, type TimelineStep } from '../../../../data/mock/adminOrderDetail';
import { cn } from '@/lib/utils';

const STEP_ICON: Record<TimelineStatus, React.ElementType> = {
  completed: CheckCircle2,
  active:    Clock,
  pending:   Clock,
};

const STEP_ICON_BG: Record<TimelineStatus, string> = {
  completed: 'bg-green-500 text-white',
  active:    'bg-amber-500 text-white',
  pending:   'bg-gray-100 text-gray-400',
};

const STEP_LABEL: Record<TimelineStatus, string> = {
  completed: 'text-gray-900',
  active:    'text-amber-600',
  pending:   'text-gray-400',
};

const STEP_TIME: Record<TimelineStatus, string> = {
  completed: 'text-gray-500',
  active:    'text-amber-500',
  pending:   'text-gray-300',
};

const STATUS_BANNER: Record<string, { bg: string; border: string; icon: string; title: string; sub: string }> = {
  'Pending Approval': {
    bg: 'bg-amber-50', border: 'border-amber-200', icon: 'bg-amber-100 text-amber-600',
    title: 'text-amber-800', sub: 'text-amber-600/70',
  },
  'Processing': {
    bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800', sub: 'text-blue-600/70',
  },
  'Completed': {
    bg: 'bg-green-50', border: 'border-green-200', icon: 'bg-green-100 text-green-600',
    title: 'text-green-800', sub: 'text-green-600/70',
  },
  'Cancelled': {
    bg: 'bg-red-50', border: 'border-red-200', icon: 'bg-red-100 text-red-600',
    title: 'text-red-800', sub: 'text-red-600/70',
  },
};

const TIER_BADGE: Record<string, string> = {
  Diamond: 'bg-cyan-100 text-cyan-700',
  Platinum:'bg-puRPle-100 text-puRPle-700',
  Gold:    'bg-yellow-100 text-yellow-700',
  Silver:  'bg-gray-100 text-gray-600',
  Bronze:  'bg-orange-100 text-orange-700',
};

export default function OrderDetailPage() {
  const { id } = useParams<{ id: string }>();
  const order = orderDetails[id];

  const [note,     setNote]     = useState('');
  const [approved, setApproved] = useState(false);
  const [rejected, setRejected] = useState(false);

  if (!order) {
    return (
      <div className="space-y-4">
        <Link href="/orders" className="inline-flex items-center gap-1.5 text-sm text-gray-400 hover:text-gray-700 transition-colors">
          <ArrowLeft size={14} /> Orders
        </Link>
        <div className="bg-white rounded-2xl shadow-sm p-16 text-center text-gray-400 text-sm">
          Order not found.
        </div>
      </div>
    );
  }

  const isPending = order.status === 'Pending Approval';
  const banner    = STATUS_BANNER[order.status] ?? {
    bg: 'bg-blue-50', border: 'border-blue-200', icon: 'bg-blue-100 text-blue-600',
    title: 'text-blue-800', sub: 'text-blue-600/70',
  };
  const { member } = order;

  return (
    <div className="space-y-5">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm text-gray-400">
        <Link href="/orders" className="inline-flex items-center gap-1 hover:text-gray-700 transition-colors">
          <ArrowLeft size={14} />
          Orders
        </Link>
        <span>/</span>
        <span className="text-gray-600 font-medium">{order.orderId}</span>
      </div>

      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">{order.orderId}</h1>
          <p className="text-sm text-gray-500 mt-0.5">
            {order.timeline[0]?.time}
          </p>
        </div>
        <div className="flex flex-col sm:flex-row gap-2 w-full sm:w-auto">
          <button className="w-full sm:w-auto border border-gray-200 text-gray-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-gray-50 transition-colors">
            Print Invoice
          </button>
          {isPending && !approved && !rejected && (
            <button
              onClick={() => { setApproved(true); setRejected(false); }}
              className="w-full sm:w-auto bg-green-600 text-[#0b1410] px-4 py-2 rounded-xl text-sm font-semibold hover:bg-green-500 transition-colors"
            >
              Approve Order
            </button>
          )}
        </div>
      </div>

      {/* Status banner */}
      <div className={cn('rounded-xl border px-4 sm:px-6 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3', banner.bg, banner.border)}>
        <div className="flex items-center gap-3">
          <div className={cn('w-9 h-9 rounded-xl flex items-center justify-center', banner.icon)}>
            <Clock size={18} />
          </div>
          <div>
            <p className={cn('text-lg font-bold', banner.title)}>
              {approved ? 'Approved' : rejected ? 'Rejected' : order.status}
            </p>
            <p className={cn('text-xs mt-0.5', banner.sub)}>
              {approved ? 'This order has been approved' : rejected ? 'This order has been rejected' : 'This order is awaiting admin review'}
            </p>
          </div>
        </div>
        <p className="text-sm text-gray-400 font-medium">{order.orderId}</p>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-5 gap-5 items-start">

        {/* LEFT — ~60% */}
        <div className="lg:col-span-3 space-y-5">

          {/* Card 1 — Order Timeline */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-6">
            <h2 className="text-base font-semibold text-gray-900 mb-6">Order Timeline</h2>
            <div className="space-y-0">
              {order.timeline.map((step: TimelineStep, i: number) => {
                const Icon   = STEP_ICON[step.status];
                const isLast = i === order.timeline.length - 1;
                return (
                  <div key={step.label} className="flex gap-4">
                    <div className="flex flex-col items-center">
                      <div className={cn('w-8 h-8 rounded-full flex items-center justify-center shrink-0 z-10', STEP_ICON_BG[step.status])}>
                        <Icon size={15} />
                      </div>
                      {!isLast && (
                        <div
                          className={cn('w-0.5 flex-1 my-1', step.status === 'completed' ? 'bg-green-300' : 'bg-gray-100')}
                          style={{ minHeight: '32px' }}
                        />
                      )}
                    </div>
                    <div className={cn('pb-6', isLast && 'pb-0')}>
                      <p className={cn('text-sm font-semibold leading-tight', STEP_LABEL[step.status])}>{step.label}</p>
                      <p className={cn('text-xs mt-0.5', STEP_TIME[step.status])}>{step.time}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Card 2 — Product */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Product</h2>
            <div className="flex flex-col sm:flex-row sm:items-center gap-4">
              <div className="w-full sm:w-20 h-28 sm:h-20 rounded-xl bg-amber-100 flex items-center justify-center shrink-0">
                <Package size={32} className="text-amber-600" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-lg font-bold text-gray-900 leading-tight mb-2">{order.product}</p>
                <div className="flex items-center gap-2 flex-wrap mb-2">
                  <span className="text-xs font-mono font-medium px-2.5 py-0.5 rounded-full bg-gray-100 text-gray-600">
                    {order.sku}
                  </span>
                  <span className="text-xs font-semibold px-2.5 py-0.5 rounded-full bg-green-100 text-green-700">
                    {order.pv} PV
                  </span>
                </div>
                <p className="text-xl font-bold text-gray-900">{order.amount}</p>
              </div>
            </div>
          </div>

          {/* Card 3 — Member */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Member</h2>
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
              <div className="flex items-center gap-3">
                <div className={cn('w-12 h-12 rounded-full flex items-center justify-center shrink-0', member.avatarBg)}>
                  <span className="text-white text-sm font-bold">{member.initials}</span>
                </div>
                <div className="min-w-0">
                  <div className="flex items-center gap-2 mb-0.5 flex-wrap">
                    <p className="text-base font-bold text-gray-900">{member.name}</p>
                    <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TIER_BADGE[member.tier] ?? 'bg-gray-100 text-gray-600')}>
                      {member.tier}
                    </span>
                  </div>
                  <p className="text-xs text-gray-400 mb-1">Network Depth {member.depth}</p>
                  <div className="flex flex-col gap-1">
                    <div className="flex items-center gap-1.5">
                      <Phone size={13} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600">{member.phone}</span>
                    </div>
                    <div className="flex items-center gap-1.5">
                      <Mail size={13} className="text-gray-400 shrink-0" />
                      <span className="text-xs text-gray-600 truncate">{member.email}</span>
                    </div>
                  </div>
                </div>
              </div>
              <Link
                href="/members"
                className="w-full sm:w-auto text-center border border-green-600 text-green-600 px-4 py-2 rounded-xl text-sm font-medium hover:bg-green-50 transition-colors"
              >
                View Profile
              </Link>
            </div>
          </div>
        </div>

        {/* RIGHT — ~40% */}
        <div className="lg:col-span-2 space-y-5">

          {/* Card 1 — Payment Summary */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Payment Summary</h2>
            <div className="space-y-3 mb-4">
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Subtotal</span>
                <span className="font-medium text-gray-900">{order.subtotal}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">PV Value</span>
                <span className="font-medium text-gray-900">{order.pv} PV</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-gray-500">Shipping</span>
                <span className="font-medium text-gray-900">{order.shipping}</span>
              </div>
            </div>
            <div className="border-t border-gray-100 pt-4 mb-4">
              <div className="flex items-center justify-between">
                <span className="text-sm font-semibold text-gray-700">Total</span>
                <span className="text-xl font-bold text-green-600">{order.total}</span>
              </div>
            </div>
            <div className="flex items-center gap-2 flex-wrap">
              <span className="inline-flex items-center gap-1.5 text-xs font-medium px-3 py-1 rounded-full border border-gray-300 text-gray-700">
                <CreditCard size={12} />
                {order.paymentMethod}
              </span>
              {isPending && (
                <span className="text-xs font-semibold px-3 py-1 rounded-full bg-amber-100 text-amber-700">
                  Awaiting Confirmation
                </span>
              )}
            </div>
          </div>

          {/* Card 2 — Actions */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-4">Actions</h2>
            <div className="space-y-2.5">
              {isPending ? (
                <>
                  <button
                    onClick={() => { setApproved(true); setRejected(false); }}
                    disabled={approved || rejected}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-sm font-semibold transition-colors',
                      approved
                        ? 'bg-green-100 text-green-700 cursor-default'
                        : 'bg-green-600 text-[#0b1410] hover:bg-green-500'
                    )}
                  >
                    {approved ? 'Order Approved ✓' : 'Approve Order'}
                  </button>
                  <button
                    onClick={() => { setRejected(true); setApproved(false); }}
                    disabled={approved || rejected}
                    className={cn(
                      'w-full py-2.5 rounded-xl text-sm font-semibold border transition-colors',
                      rejected
                        ? 'border-red-200 text-red-400 cursor-default'
                        : 'border-red-400 text-red-600 hover:bg-red-50'
                    )}
                  >
                    {rejected ? 'Order Rejected' : 'Reject Order'}
                  </button>
                </>
              ) : (
                <p className="text-sm text-gray-400 text-center py-2">
                  No actions available for {order.status.toLowerCase()} orders.
                </p>
              )}
              <div className="text-center pt-1">
                <button className="text-xs text-gray-400 hover:text-gray-600 transition-colors">
                  Print Invoice
                </button>
              </div>
            </div>
          </div>

          {/* Card 3 — Admin Notes */}
          <div className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <h2 className="text-base font-semibold text-gray-900 mb-3">Admin Notes</h2>
            <textarea
              value={note}
              onChange={(e) => setNote(e.target.value)}
              rows={4}
              placeholder="Add an internal note about this order..."
              className="w-full text-sm text-gray-700 placeholder:text-gray-300 border border-gray-200 rounded-xl px-4 py-3 resize-none focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
            />
            <div className="flex justify-end mt-2">
              <button className="w-full sm:w-auto text-sm font-semibold bg-green-600 text-[#0b1410] px-4 py-2 rounded-xl hover:bg-green-500 transition-colors">
                Save Note
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
