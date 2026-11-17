/*
 * Love and War, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number, title, one
 * short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step details tab
 * (stepDetails.js, section #step-N). Facts come only from gorodRun.js and buildables.js (test-guarded). The valve solver and map live on the Valve Solver tab.
 */
const BASE = '/maps/gorod-krovi';
const DETAILS = `${BASE}/step-details`;

const gorodGuideSteps = [
  {
    id: 'shield',
    title: 'Guard of Fafnir',
    goal: 'Build the Dragon Shield and keep it all run — the egg and a trophy need it.',
    links: [{ to: `${BASE}/buildables`, label: 'Gear + Buildables' }, { to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'dragon-network',
    title: 'Power + Dragon Network',
    goal: 'Power on, three Groph Module defenses, parts into the Mule Kick generator.',
    links: [{ to: `${BASE}/buildables`, label: 'Gear + Buildables' }, { to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'dragon-strike',
    title: 'Ride the dragon + Dragon Strike',
    goal: 'Fly to the Hatchery / Pack-a-Punch area and survive the lockdown for Dragon Strike.',
    links: [{ to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'egg',
    title: 'Dragon Egg → Gauntlet',
    goal: 'Warm the egg, wait one round, finish three trials, incubate it, cash it in at spawn.',
    links: [{ to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'valves',
    title: 'Valve network',
    goal: 'Find the green-lit valve and the Master Code Cylinder, set the other five valves, cylinder to S.O.P.H.I.A.',
    links: [{ to: `${BASE}/valves`, label: 'Valve Solver' }, { to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'kronos',
    title: 'Spell KRONOS',
    goal: 'Shoot S.O.P.H.I.A.’s letter wheels to spell KRONOS, then confirm.',
    links: [{ to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'trophies',
    title: 'Six silver trophies',
    goal: 'Collect all six, then place the set at Dragon Command.',
    links: [{ to: `${BASE}/trophies`, label: 'Trophies + Challenges' }, { to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'challenges',
    title: 'S.O.P.H.I.A. challenges',
    goal: 'Complete each challenge the lit trophies show.',
    links: [{ to: `${BASE}/trophies`, label: 'Trophies + Challenges' }, { to: DETAILS, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'power-core',
    title: 'Power Core + boss route',
    goal: 'Take the Power Core, send it to Nikolai with the Gauntlet Whelp at spawn, then enter the boss route.',
    links: [{ to: DETAILS, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'dragon-boss',
    title: 'Kill the dragon',
    goal: 'Hit each weak point Nikolai exposes as the dragon lands, with the Ray Gun Mark 3.',
    links: [{ to: `${BASE}/boss`, label: 'Boss Fight' }, { to: DETAILS, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'nikolai',
    title: 'Defeat Nikolai',
    goal: 'In Plain Sight, break the mech weak points, then finish the center.',
    links: [{ to: `${BASE}/boss`, label: 'Boss Fight' }, { to: DETAILS, section: 'step-11', label: 'Step details' }],
  },
];

export default gorodGuideSteps;
