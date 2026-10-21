'use client';

import { useState } from 'react';
import { Loader2, Check } from 'lucide-react';
import { DEFAULT_REGISTRATION, LAST_SAVED } from '../../../../data/mock/adminSettings';

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

function PrefixInput({ label, prefix, value, onChange }: {
  label: string; prefix: string; value: number; onChange: (v: number) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-400 transition-all">
        <span className="px-3 py-2.5 text-xs font-semibold text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">{prefix}</span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(Number(e.target.value))}
          className="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none min-w-0 w-28"
        />
      </div>
    </div>
  );
}

export default function RegistrationSettingsPage() {
  const [form,      setForm]      = useState(DEFAULT_REGISTRATION);
  const [lastSaved, setLastSaved] = useState(LAST_SAVED);
  const [saving,    setSaving]    = useState(false);
  const [toasts,    setToasts]    = useState<Toast[]>([]);

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

  const docLabels: { key: keyof typeof form.docs; label: string }[] = [
    { key: 'aadhaar',     label: 'Aadhaar Card'         },
    { key: 'pan',         label: 'PAN Card'              },
    { key: 'bankAccount', label: 'Bank Account Details'  },
    { key: 'photoId',     label: 'Photo ID'              },
    { key: 'addressProof', label: 'Address Proof'        },
  ];

  return (
    <>
      <div className="flex flex-col gap-5 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Registration Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configure membership and onboarding.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 bg-green-600 text-[#0b1410] text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700 disabled:opacity-70 transition-colors"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save Changes'}
          </button>
        </div>

        {/* Membership */}
        <Card title="Membership">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <PrefixInput
              label="Registration Fee" prefix="₹"
              value={form.registrationFee}
              onChange={(v) => setForm((p) => ({ ...p, registrationFee: v }))}
            />
            <PrefixInput
              label="Minimum Age" prefix="#"
              value={form.minimumAge}
              onChange={(v) => setForm((p) => ({ ...p, minimumAge: v }))}
            />
            <div className="flex flex-col gap-1.5 sm:col-span-2">
              <label className="text-xs font-semibold text-gray-500">Referral Code Format</label>
              <input
                type="text"
                value={form.referralCodeFormat}
                onChange={(e) => setForm((p) => ({ ...p, referralCodeFormat: e.target.value }))}
                className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
              />
            </div>
          </div>
          <div className="flex items-center justify-between py-1">
            <div>
              <p className="text-sm font-medium text-gray-900">Auto-approve New Members</p>
              <p className="text-xs text-gray-400 mt-0.5">Skip manual approval for new registrations</p>
            </div>
            <Toggle
              checked={form.autoApprove}
              onChange={() => setForm((p) => ({ ...p, autoApprove: !p.autoApprove }))}
            />
          </div>
        </Card>

        {/* Required Documents */}
        <Card title="Required Documents">
          <div className="flex flex-col divide-y divide-gray-100">
            {docLabels.map(({ key, label }) => (
              <div key={key} className="flex items-center justify-between py-3 first:pt-0 last:pb-0">
                <p className="text-sm text-gray-700">{label}</p>
                <Toggle
                  checked={form.docs[key]}
                  onChange={() => setForm((p) => ({ ...p, docs: { ...p.docs, [key]: !p.docs[key] } }))}
                />
              </div>
            ))}
          </div>
        </Card>

        {/* Welcome Message */}
        <Card title="Welcome Message">
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Welcome Email Subject</label>
            <input
              type="text"
              value={form.welcomeSubject}
              onChange={(e) => setForm((p) => ({ ...p, welcomeSubject: e.target.value }))}
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all"
            />
          </div>
          <div className="flex flex-col gap-1.5">
            <label className="text-xs font-semibold text-gray-500">Welcome Message</label>
            <textarea
              rows={4}
              value={form.welcomeMessage}
              onChange={(e) => setForm((p) => ({ ...p, welcomeMessage: e.target.value }))}
              placeholder="Dear {member_name}, Welcome to Greenleaf..."
              className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all resize-none placeholder:text-gray-300"
            />
          </div>
        </Card>
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

      <ToastList toasts={toasts} />
    </>
  );
}
