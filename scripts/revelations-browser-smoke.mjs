import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = new URL('./artifacts/', new URL('../', import.meta.url));
const reportUrl = new URL('browser-smoke.json', artifactDir);
const widths = [390, 1440];
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(scrollWidth <= clientWidth + 1, `${route} overflows horizontally: ${scrollWidth}px > ${clientWidth}px`);
};

const assertCssImageLoaded = async (page, route, selector) => {
  const background = await page.locator(selector).evaluate(element => getComputedStyle(element).backgroundImage);
  const match = background.match(/url\(["']?(.+?)["']?\)/);
  assert(match?.[1], `${route} has no artwork URL on ${selector}`);
  const loaded = await page.evaluate(src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  }), match[1]);
  assert(loaded, `${route} failed to load artwork from ${selector}`);
};

await fs.mkdir(artifactDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const mainRoute = '/maps/revelations';
    let response = await page.goto(`${base}${mainRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${mainRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'For The Good Of All', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    assert.equal(await page.locator('.rev-header__nav').count(), 1, 'Revelations keeps one map-level navigation row');
    assert.equal(await page.locator('.rev-main-shortcuts').count(), 0, 'Revelations duplicate bottom navigation stays removed');
    assert.equal(await page.locator('.rev-step-button').count(), 12, 'Revelations keeps all 12 Easter Egg steps');
    await assertCssImageLoaded(page, mainRoute, '.rev-header');
    await assertCssImageLoaded(page, mainRoute, '.rev-background');
    await assertNoHorizontalOverflow(page, mainRoute);

    await page.getByRole('button', { name: /Kronorium \+ Four Eggs/ }).click();
    let stepText = await page.locator('.rev-step-panel').innerText();
    assert.match(stepText, /incubation nests|pustules/i);
    assert.match(stepText, /10 zombie souls/i);
    assert(await page.getByRole('link', { name: /Open Egg Locations/ }).isVisible());

    await page.getByRole('button', { name: /Symbol Room \+ Summoning Key/ }).click();
    stepText = await page.locator('.rev-step-panel').innerText();
    assert.match(stepText, /all players/i);
    assert.match(stepText, /Kino projector/i);
    assert.match(stepText, /purple rift|purple circle/i);

    await page.getByRole('button', { name: /Seven Summoning Key Throws/ }).click();
    stepText = await page.locator('.rev-step-panel').innerText();
    assert.match(stepText, /Mob of the Dead: poster/i);
    assert.match(stepText, /MG42/i);
    assert.match(stepText, /Focusing Stone/i);
    assert(await page.getByRole('link', { name: /Open Summoning Key Throws/ }).isVisible());

    await page.locator('.rev-step-button').first().click();
    await page.screenshot({
      path: fileURLToPath(new URL(`revelations-${width}.png`, artifactDir)),
      fullPage: true,
    });
    results.push({ width, route: mainRoute, interactions: 'step selection + contextual references + screenshot', passed: true });

    errors.length = 0;
    const upgradeRoute = '/maps/revelations/apothicon-upgrade';
    response = await page.goto(`${base}${upgradeRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${upgradeRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Apothicon Servant Upgrade', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${upgradeRoute} page errors: ${errors.join('; ')}`);
    const upgradeButtons = page.locator('.sk-buttons .sk-button');
    assert((await upgradeButtons.count()) >= 2, 'Apothicon upgrade keeps multiple location targets');
    await upgradeButtons.nth(1).click();
    assert(await page.locator('.sk-selected-label').isVisible());
    await assertNoHorizontalOverflow(page, upgradeRoute);
    results.push({ width, route: upgradeRoute, interaction: 'location selection', passed: true });

    errors.length = 0;
    const eggRoute = '/maps/revelations/egg-locations';
    response = await page.goto(`${base}${eggRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${eggRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Egg Locations', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${eggRoute} page errors: ${errors.join('; ')}`);
    const areaTabs = page.locator('.egg-area-tabs button');
    assert((await areaTabs.count()) >= 2, 'Egg reference keeps multiple map areas');
    await areaTabs.nth(1).click();
    const eggLocations = page.locator('.sk-buttons .sk-button');
    assert((await eggLocations.count()) > 0, 'Selected egg area exposes spawn locations');
    await eggLocations.first().click();
    assert(await page.locator('.rev-selected-location').isVisible());
    await assertNoHorizontalOverflow(page, eggRoute);
    results.push({ width, route: eggRoute, interaction: 'area + location selection', passed: true });

    errors.length = 0;
    const keyRoute = '/maps/revelations/summoning-key';
    response = await page.goto(`${base}${keyRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${keyRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Summoning Key Throws', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${keyRoute} page errors: ${errors.join('; ')}`);
    await page.getByRole('button', { name: /Mob Cell Poster/ }).click();
    assert.match(await page.locator('.sk-selected-label').innerText(), /Mob Cell Poster/);
    assert(await page.getByRole('button', { name: /Verrückt MG42 Fountain/ }).isVisible());
    assert(await page.getByRole('button', { name: /Shangri-La Focusing Stone/ }).isVisible());
    await assertNoHorizontalOverflow(page, keyRoute);
    results.push({ width, route: keyRoute, interaction: 'exact target selection', passed: true });

    errors.length = 0;
    const soundRoute = '/maps/revelations/sound-step';
    response = await page.goto(`${base}${soundRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${soundRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Sound Step', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${soundRoute} page errors: ${errors.join('; ')}`);
    const areaBefore = await page.locator('.sound-area-controls strong').innerText();
    await page.getByRole('button', { name: 'Next area' }).click();
    const areaAfter = await page.locator('.sound-area-controls strong').innerText();
    assert.notEqual(areaAfter, areaBefore, 'Sound Step next-area control changes region');
    const soundLocations = page.locator('.sound-location-list button');
    assert((await soundLocations.count()) > 0, 'Sound Step exposes locations for selected area');
    await soundLocations.first().click();
    assert(await page.locator('.sk-selected-label').isVisible());
    await assertNoHorizontalOverflow(page, soundRoute);
    results.push({ width, route: soundRoute, interaction: 'area rotation + location selection', passed: true });

    errors.length = 0;
    const badRoute = '/maps/revelations/not-a-guide';
    response = await page.goto(`${base}${badRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${badRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Revelations catch-all renders shared NotFound');
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
console.log(`${results.length}/${results.length} Revelations browser health checks passed.`);
