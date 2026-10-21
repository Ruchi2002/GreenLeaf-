// MOCK ONLY — BACKEND_REQUIRED_LATER

export type TransactionType = 'Bonus' | 'Withdrawal' | 'Recharge';
export type WalletTier      = 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface WalletStat {
  label:      string;
  value:      string;
  icon:       string;
  iconBg:     string;
  iconColor:  string;
}

export interface WalletTransaction {
  id:        string;
  member:    string;
  initials:  string;
  avatarBg:  string;
  tier:      WalletTier;
  date:      string;
  type:      TransactionType;
  amount:    string;
  isCredit:  boolean;
}

export interface WalletAdjustment {
  id:        string;
  member:    string;
  initials:  string;
  avatarBg:  string;
  reason:    string;
  date:      string;
  amount:    string;
  isCredit:  boolean;
}

export interface WalletMember {
  id:        string;
  name:      string;
  initials:  string;
  avatarBg:  string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const walletStats: WalletStat[] = [
  { label: 'Total Balance',         value: '₹2.4B',  icon: 'Wallet',          iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
  { label: 'Pending Withdrawals',   value: '₹184M',  icon: 'ArrowDownCircle', iconBg: 'bg-amber-100',  iconColor: 'text-amber-600'  },
  { label: 'Pending Recharges',     value: '12',     icon: 'ArrowUpCircle',   iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  { label: 'Month Payouts',         value: '₹312M',  icon: 'Send',            iconBg: 'bg-puRPle-100', iconColor: 'text-puRPle-600' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const walletTransactions: WalletTransaction[] = [
  { id: '1', member: 'Kavya Nair',   initials: 'KN', avatarBg: 'bg-cyan-500',    tier: 'Diamond',  date: 'Oct 13, 09:02', type: 'Bonus',      amount: '₹2.4M',  isCredit: true  },
  { id: '2', member: 'Rohit Verma',  initials: 'RV', avatarBg: 'bg-orange-500',  tier: 'Gold',     date: 'Oct 13, 08:40', type: 'Withdrawal', amount: '₹840K',  isCredit: false },
  { id: '3', member: 'Arjun Walia',  initials: 'AW', avatarBg: 'bg-amber-500',   tier: 'Platinum', date: 'Oct 12, 21:12', type: 'Recharge',   amount: '₹1.5M',  isCredit: true  },
  { id: '4', member: 'Deepika Lal',  initials: 'DL', avatarBg: 'bg-slate-500',   tier: 'Silver',   date: 'Oct 12, 18:55', type: 'Bonus',      amount: '₹420K',  isCredit: true  },
  { id: '5', member: 'Neha Aiyar',   initials: 'NA', avatarBg: 'bg-teal-500',    tier: 'Gold',     date: 'Oct 12, 15:21', type: 'Withdrawal', amount: '₹1.1M',  isCredit: false },
  { id: '6', member: 'Ravi Pratap',  initials: 'RP', avatarBg: 'bg-gray-500',    tier: 'Silver',   date: 'Oct 12, 11:08', type: 'Recharge',   amount: '₹600K',  isCredit: true  },
  { id: '7', member: 'Priya Sharma', initials: 'PS', avatarBg: 'bg-puRPle-500',  tier: 'Diamond',  date: 'Oct 11, 09:44', type: 'Bonus',      amount: '₹3.1M',  isCredit: true  },
  { id: '8', member: 'Amit Singh',   initials: 'AS', avatarBg: 'bg-blue-500',    tier: 'Diamond',  date: 'Oct 10, 20:30', type: 'Withdrawal', amount: '₹2.0M',  isCredit: false },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const walletAdjustments: WalletAdjustment[] = [
  { id: 'a1', member: 'Arjun Walia',  initials: 'AW', avatarBg: 'bg-amber-500',  reason: 'Manual correction',     date: 'Oct 12', amount: '₹150K', isCredit: true  },
  { id: 'a2', member: 'Deepika Lal',  initials: 'DL', avatarBg: 'bg-slate-500',  reason: 'Support resolution',    date: 'Oct 11', amount: '₹80K',  isCredit: false },
  { id: 'a3', member: 'Rohit Verma',  initials: 'RV', avatarBg: 'bg-orange-500', reason: 'Bonus reconciliation',  date: 'Oct 10', amount: '₹420K', isCredit: true  },
  { id: 'a4', member: 'Neha Aiyar',   initials: 'NA', avatarBg: 'bg-teal-500',   reason: 'Manual correction',     date: 'Oct 9',  amount: '₹60K',  isCredit: true  },
  { id: 'a5', member: 'Ravi Pratap',  initials: 'RP', avatarBg: 'bg-gray-500',   reason: 'Dispute resolution',    date: 'Oct 8',  amount: '₹120K', isCredit: false },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const walletMembers: WalletMember[] = [
  { id: 'GL-00672', name: 'Kavya Nair',   initials: 'KN', avatarBg: 'bg-cyan-500'   },
  { id: 'GL-4820',  name: 'Rohit Verma',  initials: 'RV', avatarBg: 'bg-orange-500' },
  { id: 'GL-4818',  name: 'Arjun Walia',  initials: 'AW', avatarBg: 'bg-amber-500'  },
  { id: 'GL-4819',  name: 'Deepika Lal',  initials: 'DL', avatarBg: 'bg-slate-500'  },
  { id: 'GL-4817',  name: 'Neha Aiyar',   initials: 'NA', avatarBg: 'bg-teal-500'   },
  { id: 'GL-4816',  name: 'Ravi Pratap',  initials: 'RP', avatarBg: 'bg-gray-500'   },
  { id: 'GL-4821',  name: 'Priya Sharma', initials: 'PS', avatarBg: 'bg-puRPle-500' },
  { id: 'GL-4815',  name: 'Amit Singh',   initials: 'AS', avatarBg: 'bg-blue-500'   },
];

export const ADJUST_REASONS = [
  'Manual correction',
  'Support resolution',
  'Bonus reconciliation',
  'Dispute resolution',
  'Other',
] as const;
