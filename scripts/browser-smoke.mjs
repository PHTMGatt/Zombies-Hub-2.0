import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const artifactsDir = new URL('../artifacts/', import.meta.url);
const out = new URL('../artifacts/browser-smoke.json', import.meta.url);
const widths = [390, 1440];
const routes = [
  '/',
  '/allmaps',
  '/easter-eggs',
  '/side-easter-eggs',
  '/maps/origins',
  '/maps/mob-of-the-dead',
  '/maps/shadows-of-evil',
  '/maps/der-eisendrache',
  '/maps/zetsubou-no-shima',
  '/maps/gorod-krovi',
  '/maps/revelations',
];
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const dimensions = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(
    dimensions.scrollWidth <= dimensions.clientWidth + 1,
    `${route} overflows horizontally: ${dimensions.scrollWidth}px > ${dimensions.clientWidth}px`,
  );
};

const assertImagesLoaded = async (page, route, selector) => {
  const brokenImages = await page.locator(selector).evaluateAll(images =>
    images
      .filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.getAttribute('alt') || image.getAttribute('src') || 'unnamed image'),
  );
  assert.deepEqual(brokenImages, [], `${route} has broken images: ${brokenImages.join(', ')}`);
};

await fs.mkdir(artifactsDir, { recursive: true });
const browser = await chromium.launch({ headless: true });
try {
  for (const width of widths) {
    const context = await browser.newContext({ viewport: { width, height: 900 } });
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      page.on('pageerror', error => errors.push(error.message));
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${route} returned ${response?.status()}`);
      assert.equal(errors.length, 0, `${route} page errors: ${errors.join('; ')}`);
      if (route.startsWith('/maps/')) {
        // Short guides must still pin the map footer to the bottom edge, with no dead band beneath it.
        const gapBelowFooter = await page.evaluate(() => {
          const footer = document.querySelector('.map-module footer');
          if (!footer) return null;
          return Math.round(document.documentElement.scrollHeight - (footer.getBoundingClientRect().bottom + window.scrollY));
        });
        assert(gapBelowFooter !== null, `${route} renders no map footer`);
        assert(gapBelowFooter <= 1, `${route} leaves ${gapBelowFooter}px of dead space below the map footer`);
      }
      results.push({ width, route, passed: true });
    }

    await page.goto(`${base}/allmaps`);
    await page.getByRole('searchbox').fill('Origins');
    assert((await page.locator('.map-card').count()) > 0);
    assert((await page.locator('.map-card').allTextContents()).every(text => text.includes('Origins')));
    await page.getByRole('searchbox').fill('no-map-can-match-this');
    await page.getByText(/No maps matched/).waitFor();

    // Side Easter Eggs is a visually sensitive hub page. Protect its card count,
    // responsive grid, navigation, overflow, and capture both target viewports.
    await page.goto(`${base}/side-easter-eggs`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Side Easter Eggs' }).waitFor();
    const sideCards = page.locator('.side-ee-card');
    assert.equal(await sideCards.count(), 5, 'Side Easter Eggs keeps all five guide cards');
    const sideArtworkRatios = await sideCards.evaluateAll(cards => Promise.all(cards.map(async card => {
      const image = card.querySelector('.side-ee-card__art');
      if (!image?.currentSrc) throw new Error('Side Easter Egg card has no rendered artwork source');
      await image.decode();
      return image.naturalWidth / image.naturalHeight;
    })));
    assert(
      sideArtworkRatios.every(ratio => ratio >= 1.6 && ratio <= 1.9),
      `Side Easter Egg cards use clean widescreen artwork instead of catalog strips: ${sideArtworkRatios.join(', ')}`,
    );
    // Count cards in the first visual row (the grid uses extra tracks to center a short last row).
    const sideColumns = await sideCards.evaluateAll(cards => {
      const firstTop = Math.round(cards[0].getBoundingClientRect().top);
      return cards.filter(card => Math.round(card.getBoundingClientRect().top) === firstTop).length;
    });
    assert.equal(sideColumns, width === 390 ? 1 : 3, `Side Easter Eggs uses the expected ${width}px grid`);
    await assertNoHorizontalOverflow(page, '/side-easter-eggs');
    await page.screenshot({
      path: new URL(`../artifacts/side-easter-eggs-${width}.png`, import.meta.url).pathname,
      fullPage: true,
    });
    const firstSideTarget = await sideCards.first().getAttribute('href');
    assert(firstSideTarget, 'Side Easter Egg card has a destination');
    await sideCards.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, firstSideTarget, 'Side Easter Egg card reaches its intended route');
    await page.waitForFunction(() => document.activeElement?.id === 'zh-main');
    assert.equal(
      await page.evaluate(() => document.activeElement?.id),
      'zh-main',
      'client-side route navigation moves focus to the new guide landmark',
    );
    await page.getByRole('link', { name: /Back to Side Easter Eggs/i }).click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, '/side-easter-eggs', 'Side Easter Egg detail returns to the list');

    // Origins is a core guide and should retain working map-specific navigation.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const originsLinks = page.locator('a[href^="/maps/origins/"]');
    assert((await originsLinks.count()) > 0, 'Origins exposes at least one guide navigation link');
    const originsTarget = await originsLinks.first().getAttribute('href');
    assert(originsTarget, 'Origins guide link has a destination');
    await originsLinks.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, originsTarget, 'Origins guide navigation reaches its intended route');

    // Origins guide health must cover the actual staff pages, not only the shell.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const originsAudio = page.locator('.audio-players audio');
    assert.equal(await originsAudio.count(), 2, 'Origins main guide keeps both audio controls');
    assert(
      await originsAudio.evaluateAll(players => players.every(player => (player.getAttribute('aria-label') || '').trim().length > 0)),
      'Origins audio controls expose accessible names',
    );
    await assertImagesLoaded(page, '/maps/origins', '.origins-route-content img');
    await assertNoHorizontalOverflow(page, '/maps/origins');

    const originsStaffGuides = [
      {
        route: '/maps/origins/fire-staff',
        heading: 'Fire Staff Parts',
        required: [/Generator 6/i, /glowing plane/i, /torch/i],
      },
      {
        route: '/maps/origins/ice-staff',
        heading: 'Ice Staff Parts',
        required: [/(Tank Station|Generator 2)/i, /gravestone/i],
      },
      {
        route: '/maps/origins/wind-staff',
        heading: 'Wind Staff Parts',
        required: [/Wind Tunnel/i, /Generator 4/i, /smoking chimneys/i],
      },
      {
        route: '/maps/origins/lightning-staff',
        heading: 'Lightning Staff Parts',
        required: [/Purple Record/i, /Lightning Tunnel/i, /Generator 5/i],
      },
    ];

    for (const guide of originsStaffGuides) {
      await page.goto(`${base}${guide.route}`, { waitUntil: 'networkidle' });
      await page.getByRole('heading', { name: guide.heading }).waitFor();
      const guideText = await page.locator('.origins-route-content').innerText();
      for (const requiredText of guide.required) {
        assert.match(guideText, requiredText, `${guide.route} is missing ${requiredText}`);
      }
      await assertImagesLoaded(page, guide.route, '.origins-route-content img');
      await assertNoHorizontalOverflow(page, guide.route);
    }

    // Mob of the Dead should retain its own guide navigation rather than
    // silently regressing while other map-specific shells evolve.
    await page.goto(`${base}/maps/mob-of-the-dead`, { waitUntil: 'networkidle' });
    const mobLinks = page.locator('a[href^="/maps/mob-of-the-dead/"]');
    assert((await mobLinks.count()) > 0, 'Mob of the Dead exposes at least one guide navigation link');
    const mobTarget = await mobLinks.first().getAttribute('href');
    assert(mobTarget, 'Mob of the Dead guide link has a destination');
    await mobLinks.first().click();
    await page.waitForLoadState('networkidle');
    assert.equal(new URL(page.url()).pathname, mobTarget, 'Mob of the Dead guide navigation reaches its intended route');

    await page.goto(`${base}/maps/revelations/apothicon-upgrade`);
    await page.locator('.sk-button').nth(1).click();
    const fallback = page.getByRole('link', { name: 'Watch the selected timestamp on YouTube' });
    assert.match(await fallback.getAttribute('href'), /&t=[1-9]\d*s$/);

    // Gorod's valve solver is a gameplay-critical interactive tool. Keep its
    // randomized-puzzle flow covered at both mobile and desktop widths.
    await page.goto(`${base}/maps/gorod-krovi/valves`, { waitUntil: 'networkidle' });
    const selects = page.locator('.gorod-valve-fields select');
    await selects.first().waitFor();
    assert.equal(await selects.count(), 2, 'valve solver exposes both required inputs');
    await selects.nth(0).selectOption({ label: 'Armory' });
    await selects.nth(1).selectOption({ label: 'Department Store' });
    const solution = page.locator('.gorod-valve-solution');
    await solution.waitFor();
    assert.match(await solution.textContent(), /Armory\s*→\s*Department Store/);
    assert((await page.locator('.gorod-valve-setting').count()) > 0, 'known valve route renders stored settings');
    await page.getByRole('button', { name: 'Reset' }).click();
    await page.getByText('Select both locations.').waitFor();
    assert.equal(await selects.nth(0).inputValue(), '');
    assert.equal(await selects.nth(1).inputValue(), '');

    results.push({ width, interactions: 'map search, empty state, Side Easter Egg layout/navigation, Origins staff guide content/images/overflow and navigation, Mob guide navigation, video timestamp fallback, Gorod valve solver solution/reset', passed: true });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.writeFile(out, JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.passed);
console.log(`${results.length - failed.length}/${results.length} browser route checks passed.`);
for (const f of failed) console.error(`${f.width}px ${f.route}: ${f.error}`);
if (failed.length) process.exitCode = 1;
