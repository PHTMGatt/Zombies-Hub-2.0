// Shangri-La is the deliberately empty main Easter Egg (Bryen, 2026-11-16): its guide route keeps the "Coming Soon"
// page, its card on /easter-eggs keeps "No guide yet", and the way back works. A filled-in empty map
// (TranZit) shows the small video card instead; Ascension keeps its video guide.
import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { settled } from './smoke-helpers.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const page = await (await browser.newContext({ viewport: { width, height } })).newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(`${base}/easter-eggs/shangri-la`, { waitUntil: 'networkidle' });
    await settled(page);
    assert.equal(await page.locator('h1').first().textContent(), 'Coming Soon', `${name}: Shangri-La route shows Coming Soon`);
    assert.equal(await page.locator('iframe').count(), 0, `${name}: no video player on Coming Soon`);
    await page.locator('.coming-soon__link').click();
    await page.waitForURL(`${base}/easter-eggs`);

    const card = page.locator('a', { hasText: 'Shangri-La' }).filter({ hasText: /no guide yet/i }).first();
    await card.waitFor({ timeout: 10000 }).catch(() => {});
    assert(await card.count(), `${name}: Shangri-La card is listed`);
    assert.match(await card.innerText(), /no guide yet/i, `${name}: Shangri-La card still says "No guide yet"`);

    await page.goto(`${base}/easter-eggs/tranzit`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').first().textContent(), 'TranZit', `${name}: TranZit has its small card`);
    assert((await page.locator('.egg-guide__pending').innerText()).includes('Video guide coming soon'), `${name}: TranZit card says video coming soon`);

    await page.goto(`${base}/easter-eggs/ascension`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('iframe').count(), 1, `${name}: Ascension keeps its video`);
    assert.deepEqual(errors, [], `${name}: no page errors`);
    await page.context().close();
  }
  console.log(`coming-soon smoke passed at ${VIEWPORTS.length} viewports`);
} finally {
  await browser.close();
}
