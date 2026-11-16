# Guide architecture: what the main guide owns, what the tabs own

Status: implemented 2026-11-16 for all seven maps (see "As built" at the end). Draft written by DELTA · Sonnet, 2026-11-16. Written from Bryen's notes in MongoDB `mithrandir.notes`, the redesign spec, and the session transcripts. Where Bryen's own words conflict over time, both are shown and the conflict is flagged.

## The rule

> **The Easter Egg builds the page, not the other way around.** (Bryen, 2026-11-16, via Gandalf.)

- **Main guide** = only the Easter Egg steps, A to Z, lean. Each step is a title, a 1–3 line goal, an optional tiny checklist, and a "details" link to the tab that owns the depth.
- **Nav tabs** (staffs, Servant / Apothicon upgrade, egg locations, codes, buildables, bows, and so on) own their specialised how-to, charts, media and reference. A fact lives in one place; the main guide links to it.
- Nothing is deleted. Anything moved out of the main guide lands in the tab that owns it, and the step keeps a link (`links: [{ label, to }]`, which the shared step markup already renders).

## Where this was decided (sources found)

| When | Source | What it says |
| --- | --- | --- |
| 2026-10-31 | `docs/superpowers/specs/2026-10-31-zombies-hub-redesign-design.md` §6 | Per-map structure: Origins main guide + Ice/Fire/Wind/Lightning/Speed Run; Revelations 12 steps + 4 section pages; Gorod keeps Valve Solver one tap away and linked from the valve step; DE "bow step links directly to each bow"; Zetsubou nav Main Guide, Cogs, Buildables, Boss; SoE single page with a "Your game" panel; Mob keeps Plane, Retriever + Skulls, Codes, Final pages. Spec §5: "Shared design language does not mean shared information architecture." |
| 2026-11-03/05 | Mongo `gandalf-note:origins-information-architecture` | "The Main Guide owns WHAT to do next. It holds only the Easter Egg sequence (step title → one action → next step)... Staff pages own HOW: Build, Puzzle, Upgrade. Never duplicate staff how-to elsewhere (no Staff Board, mini guides, staff sidebars, or staff buttons under every section)." |
| 2026-11-05 | Mongo `gandalf-note:origins-main-guide-accordion-large-image-2026-11-05` | **Later Bryen feedback relaxes this for Origins:** a collapsed-by-default quick reference in the main guide is allowed (tap a step, pick a staff, see its existing chart large in place). "Avoid duplicating full staff walkthroughs on the Main Guide; keep detailed HOW on staff pages." Staff pages must not be changed; staff images are never redrawn or cropped. |
| 2026-11-05 | Mongo `gandalf-note:origins-speed-run` | Speed Run stays, secondary, not a fifth staff tab. Main Guide ↔ Speed Run link both ways. |
| 2026-11-13 | Retired Gandalf v1 / v3 sessions | Restate the Origins rule: staff pages own HOW. |
| 2026-11-16 | Bryen via Gandalf and ALPHA | The strict version, for **all maps**: main guide only links, tabs own detail. |

Not found: an earlier in-depth discussion using the phrase "the Easter Egg builds the page". The exact wording first appears in today's Gandalf session. The Origins IA notes above are the earliest written form of the same idea.

## Open conflict for Bryen

On 2026-11-05 Bryen approved **collapsed quick references** inside the Origins main guide (a staff's chart opens in place). On 2026-11-16 the rule is **no embedded tab content**. Until Bryen says otherwise this document follows the 2026-11-16 rule: the main guide links to the staff pages. If the collapsed quick references should stay for Origins, that is a one-line exception to record here.

## What each map's tabs own (from the nav)

| Map | Main guide | Tabs and what they own |
| --- | --- | --- |
| Origins | 11 EE steps | **Ice / Fire / Wind / Lightning**: build parts, record, crystal, Crazy Place puzzle and chart, upgrade rings and orb. **Speed Run**: routing and skips. |
| Revelations | 12 steps | **Apothicon Upgrade**: Servant rock shots (video clips). **Egg Locations**: the four egg spots. **Summoning Key**: the seven throws. **Sound Step**: rune/sound locations. |
| Gorod Krovi | 11 steps | **Valve Solver**, **Trophies** (six trophy methods), **Buildables** (Dragon Shield parts), **Boss Fight** (dragon and Nikolai phases). |
| Der Eisendrache | EE quest | **Bows** (Storm / Fire / Wolf / Void sub-pages), **Wisps**, **Gear** (Rocket Shield, Ragnarok parts), **Boss**. |
| Zetsubou No Shima | 11 steps | **Prerequisites**, **Reveal Blueprint**, **Cogs** (1–3), **Boss Fight**, **Buildables**. |
| Mob of the Dead | 12 steps | **Plane** (five parts), **Retriever + Skulls**, **Codes** (101 · 386 · 872 · 481), **Final Fight**. |
| Shadows of Evil | 7 steps | No tabs by design: one page with the per-game "Your game" panel (character → Keeper room, this game's train symbols). |

## Audit: tab content currently embedded in main-guide data

Scope so far: Revelations and Origins (Gandalf's order). The other five maps are not audited yet.

### Revelations (`maps/revelations/src/data/revGuideSteps.jsx`, built from `ApothiconSteps.js`)

The tabs are video-clip pages (`ApothiconUpgradeData.js`, `eggData.js`, `SoundStepData.js`, `SummoningKey.js`), so they hold timestamps, not the written how-to or screenshots.

| Step | Embedded today | Belongs in | Notes |
| --- | --- | --- | --- |
| 03 Upgrade the Servant | `servantTab` ×5: aim and stand-here screenshots per rock (10 images); the `how` paragraph | **Apothicon Upgrade** tab | Tab has only video clips; the screenshots are not there. Needs a new screenshot section on that page. Step keeps its 6 tasks and a link. |
| 06 Reel 3, six bones | `boneTab` ×6 + `bones-absorb` image; `how` | **No tab owns it.** Candidate: a new "Bones" tab, or a section of Egg Locations | Bryen/ALPHA to decide: new tab vs existing. |
| 07 Materialize S.O.P.H.I.A. | `turret-beam` image; `how` | **No tab owns it.** Same question | One image only. |
| 08 Kronorium + four eggs | `how` (egg placing, souls, Gateworm) | Egg Locations (where the eggs are); the placing steps are EE action and stay | Link already exists. |
| 09 Runes | `how` | Sound Step tab (beeping spots) | Link already exists. |
| 10 Symbol room | `RunNote` per-game symbol order | **Stays in the main guide** | Per-game state the player fills in, like SoE's "Your game" panel. |
| 11 Seven key throws | per-task `hint` for each of the 7 throws | Summoning Key tab | Hints duplicate the tab's throw names; keep the 7 checkboxes, drop the hints or keep them as the one-line label. |
| 01, 02, 04, 05, 12 | `how` paragraphs, sequence chips | Main guide (EE action) | Keep lean: first 1–3 lines, rest behind the step. |

### Origins (`maps/origins/src/data/originsGuide.jsx`)

| Step | Embedded today | Belongs in | Notes |
| --- | --- | --- | --- |
| Build the Staffs | `STAFF_REFS.build`: every staff's build parts, record, crystal | Staff pages (Build) | Reads the same data as the staff pages, so no content is lost by removing it; the step becomes a goal plus four staff links. |
| Secure the Keys | `STAFF_REFS.upgrade`: ring colours, orb, pedestal charging | Staff pages (Upgrade) | Same. The generators-on warning is an EE condition and stays. |
| Ascend from Darkness | `facts` table staff → robot/pedestal | **Stays**: this is the EE step's own content | Optionally also on each staff page. |
| Thunder Fists | soul-chest footprint chips | **Stays** (EE step content) | |
| G-Strike | 5-line `how` | **Stays**: no tab owns it | Long for a lean step; trim to goal plus the two melee batches. |
| Rain Fire, Unleash the Horde, Skewer the Winged Beast, Fist of Iron, Raise Hell, Freedom | `how`, `problems`, `critical` | Stay (EE steps) | `problems` (tips) are the candidates to fold away. |

### Gorod Krovi (`gorodGuideSteps.jsx`)

| Step | Embedded today | Belongs in | Notes |
| --- | --- | --- | --- |
| Valve network | `valve-solver` (compact solver) and the valve-locations map image | **Valve Solver** tab | The step already links "Full-size Valve Solver". Move the compact solver and the map out; keep the critical warning (power the Hatchery generator first) and the two tasks. |
| Six silver trophies, S.O.P.H.I.A. challenges | `how` repeats every trophy method / challenge objective; per-task `hint` lines | Trophies tab (same data, `gorodTrophies`, `gorodChallenges`) | Text duplicate, not an embed: the shape test does not flag it. Trimming it removes rendered text, which needs `approved-removals.json` and Bryen's OK. |
| Kill the dragon, Defeat Nikolai | `how` repeats the boss phases | Boss Fight tab | Same as above. |
| Guard of Fafnir, Power + Dragon Network | part-area chips, `how` | Buildables tab owns the part list | Same as above. |

### Der Eisendrache (`deGuideSteps.jsx`)

| Step | Embedded today | Belongs in | Notes |
| --- | --- | --- | --- |
| Upgrade your bow | the four-bow `tabs` ref | **Bows** tab (Storm / Fire / Wolf / Void sub-pages) | Replace with four `links`, one per bow page. |
| Past lab: canister, fuses, safe code; Death Ray + safe | `safe-code` and `safe-code-entry` per-game tools | **No tab owns it** | The safe combination changes every game, so it is per-game state like Revelations' symbol note and Shadows' "Your game" panel. Recommend it stays in the main guide; Bryen to confirm. |
| Gear up: Shield + Ragnaroks | step text | **Gear** tab | The step sits third in the guide though its phase is late (see the earlier cross-check). Candidate to become one line plus a link. |

### Zetsubou No Shima, Mob of the Dead

No embedded images, solvers or tab sets (the shape test lists none). The only overlap is text: Zetsubou's cog steps against the Cogs tab, and Mob's plane parts, Retriever + skulls and codes steps against their tabs. These are `how` duplicates, handled like Gorod's: trimming needs Bryen's approval.

### Shadows of Evil

`train-note` (rituals, sword steps) and the character → Keeper picker (upgrade step) are the per-game "Your game" panel that spec §6 Phase 7 approves for the main page. SoE has no tabs. Recommend they stay.

## Move patches prepared (not applied)

Base commit `e716e29`. Files in the shared notes folder, `zombies-guide-moves/`:

| File | Replaces / adds | Effect |
| --- | --- | --- |
| `originsGuide.jsx` | `maps/origins/src/data/originsGuide.jsx` | Build the Staffs and Secure the Keys drop the embedded staff `tabs`/images/Lightning switches and link to each staff page's `#build` and `#puzzle` sections. The staff pages already hold every one of those lines (same data). |
| `revGuideSteps.jsx` | `maps/revelations/src/data/revGuideSteps.jsx` | Servant, Reel 3 and S.O.P.H.I.A. steps drop their screenshots and link to `#servant-rocks` (Apothicon Upgrade), `#bone-spots` and `#turret-shot` (Egg Locations). |
| `revReferenceShots.js` (new) | `maps/revelations/src/data/revReferenceShots.js` | The same captures, alt texts and captions, exported as `servantRocks`, `boneSpots`, `turretShot` for the tab pages. |
| `main-guide-embedded.json` | `scripts/fixtures/main-guide-embedded.json` | Drops the Origins entries and all Revelations entries except `symbols:custom:symbol-note`. |

Apply order: the tab sections (ALPHA) must exist first, otherwise the screenshots disappear from the site. Then copy the four files, run `npm test`, refresh the content baseline and rendered fixtures, and list the removed main-guide lines in `approved-removals.json` (only with Bryen's OK; Gandalf's call of 2026-11-16 is the standing instruction).

## Proposed method for the moves

1. **Data first, no content loss.** Move a block into the owning tab's data file; leave a `links` entry on the step. Run `node scripts/guide-content.mjs --write-baseline` and refresh the rendered fixtures; name them in the commit and flag them to Bryen, because the content-preservation test treats a removed line as a removal. Moved content is listed in `scripts/fixtures/approved-removals.json` only with Bryen's OK.
2. **The tab pages must exist before the step lets go.** Revelations screenshots (Servant, bones, turret) need a page section to land in. That is ALPHA's markup, and CHARLIE's routing for the deep links.
3. **One map at a time**, Revelations then Origins, each checked at 1440 / 390 / 844 before the next.

## As built (2026-11-16)

Every map's main guide is a flat list rendered by `shared/guide/FlatGuide.jsx`: each step is `{ id, title, goal, links }` (goal about one short line, at most two links). Everything a step used to carry (warnings, how-to lines, task lines, reference lists, tips, video links, bow routes) moved, with the same field names, to that map's **Step details** tab:

- data: `maps/<map>/src/data/stepDetails.js` (same step ids and order; old task lines became a plain "Checklist")
- page: `maps/<map>/src/pages/StepDetailsPage.jsx` (`Pages/StepDetails.tsx` for Origins) rendering `shared/guide/StepDetails.jsx`, one section per step with anchor `#step-N`
- route: `/maps/<map>/step-details`, a nav tab named "Step details"; each flat step links to its own section
- screenshots stayed on their tabs: Revelations blue rocks go to Apothicon Upgrade `#servant-rocks`, bone spots and turret shot to Egg Locations; Gorod valve solver and map to Valve Solver
- per-game state widgets (Revelations symbol-order note, Shadows of Evil train note and Keeper picker, Der Eisendrache safe-code note) render inside the Step details sections
- lines with no home appear only in `scripts/fixtures/approved-removals.json` (reason: Bryen 2026-11-16 flat main-guide spec); content is checked by `guide-content.test.mjs` and `content-browser-smoke.mjs` (text that moved to another page of the same map counts as kept)
