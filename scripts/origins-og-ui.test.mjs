import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = path => readFileSync(resolve(import.meta.dirname, '..', path), 'utf8');
test('Origins main guide is the original guide: no UI/OG split, no Step details, five tabs', () => {
  const routes=read('maps/origins/routes/OriginsRoutes.jsx');
  const nav=read('maps/origins/src/components/Nav.tsx');
  assert.ok(routes.includes('index element={<OGGuide />}'), 'the original cards are the main guide');
  for (const old of ['og', 'step-details']) {
    assert.ok(routes.includes(`path="${old}" element={<Navigate to="/maps/origins" replace />}`), `/${old} lands on the main guide`);
  }
  assert.deepEqual([...nav.matchAll(/to: "([^"]+)"/g)].map((match) => match[1]), [
    '/maps/origins', '/maps/origins/ice-staff', '/maps/origins/fire-staff', '/maps/origins/wind-staff', '/maps/origins/lightning-staff',
  ]);
  for (const banned of ['step-details', '/og', 'speed-run', 'Step details']) assert.ok(!nav.includes(banned), `Origins tabs must not link ${banned}`);
});
test('Origins header stacks before the single row stops fitting, and never wraps the title', () => {
  const header=read('maps/origins/src/components/Header.tsx');
  const css=read('maps/origins/src/Styles/ComponentStyles/Header.css');
  const navCss=read('maps/origins/src/Styles/ComponentStyles/Nav.css');
  assert.equal(header.match(/revive-header-icon/g)?.length, 2, 'a Revive icon each side of the title');
  const stackAt = Number(css.match(/@media \(max-width: (\d+)px\) \{\s*\.origins-module \.site-header\.origins-map-header \{\s*flex-direction: column/)?.[1]);
  assert.ok(stackAt >= 1320, `title + tabs need about 1310px side by side; stacked layout starts at ${stackAt}px`);
  assert.ok(navCss.includes(`@media (min-width: ${stackAt + 1}px)`), 'tabs are nowrap exactly where the single row applies');
  assert.ok(/.header-title {[^}]*white-space: nowrap/.test(css));
});
test('OG view restores the original two-column reference', () => {
  const og=read('maps/origins/src/Pages/OGGuide.tsx');
  for(const label of ['guide-grid','Main Steps','Elemental Fist','Tips','Craft All Staffs','Obtain Air Strike Monkeys','Get These PERKS']) assert.ok(og.includes(label), `original guide keeps ${label}`);
  assert.equal(og.match(/<li>/g).length, 24, '11 main steps, 7 Elemental Fist lines, 6 tips');
});
test('the shared flat guide stays a plain step list: no accordion or images', () => {
  const flat = read('shared/guide/FlatGuide.jsx');
  assert.ok(flat.includes('id={step.id}') && flat.includes('data-step-link'));
  for (const banned of ['<details', 'aria-expanded', '<img']) assert.ok(!flat.includes(banned));
});
