import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
// Offline support (public/sw.js): a guide opened once still loads with no connection; a guide never opened
// shows the "couldn't load" page instead of a blank screen; back online, everything works again.
// "Offline" is real: this smoke runs its own preview server (dist/, or SMOKE_DIST) and stops it. Browser
// offline emulation is not used because Playwright's Chromium does not apply it to service-worker fetches.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { freePort, startPreview } from './smoke-helpers.mjs';

const port = await freePort();
let server = await startPreview(port);
const { base } = server;
const visited = [
  ['/maps/origins', 'Origins'],
  ['/maps/revelations', 'Revelations'],
];
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  const { width, height } = VIEWPORTS.find((viewport) => viewport.name === 'phone');
  const context = await browser.newContext({ viewport: { width, height } });
  const page = await context.newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  // First visit installs the worker; once it controls the page, the guides' files go through it into the cache.
  await page.goto(`${base}/`, { waitUntil: 'networkidle' });
  const scope = await page.evaluate(() => Promise.race([
    navigator.serviceWorker.ready.then((registration) => registration.scope),
    new Promise((done) => setTimeout(() => done('no service worker within 15s'), 15000)),
  ]));
  assert.equal(scope, `${base}/`, 'the service worker covers the whole site');
  await page.reload({ waitUntil: 'networkidle' });
  assert(await page.evaluate(() => Boolean(navigator.serviceWorker.controller)), 'the service worker controls the page');
  for (const [route] of visited) await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  results.push('worker installed and controlling');

  await server.stop();
  for (const [route, name] of visited) {
    await page.goto(`${base}${route}`, { waitUntil: 'load' });
    await page.locator('li.guide-seq__step, li.flat-guide__step').first().waitFor({ timeout: 15000 });
    assert.equal(await page.locator('[data-route-error]').count(), 0, `${route} offline: no load error`);
    assert.match(await page.title(), new RegExp(name), `${route} offline: the right page`);
    results.push(`${route} reads offline`);
  }
  // Moving between guides inside the app also works offline.
  await page.goto(`${base}/maps/origins`, { waitUntil: 'load' });
  await page.locator('li.guide-seq__step, li.flat-guide__step').first().waitFor({ timeout: 15000 });
  await page.evaluate(() => {
    window.history.pushState({}, '', '/maps/revelations');
    window.dispatchEvent(new PopStateEvent('popstate'));
  });
  await page.locator('.rev-step-list, .flat-guide__list').first().waitFor({ timeout: 15000 });
  results.push('in-app move between opened guides works offline');

  // A guide never opened can't come from the cache: the app still starts and says so.
  await page.goto(`${base}/maps/gorod-krovi`, { waitUntil: 'load' });
  await page.locator('[data-route-error]').waitFor({ timeout: 15000 });
  assert(await page.getByRole('button', { name: 'Reload guide' }).isVisible(), 'unopened guide offline: a reload button');
  results.push('unopened guide offline shows the load-error page');

  server = await startPreview(port);
  await page.getByRole('button', { name: 'Reload guide' }).click();
  await page.locator('li.guide-seq__step, li.flat-guide__step').first().waitFor({ timeout: 15000 });
  results.push('back online, the guide loads');

  const chunkErrors = errors.filter((message) => !/Failed to fetch dynamically imported module|Importing a module script failed|error loading dynamically imported module/i.test(message));
  assert.deepEqual(chunkErrors, [], `page errors: ${chunkErrors.join('; ')}`);
  await context.close();
} finally {
  await browser.close();
  await server.stop();
}
results.forEach((line) => console.log(`- ${line}`));
console.log(`${results.length}/${results.length} offline checks passed.`);
