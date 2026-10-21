import { RANK_LABEL, SUIT_SYMBOLS, type BCard } from "../lib/blackjack";

export function CasinoCard({
  card,
  className = "",
}: {
  card: BCard;
  className?: string;
}) {
  const red = card.suit === 1 || card.suit === 2;
  return (
    <div
      className={`relative flex h-[74px] w-[52px] flex-col justify-between rounded-[8px] bg-cream p-[6px] text-background shadow-[0_16px_32px_-18px_rgba(0,0,0,0.95)] ${className}`}
    >
      <span
        className={`font-mono text-[14px] font-bold leading-none tracking-tight ${
          red ? "text-ember" : "text-background"
        }`}
      >
        {RANK_LABEL[card.rank]}
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[22px] leading-none ${
          red ? "text-ember/80" : "text-background/25"
        }`}
      >
        {SUIT_SYMBOLS[card.suit]}
      </span>
      <span
        className={`rotate-180 self-end font-mono text-[14px] font-bold leading-none tracking-tight ${
          red ? "text-ember" : "text-background"
        }`}
      >
        {RANK_LABEL[card.rank]}
      </span>
    </div>
  );
}

export function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-[74px] w-[52px] overflow-hidden rounded-[8px] border border-white/15 bg-[#060d2c] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_22%,rgba(111,255,0,0.3),transparent_62%),radial-gradient(circle_at_72%_80%,rgba(183,36,255,0.34),transparent_58%)]" />
      <div className="absolute inset-[14%] rounded-[5px] border border-white/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-[42%] w-[42%] place-items-center rounded-full border border-neon/25 bg-neon/[0.05]" />
      </div>
    </div>
  );
}
