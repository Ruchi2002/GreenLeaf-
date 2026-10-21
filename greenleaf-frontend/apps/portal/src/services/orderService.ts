// MOCK ONLY — BACKEND_REQUIRED_LATER

import { MOCK_SHIPPING_OPTIONS, MOCK_PAYMENT_METHODS } from '@/data/mock/checkout';
import type { ShippingOption, PaymentMethod } from '@/types/order';
import { MOCK_ORDERS } from '@/data/mock/orders';
import type { Order, OrderStatus } from '@/data/mock/orders';

// PROPOSED FRONTEND CONTRACT:
// GET /shipping/options  → ShippingOption[]
// GET /payment/methods   → PaymentMethod[]
// GET /orders            → Order[]
// GET /orders/:id        → Order | null
// GET /orders?status=    → Order[]

export async function getShippingOptions(): Promise<ShippingOption[]> {
  return MOCK_SHIPPING_OPTIONS;
}

export async function getPaymentMethods(): Promise<PaymentMethod[]> {
  return MOCK_PAYMENT_METHODS;
}

export async function getOrders(): Promise<Order[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_ORDERS;
}

export async function getOrderById(id: string): Promise<Order | null> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 200));
  return MOCK_ORDERS.find((o) => o.id === id) ?? null;
}

export async function getOrdersByStatus(status: OrderStatus): Promise<Order[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_ORDERS.filter((o) => o.status === status);
}
