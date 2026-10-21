interface StatCard {
  label:   string;
  value:   string;
  subtext: string;
}

interface WalletStatCardsProps {
  cards: StatCard[];
}

export function WalletStatCards({ cards }: WalletStatCardsProps) {
  return (
    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
      {cards.map(({ label, value, subtext }) => (
        <div key={label} className="bg-surface border border-border rounded-xl p-5 flex flex-col gap-1">
          <span className="text-sm text-text-muted font-normal">{label}</span>
          <span className="text-lg sm:text-2xl font-bold text-text leading-tight break-all">{value}</span>
          <span className="text-xs text-text-muted">{subtext}</span>
        </div>
      ))}
    </div>
  );
}
