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

const assertHeaderArtLoaded = async (page, route) => {
  const background = await page.locator('.gorod-header').evaluate(element => getComputedStyle(element).backgroundImage);
  const match = background.match(/url\(["']?(.+?)["']?\)/);
  assert(match?.[1], `${route} has no Gorod header image URL`);
  const loaded = await page.evaluate(src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  }), match[1]);
  assert(loaded, `${route} failed to load Gorod header artwork`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const mainRoute = '/maps/gorod-krovi';
    let response = await page.goto(`${base}${mainRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${mainRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Love and War', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    const mainText = await page.locator('.gorod-main-guide').innerText();
    assert.match(mainText, /Group 935 keycard lockdown/i);
    assert.doesNotMatch(mainText, /motherboard/i);
    await assertHeaderArtLoaded(page, mainRoute);
    await assertNoHorizontalOverflow(page, mainRoute);
    results.push({ width, route: mainRoute, passed: true });

    errors.length = 0;
    const trophyRoute = '/maps/gorod-krovi/trophies';
    response = await page.goto(`${base}${trophyRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${trophyRoute} returned ${response?.status()}`);
    await page.locator('.zh-guide-title', { hasText: 'Trophies + S.O.P.H.I.A. Challenges' }).first().waitFor();
    assert.equal(errors.length, 0, `${trophyRoute} page errors: ${errors.join('; ')}`);
    let text = await page.locator('.gorod-trophies-page').innerText();
    assert.match(text, /Operations Bunker safe/i);
    assert.match(text, /Whelp/i);
    assert.match(text, /heavy-melee|punch/i);

    const challengesTab = page.getByRole('tab', { name: 'S.O.P.H.I.A. Challenges' });
    await challengesTab.click();
    assert.equal(await challengesTab.getAttribute('aria-selected'), 'true', 'Gorod challenge reference tab activates');
    text = await page.locator('.gorod-trophies-page').innerText();
    assert.match(text, /Group 935 Challenge/i);
    assert.match(text, /keycard/i);
    assert.doesNotMatch(text, /motherboard/i);
    await assertNoHorizontalOverflow(page, trophyRoute);
    results.push({ width, route: trophyRoute, interaction: 'trophy/challenge tab', passed: true });

    const focusedRoutes = [
      { route: '/maps/gorod-krovi/buildables', selector: '.gorod-buildables-page', heading: 'Buildables + Gear', required: [/Dragon Shield/i, /Gauntlet of Siegfried/i] },
      { route: '/maps/gorod-krovi/boss', selector: '.gorod-boss-page', heading: 'Dragon + Nikolai', required: [/Ray Gun Mark 3/i, /In Plain Sight/i] },
    ];

    for (const guide of focusedRoutes) {
      errors.length = 0;
      response = await page.goto(`${base}${guide.route}`, { waitUntil: 'domcontentloaded' });
      assert(response?.ok(), `${guide.route} returned ${response?.status()}`);
      await page.getByRole('heading', { name: guide.heading, level: 2 }).waitFor();
      assert.equal(errors.length, 0, `${guide.route} page errors: ${errors.join('; ')}`);
      text = await page.locator(guide.selector).innerText();
      for (const required of guide.required) assert.match(text, required, `${guide.route} is missing ${required}`);
      await assertNoHorizontalOverflow(page, guide.route);
      results.push({ width, route: guide.route, passed: true });
    }

    errors.length = 0;
    const badRoute = '/maps/gorod-krovi/not-a-guide';
    response = await page.goto(`${base}${badRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${badRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Gorod catch-all renders shared NotFound');
    assert.equal(errors.length, 0, `${badRoute} page errors: ${errors.join('; ')}`);
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
console.log(`${results.length}/${results.length} Gorod browser health checks passed.`);
