# Origins Interactive / Speedrun Guide Roadmap

This is a future feature for Zombies Hub 2.0. It should be built **after the static Origins guide and the core Hub migration are stable**.

## Core rule

The existing Origins guide remains the fast, flat, readable reference. The interactive mode is an additional tool — not a replacement.

Suggested Origins navigation entry:

- `Interactive EE`
- or `Speedrun`

The route should live inside the Origins module, for example:

```text
/maps/origins/interactive
```

## Purpose

The interactive guide should help players:

- learn the Easter Egg without constantly reopening a video;
- memorize staff puzzles;
- practice repeatable inputs such as Lightning Staff switches;
- rehearse the run order used in speedruns;
- test themselves before attempting a real run;
- build muscle memory for puzzle recognition.

## Two-mode Origins experience

### Static Guide

Keep the current Origins experience:

- Main Guide
- Ice Staff
- Fire Staff
- Wind Staff
- Lightning Staff

This remains the quickest visual reference during a normal game.

### Interactive / Speedrun Guide

A separate interactive experience that can grow over time.

Potential sections:

1. Full Easter Egg run-order trainer
2. Staff puzzle practice
3. Lightning switch trainer
4. Staff-build / upgrade memory test
5. Timed speedrun practice
6. Randomized quiz mode

## Wind Staff puzzle trainer

Recreate the circular Wind Staff puzzle from the in-game chamber.

Interaction concept:

- render the large outer circle and inner symbol rings;
- clicking/shooting a ring rotates it exactly as an in-game shot would;
- animate each ring rotation rather than instantly swapping the image;
- optional Wind Staff firing animation / audio feedback;
- player solves the arrangement without seeing the answer first;
- `Check Solution` validates the current ring alignment;
- `Reset Puzzle` restores the starting state;
- optional `Show Guide` reveals the static reference image.

The final implementation should use verified in-game rotation behavior rather than approximating the puzzle.

## Ice Staff puzzle trainer

Recreate the Ice Staff symbol-reading step as an interactive translation exercise.

Interaction concept:

- present the current in-game symbol;
- player chooses / shoots the matching translated symbol;
- correct choices advance to the next symbol;
- incorrect choices provide feedback without immediately giving away the entire solution;
- optional practice mode can randomize symbols;
- optional guide mode displays the existing static reference image.

The exact symbol set and interaction logic should be verified against the final Origins source material before implementation.

## Lightning Staff trainer

Use the existing Lightning Staff switch-reference work as the visual basis.

Interaction concept:

- render each switch in its correct updated visual style;
- allow the player to rotate / flip each switch;
- preserve the real switch orientation logic;
- validate the completed switch sequence;
- support a clean practice/reset loop;
- optionally time the player from first input to correct completion.

The existing static switch image can remain available as a quick-reference popup from the Lightning Staff page.

## Fire Staff trainer

Potential interactive practice:

- symbol / number recognition;
- correct orb / puzzle input order;
- randomized memory checks;
- static-reference reveal when requested.

Exact mechanics should be implemented only from verified Origins source material.

## Full run trainer

The eventual full trainer can walk the player through the complete Easter Egg in order.

Possible UX:

- one objective at a time;
- `Done` advances to the next objective;
- expandable hint;
- optional image/reference button;
- optional video reference only when needed;
- timer that can be enabled for practice;
- split times for major milestones;
- reset/restart run;
- local best-time storage;
- practice mode versus test mode.

## Test mode

Test mode should hide answers by default.

Examples:

- solve a randomly selected staff puzzle;
- complete Lightning switches from memory;
- identify the correct next Easter Egg objective;
- put major Origins steps into the correct order;
- answer staff-build / upgrade questions;
- complete a full run-order test without hints.

Results can show:

- correct / incorrect;
- total time;
- puzzle time;
- missed steps;
- hints used;
- personal best stored locally.

## Visual / audio direction

The feature should feel like Origins, not like a generic quiz application.

Use:

- the existing Origins color language;
- staff-specific elemental accents;
- subtle weapon-fire audio where useful;
- ring / switch animations that communicate the actual state change;
- dark, readable glass panels over Origins artwork;
- large touch targets so the trainer also works on phones.

Avoid excessive animation that slows down actual practice.

## Implementation rule

Do not begin the full interactive system until the static guide migration is stable and verified. When implementation starts, build each puzzle as an isolated component so it can be tested independently before combining everything into the final speedrun trainer.
