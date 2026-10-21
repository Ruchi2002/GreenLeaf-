'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useRef, useEffect, useCallback, useMemo } from 'react';
import { Search, ZoomIn, ZoomOut, X, ChevronLeft, ChevronRight } from 'lucide-react';
import {
  MOCK_BINARY_TREE,
  MOCK_PV_HISTORY_ENTRIES,
  MOCK_PV_MONTHLY,
} from '@/data/mock/network';
import type { BinaryNode } from '@/data/mock/network';
import { myTree } from '@/data/mock/networkTree';
import type { AvailableMember, TreeMember } from '@/data/mock/networkTree';

const MAX_MEMBERS = 10;

const RANK_BORDER: Record<string, string> = {
  platinum: 'border-[#a0c4ff]',
  gold:     'border-[#ffd700]',
  silver:   'border-[#b0b0b0]',
  bronze:   'border-[#cd7f32]',
};

const RANK_LABEL: Record<string, string> = {
  platinum: 'text-[#a0c4ff]',
  gold:     'text-[#ffd700]',
  silver:   'text-[#b0b0b0]',
  bronze:   'text-[#cd7f32]',
};

function countNodes(node: BinaryNode | null): number {
  if (!node) return 0;
  return 1 + countNodes(node.left) + countNodes(node.right);
}

function deepClone(node: BinaryNode | null): BinaryNode | null {
  if (!node) return null;
  return { ...node, left: deepClone(node.left), right: deepClone(node.right) };
}

function insertAtPath(
  root:       BinaryNode,
  parentPath: ('left' | 'right')[],
  side:       'left' | 'right',
  member:     AvailableMember,
): BinaryNode {
  const newRoot = deepClone(root) as BinaryNode;
  let cur: BinaryNode | null = newRoot;
  for (const dir of parentPath) {
    if (!cur) return newRoot;
    cur = ((cur[dir] as BinaryNode | null) ?? null);
  }
  if (!cur) return newRoot;
  cur[side] = {
    id: member.id, name: member.name, initials: member.initials,
    memberId: member.memberId, leftPV: 0, rightPV: 0, left: null, right: null,
  };
  return newRoot;
}

function deepCloneTreeMember(node: TreeMember | undefined): TreeMember | undefined {
  if (!node) return undefined;
  return { ...node, left: deepCloneTreeMember(node.left), right: deepCloneTreeMember(node.right) };
}

function insertTreeMemberAtPath(
  root:     TreeMember,
  fullPath: ('left' | 'right')[],
  newNode:  TreeMember,
): TreeMember {
  const cloned = deepCloneTreeMember(root) as TreeMember;
  const side   = fullPath[fullPath.length - 1];
  if (!side) return cloned;
  let cur: TreeMember = cloned;
  for (const dir of fullPath.slice(0, -1)) {
    const next = cur[dir] as TreeMember | undefined;
    if (!next) return cloned;
    cur = next;
  }
  cur[side] = newNode;
  return cloned;
}

function buildTreeMap(node: TreeMember, map = new Map<string, TreeMember>()): Map<string, TreeMember> {
  map.set(node.name, node);
  if (node.left)  buildTreeMap(node.left,  map);
  if (node.right) buildTreeMap(node.right, map);
  return map;
}

function toTier(rank?: string): TreeMember['tier'] {
  const cap = (rank ?? '').charAt(0).toUpperCase() + (rank ?? '').slice(1);
  if (['Diamond', 'Platinum', 'Gold', 'Silver', 'Bronze'].includes(cap)) return cap as TreeMember['tier'];
  return 'Bronze';
}

// ── NodeCard ──────────────────────────────────────────────────────────────────

function NodeCard({
  node,
  nodeRef,
  onClick,
}: {
  node:    BinaryNode;
  nodeRef: (el: HTMLDivElement | HTMLButtonElement | null) => void;
  onClick?: () => void;
}) {
  const borderClass = node.rank ? RANK_BORDER[node.rank] : 'border-border';
  const labelClass  = node.rank ? RANK_LABEL[node.rank]  : 'text-text-muted';

  return (
    <div
      ref={nodeRef}
      onClick={onClick}
      className={`relative w-[130px] rounded-xl border-2 ${borderClass} bg-surface p-3 flex flex-col items-center gap-1.5 shadow-sm cursor-pointer hover:shadow-lg hover:scale-[1.02] transition-all`}
    >
      {node.isCurrentUser && (
        <span className="absolute -top-2.5 left-1/2 -translate-x-1/2 bg-primary text-[#0b1410] text-[10px] font-bold px-2 py-0.5 rounded-full whitespace-nowrap">
          You
        </span>
      )}
      <div className="w-10 h-10 rounded-full bg-primary-soft flex items-center justify-center">
        <span className="text-sm font-bold text-primary">{node.initials}</span>
      </div>
      <p className="text-xs font-semibold text-text text-center leading-tight line-clamp-2">
        {node.name}
      </p>
      {node.rank && (
        <p className={`text-[10px] font-medium capitalize ${labelClass}`}>{node.rank}</p>
      )}
      <div className="flex gap-3 mt-0.5">
        <div className="text-center">
          <p className="text-[10px] text-text-muted">L</p>
          <p className="text-xs font-bold text-text">{node.leftPV}</p>
        </div>
        <div className="w-px bg-border" />
        <div className="text-center">
          <p className="text-[10px] text-text-muted">R</p>
          <p className="text-xs font-bold text-text">{node.rightPV}</p>
        </div>
      </div>
    </div>
  );
}

// ── OpenSlotCard ──────────────────────────────────────────────────────────────

interface SlotInfo {
  parentName: string;
  side:       'Left' | 'Right';
  parentPath: ('left' | 'right')[];
}

function OpenSlotCard({
  nodeRef,
  onClick,
  label,
}: {
  nodeRef: (el: HTMLButtonElement | null) => void;
  onClick: () => void;
  label:   string;
}) {
  return (
    <button
      ref={nodeRef}
      onClick={onClick}
      className="w-[130px] h-[110px] rounded-xl border-2 border-dashed border-primary/40 flex flex-col items-center justify-center gap-1.5 hover:border-primary hover:bg-primary-soft/30 transition-all group"
    >
      <div className="w-8 h-8 rounded-full border-2 border-dashed border-primary/40 group-hover:border-primary flex items-center justify-center transition-colors">
        <span className="text-lg text-primary leading-none">+</span>
      </div>
      <p className="text-[10px] text-primary/70 group-hover:text-primary font-medium transition-colors">{label}</p>
    </button>
  );
}

// ── Toast ─────────────────────────────────────────────────────────────────────

interface Toast { id: number; message: string }

function ToastList({ toasts }: { toasts: Toast[] }) {
  return (
    <div className="fixed top-5 right-5 z-50 flex flex-col gap-2 pointer-events-none">
      {toasts.map((t) => (
        <div
          key={t.id}
          className="bg-[#0a1f13] text-primary text-sm font-medium px-4 py-2.5 rounded-xl shadow-lg border border-primary/30"
        >
          {t.message}
        </div>
      ))}
    </div>
  );
}

// ── Binary Tree helpers ───────────────────────────────────────────────────────

type NodeRefs = Map<string, HTMLDivElement | HTMLButtonElement | null>;
interface Edge { from: string; to: string }

function collectEdges(node: BinaryNode | null, edges: Edge[], depth = 0) {
  if (!node || depth >= 4) return;
  const leftId  = node.left  ? node.left.id  : `open-left-${node.id}`;
  const rightId = node.right ? node.right.id : `open-right-${node.id}`;
  if (depth < 3) {
    edges.push({ from: node.id, to: leftId  });
    edges.push({ from: node.id, to: rightId });
  }
  collectEdges(node.left,  edges, depth + 1);
  collectEdges(node.right, edges, depth + 1);
}

function BinaryTreeRows({
  root,
  nodeRefs,
  search,
  onSlotClick,
  onNodeClick,
  isFull,
}: {
  root:        BinaryNode;
  nodeRefs:    NodeRefs;
  search:      string;
  onSlotClick: (slot: SlotInfo) => void;
  onNodeClick: (node: BinaryNode) => void;
  isFull:      boolean;
}) {
  function highlight(name: string) {
    return search && name.toLowerCase().includes(search.toLowerCase());
  }

  type LevelEntry = {
    node:       BinaryNode | null;
    id:         string;
    parentName: string;
    side:       'Left' | 'Right';
    parentPath: ('left' | 'right')[];
    nodePath:   ('left' | 'right')[];
  };

  function renderNode(
    node:       BinaryNode | null,
    id:         string,
    parentName: string,
    side:       'Left' | 'Right',
    parentPath: ('left' | 'right')[],
  ) {
    if (!node) {
      if (isFull) {
        return (
          <div
            key={id}
            ref={(el) => { nodeRefs.set(id, el); }}
            className="w-[130px] h-[110px] rounded-xl border-2 border-dashed border-border/40 flex flex-col items-center justify-center gap-1.5 opacity-40"
          >
            <div className="w-8 h-8 rounded-full border-2 border-dashed border-border/60 flex items-center justify-center">
              <span className="text-xs text-text-muted">🔒</span>
            </div>
            <p className="text-[10px] text-text-muted font-medium">Full</p>
          </div>
        );
      }
      return (
        <OpenSlotCard
          key={id}
          nodeRef={(el) => { nodeRefs.set(id, el); }}
          onClick={() => onSlotClick({ parentName, side, parentPath })}
          label={`${side} slot`}
        />
      );
    }
    const isHighlighted = highlight(node.name);
    return (
      <div key={node.id} className={isHighlighted ? 'ring-2 ring-primary rounded-xl' : ''}>
        <NodeCard
          node={node}
          nodeRef={(el) => { nodeRefs.set(node.id, el); }}
          onClick={() => onNodeClick(node)}
        />
      </div>
    );
  }

  const level1: LevelEntry[] = [
    { node: root.left,  parentName: root.name, side: 'Left',  parentPath: [], id: root.left  ? root.left.id  : `open-left-${root.id}`,  nodePath: ['left']  },
    { node: root.right, parentName: root.name, side: 'Right', parentPath: [], id: root.right ? root.right.id : `open-right-${root.id}`, nodePath: ['right'] },
  ];

  const level2: LevelEntry[] = [];
  for (const l1 of level1) {
    if (l1.node) {
      level2.push({ node: l1.node.left,  parentName: l1.node.name, side: 'Left',  parentPath: l1.nodePath, id: l1.node.left  ? l1.node.left.id  : `open-left-${l1.node.id}`,  nodePath: [...l1.nodePath, 'left']  });
      level2.push({ node: l1.node.right, parentName: l1.node.name, side: 'Right', parentPath: l1.nodePath, id: l1.node.right ? l1.node.right.id : `open-right-${l1.node.id}`, nodePath: [...l1.nodePath, 'right'] });
    }
  }

  const level3: LevelEntry[] = [];
  for (const l2 of level2) {
    if (!l2.node) continue;
    level3.push({ node: l2.node.left,  parentName: l2.node.name, side: 'Left',  parentPath: l2.nodePath, id: l2.node.left  ? l2.node.left.id  : `open-left-${l2.node.id}`,  nodePath: [...l2.nodePath, 'left']  });
    level3.push({ node: l2.node.right, parentName: l2.node.name, side: 'Right', parentPath: l2.nodePath, id: l2.node.right ? l2.node.right.id : `open-right-${l2.node.id}`, nodePath: [...l2.nodePath, 'right'] });
  }

  return (
    <div className="flex flex-col items-center gap-10 py-6 select-none">
      <div className="flex justify-center">
        <NodeCard node={root} nodeRef={(el) => { nodeRefs.set(root.id, el); }} onClick={() => onNodeClick(root)} />
      </div>
      <div className="flex gap-12 justify-center">
        {level1.map((e) => renderNode(e.node, e.id, e.parentName, e.side, e.parentPath))}
      </div>
      {level2.length > 0 && (
        <div className="flex gap-4 justify-center flex-wrap">
          {level2.map((e) => renderNode(e.node, e.id, e.parentName, e.side, e.parentPath))}
        </div>
      )}
      {level3.length > 0 && (
        <div className="flex gap-4 justify-center flex-wrap">
          {level3.map((e) => renderNode(e.node, e.id, e.parentName, e.side, e.parentPath))}
        </div>
      )}
    </div>
  );
}

// ── SVG connector overlay ─────────────────────────────────────────────────────

function SvgOverlay({
  containerRef,
  edges,
  nodeRefs,
}: {
  containerRef: React.RefObject<HTMLDivElement>;
  edges:        Edge[];
  nodeRefs:     NodeRefs;
}) {
  const [lines, setLines] = useState<{ x1: number; y1: number; x2: number; y2: number; key: string }[]>([]);

  const recalc = useCallback(() => {
    const container = containerRef.current;
    if (!container) return;
    const cr = container.getBoundingClientRect();
    const next: typeof lines = [];
    for (const { from, to } of edges) {
      const fromEl = nodeRefs.get(from);
      const toEl   = nodeRefs.get(to);
      if (!fromEl || !toEl) continue;
      const fr = fromEl.getBoundingClientRect();
      const tr = toEl.getBoundingClientRect();
      next.push({
        key: `${from}-${to}`,
        x1: fr.left + fr.width / 2 - cr.left,
        y1: fr.bottom - cr.top,
        x2: tr.left + tr.width / 2 - cr.left,
        y2: tr.top - cr.top,
      });
    }
    setLines(next);
  }, [containerRef, edges, nodeRefs]);

  useEffect(() => {
    const id = setTimeout(recalc, 50);
    return () => clearTimeout(id);
  }, [recalc]);

  const w = containerRef.current?.scrollWidth  ?? 800;
  const h = containerRef.current?.scrollHeight ?? 600;

  return (
    <svg className="absolute inset-0 pointer-events-none" width={w} height={h} style={{ overflow: 'visible' }}>
      {lines.map((l) => (
        <path
          key={l.key}
          d={`M ${l.x1} ${l.y1} C ${l.x1} ${(l.y1 + l.y2) / 2}, ${l.x2} ${(l.y1 + l.y2) / 2}, ${l.x2} ${l.y2}`}
          stroke="currentColor"
          strokeWidth="1.5"
          fill="none"
          className="text-border"
          strokeDasharray="4 3"
        />
      ))}
    </svg>
  );
}

// ── PV History Modal ──────────────────────────────────────────────────────────

function PVHistoryModal({ onClose }: { onClose: () => void }) {
  const [page, setPage] = useState(0);
  const PER_PAGE   = 5;
  const totalPages = Math.ceil(MOCK_PV_HISTORY_ENTRIES.length / PER_PAGE);
  const visible    = MOCK_PV_HISTORY_ENTRIES.slice(page * PER_PAGE, page * PER_PAGE + PER_PAGE);
  const maxPV      = Math.max(...MOCK_PV_MONTHLY.map((m) => m.leftPV + m.rightPV), 1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />
      <div className="relative w-full max-w-lg bg-surface rounded-2xl shadow-2xl z-10 flex flex-col max-h-[90vh]">
        <div className="flex items-center justify-between px-6 py-5 border-b border-border">
          <h2 className="text-base font-semibold text-text">PV History</h2>
          <button onClick={onClose} className="w-8 h-8 rounded-full flex items-center justify-center text-text-muted hover:bg-primary-soft/40 transition-colors">
            <X size={16} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-5 flex flex-col gap-6">
          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-4">Monthly PV</p>
            <div className="flex items-end gap-3 h-36">
              {MOCK_PV_MONTHLY.map((m) => {
                const leftH  = Math.round((m.leftPV  / maxPV) * 100);
                const rightH = Math.round((m.rightPV / maxPV) * 100);
                return (
                  <div key={m.month} className="flex flex-col items-center gap-1 flex-1">
                    <div className="relative w-full h-28 flex flex-col justify-end rounded-t-lg overflow-hidden bg-primary/10">
                      <div className="w-full bg-[#f59e0b] transition-all duration-500" style={{ height: `${rightH}%` }} />
                      <div className="w-full bg-primary transition-all duration-500"   style={{ height: `${leftH}%`  }} />
                    </div>
                    <span className="text-[10px] text-text-muted">{m.month}</span>
                  </div>
                );
              })}
            </div>
            <div className="flex gap-4 mt-2">
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-primary" />
                <span className="text-xs text-text-muted">Left Area</span>
              </div>
              <div className="flex items-center gap-1.5">
                <div className="w-3 h-3 rounded-sm bg-[#f59e0b]" />
                <span className="text-xs text-text-muted">Right Area</span>
              </div>
            </div>
          </div>

          <div>
            <p className="text-xs font-semibold text-text-muted uppercase tracking-wide mb-3">Transactions</p>
            <div className="flex flex-col divide-y divide-border/60">
              {visible.map((entry) => (
                <div key={entry.id} className="py-3 flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <p className="text-sm text-text font-medium">{entry.description}</p>
                    <p className="text-xs text-text-muted mt-0.5">{entry.date}</p>
                  </div>
                  <div className="text-right shrink-0 flex gap-4">
                    <div>
                      <p className="text-[10px] text-text-muted">L</p>
                      <p className={`text-sm font-semibold ${entry.leftDelta  > 0 ? 'text-primary'    : 'text-text-muted'}`}>
                        {entry.leftDelta  > 0 ? `+${entry.leftDelta}`  : '—'}
                      </p>
                    </div>
                    <div>
                      <p className="text-[10px] text-text-muted">R</p>
                      <p className={`text-sm font-semibold ${entry.rightDelta > 0 ? 'text-[#f59e0b]' : 'text-text-muted'}`}>
                        {entry.rightDelta > 0 ? `+${entry.rightDelta}` : '—'}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="flex items-center justify-between mt-4 pt-3 border-t border-border">
                <button onClick={() => setPage((p) => Math.max(0, p - 1))} disabled={page === 0} className="p-1.5 rounded-lg text-text-muted hover:text-text disabled:opacity-30 transition-colors">
                  <ChevronLeft size={16} />
                </button>
                <span className="text-xs text-text-muted">{page + 1} / {totalPages}</span>
                <button onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))} disabled={page === totalPages - 1} className="p-1.5 rounded-lg text-text-muted hover:text-text disabled:opacity-30 transition-colors">
                  <ChevronRight size={16} />
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}

// ── Content ──────────────────────────────────────────────────────────────────

export function BinaryTreeContent() {
  const [search,      setSearch]      = useState('');
  const [zoom,        setZoom]        = useState(1);
  const [pvModalOpen, setPvModalOpen] = useState(false);
  const [toasts,      setToasts]      = useState<Toast[]>([]);

  const [addMemberModal, setAddMemberModal] = useState<{
    path:       ('left' | 'right')[];
    position:   'Left' | 'Right';
    parentName: string;
  } | null>(null);
  const [addForm, setAddForm] = useState({
    fullName: '', phone: '', email: '', dateOfBirth: '',
    gender: 'male', address: '', city: '', state: '', pincode: '',
    nomineeName: '', nomineeRelation: '',
    accountHolder: '', accountNumber: '', ifscCode: '', bankName: '',
    registrationFee: '1500', paymentMode: 'wallet', placementPosition: 'Left' as 'Left' | 'Right',
  });
  const [addFormStep,  setAddFormStep]  = useState(1);
  const [addFormError, setAddFormError] = useState('');

  const [root, setRoot] = useState<BinaryNode>(MOCK_BINARY_TREE);

  const [selectedMember, setSelectedMember] = useState<TreeMember | null>(null);
  const [viewingRoot,    setViewingRoot]    = useState<TreeMember>(myTree);
  const [isMyTree,       setIsMyTree]       = useState(true);

  const treeMemberMap = useMemo(() => buildTreeMap(viewingRoot), [viewingRoot]);

  const displayRoot = useMemo<BinaryNode>(() => {
    function memberToNode(m: TreeMember | undefined): BinaryNode | null {
      if (!m) return null;
      const initials = m.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
      return {
        id:            m.id,
        name:          m.name,
        initials,
        memberId:      m.memberId,
        leftPV:        m.leftPV,
        rightPV:       m.rightPV,
        rank:          m.tier.toLowerCase() as BinaryNode['rank'],
        isCurrentUser: m.id === myTree.id && isMyTree,
        left:          memberToNode(m.left)  as BinaryNode | null,
        right:         memberToNode(m.right) as BinaryNode | null,
      } as BinaryNode;
    }
    return memberToNode(viewingRoot) as BinaryNode;
  }, [viewingRoot, isMyTree]);

  const containerRef = useRef<HTMLDivElement>(null);
  const nodeRefs     = useRef<NodeRefs>(new Map()).current;

  const totalMembers = countNodes(root);
  const isFull       = totalMembers >= MAX_MEMBERS;

  const edges: Edge[] = [];
  collectEdges(displayRoot, edges);

  function addToast(message: string) {
    const id = Date.now();
    setToasts((prev) => [...prev, { id, message }]);
    setTimeout(() => setToasts((prev) => prev.filter((t) => t.id !== id)), 3000);
  }

  function handleAddMember(fullPath: ('left' | 'right')[], data: { name: string; memberId: string }) {
    const side       = fullPath[fullPath.length - 1] as 'left' | 'right';
    const parentPath = fullPath.slice(0, -1);
    if (!side) return;

    const newTreeMember: TreeMember = {
      id:              data.memberId,
      name:            data.name,
      memberId:        data.memberId,
      tier:            'Bronze',
      sponsor:         viewingRoot.name,
      placement:       viewingRoot.name,
      registeredMonth: new Date().toLocaleDateString('en-IN', { month: 'short', year: 'numeric' }),
      leftPV:          0,
      rightPV:         0,
    };
    setViewingRoot((prev) => {
      const updated = insertTreeMemberAtPath(prev, fullPath, newTreeMember);
      return updated ?? prev;
    });

    const initials = data.name.split(' ').map((w) => w[0]).join('').slice(0, 2).toUpperCase();
    const member: AvailableMember = {
      id: data.memberId, name: data.name, initials, memberId: data.memberId, city: '',
    };
    setRoot((prev) => insertAtPath(prev, parentPath, side, member));

    addToast(`✓ ${data.name} registered successfully!`);
  }

  function handleNodeClick(node: BinaryNode) {
    const found = treeMemberMap.get(node.name);
    const member: TreeMember = found ?? {
      id:              node.id,
      name:            node.name,
      memberId:        node.memberId,
      tier:            toTier(node.rank),
      sponsor:         '—',
      placement:       '—',
      registeredMonth: '—',
      leftPV:          node.leftPV,
      rightPV:         node.rightPV,
    };
    setSelectedMember(member);
  }

  return (
    <>
      {/* PV summary cards */}
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="bg-surface border border-border rounded-2xl p-4">
            <p className="text-xs text-text-muted mb-1">Left Area PV</p>
            <p className="text-2xl font-bold text-text">{viewingRoot.leftPV}</p>
            <p className="text-xs text-text-muted mt-0.5">Current cycle</p>
          </div>
          <div className="bg-surface border border-border rounded-2xl p-4 flex flex-col gap-2">
            <p className="text-xs text-text-muted">Right Area PV</p>
            <p className="text-2xl font-bold text-text">{viewingRoot.rightPV}</p>
            <p className="text-xs text-text-muted">Current cycle</p>
            <button
              onClick={() => setPvModalOpen(true)}
              className="mt-auto w-full bg-primary text-[#0b1410] rounded-lg px-3 py-1.5 text-xs font-semibold hover:bg-primary/90 transition-colors"
            >
              View PV history
            </button>
          </div>
        </div>

        {/* Network complete banner */}
        {isFull && (
          <div className="mb-4 bg-primary/10 border border-primary/30 rounded-xl px-4 py-3 text-sm font-semibold text-primary text-center">
            Network Complete! 🎉 All {MAX_MEMBERS} positions filled.
          </div>
        )}

        {/* Back to my tree */}
        {!isMyTree && (
          <div className="flex items-center gap-3 mb-3 flex-wrap">
            <button
              onClick={() => { setViewingRoot(myTree); setIsMyTree(true); }}
              className="flex items-center gap-2 bg-surface border border-border text-text px-4 py-2 rounded-xl text-sm font-medium hover:bg-primary-soft/30 transition-colors shrink-0"
            >
              ← Back to my tree
            </button>
            <span className="text-sm text-text-muted">
              Viewing: <span className="font-semibold text-text">{viewingRoot.name}</span>&apos;s tree
            </span>
          </div>
        )}

        {/* Search + zoom */}
        <div className="flex items-center gap-3 mb-4">
          <div className="relative flex-1 max-w-xs">
            <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-text-muted pointer-events-none" />
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search member name…"
              className="w-full pl-8 pr-3 py-2 text-sm rounded-xl bg-surface border border-border text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
          </div>
          <div className="flex items-center gap-1 border border-border rounded-xl overflow-hidden">
            <button onClick={() => setZoom((z) => Math.max(0.5, +(z - 0.1).toFixed(1)))} className="px-2.5 py-2 text-text-muted hover:bg-primary-soft/40 transition-colors" aria-label="Zoom out">
              <ZoomOut size={15} />
            </button>
            <span className="px-2 text-xs text-text-muted min-w-[3rem] text-center">{Math.round(zoom * 100)}%</span>
            <button onClick={() => setZoom((z) => Math.min(2, +(z + 0.1).toFixed(1)))} className="px-2.5 py-2 text-text-muted hover:bg-primary-soft/40 transition-colors" aria-label="Zoom in">
              <ZoomIn size={15} />
            </button>
          </div>
        </div>

        {/* Tree canvas */}
        <div className="flex-1 overflow-auto rounded-2xl border border-border bg-surface">
          <div
            ref={containerRef}
            className="relative"
            style={{ transform: `scale(${zoom})`, transformOrigin: 'top center', minWidth: '600px' }}
          >
            <BinaryTreeRows
              key={[
                displayRoot?.name,
                displayRoot?.left?.name ?? 'null',
                displayRoot?.right?.name ?? 'null',
                displayRoot?.left?.left?.name ?? 'null',
                displayRoot?.left?.right?.name ?? 'null',
                displayRoot?.right?.left?.name ?? 'null',
                displayRoot?.right?.right?.name ?? 'null',
                displayRoot?.left?.left?.left?.name ?? 'null',
                displayRoot?.left?.left?.right?.name ?? 'null',
                displayRoot?.left?.right?.left?.name ?? 'null',
                displayRoot?.left?.right?.right?.name ?? 'null',
                displayRoot?.right?.left?.left?.name ?? 'null',
                displayRoot?.right?.left?.right?.name ?? 'null',
                displayRoot?.right?.right?.left?.name ?? 'null',
                displayRoot?.right?.right?.right?.name ?? 'null',
              ].join('|')}
              root={displayRoot}
              nodeRefs={nodeRefs}
              search={search}
              onSlotClick={(slot) => {
                const side = slot.side.toLowerCase() as 'left' | 'right';
                setAddMemberModal({
                  path:       [...slot.parentPath, side],
                  position:   slot.side,
                  parentName: slot.parentName,
                });
                setAddForm((p) => ({ ...p, placementPosition: slot.side }));
              }}
              onNodeClick={handleNodeClick}
              isFull={!isMyTree || isFull}
            />
            <SvgOverlay containerRef={containerRef} edges={edges} nodeRefs={nodeRefs} />
          </div>
        </div>

      {/* Add member — 3-step registration modal */}
      {addMemberModal && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto">
            <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
              <div>
                <h2 className="text-lg font-bold text-gray-900">Register New Member</h2>
                <p className="text-xs text-gray-500 mt-0.5">
                  {addMemberModal.position} leg of <span className="font-medium">{addMemberModal.parentName}</span>
                </p>
              </div>
              <button
                onClick={() => { setAddMemberModal(null); setAddFormStep(1); setAddFormError(''); }}
                className="text-gray-400 hover:text-gray-600 text-xl p-1"
              >✕</button>
            </div>

            <div className="flex items-center gap-0 px-6 pt-4 pb-2">
              {[1, 2, 3].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div className={`w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold shrink-0 ${
                    addFormStep > s ? 'bg-[#14532d] text-white' :
                    addFormStep === s ? 'bg-[#22c55e] text-[#0b1410]' :
                    'bg-gray-200 text-gray-400'
                  }`}>{addFormStep > s ? '✓' : s}</div>
                  {s < 3 && <div className={`h-0.5 flex-1 ${addFormStep > s ? 'bg-[#14532d]' : 'bg-gray-200'}`} />}
                </div>
              ))}
            </div>
            <div className="flex justify-between px-6 pb-4 text-[10px] text-gray-500">
              <span>Personal Info</span><span className="ml-4">Address & Bank</span><span>Payment</span>
            </div>

            <div className="px-6 pb-6 space-y-4">
              {/* Step 1 — Personal Info */}
              {addFormStep === 1 && (
                <>
                  <div className="grid grid-cols-1 gap-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Full Name *</label>
                      <input type="text" placeholder="e.g. Ravi Kumar" value={addForm.fullName}
                        onChange={(e) => setAddForm((p) => ({ ...p, fullName: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                    </div>
                    <div className="grid grid-cols-2 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Phone *</label>
                        <input type="tel" placeholder="10-digit mobile" value={addForm.phone}
                          onChange={(e) => setAddForm((p) => ({ ...p, phone: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Date of Birth *</label>
                        <input type="date" value={addForm.dateOfBirth}
                          onChange={(e) => setAddForm((p) => ({ ...p, dateOfBirth: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Email</label>
                      <input type="email" placeholder="optional" value={addForm.email}
                        onChange={(e) => setAddForm((p) => ({ ...p, email: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                    </div>
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Gender *</label>
                      <select value={addForm.gender} onChange={(e) => setAddForm((p) => ({ ...p, gender: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e] bg-white">
                        <option value="male">Male</option>
                        <option value="female">Female</option>
                        <option value="other">Other</option>
                      </select>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Nominee Details</p>
                      <div className="grid grid-cols-2 gap-3">
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Nominee Name</label>
                          <input type="text" placeholder="e.g. Sunita Devi" value={addForm.nomineeName}
                            onChange={(e) => setAddForm((p) => ({ ...p, nomineeName: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                        </div>
                        <div>
                          <label className="block text-xs font-medium text-gray-700 mb-1">Relation</label>
                          <input type="text" placeholder="e.g. Spouse" value={addForm.nomineeRelation}
                            onChange={(e) => setAddForm((p) => ({ ...p, nomineeRelation: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                        </div>
                      </div>
                    </div>
                  </div>
                  {addFormError && <p className="text-xs text-red-500">{addFormError}</p>}
                  <button
                    onClick={() => {
                      if (!addForm.fullName.trim() || !addForm.phone.trim() || !addForm.dateOfBirth) {
                        setAddFormError('Full name, phone and date of birth are required.'); return;
                      }
                      if (!/^\d{10}$/.test(addForm.phone.trim())) {
                        setAddFormError('Phone must be a 10-digit number.'); return;
                      }
                      setAddFormError(''); setAddFormStep(2);
                    }}
                    className="w-full py-2.5 rounded-xl bg-[#14532d] text-[#0b1410] font-semibold text-sm hover:bg-[#166534] transition-colors"
                    style={{ color: '#e2f7ec' }}
                  >Next: Address & Bank →</button>
                </>
              )}

              {/* Step 2 — Address + Bank Details */}
              {addFormStep === 2 && (
                <>
                  <div className="space-y-3">
                    <div>
                      <label className="block text-xs font-medium text-gray-700 mb-1">Address *</label>
                      <input type="text" placeholder="House / Flat / Street" value={addForm.address}
                        onChange={(e) => setAddForm((p) => ({ ...p, address: e.target.value }))}
                        className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                    </div>
                    <div className="grid grid-cols-3 gap-3">
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">City *</label>
                        <input type="text" placeholder="City" value={addForm.city}
                          onChange={(e) => setAddForm((p) => ({ ...p, city: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">State *</label>
                        <input type="text" placeholder="State" value={addForm.state}
                          onChange={(e) => setAddForm((p) => ({ ...p, state: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                      <div>
                        <label className="block text-xs font-medium text-gray-700 mb-1">Pincode *</label>
                        <input type="text" placeholder="6-digit" value={addForm.pincode}
                          onChange={(e) => setAddForm((p) => ({ ...p, pincode: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                    </div>
                    <div className="border-t border-gray-100 pt-3">
                      <p className="text-xs font-semibold text-gray-600 mb-2">Bank Details</p>
                      <div className="space-y-3">
                        <input type="text" placeholder="Account Holder Name *" value={addForm.accountHolder}
                          onChange={(e) => setAddForm((p) => ({ ...p, accountHolder: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                        <div className="grid grid-cols-2 gap-3">
                          <input type="text" placeholder="Account Number *" value={addForm.accountNumber}
                            onChange={(e) => setAddForm((p) => ({ ...p, accountNumber: e.target.value }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                          <input type="text" placeholder="IFSC Code *" value={addForm.ifscCode}
                            onChange={(e) => setAddForm((p) => ({ ...p, ifscCode: e.target.value.toUpperCase() }))}
                            className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                        </div>
                        <input type="text" placeholder="Bank Name *" value={addForm.bankName}
                          onChange={(e) => setAddForm((p) => ({ ...p, bankName: e.target.value }))}
                          className="w-full border border-gray-200 rounded-lg px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-[#22c55e]" />
                      </div>
                    </div>
                  </div>
                  {addFormError && <p className="text-xs text-red-500">{addFormError}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => { setAddFormStep(1); setAddFormError(''); }}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">← Back</button>
                    <button
                      onClick={() => {
                        if (!addForm.address.trim() || !addForm.city.trim() || !addForm.state.trim() || !addForm.pincode.trim()) {
                          setAddFormError('Address, city, state and pincode are required.'); return;
                        }
                        if (!/^\d{6}$/.test(addForm.pincode.trim())) {
                          setAddFormError('Pincode must be 6 digits.'); return;
                        }
                        if (!addForm.accountHolder.trim() || !addForm.accountNumber.trim() || !addForm.ifscCode.trim() || !addForm.bankName.trim()) {
                          setAddFormError('All bank details are required.'); return;
                        }
                        setAddFormError(''); setAddFormStep(3);
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#14532d] font-semibold text-sm hover:bg-[#166534] transition-colors"
                      style={{ color: '#e2f7ec' }}
                    >Next: Payment →</button>
                  </div>
                </>
              )}

              {/* Step 3 — Payment & Confirm */}
              {addFormStep === 3 && (
                <>
                  <div className="space-y-4">
                    <div className="bg-gray-50 rounded-xl p-4 space-y-2">
                      <p className="text-xs font-semibold text-gray-500 uppercase tracking-wide">Registration Summary</p>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Name</span>
                        <span className="font-medium text-gray-900">{addForm.fullName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Phone</span>
                        <span className="font-medium text-gray-900">{addForm.phone}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">Placement</span>
                        <span className="font-medium text-gray-900">{addMemberModal.position} of {addMemberModal.parentName}</span>
                      </div>
                      <div className="flex justify-between text-sm">
                        <span className="text-gray-600">City</span>
                        <span className="font-medium text-gray-900">{addForm.city}, {addForm.state}</span>
                      </div>
                    </div>
                    <div className="bg-green-50 border border-green-200 rounded-xl p-4">
                      <div className="flex justify-between items-center">
                        <div>
                          <p className="text-xs text-gray-500">Registration Fee</p>
                          <p className="text-xl font-bold text-[#14532d]">₹{Number(addForm.registrationFee).toLocaleString('en-IN')}</p>
                        </div>
                        <div className="text-right">
                          <p className="text-xs text-gray-500 mb-1">Payment Mode</p>
                          <select value={addForm.paymentMode} onChange={(e) => setAddForm((p) => ({ ...p, paymentMode: e.target.value }))}
                            className="border border-green-200 rounded-lg px-2 py-1 text-sm bg-white focus:outline-none focus:ring-2 focus:ring-[#22c55e]">
                            <option value="wallet">Wallet</option>
                            <option value="upi">UPI</option>
                            <option value="bank_transfer">Bank Transfer</option>
                            <option value="cash">Cash</option>
                          </select>
                        </div>
                      </div>
                    </div>
                  </div>
                  {addFormError && <p className="text-xs text-red-500">{addFormError}</p>}
                  <div className="flex gap-3">
                    <button onClick={() => { setAddFormStep(2); setAddFormError(''); }}
                      className="flex-1 py-2.5 rounded-xl border border-gray-300 text-gray-700 font-semibold text-sm hover:bg-gray-50 transition-colors">← Back</button>
                    <button
                      onClick={() => {
                        const newId = `GL${Date.now().toString().slice(-7)}`;
                        handleAddMember(addMemberModal.path, { name: addForm.fullName.trim(), memberId: newId });
                        setAddMemberModal(null);
                        setAddFormStep(1);
                        setAddForm({
                          fullName: '', phone: '', email: '', dateOfBirth: '',
                          gender: 'male', address: '', city: '', state: '', pincode: '',
                          nomineeName: '', nomineeRelation: '',
                          accountHolder: '', accountNumber: '', ifscCode: '', bankName: '',
                          registrationFee: '1500', paymentMode: 'wallet', placementPosition: 'Left',
                        });
                      }}
                      className="flex-1 py-2.5 rounded-xl bg-[#14532d] font-bold text-sm hover:bg-[#166534] transition-colors"
                      style={{ color: '#e2f7ec' }}
                    >Confirm & Register</button>
                  </div>
                </>
              )}
            </div>
          </div>
        </div>
      )}

      {/* PV history modal */}
      {pvModalOpen && <PVHistoryModal onClose={() => setPvModalOpen(false)} />}

      {/* Member detail panel — overlay */}
      {selectedMember && (
        <div
          className="fixed inset-0 bg-black/20 z-40 lg:bg-transparent"
          onClick={() => setSelectedMember(null)}
        />
      )}

      {/* Member detail panel — slide in from right */}
      <div className={`fixed top-0 right-0 h-full w-full sm:w-[360px] bg-white shadow-2xl z-50 flex flex-col transition-transform duration-300 ${selectedMember ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-100">
          <h2 className="text-lg font-bold text-gray-900">Member Details</h2>
          <button onClick={() => setSelectedMember(null)} className="text-gray-400 hover:text-gray-600 text-xl p-1">✕</button>
        </div>

        {selectedMember && (
          <div className="flex-1 overflow-y-auto px-6 py-5">
            <div className="flex items-center gap-4 mb-6">
              <div className={`w-14 h-14 rounded-full flex items-center justify-center text-xl font-bold text-white ${
                selectedMember.tier === 'Diamond'  ? 'bg-cyan-500'   :
                selectedMember.tier === 'Platinum' ? 'bg-puRPle-500' :
                selectedMember.tier === 'Gold'     ? 'bg-yellow-500' :
                selectedMember.tier === 'Silver'   ? 'bg-gray-400'   :
                'bg-orange-400'
              }`}>
                {selectedMember.name.charAt(0)}
              </div>
              <div>
                <p className="font-bold text-gray-900 text-base">{selectedMember.name}</p>
                <p className="text-sm text-gray-500">{selectedMember.memberId}</p>
              </div>
            </div>

            {[
              { label: 'Card Level', value: selectedMember.tier,            valueClass: selectedMember.tier === 'Diamond' ? 'text-cyan-600 font-bold' : selectedMember.tier === 'Platinum' ? 'text-puRPle-600 font-bold' : selectedMember.tier === 'Gold' ? 'text-yellow-600 font-bold' : selectedMember.tier === 'Silver' ? 'text-gray-600 font-bold' : 'text-orange-600 font-bold' },
              { label: 'Sponsor',    value: selectedMember.sponsor,         valueClass: 'font-semibold text-gray-800' },
              { label: 'Placement',  value: selectedMember.placement,       valueClass: 'font-semibold text-gray-800' },
              { label: 'Registered', value: selectedMember.registeredMonth, valueClass: 'text-gray-800' },
              { label: 'Left PV',    value: `${selectedMember.leftPV} PV`,  valueClass: 'font-bold text-green-600' },
              { label: 'Right PV',   value: `${selectedMember.rightPV} PV`, valueClass: 'font-bold text-amber-500' },
            ].map(({ label, value, valueClass }) => (
              <div key={label} className="flex justify-between items-center py-3 border-b border-gray-50">
                <span className="text-sm text-gray-500">{label}</span>
                <span className={`text-sm ${valueClass}`}>{value}</span>
              </div>
            ))}
          </div>
        )}

        <div className="px-6 py-4 border-t border-gray-100">
          <button
            onClick={() => {
              if (selectedMember) {
                setViewingRoot(selectedMember);
                setIsMyTree(selectedMember.id === myTree.id);
                setSelectedMember(null);
              }
            }}
            className="w-full bg-green-600 hover:bg-green-700 text-white font-semibold py-3 rounded-2xl transition-colors text-sm"
          >
            View their tree
          </button>
        </div>
      </div>

      <ToastList toasts={toasts} />
    </>
  );
}
