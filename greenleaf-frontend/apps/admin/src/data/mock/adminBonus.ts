// MOCK ONLY — BACKEND_REQUIRED_LATER

export type BonusStatus = 'Approved' | 'Pending' | 'Processing';
export type MemberTier  = 'Diamond' | 'Platinum' | 'Gold' | 'Silver';

export interface BonusTypeCard {
  code:     string;
  name:     string;
  amount:   string;
  members:  number;
  pct:      number;
  gradient: string;
}

export interface BonusPayout {
  id:       string;
  member:   string;
  initials: string;
  avatarBg: string;
  tier:     MemberTier;
  rb:       string | null;
  gb:       string | null;
  sb:       string | null;
  ls:       string | null;
  total:    string;
  status:   BonusStatus;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const bonusTypeCards: BonusTypeCard[] = [
  { code: 'RB', name: 'Sponsor',    amount: '₹142M', members: 487, pct: 74, gradient: 'from-[#0a1f13] to-[#14532d]' },
  { code: 'GB', name: 'Group',      amount: '₹68M',  members: 312, pct: 56, gradient: 'from-[#15803d] to-[#16a34a]' },
  { code: 'SB', name: 'Layer',      amount: '₹54M',  members: 258, pct: 48, gradient: 'from-[#d97706] to-[#f59e0b]' },
  { code: 'LS', name: 'Leadership', amount: '₹32M',  members:  94, pct: 22, gradient: 'from-[#7c3aed] to-[#9333ea]' },
  { code: 'MS', name: 'Rebate',     amount: '₹16M',  members: 601, pct: 88, gradient: 'from-[#0891b2] to-[#0d9488]' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const bonusPayouts: BonusPayout[] = [
  { id: '1', member: 'Kavya Nair',   initials: 'KN', avatarBg: 'bg-cyan-500',     tier: 'Diamond',  rb: '₹4.2M', gb: '₹1.8M', sb: '₹900K', ls: '₹1.2M', total: '₹8.1M', status: 'Approved'   },
  { id: '2', member: 'Arjun Walia',  initials: 'AW', avatarBg: 'bg-amber-500',    tier: 'Platinum', rb: '₹2.6M', gb: '₹1.1M', sb: '₹600K', ls: '₹400K', total: '₹4.7M', status: 'Approved'   },
  { id: '3', member: 'Rohit Verma',  initials: 'RV', avatarBg: 'bg-orange-500',   tier: 'Gold',     rb: '₹1.4M', gb: '₹500K', sb: '₹280K', ls: null,     total: '₹2.2M', status: 'Pending'    },
  { id: '4', member: 'Neha Aiyar',   initials: 'NA', avatarBg: 'bg-teal-500',     tier: 'Gold',     rb: '₹980K', gb: '₹320K', sb: '₹150K', ls: null,     total: '₹1.5M', status: 'Pending'    },
  { id: '5', member: 'Deepika Lal',  initials: 'DL', avatarBg: 'bg-slate-500',    tier: 'Silver',   rb: '₹420K', gb: '₹140K', sb: null,     ls: null,     total: '₹560K', status: 'Processing' },
  { id: '6', member: 'Ravi Pratap',  initials: 'RP', avatarBg: 'bg-gray-500',     tier: 'Silver',   rb: '₹310K', gb: '₹90K',  sb: null,     ls: null,     total: '₹400K', status: 'Approved'   },
];
