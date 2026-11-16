import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
// Link and anchor check: every in-app link on every key page leads somewhere real.
// Crawls the critical routes and every prerendered route (hub pages, all seven maps and their tabs), collects
// each internal <a href>, then opens every distinct target once: it must not be the 404 page
// ([data-page-not-found]), and a #fragment must name an element that exists there (lazily rendered
// sections get a few seconds). Same-page #links are checked on the page that holds them.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { criticalRoutePaths } from './critical-routes.mjs';
import { prerenderRoutes } from './prerender-meta.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const origin = new URL(base).origin;
const pages = [...new Set([...criticalRoutePaths, ...prerenderRoutes()])];

const browser = await chromium.launch({ headless: true });
const problems = [];
const targets = new Map(); // target (path + search + hash) → first page that links to it
try {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  const page = await context.newPage();

  const open = async (url) => {
    await page.goto(url, { waitUntil: 'networkidle' });
    // Lazy routes show a loading note first; wait until the route's own content (or its 404) is there.
    await page.waitForFunction(() => !document.querySelector('.zh-status-page[role="status"]'), null, { timeout: 10000 }).catch(() => {});
  };
  const isNotFound = () => page.locator('[data-page-not-found]').count().then((count) => count > 0);
  const hasId = (id) => page.waitForFunction((target) => Boolean(document.getElementById(target)), id, { timeout: 15000 }).then(() => true, () => false);

  for (const route of pages) {
    await open(`${base}${route}`);
    if (await isNotFound()) { problems.push(`${route}: the page itself is the 404`); continue; }
    const hrefs = await page.$$eval('a[href]', (links) => links
      .filter((link) => link.target !== '_blank')
      .map((link) => link.getAttribute('href')));
    for (const href of hrefs) {
      if (!href || /^(mailto:|tel:|javascript:)/i.test(href)) continue;
      const url = new URL(href, `${origin}${route}`);
      if (url.origin !== origin) continue;
      if (url.pathname === route && !url.search && url.hash) {
        const id = decodeURIComponent(url.hash.slice(1));
        if (id && !(await hasId(id))) problems.push(`${route}: same-page link ${href} names no element`);
        continue;
      }
      const target = `${url.pathname}${url.search}${url.hash}`;
      if (!targets.has(target)) targets.set(target, route);
    }
  }

  for (const [target, from] of targets) {
    await open(`${base}${target}`);
    if (await isNotFound()) { problems.push(`${target} (linked from ${from}) is the 404 page`); continue; }
    const hash = new URL(target, origin).hash;
    const id = hash && decodeURIComponent(hash.slice(1));
    if (id && !(await hasId(id))) problems.push(`${target} (linked from ${from}): no #${id} on that page`);
  }
  await context.close();
} finally {
  await browser.close();
}

assert.deepEqual(problems, [], `broken links or anchors:\n${problems.join('\n')}`);
console.log(`links: ${pages.length} pages crawled, ${targets.size} distinct link targets open and every #anchor exists`);
