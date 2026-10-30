import React from 'react';
import PickTool from '../../../../shared/guide/PickTool';
import RunNote from '../../../../shared/guide/RunNote';
import soeGuide from './soeGuide';

/*
 * Shadows of Evil as guide steps. Facts come only from soeGuide.js (test-guarded); this file reorganises
 * them into what / quick reference / tools / how / problems. Nothing here is new information.
 */
const MAP = 'shadows-of-evil';
export const TRAIN_NOTE_KEY = 'zh-soe-train-symbols';
export const CHARACTER_KEY = 'zh-soe-character';

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

const trainNote = () => (
  <RunNote
    storageKey={TRAIN_NOTE_KEY}
    mapId={MAP}
    label="Train symbols · this game"
    hint="in the order you see them"
    slots={['Symbol 1', 'Symbol 2', 'Symbol 3']}
  />
);

// From the Arch-Ovum note: "Nero: Nero’s room. Jackie Vincent: Ruby Rabbit. Floyd: Boxing Gym. Jessica: Black Lace."
const keeperPicker = () => (
  <PickTool
    storageKey={CHARACTER_KEY}
    mapId={MAP}
    prompt="Who are you playing?"
    answerLabel="Your Keeper and Arch-Ovum:"
    options={[
      { id: 'nero', label: 'Nero', answer: 'Nero’s room' },
      { id: 'jackie', label: 'Jackie Vincent', answer: 'Ruby Rabbit' },
      { id: 'floyd', label: 'Floyd', answer: 'Boxing Gym' },
      { id: 'jessica', label: 'Jessica', answer: 'Black Lace' },
    ]}
  />
);

const soeGuideSteps = [
  {
    id: 'rituals',
    title: 'Four district rituals',
    goal: 'In Beast Mode, open each ritual room and item, finish the ritual, take its Gateworm. Note the train symbols on the way.',
    refs: [
      { type: 'sequence', label: 'Train rides for the symbols', items: ['Waterfront → Footlight (symbols 1–2)', 'Footlight → Canals (symbol 3)'] },
      { type: 'custom', key: 'train-note', render: trainNote },
    ],
    tasks: [
      { id: 'junction', label: 'Junction — Nero', hint: 'Truck box: Summoning Key + pen' },
      { id: 'canals', label: 'Canals — Ruby Rabbit', hint: 'Expose the police badge' },
      { id: 'waterfront', label: 'Waterfront — Boxing Gym', hint: 'Expose the championship belt' },
      { id: 'footlight', label: 'Footlight — Black Lace', hint: 'Kill the Margwa that spawns' },
    ],
    how: phase(RITUALS).notes,
  },
  {
    id: 'sword',
    title: 'Apothicon Sword',
    goal: 'In the Footlight rift, shock your three train symbols in order in Beast Mode, then charge the egg at all four statues.',
    refs: [{ type: 'custom', key: 'train-note', render: trainNote }],
    tasks: [
      { id: 'symbols', label: 'Symbols shocked, egg taken' },
      { id: 'rift', label: 'Statue — underground rift' },
      { id: 'footlight', label: 'Statue — Footlight' },
      { id: 'waterfront', label: 'Statue — Waterfront' },
      { id: 'canals', label: 'Statue — Canals' },
      { id: 'sword', label: 'Sword from the altar' },
    ],
    how: phase(SWORD).notes,
    problems: [line(SWORD, /Beast Mode setup/)],
  },
  {
    id: 'pap',
    title: 'Open Pack-a-Punch',
    goal: 'Place all four Gateworms and the Summoning Key in the underground ritual room, then survive until it ends.',
    refs: [{ type: 'sequence', items: ['Four Gateworms', 'Summoning Key on the table', 'Survive ~30 s'] }],
    how: phase(PAP).notes,
  },
  {
    id: 'upgrade',
    title: 'Upgrade the sword',
    goal: 'Get your Arch-Ovum from your Keeper, then finish one Margwa challenge per round at all four spots.',
    critical: [line(UPGRADE, /one of these locations can be completed per round/)],
    refs: [{ type: 'custom', key: 'keeper', render: keeperPicker }],
    tasks: [
      { id: 'junction', label: 'Junction' },
      { id: 'gym', label: 'Boxing Gym' },
      { id: 'blacklace', label: 'Black Lace / Burlesque' },
      { id: 'ruby', label: 'Ruby Rabbit' },
      { id: 'sword', label: 'Upgraded sword from your Keeper' },
    ],
    how: except(UPGRADE, /Nero’s room/, /only one of these/i),
    problems: [line(UPGRADE, /every player must finish their upgraded sword/)],
  },
  {
    id: 'flag',
    title: 'The flag',
    goal: 'Raise the book in Nero’s room, take the flag underground, defend it at each district’s placements, deliver it to that ritual table.',
    critical: [line(FLAG, /flag takes too much damage/)],
    refs: [{ type: 'sequence', label: 'District order', items: ['Canals', 'Waterfront', 'Footlight', 'Junction'] }],
    tasks: [
      { id: 'canals', label: 'Canals' },
      { id: 'waterfront', label: 'Waterfront' },
      { id: 'footlight', label: 'Footlight' },
      { id: 'junction', label: 'Junction' },
    ],
    how: except(FLAG, /flag takes too much damage/),
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
    ],
    how: phase(FINALE).notes,
  },
];

export default soeGuideSteps;
