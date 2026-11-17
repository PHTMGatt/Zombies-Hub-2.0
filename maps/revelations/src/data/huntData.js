/*
 * Revelations hunt data, design-neutral: one record per thing the player must find, so any page design
 * (picker, carousel, list, map pins) can read the same facts. Counts are checked in
 * scripts/rev-hunt-data.test.mjs: 6 bones, 4 egg sets of 4 (16), 4 rune sets of 3 (12), 7 Summoning Key targets.
 *
 * Sources (CHARLIE, 2026-11-17; see docs/DESIGN-CONTENT-INPUT.md):
 *   S1 callofdutyzombies.com "Obtaining the Third Audio Reel"; S2 codzombiesguides.com Revelations.
 * `landmark` is the plain-words place a stranger can follow (our label first, the source's wording where it adds
 * a landmark). `check: true` = our video label and the source describe the place differently: confirm before
 * showing it as fact. `video` = CodeNamePizza guide (tt3mpH7Rrfo) timestamps in seconds, from the sibling data
 * files. `shot` = repo screenshot (maps/revelations/src/assets/rev-ref/), null = none yet. `gaps` lists what is missing.
 */
import eggData from './eggData.js';
import soundStepData from './SoundStepData.js';
import summoningKeyData from './SummoningKey.js';

export const HUNT_VIDEO = { id: 'tt3mpH7Rrfo', author: 'CodeNamePizza' };

const slug = (text) => text.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '');

/* ---- Bones: 6, shot off with a Pack-a-Punched bullet weapon, absorbed with the upgraded Servant (S1, S2). ---- */
export const bones = [
  { id: 'spawn', order: 1, area: 'Spawn', landmark: 'Inside the church, above or around a candle. Stand on the Corruption Engine platform and look in.', sources: ['S1', 'S2'], shot: 'bone-spawn.webp', video: null, gaps: ['video timestamp'] },
  { id: 'shang', order: 2, area: 'Shangri-La', landmark: 'Above the Stamin-Up machine.', sources: ['S1', 'S2'], shot: 'bone-shang.webp', video: null, gaps: ['video timestamp'] },
  { id: 'origins', order: 3, area: 'Origins', landmark: 'Outside the map: behind the VMP wall buy (S1), next to the Giant footprint (S2).', sources: ['S1', 'S2'], shot: 'bone-origins.webp', video: null, check: true, gaps: ['video timestamp', 'confirm the two anchors are the same spot'] },
  { id: 'verruckt', order: 4, area: 'Verrückt', landmark: 'Left of the Corruption Engine while facing it, above a big rock (near the waterfall).', sources: ['S1', 'S2'], shot: 'bone-verruckt.webp', video: null, gaps: ['video timestamp'] },
  { id: 'de', order: 5, area: 'Der Eisendrache', landmark: 'Outside the map on the wall run (antigravity): on the lower end of the fourth floating wall.', sources: ['S1', 'S2'], shot: 'bone-de.webp', video: null, check: true, gaps: ['video timestamp', 'the "fourth wall" is single-source (S1)'] },
  { id: 'nacht', order: 6, area: 'Nacht der Untoten', landmark: 'Roof of the bunker, above the portal to the Der Eisendrache area.', sources: ['S1', 'S2'], shot: 'bone-nacht.webp', video: null, gaps: ['video timestamp'] },
];
export const boneFinish = { id: 'absorb', landmark: 'Upper level of Nacht: absorb the bone pile with the upgraded Servant, then shoot Sophia’s corpse for the reel.', shot: 'bones-absorb.webp', gaps: ['sources differ on whether the corpse is shot once or twice'] };

/* ---- Eggs: 4 sets of 4 (one egg per set). Our label + the second source's wording, same order as eggData. ---- */
const eggSource = [
  ['Floor on the path to the Bowie Knife (Kino)', true],
  ['Higher balcony corner, right of the stage (Kino)', false],
  ['Bucket on the ground, right of Wunderfizz (Kino)', false],
  ['Primis statue room, at the statues’ feet (Der Eisendrache)', false],
  ['On a barrel next to the jump pad to Origins', false],
  ['Leaning on a trash can, left of the stairs to the Shangri-La jump pad', false],
  ['Floor by the window, left of Stamin-Up (Shangri-La)', true],
  ['Fire pit at the base of the staircase (Shangri-La)', false],
  ['Left side of the path into the building', true],
  ['Near Wunderfizz, beside two small chairs in a corner', false],
  ['Right of the blue-lit debris pile near the top of the Speed Cola stairs', false],
  ['Zetsubou No Shima room, floor between two large green test tubes', false],
  ['Mob of the Dead: just before the Corruption Engine, near the cells', false],
  ['Origins: left of Wunderfizz', false],
  ['Mob of the Dead: near the KN-44 wall buy', true],
  ['Origins: left of the Vesper wall buy, beside a pile of rocks', true],
];
export const eggs = eggData.flatMap((set, setIndex) => set.locations.map((location, i) => {
  const order = setIndex * 4 + i + 1;
  const [source, check] = eggSource[order - 1];
  return {
    id: `egg-${slug(set.section)}-${i + 1}`,
    set: set.section,
    setIndex: setIndex + 1,
    order,
    landmark: location.name,
    sourceLandmark: source,
    check,
    sources: ['video', 'S2'],
    shot: null,
    video: { id: HUNT_VIDEO.id, start: location.start, end: location.end },
    gaps: ['screenshot', ...(check ? ['our label and S2 differ: confirm in the video'] : [])],
  };
}));
export const eggSets = eggData.map((set, i) => ({ id: slug(set.section), name: set.section, order: i + 1, video: { id: HUNT_VIDEO.id, start: set.sectionStart, end: set.sectionEnd } }));

/* ---- Runes ("Sound Step"): 4 areas of 3. A Gateworm beeps near its rune; 4 runes are needed (S2). ---- */
const runeSource = {
  'Next to DE Pyramid': ['Der Eisendrache: on the Anti-Gravity pressure plate', true],
  'Primis Statues / Mystery Box Room': ['Der Eisendrache: in front of the three Primis statues', false],
  'Shangri-La · In Front of Stamin-Up': ['Shangri-La: panel in front of Stamin-Up', false],
  'Jump Pad Toward Origins': ['Near the jump pad to Origins', false],
  'Jump Pad Toward Shangri-La': ['Near the jump pad to Shangri-La', false],
  'Next to Quick Revive': ['Left of Quick Revive', false],
  'Back Wall by Corruption Engine': ['Mob of the Dead: across from the KN-44 wall buy, under a lamp', true],
  'Wall Next to Cell Block': ['Mob of the Dead: left of the Cafeteria entrance, by the fallen bulletin board', true],
  'Tunnel Between Origins and Mob': ['Origins: near the Generator 3 door to the Mob of the Dead area', false],
  'Zetsubou Test Tubes': ['Right of the two test tubes in the Zetsubou No Shima room', false],
  'Metal Fence by Electric Trap': ['In front of the metal fencing in the Power Room', false],
  'Path Toward Kino Jump Pad': ['On the footpath to the Kino jump pad', false],
};
const runeAreas = [...new Set(soundStepData.map((row) => row.area))];
export const runes = soundStepData.map((row, index) => {
  const [source, check] = runeSource[row.label];
  return {
    id: `rune-${slug(row.area)}-${slug(row.label)}`,
    set: row.area,
    setIndex: runeAreas.indexOf(row.area) + 1,
    order: index + 1,
    landmark: row.label,
    sourceLandmark: source,
    check,
    sources: ['video', 'S2'],
    shot: null,
    video: { id: HUNT_VIDEO.id, start: row.start },
    time: row.time,
    gaps: ['screenshot', ...(check ? ['our label and S2 differ: confirm in the video'] : [])],
  };
});
export const runeSets = runeAreas.map((name, i) => ({ id: slug(name), name, order: i + 1 }));

/* ---- Summoning Key: 7 targets, any order (S2). Nacht is one of the seven, not an eighth. ---- */
const throwSource = [
  'Radio in the chandelier (Kino)',
  'Clock above the Undercroft (Der Eisendrache)',
  'Focusing Crystal, left of the temple entrance (Shangri-La)',
  'Tombstone on a scaffolding platform, left of Wunderfizz (Origins)',
  'Poster in one of the cells (Mob of the Dead)',
  'Mounted MG42 atop the fountain, right of the Corruption Engine (Verrückt)',
  'Red barrel outside the window, left of the spawn portal (Nacht)',
];
export const throwsTargets = summoningKeyData.map((row, i) => ({
  id: `throw-${slug(row.name.split(':')[1] ?? row.name)}`,
  order: i + 1,
  landmark: row.name.replace(/^Throw \d+: /, ''),
  sourceLandmark: throwSource[i],
  check: false,
  sources: ['video', 'S2'],
  shot: null,
  video: { id: HUNT_VIDEO.id, start: row.start, end: row.end },
  gaps: ['screenshot'],
}));

export const huntCounts = { bones: 6, eggs: 16, eggSets: 4, runes: 12, runeSets: 4, throws: 7 };
