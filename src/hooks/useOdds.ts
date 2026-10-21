import { useEffect, useRef, useState } from "react";
import type { OddsResult, SimRequest, SimResponse } from "../lib/sim.worker";

const ITERATIONS = 24000;

export interface OddsState {
  odds: OddsResult | null;
  pending: boolean;
}

export function useOdds(
  hero: number[],
  board: number[],
  opponents: number,
): OddsState {
  const [odds, setOdds] = useState<OddsResult | null>(null);
  const [pending, setPending] = useState(false);
  const workerRef = useRef<Worker | null>(null);
  const requestRef = useRef(0);

  useEffect(() => {
    const worker = new Worker(
      new URL("../lib/sim.worker.ts", import.meta.url),
      { type: "module" },
    );
    workerRef.current = worker;

    worker.addEventListener("message", (event: MessageEvent<SimResponse>) => {
      if (event.data.requestId !== requestRef.current) return;
      setOdds(event.data.odds);
      setPending(false);
    });

    return () => {
      worker.terminate();
      workerRef.current = null;
    };
  }, []);

  const heroKey = hero.join(",");
  const boardKey = board.join(",");

  useEffect(() => {
    if (hero.length < 2) {
      setOdds(null);
      setPending(false);
      return;
    }

    setPending(true);
    const timer = window.setTimeout(() => {
      const requestId = requestRef.current + 1;
      requestRef.current = requestId;
      const request: SimRequest = {
        hero,
        board,
        opponents,
        iterations: ITERATIONS,
        requestId,
      };
      workerRef.current?.postMessage(request);
    }, 120);

    return () => window.clearTimeout(timer);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [heroKey, boardKey, opponents]);

  return { odds, pending };
}
