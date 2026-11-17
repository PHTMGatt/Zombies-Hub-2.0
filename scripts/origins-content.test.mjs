import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { BASELINE_PATH, guideStrings, loadModules } from './guide-content.mjs';

// Origins' content model for the field-sheet redesign: same steps, tracker remnants gone, facts kept.
const root = resolve(import.meta.dirname, '..');
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8')).origins;
const staffBaseline = JSON.parse(readFileSync(resolve(root, 'scripts/fixtures/origins-staff-pages.baseline.json'), 'utf8'));
const [guideModule, staffModule, detailsModule] = await loadModules(['maps/origins/src/data/originsGuide.jsx', 'maps/origins/src/data/originsStaffPages.js', 'maps/origins/src/data/stepDetails.js']);
const steps = guideModule.default;
const staffPages = staffModule.default;
// 2026-11-16 flat main guide: the short line stays on the step; warnings, how-to, refs and tips live in the Step details tab.
const details = detailsModule.default;
const strings = guideStrings({ steps, details });
const step = (id) => steps.find((item) => item.id === id);
const detail = (id) => details.find((item) => item.id === id);

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
  assert.deepEqual([...steps, ...details].filter((item) => item.tasks).map((item) => item.id), []);
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

// 2026-11-15 accuracy audit (origins-open-facts.md #2 and #4, audit Origins #4, #5, #7).
test('Rain Fire, the winged beast and the staff placement follow the audited facts', () => {
  assert(strings.includes('A robot’s lit foot (solo: Odin)'), 'Rain Fire details name the lit foot, with Odin as the solo route');
  assert.doesNotMatch(strings.join(' | '), /red plane|Middle robot · open foot/i);
  assert.match(step('winged-beast').goal, /plane glowing yellow/);
  assert.match(step('winged-beast').goal, /Maxis Drone the pilot drops/);
  assert.match(detail('secure-keys').critical.join(' '), /All six generators must be on when the last staff goes in/);
});

// 2026-11-16 core rule (Bryen via Gandalf): the Main Guide is the Easter Egg steps only; the staff pages own
// Build / Puzzle / Upgrade. The two staff steps are one line each and link to each staff page's section, so a
// staff fact exists on its staff page only.
test('the two staff steps are one line each and link to the staff pages', () => {
  assert.equal(step('build-staffs').goal, 'Build all four elemental staffs before continuing.');
  assert.match(step('upgrade-staffs').goal, /^Upgrade all four staffs./);
  for (const [id, section] of [['build-staffs', 'build'], ['upgrade-staffs', 'puzzle']]) {
    for (const field of ['how', 'refs', 'critical', 'problems', 'tasks']) assert.equal(step(id)[field], undefined, `${id} has ${field}`);
    const staffLinks = step(id).links.filter((link) => link.to.startsWith('/maps/origins/') && link.to.endsWith('-staff'));
    assert.equal(staffLinks.length, 1, `${id}: one link into the staff pages`);
    assert.equal(staffLinks[0].section, section, `${id}: links to the staff page's #${section}`);
  }
  // Build's two tips are the run tips, not a second copy of them.
  assert.deepEqual(detail('build-staffs').problems.filter((tip) => !guideModule.originsTips.includes(tip)), []);
});

test('every step has a Step details section, in the same order, and links to it', () => {
  assert.deepEqual(details.map((item) => item.id), steps.map((item) => item.id));
  steps.forEach((item, i) => {
    assert(item.links.some((link) => link.to === '/maps/origins/step-details' && link.section === `step-${i + 1}`), `${item.id} links to #step-${i + 1}`);
  });
});

test('no staff mechanics in the Main Guide outside the staff tabs', () => {
  const outside = guideStrings({ steps: steps.map(({ refs, ...rest }) => ({ ...rest, refs: refs?.filter((ref) => ref.type !== 'tabs') })) }).join('\n');
  for (const word of [/\brecords?\b/i, /crystal/i, /gramophone/i, /\bpuzzle\b/i, /\bchords?\b/i, /\bswitch(es)?\b/i, /excavation rings?/i, /\borb\b/i]) {
    assert.doesNotMatch(outside, word, `Main Guide mentions ${word} in the Main Guide`);
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
