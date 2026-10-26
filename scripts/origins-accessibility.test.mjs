import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');
const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('Origins main guide gives both audio controls unique accessible labels', () => {
  const source = read('maps/origins/src/Pages/MainGuide.tsx');

  assert.match(source, /<audio\s+controls\s+aria-label="Origins robot radio message"\s+src=\{Audio1\}/);
  assert.match(source, /<audio\s+controls\s+aria-label="Origins zombie intro"\s+src=\{Audio2\}/);
});
