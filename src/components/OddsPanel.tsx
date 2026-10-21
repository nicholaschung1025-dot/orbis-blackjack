import type { OddsResult } from "../lib/sim.worker";

interface OddsPanelProps {
  odds: OddsResult | null;
  pending: boolean;
  opponents: number;
  hasHand: boolean;
}

const rows = [
  { key: "win", label: "Win", color: "#6FFF00", text: "text-neon" },
  { key: "tie", label: "Tie", color: "#EFF4FF", text: "text-cream/70" },
  { key: "loss", label: "Loss", color: "#FF6B8A", text: "text-ember" },
] as const;

function format(value: number | undefined): string {
  if (value === undefined) return "—";
  return value.toFixed(1);
}

export function OddsPanel({
  odds,
  pending,
  opponents,
  hasHand,
}: OddsPanelProps) {
  const equity = odds?.equity;

  return (
    <div className="liquid-glass glass-panel relative flex flex-col overflow-hidden rounded-[26px] p-5 sm:rounded-[32px] sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-neon/[0.07] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-cream/50">
            Equity / all-in
          </p>
          <div className="mt-3 flex min-h-[50px] items-baseline gap-1 sm:min-h-[62px]">
            {equity === undefined ? (
              <>
                <span className="font-grotesk text-[62px] leading-[0.8] text-cream/35 sm:text-[78px]">
                  —
                </span>
                <span className="font-grotesk text-2xl leading-none text-cream/40">
                  %
                </span>
              </>
            ) : (
              <>
                <span
                  className="font-grotesk text-[62px] leading-[0.8] tabular text-cream sm:text-[78px]"
                  aria-live="polite"
                >
                  {format(equity)}
                </span>
                <span className="font-grotesk text-2xl leading-none text-cream/40">
                  %
                </span>
              </>
            )}
          </div>
        </div>

        <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5">
          <span
            className={`h-1.5 w-1.5 rounded-full bg-neon ${
              pending ? "animate-blink" : ""
            }`}
          />
          <span className="text-[8px] uppercase tracking-[0.2em] text-cream/50">
            {pending ? "Running" : "Live"}
          </span>
        </div>
      </div>

      <p className="relative mt-3 text-[9px] uppercase leading-relaxed tracking-[0.12em] text-cream/45">
        {hasHand
          ? `Your expected share of the pot against ${opponents} random ${
              opponents === 1 ? "hand" : "hands"
            }.`
          : "Pick your two hole cards to begin the simulation."}
      </p>

      <div className="relative mt-8 space-y-5">
        {rows.map((row) => {
          const value = odds ? odds[row.key] : undefined;
          return (
            <div key={row.key}>
              <div className="flex items-baseline justify-between">
                <span className="text-[9px] uppercase tracking-[0.24em] text-cream/60">
                  {row.label}
                </span>
                <span
                  className={`font-grotesk text-xl leading-none tabular ${
                    value === undefined ? "text-cream/30" : row.text
                  }`}
                >
                  {format(value)}
                  <span className="ml-0.5 text-[10px] text-cream/30">%</span>
                </span>
              </div>
              <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full transition-[width] duration-500 ease-out"
                  style={{
                    width: `${value ?? 0}%`,
                    backgroundColor: row.color,
                    opacity: row.key === "tie" ? 0.5 : 1,
                  }}
                />
              </div>
            </div>
          );
        })}
      </div>

      <div className="relative mt-auto pt-9">
        <div className="flex items-center justify-between border-t border-white/10 pt-4 text-[8px] uppercase tracking-[0.18em] text-cream/45">
          <span>{odds ? `${odds.iterations.toLocaleString("en-US")} runouts` : "24,000 planned"}</span>
          <span>{odds ? `${Math.max(1, Math.round(odds.elapsedMs))} ms` : "Monte Carlo"}</span>
        </div>
        <p className="mt-3 text-[9px] leading-relaxed text-cream/35">
          Estimates assume every unknown hand is dealt at random. Tied pots are
          split between the players who share the winning hand.
        </p>
      </div>
    </div>
  );
}
