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
| Shangri-La (BO1, also BO3 Chronicles) | `/easter-eggs/shangri-la` | entry in `EasterEggGuides.js` with an empty `videoUrl`, showed the generic "Coming Soon" screen | small card (below) |
| TranZit (BO2) | `/easter-eggs/tranzit` | no guide entry, generic "Coming Soon" | small card |
| Die Rise (BO2) | `/easter-eggs/die-rise` | same | small card |
| Buried (BO2) | `/easter-eggs/buried` | same | small card |
| The Giant (BO3) | `/easter-eggs/the-giant` | same | small card |

Their cards on the Main EEs list already said "No guide yet" and opened the map's info page; the info page's "Main Easter Egg" badge led to the dead "Coming Soon" screen.

## The small page (same flat pattern, no maps, no big blocks)

`/easter-eggs/<slug>` for these five now shows: title, one line (first sentence of the map's own description in `mapData`/`mapInfo`), one empty video card ("Video guide coming soon"), game and DLC, up to four related Easter Egg maps of the same game, and a back link. No video id is invented.

## TODO: video ids

`apps/hub/src/data/videoTodo.js` lists the five slugs. Once Grey's research ticket (grey-32) delivers verified YouTube ids, add each id as `videoUrl` in `EasterEggGuides.js` (a new entry for the four that have none) and remove the slug from `videoTodoSlugs`. The page then switches to the normal video guide automatically. `scripts/video-todo.test.mjs` fails if a video-less main Easter Egg map is missing from that list, or a map with a video is still on it.
