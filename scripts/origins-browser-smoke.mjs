/*
 * Origins, the OG guide cleaned up: the blue title band with its five tabs, the lean Main Steps with
 * Tips and Speed Run, and the Build / Puzzle / Upgrade staff pages, at every smoke viewport.
 */
import assert from 'node:assert/strict';
import { chromium } from 'playwright';
import { VIEWPORTS } from './smoke-viewports.mjs';
import { loadModules } from './guide-content.mjs';

const [{ default: originsGuide }, { default: staffPages }] = await loadModules(['maps/origins/src/data/originsGuide.jsx', 'maps/origins/src/data/originsStaffPages.js']);
const staffLines = JSON.parse((await import('node:fs')).readFileSync(new URL('./fixtures/origins-staff-pages.baseline.json', import.meta.url), 'utf8'));
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
  ['/maps/origins', 'Main Guide'],
  ['/maps/origins/ice-staff', 'Ice Staff'],
  ['/maps/origins/fire-staff', 'Fire Staff'],
  ['/maps/origins/wind-staff', 'Wind Staff'],
  ['/maps/origins/lightning-staff', 'Lightning Staff'],
  ['/maps/origins/speed-run', null],
];
const TABS = ['Main Guide', 'Ice Staff', 'Fire Staff', 'Wind Staff', 'Lightning Staff'];
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

    // ---- Shell: the OG band (title row, then the five tabs) over the robot ----
    for (const [route, current] of ROUTES) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      assert.equal((await page.locator('.origins-head h1').innerText()).replace(/\s+/g, ' ').trim(), 'Origins Easter Egg Little Lost Girl', `${route}: OG title`);
      assert.equal(await page.locator('.origins-head img.origins-head__revive').count(), 2, `${route}: Revive icon either side of the title`);
      const tabs = await page.locator('.origins-plates a').evaluateAll((links) => links.map((link) => {
        const box = link.getBoundingClientRect();
        return { label: link.textContent.trim(), current: link.getAttribute('aria-current'), top: Math.round(box.top), left: box.left, right: box.right, width: box.width, height: box.height };
      }));
      assert.deepEqual(tabs.map((tab) => tab.label), TABS, `${route}: five tabs in order, no Speed Run tab`);
      assert.deepEqual(tabs.filter((tab) => tab.current === 'page').map((tab) => tab.label), current ? [current] : [], `${route}: the current tab is marked`);
      for (const tab of tabs) {
        assert(tab.height >= 44, `${route}: ${tab.label} tab is ${Math.round(tab.height)}px tall`);
        assert(tab.left >= -1 && tab.right <= width + 1, `${route}: ${tab.label} tab is clipped at ${width}px`);
      }
      const rows = [...new Set(tabs.map((tab) => tab.top))];
      if (name === 'phone') {
        // The OG phone stack: Main Guide across, then Ice | Fire, then Wind | Lightning.
        assert.equal(rows.length, 3, `${route}: three tab rows on phones`);
        assert(tabs[0].width > tabs[1].width * 1.8, `${route}: Main Guide spans the first row`);
        assert.deepEqual(tabs.map((tab) => rows.indexOf(tab.top)), [0, 1, 1, 2, 2], `${route}: Ice | Fire, then Wind | Lightning`);
      } else {
        assert.equal(rows.length, 1, `${route}: tabs sit on one row at ${name}`);
      }
      const band = await page.evaluate(() => {
        const title = document.querySelector('.origins-head h1').getBoundingClientRect();
        const firstTab = document.querySelector('.origins-plates a').getBoundingClientRect();
        return { gap: firstTab.top - title.bottom, robot: /Robot/.test(getComputedStyle(document.querySelector('.origins-module')).backgroundImage) };
      });
      assert(band.gap >= 8, `${route}: title row and tab row are ${Math.round(band.gap)}px apart`);
      assert(band.robot, `${route}: the robot artwork is the page background`);
      // What stays pinned under the hub bar once the page scrolls: only the tab row on desktop, nothing on phones.
      await page.evaluate(() => window.scrollTo(0, 600));
      const pinned = await page.evaluate(() => {
        const hub = document.querySelector('.hub-header');
        const hubPinned = ['fixed', 'sticky'].includes(getComputedStyle(hub).position);
        const hubBottom = hubPinned ? hub.getBoundingClientRect().bottom : 0;
        const top = document.querySelector('.origins-top').getBoundingClientRect();
        return { hubPinned, visibleBand: Math.max(0, top.bottom - Math.max(hubBottom, 0)) };
      });
      if (name === 'landscape') assert(!pinned.hubPinned, `${route}: the hub bar scrolls away in short landscape`);
      assert(pinned.visibleBand <= (name === 'desktop' ? 72 : 0), `${route}: ${Math.round(pinned.visibleBand)}px of the band stays pinned at ${name}`);
      await assertNoHorizontalOverflow(page, `${route} at ${name}`);
    }
    results.push(`${name}: OG title row, five tabs (${name === 'phone' ? 'phone stack 1 / 2 / 2' : 'one row'}), robot background, pinned band on every Origins route`);

    // ---- Main Guide: the sequence, lean ----
    await page.addInitScript(contrastScript);
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    const rendered = await page.locator('li.run-step').evaluateAll((items) => items.map((item) => ({ id: item.id, title: item.querySelector('h3')?.textContent.trim() })));
    assert.deepEqual(rendered.map((item) => item.id), originsGuide.map((step) => step.id), 'Main Steps keep the 11 steps in order');
    assert.deepEqual(rendered.map((item) => item.title), originsGuide.map((step) => step.title), 'step names match the data');
    for (const step of originsGuide) {
      const goal = page.locator(`#${step.id} .run-step__goal`);
      assert(await goal.isVisible(), `${step.id}: action visible without opening anything`);
      assert.equal((await goal.innerText()).trim(), step.goal, `${step.id}: action is the step goal`);
      assert.equal(await page.locator(`#${step.id} .run-step__warn`).count(), step.critical?.length ?? 0, `${step.id}: one warning line per critical note`);
    }
    for (const id of ['build-staffs', 'upgrade-staffs']) {
      assert.equal(await page.locator(`#${id} :is(details, .gref-stack, a, button)`).count(), 0, `${id}: one line, nothing behind it`);
    }
    assert.equal(await page.locator('.run-sheet__steps a[href*="-staff"]').count(), 0, 'no staff buttons or links under the Main Steps');
    assert.equal(await page.locator('.run-step__details[open]').count(), 0, 'Details start closed');
    const details = page.locator('#rain-fire .run-step__details');
    await details.locator('summary').click();
    assert.match(await details.innerText(), /open foot/, 'Details opens the rest of the step');
    assert((await details.locator('summary').boundingBox()).height >= 44, 'Details is a 44px target');
    const mainText = await page.locator('main').innerText();
    assert.equal(await page.locator('.switch-board, .staff-board').count(), 0, 'no switch board or staff board on the Main Guide');
    assert.deepEqual(TRACKER_LABELS.filter((label) => mainText.includes(label)), [], 'no tracker-only lines on the Main Guide');
    assert.equal(await page.locator('.origins-tips li').count(), 3, 'Tips hold the three strategy tips');
    assert.equal(await page.locator('.origins-tips audio[aria-label]').count(), 2, 'Tips keep both named audio clips');
    assert.equal(await page.getByRole('button', { name: 'I completed this Easter Egg' }).count(), 1, 'completion action present');
    const speed = page.locator('a.origins-speedrun:visible');
    assert.equal(await speed.count(), 1, 'one visible Speed Run link');
    const order = await page.evaluate(() => {
      const top = (selector) => [...document.querySelectorAll(selector)].find((el) => el.checkVisibility()).getBoundingClientRect();
      return { steps: top('.origins-steps'), speed: top('a.origins-speedrun'), tips: top('.origins-tips') };
    });
    if (name === 'phone') {
      assert(order.steps.bottom <= order.speed.top && order.speed.bottom <= order.tips.top, 'phone: Main Steps, then Speed Run, then Tips');
    } else {
      assert(order.speed.left >= order.steps.right && order.speed.top >= order.tips.bottom, `${name}: Speed Run sits under Tips, beside the steps`);
    }

    const type = await page.evaluate(() => {
      const goal = getComputedStyle(document.querySelector('.run-step__goal'));
      const warn = getComputedStyle(document.querySelector('.run-step__warn'));
      const panel = 'rgb(4, 15, 27)';
      return { size: parseFloat(goal.fontSize), goal: window.__contrast(goal.color, panel), warn: window.__contrast(warn.color, panel) };
    });
    assert(type.size >= 16, `actions are ${type.size}px`);
    assert(type.goal >= 4.5 && type.warn >= 4.5, `contrast action ${type.goal.toFixed(2)} / warning ${type.warn.toFixed(2)}`);
    if (name === 'desktop') {
      const reading = await page.locator('.origins-steps').evaluate((el) => el.getBoundingClientRect().width);
      assert(reading >= 640, `Main Steps keep ${Math.round(reading)}px of reading width`);
    }
    results.push(`${name}: Main Steps (lean staff steps, warnings, closed Details), Tips, Speed Run placement, type and contrast`);

    // ---- Speed Run: a way back to the Main Guide ----
    await page.goto(`${base}/maps/origins/speed-run`, { waitUntil: 'networkidle' });
    const back = page.locator('a.speedrun-back');
    assert.equal(await back.getAttribute('href'), '/maps/origins', 'Speed Run leads back to the Main Guide');
    assert((await back.boundingBox()).height >= 44, 'Back to Main Guide is a 44px target');

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
      if (name === 'phone') assert(order[0] < order[1] && order[1] < order[2], `${route}: Build, Puzzle, Upgrade read in order on phones`);
      const text = (await page.locator('main').innerText()).replace(/\s+/g, ' ');
      const lower = text.toLowerCase();
      for (const line of staffLines[staff].lines) {
        assert(text.includes(line.text), `${route}: keeps "${line.text}"`);
        if (line.label && line.label !== 'Excavation') assert(lower.includes(line.label.toLowerCase()), `${route}: keeps the label "${line.label}"`);
      }

      // The chart opens full screen and closes again (button, Esc), returning focus to the chart.
      const open = page.locator('#puzzle .zoom-image__open');
      await open.click();
      const dialog = page.locator('dialog.zoom-image__dialog[open]');
      await dialog.waitFor();
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
      if (name === 'desktop') assert(order[2] - (await page.evaluate(() => window.scrollY)) < height, `${route}: Upgrade is on the first screen`);
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
    if (name === 'landscape') {
      // Nothing is pinned at 844x390, so a deep link should land near the very top.
      await page.goto(`${base}/maps/origins#rain-fire`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(150);
      const top = await page.locator('#rain-fire').evaluate((el) => el.getBoundingClientRect().top);
      assert(top >= 0 && top <= 32, `landscape #rain-fire lands at ${Math.round(top)}px`);
    } else {
      // Deep links land clear of whatever is pinned (the hub bar, plus the tab row on desktop).
      await page.goto(`${base}/maps/origins#rain-fire`, { waitUntil: 'networkidle' });
      await page.waitForTimeout(150);
      const landing = await page.evaluate(() => {
        const pinned = Math.max(...[...document.querySelectorAll('.hub-header, .origins-plates')].map((el) => el.getBoundingClientRect().bottom).filter((bottom) => bottom > 0), 0);
        return { top: document.getElementById('rain-fire').getBoundingClientRect().top, pinned };
      });
      assert(landing.top >= landing.pinned && landing.top <= landing.pinned + 48, `#rain-fire lands at ${Math.round(landing.top)}px under ${Math.round(landing.pinned)}px of chrome`);
    }
    results.push(`${name}: four staff pages — order, every line, zoomable chart, ring reference, Ice order rules, Lightning tools`);

    assert.deepEqual(errors, [], `${name}: page errors: ${errors.join('; ')}`);
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
        const pinned = document.querySelector('.hub-header').offsetHeight + document.querySelector('.origins-plates').offsetHeight;
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
