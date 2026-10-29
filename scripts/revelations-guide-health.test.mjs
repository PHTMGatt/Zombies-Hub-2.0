import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Revelations main guide keeps only the header map navigation row', () => {
  const source = read('maps/revelations/src/pages/MainGuide.jsx');
  assert.doesNotMatch(source, /rev-main-shortcuts/);
});

test('Revelations egg step explicitly uses the Apothicon incubation nests before soul charging', () => {
  const source = read('maps/revelations/src/data/ApothiconSteps.js');
  assert.match(source, /(yellow )?(incubation )?(nest|pustule)/i);
  assert.match(source, /10 zombie souls/i);
});

test('Revelations rune arena step explicitly tells all players to enter through the Kino purple rift', () => {
  const source = read('maps/revelations/src/data/ApothiconSteps.js');
  assert.match(source, /all players/i);
  assert.match(source, /Kino/i);
  assert.match(source, /purple (rift|circle)/i);
});

test('Revelations Summoning Key reference names the exact old-map targets', () => {
  const steps = read('maps/revelations/src/data/ApothiconSteps.js');
  const data = read('maps/revelations/src/data/SummoningKey.js');
  for (const source of [steps, data]) {
    assert.match(source, /Mob.*poster/i);
    assert.match(source, /MG42/i);
    assert.match(source, /(Focusing Stone|focusing crystal)/i);
  }
});
