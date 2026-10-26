import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, resolve } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const root = resolve(here, '..');

const read = (path) => readFileSync(resolve(root, path), 'utf8');

test('Revelations main guide uses the header as its single map navigation row', () => {
  const mainGuide = read('maps/revelations/src/pages/MainGuide.jsx');
  const header = read('maps/revelations/src/components/Header.jsx');

  assert.match(header, /className="rev-header__nav"/);
  assert.doesNotMatch(mainGuide, /rev-main-shortcuts/);
  assert.doesNotMatch(mainGuide, /Revelations quick references/);
});

test('Revelations shell keeps cinematic blur and glass surfaces', () => {
  const globalCss = read('maps/revelations/src/global.css');
  const mainGuideCss = read('maps/revelations/src/styles/MainGuide.css');
  const headerCss = read('maps/revelations/src/components/Header.css');

  assert.match(globalCss, /filter:\s*blur\(/);
  assert.match(mainGuideCss, /backdrop-filter:\s*blur\(/);
  assert.match(headerCss, /justify-content:\s*space-between/);
});
