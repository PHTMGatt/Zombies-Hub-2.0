import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Der rendered setup guidance explicitly warns local/offline or unranked games require all four bows', () => {
  const landing = read('maps/der-eisendrache/src/pages/bows/BowLanding.tsx');
  // The upgrade-bow step's line holds this warning; the flat main guide renders it (2026-11-16).
  const home = read('maps/der-eisendrache/src/data/deGuideSteps.jsx');
  for (const source of [landing, home]) {
    assert.match(source, /(local|offline)/i);
    assert.match(source, /unranked/i);
    assert.match(source, /all four bows/i);
  }
});

test('Der Fire guide states the exact four-shot fireplace limit', () => {
  const source = read('maps/der-eisendrache/src/data/bowGuides.ts');
  assert.match(source, /four (total )?shots/i);
  assert.doesNotMatch(source, /small number of shots/i);
});

test('Der Wolf guide uses the actual four painting story beats', () => {
  const source = read('maps/der-eisendrache/src/data/bowGuides.ts');
  assert.match(source, /castle[^\n]*(lightning|flames)/i);
  assert.match(source, /(slain|struck by arrows)[^\n]*(servant|mourn)/i);
  assert.doesNotMatch(source, /Battlefield\/war/);
});

test('Der main guide has one Step details action per row, preserving specialist destinations', () => {
  const main = read('maps/der-eisendrache/src/data/deGuideSteps.jsx');
  const details = read('maps/der-eisendrache/src/data/stepDetails.js');
  const renderer = read('shared/guide/StepDetails.jsx');
  const rows = [...main.matchAll(/links: \[(.*?)\],/g)];
  assert.equal(rows.length, 12);
  for (const [, links] of rows) {
    assert.match(links, /to: DETAILS, section: 'step-\d+', label: 'Step details'/);
    assert.doesNotMatch(links, /, \{ to:/);
  }
  for (const path of ['/bows/base', '/parts', '/wisps', '/boss']) {
    assert(details.includes('${BASE}' + path), 'Step Details retains ' + path);
  }
  assert.equal((details.match(/label: 'Wisp reference'/g) ?? []).length, 2);
  assert.match(renderer, /step\.links\?\.length > 0/);
});
