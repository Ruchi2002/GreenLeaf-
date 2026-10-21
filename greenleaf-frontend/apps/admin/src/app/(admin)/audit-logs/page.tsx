'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useMemo } from 'react';
import { Download, X, Search } from 'lucide-react';
import { auditLogs, type AuditLog } from '@/data/mock/adminAuditLogs';
import { cn } from '@/lib/utils';

const PAGE_SIZE = 10;

const CATEGORY_BADGE: Record<AuditLog['category'], string> = {
  Member:   'bg-blue-50 text-blue-700',
  Product:  'bg-puRPle-50 text-puRPle-700',
  Order:    'bg-orange-50 text-orange-700',
  Bonus:    'bg-yellow-50 text-yellow-700',
  Wallet:   'bg-green-50 text-green-700',
  System:   'bg-gray-100 text-gray-600',
  Security: 'bg-red-50 text-red-700',
};

const DATE_OPTIONS = ['All Time', 'Today', 'Last 7 days', 'Last 30 days'] as const;
type DateFilter = typeof DATE_OPTIONS[number];

type CategoryFilter = 'All' | AuditLog['category'];
const CATEGORIES: CategoryFilter[] = ['All', 'Member', 'Product', 'Order', 'Bonus', 'Wallet', 'System', 'Security'];

function initials(name: string) {
  return name.split(' ').map((w) => w[0]).join('').toUpperCase().slice(0, 2);
}

export default function AuditLogsPage() {
  const [search,      setSearch]      = useState('');
  const [category,    setCategory]    = useState<CategoryFilter>('All');
  const [dateFilter,  setDateFilter]  = useState<DateFilter>('All Time');
  const [statusFilter,setStatusFilter]= useState<'All' | 'success' | 'failed'>('All');
  const [selectedLog, setSelectedLog] = useState<AuditLog | null>(null);
  const [drawerOpen,  setDrawerOpen]  = useState(false);
  const [page,        setPage]        = useState(1);

  function openDrawer(log: AuditLog) {
    setSelectedLog(log);
    requestAnimationFrame(() => requestAnimationFrame(() => setDrawerOpen(true)));
  }
  function closeDrawer() {
    setDrawerOpen(false);
    setTimeout(() => setSelectedLog(null), 300);
  }

  // Stats
  const todayPrefix = '16 Oct 2026';
  const stats = useMemo(() => {
    const todayLogs   = auditLogs.filter((l) => l.timestamp.startsWith(todayPrefix));
    const success     = auditLogs.filter((l) => l.status === 'success').length;
    const failed      = auditLogs.filter((l) => l.status === 'failed').length;
    const activeAdmins = new Set(auditLogs.filter((l) => l.admin !== 'System').map((l) => l.admin)).size;
    return [
      { label: 'Total Today',    value: todayLogs.length,  color: 'text-gray-900' },
      { label: 'Successful',     value: success,            color: 'text-green-600' },
      { label: 'Failed',         value: failed,             color: 'text-red-600' },
      { label: 'Admins Active',  value: activeAdmins,       color: 'text-blue-600' },
    ];
  }, []);

  // Filtered list
  const filtered = useMemo(() => {
    return auditLogs.filter((l) => {
      if (category !== 'All' && l.category !== category) return false;
      if (statusFilter !== 'All' && l.status !== statusFilter) return false;
      if (dateFilter === 'Today'       && !l.timestamp.startsWith(todayPrefix)) return false;
      if (dateFilter === 'Last 7 days' && !['15 Oct', '16 Oct'].some((d) => l.timestamp.includes(d))) return false;
      const q = search.toLowerCase();
      if (q && !l.admin.toLowerCase().includes(q) && !l.action.toLowerCase().includes(q) &&
          !l.target.toLowerCase().includes(q) && !l.ip.includes(q)) return false;
      return true;
    });
  }, [search, category, dateFilter, statusFilter]);

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated  = filtered.slice((page - 1) * PAGE_SIZE, page * PAGE_SIZE);
  const start      = filtered.length === 0 ? 0 : (page - 1) * PAGE_SIZE + 1;
  const end        = Math.min(page * PAGE_SIZE, filtered.length);

  return (
    <div className="space-y-5">

      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Audit Logs</h1>
          <p className="text-sm text-gray-500 mt-0.5">Track all admin actions and system events.</p>
        </div>
        <button className="w-full sm:w-auto inline-flex items-center justify-center gap-2 bg-white border border-gray-200 text-gray-700 px-4 py-2 rounded-xl text-sm font-medium shadow-sm hover:bg-gray-50 transition-colors">
          <Download size={14} />
          Export CSV
        </button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
        {stats.map((s) => (
          <div key={s.label} className="bg-white rounded-2xl shadow-sm p-4 sm:p-5">
            <p className="text-xs text-gray-500 font-medium">{s.label}</p>
            <p className={cn('text-2xl sm:text-3xl font-bold mt-1 leading-none', s.color)}>{s.value}</p>
          </div>
        ))}
      </div>

      {/* Filters */}
      <div className="space-y-3">
        {/* Search + date/status selects */}
        <div className="flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search size={15} className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" />
            <input
              type="text"
              value={search}
              onChange={(e) => { setSearch(e.target.value); setPage(1); }}
              placeholder="Search by admin, action, target, IP…"
              className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-xl text-sm bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-500/40 transition-shadow"
            />
          </div>
          <div className="flex gap-2">
            <select
              value={statusFilter}
              onChange={(e) => { setStatusFilter(e.target.value as typeof statusFilter); setPage(1); }}
              className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
            >
              <option value="All">All Status</option>
              <option value="success">Success</option>
              <option value="failed">Failed</option>
            </select>
            <select
              value={dateFilter}
              onChange={(e) => { setDateFilter(e.target.value as DateFilter); setPage(1); }}
              className="flex-1 sm:flex-none border border-gray-200 rounded-xl px-3 py-2 text-sm bg-white text-gray-700 focus:outline-none focus:ring-2 focus:ring-green-500/30 cursor-pointer"
            >
              {DATE_OPTIONS.map((o) => <option key={o} value={o}>{o}</option>)}
            </select>
          </div>
        </div>

        {/* Category pills */}
        <div className="flex gap-2 overflow-x-auto scrollbar-hide pb-1">
          {CATEGORIES.map((cat) => (
            <button
              key={cat}
              onClick={() => { setCategory(cat); setPage(1); }}
              className={cn(
                'whitespace-nowrap shrink-0 px-3 py-1.5 rounded-full text-xs font-semibold transition-colors',
                category === cat
                  ? 'bg-green-600 text-[#0b1410]'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              )}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Desktop Table */}
      <div className="hidden md:block bg-white rounded-2xl shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-gray-100 bg-gray-50/60">
                {['TIMESTAMP', 'ADMIN', 'ACTION', 'TARGET', 'CATEGORY', 'IP ADDRESS', 'STATUS'].map((col) => (
                  <th key={col} className="text-left text-[11px] font-semibold text-gray-400 tracking-wider px-4 py-3.5">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-50">
              {paginated.length === 0 && (
                <tr>
                  <td colSpan={7} className="py-16 text-center text-gray-400 text-sm">No logs found.</td>
                </tr>
              )}
              {paginated.map((log) => (
                <tr
                  key={log.id}
                  onClick={() => openDrawer(log)}
                  className="hover:bg-gray-50/50 cursor-pointer transition-colors"
                >
                  <td className="px-4 py-3.5 text-xs text-gray-500 whitespace-nowrap">{log.timestamp}</td>
                  <td className="px-4 py-3.5">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                        {initials(log.admin)}
                      </div>
                      <span className="text-sm font-medium text-gray-900 whitespace-nowrap">{log.admin}</span>
                    </div>
                  </td>
                  <td className="px-4 py-3.5 text-sm text-gray-800">{log.action}</td>
                  <td className="px-4 py-3.5 text-sm text-gray-500 max-w-[180px] truncate">{log.target}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', CATEGORY_BADGE[log.category])}>
                      {log.category}
                    </span>
                  </td>
                  <td className="px-4 py-3.5 text-xs text-gray-500 font-mono whitespace-nowrap">{log.ip}</td>
                  <td className="px-4 py-3.5">
                    <span className={cn(
                      'px-2 py-0.5 rounded-full text-xs font-semibold capitalize',
                      log.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
                    )}>
                      {log.status}
                    </span>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Mobile Cards */}
      <div className="md:hidden space-y-3">
        {paginated.length === 0 && (
          <div className="bg-white rounded-2xl p-12 text-center text-gray-400 text-sm">No logs found.</div>
        )}
        {paginated.map((log) => (
          <div
            key={log.id}
            onClick={() => openDrawer(log)}
            className="bg-white rounded-2xl p-4 shadow-sm cursor-pointer active:scale-[0.99] transition-transform"
          >
            {/* Top: admin + status */}
            <div className="flex items-center justify-between mb-2">
              <div className="flex items-center gap-2">
                <div className="w-8 h-8 rounded-full bg-green-100 flex items-center justify-center text-xs font-bold text-green-700 shrink-0">
                  {initials(log.admin)}
                </div>
                <span className="font-semibold text-sm text-gray-900">{log.admin}</span>
              </div>
              <span className={cn(
                'px-2 py-0.5 rounded-full text-xs font-semibold capitalize',
                log.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
              )}>
                {log.status}
              </span>
            </div>

            {/* Action */}
            <p className="text-sm text-gray-800 mb-1">{log.action}</p>

            {/* Target */}
            <p className="text-xs text-gray-500 mb-2 truncate">Target: {log.target}</p>

            {/* Bottom: category + timestamp */}
            <div className="flex items-center justify-between">
              <span className={cn('px-2 py-0.5 rounded-full text-xs font-semibold', CATEGORY_BADGE[log.category])}>
                {log.category}
              </span>
              <span className="text-xs text-gray-400">{log.timestamp}</span>
            </div>
          </div>
        ))}
      </div>

      {/* Pagination */}
      {filtered.length > PAGE_SIZE && (
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <p className="text-sm text-gray-500 hidden sm:block">
            Showing {start}–{end} of {filtered.length} logs
          </p>
          <div className="flex items-center justify-center gap-2">
            <button
              onClick={() => setPage((p) => Math.max(1, p - 1))}
              disabled={page === 1}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              ← Prev
            </button>
            <span className="text-sm text-gray-600 px-1">
              <span className="sm:hidden">{page}/{totalPages}</span>
              <span className="hidden sm:inline">Page {page} of {totalPages}</span>
            </span>
            <button
              onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
              disabled={page === totalPages}
              className="px-3 py-1.5 border border-gray-200 rounded-lg text-sm text-gray-600 hover:bg-gray-50 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              Next →
            </button>
          </div>
        </div>
      )}

      {/* Overlay (mobile only) */}
      {selectedLog && (
        <div
          className={cn(
            'fixed inset-0 bg-black/30 z-40 lg:hidden transition-opacity duration-300',
            drawerOpen ? 'opacity-100' : 'opacity-0'
          )}
          onClick={closeDrawer}
        />
      )}

      {/* Detail Drawer */}
      {selectedLog && (
        <div className={cn(
          'fixed z-50 bg-white shadow-2xl transition-transform duration-300 flex flex-col',
          'bottom-0 left-0 right-0 rounded-t-3xl h-[85vh]',
          'lg:top-0 lg:right-0 lg:bottom-auto lg:left-auto lg:h-full lg:w-[420px] lg:rounded-none',
          drawerOpen ? 'translate-y-0 lg:translate-x-0' : 'translate-y-full lg:translate-x-full'
        )}>
          {/* Drag handle (mobile only) */}
          <div className="lg:hidden flex justify-center pt-3 pb-1">
            <div className="w-10 h-1 rounded-full bg-gray-300" />
          </div>

          {/* Header */}
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100 shrink-0">
            <h2 className="text-base font-bold text-gray-900">Log Details</h2>
            <button onClick={closeDrawer} className="w-8 h-8 rounded-full flex items-center justify-center text-gray-400 hover:bg-gray-100 transition-colors">
              <X size={16} />
            </button>
          </div>

          {/* Content */}
          <div className="flex-1 overflow-y-auto px-6 py-5 space-y-4">
            {/* Status badge */}
            <span className={cn(
              'inline-flex px-3 py-1 rounded-full text-sm font-semibold capitalize',
              selectedLog.status === 'success' ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-700'
            )}>
              {selectedLog.status}
            </span>

            {/* Detail rows */}
            {[
              { label: 'Admin',      value: selectedLog.admin },
              { label: 'Action',     value: selectedLog.action },
              { label: 'Category',   value: selectedLog.category },
              { label: 'Target',     value: selectedLog.target },
              { label: 'IP Address', value: selectedLog.ip },
              { label: 'Timestamp',  value: selectedLog.timestamp },
              { label: 'User Agent', value: selectedLog.userAgent ?? 'Chrome 120, Windows 11' },
              { label: 'Session ID', value: selectedLog.sessionId ?? `sess_${selectedLog.id}` },
            ].map(({ label, value }) => (
              <div key={label} className="border-b border-gray-50 pb-3">
                <p className="text-xs text-gray-500 mb-1">{label}</p>
                <p className="text-sm font-medium text-gray-800 break-words">{value}</p>
              </div>
            ))}

            {/* Metadata */}
            {selectedLog.metadata && (
              <div>
                <p className="text-xs text-gray-500 mb-2">Metadata</p>
                <pre className="bg-gray-50 rounded-xl p-3 text-xs overflow-x-auto text-gray-700 leading-relaxed">
                  {JSON.stringify(selectedLog.metadata, null, 2)}
                </pre>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
