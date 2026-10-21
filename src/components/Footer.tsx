import { ArrowUpRight, Github, Mail, Twitter } from "lucide-react";
import { SpaceVideo } from "./SpaceVideo";
import { VIDEOS } from "../lib/media";

const socials = [
  { label: "Email", icon: Mail },
  { label: "Twitter", icon: Twitter },
  { label: "Github", icon: Github },
];

export function Footer() {
  return (
    <section id="about" className="relative mt-0 scroll-mt-28 overflow-hidden">
      <div className="absolute inset-0">
        <SpaceVideo
          src={VIDEOS.about}
          className="h-full w-full object-cover opacity-60 saturate-[0.4] brightness-[0.4]"
        />
        <div className="absolute inset-0 bg-[linear-gradient(180deg,#010828_0%,rgba(1,8,40,0.74)_30%,rgba(1,8,40,0.88)_64%,#010828_100%)]" />
      </div>

      <div className="relative mx-auto max-w-[1831px] px-4 pb-8 sm:px-6">
        <div className="liquid-glass glass-panel relative overflow-hidden rounded-[26px] px-5 py-12 sm:rounded-[32px] sm:px-12 sm:py-16 lg:px-16 lg:py-20">
          <div className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full bg-[#b724ff]/[0.08] blur-3xl" />
          <div className="pointer-events-none absolute -bottom-32 right-0 h-80 w-80 rounded-full bg-neon/[0.05] blur-3xl" />

          <div className="pointer-events-none absolute right-[7%] top-[10%] hidden lg:block">
            <div className="relative h-[250px] w-[250px] rounded-full border border-white/10">
              <div className="absolute inset-7 rounded-full border border-white/[0.06]" />
              <div className="absolute inset-16 rounded-full border border-neon/20" />
              <div className="absolute left-[68%] top-[6%] h-2 w-2 rounded-full bg-neon shadow-[0_0_12px_rgba(111,255,0,0.9)]" />
              <div className="absolute inset-[36%] rounded-full bg-[radial-gradient(circle_at_35%_30%,rgba(111,255,0,0.28),rgba(1,8,40,0)_70%)]" />
            </div>
          </div>

          <div className="relative">
            <p className="mb-10 ml-2 -rotate-2 font-condiment text-[clamp(1.7rem,3.2vw,2.8rem)] normal-case leading-none text-neon opacity-90 mix-blend-exclusion sm:mb-12">
              go beyond
            </p>
            <h2 className="font-grotesk text-[clamp(2.6rem,7vw,6.2rem)] uppercase leading-[0.9]">
              Trust the
              <br />
              <span className="text-outline">numbers.</span>
            </h2>

            <div className="mt-10 flex flex-col justify-between gap-6 sm:flex-row sm:items-end">
              <p className="max-w-[360px] text-[10px] uppercase leading-[1.9] tracking-[0.04em] text-cream/55">
                No account, no sign-up. The engine runs locally in your browser —
                deal a hand, pick a street, and let the math speak.
              </p>
              <a
                href="#top"
                className="group flex w-fit items-center gap-2 rounded-full border border-white/15 px-5 py-3 font-grotesk text-[10px] uppercase tracking-[0.14em] text-cream/80 transition hover:border-neon/50 hover:text-neon"
              >
                Reset the table
                <ArrowUpRight
                  size={13}
                  className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                />
              </a>
            </div>

            <div className="mt-12 flex flex-col justify-between gap-5 border-t border-white/10 pt-6 sm:flex-row sm:items-center">
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2">
                <span className="font-grotesk text-[13px] uppercase tracking-[0.04em]">
                  Orbis.Odds
                </span>
                <span className="text-[8px] uppercase tracking-[0.2em] text-cream/45">
                  © 2026 — For study, not for gambling advice
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
      </div>
    </section>
  );
}
