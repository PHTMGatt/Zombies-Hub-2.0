import test from 'node:test';
import assert from 'node:assert/strict';
import { routeDescription, routeTitle, SITE_DESCRIPTION } from '../apps/hub/src/app/routeMetadata.js';

test('route metadata handles hub, deep links, trailing slashes and unknown paths', () => {
  assert.equal(routeTitle('/'), 'Maps, Easter Eggs & Guides | Zombies Hub 2.0');
  assert.equal(routeTitle('/allmaps/'), 'All Maps | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/ice-staff'), 'Ice Staff | Origins | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/IceStaff'), 'Ice Staff | Origins | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/zetsubou-no-shima/cogs/2'), 'Cog Two | Zetsubou No Shima | Zombies Hub 2.0');
  assert.equal(routeTitle('/unknown'), 'Page not found | Zombies Hub 2.0');
});

test('route descriptions are per page and only promise a guide where one exists', () => {
  assert.equal(routeDescription('/'), SITE_DESCRIPTION);
  assert.equal(routeDescription('/unknown'), SITE_DESCRIPTION);
  assert.match(routeDescription('/allmaps/'), /^Every Call of Duty Zombies map/);
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
  for (const route of routes) assert(routeDescription(route).length <= 160, `${route} description fits a search snippet`);
});
