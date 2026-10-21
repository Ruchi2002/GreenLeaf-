// MOCK ONLY — BACKEND_REQUIRED_LATER
// Single source of truth for the authenticated member's profile.

import type { MembeRProfile, ServiceCenter } from '@/types/member';

export const MOCK_MEMBER: MembeRProfile = {
  id:        'RP97850827',
  name:      'Rohit Hegde',
  phone:     '+91 98765-43210',
  cardLevel: 'Platinum',
  rank:      'Silver',
  addresses: [
    {
      id: 'addr1', label: 'Home', isDefault: true,
      name:     'Rohit Hegde',
      phone:    '+91 98765-43210',
      street:   '12 Linking Road, Bandra West',
      city:     'Mumbai',
      province: 'Maharashtra',
      postal:   '400050',
    },
    {
      id: 'addr2', label: 'Office', isDefault: false,
      name:     'Rohit Hegde',
      phone:    '+91 98765-43210',
      street:   '88 MG Road, 3rd Floor',
      city:     'Bangalore',
      province: 'Karnataka',
      postal:   '560001',
    },
  ],
};

export const MOCK_SERVICE_CENTER: ServiceCenter = {
  id:       'SC-MUM-001',
  name:     'Greenleaf Jakarta Selatan',
  street:   '45 Nariman Point',
  city:     'Mumbai',
  province: 'Maharashtra',
  verified: true,
};
