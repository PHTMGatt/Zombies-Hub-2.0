/*
 * Rendered-text baselines: what each page actually shows, with every <details> opened and every tab
 * visited. content-browser-smoke.mjs checks that each captured piece of text is still on the page.
 *
 *   node scripts/content-snapshot.mjs                    # every critical route (needs the preview on :4173)
 *   node scripts/content-snapshot.mjs --route /maps/x    # one route
 */
import { mkdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { pathToFileURL } from 'node:url';
import { chromium } from 'playwright';
import { criticalRoutes } from './critical-routes.mjs';

export const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
export const RENDERED_DIR = resolve(import.meta.dirname, 'fixtures/rendered');
export const renderedPath = (name) => resolve(RENDERED_DIR, `${name}.json`);

// Speed Run used to be locked behind this flag; set it so the baseline records the real Speed Run pages.
const LEGACY_UNLOCK = () => window.localStorage.setItem('zh-origins-speedrun-unlocked', 'true');

export async function newContentContext(browser) {
  const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
  await context.addInitScript(LEGACY_UNLOCK);
  return context;
}

const visibleText = () => {
  const main = document.querySelector('main');
  const walker = document.createTreeWalker(main, NodeFilter.SHOW_TEXT);
  const pieces = [];
  for (let node = walker.nextNode(); node; node = walker.nextNode()) {
    const text = node.textContent.replace(/\s+/g, ' ').trim();
    const parent = node.parentElement;
    if (!text || !parent || parent.closest('script, style, noscript')) continue;
    if (!parent.checkVisibility({ visibilityProperty: true })) continue;
    pieces.push(text);
  }
  return pieces;
};

// Visible text pieces of the page, across every opened <details> and every tab state.
export async function captureSegments(page, route) {
  await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
  const seen = new Set();
  const collect = async () => {
    await page.evaluate(() => document.querySelectorAll('main details:not([open])').forEach((item) => { item.open = true; }));
    (await page.evaluate(visibleText)).forEach((text) => seen.add(text));
  };
  await collect();
  const tabs = page.locator('main [role="tab"]');
  for (let index = 0; index < await tabs.count(); index += 1) {
    await tabs.nth(index).click();
    await collect();
  }
  return [...seen];
}

if (import.meta.url === pathToFileURL(process.argv[1] ?? '').href) {
  const only = process.argv.includes('--route') ? process.argv[process.argv.indexOf('--route') + 1] : null;
  const routes = criticalRoutes.filter(([, route]) => !only || route === only);
  if (!routes.length) throw new Error(`No critical route matches ${only}`);
  mkdirSync(RENDERED_DIR, { recursive: true });
  const browser = await chromium.launch({ headless: true });
  try {
    const context = await newContentContext(browser);
    const page = await context.newPage();
    for (const [name, route] of routes) {
      const segments = await captureSegments(page, route);
      writeFileSync(renderedPath(name), `${JSON.stringify({ route, segments }, null, 2)}\n`);
      console.log(`${name}: ${segments.length} text pieces`);
    }
  } finally {
    await browser.close();
  }
}
