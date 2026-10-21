// MOCK ONLY — BACKEND_REQUIRED_LATER

export type WithdrawalStatus = 'Pending' | 'Approved' | 'Rejected';
export type WithdrawalTier   = 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface Withdrawal {
  id:           string;
  ref:          string;
  member:       string;
  initials:     string;
  avatarBg:     string;
  tier:         WithdrawalTier;
  amount:       string;
  amountNum:    number;
  bank:         string;
  bankCode:     string;
  bankBg:       string;
  accountMask:  string;
  last4:        string;
  requestedAt:  string;
  status:       WithdrawalStatus;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const withdrawalsList: Withdrawal[] = [
  { id:  '1', ref: '#WD-3081', member: 'Priya Sharma',  initials: 'PS', avatarBg: 'bg-cyan-500',    tier: 'Diamond',  amount: '₹2,45,000', amountNum:  245000, bank: 'HDFC',  bankCode: 'HD', bankBg: 'bg-blue-600',   accountMask: '●●●●4821', last4: '4821', requestedAt: 'Oct 13, 09:10', status: 'Pending'  },
  { id:  '2', ref: '#WD-3080', member: 'Rohit Verma',   initials: 'RV', avatarBg: 'bg-orange-500',  tier: 'Gold',     amount: '₹42,500',   amountNum:   42500, bank: 'SBI',   bankCode: 'SB', bankBg: 'bg-green-800',  accountMask: '●●●●7732', last4: '7732', requestedAt: 'Oct 13, 08:44', status: 'Pending'  },
  { id:  '3', ref: '#WD-3079', member: 'Deepika Lal',   initials: 'DL', avatarBg: 'bg-slate-500',   tier: 'Silver',   amount: '₹18,000',   amountNum:   18000, bank: 'Axis',  bankCode: 'AX', bankBg: 'bg-red-600',    accountMask: '●●●●1190', last4: '1190', requestedAt: 'Oct 12, 21:02', status: 'Approved' },
  { id:  '4', ref: '#WD-3078', member: 'Arjun Walia',   initials: 'AW', avatarBg: 'bg-puRPle-500',  tier: 'Platinum', amount: '₹88,000',   amountNum:   88000, bank: 'PNB',   bankCode: 'PN', bankBg: 'bg-orange-500', accountMask: '●●●●5543', last4: '5543', requestedAt: 'Oct 12, 17:30', status: 'Rejected' },
  { id:  '5', ref: '#WD-3077', member: 'Neha Aiyar',    initials: 'NA', avatarBg: 'bg-amber-500',   tier: 'Gold',     amount: '₹35,750',   amountNum:   35750, bank: 'HDFC',  bankCode: 'HD', bankBg: 'bg-blue-600',   accountMask: '●●●●9064', last4: '9064', requestedAt: 'Oct 12, 11:15', status: 'Approved' },
  { id:  '6', ref: '#WD-3076', member: 'Kavya Nair',    initials: 'KN', avatarBg: 'bg-teal-500',    tier: 'Diamond',  amount: '₹1,92,000', amountNum:  192000, bank: 'ICICI', bankCode: 'IC', bankBg: 'bg-orange-600', accountMask: '●●●●2277', last4: '2277', requestedAt: 'Oct 12, 09:30', status: 'Pending'  },
  { id:  '7', ref: '#WD-3075', member: 'Ravi Pratap',   initials: 'RP', avatarBg: 'bg-gray-500',    tier: 'Silver',   amount: '₹9,200',    amountNum:    9200, bank: 'SBI',   bankCode: 'SB', bankBg: 'bg-green-800',  accountMask: '●●●●8801', last4: '8801', requestedAt: 'Oct 11, 18:55', status: 'Approved' },
  { id:  '8', ref: '#WD-3074', member: 'Amit Singh',    initials: 'AS', avatarBg: 'bg-blue-500',    tier: 'Diamond',  amount: '₹3,10,000', amountNum:  310000, bank: 'HDFC',  bankCode: 'HD', bankBg: 'bg-blue-600',   accountMask: '●●●●3390', last4: '3390', requestedAt: 'Oct 11, 14:20', status: 'Pending'  },
  { id:  '9', ref: '#WD-3073', member: 'Sunita Rao',    initials: 'SR', avatarBg: 'bg-rose-500',    tier: 'Gold',     amount: '₹27,800',   amountNum:   27800, bank: 'Axis',  bankCode: 'AX', bankBg: 'bg-red-600',    accountMask: '●●●●6612', last4: '6612', requestedAt: 'Oct 11, 10:05', status: 'Rejected' },
  { id: '10', ref: '#WD-3072', member: 'Vikram Mehta',  initials: 'VM', avatarBg: 'bg-indigo-500',  tier: 'Platinum', amount: '₹74,500',   amountNum:   74500, bank: 'PNB',   bankCode: 'PN', bankBg: 'bg-orange-500', accountMask: '●●●●4455', last4: '4455', requestedAt: 'Oct 10, 21:40', status: 'Approved' },
  { id: '11', ref: '#WD-3071', member: 'Meera Iyer',    initials: 'MI', avatarBg: 'bg-pink-500',    tier: 'Gold',     amount: '₹21,000',   amountNum:   21000, bank: 'HDFC',  bankCode: 'HD', bankBg: 'bg-blue-600',   accountMask: '●●●●7743', last4: '7743', requestedAt: 'Oct 10, 16:18', status: 'Pending'  },
  { id: '12', ref: '#WD-3070', member: 'Suresh Verma',  initials: 'SV', avatarBg: 'bg-emerald-500', tier: 'Silver',   amount: '₹12,500',   amountNum:   12500, bank: 'SBI',   bankCode: 'SB', bankBg: 'bg-green-800',  accountMask: '●●●●9910', last4: '9910', requestedAt: 'Oct 10, 11:50', status: 'Approved' },
];

export const REJECT_REASONS = [
  'Insufficient verification',
  'Bank details mismatch',
  'Suspicious activity',
  'Duplicate request',
  'Other',
] as const;
