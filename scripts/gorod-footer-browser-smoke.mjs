import { chromium } from 'playwright';
import assert from 'node:assert/strict';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const routes = [
  '/maps/gorod-krovi',
  '/maps/gorod-krovi/trophies',
  '/maps/gorod-krovi/valves',
  '/maps/gorod-krovi/boss',
  '/maps/gorod-krovi/buildables',
];
const viewports = [
  { name: 'desktop', width: 1440, height: 900 },
  { name: 'portrait', width: 390, height: 844 },
  { name: 'landscape', width: 844, height: 390 },
  { name: 'tall', width: 820, height: 1180 },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of viewports) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    for (const route of routes) {
      errors.length = 0;
      const response = await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${route} @${viewport.name} returned ${response?.status()}`);
      assert.equal(errors.length, 0, `${route} @${viewport.name} page errors: ${errors.join('; ')}`);

      const layout = await page.evaluate(() => {
        const module = document.querySelector('.gorod-module');
        const content = document.querySelector('.gorod-content');
        const footer = document.querySelector('.gorod-footer');
        if (!module || !content || !footer) return null;

        const moduleBox = module.getBoundingClientRect();
        const contentBox = content.getBoundingClientRect();
        const footerBox = footer.getBoundingClientRect();
        const footerStyle = getComputedStyle(footer);
        return {
          moduleBottom: moduleBox.bottom + window.scrollY,
          contentBottom: contentBox.bottom + window.scrollY,
          footerTop: footerBox.top + window.scrollY,
          footerBottom: footerBox.bottom + window.scrollY,
          documentBottom: document.documentElement.scrollHeight,
          footerPosition: footerStyle.position,
          scrollWidth: document.documentElement.scrollWidth,
          clientWidth: document.documentElement.clientWidth,
        };
      });

      assert(layout, `${route} @${viewport.name} is missing the Gorod layout shell`);
      assert(layout.footerTop >= layout.contentBottom - 1,
        `${route} @${viewport.name} footer starts before route content ends (${layout.footerTop} < ${layout.contentBottom})`);
      assert(Math.abs(layout.moduleBottom - layout.footerBottom) <= 1,
        `${route} @${viewport.name} map background ends away from footer (${layout.moduleBottom} vs ${layout.footerBottom})`);
      assert(layout.documentBottom - layout.footerBottom <= 1,
        `${route} @${viewport.name} leaves ${layout.documentBottom - layout.footerBottom}px below the footer`);
      assert(!['absolute', 'fixed'].includes(layout.footerPosition),
        `${route} @${viewport.name} footer must remain in document flow, got ${layout.footerPosition}`);
      assert(layout.scrollWidth <= layout.clientWidth + 1,
        `${route} @${viewport.name} overflows horizontally: ${layout.scrollWidth}px > ${layout.clientWidth}px`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${routes.length * viewports.length}/${routes.length * viewports.length} Gorod footer/page-boundary checks passed.`);
