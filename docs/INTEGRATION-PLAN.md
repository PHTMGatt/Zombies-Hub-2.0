# Integration plan: port guide work onto `main` (NOT EXECUTED)

Written 2026-10-24. This is a plan only: nothing has been merged, rebased or cherry-picked.

- **Base for the future branch:** `origin/main` @ `6f95a66`. The user has decided main is the visual and architectural base.
- **Source of the work to port:** `claude/quick-guide-polish` @ `8359093` (3 commits ahead of / 135 behind main; merge-base `f1619a6`).
- **Suggested new branch:** `claude/main-guide-integration`, created from `origin/main`.
- **Method:** port by hand, file by file. No `git merge` or `git rebase` of the old branch: the two sides edited the same 25 files with different intent, and main deliberately restored some designs that the old branch replaced.

---

## 1. What main already has (preserve; don't overwrite)

| Area | On main | Files |
|---|---|---|
| App shell | Skip link, `<main id="zh-main">`, per-route `document.title`, hash-target scroll, `RouteBoundary` error fallback, `Suspense` loading state | `apps/hub/src/app/App.jsx`, `routeMetadata.js`, `shared/ui/RouteBoundary.jsx` |
| Routing | **Lazy loading of all 7 map modules and the secondary hub pages**; honest `NotFound` (no silent redirect to `/`); Mob 1.0 links (`free-blundergat`, `spoon`, `redeemer`, `logs`) redirect into the 2.0 flow; optional `HashRouter` for review previews | `AppRoutes.jsx`, `maps/*/routes/*Routes.jsx`, `shared/ui/NotFound.jsx`, `apps/hub/src/main.jsx` |
| Visuals | Cinematic landing, map search with empty state, new map cards, footer, brand mark/favicon, design tokens (`--zh-*`), global `:focus-visible`, global reduced-motion kill-switch | `Home.jsx/.css`, `AllMaps.jsx/.css`, `MapCard.*`, `HubHeader.jsx`, `hub-header.css`, `HubFooter.jsx`, `hub-footer.css`, `global.css`, `public/zombies-hub-mark.svg` |
| Guides | Static run sheets (same phases, no progress) for Gorod/Mob/SoE/Zets/DE; **original Origins guide restored on purpose** (`6fb9cd7`); **interactive glass Revelations step guide restored on purpose** (`c25949a`, `fab9c43`, `7a8e1d7`); Origins Speed Run side guide; Lightning data corrections (`shared/data/originsLightning.js`) | `maps/*/src/pages/*` |
| Tooling | `npm test` (node --test), `npm run test:browser` (Playwright smoke: 375 and 1440 px, reduced motion), `npm ci` on Render, build-info script, CI visual QA and production smoke workflows, dependabot | `package.json`, `scripts/*`, `.github/workflows/*`, `render.yaml`, `.nvmrc` |

Main's browser smoke test (`scripts/browser-smoke.mjs`) enforces, on every critical route: **exactly one `<h1>`**, **exactly one `<main>`**, no horizontal overflow (≤ 1 px), no broken images, no runtime errors, a route-specific title, and an honest not-found state. Every ported change must keep these passing.

---

## 2. What to port (and what not to)

### Port
| Item | From (old branch) | Notes |
|---|---|---|
| **GuideRun component and saved progress** | `shared/ui/GuideRun.jsx`, `shared/ui/GuideRun.css` | New files on main, so no conflict. Storage key `zh-run-progress:<runId>`; storage failures are tolerated. Main has no saved progress yet, so there's nothing to migrate, but **the phase order and count become a contract from the first deploy** (progress is stored by index). |
| **Phone-first run sheets** (GuideRun use) for **Gorod Krovi, Mob of the Dead, Shadows of Evil, Zetsubou No Shima, Der Eisendrache** | `maps/{gorod-krovi,mob-of-the-dead,shadows-of-evil,zetsubou-no-shima}/src/pages/MainGuide.jsx` (Mob: `MobMain.jsx`), `maps/der-eisendrache/src/pages/Home.tsx` | Rebuild each on **main's** copy of the page: keep main's newer wording (e.g. Gorod's arrow-style summaries) and factual fixes, then swap the static list for `<GuideRun>`. Use a `<div>` wrapper, not `<main>`. Keep each map's `theme` object. |
| Shared guide CSS improvements | `shared/ui/GuideLayout.css` | Main hasn't touched it, so take the old branch's version. Verify every `GuideLayout` consumer on main (e.g. DE Wisp). |
| Per-map mobile/a11y CSS fixes in files **main didn't touch** | Gorod `BossFight.css`, `Buildables.css`, `TrophyChallenges.css`; DE `BossFight.css`, `Parts.css`, `global.css`; Zets `DetailCompact.css`, `Global.css`; Mob `global.css`, `Header.css`; Revelations `global.css` | **Main changed the markup** of several of those pages (DE `Parts.tsx`, `BossFight.tsx`; Gorod `Buildables.jsx`, `BossFight.jsx`, `TrophyChallenges.jsx`; Zets pages). Port only rules whose selectors still exist on main; check per file. |
| Phone map-header tab strip (optional, needs a decision) | `shared/ui/MapChrome.css` + `zh-map-*` hook classes in each `maps/*/src/components/Header.*` / `Nav.*` | Main hasn't touched these Header/Nav files, so they port cleanly, **but** main has its own per-map phone nav designs (e.g. the Revelations 2-column grid in `Header.css`). Porting MapChrome replaces those with a sticky scrolling tab strip. Decide per map. If adopted, the **specificity fix in §4.1 is mandatory**. |
| App-shell behaviour | `useRouteViewport` in old `App.jsx` | Re-implement inside **main's** `RootLayout` effect; don't copy the old file. Port two behaviours: (a) don't force scroll-to-top on back/forward (`useNavigationType() === 'POP'`), which main currently does, so you lose your place in a guide; (b) centre the active `.zh-map-tabs` tab (only if MapChrome is adopted). |

### Do NOT port (main supersedes, or it conflicts with a decision)
| Item | Why not |
|---|---|
| **Stage 0a** (old `AppRoutes.jsx` lazy loading + `shared/ui/RouteFallback.jsx`, uncommitted on the old branch) | Main already lazy-loads every map module with `Suspense`, `RouteBoundary` and a loading state. The **CSS-precedence caveat still applies on main**; see §4.1. |
| Old `App.jsx` as a whole, and the eager `MapChrome.css` import there | Main's shell is the base; port behaviours only (above). |
| Old `hub-header.css` (focus ring; 52 px single-row phone header) | Main's global `:focus-visible` supersedes the focus ring. The slim phone header is a *design* change to main's header: don't port by default. Revisit as a map-route-only compact header if phone space is too tight (main's phone header is 112 px). |
| Old `AllMaps.css` margin fix | Main rewrote `AllMaps.css`; `.maps-wrapper` no longer has that margin. |
| Deletion of `apps/hub/src/styles/Global.css` | Main deleted it too. |
| Old `package-lock.json` | Take main's (see §3). |
| **GuideRun for Origins and Revelations** | Main deliberately restored the original Origins guide and the interactive Revelations guide. **Default: do not port.** If progress is wanted there, add it *inside* main's existing UI (e.g. `useRunProgress` driving a "done" tick on Revelations' step buttons) as a separate, approved step. |
| `'*' → <Navigate to="/">` | Main's honest `NotFound` is tested by the smoke suite. |
| `docs/DESIGN-PLAN.md` Stages 1–3 as written | Main already has a cinematic landing, search and new cards. Rebase the plan onto main before any visual work. |

---

## 3. Dependency and lockfile conflicts
- **`package.json`:** the old branch didn't change it, so take main's as-is: it adds `@fontsource/rajdhani`, `playwright` 1.59.0, a `compression` override, and the test/compile/ci/smoke scripts. **GuideRun needs no new dependencies** (`react-icons` is already there).
- **`package-lock.json`:** add/add conflict (both sides created it independently). **Take main's file unchanged**; don't hand-merge. Render now runs `npm ci`, which fails if the lockfile and `package.json` disagree.
- **`npm run test:browser`** needs Playwright's Chromium (`npx playwright install chromium`). That's a package-level install, so it needs user approval in this environment.
- **Don't mix in dependabot branches** (`vite-8.3.0`, `@vitejs/plugin-react-6.1.1`, `typescript-7.0.2`, actions v7) during the integration. Upgrade separately, after.

## 4. Conflict details

### 4.1 CSS cascade order (highest technical risk)
On main, map CSS arrives in lazy chunks **after** the eager hub CSS (`global.css`, `hub-header.css`, `hub-footer.css`, page CSS), and in **visit order** between maps. Any eager shared stylesheet loses equal-specificity ties to map rules.
- If `MapChrome.css` is ported and imported eagerly (as the old `App.jsx` did), Mob's `.mob-module .mob-header .header-content` (0,3,0) beats MapChrome's `.map-module .zh-map-header .zh-map-header__inner` (0,3,0) on phones. That changes width, padding, gap, margin and alignment, and breaks the sticky header maths. Zetsubou's `.zets-nav.open { display: grid }` (0,3,0) also beats `.zh-map-tabs` (an edge case).
- **Required fix if MapChrome is ported:** raise its specificity rather than relying on order. Double the class, as it already does for `header.zh-map-header.zh-map-header`: `.zh-map-header__inner.zh-map-header__inner` and `.zh-map-tabs.zh-map-tabs`. Re-check the Mob and Zets rules above.
- `GuideRun.css` is shared by several maps' chunks. Its selectors are all `.zh-run…` / `.zh-visually-hidden`, so it doesn't collide.
- **Not verified in a browser yet** (browser tools were blocked). Step-level QA below covers it.

### 4.2 Files changed on both sides (25)
| File | Old branch | Main | Resolution |
|---|---|---|---|
| `apps/hub/src/app/App.jsx` | Scroll hook, MapChrome import | New shell (title, skip link, RouteBoundary, Suspense) | Keep main; re-add POP-aware scroll and tab centring (§2) |
| `apps/hub/src/styles/hub-header.css` | Slim phone header, focus ring | New header design | Keep main |
| `apps/hub/src/styles/pageStyles/AllMaps.css` | Margin fix | Rewritten | Keep main |
| `apps/hub/src/styles/Global.css` | Deleted | Deleted | Same; nothing to do |
| `package-lock.json` | Added | Added (different) | Keep main |
| `maps/gorod-krovi/src/pages/MainGuide.jsx` / `styles/MainGuide.css` | GuideRun; old run-sheet CSS removed | Copy edits, static sheet, `div` wrapper | Main's copy → GuideRun; drop the now-unused `.gorod-run-*` rules |
| `maps/mob-of-the-dead/src/pages/MobMain.jsx` / `styles/MobMain.css` | GuideRun | Copy edits | As Gorod |
| `maps/mob-of-the-dead/src/styles/MobSections.css` | Phone fixes | 50-line rework | Keep main; re-apply only the still-relevant phone fixes |
| `maps/shadows-of-evil/src/pages/MainGuide.jsx` / `styles/MainGuide.css` | GuideRun | Small edits | As Gorod |
| `maps/shadows-of-evil/src/styles/Shadows.css` | Overflow clip on the module | Footer `overflow: clip` | Keep main; add the old module-level `overflow-x: clip` only if the overflow check fails |
| `maps/zetsubou-no-shima/src/pages/MainGuide.jsx` / `styles/MainGuideCompact.css` | GuideRun | Copy edits | As Gorod |
| `maps/zetsubou-no-shima/src/styles/Buildables.css` | Phone fixes | 78-line rework | Keep main; re-check |
| `maps/der-eisendrache/src/pages/Home.tsx` / `styles/pages/HomeCompact.css` | GuideRun (5 phases) | Edits | As Gorod |
| `maps/der-eisendrache/src/styles/components/BowNav.css`, `pages/Bows.css` | Phone fixes | Edits | Keep main; re-check bow pages on phone |
| `maps/origins/src/Pages/MainGuide.tsx` / `Styles/PageStyles/MainGuide.css` | GuideRun rewrite | **Deliberate restore of original** | **Keep main** (§2) |
| `maps/revelations/src/pages/MainGuide.jsx` / `styles/MainGuide.css` | GuideRun rewrite | **Restored interactive glass guide** | **Keep main** (§2) |
| `maps/revelations/src/components/Header.css` | MapChrome hooks, phone tweaks | Header redesign (2-col phone nav) | Keep main; only add MapChrome hooks if adopted for Revelations |

### 4.3 Route conflicts
None in the route tables: the old branch didn't edit any `routes/*Routes.jsx` or `AppRoutes.jsx` (apart from the uncommitted Stage 0a, which isn't being ported). GuideRun phase links (`phase.to`) must resolve on main. The Mob links (`plane`, `retriever-skulls`, `codes`, `final-step`) and Gorod links (`buildables`, `valves`, `trophies`, `boss`) exist on main. Verify Zets, DE and SoE links in each step (a link to a removed route now shows `NotFound`).

### 4.4 Shared UI conflicts
- `shared/ui/` on main: `GuideLayout.*`, `NotFound.jsx`, `RouteBoundary.jsx` (`MigrationPlaceholder.jsx` removed). Old branch: `GuideRun.*`, `MapChrome.css` (new), `GuideLayout.css` (edited). There are no same-file conflicts; only the cascade interactions in §4.1.
- `.zh-visually-hidden` is defined only in `GuideRun.css`. Main has no equivalent; keep it there, or move it to `global.css` if hub pages need it.
- Main's global reduced-motion rule (`transition-duration: 0.01ms !important`) also covers GuideRun's transitions. GuideRun's own smooth scroll already checks `prefers-reduced-motion`.

---

## 5. Migration order (small, verifiable steps)
Each step is one commit on `claude/main-guide-integration`. Run the per-step QA (§6) before the next step. Push after each green step. Never push to `main`.

| # | Step | Files |
|---|---|---|
| 0 | Create the branch from `origin/main`; `npm ci`; record a baseline: `npm run build`, `npm test`, `npm run test:browser` (after an approved `npx playwright install chromium`) | none |
| 1 | Add GuideRun (unused) | `shared/ui/GuideRun.jsx`, `shared/ui/GuideRun.css` |
| 2 | Gorod Krovi → GuideRun (pilot) | `maps/gorod-krovi/src/pages/MainGuide.jsx`, `styles/MainGuide.css` |
| 3 | Mob of the Dead → GuideRun | `maps/mob-of-the-dead/src/pages/MobMain.jsx`, `styles/MobMain.css` |
| 4 | Shadows of Evil → GuideRun | `maps/shadows-of-evil/src/pages/MainGuide.jsx`, `styles/MainGuide.css` |
| 5 | Zetsubou No Shima → GuideRun | `maps/zetsubou-no-shima/src/pages/MainGuide.jsx`, `styles/MainGuideCompact.css` |
| 6 | Der Eisendrache → GuideRun | `maps/der-eisendrache/src/pages/Home.tsx`, `styles/pages/HomeCompact.css` |
| 7 | Add a GuideRun regression check: a smoke interaction (mark a phase done on `/maps/gorod-krovi`, reload, assert it's still done) and a node unit test for progress sanitisation (optional) | `scripts/browser-smoke.mjs`, optional `scripts/guide-run.test.mjs` |
| 8 | Shared guide CSS | `shared/ui/GuideLayout.css` |
| 9a–9e | Per-map phone/a11y CSS from files main didn't touch, **one map per step**, only rules whose selectors still exist | listed in §2 |
| 10 | App shell: POP-aware scroll (don't jump to top on back/forward) | `apps/hub/src/app/App.jsx` |
| 11 | **Decision gate:** MapChrome phone tab strip, per map, with the §4.1 specificity fix; then tab centring in `App.jsx` | `shared/ui/MapChrome.css`, `maps/*/src/components/Header.*`, `Nav.*`, `App.jsx` |
| 12 | **Decision gate:** progress for Origins/Revelations inside their restored UIs (if wanted) | their main-guide pages |
| 13 | Rebase `docs/DESIGN-PLAN.md` onto main's visuals; update `docs/architecture.md` (GuideRun contract, CSS-specificity rule) | `docs/*` |

## 6. QA checklist (every step)
Automated:
- [ ] `npm run build` (includes `verify.mjs`, build-info)
- [ ] `npm test`
- [ ] `npm run test:browser` (375 px and 1440 px, reduced motion; one h1, one main, no overflow, no broken images, no runtime errors, honest NotFound)

Manual (`npm run preview`), at **390×844 (mobile)**, **768×1024 (tablet)** and **1440×900 (desktop)**:
- [ ] The changed map's main page and every page its phases link to render, with no console errors.
- [ ] **GuideRun progress:** mark phases done → reload → still done; Undo; Reset (confirm dialog); progress panel "Next" scrolls to the next phase; panel "Done"; the last phase isn't hidden behind the panel; key `zh-run-progress:<runId>` in DevTools → Application; private window / blocked storage still works (no crash).
- [ ] **Keyboard:** skip link → map header → tabs → phases; Done/Undo toggles operate with Enter/Space; focus ring visible on the map's backdrop; `aria-pressed` updates; no focus traps.
- [ ] **Reduced motion** (OS setting or DevTools): no smooth scroll or animated feedback; everything still usable.
- [ ] **CSS order:** open maps in two different orders (e.g. Revelations → Mob → Origins, then a fresh tab Origins → Mob → Revelations); the changed map looks identical both times. Mob phone header specifically (after step 11): title row and tab strip sit flush under the hub header.
- [ ] Hub pages are unaffected after visiting maps (landing, search, cards, footer).
- [ ] Touch targets ≥ 44 px on phone (GuideRun buttons, tabs).

## 7. Top risks
1. **CSS cascade order with lazy chunks:** eager shared CSS loses ties to map chunks, and map-to-map order follows visit order (§4.1).
2. **Overwriting main's deliberate work:** the restored Origins/Revelations guides, and main's newer copy and factual corrections in the five main guides.
3. **Smoke-test contracts:** a nested `<main>` in the old main guides, h1 count, horizontal overflow from the fixed progress panel or tab strips.
4. **Lockfile/dependencies:** hand-merged lockfiles break `npm ci` on Render; Playwright needs an approved browser install; dependabot majors are pending.
5. **Progress contract and phone space:** phase order/count are frozen once shipped (index-based storage); main's 112 px phone hub header + map header + progress panel compete for screen space on small phones.
