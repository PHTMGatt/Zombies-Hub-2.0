# Design content input: Revelations hunts + Origins staffs

CHARLIE · Sonnet, 2026-11-16, for ALPHA (design) and Gandalf. Facts only; nothing invented. No design or data changes were made.

**Sources:** S1 = [callofdutyzombies.com, Third Audio Reel](https://www.callofdutyzombies.com/easteregg/guides/call_of_duty_black_ops_iii_zombies/main-easter-eggs/revelations-a-better-tomorrow/obtaining-the-third-audio-reel-r216/); S2 = [codzombiesguides.com Revelations](https://www.codzombiesguides.com/main-quests/black-ops-3/revelations/); S3 = [codzombiesguides.com Origins](https://www.codzombiesguides.com/main-quests/black-ops-2/origins/); S4 = Bryen's Drive heritage notes (6 phone screenshots, 2026-11-05; text read by OCR only, the connector cannot show the pictures); Video = CodeNamePizza `tt3mpH7Rrfo` (the guide's video; timestamps below are from `eggData.js`, `SoundStepData.js`, `SummoningKey.js`); Shots = repo screenshots in `maps/revelations/src/assets/rev-ref/`.
"Match" means our data and the source agree. Wording in quotes is the source's, shortened.

## 1. Counts: Bryen's brief vs the sources

| Item | Bryen's brief | Sources + our data | Verdict |
| --- | --- | --- | --- |
| Tombstone code | "2314?" (he said probably wrong) | Shoot in this order: Richtofen, Dempsey, Takeo, Nikolai. Tombstones left to right are **Second, Third, First, Fourth**, so the positional order is **2-3-1-4** (S2). Our data says 2-3-1-4. | Our data right. "2314" is only the same digits in a different order: the shooting order is 2 → 3 → 1 → 4 |
| Hidden bones | 5 | **6** (S1, S2). Ours: 6 | Brief is off by one |
| Egg spawn spots | 4 sets × 4 = 16 | 4 areas × 4 = **16** (S2). Ours: 16 | Match |
| "Symbol" spots | 3 sets × 4 = 12 | It is the **runes** (Sound Step): **4 areas × 3 = 12** (S2). 4 runes are needed, one per Gateworm/egg set | 12 is right, the grouping is 4 areas of 3, not 3 of 4 |
| Summoning Key throws | ~8, Nacht last | **7** targets, any order (S2); Nacht is one of the seven. Ours: 7 | Brief is off by one. Which target is last is not fixed: S2 lists Kino last, our video order lists Nacht last |

## 2. Six hidden bones

All are shot off with a Pack-a-Punched bullet weapon, absorbed with the upgraded Servant; the pile forms on the upper level of Nacht (S1).

| # | Area | Landmark a stranger can find | Sources | Existing cover | Gap |
| --- | --- | --- | --- | --- | --- |
| 1 | Spawn | Inside the church, above or around a candle; stand on the Corruption Engine platform and look in (S1). S2: "inside the Church" | S1 + S2 agree | Shot `bone-spawn.webp` | No video timestamp |
| 2 | Shangri-La | Above the Stamin-Up machine (S1, S2) | agree | `bone-shang.webp` | No timestamp |
| 3 | Origins | **Outside the map**, behind the VMP wall buy (S1); "next to the Giant footprint, outside the map" (S2) | roughly agree, two different anchors | `bone-origins.webp` | No timestamp. Needs a look: is the VMP wall buy beside the Giant footprint? |
| 4 | Verrückt | Left of the Corruption Engine while facing it, above a big rock (S1); "near the waterfall" (S2) | agree | `bone-verruckt.webp` | No timestamp |
| 5 | Der Eisendrache | **Wall run outside the map** (antigravity): bone on the lower end of the **fourth** floating wall; spray the wall piece with an automatic rifle (S1). S2: "on the wall run track" | agree | `bone-de.webp` | No timestamp. Fourth wall is from one source |
| 6 | Nacht | Roof of the bunker, above the portal to the Der Eisendrache area (S1, S2) | agree | `bone-nacht.webp` | No timestamp |
| Final | Nacht, upper level | Bone pile: absorb it → Sophia's corpse → shoot it again for the reel | S1; other sources differ on whether the corpse is shot once or twice | `bones-absorb.webp` | Shot count unconfirmed |

**Bone gap summary:** all six have a screenshot, none has a video timestamp (the guide video's bone segment is not in our timestamp data).

## 3. Eggs: 4 areas × 4 spawns = 16 (one egg per area)

Our names come from the guide video; S2 wording alongside. Landmarks differ in wording but describe the same areas; the unmatched ones are marked.

| Area | # | Our name (video time) | S2 wording | Match |
| --- | --- | --- | --- | --- |
| Kino / Der Eisendrache | 1 | Front of the stage, seating area (6:39) | Kino: floor on the path to the Bowie Knife | Different anchor, same area: **check** |
| | 2 | Higher tier seating, jump required (6:46) | Kino: higher balcony corner, right of the stage | Match |
| | 3 | Buckets near Wunderfizz (6:51) | Kino: bucket on the ground, right of Wunderfizz | Match |
| | 4 | Statues near mystery box room (6:53) | Der Eisendrache: Primis statue room, at the statues' feet | Match |
| Spawn / Shangri-La | 5 | Barrel next to jump pad toward Origins (6:57) | On a barrel next to the jump pad to Origins | Match |
| | 6 | Trash can near jump pad toward Shangri-La (7:05) | Leaning on a trash can, left of the stairs to the Shangri-La jump pad | Match |
| | 7 | Against wall inside Shangri-La (7:08) | Floor by the window, left of Stamin-Up | Probable, **check** |
| | 8 | Fire pit at bottom of Shangri-La stairs (7:11) | Fire pit at the base of the staircase | Match |
| Verrückt | 9 | Bush in front of Corruption Engine (7:15) | Left side of the path into the building | **Disagree/unclear** |
| | 10 | Next to Wunderfizz (7:21) | Near Wunderfizz, beside two small chairs in a corner | Match |
| | 11 | On debris at top of stairs (7:23) | Right of the blue-lit debris pile near the top of the Speed Cola stairs | Match |
| | 12 | Near Zetsubou test tubes (7:26) | Zetsubou room, floor between two large green test tubes | Match |
| Mob / Origins | 13 | Rock near Corruption Engine (7:34) | Mob: just before the Corruption Engine, near the cells | Probable |
| | 14 | Wunderfizz at Origins mound (7:37) | Origins: left of Wunderfizz | Match |
| | 15 | Tunnels between Mob and Origins (7:40) | Mob: near the KN-44 wall buy | **Check** |
| | 16 | Near Origins robot foot location (7:42) | Origins: left of the Vesper wall buy, beside a pile of rocks | **Check** |

Section ranges for the whole-area clips: Kino/DE 6:38–6:57, Spawn/Shang 6:58–7:14, Verrückt 7:15–7:30, Mob/Origins 7:30–7:47. Only **one** web source was available; the "check" rows need a second source or a look at the video.

## 4. Runes ("Sound Step"): 4 areas × 3 = 12

A Gateworm beeps near its rune; only 4 runes are needed, one per egg set.

| Area | # | Our name (video time) | S2 wording | Match |
| --- | --- | --- | --- | --- |
| Spawn | 1 | Jump pad toward Origins (8:19) | Near the jump pad to Origins | Match |
| | 2 | Jump pad toward Shangri-La (8:22) | Near the jump pad to Shangri-La | Match |
| | 3 | Next to Quick Revive (8:24) | Left of Quick Revive | Match |
| Der Eisendrache / Shangri-La | 4 | Next to DE Pyramid (8:09) | DE: on the Anti-Gravity pressure plate | **Check** (same place, different name?) |
| | 5 | Primis statues / mystery box room (8:11) | DE: in front of the three Primis statues | Match |
| | 6 | Shangri-La, in front of Stamin-Up (8:15) | Shangri-La: panel in front of Stamin-Up | Match |
| Origins / Mob | 7 | Back wall by Corruption Engine (8:30) | Mob: across from the KN-44 wall buy under a lamp | **Check** |
| | 8 | Wall next to cell block (8:33) | Mob: left of the Cafeteria entrance by the fallen bulletin board | **Check** |
| | 9 | Tunnel between Origins and Mob (8:35) | Origins: near the Generator 3 door to the MotD area | Probable |
| Verrückt | 10 | Zetsubou test tubes (8:40) | Right of the two test tubes in the Zetsubou room | Match |
| | 11 | Metal fence by electric trap (8:43) | In front of the metal fencing in the Power Room | Match |
| | 12 | Path toward Kino jump pad (8:45) | On the footpath to the Kino jump pad | Match |

## 5. Summoning Key: 7 throw targets, any order

| Our # (video time) | Map | Target | S2 wording | Match |
| --- | --- | --- | --- | --- |
| 1 (9:55) | Kino | Chandelier | Radio in the chandelier | Match |
| 2 (10:02) | Der Eisendrache | Clocktower face | Clock above the Undercroft | Match |
| 3 (10:05) | Shangri-La | Focusing Stone | Focusing Crystal, left of the temple entrance | Match |
| 4 (10:08) | Origins | Tombstone at the top of the mound | Tombstone on a scaffolding platform, left of Wunderfizz | Match |
| 5 (10:13) | Mob of the Dead | Poster in the open cell | Poster in one of the cells | Match |
| 6 (10:15) | Verrückt | MG42 on the fountain | Mounted MG42 atop the fountain, right of the Corruption Engine | Match |
| 7 (10:18–10:27) | Nacht | Red barrel | Red barrel outside the window, left of the spawn portal | Match |

All seven have a video segment; the Main Guide's Step details also lists them as a Checklist. **Gap:** no still screenshot for any target (video only). The key does not return after the last relic (S2).

## 6. Origins staffs: facts vs our data

| Item | Our data | Sources | Verdict |
| --- | --- | --- | --- |
| **Ice pillar → ceiling tile** | "Pillar order is different every game; follow the order the game shows, use the chart" | S3: a pillar on the ground shows the symbol of the tile to shoot; decode with the cipher image. Nothing says the order is fixed | Consistent. **There is no fixed "Ice tile order".** The chart image (`IceCode`) was not machine-checkable; needs a human eye against Drive photos 1000004810 / 1000004814 |
| **Fire decode** (chart viewed 2026-11-17: 11, 5, 9, 7, 6, 3, blood: **matches the heritage list exactly**) | Four cauldrons lit by ~30 Fire Staff kills on the grates; four symbols upstairs → numbered torches in the basement; 4 always one, bloodstained | S3: same, torches in any order but lit quickly, they stay lit briefly. S4: heritage decode list "11-5-9-7-6-3-4", numbers map to circles, "blood" (= 4) first; kills on the lava plate | Consistent; "4 is always one of them" is supported by S4, not S3. The 7-number list in S4 is the symbol→number key; verify the `FireCode` chart against Drive photo 1000004810 |
| **Wind rings** | Shoot the four ceiling rings until the symbols match the chart | S3: stone disc with four circles, shoot until the symbols match "a specific order shown in images"; S3 forum: symbols match the Ice puzzle's | Consistent. Order is image-only in every source: verify the `WindCode` chart by eye |
| **Lightning piano** (chart viewed: first 1-3-6, second 3-5-7, third 2-4-6) | 1-3-6, 3-5-7, 2-4-6 | S3 + Steam posts + S4: 136, 357, 246 (bottom-row triangles numbered 1–7). Wait for sparks to fade between codes; a mistake needs three random top-row shots before retrying | **Match.** Our page lacks the sparks / mistake-recovery note |
| Lightning switches | 7 dials: Spawn, Gen 2 back door, Gen 5, Gen 4, church basement behind tank, church upstairs, excavation wall | S4 list: Gen 5, behind tank, above tank, by wind tunnel, spawn, tank station, across from the church entrance at Pack-a-Punch | Same seven places. Dial positions are image-only in S3; ours are from the repo's own verified table |

### Upgrade locations our pages do not state (ALPHA may want them on the cards)

| Staff | Our data | Sources |
| --- | --- | --- |
| Wind: three smoking stone balls | "all three smoking stone balls" (no places) | S3: outside the map, left of the tank path when returning to the church; outside the window left of Stamin-Up; near Generator 4 between the generator and the Wind Tunnel. S4: Gen 4, tank entrance, Gen 5. **Agree** |
| Ice: three gravestones | "all three gravestones on the main map" (no places) | S3: near the footprint opposite the KN-44 wall buy; right of the KN-44 wall buy; near Gen 2 outside the map next to the destroyed Giant. S4: above the Pack-a-Punch soul box, Generator 4 soul box, tank station stop by the fallen robot. **Only the Gen 2 / fallen robot one agrees: unresolved, do not publish the others** |

### Heritage notes vs our Main Guide

S4's main-quest list says staffs go in robots: Lightning at spawn, Wind in the middle, Ice at the church, Fire "under Pack-a-Punch", 10–15 Panzers, 50–100 thunder-fist kills. Our Step details use "robot foot / Odin / Gen 5", which is a different step wording, not a contradiction. These are Bryen's own notes from 2026-11-05: not sourced, not used as facts.

## 7. Gaps (picture / timestamp missing)

1. Bones: six screenshots, **no video timestamps**. Needs the bone segment time ranges from CodeNamePizza's video.
2. Egg rows 1, 9, 15, 16 and rune rows 4, 7, 8: wording differs between our video labels and S2. Needs a second source or a look at the video before the names are shown to players.
3. Summoning Key: no screenshots, video only.
4. Ice and Wind charts: image-only in every source. I viewed all four repo charts: Fire and Lightning match the heritage notes; the Ice pairings and the Wind order cannot be checked against any text source, S3 says the Wind rings use "a specific order" (fixed; Grey grey-59 agrees), so Wind is treated as fixed, still single-source and frame-check pending.
5. Ice gravestone places and the Der Eisendrache bone "fourth wall": single-source or conflicting.
6. Bryen's counts (5 bones, 8 throws) are both wrong by one; the designs should say six bones and seven throws.

## 8. Structured data (2026-11-17)

`maps/revelations/src/data/huntData.js` (bones, eggs, runes, Summoning Key targets with landmarks, shots, video ranges, gaps; counts tested in `scripts/rev-hunt-data.test.mjs`) and `maps/origins/src/data/staffPuzzleFacts.js` (what is verified per staff). Neither is wired into a page yet: design-neutral on purpose.

## 9. If Step details goes away: where each kind of fact moves (2026-11-17, Bryen: "WE DONT NEED STEP DETAILS")

Decision `decision:no-step-details:2026-11-17`. Nothing is built or deleted here; this is only the destination list so no fact is lost (the content-preservation tests and `approved-removals.json` still guard every line). Counts are from each map's `stepDetails.js`.

| What lives only in Step details today | Where it should go | Notes |
| --- | --- | --- |
| **Critical requirements / warnings** (Origins 7 steps, Der 7, Gorod 5, Mob 4, SoE 3, Zets 3, Rev 3): e.g. all six generators on at once, every player needs the Iron Fist, Mob needs 2+ players and Original difficulty, Der ranked = one bow / local = four, every Zetsubou player finishes Trials | **Main guide line**, condensed to one short clause on the step that needs it (OG style) | Keep the wording already in `critical`; shorten, never reword the fact |
| **How-to lines** (numbered, 6 of 7 maps; Origins has none for the two staff steps) | **Staff pages** (Origins Ice/Fire/Wind/Lightning: Build, Puzzle, Upgrade) · **Specialist tabs** (Gorod Valves/Trophies/Boss, Der Bows/Wisps/Parts/Boss, Zets Cogs/Buildables/Elevator, Mob Plane/Skulls/Codes) | Most already exist there; the Step details copy is the duplicate Bryen disliked. Check each how-line against its tab before removing |
| **Checklists / chips** (Rev eggs, bones, runes, throws; Gorod six trophies and challenges; Mob skulls; Zets part lists) | **Hunt pages**: the records are already in `huntData.js` (Revelations); Gorod trophies and Zets parts go on their buildables/trophies tabs | One consistent picker, per Bryen's hunt-page rule |
| **Per-game state widgets** (Revelations symbol-order note, Der safe-code note, and the other maps’ run notes and pick tools: check each in its `stepDetails.js`) | **The page of the tool they belong to**: Rev symbol note → the symbol/rune hunt page; Der safe code → Wisps or Boss tab; Mob codes → Codes tab | They hold the player's own saved state; keep with the puzzle |
| **"Not working?" tips** (`problems`, on about 33 steps across the seven maps; Revelations has only 1) | **Main guide line** only for the few that prevent progress (e.g. Rev reel 2, Der safe-code wrong entry); the rest stay unwritten until a source exists | No new tips without a source (STEP-DETAILS-GAPS) |
| **"Before you start" intros** (Mob, Gorod, Der, Zets, SoE) | **Main guide header line** (one sentence: players, difficulty, required gear) | Same lines the old main-guide headers carried |
| **Step videos** (Rev, Der) | **Hunt/specialist page** the video explains (Rev hunt pages, Der Bows) | Credit stays on the video |
| **Anchors `#step-N` and `?from=` Back-to-step links** | Drop with the tab; main-guide links point straight at the staff/specialist/hunt page | Update `stepLinks`, search index and share-head routes when removed |

**Not to lose when it is built:** the three removals already approved for the flat guide are in `approved-removals.json`; anything newly removed needs its destination above or an approved entry.
