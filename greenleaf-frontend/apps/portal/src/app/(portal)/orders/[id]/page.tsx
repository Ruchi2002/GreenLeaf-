'use client';

import { useParams, useRouter } from 'next/navigation';
import { cn } from '@/lib/utils';
import { useOrder } from '@/hooks/useOrders';
import type { OrderStatus } from '@/data/mock/orders';

function formatRupiah(amount: number) {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function statusLabel(status: OrderStatus): string {
  switch (status) {
    case 'pending_payment':  return 'Pending payment';
    case 'pending_delivery': return 'Pending delivery';
    case 'shipped':          return 'Shipped';
    case 'completed':        return 'Completed';
    case 'cancelled':        return 'Cancelled';
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

export default function OrderDetailPage() {
  const params = useParams<{ id: string }>();
  const router = useRouter();
  const id     = params.id ?? '';

  const { order, loading } = useOrder(id);

  if (loading) {
    return (
      <div className="pt-14 flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-4 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (!order) {
    return (
      <div className="pt-14 flex flex-col items-center justify-center py-24 gap-3">
        <p className="text-text-muted text-sm">Order not found.</p>
        <button
          onClick={() => router.push('/orders')}
          className="text-primary text-sm hover:underline"
        >
          ← Back to Orders
        </button>
      </div>
    );
  }

  const totalPrice = order.items.reduce((s, i) => s + i.price * i.qty, 0);
  const totalPV    = order.items.reduce((s, i) => s + i.pv    * i.qty, 0);

  return (
    <div className="pt-14">
      {/* Back link */}
      <button
        onClick={() => router.push('/orders')}
        className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors mb-4"
      >
        ← Back to Orders
      </button>

      {/* Order header */}
      <div className="flex items-start justify-between gap-3 mb-6 flex-wrap">
        <div>
          <h1 className="text-2xl font-bold text-text">#{order.id}</h1>
          <p className="text-sm text-primary mt-0.5">Placed {order.date}</p>
        </div>
        <span className={cn('text-xs font-semibold px-3 py-1.5 rounded-full mt-1', statusBadgeClass(order.status))}>
          {statusLabel(order.status)}
        </span>
      </div>

      <div className="flex flex-col gap-4 pb-8">

        {/* Status timeline card */}
        <div className="bg-surface border border-border rounded-2xl px-5 py-5">
          <h2 className="text-sm font-bold text-text mb-4">Status</h2>
          <div className="flex flex-col gap-0">
            {order.timeline.map((step, i) => (
              <div key={step.label} className="flex items-start gap-3">
                <div className="flex flex-col items-center">
                  <div className={cn(
                    'w-3 h-3 rounded-full border-2 shrink-0 mt-0.5',
                    step.done ? 'bg-primary border-primary' : 'bg-surface border-border'
                  )} />
                  {i < order.timeline.length - 1 && (
                    <div
                      className={cn('w-0.5 flex-1 my-1', step.done && order.timeline[i + 1]?.done ? 'bg-primary' : 'bg-border')}
                      style={{ minHeight: '24px' }}
                    />
                  )}
                </div>
                <div className="pb-4">
                  <p className={cn('text-sm font-semibold', step.done ? 'text-text' : 'text-text-muted')}>
                    {step.label}
                  </p>
                  {step.datetime && (
                    <p className="text-xs text-text-muted mt-0.5">{step.datetime}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Delivery + Payment — side by side */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          <div className="bg-surface border border-border rounded-2xl px-5 py-4">
            <h2 className="text-sm font-bold text-text mb-3">Delivery</h2>
            {order.shippingAddress ? (
              <p className="text-sm text-primary">{order.shippingAddress}</p>
            ) : (
              <p className="text-sm text-text-muted">Pickup at service center</p>
            )}
            {order.trackingNumber && (
              <p className="text-xs text-text-muted mt-1">Tracking: {order.trackingNumber}</p>
            )}
          </div>

          <div className="bg-surface border border-border rounded-2xl px-5 py-4">
            <h2 className="text-sm font-bold text-text mb-3">Payment</h2>
            <p className="text-sm text-text">{order.paymentMethod ?? 'E-Wallet'}</p>
          </div>
        </div>

        {/* Items card */}
        <div className="bg-surface border border-border rounded-2xl px-5 py-4">
          <h2 className="text-sm font-bold text-text mb-4">Items</h2>
          <div className="flex flex-col gap-3">
            {order.items.map((item) => (
              <div key={item.id} className="flex items-start justify-between gap-3 text-sm">
                <span className="text-text min-w-0 flex-1">{item.name} × {item.qty}</span>
                <span className="font-semibold text-text shrink-0">{formatRupiah(item.price * item.qty)}</span>
              </div>
            ))}
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between items-baseline text-sm">
            <span className="text-text-muted">Total PV</span>
            <span className={cn('font-semibold', totalPV > 0 ? 'text-gold' : 'text-text-muted')}>
              {totalPV > 0 ? `${totalPV} PV` : '0 PV'}
            </span>
          </div>
          <div className="border-t border-border mt-3 pt-3 flex justify-between items-baseline text-sm">
            <span className="font-bold text-text">Total paid</span>
            <span className="font-bold text-text">{formatRupiah(totalPrice)}</span>
          </div>
        </div>

        {/* Action buttons — Pending payment only */}
        {order.status === 'pending_payment' && (
          <div className="flex flex-col sm:flex-row gap-3">
            <button
              onClick={() => router.push('/checkout/payment')}
              className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              Pay now
            </button>
            <button className="flex-1 sm:flex-none px-5 py-2.5 rounded-xl border border-border text-sm text-text hover:border-primary/40 transition-colors">
              Cancel order
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
