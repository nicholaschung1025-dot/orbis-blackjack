import { ChevronRight } from "lucide-react";
import { SpaceVideo } from "./SpaceVideo";
import { VIDEOS } from "../lib/media";

const steps = [
  {
    index: "01",
    title: "Place the cards",
    copy: "Choose a betting round, then pick your hole cards and the community cards straight from the deck. Tap any card again to take it back.",
    video: VIDEOS.objectOne,
    score: "8.7/10",
  },
  {
    index: "02",
    title: "Run the board",
    copy: "Each update deals up to 24,000 random runouts against one to eight unknown hands, comparing every seven-card hand at showdown.",
    video: VIDEOS.objectTwo,
    score: "9/10",
  },
  {
    index: "03",
    title: "Read the signal",
    copy: "Win, tie and loss percentages recalculate on every street, alongside your made hand, flush draws and straight draws.",
    video: VIDEOS.objectThree,
    score: "8.2/10",
  },
];

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
            className="liquid-glass glass-panel group rounded-[26px] p-[18px] transition-colors hover:bg-white/[0.04] sm:rounded-[32px]"
          >
            <div className="flex items-center justify-between">
              <span className="font-grotesk text-[10px] tracking-[0.2em] text-cream/45">
                {step.index}
              </span>
              <span className="h-1.5 w-1.5 rounded-full bg-neon/60 transition-all group-hover:bg-neon group-hover:shadow-[0_0_10px_rgba(111,255,0,0.9)]" />
            </div>

            <div className="relative mt-4 aspect-square overflow-hidden rounded-[24px]">
              <SpaceVideo
                src={step.video}
                className="absolute inset-0 h-full w-full object-cover saturate-[0.75] brightness-[0.92]"
              />
              <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#010828]/92 via-[#010828]/50 to-transparent" />
              <div className="absolute inset-x-3 bottom-3">
                <div className="liquid-glass flex items-center justify-between rounded-[20px] px-5 py-4">
                  <div>
                    <p className="text-[11px] uppercase tracking-[0.18em] text-cream/70">
                      Signal score
                    </p>
                    <p className="mt-1 text-[16px] leading-none text-cream">
                      {step.score}
                    </p>
                  </div>
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-[#b724ff] to-[#7c3aed] shadow-lg shadow-purple-500/50 transition-transform duration-200 group-hover:scale-110">
                    <ChevronRight size={20} className="text-white" />
                  </span>
                </div>
              </div>
            </div>

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
