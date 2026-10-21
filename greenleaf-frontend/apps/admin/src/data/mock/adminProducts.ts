// MOCK ONLY — BACKEND_REQUIRED_LATER

export type ProductCategory = 'Registration' | 'Upgrade' | 'Repurchase' | 'Store';
export type StockStatus     = 'In Stock' | 'Low Stock' | 'Out of Stock';

export interface AdminProduct {
  id:          string;
  name:        string;
  sku:         string;
  category:    ProductCategory;
  price:       string;
  priceNum:    number;
  pv:          number;
  stock:       StockStatus;
  stockQty:    number;
  description: string;
  tags:        string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const adminProducts: AdminProduct[] = [
  {
    id: '1', name: 'Starter Kit Pro',          sku: 'SKU-SKP-1001',
    category: 'Registration', price: '₹1,200,000', priceNum: 1200000, pv: 120,
    stock: 'In Stock',     stockQty: 84,
    description: 'Complete starter kit for new distributors. Includes all essential products and training materials.',
    tags: 'starter, registration, new member',
  },
  {
    id: '2', name: 'New Member Welcome Pack',   sku: 'SKU-NMW-1002',
    category: 'Registration', price: '₹750,000',   priceNum: 750000,  pv: 75,
    stock: 'In Stock',     stockQty: 120,
    description: 'Affordable entry pack for new members joining the Greenleaf network.',
    tags: 'welcome, registration, entry level',
  },
  {
    id: '3', name: 'Gold Upgrade Bundle',       sku: 'SKU-GUB-2001',
    category: 'Upgrade',       price: '₹2,400,000', priceNum: 2400000, pv: 240,
    stock: 'Low Stock',    stockQty: 8,
    description: 'Upgrade package for members advancing to Gold tier. Includes bonus PV credits.',
    tags: 'upgrade, gold, tier',
  },
  {
    id: '4', name: 'Platinum Upgrade Pack',     sku: 'SKU-PUP-2002',
    category: 'Upgrade',       price: '₹4,800,000', priceNum: 4800000, pv: 480,
    stock: 'In Stock',     stockQty: 22,
    description: 'Premium upgrade bundle for Platinum tier advancement with exclusive bonuses.',
    tags: 'upgrade, platinum, premium, tier',
  },
  {
    id: '5', name: 'Wellness Bundle',           sku: 'SKU-WB-3001',
    category: 'Repurchase',    price: '₹840,000',   priceNum: 840000,  pv: 84,
    stock: 'In Stock',     stockQty: 210,
    description: 'Monthly wellness repurchase pack. Includes herbal supplements and wellness products.',
    tags: 'wellness, repurchase, monthly, health',
  },
  {
    id: '6', name: 'Herbal Tea Refill',         sku: 'SKU-HTR-3002',
    category: 'Repurchase',    price: '₹310,000',   priceNum: 310000,  pv: 31,
    stock: 'Low Stock',    stockQty: 14,
    description: 'Premium herbal tea blend refill pack. Rich in antioxidants and wellness properties.',
    tags: 'herbal, tea, repurchase, health',
  },
  {
    id: '7', name: 'Skincare Set',              sku: 'SKU-SCS-4001',
    category: 'Store',         price: '₹420,000',   priceNum: 420000,  pv: 42,
    stock: 'In Stock',     stockQty: 67,
    description: 'Complete skincare regimen set. Suitable for all skin types with natural ingredients.',
    tags: 'skincare, beauty, store, natural',
  },
  {
    id: '8', name: 'Greenleaf Tote Bag',        sku: 'SKU-GTB-4002',
    category: 'Store',         price: '₹150,000',   priceNum: 150000,  pv: 10,
    stock: 'Out of Stock', stockQty: 0,
    description: 'Eco-friendly branded tote bag. Made from sustainable materials with Greenleaf branding.',
    tags: 'bag, accessory, eco, store',
  },
];

export const CATEGORY_COLOR: Record<ProductCategory, string> = {
  Registration: 'text-green-700',
  Upgrade:      'text-amber-700',
  Repurchase:   'text-puRPle-700',
  Store:        'text-teal-600',
};

export const CATEGORY_DOT: Record<ProductCategory, string> = {
  Registration: 'bg-green-500',
  Upgrade:      'bg-amber-500',
  Repurchase:   'bg-puRPle-500',
  Store:        'bg-teal-500',
};

export const CARD_GRADIENT: Record<ProductCategory, string> = {
  Registration: 'from-[#0a1f13] to-[#1a3d22]',
  Upgrade:      'from-[#f59e0b] to-[#d97706]',
  Repurchase:   'from-[#7c3aed] to-[#6d28d9]',
  Store:        'from-[#0d9488] to-[#0891b2]',
};

export const STOCK_CHIP: Record<StockStatus, string> = {
  'In Stock':     'bg-green-100 text-green-700',
  'Low Stock':    'bg-amber-100 text-amber-700',
  'Out of Stock': 'bg-gray-100 text-gray-500',
};
