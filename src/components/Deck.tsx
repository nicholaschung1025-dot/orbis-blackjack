import {
  ALL_CARDS,
  SUITS,
  cardFullName,
  cardSuit,
  isRed,
  rankLabel,
} from "../lib/cards";

interface DeckProps {
  used: Set<number>;
  onPick: (card: number) => void;
}

export function Deck({ used, onPick }: DeckProps) {
  const remaining = 52 - used.size;

  return (
    <section
      id="deck"
      className="relative mx-auto mt-24 max-w-[1831px] scroll-mt-28 px-4 sm:mt-32 sm:px-6"
    >
      <div className="flex flex-col justify-between gap-5 sm:flex-row sm:items-end">
        <div>
          <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
            Section 02 / Interactive deck
          </p>
          <h2 className="mt-3 font-grotesk text-[32px] uppercase leading-[0.95] sm:text-[52px]">
            Pick your{" "}
            <span className="font-condiment normal-case text-neon">cards</span>
          </h2>
        </div>
        <div className="flex items-center gap-6 sm:pb-1">
          <p className="max-w-[260px] text-[10px] uppercase leading-relaxed tracking-[0.04em] text-cream/60">
            Tap a card to place it on the table. Tap it again to send it back to
            the deck.
          </p>
          <div className="text-right">
            <p className="font-grotesk text-2xl leading-none tabular">
              {String(remaining).padStart(2, "0")}
            </p>
            <p className="mt-1 text-[8px] uppercase tracking-[0.22em] text-cream/50">
              Remaining
            </p>
          </div>
        </div>
      </div>

      <div className="liquid-glass glass-panel mt-6 rounded-[26px] p-3 sm:mt-8 sm:rounded-[32px] sm:p-5">
        <div className="relative">
          <div className="overflow-x-auto no-scrollbar">
          <div className="min-w-[680px] space-y-1.5 sm:space-y-2">
            {SUITS.map((suit, suitIndex) => (
              <div
                key={suit.key}
                className="grid grid-cols-[42px_1fr] items-center gap-2 sm:gap-3"
              >
                <div className="flex flex-col items-center gap-0.5">
                  <span
                    className={`text-[19px] leading-none ${
                      suit.tone === "ember" ? "text-ember" : "text-cream"
                    }`}
                  >
                    {suit.symbol}
                  </span>
                  <span className="text-[6px] uppercase tracking-[0.16em] text-cream/45">
                    {suit.name}
                  </span>
                </div>
                <div className="grid grid-cols-[repeat(13,minmax(0,1fr))] gap-1 sm:gap-1.5">
                  {ALL_CARDS.filter((card) => cardSuit(card) === suitIndex).map(
                    (card) => {
                      const active = used.has(card);
                      const red = isRed(card);
                      return (
                        <button
                          key={card}
                          type="button"
                          onClick={() => onPick(card)}
                          aria-pressed={active}
                          aria-label={`${cardFullName(card)}${
                            active ? ", on the table" : ""
                          }`}
                          className={`group relative flex aspect-[3/4] flex-col items-center justify-center gap-0.5 rounded-[8px] border transition-all duration-200 ${
                            active
                              ? "border-neon/45 bg-neon/[0.07] opacity-40"
                              : "border-white/[0.14] bg-white/[0.035] hover:-translate-y-1 hover:border-neon/45 hover:bg-white/[0.08] hover:shadow-[0_12px_24px_-16px_rgba(111,255,0,0.35)]"
                          }`}
                        >
                          <span
                            className={`absolute left-1.5 top-1.5 font-grotesk text-[15px] leading-none sm:left-2 sm:top-2 sm:text-[17px] ${
                              red ? "text-ember" : "text-cream"
                            }`}
                          >
                            {rankLabel(card)}
                          </span>
                          <span
                            className={`absolute left-1.5 top-[23px] text-[10px] leading-none sm:left-2 sm:top-[27px] sm:text-[11px] ${
                              red ? "text-ember/70" : "text-cream/55"
                            }`}
                          >
                            {suit.symbol}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`text-[24px] leading-none sm:text-[28px] ${
                              red ? "text-ember/25" : "text-cream/15"
                            }`}
                          >
                            {suit.symbol}
                          </span>
                          <span
                            aria-hidden="true"
                            className={`absolute bottom-1.5 right-1.5 rotate-180 font-grotesk text-[9px] leading-none opacity-50 ${
                              red ? "text-ember" : "text-cream"
                            }`}
                          >
                            {rankLabel(card)}
                          </span>
                          {active ? (
                            <span className="absolute right-1.5 top-1.5 h-1 w-1 rounded-full bg-neon shadow-[0_0_6px_rgba(111,255,0,0.9)]" />
                          ) : null}
                        </button>
                      );
                    },
                  )}
                </div>
              </div>
            ))}
          </div>
          </div>
          <div className="pointer-events-none absolute inset-y-0 right-0 w-10 bg-gradient-to-l from-[#020b2e] to-transparent sm:hidden" />
        </div>
        <p className="mt-2 text-right text-[8px] uppercase tracking-[0.2em] text-cream/35 sm:hidden">
          Swipe to see all four suits →
        </p>
      </div>
    </section>
  );
}
