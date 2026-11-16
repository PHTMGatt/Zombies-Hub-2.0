# Maps that exist in more than one game

**Status 2026-11-16:** the World at War originals (Nacht der Untoten, Verrückt, Shi No Numa, Der Riese) are now entries in the hub (see "Added"); Ascension for BO3 Chronicles and the other pairs below are still only proposals. Der Riese / The Giant and Dead Ops Arcade / II are cross-linked on their info pages ("Same map in other games").

## Added (World at War originals, entries without a guide)

Each is its own `mapData` entry (same slug as the later versions, `?game=World at War`), shown under a "World at War" section on `/allmaps`, same cover art as the Black Ops version. Fields used are only the ones the hub already holds in `mapInfo.releasedIn`: Verrückt "Map Pack 1", Shi No Numa "Map Pack 2", Der Riese "Map Pack 3" (all 2009), Nacht "World at War (2008)" shown as DLC "Base Game" (derived, **confirm** wording). No Easter Egg flag, so no guide route is needed.

**Confirm list (not asserted in the hub):** (1) Ascension is a Zombies Chronicles map (Black Ops 3, 2017); (2) Call of the Dead is not in Zombies Chronicles; (3) Nacht der Untoten was part of the World at War base game; (4) the existing BO1 info pages for Verrückt, Shi No Numa and Der Riese still show the World at War release line ("World at War: Map Pack N (2009)") because `mapInfo.releasedIn` is per slug, not per game: should the BO1 entries say Rezurrection DLC instead?

CHARLIE · Sonnet, 2026-11-16. Audit only: nothing here has been added to the hub. Source: `apps/hub/src/data/mapData.js` and `mapInfo.js` (each game version is its own `mapData` entry and `/info/<slug>` or `/info/<slug>-chronicles` page). Items marked **(confirm)** are from general knowledge, not from the hub's own data, and must be checked before anyone adds them.

## The pattern (Bryen, 2026-11-16): original-game entry = Coming Soon, BO3 remaster = guide

Shangri-La is the first pair set up this way, live in the hub: `/easter-eggs/shangri-la` is the **Black Ops 1** entry (original Coming Soon page, labelled "Shangri-La · Black Ops 1", card keeps "No guide yet") and `/easter-eggs/shangri-la-chronicles` is the **Black Ops 3 (Zombies Chronicles)** entry (small video card, labelled "MAIN EASTER EGG · Black Ops 3", "Video guide coming soon" until Grey's grey-32 delivers a verified id). The cards, the info pages and the pages all show the game. Rule in code: `<slug>` = original, `<slug>-chronicles` = BO3 remaster; `apps/hub/src/data/videoTodo.js` lists which routes get the card or stay Coming Soon.

Proposed for the other pairs, same way (not added, Bryen picks): Moon (BO1 empty / BO3 guide), Kino, Nacht der Untoten, Verrückt, Shi No Numa (no main EE, so both are plain info entries already), Origins (BO2 original empty / BO3 remaster guide; today the dedicated step guide serves both), Der Riese (original empty) / The Giant (BO3 remake gets the card), Ascension (BO1 empty / new BO3 entry gets the card). Today Moon's BO3 entry shows the BO1 video page; with the pattern it would need its own video.

## Already has one entry per game (7)

| Map | BO1 entry | BO3 entry | Notes |
| --- | --- | --- | --- |
| Nacht der Untoten | DLC 4 – Rezurrection | Zombies Chronicles | no main Easter Egg |
| Kino der Toten | Base Game | Zombies Chronicles | no main Easter Egg |
| Shangri-La | DLC 3 – Annihilation | Zombies Chronicles | main EE; guide intentionally empty (Coming Soon) |
| Moon | DLC 4 – Rezurrection | Zombies Chronicles | main EE; video guide |
| Verrückt | DLC 4 – Rezurrection | Zombies Chronicles | no main EE |
| Shi No Numa | DLC 4 – Rezurrection | Zombies Chronicles | no main EE |
| Origins | (BO2) DLC 4 – Apocalypse | Zombies Chronicles | BO2 original and BO3 remaster; dedicated step guide |

The BO3 versions share the `slug` with the original and use the info slug `<slug>-chronicles`. Main-EE guides and video pages are per map, not per game.

## Pairs with different names (both already in the hub)

| Original | Remake | Notes |
| --- | --- | --- |
| Der Riese (BO1, DLC 4 – Rezurrection) | The Giant (BO3, DLC – Giant) | separate entries; The Giant is a main-EE map with no guide yet (small video card planned), Der Riese has no main EE |
| Dead Ops Arcade (BO1) | Dead Ops Arcade II (BO3, Bonus) | sequel, separate entries |

## Missing (proposed, not added)

| Proposed entry | Game | DLC | Year | Basis |
| --- | --- | --- | --- | --- |
| **Ascension (BO3 Chronicles)** | Black Ops 3 | Zombies Chronicles | 2017 | Ascension is one of the eight Chronicles maps **(confirm)**; the hub has Ascension for BO1 only (DLC 1 – First Strike, Feb 1, 2011, from `EasterEggGuides.js`). It is a main-EE map, so it would reuse the existing Ascension video page. |
| **Nacht der Untoten (World at War, original)** | World at War | Base game | 2008 | The hub has no World at War entries; its Nacht description already says "World at War (2008)" (`mapInfo.js`). **(confirm DLC/date before adding)** |
| **Verrückt (World at War, original)** | World at War | Map Pack **(confirm which)** | 2009 **(confirm)** | same |
| **Shi No Numa (World at War, original)** | World at War | Map Pack **(confirm which)** | 2009 **(confirm)** | same |
| **Der Riese (World at War, original)** | World at War | Map Pack **(confirm which)** | 2009 **(confirm)** | same; The Giant (BO3) is its remake, already listed |

Not proposed: Call of the Dead (not part of Zombies Chronicles **(confirm)**), Der Eisendrache, Shadows of Evil, Zetsubou No Shima, Gorod Krovi, Revelations (BO3 only), Five, Mob of the Dead, TranZit, Die Rise, Buried, Nuketown Zombies (BO2 only), Dead Ops Arcade / II.

## How it would be added (when Bryen picks)

1. Map entry in `mapData.js` for the new game version (same `slug` where it is the same map; new `slug` for a different title).
2. Info text in `mapInfo.js` (`<slug>-chronicles` or a world-at-war variant), no new facts beyond what is confirmed.
3. A main-EE entry only if that game version has a main Easter Egg; otherwise the "Coming Soon" entry (see the intentional-empty pattern in `docs/EMPTY-MAPS.md`).
4. Smokes: the all-maps and Easter-egg-list counts in `browser-smoke.mjs` and the filter test would need the new totals.
