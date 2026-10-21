// MOCK ONLY — BACKEND_REQUIRED_LATER
// Replace mock imports with apiClient calls when backend is ready.
// Function signatures must NOT change when switching to real API.

import { MOCK_PRODUCTS } from '@/data/mock/products';
import type { Product, ProductDetail } from '@/types/product';

// PROPOSED FRONTEND CONTRACT:
// GET /products  → Product[]
// GET /products/:slug → ProductDetail | 404

export async function getProducts(): Promise<Product[]> {
  return MOCK_PRODUCTS;
}

export async function getProductBySlug(slug: string): Promise<ProductDetail | null> {
  return MOCK_PRODUCTS.find((p) => p.slug === slug) ?? null;
}
