import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './guide-content.mjs';

// Main Easter Egg maps with no dedicated guide and no video must be listed in data/videoTodo.js (their page
// is the small "video guide coming soon" card); a map with a video must not be.
const [maps, guides, todo, dedicated] = await loadModules([
  'apps/hub/src/data/mapData.js', 'apps/hub/src/data/EasterEggGuides.js', 'apps/hub/src/data/videoTodo.js', 'apps/hub/src/data/dedicatedGuides.js',
]);

test('every video-less main Easter Egg map is on the video TODO list, and only those', () => {
  const hasVideo = (slug) => Boolean(guides.default.find((guide) => guide.slug === slug)?.videoUrl);
  const wanted = [...new Set(maps.default.filter((map) => map.isEasterEgg && !dedicated.dedicatedGuideSet.has(map.slug) && !hasVideo(map.slug)).map((map) => map.slug))];
  assert.deepEqual([...todo.videoTodoSlugs, ...todo.comingSoonSlugs].sort(), wanted.sort());
  assert.deepEqual(todo.videoTodoSlugs.filter((slug) => todo.comingSoonSlugs.includes(slug)), [], 'a slug is either TODO or intentionally empty');
});
