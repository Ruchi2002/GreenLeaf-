'use client';

import { useState, useEffect } from 'react';
import {
  Plus, Search, Edit2, Copy, Trash2, X, XCircle,
  Send, Megaphone, Clock, FileText, BarChart2,
} from 'lucide-react';
import {
  ANNOUNCEMENTS_SEED, TARGET_LABELS, TARGET_COUNTS,
  type Announcement, type AnnouncementPriority, type AnnouncementStatus,
  type AnnouncementTarget, type AnnouncementChannel,
} from '@/data/mock/announcements';

// ── Helpers ───────────────────────────────────────────────────────────────────

function cn(...cls: (string | false | undefined)[]) { return cls.filter(Boolean).join(' '); }

let _seq = 6;
function nextId() { return `ANN-${String(_seq++).padStart(3, '0')}`; }

// ── Style maps ────────────────────────────────────────────────────────────────

const PRIORITY_BAR: Record<AnnouncementPriority, string> = {
  urgent:    'bg-red-500',
  important: 'bg-amber-400',
  normal:    'bg-green-500',
};
const PRIORITY_BADGE: Record<AnnouncementPriority, string> = {
  urgent:    'bg-red-100 text-red-700',
  important: 'bg-amber-100 text-amber-700',
  normal:    'bg-green-100 text-green-700',
};
const STATUS_BADGE: Record<AnnouncementStatus, string> = {
  sent:      'bg-green-100 text-green-700',
  scheduled: 'bg-blue-100 text-blue-700',
  draft:     'bg-gray-100 text-gray-600',
};
const TARGET_BADGE: Record<AnnouncementTarget, string> = {
  all:      'bg-gray-900 text-white',
  diamond:  'bg-cyan-100 text-cyan-700',
  platinum: 'bg-puRPle-100 text-puRPle-700',
  gold:     'bg-yellow-100 text-yellow-700',
  silver:   'bg-gray-100 text-gray-600',
  bronze:   'bg-orange-100 text-orange-700',
};

// ── Toast ─────────────────────────────────────────────────────────────────────

interface Toast { id: number; message: string; kind: 'green' | 'amber' | 'red' }

function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-[70] flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className={cn(
          'flex items-center gap-2 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border',
          t.kind === 'green' ? 'bg-[#0a1f13] text-green-400 border-green-500/30' :
          t.kind === 'amber' ? 'bg-amber-50 text-amber-700 border-amber-200' :
          'bg-red-50 text-red-700 border-red-200',
        )}>
          <Megaphone size={13} className="shrink-0" />{t.message}
        </div>
      ))}
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────

function ConfirmModal({ title, body, confirmLabel, confirmCls, onConfirm, onClose }: {
  title: string; body: string; confirmLabel: string; confirmCls: string;
  onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-2xl shadow-xl w-full max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-2">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={14} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">{body}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Cancel</button>
          <button onClick={() => { onConfirm(); onClose(); }} className={cn('flex-1 rounded-xl py-2.5 text-sm font-semibold transition-colors', confirmCls)}>{confirmLabel}</button>
        </div>
      </div>
    </div>
  );
}

// ── Detail Drawer ─────────────────────────────────────────────────────────────

function DetailDrawer({ ann, onClose }: { ann: Announcement; onClose: () => void }) {
  const [visible, setVisible] = useState(false);
  useEffect(() => { requestAnimationFrame(() => requestAnimationFrame(() => setVisible(true))); }, []);

  function handleClose() { setVisible(false); setTimeout(onClose, 300); }
  const readPct = ann.totalRecipients > 0 ? Math.round((ann.readCount / ann.totalRecipients) * 100) : 0;

  return (
    <div className="fixed inset-0 z-50 flex">
      <div className="flex-1 bg-black/30 backdrop-blur-sm" onClick={handleClose} />
      <div className={cn('w-full max-w-md bg-white h-full shadow-2xl flex flex-col transition-transform duration-300', visible ? 'translate-x-0' : 'translate-x-full')}>
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Announcement Detail</h2>
          <button onClick={handleClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Badges */}
          <div className="flex flex-wrap gap-2">
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', STATUS_BADGE[ann.status])}>{ann.status.charAt(0).toUpperCase() + ann.status.slice(1)}</span>
            <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', PRIORITY_BADGE[ann.priority])}>{ann.priority.charAt(0).toUpperCase() + ann.priority.slice(1)}</span>
          </div>

          {/* Title */}
          <h3 className="text-lg font-bold text-gray-900 leading-snug">{ann.title}</h3>

          {/* Full message */}
          <div className="bg-gray-50 rounded-xl px-4 py-3">
            <p className="text-sm text-gray-700 leading-relaxed">{ann.message}</p>
          </div>

          {/* Meta */}
          <div className="grid grid-cols-2 gap-3">
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sent By</p><p className="text-sm font-semibold text-gray-800">{ann.createdBy}</p></div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Created</p><p className="text-sm text-gray-700">{ann.createdAt}</p></div>
            <div>
              <p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Target</p>
              <span className={cn('text-xs font-semibold px-2 py-0.5 rounded-full', TARGET_BADGE[ann.target])}>{TARGET_LABELS[ann.target]}</span>
            </div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Channel</p>
              <p className="text-sm text-gray-700">{ann.channel === 'both' ? '📧 Email + App' : ann.channel === 'email' ? '📧 Email' : '📱 In-App'}</p>
            </div>
            <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Recipients</p><p className="text-sm font-semibold text-gray-800">{ann.totalRecipients.toLocaleString()} members</p></div>
            {ann.sentAt && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Sent At</p><p className="text-sm text-gray-700">{ann.sentAt}</p></div>}
            {ann.scheduledAt && <div><p className="text-[10px] font-bold text-gray-400 uppercase tracking-wider mb-1">Scheduled</p><p className="text-sm text-amber-700 font-semibold">{ann.scheduledAt}</p></div>}
          </div>

          {/* Read rate */}
          {ann.status === 'sent' && (
            <div className="p-4 bg-gray-50 rounded-xl flex flex-col gap-3">
              <div className="flex items-center justify-between">
                <p className="text-sm font-bold text-gray-700">Read Rate</p>
                <span className="text-2xl font-bold text-green-600">{readPct}%</span>
              </div>
              <div className="h-3 bg-gray-200 rounded-full overflow-hidden">
                <div className="h-full bg-green-500 rounded-full transition-all" style={{ width: `${readPct}%` }} />
              </div>
              <p className="text-xs text-gray-500">{ann.readCount.toLocaleString()} of {ann.totalRecipients.toLocaleString()} members have read this</p>
            </div>
          )}
        </div>

        <div className="px-6 py-4 border-t border-gray-100">
          <button onClick={handleClose} className="w-full border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">Close</button>
        </div>
      </div>
    </div>
  );
}

// ── Create / Edit Modal ───────────────────────────────────────────────────────

interface FormState {
  title: string; message: string;
  priority: AnnouncementPriority; target: AnnouncementTarget;
  channel: AnnouncementChannel; scheduleType: 'now' | 'later';
  scheduleDate: string; scheduleTime: string;
}

const EMPTY_FORM: FormState = {
  title: '', message: '', priority: 'normal', target: 'all',
  channel: 'both', scheduleType: 'now', scheduleDate: '', scheduleTime: '',
};

function annToForm(ann: Announcement): FormState {
  return {
    title: ann.title, message: ann.message, priority: ann.priority,
    target: ann.target, channel: ann.channel,
    scheduleType: ann.scheduledAt ? 'later' : 'now',
    scheduleDate: '', scheduleTime: '',
  };
}

function ComposeModal({ initial, onSend, onDraft, onClose }: {
  initial?: FormState;
  onSend:  (f: FormState) => void;
  onDraft: (f: FormState) => void;
  onClose: () => void;
}) {
  const [form,   setForm]   = useState<FormState>(initial ?? EMPTY_FORM);
  const [errors, setErrors] = useState<{ title?: boolean; message?: boolean }>({});
  const [shake,  setShake]  = useState(false);

  function set<K extends keyof FormState>(k: K, v: FormState[K]) {
    setForm((p) => ({ ...p, [k]: v }));
    if (k === 'title' || k === 'message') setErrors((e) => ({ ...e, [k]: false }));
  }

  function validate() {
    const e = { title: !form.title.trim(), message: !form.message.trim() };
    setErrors(e);
    if (e.title || e.message) { setShake(true); setTimeout(() => setShake(false), 500); return false; }
    return true;
  }

  const charCount = form.message.length;
  const MAX_CHARS = 500;

  const PRIORITIES: AnnouncementPriority[] = ['normal', 'important', 'urgent'];
  const CHANNELS: { val: AnnouncementChannel; label: string }[] = [
    { val: 'in-app', label: 'In-App' },
    { val: 'email',  label: 'Email'  },
    { val: 'both',   label: 'Both'   },
  ];
  const TARGETS: { val: AnnouncementTarget; label: string }[] = [
    { val: 'all',      label: `All Members (${TARGET_COUNTS.all})` },
    { val: 'diamond',  label: `Diamond only (${TARGET_COUNTS.diamond})` },
    { val: 'platinum', label: `Platinum only (${TARGET_COUNTS.platinum})` },
    { val: 'gold',     label: `Gold only (${TARGET_COUNTS.gold})` },
    { val: 'silver',   label: `Silver only (${TARGET_COUNTS.silver})` },
    { val: 'bronze',   label: `Bronze only (${TARGET_COUNTS.bronze})` },
  ];

  const priorityCls: Record<AnnouncementPriority, string> = {
    normal:    'border-green-500 bg-green-600 text-white',
    important: 'border-amber-500 bg-amber-500 text-white',
    urgent:    'border-red-500 bg-red-600 text-white',
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div
        className={cn('bg-white rounded-2xl shadow-2xl w-full max-w-lg flex flex-col max-h-[90vh]', shake && 'animate-[shake_0.4s_ease]')}
        onClick={(e) => e.stopPropagation()}
        style={shake ? { animation: 'shake 0.4s ease' } : {}}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-5 border-b border-gray-100">
          <h2 className="text-base font-bold text-gray-900">Create New Announcement</h2>
          <button onClick={onClose} className="w-8 h-8 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors"><X size={16} /></button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-5">
          {/* Title */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Title <span className="text-red-500">*</span></label>
            <input
              type="text"
              value={form.title}
              onChange={(e) => set('title', e.target.value)}
              placeholder="e.g. October Bonus Calculation Complete"
              className={cn('border rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 transition-all', errors.title ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500/30 focus:border-green-400')}
            />
          </div>

          {/* Message */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Message <span className="text-red-500">*</span></label>
            <textarea
              rows={5}
              value={form.message}
              onChange={(e) => set('message', e.target.value.slice(0, MAX_CHARS))}
              placeholder="Type your announcement message here..."
              className={cn('border rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 resize-none transition-all placeholder:text-gray-300', errors.message ? 'border-red-400 focus:ring-red-200' : 'border-gray-200 focus:ring-green-500/30 focus:border-green-400')}
            />
            <p className={cn('text-xs self-end', charCount > MAX_CHARS * 0.9 ? 'text-amber-500' : 'text-gray-400')}>{charCount} / {MAX_CHARS}</p>
          </div>

          {/* Priority */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Priority</label>
            <div className="flex gap-2">
              {PRIORITIES.map((p) => (
                <button
                  key={p}
                  onClick={() => set('priority', p)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                    form.priority === p ? priorityCls[p] : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  )}
                >
                  {p.charAt(0).toUpperCase() + p.slice(1)}
                </button>
              ))}
            </div>
          </div>

          {/* Target */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Target Audience</label>
            <select
              value={form.target}
              onChange={(e) => set('target', e.target.value as AnnouncementTarget)}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all appearance-none"
            >
              {TARGETS.map((t) => <option key={t.val} value={t.val}>{t.label}</option>)}
            </select>
          </div>

          {/* Channel */}
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Send Via</label>
            <div className="flex gap-2">
              {CHANNELS.map((c) => (
                <button
                  key={c.val}
                  onClick={() => set('channel', c.val)}
                  className={cn(
                    'flex-1 py-2 rounded-xl text-sm font-semibold border-2 transition-all',
                    form.channel === c.val ? 'border-green-500 bg-green-600 text-white' : 'border-gray-200 text-gray-500 hover:border-gray-300',
                  )}
                >
                  {c.label}
                </button>
              ))}
            </div>
          </div>

          {/* Schedule */}
          <div className="flex flex-col gap-2">
            <label className="text-xs font-semibold text-gray-500">Schedule</label>
            <div className="flex flex-col gap-2">
              {(['now', 'later'] as const).map((s) => (
                <label key={s} className="flex items-center gap-3 cursor-pointer">
                  <div
                    onClick={() => set('scheduleType', s)}
                    className={cn('w-4 h-4 rounded-full border-2 flex items-center justify-center transition-colors', form.scheduleType === s ? 'border-green-600' : 'border-gray-300')}
                  >
                    {form.scheduleType === s && <div className="w-2 h-2 rounded-full bg-green-600" />}
                  </div>
                  <span className="text-sm text-gray-700">{s === 'now' ? 'Send Now' : 'Schedule for Later'}</span>
                </label>
              ))}
            </div>
            {form.scheduleType === 'later' && (
              <div className="flex gap-2 mt-1">
                <input type="date" value={form.scheduleDate} onChange={(e) => set('scheduleDate', e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
                <input type="time" value={form.scheduleTime} onChange={(e) => set('scheduleTime', e.target.value)}
                  className="flex-1 border border-gray-200 rounded-xl px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/30" />
              </div>
            )}
          </div>
        </div>

        {/* Footer */}
        <div className="px-6 py-4 border-t border-gray-100 flex gap-3">
          <button onClick={() => onDraft(form)} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-semibold text-gray-600 hover:bg-gray-50 transition-colors">Save as Draft</button>
          <button
            onClick={() => { if (validate()) onSend(form); }}
            className="flex-1 bg-green-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-green-700 transition-colors flex items-center justify-center gap-2"
          >
            <Send size={14} />Send Announcement
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

type StatusFilter = 'All' | 'Sent' | 'Scheduled' | 'Draft';

export default function AnnouncementsPage() {
  const [list,         setList]         = useState<Announcement[]>(ANNOUNCEMENTS_SEED);
  const [search,       setSearch]       = useState('');
  const [statusFilter, setStatusFilter] = useState<StatusFilter>('All');
  const [targetFilter, setTargetFilter] = useState<AnnouncementTarget | 'All'>('All');
  const [modal,        setModal]        = useState<{ mode: 'create' | 'edit' | 'duplicate'; ann?: Announcement } | null>(null);
  const [viewDrawer,   setViewDrawer]   = useState<Announcement | null>(null);
  const [confirm,      setConfirm]      = useState<{ title: string; body: string; confirmLabel: string; confirmCls: string; onConfirm: () => void } | null>(null);
  const [toasts,       setToasts]       = useState<{ id: number; message: string; kind: 'green' | 'amber' | 'red' }[]>([]);

  function addToast(message: string, kind: 'green' | 'amber' | 'red' = 'green') {
    const id = Date.now();
    setToasts((p) => [...p, { id, message, kind }]);
    setTimeout(() => setToasts((p) => p.filter((t) => t.id !== id)), 3000);
  }

  // Stats
  const sentCount      = list.filter((a) => a.status === 'sent').length;
  const scheduledCount = list.filter((a) => a.status === 'scheduled').length;
  const draftCount     = list.filter((a) => a.status === 'draft').length;
  const sentAnns       = list.filter((a) => a.status === 'sent' && a.totalRecipients > 0);
  const avgReadRate    = sentAnns.length === 0 ? 0 :
    Math.round(sentAnns.reduce((s, a) => s + a.readCount / a.totalRecipients, 0) / sentAnns.length * 100);

  // Filter
  const filtered = list.filter((a) => {
    const q = search.toLowerCase();
    if (q && !a.title.toLowerCase().includes(q) && !a.message.toLowerCase().includes(q)) return false;
    if (statusFilter !== 'All' && a.status !== statusFilter.toLowerCase()) return false;
    if (targetFilter !== 'All' && a.target !== targetFilter) return false;
    return true;
  });

  // Send handler
  function handleSend(form: FormState) {
    const now = new Date();
    const nowStr = now.toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const isScheduled = form.scheduleType === 'later' && form.scheduleDate;
    const newAnn: Announcement = {
      id:               nextId(),
      title:            form.title,
      message:          form.message,
      priority:         form.priority,
      target:           form.target,
      channel:          form.channel,
      createdBy:        'Amit Kumar',
      createdAt:        nowStr,
      status:           isScheduled ? 'scheduled' : 'sent',
      sentAt:           isScheduled ? undefined : nowStr,
      scheduledAt:      isScheduled ? `${form.scheduleDate} ${form.scheduleTime}` : undefined,
      totalRecipients:  TARGET_COUNTS[form.target],
      readCount:        0,
    };

    // If editing existing
    if (modal?.mode === 'edit' && modal.ann) {
      setList((p) => p.map((a) => a.id === modal.ann!.id ? { ...newAnn, id: modal.ann!.id } : a));
      addToast('✓ Announcement updated!');
    } else {
      setList((p) => [newAnn, ...p]);
      addToast(`✓ Announcement sent to ${TARGET_COUNTS[form.target].toLocaleString()} members!`);
    }
    setModal(null);
  }

  function handleDraft(form: FormState) {
    const now = new Date();
    const nowStr = now.toLocaleString('en-IN', { month: 'short', day: 'numeric', year: 'numeric', hour: '2-digit', minute: '2-digit' });
    const newAnn: Announcement = {
      id:              nextId(),
      title:           form.title || 'Untitled Draft',
      message:         form.message,
      priority:        form.priority,
      target:          form.target,
      channel:         form.channel,
      createdBy:       'Amit Kumar',
      createdAt:       nowStr,
      status:          'draft',
      totalRecipients: TARGET_COUNTS[form.target],
      readCount:       0,
    };
    if (modal?.mode === 'edit' && modal.ann) {
      setList((p) => p.map((a) => a.id === modal.ann!.id ? { ...newAnn, id: modal.ann!.id, status: 'draft' } : a));
    } else {
      setList((p) => [newAnn, ...p]);
    }
    addToast('Draft saved', 'amber');
    setModal(null);
  }

  function handleDelete(ann: Announcement) {
    setConfirm({
      title: 'Delete Announcement',
      body: `Delete "${ann.title}"? This action cannot be undone.`,
      confirmLabel: 'Delete',
      confirmCls: 'bg-red-600 text-white hover:bg-red-700',
      onConfirm: () => {
        setList((p) => p.filter((a) => a.id !== ann.id));
        addToast('Announcement deleted', 'red');
      },
    });
  }

  function handleCancelScheduled(ann: Announcement) {
    setConfirm({
      title: 'Cancel Scheduled Announcement',
      body: `Cancel "${ann.title}"? It will be moved to Drafts.`,
      confirmLabel: 'Cancel Scheduled',
      confirmCls: 'bg-amber-500 text-white hover:bg-amber-600',
      onConfirm: () => {
        setList((p) => p.map((a) => a.id === ann.id ? { ...a, status: 'draft', scheduledAt: undefined } : a));
        addToast('Announcement moved to Draft', 'amber');
      },
    });
  }

  const selectCls = 'border border-gray-200 rounded-xl px-3 py-2 text-sm text-gray-700 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 appearance-none cursor-pointer';

  return (
    <>
      <div className="flex flex-col gap-5">
        {/* Header */}
        <div className="flex items-center justify-between flex-wrap gap-3">
          <h1 className="text-[28px] font-bold text-gray-900 leading-tight">Announcements</h1>
          <button
            onClick={() => setModal({ mode: 'create' })}
            className="flex items-center gap-1.5 bg-green-600 text-[#0b1410] text-sm font-semibold px-4 py-2.5 rounded-xl hover:bg-green-700 transition-colors"
          >
            <Plus size={15} />Create Announcement
          </button>
        </div>

        {/* Stats */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
          {[
            { label: 'Total Sent',    value: sentCount,      color: 'text-green-600', icon: <Send size={16} className="text-green-600" />, bg: 'bg-green-100' },
            { label: 'Scheduled',     value: scheduledCount, color: 'text-blue-600',  icon: <Clock size={16} className="text-blue-600" />,  bg: 'bg-blue-100'  },
            { label: 'Drafts',        value: draftCount,     color: 'text-gray-500',  icon: <FileText size={16} className="text-gray-500" />, bg: 'bg-gray-100' },
            { label: 'Avg Read Rate', value: `${avgReadRate}%`, color: 'text-amber-600', icon: <BarChart2 size={16} className="text-amber-600" />, bg: 'bg-amber-100' },
          ].map((s) => (
            <div key={s.label} className="bg-white rounded-2xl shadow-sm p-5 flex items-center gap-4">
              <div className={cn('w-10 h-10 rounded-xl flex items-center justify-center shrink-0', s.bg)}>{s.icon}</div>
              <div>
                <p className={cn('text-2xl font-bold leading-none', s.color)}>{s.value}</p>
                <p className="text-xs text-gray-400 mt-0.5">{s.label}</p>
              </div>
            </div>
          ))}
        </div>

        {/* Filters */}
        <div className="bg-white rounded-2xl shadow-sm p-4 flex flex-wrap gap-3 items-center">
          {/* Search */}
          <div className="relative flex-1 min-w-[200px]">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400 pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search announcements..."
              className="w-full pl-9 pr-3 py-2 text-sm border border-gray-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all text-gray-700 placeholder:text-gray-300"
            />
          </div>

          {/* Status pills */}
          <div className="flex gap-1 bg-gray-100 p-1 rounded-xl">
            {(['All', 'Sent', 'Scheduled', 'Draft'] as StatusFilter[]).map((s) => (
              <button
                key={s}
                onClick={() => setStatusFilter(s)}
                className={cn('px-3 py-1 rounded-lg text-sm font-semibold transition-all', statusFilter === s ? 'bg-green-600 text-white' : 'text-gray-500 hover:text-gray-700')}
              >
                {s}
              </button>
            ))}
          </div>

          {/* Target */}
          <select value={targetFilter} onChange={(e) => setTargetFilter(e.target.value as AnnouncementTarget | 'All')} className={selectCls}>
            <option value="All">All Targets</option>
            {(Object.keys(TARGET_LABELS) as AnnouncementTarget[]).map((t) => (
              <option key={t} value={t}>{TARGET_LABELS[t]}</option>
            ))}
          </select>
        </div>

        {/* List */}
        <div className="flex flex-col gap-3">
          {filtered.length === 0 && (
            <div className="bg-white rounded-2xl shadow-sm py-16 text-center text-sm text-gray-400">No announcements match your filters</div>
          )}
          {filtered.map((ann) => {
            const readPct = ann.totalRecipients > 0 ? Math.round((ann.readCount / ann.totalRecipients) * 100) : 0;
            return (
              <div
                key={ann.id}
                className="bg-white rounded-2xl shadow-sm flex overflow-hidden cursor-pointer hover:shadow-md transition-shadow group"
                onClick={() => setViewDrawer(ann)}
              >
                {/* Priority bar */}
                <div className={cn('w-1 shrink-0', PRIORITY_BAR[ann.priority])} />

                <div className="flex-1 p-5 flex flex-col gap-2 min-w-0">
                  {/* Top row */}
                  <div className="flex items-start justify-between gap-3 flex-wrap">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className="text-sm font-bold text-gray-900">{ann.title}</span>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', STATUS_BADGE[ann.status])}>
                        {ann.status.charAt(0).toUpperCase() + ann.status.slice(1)}
                      </span>
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', PRIORITY_BADGE[ann.priority])}>
                        {ann.priority.charAt(0).toUpperCase() + ann.priority.slice(1)}
                      </span>
                    </div>

                    {/* Action buttons */}
                    <div className="flex items-center gap-1 opacity-0 group-hover:opacity-100 transition-opacity" onClick={(e) => e.stopPropagation()}>
                      <button
                        onClick={() => setModal({ mode: 'edit', ann })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Edit"
                      >
                        <Edit2 size={13} />
                      </button>
                      <button
                        onClick={() => setModal({ mode: 'duplicate', ann })}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-gray-100 hover:text-gray-700 transition-colors"
                        title="Duplicate"
                      >
                        <Copy size={13} />
                      </button>
                      {ann.status === 'scheduled' && (
                        <button
                          onClick={() => handleCancelScheduled(ann)}
                          className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-amber-50 hover:text-amber-600 transition-colors"
                          title="Cancel Schedule"
                        >
                          <XCircle size={13} />
                        </button>
                      )}
                      <button
                        onClick={() => handleDelete(ann)}
                        className="w-8 h-8 flex items-center justify-center rounded-lg text-gray-400 hover:bg-red-50 hover:text-red-600 transition-colors"
                        title="Delete"
                      >
                        <Trash2 size={13} />
                      </button>
                    </div>
                  </div>

                  {/* Message preview */}
                  <p className="text-sm text-gray-500 line-clamp-2 leading-relaxed">{ann.message}</p>

                  {/* Bottom row */}
                  <div className="flex items-center justify-between flex-wrap gap-3 pt-1">
                    <div className="flex items-center gap-2 flex-wrap">
                      <span className={cn('text-[10px] font-semibold px-2 py-0.5 rounded-full', TARGET_BADGE[ann.target])}>
                        {TARGET_LABELS[ann.target]}
                      </span>
                      <span className="text-xs text-gray-400">
                        {ann.channel === 'both' ? '📧 Email+App' : ann.channel === 'email' ? '📧 Email' : '📱 In-App'}
                      </span>
                      <span className="text-xs text-gray-400">by {ann.createdBy}</span>
                    </div>

                    <div className="flex items-center gap-3">
                      {ann.status === 'sent' && (
                        <div className="flex items-center gap-2">
                          <span className="text-xs text-gray-500">Sent {ann.sentAt?.split(',')[0]} · {ann.readCount.toLocaleString()}/{ann.totalRecipients.toLocaleString()} read ({readPct}%)</span>
                          <div className="w-20 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                            <div className="h-full bg-green-500 rounded-full" style={{ width: `${readPct}%` }} />
                          </div>
                        </div>
                      )}
                      {ann.status === 'scheduled' && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-blue-100 text-blue-700">
                          Scheduled for {ann.scheduledAt}
                        </span>
                      )}
                      {ann.status === 'draft' && (
                        <span className="text-xs font-semibold px-2.5 py-1 rounded-full bg-gray-100 text-gray-500">
                          Draft — not sent
                        </span>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Create / Edit modal */}
      {modal && (
        <ComposeModal
          initial={modal.ann ? annToForm(modal.ann) : undefined}
          onSend={handleSend}
          onDraft={handleDraft}
          onClose={() => setModal(null)}
        />
      )}

      {/* Detail drawer */}
      {viewDrawer && <DetailDrawer ann={viewDrawer} onClose={() => setViewDrawer(null)} />}

      {/* Confirm modal */}
      {confirm && (
        <ConfirmModal
          title={confirm.title}
          body={confirm.body}
          confirmLabel={confirm.confirmLabel}
          confirmCls={confirm.confirmCls}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      <ToastList toasts={toasts} />

      <style>{`
        @keyframes shake {
          0%, 100% { transform: translateX(0); }
          20%, 60% { transform: translateX(-6px); }
          40%, 80% { transform: translateX(6px); }
        }
      `}</style>
    </>
  );
}
