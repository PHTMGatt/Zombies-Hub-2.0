/*
 * My Brother's Keeper, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number, title, one
 * short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step details tab
 * (stepDetails.js, section #step-N). Facts come from deGuide.ts, bowGuides.ts and the bow, wisp, gear and boss pages. Per-game state (the safe code note), the bow routes and the video links live on the Step details tab.
 */
const BASE = '/maps/der-eisendrache';
const DETAILS = `${BASE}/step-details`;

const deGuideSteps = [
  {
    id: 'base-bow',
    title: 'Wrath of the Ancients',
    goal: 'Feed all three dragons, then take the base bow from the Family Crypt.',
    links: [{ to: `${BASE}/bows/base`, label: 'Base bow guide' }, { to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'upgrade-bow',
    title: 'Upgrade your bow',
    goal: 'Ranked / online: one upgraded bow per player. Local / offline or unranked: all four bows.',
    links: [{ to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'gear',
    title: 'Gear up: Shield + Ragnaroks',
    goal: 'Build as you go — every player needs a Ragnarok DG-4 before the boss.',
    links: [{ to: `${BASE}/parts`, label: 'Full gear page' }, { to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'first-wisps',
    title: 'First wisp cycle',
    goal: 'Prime the teleporter, hit four wisps, travel to the past together.',
    links: [{ to: `${BASE}/wisps`, label: 'Wisp reference' }, { to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'past-lab-1',
    title: 'Past lab: canister, fuses, safe code',
    goal: 'Grab the blue Soul Canister and the small fuses, and record the three safe symbols.',
    links: [{ to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'death-ray-safe',
    title: 'Death Ray + safe',
    goal: 'Fuses into the Death Ray, enter the safe code, loot the safe, power the pylons.',
    links: [{ to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'simon-vril',
    title: 'Simon Says + Vril Generator',
    goal: 'Solve both memory terminals, crash Dempsey’s pod, take the Vril Generator.',
    links: [{ to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'second-wisps',
    title: 'Second wisp cycle + Keeper Stone',
    goal: 'Repeat the wisps, go back to the past, take the Keeper Stone.',
    links: [{ to: `${BASE}/wisps`, label: 'Wisp reference' }, { to: DETAILS, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'keeper-ritual',
    title: 'Ghost Keeper ritual',
    goal: 'Summon the Keeper, follow it to four circles, charge each with the bow it asks for.',
    links: [{ to: DETAILS, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'mpd-prep',
    title: 'MPD + boss prep',
    goal: 'Soul Canister into the MPD, every player ready, then plant Ragnaroks together.',
    links: [{ to: DETAILS, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'keeper-boss',
    title: 'Keeper boss',
    goal: 'Three Keeper damage phases with Panzer waves between. Stun with a Ragnarok, shoot the chest.',
    links: [{ to: `${BASE}/boss`, label: 'Boss survival sheet' }, { to: DETAILS, section: 'step-11', label: 'Step details' }],
  },
  {
    id: 'ending',
    title: 'Ending',
    goal: 'Take the Summoning Key from the MPD to the Clock Tower terminal.',
    links: [{ to: DETAILS, section: 'step-12', label: 'Step details' }],
  },
];

export default deGuideSteps;
