/*
 * Shadows of Evil "Step details" tab (one anchored section per step: #step-1, #step-2, ...). Holds everything the flat main guide
 * (soeGuideSteps.jsx) no longer shows: the fuller goal, warnings, how-to lines, task lines (now a plain checklist), tips and
 * reference lists. Same step ids and order. Moved here 2026-11-16 (Bryen flat main-guide spec); no fact was dropped.
 */
import React from 'react';
import PickTool from '../../../../shared/guide/PickTool';
import RunNote from '../../../../shared/guide/RunNote';
import soeGuide from './soeGuide';

/*
 * Shadows of Evil as guide steps. Facts come only from soeGuide.js (test-guarded); this file reorganises
 * them into what / quick reference / tools / how / problems. Nothing here is new information.
 */
const MAP = 'shadows-of-evil';
const TRAIN_NOTE_KEY = 'zh-soe-train-symbols';
const CHARACTER_KEY = 'zh-soe-character';

// Look phases up by title and lines by content; a missing match fails loudly (and in the smoke test).
const phase = (title) => {
  const found = soeGuide.find((item) => item.title === title);
  if (!found) throw new Error(`soeGuideSteps: no soeGuide phase titled "${title}"`);
  return found;
};
const line = (title, pattern) => {
  const found = phase(title).notes.find((note) => pattern.test(note));
  if (!found) throw new Error(`soeGuideSteps: no line matching ${pattern} in "${title}"`);
  return found;
};
const except = (title, ...patterns) => phase(title).notes.filter((note) => !patterns.some((pattern) => pattern.test(note)));

const RITUALS = 'Complete the Four District Rituals';
const SWORD = 'Obtain the Apothicon Sword';
const PAP = 'Open Pack-a-Punch';
const UPGRADE = 'Upgrade the Apothicon Sword';
const FLAG = 'Complete the Flag Step';
const SHADOWMAN = 'Defeat the Shadowman';
const FINALE = 'Four-Player Final Train Sequence';

const trainNote = () => React.createElement(RunNote, {
  storageKey: TRAIN_NOTE_KEY,
  mapId: MAP,
  label: 'Train symbols · this game',
  hint: 'in the order you see them',
  slots: ['Symbol 1', 'Symbol 2', 'Symbol 3'],
});

// From the Arch-Ovum note: "Nero: Nero’s room. Jackie Vincent: Ruby Rabbit. Floyd: Boxing Gym. Jessica: Black Lace."
const keeperPicker = () => React.createElement(PickTool, {
  storageKey: CHARACTER_KEY,
  mapId: MAP,
  prompt: 'Who are you playing?',
  answerLabel: 'Your Keeper and Arch-Ovum:',
  options: [
    { id: 'nero', label: 'Nero', answer: 'Nero’s room' },
    { id: 'jackie', label: 'Jackie Vincent', answer: 'Ruby Rabbit' },
    { id: 'floyd', label: 'Floyd', answer: 'Boxing Gym' },
    { id: 'jessica', label: 'Jessica', answer: 'Black Lace' },
  ],
});

const soeGuideSteps = [
  {
    id: 'rituals',
    title: 'Four district rituals',
    goal: 'In Beast Mode, open each ritual room and item, finish the ritual, take its Gateworm. Note the train symbols on the way.',
    refs: [
      { type: 'sequence', label: 'Train rides for the symbols', items: ['Waterfront → Footlight (symbols 1–2)', 'Footlight → Canals (symbol 3)'] },
      { type: 'custom', key: 'train-note', render: trainNote },
      { type: 'facts', label: 'Ritual items', items: [
        { k: 'Lawyer’s Pen', v: 'Shock the meter; the crane drops the crate outside Easy Street. Altar above Easy Street' },
        { k: 'Championship Belt', v: 'Grapple up as the Beast and smack the hanging crate (Waterfront). Altar at the Anvil Gym' },
        { k: 'Badge', v: 'Break the crate in the canals, shock the hidden meter (Beast mark). Altar at the Ruby Rabbit' },
        { k: 'Toupee', v: 'Knock the crate off a ledge on the Footlight walkway. Altar at the Black Lace' },
      ] },
    ],
    checklist: [{ k: 'Junction — Nero', v: 'Truck box: Summoning Key + pen' }, { k: 'Canals — Ruby Rabbit', v: 'Expose the police badge' }, { k: 'Waterfront — Boxing Gym', v: 'Expose the championship belt' }, { k: 'Footlight — Black Lace', v: 'Kill the Margwa that spawns' }],
    how: phase(RITUALS).notes,
  },
  {
    id: 'sword',
    title: 'Apothicon Sword',
    goal: 'In the Footlight rift, shock your three train symbols in order in Beast Mode, then charge the egg at all four statues.',
    refs: [
      { type: 'custom', key: 'train-note', render: trainNote },
      { type: 'facts', items: [
        { k: 'Symbol wall', v: '9 symbols by the Rift doorway (by the Mystery Box)' },
        { k: 'Egg souls', v: '12 at each statue, every player’s own egg' },
      ] },
      { type: 'chips', label: 'Statues in smashable crates', items: ['Footlight alley', 'Behind the Ruby Rabbit stairs', 'Waterfront ruined building', 'Rift, across from the egg statue'] },
    ],
    checklist: ['Symbols shocked, egg taken', 'Statue — underground rift', 'Statue — Footlight', 'Statue — Waterfront', 'Statue — Canals', 'Sword from the altar'],
    how: phase(SWORD).notes,
    problems: [line(SWORD, /Beast Mode setup/), 'Wrong symbol set: locked until next round.'],
  },
  {
    id: 'pap',
    title: 'Open Pack-a-Punch',
    goal: 'Place all four Gateworms and the Summoning Key in the underground ritual room, then survive until it ends.',
    refs: [
      { type: 'sequence', items: ['Four Gateworms', 'Summoning Key on the table', 'Survive ~30 s'] },
      { type: 'facts', items: [{ k: 'Pedestals', v: 'The 2 on the altar side make wall-run walls; the 2 far ones make a path back' }] },
    ],
    how: phase(PAP).notes,
  },
  {
    id: 'upgrade',
    title: 'Upgrade the sword',
    goal: 'Get your Arch-Ovum from your Keeper, then finish one Margwa challenge per round at all four spots.',
    critical: [line(UPGRADE, /one of these locations can be completed per round/)],
    refs: [
      { type: 'custom', key: 'keeper', render: keeperPicker },
      { type: 'chips', label: 'Red circles', items: ['Black Lace front', 'Canals, between the workbench and Ruby Rabbit', 'Anvil front', 'Easy Street entrance (Junction)'] },
      { type: 'facts', items: [{ k: 'Margwas', v: '2 solo, up to 4 in co-op' }] },
    ],
    checklist: ['Junction', 'Boxing Gym', 'Black Lace / Burlesque', 'Ruby Rabbit', 'Upgraded sword from your Keeper'],
    how: except(UPGRADE, /Nero’s room/, /only one of these/i),
    problems: [line(UPGRADE, /every player must finish their upgraded sword/), 'Another player’s Margwas still alive blocks your circle.'],
  },
  {
    id: 'flag',
    title: 'The flag',
    goal: 'Raise the book in Nero’s room, take the flag underground, defend it at each district’s placements, deliver it to that ritual table.',
    critical: [line(FLAG, /flag takes too much damage/)],
    refs: [
      { type: 'sequence', label: 'District order', items: ['Canals', 'Waterfront', 'Footlight', 'Junction'] },
      { type: 'facts', items: [{ k: 'Each district', v: 'Defend the flag at 2 purple-lightning spots until the chime (Max Ammo each time)' }] },
    ],
    checklist: ['Canals', 'Waterfront', 'Footlight', 'Junction'],
    how: except(FLAG, /flag takes too much damage/),
    problems: ['Carrier downed, or Insanity Elementals hit the flag: redo that flag (grab it again underground).'],
  },
  {
    id: 'shadowman',
    title: 'Defeat the Shadowman',
    goal: 'Activate the Keeper(s), shoot the Shadowman over the ritual table, then trap him in the Summoning Key.',
    critical: [line(SHADOWMAN, /Death Machine, put it away/)],
    refs: [
      { type: 'facts', items: [
        { k: 'Solo', v: 'Interact with one Keeper' },
        { k: 'Co-op', v: 'Activate all four Keepers' },
      ] },
    ],
    how: except(SHADOWMAN, /Solo: interact/, /put it away/),
    problems: ['Not trapped fast enough: the shield comes back. Re-interact with the Keepers.'],
  },
  {
    id: 'finale',
    title: 'Four-player train finale',
    goal: 'Everyone takes a post. The train caller starts the train; the centre player shocks the three Keepers as it hits the Gateworm.',
    refs: [
      { type: 'facts', label: 'Team setup', items: [
        { k: 'Waterfront station', v: 'One player — keep the box shocked' },
        { k: 'Canals station', v: 'One player — keep the box shocked' },
        { k: 'Footlight station', v: 'One player — keep the box shocked' },
        { k: 'Centre Gateworm', v: 'Fourth player — shock all three Keepers' },
      ] },
      { type: 'warning', text: line(FINALE, /train caller stays human/) },
      { type: 'facts', items: [{ k: 'Reward', v: '1000 XP (+6000 first time) · upgraded Civil Protector · swords back' }] },
    ],
    how: phase(FINALE).notes,
    problems: ['Needs exactly 4 players.', 'Bled-out players respawn when a train is called.'],
  },
];

// The old tracker task lines, as a plain checklist after the step's references: lines with a hint become
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

export default soeGuideSteps.map(withChecklist);
