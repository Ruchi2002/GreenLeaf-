// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface MemberRegistrationForm {
  // Step 1 - Personal
  givenName: string;
  surname: string;
  phone: string;
  idCard: string;
  email: string;
  gender: 'female' | 'male' | '';
  area: string;
  state: string;
  streetAddress: string;
  // Step 2 - Placement
  sponsorCode: string;
  placementCode: string;
  placementArea: 'left' | 'right' | '';
  // Step 3 - Security
  loginPassword: string;
  confirmPassword: string;
  paymentPassword: string;
}

export interface MemberCodeLookup {
  code: string;
  name: string;
  initials: string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_CODE_LOOKUP: Record<string, MemberCodeLookup> = {
  'RP97850827': { code: 'RP97850827', name: 'Rohit Hegde',   initials: 'RH' },
  'RP12345678': { code: 'RP12345678', name: 'Priya Patel',  initials: 'PP' },
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_PLACEMENT_PV: Record<'left' | 'right', number> = {
  left: 0,
  right: 385,
};

export const EMPTY_FORM: MemberRegistrationForm = {
  givenName: '', surname: '', phone: '', idCard: '', email: '',
  gender: '', area: '', state: '', streetAddress: '',
  sponsorCode: '', placementCode: '', placementArea: '',
  loginPassword: '', confirmPassword: '', paymentPassword: '',
};
