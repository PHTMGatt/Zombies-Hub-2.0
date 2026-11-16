# SEO copy review (Grey's "Zombies SEO copy", ticket grey-30)

CHARLIE · Sonnet, 2026-11-16. Applied in `apps/hub/src/app/routeMetadata.js` (titles ≤60, descriptions ≤155, tested in `scripts/route-metadata.test.mjs` for every dedicated-map route and tab).

## Applied

- **Map first in titles:** `<Map> Easter Egg Guide | Zombies Hub 2.0` for the seven guides, `<Map> <Tab> | Zombies Hub 2.0` for tabs (was `Tab | Map | Zombies Hub 2.0`, which lost context).
- **Hub titles:** "Call of Duty Zombies Easter Egg Guides", "All Call of Duty Zombies Maps", "Main Zombies Easter Egg Guides" (the hub covers older games, so "Call of Duty Zombies", not a Black Ops 3 label).
- **Descriptions:** `/allmaps` and `/easter-eggs` use Grey's wording (accurate: they say some maps are still in progress / coming soon). The site description is now 147 characters (was 158).
- **Tab names follow the guides' own navigation:** Storm Bow, Valve Solver, Boss Fight, Gear, Retriever + Skulls, Final Fight, Step Details.
- Step details pages get their own description ("warnings, how-to lines and tips, one section per step").

## Rejected, and why

1. **"| BO3 Zombies" on every map title.** Mob of the Dead is a Black Ops 2 map in the hub (and Origins is in both BO2 and BO3). The label would be false for those two. Titles carry no game label; the page text and the map's info page carry it.
2. **"a progress checklist" / "progress tracking" in descriptions.** Progress saving is not built (the Coming Soon page says so); only "mark this Easter Egg complete" exists. Unsupported claim.
3. **The boilerplate tab description** ("Explore X instructions and reference notes … separate from the short main Easter Egg checklist"). Same sentence on 40 pages, awkward grammar ("Explore plane parts instructions"), and it describes our internal structure rather than the page. Existing per-tab descriptions kept.
4. **"Lightning Bow"** for the `electric` route. The hub calls it Storm Bow everywhere.
5. **"Final Step", "Plane Parts", "Hell's Redeemer", "Audio Logs"** as tab names. The guide navigation says Final Fight and Plane; `free-blundergat`, `spoon`, `redeemer` and `logs` are redirects, not pages, so they get no metadata.
6. **"seven dedicated BO3 guides"** (sharing plan wording): same error as 1.
7. **The Zetsubou cog-page copy** is conservative guesswork by Grey's own note; the existing "<Tab>: part of the <Map> Easter Egg guide" wording stays.

## Open (BETA, prerender)

- `index.html`'s static title/description match the new home values, so the unprerendered shell and the prerendered `/` agree.
- `scripts/prerender-meta.test.mjs` asserted the old "Maps, Easter Eggs &amp; Guides" title to test ampersand escaping; no title contains `&` now, so the test checks that no raw `&` survives instead. A synthetic title with `&` would test the escape function itself.
- Grey's point stands that link-preview crawlers may not run JavaScript: prerendered heads are the fix and are BETA's.
