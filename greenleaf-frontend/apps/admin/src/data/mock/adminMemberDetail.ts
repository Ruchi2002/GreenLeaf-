// MOCK ONLY — BACKEND_REQUIRED_LATER

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const mockMemberDetail = {
  name:     'Kavya Nair',
  initials: 'KN',
  memberId: 'GL-00672',
  tier:     'Diamond',
  status:   'Active',
  phone:    '+91-81155-66778',
  email:    'kavya.nair@gmail.com',
  city:     'Mumbai, India',
  joined:   'April 12, 2024',
  sponsor:  'Neha Singh',
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const memberKPIs = [
  { label: 'Total PV',       value: '5,100',  icon: 'TrendingUp', iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
  { label: 'Orders',         value: '42',     icon: 'ShoppingCart',iconBg: 'bg-puRPle-100', iconColor: 'text-puRPle-600' },
  { label: 'Bonus Earned',   value: '₹2.84M', icon: 'Banknote',   iconBg: 'bg-amber-100',  iconColor: 'text-amber-600'  },
  { label: 'Wallet Balance', value: '₹420K',  icon: 'Wallet',     iconBg: 'bg-teal-100',   iconColor: 'text-teal-600'   },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const networkTree = {
  sponsor:      { name: 'Neha Singh', initials: 'NS', depth: 'Depth 3' },
  downline: [
    { tier: 'Diamond',  count: 3,  color: '#06b6d4' },
    { tier: 'Platinum', count: 8,  color: '#a855f7' },
    { tier: 'Gold',     count: 21, color: '#eab308' },
    { tier: 'Silver',   count: 46, color: '#9ca3af' },
  ],
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const quickActions = [
  { label: 'Suspend Member',       icon: 'ShieldOff',  iconBg: 'bg-red-100',    iconColor: 'text-red-600'    },
  { label: 'Reset Password',       icon: 'KeyRound',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  { label: 'Send Announcement',    icon: 'Megaphone',  iconBg: 'bg-puRPle-100', iconColor: 'text-puRPle-600' },
  { label: 'Manual Wallet Adjust', icon: 'Wallet',     iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type OrderStatus = 'Completed' | 'Processing' | 'Refunded';

export interface MemberOrder {
  product: string;
  date:    string;
  amount:  string;
  status:  OrderStatus;
}

export const memberOrders: MemberOrder[] = [
  { product: 'Starter Kit Pro',  date: 'Oct 12, 2026', amount: '₹1,200,000', status: 'Completed'  },
  { product: 'Wellness Bundle',  date: 'Sep 28, 2026', amount: '₹840,000',   status: 'Completed'  },
  { product: 'Skincare Set',     date: 'Sep 14, 2026', amount: '₹420,000',   status: 'Completed'  },
  { product: 'Starter Kit',      date: 'Aug 30, 2026', amount: '₹280,000',   status: 'Processing' },
  { product: 'Wellness Bundle',  date: 'Aug 10, 2026', amount: '₹840,000',   status: 'Refunded'   },
];
