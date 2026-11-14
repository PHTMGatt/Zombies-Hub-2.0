/*
 * Where things are on Origins, for the schematic map (components/OriginsMap.jsx).
 *
 * The map is a zone sketch, not to scale: Spawn at the bottom, the Church at the top, the Excavation in
 * the middle of No Man's Land, Generator 4 on the left and Generator 5 on the right as you walk out
 * toward the Excavation, Generator 3 off the left door from spawn and Generator 2 (Tank Station) off the
 * exit door. Pins sit inside the zone they belong to; the key under the map carries the landmark in words.
 *
 * Landmarks come from the 2026-11-13 three-source check (Call of Duty Wiki, MrRoflWaffles and MrDalekJD
 * guides, this repo's own data): claude-command-center docs/research/zombies/origins.md. Where the
 * sources describe a spot differently, the Wiki wording is used, as that note recommends.
 *
 * Pin kinds (each has its own shape on the map and in the key):
 *   spot   – where the step happens            (circle)
 *   part   – a staff part                       (square)
 *   record – a record spawn area                (ring)
 *   gate   – a staff tunnel into the Crazy Place (arch)
 *   target – something to shoot, set or light   (diamond)
 * Coordinates are in the map's 320 × 380 viewBox.
 */

import { originsLightningSwitches } from '../../../../shared/data/originsLightning';

// Where each Lightning switch sits on the sketch, by the switch board's ids.
const SWITCH_POINTS = {
  spawn: { x: 130, y: 360 },
  'gen-2': { x: 284, y: 320 },
  'gen-5': { x: 246, y: 214 },
  'gen-4': { x: 84, y: 200 },
  'church-basement': { x: 124, y: 44 },
  'church-upstairs': { x: 196, y: 70 },
  excavation: { x: 178, y: 136 },
};

// Zone centres, so pins read as "in this zone" rather than as exact positions.
export const ZONES = {
  church: { x: 160, y: 52 },
  gen4: { x: 56, y: 181 },
  gen5: { x: 264, y: 181 },
  excavation: { x: 160, y: 186 },
  gen3: { x: 65, y: 295 },
  gen2: { x: 257, y: 295 },
  spawn: { x: 160, y: 345 },
  crazy: { x: 51, y: 50 },
};

// The four tunnels into the Crazy Place, drawn on every view in their staff colour.
export const TUNNELS = [
  { staff: 'fire', x: 108, y: 326, label: 'Fire tunnel' },
  { staff: 'ice', x: 118, y: 92, label: 'Ice tunnel' },
  { staff: 'wind', x: 100, y: 168, label: 'Wind tunnel' },
  { staff: 'lightning', x: 220, y: 168, label: 'Lightning tunnel' },
];

/* Main Guide: one view per step that happens somewhere. The staff steps have none: their tabs own them. */
export const stepPlaces = {
  'secure-keys': {
    layers: ['robots'],
    pins: [
      { kind: 'spot', x: 270, y: 100, text: 'Ice → Freya, the robot that walks past the Church' },
      { kind: 'spot', x: 206, y: 186, text: 'Wind → Odin, the robot that crosses the middle' },
      { kind: 'spot', x: 270, y: 262, text: 'Lightning → Thor, the robot on the spawn side' },
      { kind: 'spot', x: 160, y: 186, text: 'Fire → the holder at the bottom of the Excavation' },
    ],
  },
  'thunder-fists': {
    pins: [
      { kind: 'spot', x: 282, y: 200, text: 'Footprint by Generator 5 / Stamin-Up' },
      { kind: 'spot', x: 160, y: 118, text: 'Footprint on the path from the Excavation to the Church' },
      { kind: 'spot', x: 104, y: 230, text: 'Footprint on the path from No Man’s Land toward Generator 4' },
      { kind: 'spot', x: 34, y: 202, text: 'Footprint in the corner by Generator 4 / Juggernog / MP40' },
      { kind: 'target', x: 196, y: 44, text: 'One Inch Punch: the reward box by Generator 6' },
    ],
  },
  'g-strike': {
    pins: [
      { kind: 'spot', x: 234, y: 320, text: 'Take the tablet from the Tank Station table (Generator 2), left of the back door' },
      { kind: 'spot', x: 128, y: 70, text: 'Church: holy-water basin, about 20 melee kills' },
      { kind: 'spot', x: 280, y: 320, text: 'Back on the Tank Station table, about 20 more melee kills; no mud on the way' },
    ],
  },
  'rain-fire': {
    layers: ['robots'],
    pins: [
      { kind: 'spot', x: 200, y: 186, text: 'Red button in a robot’s head (solo: Odin, the middle robot)' },
      { kind: 'target', x: 306, y: 150, text: 'Cracked seal out of bounds behind Generator 5 / Stamin-Up' },
    ],
  },
  'unleash-horde': {
    pins: [
      { kind: 'target', x: 306, y: 150, text: 'The opened seal behind Generator 5: release the Maxis Drone here' },
    ],
  },
  'winged-beast': {
    pins: [
      { kind: 'spot', x: 160, y: 140, text: 'The pilot circles the Excavation clockwise: run the other way to meet it' },
    ],
  },
  'fist-of-iron': {
    pins: [
      { kind: 'spot', x: 160, y: 186, text: 'Bottom of the Excavation: punch the glowing Templars' },
    ],
  },
  'raise-hell': {
    pins: [
      { kind: 'spot', x: 51, y: 50, text: 'Crazy Place: all four staffs on their pedestals' },
    ],
  },
  freedom: {
    pins: [
      { kind: 'spot', x: 51, y: 50, text: 'Crazy Place: release the drone, then hold use on the blue rock' },
    ],
  },
};

/* Staff pages: every spot that staff needs, in the order the page reads (Build, then Upgrade). */
export const staffPlaces = {
  ice: {
    pins: [
      { kind: 'part', x: 160, y: 318, text: 'Part: dig spots on the spawn side (only while it snows)' },
      { kind: 'part', x: 160, y: 268, text: 'Part: dig spots around the middle / Excavation' },
      { kind: 'part', x: 160, y: 98, text: 'Part: dig spots around the Church' },
      { kind: 'record', x: 236, y: 318, text: 'Blue record: Tank Station by Generator 2' },
      { kind: 'gate', x: 118, y: 92, text: 'Ice tunnel by the Church / Generator 6' },
      { kind: 'target', x: 30, y: 222, text: 'Gravestone: right of the MP40 near Generator 4' },
      { kind: 'target', x: 108, y: 206, text: 'Gravestone: between the Excavation and a footprint, near Generator 4' },
      { kind: 'target', x: 292, y: 264, text: 'Gravestone: small hill right of the Tank Station back exit' },
    ],
  },
  fire: {
    pins: [
      { kind: 'part', x: 196, y: 44, text: 'Part: reward box beside Generator 6' },
      { kind: 'part', x: 160, y: 132, text: 'Part: the orange plane’s part lands near the Excavation' },
      { kind: 'record', x: 132, y: 62, text: 'Red record: Church / Generator 6 area' },
      { kind: 'gate', x: 108, y: 326, text: 'Fire tunnel near spawn, on the way to Generator 3' },
      { kind: 'target', x: 124, y: 42, text: 'Torches: Church basement, lit with the Fire Staff' },
    ],
  },
  wind: {
    layers: ['robots', 'tank'],
    pins: [
      { kind: 'part', x: 292, y: 100, text: 'Part: in Freya’s head (Church robot)' },
      { kind: 'part', x: 206, y: 186, text: 'Part: in Odin’s head (middle robot)' },
      { kind: 'part', x: 292, y: 262, text: 'Part: in Thor’s head (spawn-side robot)' },
      { kind: 'record', x: 248, y: 196, text: 'Yellow record: Generator 5 area, by Stamin-Up and the Lightning tunnel' },
      { kind: 'gate', x: 100, y: 168, text: 'Wind tunnel near Generator 4' },
      { kind: 'target', x: 88, y: 138, text: 'Smoke ball: between Generator 4 and the Wind tunnel' },
      { kind: 'target', x: 300, y: 214, text: 'Smoke ball: behind Stamin-Up by Generator 5' },
      { kind: 'target', x: 26, y: 248, text: 'Smoke ball: on the tank’s return path' },
    ],
  },
  lightning: {
    layers: ['tank'],
    pins: [
      { kind: 'part', x: 196, y: 262, text: 'Part: tank Church → Generator 2, jump right before the trench to Generator 2' },
      { kind: 'part', x: 214, y: 196, text: 'Part: tank Generator 2 → Church, jump left onto the Excavation scaffolding' },
      { kind: 'part', x: 236, y: 64, text: 'Part: tank Generator 2 → Church, jump right just before the Church' },
      { kind: 'record', x: 34, y: 202, text: 'Purple record: Generator 4 / Juggernog / Wind tunnel area' },
      { kind: 'gate', x: 220, y: 168, text: 'Lightning tunnel near Generator 5' },
      // The seven switches, in the switch board's order, worded by the board's own verified data.
      ...originsLightningSwitches.map((dial) => ({ kind: 'target', ...SWITCH_POINTS[dial.id], text: `Switch: ${dial.location}` })),
    ],
  },
};
