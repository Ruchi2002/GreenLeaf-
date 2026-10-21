// MOCK ONLY — BACKEND_REQUIRED_LATER

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const memberStats = [
  { label: 'Total Members',    value: '2,431', trend: '+12%', trendUp: true,  icon: 'Users',     iconBg: 'bg-green-100',  iconColor: 'text-green-600'  },
  { label: 'Active Members',   value: '2,108', trend: '+6%',  trendUp: true,  icon: 'UserCheck', iconBg: 'bg-teal-100',   iconColor: 'text-teal-600'   },
  { label: 'New This Month',   value: '184',   trend: '+24%', trendUp: true,  icon: 'UseRPlus',  iconBg: 'bg-blue-100',   iconColor: 'text-blue-600'   },
  { label: 'KYC Pending',      value: '63',    trend: '-3%',  trendUp: false, icon: 'Clock',     iconBg: 'bg-amber-100',  iconColor: 'text-amber-600'  },
];

// MOCK ONLY — BACKEND_REQUIRED_LATER
export type MemberTier   = 'Diamond' | 'Platinum' | 'Gold' | 'Silver' | 'Bronze';
export type MemberStatus = 'Active' | 'KYC Pending' | 'Inactive';

export interface AdminMember {
  id:        string;
  name:      string;
  initials:  string;
  memberId:  string;
  phone:     string;
  tier:      MemberTier;
  pvCurrent: number;
  pvMax:     number;
  sponsor:   string;
  joined:    string;
  status:    MemberStatus;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const adminMembers: AdminMember[] = [
  { id: '1',  name: 'Rahul Sharma',  initials: 'RS', memberId: 'GL-00124', phone: '+91-98201-43567', tier: 'Diamond',  pvCurrent: 4820, pvMax: 5000, sponsor: 'Amit Kumar',   joined: 'Jan 2023', status: 'Active'      },
  { id: '2',  name: 'Priya Patel',   initials: 'PP', memberId: 'GL-00198', phone: '+91-82190-98112', tier: 'Gold',     pvCurrent: 2100, pvMax: 3000, sponsor: 'Rahul Sharma', joined: 'Mar 2023', status: 'Active'      },
  { id: '3',  name: 'Amit Kumar',    initials: 'AK', memberId: 'GL-00342', phone: '+91-81344-55667', tier: 'Silver',   pvCurrent:  850, pvMax: 1500, sponsor: 'Priya Patel',  joined: 'Jun 2023', status: 'Active'      },
  { id: '4',  name: 'Neha Singh',    initials: 'NS', memberId: 'GL-00410', phone: '+91-87822-33445', tier: 'Platinum', pvCurrent: 6900, pvMax: 8000, sponsor: 'Amit Kumar',   joined: 'Sep 2023', status: 'Active'      },
  { id: '5',  name: 'Vikram Mehta',  initials: 'VM', memberId: 'GL-00501', phone: '+91-85611-22334', tier: 'Gold',     pvCurrent: 1400, pvMax: 3000, sponsor: 'Priya Patel',  joined: 'Nov 2023', status: 'KYC Pending' },
  { id: '6',  name: 'Anjali Gupta',  initials: 'AG', memberId: 'GL-00588', phone: '+91-82277-66554', tier: 'Silver',   pvCurrent:  420, pvMax: 1500, sponsor: 'Rahul Sharma', joined: 'Jan 2024', status: 'Inactive'    },
  { id: '7',  name: 'Kavya Nair',    initials: 'KN', memberId: 'GL-00672', phone: '+91-81155-66778', tier: 'Diamond',  pvCurrent: 5100, pvMax: 5000, sponsor: 'Neha Singh',   joined: 'Apr 2024', status: 'Active'      },
  { id: '8',  name: 'Suresh Verma',  initials: 'SV', memberId: 'GL-00734', phone: '+91-99012-34567', tier: 'Silver',   pvCurrent:  320, pvMax: 1500, sponsor: 'Amit Kumar',   joined: 'May 2024', status: 'Active'      },
  { id: '9',  name: 'Arjun Reddy',   initials: 'AR', memberId: 'GL-00812', phone: '+91-87654-32109', tier: 'Gold',     pvCurrent: 1800, pvMax: 3000, sponsor: 'Kavya Nair',   joined: 'Jul 2024', status: 'Active'      },
  { id: '10', name: 'Rajesh Tiwari', initials: 'RT', memberId: 'GL-00901', phone: '+91-91234-56789', tier: 'Bronze',   pvCurrent:  280, pvMax: 1000, sponsor: 'Vikram Mehta', joined: 'Sep 2024', status: 'KYC Pending' },
];
