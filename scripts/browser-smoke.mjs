import assert from 'node:assert/strict';
import fs from 'node:fs/promises';
import { chromium } from 'playwright';
import { criticalRoutes } from './critical-routes.mjs';
import mapInfo from '../apps/hub/src/data/mapInfo.js';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const out = process.env.SMOKE_REPORT || 'artifacts/browser-smoke.json';
const knownRoutes = [...new Set([
  ...criticalRoutes.map(([, route]) => route),
  ...Object.keys(mapInfo).flatMap(slug => [`/info/${slug}`, `/maps/${slug}`, `/easter-eggs/${slug}`]),
])];
const routes = [...knownRoutes, '/not-a-real-page', '/maps/origins/missing-guide',
  '/maps/revelations/missing-guide', '/info/not-a-map', '/maps/not-a-map',
  '/easter-eggs/not-a-map', '/side-easter-eggs/not-a-map'];
const browser = await chromium.launch({ headless: true });
const results = [];
if (process.env.SMOKE_SCREENSHOTS) await fs.mkdir('artifacts/screenshots', { recursive: true });
try {
  for (const width of [375, 1440]) {
    const context = await browser.newContext({ viewport: { width, height: 900 }, reducedMotion: 'reduce' });
    // Check our app, not availability of third-party video/ad servers.
    await context.route(/youtube\.com|youtube-nocookie\.com|googlevideo\.com|doubleclick\.net/, r => r.abort());
    const page = await context.newPage();
    for (const route of routes) {
      const errors = [];
      const onError = e => errors.push(e.message);
      page.on('pageerror', onError);
      try {
        const response = await page.goto(`${base}${route}`, { waitUntil: 'domcontentloaded' });
        await page.locator('#zh-main h1').first().waitFor({ timeout: 15000 });
        await page.waitForTimeout(150);
        await page.evaluate(async () => {
          await Promise.all([...document.images].filter(i => i.loading !== 'lazy').map(i =>
            i.complete ? null : new Promise(resolve => {
              i.addEventListener('load', resolve, { once: true });
              i.addEventListener('error', resolve, { once: true });
              setTimeout(resolve, 2000);
            })));
        });
        const state = await page.evaluate(() => ({
          title: document.title, h1: document.querySelectorAll('h1').length,
          mains: document.querySelectorAll('main').length,
          overflow: document.documentElement.scrollWidth - innerWidth,
          brokenImages: [...document.images].filter(i => i.complete && !i.naturalWidth).map(i => i.src),
          notFound: !!document.querySelector('[data-page-not-found]'),
          routeError: !!document.querySelector('[data-route-error]'),
          body: document.querySelector('#zh-main')?.textContent?.trim().length || 0,
        }));
        assert(response?.ok(), `HTTP ${response?.status()}`);
        assert.equal(state.h1, 1, 'exactly one h1');
        assert.equal(state.mains, 1, 'exactly one main landmark');
        assert(state.overflow <= 1, `horizontal overflow: ${state.overflow}px`);
        assert.equal(state.brokenImages.length, 0, `broken images: ${state.brokenImages}`);
        assert(state.body > 30, 'route rendered meaningful content');
        assert.equal(state.routeError, false, 'no route error fallback');
        assert.notEqual(state.title, 'Zombies Hub 2.0', 'route-specific title');
        assert.equal(state.notFound, !knownRoutes.includes(route), 'honest not-found state');
        assert.deepEqual(errors, [], 'no runtime errors');
        if (process.env.SMOKE_SCREENSHOTS) {
          await page.screenshot({ path: `artifacts/screenshots/${width}-${route.replace(/\W/g, '-') || 'home'}.png` });
        }
        results.push({ route, width, passed: true, ...state });
      } catch (error) {
        results.push({ route, width, passed: false, error: error.message, errors });
      } finally {
        page.off('pageerror', onError);
      }
    }
    // Interactions use app state, not live third-party video playback.
    await page.goto(`${base}/allmaps`);
    await page.getByRole('searchbox').fill('Origins');
    assert((await page.locator('.map-card').count()) > 0);
    assert((await page.locator('.map-card').allTextContents()).every(text => text.includes('Origins')));
    await page.getByRole('searchbox').fill('no-map-can-match-this');
    await page.getByText(/No maps matched/).waitFor();
    await page.goto(`${base}/maps/revelations/apothicon-upgrade`);
    await page.locator('.sk-button').nth(1).click();
    const fallback = page.getByRole('link', { name: 'Watch the selected timestamp on YouTube' });
    assert.match(await fallback.getAttribute('href'), /&t=[1-9]\d*s$/);
    results.push({ width, interactions: 'map search, empty state, video timestamp fallback', passed: true });
    await context.close();
  }
} finally {
  await browser.close();
}
await fs.mkdir(new URL('../artifacts/', import.meta.url), { recursive: true });
await fs.writeFile(out, JSON.stringify(results, null, 2));
const failed = results.filter(r => !r.passed);
console.log(`${results.length - failed.length}/${results.length} browser route checks passed.`);
for (const f of failed) console.error(`${f.width}px ${f.route}: ${f.error}`);
if (failed.length) process.exitCode = 1;
