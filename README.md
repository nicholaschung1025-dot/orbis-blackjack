# Orbis

Two table-game calculators that share one design system and one engine
approach: a deep-space interface built with React, TypeScript and Vite.

| Calculator | Repository | Live |
| --- | --- | --- |
| Texas Hold'em equity | [`orbis-odds`](https://github.com/nicholaschung1025-dot/orbis-odds) | <https://nicholaschung1025-dot.github.io/orbis-odds/> |
| Blackjack expected value | [`orbis-blackjack`](https://github.com/nicholaschung1025-dot/orbis-blackjack) | <https://nicholaschung1025-dot.github.io/orbis-blackjack/> |

Each site links to the other from the same place it does locally, so you can
jump between them without coming back here.

## Texas Hold'em equity

Pick cards from a live 52-card deck and the win, tie and loss percentages
recompute on every betting round. Up to eight opponents sit at the table as
animated 3D characters, each with a live hole-card pair and the share of
runouts in which that specific seat outranks you.

The engine evaluates every seven-card hand at showdown and runs 24,000
runouts per update in a web worker, so the numbers settle in well under a
hundred milliseconds.

## Blackjack expected value

Enter your hand and the dealer's up card and the calculator returns the
expected-value optimal play, the expected value of every alternative
(hit, stand, double, split) and the true win, push, loss, bust and natural
probabilities, plus the dealer's bust percentage and final-hand
distribution.

Two things make it exact rather than approximate:

- The dealer side enumerates every multiset of cards the dealer can draw, so
  the bust percentage reflects the composition of the shoe in front of you.
  Against a ten it lands within 0.2% of the published six-deck figure.
- The player side is a memoised recursion over your own draws, so each
  action's expected value is computed against optimal continuation.

When the suggestion is **hit**, you can pick the card yourself and watch the
hand re-price.

## Development

```bash
npm install
npm run dev            # both pages
npm run build          # both pages
npm run build:poker    # poker page only  (orbis-odds)
npm run build:blackjack # blackjack only   (orbis-blackjack)
npm run typecheck
```

`npm run dev` serves the poker page at `/` and the blackjack page at
`/blackjack.html`.

## Design system

- `#010828` deep navy, `#EFF4FF` cream, `#6FFF00` neon
- Anton for headings, Condiment for script accents, system mono for body copy
- A liquid-glass treatment on the navigation, cards and overlays
- A fine film-grain overlay across the whole page
- Space footage served from CloudFront, cut into looping character avatars
  for the table

## Deployment

Both repositories are published with GitHub Pages through
`.github/workflows/deploy-pages.yml`. The same source tree builds either
site: the workflow picks the target from the repository name, and Vite emits
relative asset paths so the site works under the `/repo/` project path.
