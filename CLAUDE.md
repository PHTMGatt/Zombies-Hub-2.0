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
- CSS for hub legacy styles and all seven maps is auto-scoped by `postcss.config.js` (`.origins-module`, `.mob-module`, `.de-module`, …); `scripts/css-scope.test.mjs` fails if a map is missing. Origins and Shadows of Evil were hand-scoped and never leaked; they are now enforced too (adding them left the built CSS byte-identical). `shared/guide/guide.css` is deliberately global.
- `verify.mjs` rejects root-relative `/src` or `/images` asset paths; import assets instead.
- Do not edit `package-lock.json`, `render.yaml`, `.github/workflows/`, or `.env*` during UI work.
- Write screenshots and scratch output to `artifacts/` (gitignored), not `shots/`.

## Tooling: one job per tool

Policy: one taste skill per phase. Discover broadly, invoke selectively. Do not install plugins merely because they exist. The plugin set is frozen; changes need explicit approval.

- **frontend-design** is the only design/taste skill during the redesign. Invoke it for UI work. Explicit project requirements override its defaults. Per-map identity is required; do not force one aesthetic across maps. Zombies-style all-caps labels and map accent colours are allowed where intentional. Origins is the usability reference, Revelations the visual reference.
- **Shared design language does NOT mean shared information architecture.** Each map may need a different guide structure based on its Easter Egg mechanics; do not force one page structure onto every map.
- **Superpowers**: use `brainstorming`, `writing-plans`, `executing-plans`, `verification-before-completion`, `systematic-debugging`. Do not use its worktree, branch-finishing, or code-review skills.
- **Review**: built-in `/code-review` after meaningful passes. Impeccable is a later, separate critique pass, never alongside frontend-design.
- **Playwright MCP** is the primary visual/browser verification tool (`.mcp.json`, local Chromium; override the path with `ZH_CHROMIUM_PATH` off the cloud image). UI changes are not done until checked in the rendered app at 1440 desktop, 390 portrait phone, and 844×390 landscape phone: navigation, horizontal overflow, tap targets, readability, with screenshots reviewed.

Reserved or skipped (not installed):

- **Impeccable**: later independent critique/polish phase only.
- **Taste Skill** (`Leonxlnx/taste-skill`): alternative to frontend-design only if frontend-design proves inadequate after real use. Never stack the two.
- **designlang / extract-design-system**: possible one-time design-system audit later; not needed to start.
- **React Bits, GSAP Skills, Transitions.dev**: skip. Glanceability and gameplay usability beat animation and component spectacle.

## Running the browser smokes in the cloud container

The repo pins Playwright 1.59 (Chromium build 1217); the cloud image ships build 1243 at `/opt/pw-browsers`. Do not run `playwright install`. Point Playwright at a link folder instead:

```bash
mkdir -p /tmp/pw-shim
ln -sfn /opt/pw-browsers/chromium_headless_shell-1243 /tmp/pw-shim/chromium_headless_shell-1217
ln -sfn /opt/pw-browsers/chromium-1243 /tmp/pw-shim/chromium-1217
ln -sfn /opt/pw-browsers/ffmpeg-1011 /tmp/pw-shim/ffmpeg-1011
PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-shim npm run test:browser
```
