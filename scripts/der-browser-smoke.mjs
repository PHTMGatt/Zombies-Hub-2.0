import { chromium } from 'playwright';
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

const assertHeaderArtLoaded = async (page, route) => {
  const background = await page.locator('.de-header__art').evaluate(element => getComputedStyle(element).backgroundImage);
  const match = background.match(/url\(["']?(.+?)["']?\)/);
  assert(match?.[1], `${route} has no Der header image URL`);
  const loaded = await page.evaluate(src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  }), match[1]);
  assert(loaded, `${route} failed to load Der header artwork`);
};

const bowGuides = [
  { route: '/maps/der-eisendrache/bows/base', heading: 'Base Bow', required: [/three dragons/i, /Wrath of the Ancients/i] },
  { route: '/maps/der-eisendrache/bows/electric', heading: 'Storm Bow', required: [/five wall symbols/i, /three urns/i] },
  { route: '/maps/der-eisendrache/bows/fire', heading: 'Fire Bow', required: [/four total shots/i, /fireplace/i] },
  { route: '/maps/der-eisendrache/bows/wolf', heading: 'Wolf Bow', required: [/mountain castle struck by lightning/i, /slain king/i] },
  { route: '/maps/der-eisendrache/bows/void', heading: 'Void Bow', required: [/six skulls/i, /Keeper name/i] },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const mainRoute = '/maps/der-eisendrache';
    let response = await page.goto(`${base}${mainRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${mainRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'My Brother’s Keeper', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    const mainText = await page.locator('.de-home-page').innerText();
    assert.match(mainText, /local\/offline/i);
    assert.match(mainText, /unranked/i);
    assert.match(mainText, /all four bows/i);
    await assertHeaderArtLoaded(page, mainRoute);
    assert.equal(await page.locator('.de-nav').count(), 1, 'Der Eisendrache keeps one map-level navigation row');
    assert.equal(await page.locator('.de-quick-links').count(), 0, 'Der Eisendrache duplicate bottom navigation stays removed');
    await assertNoHorizontalOverflow(page, mainRoute);

    // One sequence: 12 steps, how-to under "More", and the safe-code note shared by the two steps that need it.
    await page.evaluate(() => window.localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('li.guide-seq__step').count(), 12, 'Der guide keeps all 12 steps');
    assert.match(await page.locator('#past-lab-1 h3').innerText(), /Past lab/);
    await page.locator('#past-lab-1 .guide-seq__more > summary').click();
    assert.equal(await page.locator('#past-lab-1 .guide-how').count(), 1, '"More on this step" shows the how-to');
    await page.locator('#past-lab-1').getByLabel('Safe symbol 1').fill('Test');
    assert.match(await page.locator('#death-ray-safe h3').innerText(), /Death Ray/);
    // The second copy updates on the next render; wait for it rather than reading once.
    await page.waitForFunction(() => document.querySelector('#death-ray-safe input[aria-label="Safe symbol 1"]')?.value === 'Test', null, { timeout: 3000 })
      .catch(() => assert.fail('Safe code note carries to the terminal step'));
    await page.evaluate(() => window.localStorage.clear());
    results.push({ width, route: mainRoute, passed: true });

    errors.length = 0;
    const bowsRoute = '/maps/der-eisendrache/bows';
    response = await page.goto(`${base}${bowsRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${bowsRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Choose Your Bow', level: 2 }).waitFor();
    assert.equal(await page.locator('.bow-choice-card').count(), 5, 'Der bow landing keeps base + four upgrade cards');
    const bowLandingText = await page.locator('.bow-landing').innerText();
    assert.match(bowLandingText, /local\/offline/i);
    assert.match(bowLandingText, /all four bows/i);
    assert.equal(errors.length, 0, `${bowsRoute} page errors: ${errors.join('; ')}`);
    await assertNoHorizontalOverflow(page, bowsRoute);
    results.push({ width, route: bowsRoute, passed: true });

    for (const guide of bowGuides) {
      errors.length = 0;
      response = await page.goto(`${base}${guide.route}`, { waitUntil: 'domcontentloaded' });
      assert(response?.ok(), `${guide.route} returned ${response?.status()}`);
      await page.locator('.zh-guide-title', { hasText: guide.heading }).first().waitFor();
      assert.equal(errors.length, 0, `${guide.route} page errors: ${errors.join('; ')}`);
      const text = await page.locator('.de-bow-guide').innerText();
      for (const required of guide.required) assert.match(text, required, `${guide.route} is missing ${required}`);
      assert.equal(await page.locator('.de-bow-nav__link.is-active').count(), 1, `${guide.route} has one active bow tab`);
      await assertNoHorizontalOverflow(page, guide.route);
      results.push({ width, route: guide.route, passed: true });
    }

    const focusedRoutes = [
      { route: '/maps/der-eisendrache/wisps', selector: '.de-wisp-page', required: [/8 Possible Wisp Objects/i, /4 hits per cycle/i, /Second Trip/i] },
      { route: '/maps/der-eisendrache/parts', selector: '.de-parts-page', required: [/Shield \+ Ragnarok DG-4/i, /Rocket Test Part/i, /Required for boss entry/i] },
      { route: '/maps/der-eisendrache/boss', selector: '.de-boss-page', required: [/Boss Fight Survival Sheet/i, /Summoning Key/i, /Clock Tower/i] },
    ];

    for (const guide of focusedRoutes) {
      errors.length = 0;
      response = await page.goto(`${base}${guide.route}`, { waitUntil: 'domcontentloaded' });
      assert(response?.ok(), `${guide.route} returned ${response?.status()}`);
      await page.locator(guide.selector).waitFor();
      assert.equal(errors.length, 0, `${guide.route} page errors: ${errors.join('; ')}`);
      const text = await page.locator(guide.selector).innerText();
      for (const required of guide.required) assert.match(text, required, `${guide.route} is missing ${required}`);
      await assertNoHorizontalOverflow(page, guide.route);
      results.push({ width, route: guide.route, passed: true });
    }

    errors.length = 0;
    const badRoute = '/maps/der-eisendrache/bows/not-a-bow';
    response = await page.goto(`${base}${badRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${badRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Der nested bow catch-all renders shared NotFound');
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
console.log(`${results.length}/${results.length} Der Eisendrache browser health checks passed.`);
