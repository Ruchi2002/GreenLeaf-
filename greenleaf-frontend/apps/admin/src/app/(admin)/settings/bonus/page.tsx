'use client';

import { useState, useEffect } from 'react';
import {
  Gift, Users, Layers, TrendingUp, RefreshCw, LayoutGrid,
  AlertTriangle, Loader2, Check,
} from 'lucide-react';
import {
  DEFAULT_BONUS_CONFIG, TIER_CONDITIONS, LAST_SAVED,
  type BonusConfig,
} from '../../../../data/mock/adminSettings';

// ── Toast ─────────────────────────────────────────────────────────────────────

interface Toast { id: number; message: string }

function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="flex items-center gap-2 bg-[#0a1f13] text-green-400 text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-green-500/30"
        >
          <Check size={14} className="shrink-0" />
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Card wrapper ──────────────────────────────────────────────────────────────

function BonusCard({
  borderColor, iconBg, icon: Icon, title, subtitle, children,
}: {
  borderColor: string;
  iconBg:      string;
  icon:        React.ElementType;
  title:       string;
  subtitle:    string;
  children:    React.ReactNode;
}) {
  return (
    <div className={`bg-white rounded-2xl shadow-sm border-l-4 ${borderColor} p-5`}>
      <div className="flex items-start gap-3 mb-5">
        <div className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${iconBg}`}>
          <Icon size={16} />
        </div>
        <div>
          <p className="text-sm font-bold text-gray-900">{title}</p>
          <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>
        </div>
      </div>
      <div className="flex flex-col gap-3">{children}</div>
    </div>
  );
}

// ── Input field ───────────────────────────────────────────────────────────────

function Field({
  label, prefix, value, onChange,
}: {
  label:    string;
  prefix:   string;
  value:    string | number;
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <div className="flex items-center border border-gray-200 rounded-xl overflow-hidden focus-within:ring-2 focus-within:ring-green-500/30 focus-within:border-green-400 transition-all">
        <span className="px-3 py-2.5 text-xs font-semibold text-gray-400 bg-gray-50 border-r border-gray-200 whitespace-nowrap">
          {prefix}
        </span>
        <input
          type="number"
          value={value}
          onChange={(e) => onChange(e.target.value)}
          className="flex-1 px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none min-w-0 w-24"
        />
      </div>
    </div>
  );
}

function SelectField({
  label, value, options, onChange,
}: {
  label:    string;
  value:    string;
  options:  readonly string[];
  onChange: (v: string) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5 w-full">
      <label className="text-xs font-semibold text-gray-500">{label}</label>
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="border border-gray-200 rounded-xl px-3 py-2.5 text-sm text-gray-900 bg-white focus:outline-none focus:ring-2 focus:ring-green-500/30 focus:border-green-400 transition-all appearance-none cursor-pointer"
      >
        {options.map((o) => (
          <option key={o} value={o}>{o}</option>
        ))}
      </select>
    </div>
  );
}

// ── Page ──────────────────────────────────────────────────────────────────────

export default function BonusConfigPage() {
  const [config,    setConfig]    = useState<BonusConfig>(DEFAULT_BONUS_CONFIG);
  const [lastSaved, setLastSaved] = useState(LAST_SAVED);
  const [saving,    setSaving]    = useState(false);
  const [toasts,    setToasts]    = useState<Toast[]>([]);
  const [isDirty,   setIsDirty]   = useState(false);

  useEffect(() => {
    setIsDirty(JSON.stringify(config) !== JSON.stringify(DEFAULT_BONUS_CONFIG));
  }, [config]);

  function update<K extends keyof BonusConfig>(
    key: K, field: keyof BonusConfig[K], value: string | number,
  ) {
    setConfig((prev) => ({
      ...prev,
      [key]: { ...prev[key], [field]: typeof prev[key][field] === 'number' ? Number(value) : value },
    }));
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
    const formatted = now.toLocaleDateString('en-IN', { month: 'short', day: 'numeric', year: 'numeric' })
      + ' at ' + now.toLocaleTimeString('en-IN', { hour: '2-digit', minute: '2-digit' });
    setLastSaved(formatted);
    setIsDirty(false);
    addToast('✓ Configuration saved successfully!');
  }

  const c = config;

  return (
    <>
      <div className="flex flex-col gap-5 pb-24">
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
          <div>
            <h1 className="text-2xl sm:text-[28px] font-bold text-gray-900 leading-tight">Bonus Configuration</h1>
            <p className="text-sm text-gray-500 mt-0.5">Set bonus rates and thresholds.</p>
          </div>
          <div className="flex items-center gap-1.5 bg-amber-50 border border-amber-200 text-amber-700 text-xs font-semibold px-3 py-1.5 rounded-full self-start sm:self-auto">
            <AlertTriangle size={12} className="shrink-0" />
            Changes affect all future bonus runs
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        <BonusCard borderColor="border-green-500" iconBg="bg-green-100 text-green-700" icon={Gift}
          title="Sponsor Bonus (RB)" subtitle="Paid directly to the sponsor on every new registration.">
          <Field label="Percentage" prefix="%" value={c.sponsorBonus.percentage} onChange={(v) => update('sponsorBonus', 'percentage', v)} />
          <Field label="Max Upline Depth" prefix="#" value={c.sponsorBonus.maxUplineDepth} onChange={(v) => update('sponsorBonus', 'maxUplineDepth', v)} />
        </BonusCard>

        <BonusCard borderColor="border-amber-400" iconBg="bg-amber-100 text-amber-700" icon={Users}
          title="Group Bonus (GB)" subtitle="Shared across the member's active downline group volume.">
          <Field label="Percentage" prefix="%" value={c.groupBonus.percentage} onChange={(v) => update('groupBonus', 'percentage', v)} />
        </BonusCard>

        <BonusCard borderColor="border-puRPle-400" iconBg="bg-puRPle-100 text-puRPle-700" icon={Layers}
          title="Layer Bonus (SB)" subtitle="Paid per matrix layer, conditioned on tier qualification.">
          <Field label="Percentage" prefix="%" value={c.layerBonus.percentage} onChange={(v) => update('layerBonus', 'percentage', v)} />
          <SelectField label="Tier Condition" value={c.layerBonus.tierCondition} options={TIER_CONDITIONS} onChange={(v) => update('layerBonus', 'tierCondition', v)} />
        </BonusCard>

        <BonusCard borderColor="border-blue-400" iconBg="bg-blue-100 text-blue-700" icon={TrendingUp}
          title="Leadership Bonus (LS)" subtitle="Fixed payout once a leader crosses the qualifying PV threshold.">
          <Field label="Threshold PV" prefix="PV" value={c.leadershipBonus.thresholdPV} onChange={(v) => update('leadershipBonus', 'thresholdPV', v)} />
          <Field label="Fixed Amount" prefix="₹" value={c.leadershipBonus.fixedAmount} onChange={(v) => update('leadershipBonus', 'fixedAmount', v)} />
        </BonusCard>

        <BonusCard borderColor="border-teal-400" iconBg="bg-teal-100 text-teal-700" icon={RefreshCw}
          title="Self Rebate (MS)" subtitle="Rebate applied to the member's own repurchase volume.">
          <Field label="Percentage" prefix="%" value={c.selfRebate.percentage} onChange={(v) => update('selfRebate', 'percentage', v)} />
        </BonusCard>

        <BonusCard borderColor="border-[#0a1f13]" iconBg="bg-[#0a1f13]/10 text-[#0a1f13]" icon={LayoutGrid}
          title="PV Configuration" subtitle="The exchange rate used to convert point value into currency.">
          <Field label="₹ per PV" prefix="₹" value={c.pvConfiguration.rupeesPeRPV} onChange={(v) => update('pvConfiguration', 'rupeesPeRPV', v)} />
        </BonusCard>
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
          className="relative w-full sm:w-auto flex items-center justify-center gap-2 bg-green-600 text-[#0b1410] text-sm font-semibold px-6 py-2.5 rounded-xl hover:bg-green-700 disabled:opacity-70 disabled:cursor-not-allowed transition-colors"
        >
          {saving ? <><Loader2 size={15} className="animate-spin" />Saving…</> : (
            <>
              Save Configuration
              {isDirty && <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-amber-400 rounded-full border-2 border-white" />}
            </>
          )}
        </button>
      </div>

      <ToastList toasts={toasts} />
    </>
  );
}
