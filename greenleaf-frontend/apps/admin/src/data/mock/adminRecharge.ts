// MOCK ONLY — BACKEND_REQUIRED_LATER

export type RechargeStatus = 'pending' | 'approved' | 'rejected';

export interface RechargeRequest {
  id:               string;
  memberId:         string;
  memberName:       string;
  phone:            string;
  tier:             string;
  amount:           number;
  transactionId:    string;
  bank:             string;
  submittedAt:      string;
  screenshot:       string | null;
  status:           RechargeStatus;
  rejectionReason?: string;
}

export const rechargeRequests: RechargeRequest[] = [
  {
    id: 'RCH-001', memberId: 'GL-00124', memberName: 'Rahul Sharma',
    phone: '+91-98201-43567', tier: 'Diamond', amount: 1200000,
    transactionId: 'TXN-HDFC-884421', bank: 'HDFC Bank',
    submittedAt: 'Oct 15, 2026 09:12 AM', screenshot: null, status: 'pending',
  },
  {
    id: 'RCH-002', memberId: 'GL-00198', memberName: 'Priya Patel',
    phone: '+91-82190-98112', tier: 'Gold', amount: 840000,
    transactionId: 'TXN-SBI-221098', bank: 'SBI',
    submittedAt: 'Oct 15, 2026 10:45 AM', screenshot: null, status: 'pending',
  },
  {
    id: 'RCH-003', memberId: 'GL-00410', memberName: 'Neha Singh',
    phone: '+91-87822-33445', tier: 'Platinum', amount: 4800000,
    transactionId: 'TXN-AXIS-774312', bank: 'Axis Bank',
    submittedAt: 'Oct 14, 2026 03:30 PM', screenshot: null, status: 'approved',
  },
  {
    id: 'RCH-004', memberId: 'GL-00501', memberName: 'Vikram Mehta',
    phone: '+91-85611-22334', tier: 'Gold', amount: 750000,
    transactionId: 'TXN-PNB-998812', bank: 'PNB',
    submittedAt: 'Oct 14, 2026 11:20 AM', screenshot: null, status: 'rejected',
    rejectionReason: 'Transaction ID not found in bank records',
  },
  {
    id: 'RCH-005', memberId: 'GL-00672', memberName: 'Kavya Nair',
    phone: '+91-81155-66778', tier: 'Diamond', amount: 2400000,
    transactionId: 'TXN-HDFC-554490', bank: 'HDFC Bank',
    submittedAt: 'Oct 13, 2026 02:15 PM', screenshot: null, status: 'pending',
  },
  {
    id: 'RCH-006', memberId: 'GL-00734', memberName: 'Suresh Verma',
    phone: '+91-99012-34567', tier: 'Silver', amount: 280000,
    transactionId: 'TXN-KOTAK-112233', bank: 'Kotak Bank',
    submittedAt: 'Oct 13, 2026 04:50 PM', screenshot: null, status: 'approved',
  },
];
