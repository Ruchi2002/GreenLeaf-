'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useParams, useRouter } from 'next/navigation';
import { Package, UploadCloud, Trash2, Archive } from 'lucide-react';
import {
  adminProducts, CARD_GRADIENT,
  type ProductCategory,
} from '@/data/mock/adminProducts';
import { cn } from '@/lib/utils';

const CATEGORIES: ProductCategory[] = ['Registration', 'Upgrade', 'Repurchase', 'Store'];

const CAT_DOT: Record<ProductCategory, string> = {
  Registration: 'bg-green-500',
  Upgrade:      'bg-amber-500',
  Repurchase:   'bg-puRPle-500',
  Store:        'bg-teal-500',
};

const PREVIEW_CATEGORY_TEXT: Record<ProductCategory, string> = {
  Registration: 'text-green-700',
  Upgrade:      'text-amber-700',
  Repurchase:   'text-puRPle-700',
  Store:        'text-teal-600',
};

const inputCls = 'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';
const cardCls  = 'bg-white rounded-2xl shadow-sm p-5';

// eslint-disable-next-line @typescript-eslint/no-explicit-any
type AnyProduct = any;

export default function EditProductPage() {
  const { id } = useParams<{ id: string }>();
  const router  = useRouter();

  const [product] = useState<AnyProduct>(() => {
    if (typeof window === 'undefined') {
      return adminProducts.find((p) => p.id === id) ?? null;
    }
    try {
      const saved = JSON.parse(localStorage.getItem('greenleaf_products') || '[]');
      const found = saved.find((p: AnyProduct) => String(p.id) === String(id));
      if (found) return found;
    } catch {}
    return adminProducts.find((p) => String(p.id) === String(id)) ?? null;
  });

  const [form, setForm] = useState({
    name:     product?.name             ?? '',
    sku:      product?.sku              ?? '',
    category: (product?.category        ?? 'Repurchase') as ProductCategory,
    price:    String(product?.priceNum  ?? ''),
    pv:       String(product?.pv        ?? ''),
    stockQty: String(product?.stockQty  ?? ''),
    active:   true,
  });

  const [imagePreview,     setImagePreview]     = useState<string | null>(product?.image ?? null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const [showConfirm,      setShowConfirm]      = useState(false);
  const [deleted,          setDeleted]          = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSave() {
    if (!form.name.trim() || !form.price.trim() || !form.sku.trim()) return;

    const priceN  = parseInt(form.price) || 0;
    const qty     = parseInt(form.stockQty) || 0;
    const stock   = qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock';

    const updatedProduct = {
      ...product,
      name:     form.name.trim(),
      category: form.category,
      sku:      form.sku.trim(),
      price:    '₹' + priceN.toLocaleString('en-IN'),
      priceNum: priceN,
      pv:       parseInt(form.pv) || 0,
      stock,
      stockQty: qty,
      image:    imagePreview,
    };

    try {
      const saved = JSON.parse(localStorage.getItem('greenleaf_products') || '[]');
      const idx   = saved.findIndex((p: AnyProduct) => String(p.id) === String(id));
      if (idx !== -1) {
        saved[idx] = updatedProduct;
        localStorage.setItem('greenleaf_products', JSON.stringify(saved));
      } else {
        const updates = JSON.parse(localStorage.getItem('greenleaf_product_updates') || '{}');
        updates[String(id)] = updatedProduct;
        localStorage.setItem('greenleaf_product_updates', JSON.stringify(updates));
      }
    } catch {}

    setShowSuccessToast(true);
    setTimeout(() => router.push('/products'), 1500);
  }

  const pvNum    = parseInt(form.pv)    || 0;
  const priceNum = parseInt(form.price) || 0;
  const priceDisplay = priceNum >= 1_000_000
    ? `₹${(priceNum / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    : priceNum >= 1_000
    ? `₹${Math.round(priceNum / 1_000)}K`
    : `₹${priceNum}`;

  if (!product) {
    return (
      <div className="p-16 text-center text-gray-400 text-sm bg-white rounded-2xl">
        Product not found.{' '}
        <Link href="/products" className="text-green-600 hover:underline">Go back</Link>
      </div>
    );
  }

  return (
    <div className="pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm mb-5">
        <Link href="/products" className="text-green-600 hover:text-green-700 font-medium transition-colors">
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500 font-medium">Edit {product.name}</span>
      </div>

      {/* Two-column layout */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_360px] gap-5 items-start">

        {/* ── LEFT COLUMN ── */}
        <div className="space-y-4">

          {/* Card 1 — Basic Info */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Basic Info</h2>
            <div className="space-y-4">
              <div>
                <label className={labelCls}>Product Name</label>
                <input type="text" value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  className={inputCls} />
              </div>
              <div className="grid grid-cols-2 gap-4">
                {/* Category with dot */}
                <div>
                  <label className={labelCls}>Category</label>
                  <div className="relative">
                    <span className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none z-10', CAT_DOT[form.category])} />
                    <select
                      value={form.category}
                      onChange={(e) => set('category', e.target.value as ProductCategory)}
                      className={cn(inputCls, 'pl-8 cursor-pointer appearance-none')}
                    >
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                {/* SKU */}
                <div>
                  <label className={labelCls}>SKU</label>
                  <input type="text" value={form.sku} readOnly
                    className={cn(inputCls, 'bg-gray-50 text-gray-400 cursor-default')} />
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Pricing & PV */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Pricing &amp; PV</h2>
            <div className="grid grid-cols-2 gap-4">
              {/* Price */}
              <div>
                <label className={labelCls}>Price</label>
                <div className="flex h-10 rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500/40 transition-shadow">
                  <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-500 shrink-0">₹</span>
                  <input type="number" value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    className="flex-1 px-3 text-sm text-gray-800 bg-white focus:outline-none" />
                </div>
              </div>
              {/* PV */}
              <div>
                <label className={labelCls}>PV Value</label>
                <div className="flex h-10 rounded-xl border border-gray-200 overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500/40 transition-shadow">
                  <input type="number" value={form.pv}
                    onChange={(e) => set('pv', e.target.value)}
                    className="flex-1 px-3.5 text-sm text-gray-800 bg-white focus:outline-none" />
                  <span className="flex items-center px-3 bg-green-600 border-l border-green-700 text-xs font-bold text-white shrink-0 whitespace-nowrap">
                    {pvNum} PV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Card 3 — Inventory */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stock Quantity</label>
                <input type="number" value={form.stockQty}
                  onChange={(e) => set('stockQty', e.target.value)}
                  className={inputCls} />
              </div>
              <div>
                <label className={labelCls}>Status</label>
                <button
                  onClick={() => set('active', !form.active)}
                  className={cn(
                    'h-10 px-4 rounded-xl text-sm font-semibold transition-colors w-full text-left flex items-center gap-2',
                    form.active
                      ? 'bg-green-50 border border-green-300 text-green-700'
                      : 'bg-gray-50 border border-gray-200 text-gray-500'
                  )}
                >
                  <span className={cn('w-2 h-2 rounded-full shrink-0', form.active ? 'bg-green-500' : 'bg-gray-400')} />
                  {form.active ? 'Active' : 'Inactive'}
                </button>
              </div>
            </div>
          </div>

          {/* Card 4 — Image */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Image</h2>
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleImageUpload}
            />
            <div className="flex items-stretch gap-4">
              {/* Current image thumbnail */}
              <div className={cn('w-20 h-20 rounded-xl overflow-hidden shrink-0 bg-gradient-to-br flex items-center justify-center', CARD_GRADIENT[form.category])}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Product" className="w-full h-full object-cover" />
                ) : (
                  <Package size={28} className="text-white/80" />
                )}
              </div>
              {/* Upload area */}
              <div
                onClick={() => fileInputRef.current?.click()}
                className="flex-1 border-2 border-dashed border-green-300 rounded-xl flex flex-col items-center justify-center gap-2 py-3 cursor-pointer hover:bg-green-50/40 transition-colors group"
              >
                <UploadCloud size={20} className="text-green-500 group-hover:text-green-600" />
                <p className="text-xs text-gray-400 group-hover:text-green-700 transition-colors text-center leading-snug">
                  Drag &amp; drop or click to upload
                </p>
                <span className="text-xs font-semibold px-3 py-1 rounded-full border border-green-500 text-green-600 hover:bg-green-50">
                  Change Image
                </span>
              </div>
            </div>
            {imagePreview && (
              <button
                onClick={() => setImagePreview(null)}
                className="mt-3 text-xs text-red-500 hover:text-red-600 transition-colors"
              >
                Remove image
              </button>
            )}
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">

          {/* Card Preview */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Card Preview</h2>
            <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
              {/* Gradient / image area */}
              <div className={cn('relative h-28 bg-gradient-to-br flex items-center justify-center', CARD_GRADIENT[form.category])}>
                {imagePreview ? (
                  <img src={imagePreview} alt="Preview" className="h-full w-full object-cover" />
                ) : (
                  <Package size={32} className="text-white/70" />
                )}
                <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                  {form.active ? 'Active' : 'Inactive'}
                </span>
              </div>
              <div className="p-3">
                <span className={cn('text-[10px] font-bold uppercase tracking-widest', PREVIEW_CATEGORY_TEXT[form.category])}>
                  {form.category}
                </span>
                <p className="text-sm font-bold text-gray-900 leading-snug mt-0.5 mb-2">
                  {form.name || 'Product Name'}
                </p>
                <div className="flex items-center justify-between">
                  <span className="text-sm font-bold text-gray-900">{priceDisplay || '₹0'}</span>
                  <span className="text-xs font-semibold px-2 py-0.5 rounded-full bg-green-600 text-white">
                    {pvNum} PV
                  </span>
                </div>
              </div>
            </div>
          </div>

          {/* Danger Zone */}
          <div className="bg-white rounded-2xl border-2 border-red-200 p-5">
            <h2 className="text-base font-bold text-red-700 mb-1">Danger Zone</h2>
            <p className="text-xs text-gray-400 mb-4 leading-relaxed">
              Archiving hides this product from the catalog. Deleting is permanent and cannot be undone.
            </p>

            {deleted ? (
              <p className="text-sm text-red-600 font-medium flex items-center gap-2">
                <Trash2 size={14} /> Product marked for deletion.
              </p>
            ) : showConfirm ? (
              <div className="space-y-2">
                <p className="text-sm font-semibold text-gray-700">Are you sure?</p>
                <div className="flex gap-2">
                  <button
                    onClick={() => { setDeleted(true); setShowConfirm(false); }}
                    className="flex-1 py-2 rounded-xl bg-red-600 text-white text-xs font-semibold hover:bg-red-500 transition-colors"
                  >
                    Yes, Delete
                  </button>
                  <button
                    onClick={() => setShowConfirm(false)}
                    className="flex-1 py-2 rounded-xl border border-gray-200 text-gray-600 text-xs font-semibold hover:bg-gray-50 transition-colors"
                  >
                    Cancel
                  </button>
                </div>
              </div>
            ) : (
              <div className="space-y-2">
                <button className="w-full py-2.5 rounded-xl bg-amber-500 text-white text-sm font-semibold hover:bg-amber-400 transition-colors flex items-center justify-center gap-2">
                  <Archive size={15} />
                  Archive Product
                </button>
                <button
                  onClick={() => setShowConfirm(true)}
                  className="w-full py-2.5 rounded-xl bg-red-600 text-white text-sm font-semibold hover:bg-red-500 transition-colors flex items-center justify-center gap-2"
                >
                  <Trash2 size={15} />
                  Delete Product
                </button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-30 bg-white border-t border-gray-200 px-6 py-3 flex items-center justify-end gap-3">
        <button
          onClick={() => router.push('/products')}
          className="px-5 py-2 rounded-xl text-sm font-semibold text-gray-600 hover:bg-gray-100 transition-colors"
        >
          Cancel
        </button>
        <button
          onClick={handleSave}
          className="px-6 py-2 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          Save Changes
        </button>
      </div>

      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <span>✓</span>
          <span>Product updated successfully!</span>
        </div>
      )}
    </div>
  );
}
