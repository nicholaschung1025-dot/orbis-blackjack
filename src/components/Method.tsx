const steps = [
  {
    index: "01",
    title: "Place the cards",
    copy: "Choose a betting round, then pick your hole cards and the community cards straight from the deck. Tap any card again to take it back.",
  },
  {
    index: "02",
    title: "Run the board",
    copy: "Each update deals up to 24,000 random runouts against one to eight unknown hands, comparing every seven-card hand at showdown.",
  },
  {
    index: "03",
    title: "Read the signal",
    copy: "Win, tie and loss percentages recalculate on every street, alongside your made hand, flush draws and straight draws.",
  },
];

const runouts = [
  18, 34, 26, 47, 38, 61, 29, 52, 44, 70, 33, 58, 41, 76, 48, 63, 36, 55, 31, 67, 42, 73,
  39, 50, 28, 60, 45, 68, 35, 53,
];

const odds = [
  { label: "Win", value: 62.4, className: "bg-neon", text: "text-neon" },
  { label: "Tie", value: 4.1, className: "bg-cream/45", text: "text-cream/70" },
  { label: "Loss", value: 33.5, className: "bg-ember", text: "text-ember" },
];

const SPADES = "♠";
const HEARTS = "♥";

function MiniCard({
  rank,
  suit,
  red = false,
}: {
  rank: string;
  suit: string;
  red?: boolean;
}) {
  return (
    <div className="relative h-[48px] w-[34px] overflow-hidden rounded-[6px] bg-cream shadow-[0_10px_20px_-12px_rgba(0,0,0,0.9)]">
      <span
        className={`absolute left-[4px] top-[3px] font-grotesk text-[12px] leading-none ${
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
        {suit}
      </span>
      <span
        aria-hidden="true"
        className={`absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 text-[16px] leading-none ${
          red ? "text-ember/45" : "text-background/20"
        }`}
      >
        {suit}
      </span>
    </div>
  );
}

function EmptySlot() {
  return (
    <div className="h-[48px] w-[34px] rounded-[6px] border border-dashed border-white/12" />
  );
}

function Figure({ index }: { index: string }) {
  if (index === "01") {
    return (
      <div className="flex h-[186px] flex-col justify-center gap-5">
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Your hand
          </p>
          <div className="mt-2.5 flex items-center gap-1.5">
            <MiniCard rank="A" suit={SPADES} />
            <MiniCard rank="K" suit={SPADES} />
            <div className="grid h-[48px] w-[34px] place-items-center rounded-[6px] border border-dashed border-white/12 text-[13px] leading-none text-cream/20">
              +
            </div>
          </div>
        </div>
        <div>
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Community
          </p>
          <div className="mt-2.5 flex items-center gap-1">
            <MiniCard rank="9" suit={HEARTS} red />
            <MiniCard rank="J" suit={HEARTS} red />
            <MiniCard rank="4" suit={HEARTS} red />
            <EmptySlot />
            <EmptySlot />
          </div>
        </div>
      </div>
    );
  }

  if (index === "02") {
    return (
      <div className="flex h-[186px] flex-col justify-center">
        <div className="mb-3 flex items-baseline justify-between">
          <p className="text-[8px] uppercase tracking-[0.24em] text-cream/45">
            Runouts
          </p>
          <p className="font-grotesk text-[15px] leading-none text-neon">
            24,000
          </p>
        </div>
        <div className="flex h-[96px] items-end gap-[3px]">
          {runouts.map((height, index) => (
            <div
              key={index}
              className="flex-1 rounded-t-[2px] bg-gradient-to-t from-neon/[0.06] to-neon/70"
              style={{ height: `${height}%` }}
            />
          ))}
        </div>
        <div className="mt-2 h-px w-full bg-white/10" />
      </div>
    );
  }

  return (
    <div className="flex h-[186px] flex-col justify-center gap-4">
      {odds.map((row) => (
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

export function Method() {
  return (
    <section
      id="method"
      className="relative mx-auto mt-24 max-w-[1831px] scroll-mt-28 px-4 sm:mt-32 sm:px-6"
    >
      <div className="relative max-w-[860px]">
        <p className="text-[9px] uppercase tracking-[0.32em] text-cream/50">
          Section 03 / Method
        </p>
        <h2 className="mt-3 font-grotesk text-[32px] uppercase leading-[0.95] sm:text-[60px]">
          How the numbers
          <br />
          <span className="text-cream/55">move.</span>
        </h2>
        <span className="pointer-events-none absolute -bottom-3 right-0 rotate-[-4deg] font-condiment text-[clamp(1.8rem,5vw,4.5rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:right-10">
          the math
        </span>
      </div>

      <div className="mt-10 grid gap-3 sm:mt-12 sm:grid-cols-2 sm:gap-4 lg:grid-cols-3">
        {steps.map((step) => (
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

            <Figure index={step.index} />

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
  );
}
