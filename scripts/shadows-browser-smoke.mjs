import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const reportUrl = new URL('../artifacts/browser-smoke.json', import.meta.url);
const widths = [390, 1440];
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(scrollWidth <= clientWidth + 1, `${route} overflows horizontally: ${scrollWidth}px > ${clientWidth}px`);
};

const assertImagesLoaded = async (page, route) => {
  const broken = await page.locator('.shadows-module img').evaluateAll(images =>
    images.filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.getAttribute('src') || 'unnamed image'),
  );
  assert.deepEqual(broken, [], `${route} has broken images: ${broken.join(', ')}`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const route = '/maps/shadows-of-evil';
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert(response?.ok(), `${route} returned ${response?.status()}`);
    assert.equal(errors.length, 0, `${route} page errors: ${errors.join('; ')}`);
    await page.getByRole('heading', { name: 'Shadows of Evil', level: 2 }).waitFor();
    await page.locator('details').evaluateAll(details => details.forEach(detail => { detail.open = true; }));
    const text = await page.locator('.soe-page__content').innerText();
    assert.match(text, /Waterfront\s*→\s*Footlight/i);
    assert.match(text, /Footlight\s*→\s*Canals/i);
    assert.match(text, /train caller/i);
    assert.match(text, /fourth player waits near the center Gateworm/i);
    assert.match(text, /full ending require four players/i);
    await assertImagesLoaded(page, route);
    await assertNoHorizontalOverflow(page, route);
    results.push({ width, route, passed: true });

    errors.length = 0;
    const badRoute = '/maps/shadows-of-evil/not-a-guide';
    const badResponse = await page.goto(`${base}${badRoute}`, { waitUntil: 'networkidle' });
    assert(badResponse?.ok(), `${badRoute} returned ${badResponse?.status()}`);
    assert.equal(errors.length, 0, `${badRoute} page errors: ${errors.join('; ')}`);
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Shadows catch-all renders the shared NotFound state');
    await assertNoHorizontalOverflow(page, badRoute);
    results.push({ width, route: badRoute, passed: true });

    await context.close();
  }
} finally {
  await browser.close();
}

let existing = [];
try {
  existing = JSON.parse(await fs.readFile(reportUrl, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await fs.writeFile(reportUrl, JSON.stringify([...existing, ...results], null, 2));
console.log(`${results.length}/${results.length} Shadows browser health checks passed.`);
