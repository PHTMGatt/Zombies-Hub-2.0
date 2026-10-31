import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync, readdirSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const configSource = readFileSync(resolve(root, 'postcss.config.js'), 'utf8');

// A map missing from featureScopes depends on hand-written prefixes; one slip would leak into every page.
test('every map stylesheet is in the PostCSS scope list', () => {
  const maps = readdirSync(resolve(root, 'maps'), { withFileTypes: true }).filter((entry) => entry.isDirectory()).map((entry) => entry.name);
  const unscoped = maps.filter((map) => !new RegExp(`\\['maps/${map}/',\\s*'\\.[a-z-]+-module'\\]`).test(configSource));
  assert.deepEqual(unscoped, [], `maps without PostCSS scope enforcement: ${unscoped.join(', ')}`);
});
