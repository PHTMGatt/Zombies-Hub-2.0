/*
 * Pop Goes the Weasel, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number, title, one
 * short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step details tab
 * (stepDetails.js, section #step-N). Facts come only from mobRun in mobGuide.js (test-guarded).
 */
const BASE = '/maps/mob-of-the-dead';
const DETAILS = `${BASE}/step-details`;

const mobGuideSteps = [
  {
    id: 'key',
    title: 'Warden’s Key',
    goal: 'Find the key for your spawn, then shock the nearby generator in Afterlife to drop it.',
    links: [{ to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'plane',
    title: 'Build the Plane',
    goal: 'Collect the five Icarus parts and place each one on the rooftop plane.',
    links: [{ to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'trip-1',
    title: 'First bridge trip',
    goal: 'Fly to the Golden Gate Bridge, Pack-a-Punch if needed, then ride the electric chairs back.',
    links: [{ to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'retriever',
    title: 'Refuel + Hell’s Retriever',
    goal: 'Bring five fuel cans to the plane and feed each Cerberus head six souls, then take Hell’s Retriever.',
    links: [{ to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'trip-2',
    title: 'Second bridge trip',
    goal: 'Fly to the bridge and back, then advance a round so the fuel cans respawn.',
    links: [{ to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'skulls',
    title: 'Five blue skulls',
    goal: 'Throw Hell’s Retriever through all five skulls to spawn a free Blundergat in the Warden’s Office.',
    links: [{ to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'spoon',
    title: 'The spoon',
    goal: 'Reveal and shock the hidden spoon in Afterlife, then grab the cafeteria spoon with Hell’s Retriever.',
    links: [{ to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'trip-3',
    title: 'Third bridge trip',
    goal: 'Refuel and make the third round-trip. The Citadel number panel starts cycling afterwards.',
    links: [{ to: DETAILS, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'codes',
    title: 'Afterlife codes',
    goal: 'In Afterlife, enter all four prisoner numbers. Any order; you can split them across Afterlife visits.',
    links: [{ to: DETAILS, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'audio',
    title: 'Audio trail',
    goal: 'Collect the five headphones in order, listening to each recording before the next appears.',
    links: [{ to: DETAILS, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'flight',
    title: 'Final Afterlife flight',
    goal: 'In Afterlife, interact with the rooftop plane. No fuel needed — it takes the team to the bridge.',
    links: [{ to: DETAILS, section: 'step-11', label: 'Step details' }],
  },
  {
    id: 'showdown',
    title: 'Break or continue the cycle',
    goal: 'Weasel against the other mobsters. Either result completes Pop Goes the Weasel.',
    links: [{ to: DETAILS, section: 'step-12', label: 'Step details' }],
  },
];

export default mobGuideSteps;
