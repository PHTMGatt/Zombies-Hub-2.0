import { dedicatedGuideSet } from '../data/dedicatedGuides.js';

const names = {
  origins: 'Origins', 'mob-of-the-dead': 'Mob of the Dead',
  'shadows-of-evil': 'Shadows of Evil', 'der-eisendrache': 'Der Eisendrache',
  'zetsubou-no-shima': 'Zetsubou No Shima', 'gorod-krovi': 'Gorod Krovi',
  revelations: 'Revelations', 'origins-speedrun': 'Origins Speed Run',
  kino: 'Kino der Toten', gk: 'Gorod Krovi', de: 'Der Eisendrache', soe: 'Shadows of Evil',
  'fire-staff': 'Fire Staff', 'ice-staff': 'Ice Staff', 'wind-staff': 'Wind Staff',
  'lightning-staff': 'Lightning Staff', '1': 'Cog One', '2': 'Cog Two', '3': 'Cog Three',
};
const labels = {
  '/': 'Call of Duty Zombies Easter Egg Guides', '/allmaps': 'All Call of Duty Zombies Maps',
  '/easter-eggs': 'Main Zombies Easter Egg Guides', '/side-easter-eggs': 'Side Easter Eggs',
  '/coming-soon': 'Guide in progress', '/achievements': 'Achievements', '/search': 'Search',
};
// Tab names as the guides' own navigation calls them (so a title matches what the page says), keyed by the path after the map.
const tabNames = {
  'step-details': 'Step Details', og: 'Original Guide', 'speed-run': 'Speed Run', 'speed-run/prep': 'Speed Run Prep', 'speed-run/lightning': 'Speed Run Lightning',
  'retriever-skulls': 'Retriever + Skulls', 'final-step': 'Final Fight', parts: 'Gear', boss: 'Boss Fight', 'elevator-battle': 'Boss Fight',
  bows: 'Bows', 'bows/base': 'Base Bow', 'bows/electric': 'Storm Bow', 'bows/fire': 'Fire Bow', 'bows/wolf': 'Wolf Bow', 'bows/void': 'Void Bow',
  valves: 'Valve Solver',
};
const tabName = (detail) => tabNames[detail.join('/').toLowerCase()] ?? displayName(detail.at(-1));
const displayName = (slug) => names[slug] || slug.replace(/([a-z])([A-Z])/g, '$1 $2')
  .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export function routeTitle(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (labels[path]) return `${labels[path]} | Zombies Hub 2.0`;
  const [, section, map, ...detail] = path.split('/');
  if (['maps', 'info', 'easter-eggs', 'side-easter-eggs'].includes(section) && map) {
    // A dedicated map reads "Map Page | Zombies Hub 2.0" (the map first, as people search); its root is the guide itself.
    if (section === 'maps' && dedicatedGuideSet.has(map)) {
      return detail.length ? `${displayName(map)} ${tabName(detail)} | Zombies Hub 2.0` : `${displayName(map)} Easter Egg Guide | Zombies Hub 2.0`;
    }
    const parts = detail.length ? [displayName(detail.at(-1)), displayName(map)] : [displayName(map)];
    if (section === 'side-easter-eggs') parts.push('Side Easter Eggs');
    return `${parts.join(' | ')} | Zombies Hub 2.0`;
  }
  return 'Page not found | Zombies Hub 2.0';
}

export const SITE_DESCRIPTION = 'Zombies Hub 2.0 is a Call of Duty Zombies companion with map guides, Easter eggs, side quests and speedrun references, World at War to Black Ops 3.';
const pageDescriptions = {
  '/allmaps': 'Browse the Zombies map index from World at War through Black Ops 3. Find dedicated guides, video references and maps still in progress.',
  '/easter-eggs': 'Find Call of Duty Zombies main Easter Egg walkthroughs and video guides. See which maps have complete guides and which are coming soon.',
  '/side-easter-eggs': 'Side Easter Egg guides for Call of Duty Zombies: smaller quests, songs and secrets map by map.',
  '/achievements': 'Your Zombies Hub 2.0 achievements: Easter Eggs you have marked complete, saved on this device.',
  '/search': 'Search every Zombies Hub 2.0 guide, step and map.',
  '/coming-soon': 'This Zombies Hub 2.0 guide is still being written.',
};

// Per-route description for search results and link previews. Built only from route names: no game facts.
export function routeDescription(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (path === '/') return SITE_DESCRIPTION;
  if (pageDescriptions[path]) return pageDescriptions[path];
  const [, section, map, ...detail] = path.split('/');
  if (!map) return SITE_DESCRIPTION;
  const name = displayName(map);
  const page = detail.length ? tabName(detail) : null;
  if (section === 'maps' && dedicatedGuideSet.has(map)) {
    if (detail.join('/') === 'step-details') return `${name} Easter Egg steps in detail: warnings, how-to lines and tips, one section per step. Zombies Hub 2.0.`;
    return page
      ? `${page}: part of the ${name} Easter Egg guide on Zombies Hub 2.0, a second-screen Call of Duty Zombies companion.`
      : `${name} Easter Egg guide: every step in order, built to glance at mid-game on a second screen.`;
  }
  if (section === 'easter-eggs') return `${name} main Easter Egg guide on Zombies Hub 2.0.`;
  if (section === 'side-easter-eggs') return `${name} side Easter Eggs on Zombies Hub 2.0.`;
  if (section === 'maps' || section === 'info') return `${name} map info on Zombies Hub 2.0, a Call of Duty Zombies companion.`;
  return SITE_DESCRIPTION;
}
