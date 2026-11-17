import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
// Main guide ↔ tab round trip: every step link on a main guide carries ?from=<its step> (and #section when
// it targets one); the tab page opens, lands on that section, and its "Back to step N" link returns to the
// main guide with that step open. Opened any other way, a tab shows no back link.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { settled } from './smoke-helpers.mjs';
import { isFlat, readFlatDebt } from './main-guide-shape.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const guides = ['/maps/der-eisendrache', '/maps/gorod-krovi', '/maps/revelations', '/maps/zetsubou-no-shima'];
const results = [];
const browser = await chromium.launch({ headless: true });
try {
  const { width, height } = VIEWPORTS.find((viewport) => viewport.name === 'phone');
  const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));

  for (const guide of guides) {
    await page.goto(`${base}${guide}`, { waitUntil: 'networkidle' });
    const links = await page.locator('main a[data-step-link]').evaluateAll((anchors) => anchors.map((anchor) => ({
      href: anchor.getAttribute('href'),
      section: anchor.dataset.stepLink,
      step: anchor.closest('[id]:is(li, section, article)')?.id,
    })));
    assert(links.length > 0, `${guide}: the main guide links its steps to tabs`);
    for (const link of links) {
      const url = new URL(link.href, base);
      assert(url.pathname.startsWith(`${guide}/`), `${guide}: ${link.href} goes to one of its tabs`);
      assert.equal(url.searchParams.get('from'), link.step, `${guide}: ${link.href} says which step it came from`);
      if (link.section) assert.equal(url.hash, `#${link.section}`, `${guide}: ${link.href} targets its section`);
    }

    // Follow the first link and come back.
    const [first] = links;
    await page.goto(new URL(first.href, base).href, { waitUntil: 'networkidle' });
    await settled(page);
    assert.equal(await page.locator('[data-route-error]').count(), 0, `${first.href}: the tab loads`);
    if (first.section) {
      const top = await page.locator(`#${first.section}`).evaluate((element) => element.getBoundingClientRect().top);
      assert(top >= 0 && top < height / 2, `${first.href}: lands on #${first.section} (top ${Math.round(top)})`);
    }
    const back = page.locator(`[data-back-to-step="${first.step}"]`);
    assert.equal(await back.count(), 1, `${first.href}: one "Back to step" link`);
    assert((await back.boundingBox()).height >= 44, `${first.href}: the back link is a 44px target`);
    await back.click();
    await page.waitForURL((url) => url.pathname === guide && url.hash === `#${first.step}`);
    await page.locator(`#${first.step}`).waitFor({ state: 'visible' });
    results.push(`${guide}: ${links.length} step links; ${first.href} and back to #${first.step}`);
  }

  // A section deep link on a tab lands on that section, under the pinned header, with the back link.
  await page.goto(`${base}/maps/origins/fire-staff?from=build-staffs#puzzle`, { waitUntil: 'networkidle' });
  await settled(page);
  const puzzleTop = await page.locator('#puzzle').evaluate((element) => element.getBoundingClientRect().top);
  assert(puzzleTop >= 0 && puzzleTop < height / 2, `Fire Staff #puzzle lands in view (top ${Math.round(puzzleTop)})`);
  assert(await page.locator('[data-back-to-step="build-staffs"]').isVisible(), 'Fire Staff offers the way back to its step');
  await page.goto(`${base}/maps/origins/fire-staff?from=not-a-step`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-back-to-step]').count(), 0, 'an unknown ?from= shows no back link');
  await page.goto(`${base}/maps/origins/fire-staff`, { waitUntil: 'networkidle' });
  assert.equal(await page.locator('[data-back-to-step]').count(), 0, 'opened from the nav: no back link');
  results.push('Origins Fire Staff: #puzzle lands in view; back link only when opened from a real step');
  // A guide whose data is flat (no leftovers in fixtures/main-guide-flat.json) must also render flat:
  // no expanding cards, no images, video or maps, every step about two lines.
  const debt = readFlatDebt();
  const allGuides = Object.keys(debt).filter((key) => key !== '_note');
  const flatGuides = allGuides.filter((guide) => isFlat(guide, debt));
  for (const guide of flatGuides) {
    await page.goto(`${base}/maps/${guide}`, { waitUntil: 'networkidle' });
    await settled(page);
    const shape = await page.evaluate(() => {
      // The guide itself, not the map's header or nav around it.
      const main = document.querySelector('main .flat-guide') ?? document.querySelector('main');
      const steps = [...main.querySelectorAll('li[id]')];
      return {
        steps: steps.length,
        folds: main.querySelectorAll('details, [aria-expanded]').length,
        media: main.querySelectorAll('img, video, iframe, picture, canvas').length,
        // Lines of each step's one explanation (the goal, ≤ 140 characters: two lines on a desktop, up to four
        // on a 390px phone), and how many explanation paragraphs a step has (one).
        tallest: Math.max(0, ...steps.map((step) => [...step.querySelectorAll('.flat-guide__line')].reduce((lines, line) => {
          const lineHeight = parseFloat(getComputedStyle(line).lineHeight) || 24;
          return lines + Math.round(line.getBoundingClientRect().height / lineHeight);
        }, 0))),
        paragraphs: Math.max(0, ...steps.map((step) => step.querySelectorAll('.flat-guide__line').length)),
      };
    });
    assert(shape.steps > 0, `${guide}: the flat guide lists its steps`);
    assert(await page.locator('main .flat-guide').count(), `${guide}: renders the flat guide (FlatGuide)`);
    assert.equal(shape.folds, 0, `${guide}: a flat guide has no expanding cards`);
    assert.equal(shape.media, 0, `${guide}: a flat guide has no images, video or maps`);
    assert(shape.paragraphs <= 1, `${guide}: each step has one explanation line`);
    // The ≤ 140-character rule is enforced on the data; on screen it may wrap to a few lines on a phone.
    assert(shape.tallest <= 6, `${guide}: each explanation is short (longest wraps to ${shape.tallest} lines at ${width}px)`);
    results.push(`${guide}: renders flat (${shape.steps} steps)`);
  }
  results.push(`flat main guides: ${flatGuides.length} of ${allGuides.length}${flatGuides.length < allGuides.length ? ' (the rest are listed in fixtures/main-guide-flat.json)' : ''}`);
  assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
} finally {
  await browser.close();
}
results.forEach((line) => console.log(`- ${line}`));
console.log(`${results.length}/${results.length} step-link checks passed.`);
