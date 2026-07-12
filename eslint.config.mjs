import next from "eslint-config-next/core-web-vitals";

/** Flat ESLint config (ESLint 9). `next lint` was removed in Next 16; run `eslint .`. */
const config = [
  { ignores: [".next/**", ".astro/**", "node_modules/**", "next-env.d.ts"] },
  ...next,
];

export default config;
