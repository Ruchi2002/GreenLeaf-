// MOCK ONLY — BACKEND_REQUIRED_LATER

export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Cancelled';
export type CategoryTag = 'Starter' | 'Wellness' | 'Beauty';

export interface AdminOrder {
  id:        string;
  orderId:   string;
  member:    string;
  initials:  string;
  avatarBg:  string;
  product:   string;
  category:  CategoryTag;
  date:      string;
  pv:        number;
  amount:    string;
  status:    OrderStatus;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const tabCounts = {
  All:        32,
  Pending:     6,
  Processing:  4,
  Completed:  19,
  Cancelled:   3,
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const adminOrders: AdminOrder[] = [
  { id: '1', orderId: '#GL-4821', member: 'Priya Sharma',  initials: 'PS', avatarBg: 'bg-puRPle-500', product: 'Starter Kit Pro',  category: 'Starter',  date: 'Oct 12, 2026', pv: 120, amount: '₹1,200,000', status: 'Completed'  },
  { id: '2', orderId: '#GL-4820', member: 'Rohit Verma',   initials: 'RV', avatarBg: 'bg-orange-500', product: 'Wellness Bundle',  category: 'Wellness', date: 'Oct 12, 2026', pv:  84, amount: '₹840,000',   status: 'Pending'    },
  { id: '3', orderId: '#GL-4819', member: 'Deepika Lal',   initials: 'DL', avatarBg: 'bg-slate-500',  product: 'Skincare Set',     category: 'Beauty',   date: 'Oct 11, 2026', pv:  42, amount: '₹420,000',   status: 'Processing' },
  { id: '4', orderId: '#GL-4818', member: 'Arjun Walia',   initials: 'AW', avatarBg: 'bg-amber-500',  product: 'Starter Kit',      category: 'Starter',  date: 'Oct 11, 2026', pv:  28, amount: '₹280,000',   status: 'Pending'    },
  { id: '5', orderId: '#GL-4817', member: 'Neha Aiyar',    initials: 'NA', avatarBg: 'bg-teal-500',   product: 'Wellness Bundle',  category: 'Wellness', date: 'Oct 10, 2026', pv:  84, amount: '₹840,000',   status: 'Cancelled'  },
  { id: '6', orderId: '#GL-4816', member: 'Ravi Pratap',   initials: 'RP', avatarBg: 'bg-gray-500',   product: 'Skincare Set',     category: 'Beauty',   date: 'Oct 9, 2026',  pv:  42, amount: '₹420,000',   status: 'Completed'  },
];
