import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { criticalRoutes as routes } from './critical-routes.mjs';

const baseUrl = process.env.ZH_SCREENSHOT_BASE_URL || 'https://zombies-hub-2-0.onrender.com';
const outputDir = process.env.ZH_SCREENSHOT_DIR || 'screenshots';
const viewports = [
  { name: 'desktop', width: 1440, height: 1000 },
  { name: 'mobile', width: 412, height: 915 },
];

await mkdir(outputDir, { recursive: true });

const browser = await chromium.launch({ headless: true });
const report = [];

try {
  for (const viewport of viewports) {
    const context = await browser.newContext({
      viewport: { width: viewport.width, height: viewport.height },
      deviceScaleFactor: 1,
      isMobile: viewport.name === 'mobile',
      hasTouch: viewport.name === 'mobile',
    });

    for (const [name, route] of routes) {
      const page = await context.newPage();
      const consoleErrors = [];
      const pageErrors = [];

      page.on('console', (message) => {
        if (message.type() === 'error') consoleErrors.push(message.text());
      });
      page.on('pageerror', (error) => pageErrors.push(error.message));

      const url = new URL(route, baseUrl).toString();
      const fileName = `${viewport.name}--${name}.jpg`;
      const filePath = path.join(outputDir, fileName);

      let status = null;
      let failure = null;
      let diagnostics = {
        brokenImages: [],
        horizontalOverflow: false,
        overflowPixels: 0,
      };

      try {
        const response = await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 45_000 });
        status = response?.status() ?? null;
        await page.waitForLoadState('networkidle', { timeout: 5_000 }).catch(() => {});
        await page.waitForTimeout(800);

        diagnostics = await page.evaluate(() => {
          const root = document.documentElement;
          const body = document.body;
          const scrollWidth = Math.max(root?.scrollWidth || 0, body?.scrollWidth || 0);
          const clientWidth = root?.clientWidth || window.innerWidth;

          const brokenImages = Array.from(document.images)
            .filter((img) => img.complete && img.naturalWidth === 0)
            .map((img) => ({
              src: img.currentSrc || img.src,
              alt: img.alt || '',
            }));

          return {
            brokenImages,
            horizontalOverflow: scrollWidth > clientWidth + 2,
            overflowPixels: Math.max(0, scrollWidth - clientWidth),
          };
        });

        await page.screenshot({
          path: filePath,
          fullPage: true,
          type: 'jpeg',
          quality: 72,
        });
      } catch (error) {
        failure = error.message;
      }

      report.push({
        viewport: viewport.name,
        route,
        url,
        screenshot: failure ? null : fileName,
        status,
        failure,
        consoleErrors,
        pageErrors,
        ...diagnostics,
      });

      const warning = diagnostics.brokenImages.length > 0 || diagnostics.horizontalOverflow
        ? ` | QA: ${diagnostics.brokenImages.length} broken images, ${diagnostics.overflowPixels}px overflow`
        : '';

      await page.close();
      console.log(`${viewport.name.padEnd(7)} ${route} -> ${failure ? 'FAILED' : fileName}${warning}`);
    }

    await context.close();
  }
} finally {
  await browser.close();
}

await writeFile(
  path.join(outputDir, 'report.json'),
  `${JSON.stringify(report, null, 2)}\n`,
  'utf8',
);

const failed = report.filter((entry) => entry.failure || (entry.status && entry.status >= 400));
const runtimeErrors = report.filter((entry) => entry.pageErrors.length > 0);
const brokenAssets = report.filter((entry) => entry.brokenImages.length > 0);
const overflowPages = report.filter((entry) => entry.horizontalOverflow);

console.log(`Captured ${report.length - failed.length}/${report.length} pages.`);
console.log(
  `Navigation failures: ${failed.length}; page runtime errors: ${runtimeErrors.length}; ` +
  `broken-image pages: ${brokenAssets.length}; overflow pages: ${overflowPages.length}.`,
);

if (failed.length > 0 || runtimeErrors.length > 0 || brokenAssets.length > 0 || overflowPages.length > 0) {
  process.exitCode = 1;
}
