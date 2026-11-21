import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
const read = path => readFileSync(resolve(import.meta.dirname, '..', path), 'utf8');
test('Origins keeps original and UI routes accessible', () => {
  const routes=read('maps/origins/routes/OriginsRoutes.jsx');
  const nav=read('maps/origins/src/components/Nav.tsx');
  assert.ok(routes.includes('path="og" element={<OGGuide />}'));
  assert.ok(routes.includes('index element={<MainGuide />}'));
  // Owner spec 2026-11-21: the tabs are Main Guide + the four staffs only (no OG toggle, Step details or Speed Run).
  for (const to of ['"/maps/origins"', '"/maps/origins/ice-staff"', '"/maps/origins/fire-staff"', '"/maps/origins/wind-staff"', '"/maps/origins/lightning-staff"']) assert.ok(nav.includes(`to: ${to}`), to);
  for (const banned of ['/maps/origins/og', 'step-details', 'speed-run']) assert.ok(!nav.includes(banned), `nav must not link ${banned}`);
});
test('OG view restores the original two-column reference', () => {
  const og=read('maps/origins/src/Pages/OGGuide.tsx');
  for(const label of ['guide-grid','Main Steps','Tips','Rain Fire','Freedom']) assert.ok(og.includes(label));
});
test('Origins main guide is the flat step list: no accordion, header bars, chips, notes or content images', () => {
  const page = read('maps/origins/src/Pages/MainGuide.tsx');
  assert.ok(page.includes('FlatGuide'));
  for (const banned of ['GuideSteps', 'collapsibleReferences', 'compactAccordion', 'Field Notes', 'section-heading', 'route-link', '<details']) {
    assert.ok(!page.includes(banned), `Origins main guide must not use ${banned}`);
  }
  // The only images are the OG card-heading skulls, decorative (mockup A).
  for (const img of page.match(/<img[^>]*>/g) ?? []) assert.ok(img.includes('src={SkullIcon}') && img.includes('alt=""') && img.includes('aria-hidden'), img);
  const flat = read('shared/guide/FlatGuide.jsx');
  assert.ok(flat.includes('id={step.id}') && flat.includes('data-step-link'));
  for (const banned of ['<details', 'aria-expanded', '<img']) assert.ok(!flat.includes(banned));
});
