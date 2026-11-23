import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = path => readFileSync(resolve(import.meta.dirname, '..', path), 'utf8');
// Pure OG (Bryen 2026-11-23): maps/origins/og is a copy of PHTMGatt/Origins-Guide d64023e, mounted by the hub routes.
test('Origins is the OG guide: OG pages, no UI/OG split, no Step details, five OG tabs', () => {
  const routes=read('maps/origins/routes/OriginsRoutes.jsx');
  const nav=read('maps/origins/og/components/Nav.tsx');
  assert.ok(routes.includes("import MainGuide from '../og/Pages/MainGuide'") && routes.includes('index element={<MainGuide />}'), 'the OG main guide is the main guide');
  for (const old of ['og', 'step-details']) {
    assert.ok(routes.includes(`path="${old}" element={<Navigate to="/maps/origins" replace />}`), `/${old} lands on the main guide`);
  }
  assert.deepEqual([...nav.matchAll(/to="([^"]+)"/g)].map((match) => match[1]), [
    '/maps/origins', '/maps/origins/ice-staff', '/maps/origins/fire-staff', '/maps/origins/wind-staff', '/maps/origins/lightning-staff',
  ]);
  assert.ok(nav.includes('aria-label="Origins guide navigation"'));
  for (const banned of ['step-details', '/og', 'speed-run', 'Step details']) assert.ok(!nav.includes(banned), `Origins tabs must not link ${banned}`);
});
test('OG Origins header: a Revive icon each side, and it stacks before the one-row layout stops fitting', () => {
  const header=read('maps/origins/og/components/Header.tsx');
  assert.equal(header.match(/revive-header-icon/g)?.length, 2, 'a Revive icon each side of the title');
  for (const file of ['Header.css', 'Nav.css']) {
    const css=read(`maps/origins/og/Styles/ComponentStyles/${file}`);
    assert.ok(css.includes('@media (max-width: 1336px)'), `${file}: stacks at 1336px (the one-row header needs 1320px)`);
    assert.ok(!css.includes('@media (max-width: 1024px)'), `${file}: no OG 1024px switch left (it half-wrapped 1025-1319)`);
  }
});
test('OG main guide keeps its two-column Main Steps + Tips page', () => {
  const og=read('maps/origins/og/Pages/MainGuide.tsx');
  for(const label of ['guide-grid','Main Steps','Tips']) assert.ok(og.includes(label));
});
test('the shared flat guide stays a plain step list: no accordion or images', () => {
  const flat = read('shared/guide/FlatGuide.jsx');
  assert.ok(flat.includes('id={step.id}') && flat.includes('data-step-link'));
  for (const banned of ['<details', 'aria-expanded', '<img']) assert.ok(!flat.includes(banned));
});
