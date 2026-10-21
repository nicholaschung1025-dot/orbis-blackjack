import { useMemo, useState } from "react";
import { ArrowUpRight, Github, Mail, Twitter } from "lucide-react";
import {
  DEFAULT_RULES,
  analyze,
  freshShoe,
  randomHand,
  type BCard,
  type Rules,
  type Suit,
} from "../lib/blackjack";
import { HandBuilder, type Slot } from "./HandBuilder";
import { MiniCard } from "../components/MiniCard";
import { siblingUrl } from "../lib/links";
import { ResultPanel } from "./ResultPanel";

const socials = [
  { label: "Email", icon: Mail },
  { label: "Twitter", icon: Twitter },
  { label: "Github", icon: Github },
];

const DECK_OPTIONS = [1, 2, 6, 8];

/** Six-deck S17 dealer bust percentage by up card, the published figures. */
const BUST_BY_UP = [
  { up: "2", value: 35.3 },
  { up: "3", value: 37.6 },
  { up: "4", value: 40.3 },
  { up: "5", value: 42.9 },
  { up: "6", value: 42.1 },
  { up: "7", value: 26.0 },
  { up: "8", value: 23.9 },
  { up: "9", value: 23.3 },
  { up: "10", value: 21.4 },
  { up: "A", value: 11.7 },
];

const OUTCOMES = [
  { label: "Win", value: 54.8, className: "bg-neon", text: "text-neon" },
  { label: "Push", value: 6.8, className: "bg-cream/45", text: "text-cream/70" },
  { label: "Lose", value: 38.4, className: "bg-ember", text: "text-ember" },
];

const DRAWS = ["A", "2", "3", "4", "5", "6", "7", "8", "9", "10", "J", "Q", "K"];

function MethodFigure({ index }: { index: string }) {
  if (index === "01") {
    return (
      <div className="flex h-[186px] flex-col justify-center">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Dealer bust by up card
          </p>
          <p className="font-grotesk text-[13px] leading-none text-neon">
            6 decks
          </p>
        </div>
        <div className="flex h-[96px] items-end gap-1">
          {BUST_BY_UP.map((row) => (
            <div key={row.up} className="flex flex-1 flex-col items-center gap-1">
              <div className="flex h-[84px] w-full items-end">
                <div
                  className="w-full rounded-t-[2px] bg-gradient-to-t from-neon/[0.06] to-neon/70"
                  style={{ height: `${(row.value / 45) * 100}%` }}
                />
              </div>
              <span className="text-[7px] leading-none text-cream/40">
                {row.up}
              </span>
            </div>
          ))}
        </div>
        <div className="mt-2 h-px w-full bg-white/10" />
      </div>
    );
  }

  if (index === "02") {
    return (
      <div className="flex h-[186px] flex-col justify-center gap-4">
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Your hand
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <MiniCard rank="10" suit="spade" />
            <MiniCard rank="6" suit="club" />
            <span className="ml-1 font-grotesk text-[15px] leading-none text-cream/40">
              = 16
            </span>
          </div>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Every draw priced
          </p>
          <div className="mt-2.5 flex flex-wrap gap-1">
            {DRAWS.map((rank) => (
              <span
                key={rank}
                className="grid h-[22px] min-w-[20px] place-items-center rounded-[5px] border border-white/10 bg-white/[0.03] px-1 font-mono text-[9px] leading-none text-cream/60"
              >
                {rank}
              </span>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="flex h-[186px] flex-col justify-center gap-4">
      {OUTCOMES.map((row) => (
        <div key={row.label}>
          <div className="flex items-baseline justify-between">
            <p className="text-[8px] uppercase tracking-[0.24em] text-cream/55">
              {row.label}
            </p>
            <p className={`font-grotesk text-[13px] leading-none ${row.text}`}>
              {row.value.toFixed(1)}%
            </p>
          </div>
          <div className="mt-2 h-[3px] w-full overflow-hidden rounded-full bg-white/[0.07]">
            <div
              className={`h-full rounded-full ${row.className}`}
              style={{ width: `${row.value}%` }}
            />
          </div>
        </div>
      ))}
    </div>
  );
}

function Toggle({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`rounded-full border px-4 py-1.5 font-grotesk text-[10px] uppercase tracking-[0.12em] transition-colors ${
        active
          ? "border-neon/55 bg-neon/15 text-neon"
          : "border-white/12 bg-white/[0.02] text-cream/55 hover:border-white/30 hover:text-cream"
      }`}
    >
      {label}
    </button>
  );
}

export function BlackjackApp() {
  const [player, setPlayer] = useState<BCard[]>([]);
  const [up, setUp] = useState<BCard | null>(null);
  const [hole, setHole] = useState<BCard | null>(null);
  const [holeKnown, setHoleKnown] = useState(false);
  const [rules, setRules] = useState<Rules>(DEFAULT_RULES);
  const [rank, setRank] = useState(10);
  const [suit, setSuit] = useState<Suit>(0);

  const pending: BCard = { rank, suit };
  /** Cards drawn by hitting, in order. The first two cards are the deal. */
  const hits = player.slice(2);

  const analysis = useMemo(
    () =>
      analyze(player, up, holeKnown ? hole : null, { ...rules, holeKnown }),
    [player, up, hole, holeKnown, rules],
  );

  function addCard(target: Slot) {
    const card: BCard = { rank, suit };
    if (target === "player") {
      setPlayer((previous) => {
        if (previous.length >= 2) return previous;
        if (previous.some((c) => c.rank === card.rank && c.suit === card.suit)) {
          return previous;
        }
        return [...previous, card];
      });
      return;
    }
    if (target === "up") {
      setUp((previous) => (previous ? previous : card));
      return;
    }
    setHole((previous) => (previous ? previous : card));
  }

  function removeCard(target: Slot, index: number) {
    if (target === "player") {
      setPlayer(player.filter((_, i) => i !== index));
      return;
    }
    if (target === "up") {
      setUp(null);
      return;
    }
    setHole(null);
  }

  /** Draw the selected card on a hit and re-price the new hand. */
  function hitCard() {
    setPlayer((previous) => [...previous, { rank, suit }]);
  }

  /** Take back the last card drawn by hitting. */
  function undoHit() {
    setPlayer((previous) => previous.slice(0, -1));
  }

  function dealRandom() {
    const shoe = randomHand(freshShoe(rules.decks), 3);
    setPlayer(shoe.slice(0, 2));
    setUp(shoe[2]);
    setHole(null);
  }

  function clearAll() {
    setPlayer([]);
    setUp(null);
    setHole(null);
  }

  return (
    <div className="relative min-h-screen overflow-x-hidden">
      <div className="pointer-events-none fixed inset-0 -z-10">
        <div className="absolute inset-0 bg-[radial-gradient(120%_90%_at_10%_-10%,#0a1c55_0%,#041037_42%,#010828_100%)]" />
        <div className="space-dust absolute inset-0 opacity-70" />
        <div className="animate-drift absolute -left-40 top-[-12%] h-[520px] w-[520px] rounded-full bg-neon/[0.05] blur-[130px]" />
        <div className="animate-drift absolute -right-40 top-[38%] h-[560px] w-[560px] rounded-full bg-[#b724ff]/[0.07] blur-[150px] [animation-delay:-9s]" />
      </div>

      <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
        <div className="liquid-glass nav-glass mx-auto flex max-w-[1831px] items-center justify-between gap-4 rounded-[22px] px-4 py-3 sm:rounded-[28px] sm:px-6">
          <a
            href={siblingUrl("poker", "/")}
            className="relative z-[2] flex items-center gap-2 font-grotesk text-[14px] uppercase leading-none tracking-[0.04em] sm:text-[16px]"
          >
            Orbis.Bj
            <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(111,255,0,0.9)]" />
          </a>

          <nav className="relative z-[2] hidden items-center gap-7 lg:flex">
            <a
              href="#calculator"
              className="font-grotesk text-[13px] uppercase tracking-[0.06em] text-cream/80 transition-colors hover:text-neon"
            >
              Calculator
            </a>
            <a
              href="#method"
              className="font-grotesk text-[13px] uppercase tracking-[0.06em] text-cream/80 transition-colors hover:text-neon"
            >
              The math
            </a>
            <a
              href="#about"
              className="font-grotesk text-[13px] uppercase tracking-[0.06em] text-cream/80 transition-colors hover:text-neon"
            >
              About
            </a>
          </nav>

          <div className="relative z-[2] flex items-center gap-3 sm:gap-4">
            <a
              href={siblingUrl("poker", "/")}
              className="group flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 font-grotesk text-[10px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-neon sm:px-5"
            >
              Hold&apos;em table
              <ArrowUpRight
                size={12}
                className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
              />
            </a>
          </div>
        </div>
      </header>

      <main>
        <section className="relative mx-auto max-w-[1831px] px-4 pb-10 pt-32 sm:px-6 sm:pt-40">
          <p className="flex items-center gap-2 text-[10px] uppercase tracking-[0.28em] text-cream/60">
            <span className="h-1 w-1 rounded-full bg-neon" />
            Blackjack / Expected value engine
          </p>
          <h1 className="mt-5 max-w-[900px] font-grotesk text-[clamp(2.6rem,7.4vw,6.4rem)] uppercase leading-[0.9] tracking-[-0.01em]">
            <span className="block">Read the</span>
            <span className="block">
              <span className="text-outline">dealer</span> first.
            </span>
          </h1>
          <span className="mt-3 block rotate-0 text-right font-condiment text-[clamp(1.6rem,3.6vw,3.4rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:mt-4">
            every hand
          </span>

          <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/10 pt-6 lg:flex-row lg:items-end">
            <p className="max-w-[460px] text-[10px] uppercase leading-[1.9] tracking-[0.06em] text-cream/60">
              An exact blackjack calculator for casino rules. Set the shoe, set
              the dealer&apos;s rules, deal a hand, and read the best play with
              the true win, push and loss odds behind it.
            </p>
            <div className="flex items-end gap-8 sm:gap-12">
              {[
                { value: "52", label: "Cards" },
                { value: "0.001", label: "Error" },
                { value: "10", label: "Up cards" },
              ].map((stat) => (
                <div key={stat.label}>
                  <p className="font-grotesk text-[28px] leading-none tracking-tight sm:text-[34px]">
                    {stat.value}
                  </p>
                  <p className="mt-1.5 text-[8px] uppercase tracking-[0.24em] text-cream/50">
                    {stat.label}
                  </p>
                </div>
              ))}
            </div>
          </div>
        </section>

        <section id="calculator" className="relative scroll-mt-24">
          <div className="mx-auto mb-4 flex max-w-[1831px] items-center justify-between px-4 sm:px-6">
            <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
              Section 01 / Live calculator
            </p>
            <p className="hidden text-[8px] uppercase tracking-[0.22em] text-cream/40 sm:block">
              Deal a hand ??read the edge
            </p>
          </div>

          <div className="mx-auto grid max-w-[1831px] gap-3 px-4 sm:px-6 lg:grid-cols-[minmax(0,1fr)_minmax(0,0.95fr)] lg:items-start lg:gap-4">
            <div className="space-y-3 sm:space-y-4">
              <HandBuilder
                player={player}
                up={up}
                hole={hole}
                holeKnown={holeKnown}
                rank={rank}
                suit={suit}
                hits={hits}
                onRank={setRank}
                onSuit={setSuit}
                onAdd={addCard}
                onRemove={removeCard}
                onToggleHole={() => setHoleKnown((value) => !value)}
                onRandom={dealRandom}
                onClear={clearAll}
              />

              <div className="liquid-glass glass-panel rounded-[26px] p-5 sm:rounded-[32px] sm:p-7">
                <p className="text-[10px] uppercase tracking-[0.26em] text-cream/50">
                  Table rules
                </p>
                <div className="mt-5 space-y-5">
                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-cream/60">
                      Decks in the shoe
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      {DECK_OPTIONS.map((count) => (
                        <Toggle
                          key={count}
                          label={`${count} deck${count > 1 ? "s" : ""}`}
                          active={rules.decks === count}
                          onClick={() => setRules({ ...rules, decks: count })}
                        />
                      ))}
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-cream/60">
                      Dealer on 17
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <Toggle
                        label="Stands soft 17"
                        active={!rules.hitSoft17}
                        onClick={() => setRules({ ...rules, hitSoft17: false })}
                      />
                      <Toggle
                        label="Hits soft 17"
                        active={rules.hitSoft17}
                        onClick={() => setRules({ ...rules, hitSoft17: true })}
                      />
                    </div>
                  </div>

                  <div>
                    <span className="text-[10px] uppercase tracking-[0.22em] text-cream/60">
                      Table limits
                    </span>
                    <div className="mt-2.5 flex flex-wrap gap-2">
                      <Toggle
                        label="Double after split"
                        active={rules.das}
                        onClick={() => setRules({ ...rules, das: !rules.das })}
                      />
                      <Toggle
                        label="Resplit aces"
                        active={rules.resplitAces}
                        onClick={() =>
                          setRules({ ...rules, resplitAces: !rules.resplitAces })
                        }
                      />
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="lg:sticky lg:top-24">
              <ResultPanel
                analysis={analysis}
                pending={pending}
                hits={hits}
                canHit={
                  player.length >= 2 &&
                  analysis?.best === "hit" &&
                  analysis.hand.bust === false
                }
                onHit={hitCard}
                onUndoHit={undoHit}
              />
            </div>
          </div>
        </section>

        <section
          id="method"
          className="relative mx-auto mt-24 max-w-[1831px] scroll-mt-28 px-4 sm:mt-32 sm:px-6"
        >
          <div className="relative max-w-[860px]">
            <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
              Section 02 / The math
            </p>
            <h2 className="mt-3 font-grotesk text-[32px] uppercase leading-[0.95] sm:text-[60px]">
              No guesswork
              <br />
              <span className="text-cream/55">left.</span>
            </h2>
            <span className="pointer-events-none absolute -bottom-3 right-0 rotate-[-4deg] font-condiment text-[clamp(1.8rem,5vw,4.5rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:right-10">
              the edge
            </span>
          </div>

          <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-3 sm:gap-4">
            {[
              {
                index: "01",
                title: "The shoe is exact",
                copy: "Every card the dealer can draw is enumerated, so the bust percentage reflects the real composition of the shoe in front of you rather than an infinite-deck average.",
              },
              {
                index: "02",
                title: "Your hand is solved",
                copy: "Hit, stand, double and split are each priced with a memoised recursion over your own draws, so the expected value of every option is real.",
              },
              {
                index: "03",
                title: "The odds are honest",
                copy: "Win, push, loss, bust and natural probabilities come from the same runouts the expected value is built on, with ties split the way the table pays them.",
              },
            ].map((step) => (
              <article
                key={step.index}
                className="liquid-glass glass-panel group rounded-[24px] p-5 transition-colors hover:bg-white/[0.04] sm:rounded-[28px] sm:p-7"
              >
                <div className="flex items-center justify-between">
                  <span className="font-grotesk text-[10px] tracking-[0.2em] text-cream/45">
                    {step.index}
                  </span>
                  <span className="h-1.5 w-1.5 rounded-full bg-neon/60 transition-all group-hover:bg-neon group-hover:shadow-[0_0_10px_rgba(111,255,0,0.9)]" />
                </div>

                <MethodFigure index={step.index} />

                <h3 className="mt-6 font-grotesk text-[20px] uppercase leading-none sm:text-[22px]">
                  {step.title}
                </h3>
                <p className="mt-3 text-[10px] uppercase leading-[1.9] tracking-[0.03em] text-cream/55">
                  {step.copy}
                </p>
              </article>
            ))}
          </div>
        </section>

        <section
          id="about"
          className="relative mx-auto mt-24 max-w-[1831px] scroll-mt-28 px-4 pb-8 sm:mt-32 sm:px-6"
        >
          <div className="liquid-glass glass-panel relative overflow-hidden rounded-[26px] px-5 py-12 sm:rounded-[32px] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
            <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#b724ff]/[0.08] blur-3xl" />
            <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-neon/[0.05] blur-3xl" />

            <div className="relative">
              <p className="mb-10 ml-2 -rotate-2 font-condiment text-[clamp(1.7rem,3.2vw,2.8rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:mb-12">
                know the odds
              </p>
              <h2 className="font-grotesk text-[clamp(2.6rem,7vw,6.2rem)] uppercase leading-[0.9]">
                Bet the
                <br />
                <span className="text-outline">numbers.</span>
              </h2>

              <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
                <p className="max-w-[360px] text-[10px] uppercase leading-[1.9] tracking-[0.04em] text-cream/55">
                  No account, no sign-up. The engine runs locally in your
                  browser ??deal a hand, set the rules, and let the numbers
                  speak.
                </p>
                <a
                  href={siblingUrl("poker", "/")}
                  className="group flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-grotesk text-[10px] uppercase tracking-[0.14em] text-cream/80 transition hover:border-neon/50 hover:text-neon"
                >
                  Hold&apos;em table
                  <ArrowUpRight
                    size={13}
                    className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                  />
                </a>
              </div>

              <div className="mt-12 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
                <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                  <span className="font-grotesk text-[13px] uppercase tracking-[0.04em]">
                    Orbis.Bj
                  </span>
                  <span className="text-[8px] uppercase tracking-[0.2em] text-cream/45">
                    © 2026 ??For study, not for gambling advice
                  </span>
                </div>
                <div className="flex items-center gap-2">
                  {socials.map((social) => (
                    <a
                      key={social.label}
                      href="#about"
                      aria-label={social.label}
                      className="liquid-glass grid h-10 w-10 place-items-center rounded-[12px] text-cream/75 transition hover:bg-white/10 hover:text-cream"
                    >
                      <social.icon size={15} strokeWidth={1.6} />
                    </a>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <div
        aria-hidden="true"
        className="grain-overlay pointer-events-none fixed inset-0 z-50 mix-blend-lighten"
      />
    </div>
  );
}
