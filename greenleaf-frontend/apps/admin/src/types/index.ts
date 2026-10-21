// Greenleaf shared frontend types
// BACKEND_REQUIRED_LATER: Replace with generated API types when backend is ready

export type UserRole = 'member' | 'service_center' | 'admin';

export type OrderType = 'ZC' | 'FX' | 'SJ' | 'SC';

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export type WalletType = 'ewallet' | 'voucher' | 'travel_points';

export type CardLevel = 'bronze' | 'silver' | 'gold' | 'platinum';
