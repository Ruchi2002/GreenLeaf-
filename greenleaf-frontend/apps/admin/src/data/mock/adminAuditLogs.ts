// MOCK ONLY — BACKEND_REQUIRED_LATER

export interface AuditLog {
  id: string;
  timestamp: string;
  admin: string;
  action: string;
  target: string;
  category: 'Member' | 'Product' | 'Order' | 'Bonus' | 'Wallet' | 'System' | 'Security';
  ip: string;
  status: 'success' | 'failed';
  userAgent?: string;
  sessionId?: string;
  metadata?: Record<string, unknown>;
}

export const auditLogs: AuditLog[] = [
  {
    id: 'AL001', timestamp: '16 Oct 2026, 10:42 AM', admin: 'Priya Sharma',
    action: 'Approved recharge request', target: 'Member #M1042 – Rahul Verma',
    category: 'Wallet', ip: '192.168.1.101', status: 'success',
    sessionId: 'sess_AL001', userAgent: 'Chrome 120, Windows 11',
    metadata: { amount: 5000, method: 'UPI', refId: 'UPI2026101601' },
  },
  {
    id: 'AL002', timestamp: '16 Oct 2026, 10:38 AM', admin: 'Priya Sharma',
    action: 'Updated product price', target: 'Ashwagandha Premium 500g',
    category: 'Product', ip: '192.168.1.101', status: 'success',
    sessionId: 'sess_AL001', userAgent: 'Chrome 120, Windows 11',
    metadata: { oldPrice: 1200, newPrice: 1350, sku: 'AW-PRE-500' },
  },
  {
    id: 'AL003', timestamp: '16 Oct 2026, 10:21 AM', admin: 'Rohan Mehta',
    action: 'Rejected withdrawal request', target: 'Member #M0887 – Kavya Nair',
    category: 'Wallet', ip: '10.0.0.45', status: 'success',
    sessionId: 'sess_AL003', userAgent: 'Firefox 121, macOS 14',
    metadata: { amount: 8000, reason: 'Incomplete KYC', bank: 'HDFC Bank' },
  },
  {
    id: 'AL004', timestamp: '16 Oct 2026, 09:55 AM', admin: 'Rohan Mehta',
    action: 'Created announcement', target: 'October Bonus Drive',
    category: 'System', ip: '10.0.0.45', status: 'success',
    sessionId: 'sess_AL003', userAgent: 'Firefox 121, macOS 14',
  },
  {
    id: 'AL005', timestamp: '16 Oct 2026, 09:30 AM', admin: 'Anita Joshi',
    action: 'Manually adjusted wallet balance', target: 'Member #M0234 – Suresh Kumar',
    category: 'Wallet', ip: '172.16.0.22', status: 'success',
    sessionId: 'sess_AL005', userAgent: 'Safari 17, iPhone iOS 17',
    metadata: { adjustment: +500, reason: 'Correction for missed referral bonus' },
  },
  {
    id: 'AL006', timestamp: '16 Oct 2026, 09:12 AM', admin: 'Anita Joshi',
    action: 'Login attempt failed', target: 'admin@greenleaf.in',
    category: 'Security', ip: '203.0.113.5', status: 'failed',
    sessionId: 'sess_AL006', userAgent: 'Unknown',
    metadata: { attempts: 3, reason: 'Invalid password' },
  },
  {
    id: 'AL007', timestamp: '16 Oct 2026, 08:59 AM', admin: 'Priya Sharma',
    action: 'Changed bonus configuration', target: 'Referral Bonus – Gold Tier',
    category: 'Bonus', ip: '192.168.1.101', status: 'success',
    sessionId: 'sess_AL001', userAgent: 'Chrome 120, Windows 11',
    metadata: { oldRate: '5%', newRate: '7%', tier: 'Gold' },
  },
  {
    id: 'AL008', timestamp: '15 Oct 2026, 11:44 PM', admin: 'System',
    action: 'Scheduled bonus payout triggered', target: 'All Platinum members',
    category: 'Bonus', ip: '127.0.0.1', status: 'success',
    metadata: { totalPayout: 184000, membersAffected: 34 },
  },
  {
    id: 'AL009', timestamp: '15 Oct 2026, 08:20 PM', admin: 'Rohan Mehta',
    action: 'Deleted product', target: 'Neem Tulsi Soap (Old Batch)',
    category: 'Product', ip: '10.0.0.45', status: 'success',
    sessionId: 'sess_AL003', userAgent: 'Firefox 121, macOS 14',
    metadata: { sku: 'NT-SOAP-OB', reason: 'Discontinued batch' },
  },
  {
    id: 'AL010', timestamp: '15 Oct 2026, 06:15 PM', admin: 'Anita Joshi',
    action: 'Approved KYC document', target: 'Member #M1108 – Deepa Pillai',
    category: 'Member', ip: '172.16.0.22', status: 'success',
    sessionId: 'sess_AL005', userAgent: 'Safari 17, iPhone iOS 17',
    metadata: { docType: 'Aadhaar Card', verified: true },
  },
  {
    id: 'AL011', timestamp: '15 Oct 2026, 04:30 PM', admin: 'Priya Sharma',
    action: 'Reset member password', target: 'Member #M0567 – Vikram Singh',
    category: 'Security', ip: '192.168.1.101', status: 'success',
    sessionId: 'sess_AL001', userAgent: 'Chrome 120, Windows 11',
  },
  {
    id: 'AL012', timestamp: '15 Oct 2026, 02:10 PM', admin: 'Rohan Mehta',
    action: 'Updated registration fee', target: 'Silver Tier –RP2,500',
    category: 'Member', ip: '10.0.0.45', status: 'success',
    sessionId: 'sess_AL003', userAgent: 'Firefox 121, macOS 14',
    metadata: { oldFee: 2000, newFee: 2500, tier: 'Silver' },
  },
  {
    id: 'AL013', timestamp: '15 Oct 2026, 12:00 PM', admin: 'System',
    action: 'Daily report generated', target: 'sales_report_15oct.pdf',
    category: 'System', ip: '127.0.0.1', status: 'success',
    metadata: { fileSize: '142 KB', rows: 487 },
  },
  {
    id: 'AL014', timestamp: '15 Oct 2026, 10:55 AM', admin: 'Anita Joshi',
    action: 'Blocked member account', target: 'Member #M0991 – Ravi Kapoor',
    category: 'Member', ip: '172.16.0.22', status: 'success',
    sessionId: 'sess_AL005', userAgent: 'Safari 17, iPhone iOS 17',
    metadata: { reason: 'Suspicious activity reported', blockedBy: 'Anita Joshi' },
  },
  {
    id: 'AL015', timestamp: '15 Oct 2026, 09:05 AM', admin: 'Priya Sharma',
    action: 'Exported member list', target: 'All active members (CSV)',
    category: 'System', ip: '192.168.1.101', status: 'success',
    sessionId: 'sess_AL001', userAgent: 'Chrome 120, Windows 11',
    metadata: { totalRecords: 1247, format: 'CSV' },
  },
];
