import { chromium } from 'playwright';
import { stepDetails } from './smoke-helpers.mjs';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const reportUrl = new URL('../artifacts/browser-smoke.json', import.meta.url);
import { VIEWPORTS } from './smoke-viewports.mjs';
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(scrollWidth <= clientWidth + 1, `${route} overflows horizontally: ${scrollWidth}px > ${clientWidth}px`);
};

const assertImagesLoaded = async (page, route) => {
  // Lazy images, and the closed full-screen copies that only load when opened, are told to load now:
  // this looks for broken images, not ones that are simply off screen.
  const broken = await page.locator('.shadows-module img').evaluateAll(async images => {
    await Promise.all(images.map(image => { image.loading = 'eager'; return image.decode().catch(() => {}); }));
    return images.filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.getAttribute('src') || 'unnamed image');
  });
  assert.deepEqual(broken, [], `${route} has broken images: ${broken.join(', ')}`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const route = '/maps/shadows-of-evil';
    const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert(response?.ok(), `${route} returned ${response?.status()}`);
    assert.equal(errors.length, 0, `${route} page errors: ${errors.join('; ')}`);
    // Flat main guide: no Easter Egg heading on the list; the name stays in the map header.
    await page.locator('li.flat-guide__step').first().waitFor();
    assert.match(await page.locator('body').innerText(), /Shadows of Evil/, 'the Easter Egg name is still on the page');
    await page.evaluate(() => {
      ['zh-guide-progress:shadows-of-evil', 'zh-soe-train-symbols', 'zh-soe-character'].forEach((key) => localStorage.removeItem(key));
    });
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('li.guide-seq__step, li.flat-guide__step').count(), 7, 'Shadows guide should list 7 steps');

    // Flat main guide: the detail and the per-game tools live on the Step details tab.
    const ritualsDetails = await stepDetails(page, base, route, 'rituals');
    assert.match(await page.locator('body').innerText(), /full ending require four players/i);
    // Step 1: the train rides that give the sword symbols, and a notepad for them that persists.
    let text = await ritualsDetails.innerText();
    assert.match(text, /Waterfront\s*→\s*Footlight/i);
    assert.match(text, /Footlight\s*→\s*Canals/i);
    await ritualsDetails.getByLabel('Symbol 1').fill('eye');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await (await stepDetails(page, base, route, 'rituals')).getByLabel('Symbol 1').inputValue(), 'eye', 'train symbol note survives a reload');

    // Step 4: pick your character, get your Keeper room.
    const upgrade = await stepDetails(page, base, route, 'upgrade');
    await upgrade.getByRole('button', { name: 'Jackie Vincent' }).click();
    assert.match(await upgrade.locator('.pick-tool__answer').innerText(), /Ruby Rabbit/);

    // Finale: team setup and the train-caller rule are on the step; the full how-to is under "More on this step".
    text = await (await stepDetails(page, base, route, 'finale')).innerText();
    assert.match(text, /Team setup/i);
    assert.match(text, /train caller/i);
    assert.match(text, /fourth player waits near the center Gateworm/i);
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    assert.equal(errors.length, 0, `${route} guide errors: ${errors.join('; ')}`);
    await assertImagesLoaded(page, route);
    await assertNoHorizontalOverflow(page, route);
    results.push({ width, route, passed: true });

    // If storage becomes read-only after a saved game, the visible tools must prefer the player's
    // newest session choice over the older persisted value.
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      localStorage.setItem('zh-soe-train-symbols', JSON.stringify(['stale', '', '']));
      localStorage.setItem('zh-soe-character', JSON.stringify('floyd'));
    });
    await page.goto(`${base}${route}/step-details`, { waitUntil: 'networkidle' });
    const blockedRituals = await stepDetails(page, base, route, 'rituals');
    assert.equal(await blockedRituals.getByLabel('Symbol 1').inputValue(), 'stale', 'stored note loads before storage becomes read-only');
    await page.evaluate(() => {
      Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    });
    await blockedRituals.getByLabel('Symbol 1').fill('eye');
    assert.equal(await blockedRituals.getByLabel('Symbol 1').inputValue(), 'eye', 'blocked storage keeps the latest note for this session');

    const blockedUpgrade = await stepDetails(page, base, route, 'upgrade');
    await blockedUpgrade.getByRole('button', { name: 'Jackie Vincent' }).click();
    assert.match(await blockedUpgrade.locator('.pick-tool__answer').innerText(), /Ruby Rabbit/, 'blocked storage keeps the latest picker choice for this session');
    results.push({ width, route: `${route} (blocked storage tools)`, passed: true });

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
