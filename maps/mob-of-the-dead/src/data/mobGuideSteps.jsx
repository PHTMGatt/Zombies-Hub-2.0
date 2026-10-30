import { mobRun } from './mobGuide';

/*
 * Pop Goes the Weasel as guide steps. Facts come only from mobRun in mobGuide.js (the repaired,
 * test-guarded walkthrough) plus the co-op part rule from the Plane page; this file reorganises them into
 * what / quick reference / how / problems. Nothing here is new information.
 */
// Look phases up by title and lines by content, so edits to mobGuide.js can't silently shift text
// into the wrong step; a missing match fails loudly at load (and in the browser smoke test).
const step = (title) => {
  const phase = mobRun.find((item) => item.title === title);
  if (!phase) throw new Error(`mobGuideSteps: no mobRun phase titled "${title}"`);
  return phase;
};
const line = (title, pattern) => {
  const found = step(title).details.find((detail) => pattern.test(detail));
  if (!found) throw new Error(`mobGuideSteps: no line matching ${pattern} in "${title}"`);
  return found;
};
const except = (title, ...patterns) => step(title).details.filter((detail) => !patterns.some((pattern) => pattern.test(detail)));
const how = (title) => [step(title).summary, ...step(title).details];

const KEY = "Get the Warden's Key";
const PLANE = 'Build the Plane';
const TRIP1 = 'First Bridge Trip';
const REFUEL = "Refuel + Unlock Hell's Retriever";
const TRIP2 = 'Second Bridge Trip';
const SKULLS = 'Collect the Five Blue Skulls';
const SPOONS = 'Collect the Required Spoons';
const TRIP3 = 'Third Bridge Trip';
const CODES = 'Enter the Afterlife Codes';
const AUDIO = 'Follow the Audio Trail';
const FLIGHT = 'Final Afterlife Flight';
const CYCLE = 'Break or Continue the Cycle';

const mobGuideSteps = [
  {
    id: 'key',
    title: 'Warden’s Key',
    goal: 'Find the key for your spawn, then shock the nearby generator in Afterlife to drop it.',
    refs: [
      { type: 'facts', label: 'Where it hangs', items: [
        { k: 'Cafeteria spawn', v: 'Above the Cafeteria / Showers entrance' },
        { k: 'Warden’s Office spawn', v: 'Outside the office, near the Citadel entrance' },
      ] },
      { type: 'sequence', items: ['Afterlife doorway', 'Shock the generator', 'Pick up the key'] },
    ],
    how: step(KEY).details,
  },
  {
    id: 'plane',
    title: 'Build the Plane',
    goal: 'Collect the five Icarus parts and place each one on the rooftop plane.',
    tasks: [
      { id: 'uniforms', label: 'Uniforms — Showers', hint: 'Key the washer, power it in Afterlife, survive the lockdown' },
      { id: 'rigging', label: 'Rigging — Citadel Tunnels', hint: 'Read the three glowing numbers in Afterlife, enter them' },
      { id: 'tanks', label: 'Tanks — Docks', hint: 'Key the outer gate, Afterlife voltmeter for the inner' },
      { id: 'engine', label: 'Engine — Warden’s Office', hint: 'Shock the three Docks generators to kill the electric gate' },
      { id: 'valve', label: 'Control Valve — Infirmary', hint: 'Warden’s Key on the glowing green case' },
      { id: 'roof', label: 'Roof door open', hint: 'Infirmary Afterlife doorway → shock the roof voltmeter' },
    ],
    how: step(PLANE).details,
    problems: ['In co-op, each player can carry only one plane part at a time — place parts as you collect them.'],
  },
  {
    id: 'trip-1',
    title: 'First bridge trip',
    goal: 'Fly to the Golden Gate Bridge, Pack-a-Punch if needed, then ride the electric chairs back.',
    critical: [line(TRIP1, /Brutus/)],
    refs: [{ type: 'sequence', items: ['Board the plane', 'Bridge (Pack-a-Punch)', 'Electric chairs back'] }],
    how: [step(TRIP1).summary, ...except(TRIP1, /Brutus/)],
  },
  {
    id: 'retriever',
    title: 'Refuel + Hell’s Retriever',
    goal: 'Bring five fuel cans to the plane and feed each Cerberus head six souls, then take Hell’s Retriever.',
    refs: [
      { type: 'facts', items: [
        { k: 'Fuel cans', v: 'At or near the plane-part spots' },
        { k: 'Hell’s Retriever', v: 'Citadel Tunnels alcove, between the Showers and the spiral staircase' },
      ] },
    ],
    tasks: [
      { id: 'broadway', label: 'Head — Broadway Cell Block' },
      { id: 'infirmary', label: 'Head — Infirmary' },
      { id: 'docks', label: 'Head — Docks' },
      { id: 'fuel', label: 'Five fuel cans on the plane' },
      { id: 'retriever', label: 'Hell’s Retriever collected' },
    ],
    how: how(REFUEL),
  },
  {
    id: 'trip-2',
    title: 'Second bridge trip',
    goal: 'Fly to the bridge and back, then advance a round so the fuel cans respawn.',
    critical: [line(TRIP2, /Retriever equipped/)],
    how: [step(TRIP2).summary, ...except(TRIP2, /Retriever equipped/)],
  },
  {
    id: 'skulls',
    title: 'Five blue skulls',
    goal: 'Throw Hell’s Retriever through all five skulls to spawn a free Blundergat in the Warden’s Office.',
    critical: ['Skulls show in Afterlife, but collect them while alive.'],
    tasks: [
      { id: 'cell', label: 'Cell Block / Library', hint: 'Toilet of the open cell' },
      { id: 'docks', label: 'Docks', hint: 'Third wooden pier pillar' },
      { id: 'jugg', label: 'Juggernog', hint: 'Lamp post outside the perk' },
      { id: 'roof', label: 'Rooftop', hint: 'Far edge behind the plane' },
      { id: 'office', label: 'Outside the Warden’s Office', hint: 'Power-line pole, seen from the office window' },
    ],
    how: how(SKULLS),
  },
  {
    id: 'spoon',
    title: 'The spoon',
    goal: 'Reveal and shock the hidden spoon in Afterlife, then grab the cafeteria spoon with Hell’s Retriever.',
    refs: [
      { type: 'sequence', items: ['Retriever → poster by the Warden’s Office', 'Afterlife doorway', 'Shock the spoon (laugh)', 'Retriever → Cafeteria spoon'] },
    ],
    tasks: [
      { id: 'shocked', label: 'Spoon shocked' },
      { id: 'collected', label: 'Cafeteria spoon collected' },
    ],
    how: except(SPOONS, /Golden Spork/),
    problems: [line(SPOONS, /Golden Spork/)],
  },
  {
    id: 'trip-3',
    title: 'Third bridge trip',
    goal: 'Refuel and make the third round-trip. The Citadel number panel starts cycling afterwards.',
    how: [step(TRIP3).summary],
    problems: [line(TRIP3, /number panel/)],
  },
  {
    id: 'codes',
    title: 'Afterlife codes',
    goal: 'In Afterlife, enter all four prisoner numbers. Any order; you can split them across Afterlife visits.',
    tasks: [
      { id: '101', label: '101' },
      { id: '386', label: '386' },
      { id: '872', label: '872' },
      { id: '481', label: '481' },
    ],
    how: except(CODES, /split the four numbers/),
  },
  {
    id: 'audio',
    title: 'Audio trail',
    goal: 'Collect the five headphones in order, listening to each recording before the next appears.',
    tasks: [
      { id: 'tunnels', label: 'Citadel Tunnels', hint: 'Stairs up from the spiral staircase' },
      { id: 'doubletap', label: 'Double Tap', hint: 'The room around the perk' },
      { id: 'cells', label: 'Cell Blocks', hint: 'Walkway, Warden’s Office ↔ Cafeteria' },
      { id: 'infirmary', label: 'Infirmary', hint: 'By the upper Cell Blocks entrance' },
      { id: 'roof', label: 'Roof access', hint: 'Stairs / doorway onto the roof' },
    ],
    how: step(AUDIO).details,
  },
  {
    id: 'flight',
    title: 'Final Afterlife flight',
    goal: 'In Afterlife, interact with the rooftop plane. No fuel needed — it takes the team to the bridge.',
    critical: [line(FLIGHT, /cannot be completed solo/)],
    refs: [{ type: 'sequence', items: ['Enter Afterlife', 'Interact with the plane', 'Revive on the electric chairs'] }],
    how: except(FLIGHT, /cannot be completed solo/),
  },
  {
    id: 'showdown',
    title: 'Break or continue the cycle',
    goal: 'Weasel against the other mobsters. Either result completes Pop Goes the Weasel.',
    refs: [
      { type: 'facts', items: [
        { k: 'Weasel wins', v: 'The cycle is broken' },
        { k: 'Mobsters win', v: 'The cycle continues' },
      ] },
    ],
    how: [step(CYCLE).summary, line(CYCLE, /ignored by the zombies/)],
  },
];

export default mobGuideSteps;
