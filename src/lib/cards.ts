export const SUITS = [
  { key: "s", symbol: "♠", name: "Spades", tone: "ink" },
  { key: "h", symbol: "♥", name: "Hearts", tone: "ember" },
  { key: "d", symbol: "♦", name: "Diamonds", tone: "ember" },
  { key: "c", symbol: "♣", name: "Clubs", tone: "ink" },
] as const;

export type SuitKey = (typeof SUITS)[number]["key"];

export const RANK_LABELS = [
  "2",
  "3",
  "4",
  "5",
  "6",
  "7",
  "8",
  "9",
  "10",
  "J",
  "Q",
  "K",
  "A",
] as const;

export const STREETS = ["preflop", "flop", "turn", "river"] as const;
export type Street = (typeof STREETS)[number];

export const STREET_LABEL: Record<Street, string> = {
  preflop: "Pre-flop",
  flop: "Flop",
  turn: "Turn",
  river: "River",
};

export const BOARD_COUNT: Record<Street, number> = {
  preflop: 0,
  flop: 3,
  turn: 4,
  river: 5,
};

export const ALL_CARDS = Array.from({ length: 52 }, (_, i) => i);

export const cardRank = (id: number) => (id % 13) + 2;
export const cardSuit = (id: number) => Math.floor(id / 13);
export const rankLabel = (id: number) => RANK_LABELS[id % 13];
export const suitSymbol = (id: number) => SUITS[cardSuit(id)].symbol;
export const isRed = (id: number) => cardSuit(id) === 1 || cardSuit(id) === 2;
export const cardName = (id: number) => `${rankLabel(id)}${suitSymbol(id)}`;
export const cardFullName = (id: number) =>
  `${RANK_SINGULAR[cardRank(id)]} of ${SUITS[cardSuit(id)].name}`;

export function shuffle<T>(items: T[]): T[] {
  const next = items.slice();
  for (let i = next.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [next[i], next[j]] = [next[j], next[i]];
  }
  return next;
}

const RANK_SINGULAR: Record<number, string> = {
  2: "Two",
  3: "Three",
  4: "Four",
  5: "Five",
  6: "Six",
  7: "Seven",
  8: "Eight",
  9: "Nine",
  10: "Ten",
  11: "Jack",
  12: "Queen",
  13: "King",
  14: "Ace",
};

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

export function describeHole(hole: number[]): string {
  if (hole.length < 2) return "Pick two cards";
  const [a, b] = hole;
  const ra = cardRank(a);
  const rb = cardRank(b);
  if (ra === rb) return `Pocket ${RANK_WORD[ra]}`;
  const high = Math.max(ra, rb);
  const low = Math.min(ra, rb);
  const suited = cardSuit(a) === cardSuit(b) ? "suited" : "offsuit";
  return `${RANK_SINGULAR[high]}-${RANK_SINGULAR[low]} ${suited}`;
}
