import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const source = readFileSync(resolve(root, 'maps/shadows-of-evil/src/data/soeGuide.js'), 'utf8');

test('Shadows sword-symbol train route uses Waterfront to Footlight, then Footlight to Canals', () => {
  assert.match(source, /Waterfront\s*→\s*Footlight[^\n]*first two|Waterfront\s*→\s*Footlight[^\n]*two train symbols/i);
  assert.match(source, /Footlight\s*→\s*Canals[^\n]*(third|remaining) symbol/i);
  assert.doesNotMatch(source, /Canals\s*→\s*Waterfront[^\n]*first two/i);
});

test('Shadows finale separates the train caller from the central Keeper player', () => {
  assert.match(source, /(train caller|calls? the train)[^\n]*(enter|enters)[^\n]*Beast Mode[^\n]*shock/i);
  assert.match(source, /(fourth|central) player[^\n]*(center|Gateworm|Keepers)/i);
  assert.match(source, /(white|cleansing)[^\n]*(wisp|circle)/i);
  assert.doesNotMatch(source, /use the oxygen bubbles/i);
  assert.doesNotMatch(source, /fourth player starts the train[^\n]*That player[^\n]*three Keepers/is);
});
