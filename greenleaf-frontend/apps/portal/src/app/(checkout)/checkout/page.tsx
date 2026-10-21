'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ChevronLeft, MapPin, CreditCard, Truck, ChevronDown, Home, Store } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useServiceCenter } from '@/hooks/useMember';
import { useCheckoutOptions } from '@/hooks/useCheckout';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import type { DeliveryMode } from '@/types/order';

function formatRupiah(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function StepIndicator({ current }: { current: 1 | 2 | 3 }) {
  const steps = [
    { n: 1, label: 'Cart'          },
    { n: 2, label: 'Confirm order' },
    { n: 3, label: 'Payment'       },
  ] as const;
  return (
    <div className="flex items-center gap-0">
      {steps.map((step, i) => {
        const done   = step.n < current;
        const active = step.n === current;
        return (
          <div key={step.n} className="flex items-center">
            {i > 0 && <div className={cn('h-px w-10 sm:w-16', done ? 'bg-primary' : 'bg-border')} />}
            <div className="flex items-center gap-1.5">
              <div className={cn(
                'w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold shrink-0',
                active || done ? 'bg-primary text-[#0b1410]' : 'bg-border text-text-muted'
              )}>
                {step.n}
              </div>
              <span className={cn('text-sm', active ? 'font-semibold text-text' : 'text-text-muted')}>
                {step.label}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function Section({ title, icon, children }: {
  title:    string;
  icon:     React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div>
      <div className="flex items-center gap-2 mb-3">
        {icon}
        <h2 className="text-sm font-bold text-text uppercase tracking-wide">{title}</h2>
      </div>
      {children}
    </div>
  );
}

export default function CheckoutConfirmPage() {
  const router = useRouter();

  const { data: serviceCenter } = useServiceCenter();
  const { shippingOptions, paymentMethods, addresses, loading: optionsLoading } = useCheckoutOptions();
  const { items }               = useCart();
  const { data: products }      = useProducts();

  const [deliveryMode,      setDeliveryMode]      = useState<DeliveryMode>('direct');
  const [selectedAddress,   setSelectedAddress]   = useState<string>('');
  const [selectedShipping,  setSelectedShipping]  = useState<string>('');
  const [selectedPayment,   setSelectedPayment]   = useState<string>('');
  const [note,              setNote]              = useState('');
  const [showAddressPicker, setShowAddressPicker] = useState(false);
  const [placingOrder,      setPlacingOrder]      = useState(false);

  // Set defaults once data loads
  const defaultAddressId = addresses.find((a) => a.isDefault)?.id ?? addresses[0]?.id ?? '';
  const effectiveAddress = selectedAddress || defaultAddressId;

  const defaultShipping = shippingOptions[0]?.id ?? '';
  const effectiveShipping = selectedShipping || defaultShipping;

  const defaultPayment = paymentMethods[0]?.id ?? '';
  const effectivePayment = selectedPayment || defaultPayment;

  const address  = addresses.find((a) => a.id === effectiveAddress) ?? addresses[0];
  const shipping = shippingOptions.find((s) => s.id === effectiveShipping) ?? shippingOptions[0];

  // Enrich cart items with product details
  const cartLines = useMemo(() => items.map((item) => ({
    ...item,
    product: products.find((p) => p.id === item.productId),
  })), [items, products]);

  const subtotal = cartLines.reduce((s, l) => s + (l.product?.price ?? 0) * l.qty, 0);
  const totalPV  = cartLines.reduce((s, l) => s + ((l.product?.pv ?? 0) * l.qty), 0);
  const total    = subtotal + (shipping?.price ?? 0);

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  function handlePlaceOrder() {
    setPlacingOrder(true);
    setTimeout(() => router.push('/checkout/payment'), 800);
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="border-b border-border bg-surface px-6 py-4 flex items-center gap-8">
        <div className="flex items-center gap-2 shrink-0">
          <svg viewBox="0 0 20 20" fill="currentColor" className="h-5 w-5 text-primary">
            <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
          </svg>
          <span className="font-bold text-text text-base">Greenleaf</span>
        </div>
        <StepIndicator current={2} />
      </header>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 pb-10">
        <div className="flex items-center gap-3 mb-6">
          <button
            onClick={() => router.back()}
            className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
          >
            <ChevronLeft className="h-4 w-4" />Back
          </button>
          <div>
            <h1 className="text-2xl font-bold text-text">Checkout</h1>
            <p className="text-sm text-text-muted mt-0.5">Review your order before payment</p>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* LEFT COLUMN */}
          <div className="lg:col-span-2 flex flex-col gap-5">

            {/* Delivery Mode */}
            <Section title="Delivery Method" icon={<Truck className="h-4 w-4 text-primary" />}>
              <div className="grid grid-cols-2 gap-3">
                <button
                  onClick={() => setDeliveryMode('direct')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                    deliveryMode === 'direct' ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40 bg-surface'
                  )}
                >
                  <Home className={cn('h-5 w-5', deliveryMode === 'direct' ? 'text-primary' : 'text-text-muted')} />
                  <span className={cn('text-sm font-semibold', deliveryMode === 'direct' ? 'text-primary' : 'text-text')}>
                    Ship to me
                  </span>
                  <span className="text-xs text-text-muted text-center">Deliver directly to my address</span>
                </button>
                <button
                  onClick={() => setDeliveryMode('pickup')}
                  className={cn(
                    'flex flex-col items-center gap-2 p-4 rounded-xl border-2 transition-colors',
                    deliveryMode === 'pickup' ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40 bg-surface'
                  )}
                >
                  <Store className={cn('h-5 w-5', deliveryMode === 'pickup' ? 'text-primary' : 'text-text-muted')} />
                  <span className={cn('text-sm font-semibold', deliveryMode === 'pickup' ? 'text-primary' : 'text-text')}>
                    Pick up
                  </span>
                  <span className="text-xs text-text-muted text-center">Pick up at Service Center</span>
                </button>
              </div>
            </Section>

            {/* Delivery Address / Service Center */}
            {deliveryMode === 'pickup' ? (
              <Section title="Service Center" icon={<Store className="h-4 w-4 text-primary" />}>
                <div className="bg-surface border border-border rounded-xl p-4">
                  {serviceCenter ? (
                    <div className="flex items-start gap-3">
                      <div className="w-9 h-9 rounded-lg bg-primary-soft flex items-center justify-center shrink-0">
                        <Store className="h-4 w-4 text-primary" />
                      </div>
                      <div>
                        <div className="flex items-center gap-2 mb-0.5">
                          <p className="text-sm font-semibold text-text">{serviceCenter.name}</p>
                          {serviceCenter.verified && (
                            <span className="text-[10px] font-bold px-1.5 py-0.5 rounded bg-primary/15 text-primary">Verified</span>
                          )}
                        </div>
                        <p className="text-sm text-text-muted">{serviceCenter.street}</p>
                        <p className="text-sm text-text-muted">{serviceCenter.city}, {serviceCenter.province}</p>
                      </div>
                    </div>
                  ) : (
                    <div className="h-16 animate-pulse bg-border/40 rounded-lg" />
                  )}
                </div>
              </Section>
            ) : (
              <Section title="Delivery Address" icon={<MapPin className="h-4 w-4 text-primary" />}>
              <div className="bg-surface border border-border rounded-xl p-4">
                {address ? (
                  <>
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="flex items-center gap-2 mb-1">
                          <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-primary/15 text-primary">
                            {address.label}
                          </span>
                          {address.isDefault && <span className="text-xs text-text-muted">Default</span>}
                        </div>
                        <p className="text-sm font-semibold text-text">{address.name} · {address.phone}</p>
                        <p className="text-sm text-text-muted mt-0.5">{address.street}</p>
                        <p className="text-sm text-text-muted">{address.city}, {address.province} {address.postal}</p>
                      </div>
                      <button
                        onClick={() => setShowAddressPicker((v) => !v)}
                        className="text-sm text-primary hover:underline shrink-0 flex items-center gap-1"
                      >
                        Change
                        <ChevronDown className={cn('h-3.5 w-3.5 transition-transform', showAddressPicker && 'rotate-180')} />
                      </button>
                    </div>
                    {showAddressPicker && (
                      <div className="mt-3 border-t border-border pt-3 flex flex-col gap-2">
                        {addresses.map((addr) => (
                          <button
                            key={addr.id}
                            onClick={() => { setSelectedAddress(addr.id); setShowAddressPicker(false); }}
                            className={cn(
                              'text-left p-3 rounded-lg border transition-colors text-sm',
                              effectiveAddress === addr.id ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40'
                            )}
                          >
                            <p className="font-semibold text-text">{addr.label} — {addr.street}</p>
                            <p className="text-text-muted text-xs mt-0.5">{addr.city}, {addr.province}</p>
                          </button>
                        ))}
                      </div>
                    )}
                  </>
                ) : (
                  <div className="h-16 animate-pulse bg-border/40 rounded-lg" />
                )}
              </div>
            </Section>
            )}

            {/* Shipping */}
            <Section title="Shipping Method" icon={<Truck className="h-4 w-4 text-primary" />}>
              {optionsLoading ? (
                <div className="flex flex-col gap-2">
                  {Array.from({ length: 4 }).map((_, i) => (
                    <div key={i} className="h-14 animate-pulse bg-border/40 rounded-xl" />
                  ))}
                </div>
              ) : (
                <div className="flex flex-col gap-2">
                  {shippingOptions.map((opt) => (
                    <label
                      key={opt.id}
                      className={cn(
                        'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                        effectiveShipping === opt.id ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40 bg-surface'
                      )}
                    >
                      <input
                        type="radio" name="shipping" value={opt.id}
                        checked={effectiveShipping === opt.id}
                        onChange={() => setSelectedShipping(opt.id)}
                        className="accent-primary"
                      />
                      <div className="flex-1">
                        <p className="text-sm font-semibold text-text">{opt.label}</p>
                        <p className="text-xs text-text-muted">Est. {opt.eta}</p>
                      </div>
                      <span className="text-sm font-semibold text-text">{formatRupiah(opt.price)}</span>
                    </label>
                  ))}
                </div>
              )}
            </Section>

            {/* Payment */}
            <Section title="Payment Method" icon={<CreditCard className="h-4 w-4 text-primary" />}>
              <div className="flex flex-col gap-2">
                {paymentMethods.map((pm) => (
                  <label
                    key={pm.id}
                    className={cn(
                      'flex items-center gap-3 p-3 rounded-xl border cursor-pointer transition-colors',
                      effectivePayment === pm.id ? 'border-primary bg-primary-soft/50' : 'border-border hover:border-primary/40 bg-surface'
                    )}
                  >
                    <input
                      type="radio" name="payment" value={pm.id}
                      checked={effectivePayment === pm.id}
                      onChange={() => setSelectedPayment(pm.id)}
                      className="accent-primary"
                    />
                    <div className="flex-1">
                      <p className="text-sm font-semibold text-text">{pm.label}</p>
                      <p className="text-xs text-text-muted">{pm.detail}</p>
                    </div>
                  </label>
                ))}
              </div>
            </Section>

            {/* Note */}
            <Section title="Order Note (optional)" icon={null}>
              <textarea
                value={note}
                onChange={(e) => setNote(e.target.value)}
                rows={3}
                placeholder="Any special instructions for your order..."
                className="w-full px-3 py-2.5 rounded-xl border border-border bg-surface text-text placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/40 resize-none"
              />
            </Section>
          </div>

          {/* RIGHT: Order Summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-5 sticky top-6">
              <h2 className="text-base font-bold text-text mb-4">Order Summary</h2>

              <div className="flex flex-col gap-2 mb-4">
                {cartLines.map((line) => line.product && (
                  <div key={line.productId} className="flex items-center gap-2">
                    <div className="w-10 h-10 shrink-0 rounded-lg bg-primary-soft flex items-center justify-center">
                      <span className="text-[7px] text-primary/60 text-center font-medium leading-tight px-0.5">
                        {line.product.sku}
                      </span>
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="text-xs font-medium text-text truncate">{line.product.name}</p>
                      <p className="text-xs text-text-muted">×{line.qty}</p>
                    </div>
                    <p className="text-xs font-semibold text-text shrink-0">
                      {formatRupiah(line.product.price * line.qty)}
                    </p>
                  </div>
                ))}
              </div>

              <div className="border-t border-border pt-3 flex flex-col gap-2 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal</span>
                  <span className="font-medium text-text">{formatRupiah(subtotal)}</span>
                </div>
                {shipping && (
                  <div className="flex justify-between text-text-muted">
                    <span>Shipping ({shipping.courier})</span>
                    <span className="font-medium text-text">{formatRupiah(shipping.price)}</span>
                  </div>
                )}
                {totalPV > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>Total PV</span>
                    <span className="font-semibold text-primary">{totalPV} PV</span>
                  </div>
                )}
              </div>

              <div className="border-t border-border mt-3 pt-3">
                <div className="flex justify-between font-bold text-text text-base">
                  <span>Total</span>
                  <span>{formatRupiah(total)}</span>
                </div>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={placingOrder}
                className="w-full mt-5 py-3 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
              >
                {placingOrder ? 'Placing Order…' : 'Place Order'}
              </button>

              <p className="text-xs text-text-muted text-center mt-3">🔒 Secure checkout — mock only</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
