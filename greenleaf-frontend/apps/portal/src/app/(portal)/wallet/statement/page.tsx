'use client';

// MOCK ONLY — BACKEND_REQUIRED_LATER

import { useState, useMemo } from 'react';
import Link from 'next/link';
import { ArrowDownLeft, ArrowUpRight, ArrowRight, Download } from 'lucide-react';
import { MOCK_TRANSACTIONS } from '@/data/mock/wallet';
import type { TxType, TxWallet } from '@/data/mock/wallet';

function formatRP(amount: number): string {
  return 'RP ' + amount.toLocaleString('id-ID');
}

function TxIcon({ type }: { type: TxType }) {
  if (type === 'credit') {
    return (
      <div className="w-9 h-9 rounded-full bg-success/10 flex items-center justify-center shrink-0">
        <ArrowDownLeft size={16} className="text-success" />
      </div>
    );
  }
  if (type === 'debit') {
    return (
      <div className="w-9 h-9 rounded-full bg-danger/10 flex items-center justify-center shrink-0">
        <ArrowUpRight size={16} className="text-danger" />
      </div>
    );
  }
  return (
    <div className="w-9 h-9 rounded-full bg-border/60 flex items-center justify-center shrink-0">
      <ArrowRight size={16} className="text-text-muted" />
    </div>
  );
}

export default function StatementPage() {
  const [walletFilter, setWalletFilter] = useState<TxWallet | 'all'>('all');
  const [typeFilter,   setTypeFilter]   = useState<TxType   | 'all'>('all');
  const [search,       setSearch]       = useState('');

  const filtered = useMemo(() => MOCK_TRANSACTIONS.filter((tx) => {
    const matchWallet = walletFilter === 'all' || tx.wallet === walletFilter;
    const matchType   = typeFilter   === 'all' || tx.type   === typeFilter;
    const matchSearch = search === '' || tx.description.toLowerCase().includes(search.toLowerCase());
    return matchWallet && matchType && matchSearch;
  }), [walletFilter, typeFilter, search]);

  // Group by date
  const grouped = useMemo(() => {
    const map = new Map<string, typeof filtered>();
    for (const tx of filtered) {
      const existing = map.get(tx.date) ?? [];
      map.set(tx.date, [...existing, tx]);
    }
    return map;
  }, [filtered]);

  return (
    <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex flex-col">
      {/* Back link */}
      <Link
        href="/wallet"
        className="inline-flex items-center gap-1 text-sm text-text-muted hover:text-text transition-colors mb-4"
      >
        ← Back to Wallet
      </Link>

      {/* Page header */}
      <div className="flex items-start justify-between mb-5">
        <div>
          <h1 className="text-2xl font-bold text-text">Account Statement</h1>
          <p className="text-sm text-text-muted mt-0.5">All wallet activity in one place</p>
        </div>
        <button className="flex items-center gap-2 border border-border rounded-lg px-3 py-2 text-sm text-text hover:bg-primary-soft/40 transition-colors shrink-0">
          <Download size={14} />
          Export
        </button>
      </div>

      {/* Filter bar */}
      <div className="flex flex-wrap gap-2 mb-5">
        <select
          value={walletFilter}
          onChange={(e) => setWalletFilter(e.target.value as TxWallet | 'all')}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All wallets</option>
          <option value="ewallet">E-wallet</option>
          <option value="voucher">Shopping voucher</option>
        </select>

        <select
          value={typeFilter}
          onChange={(e) => setTypeFilter(e.target.value as TxType | 'all')}
          className="border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text focus:outline-none focus:ring-2 focus:ring-primary/40"
        >
          <option value="all">All types</option>
          <option value="credit">Credit</option>
          <option value="debit">Debit</option>
          <option value="transfer">Transfer</option>
        </select>

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="Search remarks"
          className="border border-border rounded-lg px-3 py-2 text-sm bg-surface text-text placeholder:text-text-muted focus:outline-none focus:ring-2 focus:ring-primary/40 flex-1 min-w-[160px]"
        />
      </div>

      {/* Transaction groups */}
      {grouped.size === 0 ? (
        <div className="flex-1 flex items-center justify-center">
          <p className="text-text-muted text-sm">No transactions found.</p>
        </div>
      ) : (
        <div className="flex flex-col gap-5 flex-1">
          {Array.from(grouped.entries()).map(([date, txs]) => (
            <div key={date}>
              {/* Date header */}
              <p className="text-sm text-text-muted font-medium mb-2">{date}</p>

              {/* Rows */}
              <div className="bg-surface border border-border rounded-xl overflow-hidden">
                {txs.map((tx, i) => (
                  <div
                    key={tx.id}
                    className={`flex items-center gap-3 px-4 py-3 ${i < txs.length - 1 ? 'border-b border-border' : ''}`}
                  >
                    <TxIcon type={tx.type} />

                    <div className="flex-1 min-w-0">
                      <p className="text-sm font-medium text-text truncate">{tx.description}</p>
                      <p className="text-xs text-text-muted">{tx.time}</p>
                    </div>

                    <div className="text-right shrink-0">
                      <p className={`text-sm font-bold ${tx.type === 'credit' ? 'text-success' : tx.type === 'debit' ? 'text-danger' : 'text-text-muted'}`}>
                        {tx.type === 'credit' ? '+' : tx.type === 'debit' ? '−' : ''}{formatRP(tx.amount)}
                      </p>
                      <p className="text-xs text-text-muted">Bal {formatRP(tx.balance)}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
