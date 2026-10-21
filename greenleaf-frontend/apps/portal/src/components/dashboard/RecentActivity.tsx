// MOCK ONLY — BACKEND_REQUIRED_LATER
const ACTIVITY_ITEMS = [
  { label: 'Order #GLF-8821 delivered',            time: '2 days ago' },
  { label: 'Sponsor Bonus credited — RP 150.000',  time: '5 days ago' },
  { label: 'E-wallet recharged — RP 500.000',      time: '1 week ago' },
] as const;

export function RecentActivity() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-text mb-4">Recent Activity</h2>
      <div className="flex flex-col">
        {ACTIVITY_ITEMS.map(({ label, time }) => (
          <div
            key={label}
            className="flex items-center justify-between py-3 border-b border-border last:border-0"
          >
            <span className="text-sm text-text">{label}</span>
            <span className="text-xs text-text-muted shrink-0 ml-4">{time}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
