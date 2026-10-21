/// <reference lib="webworker" />
import { evaluate } from "./evaluator";

export interface SimRequest {
  hero: number[];
  board: number[];
  opponents: number;
  iterations: number;
  requestId: number;
}

export interface SeatStats {
  /** Share of runouts where this seat outranked the hero. */
  beat: number;
  /** Share of runouts where this seat tied the hero. */
  tie: number;
}

export interface OddsResult {
  win: number;
  tie: number;
  loss: number;
  equity: number;
  iterations: number;
  elapsedMs: number;
  seats: SeatStats[];
}

export interface SimResponse {
  requestId: number;
  odds: OddsResult;
}

self.addEventListener("message", (event: MessageEvent<SimRequest>) => {
  const { hero, board, opponents, iterations, requestId } = event.data;
  const started = performance.now();

  const known = new Set<number>([...hero, ...board]);
  const deck: number[] = [];
  for (let card = 0; card < 52; card++) {
    if (!known.has(card)) deck.push(card);
  }

  const missing = 5 - board.length;
  const drawCount = opponents * 2 + missing;
  const boardFilled = new Array<number>(5);

  const seatBeat = new Array<number>(opponents).fill(0);
  const seatTie = new Array<number>(opponents).fill(0);

  let win = 0;
  let tie = 0;
  let loss = 0;
  let equity = 0;

  for (let run = 0; run < iterations; run++) {
    for (let i = 0; i < drawCount; i++) {
      const j = i + Math.floor(Math.random() * (deck.length - i));
      const swap = deck[i];
      deck[i] = deck[j];
      deck[j] = swap;
    }

    for (let i = 0; i < board.length; i++) boardFilled[i] = board[i];
    for (let i = 0; i < missing; i++) {
      boardFilled[board.length + i] = deck[opponents * 2 + i];
    }

    const heroScore = evaluate([hero[0], hero[1], ...boardFilled]).score;

    let beaten = false;
    let tiedCount = 0;
    for (let seat = 0; seat < opponents; seat++) {
      const score = evaluate([
        deck[seat * 2],
        deck[seat * 2 + 1],
        ...boardFilled,
      ]).score;
      if (score > heroScore) {
        seatBeat[seat] += 1;
        beaten = true;
      } else if (score === heroScore) {
        seatTie[seat] += 1;
        tiedCount += 1;
      }
    }

    if (beaten) {
      loss += 1;
    } else if (tiedCount > 0) {
      tie += 1;
      equity += 1 / (1 + tiedCount);
    } else {
      win += 1;
      equity += 1;
    }
  }

  const response: SimResponse = {
    requestId,
    odds: {
      win: (win / iterations) * 100,
      tie: (tie / iterations) * 100,
      loss: (loss / iterations) * 100,
      equity: (equity / iterations) * 100,
      iterations,
      elapsedMs: performance.now() - started,
      seats: seatBeat.map((beat, seat) => ({
        beat: (beat / iterations) * 100,
        tie: (seatTie[seat] / iterations) * 100,
      })),
    },
  };

  self.postMessage(response);
});
