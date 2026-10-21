// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface BonusConfig {
  sponsorBonus:     { percentage: number; maxUplineDepth: number };
  groupBonus:       { percentage: number };
  layerBonus:       { percentage: number; tierCondition: string };
  leadershipBonus:  { thresholdPV: number; fixedAmount: number };
  selfRebate:       { percentage: number };
  pvConfiguration:  { rupeesPeRPV: number };
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const DEFAULT_BONUS_CONFIG: BonusConfig = {
  sponsorBonus:    { percentage: 10, maxUplineDepth: 1 },
  groupBonus:      { percentage: 6 },
  layerBonus:      { percentage: 4, tierCondition: 'Gold and above' },
  leadershipBonus: { thresholdPV: 5000, fixedAmount: 500000 },
  selfRebate:      { percentage: 3 },
  pvConfiguration: { rupeesPeRPV: 10000 },
};

export const TIER_CONDITIONS = [
  'Gold and above',
  'Platinum and above',
  'Diamond only',
  'All tiers',
] as const;

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const DEFAULT_GENERAL = {
  companyName:   'Greenleaf India Pvt. Ltd.',
  websiteUrl:    'https://greenleaf.in',
  contactEmail:  'admin@greenleaf.in',
  contactPhone:  '+91-98765-43210',
  language:      'English',
  timezone:      'IST - UTC+5:30',
  dateFormat:    'DD/MM/YYYY',
  brandColor:    '#22c55e',
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const DEFAULT_REGISTRATION = {
  registrationFee:     1200000,
  minimumAge:          18,
  referralCodeFormat:  'GL-XXXX',
  autoApprove:         false,
  docs: {
    aadhaar:     true,
    pan:         true,
    bankAccount: true,
    photoId:     false,
    addressProof: false,
  },
  welcomeSubject: 'Welcome to Greenleaf!',
  welcomeMessage: '',
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const DEFAULT_SECURITY = {
  twoFA:             false,
  sessionTimeout:    '30 min',
  maxLoginAttempts:  5,
  minPasswordLength: 8,
  requireSpecial:    true,
  requireNumbers:    true,
  requireUppercase:  true,
  passwordExpiry:    'Never',
  ipWhitelist:       '',
  logRetention:      '90 days',
};

export const LAST_SAVED = 'Oct 12, 2026 at 4:32 PM';
