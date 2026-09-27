# Brick Breaker

A small, complete bilingual Breakout-style browser game. The root route is the game; score and lives are held only in memory. No accounts, database, external analytics or background jobs.

**Read `DESIGN.md` before changing a screen or component. Colours, type, spacing and radius come from its tokens, not hardcoded component values.**

## Stack and commands

Next.js App Router · TypeScript · Tailwind · shadcn/ui. `npm run dev`, `npm run lint`, `npm run build`, `npm run start`.

## Conventions

- Game physics and rules live in `src/lib/game.ts`; React handles the controls and status display; canvas draws the board.
- Keep all visitor-facing strings in the Italian/English translations in `src/lib/i18n.ts`.
- The app is public and intentionally indexable. `APP_URL` sets the absolute origin for canonical URLs, sitemap and previews when deployed.
- Do not add accounts, persistence, analytics, payments or agent integration unless requested. Preserve the project-level `opencode.json` and `.agents/skills`.

<!-- BEGIN:nextjs-agent-rules -->

# This is NOT the Next.js you know

This version has breaking changes — APIs, conventions, and file structure may all differ from your training data. Read the relevant guide in `node_modules/next/dist/docs/` (resolved from this file's directory; in monorepos the `next` package may not be visible from the repo root) before writing any code. Heed deprecation notices.

This block is written and re-added by `next dev` — verify at `node_modules/next/dist/server/lib/generate-agent-files.js`. Removing it from a diff only re-creates the uncommitted change; committing it with your work keeps the tree clean.

<!-- END:nextjs-agent-rules -->
