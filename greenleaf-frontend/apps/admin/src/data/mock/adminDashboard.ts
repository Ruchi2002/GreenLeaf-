// MOCK ONLY — BACKEND_REQUIRED_LATER

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const dashboardStats = [
  {
    label:    'Total Members',
    value:    '2,431',
    trend:    '+12.4%',
    trendUp:  true,
    iconBg:   'bg-green-500/15',
    iconColor:'text-green-500',
    icon:     'Users',
  },
  {
    label:    'Revenue',
    value:    '₹8.47M',
    trend:    '+8.1%',
    trendUp:  true,
    iconBg:   'bg-teal-500/15',
    iconColor:'text-teal-400',
    icon:     'TrendingUp',
  },
  {
    label:    'Orders',
    value:    '1,284',
    trend:    '+5.6%',
    trendUp:  true,
    iconBg:   'bg-puRPle-500/15',
    iconColor:'text-puRPle-400',
    icon:     'ShoppingCart',
  },
  {
    label:    'Bonus Paid',
    value:    '₹3.12M',
    trend:    '+21.3%',
    trendUp:  true,
    dark:     true,
    iconBg:   'bg-green-500/10',
    iconColor:'text-green-400',
    icon:     'Banknote',
  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const revenueData = [
  { month: 'Mar', value: 45 },
  { month: 'Apr', value: 52 },
  { month: 'May', value: 48 },
  { month: 'Jun', value: 61 },
  { month: 'Jul', value: 55 },
  { month: 'Aug', value: 72 },
  { month: 'Sep', value: 118 },
  { month: 'Oct', value: 89 },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const tierData = [
  { label: 'Diamond', pct: 18, color: '#8b5cf6' },
  { label: 'Gold',    pct: 32, color: '#f59e0b' },
  { label: 'Silver',  pct: 28, color: '#9ca3af' },
  { label: 'Bronze',  pct: 22, color: '#b45309' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type OrderStatus = 'Completed' | 'Processing' | 'Pending' | 'Refunded';

export interface RecentOrder {
  id:       string;
  member:   string;
  initials: string;
  tier:     string;
  product:  string;
  amount:   string;
  status:   OrderStatus;
  date:     string;
}

export const recentOrders: RecentOrder[] = [
  { id: 'GL-2026-1091', member: 'Rahul Sharma', initials: 'RS', tier: 'Diamond', product: 'Diamond Upgrade Package',       amount: '₹3,500,000', status: 'Completed',  date: 'Oct 12, 2026' },
  { id: 'GL-2026-1090', member: 'Priya Patel',  initials: 'PP', tier: 'Gold',    product: 'Premium Registration Package',  amount: '₹2,100,000', status: 'Processing', date: 'Oct 12, 2026' },
  { id: 'GL-2026-1089', member: 'Amit Kumar',   initials: 'AK', tier: 'Silver',  product: '275 PV Gift Bag',               amount: '₹410,000',   status: 'Pending',    date: 'Oct 11, 2026' },
  { id: 'GL-2026-1088', member: 'Neha Singh',   initials: 'NS', tier: 'Bronze',  product: 'Starter Registration Package',  amount: '₹1,250,000', status: 'Refunded',   date: 'Oct 11, 2026' },
  { id: 'GL-2026-1087', member: 'Vikram Mehta', initials: 'VM', tier: 'Gold',    product: 'SC Procurement Bundle A',       amount: '₹5,800,000', status: 'Completed',  date: 'Oct 10, 2026' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface QuickAction {
  label:     string;
  href:      string;
  icon:      string;
  bgClass:   string;
  iconClass: string;
}

export const quickActions: QuickAction[] = [
  { label: 'Add Member',       href: '/members/new',   icon: 'UseRPlus',     bgClass: 'bg-green-500/10  hover:bg-green-500/20',  iconClass: 'text-green-500'  },
  { label: 'Process Payout',   href: '/wallet',        icon: 'Banknote',     bgClass: 'bg-teal-500/10   hover:bg-teal-500/20',   iconClass: 'text-teal-500'   },
  { label: 'New Announcement', href: '/announcements', icon: 'Megaphone',    bgClass: 'bg-blue-500/10   hover:bg-blue-500/20',   iconClass: 'text-blue-500'   },
  { label: 'Generate Report',  href: '/reports',       icon: 'FileBarChart', bgClass: 'bg-puRPle-500/10 hover:bg-puRPle-500/20', iconClass: 'text-puRPle-500' },
  { label: 'Manage Roles',     href: '/roles',         icon: 'ShieldCheck',  bgClass: 'bg-orange-500/10 hover:bg-orange-500/20', iconClass: 'text-orange-500' },
  { label: 'View Audit Log',   href: '/audit-logs',    icon: 'ClipboardList',bgClass: 'bg-slate-500/10  hover:bg-slate-500/20',  iconClass: 'text-slate-400'  },
];
