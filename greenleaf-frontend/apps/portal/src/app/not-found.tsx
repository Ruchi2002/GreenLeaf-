import Link from 'next/link';

export default function NotFound() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-[120px] font-black text-primary/20 leading-none select-none">404</p>

        <div className="relative -mt-8 mb-6">
          <h1 className="text-2xl font-bold text-text">Page Not Found</h1>
          <p className="text-sm text-text-muted mt-2">
            The page you&apos;re looking for doesn&apos;t exist or has been moved.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/dashboard"
            className="bg-primary text-[#0b1410] font-semibold px-8 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Go to Dashboard
          </Link>
          <Link
            href="/shop"
            className="bg-surface border border-border text-text-muted px-8 py-2.5 rounded-xl text-sm hover:border-primary/40 hover:text-text transition-colors"
          >
            Browse Shop
          </Link>
        </div>
      </div>
    </main>
  );
}
