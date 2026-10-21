// MOCK ONLY — BACKEND_REQUIRED_LATER

export type OrderStatus = 'pending_payment' | 'pending_delivery' | 'shipped' | 'completed' | 'cancelled';
export type OrderType   = 'personal' | 'help' | 'sc_purchase';

export interface OrderItem {
  id:    string;
  name:  string;
  qty:   number;
  price: number;
  pv:    number;
  image: string;
}

export interface Order {
  id:               string;
  type:             OrderType;
  status:           OrderStatus;
  date:             string;
  items:            OrderItem[];
  total:            number;
  totalPV:          number;
  shippingAddress?: string;
  trackingNumber?:  string;
  paymentMethod?:   string;
  timeline:         { label: string; datetime: string; done: boolean }[];
}

export const MOCK_ORDERS: Order[] = [
  {
    id: 'GL-2024-001', type: 'personal', status: 'pending_payment', date: '2024-01-15 10:30',
    items: [
      { id: 'p1', name: 'Greenleaf Collagen Booster', qty: 2, price: 185000, pv: 150, image: '' },
      { id: 'p2', name: 'Whitening Serum Pro',        qty: 1, price: 220000, pv: 180, image: '' },
    ],
    total: 590000, totalPV: 480, paymentMethod: 'E-Wallet',
    timeline: [
      { label: 'Order placed',       datetime: '2024-01-15 10:30', done: true  },
      { label: 'Awaiting payment',   datetime: '2024-01-15 10:31', done: true  },
      { label: 'Payment confirmed',  datetime: '',                 done: false },
      { label: 'Processing',         datetime: '',                 done: false },
      { label: 'Shipped',            datetime: '',                 done: false },
      { label: 'Delivered',          datetime: '',                 done: false },
    ],
  },
  {
    id: 'GL-2024-002', type: 'help', status: 'shipped', date: '2024-01-12 14:20',
    items: [
      { id: 'p3', name: 'Greenleaf Body Lotion', qty: 3, price: 120000, pv: 95, image: '' },
    ],
    total: 360000, totalPV: 285,
    shippingAddress: '45 Connaught Place, New Delhi 110001',
    trackingNumber:  'JNE-887766554433',
    paymentMethod:   'E-Wallet',
    timeline: [
      { label: 'Order placed',      datetime: '2024-01-12 14:20', done: true  },
      { label: 'Awaiting payment',  datetime: '2024-01-12 14:21', done: true  },
      { label: 'Payment confirmed', datetime: '2024-01-12 15:05', done: true  },
      { label: 'Processing',        datetime: '2024-01-13 09:00', done: true  },
      { label: 'Shipped',           datetime: '2024-01-13 16:30', done: true  },
      { label: 'Delivered',         datetime: '',                 done: false },
    ],
  },
  {
    id: 'GL-2024-003', type: 'personal', status: 'completed', date: '2024-01-08 09:15',
    items: [
      { id: 'p4', name: 'Greenleaf Face Mask Set', qty: 1, price: 175000, pv: 140, image: '' },
      { id: 'p5', name: 'Vitamin C Essence',       qty: 2, price: 95000,  pv: 75,  image: '' },
    ],
    total: 365000, totalPV: 290,
    shippingAddress: '12 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
    trackingNumber:  'SICEPAT-112233445566',
    paymentMethod:   'Shopping Voucher',
    timeline: [
      { label: 'Order placed',      datetime: '2024-01-08 09:15', done: true },
      { label: 'Awaiting payment',  datetime: '2024-01-08 09:16', done: true },
      { label: 'Payment confirmed', datetime: '2024-01-08 10:00', done: true },
      { label: 'Processing',        datetime: '2024-01-09 08:30', done: true },
      { label: 'Shipped',           datetime: '2024-01-09 14:00', done: true },
      { label: 'Delivered',         datetime: '2024-01-11 11:30', done: true },
    ],
  },
  {
    id: 'GL-2024-004', type: 'sc_purchase', status: 'pending_delivery', date: '2024-01-14 16:45',
    items: [
      { id: 'p6', name: 'Greenleaf Hair Treatment', qty: 2, price: 145000, pv: 115, image: '' },
    ],
    total: 290000, totalPV: 230,
    shippingAddress: '8 Nariman Point, Mumbai, Maharashtra 400021',
    paymentMethod:   'E-Wallet',
    timeline: [
      { label: 'Order placed',      datetime: '2024-01-14 16:45', done: true  },
      { label: 'Awaiting payment',  datetime: '2024-01-14 16:46', done: true  },
      { label: 'Payment confirmed', datetime: '2024-01-14 17:30', done: true  },
      { label: 'Processing',        datetime: '2024-01-15 08:00', done: true  },
      { label: 'Shipped',           datetime: '',                 done: false },
      { label: 'Delivered',         datetime: '',                 done: false },
    ],
  },
];
