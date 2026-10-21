'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { Users, TrendingUp } from 'lucide-react';
import {
  MOCK_LAYER_MEMBERS,
  MOCK_TEAM_STATS,
} from '@/data/mock/network';

type Tab = 'layers' | 'performance';

const TABS: { id: Tab; label: string }[] = [
  { id: 'layers',      label: 'Layer Query'      },
  { id: 'performance', label: 'Team Performance' },
];

// ── Layer Query Tab ───────────────────────────────────────────────────────────

function LayerQueryTab() {
  const [selectedLayer, setSelectedLayer] = useState<number | 'all'>('all');

  const filtered = selectedLayer === 'all'
    ? MOCK_LAYER_MEMBERS
    : MOCK_LAYER_MEMBERS.filter((m) => m.layer === selectedLayer);

  function initials(name: string) {
    return name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
  }

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-center justify-between flex-wrap gap-3">
        <div>
          <p className="text-sm font-semibold text-text">Layer Query</p>
          <p className="text-xs text-text-muted mt-0.5">Browse your network by depth level</p>
        </div>
        <div className="flex gap-2">
          {(['all', 1, 2] as const).map((val) => (
            <button
              key={String(val)}
              onClick={() => setSelectedLayer(val)}
              className={
                selectedLayer === val
                  ? 'bg-primary text-[#0b1410] rounded-full px-3 py-1 text-xs font-semibold'
                  : 'bg-surface border border-border text-text-muted rounded-full px-3 py-1 text-xs hover:border-primary/40 transition-colors'
              }
            >
              {val === 'all' ? 'All' : `Layer ${val}`}
            </button>
          ))}
        </div>
      </div>

      <div className="flex gap-3 flex-wrap">
        {MOCK_TEAM_STATS.layers.map((l) => (
          <div key={l.layer} className="bg-surface border border-border rounded-xl px-4 py-2">
            <p className="text-xs text-text-muted">Layer {l.layer}</p>
            <p className="text-sm font-semibold text-text">{l.count} members · {l.pv} PV</p>
          </div>
        ))}
      </div>

      {/* Desktop table */}
      <div className="hidden md:block bg-surface border border-border rounded-2xl overflow-hidden">
        <div className="grid grid-cols-5 px-4 py-3 border-b border-border bg-primary/5">
          {['Member', 'ID', 'Sponsor', 'Joined', 'PV'].map((h) => (
            <p key={h} className="text-xs font-semibold text-text-muted">{h}</p>
          ))}
        </div>
        {filtered.map((member) => (
          <div
            key={member.id}
            className="grid grid-cols-5 px-4 py-3 border-b border-border/60 last:border-0 hover:bg-primary/5 transition-colors items-center"
          >
            <div className="flex items-center gap-2 min-w-0">
              <div className="w-7 h-7 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">{initials(member.name)}</span>
              </div>
              <div className="min-w-0">
                <p className="text-sm text-text font-medium truncate">{member.name}</p>
                <span className="text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">
                  L{member.layer}
                </span>
              </div>
            </div>
            <p className="text-xs text-text-muted">{member.memberId}</p>
            <p className="text-xs text-text-muted">{member.sponsorName}</p>
            <p className="text-xs text-text-muted">{member.joinDate}</p>
            <p className="text-sm font-semibold text-primary">{member.personalPV} PV</p>
          </div>
        ))}
      </div>

      {/* Mobile cards */}
      <div className="md:hidden flex flex-col gap-2">
        {filtered.map((member) => (
          <div key={member.id} className="bg-surface border border-border rounded-xl p-4 flex flex-col gap-2">
            <div className="flex items-center gap-3">
              <div className="w-8 h-8 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
                <span className="text-[10px] font-bold text-primary">{initials(member.name)}</span>
              </div>
              <div>
                <p className="text-sm font-semibold text-text">{member.name}</p>
                <p className="text-xs text-text-muted">{member.memberId}</p>
              </div>
              <span className="ml-auto text-[10px] bg-primary/10 text-primary px-1.5 py-0.5 rounded-full">L{member.layer}</span>
            </div>
            <div className="flex gap-4 text-xs text-text-muted">
              <span>Sponsor: {member.sponsorName}</span>
              <span>{member.joinDate}</span>
              <span className="text-primary font-semibold ml-auto">{member.personalPV} PV</span>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Team Performance Tab ──────────────────────────────────────────────────────

function PerformanceTab() {
  return (
    <div className="flex flex-col gap-5">
      <div className="grid grid-cols-2 gap-3">
        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
              <Users size={16} className="text-primary" />
            </div>
            <p className="text-xs text-text-muted">Total Members</p>
          </div>
          <p className="text-2xl font-bold text-text">{MOCK_TEAM_STATS.totalMembers}</p>
          <p className="text-xs text-text-muted mt-1">{MOCK_TEAM_STATS.activeThisMonth} active this month</p>
        </div>

        <div className="bg-surface border border-border rounded-2xl p-4">
          <div className="flex items-center gap-2 mb-2">
            <div className="w-8 h-8 bg-primary-soft rounded-xl flex items-center justify-center">
              <TrendingUp size={16} className="text-primary" />
            </div>
            <p className="text-xs text-text-muted">Group PV</p>
          </div>
          <p className="text-2xl font-bold text-text">{MOCK_TEAM_STATS.totalGroupPV} PV</p>
          <p className="text-xs text-text-muted mt-1">{MOCK_TEAM_STATS.newThisMonth} new member this month</p>
        </div>
      </div>

      <div className="bg-surface border border-border rounded-2xl p-5">
        <p className="text-sm font-semibold text-text mb-4">PV by Layer</p>
        {MOCK_TEAM_STATS.layers.map((layer) => (
          <div key={layer.layer} className="flex items-center gap-3 mb-3 last:mb-0">
            <span className="text-xs text-text-muted w-14 shrink-0">Layer {layer.layer}</span>
            <div className="flex-1 bg-primary/10 rounded-full h-2">
              <div
                className="bg-primary rounded-full h-2 transition-all duration-500"
                style={{ width: `${Math.round(layer.pv / MOCK_TEAM_STATS.totalGroupPV * 100)}%` }}
              />
            </div>
            <span className="text-xs font-semibold text-primary w-16 text-right">{layer.pv} PV</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function TeamPage() {
  const [activeTab, setActiveTab] = useState<Tab>('layers');

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">My Team</h1>
        <p className="text-sm text-text-muted mt-0.5">Sponsor tree, layer breakdown, and team stats</p>
      </div>

      {/* Tab bar */}
      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-6">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => setActiveTab(t.id)}
            className={`flex-1 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-primary text-[#0b1410]'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1">
        {activeTab === 'layers'      && <LayerQueryTab />}
        {activeTab === 'performance' && <PerformanceTab />}
      </div>
    </div>
  );
}
