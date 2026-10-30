import React from 'react';
import ValveMap from '../assets/GK_Map.webp';
import ValveSolverTool from '../components/ValveSolverTool';
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
    tasks: [
      { id: 'armory', label: 'Armory part' },
      { id: 'infirmary', label: 'Infirmary part' },
      { id: 'bunker', label: 'Bunker / Dept. Store part' },
      { id: 'built', label: 'Shield built' },
    ],
    how: shield.steps,
    problems: [shield.note],
    links: [{ to: `${BASE}/buildables`, label: 'Gear + Buildables' }],
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
    tasks: [
      { id: 'blue', label: 'Blue module', tone: CYLINDER.blue },
      { id: 'yellow', label: 'Yellow module', tone: CYLINDER.yellow },
      { id: 'red', label: 'Red module', tone: CYLINDER.red },
      { id: 'installed', label: 'Parts installed' },
    ],
    how: how('Power + Dragon Network Controller'),
    links: [{ to: `${BASE}/buildables`, label: 'Gear + Buildables' }],
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
    tasks: [
      { id: 'warmed', label: 'Egg warmed' },
      { id: 'napalm', label: 'Napalm trial' },
      { id: 'penetration', label: 'Penetration trial' },
      { id: 'melee', label: 'Melee trial' },
      { id: 'incubated', label: 'Incubated' },
      { id: 'gauntlet', label: 'Gauntlet collected' },
    ],
    how: how('Warm the Dragon Egg + Earn Siegfried'),
    problems: ['Warm it with dragon fire or a Dragon Strike.'],
  },
  {
    id: 'valves',
    title: 'Valve network',
    goal: 'Find the green-lit valve and the Master Code Cylinder, set the other five valves, take the cylinder to S.O.P.H.I.A.',
    refs: [
      { type: 'custom', key: 'valve-solver', render: () => <ValveSolverTool compact /> },
      { type: 'image', src: ValveMap, alt: 'Gorod Krovi map with the six valve locations marked', caption: 'Valve locations — tap to enlarge', width: 1600, height: 1040 },
    ],
    tasks: [
      { id: 'dials', label: 'Five valves set' },
      { id: 'cylinder', label: 'Cylinder at Dragon Command' },
    ],
    how: how('Solve the Valve Network'),
    problems: ['No settings? Re-check which valve is green and where the cylinder is — both change every game.'],
    links: [{ to: `${BASE}/valves`, label: 'Full-size Valve Solver' }],
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
    tasks: gorodTrophies.map((trophy, index) => ({ id: `t${index + 1}`, label: trophy.location, hint: trophyShort[index] })),
    how: gorodTrophies.map((trophy) => `${trophy.location}: ${trophy.method}`),
    problems: ['The safe trophy needs the Gauntlet of Siegfried — finish the egg first.'],
    links: [{ to: `${BASE}/trophies`, label: 'Trophies + Challenges' }],
  },
  {
    id: 'challenges',
    title: 'S.O.P.H.I.A. challenges',
    goal: 'Complete each challenge the lit trophies show.',
    critical: ['The Group 935 keycard lockdown always comes last, after the other five.'],
    tasks: gorodChallenges.map((challenge, index) => ({ id: `c${index + 1}`, label: challenge.title, hint: challengeShort[index] })),
    how: gorodChallenges.map((challenge) => `${challenge.title}: ${challenge.objective}`),
    // A tip that only restates the "always comes last" warning above is left out.
    problems: gorodChallenges.filter((challenge) => !/always comes last/i.test(challenge.tip)).map((challenge) => `${challenge.title}: ${challenge.tip}`),
    links: [{ to: `${BASE}/trophies`, label: 'Trophies + Challenges' }],
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
    links: [{ to: `${BASE}/boss`, label: 'Boss Fight' }],
  },
  {
    id: 'nikolai',
    title: 'Defeat Nikolai',
    goal: 'In Plain Sight, break the mech weak points, then finish the center.',
    refs: [
      { type: 'sequence', items: ['In Plain Sight', 'Lit sections + upper left / right', 'Center opens', 'Finish it'] },
    ],
    how: how('Defeat Nikolai'),
    links: [{ to: `${BASE}/boss`, label: 'Boss Fight' }],
  },
];

export default gorodGuideSteps;
