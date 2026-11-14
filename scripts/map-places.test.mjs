import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './guide-content.mjs';

/*
 * The data behind the two sketch maps, checked where a slip would fail silently: a pin with no position
 * renders at 0,0 (and the pin-count checks still pass), two pins drawn on top of each other hide one
 * number, a renamed hunt area leaves an island lookup undefined and the picker throws mid-render.
 */
const [
  { default: originsGuide },
  { stepPlaces, staffPlaces, TUNNELS },
  { default: staffPages },
  { originsLightningSwitches },
  { ISLANDS },
  { STEP_ISLANDS, EGG_ISLANDS, SOUND_ISLANDS, THROW_ISLANDS },
  { default: revGuideSteps },
  { default: eggData },
  { default: soundStepData },
  { default: summoningKey },
] = await loadModules([
  'maps/origins/src/data/originsGuide.jsx',
  'maps/origins/src/data/originsPlaces.js',
  'maps/origins/src/data/originsStaffPages.js',
  'shared/data/originsLightning.js',
  'maps/revelations/src/components/RevIslandMap.jsx',
  'maps/revelations/src/data/revIslands.js',
  'maps/revelations/src/data/revGuideSteps.jsx',
  'maps/revelations/src/data/eggData.js',
  'maps/revelations/src/data/SoundStepData.js',
  'maps/revelations/src/data/SummoningKey.js',
]);

// ---- Origins: the zone sketch (OriginsMap.jsx, viewBox 320 × 380) ----
const VIEW = { width: 320, height: 380 };
// How far each pin shape reaches from its centre (OriginsMap.jsx PinShape), stroke included.
const REACH = { spot: 10.3, part: 9.3, record: 12.7, gate: 10.3, target: 12.3 };
const views = [
  ...Object.entries(stepPlaces).map(([id, view]) => [`Main Guide ${id}`, view]),
  ...Object.entries(staffPlaces).map(([id, view]) => [`${id} staff`, view]),
];

test('Origins map views belong to real steps and staffs', () => {
  const stepIds = originsGuide.map((step) => step.id);
  assert.deepEqual(Object.keys(stepPlaces).filter((id) => !stepIds.includes(id)), [], 'a map view names a step that does not exist');
  assert.deepEqual(Object.keys(staffPlaces).sort(), Object.keys(staffPages).sort(), 'one map per staff page');
});

test('every Origins pin has a position inside the sketch', () => {
  for (const [name, { pins }] of views) {
    for (const pin of pins) {
      const reach = REACH[pin.kind];
      assert(reach, `${name}: "${pin.text}" has an unknown kind "${pin.kind}"`);
      assert(Number.isFinite(pin.x) && Number.isFinite(pin.y), `${name}: "${pin.text}" has no position`);
      assert(pin.x - reach >= 0 && pin.x + reach <= VIEW.width && pin.y - reach >= 0 && pin.y + reach <= VIEW.height,
        `${name}: "${pin.text}" at ${pin.x},${pin.y} sits off the sketch`);
    }
  }
  for (const tunnel of TUNNELS) assert(Number.isFinite(tunnel.x) && Number.isFinite(tunnel.y), `${tunnel.label} has no position`);
});

test('no two Origins pins in one view cover each other', () => {
  for (const [name, { pins }] of views) {
    pins.forEach((a, i) => pins.slice(i + 1).forEach((b, j) => {
      const gap = Math.hypot(a.x - b.x, a.y - b.y) - REACH[a.kind] - REACH[b.kind];
      assert(gap >= 0, `${name}: pin ${i + 1} ("${a.text}") and pin ${i + j + 2} ("${b.text}") overlap by ${(-gap).toFixed(1)}`);
    }));
  }
});

test('every Lightning switch on the board has its own pin on the Lightning map', () => {
  const switches = staffPlaces.lightning.pins.filter((pin) => pin.text.startsWith('Switch: '));
  assert.deepEqual(switches.map((pin) => pin.text), originsLightningSwitches.map((dial) => `Switch: ${dial.location}`), 'one switch pin per dial, in board order');
  assert.equal(new Set(switches.map((pin) => `${pin.x},${pin.y}`)).size, switches.length, 'two switches share one spot');
});

test('Thunder Fists: each soul-chest chip is named the same, in the same order, in the map key', () => {
  const chips = originsGuide.find((step) => step.id === 'thunder-fists').refs.find((ref) => ref.type === 'chips').items;
  const chests = stepPlaces['thunder-fists'].pins.slice(0, chips.length).map((pin) => pin.text);
  chips.forEach((chip, i) => assert(chests[i].startsWith(`${chip}: `), `pin ${i + 1} is "${chests[i]}", not the "${chip}" chip`));
});

// ---- Revelations: the island ring (RevIslandMap.jsx) ----
const islandIds = ISLANDS.map((isle) => isle.id);
const unknown = (ids) => ids.filter((id) => !islandIds.includes(id));

test('Main Guide island views belong to real steps and light real islands', () => {
  const stepIds = revGuideSteps.map((step) => step.id);
  for (const [id, { lit, note }] of Object.entries(STEP_ISLANDS)) {
    assert(stepIds.includes(id), `island view "${id}" names a step that does not exist`);
    assert.deepEqual(unknown(lit), [], `${id} lights islands that are not on the ring`);
    assert(note?.length > 0, `${id} has no caption`);
  }
});

test('every egg area and sound-step region has islands on the ring', () => {
  for (const { section } of eggData) {
    assert(EGG_ISLANDS[section]?.length > 0, `egg area "${section}" has no islands`);
    assert.deepEqual(unknown(EGG_ISLANDS[section]), [], `egg area "${section}" names islands that are not on the ring`);
  }
  assert.deepEqual(Object.keys(EGG_ISLANDS).sort(), eggData.map((item) => item.section).sort(), 'egg islands keyed by stale areas');
  const regions = [...new Set(soundStepData.map((entry) => entry.area))];
  for (const region of regions) {
    assert(SOUND_ISLANDS[region]?.length > 0, `sound-step region "${region}" has no islands`);
    assert.deepEqual(unknown(SOUND_ISLANDS[region]), [], `sound-step region "${region}" names islands that are not on the ring`);
  }
  assert.deepEqual(Object.keys(SOUND_ISLANDS).sort(), regions.sort(), 'sound-step islands keyed by stale regions');
});

test('every Summoning Key throw lands on its own island', () => {
  const islands = summoningKey.map((entry) => THROW_ISLANDS[entry.name.replace(/^Throw \d+:\s*/, '').split(' ')[0]]);
  assert.deepEqual(unknown(islands.map((id) => id ?? '(none)')), [], 'a throw target has no island');
  assert.equal(new Set(islands).size, summoningKey.length, 'two throws share one island, so one badge would hide the other');
});
