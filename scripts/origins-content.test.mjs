import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BASELINE_PATH, guideStrings, loadModules } from './guide-content.mjs';

// Origins' content model for the field-sheet redesign: same steps, tracker remnants gone, facts kept.
const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).origins;
const staffBaseline = JSON.parse(readFileSync(resolve(root, 'scripts/fixtures/origins-staff-pages.baseline.json'), 'utf8'));
const [guideModule, staffModule] = await loadModules(['maps/origins/src/data/originsGuide.jsx', 'maps/origins/src/data/originsStaffPages.js']);
const steps = guideModule.default;
const staffPages = staffModule.default;
const strings = guideStrings({ steps });
const step = (id) => steps.find((item) => item.id === id);
const tabs = (id) => step(id).refs.find((ref) => ref.type === 'tabs').tabs;

const TRACKER_LABELS = [
  'Ice built', 'Fire built', 'Wind built', 'Lightning built',
  'Ice upgraded', 'Fire upgraded', 'Wind upgraded', 'Lightning upgraded',
  'Wind → Odin', 'Ice → Freya', 'Lightning → Thor', 'Fire → mound',
  'Gen 5 chest', 'Mound chest', 'Gen 6 chest', 'Juggernog chest',
];

test('origins keeps 11 steps in order', () => {
  assert.deepEqual(steps.map((item) => item.id), baseline.ids);
});

test('no tracker-only task lines remain in Origins', () => {
  assert.deepEqual(steps.filter((item) => item.tasks).map((item) => item.id), []);
  assert.deepEqual(TRACKER_LABELS.filter((label) => strings.includes(label)), []);
});

test('the facts behind removed tracker lines are still in the steps', () => {
  const facts = ['Odin · middle robot', 'Freya · Church / Gen 6 robot', 'Thor · spawn / Gen 1–3 robot', 'Pedestal at the bottom of the mound',
    'Gen 5 footprint', 'Mound footprint', 'Gen 6 footprint', 'Footprint behind Juggernog'];
  assert.deepEqual(facts.filter((fact) => !strings.includes(fact)), []);
});

test('Ice puzzle and gravestones are distinguished', () => {
  const ice = tabs('upgrade-staffs').find((tab) => tab.id === 'ice');
  const unordered = ice.refs.filter((ref) => ref.unordered);
  assert.equal(unordered.length, 1);
  assert.deepEqual(unordered[0].items, ['Crazy Place: match blue-dot pillar → ceiling stone, shoot it', 'Freeze 3 gravestones → shatter with bullets']);
  assert.equal(staffPages.ice.upgrade.anyOrder.label, 'Any order');
  assert.match(staffPages.ice.upgrade.anyOrder.text, /three gravestones/);
  assert.match(staffPages.ice.puzzle.note, /Follow the order the game shows/);
});

test('the switch board is linked, not embedded, on the Main Guide', () => {
  const upgradeRefs = JSON.stringify(step('upgrade-staffs').refs);
  assert.equal(step('upgrade-staffs').refs.flatMap((ref) => ref.tabs ?? []).flatMap((tab) => tab.refs).some((ref) => ref.type === 'custom'), false, 'no embedded tool in the upgrade tabs');
  assert.match(upgradeRefs, /\/maps\/origins\/lightning-staff#switches/);
  const lightning = tabs('upgrade-staffs').find((tab) => tab.id === 'lightning');
  assert.deepEqual(lightning.links, [{ to: '/maps/origins/lightning-staff#switches', label: 'Switch board' }]);
});

test('staff pages keep every line they had', () => {
  for (const [id, { lines }] of Object.entries(staffBaseline).filter(([key]) => !key.startsWith('_'))) {
    const page = staffPages[id];
    const text = JSON.stringify(page);
    const labels = page.build.map((row) => row.k);
    for (const line of lines) {
      if (line.label === 'Piano code') {
        assert(page.puzzle.pianoCode.includes(line.text), `${id}: piano chord ${line.text}`);
        continue;
      }
      assert(text.includes(JSON.stringify(line.text).slice(1, -1)), `${id} lost "${line.text}"`);
      if (line.label && line.label !== 'Excavation') assert(labels.includes(line.label), `${id} lost the label "${line.label}"`);
    }
  }
});
