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

Shared by all three (the exoskeleton, `shared/sys/`): the flat main guide (number, title, one line, details link), responsive rules, 16px+ text, tabs that never clip, deep links (`#servant-rocks`, `#bone-spots`, `#turret-shot`), one hunt picker (area cards, then numbered timestamp rows), screenshot cards at one aspect ratio with readable captions. Never shared: colour, type, art, header, tab look and density. Each system styles each map by name.

| | A · OG modernization | B · Phone document | C · Cinematic rail |
| --- | --- | --- | --- |
| Origins | Blue header, Revive icons, two-tone "Origins Easter Egg / Little Lost Girl", staff-colour chips, one translucent dark panel over the robot, skull section titles | Flat ice-navy page, title as the old document wrote it, underline tabs, terse lines, staff page leads with the code chart | Robot art in a pinned side rail with the tabs; solid page; each staff page takes its staff colour |
| Revelations | Art hero with centred title, boxed tab bar, one glass panel over the blurred art; video beside the picker | Flat indigo page; video on top, picker underneath, one column on every screen | Art in the rail; each hunt tab has its own colour; video stays in view beside the picker |
| Strongest at | Looks like his maps. Closest to "build off the OG design". | Fastest to read; least chrome; closest to the paper guide | Uses a wide screen best; tabs always visible on desktop |
| Weakest at | Most chrome above the content, worst in landscape (guide starts 159px down on Origins, 197px on Revelations at 844×390) | Wide empty margins on desktop; least atmosphere; the two maps differ mostly by colour and type | Furthest from the OG look; on phones it is close to B with an art header |

Recommendation: **A**. It is the only one that follows `gandalf-note:origins-og-modernization` and his Nov 6 words ("the way i did it first was the best"), and it fixes the listed defects without changing what the maps look like. If he wants it faster on phones, take B's chart-first staff page into A.

Preview on the LAN (same Wi-Fi; started from `.claude/launch.json` as `zombies-lan-preview`, port 4273; reachable from this PC by its LAN address, not yet confirmed from a phone): `http://192.168.50.195:4273/maps/origins?design=a` (or `b`, `c`; `?design=off` returns to the live look). Routes in the preview: Origins main guide and Ice, Fire, Wind staff; all six Revelations tabs.

## Verified, and not

Verified by fresh runs after the last change:

- `npm run build` passes, bundle budget ok. The preview is lazy-loaded, so the live pages load none of it.
- `npm test`: 94 of 94 pass.
- `artifacts/sys-shots.mjs`, six pages × three sizes (1440×900, 390×844, 844×390) × three systems: no sideways scroll, no text under 16px, no clipped tab, no page error.

Not done:

- Egg spots, Summoning Key targets and symbol spots still have no picture. The repo only has stills for the Servant rocks, bones and turret. "Picture + landmark" needs new captures, which is content work, not styling.
- Lightning Staff (switch board), Step details, Speed Run and the original guide are not in the Origins preview; they open the live pages.
- The island ring map is not in the preview. The picker is cards and rows.
- No keyboard, contrast or axe pass on the new systems. Browser smokes were not run against them.
- Bryen has not seen any of this live.

## How a repeat is prevented

1. Sources before pixels. Before any Zombies look work, read the brief, the current direction, the rejected-directions note and the map's identity note, and list in the report which keys were read.
2. A design goes out with captures at all three sizes of the main guide and at least one specialist tab per map, or it does not go out.
3. A scan passing is reported as "the scan passed", never as "the page is fine". Visual judgement is Bryen's, live.
4. One map at a time: Origins until Bryen says yes, then Revelations, then the rest. No rollout to seven maps from one approval.
5. Peer-relayed "rules" are checked against Bryen's own words in the notes before they shape a design.
