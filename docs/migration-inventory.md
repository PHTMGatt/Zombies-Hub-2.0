# Migration Inventory

## Status

The primary Zombies Hub 2.0 migration is complete. This file now records the source repositories and the integrated 2.0 destinations instead of describing the old iframe architecture as current behavior.

## Read-only source repositories

These repositories remain untouched and serve only as migration/reference sources:

- `PHTMGatt/Zombies-Hub`
- `PHTMGatt/Origins-Guide`
- `PHTMGatt/Origins-EE`
- `PHTMGatt/MOTD-Guide`
- `PHTMGatt/Der-Eisendrache-Guide`
- `PHTMGatt/Zetsubou-Guide`
- `PHTMGatt/Gorod-Krovi-Guide`
- `PHTMGatt/Revelations-Guide`

Target repository:

- `PHTMGatt/Zombies-Hub-2.0`

## Integrated runtime

Zombies Hub 2.0 uses one repository-level React/Vite runtime, one Hub router, and one Render deployment. Dedicated guides mount directly below `/maps/...` routes; they are not loaded from the old standalone Render services.

Top-level Hub routes include:

- `/`
- `/allmaps`
- `/easter-eggs`
- `/easter-eggs/:slug`
- `/maps/:slug`
- `/info/:slug`
- `/side-easter-eggs`
- `/side-easter-eggs/:mapKey`

Dedicated modules:

- `/maps/origins/*`
- `/maps/mob-of-the-dead/*`
- `/maps/shadows-of-evil/*`
- `/maps/der-eisendrache/*`
- `/maps/zetsubou-no-shima/*`
- `/maps/gorod-krovi/*`
- `/maps/revelations/*`

## Origins

Integrated features:

- main Easter Egg guide
- Fire Staff
- Ice Staff
- Wind Staff
- Lightning Staff
- Origins Speed Run under Side Easter Eggs

The current module uses namespaced routes and map-scoped styling. Legacy standalone route names are retained only as compatibility routes where useful.

## Mob of the Dead

Integrated guide flow:

- main `Pop Goes the Weasel` roadmap
- Plane + bridge trips
- Retriever + skulls / spoon progression
- Afterlife codes + audio trail
- final Afterlife flight / bridge showdown

Old standalone page URLs such as `free-blundergat`, `spoon`, `redeemer`, and `logs` redirect into the corrected consolidated 2.0 flow instead of maintaining duplicate guide content.

## Shadows of Evil

Integrated sequence:

1. Four rituals
2. Apothicon Sword
3. Pack-a-Punch
4. Sword upgrade
5. Flag step
6. Shadowman
7. Four-player train/Keeper finale

Solo can reach and defeat the Shadowman; the full ending requires four players.

## Der Eisendrache

Integrated features:

- main `My Brother’s Keeper` roadmap
- Shield + Ragnarok gear
- both wisp cycles and timestamp reference
- base bow
- Storm / Fire / Wolf / Void bow upgrades
- dedicated Keeper boss guide

## Zetsubou No Shima

Integrated features:

- main `Seeds of Doubt` roadmap
- setup/prerequisites
- Skull / blueprint / Masamune progression
- three individual cog references
- buildables
- elevator / Giant Thrasher ending
- extras/rewards

## Gorod Krovi

Integrated features:

- main `Love and War` roadmap
- buildables / quest gear
- trophies and S.O.P.H.I.A. challenges
- randomized Valve Solver
- dragon + Nikolai boss guide

## Revelations

Integrated features:

- main `For The Good Of All` step selector
- Apothicon Servant upgrade
- egg/Gateworm locations
- rune/sound reference
- Summoning Key throws
- transcript-verified final sequence

Focused reference pages retain direct timestamp/video behavior so players can jump to the exact mechanic they need.

## Migration cleanup rules

The 2.0 repository should not retain duplicate implementations from the standalone apps once a feature has a verified integrated replacement. Compatibility URLs may remain, but they should route into the current source of truth rather than duplicate stale content.

Map CSS must stay scoped beneath each map module root. The Hub owns global layout and routing; map modules own their internal guide UI and visual identity.

## Verification

`scripts/critical-routes.mjs` is the shared route inventory for production smoke and visual QA. Current QA covers the Hub, Side Easter Eggs, every dedicated map landing page, and the important focused guide/tool routes on both desktop and mobile.

The original repositories and old deployments remain untouched for reference and rollback history.
