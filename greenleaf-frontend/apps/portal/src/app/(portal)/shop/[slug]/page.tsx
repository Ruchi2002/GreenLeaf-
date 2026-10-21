'use client';

import { useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import Link from 'next/link';
import { ArrowLeft, ShoppingCart, Star, Check, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProduct } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { PRODUCT_ICON_MAP, PRODUCT_THEME_CLASSES } from '@/lib/productIcons';

function formatRupiah(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function StarRating({ rating, count }: { rating: number; count: number }) {
  return (
    <div className="flex items-center gap-1.5">
      <div className="flex items-center gap-0.5">
        {[1, 2, 3, 4, 5].map((n) => (
          <Star key={n} className={cn('h-4 w-4', n <= Math.round(rating) ? 'text-gold fill-gold' : 'text-border fill-border')} />
        ))}
      </div>
      <span className="text-sm font-semibold text-text">{rating.toFixed(1)}</span>
      <span className="text-sm text-text-muted">({count} reviews)</span>
    </div>
  );
}

type Tab = 'description' | 'contents' | 'how-to-use';

export default function ProductDetailPage() {
  const params  = useParams();
  const router  = useRouter();
  const slug    = params?.slug as string;

  const { data: product, isLoading, isError } = useProduct(slug);
  const { getQty, addItem, decreaseItem, items } = useCart();

  const [activeTab,   setActiveTab]   = useState<Tab>('description');
  const [activeThumb, setActiveThumb] = useState(0);

  if (isLoading) {
    return (
      <div className="pt-14 flex items-center justify-center py-24">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    );
  }

  if (isError || !product) {
    return (
      <div className="pt-14 flex flex-col items-center justify-center py-24 gap-4">
        <p className="text-text-muted text-lg">Product not found.</p>
        <Link href="/shop" className="text-primary underline text-sm">Back to Shop</Link>
      </div>
    );
  }

  const Icon  = PRODUCT_ICON_MAP[product.iconKey];
  const theme = PRODUCT_THEME_CLASSES[product.theme];
  const qty   = getQty(product.id);

  const thumbStyles = [
    { bg: theme.iconBg,    color: theme.iconColor },
    { bg: 'bg-border/40',  color: theme.iconColor },
    { bg: 'bg-primary/5',  color: theme.iconColor },
    { bg: 'bg-gold/10',    color: 'text-gold'      },
  ];
  const active = thumbStyles[activeThumb]!;

  const cartSubtotal = items.reduce((s, i) => {
    // used for sticky bar total
    return s + (i.productId === product.id ? product.price * i.qty : 0);
  }, 0);

  const TABS: { id: Tab; label: string }[] = [
    { id: 'description', label: 'Description' },
    { id: 'contents',    label: 'Contents'    },
    { id: 'how-to-use',  label: 'How to Use'  },
  ];

  return (
    <div className="pt-14 pb-28">

      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 mb-6 text-sm text-text-muted">
        <button onClick={() => router.back()} className="flex items-center gap-1 hover:text-text transition-colors">
          <ArrowLeft className="h-4 w-4" /><span>Back</span>
        </button>
        <ChevronRight className="h-3.5 w-3.5" />
        <Link href="/shop" className="hover:text-text transition-colors">Shop</Link>
        <ChevronRight className="h-3.5 w-3.5" />
        <span className="text-text line-clamp-1">{product.name}</span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 lg:gap-12">

        {/* Image gallery */}
        <div className="flex flex-col gap-3">
          <div className={cn('aspect-square rounded-2xl flex items-center justify-center border border-border overflow-hidden', active.bg)}>
            <div className={cn('w-32 h-32 rounded-3xl flex items-center justify-center shadow-md', theme.iconBg)}>
              <Icon className={cn('h-16 w-16', active.color)} strokeWidth={1.2} />
            </div>
          </div>
          <div className="flex gap-2">
            {thumbStyles.map((t, i) => (
              <button
                key={i}
                onClick={() => setActiveThumb(i)}
                className={cn(
                  'flex-1 aspect-square rounded-xl border-2 flex items-center justify-center overflow-hidden transition-colors',
                  i === activeThumb ? 'border-primary' : 'border-border hover:border-primary/40',
                  t.bg,
                )}
              >
                <Icon className={cn('h-6 w-6', t.color)} strokeWidth={1.5} />
              </button>
            ))}
          </div>
        </div>

        {/* Product info */}
        <div className="flex flex-col gap-4">
          <span className="text-xs font-medium text-text-muted uppercase tracking-wider">{product.category}</span>
          <h1 className="text-2xl font-bold text-text leading-snug">{product.name}</h1>
          <p className="text-xs font-mono text-text-muted">SKU: {product.sku}</p>
          <StarRating rating={product.rating} count={product.reviewCount} />

          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-2xl font-bold text-text">{formatRupiah(product.price)}</span>
            {product.pv !== null ? (
              <span className={cn('text-sm font-semibold px-3 py-1 rounded-full', theme.badgeBg, theme.badgeText)}>
                {product.pv} PV
              </span>
            ) : product.coupon ? (
              <span className="text-sm font-semibold px-3 py-1 rounded-full bg-gold/20 text-gold">
                Coupon {product.coupon}
              </span>
            ) : null}
          </div>

          <p className={cn('text-sm font-medium', product.stock <= 10 ? 'text-warning' : 'text-success')}>
            {product.stock <= 10 ? `Only ${product.stock} left in stock` : `${product.stock} in stock`}
          </p>

          <div className="border-t border-border" />

          {/* Tabs */}
          <div className="flex gap-0 border-b border-border">
            {TABS.map((tab) => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={cn(
                  'px-4 py-2.5 text-sm font-medium transition-colors border-b-2 -mb-px',
                  activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-text-muted hover:text-text'
                )}
              >
                {tab.label}
              </button>
            ))}
          </div>

          <div className="text-sm text-text leading-relaxed min-h-[100px]">
            {activeTab === 'description' && <p>{product.description}</p>}
            {activeTab === 'contents' && (
              <ul className="flex flex-col gap-2">
                {product.contents.map((item, i) => (
                  <li key={i} className="flex items-start gap-2">
                    <Check className="h-4 w-4 text-primary mt-0.5 shrink-0" />
                    <span>{item}</span>
                  </li>
                ))}
              </ul>
            )}
            {activeTab === 'how-to-use' && <p>{product.howToUse}</p>}
          </div>

          <div className="border-t border-border" />

          {/* Qty stepper + CTA */}
          <div className="flex items-center gap-3 flex-wrap">
            <div className="flex items-center border border-border rounded-lg overflow-hidden">
              <button
                onClick={() => decreaseItem(product.id)}
                disabled={qty === 0}
                className="px-4 py-2.5 text-primary font-bold text-xl hover:bg-primary-soft transition-colors leading-none disabled:opacity-30 disabled:cursor-not-allowed"
              >−</button>
              <span className="w-10 text-center text-base font-semibold text-text">{qty}</span>
              <button
                onClick={() => addItem(product.id)}
                className="px-4 py-2.5 text-primary font-bold text-xl hover:bg-primary-soft transition-colors leading-none"
              >+</button>
            </div>

            <button
              onClick={() => addItem(product.id)}
              className="flex-1 min-w-[140px] flex items-center justify-center gap-2 py-2.5 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
            >
              <ShoppingCart className="h-4 w-4" />
              Add to Cart
            </button>
          </div>

          {qty > 0 && (
            <Link href="/cart" className="text-sm text-primary font-medium hover:underline flex items-center gap-1">
              View Cart ({qty} item{qty !== 1 ? 's' : ''})
              <ChevronRight className="h-3.5 w-3.5" />
            </Link>
          )}
        </div>
      </div>

      {/* Sticky bar */}
      {qty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border px-4 sm:px-6 py-3 md:left-44">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-6 text-sm min-w-0">
              <span className="text-text-muted shrink-0">
                Qty <span className="font-semibold text-text">{qty}</span>
              </span>
              <span className="text-text-muted truncate">
                <span className="font-semibold text-text">{formatRupiah(cartSubtotal)}</span>
              </span>
              {product.pv && (
                <span className="hidden sm:inline text-text-muted shrink-0">
                  PV <span className="font-semibold text-gold">{product.pv * qty} PV</span>
                </span>
              )}
            </div>
            <button
              onClick={() => router.push('/checkout')}
              className="px-4 sm:px-5 py-2 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors shrink-0"
            >
              Checkout
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
