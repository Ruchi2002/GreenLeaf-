'use client';

import { useState } from 'react';
import { Loader2, Check, X } from 'lucide-react';
import { DEFAULT_SECURITY, LAST_SAVED } from '../../../../data/mock/adminSettings';

interface Toast { id: number; message: string }

function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div key={t.id} className="flex items-center gap-2 bg-[#0a1f13] text-green-400 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-green-500/30">
          <Check size={14} className="shrink-0" />{t.message}
        </div>
      ))}
    </div>
  );
}

function Card({ title, children }: { title: string; children: React.ReactNode }) {
  return (
    <div className="bg-white rounded-2xl shadow-sm p-6 flex flex-col gap-5">
      <h2 className="text-sm font-bold text-gray-900">{title}</h2>
      {children}
    </div>
  );
}

function Toggle({ checked, onChange }: { checked: boolean; onChange: () => void }) {
  return (
    <button
      onClick={onChange}
      className={`w-10 h-[22px] rounded-full transition-colors relative shrink-0 ${checked ? 'bg-green-600' : 'bg-gray-200'}`}
    >
      <span className={`absolute top-[3px] w-4 h-4 bg-white rounded-full shadow transition-transform ${checked ? 'translate-x-[22px]' : 'translate-x-[3px]'}`} />
    </button>
  );
}

function ToggleRow({ label, description, checked, onChange }: {
  label: string; description?: string; checked: boolean; onChange: () => void;
}) {
  return (
    <div className="flex items-center justify-between gap-4 py-1">
      <div>
        <p className="text-sm font-medium text-gray-900">{label}</p>
        {description && <p className="text-xs text-gray-400 mt-0.5">{description}</p>}
      </div>
      <Toggle checked={checked} onChange={onChange} />
    </div>
  );
}

function PrefixInput({ label, prefix, value, onChange }: {
  label: string; prefix: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-400 transition-all">
        <span className="px-3 py-2.5 text-xs font-semibold text-gray-400 bg-gray-50 border-r border-gray-200">{prefix}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none min-w-0 w-24"
        />
      </div>
    </div>
  );
}

function SelectInput({ label, value, options, onChange }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all appearance-none cursor-pointer"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

// ── Confirm Modal ─────────────────────────────────────────────────────────────

function ConfirmModal({ title, description, onConfirm, onClose }: {
  title: string; description: string; onConfirm: () => void; onClose: () => void;
}) {
  return (
    <div className="fixed inset-0 z-50 flex items-end sm:items-center justify-center p-0 sm:p-4 bg-black/40 backdrop-blur-sm" onClick={onClose}>
      <div className="bg-white rounded-t-3xl sm:rounded-2xl shadow-xl w-full sm:max-w-sm p-6" onClick={(e) => e.stopPropagation()}>
        <div className="flex items-center justify-between mb-3">
          <h3 className="text-base font-bold text-gray-900">{title}</h3>
          <button onClick={onClose} className="w-7 h-7 flex items-center justify-center rounded-full text-gray-400 hover:bg-gray-100 transition-colors">
            <X size={14} />
          </button>
        </div>
        <p className="text-sm text-gray-500 mb-6">{description}</p>
        <div className="flex gap-3">
          <button onClick={onClose} className="flex-1 border border-gray-200 rounded-xl py-2.5 text-sm font-medium text-gray-600 hover:bg-gray-50 transition-colors">
            Cancel
          </button>
          <button
            onClick={() => { onConfirm(); onClose(); }}
            className="flex-1 bg-red-600 text-white rounded-xl py-2.5 text-sm font-semibold hover:bg-red-700 transition-colors"
          >
            Confirm
          </button>
        </div>
      </div>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function SecuritySettingsPage() {
  const [form,      setForm]      = useState(DEFAULT_SECURITY);
  const [lastSaved, setLastSaved] = useState(LAST_SAVED);
  const [saving,    setSaving]    = useState(false);
  const [toasts,    setToasts]    = useState<Toast[]>([]);
  const [confirm,   setConfirm]   = useState<{ title: string; description: string; onConfirm: () => void } | null>(null);

  function toggle(field: keyof typeof form) {
    setForm((p) => ({ ...p, [field]: !p[field] }));
  }

  function addToast(message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }

  async function handleSave() {
    setSaving(true);
    await new Promise((r) => setTimeout(r, 1000));
    setSaving(false);
    const now = new Date();
    setLastSaved(
      now.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' at ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' }),
    );
    addToast('✓ Settings saved!');
  }

  return (
    <>
      <div className="flex flex-col gap-5 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Security Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Manage authentication and access control.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 bg-green-600 text-[#0b1410] text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700 disabled:opacity-70 transition-colors"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save Changes'}
          </button>
        </div>

        {/* Authentication */}
        <Card title="Authentication">
          <ToggleRow
            label="Two-Factor Authentication (2FA)"
            description="Require OTP on every admin login"
            checked={form.twoFA}
            onChange={() => toggle('twoFA')}
          />
          <div className="h-px bg-gray-100" />
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput
              label="Session Timeout"
              value={form.sessionTimeout}
              options={['15 min', '30 min', '1 hour', '4 hours']}
              onChange={(v) => setForm((p) => ({ ...p, sessionTimeout: v }))}
            />
            <PrefixInput
              label="Max Login Attempts"
              prefix="#"
              value={form.maxLoginAttempts}
              onChange={(v) => setForm((p) => ({ ...p, maxLoginAttempts: v }))}
            />
          </div>
        </Card>

        {/* Password Policy */}
        <Card title="Password Policy">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PrefixInput
              label="Minimum Password Length"
              prefix="#"
              value={form.minPasswordLength}
              onChange={(v) => setForm((p) => ({ ...p, minPasswordLength: v }))}
            />
            <SelectInput
              label="Password Expiry"
              value={form.passwordExpiry}
              options={['Never', '30 days', '60 days', '90 days']}
              onChange={(v) => setForm((p) => ({ ...p, passwordExpiry: v }))}
            />
          </div>
          <div className="flex flex-col gap-3 pt-1">
            <ToggleRow label="Require Special Characters" checked={form.requireSpecial}  onChange={() => toggle('requireSpecial')} />
            <ToggleRow label="Require Numbers"            checked={form.requireNumbers}  onChange={() => toggle('requireNumbers')} />
            <ToggleRow label="Require Uppercase"          checked={form.requireUppercase} onChange={() => toggle('requireUppercase')} />
          </div>
        </Card>

        {/* Admin Access */}
        <Card title="Admin Access">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">IP Whitelist</label>
            <textarea
              rows={3}
              value={form.ipWhitelist}
              onChange={(e) => setForm((p) => ({ ...p, ipWhitelist: e.target.value }))}
              placeholder="Enter IP addresses, one per line"
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none placeholder:text-gray-300 font-mono"
            />
            <p className="text-xs text-gray-400">Leave empty to allow all IPs</p>
          </div>
          <SelectInput
            label="Activity Log Retention"
            value={form.logRetention}
            options={['30 days', '60 days', '90 days', '1 year']}
            onChange={(v) => setForm((p) => ({ ...p, logRetention: v }))}
          />
        </Card>

        {/* Danger Zone */}
        <div className="bg-white rounded-2xl border-2 border-red-200 p-6 flex flex-col gap-4">
          <h2 className="text-sm font-bold text-red-600">Danger Zone</h2>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Clear All Sessions</p>
              <p className="text-xs text-gray-400 mt-0.5">Force logout all currently logged-in admin users</p>
            </div>
            <button
              onClick={() => setConfirm({
                title: 'Clear All Sessions',
                description: 'This will force logout all currently logged-in admin users. They will need to sign in again.',
                onConfirm: () => addToast('✓ All sessions cleared'),
              })}
              className="w-full sm:w-auto shrink-0 border border-red-300 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              Clear Sessions
            </button>
          </div>

          <div className="h-px bg-red-100" />

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
            <div>
              <p className="text-sm font-medium text-gray-900">Reset All Settings to Default</p>
              <p className="text-xs text-gray-400 mt-0.5">This will reset all configuration to factory defaults</p>
            </div>
            <button
              onClick={() => setConfirm({
                title: 'Reset All Settings',
                description: 'This will permanently reset all configuration to factory defaults. This action cannot be undone.',
                onConfirm: () => { setForm(DEFAULT_SECURITY); addToast('✓ Settings reset to default'); },
              })}
              className="w-full sm:w-auto shrink-0 border border-red-300 text-red-600 text-sm font-semibold px-4 py-2 rounded-xl hover:bg-red-50 transition-colors"
            >
              Reset to Default
            </button>
          </div>
        </div>
      </div>

      {/* Sticky bottom bar */}
      <div className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-gray-200 px-4 sm:px-6 py-4 flex items-center justify-between gap-4">
        <p className="text-xs text-gray-400 shrink-0 hidden sm:block">
          Last saved: <span className="text-gray-600 font-medium">{lastSaved}</span>
        </p>
        <button
          onClick={handleSave}
          disabled={saving}
          className="w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-[#0b1410] text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-70 transition-colors"
        >
          {saving ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save Changes'}
        </button>
      </div>

      {confirm && (
        <ConfirmModal
          title={confirm.title}
          description={confirm.description}
          onConfirm={confirm.onConfirm}
          onClose={() => setConfirm(null)}
        />
      )}

      <ToastList toasts={toasts} />
    </>
  );
}
