'use client';

import { useSearchParams, useRouter } from 'next/navigation';
import { BinaryTreeContent }  from './binary/_content';
import { SponsorTreeContent } from './sponsor/_content';
import { PositionsContent }   from './positions/_content';

type NetworkTab = 'binary' | 'sponsor' | 'positions';

const TABS: { id: NetworkTab; label: string }[] = [
  { id: 'binary',    label: 'Binary Tree'        },
  { id: 'sponsor',   label: 'Sponsor Tree'        },
  { id: 'positions', label: 'Available Positions' },
];

export default function NetworkContent() {
  const searchParams = useSearchParams();
  const router       = useRouter();
  const raw          = searchParams.get('tab') as NetworkTab | null;
  const activeTab: NetworkTab =
    raw && ['binary', 'sponsor', 'positions'].includes(raw) ? raw : 'binary';

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">My Network</h1>
        <p className="text-sm text-text-muted mt-0.5">Binary tree, sponsor network and available positions</p>
      </div>

      <div className="flex gap-1 bg-surface border border-border rounded-xl p-1 mb-6 overflow-x-auto [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
        {TABS.map((t) => (
          <button
            key={t.id}
            onClick={() => router.push(`/network?tab=${t.id}`)}
            className={`shrink-0 sm:flex-1 rounded-lg px-3 py-2 text-xs font-medium whitespace-nowrap transition-colors ${
              activeTab === t.id
                ? 'bg-primary text-[#0b1410]'
                : 'text-text-muted hover:text-text'
            }`}
          >
            {t.label}
          </button>
        ))}
      </div>

      <div className="flex-1 flex flex-col">
        {activeTab === 'binary'    && <BinaryTreeContent />}
        {activeTab === 'sponsor'   && <SponsorTreeContent />}
        {activeTab === 'positions' && <PositionsContent />}
      </div>
    </div>
  );
}
