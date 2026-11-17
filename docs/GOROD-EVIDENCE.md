# Gorod Krovi: valves, trophies and bomb step: location evidence

CHARLIE · Sonnet, 2026-11-17. Sources: our data (`valveSolutions.js`, `gorodRun.js`), the map image `maps/gorod-krovi/src/assets/GK_Map.webp` (viewed), [codzombiesguides.com Gorod Krovi](https://www.codzombiesguides.com/main-quests/black-ops-3/gorod-krovi/). Bryen's rule: a location is a picture of the spot plus a landmark, never just a name.

## Valves (six spots; the solver inputs are "where the green light starts" and "where the cylinder is")

| Spot | Landmark on the map image today | Picture of the real valve | Gap |
| --- | --- | --- | --- |
| Dragon Command | Up stairs, turn right, opposite Sophia | none | photo of the valve + the stairs |
| Armory | Top floor, opposite the 500-point bridge | none | photo |
| Supply Depot | Ground floor, underneath the balcony | none | photo |
| Infirmary | Middle level, tucked next to a bunk bed | none | photo |
| Tank Factory | Ground floor, opposite the metal walkways | none | photo |
| Department Store | Top floor, next to the staircase | none | photo |

The one picture we have is the annotated map with all six marked (so each has a map pin and a landmark line). 30 start/end solutions are in `valveSolutions.js` (6 starts × 5 ends). The unmistakable-spot gap: **no in-game photo of any valve**, so a player who doesn't know the map still has only a text landmark and a map pin.
Rule of the egg (source): the green-light valve and the whistling-valve cylinder are random per game; the generator countdown is about 5 minutes.

## Six silver trophies (the hunt)

| # | Place | Trigger (our data) | Picture | Gap |
| --- | --- | --- | --- | --- |
| 1 | Tank Factory / Double Tap | Guard of Fafnir fireball on the left window so it hits the pipe and ejects the trophy | none | photo of the window + pipe |
| 2 | Dragon Command exterior | Shoot the trophy from the raised statue hand above the tank, collect below | none | photo of the statue |
| 3 | Supply Depot exterior | Dragon Strike on the marked puddle | none | photo of the puddle |
| 4 | Supply Depot | Giant laser trap, trophy on the blasted floor | none | photo |
| 5 | Pack-a-Punch / Hatchery | Shoot the red light on the sewer exit until green; toilet trophy | none | photo of the light and the toilet |
| 6 | Operations Bunker safe | Gauntlet Whelp at the locked safe, then heavy-melee the safe with the Gauntlet | none | photo of the safe |

## Bomb step (the Bomb Challenge, one of the six challenges)

Our data: watch the Dragon Command screen, memorise the flashed location order, disable every terminal in that order (tip: screenshot the sequence). Source: ~60 seconds in co-op, ~3 minutes solo (the "never state unconfirmed numbers" rule: ours doesn't state the times, which is the safer choice).
**Missing:** the list of bomb terminal locations and their on-screen names; **no picture of any bomb terminal or of the Dragon Command screen**. This is the highest-risk step for a player who doesn't know the map ("game over 99% unless you know every location"). Do not invent the locations: they need a source or a capture.

## Cleanup found

`maps/gorod-krovi/src/data/trophies.js` lists four entries ("Penetrating Multikill", "Gersch Module Defender", "Mangler Speed Kill", "Napalm Strike") and **nothing imports it**. It describes challenge-style tasks, not the six silver-trophy places above. Keep it out of any new design; candidate for deletion (needs the owner's OK).
