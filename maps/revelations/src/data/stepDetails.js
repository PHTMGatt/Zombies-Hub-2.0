import React from 'react';
import RunNote from '../../../../shared/guide/RunNote';
import apothiconSteps from './ApothiconSteps';
/*
 * Revelations "Step details" tab (one anchored section per step: #step-1 ... #step-12). Holds everything the flat
 * main guide (revGuideSteps.jsx) no longer shows: the fuller goal, warnings, how-to lines, tracker task lines (now a
 * plain checklist), tips and reference lists. Same step ids and order. Facts come only from ApothiconSteps.js
 * (test-guarded). The blue-rock, bone and turret screenshots moved to the Apothicon Upgrade and Egg Locations tabs
 * (revReferenceShots.js). Moved here 2026-11-16 (Bryen flat main-guide spec).
 */
const MAP = 'revelations';
const SYMBOL_NOTE_KEY = 'zh-rev-kronorium-symbols';

const phase = (title) => {
  const found = apothiconSteps.find((item) => item.title === title);
  if (!found) throw new Error(`revGuideSteps: no ApothiconSteps entry titled "${title}"`);
  return found;
};
const how = (title, ...skip) => [phase(title).detail, ...phase(title).bullets.filter((line) => !skip.some((pattern) => pattern.test(line)))];
const line = (title, pattern) => {
  const found = phase(title).bullets.find((item) => pattern.test(item));
  if (!found) throw new Error(`revGuideSteps: no line matching ${pattern} in "${title}"`);
  return found;
};

const T = {
  ENGINES: 'Tombstones + Corruption Engines',
  KEEPER: 'Keeper Protector + Required Weapons',
  SERVANT: 'Upgrade the Apothicon Servant',
  REEL1: 'Audio Reel 1 — Keeper Ritual',
  REEL2: 'Audio Reel 2 — Li’l Arnie Holes',
  REEL3: 'Audio Reel 3 — Six Bones',
  SOPHIA: 'Materialize S.O.P.H.I.A.',
  EGGS: 'Kronorium + Four Eggs',
  RUNES: 'Runes of Creation',
  SYMBOLS: 'Symbol Room + Summoning Key',
  THROWS: 'Seven Summoning Key Throws',
  BOSS: 'Final Boss — Shadowman',
};

const revStepDetails = [
  {
    id: 'engines',
    title: 'Tombstones + engines',
    // Outcome, action order, and code each have one home. Do not repeat instructions.
    goal: 'Open Pack-a-Punch to begin the main quest.',
    refs: [{ type: 'sequence', label: 'Tombstone order', items: ['2', '3', '1', '4'],
      note: 'A sound cue and small fire flash confirm the code.' }],
    checklist: ['Shoot the four Spawn tombstones', 'Engine — Spawn', 'Engine — Der Eisendrache', 'Engine — Verrückt', 'Engine — Mob of the Dead', { k: 'Pack-a-Punch dropped', v: 'Use the Nacht console as the Giant Apothicon passes; inside, shoot all three yellow sacs.' }],
    // No redundant More section; all unique gameplay facts are above.
  },
  {
    id: 'keeper',
    title: 'Keeper parts + weapons',
    goal: 'Collect the three Keeper Protector parts. Make sure the run has Li’l Arnies and the Apothicon Servant.',
    checklist: ['Gemstone', 'Keeper head', 'Flag', 'Li’l Arnies', 'Apothicon Servant'],
    how: how(T.KEEPER),
  },
  {
    id: 'servant',
    title: 'Upgrade the Servant',
    goal: 'Hit all five blue rocks in the sky with the Apothicon Servant, then Pack-a-Punch it in the Apothicon.',
    checklist: ['Spawn rock', 'Shangri-La rock', 'Verrückt rock', 'Mob of the Dead rock', 'Nacht rock', 'Servant Pack-a-Punched'],
    // The written rock list in the data disagrees with these captures (it names Der Eisendrache); the
    // captures are shown and the conflicting line is left out until it is verified.
    how: how(T.SERVANT, /transcript/i),
  },
  {
    id: 'reel-1',
    title: 'Reel 1 — Keeper ritual',
    goal: 'Find the triangular ritual rock, crouch on it while the jump pad is off so the Keeper starts the ritual, protect the Keeper for three minutes, take the reel to Nacht’s radio.',
    refs: [{ type: 'chips', label: 'Triangle rock: one of', items: ['Shangri-La', 'Mob of the Dead', 'Verrückt'] }],
    checklist: ['Keeper protected (3 min)', 'Reel in the Nacht radio'],
    how: how(T.REEL1),
  },
  {
    id: 'reel-2',
    title: 'Reel 2 — Arnie holes',
    goal: 'In the Apothicon, throw Li’l Arnies into all nine wall holes, never the same one twice. Kill the Margwas after each three.',
    checklist: ['Holes 1–3 + Margwas', 'Holes 4–6 + Margwas', 'Holes 7–9 + Margwas', 'Reel in the Kino stage radio'],
    how: how(T.REEL2, /Max Ammo/, /resets those three holes/),
    // Recovery lines from ApothiconSteps.js, shown as "Not working?" tips (same text, moved out of the how-to list).
    problems: [line(T.REEL2, /Max Ammo/), line(T.REEL2, /resets those three holes/)],
  },
  {
    id: 'reel-3',
    title: 'Reel 3 — Six bones',
    goal: 'Reveal each bone with a Pack-a-Punched bullet weapon, absorb it with the upgraded Servant, then finish the body at Nacht.',
    checklist: ['Spawn bone', 'Shangri-La bone', 'Origins bone', 'Verrückt bone', 'Der Eisendrache bone', 'Nacht bone', 'Reel on top of the Origins mound'],
    how: how(T.REEL3),
  },
  {
    id: 'sophia',
    title: 'Materialize S.O.P.H.I.A.',
    goal: 'At each Corruption Engine, hit the left of the two blue rocks above it with the laser turret (left as you face the Nacht portal). Then activate S.O.P.H.I.A. at Nacht.',
    critical: [line(T.SOPHIA, /kicks you off/)],
    checklist: ['Turret — Spawn', 'Turret — Der Eisendrache', 'Turret — Verrückt', 'Turret — Mob of the Dead', 'S.O.P.H.I.A. activated'],
    how: how(T.SOPHIA, /kicks you off/),
  },
  {
    id: 'eggs',
    title: 'Kronorium + four eggs',
    goal: 'Get the Kronorium from Samantha’s bed, place it on the podium on the Kino stage, then hatch all four eggs in the Apothicon’s nests.',
    refs: [{ type: 'sequence', label: 'Each egg', items: ['Into a yellow nest / pustule', '10 zombie souls', 'Gateworm'] }],
    checklist: ['Kronorium on the stage podium', 'Gateworm 1', 'Gateworm 2', 'Gateworm 3', 'Gateworm 4'],
    how: how(T.EGGS),
  },
  {
    id: 'runes',
    title: 'Runes of Creation',
    goal: 'Use each Gateworm to find its hidden rune. Listen for the beeping at the right spot.',
    checklist: ['Rune 1', 'Rune 2', 'Rune 3', 'Rune 4'],
    how: how(T.RUNES),
  },
  {
    id: 'symbols',
    title: 'Symbol room',
    goal: 'All players enter together through the Kino projector room’s purple rift. Read the Kronorium, enter its symbol order, survive the Margwas.',
    critical: [line(T.SYMBOLS, /symbol order changes every game/)],
    refs: [
      {
        type: 'custom',
        key: 'symbol-note',
        render: () => React.createElement(RunNote, {
          storageKey: SYMBOL_NOTE_KEY,
          mapId: MAP,
          label: 'Kronorium order · this game',
          hint: 'enter it at the back of the room',
          slots: ['1st', '2nd', '3rd', '4th'],
        }),
      },
    ],
    checklist: ['Margwa wave 1', 'Margwa wave 2', 'Margwa wave 3', 'Margwa wave 4'],
    how: how(T.SYMBOLS),
  },
  {
    id: 'throws',
    title: 'Seven key throws',
    goal: 'Back on the map, hit all seven targets with the Summoning Key.',
    critical: [line(T.THROWS, /melee during the transition/)],
    checklist: [{ k: 'Kino', v: 'Chandelier' }, { k: 'Der Eisendrache', v: 'Clocktower face near the Corruption Engine' }, { k: 'Shangri-La', v: 'Focusing Stone on the staff, top of the stairs' }, { k: 'Origins', v: 'Tombstone at the top of the mound' }, { k: 'Mob of the Dead', v: 'Poster inside the open cell' }, { k: 'Verrückt', v: 'MG42 on the fountain' }, { k: 'Nacht der Untoten', v: 'Red barrel' }],
    how: how(T.THROWS),
  },
  {
    id: 'boss',
    title: 'Final boss — Shadowman',
    goal: 'Charge an altar with kills, throw the Summoning Key through ghost S.O.P.H.I.A., then shoot the Shadowman into the Apothicon’s mouth.',
    refs: [{ type: 'sequence', items: ['Charge an altar (~10 kills)', 'Key through ghost S.O.P.H.I.A.', 'Shoot the Shadowman', 'Interact with the book'] }],
    how: how(T.BOSS),
  },
];

// The old tracker task lines, as a plain checklist at the end of each step's references: lines with a hint become
// "name: hint" facts, the rest plain list lines.
const withChecklist = ({ checklist, ...step }) => {
  if (!checklist) return step;
  const plain = checklist.filter((item) => typeof item === 'string');
  const hinted = checklist.filter((item) => typeof item !== 'string');
  return {
    ...step,
    refs: [
      ...(step.refs ?? []),
      ...(plain.length ? [{ type: 'chips', label: 'Checklist', items: plain }] : []),
      ...(hinted.length ? [{ type: 'facts', label: plain.length ? undefined : 'Checklist', items: hinted }] : []),
    ],
  };
};

export default revStepDetails.map(withChecklist);
