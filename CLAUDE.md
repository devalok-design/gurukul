# gurukul — Devalok's founder-education site

Next.js content site (`gurukul.devalok.in`). Content-first: guides, articles, RSS, sitemap. Ported from Astro to Next.js App Router (2026-07) to standardize on the studio-wide stack.

## Stack

- **Next.js 16** (App Router) · **React 19** · **TypeScript strict**, ESM (`"type": "module"`).
- **Render mode: static export** (`output: "export"` in `next.config.ts`) — all pages were already prerendered (SSG via `export const dynamic = "force-static"` + `generateStaticParams`), so the export is a lossless change. `next build` writes `./out`, which Cloudflare serves directly. **`headers()` has no effect in export mode** — security headers live in `public/_headers`.
- **Tailwind 4** (CSS-first) via `@tailwindcss/postcss` — no `tailwind.config`, no JS preset. All CSS lives in `src/app/globals.css` (+ `src/app/prose.css`).
- **@devalok/shilp-sutra** consumed as a **design-token source only** — no React components. gurukul uses the DS's OKLCH tokens + utility classes (`text-surface-*`, `text-ds-*`, `bg-accent-*`, `rounded-ds-*`, `hover:shadow-brand`, `duration-*`/`ease-*` motion). In `transpilePackages`.
- **Fonts:** self-hosted Inter via `next/font/local` (`public/fonts/Inter-Variable.woff2` + italic). Exposed as `--font-inter`, wired into `--font-sans` in `globals.css`. Privacy/sovereignty — do NOT switch to `next/font/google`.
- Light-mode only (`color-scheme: light`, warm-white surface). No dark mode.

## Commands

```bash
npm install      # clean install (DS required peers are explicit deps; no legacy-peer-deps)
npm run dev      # next dev
npm run build    # next build (SSG)
npm start        # next start
npm run lint     # eslint . (Next 16.2 removed the `next lint` subcommand)
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

**Cloudflare Workers.** `gurukul.devalok.in` is a Cloudflare custom domain on the
`gurukul` Worker — an assets-only Worker (no `main`) serving `./out`, declared in
`wrangler.jsonc`. The stale Railway CNAME on that hostname was deleted when the site
moved, so **Cloudflare owns the DNS record**.

Push to `main` deploys via `.github/workflows/deploy.yml` (build → `wrangler deploy` →
assert the live hostname returns 200). Nothing deploys by hand.

`package-lock.json` is **gitignored** (`.gitignore:21`), so CI runs `npm install`, not
`npm ci`, and cannot cache on a lockfile. DS required peers (framer-motion,
@tabler/icons-react) are explicit deps so the Linux `lightningcss` binary installs — do
NOT reintroduce `legacy-peer-deps`, which makes npm skip platform-optional binaries and
breaks the build.

(Previously Railway, and before that Vercel + GitHub Pages. The Railway service was a
redundant second copy of this site after the Cloudflare move and has been retired.)
