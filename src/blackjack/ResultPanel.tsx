import { cardLabel, type Analysis, type ActionName, type BCard } from "../lib/blackjack";

const ACTION_LABEL: Record<ActionName, string> = {
  hit: "Hit",
  stand: "Stand",
  double: "Double",
  split: "Split",
  bust: "Bust",
  blackjack: "Blackjack",
};

const OUTCOME_ROWS = [
  { key: "win", label: "Win", color: "#6FFF00" },
  { key: "push", label: "Push", color: "#EFF4FF" },
  { key: "lose", label: "Lose", color: "#FF6B8A" },
  { key: "bust", label: "Bust", color: "#FF6B8A" },
  { key: "blackjack", label: "Natural", color: "#b724ff" },
] as const;

interface ResultPanelProps {
  analysis: Analysis | null;
  /** The card the player has selected and would draw on a hit. */
  pending: BCard;
  /** Cards drawn by hitting so far, newest last. */
  hits: BCard[];
  canHit: boolean;
  onHit: () => void;
  onUndoHit: () => void;
}

function percent(value: number) {
  return `${(value * 100).toFixed(1)}%`;
}

function ev(value: number) {
  const pct = value * 100;
  return `${pct >= 0 ? "+" : ""}${pct.toFixed(2)}%`;
}

export function ResultPanel({
  analysis,
  pending,
  hits,
  canHit,
  onHit,
  onUndoHit,
}: ResultPanelProps) {
  if (!analysis) {
    return (
      <div className="liquid-glass glass-panel flex flex-col justify-center rounded-[26px] p-6 sm:rounded-[32px] sm:p-8">
        <p className="text-[10px] uppercase tracking-[0.26em] text-cream/50">
          Equity / Expected value
        </p>
        <p className="mt-6 max-w-[280px] text-[11px] uppercase leading-[1.9] tracking-[0.04em] text-cream/50">
          Pick your two hole cards and the dealer&apos;s up card to read the
          table.
        </p>
        <div className="mt-8 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
          <div className="h-full w-0 rounded-full bg-neon" />
        </div>
      </div>
    );
  }

  const best = analysis.best;
  const dealerTotals = Object.entries(analysis.dealer.totals)
    .map(([total, chance]) => ({ total: Number(total), chance }))
    .sort((a, b) => a.total - b.total);
  const peak = Math.max(
    ...dealerTotals.map((row) => row.chance),
    analysis.dealerBust,
    0.0001,
  );

  return (
    <div className="liquid-glass glass-panel relative flex flex-col overflow-hidden rounded-[26px] p-5 sm:rounded-[32px] sm:p-7">
      <div className="pointer-events-none absolute -right-16 -top-24 h-56 w-56 rounded-full bg-neon/[0.07] blur-3xl" />

      <div className="relative flex items-start justify-between">
        <div>
          <p className="text-[10px] uppercase tracking-[0.26em] text-cream/50">
            Equity / Expected value
          </p>
          <h2 className="mt-3 font-grotesk text-[42px] uppercase leading-none tracking-tight text-neon sm:text-[56px]">
            {ACTION_LABEL[best]}
          </h2>
          <p className="mt-2 text-[12px] uppercase tracking-[0.06em] text-cream/50">
            {ev(analysis.bestEv)} per unit bet
          </p>
        </div>
        <div className="flex items-center gap-1.5 rounded-full border border-white/10 px-2.5 py-1.5">
          <span className="h-1.5 w-1.5 rounded-full bg-neon" />
          <span className="text-[8px] uppercase tracking-[0.2em] text-cream/50">
            Exact
          </span>
        </div>
      </div>

      {canHit ? (
        <button
          type="button"
          onClick={onHit}
          aria-label={`Hit and draw ${cardLabel(pending)}`}
          className="group relative mt-5 flex w-full items-center justify-between gap-3 rounded-[16px] bg-neon px-5 py-4 text-background shadow-[0_0_34px_-10px_rgba(111,255,0,0.7)] transition-colors hover:bg-cream"
        >
          <span className="font-grotesk text-[18px] uppercase leading-none tracking-[0.1em]">
            Hit · draw {cardLabel(pending)}
          </span>
          <span className="text-[10px] uppercase tracking-[0.16em] opacity-70">
            Pick a card, then hit
          </span>
        </button>
      ) : null}

      {hits.length > 0 ? (
        <div className="relative mt-3 flex flex-wrap items-center gap-2 rounded-[12px] border border-white/[0.07] bg-white/[0.015] px-4 py-3">
          <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
            Drawn
          </span>
          {hits.map((card, index) => (
            <span
              key={`${card.rank}-${card.suit}-${index}`}
              className="rounded-[6px] border border-neon/30 bg-neon/[0.08] px-2 py-1 font-mono text-[12px] font-bold text-neon"
            >
              {cardLabel(card)}
            </span>
          ))}
          <button
            type="button"
            onClick={onUndoHit}
            className="ml-auto rounded-full border border-white/15 px-3 py-1 text-[9px] uppercase tracking-[0.16em] text-cream/55 transition-colors hover:border-ember/50 hover:text-ember"
          >
            Undo
          </button>
        </div>
      ) : null}

      <div className="relative mt-7 space-y-2.5">
        {analysis.options.map((option) => {
          const active = option.action === best;
          return (
            <div
              key={option.action}
              className={`flex items-center justify-between rounded-[12px] border px-4 py-2.5 ${
                active
                  ? "border-neon/35 bg-neon/[0.07]"
                  : "border-white/[0.07] bg-white/[0.015]"
              }`}
            >
              <span
                className={`font-grotesk text-[14px] uppercase tracking-[0.12em] ${
                  active ? "text-neon" : "text-cream/55"
                }`}
              >
                {ACTION_LABEL[option.action]}
              </span>
              <span
                className={`text-[14px] tabular ${
                  !option.available
                    ? "text-cream/25"
                    : option.ev >= 0
                      ? "text-neon/90"
                      : "text-ember/80"
                }`}
              >
                {option.available ? ev(option.ev) : "n/a"}
              </span>
            </div>
          );
        })}
      </div>

      <div className="relative mt-8">
        <p className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
          Your outcome
        </p>
        <div className="mt-4 space-y-3.5">
          {OUTCOME_ROWS.map((row) => {
            const value = analysis.outcomes[row.key];
            return (
              <div key={row.key}>
                <div className="flex items-baseline justify-between">
                  <span className="text-[11px] uppercase tracking-[0.2em] text-cream/60">
                    {row.label}
                  </span>
                  <span className="text-[14px] tabular text-cream/85">
                    {percent(value)}
                  </span>
                </div>
                <div className="mt-1.5 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
                  <div
                    className="h-full rounded-full transition-[width] duration-500 ease-out"
                    style={{
                      width: `${Math.min(100, value * 100)}%`,
                      backgroundColor: row.color,
                      opacity: row.key === "push" ? 0.55 : 1,
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="relative mt-8 border-t border-white/10 pt-6">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.22em] text-cream/50">
            Dealer bust
          </span>
          <span className="font-grotesk text-[20px] leading-none text-ember tabular">
            {percent(analysis.dealerBust)}
          </span>
        </div>

        <p className="mt-5 text-[10px] uppercase tracking-[0.22em] text-cream/50">
          Dealer final hand
        </p>
        <div className="mt-3 space-y-2">
          {dealerTotals.map((row) => (
            <div key={row.total} className="flex items-center gap-3">
              <span className="w-6 text-[10px] text-cream/55 tabular">
                {row.total}
              </span>
              <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
                <div
                  className="h-full rounded-full bg-cream/55"
                  style={{ width: `${(row.chance / peak) * 100}%` }}
                />
              </div>
              <span className="w-11 text-right text-[9px] text-cream/50 tabular">
                {percent(row.chance)}
              </span>
            </div>
          ))}
          <div className="flex items-center gap-3">
            <span className="w-6 text-[10px] text-ember/80">B</span>
            <div className="h-[4px] flex-1 overflow-hidden rounded-full bg-white/[0.07]">
              <div
                className="h-full rounded-full bg-ember/80"
                style={{ width: `${(analysis.dealerBust / peak) * 100}%` }}
              />
            </div>
            <span className="w-11 text-right text-[9px] text-ember/80 tabular">
              {percent(analysis.dealerBust)}
            </span>
          </div>
        </div>
      </div>

      <p className="relative mt-7 text-[11px] leading-relaxed text-cream/35">
        Expected value is the exact return per unit wagered across every
        possible runout of the remaining shoe. A positive number means the hand
        is worth playing; a negative one is the house edge on that spot.
      </p>
    </div>
  );
}
