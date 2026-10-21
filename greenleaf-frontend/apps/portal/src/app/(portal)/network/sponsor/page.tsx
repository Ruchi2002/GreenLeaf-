import { SponsorTreeContent } from './_content';

export default function SponsorTreePage() {
  return (
    <div className="pt-14 w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">Sponsor Tree</h1>
        <p className="text-sm text-text-muted mt-0.5">Your direct and indirect recruits</p>
      </div>
      <SponsorTreeContent />
    </div>
  );
}
