import { chromium } from 'playwright';
import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const baseUrl = process.env.ZH_SCREENSHOT_BASE_URL || 'https://zombies-hub-2-0.onrender.com';
const outputDir = process.env.ZH_SCREENSHOT_DIR || 'screenshots';

const routes = [
  ['hub-home', '/'],
  ['hub-all-maps', '/allmaps'],
  ['hub-ee-maps', '/easter-eggs'],
  ['side-ee-list', '/side-easter-eggs'],
  ['side-ee-origins-speedrun', '/side-easter-eggs/origins-speedrun'],
  ['side-ee-kino', '/side-easter-eggs/kino'],
  ['side-ee-gorod', '/side-easter-eggs/gk'],
  ['side-ee-de', '/side-easter-eggs/de'],
  ['side-ee-shadows', '/side-easter-eggs/soe'],

  ['origins-main', '/maps/origins'],
  ['origins-fire', '/maps/origins/fire-staff'],
  ['origins-ice', '/maps/origins/ice-staff'],
  ['origins-wind', '/maps/origins/wind-staff'],
  ['origins-lightning', '/maps/origins/lightning-staff'],

  ['mob-main', '/maps/mob-of-the-dead'],
  ['mob-plane', '/maps/mob-of-the-dead/plane'],
  ['mob-retriever-skulls', '/maps/mob-of-the-dead/retriever-skulls'],
  ['mob-codes', '/maps/mob-of-the-dead/codes'],
  ['mob-final-step', '/maps/mob-of-the-dead/final-step'],

  ['shadows-main', '/maps/shadows-of-evil'],

  ['de-main', '/maps/der-eisendrache'],
  ['de-parts', '/maps/der-eisendrache/parts'],
  ['de-wisps', '/maps/der-eisendrache/wisps'],
  ['de-boss', '/maps/der-eisendrache/boss'],
  ['de-bows', '/maps/der-eisendrache/bows'],
  ['de-bow-base', '/maps/der-eisendrache/bows/base'],
  ['de-bow-electric', '/maps/der-eisendrache/bows/electric'],
  ['de-bow-fire', '/maps/der-eisendrache/bows/fire'],
  ['de-bow-wolf', '/maps/der-eisendrache/bows/wolf'],
  ['de-bow-void', '/maps/der-eisendrache/bows/void'],

  ['zets-main', '/maps/zetsubou-no-shima'],
  ['zets-prerequisites', '/maps/zetsubou-no-shima/prerequisites'],
  ['zets-blueprint', '/maps/zetsubou-no-shima/reveal-blueprint'],
  ['zets-cogs', '/maps/zetsubou-no-shima/cogs'],
  ['zets-cog-1', '/maps/zetsubou-no-shima/cogs/1'],
  ['zets-cog-2', '/maps/zetsubou-no-shima/cogs/2'],
  ['zets-cog-3', '/maps/zetsubou-no-shima/cogs/3'],
  ['zets-buildables', '/maps/zetsubou-no-shima/buildables'],
  ['zets-elevator', '/maps/zetsubou-no-shima/elevator-battle'],
  ['zets-extras', '/maps/zetsubou-no-shima/extras'],

  ['gorod-main', '/maps/gorod-krovi'],
  ['gorod-trophies', '/maps/gorod-krovi/trophies'],
  ['gorod-valves', '/maps/gorod-krovi/valves'],
  ['gorod-buildables', '/maps/gorod-krovi/buildables'],
  ['gorod-boss', '/maps/gorod-krovi/boss'],

  ['revelations-main', '/maps/revelations'],
  ['revelations-apothicon', '/maps/revelations/apothicon-upgrade'],
  ['revelations-eggs', '/maps/revelations/egg-locations'],
  ['revelations-key', '/maps/revelations/summoning-key'],
  ['revelations-sound', '/maps/revelations/sound-step'],
];

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
