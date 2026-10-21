import { useMemo, useState } from "react";
import { Deck } from "./components/Deck";
import { Footer } from "./components/Footer";
import { Hero } from "./components/Hero";
import { Method } from "./components/Method";
import { Nav } from "./components/Nav";
import { OddsPanel } from "./components/OddsPanel";
import { SpaceVideo } from "./components/SpaceVideo";
import { TablePanel } from "./components/TablePanel";
import { useOdds } from "./hooks/useOdds";
import {
  ALL_CARDS,
  BOARD_COUNT,
  type Street,
  describeHole,
  shuffle,
} from "./lib/cards";
import { detectDraws, evaluate } from "./lib/evaluator";
import { RATIOS, VIDEOS } from "./lib/media";

type Slots = (number | null)[];

interface Table {
  hole: Slots;
  board: Slots;
}

const emptyTable: Table = {
  hole: [null, null],
  board: [null, null, null, null, null],
};

export default function App() {
  const [table, setTable] = useState<Table>(emptyTable);
  const [street, setStreet] = useState<Street>("preflop");
  const [opponents, setOpponents] = useState(1);

  const { hole, board } = table;
  const activeCount = BOARD_COUNT[street];
  const holeIds = hole.filter((card): card is number => card !== null);
  const boardIds = board
    .slice(0, activeCount)
    .filter((card): card is number => card !== null);

  const { odds, pending } = useOdds(holeIds, boardIds, opponents);

  const known = [...holeIds, ...boardIds];
  const knownKey = known.join(",");
  const hasHand = holeIds.length === 2;

  const handName = useMemo(() => {
    if (!hasHand) return "Pick two cards";
    if (known.length >= 5) return evaluate(known).detail;
    return describeHole(holeIds);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knownKey, hasHand]);

  const draws = useMemo(() => {
    if (!hasHand || activeCount < 3 || known.length < 5) return [];
    const value = evaluate(known);
    const info = detectDraws(known);
    const list: string[] = [];
    if (info.flushDraw && value.category < 5) list.push("Flush draw");
    if (info.straightDraw && value.category < 4) {
      list.push(info.straightDraw === "open" ? "Open-ended" : "Gutshot");
    }
    return list;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [knownKey, hasHand, activeCount]);

  function handleStreet(next: Street) {
    setStreet(next);
  }

  function removeHole(index: number) {
    setTable((previous) => ({
      ...previous,
      hole: previous.hole.map((card, current) =>
        current === index ? null : card,
      ),
    }));
  }

  function removeBoard(index: number) {
    setTable((previous) => ({
      ...previous,
      board: previous.board.map((card, current) =>
        current === index ? null : card,
      ),
    }));
  }

  function placeCard(card: number) {
    setTable((previous) => {
      const { hole: currentHole, board: currentBoard } = previous;
      if (currentHole.includes(card)) {
        return {
          ...previous,
          hole: currentHole.map((c) => (c === card ? null : c)),
        };
      }
      if (currentBoard.includes(card)) {
        return {
          ...previous,
          board: currentBoard.map((c) => (c === card ? null : c)),
        };
      }
      const holeIndex = currentHole.indexOf(null);
      if (holeIndex !== -1) {
        return {
          ...previous,
          hole: currentHole.map((c, index) =>
            index === holeIndex ? card : c,
          ),
        };
      }
      const boardIndex = currentBoard.indexOf(null);
      if (boardIndex !== -1) {
        return {
          ...previous,
          board: currentBoard.map((c, index) =>
            index === boardIndex ? card : c,
          ),
        };
      }
      return previous;
    });
  }

  function dealRandom() {
    setTable((previous) => {
      const taken = new Set<number>();
      for (const card of previous.hole) if (card !== null) taken.add(card);
      for (const card of previous.board) if (card !== null) taken.add(card);

      const pool = shuffle(ALL_CARDS.filter((card) => !taken.has(card)));
      let cursor = 0;
      const nextHole = previous.hole.map((card) =>
        card === null ? pool[cursor++] : card,
      );
      const nextBoard = previous.board.map((card, index) =>
        index < activeCount && card === null ? pool[cursor++] : card,
      );

      return { hole: nextHole, board: nextBoard };
    });
  }

  function clearTable() {
    setTable(emptyTable);
    setStreet("preflop");
  }

  const used = new Set(
    [...hole, ...board].filter((card): card is number => card !== null),
  );

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_-10%,#0a1c55_0%,#041037_42%,#010828_100%)]" />
        <div className="space-dust absolute inset-0 opacity-70" />
        <div className="animate-drift absolute -left-40 top-[-12%] h-[520px] w-[520px] rounded-full bg-neon/[0.05] blur-[130px]" />
        <div className="animate-drift absolute -right-40 top-[32%] h-[560px] w-[560px] rounded-full bg-[#b724ff]/[0.07] blur-[150px] [animation-delay:-9s]" />
      </div>

      <Nav odds={odds} pending={pending} />

      <main>
        <Hero />

        <section id="calculator" className="relative mt-10 scroll-mt-24 sm:mt-14">
          <div className="mx-auto mb-4 flex max-w-[1831px] items-center justify-between px-4 sm:px-6">
            <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
              Section 01 / Live calculator
            </p>
            <p className="hidden text-[8px] uppercase tracking-[0.22em] text-cream/40 sm:block">
              Pick cards → choose a street → read equity
            </p>
          </div>

          <div className="mx-auto grid max-w-[1831px] gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(0,1.55fr)_minmax(0,1fr)] lg:items-start lg:gap-4">
            <div className="order-1 lg:order-1">
              <TablePanel
                hole={hole}
                board={board}
                street={street}
                opponents={opponents}
                handName={handName}
                draws={draws}
                pending={pending}
                seats={odds?.seats ?? []}
                onStreet={handleStreet}
                onOpponents={setOpponents}
                onDeal={dealRandom}
                onClear={clearTable}
                onRemoveHole={removeHole}
                onRemoveBoard={removeBoard}
              />
            </div>
            <div className="order-2 lg:order-2 lg:sticky lg:top-24">
              <OddsPanel
                odds={odds}
                pending={pending}
                opponents={opponents}
                hasHand={hasHand}
              />
            </div>
          </div>
        </section>

        <Deck used={used} onPick={placeCard} />
        <Method />

        <section
          aria-hidden="true"
          className="relative mt-24 overflow-hidden sm:mt-32"
        >
          <SpaceVideo
            src={VIDEOS.cta}
            ratio={RATIOS.cta}
            className="block h-auto w-full object-cover opacity-95 saturate-[0.5] brightness-[0.6]"
          />
          <div className="absolute inset-0 bg-[linear-gradient(180deg,#010828_0%,rgba(1,8,40,0.28)_24%,rgba(1,8,40,0.34)_58%,rgba(1,8,40,0.72)_86%,#010828_100%)]" />
        </section>

        <Footer />
        <div className="h-16 lg:hidden" aria-hidden="true" />
      </main>

      {odds && hasHand ? (
        <a
          href="#calculator"
          className="fixed inset-x-3 bottom-3 z-30 block lg:hidden"
        >
          <div className="flex items-center justify-between rounded-full border border-white/12 bg-[#04102f]/[0.94] px-5 py-3 shadow-[0_24px_60px_-28px_rgba(0,0,0,0.95)] backdrop-blur-xl">
            <div className="flex items-baseline gap-1.5">
              <span className="font-grotesk text-[22px] leading-none text-neon tabular">
                {odds.equity.toFixed(1)}
              </span>
              <span className="text-[8px] uppercase tracking-[0.2em] text-cream/45">
                % equity
              </span>
            </div>
            <div className="flex items-center gap-3 text-[8px] uppercase tracking-[0.14em] tabular">
              <span className="text-neon/80">W {odds.win.toFixed(1)}</span>
              <span className="text-cream/55">T {odds.tie.toFixed(1)}</span>
              <span className="text-ember/90">L {odds.loss.toFixed(1)}</span>
            </div>
          </div>
        </a>
      ) : null}

      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-50 mix-blend-lighten"
      />
    </div>
  );
}
