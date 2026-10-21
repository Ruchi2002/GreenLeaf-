'use client';

import { useState, useEffect } from 'react';
import type { Order, OrderStatus } from '@/data/mock/orders';
import { getOrders, getOrderById, getOrdersByStatus } from '@/services/orderService';

export function useOrders() {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    getOrders().then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, []);

  return { orders, loading };
}

export function useOrder(id: string) {
  const [order,   setOrder]   = useState<Order | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!id) return;
    getOrderById(id).then((data) => {
      setOrder(data);
      setLoading(false);
    });
  }, [id]);

  return { order, loading };
}

export function useOrdersByStatus(status: OrderStatus | 'all') {
  const [orders,  setOrders]  = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetch = status === 'all' ? getOrders() : getOrdersByStatus(status);
    fetch.then((data) => {
      setOrders(data);
      setLoading(false);
    });
  }, [status]);

  return { orders, loading };
}
