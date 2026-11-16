import test from 'node:test';
import assert from 'node:assert/strict';
import { routeDescription, routeTitle, SITE_DESCRIPTION } from '../apps/hub/src/app/routeMetadata.js';

test('route metadata handles hub, deep links, trailing slashes and unknown paths', () => {
  assert.equal(routeTitle('/'), 'Call of Duty Zombies Easter Egg Guides | Zombies Hub 2.0');
  assert.equal(routeTitle('/allmaps/'), 'All Call of Duty Zombies Maps | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/ice-staff'), 'Origins Ice Staff | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/IceStaff'), 'Origins Ice Staff | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/zetsubou-no-shima/cogs/2'), 'Zetsubou No Shima Cog Two | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins'), 'Origins Easter Egg Guide | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/der-eisendrache/bows/electric'), 'Der Eisendrache Storm Bow | Zombies Hub 2.0', 'tab names follow the guide navigation (Storm, not Electric)');
  assert.equal(routeTitle('/maps/gorod-krovi/valves'), 'Gorod Krovi Valve Solver | Zombies Hub 2.0');
  assert.equal(routeTitle('/info/nacht-der-untoten'), 'Nacht Der Untoten | Zombies Hub 2.0');
  assert.equal(routeTitle('/unknown'), 'Page not found | Zombies Hub 2.0');
});

test('route descriptions are per page and only promise a guide where one exists', () => {
  assert.equal(routeDescription('/'), SITE_DESCRIPTION);
  assert.equal(routeDescription('/unknown'), SITE_DESCRIPTION);
  assert.match(routeDescription('/allmaps/'), /^Browse the Zombies map index/);
  assert.match(routeDescription('/maps/origins'), /^Origins Easter Egg guide/);
  assert.match(routeDescription('/maps/origins/ice-staff'), /^Ice Staff: part of the Origins Easter Egg guide/);
  assert.match(routeDescription('/maps/revelations/sound-step'), /^Sound Step: part of the Revelations/);
  assert.doesNotMatch(routeDescription('/maps/nacht-der-untoten'), /Easter Egg guide/, 'maps without a dedicated guide get map-info wording');
  assert.match(routeDescription('/info/nacht-der-untoten'), /^Nacht Der Untoten map info/);
  assert.match(routeDescription('/side-easter-eggs/kino'), /^Kino der Toten side Easter Eggs/);
  const routes = ['/', '/allmaps', '/easter-eggs', '/side-easter-eggs', '/search', '/achievements',
    '/maps/origins', '/maps/mob-of-the-dead', '/maps/shadows-of-evil', '/maps/der-eisendrache',
    '/maps/zetsubou-no-shima', '/maps/gorod-krovi', '/maps/revelations'];
  assert.equal(new Set(routes.map(routeDescription)).size, routes.length, 'no two main pages share a description');
  for (const route of routes) assert(routeDescription(route).length <= 155, `${route} description fits a search snippet`);
  // Every dedicated-map route, tab included: title <= 60, description <= 155, no two routes share a title.
  const maps = ['origins', 'mob-of-the-dead', 'shadows-of-evil', 'der-eisendrache', 'zetsubou-no-shima', 'gorod-krovi', 'revelations'];
  const tabs = ['', '/step-details', '/og', '/ice-staff', '/speed-run', '/speed-run/prep', '/speed-run/lightning', '/plane', '/retriever-skulls', '/codes', '/final-step', '/parts', '/wisps', '/boss', '/bows', '/bows/base', '/bows/electric', '/bows/fire', '/bows/wolf', '/bows/void', '/prerequisites', '/reveal-blueprint', '/cogs', '/cogs/1', '/buildables', '/elevator-battle', '/extras', '/trophies', '/valves', '/apothicon-upgrade', '/egg-locations', '/summoning-key', '/sound-step'];
  const all = maps.flatMap((map) => tabs.map((tab) => `/maps/${map}${tab}`));
  for (const route of all) {
    assert(routeTitle(route).length <= 60, `${route} title <= 60: ${routeTitle(route)}`);
    assert(routeDescription(route).length <= 155, `${route} description <= 155`);
  }
  const titles = ['/', '/allmaps', '/easter-eggs', ...maps.flatMap((map) => ['', '/step-details'].map((tab) => `/maps/${map}${tab}`))].map(routeTitle);
  assert.equal(new Set(titles).size, titles.length, 'main and Step details titles are unique');
});
