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
    'Gen 5 footprint', 'Mound footprint', 'Church path footprint', 'Footprint behind Juggernog'];
  // 'Gen 6 footprint' was corrected to 'Church path footprint' (approved-removals.json).
  assert.deepEqual(facts.filter((fact) => !strings.includes(fact)), []);
});

test('the Main Guide carries the canonical Easter Egg names in order', () => {
  const canonical = ['Secure the Keys', 'Ascend from Darkness', 'Rain Fire', 'Unleash the Horde', 'Skewer the Winged Beast', 'Wield a Fist of Iron', 'Raise Hell', 'Freedom'];
  const titles = steps.map((item) => item.title);
  assert.deepEqual(titles.filter((title) => canonical.includes(title)), canonical);
});

test('the two staff steps are one line each, with no staff how-to behind them', () => {
  assert.equal(step('build-staffs').goal, 'Build all four elemental staffs before continuing.');
  assert.equal(step('upgrade-staffs').goal, 'Upgrade all four staffs before continuing.');
  for (const id of ['build-staffs', 'upgrade-staffs']) {
    for (const key of ['refs', 'how', 'problems', 'links']) assert.equal(step(id)[key], undefined, `${id} has ${key}`);
  }
});

test('no staff mechanics anywhere in the Main Guide', () => {
  const text = strings.join('\n');
  for (const word of [/\brecords?\b/i, /crystal/i, /gramophone/i, /\bpuzzle\b/i, /\bchords?\b/i, /\bswitch(es)?\b/i, /excavation rings?/i, /\borb\b/i]) {
    assert.doesNotMatch(text, word, `Main Guide mentions ${word}`);
  }
});

test('no lever-to-ring mapping is stated on any Origins page', () => {
  const text = JSON.stringify({ steps, staffPages });
  assert.doesNotMatch(text, /lever[^.]*controls/i);
  assert.doesNotMatch(text, /(top|second|bottom)[^.]*ring[^.]*lever|lever[^.]*(top|second|bottom)[^.]*ring/i);
});

test('Ice gravestones are any order and the pillar order follows the game', () => {
  assert.equal(staffPages.ice.upgrade.anyOrder.label, 'Any order');
  assert.match(staffPages.ice.upgrade.anyOrder.text, /three gravestones/);
  assert.match(staffPages.ice.puzzle.note, /Follow the order the game shows/);
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
