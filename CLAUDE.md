# gurukul — Devalok's founder-education site

Astro static site (`gurukul.devalok.in`). Content-first: guides, articles, RSS, sitemap.

## Stack

- **Astro 6** (static output), no React island usage.
- **Tailwind 4** (CSS-first) via the `@tailwindcss/vite` plugin — configured in `astro.config.mjs` under `vite.plugins`, NOT the old `@astrojs/tailwind` integration.
- **@devalok/shilp-sutra** consumed as a **design-token source only** — no React components. gurukul uses the DS's OKLCH tokens + utility classes (`text-surface-*`, `text-ds-*`, `bg-accent-*`, `rounded-ds-*`, `hover:shadow-brand`, `duration-*`/`ease-*` motion).

## Commands

```bash
npm run dev      # astro dev
npm run build    # astro build -> dist/ (static)
npm run preview  # astro preview
```

## Tailwind 4 + shilp-sutra setup (IMPORTANT)

There is **no `tailwind.config.cjs`** and **no JS preset** — shilp-sutra dropped the JS preset in 0.37; it's TW4 CSS-first now. Everything lives in `src/styles/global.css`, imported once from `src/layouts/BaseLayout.astro`:

```css
@import 'tailwindcss';
@import '../../node_modules/@devalok/shilp-sutra/dist/tokens/primitives.css';
@import '../../node_modules/@devalok/shilp-sutra/dist/tokens/semantic.css';
@import '../../node_modules/@devalok/shilp-sutra/dist/tokens/typography-semantic.css';
```

- We import the **three individual DS token files** rather than `@devalok/shilp-sutra/css` — deliberately, to skip `typography.css` (its `@font-face` uses relative font paths into the tarball). gurukul **self-hosts Inter** via its own `@font-face` in `global.css`.
- `semantic.css` / `typography-semantic.css` carry `@theme` blocks, so TW4 generates the DS utility classes from them. `primitives.css` is `:root` vars only.
- Custom `max-w-article` / `max-w-page` utilities come from `@theme { --container-article/--container-page }` in `global.css` (the `--container-*` namespace generates `max-w-*`). These were `theme.extend.maxWidth` in the old TW3 config.

### Upgrading shilp-sutra

When bumping the DS, verify **every DS utility class the site uses still emits** in `dist/_astro/*.css` after `npm run build` — TW4 silently drops classes whose backing token was renamed. Token renames bite here because we consume tokens directly. Known past rename: `--line-height-relaxed` → `--leading-ds-relaxed` (0.29→0.45). Use the shilp-sutra MCP (`https://shilp-sutra.devalok.in/mcp`, `upgrade(from,to)`) or `node_modules/@devalok/shilp-sutra/BREAKING.json` to find renames.

## Deploy

Currently Vercel (`vercel.json`), auto-deploy on push to `main`. **Migrating to Railway** — DNS cutover for `gurukul.devalok.in` pending.
