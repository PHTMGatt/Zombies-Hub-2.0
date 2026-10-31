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

- **Likely files:**
  - `maps/origins/src/Pages/{MainGuide,IceStaff,FireStaff,WindStaff,LightningStaff}.tsx`
  - `maps/origins/src/components/{Header,Nav}.tsx`
  - `maps/origins/src/Styles/PageStyles/*.css`, `maps/origins/src/Styles/ComponentStyles/{Header,Nav}.css`
  - new `maps/origins/src/components/RunSheet.jsx` (map-specific, not shared)
  - first use of `StepDetail`, `ZoomImage` and `tokens.css`
- **Target:** a compact 11-row run sheet showing each step's Depth 1 answer, with tap or click for Depth 2.
  - The desktop side column holds the setup reference (staff → robot/pedestal, soul chests), taken from existing data.
  - Nav: Main Guide | Ice | Fire | Wind | Lightning | Speed Run.
  - Staff pages become mini-guides (parts → Crazy Place puzzle → upgrade). Lightning's switch board and code is the primary visual. Ice, Fire and Wind code charts use `ZoomImage`.
- **Content checks:**
  - rendered baselines for the four staff pages and Speed Run
  - the existing `origins-guide-health.test.mjs` source assertions still pass
  - any code-chart transcription follows §7
- **Landscape:** the first run-sheet row is inside 844×390; this becomes an assertion.

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
