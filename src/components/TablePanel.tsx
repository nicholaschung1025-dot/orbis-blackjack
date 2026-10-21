import { Minus, Plus, RotateCcw, Shuffle } from "lucide-react";
import {
  BOARD_COUNT,
  STREETS,
  STREET_LABEL,
  cardFullName,
  type Street,
} from "../lib/cards";
import { rosterFor } from "../lib/opponents";
import type { SeatStats } from "../lib/sim.worker";
import { CardFace, CardSlot } from "./PlayingCard";
import { OpponentSeat } from "./OpponentSeat";

interface TablePanelProps {
  hole: (number | null)[];
  board: (number | null)[];
  street: Street;
  opponents: number;
  handName: string;
  draws: string[];
  pending: boolean;
  seats: SeatStats[];
  onStreet: (street: Street) => void;
  onOpponents: (count: number | ((previous: number) => number)) => void;
  onDeal: () => void;
  onClear: () => void;
  onRemoveHole: (index: number) => void;
  onRemoveBoard: (index: number) => void;
}

const cardSize =
  "h-[74px] w-[52px] text-[12px] sm:h-[96px] sm:w-[68px] sm:text-[14px] lg:h-[112px] lg:w-[80px] lg:text-[15px]";

export function TablePanel({
  hole,
  board,
  street,
  opponents,
  handName,
  draws,
  pending,
  seats,
  onStreet,
  onOpponents,
  onDeal,
  onClear,
  onRemoveHole,
  onRemoveBoard,
}: TablePanelProps) {
  const activeCount = BOARD_COUNT[street];
  const field = rosterFor(opponents);

  return (
    <div className="liquid-glass glass-panel rounded-[26px] p-4 sm:rounded-[32px] sm:p-7">
      <div className="flex flex-col justify-between gap-4 xl:flex-row xl:items-start">
        <div>
          <p className="text-[9px] uppercase tracking-[0.3em] text-cream/50">
            Simulation / 24,000 runouts
          </p>
          <h2 className="mt-2 font-grotesk text-[26px] uppercase leading-none sm:text-[32px]">
            The table
          </h2>
        </div>

        <div
          className="liquid-glass flex w-full rounded-full p-1 xl:w-auto"
          role="tablist"
          aria-label="Betting round"
        >
          {STREETS.map((item) => {
            const active = item === street;
            return (
              <button
                key={item}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => onStreet(item)}
                className={`flex-1 rounded-full px-2 py-2 font-grotesk text-[9px] uppercase tracking-[0.1em] transition-colors sm:px-4 sm:text-[10px] xl:flex-none ${
                  active
                    ? "bg-neon text-background"
                    : "text-cream/45 hover:text-cream"
                }`}
              >
                {STREET_LABEL[item]}
              </button>
            );
          })}
        </div>
      </div>

      <div className="mt-6 rounded-[22px] border border-white/[0.06] bg-[radial-gradient(90%_120%_at_50%_0%,rgba(111,255,0,0.055),transparent_60%),rgba(1,8,40,0.25)] p-4 sm:p-6">
        <div className="mb-5 flex flex-wrap items-start justify-center gap-x-1 gap-y-4 sm:mb-7">
          {field.map((opponent, index) => (
            <OpponentSeat
              key={opponent.id}
              opponent={opponent}
              stats={seats[index] ?? null}
              pending={pending}
              size={
                field.length <= 4 ? "lg" : field.length <= 6 ? "md" : "sm"
              }
              position={
                field.length > 1
                  ? (index - (field.length - 1) / 2) / ((field.length - 1) / 2)
                  : 0
              }
            />
          ))}
        </div>

        <div className="flex items-center justify-between">
          <span className="text-[8px] uppercase tracking-[0.26em] text-cream/55">
            Community
          </span>
          <span className="text-[8px] uppercase tracking-[0.2em] text-cream/45">
            {activeCount} / 5 dealt
          </span>
        </div>

        <div className="mt-4 flex items-center gap-3">
          <div className="flex gap-1.5 sm:gap-3">
            {board.map((card, index) => {
              const active = index < activeCount;
              return (
                <div key={index} className={cardSize}>
                  {active && card !== null ? (
                    <button
                      type="button"
                      onClick={() => onRemoveBoard(index)}
                      className="h-full w-full transition-transform duration-200 hover:-translate-y-1"
                      aria-label={`Remove ${cardFullName(card)} from the board`}
                    >
                      <CardFace card={card} />
                    </button>
                  ) : (
                    <CardSlot
                      active={active}
                      label={active ? "pick" : undefined}
                    />
                  )}
                </div>
              );
            })}
          </div>
          {activeCount < 5 ? (
            <p className="ml-auto hidden max-w-[150px] text-right text-[8px] uppercase leading-relaxed tracking-[0.16em] text-cream/35 sm:block">
              Tap a card below to fill the board
            </p>
          ) : null}
        </div>

      </div>

      <div className="mt-4 flex flex-col gap-5 rounded-[22px] border border-white/[0.06] bg-white/[0.015] p-4 sm:flex-row sm:items-center sm:justify-between sm:p-5">
        <div className="flex items-center gap-3">
          <div className="flex gap-1.5">
            {hole.map((card, index) => (
              <div key={index} className={cardSize}>
                {card !== null ? (
                  <button
                    type="button"
                    onClick={() => onRemoveHole(index)}
                    className="h-full w-full transition-transform duration-200 hover:-translate-y-1"
                    aria-label={`Remove ${cardFullName(card)} from your hand`}
                  >
                    <CardFace card={card} />
                  </button>
                ) : (
                  <CardSlot active label={index === 0 ? "you" : undefined} />
                )}
              </div>
            ))}
          </div>
          <div>
            <p className="text-[8px] uppercase tracking-[0.26em] text-cream/55">
              Your hand
            </p>
            <p className="mt-1 max-w-[180px] font-grotesk text-base uppercase leading-tight sm:text-lg">
              {handName}
            </p>
            {draws.length > 0 ? (
              <div className="mt-1.5 flex flex-wrap gap-1">
                {draws.map((draw) => (
                  <span
                    key={draw}
                    className="rounded-full border border-neon/30 bg-neon/[0.06] px-2 py-0.5 text-[7px] uppercase tracking-[0.16em] text-neon/90"
                  >
                    {draw}
                  </span>
                ))}
              </div>
            ) : null}
          </div>
        </div>

        <div className="flex items-center justify-between gap-4 sm:flex-col sm:items-end">
          <p className="text-[8px] uppercase tracking-[0.26em] text-cream/55">
            Unknown hands
          </p>
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => onOpponents((previous) => Math.max(1, previous - 1))}
              disabled={opponents <= 1}
              aria-label="Remove an opponent"
              className="liquid-glass grid h-7 w-7 place-items-center rounded-full text-cream/70 transition hover:bg-white/10 disabled:opacity-25"
            >
              <Minus size={12} />
            </button>
            <span className="w-5 text-center font-grotesk text-xl leading-none tabular">
              {opponents}
            </span>
            <button
              type="button"
              onClick={() => onOpponents((previous) => Math.min(8, previous + 1))}
              disabled={opponents >= 8}
              aria-label="Add an opponent"
              className="liquid-glass grid h-7 w-7 place-items-center rounded-full text-cream/70 transition hover:bg-white/10 disabled:opacity-25"
            >
              <Plus size={12} />
            </button>
          </div>
        </div>
      </div>

      <div className="mt-3 flex flex-wrap items-center gap-2">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            {opponents} {opponents === 1 ? "opponent" : "opponents"} seated
          </span>
        </div>

        <div className="ml-auto flex flex-wrap items-center gap-2">
          <button
            type="button"
            onClick={onDeal}
            className="flex items-center gap-2 rounded-full bg-neon px-5 py-2.5 font-grotesk text-[10px] uppercase tracking-[0.14em] text-background shadow-[0_0_30px_-10px_rgba(111,255,0,0.75)] transition hover:bg-cream"
          >
            <Shuffle size={12} />
            Deal random
          </button>
          <button
            type="button"
            onClick={onClear}
            className="liquid-glass flex items-center gap-2 rounded-full px-4 py-2.5 font-grotesk text-[10px] uppercase tracking-[0.14em] text-cream/70 transition hover:bg-white/10"
          >
            <RotateCcw size={12} />
            Clear
          </button>
        </div>

        {pending ? (
          <span className="hidden text-[8px] uppercase tracking-[0.24em] text-neon/80 sm:block">
            Recalculating
          </span>
        ) : null}
      </div>
    </div>
  );
}
