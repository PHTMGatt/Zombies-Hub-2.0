/*
 * Origins, the OG guide cleaned up: the blue title band with its five tabs, the lean Main Steps with
 * Tips and Speed Run, and the Build / Puzzle / Upgrade staff pages, at every smoke viewport.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { loadModules } from './guide-content.mjs';

const [{ default: staffPages }, { staffPlaces }] = await loadModules(['maps/origins/src/data/originsStaffPages.js', 'maps/origins/src/data/originsPlaces.js']);
const staffLines = JSON.parse((await import('node:fs')).readFileSync(new URL('./fixtures/origins-staff-pages.baseline.json', import.meta.url), 'utf8'));
const STAFFS = ['ice', 'fire', 'wind', 'lightning'];

const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const ROUTES = [
  ['/maps/origins', 'UI Main Guide'],
  ['/maps/origins/og', 'OG'],
  ['/maps/origins/ice-staff', 'Ice Staff'],
  ['/maps/origins/fire-staff', 'Fire Staff'],
  ['/maps/origins/wind-staff', 'Wind Staff'],
  ['/maps/origins/lightning-staff', 'Lightning Staff'],
  ['/maps/origins/speed-run', 'Speed Run'],
];
const TABS = ['UI Main Guide', 'OG', 'Ice Staff', 'Fire Staff', 'Wind Staff', 'Lightning Staff', 'Speed Run'];
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

// Robot names on a sketch that no pin or tunnel covers (an "Odin" read as "Udin" under the Wind tunnel).
const robotLabelClashes = (page, figure) => page.locator(figure).evaluate((root) => {
  const hit = (a, b) => a.left < b.right - 0.5 && b.left < a.right - 0.5 && a.top < b.bottom - 0.5 && b.top < a.bottom - 0.5;
  const marks = [...root.querySelectorAll('.omap__pins .omap__pin, .omap__tunnels path')];
  return [...root.querySelectorAll('.omap__robots text')].flatMap((label) => marks
    .filter((mark) => hit(label.getBoundingClientRect(), mark.getBoundingClientRect()))
    .map((mark) => `${label.textContent} under ${mark.textContent ? `pin ${mark.textContent}` : mark.getAttribute('class')}`));
});

const browser = await chromium.launch({ headless: true });
try {
  for (const { name, width, height } of VIEWPORTS) {
    const context = await browser.newContext({ viewport: { width, height } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // ---- Shell: main's Origins header and nav over the robot (merge with main, 2026-11-15) ----
    // Header height and the active link in view are checked in browser-smoke.mjs; this covers every route.
    for (const [route, current] of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const tabs = await page.locator('.origins-nav-link').evaluateAll((links) => links.map((link) => {
        const box = link.getBoundingClientRect();
        return { label: link.textContent.trim(), current: link.getAttribute('aria-current'), left: box.left, right: box.right };
      }));
      assert.deepEqual(tabs.map((tab) => tab.label), TABS, `${route}: Origins nav items in order`);
      assert.deepEqual(tabs.filter((tab) => tab.current === 'page').map((tab) => tab.label), [current], `${route}: the current nav item is marked`);
      const robot = await page.evaluate(() => /Robot/.test(getComputedStyle(document.querySelector('.origins-module')).backgroundImage));
      assert(robot, `${route}: the robot artwork is the page background`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }
    results.push(`${name}: Origins nav in order with the current item marked, robot background, no overflow on every Origins route`);

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

    // ---- Staff pages: Build → Puzzle → Upgrade ----
    for (const staff of STAFFS) {
      const route = `/maps/origins/${staff}-staff`;
      const data = staffPages[staff];
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      const order = await page.evaluate(() => ['build', 'puzzle', 'upgrade'].map((id) => {
        const el = document.getElementById(id);
        return el ? el.getBoundingClientRect().top + window.scrollY : null;
      }));
      assert(order.every((top) => top !== null), `${route}: has #build, #puzzle and #upgrade`);
      if (name === 'phone') {
        assert(order[0] < order[1] && order[1] < order[2], `${route}: Build, Puzzle, Upgrade read in order on phones`);
        const jumps = await page.locator('.staff-page__jump a').evaluateAll((links) => links.map((link) => ({ label: link.textContent.trim(), top: Math.round(link.getBoundingClientRect().top) })));
        assert.deepEqual(jumps.map((jump) => jump.label), ['Build', 'Map', 'Puzzle', 'Upgrade'], `${route}: four section jumps`);
        assert.equal(new Set(jumps.map((jump) => jump.top)).size, 1, `${route}: the section jumps share one row`);
      }
      const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      const lower = text.toLowerCase();
      for (const line of staffLines[staff].lines) {
        assert(text.includes(line.text), `${route}: keeps "${line.text}"`);
        if (line.label && line.label !== 'Excavation') assert(lower.includes(line.label.toLowerCase()), `${route}: keeps the label "${line.label}"`);
      }

      // The staff's Map: every spot pinned and said in words, between Build and Puzzle.
      const mapTop = await page.evaluate(() => document.getElementById('map')?.getBoundingClientRect().top + window.scrollY);
      assert(mapTop > order[0] && mapTop < order[1], `${route}: Map sits between Build and Puzzle`);
      assert.equal(await page.locator('#map .omap__pins .omap__pin').count(), staffPlaces[staff].pins.length, `${route}: one pin per spot`);
      assert.deepEqual(await page.locator('#map .omap__key li').evaluateAll((items) => items.map((li) => li.textContent.trim())),
        staffPlaces[staff].pins.map((pin, i) => `${i + 1}${pin.text}`), `${route}: the key lists every spot in order`);
      if (staffPlaces[staff].layers?.includes('robots')) assert.deepEqual(await robotLabelClashes(page, '#map figure'), [], `${route}: robot names covered`);

      // The chart opens full screen and closes again (button, Esc), returning focus to the chart.
      const open = page.locator('#puzzle .zoom-image__open');
      await open.click();
      const dialog = page.locator('dialog.zoom-image__dialog[open]');
      await dialog.waitFor();
      await page.waitForFunction(() => {
        const img = document.querySelector('dialog.zoom-image__dialog[open] img');
        return img?.complete && img.naturalWidth > 0;
      }, null, { timeout: 5000 });
      const shown = await dialog.locator('img').boundingBox();
      if (name === 'phone') assert(shown.width >= width * 0.9, `${route}: full-screen chart is ${Math.round(shown.width)}px wide`);
      await page.keyboard.press('Escape');
      await dialog.waitFor({ state: 'detached' }).catch(() => {});
      assert.equal(await page.locator('dialog.zoom-image__dialog[open]').count(), 0, `${route}: Esc closes the chart`);
      assert(await open.evaluate((el) => document.activeElement === el), `${route}: focus returns to the chart`);
      await open.click();
      await dialog.waitFor();
      const close = dialog.getByRole('button', { name: 'Close' });
      assert((await close.boundingBox()).height >= 48, `${route}: Close is a 48px target`);
      await close.click();
      assert.equal(await page.locator('dialog.zoom-image__dialog[open]').count(), 0, `${route}: Close closes the chart`);
      // A tap on the dark area around the chart closes it too.
      await open.click();
      await dialog.waitFor();
      await page.mouse.click(4, height - 4);
      assert.equal(await page.locator('dialog.zoom-image__dialog[open]').count(), 0, `${route}: a backdrop tap closes the chart`);

      // The shared Excavation reference: four rings in the staff's colour, no lever-to-ring labels.
      const rings = page.locator('#upgrade .excavation-rings');
      assert.equal(await rings.count(), 1, `${route}: one Excavation ring reference`);
      assert.equal(await rings.locator('svg ellipse.excavation-rings__ring').count(), 4, `${route}: four rings drawn`);
      const ringText = await rings.innerText();
      assert.match(ringText, new RegExp(data.ring.word), `${route}: rings set to ${data.ring.word}`);
      assert.doesNotMatch(ringText, /Mule Kick|staircase|wooden platform/i, `${route}: no lever-to-ring mapping in the shared reference`);

      const chart = await page.locator('#puzzle .zoom-image__open img').boundingBox();
      if (name === 'desktop') {
        assert(order[2] - (await page.evaluate(() => window.scrollY)) < height, `${route}: Upgrade is on the first screen`);
        // Pinned beside the long column, Upgrade stays clear of the pinned chrome and whole on screen.
        await page.evaluate(() => window.scrollTo(0, 600));
        const side = await pinnedPanel(page, '.staff-page__side');
        if (side.sticky) {
          assert(side.heading >= side.pinned, `${route}: pinned Upgrade title at ${Math.round(side.heading)}px, under ${Math.round(side.pinned)}px of chrome`);
          assert(side.bottom <= height, `${route}: pinned Upgrade runs to ${Math.round(side.bottom)}px on a ${height}px screen`);
        }
      }
      if (name === 'phone') assert(chart.width >= 340, `${route}: chart is ${Math.round(chart.width)}px wide on phones`);
      if (name === 'landscape') {
        // The chart follows its steps, so it is checked where it sits: whole on the short screen.
        await page.evaluate(() => document.querySelector('#puzzle .zoom-image').scrollIntoView({ block: 'start', behavior: 'instant' }));
        const capped = await page.locator('#puzzle .zoom-image__open img').boundingBox();
        assert(capped.height <= 290, `${route}: chart is ${Math.round(capped.height)}px tall in landscape`);
        assert(capped.y >= -1 && capped.y + capped.height <= height + 1, `${route}: chart fits the landscape screen`);
      }
      const body = await page.evaluate(() => parseFloat(getComputedStyle(document.querySelector('#build dd')).fontSize));
      assert(body >= 16, `${route}: build facts are ${body}px`);
      assert.equal(await page.locator('#upgrade .excavation-rings__levers > g').count(), 4, `${route}: four levers drawn`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }

    // Ice: the gravestones are unordered; the symbol puzzle follows the game's sequence.
    await page.goto(`${base}/maps/origins/ice-staff`, { waitUntil: 'networkidle' });
    const anyOrder = page.locator('#upgrade .staff-any-order');
    assert.match(await anyOrder.innerText(), /any order/i, 'Ice gravestones carry "Any order"');
    assert.match(await anyOrder.innerText(), /three gravestones/, 'the "Any order" group holds the gravestone line');
    assert.match(await page.locator('#puzzle').innerText(), /Follow the order the game shows/, 'Ice puzzle explains the game-dependent order');

    // Lightning: chords, the switch board (its only home), the Speed Run link and the Electrical Panel.
    await page.goto(`${base}/maps/origins/lightning-staff#switches`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('#switches .switch-card .switch-dial').count(), 7, 'Lightning page has the seven switch dials');
    const lightningText = await page.locator('#puzzle').innerText();
    for (const chord of ['1-3-6', '3-5-7', '2-4-6']) assert(lightningText.includes(chord), `Lightning chord ${chord}`);
    assert.equal(await page.locator('a[href="/maps/origins/speed-run/lightning"]').count(), 1, 'Lightning page links to the Speed Run switch route');
    assert.equal(await page.getByRole('button', { name: /Electrical Panel/ }).count(), 1, 'Electrical Panel present');
    const switchesTop = await page.locator('#switches').evaluate((el) => el.getBoundingClientRect().top);
    assert(switchesTop >= 0 && switchesTop < height * 0.6, `#switches deep link lands near the top (${Math.round(switchesTop)}px)`);
    // Main Guide deep links (#rain-fire) are main's page now; guide-sequence-browser-smoke.mjs checks its landing.
    results.push(`${name}: four staff pages — order, every line, the staff map, zoomable chart, ring reference, Ice order rules, Lightning tools`);

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
    await context.close();
  }
  // A first visit on a phone fetches no staff chart until it is near the screen: the chart's closed
  // full-screen copy waits too (it was eager and pulled every chart, ~250–350 KB, on page load).
  // How far below the fold Chromium starts a lazy image depends on the build and the network it detects:
  // desktop Chrome on 4G uses 1250px, CI's headless Chromium starts the charts on first paint (they sit about
  // 1400–2600px down). So the test, not the page, puts the puzzle 8000px down, past every Chromium distance
  // (the longest is 4000px), before the page renders: the check reads the page's real markup on any browser.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    // Runs before any page script, so the first layout already has the puzzle far down.
    await context.addInitScript(() => {
      const add = () => {
        if (!document.head) return false;
        const style = document.createElement('style');
        style.textContent = '#puzzle { margin-top: 8000px !important; }';
        document.head.append(style);
        return true;
      };
      if (add()) return;
      const watch = new MutationObserver(() => { if (add()) watch.disconnect(); });
      watch.observe(document, { childList: true, subtree: true });
    });
    const page = await context.newPage();
    let checked = 0;
    for (const staff of STAFFS) {
      await page.goto(`${base}/maps/origins/${staff}-staff`, { waitUntil: 'networkidle' });
      const chart = await page.locator('#puzzle .zoom-image__open img').evaluate((img) => ({ file: img.getAttribute('src').split('/').pop(), top: img.getBoundingClientRect().top }));
      const fetched = () => page.evaluate((file) => performance.getEntriesByType('resource').some((entry) => entry.name.endsWith(file)), chart.file);
      assert(chart.top > 844 + 4000, `${staff}: the chart sits ${Math.round(chart.top)}px down, inside some browser's lazy-load distance`);
      assert(!(await fetched()), `${staff}: the chart (${chart.file}) loads before it is near the screen`);
      checked += 1;
      await page.locator('#puzzle .zoom-image__open img').scrollIntoViewIfNeeded();
      await page.waitForFunction(() => document.querySelector('#puzzle .zoom-image__open img').complete, null, { timeout: 5000 });
      assert(await fetched(), `${staff}: the chart loads once it is on screen`);
    }
    assert.equal(checked, STAFFS.length, 'every staff chart was checked');
    results.push('390x844 first visit: staff charts wait until they are near the screen');
    await context.close();
  }
  // Short desktop (1280x720): a pinned Upgrade column must fit under the pinned chrome, or not be pinned.
  {
    const context = await browser.newContext({ viewport: { width: 1280, height: 720 } });
    const page = await context.newPage();
    for (const staff of STAFFS) {
      await page.goto(`${base}/maps/origins/${staff}-staff`, { waitUntil: 'networkidle' });
      const fit = await page.evaluate(() => {
        const side = document.querySelector('.staff-page__side');
        const pinned = Math.max(0, ...[...document.querySelectorAll('.hub-header, .origins-map-header')]
          .filter((el) => ['fixed', 'sticky'].includes(getComputedStyle(el).position))
          .map((el) => el.getBoundingClientRect().bottom));
        return { sticky: getComputedStyle(side).position === 'sticky', height: side.offsetHeight, room: window.innerHeight - pinned - 20 };
      });
      assert(!fit.sticky || fit.height <= fit.room, `${staff}: pinned Upgrade (${fit.height}px) is taller than the room (${fit.room}px) at 1280x720`);
    }
    results.push('1280x720: Upgrade columns are only pinned when they fit');
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} Origins checks passed:`);
results.forEach((line) => console.log(`- ${line}`));
