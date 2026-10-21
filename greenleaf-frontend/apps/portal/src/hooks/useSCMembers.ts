'use client';

import { useState, useEffect } from 'react';
import { getSCMembers } from '@/services/scMemberService';
import type { SCMember } from '@/data/mock/scMembers';

export function useSCMembers() {
  const [members, setMembers] = useState<SCMember[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSCMembers().then((data) => {
      setMembers(data);
      setLoading(false);
    });
  }, []);

  return { members, loading, setMembers };
}
