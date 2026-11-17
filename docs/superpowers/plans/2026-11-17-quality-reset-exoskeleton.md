# Quality reset exoskeleton (BETA lane) implementation plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or
> superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Make the shared structure under whichever look Bryen picks testable, light and deep-linkable. That covers
contracts, budgets, routes, the picker URL, the video facade and smoke migration. Look work stays with ALPHA.

**Architecture:**

- The look-agnostic test contract lives in `scripts/smoke-contract.mjs`. A new contract smoke enforces it on every
  map.
- Budgets and route checks extend the existing build-time scripts.
- Picker URL state and the video facade are small shared hooks and components with no styling of their own.

**Tech Stack:** React 19, React Router 7, Vite 6, node:test, Playwright 1.59.

**Spec:** `docs/superpowers/specs/2026-11-17-quality-reset-exoskeleton-design.md`

## Global Constraints

- Branch `claude-forge` only. No branches, worktrees, merges, deploys or resets.
- Do not edit `package-lock.json`, `render.yaml`, `.github/workflows/` or `.env*`.
- Never change guide content: steps, codes, timestamps, solver data. `npm test` (guide-content) must stay green.
- Do not touch ALPHA's uncommitted files. Tasks 4 and 5 start only after ALPHA commits `shared/sys/*`.
- Tap targets are 44px or larger. Body text is 16px or larger. The tests check 390×844, 844×390 and 1440×900.
- Only the look-agnostic contract (spec §3.2) is asserted. No class names in new test code.

## Review Focus

1. **A map whose tab row hides tabs at 844×390:** every tab is still reachable. Task 1 asserts it at all three
   sizes.
2. **An unknown `?pick=` value:** the picker falls back to the first option and does not crash or scroll. Task 4
   test.
3. **The YouTube embed is blocked (ad blocker, school network):** the facade's "Open on YouTube" link still works.
   Task 5 test.
4. **A tab renamed in one route table but not the other:** the build fails. Task 3 test.
5. **The losing themes are left in `sys.css`:** the budget fails. Task 2 test.

---

### Task 1: Contract smoke for every map

**Files:**
- Create: `scripts/contract-browser-smoke.mjs`
- Modify: `scripts/smoke-list.mjs` (add it to `BROWSER_SMOKES`, before content)

**Interfaces:**
- Consumes: `guideNav`, `guideTabs`, `currentTab`, `mainSteps` and `tabRowReach` from
  `scripts/smoke-contract.mjs`.

- [ ] **Step 1:** Write the smoke. For each of the 7 maps × [390×844, 844×390, 1440×900], assert:
  - `guideNav(page)` count is 1;
  - `currentTab(page)` count is 1;
  - `mainSteps(page).count()` equals the map's guide data length (import `originsGuide`, `revGuideSteps` and the
    others);
  - every step heading's closest element with an id has an `id` matching the data `step.id`;
  - `tabRowReach().unreachable` is `[]`;
  - `h1` count is 1.
- [ ] **Step 2:** Run `npm run build`, then
  `PORT=4733 npm start & SMOKE_BASE_URL=http://127.0.0.1:4733 node scripts/contract-browser-smoke.mjs`.
  Expected: `21/21 contract checks passed`.
- [ ] **Step 3:** Commit `scripts/contract-browser-smoke.mjs` and `scripts/smoke-list.mjs`, with the message
  `test(smoke): look-agnostic page contract on every map`.

### Task 2: Budget for the page system CSS

**Files:**
- Modify: `scripts/bundle-budget.mjs` (`BUDGETS`, `measure`)
- Test: `scripts/bundle-budget.test.mjs`

- [ ] **Step 1:** Write the failing test. `check({ sizes: { 'sys css': 7000, ... } })` reports
  `sys css: 7000 B gzip, over its 6000 B budget`. `measure` finds the chunk whose source is `shared/sys/sys.css`
  through the Vite manifest, and is 0 when it is absent.
- [ ] **Step 2:** Run `node --test scripts/bundle-budget.test.mjs`. Expected: FAIL (no `sys css` key).
- [ ] **Step 3:** Add `'sys css': 6_000` to `BUDGETS` and measure it the same way as `flat guide css`.
- [ ] **Step 4:** Run the test. Expected: PASS. Run `npm run build` and expect `sys css x/6.0 KB`.
- [ ] **Step 5:** Commit with the message `build(budget): page-system CSS budget`.

### Task 3: One route table per map

**Files:**
- Modify: `scripts/prerender-meta.test.mjs`

- [ ] **Step 1:** Write the test. For every `maps/*/src/sys/*Sys.jsx` that contains `<Routes>`,
  `tabPaths(sysSource)` deep-equals `tabPaths(routesFileSource)` for that map.
- [ ] **Step 2:** Run `node --test scripts/prerender-meta.test.mjs`. Expected: PASS today (the paths match).
  Rename one path in a scratch copy and confirm it FAILs.
- [ ] **Step 3:** Commit with the message `test(prerender): preview and live route tables cannot drift`.
- [ ] **Step 4:** Once a look is chosen, delete the duplicate table in the same commit as the losing preview code.
  This test then passes trivially.

### Task 4: `?pick=` deep link for pickers (after ALPHA commits `shared/sys`)

**Files:**
- Create: `shared/sys/usePick.js`
- Test: `scripts/use-pick.test.mjs` (pure helper) and a case in `scripts/revelations-browser-smoke.mjs`

**Interfaces:**
- Produces: `usePick(options: {key:string}[], fallbackKey?: string): [string, (key: string) => void]`.
  - It reads `?pick` once on mount.
  - Setting a key writes `?pick=` with `replace: true` and `preventScrollReset: true`.
- Produces: `pickFrom(search: string, keys: string[], fallback: string): string` (pure).

- [ ] **Step 1:** Write the failing tests:
  - `pickFrom('?pick=Spawn', ['Spawn', 'Kino'], 'Spawn') === 'Spawn'`;
  - an unknown key returns the fallback;
  - an empty search returns the fallback.
- [ ] **Step 2:** Run `node --test scripts/use-pick.test.mjs`. Expected: FAIL (module missing).
- [ ] **Step 3:** Implement `pickFrom` and `usePick` in `shared/sys/usePick.js`.
- [ ] **Step 4:** Add a browser case: open `/maps/revelations/egg-locations?pick=<second area key>`. The second
  option has `aria-checked`/`aria-current` and `scrollY === 0`. Run it. Expected: PASS.
- [ ] **Step 5:** Commit with the message `feat(picker): ?pick deep link`.

### Task 5: Click-to-load video (after ALPHA commits `shared/sys`)

**Files:**
- Modify: `maps/revelations/src/components/GuideVideoPlayer.jsx`
- Test: a case in `scripts/revelations-browser-smoke.mjs`

**Interfaces:**
- Keeps the `playSegment(start, end)` ref API. The first call mounts the YouTube player, then seeks.

- [ ] **Step 1:** Write the failing browser case:
  - on load, no request goes to `youtube.com/iframe_api` or `ytimg` scripts;
  - after clicking the first option, the iframe exists;
  - "Open on YouTube" is a link with an `https://www.youtube.com/` href in both states.
- [ ] **Step 2:** Run it. Expected: FAIL (the iframe API loads on mount).
- [ ] **Step 3:** Render a poster button ("Play guide video", 44px or larger) until the first `playSegment` or
  click, then mount `react-youtube`.
- [ ] **Step 4:** Run the Revelations and content smokes. Expected: PASS.
- [ ] **Step 5:** Commit with the message `perf(video): load YouTube on first play`.

### Task 6: Move each map's deep checks onto the contract, as each map is ported

**Files:** the map's smoke, per spec §5. Order: revelations, origins + browser-smoke, shadows, mob, zets, gorod,
der.

- [ ] **Step 1:** In the commit that ports a map's look, replace that map's class selectors with role or text
  queries:
  - `getByRole('button', { name })` for pickers and options;
  - the `smoke-contract` helpers for tabs and steps.
- [ ] **Step 2:** Run that map's smoke at 3 sizes plus `contract-browser-smoke`. Expected: PASS.
- [ ] **Step 3:** Commit together with the port.
