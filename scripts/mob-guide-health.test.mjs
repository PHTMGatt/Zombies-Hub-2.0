import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Mob guide uses the real Icarus part locations and difficulty requirement', () => {
  const source = read('maps/mob-of-the-dead/src/data/mobGuide.js');
  assert.match(source, /(Original difficulty|does not.*Easy|not.*Easy)/i);
  assert.match(source, /Control Valve/i);
  assert.match(source, /Infirmary/i);
  assert.doesNotMatch(source, /Rooftop part:/i);
});

test("Mob Retriever guide uses Cell Block, Infirmary, Docks, and the Citadel pickup", () => {
  const source = read('maps/mob-of-the-dead/src/data/mobGuide.js');
  assert.match(source, /Cell Block/i);
  assert.match(source, /Infirmary/i);
  assert.match(source, /Docks/i);
  assert.match(source, /Citadel Tunnels/i);
  assert.doesNotMatch(source, /Hellhounds near spawn, the docks, and the rooftop/i);
  assert.doesNotMatch(source, /collect Hell's Retriever near the showers/i);
});

test('Mob skull and spoon steps point at the real pickups without calling the cafeteria spoon a Golden Spork', () => {
  const source = read('maps/mob-of-the-dead/src/data/mobGuide.js');
  assert.match(source, /third wooden.*pillar|third.*pier.*pillar/i);
  assert.match(source, /cafeteria/i);
  assert.doesNotMatch(source, /golden spork in the cafeteria/i);
});

test('Mob focused Retriever page describes the required spoon step instead of a spork shortcut', () => {
  const source = read('maps/mob-of-the-dead/src/pages/RetrieverSkulls.jsx');
  assert.match(source, /spoon/i);
  assert.doesNotMatch(source, /spoon\/spork/i);
});
