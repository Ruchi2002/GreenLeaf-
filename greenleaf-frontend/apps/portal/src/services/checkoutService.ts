// MOCK ONLY — BACKEND_REQUIRED_LATER
// When backend is ready: replace function bodies with real API calls.
// Signatures and return types must not change — only the implementation inside.

import {
  MOCK_SHIPPING_OPTIONS,
  MOCK_PAYMENT_METHODS,
  MOCK_ADDRESSES,
} from '@/data/mock/checkout';
import type { ShippingOption, PaymentMethod, CheckoutAddress } from '@/data/mock/checkout';

// PROPOSED FRONTEND CONTRACT:
// GET  /checkout/shipping-options  → ShippingOption[]
// GET  /checkout/payment-methods   → PaymentMethod[]
// GET  /checkout/addresses         → CheckoutAddress[]
// POST /checkout/place-order       → { orderId: string }

export async function getShippingOptions(): Promise<ShippingOption[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_SHIPPING_OPTIONS;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_PAYMENT_METHODS;
}

export async function getSavedAddresses(): Promise<CheckoutAddress[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_ADDRESSES;
}

export async function placeOrder(_payload: unknown): Promise<{ orderId: string }> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 800));
  return { orderId: 'GL-2024-' + Math.floor(Math.random() * 9000 + 1000) };
}
