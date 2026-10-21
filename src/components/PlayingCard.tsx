import type { ReactNode } from "react";
import { isRed, rankLabel, suitSymbol } from "../lib/cards";

interface CardFaceProps {
  card: number;
  className?: string;
}

export function CardFace({ card, className = "" }: CardFaceProps) {
  const red = isRed(card);
  const symbol = suitSymbol(card);

  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[11px] bg-cream text-background shadow-[0_18px_38px_-20px_rgba(0,0,0,0.95)] ring-1 ring-inset ring-white/70 ${className}`}
    >
      <div className="absolute inset-[5px] rounded-[7px] ring-1 ring-inset ring-background/10" />
      <div className="relative flex h-full w-full flex-col justify-between p-[8%]">
        <div className="flex flex-col items-start leading-none">
          <span className="font-grotesk text-[1.45em] leading-[0.85] tracking-tight">
            {rankLabel(card)}
          </span>
          <span
            className={`mt-[0.08em] text-[0.85em] leading-none ${
              red ? "text-ember" : "text-background/60"
            }`}
          >
            {symbol}
          </span>
        </div>
        <div className="flex rotate-180 flex-col items-start leading-none opacity-70">
          <span className="font-grotesk text-[0.8em] leading-[0.85]">
            {rankLabel(card)}
          </span>
          <span
            className={`mt-[0.06em] text-[0.6em] leading-none ${
              red ? "text-ember" : "text-background/60"
            }`}
          >
            {symbol}
          </span>
        </div>
      </div>
      <span
        aria-hidden="true"
        className={`pointer-events-none absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[2.1em] leading-none ${
          red ? "text-ember/75" : "text-background/30"
        }`}
      >
        {symbol}
      </span>
    </div>
  );
}

export function CardBack({ className = "" }: { className?: string }) {
  return (
    <div
      className={`relative h-full w-full overflow-hidden rounded-[11px] border border-white/15 bg-[#060d2c] ${className}`}
    >
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_28%_18%,rgba(111,255,0,0.22),transparent_55%),radial-gradient(circle_at_74%_82%,rgba(183,36,255,0.28),transparent_52%)]" />
      <div className="absolute inset-[9%] rounded-[7px] border border-white/10" />
      <div className="absolute inset-0 grid place-items-center">
        <div className="grid h-[44%] w-[44%] place-items-center rounded-full border border-neon/25 bg-neon/[0.04]">
          <div className="h-1/2 w-1/2 rounded-full bg-neon/15" />
        </div>
      </div>
    </div>
  );
}

export function CardSlot({
  label,
  active,
  children,
}: {
  label?: string;
  active: boolean;
  children?: ReactNode;
}) {
  if (children) return <>{children}</>;

  return (
    <div
      className={`relative flex h-full w-full flex-col items-center justify-center gap-1 rounded-[11px] border border-dashed transition-colors ${
        active
          ? "border-white/35 bg-white/[0.05]"
          : "border-white/[0.16] bg-white/[0.014]"
      }`}
    >
      <span
        aria-hidden="true"
        className={`font-grotesk text-lg leading-none ${
          active ? "text-cream/50" : "text-cream/20"
        }`}
      >
        +
      </span>
      {label ? (
        <span
          className={`text-[7px] uppercase tracking-[0.18em] ${
            active ? "text-cream/45" : "text-cream/15"
          }`}
        >
          {label}
        </span>
      ) : null}
    </div>
  );
}
