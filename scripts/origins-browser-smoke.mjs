import './smoke-ready.mjs'; // first: waits for the app to render after each navigation
/*
 * Origins, pure OG (Bryen 2026-11-23 "go pure og"): the OG Origins-Guide header with its five tabs, the OG Main
 * Steps / Tips page and the four OG staff pages, at every smoke viewport. Speed Run is hub-only and kept.
 */
import assert from 'node:assert/strict';
import { guideTabs, mainSteps } from './smoke-contract.mjs';
import { chromium } from 'playwright';
import { VIEWPORTS } from './smoke-viewports.mjs';

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const ROUTES = [
  ['/maps/origins', 'Main Guide'],
  ['/maps/origins/ice-staff', 'Ice Staff'],
  ['/maps/origins/fire-staff', 'Fire Staff'],
  ['/maps/origins/wind-staff', 'Wind Staff'],
  ['/maps/origins/lightning-staff', 'Lightning Staff'],
];
const TABS = ['Main Guide', 'Ice Staff', 'Fire Staff', 'Wind Staff', 'Lightning Staff'];
const results = [];

const assertNoHorizontalOverflow = async (page, label) => {
  const { scrollWidth, clientWidth } = await page.evaluate(() => ({ scrollWidth: document.documentElement.scrollWidth, clientWidth: document.documentElement.clientWidth }));
  assert(scrollWidth <= clientWidth + 1, `${label} overflows horizontally (${scrollWidth} > ${clientWidth})`);
};

// Where a pinned panel sits once the page has scrolled, against the bottom of what is pinned over it
// (the hub bar, plus the Origins tab row on wide screens).
const pinnedPanel = (page, selector) => page.evaluate((sel) => {
  const pinned = Math.max(0, ...[...document.querySelectorAll('.hub-header, .origins-plates')].map((el) => el.getBoundingClientRect().bottom).filter((bottom) => bottom > 0));
  const panel = document.querySelector(sel);
  const box = panel.getBoundingClientRect();
  const heading = panel.querySelector('h2, h3').getBoundingClientRect();
  return { pinned, top: box.top, bottom: box.bottom, heading: heading.top, sticky: getComputedStyle(panel).position === 'sticky', inner: panel.scrollHeight - panel.clientHeight };
}, selector);

// Waits until the page has stopped scrolling (the hub sets smooth scrolling unless motion is reduced).
const settle = (page) => page.evaluate(() => new Promise((resolve) => {
  let last = -1;
  let still = 0;
  const tick = () => {
    still = window.scrollY === last ? still + 1 : 0;
    last = window.scrollY;
    if (still >= 6) resolve();
    else requestAnimationFrame(tick);
  };
  tick();
}));

const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // ---- Shell: the OG header and five tabs over the robot, on every OG route ----
    for (const [route, current] of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const tabs = await guideTabs(page).evaluateAll((links) => links.map((link) => ({ label: link.textContent.trim(), current: link.getAttribute('aria-current') })));
      assert.deepEqual(tabs.map((tab) => tab.label), TABS, `${route}: Origins nav items in order`);
      assert.deepEqual(tabs.filter((tab) => tab.current === 'page').map((tab) => tab.label), [current], `${route}: the current nav item is marked`);
      assert.equal(await page.locator('.origins-module .revive-header-icon').count(), 2, `${route}: a Revive icon each side of the title`);
      const robot = await page.evaluate(() => [...document.querySelectorAll('.origins-module, .origins-module *')].some((el) => /Robot/.test(getComputedStyle(el).backgroundImage)));
      assert(robot, `${route}: the robot artwork is the page background`);
      const broken = await page.locator('.origins-module img').evaluateAll((imgs) => imgs.filter((img) => !(img.complete && img.naturalWidth > 0)).map((img) => img.src));
      assert.deepEqual(broken, [], `${route}: every image loads`);
      assert.equal(await page.locator('main a[href*="step-details"]').count(), 0, `${route}: no Step details link`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    assert.equal(await mainSteps(page).count(), 11, 'the OG Main Steps list has 11 steps');
    assert.equal(await page.locator('main audio').count(), 2, 'the OG main guide keeps both audio players');
    for (const old of ['og', 'step-details']) {
      await page.goto(`${base}/maps/origins/${old}`, { waitUntil: 'networkidle' });
      assert.equal(new URL(page.url()).pathname, '/maps/origins', `/${old} redirects to the main guide`);
    }
    results.push(`${name}: OG header, five tabs with the current one marked, robot background, images, no overflow`);

    // ---- Speed Run: a way back to the Main Guide ----
    // The switch strip is named for screen readers, and its demo link is a full tap target.
    await page.goto(`${base}/maps/origins/speed-run/lightning`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('group', { name: 'All seven switches at a glance' }).count(), 1, 'the switch strip is a named group');
    assert((await page.locator('.speedrun-alt-foot a').boundingBox()).height >= 44, 'the hildaless demo link is a 44px target');
    await page.goto(`${base}/maps/origins/speed-run`, { waitUntil: 'networkidle' });
    for (const link of await page.locator('.speedrun-foot a').all()) {
      assert((await link.boundingBox()).height >= 44, `Speed Run footer link "${await link.innerText()}" is a 44px target`);
    }
    const back = page.locator('a.speedrun-back');
    assert.equal(await back.getAttribute('href'), '/maps/origins', 'Speed Run leads back to the Main Guide');
    assert((await back.boundingBox()).height >= 44, 'Back to Main Guide is a 44px target');
    // Previous / Next move focus to the new checkpoint, so it is heard and focus never drops to the page when
    // the button turns disabled at either end; pressed from the bottom of a checkpoint, its title lands clear
    // of the pinned hub bar and tab row. A pick on the rail leaves focus on the rail.
    const speedPanel = page.locator('.speedrun-panel');
    const checkpoint = () => page.locator('.speedrun-panel__meta > span').textContent();
    for (let n = 2; n <= 8; n += 1) {
      const next = page.getByRole('button', { name: 'Next checkpoint' });
      const upcoming = await page.locator('.speedrun-checkpoint strong').nth(n - 1).textContent();
      assert.equal(await next.getAttribute('aria-label'), `Next checkpoint: ${upcoming}`, `Next names checkpoint ${n} as its destination`);
      await next.evaluate((el) => el.scrollIntoView({ block: 'end', behavior: 'instant' }));
      await next.focus();
      await page.keyboard.press('Enter');
      await settle(page);
      assert.equal(await checkpoint(), `Checkpoint ${n} of 8`, `Next opens checkpoint ${n}`);
      const land = await page.evaluate(() => ({
        pinned: Math.max(0, ...[...document.querySelectorAll('.hub-header, .origins-top')]
          .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position)).map((el) => el.getBoundingClientRect().bottom)),
        title: document.querySelector('.speedrun-panel h3').getBoundingClientRect().top,
        focused: document.activeElement?.classList.contains('speedrun-panel'),
      }));
      assert(land.focused, `Next to checkpoint ${n}: focus moves to the checkpoint`);
      assert(land.title >= land.pinned && land.title <= height - 40, `Next to checkpoint ${n}: its title is at ${Math.round(land.title)}px (pinned chrome ends at ${Math.round(land.pinned)}px)`);
    }
    assert(await page.getByRole('button', { name: 'Next checkpoint' }).isDisabled(), 'Next stops at the last checkpoint');
    assert.equal(await speedPanel.getAttribute('aria-labelledby'), await page.locator('.speedrun-panel h3').getAttribute('id'), 'the checkpoint is named by its title');
    await page.locator('.speedrun-checkpoint').nth(1).click();
    assert(await page.locator('.speedrun-checkpoint').nth(1).evaluate((el) => el === document.activeElement), 'a rail pick keeps focus on the rail');
    await page.getByRole('button', { name: 'Previous checkpoint' }).focus();
    await page.keyboard.press('Enter');
    await settle(page);
    assert.equal(await checkpoint(), 'Checkpoint 1 of 8', 'Previous opens checkpoint 1');
    assert(await speedPanel.evaluate((el) => el === document.activeElement), 'Previous to the first checkpoint keeps focus on the checkpoint');

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}
console.log(`${results.length} Origins checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
