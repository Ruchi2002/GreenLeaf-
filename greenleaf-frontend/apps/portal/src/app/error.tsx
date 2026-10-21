'use client';

import { useEffect } from 'react';
import Link from 'next/link';
import { RefreshCw } from 'lucide-react';

export default function GlobalError({
  error,
  reset,
}: {
  error: Error & { digest?: string };
  reset: () => void;
}) {
  useEffect(() => {
    console.error(error);
  }, [error]);

  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-[120px] font-black text-[#f59e0b]/20 leading-none select-none">500</p>

        <div className="relative -mt-8 mb-6">
          <h1 className="text-2xl font-bold text-text">Something Went Wrong</h1>
          <p className="text-sm text-text-muted mt-2">
            An unexpected error occurred. Please try again or contact support.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <button
            onClick={reset}
            className="bg-primary text-[#0b1410] font-semibold px-8 py-2.5 rounded-xl text-sm flex items-center gap-2 hover:opacity-90 transition-opacity"
          >
            <RefreshCw size={16} />
            Try Again
          </button>
          <Link
            href="/dashboard"
            className="bg-surface border border-border text-text-muted px-8 py-2.5 rounded-xl text-sm hover:border-primary/40 hover:text-text transition-colors"
          >
            Go to Dashboard
          </Link>
        </div>

        {error.digest && (
          <p className="text-xs text-text-muted mt-6">Error ID: {error.digest}</p>
        )}
      </div>
    </main>
  );
}
