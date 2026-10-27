import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const out = new URL('../artifacts/browser-smoke.json', import.meta.url);
const widths = [390, 1440];
const routes = [
  '/',
  '/allmaps',
  '/maps/origins',
  '/maps/mob-of-the-dead',
  '/maps/der-eisendrache',
  '/maps/zetsubou-no-shima',
  '/maps/gorod-krovi',
  '/maps/revelations',
];
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${route} returned ${response?.status()}`);
      assert.equal(errors.length, 0, `${route} page errors: ${errors.join('; ')}`);
      results.push({ width, route, passed: true });
    }
    // Interactions use app state, not live third-party video playback.
    await page.goto(`${base}/allmaps`);
    await page.getByRole('searchbox').fill('Origins');
    assert((await page.locator('.map-card').count()) > 0);
    assert((await page.locator('.map-card').allTextContents()).every(text => text.includes('Origins')));
    await page.getByRole('searchbox').fill('no-map-can-match-this');
    await page.getByText(/No maps matched/).waitFor();

    // Origins is a core guide and should retain working map-specific navigation.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const originsLinks = page.locator('a[href^="/maps/origins/"]');
    assert((await originsLinks.count()) > 0, 'Origins exposes at least one guide navigation link');
    const originsTarget = await originsLinks.first().getAttribute('href');
    assert(originsTarget, 'Origins guide link has a destination');
    await originsLinks.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, originsTarget, 'Origins guide navigation reaches its intended route');

    await page.goto(`${base}/maps/revelations/apothicon-upgrade`);
    await page.locator('.sk-button').nth(1).click();
    const fallback = page.getByRole('link', { name: 'Watch the selected timestamp on YouTube' });
    assert.match(await fallback.getAttribute('href'), /&t=[1-9]\d*s$/);

    // Gorod's valve solver is a gameplay-critical interactive tool. Keep its
    // randomized-puzzle flow covered at both mobile and desktop widths.
    await page.goto(`${base}/maps/gorod-krovi/valves`, { waitUntil: 'networkidle' });
    const selects = page.locator('.gorod-valve-fields select');
    await selects.first().waitFor();
    assert.equal(await selects.count(), 2, 'valve solver exposes both required inputs');
    await selects.nth(0).selectOption({ label: 'Armory' });
    await selects.nth(1).selectOption({ label: 'Department Store' });
    const solution = page.locator('.gorod-valve-solution');
    await solution.waitFor();
    assert.match(await solution.textContent(), /Armory\s*→\s*Department Store/);
    assert((await page.locator('.gorod-valve-setting').count()) > 0, 'known valve route renders stored settings');
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByText('Select both locations.').waitFor();
    assert.equal(await selects.nth(0).inputValue(), '');
    assert.equal(await selects.nth(1).inputValue(), '');

    results.push({ width, interactions: 'map search, empty state, Origins guide navigation, video timestamp fallback, Gorod valve solver solution/reset', passed: true });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
await fs.writeFile(out, JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.passed);
console.log(`${results.length - failed.length}/${results.length} browser route checks passed.`);
for (const f of failed) console.error(`${f.width}px ${f.route}: ${f.error}`);
if (failed.length) process.exitCode = 1;