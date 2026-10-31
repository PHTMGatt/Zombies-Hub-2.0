# Zombies Hub 2.0

Second-screen Call of Duty Zombies Easter Egg guide: glance, understand, keep playing. React 19 + Vite 6 + React Router 7 static SPA, Node 22, deployed to Render from `main` (a merge to `main` is a production deploy).

## Layout

- `apps/hub/` – Hub shell, map catalog, Easter Egg / Side EE pages
- `maps/<map>/` – seven dedicated guides: origins, mob-of-the-dead, shadows-of-evil, der-eisendrache, zetsubou-no-shima, gorod-krovi, revelations
- `shared/` – guide components, layout, search, achievements, shared data
- `scripts/` – source verification, unit tests (`*.test.mjs`), Playwright browser smokes (`*-browser-smoke.mjs`)
- `docs/polish-roadmap.md` – product and design direction; read it before any UI work

## Commands

- `npm test` – unit and guide-health tests
- `npm run check` – source verification (`scripts/verify.mjs`)
- `npm run build` – check + production compile
- `npm run test:browser` – Playwright smokes at 390 and 1440; needs `npm run preview -- --host 127.0.0.1 --port 4173` running

## Rules

- Work on `claude-forge` only. Do not create branches or worktrees. `enforce-branch-policy.yml` keeps only `main`, `chatgpt-forge`, `claude-forge`.
- Never fabricate Easter Egg steps or game facts. Redesign changes presentation, not guide content; do not drop or reorder steps, codes, solver data, or timestamps.
- CSS for hub legacy styles and most maps is auto-scoped by `postcss.config.js` (`.mob-module`, `.de-module`, …). Origins and Shadows of Evil are NOT in that list: their CSS is global, so check for leaks when restyling them.
- `verify.mjs` rejects root-relative `/src` or `/images` asset paths; import assets instead.
- Do not edit `package-lock.json`, `render.yaml`, `.github/workflows/`, or `.env*` during UI work.
- Write screenshots and scratch output to `artifacts/` (gitignored), not `shots/`.

## Tooling: one job per tool

- **frontend-design** is the only design/taste skill during the redesign. Invoke it for UI work. The explicit project brief overrides its defaults. Per-map identity is required; do not force one aesthetic across maps. Zombies-style all-caps labels and map accent colours are allowed where intentional. Origins is the usability reference, Revelations the visual reference.
- **Superpowers**: use `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `systematic-debugging`. Do not use its worktree, branch-finishing, or code-review skills.
- **Review**: built-in `/code-review` after meaningful passes. Impeccable is a later, separate critique pass, never alongside frontend-design.
- **Playwright MCP** (`.mcp.json`, local Chromium; override the path with `ZH_CHROMIUM_PATH` off the cloud image). UI changes are not done until checked in the rendered app at 1440 desktop, 390 portrait phone, and 844×390 landscape phone: navigation, horizontal overflow, tap targets, readability, with screenshots reviewed.
