// BACKEND_REQUIRED_LATER: align with API /member/profile shape

export interface MemberAddress {
  id:        string;
  label:     string;  // e.g. 'Home', 'Office'
  name:      string;
  phone:     string;
  street:    string;
  city:      string;
  province:  string;
  postal:    string;
  isDefault: boolean;
}

export interface MembeRProfile {
  id:        string;   // member ID, e.g. 'RP97850827'
  name:      string;
  phone:     string;
  cardLevel: 'Bronze' | 'Silver' | 'Gold' | 'Platinum';
  rank:      string;   // e.g. 'Silver'
  addresses: MemberAddress[];
}

export interface ServiceCenter {
  id:       string;
  name:     string;
  street:   string;
  city:     string;
  province: string;
  verified: boolean;
}
