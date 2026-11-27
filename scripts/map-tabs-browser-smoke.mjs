import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { guideNav, tabRowReach } from './smoke-contract.mjs';

/*
 * Every map's tab row can reach every tab. The rows scroll sideways when they are wider than their box
 * (shared/ui/map-tabs.css); a row centred or right-aligned with justify-content that overflows pushes its
 * first tabs off the left edge, where no scrolling reaches them (Zetsubou Overview at 390, Origins Main
 * Guide at 1440). Checked at the three approved sizes plus the in-between widths where rows first overflow.
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const MAPS = ['origins', 'mob-of-the-dead', 'shadows-of-evil', 'der-eisendrache', 'zetsubou-no-shima', 'gorod-krovi', 'revelations'];
const ALL_SIZES = [[390, 844], [844, 390], [1440, 900], [360, 800], [768, 1024], [1024, 768], [1100, 900], [1280, 900], [1920, 1080]];
// CI (time-limited job) checks the three approved sizes; a local run checks every width (MAP_TABS_ALL=1 forces it).
const SIZES = process.env.CI && !process.env.MAP_TABS_ALL ? ALL_SIZES.slice(0, 3) : ALL_SIZES;
const results = [];

// Landscape phones put the map title and its tabs on one row: the title must stay readable beside the tabs,
// and the current tab must be on screen (Gorod and Mob titles sat under their tabs at 844x390).
const ONE_ROW_MAPS = ['gorod-krovi', 'mob-of-the-dead'];
const LANDSCAPE = [[844, 390], [667, 375], [932, 430]];

function headerLayout() {
  const nav = [...document.querySelectorAll('.map-module header nav')].find((el) => el.querySelector('a'));
  const row = nav.querySelector('ul') || nav;
  const rowBox = row.getBoundingClientRect();
  const covered = [];
  for (const el of nav.closest('header').querySelectorAll('h1, h1 ~ *, h1 ~ * *')) {
    const range = document.createRange();
    range.selectNodeContents(el);
    for (const box of range.getClientRects()) {
      const underTabs = box.right > rowBox.left + 1 && box.left < rowBox.right - 1 && box.bottom > rowBox.top + 1 && box.top < rowBox.bottom - 1;
      if (underTabs || box.left < -1 || box.right > innerWidth + 1) covered.push(el.textContent.trim());
    }
  }
  const active = row.querySelector('a[aria-current="page"]').getBoundingClientRect();
  return { covered, activeInView: active.left >= rowBox.left - 1 && active.right <= rowBox.right + 1 };
}

const browser = await chromium.launch({ headless: true });
try {
  for (const [width, height] of SIZES) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    for (const map of MAPS) {
      await page.goto(`${base}/maps/${map}`, { waitUntil: 'networkidle' });
      await guideNav(page).waitFor({ timeout: 15000 });
      const row = await page.evaluate(tabRowReach); // found by role, not class: works for any tab-row look
      assert(row.tabs > 1, `${map} at ${width}x${height}: a tab row`);
      assert.deepEqual(row.unreachable, [], `${map} at ${width}x${height}: tabs past the left edge of the row, out of scroll reach`);
    }
    results.push(`${width}x${height}: every tab on all ${MAPS.length} maps is in reach`);
    await context.close();
  }
  for (const [width, height] of LANDSCAPE) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    for (const map of ONE_ROW_MAPS) {
      await page.goto(`${base}/maps/${map}/step-details`, { waitUntil: 'networkidle' });
      await guideNav(page).waitFor({ timeout: 15000 });
      await page.evaluate(() => document.fonts.ready);
      const header = await page.evaluate(headerLayout);
      assert.deepEqual(header.covered, [], `${map} at ${width}x${height}: title text under the tabs or off screen`);
      assert(header.activeInView, `${map} at ${width}x${height}: the current tab is on screen`);
    }
    results.push(`${width}x${height}: ${ONE_ROW_MAPS.join(' and ')} titles clear of the tabs, current tab on screen`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} map tab checks passed:\n- ${results.join('\n- ')}`);
