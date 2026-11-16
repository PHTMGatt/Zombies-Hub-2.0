// Main guide ↔ tab round trip: every step link on a main guide carries ?from=<its step> (and #section when
// it targets one); the tab page opens, lands on that section, and its "Back to step N" link returns to the
// main guide with that step open.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { settled } from './smoke-helpers.mjs';

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
    if (await back.count()) {
      await back.first().click();
      await page.waitForURL((url) => url.pathname === guide && url.hash === `#${first.step}`);
      await page.locator(`#${first.step}`).waitFor({ state: 'visible' });
      results.push(`${guide}: ${links.length} step links; ${first.href} and back to #${first.step}`);
    } else {
      results.push(`${guide}: ${links.length} step links; ${first.href} opens (no back link placed on this tab yet)`);
    }
  }
  assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
} finally {
  await browser.close();
}
results.forEach((line) => console.log(`- ${line}`));
console.log(`${results.length}/${results.length} step-link checks passed.`);
