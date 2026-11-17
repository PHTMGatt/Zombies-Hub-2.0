# Design reset: Origins and Revelations (2026-11-16)

Bryen rejected the player-facing look of Origins, Revelations and their tabs. This file records what was ignored, what was used this time, the three candidate systems, and how a repeat is prevented. Nothing here is approved: the systems are a preview behind `?design=a|b|c`, uncommitted, and wait for Bryen's pick.

## Which instructions were ignored

Each row quotes the source (MongoDB `mithrandir.notes` key unless noted) and names the page or capture that broke it.

| Source | What it says | What was shipped or shown instead |
| --- | --- | --- |
| `brief:zombies-origins-revelations:2026-11-12` | "The Easter egg reflects directly onto the guide." "Copy the PRINCIPLE, never the template." | Live `/maps/origins` and `/maps/revelations` use the same `FlatGuide` card and one unified tab bar (`shared/ui/map-tabs.css`) on all seven maps. Captures: `artifacts/system/live/origins-main-1440.png`, `rev-main-1440.png`. |
| `gandalf-note:zombies-rejected-directions` | Rejected: "identical template styling per map", "gray/green field sheet", "giant mobile nav clutter". | My second round of sheets (sent Nov 16) put one template on both maps in three recolours, and option C was an olive "ops sheet" with a 2-column block nav on phones. I had not read this note before designing. |
| `gandalf-note:origins-og-modernization` | Identity: "Revive icons, 'Origins Easter Egg / Little Lost Girl', translucent dark panels, a blue header, staff colors inside an Origins-blue world." | My first three Origins options removed the Revive icons, changed the title to "Origins / Little Lost Girl Easter Egg" and dropped the blue header (`artifacts/design-options/origins-a-1440.png`). |
| `decision:zombies-look-rejected:2026-11-16` | "tab bar overflows/clips", "thin ~300px card floating in huge empty art field", "text ~9-10px". | Live `/maps/origins` at 1440 cuts off "Lightning Staff" and hides "Speed Run" (`artifacts/live-shots/maps_origins-1440.png`). In my live QA I reported that row as working because it scrolled. |
| `brief:…` part 5 and Gorod lesson | "one consistent picker pattern across all hunts"; "a picture of the spot + a landmark/map callout, never just a name". | Live hunts use an island wheel on some pages and a list on others; egg spots and Summoning Key targets are a name and a timestamp with no picture. |
| `gandalf-note:zombies-responsive-rules` | "Mandatory review sizes: 1440×900, 390×844, 844×390." | My first two rounds of option sheets had no 844×390 captures. |
| `gandalf-note:claude-zombies-tooling`, project `CLAUDE.md` | frontend-design for UI work; Superpowers brainstorming and verification-before-completion. | Before this reset I have one recorded frontend-design call in this session and no brainstorming or verification call. |
| Notion "CRITICAL Design Rejection" | "Tests/CI … are necessary but not proof of visual acceptance." | On Nov 16 I reported live QA as clean ("nothing to fix") on the pages Bryen then rejected. Scans measured overflow and contrast, not whether the page was any good. |

## What was used this time

Sources read before designing (all on 2026-11-16):

- MongoDB: `brief:zombies-origins-revelations:2026-11-12`, `plan:direction:2026-11-16-0630`, `decision:zombies-look-rejected:2026-11-16`, `feedback:bryen:zombies-guides-rejected:2026-11-16`, `gandalf-note:origins-og-modernization`, `gandalf-note:origins-information-architecture`, `gandalf-note:origins-og-physical-and-document-source-2026-11-05`, `gandalf-note:claude-zombies-tooling`, `gandalf-note:zombies-rejected-directions`, `gandalf-note:zombies-guide-philosophy`, `gandalf-note:zombies-benchmark-exoskeleton`, `gandalf-note:zombies-responsive-rules`, `gandalf-note:origins-phase2-visual-rejected`, `gandalf-note:revelations-return-to-user-og-split-guide-2026-11-06`.
- Notion: "Zombies Hub — CRITICAL Design Rejection & Recovery Order (White)".
- Drive, read-only: `1000004817.jpg` (phone document, main guide) and `1000004814.jpg` (phone document, Ice and Fire). `1000004815.jpg` returned no text through the connector, and the three printed-page photos were not opened.
- The pre-merge pages, built from `c8fabee` and captured (`artifacts/system/old/`).

Tools, by name:

- Skill `frontend-design:frontend-design`: invoked three times this session (first Origins options, then twice for the reset brief).
- Skill `superpowers:brainstorming`: invoked once for the reset. Its approval gate is met by the APPROVAL REQUEST; the preview is its throwaway spike.
- Skill `superpowers:verification-before-completion`: invoked once, before the claims below.
- Playwright: the repo's own Playwright (`artifacts/sys-shots.mjs`, `artifacts/sys-sheet.mjs`) for every capture. The Playwright MCP browser tools were not used.
- Nothing was installed. No tool was missing.

## The three systems

Shared by all three (the exoskeleton, `shared/sys/`): the flat main guide (number, title, one line, details link), responsive rules, 16px+ text, tabs that never clip, deep links (`#servant-rocks`, `#bone-spots`, `#turret-shot`, staff `#build` / `#puzzle` / `#upgrade`), one hunt picker, uncropped screenshot cards with readable captions, a video that loads only when asked for. Never shared: colour, type, art, header, tab look and density. Each system styles each map by name.

| | A · OG modernization | B · Phone document | C · Cinematic rail |
| --- | --- | --- | --- |
| Origins | Blue header, Revive icons, two-tone "Origins Easter Egg / Little Lost Girl", staff-colour chips, one translucent dark panel over the robot, skull section titles | Flat ice-navy page, title as the old document wrote it, underline tabs, terse lines, staff page leads with the code chart | Robot art in a pinned side rail with the tabs; solid page; each staff page takes its staff colour |
| Revelations | Art hero with centred title, boxed tab bar, one glass panel over the blurred art; video beside the picker | Flat indigo page; video on top, picker underneath, one column on every screen | Art in the rail; each hunt tab has its own colour; video stays in view beside the picker |
| Strongest at | Looks like his maps. Closest to "build off the OG design". | Fastest to read; least chrome; closest to the paper guide | Uses a wide screen best; tabs always visible on desktop |
| Weakest at | Most chrome above the content, worst in landscape (guide starts 159px down on Origins, 197px on Revelations at 844×390) | Wide empty margins on desktop; least atmosphere; the two maps differ mostly by colour and type | Furthest from the OG look; on phones it is close to B with an art header |

### Origins identity cues kept, per system

| Cue (`gandalf-note:origins-og-modernization`) | A | B | C |
| --- | --- | --- | --- |
| Icy blue world | Yes: blue header band, blue-black veil | Yes: flat ice-navy page | Partly: blue-black page, colour comes from the open tab |
| Snow, fog, giant robot (real game art) | Yes: robot behind the whole page and in the header | Small: a strip in the header only | Yes: robot fills the side rail (desktop) or the header (phone) |
| Dieselpunk machinery | Only through the robot art; no drawn ornament | Only in the header strip | Only through the robot art |
| Cyan accents | Yes | Yes | Only on the Ice Staff page; other tabs use their own colour |
| Revive icons | Yes, both sides of the title | One, left of the title | One, left of the title |
| "Origins Easter Egg / Little Lost Girl" | Yes, two-tone as the original | Yes, written "Origins Easter Egg (Little Lost Girl)" as in the phone document | Yes, stacked |
| Translucent dark panels | Yes, one per page | No panels | No panels |
| Blue header | Yes | No (art strip) | No (rail) |
| Staff colours inside an Origins-blue world | Yes: chips, staff page title and labels | Yes: tab underline, title and labels | Strongest: the whole staff page takes the colour |

Staff pages (Ice and Fire captured in every system, with their code charts `ice_staff_code.webp` and `fire_staff_code.webp`): Build as label-and-line rows, Spots as a numbered list, Puzzle with the chart (tap to enlarge) and its numbered lines, Upgrade with its numbered lines and the four-lever note. A and C put Build and Spots beside Puzzle and Upgrade on desktop; B is one column with the chart first.

### How the Revelations hunts show spots

- One picker on every hunt page (Apothicon rocks, eggs, Summoning Key throws, sound step): big area cards where a hunt has areas, then numbered rows with the spot name and its video time. Tapping a row plays only that clip.
- Where the repo has a real still, it is shown uncropped in a numbered card with its caption: five Servant rocks (aim + where you stand), six bones plus the absorb shot, the turret shot.
- Annotated callouts are **not** built. Egg spots (16), sound-step runes (12) and Summoning Key targets (7) have no still at all, only a name and a timestamp, and the six bones have a still but no timestamp (see `docs/DESIGN-CONTENT-INPUT.md`). No picture is invented. This is the largest open gap for "picture + landmark".
- The island ring map is not in the preview.

## Recommendation: A

1. It is the only system that follows the standing direction (`gandalf-note:origins-og-modernization`) and Bryen's own words on Nov 6 ("the way i did it first was the best … build off the og design"); it keeps eight of the nine identity cues above in full.
2. It fixes every defect on his rejection list (clipped tabs, narrow floating card, tiny text, cramped video and picker, raw screenshots with tiny captions) without changing what either map looks like, so it is the smallest risk of a third rejection.
3. The two maps stay visibly different from each other (different header, tab bar, panel and type), which B and C do less of.

Tradeoffs, each system:

- **A:** most chrome above the content; in landscape the guide starts 159px (Origins) and 197px (Revelations) down a 390px screen; glass and blurred art cost more on weak phones.
- **B:** fastest and calmest, but a 46rem column leaves wide empty margins at 1440, the art is nearly gone, and Origins and Revelations differ mostly by colour and type.
- **C:** best use of a wide screen and tabs always in view, but it is the furthest from the OG look, and on phones it loses the rail and reads close to B.

If he wants A faster on phones: take B's chart-first staff page into A.

## BETA's review (spec §2.2) and what changed

| Point | Status |
| --- | --- |
| Template, not per-map | Partly answered: every system styles each map by name, and the header is now a per-map slot (`SysShell` `header` prop). A differs most between maps; B and C still share one layout. Page structure below the tabs is the same for both maps in the preview. |
| Tabs numbered beside step numbers | Fixed: tabs carry no numbers. |
| Two route tables | Open: preview only. The chosen system replaces the live routes; the duplicate goes. |
| Three themes in one CSS file | Open: preview only. Two are deleted after the pick. |
| 16:9 crop cuts landmarks | Fixed: screenshots are shown whole. |
| YouTube loads on open | Fixed: the player loads on a tap on the placeholder or on any spot. |
| Picker semantics | Changed from `aria-pressed` to `aria-current` on the chosen card and row. |

## Verified, and not

Fresh runs after the last change, against the sandbox build served on port 4273:

- `npm run build` passes, bundle budget ok. The preview is lazy-loaded, so the live pages load none of it.
- `npm test`: 109 of 109 pass in the shared tree (which now also holds BETA and CHARLIE work).
- `artifacts/sys-shots.mjs`, seven pages × three sizes (1440×900, 390×844, 844×390) × three systems: no sideways scroll, no text under 16px, no clipped tab, no page error.
- `artifacts/sys-a11y.mjs`, nine pages × three sizes per system (27 checks each): axe-core WCAG A/AA including contrast, the look-agnostic contract from `scripts/smoke-contract.mjs` (one named guide nav, one current tab, "Step N:" headings in `<main>`, one h1), 44px targets, and a keyboard check for a visible focus ring on the tabs. Result: A 0 issues, B 0, C 0 (C had one, an undistinguishable credit link, fixed). Report: `artifacts/design-options/a11y-contract-report.json`.

Not done:

- The repo's own browser smokes were not run against the looks: they drive the live routes, which the preview does not change.
- Screen-reader testing, and a human keyboard walk through the pickers.
- Origins preview now also has Wind Staff, Lightning Staff (with the switch board) and Step details, captured at all three sizes but not on the sheets. The switch board is embedded with its old styling: the labels on its sketch map are still 9 to 13.5px and need the restyle after the pick. Speed Run and the original guide still open the live pages.
- Bryen has not seen any of this live.

Where things are:

- Images: `artifacts/design-options/v3/` (sheets `sheet-a.jpg`, `sheet-b.jpg`, `sheet-c.jpg`; every capture under `a/`, `b/`, `c/`).
- Code: preview layer first committed as f78d804 on `claude-forge`; later changes live in a separate copy, `D:\Code\zh-design-sandbox`, so the shared tree always builds.
- Live preview on the home network: `http://192.168.50.195:4273/maps/origins?design=a` (or `b`, `c`; `?design=off` returns to the live look). Served from the sandbox copy by the `zombies-lan-preview` entry in `.claude/launch.json`. Confirmed from this PC by its LAN address; not yet confirmed from a phone.

## How a repeat is prevented

1. Sources before pixels. Before any Zombies look work, read the brief, the current direction, the rejected-directions note and the map's identity note, and list in the report which keys were read.
2. A design goes out with captures at all three sizes of the main guide and at least one specialist tab per map, or it does not go out.
3. A scan passing is reported as "the scan passed", never as "the page is fine". Visual judgement is Bryen's, live.
4. One map at a time: Origins until Bryen says yes, then Revelations, then the rest. No rollout to seven maps from one approval.
5. Peer-relayed "rules" are checked against Bryen's own words in the notes before they shape a design.
6. Any address given to Bryen is opened first and its page title checked. (The first LAN link I sent pointed at another app on port 4173.)
