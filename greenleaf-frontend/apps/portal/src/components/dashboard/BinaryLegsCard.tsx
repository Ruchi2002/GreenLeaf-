import { Lightbulb } from 'lucide-react';

interface BinaryLegsCardProps {
  leftPV:      number;
  leftMembers: number;
  rightPV:     number;
  rightMembers: number;
  tip:         string;
}

export function BinaryLegsCard({ leftPV, leftMembers, rightPV, rightMembers, tip }: BinaryLegsCardProps) {
  return (
    <div className="bg-surface border border-border rounded-xl p-6 mb-6">
      <h2 className="text-base font-semibold text-text mb-4">My Binary Legs</h2>

      <div className="grid grid-cols-2 gap-4">
        {/* Left area */}
        <div className="bg-primary-soft rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1">Left Area</p>
          <p className="text-2xl sm:text-3xl font-bold text-text leading-tight">{leftPV} PV</p>
          <p className="text-sm text-text-muted mt-1">{leftMembers} members</p>
        </div>

        {/* Right area */}
        <div className="bg-primary-soft rounded-xl p-4">
          <p className="text-xs text-text-muted mb-1">Right Area</p>
          <p className="text-2xl sm:text-3xl font-bold text-text leading-tight">{rightPV} PV</p>
          <p className="text-sm text-text-muted mt-1">{rightMembers} members</p>
        </div>
      </div>

      {/* Gold divider */}
      <div className="w-full h-0.5 bg-gold mt-4 mb-3 rounded-full" />

      {/* Tip row */}
      <div className="flex items-center gap-2">
        <Lightbulb className="h-4 w-4 text-gold shrink-0" />
        <span className="text-sm text-gold">{tip}</span>
      </div>
    </div>
  );
}
