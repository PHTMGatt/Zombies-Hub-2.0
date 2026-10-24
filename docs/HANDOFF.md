# Handoff — claude/quick-guide-polish

Updated 2026-10-24.

## Branch state
- **Branch:** `claude/quick-guide-polish`, renamed from `ui/quick-guide-polish`. It tracks `origin/claude/quick-guide-polish`.
- **Pushed HEAD before this handoff commit:** `9125871` "Add npm lockfile and visual design plan". Local and remote were identical (0 ahead / 0 behind).
- **`origin/ui/quick-guide-polish`:** still at `6c94317`, an ancestor of this branch. Nothing is missing from it. Leave it; delete it later only if you want.
- **`origin/staging/zombies-polish`:** also still at `6c94317`.
- **`origin/main` has moved on separately:** it's at `6f95a66`, and this branch is 3 ahead / 135 behind it (merge-base `f1619a6`). Main contains a parallel redesign (cinematic landing, map search, new map cards, new footer, favicon). It does **not** contain GuideRun (`shared/ui/GuideRun.*`), `MapChrome.css` or the run-sheet main guides, and it has its own `package-lock.json`.
  Expect conflicts when integrating: `apps/hub/src/app/App.jsx`, all seven `maps/*/routes/*Routes.jsx`, `package.json` and `package-lock.json`, and `shared/ui/*`. Resolve this on `staging/zombies-polish`, not on `main`.

## Complete
- Phone-first GuideRun run sheets for all seven dedicated maps (commit `78a1831`), plus the Global.css casing fix (`6c94317`).
- npm lockfile and `docs/DESIGN-PLAN.md` (`9125871`).

## Stage 0a — lazy-load dedicated map routes: implemented, NOT committed
The working tree has the change (left uncommitted on purpose):
- `apps/hub/src/app/AppRoutes.jsx` — seven `React.lazy` imports, each wrapped in `<Suspense>`
- `shared/ui/RouteFallback.jsx` (new) — an empty `.map-module` box with `aria-busy`, so the page height holds while a chunk loads

`npm run build` passes (including `verify.mjs`).

| | Before | After |
|---|---|---|
| Initial JS | 440.28 KB (137.27 gzip) | 289.55 KB (91.07 gzip) |
| Initial CSS | 148.82 KB (25.07 gzip) | 23.13 KB (4.97 gzip) |
| Map chunks (JS) | — | 7.8–31.9 KB each, plus shared GuideRun 9.4 KB and GuideLayout 1.6 KB |
| Map chunks (CSS) | — | 4.5–29.0 KB each, plus GuideRun 9.7 KB and GuideLayout 4.3 KB |

### Why it isn't committed: CSS order changes
In the old single bundle, `main.jsx` imported `App` before `global.css`. `App.jsx` imported `AppRoutes` (hub pages, then every map's CSS) before `MapChrome.css`, `hub-header.css` and `hub-footer.css`. So those four files came **after** all map CSS and won equal-specificity ties. With lazy loading, map chunks are appended **after** them, so the map rule now wins those ties.

Checked by reading the built chunks and the sources (no browser available):

| Finding | Status |
|---|---|
| **Mob of the Dead, phones (≤720 px).** `.mob-module .mob-header .header-content` (0,3,0, in Mob's `@media (max-width: 760px)` and its base rule) ties with MapChrome's `.map-module .zh-map-header .zh-map-header__inner` (0,3,0). They share `width`, `min-height`, `padding`, `margin`, `gap`, `align-items` and `flex-direction`. Mob would now win: header width becomes `min(100% - 20px, 680px)` instead of 100%, padding `.65rem 0` instead of 0, gap `.45rem` instead of 0, `margin: 0 auto`, `align-items: center`. That makes the sticky phone header taller than the `--zh-map-id-h` + `--zh-map-tabs-h` maths assumes, so the tab strip will likely sit wrong under the hub header. | **Real risk** |
| **Zetsubou, phones.** `.zets-module .zets-nav.open { display: grid }` (0,3,0) ties with MapChrome `.zh-map-tabs { display: flex }` (0,3,0). It's only reachable if the menu was opened at 721–768 px and the window then narrowed, because the toggle is hidden at ≤720 px. | Low, edge case |
| Zetsubou `.zets-nav a:hover / a.active` (0,3,1) vs MapChrome tab `a` (0,3,1) | No shared properties, so no effect |
| Map root rules (`.mob-module`, `.de-module`, etc., 0,1,0) vs `global.css` `.map-module` (0,1,0) | Same values (`position: relative`, the same `min-height` calc, `isolation: isolate`), so no visible change |
| Bare `a`, `body`, `html`, `*`, `:root` or tag-only rules in map chunks | None; every match is a scoped descendant selector |
| Mob `ul.zh-map-tabs` rules (0,4,2)/(0,4,3), Origins `.site-header.origins-map-header` (0,3,0) vs MapChrome (0,3,1) | The winner is decided by specificity, so nothing changes |
| `GuideRun.css` now loads before Origins' header/footer CSS | No shared selectors, so no effect |
| Cross-map order (was fixed O→M→S→DE→Z→G→R, now visit order) | Only matters for unscoped classes shared between maps. Not exhaustively ruled out; DE's `NavBar.css`/`Header.css` are unscoped but use unique `de-` names |

**Suggested fix (needs your OK before committing):** make MapChrome win by specificity rather than by order, the same way it already doubles `header.zh-map-header.zh-map-header`. Specifically:
`.map-module .zh-map-header .zh-map-header__inner.zh-map-header__inner` (and the `.zh-map-header.zh-map-header__inner` variant), plus `.map-module .zh-map-header .zh-map-tabs.zh-map-tabs`. That's one file (`shared/ui/MapChrome.css`) and restores the old winners whatever the load order. Then rebuild and do the browser QA below.

## Browser QA still needed (nothing has been verified in a browser)
At 390×844 and 1440×900, with `npm run build` then `npm run preview`:
- `/`, `/allmaps`, `/easter-eggs`, `/side-easter-eggs`, an `/info/<slug>`, a non-dedicated `/maps/<slug>`
- Each map's main page: `/maps/origins`, `/maps/mob-of-the-dead`, `/maps/shadows-of-evil`, `/maps/der-eisendrache`, `/maps/zetsubou-no-shima`, `/maps/gorod-krovi`, `/maps/revelations`
- Sub-routes and aliases: `/maps/origins/fire-staff`, `/maps/origins/FireStaff`, `/maps/der-eisendrache/bows/void`, `/maps/zetsubou-no-shima/cogs/2`, `/maps/mob-of-the-dead/codes`, `/maps/gorod-krovi/valves`, `/maps/revelations/sound-step`
- **The Mob phone header specifically:** title row height 46 px, the tab strip sticks directly under the hub header, no gap.
- Visiting maps in a different order (e.g. Revelations → Origins → Mob) doesn't change their look.
- GuideRun: mark done, reload and see it persist, Undo, Reset (with confirm), progress panel Next/Done; key `zh-run-progress:<runId>`.
- No console errors; no visible flash or layout jump while a map chunk loads (the fallback holds height).

## Remaining known bugs / loose ends
- The Mob phone header precedence flip above (this blocks Stage 0a).
- The integration with `origin/main`'s separate redesign is unresolved (see "Branch state").
- `Navbar.jsx`, `ThemeToggle.jsx` and `MapsHubHeader.jsx` appear unused. Confirm before removing.
- Large images (up to 3 MB PNGs) are still shipped; that's Stage 0c.
- `dist/css-order-check.mjs` is a throwaway script inside the git-ignored `dist/` (it wasn't run; node scripts needed approval). It's safe to ignore or delete.

## Next stages (from docs/DESIGN-PLAN.md)
Before any of these, decide how this branch relates to `origin/main`'s redesign. DESIGN-PLAN.md was written against the pre-redesign hub, and main has already replaced the landing page and map cards.
1. Finish Stage 0a (MapChrome specificity fix, browser QA, commit).
2. 0b tokens and motion utilities → 0c image diet (`npm install -D sharp`).
3. Stages 1–4 hub (header, landing, map selector, view transitions) — needs `npm install gsap @gsap/react`.
4. Stages 5–11, one map each; 12 guide polish (CSS only); 13 hardening.

## Resume commands
```bash
git fetch --all --prune
git status
git branch -vv
git rev-list --left-right --count HEAD...origin/claude/quick-guide-polish   # expect 0 0
git diff                                  # Stage 0a: AppRoutes.jsx
# shared/ui/RouteFallback.jsx is untracked (part of Stage 0a)
npm run build
npm run preview                           # then do the browser QA above
# after the MapChrome fix and QA pass:
git add apps/hub/src/app/AppRoutes.jsx shared/ui/RouteFallback.jsx shared/ui/MapChrome.css
git commit -m "Lazy-load dedicated map routes"
git push
```
