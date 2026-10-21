// MOCK ONLY — BACKEND_REQUIRED_LATER

import type { ShippingOption, PaymentMethod } from '@/types/order';
import type { MemberAddress } from '@/types/member';

export type { ShippingOption, PaymentMethod };

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type CheckoutAddress = MemberAddress;

export const MOCK_SHIPPING_OPTIONS: ShippingOption[] = [
  { id: 'bluedart-std', courier: 'Blue Dart',  service: 'Standard',   label: 'Blue Dart Standard',   eta: '3-5 days', price: 18000 },
  { id: 'bluedart-exp', courier: 'Blue Dart',  service: 'Express',    label: 'Blue Dart Express',    eta: '1 day',    price: 38000 },
  { id: 'delhivery',    courier: 'Delhivery',  service: 'Regular',    label: 'Delhivery Regular',    eta: '2-4 days', price: 15000 },
  { id: 'dtdc',         courier: 'DTDC',       service: 'Priority',   label: 'DTDC Priority',        eta: '2-3 days', price: 16000 },
];

export const MOCK_PAYMENT_METHODS: PaymentMethod[] = [
  { id: 'transfer-sbi',   label: 'Bank Transfer — SBI',       detail: 'A/C Greenleaf India Pvt. Ltd.' },
  { id: 'transfer-hdfc',  label: 'Bank Transfer — HDFC Bank', detail: 'A/C Greenleaf India Pvt. Ltd.' },
  { id: 'transfer-icici', label: 'Bank Transfer — ICICI Bank',detail: 'A/C Greenleaf India Pvt. Ltd.' },
  { id: 'ewallet',        label: 'E-Wallet (Greenleaf)',      detail: 'Deduct from your available balance' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_ADDRESSES: CheckoutAddress[] = [
  {
    id: 'addr1', label: 'Home', isDefault: true,
    name: 'Rohit Hegde', phone: '+91 98765-43210',
    street: '12 Linking Road, Bandra West', city: 'Mumbai', province: 'Maharashtra', postal: '400050',
  },
  {
    id: 'addr2', label: 'Office', isDefault: false,
    name: 'Rohit Hegde', phone: '+91 98765-43210',
    street: '45 Connaught Place', city: 'New Delhi', province: 'Delhi', postal: '110001',
  },
];
