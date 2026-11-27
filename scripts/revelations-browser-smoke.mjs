import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { fileURLToPath } from 'node:url';
import { currentTab, guideNav, guideTabs, mainSteps } from './smoke-contract.mjs';

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
// Pure OG Revelations (Bryen 2026-11-23 "go pure og"): the OG Revelations-Guide pages inside the hub. Checks the OG
// structure and behaviour (11-step picker, five tabs, video pages with their timestamp buttons), loading, and layout.
const TABS = ['Main Guide', 'Apothicon Upgrade', 'Egg Locations', 'Summoning Key', 'Sound Step'];
const pages = [
  ['/maps/revelations', 'For The Good Of All'],
  ['/maps/revelations/apothicon-upgrade', 'Apothicon Upgrade Locations'],
  ['/maps/revelations/egg-locations', 'Egg Locations'],
  ['/maps/revelations/summoning-key', 'Summoning Key Throws'],
  ['/maps/revelations/sound-step', 'Sound Step'],
];
const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    for (const [index, [route, title]] of pages.entries()) {
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${route} returned ${response?.status()}`);
      await page.getByRole('heading', { name: title, level: 1 }).waitFor();
      assert.equal(await guideNav(page).count(), 1, `${route}: one guide navigation`);
      assert.deepEqual((await guideTabs(page).allInnerTexts()).map((text) => text.trim()), TABS, `${route}: the five OG tabs in order`);
      assert.equal((await currentTab(page).innerText()).trim(), TABS[index], `${route}: the current tab is marked`);
      for (const tab of await guideTabs(page).all()) assert((await tab.boundingBox()).height >= 44, `${route}: tabs are 44px targets`);
      assert(await page.getByRole('heading', { name: 'Revelations Easter Egg Guide', level: 1 }).isVisible(), `${route}: OG header title`);
      assert.equal(await page.locator('main a[href*="step-details"]').count(), 0, `${route}: no Step details link`);
      await assertCssImageLoaded(page, route, '.revelations-module .header');
      await assertCssImageLoaded(page, route, '.revelations-module .footer');
      await assertNoHorizontalOverflow(page, `${route} @${viewportName}`);
      if (route === '/maps/revelations') {
        assert.equal(await mainSteps(page).count(), 11, 'the OG main guide picker lists 11 steps');
        await mainSteps(page).nth(10).click();
        assert.equal(await page.locator('.rev-step-title').innerText(), (await mainSteps(page).nth(10).innerText()).replace(/^\d+\.\s*/, ''), 'picking a step shows its details');
        assert(await mainSteps(page).nth(10).evaluate((button) => button.classList.contains('active')), 'the picked step is highlighted');
      } else {
        assert((await page.locator('main iframe').count()) === 1, `${route}: one video player`);
        // OG Egg Locations shows a section's spot buttons after its card is picked.
        if (route.endsWith('/egg-locations')) {
          await page.locator('main .egg-glass-card').first().click();
          await page.locator('main .sk-buttons button').first().waitFor();
        }
        assert((await page.locator('main button').count()) >= 4, `${route}: timestamp buttons for the spots`);
      }
      if (viewportName === 'phone') await page.screenshot({ path: fileURLToPath(new URL(`revelations${route.replace('/maps/revelations', '').replace('/', '-')}-${width}.png`, artifactDir)) });
      results.push({ width, route, passed: true });
    }
    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);

    // The old Step details address lands on the main guide; unknown addresses get the shared NotFound.
    await page.goto(`${base}/maps/revelations/step-details`, { waitUntil: 'networkidle' });
    assert.equal(new URL(page.url()).pathname, '/maps/revelations', '/step-details redirects to the main guide');
    await page.goto(`${base}/maps/revelations/not-a-guide`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'This route leads nowhere.', level: 2 }).waitFor();
    assert(await page.locator('[data-page-not-found]').isVisible(), 'Revelations catch-all renders shared NotFound');
    results.push({ width, route: 'redirect + not found', passed: true });
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
