import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
/*
 * Every Easter Egg guide is one plain sequence: every step on the page, in order, with its anchor, every
 * task fact as text, and none of the old run machinery (modes, progress, Mark done, swipe rail, Quick refs).
 */
import assert from 'node:assert/strict';
import { mainSteps } from './smoke-contract.mjs';
import { settled } from './smoke-helpers.mjs';
import { chromium } from 'playwright';
import { loadGuides } from './guide-content.mjs';
import { VIEWPORTS } from './smoke-viewports.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const guides = await loadGuides();
const MACHINERY_SELECTORS = '.guide-mode, .guide-progress, .guide-actions, .guide-rail, .guide-tasks button, .guide-menu, .guide-finish, .guide-quickrefs';
const MACHINERY_TEXT = ['Mark step done', 'Walkthrough', 'Quick refs', 'Track it', 'Progress options', 'SWIPE', 'Swipe', '???'];
const results = [];


const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // Origins has its own run sheet (origins-browser-smoke.mjs); every other guide is a plain sequence,
    // or (Revelations) a step picker that shows the same sequence one step at a time.
    // A flat main guide (FlatGuide) lists the same steps; its titles carry a screen-reader "Step N:" prefix.
    const readSteps = () => page.locator('li.guide-seq__step, li.flat-guide__step').evaluateAll((items) => items.map((item) => {
      const title = item.querySelector('h2, h3')?.cloneNode(true);
      title?.querySelector('.flat-guide__sr')?.remove();
      return { id: item.id, title: title?.textContent.trim() };
    }));
    const readText = async () => (await page.locator('section.guide, .flat-guide').first().textContent()).replace(/\s+/g, ' ');
    for (const { guide, route, steps } of guides.filter((entry) => !['origins', 'revelations'].includes(entry.guide))) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const picks = page.locator('[data-step-tabs] [role="tab"]');
      const rendered = [];
      let guideText = '';
      if (await picks.count()) {
        for (let index = 0; index < await picks.count(); index += 1) {
          await picks.nth(index).click();
          await page.locator(`[role="tabpanel"][aria-labelledby="${await picks.nth(index).getAttribute('id')}"]`).waitFor();
          rendered.push(...await readSteps());
          guideText += ` ${await readText()}`;
        }
      } else {
        rendered.push(...await readSteps());
        guideText = await readText();
      }
      assert.deepEqual(rendered.map((item) => item.id), steps.map((step) => step.id), `${route}: every step renders in data order with its anchor`);
      assert.deepEqual(rendered.map((item) => item.title), steps.map((step) => step.title), `${route}: step titles match the guide data`);

      // A flat guide shows only number, title and one line; its tasks moved to the tabs (content smoke checks them).
      const flat = await page.locator('.flat-guide').count() > 0;
      const missingTasks = flat ? [] : steps.flatMap((step) => (step.tasks ?? []).flatMap((task) => [task.label, task.hint]))
        .filter(Boolean)
        .filter((text) => !guideText.includes(text.replace(/\s+/g, ' ')));
      assert.deepEqual(missingTasks, [], `${route}: every task label and hint is on the page`);

      assert.equal(await page.locator(MACHINERY_SELECTORS).count(), 0, `${route}: no guide machinery remains`);
      const leftover = MACHINERY_TEXT.filter((text) => guideText.includes(text));
      assert.deepEqual(leftover, [], `${route}: no guide machinery text remains`);

      const duplicateIds = await page.evaluate((ids) => ids.filter((id) => document.querySelectorAll(`[id="${id}"]`).length > 1), steps.map((step) => step.id));
      assert.deepEqual(duplicateIds, [], `${route}: no element id collides with a step id`);
      results.push(`${name}: ${guide} — ${steps.length} steps in order, tasks as text, no machinery`);
    }

    // Links the old Quick refs sheet carried that no map nav covers: each map's Side Easter Egg video.
    for (const [route, href] of [['/maps/gorod-krovi', '/side-easter-eggs/gk'], ['/maps/der-eisendrache', '/side-easter-eggs/de'], ['/maps/shadows-of-evil', '/side-easter-eggs/soe']]) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.equal(await page.locator(`:is(section.guide, .flat-guide) a[href="${href}"]`).count(), 1, `${route}: guide links to its Side Easter Egg video (${href})`);
    }
    results.push(`${name}: Gorod, DE and Shadows guides link to their Side Easter Egg videos`);

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();

    // The OG Origins guide has no step anchors; a cold load of it still works with any #fragment.
    const cold = await browser.newContext({ viewport: { width, height } });
    const coldPage = await cold.newPage();
    // A mistyped or truncated link (#100%) must not take the guide down.
    const brokenErrors = [];
    coldPage.on('pageerror', (error) => brokenErrors.push(error.message));
    await coldPage.goto(`${base}/maps/origins#100%`, { waitUntil: 'networkidle' });
    await mainSteps(coldPage).first().waitFor();
    assert.equal(await mainSteps(coldPage).count(), 11, `${name}: guide still renders with a malformed #fragment`);
    assert.deepEqual(brokenErrors, [], `${name}: malformed #fragment errors: ${brokenErrors.join('; ')}`);
    results.push(`${name}: malformed #fragment is harmless`);
    await cold.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} guide sequence checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
