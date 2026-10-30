import React from 'react';
import RunNote from '../../../../shared/guide/RunNote';
import apothiconSteps from './ApothiconSteps';
import servantSpawn from '../assets/rev-ref/servant-spawn.webp';
import servantSpawnAim from '../assets/rev-ref/servant-spawn-aim.webp';
import servantShang from '../assets/rev-ref/servant-shang.webp';
import servantShangAim from '../assets/rev-ref/servant-shang-aim.webp';
import servantVerruckt from '../assets/rev-ref/servant-verruckt.webp';
import servantVerrucktAim from '../assets/rev-ref/servant-verruckt-aim.webp';
import servantMotd from '../assets/rev-ref/servant-motd.webp';
import servantMotdAim from '../assets/rev-ref/servant-motd-aim.webp';
import servantNacht from '../assets/rev-ref/servant-nacht.webp';
import servantNachtAim from '../assets/rev-ref/servant-nacht-aim.webp';
import boneSpawn from '../assets/rev-ref/bone-spawn.webp';
import boneShang from '../assets/rev-ref/bone-shang.webp';
import boneOrigins from '../assets/rev-ref/bone-origins.webp';
import boneVerruckt from '../assets/rev-ref/bone-verruckt.webp';
import boneDe from '../assets/rev-ref/bone-de.webp';
import boneNacht from '../assets/rev-ref/bone-nacht.webp';
import bonesAbsorb from '../assets/rev-ref/bones-absorb.webp';
import turretBeam from '../assets/rev-ref/turret-beam.webp';

/*
 * For The Good Of All as guide steps. Facts come only from ApothiconSteps.js (test-guarded); the
 * screenshots are the repo's own in-game captures, labelled by the region in their file names.
 */
const BASE = '/maps/revelations';
const MAP = 'revelations';
export const SYMBOL_NOTE_KEY = 'zh-rev-kronorium-symbols';

const phase = (title) => {
  const found = apothiconSteps.find((item) => item.title === title);
  if (!found) throw new Error(`revGuideSteps: no ApothiconSteps entry titled "${title}"`);
  return found;
};
const how = (title, ...skip) => [phase(title).detail, ...phase(title).bullets.filter((line) => !skip.some((pattern) => pattern.test(line)))];
const line = (title, pattern) => {
  const found = phase(title).bullets.find((item) => pattern.test(item));
  if (!found) throw new Error(`revGuideSteps: no line matching ${pattern} in "${title}"`);
  return found;
};

const IMG = { width: 1280, height: 720 };
const servantTab = (id, label, wide, aim) => ({
  id,
  label,
  refs: [
    { type: 'image', src: aim, alt: `Aiming the Apothicon Servant at the blue rock — ${label}`, caption: 'Aim here', ...IMG },
    { type: 'image', src: wide, alt: `Blue rock in the sky — ${label}`, caption: 'Where you stand', ...IMG },
  ],
});
const boneTab = (id, label, src) => ({
  id,
  label,
  refs: [{ type: 'image', src, alt: `Bone spot — ${label}`, caption: `${label}: shoot it with a Pack-a-Punched bullet weapon`, ...IMG }],
});

const T = {
  ENGINES: 'Tombstones + Corruption Engines',
  KEEPER: 'Keeper Protector + Required Weapons',
  SERVANT: 'Upgrade the Apothicon Servant',
  REEL1: 'Audio Reel 1 — Keeper Ritual',
  REEL2: 'Audio Reel 2 — Little Arnie Holes',
  REEL3: 'Audio Reel 3 — Six Bones',
  SOPHIA: 'Materialize S.O.P.H.I.A.',
  EGGS: 'Kronorium + Four Eggs',
  RUNES: 'Runes of Creation',
  SYMBOLS: 'Symbol Room + Summoning Key',
  THROWS: 'Seven Summoning Key Throws',
  BOSS: 'Final Boss — Shadowman',
};

const revGuideSteps = [
  {
    id: 'engines',
    title: 'Tombstones + engines',
    goal: 'Shoot the spawn tombstones 2-3-1-4, activate all four Corruption Engines, then open Pack-a-Punch inside the Apothicon.',
    refs: [{ type: 'sequence', label: 'Tombstone order', items: ['2', '3', '1', '4'] }],
    tasks: [
      { id: 'tombstones', label: 'Tombstones 2-3-1-4' },
      { id: 'spawn', label: 'Engine — Spawn' },
      { id: 'de', label: 'Engine — Der Eisendrache' },
      { id: 'verruckt', label: 'Engine — Verrückt' },
      { id: 'motd', label: 'Engine — Mob of the Dead' },
      { id: 'pap', label: 'Pack-a-Punch dropped', hint: 'Nacht console, then the three yellow sacs' },
    ],
    how: how(T.ENGINES),
  },
  {
    id: 'keeper',
    title: 'Keeper parts + weapons',
    goal: 'Collect the three Keeper Protector parts. Make sure the run has Little Arnies and the Apothicon Servant.',
    tasks: [
      { id: 'gem', label: 'Gemstone' },
      { id: 'head', label: 'Keeper head' },
      { id: 'flag', label: 'Flag' },
      { id: 'arnies', label: 'Little Arnies' },
      { id: 'servant', label: 'Apothicon Servant' },
    ],
    how: how(T.KEEPER),
  },
  {
    id: 'servant',
    title: 'Upgrade the Servant',
    goal: 'Hit all five blue rocks in the sky with the Apothicon Servant, then Pack-a-Punch it in the Apothicon.',
    refs: [
      { type: 'tabs', label: 'Blue rocks', tabs: [
        servantTab('spawn', 'Spawn', servantSpawn, servantSpawnAim),
        servantTab('shang', 'Shangri-La', servantShang, servantShangAim),
        servantTab('verruckt', 'Verrückt', servantVerruckt, servantVerrucktAim),
        servantTab('motd', 'Mob of the Dead', servantMotd, servantMotdAim),
        servantTab('nacht', 'Nacht', servantNacht, servantNachtAim),
      ] },
    ],
    tasks: [
      { id: 'spawn', label: 'Spawn rock' },
      { id: 'shang', label: 'Shangri-La rock' },
      { id: 'verruckt', label: 'Verrückt rock' },
      { id: 'motd', label: 'Mob of the Dead rock' },
      { id: 'nacht', label: 'Nacht rock' },
      { id: 'pap', label: 'Servant Pack-a-Punched' },
    ],
    // The written rock list in the data disagrees with these captures (it names Der Eisendrache); the
    // captures are shown and the conflicting line is left out until it is verified.
    how: how(T.SERVANT, /transcript/i),
    links: [{ to: `${BASE}/apothicon-upgrade`, label: 'Servant upgrade videos' }],
  },
  {
    id: 'reel-1',
    title: 'Reel 1 — Keeper ritual',
    goal: 'Find the triangular ritual rock, bring the Keeper to it, protect it for three minutes, take the reel to Nacht’s radio.',
    refs: [{ type: 'chips', label: 'Triangle rock: one of', items: ['Shangri-La', 'Mob of the Dead', 'Verrückt'] }],
    tasks: [
      { id: 'ritual', label: 'Keeper protected (3 min)' },
      { id: 'reel', label: 'Reel in the Nacht radio' },
    ],
    how: how(T.REEL1),
  },
  {
    id: 'reel-2',
    title: 'Reel 2 — Arnie holes',
    goal: 'In the Apothicon, throw Little Arnies into all nine wall holes, never the same one twice. Kill the Margwas after each three.',
    tasks: [
      { id: 'set1', label: 'Holes 1–3 + Margwas' },
      { id: 'set2', label: 'Holes 4–6 + Margwas' },
      { id: 'set3', label: 'Holes 7–9 + Margwas' },
      { id: 'reel', label: 'Reel in the Kino stage radio' },
    ],
    how: how(T.REEL2),
  },
  {
    id: 'reel-3',
    title: 'Reel 3 — Six bones',
    goal: 'Reveal each bone with a Pack-a-Punched bullet weapon, absorb it with the upgraded Servant, then finish the body at Nacht.',
    refs: [
      { type: 'tabs', label: 'Bone spots', tabs: [
        boneTab('spawn', 'Spawn', boneSpawn),
        boneTab('shang', 'Shangri-La', boneShang),
        boneTab('origins', 'Origins', boneOrigins),
        boneTab('verruckt', 'Verrückt', boneVerruckt),
        boneTab('de', 'Der Eisendrache', boneDe),
        boneTab('nacht', 'Nacht', boneNacht),
        { id: 'absorb', label: 'Absorbing', refs: [
          { type: 'image', src: bonesAbsorb, alt: 'Absorbing a revealed bone with the upgraded Apothicon Servant', caption: 'Then absorb it with the upgraded Servant', ...IMG },
        ] },
      ] },
    ],
    tasks: [
      { id: 'spawn', label: 'Spawn bone' },
      { id: 'shang', label: 'Shangri-La bone' },
      { id: 'origins', label: 'Origins bone' },
      { id: 'verruckt', label: 'Verrückt bone' },
      { id: 'de', label: 'Der Eisendrache bone' },
      { id: 'nacht', label: 'Nacht bone' },
      { id: 'reel', label: 'Reel on top of the Origins mound' },
    ],
    how: how(T.REEL3),
  },
  {
    id: 'sophia',
    title: 'Materialize S.O.P.H.I.A.',
    goal: 'At each Corruption Engine, hit the blue rock behind its rift with the laser turret. Then activate S.O.P.H.I.A. at Nacht.',
    critical: [line(T.SOPHIA, /kicks you off/)],
    refs: [{ type: 'image', src: turretBeam, alt: 'Laser turret firing at the blue rock behind a rift', caption: 'Turret shot', ...IMG }],
    tasks: [
      { id: 'spawn', label: 'Turret — Spawn' },
      { id: 'de', label: 'Turret — Der Eisendrache' },
      { id: 'verruckt', label: 'Turret — Verrückt' },
      { id: 'motd', label: 'Turret — Mob of the Dead' },
      { id: 'sophia', label: 'S.O.P.H.I.A. activated' },
    ],
    how: how(T.SOPHIA, /kicks you off/),
  },
  {
    id: 'eggs',
    title: 'Kronorium + four eggs',
    goal: 'Get the Kronorium from Samantha’s bed, place it on the Kino altar, then hatch all four eggs in the Apothicon’s nests.',
    refs: [{ type: 'sequence', label: 'Each egg', items: ['Into a yellow nest / pustule', '10 zombie souls', 'Gateworm'] }],
    tasks: [
      { id: 'book', label: 'Kronorium on the altar' },
      { id: 'e1', label: 'Gateworm 1' },
      { id: 'e2', label: 'Gateworm 2' },
      { id: 'e3', label: 'Gateworm 3' },
      { id: 'e4', label: 'Gateworm 4' },
    ],
    how: how(T.EGGS),
    links: [{ to: `${BASE}/egg-locations`, label: 'Egg locations' }],
  },
  {
    id: 'runes',
    title: 'Runes of Creation',
    goal: 'Use each Gateworm to find its hidden rune. Listen for the beeping at the right spot.',
    tasks: [
      { id: 'r1', label: 'Rune 1' },
      { id: 'r2', label: 'Rune 2' },
      { id: 'r3', label: 'Rune 3' },
      { id: 'r4', label: 'Rune 4' },
    ],
    how: how(T.RUNES),
    links: [{ to: `${BASE}/sound-step`, label: 'Rune / sound reference' }],
  },
  {
    id: 'symbols',
    title: 'Symbol room',
    goal: 'All players enter together through the Kino projector room’s purple rift. Read the Kronorium, enter its symbol order, survive the Margwas.',
    critical: [line(T.SYMBOLS, /symbol order changes every game/)],
    refs: [
      {
        type: 'custom',
        key: 'symbol-note',
        render: () => (
          <RunNote
            storageKey={SYMBOL_NOTE_KEY}
            mapId={MAP}
            label="Kronorium order · this game"
            hint="enter it at the back of the room"
            slots={['1st', '2nd', '3rd', '4th']}
          />
        ),
      },
    ],
    tasks: [
      { id: 'w1', label: 'Margwa wave 1' },
      { id: 'w2', label: 'Margwa wave 2' },
      { id: 'w3', label: 'Margwa wave 3' },
      { id: 'w4', label: 'Margwa wave 4' },
    ],
    how: how(T.SYMBOLS),
  },
  {
    id: 'throws',
    title: 'Seven key throws',
    goal: 'Back on the map, hit all seven targets with the Summoning Key.',
    critical: [line(T.THROWS, /melee during the transition/)],
    tasks: [
      { id: 'kino', label: 'Kino', hint: 'Chandelier' },
      { id: 'de', label: 'Der Eisendrache', hint: 'Clocktower face near the Corruption Engine' },
      { id: 'shang', label: 'Shangri-La', hint: 'Focusing Stone on the staff, top of the stairs' },
      { id: 'origins', label: 'Origins', hint: 'Tombstone at the top of the mound' },
      { id: 'motd', label: 'Mob of the Dead', hint: 'Poster inside the open cell' },
      { id: 'verruckt', label: 'Verrückt', hint: 'MG42 on the fountain' },
      { id: 'nacht', label: 'Nacht der Untoten', hint: 'Red barrel' },
    ],
    how: how(T.THROWS),
    links: [{ to: `${BASE}/summoning-key`, label: 'Throw videos' }],
  },
  {
    id: 'boss',
    title: 'Final boss — Shadowman',
    goal: 'Charge an altar with kills, throw the Summoning Key through ghost S.O.P.H.I.A., then shoot the Shadowman into the Apothicon’s mouth.',
    refs: [{ type: 'sequence', items: ['Charge an altar (~10 kills)', 'Key through ghost S.O.P.H.I.A.', 'Shoot the Shadowman', 'Interact with the book'] }],
    how: how(T.BOSS),
  },
];

export default revGuideSteps;
