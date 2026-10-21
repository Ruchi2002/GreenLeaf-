'use client';

import dynamic from 'next/dynamic';

const MemberDashboard = dynamic(
  () => import('@/components/dashboard/MemberDashboard').then((m) => ({ default: m.MemberDashboard })),
  {
    loading: () => (
      <div className="flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    ),
  }
);

export default function DashboardPage() {
  return <MemberDashboard />;
}
