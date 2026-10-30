import { chromium } from 'playwright';
import assert from 'node:assert/strict';

/*
 * Run mode: a returning player lands on their step, quick references never move the run, troubleshooting
 * stays collapsed until asked for, the hub offers "Continue run", and finishing offers the ways onward.
 */
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const GOROD = `${base}/maps/gorod-krovi`;
const results = [];

const browser = await chromium.launch({ headless: true });
try {
  for (const viewport of [{ width: 1440, height: 900 }, { width: 390, height: 844 }]) {
    const context = await browser.newContext({ viewport });
    const page = await context.newPage();
    page.on('dialog', (dialog) => dialog.accept());
    const errors = [];
    page.on('pageerror', (error) => errors.push(error.message));
    const markDone = () => page.getByRole('button', { name: 'Mark step done' }).click();

    await page.goto(GOROD, { waitUntil: 'networkidle' });
    await page.evaluate(() => localStorage.clear());
    await page.reload({ waitUntil: 'networkidle' });
    for (let i = 0; i < 4; i += 1) await markDone(page);

    // Reload: back on step 5, scrolled to it.
    await page.evaluate(() => window.scrollTo(0, 0));
    await page.reload({ waitUntil: 'networkidle' });
    await page.getByRole('heading', { name: 'Valve network', level: 3 }).waitFor();
    await page.waitForTimeout(300);
    const titleTop = await page.locator('.guide-step h3').evaluate((el) => el.getBoundingClientRect().top);
    assert(titleTop >= 0 && titleTop < viewport.height * 0.45, `resumed step title should be near the top, got ${titleTop}`);
    results.push(`${viewport.width}: resume lands on the current step`);

    // "Do this now" leads the step.
    assert.match(await page.locator('.guide-step__goal').innerText(), /^Do this now/i);

    // Quick refs: look something up without moving the run.
    await page.getByRole('button', { name: 'Quick refs' }).click();
    await page.getByRole('button', { name: /Trophy locations/ }).click();
    assert.match(await page.locator('.guide-sheet').innerText(), /Operations Bunker safe/);
    await page.keyboard.press('Escape');
    await page.getByRole('heading', { name: 'Valve network', level: 3 }).waitFor();
    results.push(`${viewport.width}: quick refs keep the run in place`);

    // Troubleshooting is collapsed in Quick and opens on request.
    const problems = page.locator('.guide-problems');
    assert.equal(await problems.evaluate((el) => el.open), false);
    await problems.locator('summary').click();
    assert.match(await problems.innerText(), /green/i);
    results.push(`${viewport.width}: Not working? collapsed until opened`);

    // Hub offers Continue run at the right step.
    await page.goto(base, { waitUntil: 'networkidle' });
    const resume = page.locator('.zh-continue__run', { hasText: 'Gorod Krovi' });
    assert.match(await resume.innerText(), /Step 5 \/ 11/);
    await resume.click();
    await page.getByRole('heading', { name: 'Valve network', level: 3 }).waitFor();
    results.push(`${viewport.width}: hub Continue run returns to step 5`);

    // Finish every step: completion line with the three ways onward.
    for (let i = 0; i < 7; i += 1) await markDone(page);
    const finish = page.locator('.guide-finish');
    await finish.waitFor();
    assert.match(await finish.innerText(), /Love and War complete/);
    for (const name of ['View achievement', 'Start new run', 'Back to maps']) {
      assert.equal(await finish.getByRole(name === 'Start new run' ? 'button' : 'link', { name }).count(), 1, `${name} offered`);
    }
    await finish.getByRole('button', { name: 'Start new run' }).click();
    assert.match(await page.locator('.guide-progress__count').innerText(), /^0\s*\/\s*11/);
    results.push(`${viewport.width}: finish offers achievement / new run / maps`);

    // No run in progress → no Continue strip.
    await page.goto(base, { waitUntil: 'networkidle' });
    assert.equal(await page.locator('.zh-continue').count(), 0);

    // A locked panel replacing the steps (Origins in Speedrun depth) with a run under way must not crash.
    await page.goto(`${base}/maps/origins`, { waitUntil: 'networkidle' });
    await page.evaluate(() => {
      localStorage.setItem('zh-origins-depth', JSON.stringify('speedrun'));
      localStorage.setItem('zh-guide-progress:origins', JSON.stringify({ current: 'upgrade-staffs', done: { 'build-staffs': true } }));
    });
    await page.reload({ waitUntil: 'networkidle' });
    await page.waitForTimeout(400);
    results.push(`${viewport.width}: Origins speedrun panel + run in progress loads cleanly`);

    assert.deepEqual(errors, [], `page errors: ${errors.join('; ')}`);
    await context.close();
  }
} finally {
  await browser.close();
}

console.log(`${results.length} run-mode checks passed:\n- ${results.join('\n- ')}`);
