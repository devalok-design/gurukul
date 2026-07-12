# gurukul — Devalok's founder-education site

Next.js content site (`gurukul.devalok.in`). Content-first: guides, articles, RSS, sitemap. Ported from Astro to Next.js App Router (2026-07) to standardize on the studio-wide stack.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript strict**, ESM (`"type": "module"`).
- **Render mode: standard Next** (`next start`), all pages statically pre-rendered (SSG via `export const dynamic = "force-static"` + `generateStaticParams`). No `output: "export"`.
- **Tailwind 4** (CSS-first) via `@tailwindcss/postcss` — no `tailwind.config`, no JS preset. All CSS lives in `src/app/globals.css` (+ `src/app/prose.css`).
- **@devalok/shilp-sutra** consumed as a **design-token source only** — no React components. gurukul uses the DS's OKLCH tokens + utility classes (`text-surface-*`, `text-ds-*`, `bg-accent-*`, `rounded-ds-*`, `hover:shadow-brand`, `duration-*`/`ease-*` motion). In `transpilePackages`.
- **Fonts:** self-hosted Inter via `next/font/local` (`public/fonts/Inter-Variable.woff2` + italic). Exposed as `--font-inter`, wired into `--font-sans` in `globals.css`. Privacy/sovereignty — do NOT switch to `next/font/google`.
- Light-mode only (`color-scheme: light`, warm-white surface). No dark mode.

## Commands

```bash
npm install      # legacy-peer-deps=true via .npmrc (DS peer deps)
npm run dev      # next dev
npm run build    # next build (SSG)
npm start        # next start
npm run lint     # next lint
```

There is no test suite. Verify changes with `npm run build` (ground truth) + `npx tsc --noEmit`.

## Content pipeline (`src/lib/guides.ts`)

Filesystem markdown + `unified` (remark/rehype) + `zod` frontmatter — no content-framework dep. Runs entirely at build time (RSC).

- Reads `src/content/guides/*.md`; `slug` = filename without `.md` (ROOT-level route `/{slug}`, NOT `/guides/{slug}`).
- Frontmatter parsed with `gray-matter`, validated with a zod schema (ported from the old `src/content.config.ts`).
- Markdown → HTML via `remark-parse → remark-gfm → remark-rehype → rehype-slug → rehype-autolink-headings (append, empty content) → rehype-pretty-code (github-dark) → rehype-stringify`.
- TOC headings (depth 2 & 3) are read back from the rendered hast tree (their rehype-slug `id`), so `#anchor` links always match heading ids exactly.
- `getAllGuides()` (all guides, date desc — callers filter `draft`), `getGuide(slug)` → `{ data, html, headings }`.

## Design tokens + shilp-sutra (IMPORTANT)

`globals.css` imports the **standard DS bundle**: `@import "@devalok/shilp-sutra/css";` (this replaced the old individual-token-file workaround from the Astro build). Custom `max-w-article` / `max-w-page` come from `@theme { --container-article/--container-page }` (the `--container-*` namespace generates `max-w-*`).

### Upgrading shilp-sutra

TW4 silently drops utility classes whose backing token was renamed. When bumping the DS, verify every DS utility the site uses still emits, and check `prose.css` (which references DS tokens directly via `var()`). Use the shilp-sutra MCP (`get_tokens`/`upgrade`, pass the installed version) or `node_modules/@devalok/shilp-sutra/BREAKING.json` to find renames. Known renames (fixed on the Next port): `--font-size-*` → `--text-ds-*`, `--spacing-NN` → `--spacing-ds-NN`, `--radius-{sm,md,lg}` → `--radius-ds-*`, `--line-height-*` → `--leading-ds-*`.

## Routes

`/` (home), `/about`, `/{slug}` (guide), `/rss.xml` (route handler), `/sitemap.xml` (`sitemap.ts`), 404 (`not-found.tsx`). `trailingSlash` is Next default (false). Full SEO parity: Metadata API (title/OG/Twitter/canonical/RSS alternate/icons) + JSON-LD Article on guide pages. GA (`G-6HETDZ47R1`) loaded via `next/script`; custom GA events in the client `Analytics` component.

## Deploy

**Railway** (Railpack auto-detects Next: `next build` / `next start`). Repoint `gurukul.devalok.in` DNS to the Railway service. `.npmrc` keeps `legacy-peer-deps=true`. (Previously Vercel + GitHub Pages — both removed on the Next port.)
