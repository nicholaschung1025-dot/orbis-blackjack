import { useEffect, useRef, useState } from "react";

interface SpaceVideoProps {
  src: string;
  className?: string;
  /** Load the source as soon as the component mounts instead of on scroll. */
  eager?: boolean;
  /** Reserves the box before the metadata arrives, e.g. "1784 / 1160". */
  ratio?: string;
}

function prefersReducedMotion() {
  return (
    typeof window !== "undefined" &&
    window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
}

export function SpaceVideo({
  src,
  className = "",
  eager = false,
  ratio,
}: SpaceVideoProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [active, setActive] = useState(eager);

  useEffect(() => {
    if (eager || active) return;
    const node = videoRef.current;
    if (!node) return;
    if (typeof IntersectionObserver === "undefined") {
      setActive(true);
      return;
    }
    const observer = new IntersectionObserver(
      (entries) => {
        if (prefersReducedMotion()) return;
        if (entries.some((entry) => entry.isIntersecting)) {
          setActive(true);
          observer.disconnect();
        }
      },
      { rootMargin: "300px 0px" },
    );
    observer.observe(node);
    return () => observer.disconnect();
  }, [eager, active]);

  useEffect(() => {
    if (!prefersReducedMotion()) return;
    setActive(false);
  }, []);

  return (
    <video
      ref={videoRef}
      className={className}
      style={ratio ? { aspectRatio: ratio } : undefined}
      src={active ? src : undefined}
      autoPlay
      loop
      muted
      playsInline
      preload={eager ? "metadata" : "none"}
      aria-hidden="true"
      tabIndex={-1}
    />
  );
}
