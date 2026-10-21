'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useEffect, useState } from 'react';
import { useParams, useRouter } from 'next/navigation';
import { ArrowLeft } from 'lucide-react';
import { cn } from '@/lib/utils';
import { MOCK_SC_MEMBERS } from '@/data/mock/scMembers';
import type { SCMember } from '@/data/mock/scMembers';

function cardBadgeClass(level: SCMember['cardLevel']): string {
  switch (level) {
    case 'bronze':   return 'bg-gray-100 text-gray-600 border border-gray-200';
    case 'silver':   return 'bg-blue-50 text-blue-600 border border-blue-200';
    case 'gold':     return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'platinum': return 'bg-purple-50 text-purple-700 border border-purple-200';
    default:         return 'bg-border text-text-muted';
  }
}

function statusBadgeClass(status: SCMember['status']): string {
  switch (status) {
    case 'pending':   return 'bg-amber-50 text-amber-700 border border-amber-200';
    case 'activated': return 'bg-primary-soft text-primary border border-primary/20';
    case 'frozen':    return 'bg-blue-50 text-blue-600 border border-blue-200';
    default:          return 'bg-border text-text-muted';
  }
}

function InfoRow({ label, value }: { label: string; value: string | null }) {
  return (
    <div className="flex flex-col sm:flex-row sm:items-center gap-0.5 sm:gap-4 py-3 border-b border-border/60 last:border-0">
      <span className="text-xs text-text-muted sm:w-44 shrink-0">{label}</span>
      <span className="text-sm text-text font-medium">{value || '—'}</span>
    </div>
  );
}

export default function MemberDetailPage() {
  const { id }   = useParams<{ id: string }>();
  const router   = useRouter();
  const [member, setMember] = useState<SCMember | null | undefined>(undefined);

  useEffect(() => {
    // MOCK ONLY — BACKEND_REQUIRED_LATER
    const found = MOCK_SC_MEMBERS.find((m) => m.id === id) ?? null;
    setMember(found);
  }, [id]);

  if (member === undefined) {
    return (
      <div className="pt-14 flex items-center justify-center h-64">
        <div className="w-8 h-8 border-2 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (member === null) {
    return (
      <div className="pt-14 text-center py-20 text-text-muted text-sm">
        Member not found.
      </div>
    );
  }

  return (
    <div className="pt-14 w-full">
      {/* Back button */}
      <button
        onClick={() => router.back()}
        className="flex items-center gap-2 text-sm text-text-muted hover:text-text transition-colors mb-6"
      >
        <ArrowLeft size={16} />
        Back to member list
      </button>

      {/* Header card */}
      <div className="bg-surface border border-border rounded-2xl p-6 mb-5 flex flex-col sm:flex-row items-start sm:items-center gap-4">
        {/* Avatar */}
        <div className="w-16 h-16 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
          <span className="text-xl font-bold text-primary">{member.initials}</span>
        </div>

        {/* Name + badges */}
        <div className="flex-1 min-w-0">
          <h1 className="text-xl font-bold text-text">{member.name}</h1>
          <p className="text-sm text-text-muted mt-0.5">{member.memberId}</p>
          <div className="flex items-center gap-2 mt-2 flex-wrap">
            <span className={cn('rounded-full px-3 py-0.5 text-xs font-medium capitalize border', cardBadgeClass(member.cardLevel))}>
              {member.cardLevel.charAt(0).toUpperCase() + member.cardLevel.slice(1)}
            </span>
            <span className={cn('rounded-full px-3 py-0.5 text-xs capitalize border', statusBadgeClass(member.status))}>
              {member.status.charAt(0).toUpperCase() + member.status.slice(1)}
            </span>
          </div>
        </div>

        {/* Quick stats */}
        <div className="grid grid-cols-3 gap-4 sm:gap-6 text-center shrink-0">
          <div>
            <p className="text-lg font-bold text-text">{member.totalPV.toLocaleString('en-IN')}</p>
            <p className="text-xs text-text-muted mt-0.5">Total PV</p>
          </div>
          <div>
            <p className="text-lg font-bold text-text">{member.ordersPlaced}</p>
            <p className="text-xs text-text-muted mt-0.5">Orders</p>
          </div>
          <div>
            <p className="text-lg font-bold text-text capitalize">{member.cardLevel}</p>
            <p className="text-xs text-text-muted mt-0.5">Card</p>
          </div>
        </div>
      </div>

      {/* Details grid */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-5">

        {/* Personal Info */}
        <div className="bg-surface border border-border rounded-2xl p-6">
          <h2 className="text-sm font-semibold text-text mb-3">Personal Information</h2>
          <InfoRow label="Full Name"      value={`${member.name}`} />
          <InfoRow label="Gender"         value={member.gender.charAt(0).toUpperCase() + member.gender.slice(1)} />
          <InfoRow label="Phone"          value={member.phone} />
          <InfoRow label="Email"          value={member.email} />
          <InfoRow label="ID Card / Passport" value={member.idCard} />
          <InfoRow label="Street Address" value={member.streetAddress} />
          <InfoRow label="Area"           value={member.area} />
          <InfoRow label="State"          value={member.state} />
        </div>

        {/* Registration & Network */}
        <div className="flex flex-col gap-5">
          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text mb-3">Registration Details</h2>
            <InfoRow label="Member ID"       value={member.memberId} />
            <InfoRow label="Registered On"   value={member.joinDate} />
            <InfoRow label="Activated On"    value={member.activatedDate} />
            <InfoRow label="Account Status"  value={member.status.charAt(0).toUpperCase() + member.status.slice(1)} />
            <InfoRow label="Card Level"      value={member.cardLevel.charAt(0).toUpperCase() + member.cardLevel.slice(1)} />
          </div>

          <div className="bg-surface border border-border rounded-2xl p-6">
            <h2 className="text-sm font-semibold text-text mb-3">Network Placement</h2>
            <InfoRow label="Sponsor"          value={member.sponsor} />
            <InfoRow label="Placement Code"   value={member.placementCode || null} />
            <InfoRow label="Placement Area"   value={member.placementArea ? (member.placementArea.charAt(0).toUpperCase() + member.placementArea.slice(1) + ' Area') : null} />
            <InfoRow label="Total PV"         value={member.totalPV.toLocaleString('en-IN')} />
            <InfoRow label="Left PV"          value={member.leftPV.toLocaleString('en-IN')} />
            <InfoRow label="Right PV"         value={member.rightPV.toLocaleString('en-IN')} />
            <InfoRow label="Orders Placed"    value={String(member.ordersPlaced)} />
          </div>
        </div>
      </div>
    </div>
  );
}
