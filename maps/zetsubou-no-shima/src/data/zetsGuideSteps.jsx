import { zetsGear } from './zetsGear';
import { zetsRun } from './zetsRun';

/*
 * Seeds of Doubt as guide steps. Facts come only from zetsRun.js (the repaired, test-guarded walkthrough)
 * and the part locations in zetsGear.js; this file reorganises them into what / quick reference / how /
 * problems. Nothing here is new information.
 */
const BASE = '/maps/zetsubou-no-shima';

// Look phases and gear up by name and lines by content, so edits to the data can't silently shift text
// into the wrong step; a missing match fails loudly at load (and in the browser smoke test).
const step = (title) => {
  const phase = zetsRun.find((item) => item.title === title);
  if (!phase) throw new Error(`zetsGuideSteps: no zetsRun phase titled "${title}"`);
  return phase;
};
const gear = (name) => {
  const item = zetsGear.find((entry) => entry.name === name);
  if (!item) throw new Error(`zetsGuideSteps: no zetsGear entry "${name}"`);
  return item;
};
const line = (lines, pattern) => {
  const found = lines.find((detail) => pattern.test(detail));
  if (!found) throw new Error(`zetsGuideSteps: no line matching ${pattern}`);
  return found;
};
const how = (title) => [step(title).summary, ...step(title).details];

const TRIALS = 'Complete all three Trials';
const SKULLS = 'Clean the Four Skulls';
const BUNKER = 'Open the Bunker + Pack-a-Punch';
const KT4 = 'Build the KT-4';
const REVEAL = 'Reveal the Elevator Quest';
const MASAMUNE = 'Upgrade the KT-4 to the Masamune';
const COG1 = 'Collect Cog 1 — Anywhere But Here!';
const COG2 = 'Collect Cog 2 — AA Cannon';
const COG3 = 'Collect Cog 3 — Electrified Zipline';
const ELEVATOR = 'Open the Elevator';
const BOSS = 'Defeat the Giant Thrasher';

const zetsGuideSteps = [
  {
    id: 'trials',
    title: 'Three Trials each',
    goal: 'Every player completes all three of their own Trials from the challenge tablets near spawn.',
    critical: ['Cog 3 needs every player’s three Trials done.'],
    refs: [{ type: 'chips', label: 'Grab early', items: ['A bucket', 'Anywhere But Here! (Cog 1)'] }],
    tasks: [
      { id: 't1', label: 'Trial 1' },
      { id: 't2', label: 'Trial 2' },
      { id: 't3', label: 'Trial 3' },
    ],
    how: how(TRIALS),
  },
  {
    id: 'skulls',
    title: 'Clean the four skulls',
    goal: 'Match each skull to its symbol pedestal, defend it until clean, return it. Repeat four times.',
    critical: ['Symbols change every game — match the markings, not an order.'],
    refs: [{ type: 'sequence', items: ['Take a skull', 'Matching pedestal', 'Defend until clean', 'Return it'] }],
    tasks: [
      { id: 's1', label: 'Skull 1' },
      { id: 's2', label: 'Skull 2' },
      { id: 's3', label: 'Skull 3' },
      { id: 's4', label: 'Skull 4' },
      { id: 'keeper', label: 'Keeper beaten', hint: 'Unlocks the Skull of Nan Sapwe' },
    ],
    how: [step(SKULLS).summary, line(step(SKULLS).details, /Keeper encounter/)],
  },
  {
    id: 'bunker',
    title: 'Bunker + Pack-a-Punch',
    goal: 'Power both labs with green and blue water, open the bunker, survive the underwater lockdown, take the three parts.',
    tasks: [
      { id: 'labs', label: 'Both labs powered', hint: 'Green and blue water on the generators' },
      { id: 'lockdown', label: 'Underwater power lockdown' },
      { id: 'pap', label: 'Pack-a-Punch parts (3)' },
      { id: 'shield', label: 'Zombie Shield built', hint: 'Under Lab A · Lab B tree · bunker AA room' },
      { id: 'mask', label: 'Gas Mask built', hint: 'Crashed plane · Lab B green water · lower docks' },
    ],
    how: [...how(BUNKER), ...gear('Zombie Shield').parts, ...gear('Gas Mask').parts],
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }],
  },
  {
    id: 'kt4',
    title: 'Build the KT-4',
    goal: 'Collect the three parts, then build the KT-4 at its workbench.',
    tasks: [
      { id: 'vial', label: 'Scientist vial', hint: 'Kill the glowing scientist zombie' },
      { id: 'venom', label: 'Spider venom', hint: 'Spider round: trap one in the Lab A cage' },
      { id: 'plant', label: 'Underwater plant', hint: 'Bottom of the submerged bunker passage' },
      { id: 'built', label: 'KT-4 built' },
    ],
    how: step(KT4).details,
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }],
  },
  {
    id: 'reveal',
    title: 'Reveal the elevator',
    goal: 'Mesmerize the hidden blueprint and the concealed elevator panel with the Skull of Nan Sapwe.',
    tasks: [
      { id: 'blueprint', label: 'Blueprint revealed' },
      { id: 'panel', label: 'Elevator panel revealed', hint: 'Shows the three missing cogs' },
    ],
    how: step(REVEAL).details,
    links: [{ to: `${BASE}/reveal-blueprint`, label: 'Reveal Blueprint' }],
  },
  {
    id: 'masamune',
    title: 'Upgrade to the Masamune',
    goal: 'Gather the upgrade ingredients, then build the Masamune at the KT-4 workbench.',
    tasks: [
      { id: 'rainbow', label: 'Rainbow-water plant', hint: 'Hidden underwater wall: seed + rainbow water' },
      { id: 'fang', label: 'Giant Spider fang', hint: 'From its mouth, before you leave' },
      { id: 'divinium', label: 'Divinium vial', hint: 'Electrified shield at the Lab B cage (after all Trials)' },
      { id: 'built', label: 'Masamune built' },
    ],
    how: [step(MASAMUNE).summary, ...gear('Masamune').parts],
    links: [{ to: `${BASE}/buildables`, label: 'Buildables' }],
  },
  {
    id: 'cog-1',
    title: 'Cog 1 — Anywhere But Here!',
    goal: 'With the elevator quest active, use Anywhere But Here! to reach the hidden room and take the cog.',
    how: how(COG1),
    links: [{ to: `${BASE}/cogs/1`, label: 'Cog 1 details' }],
  },
  {
    id: 'cog-2',
    title: 'Cog 2 — AA Cannon',
    goal: 'Grow an artillery shell, fire the AA cannon at the cargo plane, find the cog where it lands.',
    refs: [
      { type: 'sequence', label: 'Each round, three rounds', items: ['Plant a seed', 'Blue Water', 'Shoot it once (KT-4 / Masamune)'] },
      { type: 'sequence', label: 'Then', items: ['Shell into the AA cannon', 'Shoot down the plane', 'Collect the cog'] },
    ],
    tasks: [
      { id: 'r1', label: 'Plant round 1' },
      { id: 'r2', label: 'Plant round 2' },
      { id: 'r3', label: 'Plant round 3' },
      { id: 'cog', label: 'Plane down, cog collected' },
    ],
    how: [step(COG2).summary],
    problems: step(COG2).details,
    links: [{ to: `${BASE}/cogs/2`, label: 'Cog 2 details' }],
  },
  {
    id: 'cog-3',
    title: 'Cog 3 — Zipline',
    goal: 'Charge the shield with the challenge lightning, electrify the zipline panel, drop onto the hidden dock.',
    critical: ['Every player must finish all three of their Trials first.'],
    refs: [
      { type: 'facts', items: [
        { k: 'Solo', v: 'Ride the zipline, melee at the drop point' },
        { k: 'Co-op', v: 'A teammate electrifies the panel for the rider' },
      ] },
    ],
    how: [step(COG3).summary],
    links: [{ to: `${BASE}/cogs/3`, label: 'Cog 3 details' }],
  },
  {
    id: 'elevator',
    title: 'Open the elevator',
    goal: 'Install all three cogs, put on a fresh gas mask, then descend to the boss arena.',
    refs: [{ type: 'chips', label: 'Bring', items: ['Fresh gas mask', 'Masamune', 'Strong close-range weapon'] }],
    tasks: [
      { id: 'cogs', label: 'Three cogs installed' },
      { id: 'mask', label: 'Fresh gas mask' },
    ],
    how: how(ELEVATOR),
  },
  {
    id: 'thrasher',
    title: 'Defeat the Giant Thrasher',
    goal: 'Masamune the vine spores, keep moving, and damage the boss whenever its weak point opens.',
    refs: [{ type: 'sequence', label: 'Each damage cycle', items: ['Masamune on the spores', 'Kill Thrashers', 'Weak point opens → hit it'] }],
    how: how(BOSS),
    links: [{ to: `${BASE}/elevator-battle`, label: 'Boss Fight' }],
  },
];

export default zetsGuideSteps;
