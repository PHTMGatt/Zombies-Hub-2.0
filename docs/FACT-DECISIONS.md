# Fact decisions for Bryen

Written by DELTA · Sonnet, 2026-11-16, from Grey's Notion fact check ("Zombies fact check (Grey)", 18 rows) compared with DELTA's pass-1 list and the current guide data. Grey's sources are fan guides, not fresh in-game runs. Nothing below has been changed in the guide: no number is stated that is not confirmed.

## Short version (for Bryen)

1. **SoE ritual length.** Guide says "roughly 30 seconds" (also Canals flag "about 30 seconds"); no source confirms a fixed time. Options: soften to "survive until it ends" (recommended) / keep / remove.
2. **DE dragon feed.** Guide says eight zombies per dragon; most sources agree, one says six. Options: keep eight plus "until the dragon crumbles" (recommended) / drop the number.
3. **SoE Margwa.** Guide ties the Margwa to the Footlight (fourth) ritual; Grey says the 2nd and 4th completed ritual. Options: keep / reword by completion order.
4. **Rev wave counts.** "Two Margwas per wave, one more in co-op" is from one unverified source. Options: keep / soften to "four Margwa waves".
5. **Zetsubou 20 Keepers solo.** Not in the guide and unconfirmed. Option: keep it out (default).

Everything Grey marked High already matches the guide, nothing was changed.

## Applied: High-confidence rows

None needed. Every High row either already matches the guide or is not stated in it:

| Grey row | Claim | Guide today | Result |
| --- | --- | --- | --- |
| 1 | Rev Keeper ritual is about 3 minutes, not "a minute" | "Protect it for three full minutes" (`ApothiconSteps.js` 39, 44) | already right |
| 2 | Rev symbol order is per match | "randomized four-symbol order" | already right |
| 4 | Keeper Protector has three parts | three parts | already right |
| 6, 7 | Mob: six zombies per head, three heads, then Hell's Retriever | same | already right |
| 8 | SoE: four rituals, four Gateworms, fifth Pack-a-Punch ritual | same | already right |
| 12 | DE: ranked one bow per player, unranked/local all four | "Ranked / online: one upgraded bow per player. Local / offline or unranked: all four bows." | already right |
| 13 | Gorod: six valve locations, set the other five | "Find the green-lit valve and the Master Code Cylinder, set the other five valves" | already right (older line in `gorodRun.js` 31 says "set the five valves", which is consistent) |
| 14, 15, 16, 17 | KRONOS, five S.O.P.H.I.A. challenges, four skulls, Nan Sapwe functions | same | already right |

## Bryen decides

For each: keep, soften (remove the number, keep the instruction) or remove.

| # | Grey row | Confidence | Current guide text | Options |
| --- | --- | --- | --- | --- |
| 9 | SoE: is the Pack-a-Punch ritual exactly 30 seconds? Unconfirmed; one guide says duration changes in co-op | Low | "Survive for roughly 30 seconds until the ritual completes." (`soeGuide.js` 30); "Survive ~30 s" (`stepDetails.js` 87) | Soften to "Survive until the ritual ends." (recommended); keep "roughly 30 seconds"; remove |
| 9b | Same family, not in Grey's list: Canals flag defence "about 30 seconds" | not checked | `soeGuide.js` 50 | Soften to "until the placement is done", or keep and have it timed in game |
| 10 | SoE: Margwa comes from the second and fourth completed ritual, not a named district | Medium | Rituals step names the Footlight (fourth) ritual as the Margwa one | Keep (matches the walkthrough order), or reword to "the second and fourth ritual you complete" |
| 11 | DE: eight zombies per dragon, one guide says six | Medium, conflicting | "eight" in `deGuide.ts` 24, `bowGuides.ts` 14-15, Dragons "8 single kills each" | Keep eight and add "feed until the dragon crumbles" (recommended); soften to the instruction only; remove the number |
| 18 | Zetsubou: solo Keeper defence needs 20 Keepers | Low | Not stated anywhere in the guide | Nothing to do; keep it out |
| 3 | Rev: four combat waves after the symbols | Medium | "four sets of two Margwas (one more per wave in co-op)" | Keep; the 2-per-wave and co-op +1 counts are from the same unverified source, soften them if Bryen wants |
| 5 | Rev: three possible jump-pad locations for the ritual rock | Medium | "one of the three possible jump pads" | Keep, it already says "possible" |

## From DELTA's pass 1, still unverified (not in Grey's list)

Rev four turrets "8,000 points in total", Mob "does not activate on Easy", SoE Arch-Ovum character-to-room map, DE Keeper Stone slot at Double Tap and boss stun count, Gorod valve "5-minute window", Zetsubou Nan Sapwe "unlocked after the Keeper encounter" and KT-4 parts list. Full list: `delta-zombies-factcheck-pass1-2026-11-16.md` in the shared notes folder.

## Pass 2 (CHARLIE · Sonnet, 2026-11-16, two web searches)

- **Mob of the Dead "Original difficulty only / does not activate on Easy":** one source, [Trophy Hunters](https://trophieshunter.com/games/call-of-duty-black-ops-ii-xbox/achievements/pop-goes-the-weasel), says to start on original difficulty (not Easy). Needs a second source before it is called confirmed. Guide text unchanged.
- **Gorod Krovi "5-minute window" for the Hatchery generator:** the generator under the tarp and the Valkyrie drone are confirmed by guides; **no source gave a 5-minute timer**. Options: keep, soften to "you have a limited time; press the button beside the generator to restart" (the restart button is in the same line), remove the number. Not changed.
- Mob "Weasel for 2–3 players" and "solo stops before the finale": consistent with the SegmentNext and co-op guide notes found (full quest needs two or more players).
