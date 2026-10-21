import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";

/**
 * The two calculators ship from one source tree into two repositories:
 *
 *   orbis-odds       -> builds the poker page only      (--mode poker)
 *   orbis-blackjack  -> builds the blackjack page only  (--mode blackjack)
 *   local build      -> builds both pages               (default)
 *
 * A relative base keeps the assets working under a project page path such as
 * /orbis-odds/ without a rebuild. The standalone blackjack build renames its
 * entry to index.html afterwards, because GitHub Pages serves whatever sits
 * at the root of the site.
 */
export default defineConfig(({ command, mode }) => {
  const target =
    mode === "blackjack" ? "blackjack" : mode === "poker" ? "poker" : "both";

  const input: Record<string, string> =
    target === "blackjack"
      ? { main: "blackjack.html" }
      : target === "poker"
        ? { main: "index.html" }
        : { main: "index.html", blackjack: "blackjack.html" };

  return {
    base: command === "build" ? "./" : "/",
    plugins: [react()],
    build: {
      rollupOptions: { input },
    },
  };
});
