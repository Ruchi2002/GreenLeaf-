import Link from 'next/link';

export default function ForbiddenPage() {
  return (
    <main className="min-h-screen bg-background flex items-center justify-center p-6">
      <div className="text-center max-w-sm">
        <p className="text-[120px] font-black text-red-500/20 leading-none select-none">403</p>

        <div className="relative -mt-8 mb-6">
          <h1 className="text-2xl font-bold text-text">Access Denied</h1>
          <p className="text-sm text-text-muted mt-2">
            You don&apos;t have permission to view this page.
          </p>
        </div>

        <div className="flex flex-col gap-3 items-center">
          <Link
            href="/dashboard"
            className="bg-primary text-[#0b1410] font-semibold px-8 py-2.5 rounded-xl text-sm hover:opacity-90 transition-opacity"
          >
            Back to Dashboard
          </Link>
        </div>
      </div>
    </main>
  );
}
