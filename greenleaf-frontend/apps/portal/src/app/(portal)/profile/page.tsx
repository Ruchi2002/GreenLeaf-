'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useEffect } from 'react';
import { Eye, EyeOff, Moon, Sun } from 'lucide-react';
import { MOCK_PROFILE_EXTENDED, MOCK_ADDRESSES } from '@/data/mock/profile';

type ProfileTab = 'profile' | 'bank' | 'security' | 'addresses' | 'language';

// ── Toggle switch ─────────────────────────────────────────────────────────────

interface ToggleProps { checked: boolean; onChange: () => void; }
function Toggle({ checked, onChange }: ToggleProps) {
  return (
    <button
      onClick={onChange}
      className={`relative w-11 h-6 rounded-full transition-colors duration-200 ${checked ? 'bg-primary' : 'bg-border'}`}
    >
      <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${checked ? 'translate-x-5' : 'translate-x-0'}`} />
    </button>
  );
}

// ── Shared input style ────────────────────────────────────────────────────────

const inputCls = 'w-full bg-primary/5 border border-border rounded-xl px-4 py-2.5 text-sm text-text focus:outline-none focus:border-primary/50';
const labelCls = 'text-xs text-text-muted mb-1 block';

// ── Tab: Profile Info ─────────────────────────────────────────────────────────

function ProfileTab() {
  const p = MOCK_PROFILE_EXTENDED;
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Full Name</label>
          <input className={inputCls} defaultValue={p.fullName} />
        </div>
        <div>
          <label className={labelCls}>Email Address</label>
          <input className={inputCls} defaultValue={p.email} />
        </div>
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Phone Number</label>
          <input className={inputCls} defaultValue={p.phone} />
        </div>
        <div>
          <label className={labelCls}>Sponsor</label>
          <input className={`${inputCls} opacity-70`} defaultValue={p.sponsor} readOnly />
        </div>
      </div>
      <div className="mb-4">
        <label className={labelCls}>Address</label>
        <input className={inputCls} defaultValue={p.address} />
      </div>
      <div className="mb-5">
        <label className={labelCls}>Bank Account for Payouts</label>
        <input
          className={`${inputCls} opacity-70`}
          defaultValue={`${p.bank.bankName} ${p.bank.accountNumber} — ${p.bank.accountHolder}`}
          readOnly
        />
      </div>
      <button className="bg-primary text-[#0b1410] font-semibold rounded-xl px-6 py-2.5 text-sm hover:opacity-90 transition-opacity">
        Save Changes
      </button>
    </div>
  );
}

// ── Tab: Bank Account ─────────────────────────────────────────────────────────

function BankTab() {
  const b = MOCK_PROFILE_EXTENDED.bank;
  return (
    <div className="bg-surface border border-border rounded-2xl p-6">
      {/* Display card */}
      <div className="relative bg-[#1a3728] rounded-2xl p-5 mb-6 overflow-hidden">
        <div className="absolute top-0 right-0 w-28 h-28 rounded-full bg-white/5 -translate-y-10 translate-x-10" />
        <p className="text-xs text-white/60 mb-2">Bank account for payouts</p>
        <p className="text-2xl font-bold text-white">{b.bankName} {b.accountNumber}</p>
        <p className="text-sm text-white/70 mt-1">{b.accountHolder}</p>
      </div>

      <p className="text-sm font-semibold text-text mb-4">Add / change bank account</p>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 mb-4">
        <div>
          <label className={labelCls}>Bank name</label>
          <input className={inputCls} placeholder="e.g. BCA" />
        </div>
        <div>
          <label className={labelCls}>Account number</label>
          <input className={inputCls} placeholder="0000000000" />
        </div>
      </div>
      <div className="mb-4">
        <label className={labelCls}>Account holder name</label>
        <input className={inputCls} placeholder="Full name as on bank account" />
      </div>
      <button className="bg-primary text-[#0b1410] font-semibold rounded-xl px-6 py-2.5 text-sm mt-2 hover:opacity-90 transition-opacity">
        Save bank account
      </button>
    </div>
  );
}

// ── Tab: Security ─────────────────────────────────────────────────────────────

function SecurityTab({ twoFA, setTwoFA }: { twoFA: boolean; setTwoFA: (v: boolean) => void }) {
  const [showNewPw,     setShowNewPw]     = useState(false);
  const [showConfPw,    setShowConfPw]    = useState(false);
  const [showNewPayPw,  setShowNewPayPw]  = useState(false);
  const [showConfPayPw, setShowConfPayPw] = useState(false);
  const email = MOCK_PROFILE_EXTENDED.email;

  const pwField = (label: string, show: boolean, toggle: () => void, extra?: React.InputHTMLAttributes<HTMLInputElement>) => (
    <div className="relative">
      <label className={labelCls}>{label}</label>
      <input
        type={show ? 'text' : 'password'}
        className={`${inputCls} pr-10`}
        {...extra}
      />
      <button
        type="button"
        onClick={toggle}
        className="absolute right-3 top-[2.15rem] text-text-muted hover:text-text"
      >
        {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
      </button>
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Login password */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-sm font-bold text-text mb-1">Login Password</p>
        <p className="text-xs text-text-muted mb-4">
          We&apos;ll email a verification code to {email} before this change takes effect
        </p>
        <button className="border border-border text-text-muted rounded-xl px-4 py-2 text-sm mb-5 hover:border-primary/40 hover:text-text transition-colors">
          Send verification code
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pwField('New login password',  showNewPw,  () => setShowNewPw(!showNewPw))}
          {pwField('Confirm new password', showConfPw, () => setShowConfPw(!showConfPw))}
        </div>
        <button className="bg-primary text-[#0b1410] font-semibold rounded-xl px-5 py-2.5 text-sm mt-4 hover:opacity-90 transition-opacity">
          Update login password
        </button>
      </div>

      {/* Payment password */}
      <div className="bg-surface border border-border rounded-2xl p-6">
        <p className="text-sm font-bold text-text mb-1">Payment Password</p>
        <p className="text-xs text-text-muted mb-4">
          Used to confirm orders, transfers and withdrawals. We&apos;ll email a verification code first
        </p>
        <button className="border border-border text-text-muted rounded-xl px-4 py-2 text-sm mb-5 hover:border-primary/40 hover:text-text transition-colors">
          Send verification code
        </button>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {pwField('New payment password (6 digits)', showNewPayPw,  () => setShowNewPayPw(!showNewPayPw),  { maxLength: 6 })}
          {pwField('Confirm',                          showConfPayPw, () => setShowConfPayPw(!showConfPayPw), { maxLength: 6 })}
        </div>
        <button className="bg-primary text-[#0b1410] font-semibold rounded-xl px-5 py-2.5 text-sm mt-4 hover:opacity-90 transition-opacity">
          Update payment password
        </button>
      </div>

      {/* 2FA */}
      <div className="bg-surface border border-border rounded-2xl p-4 flex items-center justify-between">
        <div>
          <p className="text-sm font-semibold text-text">Two-Factor Authentication</p>
          <p className="text-xs text-text-muted">Add an extra layer of security</p>
        </div>
        <Toggle checked={twoFA} onChange={() => setTwoFA(!twoFA)} />
      </div>
    </div>
  );
}

// ── Tab: Addresses ────────────────────────────────────────────────────────────

function AddressesTab() {
  return (
    <div className="space-y-3">
      {MOCK_ADDRESSES.map((addr) => (
        <div key={addr.id} className="bg-surface border border-border rounded-2xl p-4 flex items-start justify-between">
          <div className="min-w-0 flex-1">
            <div className="flex items-center gap-2 mb-1">
              {addr.isDefault && (
                <span className="text-xs text-primary bg-primary-soft px-2 py-0.5 rounded-full border border-primary/30">
                  Default
                </span>
              )}
              <span className="text-sm font-bold text-text">{addr.label}</span>
            </div>
            <p className="text-xs text-primary mt-0.5">{addr.recipientName} · {addr.phone}</p>
            <p className="text-xs text-text-muted mt-0.5">{addr.fullAddress}</p>
          </div>
          <button className="text-sm text-primary hover:underline shrink-0 ml-4">Edit</button>
        </div>
      ))}
      <button className="w-full border border-dashed border-border rounded-2xl p-4 text-sm text-text-muted text-center hover:border-primary/40 hover:text-text transition-colors">
        + Add new address
      </button>
    </div>
  );
}

// ── Tab: Language & Preferences ───────────────────────────────────────────────

const LANGUAGES = ['English', 'Bahasa Indonesia', '中文'] as const;

function LanguageTab({
  darkMode, toggleDark,
  language, setLanguage,
  emailNotif, setEmailNotif,
  smsNotif, setSmsNotif,
  pushNotif, setPushNotif,
}: {
  darkMode: boolean; toggleDark: () => void;
  language: string;  setLanguage: (l: string) => void;
  emailNotif: boolean; setEmailNotif: (v: boolean) => void;
  smsNotif:   boolean; setSmsNotif:   (v: boolean) => void;
  pushNotif:  boolean; setPushNotif:  (v: boolean) => void;
}) {
  const rows: { label: string; sub: string; right: React.ReactNode }[] = [
    {
      label: 'Appearance',
      sub:   'Switch between light and dark theme',
      right: <Toggle checked={darkMode} onChange={toggleDark} />,
    },
    {
      label: 'Language',
      sub:   'Display language across the app',
      right: (
        <div className="flex gap-2 flex-wrap justify-end">
          {LANGUAGES.map((l) => (
            <button
              key={l}
              onClick={() => setLanguage(l)}
              className={language === l
                ? 'bg-primary/10 text-primary border border-primary/30 rounded-full px-3 py-1 text-xs font-medium'
                : 'border border-border text-text-muted rounded-full px-3 py-1 text-xs hover:border-primary/40 transition-colors'}
            >
              {l}
            </button>
          ))}
        </div>
      ),
    },
    {
      label: 'Email Notifications',
      sub:   'Order updates and bonus payouts',
      right: <Toggle checked={emailNotif} onChange={() => setEmailNotif(!emailNotif)} />,
    },
    {
      label: 'SMS Notifications',
      sub:   'New network joins',
      right: <Toggle checked={smsNotif} onChange={() => setSmsNotif(!smsNotif)} />,
    },
    {
      label: 'Push Notifications',
      sub:   'Real-time alerts on this device',
      right: <Toggle checked={pushNotif} onChange={() => setPushNotif(!pushNotif)} />,
    },
  ];

  return (
    <div className="bg-surface border border-border rounded-2xl divide-y divide-border">
      {rows.map(({ label, sub, right }) => (
        <div key={label} className="flex items-center justify-between p-5 gap-4">
          <div className="min-w-0">
            <p className="text-sm font-semibold text-text">{label}</p>
            <p className="text-xs text-text-muted">{sub}</p>
          </div>
          <div className="shrink-0">{right}</div>
        </div>
      ))}
    </div>
  );
}

// ── Page ─────────────────────────────────────────────────────────────────────

const TABS: { value: ProfileTab; label: string }[] = [
  { value: 'profile',   label: 'Profile Info'            },
  { value: 'bank',      label: 'Bank Account'            },
  { value: 'security',  label: 'Security'                },
  { value: 'addresses', label: 'Addresses'               },
  { value: 'language',  label: 'Language & Preferences'  },
];

export default function ProfilePage() {
  const p = MOCK_PROFILE_EXTENDED;

  const [activeTab,    setActiveTab]    = useState<ProfileTab>('profile');
  const [darkMode,     setDarkMode]     = useState(false);
  const [language,     setLanguage]     = useState(p.preferences.language);
  const [emailNotif,   setEmailNotif]   = useState(p.preferences.emailNotifications);
  const [smsNotif,     setSmsNotif]     = useState(p.preferences.smsNotifications);
  const [pushNotif,    setPushNotif]    = useState(p.preferences.pushNotifications);
  const [twoFA,        setTwoFA]        = useState(true);

  useEffect(() => {
    const saved = localStorage.getItem('gl-theme');
    const dark  = saved === 'dark' || (!saved && window.matchMedia('(prefers-color-scheme: dark)').matches);
    setDarkMode(dark);
    document.documentElement.classList.toggle('dark', dark);
  }, []);

  function toggleDark() {
    const next = !darkMode;
    setDarkMode(next);
    document.documentElement.classList.toggle('dark', next);
    localStorage.setItem('gl-theme', next ? 'dark' : 'light');
  }

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)]">
      {/* Top row */}
      <div className="flex items-start justify-between mb-6">
        <div>
          <h1 className="text-2xl font-bold text-text">Profile &amp; Settings</h1>
          <p className="text-sm text-text-muted mt-1">Manage your account, security and preferences</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={toggleDark}
            className="w-10 h-10 rounded-full bg-surface border border-border flex items-center justify-center text-text-muted hover:text-text transition-colors"
          >
            {darkMode ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>
          <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
            <span className="text-sm font-bold text-primary">{p.initials}</span>
          </div>
        </div>
      </div>

      {/* Member card */}
      <div className="bg-surface border border-border rounded-2xl p-4 mb-6 flex items-center justify-between">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-base font-bold text-primary">{p.initials}</span>
          </div>
          <div>
            <p className="text-base font-bold text-text">{p.fullName}</p>
            <p className="text-xs text-text-muted mt-0.5">Member ID {p.memberId} • Joined {p.joinedDate}</p>
          </div>
        </div>
        <span className="text-xs font-medium text-primary bg-primary-soft px-3 py-1 rounded-full border border-primary/30">
          {p.role}
        </span>
      </div>

      {/* Tab bar */}
      <div className="flex gap-2 mb-6 flex-wrap">
        {TABS.map(({ value, label }) => (
          <button
            key={value}
            onClick={() => setActiveTab(value)}
            className={activeTab === value
              ? 'bg-primary/10 text-primary border border-primary/30 rounded-full px-4 py-1.5 text-sm font-semibold'
              : 'bg-surface border border-border text-text-muted rounded-full px-4 py-1.5 text-sm hover:border-primary/40 hover:text-text transition-colors'}
          >
            {label}
          </button>
        ))}
      </div>

      {/* Tab content */}
      {activeTab === 'profile'   && <ProfileTab />}
      {activeTab === 'bank'      && <BankTab />}
      {activeTab === 'security'  && (
        <SecurityTab twoFA={twoFA} setTwoFA={setTwoFA} />
      )}
      {activeTab === 'addresses' && <AddressesTab />}
      {activeTab === 'language'  && (
        <LanguageTab
          darkMode={darkMode}     toggleDark={toggleDark}
          language={language}     setLanguage={setLanguage}
          emailNotif={emailNotif} setEmailNotif={setEmailNotif}
          smsNotif={smsNotif}     setSmsNotif={setSmsNotif}
          pushNotif={pushNotif}   setPushNotif={setPushNotif}
        />
      )}
    </div>
  );
}
