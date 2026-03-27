# AGENTS.md — Coding Agent Instructions

## Project Overview

Next.js 12 portfolio site (Pages Router) using JavaScript (no TypeScript). Content is managed via Notion API as a headless CMS. Hosted on Vercel.

## Build / Dev / Lint Commands

```bash
npm run dev       # Start dev server (localhost:3000)
npm run build     # Production build
npm run start     # Start production server
npm run lint      # ESLint (next/core-web-vitals rules)
```

- No test framework is configured. There are no test files.
- No TypeScript — do not add `.ts`/`.tsx` files or `tsconfig.json`.
- No Prettier — formatting is manual; match existing style.

## Tech Stack

- **Framework:** Next.js 12.1.5 (Pages Router, NOT App Router)
- **UI:** React 18, Radix UI primitives (Dialog, Popover, Tooltip, Checkbox), Lucide React icons
- **Styling:** CSS Modules (`.module.css`), no Tailwind. Shared utilities in `styles/util.module.css`, globals in `styles/globals.css`.
- **Animation:** Framer Motion
- **CMS:** Notion API (`@notionhq/client`) — helpers in `lib/notion-portfolio.js`
- **Other:** next-themes (dark/light), react-hot-toast, remark (markdown)

## Directory Layout

```
pages/          # Next.js pages (index.js, about.js, projects.js, writing/, vibe-coding/, projects/)
components/     # React components (tiles/, theme.js, menu.js, navLink.js, etc.)
lib/            # Utilities (notion-portfolio.js, posts.js, scroll.js, imageUtil.js)
styles/         # CSS Modules (globals.css, util.module.css, per-component modules)
scripts/        # Node scripts (notion/sync-assets.js)
public/         # Static assets, fonts, project images
posts/          # Markdown blog posts
docs/           # Notion template schema docs
```

## Code Style Guidelines

### Language & Syntax

- Write plain JavaScript (ES2020+). No TypeScript annotations.
- Use arrow functions for components and most callbacks.
- Use `export default` at the bottom of page files; named exports for shared components (`export const ThemeChanger = () => { ... }`).
- Prefer functional components with React Hooks (`useState`, `useEffect`, `useTheme`, `useRouter`).
- Data fetching: use `getStaticProps` / `getStaticPaths` in page files.

### Imports

Order imports in this grouping (blank line between groups):

1. Next.js imports (`next/head`, `next/link`, `next/router`)
2. React imports (`React`, `{ useEffect, useState }`)
3. External libraries (`framer-motion`, `lucide-react`, `@notionhq/client`)
4. Local modules (`../lib/notion-portfolio`, `../components/...`)
5. CSS Modules (styles from `.module.css` files)

Use named imports from libraries: `import { motion, AnimatePresence } from "framer-motion"`.

### Naming Conventions

| What | Convention | Example |
|------|-----------|---------|
| Files | camelCase or kebab-case | `theme.js`, `notion-portfolio.js`, `navLink.js` |
| Components | PascalCase | `ThemeChanger`, `ContentCard`, `NotionBlockRenderer` |
| Functions | camelCase | `getTitle()`, `getRichText()`, `slugify()` |
| Variables | camelCase | `updatesList`, `writingList`, `isLightChecked` |
| CSS classes | camelCase (modules) | `util.page`, `styles.heroContainer` |

### Styling

- Use CSS Modules exclusively. Import as `styles from "./foo.module.css"`.
- Compose classes with template literals or string concatenation: `` className={`${util.page} ${styles.container}`} ``
- Shared utility classes live in `styles/util.module.css` — reuse them across pages.
- CSS custom properties (`var(--bg)`, `var(--text-primary)`) for theming via next-themes.
- Do not introduce Tailwind CSS.

### Error Handling

- Use optional chaining (`?.`) and nullish coalescing for data access.
- Return safe defaults (empty string `""`, empty array `[]`) from Notion helpers.
- No try/catch in components; let errors surface to Next.js error boundaries.
- API route errors: return `{ notFound: true }` from `getStaticProps` when data is missing.

### General Patterns

- Use double quotes for strings (match existing code).
- Indentation: 2 spaces.
- Trailing semicolons are used.
- Keep components small and focused — one component per file.
- CSS Module files live alongside their component (e.g., `theme.js` + `theme.module.css`).
- Page-specific modules go in the `pages/` directory (e.g., `pages/index.module.css`).

### Working with Notion Data

- All Notion helpers are in `lib/notion-portfolio.js` — use `getTitle()`, `getRichText()`, `getCheckbox()`, `getSelect()`, `getDate()`, `getNumber()`, `getUrl()`, `getFiles()`.
- Database IDs are resolved via `getDatabaseId("key")` using the map in `lib/notion-asset-map.js`.
- Property names in Notion are case-sensitive strings passed as the `key` parameter.
