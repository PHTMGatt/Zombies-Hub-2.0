/*
 * Player-language search: "ice staff code", "gorod valves", "mob plane parts", "de wisps".
 *
 * Each entry points at the fastest useful place: an in-guide reference opens in that map's Quick refs
 * sheet (`?ref=<stepId>`, which never moves the player's run), a tool or reference page opens directly.
 * Keywords are the words players actually type. Step ids are checked against each map's step data by
 * scripts/search-index.test.mjs, so a renamed step fails the tests instead of silently breaking search.
 */
const ref = (map, stepId) => `/maps/${map}?ref=${stepId}`;

export const MAP_ALIASES = {
  origins: ['origins', 'ori', 'staffs', 'little lost girl'],
  'mob-of-the-dead': ['mob', 'motd', 'mob of the dead', 'alcatraz', 'pop goes the weasel'],
  'shadows-of-evil': ['shadows', 'soe', 'shadows of evil', 'morg', 'morg city'],
  'der-eisendrache': ['de', 'der eisendrache', 'eisendrache', 'castle', 'my brothers keeper'],
  'zetsubou-no-shima': ['zetsubou', 'zns', 'zetsubou no shima', 'island', 'seeds of doubt'],
  'gorod-krovi': ['gorod', 'gk', 'gorod krovi', 'stalingrad', 'love and war'],
  revelations: ['revelations', 'rev', 'for the good of all'],
  kino: ['kino', 'kino der toten'],
};

export const MAP_NAMES = {
  origins: 'Origins',
  'mob-of-the-dead': 'Mob of the Dead',
  'shadows-of-evil': 'Shadows of Evil',
  'der-eisendrache': 'Der Eisendrache',
  'zetsubou-no-shima': 'Zetsubou No Shima',
  'gorod-krovi': 'Gorod Krovi',
  revelations: 'Revelations',
  kino: 'Kino der Toten',
};

// kind: guide (whole tracked run) · ref (in-guide reference) · tool (interactive) · page (reference page)
export const SEARCH_ENTRIES = [
  // Origins
  { map: 'origins', kind: 'guide', title: 'Little Lost Girl — tracked guide', to: '/maps/origins', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'origins', kind: 'ref', title: 'Staff build codes', stepId: 'build-staffs', to: ref('origins', 'build-staffs'), keywords: ['staff code', 'staff codes', 'ice staff', 'fire staff', 'wind staff', 'lightning staff', 'build staff', 'symbols', 'gramophone', 'parts'] },
  { map: 'origins', kind: 'ref', title: 'Staff upgrades', stepId: 'upgrade-staffs', to: ref('origins', 'upgrade-staffs'), keywords: ['upgrade staff', 'upgrade staffs', 'ice upgrade', 'fire upgrade', 'wind upgrade', 'lightning upgrade', 'gravestones', 'chimneys', 'cauldrons', 'rings'] },
  { map: 'origins', kind: 'tool', title: 'Lightning switch board + Electrical Panel', to: '/maps/origins/lightning-staff', keywords: ['switches', 'switch board', 'electrical panel', 'lightning code', 'dials', 'piano', 'chords'] },
  { map: 'origins', kind: 'page', title: 'Ice Staff', to: '/maps/origins/ice-staff', keywords: ['ice staff', 'ice code', 'tablets', 'freya'] },
  { map: 'origins', kind: 'page', title: 'Fire Staff', to: '/maps/origins/fire-staff', keywords: ['fire staff', 'fire code', 'torches', 'mound'] },
  { map: 'origins', kind: 'page', title: 'Wind Staff', to: '/maps/origins/wind-staff', keywords: ['wind staff', 'wind code', 'smoke', 'odin'] },
  { map: 'origins', kind: 'page', title: 'Lightning Staff', to: '/maps/origins/lightning-staff', keywords: ['lightning staff', 'thor'] },
  { map: 'origins', kind: 'page', title: 'Speedrun route', to: '/maps/origins/speed-run', keywords: ['speedrun', 'speed run', 'fast', 'route'] },

  // Mob of the Dead
  { map: 'mob-of-the-dead', kind: 'guide', title: 'Pop Goes the Weasel — tracked guide', to: '/maps/mob-of-the-dead', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Plane parts', stepId: 'plane', to: ref('mob-of-the-dead', 'plane'), keywords: ['plane parts', 'plane', 'icarus', 'parts', 'build plane', 'uniforms', 'rigging', 'tanks', 'engine', 'control valve'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Cerberus heads + Hell’s Retriever', stepId: 'retriever', to: ref('mob-of-the-dead', 'retriever'), keywords: ['dogs', 'dog heads', 'hellhounds', 'cerberus', 'retriever', 'tomahawk', 'feed', 'fuel'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Five blue skulls', stepId: 'skulls', to: ref('mob-of-the-dead', 'skulls'), keywords: ['skulls', 'blue skulls', 'blundergat', 'free blundergat'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Spoon', stepId: 'spoon', to: ref('mob-of-the-dead', 'spoon'), keywords: ['spoon', 'spork', 'cafeteria'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Afterlife codes 101 · 386 · 872 · 481', stepId: 'codes', to: ref('mob-of-the-dead', 'codes'), keywords: ['codes', 'numbers', 'prisoner numbers', 'afterlife codes', '101', '386', '872', '481', 'keypad'] },
  { map: 'mob-of-the-dead', kind: 'ref', title: 'Headphones (audio trail)', stepId: 'audio', to: ref('mob-of-the-dead', 'audio'), keywords: ['headphones', 'audio', 'audio trail', 'recordings'] },

  // Shadows of Evil
  { map: 'shadows-of-evil', kind: 'guide', title: 'Shadows of Evil — tracked guide', to: '/maps/shadows-of-evil', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'shadows-of-evil', kind: 'tool', title: 'Train symbols notepad + rituals', stepId: 'rituals', to: ref('shadows-of-evil', 'rituals'), keywords: ['train symbols', 'symbols', 'train', 'rituals', 'gateworms', 'beast mode'] },
  { map: 'shadows-of-evil', kind: 'ref', title: 'Apothicon Sword egg + statues', stepId: 'sword', to: ref('shadows-of-evil', 'sword'), keywords: ['sword', 'apothicon sword', 'egg', 'statues', 'sword egg'] },
  { map: 'shadows-of-evil', kind: 'tool', title: 'Your Keeper + Margwa challenges', stepId: 'upgrade', to: ref('shadows-of-evil', 'upgrade'), keywords: ['keeper', 'arch ovum', 'archovum', 'margwa', 'upgrade sword', 'character', 'nero', 'jackie', 'floyd', 'jessica'] },
  { map: 'shadows-of-evil', kind: 'ref', title: 'Flag step', stepId: 'flag', to: ref('shadows-of-evil', 'flag'), keywords: ['flag', 'flag step', 'book'] },
  { map: 'shadows-of-evil', kind: 'ref', title: 'Four-player train finale', stepId: 'finale', to: ref('shadows-of-evil', 'finale'), keywords: ['finale', 'four player', '4 player', 'team setup', 'train', 'ending'] },

  // Der Eisendrache
  { map: 'der-eisendrache', kind: 'guide', title: 'My Brother’s Keeper — tracked guide', to: '/maps/der-eisendrache', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'der-eisendrache', kind: 'ref', title: 'Bow upgrades (Storm · Fire · Wolf · Void)', stepId: 'upgrade-bow', to: ref('der-eisendrache', 'upgrade-bow'), keywords: ['bows', 'bow', 'bow upgrades', 'storm bow', 'lightning bow', 'fire bow', 'wolf bow', 'void bow', 'wrath of the ancients'] },
  { map: 'der-eisendrache', kind: 'ref', title: 'Wrath of the Ancients (dragons)', stepId: 'base-bow', to: ref('der-eisendrache', 'base-bow'), keywords: ['dragons', 'feed dragons', 'base bow', 'wrath'] },
  { map: 'der-eisendrache', kind: 'ref', title: 'Wisps', stepId: 'first-wisps', to: ref('der-eisendrache', 'first-wisps'), keywords: ['wisps', 'wisp', 'wisp cycle'] },
  { map: 'der-eisendrache', kind: 'tool', title: 'Safe code notepad', stepId: 'death-ray-safe', to: ref('der-eisendrache', 'death-ray-safe'), keywords: ['safe', 'safe code', 'death ray', 'past', 'symbols'] },
  { map: 'der-eisendrache', kind: 'ref', title: 'Shield + Ragnarok parts', stepId: 'gear', to: ref('der-eisendrache', 'gear'), keywords: ['shield', 'shield parts', 'ragnarok', 'ragnaroks', 'dg4', 'gear'] },
  { map: 'der-eisendrache', kind: 'ref', title: 'Keeper ritual', stepId: 'keeper-ritual', to: ref('der-eisendrache', 'keeper-ritual'), keywords: ['keeper', 'ritual', 'ghost keeper'] },
  { map: 'der-eisendrache', kind: 'page', title: 'Boss fight', to: '/maps/der-eisendrache/boss', keywords: ['boss', 'boss fight', 'keeper boss'] },

  // Zetsubou No Shima
  { map: 'zetsubou-no-shima', kind: 'guide', title: 'Seeds of Doubt — tracked guide', to: '/maps/zetsubou-no-shima', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Shield + Gas Mask parts', stepId: 'bunker', to: ref('zetsubou-no-shima', 'bunker'), keywords: ['shield', 'shield parts', 'gas mask', 'mask', 'parts', 'bunker', 'pack a punch', 'pap'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'KT-4 parts', stepId: 'kt4', to: ref('zetsubou-no-shima', 'kt4'), keywords: ['kt4', 'kt-4', 'wonder weapon', 'spider', 'venom', 'vial'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Masamune ingredients', stepId: 'masamune', to: ref('zetsubou-no-shima', 'masamune'), keywords: ['masamune', 'upgrade kt4', 'fang', 'rainbow water', 'divinium'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Four skulls', stepId: 'skulls', to: ref('zetsubou-no-shima', 'skulls'), keywords: ['skulls', 'skull', 'pedestals', 'skull of nan sapwe'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Cog 2 — AA cannon plant cycle', stepId: 'cog-2', to: ref('zetsubou-no-shima', 'cog-2'), keywords: ['cogs', 'cog', 'plane', 'aa cannon', 'artillery shell', 'plant', 'blue water'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Cog 3 — zipline', stepId: 'cog-3', to: ref('zetsubou-no-shima', 'cog-3'), keywords: ['cogs', 'cog', 'zipline', 'trials'] },
  { map: 'zetsubou-no-shima', kind: 'ref', title: 'Three Trials', stepId: 'trials', to: ref('zetsubou-no-shima', 'trials'), keywords: ['trials', 'challenges', 'tablets'] },

  // Gorod Krovi
  { map: 'gorod-krovi', kind: 'guide', title: 'Love and War — tracked guide', to: '/maps/gorod-krovi', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'gorod-krovi', kind: 'tool', title: 'Valve Solver', stepId: 'valves', to: ref('gorod-krovi', 'valves'), keywords: ['valves', 'valve', 'valve solver', 'pipes', 'green light', 'cylinder', 'master code cylinder'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'Six trophies', stepId: 'trophies', to: ref('gorod-krovi', 'trophies'), keywords: ['trophies', 'trophy', 'trophy locations', 'silver trophies'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'S.O.P.H.I.A. challenges', stepId: 'challenges', to: ref('gorod-krovi', 'challenges'), keywords: ['challenges', 'sophia', 'sophia challenges', 'gersh', 'bombs', 'mangler', 'valkyrie'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'Code cylinders + Dragon Network', stepId: 'dragon-network', to: ref('gorod-krovi', 'dragon-network'), keywords: ['cylinders', 'code cylinders', 'groph', 'dragon network', 'power'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'Dragon Shield parts', stepId: 'shield', to: ref('gorod-krovi', 'shield'), keywords: ['shield', 'shield parts', 'guard of fafnir', 'dragon shield'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'Dragon egg → Gauntlet', stepId: 'egg', to: ref('gorod-krovi', 'egg'), keywords: ['egg', 'dragon egg', 'gauntlet', 'whelp', 'siegfried'] },
  { map: 'gorod-krovi', kind: 'ref', title: 'KRONOS', stepId: 'kronos', to: ref('gorod-krovi', 'kronos'), keywords: ['kronos', 'letters', 'letter wheels'] },

  // Revelations
  { map: 'revelations', kind: 'guide', title: 'For The Good Of All — tracked guide', to: '/maps/revelations', keywords: ['main easter egg', 'main quest', 'ee', 'walkthrough', 'steps'] },
  { map: 'revelations', kind: 'ref', title: 'Apothicon Servant blue rocks', stepId: 'servant', to: ref('revelations', 'servant'), keywords: ['servant', 'apothicon servant', 'rocks', 'blue rocks', 'upgrade servant', 'wonder weapon'] },
  { map: 'revelations', kind: 'ref', title: 'Six bones', stepId: 'reel-3', to: ref('revelations', 'reel-3'), keywords: ['bones', 'bone', 'reel 3'] },
  { map: 'revelations', kind: 'tool', title: 'Kronorium symbol order notepad', stepId: 'symbols', to: ref('revelations', 'symbols'), keywords: ['symbols', 'kronorium', 'symbol room', 'arena'] },
  { map: 'revelations', kind: 'ref', title: 'Summoning Key targets', stepId: 'throws', to: ref('revelations', 'throws'), keywords: ['summoning key', 'key', 'key throws', 'targets'] },
  { map: 'revelations', kind: 'ref', title: 'Tombstones + Corruption Engines', stepId: 'engines', to: ref('revelations', 'engines'), keywords: ['tombstones', 'corruption engines', 'engines', 'pack a punch', 'pap'] },
  { map: 'revelations', kind: 'ref', title: 'Kronorium + four eggs', stepId: 'eggs', to: ref('revelations', 'eggs'), keywords: ['eggs', 'gateworms', 'nests'] },
  { map: 'revelations', kind: 'page', title: 'Egg locations', to: '/maps/revelations/egg-locations', keywords: ['eggs', 'egg locations'] },

  // Side Easter Eggs
  { map: 'kino', kind: 'guide', title: 'Film reels + radios', to: '/side-easter-eggs/kino', keywords: ['reels', 'film reels', 'radios', 'rocket', 'side easter egg', 'side ee'] },
  { map: 'der-eisendrache', kind: 'page', title: 'Side Easter Egg video', to: '/side-easter-eggs/de', keywords: ['side easter egg', 'side ee', 'video'] },
  { map: 'gorod-krovi', kind: 'page', title: 'Side Easter Egg video', to: '/side-easter-eggs/gk', keywords: ['side easter egg', 'side ee', 'video'] },
  { map: 'shadows-of-evil', kind: 'page', title: 'Side Easter Egg video', to: '/side-easter-eggs/soe', keywords: ['side easter egg', 'side ee', 'video'] },

  // Hub
  { map: null, kind: 'page', title: 'Achievements', to: '/achievements', keywords: ['achievements', 'trophies earned', 'completed', 'medals', 'reset', 'sound'] },
  { map: null, kind: 'page', title: 'All maps', to: '/allmaps', keywords: ['maps', 'all maps', 'map list'] },
  { map: null, kind: 'page', title: 'Main Easter Eggs', to: '/easter-eggs', keywords: ['easter eggs', 'main ee', 'quests'] },
  { map: null, kind: 'page', title: 'Side Easter Eggs', to: '/side-easter-eggs', keywords: ['side easter eggs', 'side ee'] },
];

/* ---- Matching ---- */

export const normalize = (text) => text
  .toLowerCase()
  .normalize('NFD')
  .replace(/[̀-ͯ]/g, '')
  .replace(/[’'.]/g, '')
  .replace(/[^a-z0-9]+/g, ' ')
  .trim();

const words = (text) => normalize(text).split(' ').filter(Boolean);
const STOP = new Set(['the', 'a', 'an', 'of', 'on', 'in', 'for', 'to', 'where', 'how', 'do', 'i', 'is', 'are', 'what', 'find', 'get', 'locations', 'location']);

// Pull map aliases out of the query first ("gorod valves" → map gorod-krovi + "valves").
function splitQuery(query) {
  let rest = ` ${normalize(query)} `;
  const maps = new Set();
  const aliases = Object.entries(MAP_ALIASES)
    .flatMap(([map, list]) => list.map((alias) => [map, normalize(alias)]))
    .sort((a, b) => b[1].length - a[1].length);
  for (const [map, alias] of aliases) {
    if (rest.includes(` ${alias} `)) {
      maps.add(map);
      rest = rest.replace(` ${alias} `, ' ');
    }
  }
  return { maps, terms: rest.split(' ').filter((word) => word && !STOP.has(word)) };
}

const entryText = (entry) => [entry.title, ...entry.keywords].map(normalize);

function termScore(term, phrases, tokens) {
  if (tokens.has(term)) return 3;
  // Plurals and partial typing: "valve" ↔ "valves", "trop" → "trophies".
  for (const token of tokens) {
    if (term.length >= 3 && token.length >= 3 && (token.startsWith(term) || term.startsWith(token))) return 2;
  }
  return phrases.some((phrase) => phrase.includes(term)) && term.length >= 3 ? 1 : 0;
}

export function search(query, entries = SEARCH_ENTRIES) {
  const { maps, terms } = splitQuery(query);
  if (!maps.size && !terms.length) return [];
  const scored = entries.map((entry) => {
    const phrases = entryText(entry);
    const tokens = new Set(phrases.flatMap((phrase) => phrase.split(' ')));
    const queryText = normalize(query);
    let score = 0;
    let matched = 0;
    for (const term of terms) {
      const s = termScore(term, phrases, tokens);
      if (s > 0) matched += 1;
      score += s;
    }
    // A keyword phrase typed in full ("ice staff code") is the strongest signal.
    if (phrases.some((phrase) => phrase.length > 3 && queryText.includes(phrase))) score += 4;
    if (maps.size) {
      if (maps.has(entry.map)) score += terms.length ? 3 : 2;
      else score -= 6;
    }
    const allTerms = matched === terms.length;
    return { entry, score: allTerms ? score + 2 : score, matched };
  });
  return scored
    .filter(({ score, matched }) => score > 0 && (matched > 0 || !terms.length))
    // A bare map name ("gorod") leads with that map's guide; a specific query leads with the reference.
    .sort((a, b) => b.score - a.score || (terms.length ? 1 : -1) * ((a.entry.kind === 'guide') - (b.entry.kind === 'guide')))
    .map(({ entry }) => entry);
}
