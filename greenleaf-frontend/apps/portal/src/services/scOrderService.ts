// MOCK ONLY — BACKEND_REQUIRED_LATER
// When backend is ready: replace function bodies with real API calls.
// Signatures and return types must not change — only the implementation inside.

import { MOCK_SC_ORDERS } from '@/data/mock/scOrders';
import type { SCOrder, SCOrderStatus } from '@/data/mock/scOrders';

// PROPOSED FRONTEND CONTRACT:
// GET /sc/orders              → SCOrder[]
// GET /sc/orders?status=...   → SCOrder[]

export async function getSCOrders(): Promise<SCOrder[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_SC_ORDERS;
}

export async function getSCOrdersByStatus(status: SCOrderStatus): Promise<SCOrder[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_SC_ORDERS.filter((o) => o.status === status);
}
