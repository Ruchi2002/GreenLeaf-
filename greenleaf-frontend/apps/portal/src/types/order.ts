// BACKEND_REQUIRED_LATER: align with API /orders shape

export type DeliveryMode = 'direct' | 'pickup';

export interface ShippingOption {
  id:      string;
  courier: string;
  service: string;
  label:   string;
  eta:     string;
  price:   number; // IDR
}

export interface PaymentMethod {
  id:     string;
  label:  string;
  detail: string;
}

export interface OrderItem {
  productId:   string;
  productName: string;
  sku:         string;
  price:       number;
  pv:          number | null;
  qty:         number;
}

export type OrderStatus =
  | 'pending_payment'
  | 'processing'
  | 'shipped'
  | 'delivered'
  | 'cancelled';

export interface Order {
  id:               string;
  memberId:         string;
  items:            OrderItem[];
  subtotal:         number;
  shippingCost:     number;
  total:            number;
  totalPV:          number;
  status:           OrderStatus;
  createdAt:        string;   // ISO 8601
  deliveryMode:     DeliveryMode;
  addressId:        string | null;
  serviceCenterId:  string | null;
  shippingOptionId: string | null;
  paymentMethodId:  string;
  note:             string;
}
