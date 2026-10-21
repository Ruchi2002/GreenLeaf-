// MOCK ONLY — BACKEND_REQUIRED_LATER
const ANNOUNCEMENTS = [
  { title: 'New product launch: Radiance Glow Serum',   date: 'Sep 20, 2026' },
  { title: 'October bonus payout schedule released',    date: 'Sep 15, 2026' },
] as const;

export function Announcements() {
  return (
    <div className="bg-surface border border-border rounded-xl p-6">
      <h2 className="text-base font-semibold text-text mb-4">Announcements</h2>
      <div className="flex flex-col gap-4">
        {ANNOUNCEMENTS.map(({ title, date }) => (
          <div key={title}>
            <p className="text-sm font-medium text-text leading-snug">{title}</p>
            <p className="text-xs text-text-muted mt-0.5">{date}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
