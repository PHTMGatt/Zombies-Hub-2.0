/*
 * Seeds of Doubt "Step details" tab (one anchored section per step: #step-1, #step-2, ...). Holds everything the flat main guide
 * (zetsGuideSteps.jsx) no longer shows: the fuller goal, warnings, how-to lines, task lines (now a plain checklist), tips and
 * reference lists. Same step ids and order. Moved here 2026-11-16 (Bryen flat main-guide spec); no fact was dropped.
 */
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
    refs: [{ type: 'chips', label: 'Grab early', items: ['A bucket', 'Anywhere But Here! (Cog 1)', '2+ seeds'] }],
    checklist: ['Trial 1', 'Trial 2', 'Trial 3'],
    how: how(TRIALS),
  },
  {
    id: 'skulls',
    title: 'Clean the four skulls',
    goal: 'Match each skull to its symbol pedestal, defend it until clean, return it. Repeat four times.',
    critical: ['Symbols change every game — match the markings, not an order.'],
    refs: [{ type: 'sequence', items: ['Take a skull', 'Matching pedestal', 'Defend until clean', 'Return it'] }],
    checklist: ['Skull 1', 'Skull 2', 'Skull 3', 'Skull 4', { k: 'Keeper beaten', v: 'Unlocks the Skull of Nan Sapwe' }],
    how: [step(SKULLS).summary, line(step(SKULLS).details, /Keeper encounter/)],
  },
  {
    id: 'bunker',
    title: 'Bunker + Pack-a-Punch',
    goal: 'Power both labs with green and blue water, open the bunker, survive the underwater lockdown, take the three parts.',
    checklist: [{ k: 'Both labs powered', v: 'Green and blue water on the generators' }, 'Underwater power lockdown', 'Pack-a-Punch parts (3)', { k: 'Zombie Shield built', v: 'Under Lab A · Lab B tree · bunker AA room' }, { k: 'Gas Mask built', v: 'Crashed plane · Lab B green water · lower docks' }],
    how: [...how(BUNKER), ...gear('Zombie Shield').parts, ...gear('Gas Mask').parts],
  },
  {
    id: 'kt4',
    title: 'Build the KT-4',
    goal: 'Collect the three parts, then build the KT-4 at its workbench.',
    checklist: [{ k: 'Scientist vial', v: 'Kill the glowing scientist zombie' }, { k: 'Spider venom', v: 'Spider round: trap one in the Lab A cage' }, { k: 'Underwater plant', v: 'Bottom of the submerged bunker passage' }, 'KT-4 built'],
    how: step(KT4).details,
  },
  {
    id: 'reveal',
    title: 'Reveal the elevator',
    goal: 'Mesmerize the hidden blueprint and the concealed elevator panel with the Skull of Nan Sapwe.',
    refs: [{ type: 'facts', items: [
      { k: 'Blueprint', v: 'The paper across from the purple water (Living Quarters, Bunker)' },
      { k: 'Elevator panel', v: 'The wall left of the dead elevator, across from the AA platform door' },
    ] }],
    checklist: ['Blueprint revealed', { k: 'Elevator panel revealed', v: 'Shows the three missing cogs' }],
    how: step(REVEAL).details,
  },
  {
    id: 'masamune',
    title: 'Upgrade to the Masamune',
    goal: 'Gather the upgrade ingredients, then build the Masamune at the KT-4 workbench.',
    checklist: [{ k: 'Rainbow-water plant', v: 'Hidden underwater wall: seed + rainbow water' }, { k: 'Giant Spider fang', v: 'From its mouth, before you leave' }, { k: 'Divinium vial', v: 'Electrified shield at the Lab B cage (after all Trials)' }, 'Masamune built'],
    refs: [{ type: 'facts', items: [
      { k: 'Divinium vial', v: 'Melee the Lab B cage panel with the electrified shield · ride the cage down into the swamp · vial is on a skeleton' },
      { k: 'Co-op cage', v: 'One shocks to open, one shocks to lower; the panel brings it back up' },
      { k: 'Spider fang', v: 'Cave behind the blue-water pool by Lab A: clear the webs (KT-4), kill the Giant Spider, take the fang' },
      { k: 'Rainbow plant', v: 'Mesmerize the torn blueprint (Living Quarters), then the right wall by the old underwater plant: hidden planter' },
      { k: 'Rainbow water', v: 'Empty bucket into the Sewer Pipe ride (Bunker → behind Lab B), press Use after the 2nd blue section' },
      { k: 'Water', v: '3 times over 3 rounds' },
      { k: 'Craft', v: '2nd bench next to the KT-4 bench, KT-4 in hand' },
    ] }],
    how: [step(MASAMUNE).summary, ...gear('Masamune').parts],
  },
  {
    id: 'cog-1',
    title: 'Cog 1 — Anywhere But Here!',
    goal: 'With the elevator quest active, use Anywhere But Here! to reach the hidden room and take the cog.',
    refs: [{ type: 'facts', items: [
      { k: 'Room', v: 'Secret room above Lab A; the cog is on the floor' },
      { k: 'Exit', v: 'The hole in the wall' },
    ] }],
    how: how(COG1),
  },
  {
    id: 'cog-2',
    title: 'Cog 2 — AA Cannon',
    goal: 'Grow an artillery shell, fire the AA cannon at the cargo plane, find the cog where it lands.',
    refs: [
      { type: 'sequence', label: 'Each round, three rounds', items: ['Plant a seed', 'Blue Water', 'Shoot it once (KT-4 / Masamune)'] },
      { type: 'sequence', label: 'Then', items: ['Shell into the AA cannon', 'Shoot down the plane', 'Collect the cog'] },
      { type: 'facts', items: [
        { k: 'Plant', v: 'The pod may hold a flak shell: grow 3 at once' },
        { k: 'Fire', v: 'As the plane lines up with the barrel (the gun can’t aim; it passes every 2-2.5 min)' },
      ] },
      { type: 'chips', label: '3 smoking landing spots', items: ['Big tree outside the Bunker', 'Back stairs to the Lab A zipline', 'Meteor behind Lab B'] },
    ],
    checklist: ['Plant round 1', 'Plant round 2', 'Plant round 3', 'Plane down, cog collected'],
    how: [step(COG2).summary],
    problems: step(COG2).details,
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
        { k: 'Shield', v: 'Stand on the ritual platform with the shield out when the lightning hits' },
        { k: 'Zipline', v: 'Lab A ↔ Docks; melee to drop onto the small dock under it (start from the Docks side)' },
      ] },
    ],
    how: [step(COG3).summary],
  },
  {
    id: 'elevator',
    title: 'Open the elevator',
    goal: 'Install all three cogs, put on a fresh gas mask, then descend to the boss arena.',
    refs: [{ type: 'chips', label: 'Bring', items: ['Fresh gas mask', 'Masamune', 'Strong close-range weapon'] }],
    checklist: ['Three cogs installed', 'Fresh gas mask'],
    how: how(ELEVATOR),
    problems: ['Everyone wears a gas mask: no mask in the elevator and you go down.'],
  },
  {
    id: 'thrasher',
    title: 'Defeat the Giant Thrasher',
    goal: 'Masamune the vine spores, keep moving, and damage the boss whenever its weak point opens.',
    refs: [
      { type: 'sequence', label: 'Each damage cycle', items: ['Masamune on the spores', 'Kill Thrashers', 'Weak point opens → hit it'] },
      { type: 'sequence', label: 'Start', items: ['Masamune the 3 glowing vines in the hall', 'Shoot a spore on the caged Giant Thrasher’s arm', '4 timed spores'] },
      { type: 'facts', items: [{ k: 'Reward', v: 'All perks (lost if downed) · 5000 XP · achievement' }] },
    ],
    how: how(BOSS),
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

export default zetsGuideSteps.map(withChecklist);
