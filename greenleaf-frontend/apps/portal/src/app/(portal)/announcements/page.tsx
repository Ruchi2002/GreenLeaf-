'use client';

import { useState } from 'react';
import { Bell } from 'lucide-react';
import {
  ANNOUNCEMENTS_SEED, TARGET_LABELS,
  type Announcement, type AnnouncementPriority,
} from '@/data/mock/announcements';

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...cls: (string | false | undefined)[]) { return cls.filter(Boolean).join(' '); }

// ── Style maps (using design tokens) ─────────────────────────────────────────

// Left border bar uses inline style so the color is dynamic
const PRIORITY_BAR_COLOR: Record<AnnouncementPriority, string> = {
  urgent:    '#ef4444',
  important: '#f59e0b',
  normal:    'hsl(var(--primary))',
};

// Badge uses Tailwind — opacity-based so it works on any surface color
const PRIORITY_BADGE: Record<AnnouncementPriority, string> = {
  urgent:    'bg-danger/10 text-danger border border-danger/25',
  important: 'bg-warning/10 text-warning border border-warning/25',
  normal:    'bg-primary/10 text-primary border border-primary/25',
};

// Sent announcements only
const SENT = ANNOUNCEMENTS_SEED.filter((a) => a.status === 'sent').reverse();

type PriorityFilter = 'All' | 'Important' | 'Urgent' | 'Normal';

// ── Announcement Card ─────────────────────────────────────────────────────────

function AnnouncementCard({
  ann, isUnread, onRead,
}: {
  ann: Announcement;
  isUnread: boolean;
  onRead: (id: string) => void;
}) {
  const channelLabel =
    ann.channel === 'both'  ? '📧 Email + In-App' :
    ann.channel === 'email' ? '📧 Email only'     :
    '📱 In-App only';

  return (
    <div
      onClick={() => onRead(ann.id)}
      className={cn(
        'rounded-2xl border overflow-hidden cursor-pointer transition-colors',
        isUnread
          ? 'bg-primary-soft border-primary/20'
          : 'bg-surface border-border hover:bg-surface-elevated',
      )}
    >
      <div className="flex">
        {/* Priority bar */}
        <div className="w-1 shrink-0" style={{ backgroundColor: PRIORITY_BAR_COLOR[ann.priority] }} />

        {/* Content */}
        <div className="flex-1 px-4 py-4 min-w-0">
          {/* Top row */}
          <div className="flex items-start justify-between gap-3">
            <div className="flex items-start gap-2 flex-wrap min-w-0">
              <span className={cn('text-xs font-semibold uppercase px-2 py-0.5 rounded-md shrink-0', PRIORITY_BADGE[ann.priority])}>
                {ann.priority}
              </span>
              <span className="text-text font-semibold text-base leading-snug">{ann.title}</span>
              {isUnread && (
                <span className="bg-primary text-white text-[10px] font-bold px-1.5 py-0.5 rounded shrink-0">
                  NEW
                </span>
              )}
            </div>
            <span className="text-text-muted text-xs shrink-0 whitespace-nowrap">
              {ann.sentAt ?? ann.createdAt}
            </span>
          </div>

          {/* Message */}
          <p className="text-text-muted text-sm leading-relaxed mt-2">{ann.message}</p>

          {/* Bottom row */}
          <div className="flex items-center gap-2 mt-3 flex-wrap border-t border-border pt-3">
            <span className="text-text-muted text-xs opacity-70">{channelLabel}</span>
            <span className="text-text-muted text-xs opacity-40">·</span>
            <span className="text-text-muted text-xs opacity-70">For {TARGET_LABELS[ann.target]}</span>
            {isUnread && (
              <span className="ml-auto w-2 h-2 rounded-full bg-primary shrink-0" />
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function PortalAnnouncementsPage() {
  const [readIds,        setReadIds]        = useState<string[]>([]);
  const [priorityFilter, setPriorityFilter] = useState<PriorityFilter>('All');

  function markRead(id: string) {
    setReadIds((prev) => prev.includes(id) ? prev : [...prev, id]);
  }

  const unreadCount = SENT.filter((a) => !readIds.includes(a.id)).length;

  const filtered = SENT.filter((a) => {
    if (priorityFilter === 'All') return true;
    return a.priority === priorityFilter.toLowerCase();
  });

  const FILTERS: PriorityFilter[] = ['All', 'Important', 'Urgent', 'Normal'];

  return (
    <div className="min-h-screen  py-4 bg-background flex flex-col">
      {/* Header */}
      <div className="px-6 py-4 bg-forest border-b border-border">
        <div className="flex items-start gap-3">
          <Bell size={28} className="text-primary mt-0.5 shrink-0" />
          <div>
            <div className="flex items-center flex-wrap gap-2">
              <h1 className="text-3xl font-bold text-white leading-tight">Announcements</h1>
              {unreadCount > 0 && (
                <span className="bg-gold text-forest text-xs font-bold px-2 py-0.5 rounded-full">
                  {unreadCount} unread
                </span>
              )}
            </div>
            <p className="text-white/60 text-sm mt-1">
              Stay updated with the latest news from Greenleaf
            </p>
          </div>
        </div>
      </div>

      {/* Filter tabs */}
      <div className="flex gap-2 px-6 py-4 border-b border-border flex-wrap bg-surface">
        {FILTERS.map((f) => (
          <button
            key={f}
            onClick={() => setPriorityFilter(f)}
            className={cn(
              'rounded-full px-4 py-1.5 text-sm font-medium transition-colors',
              priorityFilter === f
                ? 'bg-primary text-white font-semibold'
                : 'bg-background text-text-muted border border-border hover:bg-primary-soft hover:text-primary',
            )}
          >
            {f}
          </button>
        ))}
      </div>

      {/* List */}
      <div className="px-6 py-4 flex flex-col gap-3 flex-1">
        {filtered.length === 0 ? (
          <div className="flex flex-col items-center justify-center gap-2 py-24 text-center">
            <Bell size={60} className="text-border" />
            <p className="text-text text-xl font-semibold mt-4">No announcements yet</p>
            <p className="text-text-muted text-sm mt-2">Check back later for updates from Greenleaf</p>
          </div>
        ) : (
          filtered.map((ann) => (
            <AnnouncementCard
              key={ann.id}
              ann={ann}
              isUnread={!readIds.includes(ann.id)}
              onRead={markRead}
            />
          ))
        )}
      </div>
    </div>
  );
}
