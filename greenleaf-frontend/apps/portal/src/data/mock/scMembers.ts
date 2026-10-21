// MOCK ONLY — BACKEND_REQUIRED_LATER

export type MemberStatus = 'activated' | 'pending' | 'frozen';
export type CardLevel    = 'bronze' | 'silver' | 'gold' | 'platinum';

export interface SCMember {
  id:             string;
  name:           string;
  initials:       string;
  memberId:       string;
  cardLevel:      CardLevel;
  sponsor:        string | null;
  joinDate:       string;
  activatedDate:  string | null;
  status:         MemberStatus;
  // personal details
  phone:          string;
  email:          string;
  gender:         'male' | 'female';
  idCard:         string;
  area:           string;
  state:          string;
  streetAddress:  string;
  // network
  placementCode:  string;
  placementArea:  'left' | 'right' | null;
  totalPV:        number;
  leftPV:         number;
  rightPV:        number;
  ordersPlaced:   number;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_SC_MEMBERS: SCMember[] = [
  {
    id: '1', name: 'Priya Patel',  initials: 'PP', memberId: 'RP47850333',
    cardLevel: 'bronze', sponsor: 'Rohit Hegde', joinDate: 'Sep 22, 2026', activatedDate: null,
    status: 'pending',
    phone: '98765-43210', email: 'priya.patel@gmail.com', gender: 'female',
    idCard: '2406XXXXXXXX0042', area: 'Andheri East', state: 'Maharashtra',
    streetAddress: 'B-12, Suncity Apartments, Andheri East',
    placementCode: 'RP97850827', placementArea: 'left',
    totalPV: 0, leftPV: 0, rightPV: 0, ordersPlaced: 0,
  },
  {
    id: '2', name: 'Suresh Verma', initials: 'SV', memberId: 'RP47850519',
    cardLevel: 'bronze', sponsor: 'Rohit Hegde', joinDate: 'Sep 10, 2026', activatedDate: null,
    status: 'pending',
    phone: '91234-56789', email: 'suresh.verma@yahoo.com', gender: 'male',
    idCard: '0711XXXXXXXX0019', area: 'Bandra West', state: 'Maharashtra',
    streetAddress: '301, Pearl Heights, Bandra West',
    placementCode: 'RP97850827', placementArea: 'right',
    totalPV: 0, leftPV: 0, rightPV: 0, ordersPlaced: 0,
  },
  {
    id: '3', name: 'Kavya Nair',   initials: 'KN', memberId: 'RP47850602',
    cardLevel: 'silver', sponsor: 'Rohit Hegde', joinDate: 'Aug 28, 2026', activatedDate: 'Sep 2, 2026',
    status: 'activated',
    phone: '87654-32109', email: 'kavya.nair@gmail.com', gender: 'female',
    idCard: '3204XXXXXXXX0088', area: 'Thane West', state: 'Maharashtra',
    streetAddress: 'Flat 5, Green Villa, Thane West',
    placementCode: 'RP97850827', placementArea: 'left',
    totalPV: 480, leftPV: 280, rightPV: 200, ordersPlaced: 4,
  },
  {
    id: '4', name: 'Rohit Hegde',  initials: 'RH', memberId: 'RP97850827',
    cardLevel: 'platinum', sponsor: null, joinDate: 'Jan 12, 2025', activatedDate: 'Jan 15, 2025',
    status: 'activated',
    phone: '99999-88888', email: 'rohit.hegde@greenleaf.in', gender: 'male',
    idCard: '2706XXXXXXXX0001', area: 'Mumbai', state: 'Maharashtra',
    streetAddress: '14, Marine Drive, South Mumbai',
    placementCode: '', placementArea: null,
    totalPV: 12400, leftPV: 6800, rightPV: 5600, ordersPlaced: 38,
  },
  {
    id: '5', name: 'Meera Iyer',   initials: 'MI', memberId: 'RP47850111',
    cardLevel: 'gold', sponsor: 'Rohit Hegde', joinDate: 'Jul 15, 2026', activatedDate: 'Jul 18, 2026',
    status: 'frozen',
    phone: '76543-21098', email: 'meera.iyer@outlook.com', gender: 'female',
    idCard: '2909XXXXXXXX0033', area: 'Powai', state: 'Maharashtra',
    streetAddress: 'C-304, Hiranandani Gardens, Powai',
    placementCode: 'RP97850827', placementArea: 'right',
    totalPV: 920, leftPV: 420, rightPV: 500, ordersPlaced: 9,
  },
  {
    id: '6', name: 'Deepak Kumar', initials: 'DK', memberId: 'RP47850744',
    cardLevel: 'bronze', sponsor: 'Kavya Nair', joinDate: 'Oct 5, 2026', activatedDate: 'Oct 8, 2026',
    status: 'activated',
    phone: '83456-78901', email: 'deepak.kumar@gmail.com', gender: 'male',
    idCard: '0612XXXXXXXX0055', area: 'Navi Mumbai', state: 'Maharashtra',
    streetAddress: 'A-201, Nerul Sector 15, Navi Mumbai',
    placementCode: 'RP47850602', placementArea: 'left',
    totalPV: 140, leftPV: 140, rightPV: 0, ordersPlaced: 2,
  },
];
