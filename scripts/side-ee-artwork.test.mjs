import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';

const read = path => fs.readFileSync(new URL(`../${path}`, import.meta.url), 'utf8');

test('Side Easter Egg artwork comes from the clean artwork map, never burned-in title art', () => {
  const artwork = read('apps/hub/src/data/sideEEArtwork.js');
  // Maps/* covers are catalog strips with a title banner; BO3/Shadows_Of_Evil carries a logo in its corner.
  assert.doesNotMatch(artwork, /images\/Maps\//);
  assert.doesNotMatch(artwork, /BO3\/Shadows_Of_Evil/);
  for (const key of ['origins-speedrun', 'kino', 'gk', 'de', 'soe']) {
    assert.match(artwork, new RegExp(`['"]?${key}['"]?:`), `${key} has artwork`);
  }

  for (const page of ['apps/hub/src/pages/SideEasterEggList.jsx', 'apps/hub/src/pages/SideEEInfo.jsx']) {
    const source = read(page);
    assert.match(source, /sideEEArtwork/, `${page} uses the shared artwork map`);
    assert.doesNotMatch(source, /Cover\b|Layout\b/, `${page} does not pick its own cover art`);
  }
});
