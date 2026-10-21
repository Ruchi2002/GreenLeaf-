'use client';

import { useState, useEffect } from 'react';
import { getMembeRProfile, getServiceCenter } from '@/services/memberService';
import type { MembeRProfile, ServiceCenter } from '@/types/member';

export function useMember() {
  const [data,      setData]      = useState<MembeRProfile | null>(null);
  const [isLoading, setLoading]   = useState(true);
  const [isError,   setError]     = useState(false);

  useEffect(() => {
    getMembeRProfile()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return { data, isLoading, isError };
}

export function useServiceCenter() {
  const [data,      setData]    = useState<ServiceCenter | null>(null);
  const [isLoading, setLoading] = useState(true);
  const [isError,   setError]   = useState(false);

  useEffect(() => {
    getServiceCenter()
      .then((d) => { setData(d); setLoading(false); })
      .catch(() => { setError(true); setLoading(false); });
  }, []);

  return { data, isLoading, isError };
}
