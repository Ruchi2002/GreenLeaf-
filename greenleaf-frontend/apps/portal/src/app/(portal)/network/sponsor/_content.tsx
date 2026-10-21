'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState } from 'react';
import { ChevronRight } from 'lucide-react';
import { MOCK_SPONSOR_TREE, MOCK_LAYER_MEMBERS } from '@/data/mock/network';
import type { SponsorNode } from '@/data/mock/network';

function SponsorTreeNode({ node, depth = 0 }: { node: SponsorNode; depth?: number }) {
  const [expanded, setExpanded] = useState(true);
  const hasChildren = node.children.length > 0;

  return (
    <div className={depth > 0 ? 'ml-8 mt-3' : ''}>
      <div className="flex items-center gap-3 bg-surface border border-border rounded-2xl px-4 py-3 w-fit min-w-[220px] hover:border-primary/40 transition-colors">
        <div className="w-9 h-9 rounded-full bg-primary-soft border border-primary/30 flex items-center justify-center shrink-0">
          <span className="text-xs font-bold text-primary">{node.initials}</span>
        </div>
        <div className="flex-1 min-w-0">
          <p className="text-sm font-semibold text-text truncate">{node.name}</p>
          <p className="text-[10px] text-text-muted">{node.memberId}</p>
          <p className="text-[10px] text-primary mt-0.5">{node.personalPV} PV · Joined {node.joinDate}</p>
        </div>
        {hasChildren && (
          <button onClick={() => setExpanded((e) => !e)} className="text-text-muted hover:text-primary transition-colors">
            <ChevronRight size={16} className={`transition-transform duration-200 ${expanded ? 'rotate-90' : ''}`} />
          </button>
        )}
      </div>
      {hasChildren && expanded && (
        <div className="relative ml-4 mt-0">
          <div className="absolute left-0 top-0 bottom-4 w-px bg-border/50" />
          {node.children.map((child) => (
            <div key={child.id} className="relative">
              <div className="absolute left-0 top-6 w-4 h-px bg-border/50" />
              <SponsorTreeNode node={child} depth={depth + 1} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export function SponsorTreeContent() {
  return (
    <div className="bg-primary/5 border border-border rounded-2xl p-6 overflow-x-auto">
      <div className="flex items-center justify-between mb-5">
        <div>
          <p className="text-sm font-semibold text-text">Sponsor Network</p>
          <p className="text-xs text-text-muted mt-0.5">Your direct and indirect recruits</p>
        </div>
        <span className="bg-primary-soft text-primary text-xs px-3 py-1 rounded-full border border-primary/30">
          {MOCK_SPONSOR_TREE.children.length} direct · {MOCK_LAYER_MEMBERS.length} total
        </span>
      </div>
      <SponsorTreeNode node={MOCK_SPONSOR_TREE} />
    </div>
  );
}
