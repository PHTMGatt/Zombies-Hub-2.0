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
    await page.evaluate(() => {
      ['zh-guide-progress:shadows-of-evil', 'zh-soe-train-symbols', 'zh-soe-character'].forEach((key) => localStorage.removeItem(key));
    });
    await page.reload({ waitUntil: 'networkidle' });
    assert.match(await page.locator('.soe-run-header').innerText(), /full ending require four players/i);
    assert.equal(await page.locator('.guide-rail__step').count(), 7, 'Shadows guide should list 7 steps');

    // Step 1: the train rides that give the sword symbols, and a notepad for them that persists.
    let text = await page.locator('.guide-step').innerText();
    assert.match(text, /Waterfront\s*→\s*Footlight/i);
    assert.match(text, /Footlight\s*→\s*Canals/i);
    await page.getByLabel('Symbol 1').fill('eye');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByLabel('Symbol 1').inputValue(), 'eye', 'train symbol note survives a reload');

    // Step 4: pick your character, get your Keeper room.
    await page.locator('.guide-rail__step').nth(3).click();
    await page.getByRole('button', { name: 'Jackie Vincent' }).click();
    assert.match(await page.locator('.pick-tool__answer').innerText(), /Ruby Rabbit/);

    // Finale: team setup and the train-caller rule are on the step; the full how-to is in Walkthrough.
    await page.locator('.guide-rail__step').nth(6).click();
    text = await page.locator('.guide-step').innerText();
    assert.match(text, /Team setup/i);
    assert.match(text, /train caller/i);
    await page.getByRole('button', { name: 'Walkthrough', exact: true }).click();
    assert.match(await page.locator('.guide-step').innerText(), /fourth player waits near the center Gateworm/i);
    await page.getByRole('button', { name: 'Quick', exact: true }).click();
    assert.equal(errors.length, 0, `${route} guide errors: ${errors.join('; ')}`);
    await assertImagesLoaded(page, route);
    await assertNoHorizontalOverflow(page, route);
    results.push({ width, route, passed: true });

    // Blocked storage must make run tools session-only, not unusable. Both the visible step and its
    // Quick refs copy should keep sharing the player's note / picker choice even when setItem throws.
    await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      Storage.prototype.setItem = () => { throw new DOMException('Storage blocked', 'SecurityError'); };
    });
    await page.getByLabel('Symbol 1').fill('eye');
    assert.equal(await page.getByLabel('Symbol 1').inputValue(), 'eye', 'blocked storage keeps the note for this session');
    await page.getByRole('button', { name: 'Quick refs' }).click();
    await page.getByRole('button', { name: /Train symbols \+ rituals/ }).click();
    assert.equal(await page.locator('.guide-sheet').getByLabel('Symbol 1').inputValue(), 'eye', 'blocked-storage note syncs into Quick refs');
    await page.keyboard.press('Escape');

    await page.locator('.guide-rail__step').nth(3).click();
    await page.getByRole('button', { name: 'Jackie Vincent' }).click();
    assert.match(await page.locator('.guide-step .pick-tool__answer').innerText(), /Ruby Rabbit/, 'blocked storage keeps the picker choice for this session');
    await page.getByRole('button', { name: 'Quick refs' }).click();
    await page.getByRole('button', { name: /Your Keeper \+ Margwa spots/ }).click();
    assert.match(await page.locator('.guide-sheet .pick-tool__answer').innerText(), /Ruby Rabbit/, 'blocked-storage picker syncs into Quick refs');
    await page.keyboard.press('Escape');
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
