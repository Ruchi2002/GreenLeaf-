'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Package } from 'lucide-react';
import {
  CARD_GRADIENT, type ProductCategory,
} from '../../../../data/mock/adminProducts';
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

const inputCls = 'w-full h-10 px-3.5 rounded-xl border border-gray-200 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow';
const inputErrCls = 'w-full h-10 px-3.5 rounded-xl border border-red-400 bg-white text-sm text-gray-800 placeholder:text-gray-300 focus:outline-none focus:ring-2 focus:ring-red-400/30 transition-shadow';
const labelCls = 'block text-xs font-semibold text-gray-600 mb-1.5';
const cardCls  = 'bg-white rounded-2xl shadow-sm p-5';

export default function AddProductPage() {
  const router = useRouter();

  const [form, setForm] = useState({
    name:     '',
    sku:      '',
    category: '' as ProductCategory | '',
    price:    '',
    pv:       '',
    stockQty: '',
    active:   true,
  });
  const [errors,        setErrors]        = useState<Record<string, boolean>>({});
  const [imagePreview,  setImagePreview]  = useState<string | null>(null);
  const [showSuccessToast, setShowSuccessToast] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  function set<K extends keyof typeof form>(key: K, value: typeof form[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
    setErrors((e) => ({ ...e, [key]: false }));
  }

  const pvNum    = parseInt(form.pv)    || 0;
  const priceNum = parseInt(form.price) || 0;
  const priceDisplay = priceNum >= 1_000_000
    ? `₹${(priceNum / 1_000_000).toFixed(1).replace(/\.0$/, '')}M`
    : priceNum >= 1_000
    ? `₹${Math.round(priceNum / 1_000)}K`
    : priceNum > 0 ? `₹${priceNum}` : '';

  const hasPreview = !!(form.name || form.category || priceDisplay || pvNum);
  const catKey     = (form.category || 'Registration') as ProductCategory;

  function handleImageUpload(e: React.ChangeEvent<HTMLInputElement>) {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => setImagePreview(ev.target?.result as string);
    reader.readAsDataURL(file);
  }

  function handleSubmit() {
    const newErrors: Record<string, boolean> = {
      name:  !form.name.trim(),
      sku:   !form.sku.trim(),
      price: !form.price.trim(),
      pv:    !form.pv.trim(),
    };
    setErrors(newErrors);
    if (Object.values(newErrors).some(Boolean)) return;

    const qty = parseInt(form.stockQty) || 0;
    const stockStatus = qty === 0 ? 'Out of Stock' : qty <= 10 ? 'Low Stock' : 'In Stock';

    const newProduct = {
      id:          String(Date.now()),
      name:        form.name.trim(),
      sku:         form.sku.trim(),
      category:    (form.category || 'Store') as import('@/data/mock/adminProducts').ProductCategory,
      price:       '₹' + priceNum.toLocaleString('en-IN'),
      priceNum,
      pv:          pvNum,
      stock:       stockStatus as 'In Stock' | 'Low Stock' | 'Out of Stock',
      stockQty:    qty,
      description: '',
      tags:        '',
      image:       imagePreview || null,
    };

    try {
      const existing = JSON.parse(localStorage.getItem('greenleaf_products') || '[]');
      existing.unshift(newProduct);
      localStorage.setItem('greenleaf_products', JSON.stringify(existing));
    } catch {}

    setShowSuccessToast(true);
    setTimeout(() => router.push('/products'), 1500);
  }

  return (
    <div className="pb-24">
      {/* Breadcrumb */}
      <div className="flex items-center gap-1.5 text-sm mb-5">
        <Link href="/products" className="text-green-600 hover:text-green-700 font-medium transition-colors">
          Products
        </Link>
        <span className="text-gray-300">/</span>
        <span className="text-gray-500 font-medium">Add New Product</span>
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
                <input
                  type="text"
                  value={form.name}
                  onChange={(e) => set('name', e.target.value)}
                  placeholder="e.g. Starter Kit Pro"
                  className={errors.name ? inputErrCls : inputCls}
                />
                {errors.name && <p className="text-xs text-red-500 mt-1">Product name is required</p>}
              </div>
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <label className={labelCls}>Category</label>
                  <div className="relative">
                    {form.category && (
                      <span className={cn('absolute left-3.5 top-1/2 -translate-y-1/2 w-2 h-2 rounded-full pointer-events-none z-10', CAT_DOT[form.category as ProductCategory])} />
                    )}
                    <select
                      value={form.category}
                      onChange={(e) => set('category', e.target.value as ProductCategory)}
                      className={cn(inputCls, form.category ? 'pl-8' : '', 'cursor-pointer appearance-none')}
                    >
                      <option value="" disabled>Select category</option>
                      {CATEGORIES.map((c) => <option key={c} value={c}>{c}</option>)}
                    </select>
                  </div>
                </div>
                <div>
                  <label className={labelCls}>SKU</label>
                  <input
                    type="text"
                    value={form.sku}
                    onChange={(e) => set('sku', e.target.value)}
                    placeholder="Auto-generated if empty"
                    className={errors.sku ? inputErrCls : inputCls}
                  />
                  {errors.sku && <p className="text-xs text-red-500 mt-1">SKU is required</p>}
                </div>
              </div>
            </div>
          </div>

          {/* Card 2 — Pricing & PV */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Pricing &amp; PV</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Price</label>
                <div className={cn(
                  'flex h-10 rounded-xl border overflow-hidden transition-shadow',
                  errors.price
                    ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400/30'
                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500/40',
                )}>
                  <span className="flex items-center px-3 bg-gray-50 border-r border-gray-200 text-sm font-semibold text-gray-500 shrink-0">₹</span>
                  <input
                    type="number"
                    value={form.price}
                    onChange={(e) => set('price', e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3 text-sm text-gray-800 bg-white focus:outline-none placeholder:text-gray-300"
                  />
                </div>
                {errors.price && <p className="text-xs text-red-500 mt-1">Price is required</p>}
              </div>
              <div>
                <label className={labelCls}>PV Value</label>
                <div className={cn(
                  'flex h-10 rounded-xl border overflow-hidden transition-shadow',
                  errors.pv
                    ? 'border-red-400 focus-within:ring-2 focus-within:ring-red-400/30'
                    : 'border-gray-200 focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-500/40',
                )}>
                  <input
                    type="number"
                    value={form.pv}
                    onChange={(e) => set('pv', e.target.value)}
                    placeholder="0"
                    className="flex-1 px-3.5 text-sm text-gray-800 bg-white focus:outline-none placeholder:text-gray-300"
                  />
                  <span className="flex items-center px-3 bg-green-600 border-l border-green-700 text-xs font-bold text-white shrink-0 whitespace-nowrap">
                    {pvNum} PV
                  </span>
                </div>
                {errors.pv && <p className="text-xs text-red-500 mt-1">PV is required</p>}
              </div>
            </div>
          </div>

          {/* Card 3 — Inventory */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Inventory</h2>
            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className={labelCls}>Stock Quantity</label>
                <input
                  type="number"
                  value={form.stockQty}
                  onChange={(e) => set('stockQty', e.target.value)}
                  placeholder="0"
                  className={inputCls}
                />
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

          {/* Card 4 — Image Upload */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Image</h2>
            <div
              className="border-2 border-dashed border-green-300 rounded-xl p-8 text-center cursor-pointer hover:bg-green-50 transition-colors"
              onClick={() => fileInputRef.current?.click()}
            >
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                className="hidden"
                onChange={handleImageUpload}
              />
              {imagePreview ? (
                <div className="relative inline-block">
                  <img src={imagePreview} alt="Preview" className="h-32 mx-auto rounded-lg object-cover" />
                  <button
                    onClick={(e) => { e.stopPropagation(); setImagePreview(null); }}
                    className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full w-6 h-6 flex items-center justify-center text-xs hover:bg-red-600 transition-colors"
                  >
                    ✕
                  </button>
                </div>
              ) : (
                <>
                  <div className="text-green-500 text-3xl mb-2">↑</div>
                  <p className="text-gray-500 text-sm">Drag &amp; drop or click to upload</p>
                  <span className="mt-2 inline-block border border-green-500 text-green-600 px-4 py-1.5 rounded-lg text-sm hover:bg-green-50 transition-colors">
                    Upload Image
                  </span>
                </>
              )}
            </div>
          </div>
        </div>

        {/* ── RIGHT COLUMN ── */}
        <div className="space-y-4">

          {/* Card Preview */}
          <div className={cardCls}>
            <h2 className="text-sm font-semibold text-gray-900 mb-4">Card Preview</h2>

            {hasPreview ? (
              <div className="bg-white rounded-2xl border border-gray-100 overflow-hidden shadow-sm">
                <div className={cn('relative h-28 bg-gradient-to-br flex items-center justify-center', CARD_GRADIENT[catKey])}>
                  {imagePreview ? (
                    <img src={imagePreview} alt="Product" className="h-full w-full object-cover" />
                  ) : (
                    <Package size={32} className="text-white/70" />
                  )}
                  <span className="absolute top-2.5 right-2.5 text-[11px] font-semibold px-2 py-0.5 rounded-full bg-green-100 text-green-700">
                    {form.active ? 'Active' : 'Inactive'}
                  </span>
                </div>
                <div className="p-3">
                  {form.category && (
                    <span className={cn('text-[10px] font-bold uppercase tracking-widest', PREVIEW_CATEGORY_TEXT[form.category as ProductCategory])}>
                      {form.category}
                    </span>
                  )}
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
            ) : (
              <div className="border-2 border-dashed border-gray-200 rounded-2xl h-44 flex flex-col items-center justify-center gap-2">
                <Package size={28} className="text-gray-200" />
                <p className="text-sm text-gray-300 font-medium">Preview will appear here</p>
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
          onClick={handleSubmit}
          className="px-6 py-2 rounded-xl bg-green-600 text-[#0b1410] text-sm font-semibold hover:bg-green-500 transition-colors"
        >
          Add Product
        </button>
      </div>

      {/* Success toast */}
      {showSuccessToast && (
        <div className="fixed bottom-6 right-6 bg-green-600 text-white px-5 py-3 rounded-xl shadow-lg flex items-center gap-2 z-50">
          <span>✓</span>
          <span>Product added successfully!</span>
        </div>
      )}
    </div>
  );
}
