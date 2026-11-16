/*
 * Love and War "Step details" tab (one anchored section per step: #step-1, #step-2, ...). Holds everything the flat main guide
 * (gorodGuideSteps.jsx) no longer shows: the fuller goal, warnings, how-to lines, task lines (now a plain checklist), tips and
 * reference lists. Same step ids and order. Moved here 2026-11-16 (Bryen flat main-guide spec); no fact was dropped.
 */
import buildables from './buildables';
import { gorodBossPhases, gorodChallenges, gorodRun, gorodTrophies } from './gorodRun';

/*
 * Love and War as guide steps. Facts come only from gorodRun.js (the repaired, test-guarded walkthrough)
 * and the shield part areas in buildables.js; this file reorganises them into
 * what / quick reference / how / problems. Nothing here is new information.
 */
const BASE = '/maps/gorod-krovi';
const run = (title) => gorodRun.find((phase) => phase.title === title);
const how = (title) => {
  const phase = run(title);
  return [phase.summary, ...phase.details];
};
const shield = buildables.find((item) => item.name.startsWith('Guard of Fafnir'));

const CYLINDER = { blue: '#5fb4ff', yellow: '#ffd25a', red: '#ff5a43' };

// Short trophy methods shown under each trophy's check box; full wording stays in Walkthrough and on the reference page.
const trophyShort = [
  'Fafnir fireball → left window by Double Tap',
  'Shoot it off the statue hand above the tank',
  'Dragon Strike on the marked puddle',
  'Fire the giant laser trap, take it from the floor',
  'Sewer ride: shoot the red light green → toilet',
  'Gauntlet Whelp at the safe, then punch it',
];

// One-line versions of each challenge objective for Quick; the full objective is in Walkthrough.
const challengeShort = [
  'Shoot the orb until it returns to Dragon Command',
  'Disable the terminals in the flashed order',
  'Break the shoulder armor, walk him onto the circle',
  'Stay with the injured Valkyrie to Dragon Command',
  'Defend the module, Whelp brings the drop back',
  'Keycard → Hatchery computer, survive, return it',
];
const dragon = run('Kill the Dragon');
const shieldTip = dragon.details.find((line) => /shield/i.test(line));

const gorodGuideSteps = [
  {
    id: 'shield',
    title: 'Guard of Fafnir',
    goal: 'Build the Dragon Shield and keep it all run — the egg and a trophy need it.',
    refs: [
      { type: 'chips', label: 'One part per area', items: ['Armory', 'Infirmary', 'Operations Bunker / Department Store'] },
      { type: 'facts', items: [{ k: 'Build', v: 'Operations Bunker workbench' }] },
    ],
    checklist: ['Armory part', 'Infirmary part', 'Bunker / Dept. Store part', 'Shield built'],
    how: shield.steps,
    problems: [shield.note],
  },
  {
    id: 'dragon-network',
    title: 'Power + Dragon Network',
    goal: 'Power on, three Groph Module defenses, parts into the Mule Kick generator.',
    refs: [
      { type: 'facts', label: 'Code cylinder → terminal', items: [
        { k: 'Blue', v: 'Dragon Command', tone: CYLINDER.blue },
        { k: 'Yellow', v: 'Supply Depot', tone: CYLINDER.yellow },
        { k: 'Red', v: 'Tank Factory', tone: CYLINDER.red },
      ] },
      { type: 'sequence', items: ['Follow the green beam', 'Defend the module', 'Take the part'] },
      { type: 'facts', items: [{ k: 'Install', v: 'Generator by Mule Kick (Operations Bunker)' }] },
    ],
    checklist: ['Blue module', 'Yellow module', 'Red module', 'Parts installed'],
    how: how('Power + Dragon Network Controller'),
  },
  {
    id: 'dragon-strike',
    title: 'Ride the dragon + Dragon Strike',
    goal: 'Fly to the Hatchery / Pack-a-Punch area and survive the lockdown for Dragon Strike.',
    critical: ['The final lockdown wave opens all four directions at once.'],
    refs: [
      { type: 'sequence', items: ['Call the dragon', 'Fly to the Hatchery', 'Survive the lockdown', 'Take Dragon Strike'] },
    ],
    how: how('Ride the Dragon + Get Dragon Strike'),
  },
  {
    id: 'egg',
    title: 'Dragon Egg → Gauntlet',
    goal: 'Warm the egg, wait one round, finish three trials, incubate it, cash it in at spawn.',
    refs: [
      { type: 'sequence', items: ['Shoot the egg down (Hatchery)', 'Warm it in the Dragon Command nest', 'Wait one round', '3 trials', 'Incubator (Hatchery basement)', 'Spawn tombstone'] },
      { type: 'chips', label: 'Three trials', items: ['Napalm / dragon-fire kills', 'Single-shot penetration multi-kills', 'Melee kills'] },
    ],
    checklist: ['Egg warmed', 'Napalm trial', 'Penetration trial', 'Melee trial', 'Incubated', 'Gauntlet collected'],
    how: how('Warm the Dragon Egg + Earn Siegfried'),
    problems: ['Warm it with dragon fire or a Dragon Strike.'],
  },
  {
    id: 'valves',
    title: 'Valve network',
    goal: 'Find the green-lit valve and the Master Code Cylinder, set the other five valves, take the cylinder to S.O.P.H.I.A.',
    critical: ['Power the Hatchery generator first (basement, under a tarp by the incubators): destroy a Valkyrie Drone next to it. You get 5 minutes; the green light only shows while it is on. If time runs out, press the button beside the generator to restart.'],
    // The compact solver and the valve map are on the Valve Solver tab (/maps/gorod-krovi/valves).
    checklist: ['Five valves set', 'Cylinder at Dragon Command'],
    how: how('Solve the Valve Network'),
    problems: ['No settings? Re-check which valve is green and where the cylinder is — both change every game.'],
  },
  {
    id: 'kronos',
    title: 'Spell KRONOS',
    goal: 'Shoot S.O.P.H.I.A.’s letter wheels to spell KRONOS, then confirm.',
    critical: ['Widow’s Wine or Electric Cherry effects can rotate the wheels by accident.'],
    refs: [
      { type: 'sequence', label: 'Letter wheels', items: ['K', 'R', 'O', 'N', 'O', 'S'] },
    ],
    how: how('Spell KRONOS'),
  },
  {
    id: 'trophies',
    title: 'Six silver trophies',
    goal: 'Collect all six, then place the set at Dragon Command.',
    checklist: gorodTrophies.map((trophy, index) => ({ k: trophy.location, v: trophyShort[index] })),
    how: gorodTrophies.map((trophy) => `${trophy.location}: ${trophy.method}`),
    problems: ['The safe trophy needs the Gauntlet of Siegfried — finish the egg first.'],
  },
  {
    id: 'challenges',
    title: 'S.O.P.H.I.A. challenges',
    goal: 'Complete each challenge the lit trophies show.',
    critical: ['The Group 935 keycard lockdown always comes last, after the other five.'],
    checklist: gorodChallenges.map((challenge, index) => ({ k: challenge.title, v: challengeShort[index] })),
    how: gorodChallenges.map((challenge) => `${challenge.title}: ${challenge.objective}`),
    // A tip that only restates the "always comes last" warning above is left out.
    problems: gorodChallenges.filter((challenge) => !/always comes last/i.test(challenge.tip)).map((challenge) => `${challenge.title}: ${challenge.tip}`),
  },
  {
    id: 'power-core',
    title: 'Power Core + boss route',
    goal: 'Take the Power Core, send it to Nikolai with the Gauntlet Whelp at spawn, then enter the boss route.',
    refs: [
      { type: 'sequence', items: ['Take the Power Core', 'Gauntlet Whelp at spawn', 'Back to S.O.P.H.I.A.', 'Enter the boss route'] },
      { type: 'chips', label: 'Bring', items: ['Strong perks', 'PaP Ray Gun Mark 3', 'Fresh shield', 'In Plain Sight'] },
    ],
    how: how('Take the Power Core + Open the Boss Fight'),
  },
  {
    id: 'dragon-boss',
    title: 'Kill the dragon',
    goal: 'Hit each weak point Nikolai exposes as the dragon lands, with the Ray Gun Mark 3.',
    critical: [shieldTip],
    refs: [
      { type: 'sequence', label: 'Repeat each landing', items: ['Dragon lands', 'Nikolai exposes a weak point', 'Ray Gun Mark 3 on the wound'] },
    ],
    how: [dragon.summary, ...dragon.details.filter((line) => line !== shieldTip), ...gorodBossPhases[0].details.filter((line) => /final weak point/i.test(line))],
  },
  {
    id: 'nikolai',
    title: 'Defeat Nikolai',
    goal: 'In Plain Sight, break the mech weak points, then finish the center.',
    refs: [
      { type: 'sequence', items: ['In Plain Sight', 'Lit sections + upper left / right', 'Center opens', 'Finish it'] },
    ],
    how: how('Defeat Nikolai'),
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

export default gorodGuideSteps.map(withChecklist);
