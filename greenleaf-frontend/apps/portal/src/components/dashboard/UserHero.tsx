interface UserHeroProps {
  name:      string;
  initials:  string;
  memberId:  string;
  cardLevel: string;
  greeting:  string;
}

export function UserHero({ name, initials, memberId, cardLevel, greeting }: UserHeroProps) {
  return (
    <div className="flex items-center gap-4 mb-6 pt-2">
      <div className="w-12 h-12 rounded-full bg-[#1a3a2a] border-2 border-primary/40 flex items-center justify-center text-primary font-bold text-base flex-shrink-0">
        {initials}
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl md:text-3xl font-bold text-text leading-tight">
          {greeting}, {name} 👋
        </h1>
        <div className="flex items-center gap-2 flex-wrap">
          <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-yellow-500/20 border border-yellow-500/40 text-yellow-500 text-xs font-semibold">
            {cardLevel}
          </span>
          <span className="text-sm text-text-muted">Member ID {memberId}</span>
        </div>
      </div>
    </div>
  );
}
