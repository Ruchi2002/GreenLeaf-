// MOCK ONLY — BACKEND_REQUIRED_LATER
// When backend is ready: replace function bodies with real API calls.
// Signatures and return types must not change — only the implementation inside.

import { MOCK_SC_MEMBERS } from '@/data/mock/scMembers';
import type { SCMember } from '@/data/mock/scMembers';

// PROPOSED FRONTEND CONTRACT:
// GET /sc/members → SCMember[]

export async function getSCMembers(): Promise<SCMember[]> {
  // MOCK ONLY — BACKEND_REQUIRED_LATER
  await new Promise((r) => setTimeout(r, 300));
  return MOCK_SC_MEMBERS;
}
