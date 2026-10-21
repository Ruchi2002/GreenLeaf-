// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface AddressEntry {
  id:            string;
  label:         string;
  isDefault:     boolean;
  recipientName: string;
  phone:         string;
  fullAddress:   string;
}

export const MOCK_ADDRESSES: AddressEntry[] = [
  {
    id: 'A001',
    label: 'Home',
    isDefault: true,
    recipientName: 'Anjali Gupta',
    phone: '+91 98765-43210',
    fullAddress: '12 Linking Road, Bandra West, Mumbai, Maharashtra 400050',
  },
  {
    id: 'A002',
    label: 'Office',
    isDefault: false,
    recipientName: 'Anjali Gupta',
    phone: '+91 98765-43210',
    fullAddress: '45 Nariman Point, Mumbai, Maharashtra 400021',
  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_PROFILE_EXTENDED = {
  fullName:   'Anjali Gupta',
  email:      'anjali.gupta@email.com',
  phone:      '+91 98765-43210',
  sponsor:    'Rahul Sharma (GLF-00042)',
  address:    '12 Linking Road, Bandra West, Mumbai, Maharashtra',
  memberId:   'GLF-00123',
  joinedDate: 'January 2025',
  role:       'Member',
  initials:   'AG',
  bank: {
    bankName:      'HDFC Bank',
    accountNumber: '••••4821',
    accountHolder: 'Anjali Gupta',
  },
  preferences: {
    darkMode:           false,
    language:           'English',
    emailNotifications: true,
    smsNotifications:   false,
    pushNotifications:  true,
  },
};
