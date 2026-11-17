# Empty maps audit

DELTA/CHARLIE · Sonnet, 2026-11-16. Source: `apps/hub/src/data` (mapData, mapInfo, EasterEggGuides, sideEE, dedicatedGuides) and the live routes.

## What exists

- **Dedicated step guides (7):** Origins, Mob of the Dead, Shadows of Evil, Der Eisendrache, Zetsubou No Shima, Gorod Krovi, Revelations (`/maps/<map>`, each with a Step details tab).
- **Video guide pages (3):** Ascension, Call of the Dead, Moon (`/easter-eggs/<slug>`, YouTube embed, title, description, game/DLC/released). These were never empty.
- **Info page for every map (`/info/<slug>`):** all 29 map entries have a description. Survival-only maps (Nacht der Untoten, Kino der Toten, Five, Dead Ops Arcade, Verrückt, Shi No Numa, Der Riese, Nuketown Zombies, Dead Ops Arcade II) correctly say "No Main Easter Egg"; they are not empty.
- **Side Easter Eggs (5 cards):** Origins Speed Run (full page), Kino, Gorod Krovi, Der Eisendrache, Shadows of Evil (video/steps). No empty entry.
- **Achievements:** 10 entries, all with a real map or the Origins speed run. Nothing empty.

## Empty: main Easter Eggs with no guide and no video

| Map | Route | Was | Now |
| --- | --- | --- | --- |
| Shangri-La (BO1, also BO3 Chronicles) | `/easter-eggs/shangri-la` | entry in `EasterEggGuides.js` with an empty `videoUrl`, showed the generic "Coming Soon" screen | **intentionally left empty** (Bryen, 2026-11-16): keeps the "Coming Soon" page, its card keeps "No guide yet" |
| TranZit (BO2) | `/easter-eggs/tranzit` | no guide entry, generic "Coming Soon" | video guide page (CodeNamePizza, `0thNmxkIYH0`) |
| Die Rise (BO2) | `/easter-eggs/die-rise` | same | video guide page (MrRoflWaffles, `kpMbNt_dyME`) |
| Buried (BO2) | `/easter-eggs/buried` | same | video guide page (MrTLexify, `EnFU6GZ2HmM`) |
| The Giant (BO3) | `/easter-eggs/the-giant` | same | video guide page (Mar&Justin, `IUfV1egeI3Y`) |

Their cards on the Main EEs list already said "No guide yet" and opened the map's info page; the info page's "Main Easter Egg" badge led to the dead "Coming Soon" screen.

> **Shangri-La (Black Ops 1) is the intentional empty one**, plus the World at War originals (entries without a guide, see `docs/DUPLICATE-MAPS.md`). Bryen wants Shangri-La BO1 to keep the Coming Soon page and "No guide yet" on its card; the BO3 Shangri-La has its own small card. `comingSoonSlugs` in `apps/hub/src/data/videoTodo.js` holds it (no TODO for it); `scripts/coming-soon-browser-smoke.mjs` checks the route, the card and the way back.

## The small page (same flat pattern, no maps, no big blocks)

`/easter-eggs/<slug>` for TranZit, Die Rise, Buried, The Giant and Shangri-La BO3 (`/easter-eggs/shangri-la-chronicles`) now shows: title, one line (first sentence of the map's own description in `mapData`/`mapInfo`), one empty video card ("Video guide coming soon"), game and DLC, up to four related Easter Egg maps of the same game, and a back link. No video id is invented.

## TODO: video ids

`apps/hub/src/data/videoTodo.js` lists the slugs that get a video (`videoTodoSlugs`: tranzit, die-rise, buried, the-giant, shangri-la-chronicles). Creator priority (Bryen): 1 CodeNamePizza, 2 MrTLexify, 3 MrRoflWaffles. Once Grey's research ticket (grey-32) delivers verified YouTube ids, add each id as `videoUrl` in `EasterEggGuides.js` (a new entry for each, after checking the id with the oEmbed endpoint) and remove the slug from `videoTodoSlugs`. The page then switches to the normal video guide automatically. `scripts/video-todo.test.mjs` fails if a video-less main Easter Egg map is on neither list, or a map with a video is still on it.

## Existing videos by creator (checked with the YouTube oEmbed endpoint, 2026-11-16)

| Where | Video | Creator | Priority |
| --- | --- | --- | --- |
| Ascension guide page | P6RzrxQ6yNg, full Easter Egg guide | CodeNamePizza | 1 |
| Call of the Dead guide page | 8kI2w4NgUCQ, solo and co-op guide | CodeNamePizza | 1 |
| Moon guide page | 2k6L3wBsEyA, "Ultimate Moon Easter Egg Guide" | **MrRoflWaffles** | 3 (not CodeNamePizza) |
| Der Eisendrache main guide, bows and wisps | NhDv6R5YPEs, solo guide | CodeNamePizza | 1 |
| Der Eisendrache Fire Bow video | 2lA6-UH6Qjo, "Fire bow fast guide" | **SBZ vSylent** | not on the list (a bow-only credit, kept) |
| Side EE: Shadows of Evil | JQZLNhnxBQo | CodeNamePizza | 1 |
| Side EE: Gorod Krovi | 3zECn4yFCpE | **GregFPS** | not on the list |
| Side EE: Der Eisendrache | BfBoWcDIg7s | **GregFPS** | not on the list |

No swap is proposed yet: that needs a priority creator's full guide for the same map, with the id verified by oEmbed. Candidates to look for: a CodeNamePizza or MrTLexify full Moon guide; CodeNamePizza side-EE videos for Gorod Krovi and Der Eisendrache. Other video links inside the dedicated map data (Revelations, Origins and so on) were not part of this check.

## Video ids added (2026-11-16, from Grey's grey-32)

Each id was checked by CHARLIE · Sonnet with the YouTube oEmbed endpoint (HTTP 200, title and channel as Grey listed) and the watch page (public, status OK, playable in embed). Runtimes from the watch page: TranZit 7:15, Die Rise 24:20, Buried 12:21, The Giant 10:08, Shangri-La BO3 18:22. The BO3 Shangri-La entry is `/easter-eggs/shangri-la-chronicles` (a `shangri-la-chronicles` entry in `EasterEggGuides.js`); the BO1 entry stays Coming Soon. The pages credit the creator ("Video by"). Creator priority note: no CodeNamePizza or MrTLexify full guide surfaced for Die Rise, The Giant and BO3 Shangri-La (Grey's notes), so MrRoflWaffles / Mar&Justin are used there; swap if Bryen prefers an alternate from Grey's page. TranZit's CodeNamePizza video is 7 minutes, a quick guide.
