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

// 2026-11-15 accuracy audit (Revelations #1, #2, #11).
test('Revelations reel 1 has the player crouch on the triangle stone while the jump pad is off', () => {
  const source = read('maps/revelations/src/data/ApothiconSteps.js');
  assert.match(source, /crouch on the triangle stone while the pad is off/i);
  assert.doesNotMatch(source, /starts the ritual by standing close/i);
});

test('Revelations puts the Kronorium on the Kino stage podium, never on "the altar"', () => {
  for (const file of ['maps/revelations/src/data/ApothiconSteps.js', 'maps/revelations/src/data/revGuideSteps.jsx']) {
    const source = read(file);
    assert.match(source, /podium/i, `${file} names the podium`);
    assert.doesNotMatch(source, /Kino altar|Kronorium on the altar/i, `${file} still says altar`);
  }
});

test('Revelations uses the in-game names: Li’l Arnie, Wunderfizz, Verrückt', () => {
  for (const file of ['maps/revelations/src/data/ApothiconSteps.js', 'maps/revelations/src/data/revGuideSteps.jsx']) {
    assert.doesNotMatch(read(file), /Little Arnie/i, `${file} says Little Arnie`);
  }
  const eggs = read('maps/revelations/src/data/eggData.js');
  assert.doesNotMatch(eggs, /Wonderfizz/i);
  assert.doesNotMatch(eggs, /Verruckt/);
});
