import { Suspense } from 'react';
import NetworkContent from './_network-content';

export default function NetworkPage() {
  return (
    <Suspense fallback={
      <div className="pt-14 w-full min-h-[calc(100vh-3.5rem)] flex items-center justify-center">
        <div className="w-8 h-8 rounded-full border-2 border-primary border-t-transparent animate-spin" />
      </div>
    }>
      <NetworkContent />
    </Suspense>
  );
}
