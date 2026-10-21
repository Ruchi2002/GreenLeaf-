'use client';

import { useState, useEffect } from 'react';
import { getSCOrders } from '@/services/scOrderService';
import type { SCOrder } from '@/data/mock/scOrders';

export function useSCOrders() {
  const [orders,  setOrders]  = useState<SCOrder[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getSCOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return { orders, loading };
}
