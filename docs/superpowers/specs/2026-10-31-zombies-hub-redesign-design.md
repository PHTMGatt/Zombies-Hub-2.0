# Zombies Hub 2.0 — Guide Redesign Design Spec

Date: 2026-10-31 · Branch: `claude-forge` · Status: awaiting approval

Authority: the product brief of 2026-10-31 and its approved audit. Where `docs/polish-roadmap.md` conflicts (notably its "same underlying wireframe for every map"), this spec and the brief win.

## 1. Purpose

Make Zombies Hub the easiest Easter Egg guide to use while someone is actually playing.

Loop: **look → understand → do it → keep playing.** A screen succeeds when the answer can be found in about three seconds by a first-timer, a rusty player or an expert.

Model: **one sequence, multiple depths, no modes.**

- **Depth 1:** the step title plus the immediate answer (code, order, location, symbol).
- **Depth 2:** why, where, timing and caveats, shown on demand.
- **Depth 3:** a dedicated mechanic page for systems too large for the sequence (staffs, bows, valves, cogs, codes).

## 2. Audit findings this spec acts on

1. `shared/guide/GuideSteps.jsx` renders the Main Guide of all seven maps, plus Kino's Side EE page. It contains the modes, progress, Mark-done, prev/next, Track-it, swipe rail, Quick-refs sheet, progress menu, finish panel and auto-scroll. It is the source of both the machinery and the structural uniformity.
2. The step data files (`maps/*/src/data/*GuideSteps.jsx`, `originsGuide.jsx`) carry `goal`, `refs`, `how`, `problems`, `critical`, `links`, `video`. That already maps onto Depth 1/2. `shared/guide/GuideReferences.jsx` renders refs well. Both are kept.
3. Rendered measurements (preview build, 2026-10-31):
   - **390×844:** 18–29 controls render above the first step title, which lands at y≈405–577. The sticky hub header (90px) plus the sticky Mark-done bar (72px) take 162px.
   - **844×390:** the first step title lands at y≈285–359, so there is effectively no guide content in the first viewport. Home's headline is at y=372. The Origins tab row clips "Lightning Staff".
4. Locked or gated content:
   - The Origins "???" Speedrun mode, the hidden Speed Run nav tab, and the `SpeedRunLayout` lock screen (`SpeedrunGate`).
   - Main-EE achievements unlock only via per-step completion.
   - Home `ContinueRuns` and the Achievements page per-map "N / M steps" bars read step progress.
5. **CSS scoping.**
   - Origins and Shadows of Evil are not in the PostCSS auto-scope list, but are **manually scoped today and do not leak**. A PostCSS parse found 0 of 366 Origins selectors and 0 of 48 Shadows selectors unscoped.
   - The risk is that this is not enforced.
   - `shared/guide/guide.css` (1,498 lines, global by design) is what carries the generic card look into every map.

## 3. Principles (non-negotiable)

- **Content is sacred.** No step, code, symbol, switch state, solver datum, timing, location, prerequisite or timestamp is dropped, reordered or reworded as a side effect of presentation work. Grouping steps under headings is allowed only when order is preserved.
  - The single approved content edit: delete the Origins line "Speedrun mode unlocks once every step is marked done.", because that behaviour is being removed.
- **No gate on information.** Guide, step, mechanic and Speed Run access never depend on stored progress, achievements or completion.
- **Shared design language, not shared information architecture.** Shared parts are primitives (section 5). Page structure is chosen per map from its mechanics. No universal map template, not even temporarily as an architectural assumption.
- **Mobile is first-class.** 390×844 portrait and 844×390 landscape are designed for, not adapted to.
- **Accessibility as usability:**
  - semantic headings and visible focus
  - body text at least about 15px, step titles about 17–19px, at least 4.5:1 body contrast
  - tap targets about 48px where practical
  - diagrams labelled by more than colour, plus reduced-motion and reduced-transparency support
- **Delete before restyling.** Do not polish UI that should not exist.
- **Atmosphere may vary; readability and layer separation may not.** Four layers stay clearly distinct: global hub nav → map identity and nav → atmospheric body → readable foreground.

## 4. Phase 1 — shared deletion pass and CSS guard

Scope is deliberately narrow. Remove harmful shared machinery and render existing content in the simplest safe way until each map's own redesign. Phase 1 does **not** define the target layout of any map.

### 4.1 Remove

| Machinery | Where |
|---|---|
| Quick / Walkthrough depth switch, `useGuideDepth`, `zh-guide-mode` | `GuideSteps.jsx`, `useGuideProgress.js` |
| Origins Low / Medium / High + "???" Speedrun mode | `maps/origins/src/Pages/MainGuide.tsx` |
| Progress counter + meter, "Step NN of NN" meta | `GuideSteps.jsx` |
| Mark step done, ← / → buttons, sticky action bar | `GuideSteps.jsx`, `guide.css` |
| Track it task checkboxes (`tasks` UI) | `GuideSteps.jsx` |
| Swipe rail / "SWIPE · N STEPS" carousel | `GuideSteps.jsx`, `guide.css` |
| Progress options menu, finish panel, "Start new run" | `GuideSteps.jsx` |
| Auto-scroll to saved step, focus-on-step-change | `GuideSteps.jsx` |
| Quick refs sheet | `QuickRefs.jsx`, `QUICK_REFS` in each map page |
| `useGuideProgress` step state (`current`, `done`, toggles) | `useGuideProgress.js` and its callers |
| Speedrun gate: hidden nav tab, `SpeedrunLocked`, `SpeedrunGate.css` usage, unlock-by-completion | `Nav.tsx`, `SpeedRunLayout.jsx`, `MainGuide.tsx`, `SpeedrunGate.jsx`, `speedrunUnlock.js` |
| Home "Continue run" strip | `ContinueRuns.jsx`, `Home.jsx`, `activeRuns()` |
| Achievements page "N / M steps" progress bars | `apps/hub/src/pages/Achievements.jsx` |

The step `tasks` arrays stay in the data files, because they carry facts (for example "Engine — Der Eisendrache"). The interim renderer shows them as a plain non-interactive list where a step has no equivalent ref, so no fact disappears. Each map's redesign decides their final form.

### 4.2 Interim presentation (Phase 1 only)

The cut-down `GuideSteps` renders the existing step data as a plain ordered sequence: one `<ol>` in data order.

- **Each step (always visible):** the number, a title heading with an anchor `id`, the `goal`, `critical` warnings and `refs` (Depth 1).
- **Behind native `<details>`:** `how`, `video`, `problems` and `links` (Depth 2).
- **Tabs refs** keep their per-tab `problems`/`links`, with the selection held locally per step.
- **Nothing else:** no selection state, no rail, no stored state. The sticky bar and carousel CSS are removed from `guide.css`; remaining rules are trimmed to what this renderer uses.

This is a neutral holding state. Desktop Revelations will temporarily lose its rail-plus-panel look; that is accepted, because Revelations gets its intended master/detail in Phase 3.

### 4.3 Deep links

- Steps are addressable as `/maps/<map>#<stepId>`. Native anchors are enough in Phase 1. Later map layouts that select a step (for example Revelations master/detail) read the same hash.
- `shared/search/searchIndex.js` `ref()` changes from `?ref=<stepId>` to `#<stepId>`.
- Legacy `?ref=` URLs are redirected to the hash, so old links still land on the step.

### 4.4 Main-EE achievement action

- At the end of each map's sequence, there is one quiet, secondary action: **"I completed this Easter Egg"**. It is a plain text-style button that calls `unlockAchievement(mainAchievementFor(mapId).id)`. Once earned, it shows a small "Completed · View achievement" note.
- It never affects guide, step, mechanic or Speed Run access, or navigation. It is not a progress system: no counts, no per-step state.
- **Legacy data:** a one-time, silent `backfillAchievement` runs for any map whose stored legacy progress record shows every step done. After that, legacy progress keys are never read again. "Reset all progress" on the Achievements page becomes "Clear old guide data" and removes legacy keys.
- **Origins Speed Run:** always visible as the last Origins nav item; the route is always open. The Electrical Panel solve keeps unlocking the hidden `origins/speedrun-unlocked` achievement and gates nothing. The achievement's title or copy is adjusted so it no longer claims to unlock anything.

### 4.5 CSS guard

1. Build and save `dist/assets/*.css` as the baseline.
2. Add `['maps/origins/', '.origins-module']` and `['maps/shadows-of-evil/', '.shadows-module']` to `postcss.config.js`. `scopeSelector` returns a selector unchanged when it already contains the scope, so this should be a no-op today.
3. Rebuild and diff the CSS. Any difference is investigated before committing.
4. Update `CLAUDE.md`: Origins and Shadows are manually scoped and do not leak today; the risk was lack of enforcement; they are now enforced by PostCSS.

### 4.6 Short-viewport fixes (shared shell only)

- At `max-height: 500px`, the hub header is not sticky and is compact. Map headers are never sticky on short viewports.
- Home hero is reduced at `max-height: 500px` so the headline is in the first landscape viewport. Home loses the Continue strip and gains nothing in its place.

### 4.7 Tests

- **Delete:** checks that exist only to verify removed machinery (`run-mode-browser-smoke.mjs`; the Mark-done/progress parts of `achievements-browser-smoke.mjs` and the per-map smokes).
- **Add or replace with behavioural coverage:**
  - every step title of every map renders, with its anchor id
  - `#stepId` lands on that step; legacy `?ref=` redirects
  - no element matching the removed machinery exists (mode switch, Mark done, counter, swipe hint)
  - Origins Speed Run is visible in nav and its route renders content with empty storage
  - "I completed this Easter Egg" unlocks the main achievement and changes nothing else
  - Home has no Continue strip; no horizontal overflow
- **Add `844×390`** to the browser smoke viewports (`scripts/browser-smoke.mjs` and the per-map smokes that loop viewports).
- `npm test` guide-health tests keep checking content integrity. They gain a check that every step id is unique and anchor-safe.
- The old count of 156 browser checks is not a target. Meaningful coverage of new behaviour is.

## 5. Shared primitives (introduced only when a map first needs them)

| Primitive | Responsibility |
|---|---|
| `StepDetail` | Renders one step's Depth 1 + Depth 2 from existing step data via `GuideReferences`. No layout opinion. |
| `useStepHash` | Reads and writes the selected step id via `location.hash`; back button and deep links work. |
| `ZoomImage` | Reference image with tap-to-zoom and real alt text; the original source image is always kept. |
| Tokens (`shared/ui/tokens.css`) | Type scale, focus ring, tap-target minimum, surface/overlay layers, reduced-motion and reduced-transparency switches. Maps override accents and surfaces. |

Explicitly **not** shared: page layout, nav structure, step-list component, mechanic page layout.

## 6. Per-map designs (Phases 2–8)

Each map gets its own short design check against its content before building. Structures below are the approved directions.

### Phase 2 — Origins (usability reference)

- **Main Guide:** all 11 steps visible as a compact numbered run sheet, each row showing its Depth 1 answer; tap a row for Depth 2.
  - Desktop adds a side column for the setup reference (staff → robot/pedestal placement, soul chests), which comes from existing data.
- **Map nav:** Main Guide | Ice | Fire | Wind | Lightning | Speed Run. It must fit or wrap at 844×390 and 390×844, with no clipped items.
- **Staff pages:** focused mini-guides (parts → Crazy Place puzzle → upgrade).
  - **Lightning:** the existing switch board and code as the primary visual.
  - **Ice / Fire / Wind:** the code charts become `ZoomImage`. Any accessible transcription follows section 7.
- **Header:** visuals and copy tightened; the duplicated title is removed.

### Phase 3 — Revelations (visual reference)

- **Desktop:** master/detail. The 12 steps stay visible in order on the left; the selected step (`useStepHash`) shows on the right.
- **Phones:** a single-open accordion where all steps stay in sequence and opening one closes the previous. No carousel, no modes.
- **Visuals:** preserve the header, artwork and foreground layering.
- **Section pages:** Apothicon Upgrade, Egg Locations, Summoning Key and Sound Step share one media/timestamp pattern while keeping their different content types.

### Phase 4 — Gorod Krovi

- **Reduce visual competition first:** a dimmed or blurred backdrop, one solid reading surface, stronger type hierarchy and spacing.
- **Sequence:** grouped under labelled chapters, with data order unchanged.
- **Valve Solver:** stays one tap away in the map nav and is linked from the valve step. No new controls are added.

### Phase 5 — Der Eisendrache

- **Structure:** built around the bows.
  - The Main Quest covers the quest. The bow step states the lobby rule (ranked: one per player; local/unranked: all four) and links directly to each bow.
  - "Bows" becomes one area where Storm / Fire / Wolf / Void are direct sub-pages, each an ordered mini-guide. The overview card grid and nested "Bow path" bar go.
  - Wisps, Gear and Boss remain.
- Not "Origins with bows": DE's sequence is quest-first and its bow pages are routes, not puzzles.

### Phase 6 — Zetsubou No Shima

- **Nav target:** Main Guide | Cogs | Buildables | Boss.
- **Prerequisites and Reveal Blueprint pages** fold into the sequence **only after** a line-by-line diff proves every fact already exists there. Any fact found only on those pages is moved, not lost.
- **Cogs:** Cogs 1–3 become one page with the three cogs presented side by side or stacked. No slider.

### Phase 7 — Shadows of Evil

- **Main Guide:** a single page with 7 steps and a **"Your game" panel**. It holds the character → Keeper room `PickTool` and this game's train symbols `RunNote`, because those answers change per game.
  - Desktop: the panel sits beside the sequence. Phones: it sits at the top.
- **Extra pages** are added only if content demands them.
- Shadows CSS stays under `.shadows-module`, now enforced.

### Phase 8 — Mob of the Dead

- **Sequence:** grouped by the three bridge trips, with order unchanged.
- **Afterlife codes** 101 · 386 · 872 · 481 are shown large wherever needed.
- **Plane, Retriever + Skulls, Codes and Final pages** stay, without card-in-card nesting.

### Phase 9 — independent critique

Impeccable may be used only after Phases 1–8, as a separate critique and polish pass.

## 7. Visual reference transcription rule

When an image-only reference (staff code charts, symbol tables, switch diagrams) gets an accessible replacement:

1. Keep the original image available (zoomable) next to the replacement.
2. Transcribe it and compare it cell by cell against the source image at full resolution.
3. Mark any unclear cell as unclear in the UI and in the commit or PR notes. Never guess.
4. Ask the user to confirm the transcription before the original stops being the primary reference.

## 8. Verification per phase

- `npm test`, `npm run check`, `npm run build` and `npm run test:browser` all pass.
- Playwright MCP at **1440×900, 390×844 and 844×390** for every changed route.
  - **Checks:** reading order, how quickly the sequence appears, tap targets, overflow, header/nav height, and readability over artwork.
  - Screenshots go in `artifacts/`.
- Three-second test on each changed screen: "If I were training a horde, could I find the answer here in about three seconds?"
- Built-in `/code-review` after each meaningful pass. No Superpowers review, worktree or branch-finishing workflows. No new branches.

## 9. Out of scope

- New features, Speed Run trainers and interactive switch mini-games (future; they must not complicate the normal guide).
- Content accuracy rewrites. Suspected inaccuracies are flagged, not changed.
- Edits to `package-lock.json`, `render.yaml`, `.github/workflows/` and `.env*`.
- New plugins or taste skills.

## 10. Risks

| Risk | Mitigation |
|---|---|
| Interim Phase 1 sequences are long on mobile | Depth 2 is collapsed by default; only Depth 1 shows. Each map's redesign follows quickly. |
| Users lose stored "current step" | Intended. Achievements are preserved via the one-time backfill. |
| PostCSS guard changes output unexpectedly | Built CSS is diffed before and after; any difference is investigated before committing. |
| Removing `tasks` UI drops a fact | Tasks are rendered as plain text wherever not otherwise represented; a browser smoke check confirms every task label still appears on the rendered page. |
| Zetsubou consolidation loses page-only facts | A line-by-line diff gates any page removal. |
