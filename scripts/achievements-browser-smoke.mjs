import { chromium } from 'playwright';
import assert from 'node:assert/strict';

/*
 * Achievements + reset tiers, end to end:
 * unlock only on the final step, once; survives reload; run / map / all resets keep achievements;
 * "Reset achievements" is separate; sound preference persists; reduced motion swaps the animation.
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const MOB = `${base}/maps/mob-of-the-dead`;
const DE = `${base}/maps/der-eisendrache`;
const SHELF = `${base}/achievements`;

// Count chime plays without real audio.
const audioStub = () => {
  window.__chimes = 0;
  class FakeNode { connect(next) { return next ?? this; } start() {} stop() {} }
  const param = () => ({ value: 0, setValueAtTime() {}, exponentialRampToValueAtTime() {} });
  window.AudioContext = class {
    constructor() { window.__chimes += 0; this.state = 'running'; this.currentTime = 0; this.destination = new FakeNode(); }
    resume() { return Promise.resolve(); }
    createOscillator() { window.__chimes += 1; return Object.assign(new FakeNode(), { type: '', frequency: param() }); }
    createGain() { return Object.assign(new FakeNode(), { gain: param() }); }
  };
};

const toast = (page) => page.locator('.zh-ach-toast');
const markDone = (page) => page.getByRole('button', { name: 'Mark step done' }).click();
const openMenu = async (page) => {
  const menu = page.locator('.guide-menu');
  if (!(await menu.evaluate((el) => el.open))) await menu.locator('summary').click();
};

const browser = await chromium.launch({ headless: true });
const results = [];
const check = (name) => results.push(name);
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    await context.addInitScript(audioStub);
    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));

    await page.goto(MOB, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });

    // The final step alone (others unfinished) is not the Easter Egg: no unlock.
    await page.locator('.guide-rail__step').last().click();
    await markDone(page);
    await page.waitForTimeout(300);
    assert.equal(await toast(page).count(), 0, 'final step alone must not unlock');
    await page.getByRole('button', { name: /Done — undo/ }).click();
    await page.locator('.guide-rail__step').first().click();
    check('final step alone does not unlock');

    // Eleven steps done: no unlock yet.
    for (let i = 0; i < 11; i += 1) await markDone(page);
    await page.getByRole('heading', { name: 'Break or continue the cycle', level: 3 }).waitFor();
    assert.equal(await toast(page).count(), 0, 'no achievement before the final step');
    check('no unlock before final step');

    // Final step: one toast, map + title, chime played.
    await markDone(page);
    await toast(page).waitFor();
    const text = await toast(page).innerText();
    assert.match(text, /Achievement unlocked/i);
    assert.match(text, /Pop Goes the Weasel/);
    assert.match(text, /Mob of the Dead/);
    assert(await page.evaluate(() => window.__chimes) > 0, 'chime should play with sound on');
    await page.screenshot({ path: `/tmp/claude-0/shots/ach-toast-${viewport.width}.png` });
    check('unlock on final step with toast + sound');

    // Toast leaves on its own.
    await toast(page).waitFor({ state: 'detached', timeout: 8000 });
    check('toast auto-dismisses');

    // Undo + redo the final step, and reload: never a second popup.
    await page.getByRole('button', { name: /Done — undo/ }).click();
    await markDone(page);
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(600);
    assert.equal(await toast(page).count(), 0, 'no duplicate toast after redo or reload');
    check('no duplicate after redo/reload');

    // Shelf shows it, with a date.
    await page.goto(SHELF, { waitUntil: 'networkidle' });
    const mobMedal = page.locator('.ach-medal', { hasText: 'Pop Goes the Weasel' });
    assert.match(await mobMedal.getAttribute('class'), /is-earned/);
    assert.match(await mobMedal.innerText(), /\d{4}/, 'completion date shown');
    assert.match(await page.locator('.ach-head__count').innerText(), /^1\s*\/\s*7/);
    check('shelf shows earned + date');

    // Reset this run: progress gone, achievement stays.
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await openMenu(page);
    await page.getByRole('button', { name: 'Reset this run' }).click();
    assert.match(await page.locator('.guide-progress__count').innerText(), /^0\s*\/\s*12/);
    await page.getByRole('heading', { name: 'Warden’s Key', level: 3 }).waitFor();
    assert(await page.evaluate(() => JSON.parse(localStorage.getItem('zh-achievements')).unlocked['mob-of-the-dead/main']));
    check('reset run keeps achievement');

    // Reset map (Der Eisendrache): guide progress + safe-code note cleared, achievements untouched.
    await page.goto(DE, { waitUntil: 'networkidle' });
    await markDone(page);
    await page.evaluate(() => localStorage.setItem('zh-de-safe-code', JSON.stringify(['a', 'b', 'c'])));
    await openMenu(page);
    await page.getByRole('button', { name: 'Reset all Der Eisendrache progress' }).click();
    assert.match(await page.locator('.guide-progress__count').innerText(), /^0\s*\//);
    const deState = await page.evaluate(() => ({
      safe: localStorage.getItem('zh-de-safe-code'),
      ach: localStorage.getItem('zh-achievements'),
    }));
    assert(deState.safe === null || deState.safe === JSON.stringify(['', '', '']), `safe code cleared, got ${deState.safe}`);
    assert.match(deState.ach, /mob-of-the-dead\/main/);
    check('reset map clears map progress + notes only');

    // Reset all progress from the shelf: every guide record gone, achievements stay.
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await markDone(page);
    await page.goto(SHELF, { waitUntil: 'networkidle' });
    await page.locator('.ach-danger summary').click();
    await page.getByRole('button', { name: 'Reset all progress' }).click();
    const afterAll = await page.evaluate(() => ({
      guides: Object.keys(localStorage).filter((key) => key.startsWith('zh-guide-progress:')),
      ach: localStorage.getItem('zh-achievements'),
    }));
    assert.deepEqual(afterAll.guides, []);
    assert.match(afterAll.ach, /mob-of-the-dead\/main/);
    check('reset all progress keeps achievements');

    // Sound toggle persists across reload.
    const toggle = page.getByRole('switch', { name: 'Unlock sound' });
    assert.equal(await toggle.getAttribute('aria-checked'), 'true');
    await toggle.click();
    await page.reload({ waitUntil: 'networkidle' });
    assert.equal(await page.getByRole('switch', { name: 'Unlock sound' }).getAttribute('aria-checked'), 'false');
    check('sound preference persists');

    // Reset achievements: separate, explicit.
    await page.locator('.ach-danger summary').click();
    await page.getByRole('button', { name: 'Reset achievements' }).click();
    assert.match(await page.locator('.ach-head__count').innerText(), /^0\s*\/\s*7/);
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('zh-achievements')).unlocked), {});
    check('reset achievements clears history');

    // Sound off: unlocking again shows the toast silently.
    await page.goto(MOB, { waitUntil: 'networkidle' });
    await page.evaluate(() => { window.__chimes = 0; });
    for (let i = 0; i < 12; i += 1) await markDone(page);
    await toast(page).waitFor();
    assert.equal(await page.evaluate(() => window.__chimes), 0, 'no chime when sound is off');
    check('sound off is silent');

    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    await context.close();
  }

  // Origins: finishing earns both the main and the hidden achievement (queued, one at a time). After
  // "Reset achievements", Speedrun mode stays unlocked and revisiting the finished guide stays silent.
  {
    const context = await browser.newContext({ viewport: { width: 1440, height: 900 } });
    await context.addInitScript(audioStub);
    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    const total = await page.locator('.guide-rail__step').count();
    for (let i = 0; i < total; i += 1) await markDone(page);
    await toast(page).waitFor();
    assert.match(await toast(page).innerText(), /Little Lost Girl/);
    await page.locator('.zh-ach-toast__close').click();
    await page.locator('.zh-ach-toast', { hasText: 'Speedrun Difficulty Unlocked' }).waitFor();
    check('Origins queues main + hidden achievement');

    await page.goto(SHELF, { waitUntil: 'networkidle' });
    await page.locator('.ach-danger summary').click();
    await page.getByRole('button', { name: 'Reset achievements' }).click();
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(700);
    assert.equal(await toast(page).count(), 0, 'no re-announce after reset achievements');
    assert.equal(await page.evaluate(() => localStorage.getItem('zh-origins-speedrun-unlocked')), 'true');
    assert.deepEqual(await page.evaluate(() => JSON.parse(localStorage.getItem('zh-achievements')).unlocked), {});
    check('reset achievements keeps Speedrun mode and stays silent');
    await context.close();
  }

  // Reduced motion: the toast fades instead of sliding.
  const context = await browser.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce' });
  await context.addInitScript(audioStub);
  const page = await context.newPage();
  await page.goto(MOB, { waitUntil: 'networkidle' });
  await page.evaluate(() => localStorage.clear());
  await page.reload({ waitUntil: 'networkidle' });
  for (let i = 0; i < 12; i += 1) await markDone(page);
  await toast(page).waitFor();
  assert.equal(await toast(page).evaluate((el) => getComputedStyle(el).animationName), 'zh-ach-fade');
  check('reduced motion respected');
  await context.close();
} finally {
  await browser.close();
}

console.log(`${results.length} achievement checks passed:\n- ${results.join('\n- ')}`);
