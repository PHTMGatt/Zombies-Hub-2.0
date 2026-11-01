/*
 * Origins field-sheet redesign: title block, elemental nav plates, run sheet, staff board and the
 * Build / Puzzle / Upgrade staff pages, at every smoke viewport.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { loadModules } from './guide-content.mjs';

const [{ default: originsGuide }] = await loadModules(['maps/origins/src/data/originsGuide.jsx']);
const TRACKER_LABELS = ['Ice built', 'Fire built', 'Wind built', 'Lightning built', 'Ice upgraded', 'Fire upgraded', 'Wind upgraded', 'Lightning upgraded',
  'Wind → Odin', 'Ice → Freya', 'Lightning → Thor', 'Fire → mound', 'Gen 5 chest', 'Mound chest', 'Gen 6 chest', 'Juggernog chest'];
const STAFFS = ['ice', 'fire', 'wind', 'lightning'];

// WCAG contrast of two computed rgb() colours.
const contrastScript = () => {
  window.__contrast = (fg, bg) => {
    const parse = (c) => c.match(/[\d.]+/g).slice(0, 3).map(Number);
    const lum = (rgb) => {
      const [r, g, b] = rgb.map((v) => { const s = v / 255; return s <= 0.03928 ? s / 12.92 : ((s + 0.055) / 1.055) ** 2.4; });
      return 0.2126 * r + 0.7152 * g + 0.0722 * b;
    };
    const [a, b] = [lum(parse(fg)), lum(parse(bg))].sort((x, y) => y - x);
    return (a + 0.05) / (b + 0.05);
  };
};

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const ROUTES = [
  ['/maps/origins', 'Guide'],
  ['/maps/origins/ice-staff', 'Ice'],
  ['/maps/origins/fire-staff', 'Fire'],
  ['/maps/origins/wind-staff', 'Wind'],
  ['/maps/origins/lightning-staff', 'Lightning'],
  ['/maps/origins/speed-run', 'Speed Run'],
];
const PLATES = ['Guide', 'Ice', 'Fire', 'Wind', 'Lightning', 'Speed Run'];
const results = [];

const assertNoHorizontalOverflow = async (page, label) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert(scrollWidth <= clientWidth + 1, `${label} overflows horizontally (${scrollWidth} > ${clientWidth})`);
};

const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // ---- Shell: title block, nav plates, nothing behind the reading surface ----
    for (const [route, current] of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.equal((await page.locator('.origins-mast h1').innerText()).trim().toLowerCase(), 'origins', `${route}: title block names the map`);
      const plates = await page.locator('.origins-plates a').evaluateAll((links) => links.map((link) => {
        const box = link.getBoundingClientRect();
        return { label: link.getAttribute('aria-label') || link.textContent.trim(), current: link.getAttribute('aria-current'), top: box.top, left: box.left, right: box.right, height: box.height };
      }));
      assert.deepEqual(plates.map((plate) => plate.label), PLATES, `${route}: six plates in order`);
      assert.deepEqual(plates.filter((plate) => plate.current === 'page').map((plate) => plate.label), [current], `${route}: the current plate is marked`);
      for (const plate of plates) {
        assert(plate.height >= 48, `${route}: ${plate.label} plate is ${Math.round(plate.height)}px tall`);
        assert(plate.left >= -1 && plate.right <= width + 1, `${route}: ${plate.label} plate is clipped at ${width}px`);
      }
      assert(new Set(plates.map((plate) => Math.round(plate.top))).size === 1, `${route}: plates sit on one row`);
      const pinned = await page.evaluate(() => {
        const hub = document.querySelector('.hub-header');
        const hubPinned = ['fixed', 'sticky'].includes(getComputedStyle(hub).position);
        const hubBottom = hubPinned ? hub.getBoundingClientRect().bottom : 0;
        const below = [...document.querySelectorAll('.origins-module *')]
          .filter((element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position) && element.closest('header, [data-pinned]') === element)
          .reduce((sum, element) => sum + element.getBoundingClientRect().height, 0);
        return { below: Math.round(below), hubBottom };
      });
      assert(pinned.below <= (name === 'landscape' ? 0 : 64), `${route}: ${pinned.below}px pinned under the hub bar at ${name}`);
      const glass = await page.evaluate(() => [...document.querySelectorAll('main *')].filter((element) => {
        const filter = getComputedStyle(element).backdropFilter;
        return filter && filter !== 'none';
      }).length);
      assert.equal(glass, 0, `${route}: no backdrop-filter glass inside the page`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }
    results.push(`${name}: title block, six nav plates, pinned chrome and no glass on every Origins route`);

    // ---- Main Guide: run sheet on the survey spine + staff board ----
    await page.addInitScript(contrastScript);
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const rendered = await page.locator('li.run-step').evaluateAll((items) => items.map((item) => ({ id: item.id, title: item.querySelector('h3')?.textContent.trim() })));
    assert.deepEqual(rendered.map((item) => item.id), originsGuide.map((step) => step.id), 'run sheet keeps the 11 steps in order');
    assert.deepEqual(rendered.map((item) => item.title), originsGuide.map((step) => step.title), 'run sheet titles match the data');
    for (const step of originsGuide) {
      assert(await page.locator(`#${step.id} .run-step__answer`).isVisible(), `${step.id}: answer visible without opening anything`);
      assert.equal((await page.locator(`#${step.id} .run-step__answer`).innerText()).trim(), step.goal, `${step.id}: answer is the step goal`);
    }
    const mainText = await page.locator('main').innerText();
    assert.equal(await page.locator('.switch-board').count(), 0, 'no switch board on the Main Guide');
    assert.deepEqual(TRACKER_LABELS.filter((label) => mainText.includes(label)), [], 'no tracker-only lines on the Main Guide');
    for (const staff of STAFFS) {
      assert((await page.locator(`a[href="/maps/origins/${staff}-staff"]:visible`).count()) > 0, `a visible link to the ${staff} staff page`);
    }
    const lightningUpgrade = page.locator('#upgrade-staffs [data-staff="lightning"]:visible').first();
    assert.equal(await lightningUpgrade.evaluate((el) => el.tagName === 'DETAILS' && !el.open), name !== 'desktop', 'staff rows start closed on phone and landscape');
    if (name !== 'desktop') await lightningUpgrade.locator('summary').click();
    assert.equal(await lightningUpgrade.locator('a[href="/maps/origins/lightning-staff#switches"]').count(), 1, 'step 2 links straight to the Lightning switch board');
    for (const chord of ['1 · 3 · 6', '3 · 5 · 7', '2 · 4 · 6']) assert((await lightningUpgrade.innerText()).includes(chord), `Lightning upgrade shows chord ${chord}`);
    const iceUpgrade = page.locator('#upgrade-staffs [data-staff="ice"]:visible').first();
    if (name !== 'desktop') await iceUpgrade.locator('summary').click();
    const icePrereqs = await iceUpgrade.locator('ul.staff-upgrade__either li').allInnerTexts();
    assert.deepEqual(icePrereqs.map((text) => text.trim()), ['Crazy Place: match blue-dot pillar → ceiling stone, shoot it', 'Freeze 3 gravestones → shatter with bullets'], 'Ice puzzle and gravestone lines sit in one unnumbered list');
    assert.doesNotMatch(await iceUpgrade.innerText(), /either order|any order/i, 'the Main Guide makes no order claim for the Ice pair');
    assert.equal(await page.locator('.origins-guide__credits audio[aria-label]').count(), 2, 'credits keep both named audio clips');
    assert.equal(await page.getByRole('button', { name: 'I completed this Easter Egg' }).count(), 1, 'completion action present');

    const type = await page.evaluate(() => {
      const answer = getComputedStyle(document.querySelector('.run-step__answer'));
      const label = document.querySelector('.run-step .gref__label, .staff-board dt, .staff-row dt');
      const ground = getComputedStyle(document.querySelector('.origins-module')).backgroundColor;
      return {
        answerSize: parseFloat(answer.fontSize),
        answerFont: answer.fontFamily,
        answerContrast: window.__contrast(answer.color, ground),
        labelContrast: label ? window.__contrast(getComputedStyle(label).color, ground) : 99,
      };
    });
    assert(type.answerSize >= 16, `answers are ${type.answerSize}px`);
    assert.doesNotMatch(type.answerFont, /^\s*['"]?Rajdhani/i, 'answers use the body font, not Rajdhani');
    assert(type.answerContrast >= 4.5 && type.labelContrast >= 4.5, `contrast answer ${type.answerContrast.toFixed(2)} / label ${type.labelContrast.toFixed(2)}`);

    // Exactly one staff layout per size: board + columns on desktop, tap rows below it.
    const shown = await page.evaluate(() => ({
      rows: [...document.querySelectorAll('details.staff-row')].filter((el) => el.checkVisibility()).length,
      wide: [...document.querySelectorAll('.staff-board, .staff-columns')].filter((el) => el.checkVisibility()).length,
    }));
    assert.deepEqual(shown, name === 'desktop' ? { rows: 0, wide: 2 } : { rows: 8, wide: 0 }, `${name}: one staff layout at a time`);

    if (name === 'desktop') {
      const layout = await page.evaluate(() => {
        const board = document.querySelector('.staff-board').getBoundingClientRect();
        const sheet = document.querySelector('.run-sheet__steps').getBoundingClientRect();
        // Height of the chrome that stays pinned once the page scrolls: the hub bar plus the nav plates.
        const pinned = document.querySelector('.hub-header').getBoundingClientRect().height + document.querySelector('.origins-plates').getBoundingClientRect().height;
        return { boardWidth: board.width, boardHeight: board.height, sheetWidth: sheet.width, sticky: getComputedStyle(document.querySelector('.staff-board')).position, room: window.innerHeight - pinned - 24 };
      });
      assert(layout.boardWidth <= 400, `staff board is ${Math.round(layout.boardWidth)}px wide`);
      assert(layout.sheetWidth >= 640, `run sheet keeps ${Math.round(layout.sheetWidth)}px of reading width`);
      if (layout.sticky === 'sticky') assert(layout.boardHeight <= layout.room, `sticky board (${Math.round(layout.boardHeight)}px) fits the viewport (${Math.round(layout.room)}px)`);
    } else {
      await page.reload({ waitUntil: 'networkidle' });
      for (const id of ['build-staffs', 'upgrade-staffs']) {
        const rows = page.locator(`#${id} details.staff-row`);
        assert.equal(await rows.count(), 4, `${id}: four staff rows`);
        assert.equal(await rows.evaluateAll((items) => items.filter((item) => item.open).length), 0, `${id}: rows start closed`);
        for (let index = 0; index < 4; index += 1) {
          const box = await rows.nth(index).locator('summary').boundingBox();
          assert(box.height >= 52, `${id}: row summary ${Math.round(box.height)}px tall`);
        }
      }
      const first = page.locator('#build-staffs details.staff-row').nth(0);
      const second = page.locator('#build-staffs details.staff-row').nth(1);
      const indicator = (row) => row.locator('summary').evaluate((el) => getComputedStyle(el, '::after').content);
      const closedMark = await indicator(first);
      await first.locator('summary').click();
      assert(await first.evaluate((el) => el.open), 'tapping a row opens it');
      assert.notEqual(await indicator(first), closedMark, 'an open row shows a different indicator');
      assert(await first.locator('dl').isVisible(), 'an open row shows its facts');
      await second.locator('summary').click();
      assert(await first.evaluate((el) => el.open) && await second.evaluate((el) => el.open), 'several rows can be open at once');
      await page.reload({ waitUntil: 'networkidle' });
      const positions = await page.evaluate(() => {
        const title = document.querySelector('li.run-step h3').getBoundingClientRect();
        return { firstBottom: title.bottom, step3: document.getElementById('secure-keys').getBoundingClientRect().top, viewport: window.innerHeight };
      });
      assert(positions.firstBottom <= positions.viewport, `first step title ends at ${Math.round(positions.firstBottom)}px, below the first screen`);
      const limit = (name === 'phone' ? 2 : 3) * positions.viewport;
      assert(positions.step3 < limit, `step 3 starts at ${Math.round(positions.step3)}px (limit ${limit})`);
    }
    results.push(`${name}: run sheet, answers, staff board / rows, Lightning link, Ice pair, type and contrast`);

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} Origins checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
