import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import fs from 'node:fs/promises';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const reportUrl = new URL('./artifacts/browser-smoke.json', new URL('../', import.meta.url));
import { VIEWPORTS } from './smoke-viewports.mjs';
const results = [];

const assertNoHorizontalOverflow = async (page, route) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({
    scrollWidth: document.documentElement.scrollWidth,
    clientWidth: document.documentElement.clientWidth,
  }));
  assert(scrollWidth <= clientWidth + 1, `${route} overflows horizontally: ${scrollWidth}px > ${clientWidth}px`);
};

const assertImagesLoaded = async (page, route) => {
  const broken = await page.locator('.mob-module img').evaluateAll(images =>
    images.filter(image => !image.complete || image.naturalWidth === 0)
      .map(image => image.getAttribute('src') || 'unnamed image'),
  );
  assert.deepEqual(broken, [], `${route} has broken images: ${broken.join(', ')}`);
};

const assertBackgroundLoaded = async (page, route) => {
  const background = await page.locator('.mob-module .bg-blur').evaluate(element => getComputedStyle(element).backgroundImage);
  const match = background.match(/url\(["']?(.+?)["']?\)/);
  assert(match?.[1], `${route} has no Mob background image URL`);
  const loaded = await page.evaluate(src => new Promise(resolve => {
    const image = new Image();
    image.onload = () => resolve(image.naturalWidth > 0);
    image.onerror = () => resolve(false);
    image.src = src;
  }), match[1]);
  assert(loaded, `${route} failed to load Mob background image`);
};

const guides = [
  {
    route: '/maps/mob-of-the-dead/plane',
    heading: 'Plane + Bridge Trips',
    required: [/Control Valve/i, /Infirmary/i, /Citadel Tunnels/i],
  },
  {
    route: '/maps/mob-of-the-dead/retriever-skulls',
    heading: "Hell's Retriever + Skulls + Spoons",
    required: [/Broadway Cell Block/i, /Citadel Tunnels/i, /third wooden pier pillar/i, /Cafeteria/i],
  },
  {
    route: '/maps/mob-of-the-dead/codes',
    heading: 'Afterlife Codes + Audio Trail',
    required: [/101/, /386/, /872/, /481/, /walkway between the Warden's Office and Cafeteria/i],
  },
  {
    route: '/maps/mob-of-the-dead/final-step',
    heading: 'Final Afterlife Flight',
    required: [/does not need fuel/i, /Weasel/i],
  },
];

const browser = await chromium.launch({ headless: true });
try {
  for (const { name: viewportName, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', error => errors.push(error.message));

    for (const guide of guides) {
      errors.length = 0;
      const response = await page.goto(`${base}${guide.route}`, { waitUntil: 'networkidle' });
      assert(response?.ok(), `${guide.route} returned ${response?.status()}`);
      assert.equal(errors.length, 0, `${guide.route} page errors: ${errors.join('; ')}`);
      await page.getByRole('heading', { name: guide.heading, level: 2 }).waitFor();
      const text = await page.locator('.mob-section-page').innerText();
      for (const required of guide.required) assert.match(text, required, `${guide.route} is missing ${required}`);
      await assertImagesLoaded(page, guide.route);
      await assertBackgroundLoaded(page, guide.route);
      await assertNoHorizontalOverflow(page, guide.route);
      results.push({ width, route: guide.route, passed: true });
    }

    // The guide is one sequence: 12 steps in order, the codes and audio trail readable without any clicks.
    errors.length = 0;
    await page.goto(`${base}/maps/mob-of-the-dead`, { waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Pop Goes the Weasel', level: 2 }).waitFor();
    assert.equal(await page.locator('li.guide-seq__step').count(), 12, 'Mob guide should list 12 steps');
    assert.equal(await page.locator('#codes h3').innerText(), 'Afterlife codes');
    const codesText = await page.locator('#codes').innerText();
    for (const code of ['101', '386', '872', '481']) assert.match(codesText, new RegExp(`\\b${code}\\b`), `Afterlife codes step shows ${code}`);
    assert.match(await page.locator('#audio').innerText(), /walkway, Warden.s Office ↔ Cafeteria/i);
    assert.equal(errors.length, 0, `Mob guide page errors: ${errors.join('; ')}`);
    await assertNoHorizontalOverflow(page, '/maps/mob-of-the-dead');
    results.push({ width, route: '/maps/mob-of-the-dead (step sequence)', passed: true });

    errors.length = 0;
    await page.goto(`${base}/maps/mob-of-the-dead/spoon`, { waitUntil: 'networkidle' });
    await page.waitForURL('**/maps/mob-of-the-dead/retriever-skulls');
    assert.equal(errors.length, 0, `legacy Mob spoon route page errors: ${errors.join('; ')}`);
    assert.equal(new URL(page.url()).pathname, '/maps/mob-of-the-dead/retriever-skulls');
    results.push({ width, route: '/maps/mob-of-the-dead/spoon → /retriever-skulls', passed: true });
    await context.close();
  }
} finally {
  await browser.close();
}

let existing = [];
try {
  existing = JSON.parse(await fs.readFile(reportUrl, 'utf8'));
} catch (error) {
  if (error.code !== 'ENOENT') throw error;
}
await fs.mkdir(new URL('./artifacts/', new URL('../', import.meta.url)), { recursive: true });
await fs.writeFile(reportUrl, JSON.stringify([...existing, ...results], null, 2));
console.log(`${results.length}/${results.length} Mob browser health checks passed.`);
