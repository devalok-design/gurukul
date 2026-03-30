# Gurukul (गुरुकुल)

Devalok's open knowledge hub. Practical guides for founders, designers, and builders.

**Live:** [gurukul.devalok.in](https://gurukul.devalok.in)

## Run Locally

```bash
npm install
npm run dev
```

Opens at http://localhost:4321

## Add a New Guide

1. Create a new `.md` file in `src/content/guides/`
2. Add the required frontmatter:

```yaml
---
title: "Your Guide Title"
subtitle: "Optional subtitle"
description: "SEO description — shows in search results and social previews"
author: "Author Name"
authorRole: "Optional role"
date: 2026-04-01
readTime: "8 min read"
tags: ["optional", "tags"]
draft: false
---
```

3. Write your content in markdown
4. Use `<aside class="callout"><strong>Tip:</strong> Your content</aside>` for callout boxes
5. Commit and push — Vercel deploys automatically

## Deploy

Configured for Vercel. Push to `main` to deploy.

```bash
npm run build    # generates static site in dist/
npm run preview  # preview the build locally
```

## Tech Stack

- [Astro](https://astro.build) — static site generator
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [@devalok/shilp-sutra](https://www.npmjs.com/package/@devalok/shilp-sutra) — Devalok design tokens and Tailwind preset
- [Shiki](https://shiki.style) — syntax highlighting (built into Astro)

## Brand

This is a Devalok product. Design tokens, colors, typography, and spacing come from Shilp Sutra (शिल्प सूत्र), Devalok's design system.
