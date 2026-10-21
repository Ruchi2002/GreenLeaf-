'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { Check, ShoppingBag, X, Eye, EyeOff } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useSCMembers }  from '@/hooks/useSCMembers';
import { MOCK_PRODUCTS } from '@/data/mock/products';
import { PRODUCT_ICON_MAP, PRODUCT_THEME_CLASSES } from '@/lib/productIcons';
import type { GiftCartItem } from '@/data/mock/scPurchaseGifts';

function formatINR(amount: number): string {
  return '₹' + amount.toLocaleString('en-IN');
}

// ── PIN Confirmation Modal ────────────────────────────────────────────────────
// MOCK ONLY — BACKEND_REQUIRED_LATER

function PinModal({
  total,
  memberName,
  onConfirm,
  onClose,
}: {
  total:      number;
  memberName: string;
  onConfirm:  () => void;
  onClose:    () => void;
}) {
  const [pin,       setPin]       = useState('');
  const [show,      setShow]      = useState(false);
  const [loading,   setLoading]   = useState(false);
  const [error,     setError]     = useState('');

  async function handleConfirm() {
    if (pin.length !== 6) { setError('Please enter your 6-digit wallet PIN'); return; }
    setError('');
    setLoading(true);
    // MOCK ONLY — BACKEND_REQUIRED_LATER (simulate PIN verification delay)
    await new Promise((r) => setTimeout(r, 1000));
    setLoading(false);
    onConfirm();
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-end sm:items-center justify-center"
      onClick={(e) => { if (e.target === e.currentTarget) onClose(); }}
    >
      <div className="absolute inset-0 bg-black/50" />

      <div className="relative w-full sm:max-w-sm bg-surface rounded-t-3xl sm:rounded-2xl p-6 shadow-2xl z-10">
        {/* Drag handle (mobile) */}
        <div className="w-10 h-1 bg-border rounded-full mx-auto mb-5 sm:hidden" />

        <div className="flex items-center justify-between mb-5">
          <h2 className="text-base font-semibold text-text">Confirm Payment</h2>
          <button
            onClick={onClose}
            className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-primary-soft transition-colors"
          >
            <X size={16} />
          </button>
        </div>

        {/* Amount summary */}
        <div className="bg-primary-soft/40 rounded-xl px-4 py-3 mb-5 flex flex-col gap-0.5">
          <p className="text-xs text-text-muted">Amount to deduct from SC Wallet</p>
          <p className="text-2xl font-bold text-text">{formatINR(total)}</p>
          <p className="text-xs text-text-muted mt-1">For: <span className="font-medium text-text">{memberName}</span></p>
        </div>

        {/* PIN input */}
        <div className="flex flex-col gap-1 mb-4">
          <label className="text-sm font-medium text-text">Wallet Payment PIN</label>
          <div className="relative">
            <input
              type={show ? 'text' : 'password'}
              inputMode="numeric"
              maxLength={6}
              value={pin}
              onChange={(e) => {
                if (/^\d*$/.test(e.target.value) && e.target.value.length <= 6) {
                  setPin(e.target.value);
                  setError('');
                }
              }}
              placeholder="6-digit PIN"
              className="w-full border border-border rounded-xl px-4 py-2.5 pr-10 text-sm bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 tracking-widest"
            />
            <button
              type="button"
              onClick={() => setShow((s) => !s)}
              className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
            >
              {show ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          {/* PIN dots indicator */}
          <div className="flex gap-2 mt-2 justify-center">
            {Array.from({ length: 6 }).map((_, i) => (
              <div
                key={i}
                className={cn(
                  'w-2.5 h-2.5 rounded-full transition-colors',
                  i < pin.length ? 'bg-primary' : 'bg-border'
                )}
              />
            ))}
          </div>
          {error && <p className="text-xs text-red-500 mt-1">{error}</p>}
        </div>

        <button
          onClick={handleConfirm}
          disabled={loading}
          className="w-full bg-primary text-[#0b1410] rounded-xl py-3 text-sm font-semibold hover:bg-primary/90 transition-colors disabled:opacity-70 flex items-center justify-center gap-2"
        >
          {loading && <span className="w-4 h-4 rounded-full border-2 border-[#0b1410]/40 border-t-transparent animate-spin" />}
          {loading ? 'Verifying…' : 'Confirm & Deduct'}
        </button>

        <p className="text-xs text-text-muted text-center mt-3">
          Your 6-digit payment password is used to authorise all wallet transactions
        </p>
      </div>
    </div>
  );
}

// ── Order Summary sidebar ─────────────────────────────────────────────────────

function OrderSummary({
  selectedMemberId,
  giftCart,
  memberName,
  memberInitials,
  memberId,
  onPlaceOrder,
}: {
  selectedMemberId: string | null;
  giftCart:         GiftCartItem[];
  memberName:       string;
  memberInitials:   string;
  memberId:         string;
  onPlaceOrder:     () => void;
}) {
  const subtotal = giftCart.reduce((s, i) => s + i.price * i.qty, 0);
  const totalPV  = giftCart.reduce((s, i) => s + i.pv * i.qty, 0);
  const disabled = !selectedMemberId || giftCart.length === 0;

  return (
    <div className="bg-surface border border-border rounded-2xl shadow-sm p-6 sticky top-6">
      <h3 className="font-semibold text-base text-text mb-4">Order Summary</h3>

      {/* Recipient */}
      <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Order for</p>
      {selectedMemberId ? (
        <div className="flex items-center gap-3 py-2">
          <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-xs font-bold text-primary">{memberInitials}</span>
          </div>
          <div className="min-w-0">
            <p className="text-sm font-medium text-text">{memberName}</p>
            <p className="text-xs text-text-muted">{memberId}</p>
          </div>
        </div>
      ) : (
        <p className="text-sm text-text-muted italic py-2">No member selected</p>
      )}

      <div className="border-t border-border my-4" />

      {/* Items */}
      <p className="text-xs text-text-muted uppercase tracking-wide mb-2">Items</p>
      {giftCart.length > 0 ? (
        <div className="flex flex-col gap-1">
          {giftCart.map((item) => (
            <div key={item.productId} className="flex justify-between text-sm py-1">
              <span className="text-text truncate mr-2">{item.name} × {item.qty}</span>
              <span className="text-text shrink-0">{formatINR(item.price * item.qty)}</span>
            </div>
          ))}
        </div>
      ) : (
        <p className="text-sm text-text-muted italic">No items added</p>
      )}

      <div className="border-t border-border my-4" />

      {/* Totals */}
      <div className="flex flex-col gap-1.5">
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Subtotal</span>
          <span className="text-text">{formatINR(subtotal)}</span>
        </div>
        {totalPV > 0 && (
          <div className="flex justify-between text-sm">
            <span className="text-text-muted">Total PV</span>
            <span className="text-amber-600 font-medium">{totalPV} PV</span>
          </div>
        )}
        <div className="flex justify-between text-sm">
          <span className="text-text-muted">Payment</span>
          <span className="text-text font-medium">SC Wallet</span>
        </div>
        <div className="flex justify-between font-semibold text-base mt-2">
          <span className="text-text">Total</span>
          <span className="text-primary">{formatINR(subtotal)}</span>
        </div>
      </div>

      <button
        onClick={onPlaceOrder}
        disabled={disabled}
        className={cn(
          'w-full py-3 rounded-xl font-semibold mt-6 transition-colors',
          disabled
            ? 'bg-primary/40 text-[#0b1410]/50 cursor-not-allowed'
            : 'bg-primary text-[#0b1410] hover:bg-primary/90'
        )}
      >
        Place Order
      </button>

      {disabled && (
        <p className="text-xs text-text-muted text-center mt-2">
          {!selectedMemberId ? 'Select a member first' : 'Add at least one product'}
        </p>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────────────────────────────

export default function PurchasingProductPage() {
  const { members, loading: membersLoading } = useSCMembers();

  const [selectedMemberId, setSelectedMemberId] = useState<string | null>(null);
  const [giftCart,         setGiftCart]         = useState<GiftCartItem[]>([]);
  const [search,           setSearch]           = useState('');
  const [pinOpen,          setPinOpen]          = useState(false);
  const [submitted,        setSubmitted]        = useState(false);

  const selectedMember = members.find((m) => m.id === selectedMemberId) ?? null;

  const filteredProducts = useMemo(
    () => MOCK_PRODUCTS.filter((p) =>
      search === '' || p.name.toLowerCase().includes(search.toLowerCase())
    ),
    [search]
  );

  function getCartItem(productId: string): GiftCartItem | undefined {
    return giftCart.find((i) => i.productId === productId);
  }

  function addToCart(productId: string) {
    const product = MOCK_PRODUCTS.find((p) => p.id === productId);
    if (!product) return;
    setGiftCart((cart) => {
      const existing = cart.find((i) => i.productId === productId);
      if (existing) return cart.map((i) => i.productId === productId ? { ...i, qty: i.qty + 1 } : i);
      return [...cart, {
        productId: product.id,
        name:      product.name,
        price:     product.price,
        pv:        product.pv ?? 0,
        qty:       1,
        image:     product.image ?? '',
      }];
    });
  }

  function changeQty(productId: string, delta: number) {
    setGiftCart((cart) =>
      cart
        .map((i) => i.productId === productId ? { ...i, qty: i.qty + delta } : i)
        .filter((i) => i.qty > 0)
    );
  }

  // MOCK ONLY — BACKEND_REQUIRED_LATER
  function handlePinConfirmed() {
    setPinOpen(false);
    setSubmitted(true);
  }

  // ── Success screen ────────────────────────────────────────────────────────

  if (submitted) {
    return (
      <div className="pt-14 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Purchasing Product</h1>
          <p className="text-sm text-text-muted mt-0.5">Buy products on behalf of a member</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl shadow-sm p-12 text-center max-w-md mx-auto mt-8">
          <div className="w-16 h-16 bg-primary-soft rounded-full flex items-center justify-center mx-auto mb-4">
            <ShoppingBag size={32} className="text-primary" />
          </div>
          <h2 className="text-xl font-bold text-text">Order placed!</h2>
          <p className="text-sm text-text-muted mt-1">Amount deducted from SC Wallet</p>
          {selectedMember && (
            <p className="text-sm text-text mt-3 font-medium">
              For: {selectedMember.name}
            </p>
          )}
          <div className="flex gap-3 justify-center mt-6 flex-wrap">
            <Link
              href="/sc/orders"
              className="border border-border rounded-xl px-6 py-2.5 text-text font-medium hover:bg-bg transition-colors text-sm"
            >
              View My Orders
            </Link>
            <button
              onClick={() => {
                setSubmitted(false);
                setGiftCart([]);
                setSelectedMemberId(null);
              }}
              className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors text-sm"
            >
              Purchase another product
            </button>
          </div>
        </div>
      </div>
    );
  }

  // ── Main layout ───────────────────────────────────────────────────────────

  const subtotal = giftCart.reduce((s, i) => s + i.price * i.qty, 0);

  return (
    <>
      <div className="pt-14 w-full">
        <div className="mb-6">
          <h1 className="text-2xl font-bold text-text">Purchasing Product</h1>
          <p className="text-sm text-text-muted mt-0.5">Buy products on behalf of a member — payment from SC Wallet</p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

          {/* ── Left column ── */}
          <div className="col-span-1 lg:col-span-2 flex flex-col gap-6">

            {/* Step 1 — Select Member */}
            <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#0b1410] font-bold text-sm">1</span>
                </div>
                <span className="font-semibold text-base text-text">Select Member</span>
              </div>

              <div className="flex flex-col gap-1">
                {membersLoading ? (
                  Array.from({ length: 3 }).map((_, i) => (
                    <div key={i} className="flex items-center gap-3 px-4 py-3 rounded-xl animate-pulse">
                      <div className="w-9 h-9 rounded-full bg-border shrink-0" />
                      <div className="flex-1 h-3 bg-border rounded" />
                    </div>
                  ))
                ) : (
                  members.map((member) => {
                    const selected = selectedMemberId === member.id;
                    return (
                      <button
                        key={member.id}
                        onClick={() => setSelectedMemberId(selected ? null : member.id)}
                        className={cn(
                          'flex items-center gap-3 px-4 py-3 rounded-xl cursor-pointer border text-left transition-colors',
                          selected ? 'border-primary bg-primary-soft' : 'border-transparent hover:bg-bg'
                        )}
                      >
                        <div className="w-9 h-9 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                          <span className="text-sm font-bold text-primary">{member.initials}</span>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="font-medium text-sm text-text">{member.name}</p>
                          <p className="text-xs text-text-muted">{member.memberId}</p>
                        </div>
                        {selected && <Check size={16} className="text-primary shrink-0" />}
                      </button>
                    );
                  })
                )}
              </div>
            </div>

            {/* Step 2 — Choose Products */}
            <div className="bg-surface border border-border rounded-2xl shadow-sm p-6">
              <div className="flex items-center gap-2 mb-4">
                <div className="w-7 h-7 bg-primary rounded-full flex items-center justify-center shrink-0">
                  <span className="text-[#0b1410] font-bold text-sm">2</span>
                </div>
                <span className="font-semibold text-base text-text">Choose Products</span>
              </div>

              <input
                type="text"
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search products..."
                className="w-full border border-border rounded-xl px-4 py-2.5 text-sm bg-bg text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 mb-4"
              />

              {/* Product grid — same card design as member shop */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {filteredProducts.map((product) => {
                  const cartItem = getCartItem(product.id);
                  const theme    = PRODUCT_THEME_CLASSES[product.theme];
                  const Icon     = PRODUCT_ICON_MAP[product.iconKey];
                  return (
                    <div
                      key={product.id}
                      className="bg-bg rounded-xl border border-border overflow-hidden hover:border-primary/40 transition-colors"
                    >
                      {/* Product image */}
                      <div className="aspect-video w-full overflow-hidden">
                        {product.image ? (
                          <img
                            src={product.image}
                            alt={product.name}
                            className="w-full h-full object-cover"
                          />
                        ) : (
                          <div className={cn('w-full h-full flex items-center justify-center', theme.iconBg)}>
                            <Icon className={cn('h-10 w-10', theme.iconColor)} strokeWidth={1.5} />
                          </div>
                        )}
                      </div>

                      <div className="p-4">
                        <p className="font-medium text-sm text-text line-clamp-2">{product.name}</p>
                        <p className="text-xs text-text-muted font-mono mt-0.5">{product.sku}</p>
                        <p className="text-primary font-bold text-sm mt-1">{formatINR(product.price)}</p>

                        {product.pv !== null && product.pv > 0 && (
                          <span className={cn('inline-block text-xs font-semibold rounded-full px-2 py-0.5 mt-1', theme.badgeBg, theme.badgeText)}>
                            {product.pv} PV
                          </span>
                        )}

                        <div className="mt-3">
                          {!cartItem ? (
                            <button
                              onClick={() => addToCart(product.id)}
                              className="w-full bg-primary text-[#0b1410] font-semibold text-xs py-2 rounded-lg hover:bg-primary/90 transition-colors"
                            >
                              Add to order
                            </button>
                          ) : (
                            <div className="flex items-center gap-3 justify-center">
                              <button
                                onClick={() => changeQty(product.id, -1)}
                                className="border border-border rounded-lg w-8 h-8 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary-soft transition-colors leading-none"
                              >
                                −
                              </button>
                              <span className="font-semibold text-sm text-text w-6 text-center">{cartItem.qty}</span>
                              <button
                                onClick={() => changeQty(product.id, +1)}
                                className="border border-border rounded-lg w-8 h-8 flex items-center justify-center text-primary font-bold text-lg hover:bg-primary-soft transition-colors leading-none"
                              >
                                +
                              </button>
                            </div>
                          )}
                        </div>
                      </div>
                    </div>
                  );
                })}

                {filteredProducts.length === 0 && (
                  <div className="col-span-2 py-12 text-center text-text-muted text-sm">
                    No products match your search.
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* ── Right column: Order Summary ── */}
          <div className="col-span-1">
            <OrderSummary
              selectedMemberId={selectedMemberId}
              giftCart={giftCart}
              memberName={selectedMember?.name ?? ''}
              memberInitials={selectedMember?.initials ?? ''}
              memberId={selectedMember?.memberId ?? ''}
              onPlaceOrder={() => setPinOpen(true)}
            />
          </div>
        </div>
      </div>

      {/* PIN modal — shown on Place Order click */}
      {pinOpen && (
        <PinModal
          total={subtotal}
          memberName={selectedMember?.name ?? ''}
          onConfirm={handlePinConfirmed}
          onClose={() => setPinOpen(false)}
        />
      )}
    </>
  );
}
