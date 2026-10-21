// MOCK ONLY — BACKEND_REQUIRED_LATER

import { MOCK_MEMBER, MOCK_SERVICE_CENTER } from '@/data/mock/member';
import type { MembeRProfile, ServiceCenter } from '@/types/member';

// PROPOSED FRONTEND CONTRACT:
// GET /member/me           → MembeRProfile
// GET /member/service-center → ServiceCenter (for members linked to an SC)

export async function getMembeRProfile(): Promise<MembeRProfile> {
  return MOCK_MEMBER;
}

export async function getServiceCenter(): Promise<ServiceCenter> {
  return MOCK_SERVICE_CENTER;
}
