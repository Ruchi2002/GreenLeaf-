// MOCK ONLY — BACKEND_REQUIRED_LATER
// When backend is ready: replace function bodies with real API calls.
// Signatures and return types must not change — only the implementation inside.

import { MOCK_CODE_LOOKUP } from '@/data/mock/scRegister';
import type { MemberCodeLookup, MemberRegistrationForm } from '@/data/mock/scRegister';

// PROPOSED FRONTEND CONTRACT:
// GET  /sc/member/lookup?code=RP12345678  → MemberCodeLookup | null
// POST /sc/member/register                → { memberId: string }

export async function lookupMemberCode(code: string): Promise<MemberCodeLookup | null> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 400));
  return MOCK_CODE_LOOKUP[code] ?? null;
}

export async function registerMember(form: MemberRegistrationForm): Promise<{ memberId: string }> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  void form;
  await new Promise((r) => setTimeout(r, 1000));
  const id = 'RP' + Math.floor(Math.random() * 90000000 + 10000000);
  return { memberId: id };
}
