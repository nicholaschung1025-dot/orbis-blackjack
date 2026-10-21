import { ArrowUpRight } from "lucide-react";
import { siblingUrl } from "../lib/links";
import type { OddsResult } from "../lib/sim.worker";

interface NavProps {
  odds: OddsResult | null;
  pending: boolean;
}

const links = [
  { label: "Table", href: "#calculator" },
  { label: "The deck", href: "#deck" },
  { label: "Method", href: "#method" },
  { label: "About", href: "#about" },
];

export function Nav({ odds, pending }: NavProps) {
  return (
    <header className="fixed inset-x-0 top-0 z-40 px-3 pt-3 sm:px-6 sm:pt-4">
      <div className="liquid-glass nav-glass mx-auto flex max-w-[1831px] items-center justify-between gap-4 rounded-[22px] px-4 py-3 sm:rounded-[28px] sm:px-6">
        <a
          href="#top"
          className="relative z-[2] flex items-center gap-2 font-grotesk text-[14px] uppercase leading-none tracking-[0.04em] sm:text-[16px]"
        >
          Orbis.Odds
          <span className="h-1.5 w-1.5 rounded-full bg-neon shadow-[0_0_8px_rgba(111,255,0,0.9)]" />
        </a>

        <nav className="relative z-[2] hidden items-center gap-7 lg:flex">
          {links.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="font-grotesk text-[13px] uppercase tracking-[0.06em] text-cream/80 transition-colors hover:text-neon"
            >
              {link.label}
            </a>
          ))}
          <a
            href={siblingUrl("blackjack", "/blackjack.html")}
            className="font-grotesk text-[13px] uppercase tracking-[0.06em] text-neon/80 transition-colors hover:text-neon"
          >
            Blackjack
          </a>
        </nav>

        <div className="relative z-[2] flex items-center gap-3 sm:gap-4">
          {odds ? (
            <a
              href="#calculator"
              aria-label={`Equity ${odds.equity.toFixed(1)} percent. Win ${odds.win.toFixed(1)} percent, tie ${odds.tie.toFixed(1)} percent, loss ${odds.loss.toFixed(1)} percent.`}
              className="liquid-glass flex items-center gap-2.5 rounded-full px-3 py-1.5 transition-colors hover:bg-white/10 lg:gap-3 lg:px-4"
            >
              <span className="font-grotesk text-[15px] leading-none text-neon tabular">
                {odds.equity.toFixed(1)}
                <span className="text-[10px] text-neon/70">%</span>
              </span>
              <span className="hidden h-3 w-px bg-white/15 lg:block" />
              <span className="hidden items-center gap-2.5 text-[8px] uppercase tracking-[0.16em] tabular lg:flex">
                <span className="text-neon/85">W {odds.win.toFixed(1)}</span>
                <span className="text-cream/60">T {odds.tie.toFixed(1)}</span>
                <span className="text-ember/85">L {odds.loss.toFixed(1)}</span>
              </span>
              <span
                className={`h-1.5 w-1.5 rounded-full bg-neon ${
                  pending ? "animate-blink" : ""
                }`}
              />
            </a>
          ) : (
            <span className="hidden items-center gap-2 text-[8px] uppercase tracking-[0.22em] text-cream/50 sm:flex">
              <span className="h-1 w-1 animate-blink rounded-full bg-neon" />
              52-card engine
            </span>
          )}
          <a
            href="#calculator"
            className="group flex items-center gap-1.5 rounded-full bg-cream px-4 py-2 font-grotesk text-[10px] uppercase tracking-[0.12em] text-background transition-colors hover:bg-neon sm:px-5"
          >
            Open table
            <ArrowUpRight
              size={12}
              className="transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
            />
          </a>
        </div>
      </div>
    </header>
  );
}
