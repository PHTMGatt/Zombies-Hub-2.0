import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Der rendered setup guidance explicitly warns local/offline or unranked games require all four bows', () => {
  const landing = read('maps/der-eisendrache/src/pages/bows/BowLanding.tsx');
  const home = read('maps/der-eisendrache/src/pages/Home.tsx');
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
