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
    // Behavioural guard: no duplicate section strip. Only the header nav and the contextual links inside a
    // step (servant, eggs, symbols, throws) may link to the Revelations sections.
    const sectionLinksOutsideHeader = await page.locator('a[href^="/maps/revelations/"]').evaluateAll(links =>
      links.filter(link => !link.closest('.rev-header') && !link.closest('.guide-seq__step')).map(link => link.textContent.trim()),
    );
    assert.deepEqual(sectionLinksOutsideHeader, [], `Revelations renders a second section navigation: ${sectionLinksOutsideHeader.join(', ')}`);
    assert.equal(await page.locator('.rev-header__nav a').count(), 5, 'Header nav reaches all five Revelations sections');
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.locator('li.guide-seq__step').count(), 12, 'Revelations keeps all 12 Easter Egg steps');
    const stepButtons = page.locator('.rev-step-list .rev-step-button');
    assert.equal(await stepButtons.count(), 12, 'Original left-rail layout lists all twelve steps');
    assert.equal(await page.locator('li.guide-seq__step:visible').count(), 1, 'Only one guide step is displayed at a time');
    const selectStep = async (id) => {
      await page.locator(`.rev-step-list button[aria-controls="${id}"]`).click();
      assert.equal(new URL(page.url()).hash, `#${id}`, `Step selector reaches ${id}`);
      await page.locator(`#${id}`).waitFor({ state: 'visible' });
      assert.equal(await page.locator('li.guide-seq__step:visible').count(), 1, `Only selected step ${id} is visible`);
    };
    await selectStep('throws');
    await page.goto(`${base}${mainRoute}`, { waitUntil: 'networkidle' });
    await assertCssImageLoaded(page, mainRoute, '.rev-header');
    await assertCssImageLoaded(page, mainRoute, '.rev-backdrop');
    await assertNoHorizontalOverflow(page, mainRoute);
    const opening = page.locator('#engines');
    assert.equal(await opening.locator('.guide-seq__action-block .guide-seq__tasks li').count(), 6,
      'Opening contains tombstones, four engine locations, and Pack-a-Punch');
    assert.equal(await opening.locator('.guide-seq__reference-block .gref-sequence li').count(), 4,
      'Tombstone code is shown as four ordered reference tokens');
    assert.equal(await opening.locator('.guide-seq__more').count(), 0,
      'Opening has no duplicate How-to section');
    const openMore = (id) => page.locator(`#${id} .guide-seq__more > summary`).click();

    // Servant step: original split navigation keeps full screenshots reachable.
    await selectStep('servant');
    // A capture's full-screen copy waits until it is opened (it was fetched with the page), then shows.
    await page.locator('#servant .gref-image__open').first().click();
    await page.waitForFunction(() => {
      const img = document.querySelector('#servant dialog.gref-lightbox[open] img');
      return img?.complete && img.naturalWidth > 0;
    }, null, { timeout: 5000 });
    await page.keyboard.press('Escape');
    assert.equal(await page.locator('#servant dialog.gref-lightbox[open]').count(), 0, 'Esc closes the full-screen capture');
    // Servant step: the in-game captures for each blue rock, one tab per map.
    await page.locator('#servant').getByRole('tab', { name: 'Mob of the Dead' }).click();
    const shot = page.locator('#servant .gref--image img').first();
    await shot.scrollIntoViewIfNeeded();
    assert(await shot.evaluate(img => img.complete && img.naturalWidth > 0), 'Servant rock capture loads');
    // The rock tabs follow the tabs pattern: one tab stop, arrows (wrapping) / Home / End move the pick and
    // focus with it, and the panel is the one every tab controls, named by the picked tab.
    const rockTabs = page.locator('#servant [role="tab"]');
    const rockPanel = page.locator('#servant [role="tabpanel"]');
    const rocks = () => rockTabs.evaluateAll((tabs) => tabs.map((tab) => ({
      label: tab.textContent, stop: tab.tabIndex === 0, picked: tab.getAttribute('aria-selected') === 'true',
      focused: tab === document.activeElement, controls: tab.getAttribute('aria-controls'), id: tab.id,
    })));
    const rockState = async () => {
      const tabs = await rocks();
      const picked = tabs.filter((tab) => tab.picked);
      const panel = { id: await rockPanel.getAttribute('id'), name: await rockPanel.getAttribute('aria-labelledby') };
      assert.equal(picked.length, 1, 'One rock tab is picked');
      assert.deepEqual(tabs.filter((tab) => tab.stop).map((tab) => tab.label), [picked[0].label], 'Only the picked rock tab is a tab stop');
      assert(panel.id && tabs.every((tab) => tab.controls === panel.id), 'Every rock tab controls the rock panel');
      assert.equal(panel.name, picked[0].id, 'The rock panel is named by the picked tab');
      return { picked: picked[0].label, focused: tabs.find((tab) => tab.focused)?.label };
    };
    assert.equal((await rockState()).picked, 'Mob of the Dead');
    await rockTabs.nth(3).focus();
    for (const [key, rock] of [['ArrowRight', 'Nacht'], ['ArrowRight', 'Spawn'], ['ArrowLeft', 'Nacht'], ['Home', 'Spawn'], ['End', 'Nacht']]) {
      await page.keyboard.press(key);
      assert.deepEqual(await rockState(), { picked: rock, focused: rock }, `${key} on the rock tabs picks and focuses ${rock}`);
    }

    await selectStep('eggs');
    let stepText = await page.locator('#eggs').innerText();
    assert.match(stepText, /nest|pustule/i);
    assert.match(stepText, /10 zombie souls/i);
    await openMore('eggs');
    assert(await page.locator('#eggs').getByRole('link', { name: /Egg locations/ }).isVisible());

    await selectStep('symbols');
    stepText = await page.locator('#symbols').innerText();
    assert.match(stepText, /all players/i);
    assert.match(stepText, /Kino projector/i);
    assert.match(stepText, /purple rift|purple circle/i);
    await page.locator('#symbols').getByLabel('1st').fill('skull');

    await selectStep('throws');
    stepText = await page.locator('#throws').innerText();
    assert.match(stepText, /Mob of the Dead\s*Poster/i);
    assert.match(stepText, /MG42/i);
    assert.match(stepText, /Focusing Stone/i);
    await openMore('throws');
    assert(await page.locator('#throws').getByRole('link', { name: /Throw videos/ }).isVisible());
    await selectStep('boss');
    assert.equal(await page.locator('#boss h3').innerText(), 'Final boss — Shadowman');

    // The Kronorium symbol note is game state, not progress: it survives a reload.
    await page.reload({ waitUntil: 'networkidle' });
    await selectStep('symbols');
    assert.equal(await page.locator('#symbols').getByLabel('1st').inputValue(), 'skull', 'Kronorium symbol note survives a reload');

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
    // The note's slots are heard with their note, and clearing it (which removes the Clear button) puts
    // focus in the first slot instead of dropping it to the page.
    assert.equal(await page.locator('#symbols').getByRole('group', { name: /Kronorium order/ }).count(), 1, 'The symbol note is a named group');
    await page.locator('#symbols').getByRole('button', { name: 'Clear for a new game' }).click();
    assert.equal(await page.locator('#symbols').getByLabel('1st').inputValue(), '', 'Clear empties the note');
    assert(await page.locator('#symbols').getByLabel('1st').evaluate((input) => input === document.activeElement), 'Clear puts focus in the first slot');
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
