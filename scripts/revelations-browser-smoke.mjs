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
    await page.getByRole('heading', { name: 'For The Good Of All', level: 2 }).waitFor();
    assert.equal(errors.length, 0, `${mainRoute} page errors: ${errors.join('; ')}`);
    assert.equal(await page.locator('.rev-header__nav').count(), 1, 'Revelations keeps one map-level navigation row');
    assert.equal(await page.locator('.rev-main-shortcuts').count(), 0, 'Revelations duplicate bottom navigation stays removed');
    // Behavioural guard: on step 1 nothing outside the header may link to the Revelations sections,
    // whatever class a duplicate strip might be given. (Contextual links appear only on steps 3/8/9/11.)
    const sectionLinksOutsideHeader = await page.locator('a[href^="/maps/revelations/"]').evaluateAll(links =>
      links.filter(link => !link.closest('.rev-header')).map(link => link.textContent.trim()),
    );
    assert.deepEqual(sectionLinksOutsideHeader, [], `Revelations renders a second section navigation: ${sectionLinksOutsideHeader.join(', ')}`);
    assert.equal(await page.locator('.rev-header__nav a').count(), 5, 'Header nav reaches all five Revelations sections');
    await page.evaluate(() => localStorage.removeItem('zh-guide-progress:revelations'));
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.guide-rail__step').count(), 12, 'Revelations keeps all 12 Easter Egg steps');
    await assertCssImageLoaded(page, mainRoute, '.rev-header');
    await assertCssImageLoaded(page, mainRoute, '.rev-backdrop');
    await assertNoHorizontalOverflow(page, mainRoute);
    const step = (title) => page.locator('.guide-rail__step', { hasText: title }).click();

    // Servant step: the in-game captures for each blue rock, one tab per map.
    await step('Upgrade the Servant');
    await page.getByRole('tab', { name: 'Mob of the Dead' }).click();
    const shot = page.locator('.guide-step .gref--image img').first();
    await shot.scrollIntoViewIfNeeded();
    assert(await shot.evaluate(img => img.complete && img.naturalWidth > 0), 'Servant rock capture loads');

    await step('Kronorium + four eggs');
    let stepText = await page.locator('.guide-step').innerText();
    assert.match(stepText, /nest|pustule/i);
    assert.match(stepText, /10 zombie souls/i);
    assert(await page.getByRole('link', { name: /Egg locations/ }).isVisible());

    await step('Symbol room');
    stepText = await page.locator('.guide-step').innerText();
    assert.match(stepText, /all players/i);
    assert.match(stepText, /Kino projector/i);
    assert.match(stepText, /purple rift|purple circle/i);
    await page.getByLabel('1st').fill('skull');

    await step('Seven key throws');
    stepText = await page.locator('.guide-step').innerText();
    assert.match(stepText, /Mob of the Dead\s*Poster/i);
    assert.match(stepText, /MG42/i);
    assert.match(stepText, /Focusing Stone/i);
    assert(await page.getByRole('link', { name: /Throw videos/ }).isVisible());

    // Previous / Next walk the run and stop at its ends; the place and the symbol note survive a reload.
    const nextStep = page.getByRole('button', { name: 'Next step' });
    const previousStep = page.getByRole('button', { name: 'Previous step' });
    await nextStep.click();
    assert.equal(await page.locator('.guide-step h3').innerText(), 'Final boss — Shadowman');
    assert(await nextStep.isDisabled(), 'Next is disabled on the final step');
    await previousStep.click();
    assert.equal(await page.locator('.guide-step h3').innerText(), 'Seven key throws');
    assert.equal(await page.locator('.guide-rail__step[aria-current="step"]').count(), 1, 'Exactly one step is current');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('.guide-step h3').innerText(), 'Seven key throws', 'Revelations remembers the current step');
    await step('Symbol room');
    assert.equal(await page.getByLabel('1st').inputValue(), 'skull', 'Kronorium symbol note survives a reload');

    await page.locator('.guide-rail__step').first().click();
    assert(await previousStep.isDisabled(), 'Previous is disabled on the first step');
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
    results.push({ width, route: mainRoute, interactions: 'step selection + contextual references + top-aligned screenshot', passed: true });

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
    const areaTabs = page.locator('.rev-segment button');
    assert((await areaTabs.count()) >= 2, 'Egg reference keeps multiple map areas');
    await areaTabs.nth(1).click();
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
    await page.getByRole('button', { name: /Mob Cell Poster/ }).click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Mob Cell Poster/);
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
    const areaBefore = await page.locator('.rev-area-switch strong').innerText();
    await page.getByRole('button', { name: 'Next area' }).click();
    const areaAfter = await page.locator('.rev-area-switch strong').innerText();
    assert.notEqual(areaAfter, areaBefore, 'Sound Step next-area control changes region');
    const soundLocations = page.locator('.rev-option');
    assert((await soundLocations.count()) > 0, 'Sound Step exposes locations for selected area');
    await soundLocations.first().click();
    assert.match(await page.locator('.rev-video__now').innerText(), /Playing/i);
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
