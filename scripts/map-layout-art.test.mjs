import test from 'node:test';
import assert from 'node:assert/strict';
import { loadModules } from './guide-content.mjs';

const [{ default: mapData }] = await loadModules(['apps/hub/src/data/mapData.js']);

// Layout art lives in one folder per game. World at War has no folder of its own and borrows the Black Ops 1 art.
const FOLDER = { 'World at War': 'BO1', 'Black Ops 1': 'BO1', 'Black Ops 2': 'BO2', 'Black Ops 3': 'BO3' };
const folderOf = (url) => /\/images\/(BO\d)\//.exec(url ?? '')?.[1] ?? null;
const find = (slug, game) => mapData.find((map) => map.slug === slug && map.game === game);

test('Kino der Toten shows its own layout art in Black Ops 1 and in Black Ops 3', () => {
  const bo1 = find('kino-der-toten', 'Black Ops 1');
  const bo3 = find('kino-der-toten', 'Black Ops 3');
  assert.ok(bo1?.layoutImage && bo3?.layoutImage, 'both versions have layout art');
  assert.equal(folderOf(bo1.layoutImage), 'BO1');
  assert.equal(folderOf(bo3.layoutImage), 'BO3');
  assert.notEqual(bo1.layoutImage, bo3.layoutImage);
});

test('every map takes its layout art from its own game folder', () => {
  for (const map of mapData) {
    const folder = folderOf(map.layoutImage);
    if (!folder) continue; // no layout art, or art that lives outside the per-game folders
    assert.equal(folder, FOLDER[map.game], `${map.name} (${map.game}) uses ${map.layoutImage}`);
  }
});
