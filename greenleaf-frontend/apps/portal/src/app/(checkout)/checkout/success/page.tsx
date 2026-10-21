'use client';

import { useRouter } from 'next/navigation';
import { Check } from 'lucide-react';

// MOCK ONLY — BACKEND_REQUIRED_LATER
const MOCK_SUCCESS = {
  orderNumber: 'FX2225112816089627',
  items: [
    { name: '275 PV Gift Bag', qty: 1, price: 410000, pv: 275 },
  ],
  totalPaid: 410000,
  totalPV: 275,
};

function formatRupiah(amount: number) {
  return 'RP ' + amount.toLocaleString('id-ID');
}

export default function PaymentSuccessPage() {
  const router = useRouter();

  return (
    <div className="min-h-screen bg-background flex flex-col items-center justify-center px-4">
      <div className="w-full max-w-md flex flex-col items-center">

        {/* Green checkmark circle */}
        <div className="w-16 h-16 rounded-full bg-primary flex items-center justify-center mb-5 shadow-lg">
          <Check size={32} className="text-[#0b1410]" strokeWidth={3} />
        </div>

        {/* Title + order number */}
        <h1 className="text-2xl font-bold text-text mb-1">Payment successful</h1>
        <p className="text-sm text-text-muted mb-6">Order #{MOCK_SUCCESS.orderNumber}</p>

        {/* Order summary card */}
        <div className="w-full bg-surface border border-border rounded-2xl px-5 py-4 mb-4">
          {MOCK_SUCCESS.items.map((item, i) => (
            <div key={i} className="flex justify-between items-baseline text-sm mb-2 last:mb-0">
              <span className="text-text">
                {item.name}{' '}
                <span className="text-primary font-semibold">× {item.qty}</span>
              </span>
              <span className="text-text font-medium">{formatRupiah(item.price)}</span>
            </div>
          ))}

          <div className="border-t border-border mt-3 pt-3 flex justify-between items-baseline">
            <span className="text-sm font-bold text-text">Total paid</span>
            <span className="text-sm font-bold text-text">{formatRupiah(MOCK_SUCCESS.totalPaid)}</span>
          </div>
        </div>

        {/* PV banner */}
        <div className="w-full bg-gold/10 border border-gold/30 rounded-xl px-5 py-3 mb-5 text-center">
          <span className="text-sm font-semibold text-gold">
            +{MOCK_SUCCESS.totalPV} PV added to your account
          </span>
        </div>

        {/* Action buttons */}
        <div className="w-full flex gap-3">
          <button
            onClick={() => router.push('/orders')}
            className="flex-1 py-3 rounded-xl border border-border bg-surface text-sm font-semibold text-text hover:bg-primary-soft transition-colors"
          >
            View order
          </button>
          <button
            onClick={() => router.push('/shop')}
            className="flex-1 py-3 rounded-xl bg-primary text-[#0b1410] text-sm font-semibold hover:bg-primary/90 transition-colors"
          >
            Continue shopping
          </button>
        </div>

      </div>
    </div>
  );
}
