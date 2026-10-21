// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface BinaryNode {
  id:            string;
  name:          string;
  initials:      string;
  memberId:      string;
  leftPV:        number;
  rightPV:       number;
  left:          BinaryNode | null;
  right:         BinaryNode | null;
  isCurrentUser?: boolean;
  rank?:         'bronze' | 'silver' | 'gold' | 'platinum';
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_BINARY_TREE: BinaryNode = {
  id: '1', name: 'Rohit Hegde', initials: 'RH', memberId: 'RP97850827',
  leftPV: 0, rightPV: 385, isCurrentUser: true, rank: 'platinum',
  left: {
    id: '2', name: 'Vikram Mehta', initials: 'VM', memberId: 'RP85299316',
    leftPV: 0, rightPV: 0, rank: 'bronze',
    left: null, right: null,
  },
  right: {
    id: '3', name: 'Amit Kumar', initials: 'AK', memberId: 'RP76379988',
    leftPV: 120, rightPV: 140, rank: 'silver',
    left: {
      id: '4', name: 'Arjun Reddy', initials: 'AR', memberId: 'RP19978798',
      leftPV: 0, rightPV: 0, rank: 'gold',
      left: null, right: null,
    },
    right: {
      id: '5', name: 'Priya Patel', initials: 'PP', memberId: 'RP47850333',
      leftPV: 0, rightPV: 0, rank: 'bronze',
      left: null, right: null,
    },
  },
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface SponsorNode {
  id:         string;
  initials:   string;
  name:       string;
  memberId:   string;
  joinDate:   string;
  personalPV: number;
  children:   SponsorNode[];
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_SPONSOR_TREE: SponsorNode = {
  id: 'root', initials: 'RH', name: 'Rohit Hegde', memberId: 'RP97850827',
  joinDate: 'Jan 2024', personalPV: 125,
  children: [
    {
      id: 'n1', initials: 'VM', name: 'Vikram Mehta', memberId: 'RP85299316',
      joinDate: 'Mar 2024', personalPV: 80,
      children: [
        {
          id: 'n1a', initials: 'NS', name: 'Neha Singh', memberId: 'RP72341100',
          joinDate: 'Jun 2024', personalPV: 45, children: [],
        },
      ],
    },
    {
      id: 'n2', initials: 'AK', name: 'Amit Kumar', memberId: 'RP76379988',
      joinDate: 'Apr 2024', personalPV: 95,
      children: [
        {
          id: 'n2a', initials: 'AR', name: 'Arjun Reddy', memberId: 'RP19978798',
          joinDate: 'Jul 2024', personalPV: 60, children: [],
        },
        {
          id: 'n2b', initials: 'PP', name: 'Priya Patel', memberId: 'RP47850333',
          joinDate: 'Sep 2024', personalPV: 275, children: [],
        },
      ],
    },
    {
      id: 'n3', initials: 'RS', name: 'Rahul Sharma', memberId: 'RP33210045',
      joinDate: 'May 2024', personalPV: 110, children: [],
    },
  ],
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface LayerMember {
  id:          string;
  name:        string;
  memberId:    string;
  joinDate:    string;
  personalPV:  number;
  layer:       number;
  sponsorName: string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_LAYER_MEMBERS: LayerMember[] = [
  { id: 'L1-1', name: 'Vikram Mehta',  memberId: 'RP85299316', joinDate: 'Mar 2024', personalPV: 80,  layer: 1, sponsorName: 'Rohit Hegde'   },
  { id: 'L1-2', name: 'Amit Kumar',    memberId: 'RP76379988', joinDate: 'Apr 2024', personalPV: 95,  layer: 1, sponsorName: 'Rohit Hegde'   },
  { id: 'L1-3', name: 'Rahul Sharma',  memberId: 'RP33210045', joinDate: 'May 2024', personalPV: 110, layer: 1, sponsorName: 'Rohit Hegde'   },
  { id: 'L2-1', name: 'Neha Singh',    memberId: 'RP72341100', joinDate: 'Jun 2024', personalPV: 45,  layer: 2, sponsorName: 'Vikram Mehta' },
  { id: 'L2-2', name: 'Arjun Reddy',   memberId: 'RP19978798', joinDate: 'Jul 2024', personalPV: 60,  layer: 2, sponsorName: 'Amit Kumar'   },
  { id: 'L2-3', name: 'Priya Patel',   memberId: 'RP47850333', joinDate: 'Sep 2024', personalPV: 275, layer: 2, sponsorName: 'Amit Kumar'   },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_TEAM_STATS = {
  totalMembers:    6,
  activeThisMonth: 4,
  totalGroupPV:    890,
  newThisMonth:    1,
  layers: [
    { layer: 1, count: 3, pv: 285 },
    { layer: 2, count: 3, pv: 380 },
  ],
};

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface PVHistoryEntry {
  id:          string;
  date:        string;
  description: string;
  leftDelta:   number;
  rightDelta:  number;
}

export const MOCK_PV_HISTORY_ENTRIES: PVHistoryEntry[] = [
  { id: 'PV001', date: 'Sep 24, 2026', description: 'Amit Kumar new purchase',     leftDelta:  0, rightDelta:  85 },
  { id: 'PV002', date: 'Sep 20, 2026', description: 'Arjun Reddy new purchase',    leftDelta:  0, rightDelta:  60 },
  { id: 'PV003', date: 'Sep 15, 2026', description: 'Priya Patel new purchase',    leftDelta:  0, rightDelta:  40 },
  { id: 'PV004', date: 'Sep 10, 2026', description: 'Amit Kumar repeat purchase',  leftDelta:  0, rightDelta:  80 },
  { id: 'PV005', date: 'Sep 05, 2026', description: 'Arjun Reddy repeat purchase', leftDelta:  0, rightDelta:  60 },
  { id: 'PV006', date: 'Aug 28, 2026', description: 'Amit Kumar new purchase',     leftDelta:  0, rightDelta:  40 },
  { id: 'PV007', date: 'Aug 20, 2026', description: 'Vikram Mehta new purchase',   leftDelta: 20, rightDelta:   0 },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type MemberLevel = 'Platinum' | 'Gold' | 'Silver' | 'Bronze';

export interface TeamMember {
  id:        string;
  layer:     number;
  name:      string;
  memberId:  string;
  level:     MemberLevel;
  repeatPV:  number;
  newPV:     number;
}

export const MOCK_TEAM_MEMBERS: TeamMember[] = [
  { id: 'TM0', layer: 0, name: 'Rohit Hegde',   memberId: 'RP97850827', level: 'Platinum', repeatPV: 385, newPV: 154 },
  { id: 'TM1', layer: 1, name: 'Vikram Mehta', memberId: 'RP85299316', level: 'Bronze',   repeatPV: 0,   newPV: 0   },
  { id: 'TM2', layer: 1, name: 'Amit Kumar',   memberId: 'RP76379988', level: 'Silver',   repeatPV: 260, newPV: 104 },
  { id: 'TM3', layer: 2, name: 'Arjun Reddy',  memberId: 'RP19978798', level: 'Bronze',   repeatPV: 0,   newPV: 0   },
  { id: 'TM4', layer: 2, name: 'Priya Patel',  memberId: 'RP47850333', level: 'Bronze',   repeatPV: 0,   newPV: 0   },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface BonusSummaryItem {
  label:  string;
  amount: number;
}

export const MOCK_BONUS_SUMMARY: BonusSummaryItem[] = [
  { label: 'Sponsor Bonus',           amount: 150000 },
  { label: 'Group Bonus',             amount: 0      },
  { label: 'Layer Bonus',             amount: 45000  },
  { label: 'Leadership Bonus',        amount: 0      },
  { label: 'Leadership Award 3%',     amount: 0      },
  { label: 'Unilever Bonus',          amount: 0      },
  { label: 'Service Network 25%',     amount: 0      },
  { label: 'Self Repeat Rebate 10%',  amount: 12500  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export interface OpenPosition {
  id:             string;
  label:          string;
  parentMemberId: string;
  side:           'Left' | 'Right';
}

export const MOCK_OPEN_POSITIONS: OpenPosition[] = [
  { id: 'OP1', label: 'Layer 2 · Left of Vikram Mehta',  parentMemberId: 'RP85299316', side: 'Left'  },
  { id: 'OP2', label: 'Layer 2 · Right of Vikram Mehta', parentMemberId: 'RP85299316', side: 'Right' },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const MOCK_PV_MONTHLY = [
  { month: 'Apr', leftPV:   0, rightPV:  85 },
  { month: 'May', leftPV:   0, rightPV: 120 },
  { month: 'Jun', leftPV:  20, rightPV: 140 },
  { month: 'Jul', leftPV:   0, rightPV: 200 },
  { month: 'Aug', leftPV:  20, rightPV:  40 },
  { month: 'Sep', leftPV:   0, rightPV: 325 },
];
