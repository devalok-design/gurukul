# Gurukul (गुरुकुल)

Devalok's open knowledge hub. Practical guides for founders, designers, and builders.

**Live:** [gurukul.devalok.in](https://gurukul.devalok.in)

## Run Locally

```bash
npm install
npm run dev
```

Opens at http://localhost:3000

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
5. Commit and push — Railway deploys automatically

## Deploy

Railway (Railpack auto-detects Next). Push to `main` to deploy.

```bash
npm run build    # next build — output in .next/
npm start        # serve the build locally
```

## Tech Stack

- [Next.js 16](https://nextjs.org) — App Router, all pages statically pre-rendered
- [Tailwind CSS](https://tailwindcss.com) — utility-first CSS
- [@devalok/shilp-sutra](https://www.npmjs.com/package/@devalok/shilp-sutra) — Devalok design tokens (token source only, no JS preset)
- [rehype-pretty-code](https://www.npmjs.com/package/rehype-pretty-code) — syntax highlighting (Shiki engine)

## Brand

This is a Devalok product. Design tokens, colors, typography, and spacing come from Shilp Sutra (शिल्प सूत्र), Devalok's design system.
