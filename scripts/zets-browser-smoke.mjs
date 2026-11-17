import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
import { chromium } from 'playwright';
import { stepDetails, visibleTitle } from './smoke-helpers.mjs';
import assert from 'node:assert/strict';
import { mainSteps } from './smoke-contract.mjs';
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

const assertCssImageLoaded = async (page, route, selector, pseudo = null) => {
  const background = await page.locator(selector).evaluate((element, pseudoElement) => getComputedStyle(element, pseudoElement).backgroundImage, pseudo);
  const match = background.match(/url\(["']?(.+?)["']?\)/);
  assert(match?.[1], `${route} has no artwork URL on ${selector}${pseudo || ''}`);
  const loaded = await page.evaluate(src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  }), match[1]);
  assert(loaded, `${route} failed to load artwork from ${selector}${pseudo || ''}`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const mainRoute = '/maps/zetsubou-no-shima';
    let response = await page.goto(`${base}${mainRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${mainRoute} returned ${response?.status()}`);
    // Flat main guide: no Easter Egg heading on the list; the name stays in the map header.
    await mainSteps(page).first().waitFor();
    assert.match(await page.locator('body').innerText(), /Seeds of Doubt/, 'the Easter Egg name is still on the page');
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    const mainText = await page.locator('.zets-main-guide').innerText();
    assert.match(mainText, /every player/i);
    assert.match(mainText, /all three.*Trials/i);
    await assertCssImageLoaded(page, mainRoute, '.zets-module');
    await assertCssImageLoaded(page, mainRoute, '.zets-header', '::before');
    await assertNoHorizontalOverflow(page, mainRoute);

    // One sequence: 11 steps, the Trials listed as facts on the first step, nothing to tick.
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await mainSteps(page).count(), 11, 'Zetsubou guide should list 11 steps');
    assert.equal(await visibleTitle(page.locator('#skulls :is(h2, h3)')), 'Clean the four skulls');
    // The Trials facts live on the Step details tab (flat main guide).
    const trialsText = await (await stepDetails(page, base, mainRoute, 'trials')).innerText();
    for (const trial of ['Trial 1', 'Trial 2', 'Trial 3']) assert.match(trialsText, new RegExp(trial), `Trials step details list ${trial}`);
    await page.goto(`${base}${mainRoute}`, { waitUntil: 'networkidle' });
    assert.equal(errors.length, 0, `${mainRoute} guide errors: ${errors.join('; ')}`);

    if (viewportName === 'phone') {
      // One tab bar on every map: on phones the Zetsubou tabs are a single scrolling row, always shown (no menu toggle).
      assert.equal(await page.getByRole('button', { name: 'Toggle Zetsubou guide navigation' }).isVisible(), false, 'no menu toggle on phones');
      assert(await page.locator('.zets-nav').isVisible(), 'Zetsubou tabs are visible on phones');
      await page.locator('.zets-nav').getByRole('link', { name: 'Prerequisites' }).click();
      await page.waitForURL('**/maps/zetsubou-no-shima/prerequisites');
    }
    results.push({ width, route: mainRoute, passed: true });

    const focusedRoutes = [
      {
        route: '/maps/zetsubou-no-shima/prerequisites',
        selector: '.zets-detail-page',
        heading: 'Setup Checklist',
        required: [/each player/i, /three challenge tablets/i],
      },
      {
        route: '/maps/zetsubou-no-shima/buildables',
        selector: '.zets-buildables-page',
        heading: 'Buildables + Wonder Weapon',
        required: [/Giant Spider fang/i, /every player/i, /Masamune/i],
        expandDetails: true,
      },
      {
        route: '/maps/zetsubou-no-shima/cogs',
        selector: '.zets-detail-page',
        heading: 'The Three Cogs',
        required: [/Blue Water/i, /every player/i],
      },
      {
        route: '/maps/zetsubou-no-shima/cogs/2',
        selector: '.zets-cog-detail-page',
        heading: 'AA Cannon Plane',
        required: [/Blue Water/i, /KT-4|Masamune/i, /each round/i, /three rounds/i],
      },
      {
        route: '/maps/zetsubou-no-shima/cogs/3',
        selector: '.zets-cog-detail-page',
        heading: 'Electrified Zipline Drop',
        required: [/every player/i, /all three.*Trials/i, /challenge lightning/i],
      },
      {
        route: '/maps/zetsubou-no-shima/elevator-battle',
        selector: '.zets-boss-page',
        heading: 'Elevator + Giant Thrasher',
        required: [/three cogs/i, /fresh Gas Mask/i, /Masamune/i, /four times/i],
      },
    ];

    for (const guide of focusedRoutes) {
      errors.length = 0;
      response = await page.goto(`${base}${guide.route}`, { waitUntil: 'domcontentloaded' });
      assert(response?.ok(), `${guide.route} returned ${response?.status()}`);
      await page.locator('.zh-guide-title', { hasText: guide.heading }).first().waitFor();
      assert.equal(errors.length, 0, `${guide.route} page errors: ${errors.join('; ')}`);
      if (guide.expandDetails) {
        await page.locator('details').evaluateAll(details => details.forEach(detail => { detail.open = true; }));
      }
      const text = await page.locator(guide.selector).innerText();
      for (const required of guide.required) assert.match(text, required, `${guide.route} is missing ${required}`);
      await assertNoHorizontalOverflow(page, guide.route);
      results.push({ width, route: guide.route, passed: true });
    }

    errors.length = 0;
    const badRoute = '/maps/zetsubou-no-shima/not-a-guide';
    response = await page.goto(`${base}${badRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${badRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Zetsubou catch-all renders shared NotFound');
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
console.log(`${results.length}/${results.length} Zetsubou browser health checks passed.`);
