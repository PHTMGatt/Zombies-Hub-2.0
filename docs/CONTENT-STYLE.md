# Content style: keeping guide text consistent

One page for anyone editing guide data (`maps/*/src/data/**`, Step details tabs, tab pages). Presentation is not covered here; see `docs/polish-roadmap.md`.

## Hard rules

- **Never change a fact to fix style.** Wording only. Numbers, names, order of steps, codes, solver data and timestamps stay as they are.
- A changed or removed line must still be somewhere. The content tests (`guide-content.test.mjs`, `content-browser-smoke.mjs`) compare against the pre-redesign baseline: moving a line to the Step details tab is fine; rewording or deleting one needs an entry in `scripts/fixtures/approved-removals.json` (line, reason, spec) and Bryen's OK for guide facts.
- Do not state a number that is not confirmed (see `docs/FACT-DECISIONS.md`).

## Names (write exactly like this)

Pack-a-Punch (never PaP/PAP in visible text; "Pack-a-Punched" as the verb form) · Apothicon · Apothicon Servant · Gateworm · Margwa · Panzer / Panzersoldat · Summoning Key · Maxis Drone · S.O.P.H.I.A. (dots, all caps) · Kronorium · Ragnarok DG-4 · Ray Gun Mark 3 · Wundersphere · Skull of Nan Sapwe · Keeper / Keeper Protector · Afterlife · Hell's Retriever · Dragon Strike · Zombie Blood · One Inch Punch · G-Strike · Crazy Place · Original difficulty. Map names: Origins, Mob of the Dead, Shadows of Evil, Der Eisendrache, Zetsubou No Shima, Gorod Krovi, Revelations. Perks use their in-game names (Double Tap, Mule Kick, Juggernog, Speed Cola, Stamin-Up).

Spelling and punctuation: co-op (Co-op at the start of a line), curly apostrophes (’), an em dash with spaces ( — ) for asides and "name — place" pairs, an arrow (→) for "go from → to", "×" not "x" for counts. Numbers: digits for counts and quantities (3 minutes, 4 wisps), words only for "one" in prose.

## A main-guide step line (`goal`)

- One sentence, or two very short ones. **At most 140 characters; aim for 115** (the 390 px smoke caps it at four lines).
- Starts with the action ("Shoot…", "Build…", "Hold…"), not "You need to…".
- Says what to do and the one thing that makes it succeed or fail. Everything else goes to Step details.
- No chips, no lists, no images, no per-game state. At most two links (usually the tab that owns the detail, then "Step details").

## Step details sections

- Same step ids and order as the main guide, anchor `#step-N`.
- Order inside a step: fuller goal, **warnings**, numbered how-to, references (facts, chips, sequences), "Not working?" tips, video link.
- How-to lines are imperative and short, one action each. Tips explain recovery, not repeat the how-to.
- Reference lists: "Label: value" facts, parallel wording within a list, no sentence punctuation unless a line is a sentence.

## A warning (`critical`)

- States the consequence or the trap in one sentence, ideally cause first: "All six generators must be on when the last staff goes in, or the staffs stay locked."
- Only for things that can break the run or are easy to miss. Normal advice is a tip ("Not working?"), not a warning.
- No "Note:", no "Warning:", no exclamation marks, no all caps except a game term already in caps (a hard exception exists for "TAKE THE VRIL GENERATOR").
- The page adds the "Watch out:" label; do not write it in the data.

## Checking an edit

`npm test` (content-preservation and shape guard), then the browser smokes. `node scripts/main-guide-shape.mjs --write` only after a step got flatter.
