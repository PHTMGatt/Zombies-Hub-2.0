import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
import { VIEWPORTS } from './smoke-viewports.mjs';
import { chromium } from 'playwright';
import assert from 'node:assert/strict';

/*
 * Wrong addresses: every unknown path (hub pages, hub params, every map's catch-all) shows the shared
 * "Page not found" state with one h1 on the page, a "Page not found" title and a noindex tag (the host
 * answers every path with 200), and its way out works. Leaving it for a real page drops the noindex.
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const MAPS = ['origins', 'mob-of-the-dead', 'shadows-of-evil', 'der-eisendrache', 'zetsubou-no-shima', 'gorod-krovi', 'revelations'];
const PATHS = ['/no-such-page', '/maps/no-such-map', '/easter-eggs/no-such-egg', '/info/no-such-map', '/side-easter-eggs/no-such-map',
  ...MAPS.map((map) => `/maps/${map}/no-such-tab`)];
const results = [];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of VIEWPORTS) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    for (const route of PATHS) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const notFound = page.locator('[data-page-not-found]');
      await notFound.waitFor({ timeout: 10000 }).catch(() => assert.fail(`${route}: no Page not found state`));
      const state = await page.evaluate(() => ({
        title: document.title,
        h1s: document.querySelectorAll('h1').length,
        robots: [...document.querySelectorAll('meta[name="robots"]')].map((meta) => meta.content),
        overflow: document.documentElement.scrollWidth > document.documentElement.clientWidth + 1,
        routeError: Boolean(document.querySelector('[data-route-error]')),
      }));
      assert.equal(state.title, 'Page not found | Zombies Hub 2.0', `${route}: title`);
      assert.equal(state.h1s, 1, `${route}: one h1 on the page (got ${state.h1s})`);
      assert.deepEqual(state.robots, ['noindex'], `${route}: one noindex tag`);
      assert.equal(state.overflow, false, `${route}: no horizontal overflow`);
      assert.equal(state.routeError, false, `${route}: no load error`);
    }
    results.push(`${viewport.name}: ${PATHS.length} unknown paths show Page not found (one h1, noindex)`);

    // The way out lands on All Maps, and the noindex leaves with the 404.
    await page.goto(`${base}/no-such-page`, { waitUntil: 'networkidle' });
    await page.locator('[data-page-not-found]').getByRole('link', { name: 'Find a map' }).click();
    await page.waitForURL('**/allmaps');
    await page.locator('h1').first().waitFor();
    assert.equal(await page.locator('[data-page-not-found]').count(), 0, '/allmaps opens');
    assert.equal(await page.locator('meta[name="robots"]').count(), 0, 'a real page carries no noindex');
    assert.notEqual(await page.title(), 'Page not found | Zombies Hub 2.0', 'the title moves on');
    results.push(`${viewport.name}: "Find a map" opens All Maps and drops the noindex`);

    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} status page checks passed:\n- ${results.join('\n- ')}`);
