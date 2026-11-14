/*
 * Which islands of the Revelations ring (components/RevIslandMap.jsx) each part of the guide lights up.
 * Keyed by the exact strings and ids the pages read from their own data (eggData sections, SoundStepData
 * areas, the map name that leads each Summoning Key target, Main Guide step ids), so
 * scripts/map-places.test.mjs can prove every key still matches its data and every island is on the ring.
 */

// Main Guide. Islands per step come from each step's own data (its tabs, tasks and chips) and the
// 2026-11-13 source check (research:zombies:2026-11-13): engines and turrets on the four engine islands,
// the five Servant rocks, the three possible triangle-rock pads, the six bones, the seven key throws.
export const STEP_ISLANDS = {
  engines: { lit: ['spawn', 'de', 'verruckt', 'mob', 'nacht'], note: 'Tombstones at Spawn, an engine on four islands, the console at Nacht.' },
  servant: { lit: ['spawn', 'shang', 'verruckt', 'mob', 'nacht'], note: 'A blue rock above each of these five.' },
  'reel-1': { lit: ['shang', 'mob', 'verruckt', 'nacht'], note: 'The triangle rock is on one of three jump pads; the reel plays at Nacht.' },
  'reel-3': { lit: ['spawn', 'shang', 'origins', 'verruckt', 'de', 'nacht'], note: 'One bone on each of these six.' },
  sophia: { lit: ['spawn', 'de', 'verruckt', 'mob', 'nacht'], note: 'A turret at each engine, then S.O.P.H.I.A. at Nacht.' },
  throws: { lit: ['kino', 'de', 'shang', 'origins', 'mob', 'verruckt', 'nacht'], note: 'One target on each of these seven.' },
};

// Egg Locations: the islands each egg area covers (Kino and Der Eisendrache share one area, and so on).
export const EGG_ISLANDS = {
  'Kino der Toten / Der Eisendrache': ['kino', 'de'],
  'Spawn / Shangri-La': ['spawn', 'shang'],
  Verruckt: ['verruckt'],
  'Mob of the Dead / Origins': ['mob', 'origins'],
};

// Sound Step: the islands each region covers.
export const SOUND_ISLANDS = {
  'Der Eisendrache / Shangri-La': ['de', 'shang'],
  Spawn: ['spawn'],
  'Origins / Mob of the Dead': ['origins', 'mob'],
  Verrückt: ['verruckt'],
};

// Summoning Key: each throw's target sits on one island, named by the map that leads its title
// ("Mob Cell Poster").
export const THROW_ISLANDS = { Kino: 'kino', DE: 'de', 'Shangri-La': 'shang', Origins: 'origins', Mob: 'mob', Verrückt: 'verruckt', Nacht: 'nacht' };
