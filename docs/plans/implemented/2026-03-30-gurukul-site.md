# Gurukul (gurukul.devalok.in) Implementation Plan

> **For Claude:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task.

**Goal:** Build Devalok Gurukul — a static content site for publishing practical guides, powered by Astro + Shilp Sutra design tokens + Tailwind CSS.

**Architecture:** Astro static site using content collections for markdown guides. Shilp Sutra provides design tokens (CSS custom properties) and a Tailwind preset — we use these for brand consistency but write all components as plain Astro (no React). Self-hosted Inter variable font from Shilp Sutra's bundled woff2 files.

**Tech Stack:** Astro 5, Tailwind CSS 3.4, @devalok/shilp-sutra (tokens + tailwind preset only), Shiki (syntax highlighting, built into Astro), Vercel deployment.

---

## Design Tokens Reference

All styling uses Shilp Sutra semantic tokens. Key mappings:

| Purpose | Token / Class |
|---------|--------------|
| Brand/accent | `accent-9` (Padmavarna #D33163) |
| Accent text | `text-accent-11` |
| Accent hover | `accent-12` |
| Primary text | `text-surface-fg` (--color-surface-fg = neutral-12) |
| Secondary text | `text-surface-fg-muted` (--color-surface-fg-muted = neutral-11) |
| Tertiary text | `text-surface-fg-subtle` (--color-surface-fg-subtle = neutral-8) |
| Page background | `bg-surface-base` (--color-surface-base = neutral-2) |
| Card/surface | `bg-surface-raised` (--color-surface-raised = neutral-1) |
| Border | `border-surface-border` (--color-surface-border = neutral-5) |
| Border strong | `border-surface-border-strong` (--color-surface-border-strong = neutral-6) |
| Border subtle | `border-surface-border-subtle` (--color-surface-border-subtle = neutral-4) |
| Callout bg | `bg-accent-3` |
| Callout border | `border-accent-7` |
| Callout text | `text-accent-11` |
| Spacing | `ds-01` through `ds-13` (2px–160px) |
| Radius | `rounded-ds-sm` (2px), `rounded-ds-default` (4px), `rounded-ds-md` (6px), `rounded-ds-lg` (10px) |
| Shadows | `shadow-raised`, `shadow-raised-hover` |
| Transitions | `duration-fast-01` (70ms), `duration-fast-02` (110ms), `duration-moderate-01` (150ms) |
| Easing | `ease-productive-standard`, `ease-productive-entrance`, `ease-productive-exit` |
| Font weight | `font-semibold` (600) default emphasis, `font-bold` (700) only for article H1 |

### Link Pattern (from Shilp Sutra Link component)
```
text-accent-11 underline decoration-transparent hover:decoration-current
underline-offset-2 hover:text-accent-12 active:opacity-80
transition-[color,text-decoration-color,opacity] duration-fast-01 ease-productive-standard
```

### Interactive Surface Pattern (from Card component)
```
rounded-ds-lg border border-surface-border bg-surface-raised shadow-raised
hover:shadow-raised-hover hover:border-surface-border-strong
transition-shadow duration-fast-02 ease-productive-standard
```

---

## Project Structure

```
gurukul/
├── astro.config.mjs
├── tailwind.config.cjs
├── tsconfig.json
├── package.json
├── vercel.json
├── public/
│   ├── favicon.svg
│   └── fonts/
│       ├── Inter-Variable.woff2
│       └── Inter-Italic-Variable.woff2
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── ChakraSvg.astro
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── GuideEntry.astro
│   │   └── TableOfContents.astro
│   ├── content/
│   │   ├── config.ts
│   │   └── guides/
│   │       └── non-dilutive-funding-guide.md
│   ├── pages/
│   │   ├── index.astro
│   │   ├── about.astro
│   │   ├── rss.xml.ts
│   │   └── [...slug].astro
│   └── styles/
│       ├── global.css
│       └── prose.css
├── docs/
│   └── plans/
└── README.md
```

---

## Task 1: Project Scaffolding & Dependencies

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tailwind.config.cjs`, `tsconfig.json`, `vercel.json`

**Step 1: Initialize Astro project**

```bash
cd C:/Users/mudit/Documents/GitHub/gurukul
npm create astro@latest . -- --template minimal --no-install --no-git --typescript strict
```

If the interactive prompts block, create manually:

```json
// package.json
{
  "name": "gurukul",
  "type": "module",
  "version": "0.0.1",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "astro": "astro"
  }
}
```

**Step 2: Install dependencies**

```bash
npm install astro @astrojs/tailwind @astrojs/sitemap tailwindcss@^3.4 @devalok/shilp-sutra
```

**Step 3: Configure Astro**

```javascript
// astro.config.mjs
import { defineConfig } from 'astro/config';
import tailwind from '@astrojs/tailwind';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://gurukul.devalok.in',
  integrations: [
    tailwind(),
    sitemap(),
  ],
  markdown: {
    shikiConfig: {
      theme: 'github-dark',
      wrap: true,
    },
  },
});
```

**Step 4: Configure Tailwind with Shilp Sutra preset**

```javascript
// tailwind.config.cjs
const shilpSutra = require('@devalok/shilp-sutra/tailwind');

/** @type {import('tailwindcss').Config} */
module.exports = {
  presets: [shilpSutra],
  content: ['./src/**/*.{astro,html,js,jsx,md,mdx,svelte,ts,tsx,vue}'],
  theme: {
    extend: {
      maxWidth: {
        'article': '720px',
        'page': '1200px',
      },
    },
  },
  plugins: [],
};
```

**Step 5: Configure TypeScript**

```json
// tsconfig.json
{
  "extends": "astro/tsconfigs/strict",
  "compilerOptions": {
    "baseUrl": ".",
    "paths": {
      "@/*": ["src/*"]
    }
  }
}
```

**Step 6: Create vercel.json**

```json
{
  "framework": "astro"
}
```

**Step 7: Verify build**

```bash
npm run build
```

Expected: Build succeeds (may warn about no pages yet, that's fine).

**Step 8: Commit**

```bash
git add -A
git commit -m "chore: scaffold Astro project with Shilp Sutra + Tailwind"
```

---

## Task 2: Fonts & Global Styles

**Files:**
- Create: `public/fonts/Inter-Variable.woff2`, `public/fonts/Inter-Italic-Variable.woff2`
- Create: `src/styles/global.css`
- Create: `public/favicon.svg`

**Step 1: Copy Inter fonts from Shilp Sutra**

```bash
mkdir -p public/fonts
cp node_modules/@devalok/shilp-sutra/fonts/Inter-Variable.woff2 public/fonts/
cp node_modules/@devalok/shilp-sutra/fonts/Inter-Italic-Variable.woff2 public/fonts/
```

**Step 2: Create global.css**

Import Shilp Sutra tokens individually (skip typography.css which has font-face with broken relative paths — we self-host fonts):

```css
/* src/styles/global.css */

/* Shilp Sutra design tokens */
@import '@devalok/shilp-sutra/dist/tokens/primitives.css';
@import '@devalok/shilp-sutra/dist/tokens/semantic.css';
@import '@devalok/shilp-sutra/dist/tokens/typography-semantic.css';

@tailwind base;
@tailwind components;
@tailwind utilities;

/* Self-hosted Inter variable font */
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: normal;
  font-display: swap;
}
@font-face {
  font-family: 'Inter';
  src: url('/fonts/Inter-Italic-Variable.woff2') format('woff2');
  font-weight: 100 900;
  font-style: italic;
  font-display: swap;
}

@layer base {
  html {
    font-family: 'Inter', var(--font-sans);
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    text-rendering: optimizeLegibility;
  }

  body {
    background-color: var(--color-surface-base);
    color: var(--color-surface-fg);
    line-height: var(--line-height-relaxed);
  }

  /* Override surface-base for Gurukul: warm white, not grey */
  :root {
    --color-surface-base: oklch(0.99 0.005 360);
  }

  ::selection {
    background-color: var(--pink-3);
    color: var(--pink-12);
  }
}
```

Note: Shilp Sutra's `--color-surface-base` defaults to `neutral-2` (a slightly grey page like Stripe/Linear). For Gurukul, we override it to a warm near-white (`oklch(0.99 0.005 360)`) since this is a reading site, not a dashboard.

**Step 3: Update Astro config to use custom CSS**

Update `astro.config.mjs` — change the tailwind integration to not inject base styles (we handle it in global.css):

```javascript
tailwind({ applyBaseStyles: false }),
```

**Step 4: Create favicon.svg**

```svg
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32"><title>Devalok</title><path fill="#D33163" d="M25.97,21.39c-0.9-1.85,0.08-3.95-1.72-5.39c1.76-1.44,0.8-3.55,1.69-5.39c0.05-0.12,0.04-0.25-0.02-0.35c-0.06-0.1-0.16-0.18-0.29-0.19c-2.05-0.15-3.35-2.04-5.5-1.21c-0.39-2.21-2.7-2.44-3.84-4.13c-0.08-0.1-0.19-0.16-0.31-0.16c-0.12,0-0.23,0.05-0.31,0.16c-1.14,1.69-3.43,1.92-3.82,4.13c-2.14-0.83-3.47,1.07-5.52,1.21c-0.13,0.01-0.23,0.09-0.29,0.19c-0.06,0.1-0.07,0.23-0.02,0.35c0.9,1.85-0.08,3.95,1.72,5.39c-1.76,1.44-0.8,3.55-1.69,5.39C6,21.51,6.02,21.64,6.07,21.74c0.06,0.1,0.16,0.18,0.29,0.19c2.05,0.15,3.38,2.06,5.52,1.23c0.39,2.21,2.67,2.43,3.82,4.12c0.08,0.1,0.19,0.16,0.31,0.16c0.12,0,0.23-0.05,0.31-0.16c1.14-1.69,3.42-1.92,3.81-4.13c2.14,0.83,3.48-1.07,5.53-1.22c0.13-0.01,0.23-0.09,0.29-0.19C26.01,21.64,26.02,21.51,25.97,21.39z"/></svg>
```

**Step 5: Commit**

```bash
git add -A
git commit -m "feat: add Inter fonts, global styles with Shilp Sutra tokens, favicon"
```

---

## Task 3: Base Layout & Shared Components

**Files:**
- Create: `src/components/ChakraSvg.astro`
- Create: `src/components/Header.astro`
- Create: `src/components/Footer.astro`
- Create: `src/layouts/BaseLayout.astro`

**Step 1: Create ChakraSvg component**

```astro
---
// src/components/ChakraSvg.astro
interface Props {
  class?: string;
  size?: number;
}
const { class: className = '', size = 24 } = Astro.props;
---
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 32 32" width={size} height={size} class={className} aria-hidden="true">
  <path fill="currentColor" d="M25.97,21.39c-0.9-1.85,0.08-3.95-1.72-5.39c1.76-1.44,0.8-3.55,1.69-5.39c0.05-0.12,0.04-0.25-0.02-0.35c-0.06-0.1-0.16-0.18-0.29-0.19c-2.05-0.15-3.35-2.04-5.5-1.21c-0.39-2.21-2.7-2.44-3.84-4.13c-0.08-0.1-0.19-0.16-0.31-0.16c-0.12,0-0.23,0.05-0.31,0.16c-1.14,1.69-3.43,1.92-3.82,4.13c-2.14-0.83-3.47,1.07-5.52,1.21c-0.13,0.01-0.23,0.09-0.29,0.19c-0.06,0.1-0.07,0.23-0.02,0.35c0.9,1.85-0.08,3.95,1.72,5.39c-1.76,1.44-0.8,3.55-1.69,5.39C6,21.51,6.02,21.64,6.07,21.74c0.06,0.1,0.16,0.18,0.29,0.19c2.05,0.15,3.38,2.06,5.52,1.23c0.39,2.21,2.67,2.43,3.82,4.12c0.08,0.1,0.19,0.16,0.31,0.16c0.12,0,0.23-0.05,0.31-0.16c1.14-1.69,3.42-1.92,3.81-4.13c2.14,0.83,3.48-1.07,5.53-1.22c0.13-0.01,0.23-0.09,0.29-0.19C26.01,21.64,26.02,21.51,25.97,21.39z"/>
</svg>
```

**Step 2: Create Header component**

```astro
---
// src/components/Header.astro
import ChakraSvg from './ChakraSvg.astro';
---
<header class="w-full border-b border-surface-border-subtle">
  <div class="max-w-page mx-auto flex items-center justify-between px-ds-06 py-ds-05">
    <a href="/" class="flex items-center gap-ds-03 group">
      <ChakraSvg size={28} class="text-accent-9 transition-transform duration-moderate-01 ease-productive-standard group-hover:rotate-[15deg]" />
      <span class="font-bold text-ds-xl text-surface-fg leading-none">गुरुकुल</span>
      <span class="font-medium text-ds-md text-surface-fg-subtle leading-none hidden sm:inline">Gurukul</span>
    </a>
    <a
      href="/about"
      class="text-ds-md font-medium text-surface-fg-subtle transition-colors duration-fast-01 ease-productive-standard hover:text-surface-fg"
    >
      About
    </a>
  </div>
</header>
```

**Step 3: Create Footer component**

The footer uses the DevalokGrain-inspired noise texture as a subtle background element.

```astro
---
// src/components/Footer.astro
import ChakraSvg from './ChakraSvg.astro';
---
<footer class="relative mt-ds-13 border-t border-surface-border-subtle">
  <!-- Subtle grain texture — Devalok signature -->
  <div
    class="absolute inset-0 pointer-events-none opacity-[0.06]"
    style="background-image: url(&quot;data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.45' numOctaves='3' seed='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23n)'/%3E%3C/svg%3E&quot;); background-size: 100px 100px; filter: contrast(250%) brightness(105%);"
    aria-hidden="true"
  ></div>
  <div class="relative max-w-page mx-auto px-ds-06 py-ds-10 flex flex-col items-center gap-ds-04 text-center">
    <p class="text-ds-md text-surface-fg-subtle">
      A <a href="https://devalok.in" class="text-accent-11 underline decoration-transparent hover:decoration-current underline-offset-2 transition-[color,text-decoration-color] duration-fast-01 ease-productive-standard hover:text-accent-12">Devalok</a> initiative
    </p>
    <ChakraSvg size={20} class="text-accent-9 opacity-40" />
  </div>
</footer>
```

**Step 4: Create BaseLayout**

```astro
---
// src/layouts/BaseLayout.astro
import Header from '../components/Header.astro';
import Footer from '../components/Footer.astro';
import '../styles/global.css';

interface Props {
  title: string;
  description: string;
  ogImage?: string;
  ogUrl?: string;
  article?: boolean;
}

const {
  title,
  description,
  ogImage = 'https://devalok-public-assets.s3.ap-south-1.amazonaws.com/brand/devalok/logos/monogram-wordmark-brand-1024.png',
  ogUrl = Astro.url.href,
  article = false,
} = Astro.props;

const fullTitle = title === 'Gurukul' ? 'Gurukul — Devalok' : `${title} — Gurukul`;
---
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <link rel="icon" type="image/svg+xml" href="/favicon.svg" />
  <link rel="alternate" type="application/rss+xml" title="Gurukul RSS" href="/rss.xml" />
  <link rel="canonical" href={ogUrl} />

  <title>{fullTitle}</title>
  <meta name="description" content={description} />

  <!-- Open Graph -->
  <meta property="og:type" content={article ? 'article' : 'website'} />
  <meta property="og:title" content={fullTitle} />
  <meta property="og:description" content={description} />
  <meta property="og:image" content={ogImage} />
  <meta property="og:url" content={ogUrl} />
  <meta property="og:site_name" content="Gurukul — Devalok" />

  <!-- Twitter -->
  <meta name="twitter:card" content="summary_large_image" />
  <meta name="twitter:title" content={fullTitle} />
  <meta name="twitter:description" content={description} />
  <meta name="twitter:image" content={ogImage} />

  <!-- Preload Inter -->
  <link rel="preload" href="/fonts/Inter-Variable.woff2" as="font" type="font/woff2" crossorigin />

  <slot name="head" />
</head>
<body class="min-h-screen flex flex-col font-sans">
  <Header />
  <main class="flex-1">
    <slot />
  </main>
  <Footer />
</body>
</html>
```

**Step 5: Create a minimal index page to verify**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Gurukul" description="Practical knowledge from the Devalok studio — for founders, designers, and builders.">
  <div class="max-w-page mx-auto px-ds-06 py-ds-10">
    <p class="text-surface-fg-muted">Site scaffold working.</p>
  </div>
</BaseLayout>
```

**Step 6: Verify dev server**

```bash
npm run dev
```

Visit http://localhost:4321 — should see header, scaffold text, footer with grain texture.

**Step 7: Commit**

```bash
git add -A
git commit -m "feat: add base layout, header, footer with Devalok grain texture"
```

---

## Task 4: Content Collection & Placeholder Guide

**Files:**
- Create: `src/content.config.ts`
- Create: `src/content/guides/non-dilutive-funding-guide.md`

**Step 1: Define content collection schema**

```typescript
// src/content.config.ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

const guides = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/guides' }),
  schema: z.object({
    title: z.string(),
    subtitle: z.string().optional(),
    description: z.string(),
    author: z.string().default('Mudit Baid'),
    authorRole: z.string().optional(),
    date: z.coerce.date(),
    updatedDate: z.coerce.date().optional(),
    readTime: z.string(),
    tags: z.array(z.string()).optional(),
    ogImage: z.string().optional(),
    draft: z.boolean().default(false),
  }),
});

export const collections = { guides };
```

**Step 2: Create placeholder guide**

Create `src/content/guides/non-dilutive-funding-guide.md` with full frontmatter and placeholder body that exercises all typography styles. The body should include:

- 3–4 sections with H2 headings (to test left-border accent)
- H3 sub-headings
- A blockquote (styled as a prompt example)
- A fenced code block (to test Shiki highlighting)
- An ordered list and an unordered list
- A callout/tip box using a custom `:::tip` syntax or HTML aside
- A horizontal rule
- Inline code and bold/italic text

(See full content in implementation — placeholder text clearly marked as "[PLACEHOLDER]".)

**Step 3: Verify collection loads**

```bash
npm run build
```

Expected: Build succeeds, collection is recognized.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: add guides content collection schema and placeholder guide"
```

---

## Task 5: Home Page — Guide Listing

**Files:**
- Create: `src/components/GuideEntry.astro`
- Modify: `src/pages/index.astro`

**Step 1: Create GuideEntry component**

```astro
---
// src/components/GuideEntry.astro
interface Props {
  title: string;
  subtitle?: string;
  description: string;
  date: Date;
  readTime: string;
  slug: string;
}

const { title, subtitle, description, date, readTime, slug } = Astro.props;

const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(date);
---
<a href={`/${slug}`} class="group block py-ds-08 border-b border-surface-border-subtle last:border-b-0">
  <article>
    <h2 class="font-semibold text-ds-xl text-surface-fg transition-colors duration-fast-01 ease-productive-standard group-hover:text-accent-11">
      {title}
    </h2>
    {(subtitle || description) && (
      <p class="mt-ds-02b text-ds-base text-surface-fg-muted leading-ds-relaxed">
        {subtitle || description}
      </p>
    )}
    <p class="mt-ds-03 text-ds-md font-medium text-surface-fg-subtle">
      {formattedDate}<span class="mx-ds-02b">·</span>{readTime}
    </p>
  </article>
</a>
```

**Step 2: Build the home page**

```astro
---
// src/pages/index.astro
import BaseLayout from '../layouts/BaseLayout.astro';
import GuideEntry from '../components/GuideEntry.astro';
import { getCollection } from 'astro:content';

const guides = (await getCollection('guides', ({ data }) => !data.draft))
  .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
---
<BaseLayout title="Gurukul" description="Practical knowledge from the Devalok studio — for founders, designers, and builders.">
  <div class="max-w-article mx-auto px-ds-06 pt-ds-12 pb-ds-10">
    <p class="text-ds-lg text-surface-fg-muted leading-ds-relaxed">
      Practical knowledge from the Devalok studio — for founders, designers, and builders.
    </p>
    <div class="mt-ds-10">
      {guides.length === 0 && (
        <p class="text-surface-fg-subtle text-ds-md">Guides coming soon.</p>
      )}
      {guides.map((guide) => (
        <GuideEntry
          title={guide.data.title}
          subtitle={guide.data.subtitle}
          description={guide.data.description}
          date={guide.data.date}
          readTime={guide.data.readTime}
          slug={guide.id}
        />
      ))}
    </div>
  </div>
</BaseLayout>
```

**Step 3: Verify**

```bash
npm run dev
```

Visit http://localhost:4321 — should see the placeholder guide listed with title, subtitle, date, read time. Hover should shift title to accent-11.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build home page with guide listing"
```

---

## Task 6: Article Prose Styles

**Files:**
- Create: `src/styles/prose.css`

This is the most critical file. All markdown article typography is defined here. Follows Shilp Sutra token patterns exactly.

**Step 1: Create prose.css**

```css
/* src/styles/prose.css */

/* ═══════════════════════════════════════════════════════════
   GURUKUL PROSE — Article typography
   Uses Shilp Sutra design tokens throughout.
   Applied via .prose-gurukul class on the article container.
   ═══════════════════════════════════════════════════════════ */

.prose-gurukul {
  font-size: 1.125rem;  /* 18px — P1 scale */
  line-height: 1.75;    /* Generous for reading */
  letter-spacing: 0.01em;
  color: var(--color-surface-fg);
}

/* ── Headings ──────────────────────────────────────────── */

.prose-gurukul h2 {
  font-size: var(--font-size-2xl);   /* 24px */
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  letter-spacing: -0.015em;
  color: var(--color-surface-fg);
  margin-top: 3rem;
  margin-bottom: 1rem;
  padding-left: 1rem;
  border-left: 3px solid var(--color-accent-9);
}

.prose-gurukul h3 {
  font-size: var(--font-size-xl);    /* 20px */
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-surface-fg);
  margin-top: 2rem;
  margin-bottom: 0.75rem;
}

.prose-gurukul h4 {
  font-size: var(--font-size-lg);    /* 18px */
  font-weight: var(--font-weight-semibold);
  line-height: var(--line-height-snug);
  color: var(--color-surface-fg);
  margin-top: 1.5rem;
  margin-bottom: 0.5rem;
}

/* ── Paragraphs ────────────────────────────────────────── */

.prose-gurukul p {
  margin-bottom: 1.25rem;
}

/* ── Links (Shilp Sutra Link pattern) ──────────────────── */

.prose-gurukul a {
  color: var(--color-accent-11);
  text-underline-offset: 2px;
  text-decoration: underline;
  text-decoration-color: transparent;
  transition: color var(--duration-fast-01) var(--ease-productive-standard),
              text-decoration-color var(--duration-fast-01) var(--ease-productive-standard);
}
.prose-gurukul a:hover {
  color: var(--color-accent-12);
  text-decoration-color: currentColor;
}

/* ── Strong & Emphasis ─────────────────────────────────── */

.prose-gurukul strong {
  font-weight: var(--font-weight-semibold);
  color: var(--color-surface-fg);
}

.prose-gurukul em {
  font-style: italic;
}

/* ── Blockquotes ───────────────────────────────────────── */

.prose-gurukul blockquote {
  border-left: 3px solid var(--color-accent-9);
  background-color: var(--color-accent-2);
  padding: var(--spacing-05) var(--spacing-06);
  margin: 1.5rem 0;
  border-radius: 0 var(--radius-md) var(--radius-md) 0;
}
.prose-gurukul blockquote p {
  font-size: var(--font-size-base);  /* 16px — slightly smaller */
  color: var(--color-surface-fg-muted);
  margin-bottom: 0;
}
.prose-gurukul blockquote p + p {
  margin-top: 0.75rem;
}

/* ── Lists ─────────────────────────────────────────────── */

.prose-gurukul ul {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.prose-gurukul ol {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 1.25rem;
}
.prose-gurukul li {
  margin-bottom: 0.5rem;
  padding-left: 0.25rem;
}
.prose-gurukul li::marker {
  color: var(--color-accent-11);
}

/* ── Code — Inline (Shilp Sutra Code inline pattern) ──── */

.prose-gurukul :not(pre) > code {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  background-color: var(--color-accent-2);
  color: var(--color-accent-11);
  border: 1px solid var(--color-accent-5);
  border-radius: var(--radius-sm);
  padding: 0.125rem 0.375rem;
}

/* ── Code — Block (rendered by Shiki via Astro) ────────── */

.prose-gurukul pre {
  font-family: var(--font-mono);
  font-size: var(--font-size-sm);
  line-height: var(--line-height-relaxed);
  border-radius: var(--radius-md);
  border: 1px solid var(--color-surface-border-strong);
  padding: var(--spacing-05);
  margin: 1.5rem 0;
  overflow-x: auto;
}
.prose-gurukul pre code {
  background: none;
  border: none;
  padding: 0;
  font-size: inherit;
  color: inherit;
}

/* ── Horizontal Rule ───────────────────────────────────── */

.prose-gurukul hr {
  border: none;
  height: 1px;
  background: linear-gradient(
    90deg,
    transparent,
    var(--color-accent-5) 15%,
    var(--color-accent-5) 85%,
    transparent
  );
  margin: 2.5rem 0;
}

/* ── Images ────────────────────────────────────────────── */

.prose-gurukul img {
  max-width: 100%;
  height: auto;
  border-radius: var(--radius-md);
  border: 1px solid var(--color-surface-border);
  margin: 1.5rem 0;
}

/* ── Tables ────────────────────────────────────────────── */

.prose-gurukul table {
  width: 100%;
  border-collapse: collapse;
  margin: 1.5rem 0;
  font-size: var(--font-size-base);
}
.prose-gurukul th {
  font-weight: var(--font-weight-semibold);
  text-align: left;
  padding: var(--spacing-03) var(--spacing-04);
  border-bottom: 2px solid var(--color-surface-border-strong);
}
.prose-gurukul td {
  padding: var(--spacing-03) var(--spacing-04);
  border-bottom: 1px solid var(--color-surface-border-subtle);
}

/* ── Callout Box ───────────────────────────────────────── */
/* Usage in markdown: wrap content in <aside class="callout"> */

.prose-gurukul .callout {
  border-left: 3px solid var(--color-accent-9);
  background-color: var(--color-accent-2);
  border-radius: 0 var(--radius-lg) var(--radius-lg) 0;
  padding: var(--spacing-05) var(--spacing-06);
  margin: 1.5rem 0;
}
.prose-gurukul .callout p:last-child {
  margin-bottom: 0;
}
.prose-gurukul .callout strong:first-child {
  color: var(--color-accent-11);
  display: block;
  margin-bottom: var(--spacing-02);
}

/* ── First paragraph after H2 — no extra top margin ───── */
.prose-gurukul h2 + p,
.prose-gurukul h3 + p,
.prose-gurukul h4 + p {
  margin-top: 0;
}
```

**Step 2: Import prose.css in global.css**

Add to the end of `src/styles/global.css`:

```css
@import './prose.css';
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add prose typography styles using Shilp Sutra tokens"
```

---

## Task 7: Article Page with Table of Contents

**Files:**
- Create: `src/components/TableOfContents.astro`
- Create: `src/pages/[...slug].astro`

**Step 1: Create TableOfContents component**

```astro
---
// src/components/TableOfContents.astro
interface Heading {
  depth: number;
  slug: string;
  text: string;
}

interface Props {
  headings: Heading[];
}

const { headings } = Astro.props;
const tocHeadings = headings.filter(h => h.depth === 2 || h.depth === 3);
---
{tocHeadings.length > 0 && (
  <>
    {/* Desktop: sticky sidebar */}
    <nav class="hidden xl:block" aria-label="Table of contents">
      <div class="sticky top-ds-10">
        <p class="text-ds-sm font-semibold text-surface-fg-subtle uppercase tracking-ds-wider mb-ds-04">Contents</p>
        <ul class="space-y-ds-02b">
          {tocHeadings.map((h) => (
            <li>
              <a
                href={`#${h.slug}`}
                class:list={[
                  'block text-ds-sm leading-ds-relaxed transition-colors duration-fast-01 ease-productive-standard',
                  'text-surface-fg-subtle hover:text-accent-11',
                  h.depth === 3 && 'pl-ds-04',
                ]}
              >
                {h.text}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>

    {/* Mobile: collapsible */}
    <details class="xl:hidden mb-ds-08 border border-surface-border-subtle rounded-ds-md">
      <summary class="cursor-pointer px-ds-05 py-ds-04 text-ds-sm font-semibold text-surface-fg-subtle select-none">
        Contents
      </summary>
      <ul class="px-ds-05 pb-ds-04 space-y-ds-02b">
        {tocHeadings.map((h) => (
          <li>
            <a
              href={`#${h.slug}`}
              class:list={[
                'block text-ds-sm leading-ds-relaxed text-surface-fg-subtle hover:text-accent-11 transition-colors duration-fast-01 ease-productive-standard',
                h.depth === 3 && 'pl-ds-04',
              ]}
            >
              {h.text}
            </a>
          </li>
        ))}
      </ul>
    </details>
  </>
)}
```

**Step 2: Create the article page**

```astro
---
// src/pages/[...slug].astro
import BaseLayout from '../layouts/BaseLayout.astro';
import TableOfContents from '../components/TableOfContents.astro';
import { getCollection, render } from 'astro:content';

export async function getStaticPaths() {
  const guides = await getCollection('guides');
  return guides.map((guide) => ({
    params: { slug: guide.id },
    props: { guide },
  }));
}

const { guide } = Astro.props;
const { Content, headings } = await render(guide);

const formattedDate = new Intl.DateTimeFormat('en-US', {
  year: 'numeric',
  month: 'long',
  day: 'numeric',
}).format(guide.data.date);

const jsonLd = {
  '@context': 'https://schema.org',
  '@type': 'Article',
  headline: guide.data.title,
  description: guide.data.description,
  datePublished: guide.data.date.toISOString(),
  ...(guide.data.updatedDate && { dateModified: guide.data.updatedDate.toISOString() }),
  author: {
    '@type': 'Person',
    name: guide.data.author,
  },
  publisher: {
    '@type': 'Organization',
    name: 'Devalok Design and Strategy Studio',
    url: 'https://devalok.in',
  },
};
---
<BaseLayout
  title={guide.data.title}
  description={guide.data.description}
  ogImage={guide.data.ogImage}
  article={true}
>
  <script type="application/ld+json" set:html={JSON.stringify(jsonLd)} slot="head" />

  <div class="max-w-page mx-auto px-ds-06 pt-ds-08 pb-ds-13">
    <!-- Back link -->
    <a
      href="/"
      class="inline-flex items-center gap-ds-02 text-ds-md font-medium text-accent-11 underline decoration-transparent underline-offset-2 hover:decoration-current transition-[text-decoration-color] duration-fast-01 ease-productive-standard"
    >
      ← Back to Gurukul
    </a>

    <!-- Article header -->
    <header class="mt-ds-08 max-w-article">
      <h1 class="font-bold text-ds-4xl text-surface-fg leading-ds-tight tracking-ds-tight">
        {guide.data.title}
      </h1>
      {guide.data.subtitle && (
        <p class="mt-ds-04 text-ds-xl text-surface-fg-muted leading-ds-relaxed">
          {guide.data.subtitle}
        </p>
      )}
      <p class="mt-ds-05 text-ds-md font-medium text-surface-fg-subtle">
        {guide.data.author}
        {guide.data.authorRole && (
          <span class="text-surface-fg-subtle"> · {guide.data.authorRole}</span>
        )}
        <span class="mx-ds-02b">·</span>
        {formattedDate}
        <span class="mx-ds-02b">·</span>
        {guide.data.readTime}
      </p>
      <div class="mt-ds-06 h-[1px] bg-surface-border-subtle"></div>
    </header>

    <!-- Content area with ToC sidebar -->
    <div class="mt-ds-08 flex gap-ds-10">
      <article class="prose-gurukul max-w-article min-w-0 flex-1">
        <Content />
      </article>
      <aside class="w-56 shrink-0 hidden xl:block">
        <TableOfContents headings={headings} />
      </aside>
    </div>

    <!-- Mobile ToC (before content on mobile, handled by component) -->

    <!-- Back to guides -->
    <div class="mt-ds-13 max-w-article">
      <div class="h-[1px] bg-surface-border-subtle mb-ds-06"></div>
      <a
        href="/"
        class="text-ds-md font-medium text-accent-11 underline decoration-transparent underline-offset-2 hover:decoration-current transition-[text-decoration-color] duration-fast-01 ease-productive-standard"
      >
        ← More guides
      </a>
    </div>
  </div>
</BaseLayout>
```

Note: The mobile ToC is inside TableOfContents.astro. For mobile, we need to place it BEFORE the article content. Adjust the page to render the mobile ToC above the article:

The `[...slug].astro` page should include the mobile ToC above the article content area. The `TableOfContents` component renders both desktop (hidden on mobile) and mobile (hidden on desktop) variants. Place a second `<TableOfContents>` call for mobile ABOVE the flex container, or restructure so that mobile ToC comes before the content. The simplest approach: render the mobile ToC from `TableOfContents` once, positioned above the article block on mobile only, and the desktop ToC in the sidebar.

Revised approach — render one `TableOfContents` that handles both:
- Move the mobile `<details>` version above the `<article>` in the page
- Keep the desktop sidebar version in the aside

Better: split into two render points in the page template. The component already handles `xl:hidden` and `hidden xl:block` visibility.

**Step 3: Verify**

```bash
npm run dev
```

Visit http://localhost:4321/non-dilutive-funding-guide — should see article with all typography, ToC on desktop sidebar, collapsible on mobile.

**Step 4: Commit**

```bash
git add -A
git commit -m "feat: build article page with table of contents and JSON-LD"
```

---

## Task 8: About Page

**Files:**
- Create: `src/pages/about.astro`

**Step 1: Create about page**

Written in authentic Devalok voice. No generic placeholder.

```astro
---
// src/pages/about.astro
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="About" description="Gurukul is Devalok's open knowledge hub — practical guides for founders, designers, and builders.">
  <div class="max-w-article mx-auto px-ds-06 pt-ds-12 pb-ds-10">
    <h1 class="font-bold text-ds-4xl text-surface-fg leading-ds-tight tracking-ds-tight">
      About गुरुकुल
    </h1>

    <div class="mt-ds-08 space-y-6 text-ds-lg leading-[1.75] text-surface-fg-muted">
      <p>
        <strong class="text-surface-fg font-semibold">गुरुकुल</strong> — the traditional place of learning, where knowledge passes directly from those who practice to those who seek.
      </p>
      <p>
        Devalok's Gurukul is that space, made open. We publish what we know — about building brands, raising capital without dilution, designing systems that hold up, and the business of creative work.
      </p>
      <p>
        We don't separate design from strategy, or craft from commerce. A designer who doesn't understand funding is incomplete. A founder who can't think in systems will build something fragile. Gurukul exists because these disciplines are one discipline.
      </p>
      <p>
        Everything here is free to read, share, and use.
      </p>
    </div>

    <div class="mt-ds-12 h-[1px] bg-surface-border-subtle"></div>

    <p class="mt-ds-06 text-ds-md text-surface-fg-subtle">
      Gurukul is built and maintained by <a href="https://devalok.in" class="text-accent-11 underline decoration-transparent hover:decoration-current underline-offset-2 transition-[color,text-decoration-color] duration-fast-01 ease-productive-standard hover:text-accent-12">Devalok Design and Strategy Studio</a>.
    </p>
  </div>
</BaseLayout>
```

**Step 2: Commit**

```bash
git add -A
git commit -m "feat: add about page"
```

---

## Task 9: RSS Feed

**Files:**
- Create: `src/pages/rss.xml.ts`

**Step 1: Install RSS package**

```bash
npm install @astrojs/rss
```

**Step 2: Create RSS feed**

```typescript
// src/pages/rss.xml.ts
import rss from '@astrojs/rss';
import { getCollection } from 'astro:content';
import type { APIContext } from 'astro';

export async function GET(context: APIContext) {
  const guides = (await getCollection('guides', ({ data }) => !data.draft))
    .sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());

  return rss({
    title: 'Gurukul — Devalok',
    description: 'Practical knowledge from the Devalok studio — for founders, designers, and builders.',
    site: context.site!,
    items: guides.map((guide) => ({
      title: guide.data.title,
      description: guide.data.description,
      pubDate: guide.data.date,
      link: `/${guide.id}/`,
    })),
  });
}
```

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add RSS feed"
```

---

## Task 10: Placeholder Guide Content

**Files:**
- Create: `src/content/guides/non-dilutive-funding-guide.md`

Write the full placeholder guide body exercising all typography:
- Frontmatter as specified in the prompt
- 3–4 H2 sections with the accent left-border
- H3 sub-sections
- Blockquote styled as a prompt example
- Fenced code block with a language tag (for Shiki)
- Ordered and unordered lists
- A callout box using `<aside class="callout">`
- Horizontal rule
- Inline code, bold, italic, links
- Clear `[PLACEHOLDER]` markers

**Step 1: Write the guide content**

(Full markdown content provided in implementation — this is the longest individual file.)

**Step 2: Verify all typography**

```bash
npm run dev
```

Visit the guide page. Check:
- [ ] H2s have left pink border
- [ ] H3s are smaller, no border
- [ ] Blockquote has pink left border + light pink bg
- [ ] Code block has dark bg with syntax highlighting
- [ ] Inline code has pink bg + pink text
- [ ] Lists have pink markers
- [ ] Callout box renders correctly
- [ ] HR is a subtle gradient line
- [ ] Links are accent-11, underline on hover

**Step 3: Commit**

```bash
git add -A
git commit -m "feat: add placeholder guide with full typography showcase"
```

---

## Task 11: Final Build Verification & README

**Files:**
- Modify: `README.md`

**Step 1: Run production build**

```bash
npm run build
```

Expected: Clean build with no errors. Output in `dist/`.

**Step 2: Preview production build**

```bash
npm run preview
```

Check all pages, navigation, typography.

**Step 3: Write README**

```markdown
# Gurukul (गुरुकुल)

Devalok's open knowledge hub. Practical guides for founders, designers, and builders.

**Live:** [gurukul.devalok.in](https://gurukul.devalok.in)

## Run Locally

\`\`\`bash
npm install
npm run dev
\`\`\`

Opens at http://localhost:4321

## Add a New Guide

1. Create a new `.md` file in `src/content/guides/`
2. Add the required frontmatter:

\`\`\`yaml
---
title: "Your Guide Title"
description: "SEO description"
author: "Author Name"
date: 2026-04-01
readTime: "8 min read"
---
\`\`\`

3. Write your content in markdown
4. Use `<aside class="callout">` for tip/callout boxes
5. Commit and push — Vercel deploys automatically

## Deploy

Configured for Vercel. Push to `main` to deploy.

\`\`\`bash
npm run build  # generates static site in dist/
\`\`\`

## Tech Stack

- [Astro](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [@devalok/shilp-sutra](https://www.npmjs.com/package/@devalok/shilp-sutra) — Devalok design tokens & Tailwind preset
- Shiki — syntax highlighting (built into Astro)

## Brand

This is a Devalok product. Design tokens, colors, and typography come from Śilpa Sūtra (शिल्प सूत्र), Devalok's design system.
```

**Step 4: Final commit and push**

```bash
git add -A
git commit -m "docs: add README with setup and guide instructions"
git push origin main
```

---

## Summary

| Task | What | Files |
|------|------|-------|
| 1 | Scaffold Astro + Tailwind + Shilp Sutra | package.json, astro.config, tailwind.config, tsconfig, vercel.json |
| 2 | Fonts, global styles, favicon | global.css, public/fonts/*, favicon.svg |
| 3 | Base layout, header, footer | BaseLayout, Header, Footer, ChakraSvg |
| 4 | Content collection schema | content.config.ts |
| 5 | Home page with guide listing | index.astro, GuideEntry |
| 6 | Article prose typography | prose.css |
| 7 | Article page + ToC | [...slug].astro, TableOfContents |
| 8 | About page | about.astro |
| 9 | RSS feed | rss.xml.ts |
| 10 | Placeholder guide content | non-dilutive-funding-guide.md |
| 11 | Build verification + README | README.md |
