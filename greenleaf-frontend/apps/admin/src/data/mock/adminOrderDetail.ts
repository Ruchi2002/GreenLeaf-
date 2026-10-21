// MOCK ONLY — BACKEND_REQUIRED_LATER

export type TimelineStatus = 'completed' | 'active' | 'pending';

export interface TimelineStep {
  label:  string;
  time:   string;
  status: TimelineStatus;
}

export interface OrderDetailData {
  orderId:       string;
  status:        string;
  product:       string;
  sku:           string;
  pv:            number;
  amount:        string;
  subtotal:      string;
  shipping:      string;
  total:         string;
  paymentMethod: string;
  timeline:      TimelineStep[];
  member: {
    name:     string;
    initials: string;
    avatarBg: string;
    tier:     string;
    depth:    number;
    phone:    string;
    email:    string;
  };
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const orderDetails: Record<string, OrderDetailData> = {
  '1': {
    orderId:       '#GL-4821',
    status:        'Completed',
    product:       'Starter Kit Pro',
    sku:           'SKU-SK-1101',
    pv:            120,
    amount:        '₹1,200,000',
    subtotal:      '₹1,160,000',
    shipping:      '₹40,000',
    total:         '₹1,200,000',
    paymentMethod: 'UPI Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 12, 09:00 AM', status: 'completed' },
      { label: 'Processing', time: 'Oct 12, 10:15 AM', status: 'completed' },
      { label: 'Shipped',    time: 'Oct 12, 03:40 PM', status: 'completed' },
      { label: 'Delivered',  time: 'Oct 13, 11:20 AM', status: 'completed' },
    ],
    member: {
      name:     'Priya Sharma',
      initials: 'PS',
      avatarBg: 'bg-puRPle-500',
      tier:     'Diamond',
      depth:    2,
      phone:    '+91-98765-43210',
      email:    'priya.sharma@mail.com',
    },
  },
  '2': {
    orderId:       '#GL-4820',
    status:        'Pending Approval',
    product:       'Wellness Bundle',
    sku:           'SKU-WB-2201',
    pv:            84,
    amount:        '₹840,000',
    subtotal:      '₹800,000',
    shipping:      '₹40,000',
    total:         '₹840,000',
    paymentMethod: 'Bank Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 12, 09:14 AM', status: 'completed' },
      { label: 'Processing', time: 'Oct 12, 10:02 AM', status: 'active'    },
      { label: 'Shipped',    time: 'Pending',           status: 'pending'   },
      { label: 'Delivered',  time: 'Pending',           status: 'pending'   },
    ],
    member: {
      name:     'Rohit Verma',
      initials: 'RV',
      avatarBg: 'bg-orange-500',
      tier:     'Gold',
      depth:    4,
      phone:    '+91-82199-88112',
      email:    'rohit.v@mail.com',
    },
  },
  '3': {
    orderId:       '#GL-4819',
    status:        'Processing',
    product:       'Skincare Set',
    sku:           'SKU-SS-3301',
    pv:            42,
    amount:        '₹420,000',
    subtotal:      '₹380,000',
    shipping:      '₹40,000',
    total:         '₹420,000',
    paymentMethod: 'NEFT Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 11, 02:30 PM', status: 'completed' },
      { label: 'Processing', time: 'Oct 11, 03:45 PM', status: 'active'    },
      { label: 'Shipped',    time: 'Pending',           status: 'pending'   },
      { label: 'Delivered',  time: 'Pending',           status: 'pending'   },
    ],
    member: {
      name:     'Deepika Lal',
      initials: 'DL',
      avatarBg: 'bg-slate-500',
      tier:     'Silver',
      depth:    5,
      phone:    '+91-90112-33445',
      email:    'deepika.lal@mail.com',
    },
  },
  '4': {
    orderId:       '#GL-4818',
    status:        'Pending Approval',
    product:       'Starter Kit',
    sku:           'SKU-SK-1100',
    pv:            28,
    amount:        '₹280,000',
    subtotal:      '₹240,000',
    shipping:      '₹40,000',
    total:         '₹280,000',
    paymentMethod: 'Bank Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 11, 11:05 AM', status: 'completed' },
      { label: 'Processing', time: 'Pending',           status: 'pending'   },
      { label: 'Shipped',    time: 'Pending',           status: 'pending'   },
      { label: 'Delivered',  time: 'Pending',           status: 'pending'   },
    ],
    member: {
      name:     'Arjun Walia',
      initials: 'AW',
      avatarBg: 'bg-amber-500',
      tier:     'Bronze',
      depth:    6,
      phone:    '+91-77001-55223',
      email:    'arjun.walia@mail.com',
    },
  },
  '5': {
    orderId:       '#GL-4817',
    status:        'Cancelled',
    product:       'Wellness Bundle',
    sku:           'SKU-WB-2201',
    pv:            84,
    amount:        '₹840,000',
    subtotal:      '₹800,000',
    shipping:      '₹40,000',
    total:         '₹840,000',
    paymentMethod: 'UPI Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 10, 04:18 PM', status: 'completed' },
      { label: 'Processing', time: 'Oct 10, 05:00 PM', status: 'completed' },
      { label: 'Cancelled',  time: 'Oct 10, 06:30 PM', status: 'active'    },
      { label: 'Delivered',  time: 'N/A',              status: 'pending'   },
    ],
    member: {
      name:     'Neha Aiyar',
      initials: 'NA',
      avatarBg: 'bg-teal-500',
      tier:     'Platinum',
      depth:    3,
      phone:    '+91-91234-67890',
      email:    'neha.aiyar@mail.com',
    },
  },
  '6': {
    orderId:       '#GL-4816',
    status:        'Completed',
    product:       'Skincare Set',
    sku:           'SKU-SS-3301',
    pv:            42,
    amount:        '₹420,000',
    subtotal:      '₹380,000',
    shipping:      '₹40,000',
    total:         '₹420,000',
    paymentMethod: 'NEFT Transfer',
    timeline: [
      { label: 'Placed',     time: 'Oct 9, 10:00 AM',  status: 'completed' },
      { label: 'Processing', time: 'Oct 9, 11:30 AM',  status: 'completed' },
      { label: 'Shipped',    time: 'Oct 9, 04:00 PM',  status: 'completed' },
      { label: 'Delivered',  time: 'Oct 10, 02:15 PM', status: 'completed' },
    ],
    member: {
      name:     'Ravi Pratap',
      initials: 'RP',
      avatarBg: 'bg-gray-500',
      tier:     'Gold',
      depth:    3,
      phone:    '+91-85566-77889',
      email:    'ravi.pratap@mail.com',
    },
  },
};
