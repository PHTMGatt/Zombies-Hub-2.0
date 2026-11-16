/*
 * Visual regression guard (CI-optional): screenshots the hub, all seven maps and their key tabs at 1440x900
 * and 390x844, and compares them with a saved baseline so the look can't change silently.
 *
 *   npm run preview -- --host 127.0.0.1 --port 4173        (in another terminal)
 *   node scripts/visual-baseline.mjs --update              save/refresh the baseline (artifacts/visual-baseline/)
 *   node scripts/visual-baseline.mjs                       compare; exits 1 if a page differs by more than 1% of pixels
 *
 * The baseline lives in artifacts/ (gitignored): create it from a build whose look Bryen approved.
 * Animations are frozen (reduced motion) and pages are given time to settle; pages with video/art that
 * loads late can differ by a few pixels, hence the tolerance.
 */
import { chromium } from 'playwright';
import { PNG } from 'playwright-core/lib/utilsBundle';
import fs from 'node:fs';

const BASE = process.env.ZH_BASE_URL ?? 'http://127.0.0.1:4173';
const DIR = 'artifacts/visual-baseline';
const TOLERANCE = Number(process.env.ZH_VISUAL_TOLERANCE ?? 0.01);
const update = process.argv.includes('--update');
const routes = ['', 'allmaps', 'easter-eggs', 'side-easter-eggs', 'achievements', 'maps/shangri-la', 'coming-soon?map=shangri-la&guide=main',
  'maps/origins', 'maps/origins/ice-staff', 'maps/origins/lightning-staff', 'maps/origins/step-details',
  'maps/revelations', 'maps/revelations/apothicon-upgrade', 'maps/revelations/egg-locations', 'maps/revelations/step-details',
  'maps/der-eisendrache', 'maps/der-eisendrache/bows/fire', 'maps/der-eisendrache/parts', 'maps/der-eisendrache/wisps',
  'maps/zetsubou-no-shima', 'maps/zetsubou-no-shima/cogs/1', 'maps/zetsubou-no-shima/buildables',
  'maps/shadows-of-evil', 'maps/shadows-of-evil/step-details',
  'maps/gorod-krovi', 'maps/gorod-krovi/valves', 'maps/gorod-krovi/trophies',
  'maps/mob-of-the-dead', 'maps/mob-of-the-dead/codes'];
const sizes = [['1440', 1440, 900, false], ['390', 390, 844, true]];
const name = (n, r) => `${n}-${r.replace(/[^a-z0-9]+/gi, '_') || 'home'}.png`;

fs.mkdirSync(DIR, { recursive: true });
const browser = await chromium.launch();
const failures = [];
for (const [n, w, h, mobile] of sizes) {
  const context = await browser.newContext({ viewport: { width: w, height: h }, isMobile: mobile, hasTouch: mobile, reducedMotion: 'reduce' });
  const page = await context.newPage();
  for (const route of routes) {
    await page.goto(`${BASE}/${route}`, { waitUntil: 'networkidle' });
    await page.waitForTimeout(1200);
    const buf = await page.screenshot({ animations: 'disabled', caret: 'hide' });
    const file = `${DIR}/${name(n, route)}`;
    if (update || !fs.existsSync(file)) { fs.writeFileSync(file, buf); continue; }
    const a = PNG.sync.read(fs.readFileSync(file));
    const b = PNG.sync.read(buf);
    if (a.width !== b.width || a.height !== b.height) { failures.push(`${n} /${route}: size changed`); continue; }
    let diff = 0;
    for (let i = 0; i < a.data.length; i += 4) {
      if (Math.abs(a.data[i] - b.data[i]) > 6 || Math.abs(a.data[i + 1] - b.data[i + 1]) > 6 || Math.abs(a.data[i + 2] - b.data[i + 2]) > 6) diff++;
    }
    const ratio = diff / (a.width * a.height);
    if (ratio > TOLERANCE) {
      fs.writeFileSync(`${DIR}/${name(n, route).replace('.png', '.new.png')}`, buf);
      failures.push(`${n} /${route}: ${(ratio * 100).toFixed(1)}% pixels differ`);
    }
  }
  await context.close();
}
await browser.close();
if (update) console.log(`visual baseline saved: ${routes.length * sizes.length} screenshots in ${DIR}`);
else if (failures.length) { console.error(`visual regression: ${failures.length} page(s) changed\n${failures.join('\n')}`); process.exit(1); }
else console.log(`visual baseline: ${routes.length * sizes.length} screenshots match`);
