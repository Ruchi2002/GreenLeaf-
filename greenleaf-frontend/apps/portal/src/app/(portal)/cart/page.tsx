'use client';

import { useRouter } from 'next/navigation';
import { Trash2, ChevronLeft, ShoppingCart } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useCart } from '@/context/CartContext';
import { useProducts } from '@/hooks/useProducts';
import { PRODUCT_ICON_MAP, PRODUCT_THEME_CLASSES } from '@/lib/productIcons';

function formatRupiah(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

export default function CartPage() {
  const router = useRouter();
  const { items, addItem, decreaseItem, removeItem, totalQty } = useCart();
  const { data: products } = useProducts();

  function getProduct(id: string) {
    return products.find((p) => p.id === id);
  }

  const subtotal = items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p ? p.price * item.qty : 0);
  }, 0);

  const totalPV = items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p?.pv ? p.pv * item.qty : 0);
  }, 0);

  const totalCoupon = items.reduce((sum, item) => {
    const p = getProduct(item.productId);
    return sum + (p?.coupon ? p.coupon * item.qty : 0);
  }, 0);

  const isEmpty = items.length === 0;

  return (
    <div className="pt-14 max-w-4xl mx-auto">

      {/* Header */}
      <div className="flex items-center gap-3 mb-6">
        <button
          onClick={() => router.back()}
          className="flex items-center gap-1 text-sm text-text-muted hover:text-primary transition-colors"
        >
          <ChevronLeft className="h-4 w-4" />
          Back
        </button>
        <div>
          <h1 className="text-2xl font-bold text-text">Cart</h1>
          {!isEmpty && (
            <p className="text-sm text-text-muted mt-0.5">{items.length} item{items.length !== 1 ? 's' : ''}</p>
          )}
        </div>
      </div>

      {isEmpty ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center">
            <ShoppingCart className="h-7 w-7 text-primary/60" />
          </div>
          <p className="text-lg font-semibold text-text">Your cart is empty</p>
          <p className="text-sm text-text-muted">Browse products and add items to get started.</p>
          <button
            onClick={() => router.push('/shop')}
            className="mt-2 px-5 py-2.5 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Go to Shop
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 pb-8">

          {/* Cart items */}
          <div className="lg:col-span-2 flex flex-col gap-3">
            {items.map((item) => {
              const product = getProduct(item.productId);
              if (!product) return null;
              const Icon  = PRODUCT_ICON_MAP[product.iconKey];
              const theme = PRODUCT_THEME_CLASSES[product.theme];
              return (
                <div key={item.productId} className="bg-surface border border-border rounded-xl p-4 flex gap-4">
                  {/* Icon placeholder */}
                  <div
                    onClick={() => router.push(`/shop/${product.slug}`)}
                    className={cn('w-16 h-16 sm:w-20 sm:h-20 shrink-0 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:opacity-80', theme.iconBg)}
                  >
                    <Icon className={cn('h-7 w-7 sm:h-8 sm:w-8', theme.iconColor)} strokeWidth={1.5} />
                  </div>

                  {/* Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <p
                          onClick={() => router.push(`/shop/${product.slug}`)}
                          className="text-sm font-semibold text-text leading-snug cursor-pointer hover:text-primary transition-colors line-clamp-2"
                        >
                          {product.name}
                        </p>
                        <span className="text-[10px] font-mono text-text-muted bg-border/60 px-1.5 py-0.5 rounded mt-0.5 inline-block">
                          {product.sku}
                        </span>
                      </div>
                      <button
                        onClick={() => removeItem(item.productId)}
                        className="text-text-muted hover:text-danger transition-colors shrink-0 mt-0.5"
                        aria-label="Remove item"
                      >
                        <Trash2 className="h-4 w-4" />
                      </button>
                    </div>

                    <div className="flex items-center justify-between mt-3 gap-2 flex-wrap sm:flex-nowrap">
                      {/* Price */}
                      <div>
                        <p className="text-base font-bold text-text">{formatRupiah(product.price * item.qty)}</p>
                        {item.qty > 1 && (
                          <p className="text-xs text-text-muted">{formatRupiah(product.price)} each</p>
                        )}
                      </div>

                      {/* Badge */}
                      {product.pv !== null ? (
                        <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', theme.badgeBg, theme.badgeText)}>
                          {product.pv * item.qty} PV
                        </span>
                      ) : product.coupon ? (
                        <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                          Coupon {product.coupon * item.qty}
                        </span>
                      ) : null}

                      {/* Qty stepper */}
                      <div className="flex items-center border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={() => decreaseItem(item.productId)}
                          className="px-3 py-1.5 text-primary hover:bg-primary-soft transition-colors text-base font-bold leading-none"
                        >−</button>
                        <span className="px-3 py-1.5 text-sm font-semibold text-text min-w-[2rem] text-center">
                          {item.qty}
                        </span>
                        <button
                          onClick={() => addItem(item.productId)}
                          className="px-3 py-1.5 text-primary hover:bg-primary-soft transition-colors text-base font-bold leading-none"
                        >+</button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}

            <button
              onClick={() => router.push('/shop')}
              className="self-start text-sm text-primary hover:underline mt-1"
            >
              ← Continue Shopping
            </button>
          </div>

          {/* Order summary */}
          <div className="lg:col-span-1">
            <div className="bg-surface border border-border rounded-xl p-5 sticky top-6">
              <h2 className="text-base font-bold text-text mb-4">Order Summary</h2>

              <div className="flex flex-col gap-3 text-sm">
                <div className="flex justify-between text-text-muted">
                  <span>Subtotal ({totalQty} item{totalQty !== 1 ? 's' : ''})</span>
                  <span className="font-medium text-text">{formatRupiah(subtotal)}</span>
                </div>
                {totalPV > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>Total PV</span>
                    <span className="font-semibold text-primary">{totalPV} PV</span>
                  </div>
                )}
                {totalCoupon > 0 && (
                  <div className="flex justify-between text-text-muted">
                    <span>Total Coupon</span>
                    <span className="font-semibold text-gold">{totalCoupon}</span>
                  </div>
                )}
                <div className="flex justify-between text-text-muted">
                  <span>Shipping</span>
                  <span className="text-text-muted italic text-xs self-center">calculated at checkout</span>
                </div>
              </div>

              <div className="border-t border-border mt-4 pt-4">
                <div className="flex justify-between font-bold text-text text-base">
                  <span>Total</span>
                  <span>{formatRupiah(subtotal)}</span>
                </div>
              </div>

              <button
                onClick={() => router.push('/checkout')}
                className="w-full mt-5 py-3 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
              >
                Proceed to Checkout
              </button>

              <p className="text-xs text-text-muted text-center mt-3">🔒 Secure checkout</p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
