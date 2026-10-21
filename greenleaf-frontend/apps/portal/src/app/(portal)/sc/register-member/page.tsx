'use client';

import { useState, useEffect, useRef } from 'react';
import { Eye, EyeOff, Leaf } from 'lucide-react';
import { cn } from '@/lib/utils';
import { EMPTY_FORM, MOCK_PLACEMENT_PV } from '@/data/mock/scRegister';
import type { MemberRegistrationForm, MemberCodeLookup } from '@/data/mock/scRegister';
import { lookupMemberCode, registerMember } from '@/services/scRegisterService';

// ─── Step Indicator ──────────────────────────────────────────────────────────

const STEPS = ['Personal', 'Placement', 'Security', 'Review'] as const;

function StepIndicator({ current }: { current: number }) {
  return (
    <div className="flex items-center mb-8">
      {STEPS.map((label, i) => {
        const num = i + 1;
        const done   = num < current;
        const active = num === current;
        return (
          <div key={label} className="flex items-center">
            <div className="flex flex-col items-center">
              <div className={cn(
                'w-8 h-8 rounded-full flex items-center justify-center text-sm font-bold border-2 transition-colors',
                done || active
                  ? 'bg-primary border-primary text-[#0b1410]'
                  : 'bg-bg border-border text-text-muted'
              )}>
                {num}
              </div>
              <span className={cn(
                'text-xs mt-1 whitespace-nowrap hidden sm:block',
                active ? 'font-bold text-text' : done ? 'text-text' : 'text-text-muted'
              )}>
                {label}
              </span>
            </div>
            {i < STEPS.length - 1 && (
              <div className={cn(
                'h-px flex-1 mx-2 mb-5 min-w-[32px]',
                done ? 'bg-primary' : 'bg-border'
              )} />
            )}
          </div>
        );
      })}
    </div>
  );
}

// ─── Field helpers ────────────────────────────────────────────────────────────

function Field({ label, error, children }: { label: string; error?: string; children: React.ReactNode }) {
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text">{label}</label>
      {children}
      {error && <span className="text-xs text-red-500">{error}</span>}
    </div>
  );
}

const inputCls = 'border border-border rounded-lg px-4 py-2.5 w-full focus:outline-none focus:ring-2 focus:ring-primary/40 text-sm bg-bg text-text placeholder:text-text-muted';

// ─── Code lookup widget ───────────────────────────────────────────────────────

function CodeLookupField({
  label,
  value,
  onChange,
  resolved,
  notFound,
}: {
  label: string;
  value: string;
  onChange: (v: string, info: MemberCodeLookup | null) => void;
  resolved: MemberCodeLookup | null;
  notFound: boolean;
}) {
  const timerRef = useRef<ReturnType<typeof setTimeout> | null>(null);

  function handleChange(v: string) {
    onChange(v, null);
    if (timerRef.current) clearTimeout(timerRef.current);
    if (v.length >= 3) {
      timerRef.current = setTimeout(async () => {
        const info = await lookupMemberCode(v);
        onChange(v, info);
      }, 400);
    }
  }

  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text">{label}</label>
      <input
        className={inputCls}
        value={value}
        onChange={(e) => handleChange(e.target.value)}
        placeholder="e.g. RP97850827"
      />
      {resolved && (
        <div className="flex items-center gap-2 mt-1">
          <div className="w-6 h-6 rounded-full bg-primary-soft flex items-center justify-center shrink-0">
            <span className="text-[10px] font-bold text-primary">{resolved.initials}</span>
          </div>
          <span className="text-xs text-primary font-medium">{resolved.name}</span>
        </div>
      )}
      {notFound && !resolved && value.length >= 3 && (
        <span className="text-xs text-red-500">Member not found</span>
      )}
    </div>
  );
}

// ─── Password field with show/hide ────────────────────────────────────────────

function PasswordField({
  label,
  value,
  onChange,
  placeholder,
  inputMode,
  maxLength,
}: {
  label: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  inputMode?: React.HTMLAttributes<HTMLInputElement>['inputMode'];
  maxLength?: number;
}) {
  const [show, setShow] = useState(false);
  return (
    <div className="flex flex-col gap-1">
      <label className="text-sm font-medium text-text">{label}</label>
      <div className="relative">
        <input
          type={show ? 'text' : 'password'}
          inputMode={inputMode}
          maxLength={maxLength}
          value={value}
          onChange={(e) => onChange(e.target.value)}
          placeholder={placeholder}
          className={cn(inputCls, 'pr-10')}
        />
        <button
          type="button"
          onClick={() => setShow((s) => !s)}
          className="absolute right-3 top-1/2 -translate-y-1/2 text-text-muted hover:text-text"
        >
          {show ? <EyeOff size={16} /> : <Eye size={16} />}
        </button>
      </div>
    </div>
  );
}

function passwordStrength(pw: string): { level: 'weak' | 'fair' | 'strong'; label: string; barCls: string; widthCls: string } {
  const hasUpper  = /[A-Z]/.test(pw);
  const hasLower  = /[a-z]/.test(pw);
  const hasNumber = /[0-9]/.test(pw);
  if (pw.length >= 8 && hasUpper && hasLower && hasNumber) {
    return { level: 'strong', label: 'Strong — 8+ characters, upper/lowercase and a number', barCls: 'bg-primary',   widthCls: 'w-full'  };
  }
  if (pw.length >= 6) {
    return { level: 'fair',   label: 'Fair — add uppercase and numbers to strengthen',       barCls: 'bg-amber-400', widthCls: 'w-2/4'   };
  }
  return        { level: 'weak',   label: 'Weak — minimum 8 characters',                         barCls: 'bg-red-400',   widthCls: 'w-1/4'   };
}

// ─── Main page ────────────────────────────────────────────────────────────────

export default function RegisterMembeRPage() {
  const [step,          setStep]          = useState<1 | 2 | 3 | 4 | 5>(1);
  const [form,          setForm]          = useState<MemberRegistrationForm>(EMPTY_FORM);
  const [sponsorInfo,   setSponsorInfo]   = useState<MemberCodeLookup | null>(null);
  const [placementInfo, setPlacementInfo] = useState<MemberCodeLookup | null>(null);
  const [sponsorNotFound,   setSponsorNotFound]   = useState(false);
  const [placementNotFound, setPlacementNotFound] = useState(false);
  const [registeredId,  setRegisteredId]  = useState('');
  const [submitting,    setSubmitting]    = useState(false);
  const [errors,        setErrors]        = useState<Partial<Record<keyof MemberRegistrationForm, string>>>({});

  // Pre-fill sponsor + placement with SC's own code on mount
  useEffect(() => {
    const SC_CODE = 'RP97850827';
    setForm((f) => ({ ...f, sponsorCode: SC_CODE, placementCode: SC_CODE }));
    lookupMemberCode(SC_CODE).then((info) => {
      setSponsorInfo(info);
      setPlacementInfo(info);
    });
  }, []);

  function patchForm(patch: Partial<MemberRegistrationForm>) {
    setForm((f) => ({ ...f, ...patch }));
  }

  // ── Step 1 validation ──────────────────────────────────────────────────────

  function validateStep1(): boolean {
    const required: (keyof MemberRegistrationForm)[] = [
      'givenName', 'surname', 'phone', 'email', 'gender', 'area', 'state', 'streetAddress',
    ];
    const next: typeof errors = {};
    for (const key of required) {
      if (!form[key]) next[key] = 'Required';
    }
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Step 2 validation ──────────────────────────────────────────────────────

  function validateStep2(): boolean {
    if (!form.placementArea) {
      setErrors({ placementArea: 'Please choose a placement area' });
      return false;
    }
    setErrors({});
    return true;
  }

  // ── Step 3 validation ──────────────────────────────────────────────────────

  function validateStep3(): boolean {
    const next: typeof errors = {};
    if (form.loginPassword.length < 8) next.loginPassword = 'Minimum 8 characters';
    if (form.confirmPassword !== form.loginPassword) next.confirmPassword = 'Passwords do not match';
    if (form.paymentPassword.length !== 6) next.paymentPassword = 'Must be exactly 6 digits';
    setErrors(next);
    return Object.keys(next).length === 0;
  }

  // ── Submit ─────────────────────────────────────────────────────────────────

  async function handleSubmit() {
    setSubmitting(true);
    try {
      // MOCK ONLY — BACKEND_REQUIRED_LATER
      const result = await registerMember(form);
      setRegisteredId(result.memberId);
      setStep(5);
    } finally {
      setSubmitting(false);
    }
  }

  // ── Sponsor / placement lookup handlers ───────────────────────────────────

  function handleSponsorChange(v: string, info: MemberCodeLookup | null) {
    patchForm({ sponsorCode: v });
    setSponsorInfo(info);
    setSponsorNotFound(v.length >= 3 && info === null);
  }

  function handlePlacementChange(v: string, info: MemberCodeLookup | null) {
    patchForm({ placementCode: v });
    setPlacementInfo(info);
    setPlacementNotFound(v.length >= 3 && info === null);
  }

  const strength = passwordStrength(form.loginPassword);

  // ──────────────────────────────────────────────────────────────────────────

  return (
    <div className="pt-14 w-full">
      {/* Page header */}
      <div className="mb-6">
        <h1 className="text-2xl font-bold text-text">Register New Member</h1>
        <p className="text-sm text-text-muted mt-0.5">A few steps to bring a new member onboard</p>
      </div>

      {/* Step indicator */}
      {step !== 5 && <StepIndicator current={step} />}

      {/* Card */}
      <div className="bg-surface border border-border rounded-2xl shadow-sm p-4 sm:p-8 w-full">

        {/* ── Step 1: Personal Details ── */}
        {step === 1 && (
          <div>
            <h2 className="text-lg font-semibold text-text mb-6">Personal Details</h2>

            <div className="flex flex-col gap-4">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Given name" error={errors.givenName}>
                  <input className={cn(inputCls, errors.givenName && 'border-red-400')} placeholder="e.g. Siti"
                    value={form.givenName} onChange={(e) => patchForm({ givenName: e.target.value })} />
                </Field>
                <Field label="Surname" error={errors.surname}>
                  <input className={cn(inputCls, errors.surname && 'border-red-400')} placeholder="e.g. Rahayu"
                    value={form.surname} onChange={(e) => patchForm({ surname: e.target.value })} />
                </Field>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <Field label="Phone (+62)" error={errors.phone}>
                  <input className={cn(inputCls, errors.phone && 'border-red-400')} placeholder="812-3456-7890"
                    value={form.phone} onChange={(e) => patchForm({ phone: e.target.value })} />
                </Field>
                <Field label="ID card / passport number" error={errors.idCard}>
                  <input className={cn(inputCls, errors.idCard && 'border-red-400')} placeholder="e.g. 3204xxxxxxxx0001"
                    value={form.idCard} onChange={(e) => patchForm({ idCard: e.target.value })} />
                </Field>
              </div>

              <Field label="Email" error={errors.email}>
                <input type="email" className={cn(inputCls, errors.email && 'border-red-400')} placeholder="name@example.com"
                  value={form.email} onChange={(e) => patchForm({ email: e.target.value })} />
              </Field>

              {/* Gender toggle */}
              <div className="flex flex-col gap-1">
                <span className="text-sm font-medium text-text">Gender</span>
                <div className="flex gap-3">
                  {(['female', 'male'] as const).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => patchForm({ gender: g })}
                      className={cn(
                        'px-5 py-1.5 rounded-full text-sm border transition-colors capitalize',
                        form.gender === g
                          ? 'bg-primary-soft border-primary text-primary font-medium'
                          : 'bg-bg border-border text-text-muted hover:border-primary/40'
                      )}
                    >
                      {g.charAt(0).toUpperCase() + g.slice(1)}
                    </button>
                  ))}
                </div>
                {errors.gender && <span className="text-xs text-red-500">{errors.gender}</span>}
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                <Field label="Area" error={errors.area}>
                  <input className={cn(inputCls, errors.area && 'border-red-400')} placeholder="e.g. Jakarta Selatan"
                    value={form.area} onChange={(e) => patchForm({ area: e.target.value })} />
                </Field>
                <Field label="State" error={errors.state}>
                  <input className={cn(inputCls, errors.state && 'border-red-400')} placeholder="e.g. DKI Jakarta"
                    value={form.state} onChange={(e) => patchForm({ state: e.target.value })} />
                </Field>
                <Field label="Street address" error={errors.streetAddress}>
                  <input className={cn(inputCls, errors.streetAddress && 'border-red-400')} placeholder="e.g. Jl. Melati No. 12"
                    value={form.streetAddress} onChange={(e) => patchForm({ streetAddress: e.target.value })} />
                </Field>
              </div>
            </div>

            <div className="flex justify-end mt-8">
              <button
                onClick={() => { if (validateStep1()) { setErrors({}); setStep(2); } }}
                className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 2: Network Placement ── */}
        {step === 2 && (
          <div>
            <h2 className="text-lg font-semibold text-text mb-6">Network Placement</h2>

            <div className="flex flex-col gap-4">
              <CodeLookupField
                label="Sponsor code"
                value={form.sponsorCode}
                onChange={handleSponsorChange}
                resolved={sponsorInfo}
                notFound={sponsorNotFound}
              />
              <CodeLookupField
                label="Placement code"
                value={form.placementCode}
                onChange={handlePlacementChange}
                resolved={placementInfo}
                notFound={placementNotFound}
              />

              {/* Placement area cards */}
              <div>
                <p className="text-sm font-medium text-text mt-4 mb-2">Choose placement area</p>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  {(['left', 'right'] as const).map((side) => {
                    const selected = form.placementArea === side;
                    const pv = MOCK_PLACEMENT_PV[side];
                    return (
                      <button
                        key={side}
                        type="button"
                        onClick={() => patchForm({ placementArea: side })}
                        className={cn(
                          'rounded-xl p-5 border-2 transition-all text-center',
                          selected ? 'border-primary bg-primary-soft' : 'border-border bg-bg hover:border-primary/40'
                        )}
                      >
                        {/* Two dots */}
                        <div className="flex justify-center gap-2 mb-3">
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            side === 'left' ? 'bg-primary' : 'bg-gray-200 dark:bg-gray-600'
                          )} />
                          <div className={cn(
                            'w-3 h-3 rounded-full',
                            side === 'right' ? 'bg-amber-400' : 'bg-gray-200 dark:bg-gray-600'
                          )} />
                        </div>
                        <p className="font-bold text-text capitalize">{side} Area</p>
                        <p className="text-xs text-text-muted mt-1">{pv} PV currently</p>
                      </button>
                    );
                  })}
                </div>
                {errors.placementArea && (
                  <span className="text-xs text-red-500 mt-1 block">{errors.placementArea}</span>
                )}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(1)}
                className="border border-border px-6 py-2.5 rounded-xl text-text hover:border-primary/40 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => { if (validateStep2()) setStep(3); }}
                className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 3: Account Security ── */}
        {step === 3 && (
          <div>
            <h2 className="text-lg font-semibold text-text mb-6">Account Security</h2>

            <div className="flex flex-col gap-6">
              {/* Login password */}
              <div className="flex flex-col gap-1">
                <PasswordField
                  label="Login password"
                  value={form.loginPassword}
                  onChange={(v) => patchForm({ loginPassword: v })}
                  placeholder="Enter password"
                />
                {form.loginPassword && (
                  <>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-1">
                      <div className={cn('h-full rounded-full transition-all', strength.barCls, strength.widthCls)} />
                    </div>
                    <p className="text-xs text-text-muted">{strength.label}</p>
                  </>
                )}
                {errors.loginPassword && <span className="text-xs text-red-500">{errors.loginPassword}</span>}
              </div>

              {/* Confirm password */}
              <div className="flex flex-col gap-1">
                <PasswordField
                  label="Confirm login password"
                  value={form.confirmPassword}
                  onChange={(v) => patchForm({ confirmPassword: v })}
                  placeholder="Re-enter password"
                />
                {errors.confirmPassword && (
                  <span className="text-xs text-red-500">{errors.confirmPassword}</span>
                )}
              </div>

              {/* Payment password */}
              <div className="flex flex-col gap-1">
                <PasswordField
                  label="Payment password (6 digits)"
                  value={form.paymentPassword}
                  onChange={(v) => { if (/^\d*$/.test(v) && v.length <= 6) patchForm({ paymentPassword: v }); }}
                  placeholder="6-digit PIN"
                  inputMode="numeric"
                  maxLength={6}
                />
                {form.paymentPassword && (
                  <>
                    <div className="h-1.5 w-full bg-border rounded-full overflow-hidden mt-1">
                      <div
                        className="h-full rounded-full bg-amber-400 transition-all"
                        style={{ width: `${(form.paymentPassword.length / 6) * 100}%` }}
                      />
                    </div>
                  </>
                )}
                <p className="text-xs text-text-muted">Used to confirm all payments</p>
                {errors.paymentPassword && <span className="text-xs text-red-500">{errors.paymentPassword}</span>}
              </div>
            </div>

            <div className="flex justify-between mt-8">
              <button
                onClick={() => setStep(2)}
                className="border border-border px-6 py-2.5 rounded-xl text-text hover:border-primary/40 transition-colors"
              >
                Back
              </button>
              <button
                onClick={() => { if (validateStep3()) setStep(4); }}
                className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Continue
              </button>
            </div>
          </div>
        )}

        {/* ── Step 4: Review ── */}
        {step === 4 && (
          <div>
            <h2 className="text-lg font-semibold text-text mb-6">Review</h2>

            {/* Personal details summary */}
            <div className="border border-border rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-text">Personal Details</span>
                <button onClick={() => setStep(1)} className="text-primary text-sm hover:underline">Edit</button>
              </div>
              <p className="text-sm text-text">{form.givenName} {form.surname}</p>
              <p className="text-sm text-text-muted mt-0.5">+62{form.phone} · {form.email}</p>
              <p className="text-sm text-text-muted mt-0.5">{form.streetAddress}, {form.area}, {form.state}</p>
            </div>

            {/* Network placement summary */}
            <div className="border border-border rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-text">Network Placement</span>
                <button onClick={() => setStep(2)} className="text-primary text-sm hover:underline">Edit</button>
              </div>
              <p className="text-sm text-text-muted">
                Sponsor: {sponsorInfo?.name ?? form.sponsorCode} · Placement: {placementInfo?.name ?? form.placementCode} · Area:{' '}
                {form.placementArea === 'left' ? 'Left Area' : form.placementArea === 'right' ? 'Right Area' : '—'}
              </p>
            </div>

            {/* Account security summary */}
            <div className="border border-border rounded-xl p-5 mb-4">
              <div className="flex items-center justify-between mb-2">
                <span className="font-semibold text-text">Account Security</span>
                <button onClick={() => setStep(3)} className="text-primary text-sm hover:underline">Edit</button>
              </div>
              <p className="text-sm text-text-muted">
                Login password: {'•'.repeat(8)} · Payment password: {'•'.repeat(6)}
              </p>
            </div>

            <div className="flex justify-between mt-6">
              <button
                onClick={() => setStep(3)}
                className="border border-border px-6 py-2.5 rounded-xl text-text hover:border-primary/40 transition-colors"
              >
                Back
              </button>
              <button
                onClick={handleSubmit}
                disabled={submitting}
                className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 disabled:opacity-60 transition-colors flex items-center gap-2"
              >
                {submitting && (
                  <span className="w-4 h-4 rounded-full border-2 border-[#0b1410] border-t-transparent animate-spin" />
                )}
                Register member
              </button>
            </div>
          </div>
        )}

        {/* ── Step 5: Success ── */}
        {step === 5 && (
          <div className="flex flex-col items-center py-8">
            {/* Leaf icon circle */}
            <div className="w-24 h-24 rounded-full bg-amber-50 flex items-center justify-center mb-6">
              <Leaf size={40} className="text-primary" />
            </div>

            <h2 className="text-2xl font-bold text-text text-center">Member registered!</h2>
            <p className="text-sm text-text-muted text-center mt-1">
              New Member ID <span className="font-semibold text-text">{registeredId}</span>
            </p>

            {/* Pending activation badge */}
            <span className="mt-3 bg-amber-50 text-amber-700 border border-amber-200 rounded-full px-3 py-1 text-xs">
              Pending activation
            </span>

            {/* Actions */}
            <div className="flex gap-3 justify-center mt-8 flex-wrap">
              <button
                onClick={() => console.log('TODO: navigate to member list')}
                className="border border-border rounded-xl px-6 py-2.5 text-text font-medium hover:bg-bg transition-colors"
              >
                View member list
              </button>
              <button
                onClick={() => console.log('TODO: buy starter package')}
                className="bg-primary text-[#0b1410] font-semibold px-6 py-2.5 rounded-xl hover:bg-primary/90 transition-colors"
              >
                Buy starter package to activate
              </button>
            </div>
          </div>
        )}

      </div>
    </div>
  );
}
