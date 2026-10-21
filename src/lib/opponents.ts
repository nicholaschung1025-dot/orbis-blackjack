export interface Opponent {
  id: string;
  name: string;
  video: string;
  poster: string;
  /** Hue rotation applied to the clip so repeat characters still read apart. */
  hue: number;
}

/** Public assets are referenced through the build base so they survive the
 *  /repo/ path of a GitHub Pages project site. */
const character = (name: string) => `${import.meta.env.BASE_URL}characters/${name}`;

export const ROSTER: Opponent[] = [
  {
    id: "orla",
    name: "Orla",
    video: character("orla.mp4"),
    poster: character("orla.jpg"),
    hue: 0,
  },
  {
    id: "fenn",
    name: "Fenn",
    video: character("fenn.mp4"),
    poster: character("fenn.jpg"),
    hue: 0,
  },
  {
    id: "ivo",
    name: "Ivo",
    video: character("ivo.mp4"),
    poster: character("ivo.jpg"),
    hue: 0,
  },
  {
    id: "koda",
    name: "Koda",
    video: character("koda.mp4"),
    poster: character("koda.jpg"),
    hue: 0,
  },
  {
    id: "lume",
    name: "Lume",
    video: character("orla.mp4"),
    poster: character("orla.jpg"),
    hue: 168,
  },
  {
    id: "kivo",
    name: "Kivo",
    video: character("fenn.mp4"),
    poster: character("fenn.jpg"),
    hue: 218,
  },
  {
    id: "sable",
    name: "Sable",
    video: character("ivo.mp4"),
    poster: character("ivo.jpg"),
    hue: 288,
  },
  {
    id: "vega",
    name: "Vega",
    video: character("koda.mp4"),
    poster: character("koda.jpg"),
    hue: 138,
  },
];

export function rosterFor(count: number): Opponent[] {
  return ROSTER.slice(0, Math.max(0, Math.min(count, ROSTER.length)));
}
