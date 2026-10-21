import { cardRank, cardSuit } from "./cards";

export const CATEGORY_NAMES = [
  "High card",
  "One pair",
  "Two pair",
  "Three of a kind",
  "Straight",
  "Flush",
  "Full house",
  "Four of a kind",
  "Straight flush",
] as const;

const RANK_WORD: Record<number, string> = {
  2: "Twos",
  3: "Threes",
  4: "Fours",
  5: "Fives",
  6: "Sixes",
  7: "Sevens",
  8: "Eights",
  9: "Nines",
  10: "Tens",
  11: "Jacks",
  12: "Queens",
  13: "Kings",
  14: "Aces",
};

const RANK_SHORT: Record<number, string> = {
  2: "2",
  3: "3",
  4: "4",
  5: "5",
  6: "6",
  7: "7",
  8: "8",
  9: "9",
  10: "10",
  11: "J",
  12: "Q",
  13: "K",
  14: "A",
};

export interface HandValue {
  score: number;
  category: number;
  label: string;
  detail: string;
  kickers: number[];
}

function straightHigh(present: boolean[]): number {
  let run = 0;
  for (let rank = 14; rank >= 2; rank--) {
    if (present[rank]) {
      run += 1;
      if (run >= 5) return rank + 4;
    } else {
      run = 0;
    }
  }
  if (present[14] && present[2] && present[3] && present[4] && present[5]) {
    return 5;
  }
  return 0;
}

function pack(kickers: number[]): number {
  let value = 0;
  for (let i = 0; i < 5; i++) value = value * 15 + (kickers[i] ?? 0);
  return value;
}

function make(
  category: number,
  kickers: number[],
  label: string,
  detail: string,
): HandValue {
  return {
    score: category * 759375 + pack(kickers),
    category,
    label,
    detail,
    kickers,
  };
}

export function evaluate(cards: number[]): HandValue {
  const rankCount = new Array<number>(15).fill(0);
  const suitRanks: number[][] = [[], [], [], []];
  for (const card of cards) {
    rankCount[cardRank(card)] += 1;
    suitRanks[cardSuit(card)].push(cardRank(card));
  }

  const ranksDesc: number[] = [];
  const present = new Array<boolean>(15).fill(false);
  for (let rank = 14; rank >= 2; rank--) {
    if (rankCount[rank] > 0) {
      ranksDesc.push(rank);
      present[rank] = true;
    }
  }

  let flushSuit = -1;
  for (let suit = 0; suit < 4; suit++) {
    if (suitRanks[suit].length >= 5) {
      flushSuit = suit;
      break;
    }
  }

  if (flushSuit >= 0) {
    const flushPresent = new Array<boolean>(15).fill(false);
    for (const rank of suitRanks[flushSuit]) flushPresent[rank] = true;
    const sfHigh = straightHigh(flushPresent);
    if (sfHigh > 0) {
      return make(
        8,
        [sfHigh],
        "Straight flush",
        `Straight flush, ${RANK_SHORT[sfHigh]} high`,
      );
    }
  }

  const quads: number[] = [];
  const trips: number[] = [];
  const pairs: number[] = [];
  for (let rank = 14; rank >= 2; rank--) {
    if (rankCount[rank] === 4) quads.push(rank);
    else if (rankCount[rank] === 3) trips.push(rank);
    else if (rankCount[rank] === 2) pairs.push(rank);
  }

  if (quads.length > 0) {
    const kicker = ranksDesc.find((rank) => rank !== quads[0]) ?? 0;
    return make(
      7,
      [quads[0], kicker],
      "Four of a kind",
      `Four of a kind, ${RANK_WORD[quads[0]]}`,
    );
  }

  if (trips.length > 0 && (trips.length > 1 || pairs.length > 0)) {
    const pairRank = trips.length > 1 ? trips[1] : pairs[0];
    return make(
      6,
      [trips[0], pairRank],
      "Full house",
      `Full house, ${RANK_WORD[trips[0]]} over ${RANK_WORD[pairRank]}`,
    );
  }

  if (flushSuit >= 0) {
    const top = suitRanks[flushSuit].slice().sort((a, b) => b - a).slice(0, 5);
    return make(5, top, "Flush", `Flush, ${RANK_SHORT[top[0]]} high`);
  }

  const straight = straightHigh(present);
  if (straight > 0) {
    return make(
      4,
      [straight],
      "Straight",
      `Straight, ${RANK_SHORT[straight]} high`,
    );
  }

  if (trips.length > 0) {
    const kickers = ranksDesc.filter((rank) => rank !== trips[0]).slice(0, 2);
    return make(
      3,
      [trips[0], ...kickers],
      "Three of a kind",
      `Three of a kind, ${RANK_WORD[trips[0]]}`,
    );
  }

  if (pairs.length >= 2) {
    const [highPair, lowPair] = pairs;
    const kicker = ranksDesc.find((rank) => rank !== highPair && rank !== lowPair) ?? 0;
    return make(
      2,
      [highPair, lowPair, kicker],
      "Two pair",
      `Two pair, ${RANK_WORD[highPair]} & ${RANK_WORD[lowPair]}`,
    );
  }

  if (pairs.length === 1) {
    const kickers = ranksDesc.filter((rank) => rank !== pairs[0]).slice(0, 3);
    return make(
      1,
      [pairs[0], ...kickers],
      "One pair",
      `Pair of ${RANK_WORD[pairs[0]]}`,
    );
  }

  const top = ranksDesc.slice(0, 5);
  return make(
    0,
    top,
    "High card",
    `${RANK_SHORT[top[0] ?? 0] ?? "-"} high`,
  );
}

export interface DrawInfo {
  flushDraw: boolean;
  straightDraw: "open" | "gutshot" | null;
}

export function detectDraws(cards: number[]): DrawInfo {
  const rankCount = new Array<number>(15).fill(0);
  const suitCount = [0, 0, 0, 0];
  for (const card of cards) {
    rankCount[cardRank(card)] += 1;
    suitCount[cardSuit(card)] += 1;
  }

  const flushDraw = suitCount.some((count) => count === 4);
  const has = (rank: number) =>
    rank === 1 ? rankCount[14] > 0 : rankCount[rank] > 0;

  let open = false;
  let gutshot = false;
  for (let start = 1; start <= 10; start++) {
    let present = 0;
    let missing = -1;
    for (let rank = start; rank < start + 5; rank++) {
      if (has(rank)) present += 1;
      else missing = rank;
    }
    if (present === 4) {
      if (missing === start || missing === start + 4) open = true;
      else gutshot = true;
    }
  }

  return {
    flushDraw,
    straightDraw: open ? "open" : gutshot ? "gutshot" : null,
  };
}
