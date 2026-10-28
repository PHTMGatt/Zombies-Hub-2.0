import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Gorod Dragon Egg sequence warms the egg, waits a round, completes three trials, then incubates it', () => {
  const source = read('maps/gorod-krovi/src/data/gorodRun.js');
  assert.match(source, /warm/i);
  assert.match(source, /wait (a|one) round/i);
  assert.match(source, /three (egg )?trials/i);
  assert.match(source, /incubat/i);
  assert.doesNotMatch(source, /After incubation, fill the egg/i);
});

test('Gorod safe trophy includes both the Gauntlet Whelp and melee steps', () => {
  const source = read('maps/gorod-krovi/src/data/gorodRun.js');
  const safeLines = source.split('\n').filter(line => /safe/i.test(line)).join('\n');
  assert.match(safeLines, /Whelp/i);
  assert.match(safeLines, /melee|punch/i);
});

test('Gorod final Group 935 challenge uses the keycard, not a motherboard', () => {
  const data = read('maps/gorod-krovi/src/data/gorodRun.js');
  const main = read('maps/gorod-krovi/src/pages/MainGuide.jsx');
  const page = read('maps/gorod-krovi/src/pages/TrophyChallenges.jsx');
  for (const source of [data, main, page]) assert.doesNotMatch(source, /motherboard/i);
  assert.match(data, /Group 935 Challenge/i);
  assert.match(data, /keycard/i);
  assert.match(main, /Group 935 keycard lockdown/i);
  assert.match(page, /Group 935 keycard lockdown/i);
});
