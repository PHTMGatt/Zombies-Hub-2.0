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

test('Only Origins UI gets the compact step accordion; original pages stay independent', () => {
  const main=read('maps/origins/src/Pages/MainGuide.tsx');
  const steps=read('shared/guide/GuideSteps.jsx');
  assert.ok(main.includes('compactAccordion'));
  assert.ok(steps.includes('compactAccordion = false'));
  assert.ok(steps.includes('guide-seq__step-disclosure'));
  assert.ok(steps.includes('if (disclosure) disclosure.open = true'), 'hash links open their target step');
  assert.ok(read('maps/origins/src/Styles/PageStyles/MainGuide.css').includes('guide-seq__step-summary'));
});

test('Origins UI keeps robot placements visible and opens staff directly from each step', () => {
  const source = read('shared/guide/GuideSteps.jsx');
  assert.ok(source.includes("step.id === 'secure-keys'"));
  assert.ok(source.includes('guide-seq__step-glance'));
  assert.ok(source.includes('collapsibleTabs={compactAccordion && Boolean(tabsRef)}'));
  assert.ok(source.includes('if (compactAccordion)'));
  const css = read('maps/origins/src/Styles/PageStyles/MainGuide.css');
  assert.ok(css.includes('guide-seq__step-glance'));
});
