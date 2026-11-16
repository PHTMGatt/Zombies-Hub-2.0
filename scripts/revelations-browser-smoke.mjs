import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const artifactDir = new URL('./artifacts/', new URL('../', import.meta.url));
const reportUrl = new URL('browser-smoke.json', artifactDir);
import { VIEWPORTS } from './smoke-viewports.mjs';
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
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    const mainRoute = '/maps/revelations';
    let response = await page.goto(`${base}${mainRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${mainRoute} returned ${response?.status()}`);
    await page.locator('.flat-guide__list').waitFor();
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    assert.equal(await page.locator('.rev-header__nav').count(), 1, 'Revelations keeps one map-level navigation row');
    assert.equal(await page.locator('.rev-main-shortcuts').count(), 0, 'Revelations duplicate bottom navigation stays removed');
    // Behavioural guard: no duplicate section strip. Only the header nav and a step's own "details" links
    // may link to the Revelations sections.
    const sectionLinksOutsideHeader = await page.locator('a[href^="/maps/revelations/"]').evaluateAll(links =>
      links.filter(link => !link.closest('.rev-header') && !link.closest('.flat-guide__step')).map(link => link.textContent.trim()),
    );
    assert.deepEqual(sectionLinksOutsideHeader, [], `Revelations renders a second section navigation: ${sectionLinksOutsideHeader.join(', ')}`);
    assert.equal(await page.locator('.rev-header__nav a').count(), 6, 'Header nav reaches all six Revelations sections (with Step details)');
    await page.reload({ waitUntil: 'networkidle' });

    // Flat main guide: all twelve steps in order, every one on screen at once, nothing to expand or open.
    const flatSteps = page.locator('main li.flat-guide__step');
    assert.equal(await flatSteps.count(), 12, 'Revelations keeps all 12 Easter Egg steps');
    const stepIds = await flatSteps.evaluateAll((items) => items.map((item) => item.id));
    assert(stepIds.every(Boolean) && new Set(stepIds).size === 12, `every step keeps its own id for deep links: ${stepIds.join(', ')}`);
    for (const id of ['engines', 'servant', 'eggs', 'symbols', 'throws', 'boss']) assert(stepIds.includes(id), `step #${id} is still linkable`);
    assert.equal(await page.locator('main .flat-guide details, main .flat-guide [aria-expanded]').count(), 0, 'No expanding cards on the flat guide');
    assert.equal(await page.locator('main .flat-guide img').count(), 0, 'No images on the flat guide');
    await assertCssImageLoaded(page, mainRoute, '.rev-header');
    await assertCssImageLoaded(page, mainRoute, '.rev-backdrop');
    await assertNoHorizontalOverflow(page, mainRoute);
    assert.match(await page.locator('#boss .flat-guide__title').innerText(), /Final boss — Shadowman/);

    // The detail moved to the tabs: the steps link there, and the tab sections hold the captures.
    assert.match(await page.locator('#servant a[data-step-link]').first().getAttribute('href'), /^\/maps\/revelations\/apothicon-upgrade\?from=servant/,
      'The Servant step links to the Apothicon Upgrade tab');
    await page.goto(`${base}/maps/revelations/apothicon-upgrade#servant-rocks`, { waitUntil: 'networkidle' });
    const rockShot = page.locator('#servant-rocks img').first();
    await rockShot.scrollIntoViewIfNeeded();
    assert(await rockShot.evaluate(img => img.complete && img.naturalWidth > 0), 'Servant rock capture loads on the Apothicon Upgrade tab');
    await page.goto(`${base}/maps/revelations/egg-locations`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#bone-spots').count(), 1, 'Egg Locations has the bone spots section');
    assert.equal(await page.locator('#turret-shot').count(), 1, 'Egg Locations has the S.O.P.H.I.A. turret section');
    await page.goto(`${base}${mainRoute}`, { waitUntil: 'networkidle' });

    await page.evaluate(() => {
      document.activeElement?.blur();
      window.scrollTo({ top: 0, left: 0, behavior: 'instant' });
    });
    await page.waitForFunction(() => window.scrollY === 0);
    const heroTitle = page.getByRole('heading', { name: 'Revelations Easter Egg Guide', level: 1 });
    assert(await heroTitle.isVisible(), 'Revelations hero title remains visible at the top of the page');
    const heroBox = await heroTitle.boundingBox();
    assert(heroBox && heroBox.y >= 0, `Revelations hero title is clipped above the viewport: y=${heroBox?.y}`);
    await page.screenshot({
      path: fileURLToPath(new URL(`revelations-${width}.png`, artifactDir)),
      fullPage: true,
    });
    // "I completed this Easter Egg" goes away once pressed; focus moves to what replaces it.
    await page.getByRole('button', { name: 'I completed this Easter Egg' }).click();
    await page.locator('.zh-complete--earned').waitFor();
    assert(await page.locator('.zh-complete--earned').evaluate((done) => done === document.activeElement), 'Completing the Easter Egg keeps focus on its result');
    await page.evaluate(() => localStorage.removeItem('zh-achievements'));
    results.push({ width, route: mainRoute, interactions: 'step sequence + contextual references + top-aligned screenshot', passed: true });

    errors.length = 0;
    const upgradeRoute = '/maps/revelations/apothicon-upgrade';
    response = await page.goto(`${base}${upgradeRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${upgradeRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Apothicon Servant Upgrade', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${upgradeRoute} page errors: ${errors.join('; ')}`);
    const upgradeButtons = page.locator('.rev-option');
    assert((await upgradeButtons.count()) >= 2, 'Apothicon upgrade keeps multiple location targets');
    await upgradeButtons.nth(1).click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Playing/i);
    assert.equal(await page.locator('.rev-option[aria-pressed="true"]').count(), 1, 'One Apothicon location is active');
    await assertNoHorizontalOverflow(page, upgradeRoute);
    results.push({ width, route: upgradeRoute, interaction: 'location selection', passed: true });

    errors.length = 0;
    const eggRoute = '/maps/revelations/egg-locations';
    response = await page.goto(`${base}${eggRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${eggRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Egg Locations', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${eggRoute} page errors: ${errors.join('; ')}`);
    // One island picker on every hunt page: an area can span two islands, and either one picks it.
    assert.equal(await page.locator('.rev-area button.rev-isle').count(), 7, 'Egg areas cover seven islands on the ring');
    await page.getByRole('button', { name: 'Shangri-La: Spawn / Shangri-La' }).click();
    assert.equal(await page.locator('.rev-area__head strong').innerText(), 'Spawn / Shangri-La', 'Tapping an island picks its egg area');
    assert.equal(await page.locator('.rev-area button.rev-isle[aria-pressed="true"]').count(), 2, 'Both islands of the area light up');
    const eggLocations = page.locator('.rev-option');
    assert((await eggLocations.count()) > 0, 'Selected egg area exposes spawn locations');
    await eggLocations.first().click();
    assert.match(await page.locator('.rev-video__now').innerText(), new RegExp(await eggLocations.first().locator('.rev-option__title').innerText()));
    await assertNoHorizontalOverflow(page, eggRoute);
    results.push({ width, route: eggRoute, interaction: 'area + location selection', passed: true });

    errors.length = 0;
    const keyRoute = '/maps/revelations/summoning-key';
    response = await page.goto(`${base}${keyRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${keyRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Summoning Key Throws', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${keyRoute} page errors: ${errors.join('; ')}`);
    const throwOption = (name) => page.locator('.rev-option', { hasText: name });
    await throwOption('Mob Cell Poster').click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Mob Cell Poster/);
    assert(await throwOption('Verrückt MG42 Fountain').isVisible());
    assert(await throwOption('Shangri-La Focusing Stone').isVisible());
    // The ring: seven target islands numbered in throw order; tapping one plays its throw.
    assert.equal(await page.locator('.rev-area button.rev-isle').count(), 7, 'Seven throw islands on the ring');
    assert.equal(await page.locator('.rev-area button.rev-isle', { hasText: 'Mob' }).locator('.rev-isle__count').innerText(), '5', 'Mob is throw 5');
    // Screen readers hear the badge too, and Tab walks the islands in throw order.
    const isles = await page.locator('.rev-area button.rev-isle').evaluateAll((buttons) => buttons.map((b) => ({ name: b.getAttribute('aria-label'), badge: b.querySelector('.rev-isle__count').textContent })));
    assert.deepEqual(isles.map((isle) => isle.badge), ['1', '2', '3', '4', '5', '6', '7'], 'Island buttons follow the throw order');
    for (const isle of isles) assert.match(isle.name, new RegExp(`^Throw ${isle.badge}, `), `"${isle.name}" names its throw number`);
    assert(isles.some((isle) => isle.name === 'Throw 5, Mob of the Dead: Cell Poster'), 'An island names its map once, then its target');
    await page.getByRole('button', { name: /^Throw \d, Verrückt: MG42 Fountain$/ }).click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Verrückt MG42 Fountain/);
    assert.match(await page.locator('.rev-option[aria-pressed="true"]').innerText(), /MG42/, 'The island picks its throw in the list too');
    await assertNoHorizontalOverflow(page, keyRoute);
    results.push({ width, route: keyRoute, interaction: 'exact target selection', passed: true });

    errors.length = 0;
    const soundRoute = '/maps/revelations/sound-step';
    response = await page.goto(`${base}${soundRoute}`, { waitUntil: 'domcontentloaded' });
    assert(response?.ok(), `${soundRoute} returned ${response?.status()}`);
    await page.getByRole('heading', { name: 'Sound Step', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${soundRoute} page errors: ${errors.join('; ')}`);
    const areaBefore = await page.locator('.rev-area__head strong').innerText();
    await page.getByRole('button', { name: 'Spawn: Spawn' }).click();
    const areaAfter = await page.locator('.rev-area__head strong').innerText();
    assert.notEqual(areaAfter, areaBefore, 'Tapping an island changes the Sound Step region');
    assert.equal(areaAfter, 'Spawn');
    const soundLocations = page.locator('.rev-option');
    assert((await soundLocations.count()) > 0, 'Sound Step exposes locations for selected area');
    await soundLocations.first().click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Playing/i);
    await assertNoHorizontalOverflow(page, soundRoute);
    results.push({ width, route: soundRoute, interaction: 'island pick + location selection', passed: true });

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

  // Tall viewports: the map backdrop must reach a bottom-pinned footer, and short subpages stay top-aligned.
  const tall = await browser.newContext({ viewport: { width: 820, height: 1180 } });
  const tallPage = await tall.newPage();
  for (const route of ['/maps/revelations', '/maps/revelations/apothicon-upgrade']) {
    await tallPage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
    const layout = await tallPage.evaluate(() => {
      const footer = document.querySelector('.rev-footer').getBoundingClientRect();
      const page = document.querySelector('.rev-stage').getBoundingClientRect();
      const header = document.querySelector('.rev-header').getBoundingClientRect();
      const firstPanel = document.querySelector('.rev-shell, .rev-run').getBoundingClientRect();
      return {
        gapBelowFooter: document.documentElement.scrollHeight - (footer.bottom + window.scrollY),
        pageToFooter: footer.top - page.bottom,
        panelOffset: firstPanel.top - header.bottom,
      };
    });
    assert(layout.gapBelowFooter <= 1, `${route} leaves ${layout.gapBelowFooter}px of dead space below the footer`);
    assert(Math.abs(layout.pageToFooter) <= 1, `${route} backdrop stops ${layout.pageToFooter}px above the footer`);
    assert(layout.panelOffset < 60, `${route} content floats ${layout.panelOffset}px below the map header`);
    results.push({ width: 820, route, check: 'footer boundary + top-aligned content', passed: true });
  }
  await tall.close();

  // A blocked YouTube never fires the player's ready or error events: the page still says so in time.
  const blocked = await browser.newContext({ viewport: { width: 390, height: 844 } });
  await blocked.route(/^https:\/\/([a-z0-9-]+\.)?(youtube\.com|youtube-nocookie\.com|ytimg\.com)\//, (route) => route.abort());
  const blockedPage = await blocked.newPage();
  await blockedPage.goto(`${base}/maps/revelations/sound-step`, { waitUntil: 'domcontentloaded' });
  await blockedPage.getByRole('heading', { name: 'Sound Step', level: 2 }).waitFor();
  await blockedPage.locator('.rev-video__warning').waitFor({ timeout: 15000 });
  assert.match(await blockedPage.locator('.rev-video__now').innerText(), /Player unavailable here/, 'Blocked YouTube shows the unavailable note');
  assert(await blockedPage.locator('.rev-video__external').isVisible(), 'Blocked YouTube keeps the YouTube link');
  results.push({ width: 390, route: '/maps/revelations/sound-step', check: 'blocked YouTube shows the unavailable note', passed: true });
  await blocked.close();

  // The four target viewports: every section fits, nothing clips, and the phone step selector stays compact.
  const routes = ['', '/apothicon-upgrade', '/egg-locations', '/summoning-key', '/sound-step'].map(path => `/maps/revelations${path}`);
  for (const [vw, vh] of [[1440, 900], [820, 1180], [390, 844], [844, 390]]) {
    const context = await browser.newContext({ viewport: { width: vw, height: vh } });
    const viewportPage = await context.newPage();
    for (const route of routes) {
      await viewportPage.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await assertNoHorizontalOverflow(viewportPage, `${route} @${vw}x${vh}`);
      const fit = await viewportPage.evaluate(() => {
        const inside = element => {
          const box = element.getBoundingClientRect();
          return box.left >= -1 && box.right <= window.innerWidth + 1;
        };
        const footer = document.querySelector('.rev-footer').getBoundingClientRect();
        const activeTab = document.querySelector('.rev-nav-link.active');
        const steps = document.querySelector('.rev-step-list');
        return {
          titleInside: inside(document.querySelector('.rev-header__title')),
          activeTabInside: activeTab ? inside(activeTab) : false,
          gapBelowFooter: Math.round(document.documentElement.scrollHeight - (footer.bottom + window.scrollY)),
          stepSelectorHeight: steps ? Math.round(steps.getBoundingClientRect().height) : 0,
        };
      });
      assert(fit.titleInside, `${route} @${vw}x${vh} clips the Revelations title`);
      assert(fit.activeTabInside, `${route} @${vw}x${vh} hides the active section tab`);
      assert(fit.gapBelowFooter <= 1, `${route} @${vw}x${vh} leaves ${fit.gapBelowFooter}px below the footer`);
      if (vw === 390 && route === '/maps/revelations') {
        assert(fit.stepSelectorHeight <= 90, `Phone step selector is ${fit.stepSelectorHeight}px tall; it should be one swipeable row`);
      }
    }
    results.push({ width: vw, height: vh, check: 'all sections fit, unclipped title/tabs, pinned footer', passed: true });
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
