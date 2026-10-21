'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import Link from 'next/link';
import { ArrowLeft, X } from 'lucide-react';
import {
  MOCK_BONUS_RECORDS,
  MOCK_BONUS_WEEKLY,
  MOCK_BONUS_MONTHLY,
} from '@/data/mock/wallet';
import type { BonusRecord } from '@/data/mock/wallet';

type Tab = 'daily' | 'monthly';

function formatRP(n: number): string {
  return 'RP ' + n.toLocaleString('id-ID');
}

// ── Bar Chart ─────────────────────────────────────────────────────────────────

function BonusChart({ tab }: { tab: Tab }) {
  const data = tab === 'daily' ? MOCK_BONUS_WEEKLY : MOCK_BONUS_MONTHLY;

  return (
    <div className="bg-surface border border-border rounded-2xl p-5 mb-4">
      <p className="text-sm font-semibold text-text mb-4">Bonus over time</p>

      <div className="flex items-end gap-3 h-48 px-2">
        {data.map((item) => {
          const pct = Math.round((item.actual / item.target) * 100);
          return (
            <div key={item.label} className="flex flex-col items-center gap-1.5 flex-1">
              {/* Bar track */}
              <div className="relative w-full h-40 rounded-t-lg bg-primary/15 overflow-hidden">
                <div
                  className="absolute bottom-0 left-0 right-0 bg-primary rounded-t-lg transition-all duration-500"
                  style={{ height: `${pct}%` }}
                />
              </div>
              <span className="text-xs text-text-muted">{item.label}</span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ record, onClose }: { record: BonusRecord; onClose: () => void }) {
  return (
    <>
      {/* Overlay */}
      <div
        className="fixed inset-0 bg-black/40 z-40"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="fixed top-0 right-0 h-full w-80 bg-background z-50 shadow-2xl border-l border-border flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <span className="text-base font-semibold text-text">{record.date}</span>
          <button
            onClick={onClose}
            className="text-text-muted hover:text-text transition-colors"
            aria-label="Close"
          >
            <X size={20} />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4">
          {record.lineItems.map((item, i) => (
            <div
              key={i}
              className="flex items-center justify-between py-3 border-b border-border/60 last:border-b-0"
            >
              <span className="text-sm text-text-muted">{item.label}</span>
              <span className="text-sm text-text font-medium">
                {item.isDeduction && item.amount === 0 ? '− RP 0' : formatRP(item.amount)}
              </span>
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="px-6 py-5 border-t border-border">
          <div className="flex items-center justify-between">
            <span className="text-sm font-bold text-text">Actual received</span>
            <span className="text-sm font-bold text-primary">{formatRP(record.actualReceived)}</span>
          </div>
        </div>
      </div>
    </>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

export default function BonusRecordPage() {
  const [activeTab,       setActiveTab]       = useState<Tab>('daily');
  const [selectedRecord,  setSelectedRecord]  = useState<BonusRecord | null>(null);

  return (
    <>
      <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
        {/* Back link */}
        <Link
          href="/wallet"
          className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-3"
        >
          <ArrowLeft size={16} />
          Back to Wallet
        </Link>

        {/* Header */}
        <div className="mb-5">
          <h1 className="text-2xl font-bold text-text">Bonus Record</h1>
          <p className="text-sm text-text-muted mt-1">See how your bonuses add up over time</p>
        </div>

        {/* Daily / Monthly toggle */}
        <div className="flex gap-2 mb-6">
          {(['daily', 'monthly'] as const).map((t) => (
            <button
              key={t}
              onClick={() => setActiveTab(t)}
              className={
                activeTab === t
                  ? 'bg-primary text-[#0b1410] rounded-full px-5 py-1.5 text-sm font-semibold'
                  : 'bg-surface border border-border text-text-muted rounded-full px-5 py-1.5 text-sm hover:border-primary/40 transition-colors'
              }
            >
              {t === 'daily' ? 'Daily' : 'Monthly'}
            </button>
          ))}
        </div>

        {/* Bar chart */}
        <BonusChart tab={activeTab} />

        {/* Bonus list */}
        <div className="flex flex-col gap-2 flex-1">
          {MOCK_BONUS_RECORDS.map((rec) => (
            <div
              key={rec.id}
              onClick={() => setSelectedRecord(rec)}
              className="bg-surface border border-border rounded-xl px-4 py-3 flex items-center justify-between cursor-pointer hover:border-primary/40 transition-colors"
            >
              <div className="min-w-0">
                <p className="text-sm font-semibold text-text">{rec.date}</p>
                <p className="text-xs text-primary mt-0.5 truncate">{rec.types.join(' · ')}</p>
              </div>
              <div className="text-right shrink-0 ml-4">
                <p className="text-sm font-bold text-primary">{formatRP(rec.actualReceived)}</p>
                <p className="text-xs text-text-muted mt-0.5">Actual received</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Detail drawer */}
      {selectedRecord && (
        <DetailDrawer
          record={selectedRecord}
          onClose={() => setSelectedRecord(null)}
        />
      )}
    </>
  );
}
