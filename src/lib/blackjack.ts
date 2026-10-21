/* Exact blackjack maths for casino rules.
 *
 * The dealer side is solved by enumerating every multiset of cards the dealer
 * can possibly draw, so dealer bust percentages reflect the real shoe
 * composition rather than an infinite-deck approximation. The player side is
 * solved with a memoised recursion over the player's own draws.
 *
 * Cards keep their true rank (1 = Ace ... 13 = King) so that split decisions
 * distinguish a real pair from e.g. ten plus jack.
 */

export type Suit = 0 | 1 | 2 | 3;

export interface BCard {
  /** 1 = Ace, 2..10, 11 = Jack, 12 = Queen, 13 = King. */
  rank: number;
  suit: Suit;
}

export interface Rules {
  decks: number;
  /** false = dealer stands on all 17 (S17), true = dealer hits soft 17 (H17). */
  hitSoft17: boolean;
  /** Hole card visible to the player. */
  holeKnown: boolean;
  /** Double after split. */
  das: boolean;
  /** Splitting aces more than once. */
  resplitAces: boolean;
}

export const DEFAULT_RULES: Rules = {
  decks: 6,
  hitSoft17: false,
  holeKnown: false,
  das: true,
  resplitAces: false,
};

export const SUIT_SYMBOLS = ["♠", "♥", "♦", "♣"] as const;
export const SUIT_NAMES = ["Spades", "Hearts", "Diamonds", "Clubs"] as const;

export const RANKS = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11, 12, 13] as const;

export const RANK_LABEL: Record<number, string> = {
  1: "A",
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
};

export const RANK_NAME: Record<number, string> = {
  1: "Ace",
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
};

export function cardLabel(card: BCard): string {
  return `${RANK_LABEL[card.rank]}${SUIT_SYMBOLS[card.suit]}`;
}

export function cardName(card: BCard): string {
  return `${RANK_NAME[card.rank]} of ${SUIT_NAMES[card.suit]}`;
}

/** Ace is eleven, everything above ten is worth ten. */
export function rankValue(rank: number): number {
  if (rank === 1) return 11;
  return rank > 10 ? 10 : rank;
}

export type Counts = number[];

export function freshShoe(decks: number): Counts {
  const counts = new Array<number>(14).fill(0);
  for (let rank = 1; rank <= 13; rank++) counts[rank] = 4 * decks;
  return counts;
}

export function shoeTotal(counts: Counts): number {
  let total = 0;
  for (let rank = 1; rank <= 13; rank++) total += counts[rank];
  return total;
}

export function removeCard(counts: Counts, card: BCard) {
  if (counts[card.rank] > 0) counts[card.rank] -= 1;
}

export function cloneCounts(counts: Counts): Counts {
  return counts.slice();
}

/** A card of `rank` that is not already on the table. */
export function pickSuit(hand: BCard[], rank: number): Suit {
  const used = new Set(
    hand.filter((card) => card.rank === rank).map((card) => card.suit),
  );
  for (let suit = 0; suit < 4; suit++) {
    if (!used.has(suit as Suit)) return suit as Suit;
  }
  return 0;
}

export interface HandValue {
  total: number;
  soft: boolean;
  bust: boolean;
  blackjack: boolean;
  aces: number;
}

export function handValue(cards: BCard[]): HandValue {
  let total = 0;
  let aces = 0;
  for (const card of cards) {
    if (card.rank === 1) {
      aces += 1;
      total += 11;
    } else {
      total += rankValue(card.rank);
    }
  }
  while (total > 21 && aces > 0) {
    total -= 10;
    aces -= 1;
  }
  return {
    total,
    soft: aces > 0,
    bust: total > 21,
    blackjack: cards.length === 2 && total === 21,
    aces,
  };
}

/* ------------------------------------------------------------------ dealer */

export interface DealerDist {
  bust: number;
  bj: number;
  totals: Record<number, number>;
}

function emptyDist(): DealerDist {
  return { bust: 0, bj: 0, totals: {} };
}

function mergeDist(a: DealerDist, b: DealerDist, weight: number): DealerDist {
  const out: DealerDist = {
    bust: a.bust + b.bust * weight,
    bj: a.bj + b.bj * weight,
    totals: { ...a.totals },
  };
  for (const key of Object.keys(b.totals)) {
    const total = Number(key);
    out.totals[total] = (out.totals[total] ?? 0) + b.totals[total] * weight;
  }
  return out;
}

function dealerFrom(
  shoe: Counts,
  up: BCard,
  hole: BCard,
  rules: Rules,
): DealerDist {
  const start = handValue([up, hole]);
  if (start.blackjack) {
    return { bust: 0, bj: 1, totals: {} };
  }
  const memo = new Map<string, DealerDist>();
  return draw(shoe, start.total, start.aces, "", rules, memo);
}

function draw(
  shoe: Counts,
  total: number,
  aces: number,
  drawn: string,
  rules: Rules,
  memo: Map<string, DealerDist>,
): DealerDist {
  const key = drawn.split(",").sort().join(",");
  const cached = memo.get(key);
  if (cached) return cached;

  let dist: DealerDist;
  if (total > 21) {
    dist = { bust: 1, bj: 0, totals: {} };
  } else if (total >= 17 && !(aces > 0 && total === 17 && rules.hitSoft17)) {
    dist = { bust: 0, bj: 0, totals: { [total]: 1 } };
  } else {
    dist = emptyDist();
    const remaining = shoeTotal(shoe);
    if (remaining > 0) {
      for (let rank = 1; rank <= 13; rank++) {
        const count = shoe[rank];
        if (count <= 0) continue;
        shoe[rank] -= 1;
        let nextTotal = total;
        let nextAces = aces;
        if (rank === 1) {
          if (total + 11 <= 21) {
            nextTotal = total + 11;
            nextAces = aces + 1;
          } else {
            nextTotal = total + 1;
          }
        } else {
          nextTotal = total + rankValue(rank);
        }
        while (nextTotal > 21 && nextAces > 0) {
          nextTotal -= 10;
          nextAces -= 1;
        }
        const child = draw(
          shoe,
          nextTotal,
          nextAces,
          `${key},${rank}`,
          rules,
          memo,
        );
        dist = mergeDist(dist, child, count / remaining);
        shoe[rank] += 1;
      }
    }
  }
  memo.set(key, dist);
  return dist;
}

/** Final dealer hand distribution, averaged over the hidden hole card. */
export function dealerDistribution(
  shoe: Counts,
  up: BCard,
  hole: BCard | null,
  rules: Rules,
): DealerDist {
  if (hole) {
    const counts = cloneCounts(shoe);
    removeCard(counts, hole);
    return dealerFrom(counts, up, hole, rules);
  }

  let dist = emptyDist();
  const remaining = shoeTotal(shoe);
  if (remaining <= 0) return dist;
  for (let rank = 1; rank <= 13; rank++) {
    const count = shoe[rank];
    if (count <= 0) continue;
    const counts = cloneCounts(shoe);
    counts[rank] -= 1;
    const branch = dealerFrom(counts, up, { rank, suit: 0 }, rules);
    dist = mergeDist(dist, branch, count / remaining);
  }
  return dist;
}

/* ------------------------------------------------------------------ player */

export type ActionName =
  | "hit"
  | "stand"
  | "double"
  | "split"
  | "bust"
  | "blackjack";

export interface Outcomes {
  win: number;
  push: number;
  lose: number;
  bust: number;
  blackjack: number;
}

export interface ActionOption {
  action: ActionName;
  ev: number;
  available: boolean;
}

export interface Analysis {
  hand: HandValue;
  best: ActionName;
  bestEv: number;
  options: ActionOption[];
  outcomes: Outcomes;
  dealer: DealerDist;
  dealerBust: number;
  houseEdge: number;
}

function blankOutcomes(): Outcomes {
  return { win: 0, push: 0, lose: 0, bust: 0, blackjack: 0 };
}

function outcomeValue(outcomes: Outcomes): number {
  // A natural pays 3:2, so it is worth 1.5 units, not 1.
  return outcomes.win - outcomes.lose + outcomes.blackjack * 1.5;
}

/** Result of standing with a settled hand against the dealer distribution. */
function standOutcomes(value: HandValue, dealer: DealerDist): Outcomes {
  const outcomes = blankOutcomes();
  if (value.bust) {
    outcomes.lose = 1;
    return outcomes;
  }
  if (value.blackjack) {
    outcomes.push = dealer.bj;
    outcomes.blackjack = 1 - dealer.bj;
    return outcomes;
  }
  if (dealer.bj > 0) outcomes.lose += dealer.bj;
  for (const key of Object.keys(dealer.totals)) {
    const dealerTotal = Number(key);
    const chance = dealer.totals[dealerTotal];
    if (value.total > dealerTotal) outcomes.win += chance;
    else if (value.total === dealerTotal) outcomes.push += chance;
    else outcomes.lose += chance;
  }
  outcomes.win += dealer.bust;
  return outcomes;
}

interface SolveState {
  shoe: Counts;
  dealer: DealerDist;
  rules: Rules;
  memo: Map<string, { ev: number; outcomes: Outcomes }>;
}

function stateKey(cards: BCard[], allowDouble: boolean, allowSplit: boolean) {
  const ranks = cards.map((card) => card.rank).sort((a, b) => a - b);
  return `${ranks.join(",")}|${allowDouble ? 1 : 0}${allowSplit ? 1 : 0}`;
}

function solve(
  state: SolveState,
  cards: BCard[],
  allowDouble: boolean,
  allowSplit: boolean,
): { ev: number; outcomes: Outcomes } {
  const key = stateKey(cards, allowDouble, allowSplit);
  const cached = state.memo.get(key);
  if (cached) return cached;

  const value = handValue(cards);
  let result: { ev: number; outcomes: Outcomes };

  if (value.bust) {
    result = { ev: -1, outcomes: { ...blankOutcomes(), lose: 1, bust: 1 } };
  } else if (value.blackjack) {
    const outcomes = standOutcomes(value, state.dealer);
    result = { ev: outcomeValue(outcomes), outcomes };
  } else {
    const stand = standOutcomes(value, state.dealer);
    const standEv = outcomeValue(stand);

    let hitEv = 0;
    const hitOutcomes = blankOutcomes();
    const remaining = shoeTotal(state.shoe);
    if (remaining > 0) {
      for (let rank = 1; rank <= 13; rank++) {
        const count = state.shoe[rank];
        if (count <= 0) continue;
        state.shoe[rank] -= 1;
        const card: BCard = { rank, suit: pickSuit(cards, rank) };
        const child = solve(state, [...cards, card], false, false);
        const chance = count / remaining;
        hitEv += child.ev * chance;
        hitOutcomes.win += child.outcomes.win * chance;
        hitOutcomes.push += child.outcomes.push * chance;
        hitOutcomes.lose += child.outcomes.lose * chance;
        hitOutcomes.bust += child.outcomes.bust * chance;
        hitOutcomes.blackjack += child.outcomes.blackjack * chance;
        state.shoe[rank] += 1;
      }
    }

    let bestEv = standEv;
    let bestOutcomes = stand;
    if (hitEv > bestEv) {
      bestEv = hitEv;
      bestOutcomes = hitOutcomes;
    }
    result = { ev: bestEv, outcomes: bestOutcomes };
  }

  state.memo.set(key, result);
  return result;
}

/** EV of drawing exactly one more card and then settling the hand. */
function oneCardThenSettle(
  shoe: Counts,
  hand: BCard[],
  dealer: DealerDist,
): { ev: number; outcomes: Outcomes } {
  const outcomes = blankOutcomes();
  let ev = 0;
  const remaining = shoeTotal(shoe);
  for (let rank = 1; rank <= 13; rank++) {
    const count = shoe[rank];
    if (count <= 0) continue;
    shoe[rank] -= 1;
    const card: BCard = { rank, suit: pickSuit(hand, rank) };
    const next = handValue([...hand, card]);
    const outcome = next.bust
      ? { ...blankOutcomes(), lose: 1, bust: 1 }
      : standOutcomes(next, dealer);
    const chance = count / remaining;
    ev += outcomeValue(outcome) * chance;
    outcomes.win += outcome.win * chance;
    outcomes.push += outcome.push * chance;
    outcomes.lose += outcome.lose * chance;
    outcomes.bust += outcome.bust * chance;
    outcomes.blackjack += outcome.blackjack * chance;
    shoe[rank] += 1;
  }
  return { ev, outcomes };
}

export function analyze(
  player: BCard[],
  up: BCard | null,
  hole: BCard | null,
  rules: Rules,
  allowed?: ActionName[],
): Analysis | null {
  if (!up || player.length === 0) return null;
  const can = (action: ActionName) => !allowed || allowed.includes(action);

  const shoe = freshShoe(rules.decks);
  for (const card of player) removeCard(shoe, card);
  removeCard(shoe, up);

  const dealer = dealerDistribution(shoe, up, hole, rules);
  // The hole card is known to the player, so it must not come back out of the
  // shoe on the player's draws.
  if (hole && rules.holeKnown) removeCard(shoe, hole);
  const value = handValue(player);

  const state: SolveState = { shoe, dealer, rules, memo: new Map() };
  const canSplit = player.length === 2 && player[0].rank === player[1].rank;
  const canDouble = player.length === 2 && !value.blackjack;

  const standOut = standOutcomes(value, dealer);
  const standEv = outcomeValue(standOut);

  let hitEv = 0;
  const hitOutcomes = blankOutcomes();
  {
    const remaining = shoeTotal(shoe);
    for (let rank = 1; rank <= 13; rank++) {
      const count = shoe[rank];
      if (count <= 0) continue;
      shoe[rank] -= 1;
      const card: BCard = { rank, suit: pickSuit(player, rank) };
      const child = solve(state, [...player, card], false, false);
      const chance = count / remaining;
      hitEv += child.ev * chance;
      hitOutcomes.win += child.outcomes.win * chance;
      hitOutcomes.push += child.outcomes.push * chance;
      hitOutcomes.lose += child.outcomes.lose * chance;
      hitOutcomes.bust += child.outcomes.bust * chance;
      hitOutcomes.blackjack += child.outcomes.blackjack * chance;
      shoe[rank] += 1;
    }
  }

  let doubleEv: number | null = null;
  let doubleOutcomes: Outcomes = blankOutcomes();
  if (canDouble) {
    const single = oneCardThenSettle(shoe, player, dealer);
    doubleEv = 2 * single.ev;
    doubleOutcomes = single.outcomes;
  }

  /** Expected value of playing a pair as two hands, one card each. */
  const evalPair = (hand: BCard[], depth: number): number => {
    let sum = 0;
    let weight = 0;
    const remaining = shoeTotal(shoe);
    for (let rank = 1; rank <= 13; rank++) {
      const count = shoe[rank];
      if (count <= 0) continue;
      shoe[rank] -= 1;
      const chance = count / remaining;
      for (const card of [hand[0], hand[1]]) {
        const next: BCard[] = [card, { rank, suit: pickSuit([card], rank) }];
        const nextValue = handValue(next);
        let ev: number;
        if (nextValue.blackjack) {
          // A natural from a split only pays 3:2 when the split was aces.
          const pays = card.rank === 1 ? 1.5 : 1;
          const outcome = standOutcomes(nextValue, dealer);
          ev = outcome.blackjack * pays - outcome.lose;
        } else if (
          next[0].rank === next[1].rank &&
          depth < 3 &&
          !(next[0].rank === 1 && !rules.resplitAces)
        ) {
          ev = evalPair(next, depth + 1);
        } else {
          ev = solve(state, next, rules.das, false).ev;
        }
        sum += ev * chance * 0.5;
        weight += chance * 0.5;
      }
      shoe[rank] += 1;
    }
    return weight > 0 ? sum / weight : 0;
  };

  const splitEv = canSplit ? evalPair(player, 0) : null;


  const options: ActionOption[] = [
    { action: "stand", ev: standEv, available: true },
    { action: "hit", ev: hitEv, available: true },
    { action: "double", ev: doubleEv ?? 0, available: canDouble },
    { action: "split", ev: splitEv ?? 0, available: canSplit },
  ];

  let best: ActionName = "stand";
  let bestEv = standEv;
  let bestOutcomes: Outcomes = standOut;
  for (const option of options) {
    if (!option.available) continue;
    if (!can(option.action)) continue;
    if (option.action === "split" && splitEv === null) continue;
    if (option.ev > bestEv + 1e-9) {
      bestEv = option.ev;
      best = option.action;
      if (option.action === "hit") bestOutcomes = hitOutcomes;
      else if (option.action === "double") bestOutcomes = doubleOutcomes;
    }
  }

  if (value.bust) {
    bestOutcomes = { ...blankOutcomes(), lose: 1, bust: 1 };
    best = "bust";
    bestEv = -1;
  } else if (value.blackjack) {
    bestOutcomes = standOut;
    best = "blackjack";
    bestEv = outcomeValue(standOut);
  }

  return {
    hand: value,
    best,
    bestEv,
    options,
    outcomes: bestOutcomes,
    dealer,
    dealerBust: dealer.bust,
    houseEdge: -bestEv * 100,
  };
}

export function randomHand(counts: Counts, size: number): BCard[] {
  const cards: BCard[] = [];
  for (let i = 0; i < size; i++) {
    const total = shoeTotal(counts);
    if (total <= 0) break;
    let roll = Math.random() * total;
    for (let rank = 1; rank <= 13; rank++) {
      roll -= counts[rank];
      if (roll <= 0 || rank === 13) {
        if (counts[rank] > 0) {
          counts[rank] -= 1;
          const suit = Math.floor(Math.random() * 4) as Suit;
          cards.push({ rank, suit });
        }
        break;
      }
    }
  }
  return cards;
}
