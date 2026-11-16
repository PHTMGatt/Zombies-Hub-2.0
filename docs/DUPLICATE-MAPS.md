# Maps that exist in more than one game

CHARLIE · Sonnet, 2026-11-16. Audit only: nothing here has been added to the hub. Source: `apps/hub/src/data/mapData.js` and `mapInfo.js` (each game version is its own `mapData` entry and `/info/<slug>` or `/info/<slug>-chronicles` page). Items marked **(confirm)** are from general knowledge, not from the hub's own data, and must be checked before anyone adds them.

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
