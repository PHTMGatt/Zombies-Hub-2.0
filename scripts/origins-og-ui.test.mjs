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
  assert.ok(nav.includes('to="/maps/origins/og"'));
});
test('OG view restores the original two-column reference', () => {
  const og=read('maps/origins/src/Pages/OGGuide.tsx');
  for(const label of ['guide-grid','Main Steps','Tips','Rain Fire','Freedom']) assert.ok(og.includes(label));
});
test('Only Origins opts into collapsible existing staff diagrams', () => {
  assert.ok(read('maps/origins/src/Pages/MainGuide.tsx').includes('collapsibleReferences'));
  assert.ok(read('shared/guide/GuideSteps.jsx').includes('collapsibleReferences = false'));
  assert.ok(read('shared/guide/GuideReferences.jsx').includes('collapsibleTabs = false'));
  for(const name of ['ice','fire','wind','lightning']) assert.ok(read('maps/origins/src/data/originsGuide.jsx').includes(name+'_staff_code.webp'));
});
