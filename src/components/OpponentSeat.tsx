import { useEffect, useRef, useState } from "react";
import type { Opponent } from "../lib/opponents";
import type { SeatStats } from "../lib/sim.worker";

interface OpponentSeatProps {
  opponent: Opponent;
  stats: SeatStats | null;
  pending: boolean;
  /** -1 (far left) to 1 (far right) across the table. */
  position: number;
  /** Shrinks the seat as the table fills up so a full table stays on one row. */
  size: "lg" | "md" | "sm";
}

const SIZES = {
  lg: { box: "h-[76px] w-[76px]", seat: "w-[104px]" },
  md: { box: "h-[66px] w-[66px]", seat: "w-[92px]" },
  sm: { box: "h-[58px] w-[58px]", seat: "w-[80px]" },
} as const;

function MiniBack() {
  return (
    <div className="relative h-6 w-4 overflow-hidden rounded-[4px] border border-white/15 bg-[#060d2c]">
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_25%,rgba(111,255,0,0.3),transparent_62%),radial-gradient(circle_at_72%_80%,rgba(183,36,255,0.34),transparent_58%)]" />
      <div className="absolute inset-[16%] rounded-[2px] border border-white/10" />
    </div>
  );
}

export function OpponentSeat({
  opponent,
  stats,
  pending,
  position,
  size,
}: OpponentSeatProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [play, setPlay] = useState(false);

  useEffect(() => {
    const node = videoRef.current;
    if (!node) return;
    if (
      typeof IntersectionObserver === "undefined" ||
      window.matchMedia("(prefers-reduced-motion: reduce)").matches
    ) {
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries.some((entry) => entry.isIntersecting)) {
          setPlay(true);
          observer.disconnect();
        }
      },
      { rootMargin: "160px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, []);

  const beat = stats?.beat ?? 0;
  const arc = Math.abs(position) * 9;
  const tilt = position * 4;
  const dims = SIZES[size];

  return (
    <div
      className={`flex ${dims.seat} flex-col items-center gap-2`}
      style={{ transform: `translateY(${arc}px) rotate(${tilt}deg)` }}
    >
      <div className="relative">
        <div
          className={`seat-avatar relative ${dims.box} overflow-hidden rounded-full ring-1 ring-white/25 shadow-[0_10px_24px_-14px_rgba(0,0,0,0.9)]`}
        >
          <video
            ref={videoRef}
            className="h-full w-full object-cover"
            style={{ filter: `hue-rotate(${opponent.hue}deg)` }}
            src={play ? opponent.video : undefined}
            poster={opponent.poster}
            autoPlay
            loop
            muted
            playsInline
            preload="none"
            aria-hidden="true"
            tabIndex={-1}
          />
        </div>
        <span
          className={`pointer-events-none absolute -inset-1 rounded-full border border-neon/70 ${
            pending ? "seat-ring" : "opacity-0"
          }`}
        />
        <span className="absolute -bottom-0.5 -right-0.5 h-2.5 w-2.5 rounded-full border border-[#010828] bg-neon shadow-[0_0_8px_rgba(111,255,0,0.8)]" />
      </div>

      <div className="flex gap-1.5">
        <MiniBack />
        <MiniBack />
      </div>

      <p className="font-grotesk text-[10px] uppercase tracking-[0.14em] text-cream/80">
        {opponent.name}
      </p>

      <div className="w-full max-w-[70px]">
        <div className="h-[2px] w-full overflow-hidden rounded-full bg-white/10">
          <div
            className="h-full rounded-full bg-ember transition-[width] duration-500 ease-out"
            style={{ width: `${beat}%` }}
          />
        </div>
        <p className="mt-1.5 text-center text-[7px] uppercase tracking-[0.16em] text-cream/45">
          {stats ? `${beat.toFixed(0)}% beat` : "reading"}
        </p>
      </div>
    </div>
  );
}
