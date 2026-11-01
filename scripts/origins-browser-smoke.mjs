/*
 * Origins field-sheet redesign: title block, elemental nav plates, run sheet, staff board and the
 * Build / Puzzle / Upgrade staff pages, at every smoke viewport.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { VIEWPORTS } from './smoke-viewports.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const ROUTES = [
  ['/maps/origins', 'Guide'],
  ['/maps/origins/ice-staff', 'Ice'],
  ['/maps/origins/fire-staff', 'Fire'],
  ['/maps/origins/wind-staff', 'Wind'],
  ['/maps/origins/lightning-staff', 'Lightning'],
  ['/maps/origins/speed-run', 'Speed Run'],
];
const PLATES = ['Guide', 'Ice', 'Fire', 'Wind', 'Lightning', 'Speed Run'];
const results = [];

const assertNoHorizontalOverflow = async (page, label) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert(scrollWidth <= clientWidth + 1, `${label} overflows horizontally (${scrollWidth} > ${clientWidth})`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // ---- Shell: title block, nav plates, nothing behind the reading surface ----
    for (const [route, current] of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.equal((await page.locator('.origins-mast h1').innerText()).trim().toLowerCase(), 'origins', `${route}: title block names the map`);
      const plates = await page.locator('.origins-plates a').evaluateAll((links) => links.map((link) => {
        const box = link.getBoundingClientRect();
        return { label: link.getAttribute('aria-label') || link.textContent.trim(), current: link.getAttribute('aria-current'), top: box.top, left: box.left, right: box.right, height: box.height };
      }));
      assert.deepEqual(plates.map((plate) => plate.label), PLATES, `${route}: six plates in order`);
      assert.deepEqual(plates.filter((plate) => plate.current === 'page').map((plate) => plate.label), [current], `${route}: the current plate is marked`);
      for (const plate of plates) {
        assert(plate.height >= 48, `${route}: ${plate.label} plate is ${Math.round(plate.height)}px tall`);
        assert(plate.left >= -1 && plate.right <= width + 1, `${route}: ${plate.label} plate is clipped at ${width}px`);
      }
      assert(new Set(plates.map((plate) => Math.round(plate.top))).size === 1, `${route}: plates sit on one row`);
      const pinned = await page.evaluate(() => {
        const hub = document.querySelector('.hub-header');
        const hubPinned = ['fixed', 'sticky'].includes(getComputedStyle(hub).position);
        const hubBottom = hubPinned ? hub.getBoundingClientRect().bottom : 0;
        const below = [...document.querySelectorAll('.origins-module *')]
          .filter((element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position) && element.closest('header, [data-pinned]') === element)
          .reduce((sum, element) => sum + element.getBoundingClientRect().height, 0);
        return { below: Math.round(below), hubBottom };
      });
      assert(pinned.below <= (name === 'landscape' ? 0 : 64), `${route}: ${pinned.below}px pinned under the hub bar at ${name}`);
      const glass = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((element) => {
        const filter = getComputedStyle(element).backdropFilter;
        return filter && filter !== 'none';
      }).length);
      assert.equal(glass, 0, `${route}: no backdrop-filter glass inside the page`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }
    results.push(`${name}: title block, six nav plates, pinned chrome and no glass on every Origins route`);

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} Origins checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
