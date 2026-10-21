'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import Link from 'next/link';
import { Plus, MoreHorizontal, Package } from 'lucide-react';
import {
  adminProducts,
  CATEGORY_COLOR, CARD_GRADIENT, STOCK_CHIP,
  type ProductCategory,
} from '@/data/mock/adminProducts';
import { cn } from '@/lib/utils';

type TabFilter = 'All' | ProductCategory;

type ProductItem = {
  id:       string;
  name:     string;
  sku:      string;
  category: ProductCategory;
  price:    string;
  pv:       number;
  stock:    'In Stock' | 'Low Stock' | 'Out of Stock';
  image?:   string | null;
};

function loadProducts(): ProductItem[] {
  if (typeof window === 'undefined') return adminProducts as ProductItem[];
  try {
    const saved   = JSON.parse(localStorage.getItem('greenleaf_products')        || '[]');
    const updates = JSON.parse(localStorage.getItem('greenleaf_product_updates') || '{}');
    const updatedMock = adminProducts.map((p) =>
      updates[String(p.id)] ? { ...p, ...updates[String(p.id)] } : p
    ) as ProductItem[];
    return [...saved, ...updatedMock];
  } catch {
    return adminProducts as ProductItem[];
  }
}

export default function ProductsPage() {
  const [products,     setProducts]     = useState<ProductItem[]>(loadProducts);
  const [activeTab,    setActiveTab]    = useState<TabFilter>('All');
  const [menuOpen,     setMenuOpen]     = useState<string | null>(null);
  const [searchQuery,      setSearchQuery]      = useState('');
  const [showMobileFilter, setShowMobileFilter] = useState(false);

  const filtered = products.filter((p) => {
    const matchesCategory = activeTab === 'All' || p.category === activeTab;
    const q = searchQuery.toLowerCase();
    const matchesSearch = !q || p.name.toLowerCase().includes(q) || p.sku.toLowerCase().includes(q);
    return matchesCategory && matchesSearch;
  });

  const tabCounts: Record<TabFilter, number> = {
    All:          products.length,
    Registration: products.filter((p) => p.category === 'Registration').length,
    Upgrade:      products.filter((p) => p.category === 'Upgrade').length,
    Repurchase:   products.filter((p) => p.category === 'Repurchase').length,
    Store:        products.filter((p) => p.category === 'Store').length,
  };

  function handleDelete(id: string) {
    setProducts((prev) => prev.filter((p) => p.id !== id));
    setMenuOpen(null);
    try {
      const saved = JSON.parse(localStorage.getItem('greenleaf_products') || '[]');
      const updated = saved.filter((p: { id: string }) => p.id !== id);
      localStorage.setItem('greenleaf_products', JSON.stringify(updated));
    } catch {}
  }

  return (
    <div className="space-y-6" onClick={() => setMenuOpen(null)}>
      {/* Header row */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Products</h1>
          <p className="text-sm text-gray-500 mt-0.5">Manage your catalog across every category.</p>
        </div>
        <Link
          href="/products/add"
          className="w-full sm:w-auto inline-flex items-center justify-center gap-1.5 px-5 py-2.5 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          <Plus size={16} />
          Add Product
        </Link>
      </div>

      {/* Filter row: Search | Category pills | Filters button */}
      <div className="flex flex-col md:flex-row md:items-center gap-3">

        {/* Search — full width on mobile */}
        <div className="relative w-full md:w-72 md:shrink-0">
          <svg className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
          </svg>
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500 bg-white"
          />
        </div>

        {/* Category pills — scrollable on mobile */}
        <div className="flex items-center gap-2 flex-1 md:justify-center overflow-x-auto scrollbar-hide pb-1">
          {(['All', 'Registration', 'Upgrade', 'Repurchase', 'Store'] as const).map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={cn(
                'whitespace-nowrap shrink-0 px-4 py-1.5 rounded-full text-sm font-medium transition-colors',
                activeTab === cat
                  ? 'bg-green-600 text-[#0b1410] font-semibold'
                  : 'bg-white border border-gray-200 text-gray-600 hover:bg-gray-50'
              )}
            >
              {cat} {tabCounts[cat]}
            </button>
          ))}
        </div>

        {/* Filters button — mobile only */}
        <button
          onClick={() => setShowMobileFilter(true)}
          className="md:hidden flex items-center justify-center gap-2 border border-gray-200 bg-white px-4 py-2 rounded-xl text-sm text-gray-600 hover:bg-gray-50 transition-colors"
        >
          <svg className="w-4 h-4" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          Filters
        </button>

      </div>

      {/* Product grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-4">
        {filtered.map((product) => (
          <div key={product.id} className="bg-white rounded-2xl shadow-sm overflow-hidden flex flex-col">
            {/* Image / gradient area */}
            <div className={cn('relative h-32 sm:h-40 bg-gradient-to-br flex items-center justify-center', CARD_GRADIENT[product.category])}>
              {product.image ? (
                <img src={product.image} alt={product.name} className="h-full w-full object-cover" />
              ) : (
                <Package size={40} className="text-white/70" />
              )}
              {/* Stock badge */}
              <span className={cn(
                'absolute top-3 right-3 text-[11px] font-semibold px-2.5 py-0.5 rounded-full',
                STOCK_CHIP[product.stock]
              )}>
                {product.stock}
              </span>
            </div>

            {/* Card body */}
            <div className="p-3 sm:p-4 flex flex-col flex-1">
              {/* Category */}
              <span className={cn('text-[10px] font-bold uppercase tracking-widest mb-1', CATEGORY_COLOR[product.category])}>
                {product.category}
              </span>

              {/* Name */}
              <p className="text-xs sm:text-sm font-bold text-gray-900 leading-snug mb-0.5 truncate">{product.name}</p>

              {/* SKU */}
              <p className="text-[10px] sm:text-[11px] text-gray-400 font-mono mb-3 truncate">{product.sku}</p>

              {/* Price + PV */}
              <div className="flex items-center justify-between mt-auto mb-3 sm:mb-4">
                <span className="text-sm sm:text-base font-bold text-gray-900">{product.price}</span>
                <span className="text-[10px] sm:text-xs font-semibold px-2 sm:px-2.5 py-0.5 rounded-full bg-green-600 text-white">
                  {product.pv} PV
                </span>
              </div>

              {/* Actions row */}
              <div className="flex items-center gap-2">
                <Link
                  href={`/products/${product.id}/edit`}
                  className="flex-1 text-center text-xs font-semibold py-1.5 rounded-lg border border-green-600 text-green-700 hover:bg-green-50 transition-colors"
                >
                  Edit
                </Link>
                <div className="relative" onClick={(e) => e.stopPropagation()}>
                  <button
                    onClick={() => setMenuOpen(menuOpen === product.id ? null : product.id)}
                    className="w-8 h-8 rounded-lg border border-gray-200 flex items-center justify-center text-gray-400 hover:bg-gray-50 transition-colors"
                  >
                    <MoreHorizontal size={15} />
                  </button>
                  {menuOpen === product.id && (
                    <div className="absolute right-0 bottom-full mb-1 bg-white border border-gray-200 rounded-xl shadow-lg py-1 z-10 min-w-[100px]">
                      <button
                        onClick={() => handleDelete(product.id)}
                        className="w-full text-left px-3 py-2 text-xs text-red-600 hover:bg-red-50 transition-colors"
                      >
                        Delete
                      </button>
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
      {/* Mobile filter sheet */}
      {showMobileFilter && (
        <div className="md:hidden fixed inset-0 z-50">
          <div className="absolute inset-0 bg-black/40" onClick={() => setShowMobileFilter(false)} />
          <div className="absolute bottom-0 left-0 right-0 bg-white rounded-t-2xl p-5 pb-10">
            <div className="flex items-center justify-between mb-5">
              <h3 className="text-sm font-semibold text-gray-900">Filter by Category</h3>
              <button onClick={() => setShowMobileFilter(false)} className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-gray-100 text-gray-500 text-lg">✕</button>
            </div>
            <div className="flex flex-wrap gap-2 mb-6">
              {(['All', 'Registration', 'Upgrade', 'Repurchase', 'Store'] as const).map((cat) => (
                <button
                  key={cat}
                  onClick={() => setActiveTab(cat)}
                  className={activeTab === cat
                    ? 'bg-green-600 text-[#0b1410] px-4 py-2 rounded-full text-sm font-semibold'
                    : 'bg-gray-100 text-gray-600 px-4 py-2 rounded-full text-sm hover:bg-gray-200 transition-colors'
                  }
                >
                  {cat} {tabCounts[cat]}
                </button>
              ))}
            </div>
            <button
              onClick={() => setShowMobileFilter(false)}
              className="w-full py-3 bg-green-600 text-[#0b1410] font-semibold rounded-xl text-sm"
            >
              Apply
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
