import { Github, Mail, Twitter } from "lucide-react";
import { SpaceVideo } from "./SpaceVideo";
import { VIDEOS } from "../lib/media";

const stats = [
  { value: "52", label: "Cards" },
  { value: "1–8", label: "Rivals" },
  { value: "24K", label: "Runouts" },
];

const socials = [
  { label: "Email", icon: Mail },
  { label: "Twitter", icon: Twitter },
  { label: "Github", icon: Github },
];

export function Hero() {
  return (
    <section id="top" className="relative overflow-hidden rounded-b-[32px]">
      <div className="absolute inset-0">
        <SpaceVideo
          src={VIDEOS.hero}
          eager
          className="h-full w-full object-cover opacity-80 saturate-[0.45] contrast-[1.05] brightness-[0.5]"
        />
        <div className="absolute inset-0 bg-[radial-gradient(100%_90%_at_86%_4%,rgba(6,18,58,0.16)_0%,rgba(1,8,40,0.9)_42%,#010828_100%)]" />
        <div className="absolute inset-x-0 bottom-0 h-44 bg-gradient-to-t from-[#010828] via-[#010828]/70 to-transparent" />
      </div>

      <div className="relative mx-auto max-w-[1831px] px-4 pb-24 pt-28 sm:px-6 sm:pb-28 sm:pt-36">
        <div className="relative">
          <p className="flex items-center gap-2 text-[9px] uppercase tracking-[0.32em] text-cream/55">
            <span className="h-1 w-1 rounded-full bg-neon" />
            Texas Hold&apos;em / Equity engine
          </p>

          <h1 className="mt-5 font-grotesk text-[clamp(3.1rem,9vw,8.4rem)] uppercase leading-[0.88] tracking-[-0.01em]">
            <span className="block">Read the table.</span>
            <span className="block">
              <span className="text-outline">Before</span> the river.
            </span>
          </h1>

          <span className="mt-3 block rotate-0 text-right font-condiment text-[clamp(1.6rem,3.6vw,3.6rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:mt-4 xl:pointer-events-none xl:absolute xl:bottom-[6%] xl:right-[2%] xl:mt-0 xl:-rotate-3">
            every street
          </span>

          <div className="mt-10 flex items-center justify-center gap-3 lg:hidden">
            {socials.map((social) => (
              <a
                key={social.label}
                href="#about"
                aria-label={social.label}
                className="liquid-glass grid h-14 w-14 place-items-center rounded-[1rem] text-cream/75 transition-colors hover:bg-white/10 hover:text-cream"
              >
                <social.icon size={20} strokeWidth={1.6} />
              </a>
            ))}
          </div>
        </div>

        <div className="mt-10 flex flex-col justify-between gap-8 border-t border-white/10 pt-6 sm:mt-12 lg:flex-row lg:items-end">
          <p className="max-w-[420px] text-[10px] uppercase leading-[1.9] tracking-[0.06em] text-cream/60">
            A visual odds calculator. Pick cards from a live 52-card deck and
            watch win, tie and loss percentages recompute on every betting
            round — pre-flop, flop, turn, river.
          </p>

          <div className="flex items-end gap-8 sm:gap-12">
            {stats.map((stat) => (
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
      </div>

      <div className="absolute right-6 top-28 hidden flex-col gap-3 lg:flex">
        {socials.map((social) => (
          <a
            key={social.label}
            href="#about"
            aria-label={social.label}
            className="liquid-glass grid h-14 w-14 place-items-center rounded-[1rem] text-cream/75 transition-colors hover:bg-white/10 hover:text-cream"
          >
            <social.icon size={20} strokeWidth={1.6} />
          </a>
        ))}
      </div>
    </section>
  );
}
