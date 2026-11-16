/*
 * Search finds the pages added on 2026-11-16: every Step details tab, the hub-only maps, the World at War originals
 * and the video / Coming Soon maps. Each query's first result must point at the right route, and opening it must
 * land on a page that names the thing searched for. (The ranking itself is unit-tested in search-index.test.mjs.)
 */
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { settled } from './smoke-helpers.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
// [query, expected href of the first result, text the opened page must show]
const cases = [
  ['gorod step details', '/maps/gorod-krovi/step-details', /Step details/i],
  ['origins step details', '/maps/origins/step-details', /Step details/i],
  ['ascension', '/easter-eggs/ascension', /Ascension/],
  ['tranzit', '/easter-eggs/tranzit', /TranZit/],
  ['die rise', '/easter-eggs/die-rise', /Die Rise/],
  ['buried', '/easter-eggs/buried', /Buried/],
  ['the giant', '/easter-eggs/the-giant', /The Giant/],
  ['shangri la bo3', '/easter-eggs/shangri-la-chronicles', /Black Ops 3/],
  ['shangri la', '/easter-eggs/shangri-la', /Coming soon/i],
  ['waw nacht', '/info/nacht-der-untoten?game=World%20at%20War', /World at War/],
  ['verruckt world at war', '/info/verr%C3%BCckt?game=World%20at%20War', /World at War/],
  ['der riese', '/info/der-riese?game=Black%20Ops%201', /Der Riese/],
];

const browser = await chromium.launch({ headless: true });
try {
  const { width, height } = VIEWPORTS.find((viewport) => viewport.name === 'phone');
  const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
  const errors = [];
  page.on('pageerror', (error) => errors.push(error.message));
  for (const [query, href, shows] of cases) {
    await page.goto(`${base}/search`, { waitUntil: 'networkidle' });
    await page.getByRole('searchbox').fill(query);
    const first = page.locator('.zh-search__results li a').first();
    await first.waitFor();
    assert.equal(decodeURI(await first.getAttribute('href')), decodeURI(href), `"${query}" first result goes to ${href}`);
    await first.click();
    await page.waitForURL((url) => !url.pathname.endsWith('/search'));
    await page.waitForLoadState('networkidle');
    await settled(page);
    await page.locator('body').filter({ hasText: shows }).waitFor({ timeout: 10000 }).catch(() => assert.fail(`"${query}" opens a page that shows ${shows}`));
  }
  // "world at war" lists all four originals.
  await page.goto(`${base}/search`, { waitUntil: 'networkidle' });
  await page.getByRole('searchbox').fill('world at war');
  const listed = (await page.locator('.zh-search__results li').allInnerTexts()).join('\n');
  for (const name of ['Nacht der Untoten', 'Verrückt', 'Shi No Numa', 'Der Riese']) assert(listed.includes(name), `"world at war" lists ${name}`);
  assert.deepEqual(errors, [], 'no page errors');
  console.log(`${cases.length + 1} search coverage checks passed.`);
} finally {
  await browser.close();
}
