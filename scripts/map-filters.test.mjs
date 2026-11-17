import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './guide-content.mjs';

const [{ default: mapData }, filters, { dedicatedGuideSlugs }, { hasVideo, mainEggStatus }] = await loadModules([
  'apps/hub/src/data/mapData.js',
  'apps/hub/src/data/mapFilters.js',
  'apps/hub/src/data/dedicatedGuides.js',
  'apps/hub/src/data/guideStatus.js',
]);
const { MAP_FILTERS, applyFilter, filterCounts, resolveFilter } = filters;
const quests = mapData.filter((map) => map.isEasterEgg);

test('map catalog Show filters: All, Easter Eggs, Full guides', () => {
  assert.deepEqual(MAP_FILTERS.allmaps.map((filter) => filter.id), ['all', 'easter-eggs', 'full-guides']);
  assert.equal(applyFilter('allmaps', 'all', mapData).length, mapData.length);
  assert.deepEqual(applyFilter('allmaps', 'easter-eggs', mapData), quests);
  const full = applyFilter('allmaps', 'full-guides', mapData).map((map) => map.slug);
  // Origins is listed twice (Black Ops 2 and its Black Ops 3 Chronicles remaster); both lead to the full guide.
  assert.deepEqual([...new Set(full)].sort(), [...dedicatedGuideSlugs].sort(), 'every dedicated guide and nothing else');
});

test('Easter Egg list filters agree with the badge each card shows', () => {
  const context = { hasVideo };
  const byKind = { 'full-guides': 'tracked', 'video-guides': 'video' };
  for (const [filterId, kind] of Object.entries(byKind)) {
    const shown = applyFilter('easter-eggs', filterId, quests, context).map((map) => map.slug);
    const badged = quests.filter((map) => mainEggStatus(map).kind === kind).map((map) => map.slug);
    assert.deepEqual(shown, badged, `${filterId} shows exactly the cards badged ${kind}`);
  }
  const counts = filterCounts('easter-eggs', quests, context);
  assert.equal(counts.all, quests.length);
  assert(counts['full-guides'] > 0 && counts['video-guides'] > 0);
});

test('only filters a page offers are trusted from the URL or storage', () => {
  assert.equal(resolveFilter('allmaps', 'full-guides'), 'full-guides');
  assert.equal(resolveFilter('allmaps', 'video-guides', 'easter-eggs'), 'easter-eggs', 'an id from the other page is skipped');
  assert.equal(resolveFilter('allmaps', null, undefined), 'all');
  assert.equal(resolveFilter('easter-eggs', '<script>', 'nope'), 'all');
});
