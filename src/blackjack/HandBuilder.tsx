import {
  RANKS,
  RANK_LABEL,
  SUIT_NAMES,
  SUIT_SYMBOLS,
  type BCard,
  type Suit,
} from "../lib/blackjack";
import { CardBack, CasinoCard } from "./CasinoCard";

export type Slot = "player" | "up" | "hole";

interface HandBuilderProps {
  player: BCard[];
  up: BCard | null;
  hole: BCard | null;
  holeKnown: boolean;
  rank: number;
  suit: Suit;
  /** Cards the player has drawn by hitting, newest last. */
  hits: BCard[];
  onRank: (rank: number) => void;
  onSuit: (suit: Suit) => void;
  onAdd: (slot: Slot) => void;
  onRemove: (slot: Slot, index: number) => void;
  onToggleHole: () => void;
  onRandom: () => void;
  onClear: () => void;
}

function AddSlot({
  onClick,
  label,
  pending,
}: {
  onClick: () => void;
  label: string;
  pending: string;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      aria-label={label}
      className="flex h-[74px] w-[56px] flex-col items-center justify-center gap-1 rounded-[8px] border border-dashed border-white/25 bg-white/[0.02] transition-colors hover:border-neon/70 hover:bg-neon/[0.08]"
    >
      <span className="font-grotesk text-[15px] leading-none text-cream/30">
        +
      </span>
      <span className="font-mono text-[12px] font-bold leading-none text-neon/80">
        {pending}
      </span>
    </button>
  );
}

export function HandBuilder({
  player,
  up,
  hole,
  holeKnown,
  rank,
  suit,
  hits,
  onRank,
  onSuit,
  onAdd,
  onRemove,
  onToggleHole,
  onRandom,
  onClear,
}: HandBuilderProps) {
  const pending = `${RANK_LABEL[rank]}${SUIT_SYMBOLS[suit]}`;
  const pendingName = `${RANK_LABEL[rank]} of ${SUIT_NAMES[suit]}`;

  const rankChips = RANKS.map((value) => (
    <button
      key={value}
      type="button"
      onClick={() => onRank(value)}
      className={`grid h-10 min-w-[36px] place-items-center rounded-[7px] border px-1.5 font-mono text-[14px] font-bold leading-none tracking-tight transition-colors ${
        rank === value
          ? "border-neon/70 bg-neon/20 text-neon"
          : "border-white/15 bg-white/[0.03] text-cream/75 hover:border-white/35 hover:text-cream"
      }`}
    >
      {RANK_LABEL[value]}
    </button>
  ));

  const suitChips = SUIT_SYMBOLS.map((symbol, index) => (
    <button
      key={symbol}
      type="button"
      onClick={() => onSuit(index as Suit)}
      aria-label={`Suit ${SUIT_NAMES[index]}`}
      className={`grid h-11 w-11 place-items-center rounded-[7px] border text-[20px] leading-none transition-colors ${
        suit === index
          ? "border-neon/70 bg-neon/20"
          : "border-white/15 bg-white/[0.03] hover:border-white/35"
      } ${index === 1 || index === 2 ? "text-ember" : "text-cream/85"}`}
    >
      {symbol}
    </button>
  ));

  return (
    <div className="liquid-glass glass-panel rounded-[26px] p-5 sm:rounded-[32px] sm:p-7">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <p className="text-[10px] uppercase tracking-[0.3em] text-cream/50">
            Table / Your cards
          </p>
          <h2 className="mt-2 font-grotesk text-[28px] uppercase leading-none sm:text-[32px]">
            Deal it in
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onRandom}
            className="rounded-full bg-neon px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-cream"
          >
            Random
          </button>
          <button
            type="button"
            onClick={onClear}
            className="liquid-glass rounded-full px-5 py-2.5 font-grotesk text-[12px] uppercase tracking-[0.12em] text-cream/70 transition-colors hover:bg-white/10"
          >
            Clear
          </button>
        </div>
      </div>

      <div className="mt-6 space-y-5">
        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.26em] text-cream/60">
              Your hand
            </span>
            <span className="text-[10px] uppercase tracking-[0.2em] text-cream/45">
              {player.length} {player.length === 1 ? "card" : "cards"}
            </span>
          </div>
          <div className="mt-3 flex flex-wrap gap-2">
            {[0, 1].map((index) => {
              const card = player[index];
              return card ? (
                <button
                  key={index}
                  type="button"
                  onClick={() => onRemove("player", index)}
                  aria-label={`Remove ${RANK_LABEL[card.rank]} of ${SUIT_NAMES[card.suit]} from your hand`}
                  className="transition-transform duration-200 hover:-translate-y-1"
                >
                  <CasinoCard card={card} />
                </button>
              ) : (
                <AddSlot
                  key={index}
                  onClick={() => onAdd("player")}
                  label={`Add ${pendingName} to your hand`}
                  pending={pending}
                />
              );
            })}
            {hits.map((card, index) => (
              <div
                key={`${card.rank}-${card.suit}-${index}`}
                className="relative"
                title={`Drawn by hitting`}
              >
                <CasinoCard card={card} className="ring-1 ring-neon/40" />
                <span className="absolute -right-1 -top-1 grid h-4 w-4 place-items-center rounded-full bg-neon text-[8px] font-bold text-background">
                  {index + 1}
                </span>
              </div>
            ))}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.26em] text-cream/60">
              Dealer up card
            </span>
          </div>
          <div className="mt-3 flex gap-2">
            {up ? (
              <button
                type="button"
                onClick={() => onRemove("up", 0)}
                aria-label={`Remove dealer up card ${RANK_LABEL[up.rank]} of ${SUIT_NAMES[up.suit]}`}
                className="transition-transform duration-200 hover:-translate-y-1"
              >
                <CasinoCard card={up} />
              </button>
            ) : (
              <AddSlot
                onClick={() => onAdd("up")}
                label={`Add ${pendingName} as the dealer up card`}
                pending={pending}
              />
            )}
          </div>
        </div>

        <div>
          <div className="flex items-center justify-between">
            <span className="text-[10px] uppercase tracking-[0.26em] text-cream/60">
              Hole card
            </span>
            <button
              type="button"
              onClick={onToggleHole}
              className="rounded-full border border-white/15 px-4 py-1.5 text-[9px] uppercase tracking-[0.18em] text-cream/60 transition-colors hover:border-neon/60 hover:text-neon"
            >
              {holeKnown ? "Known" : "Hidden"}
            </button>
          </div>
          <div className="mt-3 flex gap-2">
            {holeKnown ? (
              hole ? (
                <button
                  type="button"
                  onClick={() => onRemove("hole", 0)}
                  aria-label={`Remove hole card ${RANK_LABEL[hole.rank]} of ${SUIT_NAMES[hole.suit]}`}
                  className="transition-transform duration-200 hover:-translate-y-1"
                >
                  <CasinoCard card={hole} />
                </button>
              ) : (
                <AddSlot
                  onClick={() => onAdd("hole")}
                  label={`Add ${pendingName} as the hole card`}
                  pending={pending}
                />
              )
            ) : (
              <CardBack />
            )}
          </div>
        </div>
      </div>

      <div className="mt-6 border-t border-white/10 pt-5">
        <div className="flex items-center justify-between">
          <span className="text-[10px] uppercase tracking-[0.26em] text-cream/60">
            Pick a card
          </span>
          <span className="rounded-full border border-neon/40 bg-neon/[0.08] px-3 py-1 font-mono text-[13px] font-bold text-neon">
            {pending}
          </span>
        </div>

        <div className="mt-3 flex gap-2">{suitChips}</div>

        <span className="mt-5 block text-[10px] uppercase tracking-[0.26em] text-cream/60">
          Rank
        </span>
        <div className="mt-3 flex flex-wrap gap-1.5">{rankChips}</div>
      </div>
    </div>
  );
}
