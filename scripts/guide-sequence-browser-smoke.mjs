/*
 * Every Easter Egg guide is one plain sequence: every step on the page, in order, with its anchor, every
 * task fact as text, and none of the old run machinery (modes, progress, Mark done, swipe rail, Quick refs).
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { loadGuides } from './guide-content.mjs';
import { VIEWPORTS } from './smoke-viewports.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const guides = await loadGuides();
const MACHINERY_SELECTORS = '.guide-mode, .guide-progress, .guide-actions, .guide-rail, .guide-tasks button, .guide-menu, .guide-finish, .guide-quickrefs';
const MACHINERY_TEXT = ['Mark step done', 'Walkthrough', 'Quick refs', 'Track it', 'Progress options', 'SWIPE', 'Swipe', '???'];
const results = [];

const tabFacts = (tab) => (tab.refs ?? []).flatMap((ref) => (ref.type === 'facts' ? ref.items.map((item) => item.v) : []));

const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    for (const { guide, route, steps } of guides) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const rendered = await page.locator('li.guide-seq__step').evaluateAll((items) => items.map((item) => ({
        id: item.id,
        title: item.querySelector('h3')?.textContent.trim(),
      })));
      assert.deepEqual(rendered.map((item) => item.id), steps.map((step) => step.id), `${route}: every step renders in data order with its anchor`);
      assert.deepEqual(rendered.map((item) => item.title), steps.map((step) => step.title), `${route}: step titles match the guide data`);

      const guideText = (await page.locator('section.guide').textContent()).replace(/\s+/g, ' ');
      const missingTasks = steps.flatMap((step) => (step.tasks ?? []).flatMap((task) => [task.label, task.hint]))
        .filter(Boolean)
        .filter((text) => !guideText.includes(text.replace(/\s+/g, ' ')));
      assert.deepEqual(missingTasks, [], `${route}: every task label and hint is on the page`);

      assert.equal(await page.locator(MACHINERY_SELECTORS).count(), 0, `${route}: no guide machinery remains`);
      const leftover = MACHINERY_TEXT.filter((text) => guideText.includes(text));
      assert.deepEqual(leftover, [], `${route}: no guide machinery text remains`);

      const duplicateIds = await page.evaluate((ids) => ids.filter((id) => document.querySelectorAll(`[id="${id}"]`).length !== 1), steps.map((step) => step.id));
      assert.deepEqual(duplicateIds, [], `${route}: no element id collides with a step id`);
      results.push(`${name}: ${guide} — ${steps.length} steps in order, tasks as text, no machinery`);
    }

    // Tabs stay reachable: every staff tab in "Build the four staffs" shows its own facts.
    const origins = guides.find((entry) => entry.guide === 'origins');
    const buildStep = origins.steps.find((step) => step.id === 'build-staffs');
    const tabsRef = buildStep.refs.find((ref) => ref.type === 'tabs');
    await page.goto(`${base}/maps/origins#build-staffs`, { waitUntil: 'networkidle' });
    const step = page.locator('#build-staffs');
    for (const tab of tabsRef.tabs) {
      await step.getByRole('tab', { name: tab.label, exact: true }).click();
      const panel = (await step.locator('[role="tabpanel"]').first().textContent()).replace(/\s+/g, ' ');
      for (const fact of tabFacts(tab)) assert(panel.includes(fact), `Origins ${tab.label} tab shows "${fact}"`);
    }
    results.push(`${name}: Origins staff tabs all reachable with their facts`);
    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();

    // A cold deep link lands on the step, below the fixed hub header, even though the map chunk loads lazily.
    const cold = await browser.newContext({ viewport: { width, height } });
    const coldPage = await cold.newPage();
    await coldPage.goto(`${base}/maps/origins#upgrade-staffs`, { waitUntil: 'networkidle' });
    await coldPage.waitForTimeout(150);
    const position = await coldPage.evaluate(() => {
      const target = document.getElementById('upgrade-staffs').getBoundingClientRect();
      const header = document.querySelector('.hub-header').getBoundingClientRect();
      const pinned = ['fixed', 'sticky'].includes(getComputedStyle(document.querySelector('.hub-header')).position);
      return { top: target.top, headerBottom: pinned ? header.bottom : 0, viewport: window.innerHeight };
    });
    assert(position.top >= position.headerBottom - 1, `${name}: deep-linked step sits below the hub header (${Math.round(position.top)} < ${Math.round(position.headerBottom)})`);
    assert(position.top < position.viewport * 0.4, `${name}: deep-linked step is near the top (${Math.round(position.top)}px of ${position.viewport}px)`);
    results.push(`${name}: cold #upgrade-staffs link lands on the step`);
    await cold.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} guide sequence checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
