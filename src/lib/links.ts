/**
 * The two calculators live in separate GitHub repositories, so the link
 * between them has to point somewhere different depending on where the page
 * is running: the sibling repository when deployed, the local page during
 * development.
 */

const GITHUB_USER = "nicholaschung1025-dot";

const REPOS = {
  poker: "orbis-odds",
  blackjack: "orbis-blackjack",
} as const;

export type Sibling = keyof typeof REPOS;

export function isDeployed(): boolean {
  return (
    typeof window !== "undefined" &&
    window.location.hostname.endsWith("github.io")
  );
}

/** URL of the other calculator, for the current environment. */
export function siblingUrl(sibling: Sibling, localPath: string): string {
  if (!isDeployed()) return localPath;
  return `https://${GITHUB_USER}.github.io/${REPOS[sibling]}/`;
}
