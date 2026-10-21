// MOCK ONLY — BACKEND_REQUIRED_LATER

export type SCOrderStatus = 'pending_payment' | 'processing' | 'shipped' | 'completed' | 'cancelled';
export type SCOrderType   = 'gift' | 'member_purchase';

export interface SCOrderItem {
  name:  string;
  qty:   number;
  price: number;
  pv:    number;
}

export interface SCOrder {
  id:              string;
  type:            SCOrderType;
  memberId:        string;
  memberName:      string;
  memberInitials:  string;
  status:          SCOrderStatus;
  date:            string;
  items:           SCOrderItem[];
  total:           number;
  totalPV:         number;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_SC_ORDERS: SCOrder[] = [
  {
    id: 'SCO-2026-001', type: 'gift', memberId: 'RP47850333',
    memberName: 'Priya Patel', memberInitials: 'PP',
    status: 'processing', date: 'Oct 8, 2026',
    items: [{ name: 'Greenleaf Collagen Booster', qty: 2, price: 185000, pv: 150 }],
    total: 370000, totalPV: 300,
  },
  {
    id: 'SCO-2026-002', type: 'member_purchase', memberId: 'RP47850602',
    memberName: 'Kavya Nair', memberInitials: 'KN',
    status: 'shipped', date: 'Oct 5, 2026',
    items: [
      { name: 'Whitening Serum Pro',     qty: 1, price: 220000, pv: 180 },
      { name: 'Greenleaf Body Lotion',   qty: 2, price: 120000, pv:  95 },
    ],
    total: 460000, totalPV: 370,
  },
  {
    id: 'SCO-2026-003', type: 'gift', memberId: 'RP47850519',
    memberName: 'Suresh Verma', memberInitials: 'SV',
    status: 'completed', date: 'Sep 28, 2026',
    items: [{ name: 'Greenleaf Face Mask Set', qty: 3, price: 175000, pv: 140 }],
    total: 525000, totalPV: 420,
  },
  {
    id: 'SCO-2026-004', type: 'member_purchase', memberId: 'RP47850111',
    memberName: 'Meera Iyer', memberInitials: 'MI',
    status: 'pending_payment', date: 'Oct 9, 2026',
    items: [{ name: 'Vitamin C Essence', qty: 1, price: 95000, pv: 75 }],
    total: 95000, totalPV: 75,
  },
  {
    id: 'SCO-2026-005', type: 'gift', memberId: 'RP47850333',
    memberName: 'Priya Patel', memberInitials: 'PP',
    status: 'cancelled', date: 'Sep 20, 2026',
    items: [{ name: 'Greenleaf Hair Treatment', qty: 1, price: 145000, pv: 115 }],
    total: 145000, totalPV: 115,
  },
];
