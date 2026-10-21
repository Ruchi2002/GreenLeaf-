// BACKEND_REQUIRED_LATER: align with API response shape for /products

export type ProductCategory =
  | 'Registration Packages'
  | 'Upgrade Packages'
  | 'Repurchase Products'
  | 'Store Procurement';

export type ProductIconKey =
  | 'Package' | 'Sparkles' | 'Star' | 'Gift'
  | 'Heart'   | 'Droplets' | 'Leaf' | 'Box' | 'ShoppingBag';

// 'primary' → green styling, 'gold' → gold styling (drives badge + icon colors in UI)
export type ProductTheme = 'primary' | 'gold';

export interface Product {
  id:           string;
  slug:         string;
  name:         string;
  sku:          string;
  price:        number;         // IDR, raw integer (e.g. 410000 = RP 410.000)
  pv:           number | null;  // Point Value; null if product earns coupon instead
  coupon:       number | null;  // Coupon points; null if product earns PV instead
  stock:        number;
  category:     ProductCategory;
  theme:        ProductTheme;
  iconKey:      ProductIconKey; // maps to Lucide icon via PRODUCT_ICON_MAP in UI layer
  image?:       string | null;  // optional product photo URL
}

export interface ProductDetail extends Product {
  rating:      number;    // e.g. 4.8
  reviewCount: number;
  description: string;
  contents:    string[];
  howToUse:    string;
}
