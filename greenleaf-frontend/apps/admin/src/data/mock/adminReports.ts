// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface MonthlyStat {
  month: string;
  revenue: number;
  orders: number;
  newMembers: number;
  bonusPaid: number;
}

export interface TopProduct {
  rank: number;
  name: string;
  category: string;
  sold: number;
  revenue: number;
}

export interface TopMember {
  rank: number;
  name: string;
  city: string;
  tier: 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  totalPurchase: number;
  referrals: number;
}

export interface ReportSummary {
  label: string;
  value: string;
  change: string;
  positive: boolean;
}

export const monthlySummary: ReportSummary[] = [
  { label: 'Total Revenue',   value: '₹48,72,500', change: '+12.4%', positive: true  },
  { label: 'Total Orders',    value: '1,284',      change: '+8.1%',  positive: true  },
  { label: 'New Members',     value: '342',         change: '+15.3%', positive: true  },
  { label: 'Bonus Paid Out',  value: '₹6,30,000',  change: '+5.2%',  positive: true  },
  { label: 'Avg Order Value', value: '₹3,794',     change: '-2.1%',  positive: false },
  { label: 'Active Members',  value: '2,841',       change: '+9.7%',  positive: true  },
];

export const monthlyStats: MonthlyStat[] = [
  { month: 'May', revenue: 3200000, orders:  890, newMembers: 210, bonusPaid: 420000 },
  { month: 'Jun', revenue: 3580000, orders:  980, newMembers: 245, bonusPaid: 465000 },
  { month: 'Jul', revenue: 3950000, orders: 1050, newMembers: 278, bonusPaid: 514000 },
  { month: 'Aug', revenue: 4120000, orders: 1120, newMembers: 301, bonusPaid: 535000 },
  { month: 'Sep', revenue: 4340000, orders: 1198, newMembers: 318, bonusPaid: 578000 },
  { month: 'Oct', revenue: 4872500, orders: 1284, newMembers: 342, bonusPaid: 630000 },
];

export const topProducts: TopProduct[] = [
  { rank: 1, name: 'Ashwagandha Premium 500g',   category: 'Supplements', sold: 284, revenue: 1136000 },
  { rank: 2, name: 'Neem Tulsi Face Wash 200ml',  category: 'Skincare',    sold: 241, revenue:  578400 },
  { rank: 3, name: 'Triphala Churna 250g',         category: 'Supplements', sold: 198, revenue:  415800 },
  { rank: 4, name: 'Aloe Vera Gel 300ml',           category: 'Skincare',    sold: 176, revenue:  316800 },
  { rank: 5, name: 'Brahmi Hair Oil 200ml',         category: 'Hair Care',   sold: 154, revenue:  277200 },
];

export const topMembers: TopMember[] = [
  { rank: 1, name: 'Rahul Sharma', city: 'Mumbai',    tier: 'Diamond',  totalPurchase: 284000, referrals: 42 },
  { rank: 2, name: 'Priya Patel',  city: 'Ahmedabad', tier: 'Diamond',  totalPurchase: 241000, referrals: 38 },
  { rank: 3, name: 'Vikram Mehta', city: 'Delhi',     tier: 'Platinum', totalPurchase: 198000, referrals: 31 },
  { rank: 4, name: 'Kavya Nair',   city: 'Kochi',     tier: 'Platinum', totalPurchase: 176000, referrals: 27 },
  { rank: 5, name: 'Suresh Verma', city: 'Jaipur',    tier: 'Gold',     totalPurchase: 154000, referrals: 22 },
];
