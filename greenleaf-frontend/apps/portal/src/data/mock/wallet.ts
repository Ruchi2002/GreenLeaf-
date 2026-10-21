// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface WalletBalance {
  ewallet:  number;
  frozen:   number;
  vouchers: number;
}

export const MOCK_WALLET_BALANCES: WalletBalance = {
  ewallet:  764581000,
  frozen:   0,
  vouchers: 98700000,
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_BONUS_WEEKLY = [
  { label: 'W1', target: 400000, actual: 150000 },
  { label: 'W2', target: 400000, actual: 280000 },
  { label: 'W3', target: 400000, actual: 180000 },
  { label: 'W4', target: 400000, actual: 320000 },
  { label: 'W5', target: 400000, actual: 220000 },
  { label: 'W6', target: 400000, actual: 260000 },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_BONUS_MONTHLY = [
  { label: 'Apr', target: 1200000, actual:  580000 },
  { label: 'May', target: 1200000, actual:  820000 },
  { label: 'Jun', target: 1200000, actual:  650000 },
  { label: 'Jul', target: 1200000, actual:  950000 },
  { label: 'Aug', target: 1200000, actual:  464500 },
  { label: 'Sep', target: 1200000, actual:  302500 },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface BonusLineItem {
  label:        string;
  amount:       number;
  isDeduction?: boolean;
}

export interface BonusRecord {
  id:             string;
  date:           string;
  types:          string[];
  lineItems:      BonusLineItem[];
  actualReceived: number;
}

export const MOCK_BONUS_RECORDS: BonusRecord[] = [
  {
    id: 'B001', date: 'Sep 24, 2026', types: ['Sponsor Bonus', 'Layer Bonus'],
    lineItems: [
      { label: 'Sponsor Bonus (RB)',             amount: 150000 },
      { label: 'Layer Bonus (SB)',               amount:  45000 },
      { label: '10% Self Repeat Rebate (MS)',    amount:  12500 },
      { label: 'Service Center Subsidy',         amount:      0, isDeduction: true },
    ],
    actualReceived: 207500,
  },
  {
    id: 'B002', date: 'Sep 10, 2026', types: ['Sponsor Bonus', 'Self Repeat Rebate'],
    lineItems: [
      { label: 'Sponsor Bonus (RB)',             amount:  72000 },
      { label: '10% Self Repeat Rebate (MS)',    amount:  23000 },
      { label: 'Service Center Subsidy',         amount:      0, isDeduction: true },
    ],
    actualReceived: 95000,
  },
  {
    id: 'B003', date: 'Sep 03, 2026', types: ['Group Bonus'],
    lineItems: [
      { label: 'Group Bonus (GB)',               amount:  45000 },
      { label: 'Service Center Subsidy',         amount:      0, isDeduction: true },
    ],
    actualReceived: 45000,
  },
  {
    id: 'B004', date: 'Aug 27, 2026', types: ['Sponsor Bonus', 'Layer Bonus', 'Group Bonus'],
    lineItems: [
      { label: 'Sponsor Bonus (RB)',             amount: 180000 },
      { label: 'Layer Bonus (SB)',               amount:  82000 },
      { label: 'Group Bonus (GB)',               amount:  50000 },
      { label: 'Service Center Subsidy',         amount:      0, isDeduction: true },
    ],
    actualReceived: 312000,
  },
  {
    id: 'B005', date: 'Aug 20, 2026', types: ['Self Repeat Rebate'],
    lineItems: [
      { label: '10% Self Repeat Rebate (MS)',    amount:  12500 },
      { label: 'Service Center Subsidy',         amount:      0, isDeduction: true },
    ],
    actualReceived: 12500,
  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface BankAccount {
  id:          string;
  bankName:    string;
  accountNo:   string;
  accountName: string;
  isPrimary:   boolean;
}

export const MOCK_BANK_ACCOUNTS: BankAccount[] = [
  { id: 'BA001', bankName: 'HDFC Bank',  accountNo: '1234567890', accountName: 'Rohit Hegde', isPrimary: true  },
  { id: 'BA002', bankName: 'ICICI Bank', accountNo: '0987654321', accountName: 'Rohit Hegde', isPrimary: false },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type RechargeStatus = 'received' | 'pending' | 'rejected';

export interface RechargeRecord {
  id:     string;
  amount: number;
  ref:    string;
  date:   string;
  status: RechargeStatus;
}

export const MOCK_RECHARGE_HISTORY: RechargeRecord[] = [
  { id: 'RCH001', amount: 5000000, ref: '12845390', date: 'Sep 18, 2026', status: 'received' },
  { id: 'RCH002', amount: 2000000, ref: '12845217', date: 'Sep 25, 2026', status: 'pending'  },
  { id: 'RCH003', amount: 1000000, ref: '12844980', date: 'Sep 05, 2026', status: 'rejected' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type TxType   = 'credit' | 'debit' | 'transfer';
export type TxWallet = 'ewallet' | 'voucher';

export interface Transaction {
  id:          string;
  date:        string;
  time:        string;
  description: string;
  type:        TxType;
  wallet:      TxWallet;
  amount:      number;
  balance:     number;
  remarks?:    string;
}

export const MOCK_TRANSACTIONS: Transaction[] = [
  { id: 'TX001', date: 'Sep 24, 2026', time: '14:32', description: 'Sponsor Bonus credited',         type: 'credit',   wallet: 'ewallet', amount:  150000,    balance: 764581000 },
  { id: 'TX002', date: 'Sep 24, 2026', time: '10:05', description: 'Purchase — Radiance Serum',      type: 'debit',    wallet: 'ewallet', amount:  285000,    balance: 614431000 },
  { id: 'TX003', date: 'Sep 20, 2026', time: '16:48', description: 'E-wallet recharge received',     type: 'credit',   wallet: 'ewallet', amount: 5000000,    balance: 614716000 },
  { id: 'TX004', date: 'Sep 20, 2026', time: '09:15', description: 'Transfer to Suresh Verma',       type: 'transfer', wallet: 'ewallet', amount:  500000,    balance: 609716000 },
  { id: 'TX005', date: 'Sep 15, 2026', time: '11:22', description: 'Layer Bonus credited',           type: 'credit',   wallet: 'ewallet', amount:   45000,    balance: 610216000 },
  { id: 'TX006', date: 'Sep 15, 2026', time: '08:00', description: 'Voucher redemption',             type: 'debit',    wallet: 'voucher', amount:  120000,    balance:  98580000 },
  { id: 'TX007', date: 'Sep 10, 2026', time: '13:10', description: 'Self Repeat Rebate 10%',         type: 'credit',   wallet: 'ewallet', amount:   12500,    balance: 610171000 },
];
