import { PositionsContent } from './_content';

export default function PositionsPage() {
  return (
    <div className="pt-14 w-full">
      <div className="mb-5">
        <h1 className="text-2xl font-bold text-text">Available Positions</h1>
        <p className="text-sm text-text-muted mt-0.5">Open slots in your binary tree</p>
      </div>
      <PositionsContent />
    </div>
  );
}
