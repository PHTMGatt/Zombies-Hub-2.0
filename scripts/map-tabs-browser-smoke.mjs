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
} finally {
  await browser.close();
}

console.log(`${results.length} map tab checks passed:\n- ${results.join('\n- ')}`);
