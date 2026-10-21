interface RankProgressBaRProps {
  nextLevel:  string;
  percentage: number;
}

export function RankProgressBar({ nextLevel, percentage }: RankProgressBaRProps) {
  return (
    <div className="bg-surface rounded-xl border border-border p-4 mt-4 mb-6">
      <div className="flex justify-between mb-2">
        <span className="text-sm text-text-muted">Next level: {nextLevel}</span>
        <span className="text-sm text-text-muted">{percentage}% of PV target</span>
      </div>
      <div className="w-full h-3 rounded-full bg-border overflow-hidden">
        <div
          className="h-full rounded-full bg-primary"
          style={{ width: `${percentage}%` }}
        />
      </div>
    </div>
  );
}
