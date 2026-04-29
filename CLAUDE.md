# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Commands

```bash
npm run dev          # dev server at http://localhost:8080
npm run build        # Vite build + post-build static meta generation
npm run preview      # serve the dist/ output locally
npm run lint         # ESLint
npm run test         # run tests once (vitest)
npm run test:watch   # vitest in watch mode
```

## Architecture

Personal developer portfolio and blog — a React SPA deployed to GitHub Pages.

### Routing

`src/App.tsx` defines all routes with React Router. Every page is lazy-loaded:

| Route | Page |
|---|---|
| `/` | `pages/Index.tsx` |
| `/posts` | `pages/Posts.tsx` |
| `/posts/:slug` | `pages/Post.tsx` |
| `/projects` | `pages/Projects.tsx` |
| `/projects/:slug` | `pages/Project.tsx` |

### Content pipeline

All content lives in Markdown files under `/content/`:
- `content/posts/*.md` — blog posts
- `content/projects/*.md` — portfolio projects

At build time, Vite ingests these via `import.meta.glob(".../*.md", { eager: true, query: "?raw" })`. The data modules (`src/data/posts.ts`, `src/data/projects.ts`) parse frontmatter with a hand-rolled parser (no external YAML library) and export typed arrays sorted by date descending.

To add a post or project, create a new `.md` file in the appropriate directory — no code changes needed.

### Post frontmatter fields

```yaml
---
title: "..."
date: "YYYY-MM-DD"
summary: "..."
tags: ["Tag1", "Tag2"]
---
```

### Project frontmatter fields

```yaml
---
title: "..."
date: "YYYY-MM-DD"
summary: "..."
tags: ["Tag1"]
type: "Plugin"           # or "Game", etc.
cover: "https://..."     # OG image URL
company: ""
companyWebsite: ""
teamSize: ""
period: ""
github: "https://..."
steam: ""
epicGamesStore: ""
website: ""
video: ""
videoDescription: ""
---
```

### Markdown rendering

`src/components/MarkdownRenderer.tsx` uses `react-markdown` + `rehype-highlight` (Tokyo Night Dark theme) + `rehype-raw`.

Custom extensions:
- **Titled code blocks**: ` ```cpp:Filename.h ` — renders a header bar with language and filename.
- **Callout blocks**: GitHub-style blockquotes with `[!NOTE]`, `[!TIP]`, `[!WARNING]`, `[!CAUTION]`, `[!COMMENT]` as the first line.

### Static meta / GitHub Pages

`npm run build` runs `scripts/generate-static-meta.js` after Vite. This script:
1. Reads every `.md` file in `content/` and generates a static `dist/<route>/index.html` with correct OG/Twitter tags (so social crawlers get per-page previews).
2. Copies `dist/index.html` → `dist/404.html` to support SPA client-side routing on GitHub Pages.

The `index.html` at the repo root contains the base OG/Twitter meta placeholders that this script replaces.

### Path alias

`@` resolves to `src/` (configured in `vite.config.ts`).
