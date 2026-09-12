import next from "eslint-config-next/core-web-vitals";
import shilpSutra from "@devalok/eslint-plugin-shilp-sutra";

/** Flat ESLint config (ESLint 9). `next lint` was removed in Next 16; run `eslint .`. */
const config = [
  { ignores: [".next/**", ".astro/**", "node_modules/**", "next-env.d.ts"] },
  ...next,
  // Design-system token hygiene.
  //
  // gurukul consumes shilp-sutra as a TOKEN SOURCE ONLY — no React components — which is
  // exactly the consumer shape these rules exist for: CLAUDE.md already warns that "TW4
  // silently drops utility classes whose backing token was renamed", and asks a human to
  // re-verify every DS utility by hand on each upgrade. This makes that a machine's job.
  //
  // Only the token / Tailwind-4 rules are on. The component rules
  // (no-deprecated-button-variant, no-deprecated-chip, no-iconbutton-children,
  // prefer-per-component-import, use-toast-deprecated) are inert here by design — this site
  // renders none of the package's components.
  {
    files: ["src/**/*.{ts,tsx}"],
    plugins: { "shilp-sutra": shilpSutra },
    rules: {
      // Numbered surface aliases map to raw neutral steps. This site is light-only, so the
      // dark-inversion argument does not bite — but the aliases are removed API and the
      // class simply stops emitting when they go.
      "shilp-sutra/no-deprecated-surface-token": "error",
      // surface-raised -> surface-panel (0.57.0), with interaction states RETARGETED to
      // -panel-hover rather than renamed.
      "shilp-sutra/no-renamed-surface-token": "error",
      "shilp-sutra/no-deprecated-shadow-token": "error",
      // Bare `shadow` renders nothing at all in Tailwind 4 — and this site uses
      // `hover:shadow-brand`, one character away from it.
      "shilp-sutra/no-bare-shadow": "error",
      // `bg-gradient-to-*` and `w-[--var]` are both dead in TW4.
      "shilp-sutra/no-bg-gradient-to": "error",
      "shilp-sutra/no-css-var-bracket": "error",
    },
  },
];

export default config;
