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

    // A Gorod run already on step 2.
    await page.goto(`${base}/maps/gorod-krovi`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: 'Mark step done' }).click();

    // Header icon → search page → "gorod valves" + Enter.
    await page.getByRole('link', { name: 'Search' }).click();
    await page.waitForURL('**/search');
    await page.getByRole('searchbox').fill('gorod valves');
    assert.match(await page.locator('.zh-search__results li').first().innerText(), /Valve Solver/);
    await page.getByRole('searchbox').press('Enter');
    await page.waitForURL('**/maps/gorod-krovi?ref=valves');
    const sheet = page.locator('.guide-sheet');
    await sheet.getByRole('heading', { name: 'Valve Solver' }).waitFor();
    assert.equal(await sheet.locator('.gorod-valve-fields select').count(), 2, 'the solver itself is in the sheet');
    await page.keyboard.press('Escape');
    await page.waitForURL((url) => !url.search.includes('ref='));
    assert.equal(await page.locator('.guide-step h3').innerText(), 'Power + Dragon Network', 'search did not move the run');
    results.push(`${viewport.width}: "gorod valves" opens the solver, run untouched`);

    // Home search box: other maps, player phrasing.
    for (const [query, map, heading] of [
      ['ice staff code', '/maps/origins?ref=build-staffs', 'Staff build codes'],
      ['mob plane parts', '/maps/mob-of-the-dead?ref=plane', 'Plane parts'],
      ['DE wisps', '/maps/der-eisendrache?ref=first-wisps', 'First wisp cycle'],
    ]) {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.locator('.home-search').getByRole('searchbox').fill(query);
      await page.locator('.home-search .zh-search__results a').first().click();
      await page.waitForURL(`**${map}`);
      await page.locator('.guide-sheet').getByRole('heading', { name: heading }).waitFor();
      results.push(`${viewport.width}: "${query}" → ${heading}`);
    }

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
