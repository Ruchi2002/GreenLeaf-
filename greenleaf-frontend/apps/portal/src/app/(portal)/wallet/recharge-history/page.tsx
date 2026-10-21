'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import Link from 'next/link';
import { MOCK_RECHARGE_HISTORY } from '@/data/mock/wallet';
import type { RechargeStatus } from '@/data/mock/wallet';

function formatRP(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function StatusBadge({ status }: { status: RechargeStatus }) {
  if (status === 'received') {
    return (
      <span className="text-success bg-success/10 rounded-full px-3 py-1 text-xs font-medium">
        Received
      </span>
    );
  }
  if (status === 'pending') {
    return (
      <div className="flex flex-col items-end gap-1">
        <span className="text-warning bg-warning/10 rounded-full px-3 py-1 text-xs font-medium">
          Pending verification
        </span>
        <span className="text-xs text-primary hover:underline cursor-pointer">
          Contact service center
        </span>
      </div>
    );
  }
  return (
    <span className="text-text-muted bg-border/40 rounded-full px-3 py-1 text-xs font-medium">
      Rejected
    </span>
  );
}

export default function RechargeHistoryPage() {
  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Back link */}
      <Link
        href="/wallet"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-4"
      >
        ← Back to Wallet
      </Link>

      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">My Recharges</h1>
        <p className="text-sm text-text-muted mt-0.5">Track the status of your top-up requests</p>
      </div>

      {/* Recharge list */}
      <div className="flex flex-col gap-2 flex-1">
        {MOCK_RECHARGE_HISTORY.map((rec) => (
          <div
            key={rec.id}
            className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between gap-4"
          >
            <div className="min-w-0">
              <p className="text-base font-bold text-text">{formatRP(rec.amount)}</p>
              <p className="text-xs text-text-muted mt-0.5">
                Ref {rec.ref} · {rec.date}
              </p>
            </div>
            <StatusBadge status={rec.status} />
          </div>
        ))}
      </div>

      {/* New Top-Up CTA */}
      <div className="mt-6 pb-4">
        <Link
          href="/wallet/topup"
          className="block w-full bg-primary text-[#0b1410] text-sm font-semibold rounded-xl py-3 text-center hover:bg-primary/90 transition-colors"
        >
          + New Top-Up
        </Link>
      </div>
    </div>
  );
}
