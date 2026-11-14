import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { loadModules } from './guide-content.mjs';

const root = resolve(import.meta.dirname, '..');
const read = path => readFileSync(resolve(root, path), 'utf8');
// Staff-page facts live in one data module; check each staff's own text so one page cannot cover another.
const [{ default: staffPages }] = await loadModules(['maps/origins/src/data/originsStaffPages.js']);
const staffText = id => JSON.stringify(staffPages[id]);

test('Origins Fire guide uses the three actual staff-part sources and church torch upgrade', () => {
  const source = staffText('fire');
  assert.match(source, /Generator 6/i);
  assert.match(source, /glowing plane/i);
  assert.match(source, /Panzer/i);
  assert.match(source, /torch/i);
  assert.doesNotMatch(source, /tank path/i);
});

test('Origins Ice guide separates the blue record from the Gen 6 tunnel and includes gravestones', () => {
  const source = staffText('ice');
  assert.match(source, /(Tank Station|Generator 2)/i);
  assert.match(source, /gravestone/i);
  assert.doesNotMatch(source, /"Blue Record","v":"In the Ice Tunnel/i);
});

test('Origins Wind guide identifies the Gen 4 tunnel and smoke-orb upgrade phase', () => {
  const source = staffText('wind');
  assert.match(source, /Wind Tunnel[^\n]*Generator 4|Generator 4[^\n]*Wind Tunnel/i);
  assert.match(source, /smok/i);
});

test('Origins main guide names both audio controls for assistive technology', () => {
  const source = read('maps/origins/src/Pages/MainGuide.tsx');
  assert.match(source, /<audio\s+controls\s+aria-label="[^"]+"\s+src=\{Audio1\}/);
  assert.match(source, /<audio\s+controls\s+aria-label="[^"]+"\s+src=\{Audio2\}/);
});

// The side map is rendered by JS at (min-width: N) and its column by CSS. If the CSS one-column rule is
// (max-width: N - 1px), a zoomed window between N - 1 and N px wide gets the two columns with no map in them.
test('Origins Main Guide: the one-column breakpoint is the exact complement of the side-map query', () => {
  const wide = Number(read('maps/origins/src/Pages/MainGuide.tsx').match(/const WIDE = "\(min-width: (\d+)px\)"/)?.[1]);
  const narrow = read('maps/origins/src/Styles/PageStyles/MainGuide.css').match(/@media \(max-width: ([\d.]+)px\) \{\s*\.origins-module \.origins-guide \{/)?.[1];
  assert(wide > 0, 'MainGuide.tsx: WIDE query not found');
  assert.equal(Number(narrow), wide - 0.02, `one-column rule is (max-width: ${narrow}px) against (min-width: ${wide}px)`);
});

// --o-pin is how far sticky panels and anchors clear the pinned tab row. Set on .origins-module in a file
// imported before the tokens, it is reset to 0 by the base token and everything slides under the tabs.
test('Origins: only the tokens file sets the pinned-row height', () => {
  const files = ['maps/origins/src/Styles/ComponentStyles/Header.css', 'maps/origins/src/Styles/PageStyles/MainGuide.css', 'maps/origins/src/Styles/PageStyles/StaffPage.css', 'maps/origins/src/Styles/ComponentStyles/OriginsMap.css', 'maps/origins/styles/origins-shell.css'];
  for (const file of files) assert.doesNotMatch(read(file), /--o-pin\s*:/, `${file} sets --o-pin`);
  assert.match(read('maps/origins/src/Styles/origins-tokens.css'), /@media \(min-width: 901px\) and \(min-height: 600px\) \{\s*\.origins-module \{ --o-pin: var\(--o-tabs-height\); \}/);
});
