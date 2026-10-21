'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useRouter } from 'next/navigation';
import { myTree } from '@/data/mock/networkTree';

const openSlots: { position: string; under: string }[] = [];
if (!myTree.left)                        openSlots.push({ position: 'Left',  under: myTree.name });
if (!myTree.right)                       openSlots.push({ position: 'Right', under: myTree.name });
if (myTree.left  && !myTree.left.left)   openSlots.push({ position: 'Left',  under: myTree.left.name });
if (myTree.left  && !myTree.left.right)  openSlots.push({ position: 'Right', under: myTree.left.name });
if (myTree.right && !myTree.right.left)  openSlots.push({ position: 'Left',  under: myTree.right.name });
if (myTree.right && !myTree.right.right) openSlots.push({ position: 'Right', under: myTree.right.name });

export function PositionsContent() {
  const router = useRouter();

  return (
    <div className="space-y-2">
      {openSlots.map((pos, i) => (
        <div
          key={i}
          className="bg-surface border border-border rounded-2xl px-5 py-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3"
        >
          <div>
            <p className="text-sm font-semibold text-text">{pos.position} Position</p>
            <p className="text-xs text-text-muted mt-0.5">Under: {pos.under}</p>
          </div>
          <button
            onClick={() => router.push('/sc/register-member')}
            className="bg-primary text-[#0b1410] font-semibold text-sm px-5 py-2 rounded-xl hover:opacity-90 sm:shrink-0 w-full sm:w-auto"
          >
            Register here
          </button>
        </div>
      ))}
      {openSlots.length === 0 && (
        <div className="bg-surface border border-border rounded-2xl p-12 text-center">
          <p className="text-text-muted text-sm">No open positions available</p>
        </div>
      )}
    </div>
  );
}
