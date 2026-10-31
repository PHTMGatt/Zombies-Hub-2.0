import { chromium } from 'playwright';
import assert from 'node:assert/strict';
import { VIEWPORTS } from './smoke-viewports.mjs';

/*
 * Achievements are secondary: one quiet "I completed this Easter Egg" action at the end of each guide.
 * It records the map's achievement and changes nothing else. Old step-progress records are credited
 * once, silently, and never read again. Saved in-game notes survive "Clear old guide data".
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const REV = `${base}/maps/revelations`;
const MOB = `${base}/maps/mob-of-the-dead`;
const SHELF = `${base}/achievements`;
const COMPLETE = 'I completed this Easter Egg';

// Count chime plays without real audio.
const audioStub = () => {
  window.__chimes = 0;
  class FakeNode { connect(next) { return next ?? this; } start() {} stop() {} }
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
  window.AudioContext = class {
    constructor() { this.state = 'running'; this.currentTime = 0; this.destination = new FakeNode(); }
    resume() { return Promise.resolve(); }
    createOscillator() { window.__chimes += 1; return Object.assign(new FakeNode(), { type: '', frequency: param() }); }
    createGain() { return Object.assign(new FakeNode(), { gain: param() }); }
  };
};

const toast = (page) => page.locator('.zh-ach-toast');
const unlocked = (page) => page.evaluate(() => JSON.parse(localStorage.getItem('zh-achievements') ?? '{"unlocked":{}}').unlocked);
const pageShape = (page) => page.evaluate(() => ({
  steps: document.querySelectorAll('li.guide-seq__step').length,
  nav: [...document.querySelectorAll('.map-module nav a')].map((link) => link.textContent.trim()),
}));

const browser = await chromium.launch({ headless: true });
const results = [];
const check = (name) => results.push(name);
try {
  for (const viewport of VIEWPORTS) {
    const label = viewport.name;
    const context = await browser.newContext({ viewport });
    await context.addInitScript(audioStub);
    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    // The action sits at the very end of the guide and is the only thing it changes.
    await page.goto(REV, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    const button = page.getByRole('button', { name: COMPLETE });
    assert.equal(await button.count(), 1, 'one completion action');
    assert(await page.locator('.guide-seq__footer').evaluate((footer) => footer === footer.parentElement.lastElementChild), 'completion action follows the last step');
    assert(await button.evaluate((el) => el.closest('.guide-seq__footer') !== null), 'completion action lives in the guide footer');
    const box = await button.boundingBox();
    assert(box.height >= 44, `completion action is a usable tap target (${box.height}px)`);
    assert.notEqual(await button.evaluate((el) => getComputedStyle(el).position), 'sticky', 'completion action is not pinned');
    const before = await pageShape(page);
    await button.click();
    await toast(page).waitFor();
    const toastText = await toast(page).innerText();
    assert.match(toastText, /Achievement unlocked/i);
    assert.match(toastText, /For The Good Of All/);
    assert(await page.evaluate(() => window.__chimes) > 0, 'chime plays with sound on');
    assert((await unlocked(page))['revelations/main'], 'revelations/main recorded');
    await page.locator('.guide-seq__footer').getByText('Completed').waitFor();
    assert.equal(await page.getByRole('button', { name: COMPLETE }).count(), 0, 'the button is replaced by a quiet note');
    assert.deepEqual(await pageShape(page), before, 'completing changes no steps and no navigation');
    check(`${label}: completion action records the achievement and changes nothing else`);

    await toast(page).waitFor({ state: 'detached', timeout: 8000 });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    assert.equal(await toast(page).count(), 0, 'no second popup after reload');
    check(`${label}: toast auto-dismisses and never repeats`);

    // Kino is a side Easter Egg with no achievement: no action.
    await page.goto(`${base}/side-easter-eggs/kino`, { waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('button', { name: COMPLETE }).count(), 0, 'Kino has no completion action');
    check(`${label}: Kino has no completion action`);

    // Shelf: earned with a date, no step progress anywhere.
    await page.goto(SHELF, { waitUntil: 'networkidle' });
    const revMedal = page.locator('.ach-medal', { hasText: 'For The Good Of All' });
    assert.match(await revMedal.getAttribute('class'), /is-earned/);
    assert.match(await revMedal.innerText(), /\d{4}/, 'completion date shown');
    assert.match(await page.locator('.ach-head__count').innerText(), /^1\s*\/\s*7/);
    assert.doesNotMatch(await page.locator('.ach-shelf').innerText(), /\bsteps?\b/i, 'no step progress on the shelf');
    assert.equal(await page.locator('.ach-medal__meter').count(), 0, 'no progress meters');
    check(`${label}: shelf shows the earned medal with a date and no step progress`);

    // "Clear old guide data" removes only obsolete machinery records; saved notes stay.
    await page.evaluate(() => {
      localStorage.setItem('zh-guide-progress:gorod-krovi', JSON.stringify({ current: 'valves', done: {} }));
      localStorage.setItem('zh-guide-mode', JSON.stringify('full'));
      localStorage.setItem('zh-origins-depth', JSON.stringify('high'));
      localStorage.setItem('zh-soe-character', JSON.stringify('jackie'));
      localStorage.setItem('zh-de-safe-code', JSON.stringify(['a', 'b', 'c']));
    });
    await page.locator('.ach-danger summary').click();
    await page.getByRole('button', { name: 'Clear old guide data' }).click();
    const left = await page.evaluate(() => Object.keys(localStorage));
    for (const gone of ['zh-guide-progress:gorod-krovi', 'zh-guide-mode', 'zh-origins-depth']) assert(!left.includes(gone), `${gone} cleared`);
    for (const kept of ['zh-soe-character', 'zh-de-safe-code', 'zh-achievements']) assert(left.includes(kept), `${kept} kept`);
    check(`${label}: Clear old guide data keeps saved notes and achievements`);

    // Sound preference persists; Reset achievements is separate and explicit.
    const toggle = page.getByRole('switch', { name: 'Unlock sound' });
    assert.equal(await toggle.getAttribute('aria-checked'), 'true');
    await toggle.click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('switch', { name: 'Unlock sound' }).getAttribute('aria-checked'), 'false');
    await page.locator('.ach-danger summary').click();
    await page.getByRole('button', { name: 'Reset achievements' }).click();
    assert.match(await page.locator('.ach-head__count').innerText(), /^0\s*\/\s*7/);
    assert.deepEqual(await unlocked(page), {});
    check(`${label}: sound preference persists; reset achievements clears history`);

    // Sound off: completing again shows the toast silently.
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await page.evaluate(() => { window.__chimes = 0; });
    await page.getByRole('button', { name: COMPLETE }).click();
    await toast(page).waitFor();
    assert.equal(await page.evaluate(() => window.__chimes), 0, 'no chime when sound is off');
    check(`${label}: sound off is silent`);

    // Home has no "Continue run" strip.
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.zh-continue').count(), 0, 'no Continue run strip');
    check(`${label}: Home has no Continue run strip`);

    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    await context.close();
  }

  // Legacy progress: a finished run is credited exactly once, silently; unfinished runs are not.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(base, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.clear();
      const gorod = ['shield', 'dragon-network', 'dragon-strike', 'egg', 'valves', 'kronos', 'trophies', 'challenges', 'power-core', 'dragon-boss', 'nikolai'];
      localStorage.setItem('zh-guide-progress:gorod-krovi', JSON.stringify({ current: 'nikolai', done: Object.fromEntries(gorod.map((id) => [id, true])), total: 11 }));
      localStorage.setItem('zh-guide-progress:revelations', JSON.stringify({ current: 'servant', done: { engines: true }, total: 12 }));
      localStorage.setItem('zh-guide-mode', JSON.stringify('full'));
      localStorage.setItem('zh-origins-depth', JSON.stringify('speedrun'));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    const after = await unlocked(page);
    assert.deepEqual(after['gorod-krovi/main'], { at: null }, 'finished legacy run credited without a date');
    assert(!after['revelations/main'], 'unfinished legacy run not credited');
    assert.equal(await toast(page).count(), 0, 'legacy credit is silent');
    const record = await page.evaluate(() => localStorage.getItem('zh-achievements'));
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.evaluate(() => localStorage.getItem('zh-achievements')), record, 'credit happens once');
    check('legacy finished run credited once, silently; unfinished run ignored');

    // Old mode keys are harmless.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('li.guide-seq__step').count(), 11, 'Origins renders its sequence with old mode keys present');
    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    check('old guide-mode / origins-depth keys are harmless');
    await context.close();
  }

  // Blocked storage: completing still works for this visit and never throws.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 } });
    await context.addInitScript(() => {
      Storage.prototype.setItem = () => { throw new DOMException('blocked', 'SecurityError'); };
    });
    const page = await context.newPage();
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await page.getByRole('button', { name: COMPLETE }).click();
    await page.locator('.guide-seq__footer').getByText('Completed').waitFor();
    assert.deepEqual(errors, [], `page errors with blocked storage: ${errors.join('; ')}`);
    check('blocked storage: completion shows as earned, no errors');
    await context.close();
  }

  // Reduced motion: the toast fades instead of sliding.
  {
    const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
    await context.addInitScript(audioStub);
    const page = await context.newPage();
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('button', { name: COMPLETE }).click();
    await toast(page).waitFor();
    assert.equal(await toast(page).evaluate((el) => getComputedStyle(el).animationName), 'zh-ach-fade');
    check('reduced motion respected');
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} achievement checks passed:\n- ${results.join('\n- ')}`);
