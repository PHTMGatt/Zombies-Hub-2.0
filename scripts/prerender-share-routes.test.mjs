import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './guide-content.mjs';
import { SHARED_PAGES } from './prerender-meta.mjs';
import { routeTitle } from '../apps/hub/src/app/routeMetadata.js';

// Every video guide page and side Easter Egg page has its own share head, and a new one fails here until it is added.
const [guides, side, todo] = await loadModules(['apps/hub/src/data/EasterEggGuides.js', 'apps/hub/src/data/sideEE/index.js', 'apps/hub/src/data/videoTodo.js']);

test('every video guide with a video and every side Easter Egg page is prerendered for sharing', () => {
  const videoPages = guides.default.filter((guide) => guide.videoUrl).map((guide) => `/easter-eggs/${guide.slug}`);
  for (const route of videoPages) assert(SHARED_PAGES.includes(route), `${route} needs a share head (SHARED_PAGES in prerender-meta.mjs)`);
  for (const key of Object.keys(side.default)) assert(SHARED_PAGES.includes(`/side-easter-eggs/${key}`), `side Easter Egg ${key} needs a share head`);
  assert(SHARED_PAGES.includes('/side-easter-eggs/origins-speedrun'));
  for (const route of SHARED_PAGES) assert(!routeTitle(route).startsWith('Page not found'), `${route} has a real title`);
  // The Coming Soon map keeps no extra head.
  for (const slug of todo.comingSoonSlugs) assert(!SHARED_PAGES.includes(`/easter-eggs/${slug}`), `${slug} is the Coming Soon page`);
});
