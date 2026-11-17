import { dedicatedGuideSet } from './dedicatedGuides.js';

/*
 * The "Show" filters on the map catalog (/allmaps) and the Easter Egg list (/easter-eggs).
 * Every option is derived from data the cards already use, so a filter never disagrees with a card:
 * - Easter Eggs: the map has a main quest (mapData `isEasterEgg`).
 * - Full guides: one of the dedicated step-by-step guides (the cards' "Full guide" badge).
 * - Video guides: a main quest with a video guide but no full guide (the cards' "Video guide" badge).
 */
const isFullGuide = (map) => dedicatedGuideSet.has(map.slug);

export const MAP_FILTERS = {
  allmaps: [
    { id: 'all', label: 'All maps', matches: () => true },
    { id: 'easter-eggs', label: 'Easter Eggs', matches: (map) => Boolean(map.isEasterEgg) },
    { id: 'full-guides', label: 'Full guides', matches: isFullGuide },
  ],
  'easter-eggs': [
    { id: 'all', label: 'All quests', matches: () => true },
    { id: 'full-guides', label: 'Full guides', matches: isFullGuide },
    { id: 'video-guides', label: 'Video guides', matches: (map, { hasVideo } = {}) => !isFullGuide(map) && Boolean(hasVideo?.(map.slug, map)) },
  ],
};

export const DEFAULT_FILTER = 'all';
export const FILTER_PARAM = 'show';
export const filterStorageKey = (page) => `zh-map-filter:${page}`;

// A filter id from the URL or storage is only trusted if the page offers it.
export function resolveFilter(page, ...candidates) {
  const ids = new Set(MAP_FILTERS[page].map((filter) => filter.id));
  return candidates.find((candidate) => ids.has(candidate)) ?? DEFAULT_FILTER;
}

export function applyFilter(page, filterId, maps, context) {
  const filter = MAP_FILTERS[page].find((option) => option.id === filterId) ?? MAP_FILTERS[page][0];
  return maps.filter((map) => filter.matches(map, context));
}

export function filterCounts(page, maps, context) {
  return Object.fromEntries(MAP_FILTERS[page].map((filter) => [filter.id, maps.filter((map) => filter.matches(map, context)).length]));
}
