'use client';

import { useState, useMemo } from 'react';
import { useRouter } from 'next/navigation';
import { ShoppingCart, Search, ChevronDown } from 'lucide-react';
import { cn } from '@/lib/utils';
import { useProducts } from '@/hooks/useProducts';
import { useCart } from '@/context/CartContext';
import { PRODUCT_THEME_CLASSES } from '@/lib/productIcons';

type PriceFilter = 'any' | 'low' | 'mid' | 'high';
type PVFilter    = 'any' | 'low' | 'mid' | 'high';
type SortFilter  = 'featured' | 'price-asc' | 'price-desc' | 'pv-desc';
type CategoryFilter = 'All' | 'Registration Packages' | 'Upgrade Packages' | 'Repurchase Products' | 'Store Procurement';

const CATEGORIES: CategoryFilter[] = [
  'All', 'Registration Packages', 'Upgrade Packages', 'Repurchase Products', 'Store Procurement',
];

function formatRupiah(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function FilterDropdown({ value, options, onChange }: {
  value:    string;
  options:  { value: string; label: string }[];
  onChange: (value: string) => void;
}) {
  const isActive = value !== options[0]?.value;
  return (
    <div className="relative shrink-0">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className={cn(
          'appearance-none bg-surface border text-sm rounded-full pl-3.5 pr-8 py-1.5 cursor-pointer focus:outline-none focus:ring-2 focus:ring-primary/40 transition-colors',
          isActive
            ? 'border-primary text-primary font-medium'
            : 'border-border text-text'
        )}
      >
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>{opt.label}</option>
        ))}
      </select>
      <ChevronDown className={cn('absolute right-2.5 top-1/2 -translate-y-1/2 pointer-events-none h-3 w-3', isActive ? 'text-primary' : 'text-text-muted')} />
    </div>
  );
}

export default function ShopPage() {
  const router = useRouter();

  // Data layer
  const { data: products, isLoading } = useProducts();
  const { items, addItem, decreaseItem, getQty, totalQty } = useCart();

  // UI filter state
  const [activeCategory, setActiveCategory] = useState<CategoryFilter>('All');
  const [search,         setSearch]         = useState('');
  const [priceFilter,    setPriceFilter]    = useState<PriceFilter>('any');
  const [pvFilter,       setPVFilter]       = useState<PVFilter>('any');
  const [sortFilter,     setSortFilter]     = useState<SortFilter>('featured');

  const cartTotal = items.reduce((s, item) => {
    const p = products.find((x) => x.id === item.productId);
    return s + (p ? p.price * item.qty : 0);
  }, 0);

  const cartTotalPV = items.reduce((s, item) => {
    const p = products.find((x) => x.id === item.productId);
    return s + (p?.pv ? p.pv * item.qty : 0);
  }, 0);

  const filtered = useMemo(() => {
    let list = products.filter((p) => {
      const matchCat    = activeCategory === 'All' || p.category === activeCategory;
      const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
                          p.sku.toLowerCase().includes(search.toLowerCase());
      const matchPrice  =
        priceFilter === 'any'  ? true :
        priceFilter === 'low'  ? p.price < 300000 :
        priceFilter === 'mid'  ? p.price >= 300000 && p.price < 1000000 :
        p.price >= 1000000;
      const matchPV =
        pvFilter === 'any'  ? true :
        pvFilter === 'low'  ? (p.pv ?? 0) < 300 :
        pvFilter === 'mid'  ? (p.pv ?? 0) >= 300 && (p.pv ?? 0) < 1000 :
        (p.pv ?? 0) >= 1000;
      return matchCat && matchSearch && matchPrice && matchPV;
    });
    if (sortFilter === 'price-asc')  list = [...list].sort((a, b) => a.price - b.price);
    if (sortFilter === 'price-desc') list = [...list].sort((a, b) => b.price - a.price);
    if (sortFilter === 'pv-desc')    list = [...list].sort((a, b) => (b.pv ?? 0) - (a.pv ?? 0));
    return list;
  }, [products, activeCategory, search, priceFilter, pvFilter, sortFilter]);

  return (
    <div className="pt-14 pb-28">

      {/* Page header */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Shop</h1>
          <p className="text-sm text-text-muted mt-0.5">Products, packages and repurchase items</p>
        </div>
        <button
          onClick={() => router.push('/cart')}
          className="relative w-9 h-9 rounded-full flex items-center justify-center bg-surface border border-border hover:bg-primary-soft transition-colors"
          aria-label="Cart"
        >
          <ShoppingCart className="h-4 w-4 text-text" />
          {totalQty > 0 && (
            <span className="absolute -top-1 -right-1 w-4 h-4 rounded-full bg-gold text-[10px] font-bold text-[#0b1410] flex items-center justify-center leading-none">
              {totalQty}
            </span>
          )}
        </button>
      </div>

      {/* Search */}
      <div className="relative mb-4">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted h-4 w-4" />
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search products"
          className="w-full pl-9 pr-4 h-11 rounded-lg border border-border bg-surface text-text placeholder:text-text-muted text-sm focus:outline-none focus:ring-2 focus:ring-primary/30 focus:border-primary transition-shadow"
        />
      </div>

      {/* Filter dropdowns — horizontal scroll, bleeds to screen edges on mobile */}
      <div className="flex items-center gap-2 mb-3 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        <FilterDropdown
          value={priceFilter}
          options={[
            { value: 'any',  label: 'Price: Any' },
            { value: 'low',  label: 'UnderRP300' },
            { value: 'mid',  label: '₹300 –RP1000' },
            { value: 'high', label: 'AboveRP1000' },
          ]}
          onChange={(v) => setPriceFilter(v as PriceFilter)}
        />
        <FilterDropdown
          value={pvFilter}
          options={[
            { value: 'any',  label: 'PV: Any' },
            { value: 'low',  label: 'Under 300 PV' },
            { value: 'mid',  label: '300 – 999 PV' },
            { value: 'high', label: '1000+ PV' },
          ]}
          onChange={(v) => setPVFilter(v as PVFilter)}
        />
        <FilterDropdown
          value={sortFilter}
          options={[
            { value: 'featured',   label: 'Sort: Featured' },
            { value: 'price-asc',  label: 'Price ↑' },
            { value: 'price-desc', label: 'Price ↓' },
            { value: 'pv-desc',    label: 'PV: High first' },
          ]}
          onChange={(v) => setSortFilter(v as SortFilter)}
        />
        {(priceFilter !== 'any' || pvFilter !== 'any' || sortFilter !== 'featured') && (
          <button
            onClick={() => { setPriceFilter('any'); setPVFilter('any'); setSortFilter('featured'); }}
            className="shrink-0 text-xs text-danger hover:text-danger/80 transition-colors font-medium"
          >
            Clear
          </button>
        )}
      </div>

      {/* Category pills — horizontal scroll, bleeds to screen edges on mobile */}
      <div className="flex gap-2 mb-6 -mx-4 px-4 md:mx-0 md:px-0 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {CATEGORIES.map((cat) => (
          <button
            key={cat}
            onClick={() => setActiveCategory(cat)}
            className={cn(
              'shrink-0 px-3.5 py-1.5 rounded-full text-sm font-medium transition-colors border',
              activeCategory === cat
                ? 'bg-primary text-[#0b1410] border-primary'
                : 'bg-surface text-text-muted border-border hover:border-primary/50 hover:text-text'
            )}
          >
            {cat}
          </button>
        ))}
      </div>

      {/* Product grid */}
      {isLoading ? (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {Array.from({ length: 10 }).map((_, i) => (
            <div key={i} className="bg-surface border border-border rounded-xl overflow-hidden animate-pulse">
              <div className="aspect-square bg-primary-soft/50" />
              <div className="p-3 flex flex-col gap-2">
                <div className="h-4 bg-border rounded w-3/4" />
                <div className="h-4 bg-border rounded w-1/2" />
              </div>
            </div>
          ))}
        </div>
      ) : filtered.length === 0 ? (
        <div className="text-center py-16 text-text-muted">No products found.</div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-4">
          {filtered.map((product) => {
            const qty   = getQty(product.id);
            const theme = PRODUCT_THEME_CLASSES[product.theme];
            return (
              <div
                key={product.id}
                onClick={() => router.push(`/shop/${product.slug}`)}
                className="cursor-pointer bg-surface border border-border rounded-xl overflow-hidden flex flex-col hover:border-primary/40 transition-colors"
              >
                {/* Product image */}
                <div className="aspect-square overflow-hidden bg-primary/5">
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="w-full h-full object-cover hover:scale-105 transition-transform duration-300"
                    />
                  ) : (
                    <div className={cn('w-full h-full flex items-center justify-center', theme.iconBg)}>
                      <span className="text-3xl font-bold text-primary/30">
                        {product.name.slice(0, 2).toUpperCase()}
                      </span>
                    </div>
                  )}
                </div>

                {/* Card body */}
                <div className="p-3 flex flex-col gap-1.5 flex-1">
                  <div className="flex items-start justify-between gap-1">
                    <p className="text-sm font-semibold text-text leading-snug line-clamp-2 flex-1">{product.name}</p>
                    <span className="text-[10px] bg-border/60 text-text-muted rounded px-1.5 py-0.5 font-mono shrink-0 mt-0.5">{product.sku}</span>
                  </div>

                  <p className="text-base font-bold text-text">{formatRupiah(product.price)}</p>

                  {product.pv !== null ? (
                    <span className={cn('self-start text-xs font-semibold px-2 py-0.5 rounded-full', theme.badgeBg, theme.badgeText)}>
                      {product.pv} PV
                    </span>
                  ) : product.coupon ? (
                    <span className="self-start text-xs font-semibold px-2 py-0.5 rounded-full bg-gold/20 text-gold">
                      Coupon {product.coupon}
                    </span>
                  ) : null}

                  <p className="text-xs text-text-muted">{product.stock} in stock</p>

                  {/* CTA */}
                  <div className="mt-auto pt-2">
                    {qty > 0 ? (
                      <div className="flex items-center justify-between border border-border rounded-lg overflow-hidden">
                        <button
                          onClick={(e) => { e.stopPropagation(); decreaseItem(product.id); }}
                          className="px-3 py-1.5 text-primary font-bold text-lg hover:bg-primary-soft transition-colors leading-none"
                        >−</button>
                        <span className="text-sm font-semibold text-text">{qty}</span>
                        <button
                          onClick={(e) => { e.stopPropagation(); addItem(product.id); }}
                          className="px-3 py-1.5 text-primary font-bold text-lg hover:bg-primary-soft transition-colors leading-none"
                        >+</button>
                      </div>
                    ) : (
                      <button
                        onClick={(e) => { e.stopPropagation(); addItem(product.id); }}
                        className="w-full py-1.5 rounded-lg bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
                      >
                        Add to cart
                      </button>
                    )}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Sticky checkout bar */}
      {totalQty > 0 && (
        <div className="fixed bottom-0 left-0 right-0 z-30 bg-surface border-t border-border px-4 sm:px-6 py-3 md:left-44">
          <div className="flex items-center justify-between gap-3">
            <div className="flex items-center gap-3 sm:gap-6 text-sm min-w-0">
              <span className="text-text-muted shrink-0">
                <span className="font-semibold text-text">{totalQty}</span> item{totalQty !== 1 ? 's' : ''}
              </span>
              <span className="text-text-muted truncate">
                <span className="font-semibold text-text">{formatRupiah(cartTotal)}</span>
              </span>
              {cartTotalPV > 0 && (
                <span className="hidden sm:inline text-text-muted shrink-0">
                  PV <span className="font-semibold text-gold">{cartTotalPV} PV</span>
                </span>
              )}
            </div>
            <button
              onClick={() => router.push('/cart')}
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
