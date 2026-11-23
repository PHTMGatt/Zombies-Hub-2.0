/*
 * For The Good Of All, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }: number,
 * title, one short line, small links. Warnings, how-to lines, task lines and reference lists moved to the Step
 * details tab (stepDetails.js, section #step-N); the blue-rock, bone and turret screenshots to the Apothicon
 * Upgrade and Egg Locations tabs (revReferenceShots.js). Facts come only from ApothiconSteps.js (test-guarded).
 */
const BASE = '/maps/revelations';

const revGuideSteps = [
  {
    id: 'engines',
    title: 'Tombstones + engines',
    goal: 'Shoot the Spawn tombstones 2, 3, 1, 4, power all four Corruption Engines, then drop Pack-a-Punch.',
    links: [{ to: `${BASE}/step-details`, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'keeper',
    title: 'Keeper parts + weapons',
    goal: 'Collect the three Keeper Protector parts. Make sure the run has Li’l Arnies and the Apothicon Servant.',
    links: [{ to: `${BASE}/step-details`, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'servant',
    title: 'Upgrade the Servant',
    goal: 'Hit all five blue rocks in the sky with the Apothicon Servant, then Pack-a-Punch it in the Apothicon.',
    links: [{ to: `${BASE}/apothicon-upgrade`, section: 'servant-rocks', label: 'Servant rocks and videos' }, { to: `${BASE}/step-details`, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'reel-1',
    title: 'Reel 1 — Keeper ritual',
    goal: 'Crouch on the triangular ritual rock (jump pad off), protect the Keeper 3 minutes, take the reel to Nacht’s radio.',
    links: [{ to: `${BASE}/step-details`, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'reel-2',
    title: 'Reel 2 — Arnie holes',
    goal: 'Throw Li’l Arnies into all nine Apothicon wall holes, never one twice. Kill the Margwas after each three.',
    links: [{ to: `${BASE}/step-details`, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'reel-3',
    title: 'Reel 3 — Six bones',
    goal: 'Reveal each bone with a Pack-a-Punched bullet weapon, absorb it with the upgraded Servant, then finish the body at Nacht.',
    links: [{ to: `${BASE}/egg-locations`, section: 'bone-spots', label: 'Bone spots' }, { to: `${BASE}/step-details`, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'sophia',
    title: 'Materialize S.O.P.H.I.A.',
    goal: 'At each Corruption Engine, laser-turret the left of the two blue rocks above it. Then activate S.O.P.H.I.A. at Nacht.',
    links: [{ to: `${BASE}/egg-locations`, section: 'turret-shot', label: 'Turret shot' }, { to: `${BASE}/step-details`, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'eggs',
    title: 'Kronorium + four eggs',
    goal: 'Kronorium from Samantha’s bed to the Kino stage podium, then hatch all four eggs in the Apothicon’s nests.',
    links: [{ to: `${BASE}/egg-locations`, label: 'Egg locations' }, { to: `${BASE}/step-details`, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'runes',
    title: 'Runes of Creation',
    goal: 'Use each Gateworm to find its hidden rune. Listen for the beeping at the right spot.',
    links: [{ to: `${BASE}/sound-step`, label: 'Rune / sound reference' }, { to: `${BASE}/step-details`, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'symbols',
    title: 'Symbol room',
    goal: 'All players enter the purple rift together, enter the Kronorium’s symbol order, survive the Margwas.',
    links: [{ to: `${BASE}/step-details`, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'throws',
    title: 'Seven key throws',
    goal: 'Back on the map, hit all seven targets with the Summoning Key.',
    links: [{ to: `${BASE}/summoning-key`, label: 'Throw videos' }, { to: `${BASE}/step-details`, section: 'step-11', label: 'Step details' }],
  },
  {
    id: 'boss',
    title: 'Final boss — Shadowman',
    goal: 'Charge an altar, throw the Key through ghost S.O.P.H.I.A., then shoot the Shadowman into the Apothicon’s mouth.',
    links: [{ to: `${BASE}/step-details`, section: 'step-12', label: 'Step details' }],
  },
];

export default revGuideSteps;
