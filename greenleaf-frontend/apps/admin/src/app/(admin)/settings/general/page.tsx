'use client';

import { useState } from 'react';
import { Loader2, Check, Upload } from 'lucide-react';
import { DEFAULT_GENERAL, LAST_SAVED } from '../../../../data/mock/adminSettings';

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

function TextInput({ label, value, onChange, type = 'text', disabled = false }: {
  label: string; value: string; onChange: (v: string) => void; type?: string; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all disabled:bg-gray-50 disabled:text-gray-400"
      />
    </div>
  );
}

function SelectInput({ label, value, options, onChange, disabled = false }: {
  label: string; value: string; options: string[]; onChange: (v: string) => void; disabled?: boolean;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        disabled={disabled}
        className="border border-gray-200 rounded-xl px-4 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all appearance-none cursor-pointer disabled:bg-gray-50 disabled:text-gray-400"
      >
        {options.map((o) => <option key={o} value={o}>{o}</option>)}
      </select>
    </div>
  );
}

export default function GeneralSettingsPage() {
  const [form,      setForm]      = useState(DEFAULT_GENERAL);
  const [lastSaved, setLastSaved] = useState(LAST_SAVED);
  const [saving,    setSaving]    = useState(false);
  const [toasts,    setToasts]    = useState<Toast[]>([]);

  function set(field: keyof typeof form, value: string) {
    setForm((prev) => ({ ...prev, [field]: value }));
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
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">General Settings</h1>
            <p className="text-sm text-gray-500 mt-0.5">Configure company info and preferences.</p>
          </div>
          <button
            onClick={handleSave}
            disabled={saving}
            className="hidden sm:flex items-center gap-2 bg-green-600 text-[#0b1410] text-sm font-semibold px-5 py-2 rounded-xl hover:bg-green-700 disabled:opacity-70 transition-colors"
          >
            {saving ? <><Loader2 size={15} className="animate-spin" />Saving…</> : 'Save Changes'}
          </button>
        </div>

        {/* Company Info */}
        <Card title="Company Info">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <TextInput label="Company Name"   value={form.companyName}  onChange={(v) => set('companyName', v)} />
            <TextInput label="Website URL"    value={form.websiteUrl}   onChange={(v) => set('websiteUrl', v)}  type="url" />
            <TextInput label="Contact Email"  value={form.contactEmail} onChange={(v) => set('contactEmail', v)} type="email" />
            <TextInput label="Contact Phone"  value={form.contactPhone} onChange={(v) => set('contactPhone', v)} type="tel" />
          </div>
        </Card>

        {/* Localization */}
        <Card title="Localization">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <SelectInput label="Default Language" value={form.language}   options={['English', 'Hindi']}                         onChange={(v) => set('language', v)} />
            <SelectInput label="Timezone"          value={form.timezone}   options={['IST - UTC+5:30']}                           onChange={(v) => set('timezone', v)} disabled />
            <SelectInput label="Currency"          value="₹ INR — Indian Rupee" options={['₹ INR — Indian Rupee']}               onChange={() => {}} disabled />
            <SelectInput label="Date Format"       value={form.dateFormat} options={['DD/MM/YYYY', 'MM/DD/YYYY']}                 onChange={(v) => set('dateFormat', v)} />
          </div>
        </Card>

        {/* Logo & Branding */}
        <Card title="Logo & Branding">
          <div className="flex items-start gap-6 flex-wrap">
            {/* Current logo */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500">Current Logo</p>
              <div className="w-16 h-16 rounded-xl bg-gradient-to-br from-green-400 to-green-700 flex items-center justify-center shadow-sm">
                <svg viewBox="0 0 20 20" fill="white" className="w-8 h-8">
                  <rect x="3" y="3" width="14" height="14" rx="2" transform="rotate(45 10 10)" />
                </svg>
              </div>
            </div>

            {/* Upload area */}
            <div className="flex flex-col gap-2 flex-1 w-full sm:w-auto">
              <p className="text-xs font-semibold text-gray-500">Upload New Logo</p>
              <label className="flex flex-col items-center justify-center gap-2 border-2 border-dashed border-gray-200 rounded-xl px-6 py-6 cursor-pointer hover:border-green-400 hover:bg-green-50/50 transition-all">
                <Upload size={20} className="text-gray-300" />
                <span className="text-xs text-gray-400 text-center">Click to upload PNG or SVG<br />(max 2MB)</span>
                <input type="file" accept="image/*" className="hidden" />
              </label>
            </div>

            {/* Brand color */}
            <div className="flex flex-col gap-2">
              <p className="text-xs font-semibold text-gray-500">Brand Color</p>
              <div className="flex items-center gap-3 border border-gray-200 rounded-xl px-3 py-2.5">
                <input
                  type="color"
                  value={form.brandColor}
                  onChange={(e) => set('brandColor', e.target.value)}
                  className="w-8 h-8 rounded-lg border-0 cursor-pointer bg-transparent"
                />
                <span className="text-sm text-gray-700 font-mono">{form.brandColor.toUpperCase()}</span>
              </div>
            </div>
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
