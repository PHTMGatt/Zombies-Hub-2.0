import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');

test('Origins Fire guide uses the three actual staff-part sources and church torch upgrade', () => {
  const source = read('maps/origins/src/Pages/FireStaff.tsx');
  assert.match(source, /Generator 6/i);
  assert.match(source, /glowing plane/i);
  assert.match(source, /Panzer/i);
  assert.match(source, /torch/i);
  assert.doesNotMatch(source, /tank path/i);
});

test('Origins Ice guide separates the blue record from the Gen 6 tunnel and includes gravestones', () => {
  const source = read('maps/origins/src/Pages/IceStaff.tsx');
  assert.match(source, /(Tank Station|Generator 2)/i);
  assert.match(source, /gravestone/i);
  assert.doesNotMatch(source, /Blue Record:\s*In the Ice Tunnel/i);
});

test('Origins Wind guide identifies the Gen 4 tunnel and smoke-orb upgrade phase', () => {
  const source = read('maps/origins/src/Pages/WindStaff.tsx');
  assert.match(source, /Wind Tunnel[^\n]*Generator 4|Generator 4[^\n]*Wind Tunnel/i);
  assert.match(source, /smok/i);
});

test('Origins main guide names both audio controls for assistive technology', () => {
  const source = read('maps/origins/src/Pages/MainGuide.tsx');
  assert.match(source, /<audio\s+controls\s+aria-label="[^"]+"\s+src=\{Audio1\}/);
  assert.match(source, /<audio\s+controls\s+aria-label="[^"]+"\s+src=\{Audio2\}/);
});
