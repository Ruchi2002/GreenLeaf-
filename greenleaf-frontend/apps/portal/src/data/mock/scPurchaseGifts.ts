// MOCK ONLY — BACKEND_REQUIRED_LATER

import { MOCK_PRODUCTS } from '@/data/mock/products';
import { MOCK_SC_MEMBERS } from '@/data/mock/scMembers';

export { MOCK_PRODUCTS as GIFT_PRODUCTS };
export { MOCK_SC_MEMBERS as GIFT_RECIPIENTS };

export interface GiftCartItem {
  productId: string;
  name:      string;
  price:     number;
  pv:        number;
  qty:       number;
  image:     string;
}
