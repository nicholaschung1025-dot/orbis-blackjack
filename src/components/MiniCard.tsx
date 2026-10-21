const SUITS = {
  spade: "♠",
  heart: "♥",
  diamond: "♦",
  club: "♣",
} as const;

export type SuitGlyph = keyof typeof SUITS;

export function MiniCard({
  rank,
  suit,
  red = false,
  className = "",
}: {
  rank: string;
  suit: SuitGlyph;
  red?: boolean;
  className?: string;
}) {
  return (
    <div
      className={`relative h-[48px] w-[34px] overflow-hidden rounded-[6px] bg-cream shadow-[0_10px_20px_-12px_rgba(0,0,0,0.9)] ${className}`}
    >
      <span
        className={`absolute left-[4px] top-[3px] font-mono text-[12px] font-bold leading-none tracking-tight ${
          red ? "text-ember" : "text-background"
        }`}
      >
        {rank}
      </span>
      <span
        className={`absolute left-[4px] top-[16px] text-[10px] leading-none ${
          red ? "text-ember/85" : "text-background/55"
        }`}
      >
        {SUITS[suit]}
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] leading-none ${
          red ? "text-ember/45" : "text-background/20"
        }`}
      >
        {SUITS[suit]}
      </span>
    </div>
  );
}

export function EmptySlot({ className = "" }: { className?: string }) {
  return (
    <div
      className={`h-[48px] w-[34px] rounded-[6px] border border-dashed border-white/12 ${className}`}
    />
  );
}
