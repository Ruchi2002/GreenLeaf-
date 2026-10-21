'use client';

import { useState, useEffect } from 'react';
import { getProducts, getProductBySlug } from '@/services/productService';
import type { Product, ProductDetail } from '@/types/product';

interface AsyncState<T> {
  data:      T;
  isLoading: boolean;
  isError:   boolean;
}

export function useProducts(): AsyncState<Product[]> {
  const [state, setState] = useState<AsyncState<Product[]>>({
    data: [], isLoading: true, isError: false,
  });

  useEffect(() => {
    getProducts()
      .then((data) => setState({ data, isLoading: false, isError: false }))
      .catch(() => setState({ data: [], isLoading: false, isError: true }));
  }, []);

  return state;
}

export function useProduct(slug: string): AsyncState<ProductDetail | null> {
  const [state, setState] = useState<AsyncState<ProductDetail | null>>({
    data: null, isLoading: true, isError: false,
  });

  useEffect(() => {
    if (!slug) return;
    setState((s) => ({ ...s, isLoading: true }));
    getProductBySlug(slug)
      .then((data) => setState({ data, isLoading: false, isError: false }))
      .catch(() => setState({ data: null, isLoading: false, isError: true }));
  }, [slug]);

  return state;
}
