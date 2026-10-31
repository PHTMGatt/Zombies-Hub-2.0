import { VIEWPORTS } from './smoke-viewports.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

/*
 * Search in player language: typed queries reach the right reference, guide references open in the map's
 * Quick refs sheet without moving the run, and closing the sheet leaves a clean URL.
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const results = [];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // The hub bar must be exactly the height every page reserves for it, or page tops hide beneath it.
    await page.goto(base, { waitUntil: 'networkidle' });
    const bar = await page.evaluate(() => ({
      height: Math.round(document.querySelector('.hub-header').getBoundingClientRect().height),
      reserved: parseFloat(getComputedStyle(document.documentElement).getPropertyValue('--hub-nav-height')),
    }));
    assert.equal(bar.height, bar.reserved, `hub bar is ${bar.height}px but pages reserve ${bar.reserved}px`);

    // A search result for a guide step lands on that step (#step-id), visible and below the hub bar.
    const assertStepInView = async (id) => {
      await page.waitForFunction((stepId) => {
        const step = document.getElementById(stepId);
        if (!step) return false;
        const top = step.getBoundingClientRect().top;
        return top >= 0 && top < window.innerHeight * 0.5;
      }, id, { timeout: 5000 }).catch(() => assert.fail(`#${id} is not in view after search`));
    };

    // Header icon → search page → "gorod valves" + Enter → the valve step, with its solver. Start on a page
    // without its own search box (Home has one), so typing can only reach the search page's box.
    await page.goto(`${base}/maps/gorod-krovi`, { waitUntil: 'networkidle' });
    await page.getByRole('link', { name: 'Search' }).click();
    await page.waitForURL('**/search');
    await page.waitForFunction(() => document.querySelectorAll('input[type="search"]').length === 1);
    await page.getByRole('searchbox').fill('gorod valves');
    assert.match(await page.locator('.zh-search__results li').first().innerText(), /Valve Solver/);
    await page.getByRole('searchbox').press('Enter');
    await page.waitForURL('**/maps/gorod-krovi#valves');
    await assertStepInView('valves');
    assert.equal(await page.locator('#valves .gorod-valve-fields select').count(), 2, 'the solver is in the valve step');
    results.push(`${viewport.name}: "gorod valves" lands on the valve step with its solver`);

    // Home search box: other maps, player phrasing.
    for (const [query, map, id, title] of [
      ['ice staff code', '/maps/origins#build-staffs', 'build-staffs', 'Build the four staffs'],
      ['staff upgrades', '/maps/origins#upgrade-staffs', 'upgrade-staffs', 'Upgrade the staffs'],
      ['mob plane parts', '/maps/mob-of-the-dead#plane', 'plane', 'Build the Plane'],
      ['DE wisps', '/maps/der-eisendrache#first-wisps', 'first-wisps', 'First wisp cycle'],
    ]) {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.locator('.home-search').getByRole('searchbox').fill(query);
      await page.locator('.home-search .zh-search__results a', { hasText: /./ }).first().click();
      await page.waitForURL(`**${map}`);
      await assertStepInView(id);
      assert.equal(await page.locator(`#${id} h3`).innerText(), title);
      results.push(`${viewport.name}: "${query}" → ${title}`);
    }

    // Old ?ref= links (bookmarks, shared links) land on the same step.
    await page.goto(`${base}/maps/mob-of-the-dead?ref=codes`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/maps/mob-of-the-dead#codes');
    await assertStepInView('codes');
    results.push(`${viewport.name}: legacy ?ref=codes redirects to #codes`);

    // Unknown words say so instead of showing junk.
    await page.goto(`${base}/search?q=zzqx`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('.zh-search__empty').innerText(), /Nothing matches/);
    const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
    assert(scrollWidth <= clientWidth + 1, 'search page has no horizontal overflow');

    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} search checks passed:\n- ${results.join('\n- ')}`);
