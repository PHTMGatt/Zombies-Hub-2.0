# Zombies Hub Guide Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use `superpowers:executing-plans` to implement this plan task by task.
> - Project rules forbid Superpowers worktree, branch-finishing and review workflows, so do **not** use `superpowers:subagent-driven-development`.
> - Use `superpowers:verification-before-completion` before every "done" claim, and `superpowers:systematic-debugging` for any failure.
> - Review with the built-in `/code-review` at each checkpoint.
> - Steps use checkbox (`- [ ]`) syntax.

**Goal:** Remove the shared guide machinery (modes, progress, Mark-done, carousel, gates) without losing a single guide fact, then redesign each map around its own mechanics, one map at a time, behind approval checkpoints.

**Architecture:**
- **Phase 1** cuts `shared/guide/GuideSteps.jsx` down to a stateless, plain ordered sequence. That is a neutral holding presentation, not a target layout.
  - It enforces CSS scoping, fixes short-viewport chrome, and replaces machinery tests with behaviour and content-preservation tests.
- **Phases 2–8** each start with a per-map design check that needs approval. Each then gets its own detailed task list, written into this file before any code, and builds that map's own layout from small shared primitives.

**Tech Stack:** React 19, Vite 6.4.3, React Router 7, Node 22 `node:test`, Playwright 1.59 (cloud shim per `CLAUDE.md`), custom PostCSS scoper.

**Spec:** `docs/superpowers/specs/2026-10-31-zombies-hub-redesign-design.md` (approved at `a79d4bb`). Section numbers below (§) refer to it.

## Global Constraints

- **Git:** work only on `claude-forge`. No branches, worktrees, `checkout -b`, `switch -c`, merges to `main`, or deploys. Push with `git push -u origin claude-forge`.
- **Protected files:** do not edit `package-lock.json`, `render.yaml`, `.github/workflows/` or `.env*`. Editing `package.json` `scripts` is allowed.
- **Assets:** `verify.mjs` rejects root-relative `/src` or `/images` asset paths; import assets instead.
- **Scratch output:** screenshots and scratch output go in `artifacts/` (gitignored), never `shots/`.
- **Content is sacred:** no step, code, symbol, switch state, solver datum, timing, location, prerequisite or timestamp is dropped, reordered or reworded. The **only** approved content removal is the Origins problem line `'Speedrun mode unlocks once every step is marked done.'`.
- **No gates:** guide, step, mechanic and Speed Run access never depend on stored progress, achievements or completion.
- **Accessibility floor:**
  - body text ≥ ~15px, step titles ~17–19px, body contrast ≥ 4.5:1, tap targets ~48px where practical
  - visible focus, and reduced-motion and reduced-transparency respected
- **Viewports:** every UI change is verified at **1440×900, 390×844 and 844×390**.
- **Tools:** no new plugins. `frontend-design` is the only taste skill. Impeccable is Phase 9 only.
- **No universal template:** no universal map page structure. Shared code is limited to the §5 primitives.

## Review Focus

Failure modes the spec implies that are most likely to bite a player; each is pinned by a test in the owning task.

1. **Deep link before the lazy map chunk loads.** Opening `/maps/origins#upgrade-staffs` cold must land on that step, not at the top and not hidden under the fixed hub header. (Task 1.4)
2. **Facts inside non-default tabs.** For example, Origins "Build the four staffs" Fire/Wind/Lightning tabs. Every tab must remain reachable, and each tab's own `problems`/`links` must follow it. (Tasks 1.1 and 1.4)
3. **Returning player with old localStorage.**
   - The old keys are `zh-guide-progress:*`, `zh-guide-mode`, `zh-origins-depth = "speedrun"` and `zh-origins-speedrun-unlocked`.
   - Expected: no crash, no ghost mode, and finished runs credited exactly once. (Task 1.5)
4. **Blocked storage (private window).** "I completed this Easter Egg" must not throw and must show as earned for the session. (Task 1.5)
5. **Step ids as anchors.** Ids must be unique per page, match `^[a-z0-9-]+$`, and not collide with other element ids on the page. (Task 1.1)

## Shared verification gate (referenced as **GATE**)

Run in order; every item must pass.

1. `npm test` → all tests pass, 0 fail.
2. `npm run check` → exits 0.
3. `npm run build` → exits 0.
4. Start `npm run preview -- --host 127.0.0.1 --port 4173 --strictPort` in the background, then run `PLAYWRIGHT_BROWSERS_PATH=/tmp/pw-shim npm run test:browser`. Every smoke prints success and exits 0. The shim setup is in `CLAUDE.md`.
5. Playwright MCP at **1440×900, 390×844 and 844×390** on every route the task changed:
   - screenshots saved to `artifacts/phase-<n>/`
   - check reading order, horizontal overflow, header/nav height, tap targets, and readability over artwork
   - apply the three-second test: could a player find the answer here in about three seconds?
6. Stop the preview server and close the browser.

## Content-preservation layers (built in Task 1.1, used by every phase)

**A. Data layer** — `scripts/guide-content.mjs`
- Loads every step-data module with Vite `ssrLoadModule`. The 2026-10-31 spike loaded all 8 files: 78 steps, 218 tasks.
- Flattens every guide-facing string: titles, goals, critical, how, problems, link labels, video labels, task labels and hints, and ref text (facts `k`/`v`, chips, sequence items and notes, lists, warnings, image alt and caption, tabs recursively, including per-tab problems and links).
- `custom` refs are recorded by key only; their components are covered by layer B.
- Baseline committed at `scripts/fixtures/guide-content.baseline.json`.

**B. Rendered layer** — `scripts/content-snapshot.mjs`
- Uses Playwright against the preview build. For every route in `scripts/critical-routes.mjs` plus each Side EE page, it opens every `<details>`, clicks every tab-role button, and collects normalised visible text segments from `main`.
- Baseline committed at `scripts/fixtures/rendered/<route-slug>.json`. It is captured **before** any app change.
- `scripts/content-browser-smoke.mjs` asserts every baseline segment is still present, except those listed in `scripts/fixtures/approved-removals.json`.
- That file holds UI-chrome strings being deleted (mode labels, "Mark step done", counters, "Track it", "Quick refs", "Progress options", Speedrun-lock copy) plus the one approved content line.
- Each entry needs a `reason` and a `spec` section reference. **Adding an entry that is a guide fact is a stop-and-ask event.**

---

# Phase 1 — Shared deletion pass, CSS guard, short-viewport fixes, Kino

Spec: §4.1–4.8. Phase 1 changes no map's long-term layout.

### Task 1.0: Preflight

**Files:** none changed.

- [ ] **Step 1:** `git status --porcelain` is empty; `git rev-parse --abbrev-ref HEAD` prints `claude-forge`; HEAD contains `a79d4bb`.
- [ ] **Step 2:** Run GATE items 1–4 on the untouched tree and record pass counts in `artifacts/phase-1/baseline.txt`. Expected: `npm test` 29/29, all ten smokes pass.

### Task 1.1: Content-preservation harness and baselines

**Files:**
- Create: `scripts/guide-content.mjs`, `scripts/content-snapshot.mjs`, `scripts/content-browser-smoke.mjs`, `scripts/guide-content.test.mjs`
- Create: `scripts/fixtures/guide-content.baseline.json`, `scripts/fixtures/rendered/*.json`, `scripts/fixtures/approved-removals.json`
- Modify: `package.json` (`test:browser` appends `&& node scripts/content-browser-smoke.mjs`)

**Interfaces:**
- **Produces:**
  - `loadGuides(): Promise<Array<{ guide: string, route: string, steps: Step[] }>>`, with guide ids `origins`, `revelations`, `gorod-krovi`, `der-eisendrache`, `zetsubou-no-shima`, `shadows-of-evil`, `mob-of-the-dead`, `kino-side`
  - `guideStrings(guide): string[]` (flattened, trimmed, de-duplicated, data order)
  - `node scripts/content-snapshot.mjs [--route <path>]` writes the rendered baselines
- `Step` is the existing data shape (`id, title, goal, refs, tasks, how, problems, critical, links, video`).

- [ ] **Step 1: Write `scripts/guide-content.test.mjs`**
  - `test('every baseline guide string is still in the step data')`: for each guide, every string in the baseline appears in `guideStrings(current)`, unless it is listed in `approved-removals.json` with `layer: "data"`.
  - `test('step ids are unique and anchor-safe')`: per guide, ids are unique and each matches `/^[a-z0-9-]+$/`.
  - `test('tabs keep every tab and its own problems/links')`: for every tabs ref, the baseline tab ids equal the current tab ids, and each tab's `problems` and `links` strings are present.
- [ ] **Step 2:** Run `node --test scripts/guide-content.test.mjs`. Expected: FAIL because the baseline file does not exist.
- [ ] **Step 3: Implement the loader.**
  - Implement `loadGuides` and `guideStrings` in `scripts/guide-content.mjs`. Start Vite with `server.middlewareMode`, `appType: 'custom'` and `optimizeDeps.noDiscovery: true`, and close it in `finally`.
  - Implement a `--write-baseline` flag that writes `guide-content.baseline.json`.
  - Run it once on the untouched tree.
- [ ] **Step 4:** Run `node --test scripts/guide-content.test.mjs`. Expected: PASS.
- [ ] **Step 5: Rendered baselines.**
  - Implement `content-snapshot.mjs` and `content-browser-smoke.mjs` at 1440×900. Rendered text does not depend on viewport; the three-viewport checks live in the other smokes.
  - With the preview of the **untouched** build running, write the rendered baselines.
  - Run `node scripts/content-browser-smoke.mjs`. Expected: PASS against itself.
- [ ] **Step 6:** Seed `approved-removals.json` with the chrome strings above and the Origins line `Speedrun mode unlocks once every step is marked done.` (`layer: "data"`, `spec: "§3"`). Commit as `test: content-preservation baselines before guide simplification`.

### Task 1.2: Shared viewport list with landscape

**Files:**
- Create: `scripts/smoke-viewports.mjs`
- Modify: `scripts/browser-smoke.mjs`, `scripts/{mob,shadows,der,zets,gorod,revelations,achievements,search}-browser-smoke.mjs` (replace each `widths` loop)

**Interfaces:**
- **Produces:** `export const VIEWPORTS = [{ name: 'phone', width: 390, height: 844 }, { name: 'landscape', width: 844, height: 390 }, { name: 'desktop', width: 1440, height: 900 }]`.

- [ ] **Step 1:** Replace every `widths = [390, 1440]` loop with `VIEWPORTS`, creating contexts at `{ width, height }`.
  - Width-based branches use `name`. The `browser-smoke.mjs` pinned-header limit becomes `{ phone: 130, landscape: 130, desktop: 110 }`; landscape tightens to 0 in Task 1.7.
- [ ] **Step 2:** Run GATE item 4. Expected: PASS. If a landscape-only failure appears, do not weaken the assertion: record it in `artifacts/phase-1/landscape-findings.txt` and fix it in Task 1.7.
- [ ] **Step 3:** Commit as `test: run browser smokes at 844x390 landscape too`.

### Task 1.3: Enforce Origins and Shadows CSS scoping

**Files:**
- Modify: `postcss.config.js` (`featureScopes`), `CLAUDE.md` (scoping paragraph)
- Test: `scripts/css-scope.test.mjs`

- [ ] **Step 1: Write `scripts/css-scope.test.mjs`.**
  - `test('every map stylesheet is in the PostCSS scope list')`: every `maps/<map>/` directory has an entry in `featureScopes`, read as source text.
  - Run it. Expected: FAIL naming `maps/origins/` and `maps/shadows-of-evil/`.
- [ ] **Step 2:** Run `npm run build`, then `mkdir -p artifacts/phase-1/css-before && cp dist/assets/*.css artifacts/phase-1/css-before/`.
- [ ] **Step 3:** Add `['maps/origins/', '.origins-module']` and `['maps/shadows-of-evil/', '.shadows-module']` to `featureScopes`.
- [ ] **Step 4: Compare the built CSS.**
  - Run `npm run build`.
  - Diff every CSS file against `css-before` by content, ignoring hashed filenames: `diff <(cat artifacts/phase-1/css-before/*.css | sort) <(cat dist/assets/*.css | sort)`.
  - Expected: no difference. Any difference is investigated with `systematic-debugging` before continuing.
  - Re-run the test. Expected: PASS.
- [ ] **Step 5: Correct `CLAUDE.md`.**
  - Replace "Origins and Shadows of Evil are NOT in that list: their CSS is global, so check for leaks when restyling them." with a statement that all seven maps are now scoped by PostCSS.
  - Note that Origins and Shadows were hand-scoped and did not leak, and are now also enforced automatically.
- [ ] **Step 6:** Commit as `build: enforce PostCSS scoping for Origins and Shadows`.

### Task 1.4: Strip `GuideSteps` to a plain sequence

**Files:**
- Modify: `shared/guide/GuideSteps.jsx` (rewrite), `shared/guide/guide.css` (delete machinery rules)
- Modify the callers:
  - `maps/origins/src/Pages/MainGuide.tsx`
  - `maps/revelations/src/pages/MainGuide.jsx`
  - `maps/gorod-krovi/src/pages/MainGuide.jsx`
  - `maps/der-eisendrache/src/pages/Home.tsx`
  - `maps/zetsubou-no-shima/src/pages/MainGuide.jsx`
  - `maps/shadows-of-evil/src/pages/MainGuide.jsx`
  - `maps/mob-of-the-dead/src/pages/MobMain.jsx`
  - `apps/hub/src/pages/SideEEInfo.jsx`
- Delete: `shared/guide/QuickRefs.jsx`, `shared/guide/useGuideProgress.js`
- Modify imports (`readStored`/`writeStored` → `read`/`write` from `shared/storage.js`): `maps/der-eisendrache/src/components/SafeCodeNote.jsx`, `maps/origins/src/components/ElectricalPanel.jsx`, `maps/origins/src/components/speedrunUnlock.js`
- Create: `scripts/guide-sequence-browser-smoke.mjs`
- Modify: `package.json` (`test:browser`: remove `run-mode-browser-smoke.mjs`, add `guide-sequence-browser-smoke.mjs`)
- Delete: `scripts/run-mode-browser-smoke.mjs`
- Modify: the per-map smokes, removing machinery interactions only. Their route, image, footer and tool checks stay.

**Interfaces:**
- **Consumes:** `GuideReferences({ refs, tabState })` (unchanged); `VIEWPORTS` (Task 1.2).
- **Produces:** `GuideSteps({ label: string, steps: Step[], footer?: ReactNode })`.
  - `footer` is where Task 1.5 places the completion action.
  - The props `guideId`, `mapId`, `quickRefs`, `depths`, `depth`, `onDepthPress`, `progress`, `selectorExtra` and `override` are removed.
- **DOM contract** (used by later tasks and smokes):
  - `section.guide[aria-label="<label> guide"]` > `ol.guide-seq` > `li.guide-seq__step#<step.id>`
  - inside each step: `h3`, `p.guide-seq__goal`, critical warnings, refs, and `ul.guide-seq__tasks` (each `li` shows the label and, when present, `small` with the hint)
  - then `details.guide-seq__more` holding `how`, `video`, `links`, and a nested `details` "Not working?" for `problems`
  - `li.guide-seq__step` has `scroll-margin-top: calc(var(--hub-nav-height) + 1rem)`

- [ ] **Step 1: Write `scripts/guide-sequence-browser-smoke.mjs`.** At every viewport, for each guide route and `/side-easter-eggs/kino`:
  - `every step renders in data order with its anchor`: the `li.guide-seq__step` ids equal the `loadGuides()` ids in order, and each `h3` text equals the step title.
  - `every task label and hint is on the page`: every `task.label` and `task.hint` from `loadGuides()` appears in `section.guide` textContent.
  - `no guide machinery remains`: these selectors count 0: `.guide-mode, .guide-progress, .guide-actions, .guide-rail, .guide-tasks button, .guide-menu, .guide-finish, .guide-quickrefs`. Page text contains none of `Mark step done`, `Walkthrough`, `Quick refs`, `Track it`, `Progress options`, `SWIPE`, `???`.
  - `cold deep link lands on the step`: in a new context, `goto('/maps/origins#upgrade-staffs')`. After `networkidle`, `#upgrade-staffs` is visible and its top is ≥ the fixed hub header's bottom and < 40% of the viewport height.
  - `tabs stay reachable`: on `/maps/origins#build-staffs`, clicking each of Ice/Fire/Wind/Lightning shows that tab's facts. Use the `loadGuides()` strings for the tab.
  - `no element id collides with a step id`: `document.querySelectorAll('[id="<id>"]').length === 1` for every step id.
- [ ] **Step 2:** Run it against the current build. Expected: FAIL on "no guide machinery remains" and on `li.guide-seq__step`.
- [ ] **Step 3: Rewrite `GuideSteps.jsx` to the contract above.**
  - It is stateless except for a per-step tab selection: a `useState` inside a `StepItem` component. The active tab's `problems` and `links` merge into that step only.
  - On mount, if `location.hash` matches a step id, call `scrollIntoView({ block: 'start' })` on it. This handles lazy chunks loading after `RootLayout`'s hash effect.
  - Task items render as plain text, never buttons.
  - Delete all `guide-mode`, `guide-progress`, `guide-rail`, `guide-actions`, `guide-tasks`/`guide-task`, `guide-menu`, `guide-finish`, `guide-step__meta` and `guide-quickrefs` rules from `guide.css`. Keep `gref*` reference rules and the warning and "Not working?" styles.
- [ ] **Step 4: Update the callers.**
  - Each map page passes only `label` and `steps`, and drops its `QUICK_REFS` constant and its imports.
  - Origins `MainGuide.tsx` also drops `DEPTHS`, `DEPTH_IDS`, `useGuideDepth`, `useGuideProgress`, `useSpeedrunUnlock`, the `selectorExtra` and the `override`, and keeps the credits `<details>` as is. Its comment about "Three depths" is removed.
  - `SideEEInfo.jsx` passes `label` and `steps`. Its comment "Tracked like the main guides…" becomes a description of a plain step list.
  - `Kino.js`'s header comment "tracked checklist" is updated to match.
- [ ] **Step 5: Remove machinery steps from the per-map smokes.** Remove any click on mode buttons, Mark done, ←/→, task ticks or Quick refs. Replace each removed assertion with a check that the step's title is present by id.
- [ ] **Step 6:** Run `node --test scripts/guide-content.test.mjs`, then GATE items 3–4. Expected: PASS, including `content-browser-smoke` with only approved removals.
- [ ] **Step 7:** Commit as `refactor(guide): replace guide machinery with a plain step sequence`.

### Task 1.5: Quiet completion action, legacy backfill, Home and Achievements cleanup

**Files:**
- Create: `shared/achievements/CompleteEasterEgg.jsx`
- Modify: `shared/achievements/achievements.js`, `shared/achievements/achievements.css`, `apps/hub/src/app/App.jsx`, `apps/hub/src/pages/Home.jsx`, `apps/hub/src/pages/Achievements.jsx`, `apps/hub/src/styles/pageStyles/Achievements.css`, and the 7 map main-guide pages from Task 1.4 (each passes `footer={<CompleteEasterEgg mapId="<map>" />}`; Kino passes nothing)
- Delete: `shared/achievements/ContinueRuns.jsx`
- Rewrite: `scripts/achievements-browser-smoke.mjs`

**Interfaces:**
- **Consumes:** `unlockAchievement(id)`, `mainAchievementFor(mapId)`, `getUnlocked()`, `CHANGE_EVENT` (existing).
- **Produces:**
  - `CompleteEasterEgg({ mapId: string })` renders nothing when the map has no main-EE achievement.
  - Before it is earned: a text-style `<button type="button">I completed this Easter Egg</button>`.
  - After it is earned: `<p>Completed · <Link to="/achievements">View achievement</Link></p>`.
  - Styling: no accent fill, no full-width bar, no sticky positioning, body-size text, ≥ 44px tap height.
  - `backfillLegacyMainAchievements(): number` in `achievements.js` credits, through the existing `backfillAchievement`, every map whose legacy record has every step done, then sets `zh-legacy-progress-checked = true` and never reads progress again. It returns the number credited.
  - **Removed:** `activeRuns`, `guideProgress` and `resetMap` (if no remaining caller).
  - **Replaced:** `resetAllProgress` → `clearOldGuideData(): void`, per §4.4. It removes only legacy machinery keys: `zh-guide-progress:*`, `zh-guide-mode`, `zh-origins-depth` and `zh-legacy-progress-checked`.
  - Saved in-game notes (`MAPS[*].keys`: SoE character and symbols, DE safe code, Kronorium symbols) are **not** cleared by it. This is a behaviour change from today's button; it is reported at Checkpoint 1.

- [ ] **Step 1: Rewrite `achievements-browser-smoke.mjs`.** At every viewport:
  - **Button marks the achievement:** with clean storage on `/maps/revelations`, the last element in `section.guide`'s footer is the button. Clicking it makes `zh-achievements.unlocked['revelations/main']` exist. The button is replaced by the "Completed" note. Step count, nav links and the Speed Run tab (on Origins) are unchanged before and after.
  - **No Kino button:** `/side-easter-eggs/kino` has no completion button.
  - **Legacy backfill credits exactly once:** seed `zh-guide-progress:gorod-krovi` with all 11 step ids done and `total: 11`, then load `/`. `revelations/main` is not added; `gorod-krovi/main` is present with `at: null`; no toast appears. Reloading does not change the record.
  - **Old keys are harmless:** seed `zh-guide-mode = "full"` and `zh-origins-depth = "speedrun"`. `/maps/origins` renders the sequence and no page errors occur.
  - **Blocked storage:** in a context where `localStorage.setItem` throws, clicking the button shows "Completed" and no page error occurs.
  - **No progress UI left:** Home has no `.zh-continue`. Achievements page text has no "steps" progress counter.
  - **Clear button scope:** the button reads "Clear old guide data". After confirming, `zh-guide-progress:*`, `zh-guide-mode` and `zh-origins-depth` are gone, while seeded `zh-soe-character` and `zh-de-safe-code` remain.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - Build `CompleteEasterEgg` and `backfillLegacyMainAchievements`. Call the backfill once in `App.jsx` in a `useEffect([], …)`.
  - Remove `<ContinueRuns />` from `Home.jsx` with no replacement.
  - Remove the per-map progress bar and text from `Achievements.jsx`, and rename the clear action.
  - Delete the related CSS.
- [ ] **Step 4:** Run the achievements smoke, then GATE items 1–4. Expected: PASS.
- [ ] **Step 5:** Commit as `feat(achievements): one quiet completion action, drop step progress`.

### Task 1.6: Origins Speed Run always open

**Files:**
- Modify: `maps/origins/src/components/Nav.tsx`, `maps/origins/src/Pages/SpeedRun/SpeedRunLayout.jsx`, `maps/origins/src/components/ElectricalPanel.jsx`, `maps/origins/src/components/speedrunUnlock.js`, `maps/origins/src/data/originsGuide.jsx` (delete the approved line only), `shared/achievements/achievements.js` (achievement title)
- Delete: `maps/origins/src/components/SpeedrunGate.jsx`, `maps/origins/src/Styles/ComponentStyles/SpeedrunGate.css`
- Test: `scripts/browser-smoke.mjs` (add a Speed Run block)

- [ ] **Step 1: Add a Speed Run block to `browser-smoke.mjs`.** At every viewport with clean storage:
  - **Nav:** the `/maps/origins` nav has a link named "Speed Run" as its last item, fully inside the viewport. At phone and landscape it is reachable by scrolling only the nav row, and the page itself does not scroll sideways.
  - **Page:** `/maps/origins/speed-run` shows the `h2` "Origins Speed Run". The text "to unlock Speedrun" does not appear.
  - **Copy:** `/maps/origins/lightning-staff` page text contains neither "Speedrun mode" nor "unlock".
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Nav:** render the Speed Run `NavLink` unconditionally.
  - **Speed Run page:** `SpeedRunLayout` drops the gate and `useGuideProgress`.
  - **Electrical Panel:**
    - It keeps calling `unlock()`, which now only records `origins/speedrun-unlocked`.
    - Remove `openSpeedrunMode` and the `zh-origins-depth` write.
    - Its solved state reads "Electrical Panel solved" with a link "Open Speed Run" to `/maps/origins/speed-run`.
  - **Achievement:** retitle `origins/speedrun-unlocked` to `'Electrical Panel Solved'`. Keep the id and `legacyKey` so earned records survive.
  - **Data:** delete the one approved line from `originsGuide.jsx`.
- [ ] **Step 4:** Run GATE items 1–4. Expected: PASS. `guide-content.test` passes only because the line is in `approved-removals.json`.
- [ ] **Step 5:** Commit as `feat(origins): Speed Run always available; panel solve is achievement-only`.

### Task 1.7: Step deep links, legacy `?ref=`, and short-viewport chrome

**Files:**
- Modify: `shared/search/searchIndex.js` (`ref()`), `scripts/search-index.test.mjs`, `scripts/search-browser-smoke.mjs`
- Modify: `apps/hub/src/app/App.jsx` (`RootLayout`), `apps/hub/src/styles/hub-header.css`, `apps/hub/src/styles/pageStyles/Home.css`
- Modify: `maps/origins/src/Styles/ComponentStyles/Header.css`, `maps/origins/src/Styles/ComponentStyles/Nav.css`, `maps/gorod-krovi/src/styles/Header.css`, `maps/der-eisendrache/src/styles/components/Header.css` (also the `.header-spacer` rule in `maps/der-eisendrache/src/styles/global.css` if needed)
- Test: `scripts/browser-smoke.mjs`

- [ ] **Step 1: Write the tests.**
  - **Unit (`search-index.test.mjs`):** every `kind: 'ref'` entry's `to` matches `/^\/maps\/[a-z-]+#[a-z0-9-]+$/`, and its fragment is a step id of that map (via `loadGuides()`).
  - **Browser:**
    - **Search:** choosing the "Staff upgrades" search result lands on `/maps/origins#upgrade-staffs` with that step visible.
    - **Legacy link:** `goto('/maps/mob-of-the-dead?ref=codes')` ends at `/maps/mob-of-the-dead#codes` with `#codes` visible.
    - **Landscape chrome (`landscape` viewport, every route):** `.hub-header` and `.map-module header` are not `fixed`/`sticky`.
    - **Landscape Home:** on `/`, the `h1` bottom is ≤ 390.
    - **Landscape Kino:** on `/side-easter-eggs/kino`, the first `li.guide-seq__step h3` top is < 390.
    - **Landscape map pages:** record the first step title's `top` in `artifacts/browser-smoke.json` as a metric. This is not an assertion until each map's phase (§4.7 covers Kino only).
- [ ] **Step 2:** Run them. Expected: FAIL.
- [ ] **Step 3: Implement.**
  - **Search links:** `ref = (map, stepId) => \`/maps/${map}#${stepId}\``.
  - **Legacy redirect:** in `RootLayout`, when the path starts with `/maps/` and `searchParams.get('ref')` is set, `navigate(\`${pathname}#${ref}\`, { replace: true })`.
  - **Hub header on short screens:** under `@media (max-height: 500px) and (orientation: landscape)`, `.hub-header { position: absolute; }` so it scrolls away. `--hub-nav-height` padding is unchanged.
  - **Map headers:** the same query sets `position: static` on the Origins, Gorod and DE map headers. DE's spacer collapses to 0.
  - **Origins nav:** in that query, the Origins nav row wraps or scrolls within itself without clipping any item.
  - **Home hero:** in that query, `.home-hero-panel` loses its `min-height` floor and the copy padding tightens so the `h1` fits.
- [ ] **Step 4:** Run GATE items 1–4. Expected: PASS.
- [ ] **Step 5:** Commit as `fix: step deep links and short landscape chrome`.

### Task 1.8 (Phase 1b): Kino verification, docs, review, checkpoint

**Files:**
- Modify: `CLAUDE.md` (Commands: `test:browser` at 390×844, 844×390 and 1440×900; content harness)
- Modify: `docs/polish-roadmap.md` (replace "Every map should use the same underlying wireframe…" and "Standard map-guide wireframe" with a pointer to the spec's "shared design language, not shared information architecture")
- Kino CSS fixes only if verification fails: `apps/hub/src/styles/SideEE/SideEEInfo.css`

- [ ] **Step 1: Kino acceptance (§4.7)** with Playwright MCP at all three viewports on `/side-easter-eggs/kino`.
  - **Facts:** all four teleport rooms and their spots; Reel 1–3; "Film played" and its hint; "Rocket launched" and its hint; Chandelier and Tower with their hints.
  - **Layout:** first step title within the first 844×390 viewport; no horizontal overflow; header text contrast ≥ 4.5:1 (measured with `getComputedStyle` colours over the overlay); no machinery.
  - Screenshots go to `artifacts/phase-1/kino-*.png`. Fix any failure here in `SideEEInfo.css`, never deferred.
- [ ] **Step 2:** Full GATE, including Playwright MCP screenshots of all 7 main guides, Home, Achievements, Origins Speed Run and Kino at all three viewports.
- [ ] **Step 3:** Run built-in `/code-review` on `a79d4bb..HEAD`. Fix confirmed findings and re-run GATE items 1–4.
- [ ] **Step 4:** Commit the docs as `docs: Phase 1 commands, scoping and roadmap updates`, then `git push -u origin claude-forge`.
- [ ] **Step 5 (CHECKPOINT 1):** Report to the user with:
  - gate results
  - before/after screenshots for Origins, Revelations, Gorod and Kino at three viewports
  - the landscape first-step metric per map
  - the `approved-removals.json` contents
  - **Stop until approval.**

---

# Phases 2–8 — one map at a time

Every map phase has the same skeleton. Only its content differs.

1. **Design check (no code).** Invoke `frontend-design`. Inspect the map's data and pages, and re-screenshot the post-Phase-1 state at the three viewports. Present a short in-chat design: structure, which §5 primitives it uses, nav, what is deleted, and visual direction. **Stop for approval.**
2. **Task list.** Append the map's detailed tasks to this file, in the Phase 1 format: files, interfaces, failing test, implementation, gate, commit. Commit as `docs(plan): phase N <map> tasks` and present them. **Stop for approval.**
3. **Mechanic-page baselines.** Before any change, if `scripts/fixtures/rendered/` lacks a route the phase touches, capture it with `content-snapshot.mjs --route`.
4. **Implement** test-first. Behaviour changes get tests. Pure CSS changes rely on the smokes, content checks and MCP screenshots, not on invented tests.
5. **Full GATE**, then `/code-review`, then push, then **CHECKPOINT** with screenshots. **Stop until approval.**

The §5 primitives are created the first time a phase needs them, inside that phase's tasks: `shared/guide/StepDetail.jsx`, `shared/guide/useStepHash.js`, `shared/ui/ZoomImage.jsx` and `shared/ui/tokens.css`. They are not built in advance.

Content checks for every map phase:
- `guide-content.test.mjs` and `content-browser-smoke.mjs` pass with **no new data-layer removals**.
- Steps may be grouped under headings only if `loadGuides()` order is unchanged; the sequence smoke checks order.
- Any image transcribed into accessible markup follows §7:
  - the original image is kept as `ZoomImage`
  - a cell-by-cell comparison table is saved to `artifacts/phase-N/transcription-<name>.md`
  - unclear cells are marked unclear on the page
  - the user confirms before the original stops being primary

### Phase 2 — Origins (CHECKPOINT 2: sets direction for later maps)

**Approved direction (2026-10-31):** the "dig-site field sheet". Content is structured by a brass survey spine, type and colour, not glass cards. The four staff colours have fixed jobs. Artwork appears only in the title block. The Main Guide carries a staff board; each staff page follows Build / Puzzle / Upgrade. Reference mockups (not code): `artifacts/phase-2/mockup/` (gitignored).

**User decisions (2026-10-31):**
- **Switch board:** the Lightning switch board leaves the Main Guide. Its only home is the Lightning page, and the Main Guide links to it from step 2.
- **Tracker lines:** tracking-only task lines are removed and listed as approved removals.
- **Ice ordering:**
  - The three gravestones are unordered locations.
  - The Crazy Place symbol puzzle is sequence-sensitive: follow the game's displayed order and use the chart to convert each dot pattern.
  - Neither page may imply a gravestone order, and no location fact may change.
- **Excavation rings:** one shared ring reference for all four staffs (same four rings and levers; Ice blue, Fire red, Wind yellow, Lightning purple; then shoot the matching orb). It is not Lightning's seven panel switches. Lever→ring labels may be used only where existing source data states them.
- **Achievement:** the hidden achievement is retitled "Circuit Complete" (id unchanged).
- **Type:** no new font files. Rajdhani plus the system UI font only.

**Design tokens.** Declared once in `maps/origins/src/Styles/origins-tokens.css` on `.origins-module`, so they are scoped by PostCSS:

| Token | Value | Job |
|---|---|---|
| `--o-ground` | `#0F1A17` | page ground (trench) |
| `--o-ground-2` | `#16231F` | title block, raised bands |
| `--o-ink` | `#EEF2EC` | answers, titles |
| `--o-muted` | `#9DB0A7` | labels, secondary text (≥ 4.5:1 on ground) |
| `--o-brass` | `#C9A45C` | sequence spine, step markers, section rules |
| `--o-steel` | `#7CC4F2` | navigation, links, focus |
| `--o-warn` | `#FFB24D` | warnings only |
| `--o-ice` / `--o-fire` / `--o-wind` / `--o-lightning` | `#78E8E1` / `#FF7844` / `#FFE657` / `#D8A8FF` | that staff only |

**Type scale:**
- Rajdhani 700 for the wordmark (clamp 48–104px), staff names and labels (12–15px, uppercase, tracked).
- Rajdhani 700 at 23–26px for step titles.
- `system-ui` for answers (17–18px, weight 500), body (16–17px) and secondary text (15px).

**Visual guardrails** (checked in Task 2.6 and at the checkpoint):
- Contour lines stay at most 0.07 opacity.
- Staff colour appears only on staff names, rules or bands up to 6px, ticks and icons. Never as a fill larger than a 6px band, and never on body text.
- No `backdrop-filter` and no full-page artwork behind body text.
- Body text is never Rajdhani.

### Task 2.0: Preflight and "Circuit Complete"

**Files:**
- Modify: `shared/achievements/achievements.js` (title of `origins/speedrun-unlocked`)
- Modify: `maps/origins/src/components/ElectricalPanel.jsx` (reward heading)
- Modify: `scripts/browser-smoke.mjs` (expected text)

- [ ] **Step 1:** Confirm a clean `claude-forge` at or after this plan commit, then run GATE items 1–4 and record the counts in `artifacts/phase-2/baseline.txt`.
- [ ] **Step 2:** In `browser-smoke.mjs`, change the expected panel reward text to `'Circuit Complete'`. Run it. Expected: FAIL.
- [ ] **Step 3:**
  - Set the achievement `title: 'Circuit Complete'`, keeping the id and `legacyKey`.
  - Set the panel's reward `<strong>` to `Circuit Complete` and its kicker to `Electrical Panel`.
- [ ] **Step 4:** Run GATE items 1–4. Expected: PASS. Commit as `feat(origins): rename hidden achievement to Circuit Complete`.

### Task 2.1: Shared primitives (only what Origins needs)

**Files:**
- Create: `shared/guide/StepDetail.jsx`, `shared/guide/useHashLanding.js`, `shared/ui/ZoomImage.jsx`, `shared/ui/ZoomImage.css`, `shared/ui/tokens.css`
- Modify: `shared/guide/GuideSteps.jsx` (consumes `StepMore` and `useHashLanding`; output must not change)
- Modify: `apps/hub/src/main.jsx` (import `shared/ui/tokens.css` once)

**Interfaces (produces):**
- **`StepMore({ step, problems?, links?, summary?: string = 'More on this step' })`**
  - Renders the existing `details.guide-seq__more` (how / video / links / nested "Not working?").
  - Returns `null` when there is nothing to show.
  - `problems` and `links` default to the step's own.
- **`useHashLanding(ids: string[]): void`** — the landing logic now inside `GuideSteps`, moved verbatim:
  - safe decode;
  - legacy `?ref`;
  - waits for fonts;
  - instant scroll;
  - clears pinned headers.
- **`ZoomImage({ src, alt, width, height, caption?, className? })`**
  - **Markup:** `<figure class="zoom-image">` with a `<button>` named "Enlarge: {alt}" wrapping the `<img>`, then an optional `<figcaption>`.
  - **Full screen:** the button opens a `<dialog class="zoom-image__dialog">` showing the image at up to 100vw × 100vh with `touch-action: pinch-zoom`. Close with a 48px "Close" button, Esc, or a backdrop tap. Focus returns to the trigger.
  - **Motion:** honours `prefers-reduced-motion` (no zoom animation).
- **`shared/ui/tokens.css`** (global, tiny):
  - `:root { --zh-tap: 48px; --zh-focus-width: 3px; }`
  - `@media (prefers-reduced-transparency: reduce) { :root { --zh-transparency: 0; } }`

- [ ] **Step 1:** Extract `StepMore` and `useHashLanding` from `GuideSteps.jsx` without behaviour changes.
- [ ] **Step 2:** Run GATE items 3–4. Expected: PASS with identical counts. Every other map still renders through `GuideSteps`, and `content-browser-smoke` passes with no new removals.
- [ ] **Step 3:** Add `ZoomImage` and `tokens.css`. They are covered by the Origins smoke in Task 2.5; no consumer exists yet.
- [ ] **Step 4:** Commit as `refactor(guide): StepMore, useHashLanding and ZoomImage primitives`.

### Task 2.2: Origins content model (data only, no visual change yet)

**Files:**
- Modify: `maps/origins/src/data/originsGuide.jsx`
- Create: `maps/origins/src/data/originsStaffPages.js`
- Modify: `scripts/origins-guide-health.test.mjs` (read facts from the new data file instead of the `.tsx` sources)
- Modify: `scripts/fixtures/approved-removals.json`
- Test: `scripts/origins-content.test.mjs` (new)

**Interfaces (produces), used by Tasks 2.4 and 2.5:**
- **`originsGuide`:** the same 11 steps, ids and order, with these changes:
  - **Tracker `tasks` removed** from `build-staffs`, `upgrade-staffs`, `secure-keys` and `thunder-fists`. Their facts already exist in the steps' refs ("Odin · middle robot", "Gen 5 footprint", …).
  - **Ice upgrade tab refs split:**
    - `{ type: 'list', unordered: true, items: ['Crazy Place: match blue-dot pillar → ceiling stone, shoot it', 'Freeze 3 gravestones → shatter with bullets'] }`
    - then `{ type: 'list', items: ['Excavation rings all BLUE → shoot the orb', 'Blue pedestal → kill zombies to charge'] }`
    - The strings are unchanged. `unordered` means "render without numbering". It makes no claim about relative order: the two pages currently disagree, and you only confirmed that the gravestones are unordered.
  - **New:** a `link` on the Lightning upgrade tab, `{ to: '/maps/origins/lightning-staff#switches', label: 'Switch board' }`. The `custom` switch-board ref is removed from the tab (its home is the Lightning page).
- **`originsStaffPages`:** `{ ice, fire, wind, lightning }`. Each is:
  - `{ name, tone, build: [{ k, v }], puzzle: { chart: { src, alt, width, height }, steps: string[], note?: string }, upgrade: { anyOrder?: { label, text }, steps: string[] }, ringColour: 'BLUE'|'RED'|'YELLOW'|'PURPLE' }`
  - Every `k` / `v` / step string is copied verbatim from the current `IceStaff.tsx`, `FireStaff.tsx`, `WindStaff.tsx` and `LightningStaff.tsx`. The `k` labels drop the trailing colon ("Part 1:" → "Part 1").
  - **Ice:**
    - `upgrade.anyOrder = { label: 'Any order', text: 'Find all three gravestones on the main map, freeze each one with the Ice Staff, then shoot the frozen stone with a normal bullet weapon to break it.' }`
    - `puzzle.note = 'The pillar order is different every game. Follow the order the game shows, and use the chart to turn each dot pattern into its ceiling stone.'` (user-provided, 2026-10-31)
  - **Lightning:** `puzzle` also carries `pianoCode` from `shared/data/originsLightning.js`.
  - **Chart alt text** describes structure only, never transcribes. Ice example: "Ice Staff code chart: twelve pairs, each a dot pattern on a pillar beside the ceiling-stone symbol to shoot."

**Steps:**
- [ ] **Step 1: Write `scripts/origins-content.test.mjs`** (uses `loadGuides()` plus Vite `ssrLoadModule` for `originsStaffPages.js`):
  - `test('origins keeps 11 steps in order')`: ids equal the baseline.
  - `test('no tracker-only task lines remain in Origins')`: no step has `tasks`; none of the 16 tracker labels appears in `guideStrings(origins)`.
  - `test('the facts behind removed tracker lines are still in the steps')`: `guideStrings(origins)` contains each of 'Odin · middle robot', 'Freya · Church / Gen 6 robot', 'Thor · spawn / Gen 1–3 robot', 'Pedestal at the bottom of the mound', 'Gen 5 footprint', 'Mound footprint', 'Gen 6 footprint' and 'Footprint behind Juggernog'.
  - `test('Ice puzzle and gravestones are distinguished')`: the Ice tab has exactly one `unordered: true` list containing both strings; `originsStaffPages.ice.upgrade.anyOrder.label === 'Any order'`; `originsStaffPages.ice.puzzle.note` matches `/Follow the order the game shows/`.
  - `test('the switch board is linked, not embedded, on the Main Guide')`: no `custom` ref remains in `upgrade-staffs`; the Lightning tab links to `/maps/origins/lightning-staff#switches`.
  - `test('staff pages keep every line they had')`: a fixture captured in Step 2, `scripts/fixtures/origins-staff-pages.baseline.json` (every `<li>` text and `<strong>` label in the four `.tsx` pages at this commit, trimmed), is fully contained in `originsStaffPages` strings, with labels compared without their trailing colon.
- [ ] **Step 2:** Capture `origins-staff-pages.baseline.json` with a one-off script that reads the four `.tsx` files (regex over `<li>…</li>`, tags stripped). Commit it with the test. Run the test. Expected: FAIL.
- [ ] **Step 3:** Edit `originsGuide.jsx`, create `originsStaffPages.js`, and point `origins-guide-health.test.mjs` at the data file (same regexes).
- [ ] **Step 4: Approved removals.** Add `layer: "data"` entries for the 16 tracker labels:
  - "Ice built", "Fire built", "Wind built", "Lightning built"
  - "Ice upgraded", "Fire upgraded", "Wind upgraded", "Lightning upgraded"
  - "Wind → Odin", "Ice → Freya", "Lightning → Thor", "Fire → mound"
  - "Gen 5 chest", "Mound chest", "Gen 6 chest", "Juggernog chest"
  - Reason: "tracker-only line; user decision 2026-10-31; underlying fact kept in refs".
  - Run `npm test`. Expected: PASS.
- [ ] **Step 5:** Commit as `refactor(origins): content model for the field-sheet redesign`.

> Note: until Task 2.4 lands, the Phase-1 `GuideSteps` still renders Origins. The Lightning tab then shows a "Switch board" link instead of the board. That is acceptable for this intermediate local commit and is covered by Task 2.4's smoke.

### Task 2.3: Shell, title block and elemental nav plates

**Files:**
- Modify: `maps/origins/routes/OriginsRoutes.jsx` (drop the `--origins-bg` full-page artwork)
- Modify: `maps/origins/src/components/{Header,Nav,Footer}.tsx`
- Rewrite: `maps/origins/styles/origins-shell.css`, `maps/origins/src/Styles/ComponentStyles/{Header,Nav,Footer}.css`
- Create: `maps/origins/src/Styles/origins-tokens.css`
- Test: `scripts/origins-browser-smoke.mjs` (new; added to `test:browser` before `content-browser-smoke.mjs`)

**Design:**
- **Header:**
  - `<header class="origins-mast">` with `<h1>Origins</h1>`, the subtitle "Little Lost Girl" and the eyebrow "Main Easter Egg".
  - The robot (`Robot.webp`) is cropped right, duotone (grayscale + darkened), behind a diagonal clip.
  - Height: about 210px desktop, about 100px phone, about 64px landscape. It scrolls away.
- **Nav (`<nav class="origins-plates">`):** six equal cells (Guide, Ice, Fire, Wind, Lightning, Speed Run) with an icon plus label.
  - **Phone:** icon over a short label ("Light", "Speed"), at least 56px tall.
  - **Active cell:** `aria-current="page"` and a 4px underline in the cell's colour.
  - **Pinned** under the hub bar on desktop and phone; in flow at 844×390.
- **Footer:** one quiet line on the ground, no backdrop art.
- **Ground:** `--o-ground` plus a contour SVG at most 0.07 opacity, as `.origins-module` background. Nothing else sits behind content.

**Steps:**
- [ ] **Step 1: Write `origins-browser-smoke.mjs` shell checks** (every viewport, every Origins route):
  - `h1` text is "Origins".
  - `.origins-plates a` count is 6, labels in order, last is Speed Run.
  - Exactly one has `aria-current="page"`, matching the route.
  - Every cell is ≥ 48px tall and fully inside the viewport (no clipping, no row scrolling).
  - Pinned elements below the hub bar total ≤ 64px at phone and desktop and 0 at landscape.
  - No element in `main` has a non-`none` `backdrop-filter`.
  - No horizontal overflow.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement. Update the `browser-smoke.mjs` Origins header block to the new selectors (`.origins-mast h1`, `.origins-plates a`) with the same intent: title unclipped, active item in view, Speed Run last.
- [ ] **Step 4:** Run GATE items 3–4. List the rendered-text differences with `/tmp` `missing.mjs`. Add each chrome-only difference ("Origins Easter Egg", "Main Guide", "Ice Staff" nav labels, …) to `approved-removals.json` with its reason. **Any guide fact is a stop-and-ask.**
- [ ] **Step 5:** Commit as `feat(origins): field-sheet shell, title block and elemental nav plates`.

### Task 2.4: Main Guide run sheet and staff board

**Files:**
- Create: `maps/origins/src/components/RunSheet.jsx`, `maps/origins/src/components/StaffBoard.jsx`
- Rewrite: `maps/origins/src/Pages/MainGuide.tsx`, `maps/origins/src/Styles/PageStyles/MainGuide.css`
- Modify: `scripts/origins-browser-smoke.mjs`
- Modify: `scripts/guide-sequence-browser-smoke.mjs` (Origins leaves the generic per-guide loop; the tabs check moves to Revelations `#servant`; cold deep link and malformed-hash checks stay on Origins via `getElementById`)
- Modify: `scripts/achievements-browser-smoke.mjs` and `scripts/browser-smoke.mjs` (Origins selectors only)

**Interfaces:**
- **`RunSheet({ steps, staffBoard, footer })`** renders:
  - `<section class="run-sheet" aria-labelledby="run-sheet-title">`
  - a visually hidden `<h2 id="run-sheet-title">Little Lost Girl</h2>`
  - `<ol class="run-sheet__steps">` of `<li class="run-step" id={step.id}>` with:
    - `<span class="run-step__n">` (brass marker; the staff steps 1–2 get a four-colour ring around a dark centre)
    - `<h3>{title}</h3>`
    - `<p class="run-step__answer">{goal}</p>`
    - warnings, then refs through `GuideReferences` (styled as ticks and trails under `.origins-module`)
    - `StepMore`, with summary "How to …" for steps 1–2 and "More" otherwise
  - Uses `useHashLanding(ids)`.
- **`StaffBoard({ step, mode: 'build' | 'upgrade' })`** reads the tabs ref of `build-staffs` or `upgrade-staffs`:
  - **Desktop build board:** `<aside class="staff-board">` with four `<section class="staff-board__staff" data-staff>`, each with its name, a 6px band, a "{Name} Staff page" link to `/maps/origins/{id}-staff`, and a `dl` of its facts.
  - **Upgrade mode:** four columns, each a colour-topped rule with the staff name, an unnumbered bullet group (no label, no order claim) when `unordered`, the remaining items as an ordered list, and the tab's `links` (Lightning → "Switch board").
  - **Phone and landscape:** each staff is a `<details class="staff-row">` with a `<summary>` at least 52px tall showing the staff name and a "+" / "−" indicator (open state also gets `--o-ground-2` background and a 6px band), closed by default. Any number can be open.
- **`MainGuide.tsx`** = `RunSheet` + `CompleteEasterEgg` footer + the existing "Credits + radio audio" `<details>` (unchanged text and audio).

**Layout:**
- **Desktop ≥ 1100px:** two columns, run sheet `minmax(0, 1fr)` and board 360–400px.
  - The board is sticky only when it fits (`max-height` = viewport − pinned chrome − 24px); otherwise it scrolls with the page.
  - The run sheet keeps at least 640px of reading width at 1440.
- **Phone:** one column; step 1 shows the build rows inline, step 2 the upgrade rows.
- **Landscape:** one column; staff rows in a 2×2 grid; step 2 upgrade columns 4-up.

**Steps:**
- [ ] **Step 1: Extend `origins-browser-smoke.mjs` for `/maps/origins`** (all viewports):
  - `li.run-step` ids and `h3` titles equal the data, in order.
  - Every `goal` is visible without opening anything.
  - `.switch-board` count is 0.
  - None of the 16 tracker labels is in `main` text.
  - The `#upgrade-staffs` Lightning column links to `/maps/origins/lightning-staff#switches`.
  - Each staff has a link to its staff page.
  - The Ice upgrade column shows both prerequisite lines in one unnumbered `ul` with no order wording.
  - The piano code '1 · 3 · 6', '3 · 5 · 7', '2 · 4 · 6' is visible in the Lightning upgrade column.
  - The credits `<details>` exists with 2 named audio controls.
  - "I completed this Easter Egg" is present.
  - **Desktop:**
    - `.staff-board` width ≤ 400px;
    - run sheet width ≥ 640px;
    - board height ≤ viewport height − pinned bottom − 24 when sticky;
    - steps' body text ≥ 16px and Rajdhani is not used for `.run-step__answer`.
  - **Phone and landscape:**
    - 4 `details.staff-row` in step 1 and 4 in step 2, all closed;
    - each summary ≥ 52px;
    - clicking opens it (`open` set; the indicator changes to "−") and shows its facts; opening a second leaves the first open;
    - first step title fully in the first viewport;
    - `#secure-keys` top < 2 × viewport height on phone and < 3 × viewport height at landscape.
  - **Contrast:** answer, body and muted label colours ≥ 4.5:1 against `--o-ground` (computed colours).
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement `RunSheet`, `StaffBoard`, `MainGuide.tsx` and `MainGuide.css`. Delete the Phase-1 Origins guide rules and the 7 dead `.guide-mode__secret` / `.speedrun-gate` rules.
- [ ] **Step 4:** Migrate the other smokes listed under Files. Run GATE items 1–4.
- [ ] **Step 5:** Content review.
  - The rendered `/maps/origins` differences must be only the switch-board text (approved: "moved to `/maps/origins/lightning-staff`", one entry per string, `routes: ['/maps/origins']`) and chrome.
  - Code-chart `alt` strings are not text nodes; the charts' single home is now their staff pages (verified in Task 2.5).
  - **Anything else is stop-and-ask.**
- [ ] **Step 6:** Commit as `feat(origins): run sheet on the survey spine with the staff board`.

### Task 2.5: Staff pages (Build / Puzzle / Upgrade)

**Files:**
- Create: `maps/origins/src/components/StaffPage.jsx`, `maps/origins/src/components/ExcavationRings.jsx`, `maps/origins/src/Styles/PageStyles/StaffPage.css`
- Rewrite: `maps/origins/src/Pages/{IceStaff,FireStaff,WindStaff,LightningStaff}.tsx` (each renders `StaffPage` with its `originsStaffPages` entry; Lightning adds its tools)
- Delete: `maps/origins/src/Styles/PageStyles/{IceStaff,FireStaff,WindStaff,LightningStaff}.css`
- Modify: `maps/origins/src/components/LightningSwitchBoard.jsx` (wrapper gets `id="switches"`; behaviour unchanged)
- Modify: `scripts/origins-browser-smoke.mjs`, `scripts/browser-smoke.mjs` (staff-guide headings)

**Interfaces:**
- **`StaffPage({ staff, tools? })`** renders:
  - `<h2 class="staff-hero" data-staff>` with "{Name} Staff", plus jump links Build / Puzzle / Upgrade (`#build`, `#puzzle`, `#upgrade`, each ≥ 44px);
  - `<section id="build">`: a `dl` of `build`;
  - `<section id="puzzle">`:
    - Ice / Fire / Wind: `ZoomImage(chart)`, then `steps` as an `ol`, then `note`;
    - Lightning: the piano chord chips, then `tools` (switch board with `id="switches"`, then the existing Speed Run link slot), then `ZoomImage(chart)`, then the Electrical Panel;
  - `<section id="upgrade">`: the `anyOrder` group (label "Any order" plus text, unnumbered) if present, then `steps` as an `ol`, then `ExcavationRings`.
- **Layout:**
  - **Desktop:** Build and Upgrade on the left; Puzzle sticky on the right while it fits the viewport.
  - **Phone:** Build, then Puzzle, then Upgrade.
  - **Landscape:** two columns, chart height capped at 250px, tap to enlarge.
- **`ExcavationRings({ colour: 'BLUE'|'RED'|'YELLOW'|'PURPLE', tone })`**
  - **Diagram:** an inline SVG of four stacked rings drawn in `tone`, numbered 1–4 top to bottom, with `role="img"` and an `aria-label` naming the ring colour target.
  - **No new caption:** the staff's own upgrade steps directly above already say it. The shared ring/orb system is user-confirmed (2026-10-31).
  - **Lever text:**
    - Below the caption, the existing `originsExcavationRingReference.levers` sentences verbatim, labelled "Lever positions (from the Lightning ring reference)".
    - Rings 3–4 stay grouped exactly as the source states. No per-lever labels are added that the source does not contain.
    - If you veto these sentences at the checkpoint, the diagram ships without them.

**Steps:**
- [ ] **Step 1: Extend `origins-browser-smoke.mjs` for each staff page** (all viewports):
  - `#build`, `#puzzle` and `#upgrade` exist in document order on phone.
  - Every baseline line of that staff (from `origins-staff-pages.baseline.json`) is in `main` text.
  - **The chart:**
    - its button opens `dialog.zoom-image__dialog[open]`;
    - the dialog image is ≥ 90% of the viewport width at phone;
    - Esc closes it and focus returns to the button;
    - the 48px Close button also closes it.
  - `ExcavationRings` is present with the right colour word and 4 ring shapes.
  - **Ice:** contains "Any order" next to the gravestone text, and `#puzzle` contains "Follow the order the game shows".
  - **Lightning:** `#switches` exists with 7 dials; the piano code is visible; the Electrical Panel is present; the Speed Run link is present.
  - **Desktop:** `#puzzle` is in the first viewport.
  - **Phone:** the chart is ≥ 340px wide.
  - **Landscape:** the chart is ≤ 260px tall and inside the viewport after jumping to `#puzzle`.
  - Section headings are not Rajdhani-only body text: body ≥ 16px system font.
  - No horizontal overflow.
- [ ] **Step 2:** Run it. Expected: FAIL.
- [ ] **Step 3:** Implement.
- [ ] **Step 4:** Update `browser-smoke.mjs` `originsStaffGuides` headings to the new hero text (same `required` regexes). Run GATE items 1–4.
- [ ] **Step 5:** Content review. Staff-page rendered differences may only be heading chrome ("Ice Staff Parts", "Crazy Place & Code", "Piano Code Chart", …) and label colons ("Part 1:" → "Part 1"), approved one per string with a reason. **Anything else is stop-and-ask.**
- [ ] **Step 6:** Commit as `feat(origins): Build / Puzzle / Upgrade staff pages with zoomable charts and ring reference`.

### Task 2.6: Verification, review, Checkpoint 2

- [ ] **Step 1:** Full GATE.
- [ ] **Step 2: Playwright MCP** at 1440×900, 390×844 and 844×390 on `/maps/origins`, all four staff pages, Speed Run and `/maps/origins#upgrade-staffs`. Screenshots go to `artifacts/phase-2/after/`, including a side-by-side with `artifacts/phase-2/audit/`.
  - **Three-second test:** on each screen, can a player find the answer in about three seconds?
  - **Guardrail audit:**
    - contour opacity at most 0.07;
    - no staff-colour fills over 6px;
    - no glass panels;
    - body text in the system font at 16px or larger;
    - the desktop board doesn't steal reading width;
    - staff rows clearly show open and closed states.
- [ ] **Step 3:** Speed Run regression check. Its pages render on the new ground with no overflow and their smokes pass (visual restyle is out of scope).
- [ ] **Step 4:** Run built-in `/code-review` on the Phase 2 range. Fix Critical/Important findings test-first; ledger Minors.
- [ ] **Step 5:** Push and record in the ledger.
- [ ] **Step 6: CHECKPOINT 2.** Report to the user:
  - gate results and test counts;
  - before/after screenshots at three viewports for the Main Guide and all four staff pages;
  - measured positions (first step, step 3);
  - the `approved-removals.json` diff;
  - review findings;
  - deviations from this plan.
  - **Stop until approval.** Do not start Revelations.

### Phase 3 — Revelations (CHECKPOINT 3: proves a different structure works)

- **Likely files:**
  - `maps/revelations/src/pages/*.jsx`, `maps/revelations/src/components/{Header,GuideVideoPlayer,RevSectionHeader,RevOptionList}.jsx`
  - `maps/revelations/src/styles/*.css`, `maps/revelations/src/global.css`
  - new `maps/revelations/src/components/StepMasterDetail.jsx`
  - first use of `useStepHash`
- **Target:** desktop master/detail (12 steps on the left, the hash-selected step on the right); a single-open accordion on phones; the existing layering is preserved; one media/timestamp pattern across Apothicon, Eggs, Summoning Key and Sound Step.
- **Tests:**
  - opening a step on a phone closes the previous one
  - the hash selects the step on desktop and survives reload
  - the back button returns to the previous step
  - the Kronorium `RunNote` still persists
- **Content checks:** rendered baselines of the four section pages, plus video timestamps listed by data equality.

### Phase 4 — Gorod Krovi (CHECKPOINT 4)

- **Likely files:** `maps/gorod-krovi/src/pages/{MainGuide,ValveSolver,TrophyChallenges,BossFight,Buildables}.jsx`, `maps/gorod-krovi/src/components/Header.jsx`, `maps/gorod-krovi/src/styles/*.css`, and possibly `maps/gorod-krovi/src/data/gorodRun.js` (read only).
- **Target:** reduce visual competition first (dimmed or blurred backdrop, one solid reading surface, type hierarchy). Group the sequence under chapters in data order. The Valve Solver stays in the map nav and is linked from the valve step. No new controls.
- **Content checks:**
  - `valveSolutions.js` is unchanged (`git diff --exit-code`)
  - the existing `gorod-browser-smoke` solver interactions pass
  - rendered baselines of the trophy, boss and buildables pages
- **Contrast check:** foreground surfaces measured ≥ 4.5:1 over the artwork in all three viewports.

### Phase 5 — Der Eisendrache (CHECKPOINT 5)

- **Likely files:** `maps/der-eisendrache/src/pages/{Home,Wisp,Parts,BossFight}.tsx`, `maps/der-eisendrache/src/pages/bows/*.tsx`, `maps/der-eisendrache/src/components/{BowGuide,BowNav,NavBar,Header}.tsx`, `maps/der-eisendrache/src/data/{bowGuides.ts,bowData/*.ts}` (read only), `maps/der-eisendrache/src/styles/**`.
- **Target:**
  - The Main Quest is quest-first. The bow step states the lobby rule and links straight to each bow.
  - Bows become one area with Storm / Fire / Wolf / Void as direct sub-pages, each an ordered mini-guide. The overview card grid and the nested "Bow path" bar are deleted.
  - Wisps, Gear and Boss stay. `SafeCodeNote` survives.
- **Content checks:**
  - every `bowData/*.ts` string is present on its bow page (extend `guide-content.mjs` with a `bows` loader)
  - existing redirects and the `/bows` index keep working, or redirect to Storm with an approved note
  - wisp timestamps unchanged

### Phase 6 — Zetsubou No Shima (CHECKPOINT 6)

- **Likely files:** `maps/zetsubou-no-shima/src/pages/*.jsx`, `maps/zetsubou-no-shima/src/components/{Nav,CogGuidePage,CogSteps/*}.jsx`, `maps/zetsubou-no-shima/routes/ZetsubouRoutes.jsx`, `maps/zetsubou-no-shima/src/styles/*.css`.
- **Target:** nav reduced to Main Guide | Cogs | Buildables | Boss. Cogs 1–3 on one page with no slider.
- **Gate for consolidation:**
  - Before folding Prerequisites or Reveal Blueprint, produce `artifacts/phase-6/zets-fold-diff.md`, listing every rendered segment of those pages and where it appears in the sequence.
  - A segment with no home is moved into step data as an approved addition (a data change shown to the user), never dropped.
  - Old routes redirect to the matching `#step`.
- **Extras page:** stays unless the user approves otherwise.

### Phase 7 — Shadows of Evil (CHECKPOINT 7)

- **Likely files:** `maps/shadows-of-evil/src/pages/MainGuide.jsx`, `maps/shadows-of-evil/src/components/{Header,Footer}.jsx`, `maps/shadows-of-evil/src/styles/{Shadows,MainGuide}.css`, `maps/shadows-of-evil/src/data/soeGuideSteps.jsx` (moving where `PickTool`/`RunNote` render is a presentation change; their options data is untouched).
- **Target:** a single page with a "Your game" panel (character → Keeper room `PickTool`, plus train symbols `RunNote`). The panel sits beside the sequence on desktop and at the top on phones.
- **Tests:**
  - choosing a character shows the same Keeper answer as baseline for all four characters
  - symbols persist across reload
  - `MAPS['shadows-of-evil'].keys` clear behaviour is unchanged
- **CSS:** all new selectors live under `.shadows-module`; `css-scope.test` covers it.

### Phase 8 — Mob of the Dead (CHECKPOINT 8)

- **Likely files:** `maps/mob-of-the-dead/src/pages/*.jsx`, `maps/mob-of-the-dead/src/components/{Header,Nav,MobSectionPage}.jsx`, `maps/mob-of-the-dead/src/styles/*.css`, `maps/mob-of-the-dead/src/data/{mobGuide.js,mobGuideSteps.jsx}` (read only).
- **Target:** the sequence grouped by the three bridge trips in data order; the codes `101 · 386 · 872 · 481` shown large wherever needed; the Plane, Retriever + Skulls, Codes and Final pages lose card-in-card nesting.
- **Content checks:**
  - the four codes appear verbatim on both the main guide and the Codes page
  - existing Mob redirects (`free-blundergat`, `spoon`, `redeemer`, `logs`) still resolve

### Phase 9 — Independent critique (later, separate approval)

Impeccable or a similar critique pass across all pages, including Kino. It covers visual polish only, with no structural changes unless separately approved. It is not started from this plan.

---

## Risks found while planning

| Risk | Handling |
|---|---|
| Kino facts live only in task hints | The Task 1.4 smoke asserts every task label and hint is rendered. |
| Today's "Reset all progress" also clears saved notes (SoE picks and symbols, DE safe code, Kronorium symbols) | Per §4.4 the replacement "Clear old guide data" clears only legacy machinery keys, so notes are no longer wiped by it. Flagged at Checkpoint 1; a separate notes-clear control would need approval. |
| The hash deep link races the lazy chunk (`RootLayout` scrolls before the map renders) | `GuideSteps` scrolls on mount; the cold-load smoke covers it. |
| The fixed hub header hides anchored steps | `scroll-margin-top` plus the smoke's header-bottom check. |
| DE's header is `position: fixed` with a spacer, unlike the other maps | Handled explicitly in Task 1.7. |
| Phase 1 holding layout loses Revelations' desktop rail until Phase 3 | Accepted in §4.2; shown at Checkpoint 1. |
| The Electrical Panel achievement title is user-visible copy | `'Electrical Panel Solved'` is proposed; the id is unchanged so earned records survive. The user can veto at Checkpoint 1. |
| The Vite SSR loader breaks if a data module touches `window` at import | All 8 load today. If a later module does, the loader stubs `globalThis.window` before import; never edit data to suit the test. |
| Rendered baselines include chrome that legitimately changes per phase | Every removal must be listed in `approved-removals.json` with a reason and spec section. Fact removals stop for the user. |
| Landscape map pages may still show little guide content after Phase 1 | Measured and reported, not asserted, in Phase 1. Asserted per map in its own phase. |
