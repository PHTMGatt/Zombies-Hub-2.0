// Shangri-La is the deliberately empty main Easter Egg (Bryen, 2026-11-16): its guide route keeps the "Coming Soon"
// page, its card on /easter-eggs keeps "No guide yet", and the way back works. TranZit and Die Rise show the small video card instead; Ascension keeps its video guide.
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
    assert.match(await page.locator('h1').first().textContent(), /coming soon/i, `${name}: Shangri-La route shows Coming Soon`);
    assert.match(await page.locator('.coming-soon__teaser').innerText(), /Progress saving[\s\S]*Coming soon/i, `${name}: the progress-saving teaser is there`);
    assert.equal(await page.locator('iframe').count(), 0, `${name}: no video player on Coming Soon`);
    assert.match(await page.locator('.coming-soon__map').innerText(), /Shangri-La · Black Ops 1/, `${name}: the empty entry says it is the Black Ops 1 version`);
    await page.locator('.coming-soon__links a', { hasText: /Back to Shangri-La/ }).click();
    await page.waitForURL(/\/maps\/shangri-la/);
    await page.goto(`${base}/easter-eggs`, { waitUntil: 'networkidle' });

    const card = page.locator('a', { hasText: 'Shangri-La' }).filter({ hasText: /no guide yet/i }).first();
    await card.waitFor({ timeout: 10000 }).catch(() => {});
    assert(await card.count(), `${name}: Shangri-La card is listed`);
    assert.match(await card.innerText(), /no guide yet/i, `${name}: Shangri-La card still says "No guide yet"`);

    await page.goto(`${base}/easter-eggs/shangri-la-chronicles`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').first().textContent(), 'Shangri-La', `${name}: the BO3 Shangri-La entry has its own page`);
    assert.match(await page.locator('.egg-guide__header span').innerText(), /Black Ops 3/, `${name}: the BO3 page is labelled Black Ops 3`);
    assert.match(await page.locator('.egg-guide__video iframe').getAttribute('src'), /tctR5oCbxWk/, `${name}: BO3 Shangri-La embeds its verified video`);

    await page.goto(`${base}/easter-eggs/tranzit`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').first().textContent(), 'TranZit', `${name}: TranZit has its video page`);
    assert.match(await page.locator('.egg-guide__video iframe').getAttribute('src'), /0thNmxkIYH0/, `${name}: TranZit embeds its verified video`);

    await page.goto(`${base}/easter-eggs/die-rise`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('h1').first().textContent(), 'Die Rise', `${name}: Die Rise has its video page`);
    assert.match(await page.locator('.egg-guide__video iframe').getAttribute('src'), /kpMbNt_dyME/, `${name}: Die Rise embeds its verified video`);

    await page.goto(`${base}/easter-eggs/ascension`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('iframe').count(), 1, `${name}: Ascension keeps its video`);
    // World at War originals are their own entries, and a map in two games links its other versions.
    await page.goto(`${base}/allmaps`, { waitUntil: 'networkidle' });
    const wawSection = page.locator('.game-section', { has: page.locator('.game-title', { hasText: 'World at War' }) });
    assert.equal(await wawSection.locator('h3').count(), 4, `${name}: four World at War entries on /allmaps`);
    await page.goto(`${base}/info/der-riese`, { waitUntil: 'networkidle' });
    const same = await page.locator('.same-map').innerText();
    assert(/The Giant · Black Ops 3/.test(same) && /World at War/.test(same), `${name}: Der Riese links The Giant and its World at War entry`);
    await page.goto(`${base}/info/the-giant`, { waitUntil: 'networkidle' });
    assert.match(await page.locator('.same-map').innerText(), /Der Riese/, `${name}: The Giant links Der Riese`);
    assert.deepEqual(errors, [], `${name}: no page errors`);
    await page.context().close();
  }
  console.log(`coming-soon smoke passed at ${VIEWPORTS.length} viewports`);
} finally {
  await browser.close();
}
