'use client';

import { useState, useEffect } from 'react';
import { getShippingOptions, getPaymentMethods, getSavedAddresses } from '@/services/checkoutService';
import type { ShippingOption, PaymentMethod, CheckoutAddress } from '@/data/mock/checkout';

export function useCheckoutOptions() {
  const [shippingOptions, setShippingOptions] = useState<ShippingOption[]>([]);
  const [paymentMethods,  setPaymentMethods]  = useState<PaymentMethod[]>([]);
  const [addresses,       setAddresses]       = useState<CheckoutAddress[]>([]);
  const [loading,         setLoading]         = useState(true);

  useEffect(() => {
    Promise.all([getShippingOptions(), getPaymentMethods(), getSavedAddresses()])
      .then(([shipping, payment, addrs]) => {
        setShippingOptions(shipping);
        setPaymentMethods(payment);
        setAddresses(addrs);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  return { shippingOptions, paymentMethods, addresses, loading };
}
