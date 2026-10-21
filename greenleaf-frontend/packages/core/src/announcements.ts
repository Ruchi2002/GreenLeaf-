// MOCK ONLY — BACKEND_REQUIRED_LATER
// This file is shared between admin and portal apps

export type AnnouncementPriority = 'normal' | 'important' | 'urgent';
export type AnnouncementStatus   = 'sent' | 'scheduled' | 'draft';
export type AnnouncementTarget   = 'all' | 'diamond' | 'platinum' | 'gold' | 'silver' | 'bronze';
export type AnnouncementChannel  = 'in-app' | 'email' | 'both';

export interface Announcement {
  id:               string;
  title:            string;
  message:          string;
  priority:         AnnouncementPriority;
  status:           AnnouncementStatus;
  target:           AnnouncementTarget;
  channel:          AnnouncementChannel;
  createdBy:        string;
  createdAt:        string;
  scheduledAt?:     string;
  sentAt?:          string;
  totalRecipients:  number;
  readCount:        number;
}

// MOCK ONLY — BACKEND_REQUIRED_LATER
export const ANNOUNCEMENTS_SEED: Announcement[] = [
  {
    id: 'ANN-001',
    title: 'October Bonus Calculation Complete',
    message: 'Dear members, we are pleased to announce that October 2026 bonus calculation has been completed. All approved bonuses will be credited to your wallet within 24 hours. Thank you for your continued efforts!',
    priority: 'important',
    status: 'sent',
    target: 'all',
    channel: 'both',
    createdBy: 'Amit Kumar',
    createdAt: 'Oct 14, 2026 10:00 AM',
    sentAt: 'Oct 14, 2026 10:05 AM',
    totalRecipients: 1752,
    readCount: 1243,
  },
  {
    id: 'ANN-002',
    title: 'New Product Launch: Greenleaf Premium Kit',
    message: 'Exciting news! We are launching our new Premium Kit next week. Diamond and Platinum members get exclusive early access starting October 20. Stay tuned for more details!',
    priority: 'urgent',
    status: 'scheduled',
    target: 'all',
    channel: 'both',
    createdBy: 'Amit Kumar',
    createdAt: 'Oct 14, 2026 09:00 AM',
    scheduledAt: 'Oct 20, 2026 09:00 AM',
    totalRecipients: 1752,
    readCount: 0,
  },
  {
    id: 'ANN-003',
    title: 'Leadership Bonus Threshold Update',
    message: 'Starting November 2026, the Leadership Bonus threshold PV will be updated from 5000 to 4500 PV. This means more members will qualify for LS bonus. Full details in your dashboard.',
    priority: 'important',
    status: 'sent',
    target: 'gold',
    channel: 'in-app',
    createdBy: 'Priya Admin',
    createdAt: 'Oct 13, 2026 03:00 PM',
    sentAt: 'Oct 13, 2026 03:05 PM',
    totalRecipients: 387,
    readCount: 298,
  },
  {
    id: 'ANN-004',
    title: 'System Maintenance Notice',
    message: 'The platform will undergo scheduled maintenance on Oct 16, 2026 from 2:00 AM to 4:00 AM IST. During this time, the portal will be temporarily unavailable. We apologize for any inconvenience.',
    priority: 'normal',
    status: 'sent',
    target: 'all',
    channel: 'both',
    createdBy: 'Amit Kumar',
    createdAt: 'Oct 12, 2026 11:00 AM',
    sentAt: 'Oct 12, 2026 11:05 AM',
    totalRecipients: 1752,
    readCount: 892,
  },
  {
    id: 'ANN-005',
    title: 'Diamond Exclusive Webinar Invite',
    message: 'Dear Diamond members, you are invited to our exclusive leadership webinar on Oct 25, 2026 at 6:00 PM IST. Topics: Advanced network building, bonus maximization strategies. Register now!',
    priority: 'important',
    status: 'draft',
    target: 'diamond',
    channel: 'both',
    createdBy: 'Priya Admin',
    createdAt: 'Oct 14, 2026 02:00 PM',
    totalRecipients: 48,
    readCount: 0,
  },
];

export const TARGET_LABELS: Record<AnnouncementTarget, string> = {
  all:      'All Members',
  diamond:  'Diamond',
  platinum: 'Platinum',
  gold:     'Gold',
  silver:   'Silver',
  bronze:   'Bronze',
};

export const TARGET_COUNTS: Record<AnnouncementTarget, number> = {
  all:      1752,
  diamond:  48,
  platinum: 124,
  gold:     387,
  silver:   698,
  bronze:   495,
};
