// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface TreeMember {
  id:               string;
  name:             string;
  memberId:         string;
  tier:             'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
  sponsor:          string;
  placement:        string;
  registeredMonth:  string;
  leftPV:           number;
  rightPV:          number;
  left?:            TreeMember;
  right?:           TreeMember;
}

export const myTree: TreeMember = {
  id: 'M001', name: 'Arjun Sharma', memberId: 'GL8842017',
  tier: 'Gold', sponsor: 'Priya Patel', placement: 'Priya Patel',
  registeredMonth: 'Jan 2025', leftPV: 120, rightPV: 385,
  left: {
    id: 'M002', name: 'Ravi Kumar', memberId: 'GL7731204',
    tier: 'Silver', sponsor: 'Arjun Sharma', placement: 'Arjun Sharma',
    registeredMonth: 'Feb 2025', leftPV: 0, rightPV: 0,
    left: {
      id: 'M005', name: 'Sunita Devi', memberId: 'GL6620891',
      tier: 'Bronze', sponsor: 'Ravi Kumar', placement: 'Ravi Kumar',
      registeredMonth: 'Mar 2025', leftPV: 0, rightPV: 0,
    },
    right: {
      id: 'M006', name: 'Mohan Lal', memberId: 'GL6619042',
      tier: 'Bronze', sponsor: 'Ravi Kumar', placement: 'Ravi Kumar',
      registeredMonth: 'Mar 2025', leftPV: 0, rightPV: 0,
    },
  },
  right: {
    id: 'M003', name: 'Neha Singh', memberId: 'GL7730156',
    tier: 'Silver', sponsor: 'Arjun Sharma', placement: 'Arjun Sharma',
    registeredMonth: 'Feb 2025', leftPV: 120, rightPV: 140,
    left: {
      id: 'M007', name: 'Kavya Nair', memberId: 'GL5510234',
      tier: 'Bronze', sponsor: 'Neha Singh', placement: 'Neha Singh',
      registeredMonth: 'Apr 2025', leftPV: 0, rightPV: 0,
    },
    right: {
      id: 'M008', name: 'Deepak Verma', memberId: 'GL5509871',
      tier: 'Bronze', sponsor: 'Neha Singh', placement: 'Neha Singh',
      registeredMonth: 'Apr 2025', leftPV: 0, rightPV: 0,
    },
  },
};

export interface AvailableMember {
  id:       string;
  name:     string;
  initials: string;
  memberId: string;
  city:     string;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const AVAILABLE_MEMBERS: AvailableMember[] = [
  { id: 'GL-1006', name: 'Rohit Verma',    initials: 'RV', memberId: 'GL-1006', city: 'Mumbai'     },
  { id: 'GL-1007', name: 'Deepika Lal',    initials: 'DL', memberId: 'GL-1007', city: 'Delhi'      },
  { id: 'GL-1008', name: 'Arjun Walia',    initials: 'AW', memberId: 'GL-1008', city: 'Bangalore'  },
  { id: 'GL-1009', name: 'Ravi Pratap',    initials: 'RP', memberId: 'GL-1009', city: 'Chennai'    },
  { id: 'GL-1010', name: 'Sunita Rao',     initials: 'SR', memberId: 'GL-1010', city: 'Hyderabad'  },
  { id: 'GL-1011', name: 'Vikram Desai',   initials: 'VD', memberId: 'GL-1011', city: 'Pune'       },
  { id: 'GL-1012', name: 'Meera Joshi',    initials: 'MJ', memberId: 'GL-1012', city: 'Jaipur'     },
  { id: 'GL-1013', name: 'Karan Malhotra', initials: 'KM', memberId: 'GL-1013', city: 'Kolkata'    },
  { id: 'GL-1014', name: 'Pooja Iyer',     initials: 'PI', memberId: 'GL-1014', city: 'Kochi'      },
  { id: 'GL-1015', name: 'Sandeep Gupta',  initials: 'SG', memberId: 'GL-1015', city: 'Lucknow'    },
  { id: 'GL-1016', name: 'Anjali Sharma',  initials: 'AS', memberId: 'GL-1016', city: 'Bhopal'     },
  { id: 'GL-1017', name: 'Nikhil Reddy',   initials: 'NR', memberId: 'GL-1017', city: 'Visakhapatnam' },
  { id: 'GL-1018', name: 'Divya Menon',    initials: 'DM', memberId: 'GL-1018', city: 'Thiruvananthapuram' },
  { id: 'GL-1019', name: 'Rajesh Pandey',  initials: 'RP', memberId: 'GL-1019', city: 'Varanasi'   },
  { id: 'GL-1020', name: 'Swati Kulkarni', initials: 'SK', memberId: 'GL-1020', city: 'Nagpur'     },
  { id: 'GL-1021', name: 'Aakash Tiwari',  initials: 'AT', memberId: 'GL-1021', city: 'Patna'      },
  { id: 'GL-1022', name: 'Pallavi Nair',   initials: 'PN', memberId: 'GL-1022', city: 'Coimbatore' },
  { id: 'GL-1023', name: 'Harsh Vardhan',  initials: 'HV', memberId: 'GL-1023', city: 'Chandigarh' },
  { id: 'GL-1024', name: 'Rekha Pillai',   initials: 'RP', memberId: 'GL-1024', city: 'Surat'      },
  { id: 'GL-1025', name: 'Mohit Saxena',   initials: 'MS', memberId: 'GL-1025', city: 'Agra'       },
];
