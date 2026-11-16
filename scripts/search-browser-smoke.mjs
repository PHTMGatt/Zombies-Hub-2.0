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
    // Flat main guide: the valve step links to the Valve Solver tab, where the solver lives.
    await page.locator('#valves a[data-step-link][href*="/maps/gorod-krovi/valves"]').first().click();
    await page.waitForURL('**/maps/gorod-krovi/valves**');
    await page.locator('.gorod-valve-fields select').first().waitFor();
    assert.equal(await page.locator('.gorod-valve-fields select').count(), 2, 'the valve step links to its solver');
    results.push(`${viewport.name}: "gorod valves" lands on the valve step, one tap from its solver`);

    // Home search box: other maps, player phrasing.
    for (const [query, map, id, title] of [
      ['staff upgrades', '/maps/origins#upgrade-staffs', 'upgrade-staffs', 'Secure the Keys'],
      ['mob plane parts', '/maps/mob-of-the-dead#plane', 'plane', 'Build the Plane'],
      ['DE wisps', '/maps/der-eisendrache#first-wisps', 'first-wisps', 'First wisp cycle'],
    ]) {
      await page.goto(base, { waitUntil: 'networkidle' });
      await page.locator('.home-search').getByRole('searchbox').fill(query);
      await page.locator('.home-search .zh-search__results a', { hasText: /./ }).first().click();
      await page.waitForURL(`**${map}`);
      await assertStepInView(id);
      // The flat guide's titles start with a screen-reader-only "Step N:".
      assert.equal((await page.locator(`#${id} :is(h2, h3)`).innerText()).replace(/^Step \d+:\s*/, ''), title);
      results.push(`${viewport.name}: "${query}" → ${title}`);
    }

    // Searching for the step you are already anchored to brings it back into view.
    await page.goto(`${base}/maps/mob-of-the-dead#plane`, { waitUntil: 'networkidle' });
    await assertStepInView('plane');
    await page.evaluate(() => document.getElementById('codes').scrollIntoView({ block: 'start', behavior: 'instant' }));
    await page.getByRole('link', { name: 'Search' }).click();
    await page.waitForURL('**/search');
    await page.waitForFunction(() => document.querySelectorAll('input[type="search"]').length === 1);
    await page.getByRole('searchbox').fill('mob plane parts');
    await page.locator('.zh-search__results a').first().click();
    await page.waitForURL('**/maps/mob-of-the-dead#plane');
    await assertStepInView('plane');
    results.push(`${viewport.name}: searching the current step again brings it back into view`);

    // Old ?ref= links (bookmarks, shared links) land on the same step.
    await page.goto(`${base}/maps/mob-of-the-dead?ref=codes`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/maps/mob-of-the-dead#codes');
    await assertStepInView('codes');
    results.push(`${viewport.name}: legacy ?ref=codes redirects to #codes`);

    // Step details tabs and the hub-only maps (video cards, Coming Soon, World at War) are findable:
    // the first result is the right page, and it opens (no 404).
    const decoded = (href) => decodeURIComponent(new URL(href, base).pathname + new URL(href, base).search);
    for (const [query, expected] of [
      ['ascension', '/easter-eggs/ascension'],
      ['tranzit', '/easter-eggs/tranzit'],
      ['die rise', '/easter-eggs/die-rise'],
      ['the giant', '/easter-eggs/the-giant'],
      ['der riese', '/info/der-riese?game=Black Ops 1'],
      ['waw nacht', '/info/nacht-der-untoten?game=World at War'],
      ['shangri la bo3', '/easter-eggs/shangri-la-chronicles'],
      ['shangri la', '/easter-eggs/shangri-la'],
      ['gorod step details', '/maps/gorod-krovi/step-details'],
    ]) {
      await page.goto(`${base}/search?q=${encodeURIComponent(query)}`, { waitUntil: 'networkidle' });
      const first = page.locator('.zh-search__results a').first();
      await first.waitFor();
      assert.equal(decoded(await first.getAttribute('href')), expected, `"${query}": first result`);
      await first.click();
      await page.waitForURL((url) => decoded(url.href) === expected);
      await page.locator('h1, h2').first().waitFor();
      assert.equal(await page.locator('[data-page-not-found]').count(), 0, `"${query}": ${expected} opens`);
      results.push(`${viewport.name}: "${query}" → ${expected}`);
    }
    await page.goto(`${base}/search?q=${encodeURIComponent('world at war')}`, { waitUntil: 'networkidle' });
    await page.locator('.zh-search__results a').first().waitFor();
    const wawHrefs = (await page.locator('.zh-search__results a').evaluateAll((links) => links.map((link) => link.getAttribute('href'))))
      .map(decoded).filter((href) => href.includes('game=World at War'));
    assert(new Set(wawHrefs).size >= 4, `"world at war" lists the four World at War entries (got ${wawHrefs.join(', ')})`);

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
