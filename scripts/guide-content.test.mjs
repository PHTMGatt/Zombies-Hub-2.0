import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { BASELINE_PATH, REMOVALS_PATH, guideStrings, guideTabs, loadGuides } from './guide-content.mjs';

// Content captured before the guide redesign; presentation work must never drop any of it.
const baseline = JSON.parse(readFileSync(BASELINE_PATH, 'utf8'));
const approvedDataRemovals = new Set(
  JSON.parse(readFileSync(REMOVALS_PATH, 'utf8')).filter((entry) => entry.layer === 'data').map((entry) => entry.text),
);
const guides = await loadGuides();

test('every baseline guide string is still in the step data', () => {
  assert.deepEqual(guides.map((entry) => entry.guide).sort(), Object.keys(baseline).sort());
  for (const entry of guides) {
    const current = new Set(guideStrings(entry));
    const missing = baseline[entry.guide].strings.filter((text) => !current.has(text) && !approvedDataRemovals.has(text));
    assert.deepEqual(missing, [], `${entry.guide} lost guide content`);
  }
});

test('step ids are unique and anchor-safe', () => {
  for (const entry of guides) {
    const ids = entry.steps.map((step) => step.id);
    assert.equal(new Set(ids).size, ids.length, `${entry.guide} has duplicate step ids`);
    for (const id of ids) assert.match(id, /^[a-z0-9-]+$/, `${entry.guide} step id "${id}" is not anchor-safe`);
  }
});

test('step order matches the baseline', () => {
  for (const entry of guides) {
    assert.deepEqual(entry.steps.map((step) => step.id), baseline[entry.guide].ids, `${entry.guide} steps were reordered`);
  }
});

test('tabs keep every tab and its own problems/links', () => {
  for (const entry of guides) {
    const current = guideTabs(entry);
    for (const before of baseline[entry.guide].tabs) {
      const now = current.find((tabs) => tabs.step === before.step && tabs.tabIds.join() === before.tabIds.join());
      assert(now, `${entry.guide} step ${before.step} lost tabs ${before.tabIds.join(', ')}`);
      for (const [tabId, strings] of Object.entries(before.perTab)) {
        for (const text of strings) assert(now.perTab[tabId].includes(text), `${entry.guide} ${before.step}/${tabId} lost "${text}"`);
      }
    }
  }
});
