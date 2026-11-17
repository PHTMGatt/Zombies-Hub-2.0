# Quality reset: technical review and shared exoskeleton

BETA (structure and QA), 2026-11-17. ALPHA owns the look; Bryen approves design live. This doc says what any winning
direction must keep true underneath, what each costs per map, and how the tests follow it. It does not pick a look.

Sources: Mongo `brief:zombies-origins-revelations:2026-11-12`, `plan:direction:2026-11-16-0630`,
`decision:zombies-look-rejected:2026-11-16`, `gandalf-note:origins-information-architecture`; the Notion rejection
page; `docs/DESIGN-CONTENT-INPUT.md`; ALPHA's work in the tree at 2026-11-17 00:xx.

## 1. What was reviewed

ALPHA's directions went through two rounds:

- **Round 1, shelved:** Origins-only themes a/b/c on the live markup (`artifacts/shelved/origins-designOptions-v1.css`,
  captures in `artifacts/design-options/`).
- **Round 2, in progress (uncommitted):** one page system with three themes on the same markup:
  - `shared/sys/SysShell.jsx`, `SysParts.jsx`, `useDesign.js`;
  - `maps/origins/src/sys/OriginsSys.jsx` (main guide only);
  - `maps/revelations/src/sys/RevSys.jsx` (all six tabs);
  - preview with `?design=a|b|c`, turned off with `?design=off`.
  - `sys.css` is not written yet, so the round-2 themes could not be rendered or captured. The tree does not build
    until it lands.

**Captures:**

- Live pages (what ships today), at 1440×900, 390×844 and 844×390, with metrics: `artifacts/quality-reset/`.
- ALPHA's round-2 baseline captures: `artifacts/system/{old,live}`, at 1440 and 390 only. None at 844×390 yet.

## 2. Technical review

### 2.1 Round 1 (Origins a/b/c, shelved)

All three passed the flat-main-guide rule: number, title, one line, details links. No cards, chips or images in the
main guide.

- **Link layout:**
  - a and b stack the two details links as separate 44px buttons. That is about 90px of extra height per step at
    390, about 4.5 phone screens for 11 steps, against a budget of 3 or fewer.
  - c keeps them inline as text links. That is the most compact, but the links are about 30px tall, below the
    44px target.
- **Tab row:**
  - b and c cut the third tab mid-word at 390. That is acceptable as a scroll cue only with the fade or arrow that
    a has.
- **Arrow buttons:** a's scroll arrows are `aria-hidden` buttons with `tabIndex=-1`. That is fine for mouse users,
  and keyboard users still reach every link.

### 2.2 Round 2 (one system, three themes)

**Sound:**

- It is the exoskeleton this doc asks for, already half built:
  - one shell;
  - shared parts: page head, video workspace, picker, option list, screenshot cards;
  - the same data and the same anchors (`#servant-rocks`, `#bone-spots`, `#turret-shot`, `#step-N`);
  - the nav keeps the name `<Map> guide navigation`.
- The preview is opt-in and session-sticky, so the live pages are untouched without `?design`.
- Images carry width and height, `loading=lazy` and `decoding=async`, so there is no layout shift.
- The picker is a `role=group` of real buttons with `aria-pressed`, so it is keyboard- and screen-reader-usable.

**Risks, in order of cost if left:**

1. **Template, not exoskeleton.**
   - SysShell owns the whole header (h1, art, layout), the nav (a numbered "Contents" list) and the footer. A map
     can only supply its name, art and colour codes.
   - CLAUDE.md says shared design language is not shared information architecture, and asks for per-map identity.
   - Fix: keep the *contract* shared and make the *chrome* a slot. Let a map pass its own header node, or a
     `variant`, and keep the nav contract in §3.2 rather than one nav markup.
2. **Numbered tabs next to numbered steps.**
   - Tabs show 1–8 while main-guide steps show 01–11, and page heads say "Main guide step 8". Three numbering
     systems on one screen invite "step 3 or tab 3?".
   - Recommendation: no numbers on tabs.
3. **Two route tables.**
   - `RevSys.jsx` repeats Revelations' `<Routes>`. The prerender reads the routes file
     (`scripts/prerender-meta.mjs` `tabPaths`).
   - The paths match today. When a look wins, delete the losing table in the same commit, or a renamed tab ships
     with no head or sitemap entry.
4. **Three themes in one CSS file.**
   - Until the losers are deleted, every visitor downloads all three themes.
   - `scripts/bundle-budget.mjs` budgets entry and flat-guide only, not map chunks or `shared/sys`.
   - Add a `sys css` budget (proposed: 6 KB gzip for the winning theme). Delete the losing themes before merging to
     main.
5. **Forced 16:9 screenshots.**
   - `SysShots` crops every picture to 16:9. A landmark at the edge of a tall capture would be cut off, and "the
     location must be unmistakable" is the brief's top requirement for Revelations.
   - Use `object-fit: contain` or a per-image `focus` (object-position) in the data.
6. **Video weight.**
   - `GuideVideoPlayer` mounts the YouTube iframe (react-youtube) on load. That is about 1 MB of YouTube scripts per
     tab visit on a phone.
   - Recommendation: a click-to-load facade (thumbnail plus play button) that mounts the player on first pick.
   - It saves the most on a second-screen phone. It needs no look change beyond the poster frame.
7. **Picker semantics.**
   - A single-choice picker built from `aria-pressed` buttons reads as several toggles.
   - Better: `role=radiogroup` with `role=radio`/`aria-checked`, or keep the buttons and mark the current one with
     `aria-current="true"`. Option lists that play a clip are fine as plain buttons.
8. **Origins preview is partial.**
   - Only the main guide uses the system. The staff, speed-run and OG tabs open the old pages, so a live review
     shows two looks.
   - Review Origins on the main guide and one staff tab only after a staff page is ported.

## 3. Shared exoskeleton

Shared: behaviour, sizes, semantics and URLs. Free per map: colour, type pairing, art, header composition,
ornament, and page structure below the tab bar.

### 3.1 Responsive behaviour

| Width | Name | Rule |
|---|---|---|
| ≤ 600 | phone | One column. The tab row scrolls sideways with an edge fade, and the current tab is scrolled into view (row only, never the page). The video goes on top, then the picker, then the list. |
| 601–1023 | tablet / phone landscape (844×390) | One column. The header is at most 25% of viewport height, because 844×390 has only 390px. Video and picker stay stacked unless both fit side by side at ≥ 320px each. |
| ≥ 1024 | desktop | Content max 1100px, centred. The workspace is video plus picker side by side, with the video sticky. The tab row wraps or fits, and never centres when it overflows (auto margins, see `map-tabs-browser-smoke`). |

- **First step visible:**
  - At 390×844, the first main-guide step title is above the fold. Today it is at 234px on Origins and 275px on
    Revelations, so keep it under 400px.
  - At 844×390, the first step title is within the first screen. Today it is at 175px and 161px.
- **Main guide length:** at most 3 phone screens at 390×844. Today it is Origins 3.3 and Revelations 3.5. Inline
  details links (round 1 c) help; stacked button links hurt.

### 3.2 Contracts every look keeps (the tests rely on these)

1. **One guide nav:** a `<nav aria-label="<Map> guide navigation">` with the tabs as links, the current one with
   `aria-current="page"`. Every tab is reachable at every width.
2. **Main-guide steps:** each step is a heading named `Step N: <title>` inside `<main>` (FlatGuide's visually
   hidden prefix), on an element with `id={step.id}`.
3. **Details links:** each one keeps `data-step-link` and its `?ref`/`#section` (`shared/guide/stepLinks.js`), so
   "Back to step N" works.
4. **Headings:**
   - One `h1` per page: map plus quest.
   - The page title is an `h2`; blocks inside it are `h3`.
5. **Pickers:** a labelled group (see §2.2 risk 7), one current choice, keyboard-operable, and changing it never
   scrolls the page.

### 3.3 Spacing and type

- **Spacing scale:** 4, 8, 12, 16, 24, 32, 48, 64 px, as `--zh-space-1..8` in `shared` (global, like `guide.css`).
  Maps use the tokens; their values are not per map.
- **Text:**
  - Body text is 16px or larger, and line length is at most 70ch.
  - Labels are 14px or larger. Today the hub header uses 12–13px for "2.0" and its nav. The Revelations tab pages
  have about 15 more labels under 16px (eyebrows, clip times).
  - Nothing below 14px carries guide content.
- **Hierarchy, three sizes per page:** title (h1, 28–40px), section (h2, 20–26px), body (16–18px). Map display fonts
  are allowed on h1/h2 only.
- **Tap targets:** 44px or larger, including the details links. Inline text links get vertical padding, not a box.

### 3.4 Deep links (all exist today, keep them)

- Tab routes `/maps/<map>/<tab>`, prerendered with their own head (`npm run test:routes`).
- `#<step.id>` on the main guide, focused on load (`useHashFocus`).
- `?ref=<step>` on tab pages drives "Back to step N".
- Section anchors on tab pages (`#servant-rocks`, `#bone-spots`, `#turret-shot`, staff `#section` ids).
- **New, optional:** `?pick=<option key>` on picker pages selects that area or spot on load, so a shared link opens
  the right clip. The picker reads it once; picking updates it with `replace`.

### 3.5 Figure component (interface)

```
<GuideFigure src alt caption width height focus? landmark? priority? />
```

- `alt` names the place and the landmark ("Bone on the crate left of the Kino stage door"); `caption` is the visible
  instruction. Both are required.
- `focus`: CSS object-position, used when a crop is needed; default `contain`.
- `landmark`: optional short text overlay or callout drawn by CSS, not baked into the image.
- `priority`: eager-load the first figure of a page; others are lazy with async decoding.
- Sources: webp at most 1280px wide and about 150 KB or less. Every image has intrinsic width and height (no layout
  shift). Tapping opens the existing zoom dialog (`.zoom-image__dialog` behaviour).

### 3.6 Picker pattern (interface)

```
<GuidePicker label options={[{ key, label, detail? }]} value onChange />   // choose an area or region
<GuideClipList label options={[{ key, title, meta?, start, end }]} active onPlay />   // play a segment
```

- **One picker for every Revelations hunt:** Apothicon rocks, eggs, Summoning Key throws, sound step.
- **Layout:** video on top on phones, sticky beside the picker on desktop.
- **Data:** the picker gets data only. Each map styles it.

## 4. Effort per map (move onto the exoskeleton once a look is chosen)

| Map | Tabs | Effort | Why | Files touched |
|---|---|---|---|---|
| Revelations | 6 | **Low** | Preview already built on the system (RevSys). Left: delete the old Header/pages, one route table, smokes. | `routes/RevelationsRoutes.jsx`, `src/sys/RevSys.jsx`, `src/components/Header.jsx` + old pages (delete), CSS; `scripts/revelations-browser-smoke.mjs` |
| Origins | 15 routes | **High** | 4 staff pages, Speed Run (switch board, checkpoints, stateful), OG page, step details. Only the main guide is ported. | `routes/OriginsRoutes.jsx`, `src/Pages/*` (staff ×4, SpeedRun, MainGuide), `src/components/Header.tsx`, `Nav.tsx`, `src/Styles/**` (57 KB CSS); `origins-` and `browser-smoke` |
| Der Eisendrache | 12 | **High** | 4 bow quests, many sub-pages, 46 KB CSS. | `routes/DerEisendracheRoutes.jsx`, `src/pages/*`, `src/components/NavBar.tsx`, styles; `der-browser-smoke` |
| Zetsubou no Shima | 11 | **Med** | Toggle menu header, cog detail pages, stateless. | `routes/*`, `src/components/Header.jsx`, `Nav.jsx`, pages, styles; `zets-browser-smoke` |
| Gorod Krovi | 6 | **Med** | Valve solver (stateful) must keep its logic, header tab row. | `routes/GorodRoutes.jsx`, `src/components/Header.jsx`, `src/pages/*`, styles; `gorod-*-browser-smoke` |
| Mob of the Dead | 10 | **Med** | Stateless pages, legacy `ul` nav. | `routes/MobRoutes.jsx`, `src/components/Nav.jsx`, pages, styles; `mob-browser-smoke` |
| Shadows of Evil | 2 | **Low** | Main guide plus step details. | `routes/*`, `src/components/Tabs.jsx`, styles; `shadows-browser-smoke` |

Order:

1. Revelations, then Origins (the two reference maps in the brief).
2. Then Shadows, Mob, Zetsubou and Gorod.
3. Der last.

Each map is one commit with its smokes green at the three sizes.

## 5. Tests that follow the look

`scripts/smoke-contract.mjs` (new) holds the §3.2 contract as role and text queries:

- `guideNav`, `guideTabs`, `currentTab`;
- `mainSteps`: headings `Step N:` in `<main>`;
- `tabRowReach`: finds the nav by name and its scroll box by computed overflow, never by class.

**Moved onto it now** (no look change):

- `map-tabs-browser-smoke` no longer lists seven tab-row classes.
- The step counts and waits in achievements, der, gorod, guide-sequence, mob, offline, shadows and zets use
  `mainSteps`.
- Zetsubou's nav gained its missing `aria-label` ("Zetsubou No Shima guide navigation"). That was the one map
  without a named guide nav.

**Still class-coupled.** About 200 class selectors remain, mostly in the per-map deep checks. Move each one when its
map is redesigned, not before. The changes are what break:

- `browser-smoke.mjs`:
  - `.origins-nav-link` → `guideTabs`/`currentTab`;
  - `.switch-card` → `getByRole('button', { name: /^Church Upper:/ })`;
  - the Kino step box.
- `origins-browser-smoke.mjs`: `.origins-nav-link` tab metrics, the staff page parts and switch dials.
- `revelations-browser-smoke.mjs` (43): `.rev-option`, `.rev-area`, `.rev-video__now`, `main li.flat-guide__step`.
  These move to the picker contract (§3.6) with the RevSys port.
- `achievements-browser-smoke.mjs` reads `li.guide-seq__step` for the legacy mode keys. Leave it until that legacy
  path is deleted.
- `coming-soon`, `step-links`, `gorod-footer`: small, hub- or legacy-owned.

**golive-check** needs no change: it runs `BROWSER_SMOKES` and checks heads, routes and budgets, none of which
depend on the look.

**Verified 2026-11-17** on a clean copy of HEAD plus these changes (the shared tree did not build, because ALPHA's
`sys.css` is in progress):

- `npm test` 91/91;
- build with budgets OK;
- map-tabs (9 sizes), achievements, der, gorod, guide-sequence, mob, offline, shadows, zets, a11y (77 routes) and
  content smokes all pass.
