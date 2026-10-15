import test from 'node:test';
import assert from 'node:assert/strict';
import { routeTitle } from '../apps/hub/src/app/routeMetadata.js';

test('route metadata handles hub, deep links, trailing slashes and unknown paths', () => {
  assert.equal(routeTitle('/'), 'Maps, Easter Eggs & Guides | Zombies Hub 2.0');
  assert.equal(routeTitle('/allmaps/'), 'All Maps | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/ice-staff'), 'Ice Staff | Origins | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/origins/IceStaff'), 'Ice Staff | Origins | Zombies Hub 2.0');
  assert.equal(routeTitle('/maps/zetsubou-no-shima/cogs/2'), 'Cog Two | Zetsubou No Shima | Zombies Hub 2.0');
  assert.equal(routeTitle('/unknown'), 'Page not found | Zombies Hub 2.0');
});
