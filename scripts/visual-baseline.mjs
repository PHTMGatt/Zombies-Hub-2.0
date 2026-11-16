/*
 * Visual regression baseline (no dependencies, no visual change to the app, optional in CI).
 *
 *   node scripts/visual-baseline.mjs --save      # screenshot every critical route at 390 and 1440 into artifacts/visual-baseline/
 *   node scripts/visual-baseline.mjs --compare   # screenshot again, diff against the baseline, write artifacts/visual-diff/report.txt
 *
 * Needs the built app served (SMOKE_BASE_URL, default http://127.0.0.1:4173: `npm run preview -- --port 4173`).
 * Routes come from scripts/critical-routes.mjs (hub pages, the seven guides and every tab). Pages are shot full height
 * with animations off and third-party iframes hidden, so only real layout/text/colour changes differ.
 * Diffing runs in the browser (canvas), so no image library is needed. A route fails when more than
 * VISUAL_TOLERANCE percent of its pixels differ (default 0.5) or its height changed by more than VISUAL_HEIGHT_PX
 * (default 24). `--only=<substring>` limits routes; `--sizes=390,1440` changes the widths.
 * The baseline is local (artifacts/ is gitignored): save one from a known-good build, then compare after a change.
 */
import { chromium } from 'playwright';
import { existsSync, mkdirSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { resolve } from 'node:path';
import { criticalRoutes } from './critical-routes.mjs';
import { settled } from './smoke-helpers.mjs';

const root = resolve(import.meta.dirname, '..');
const base = process.env.SMOKE_BASE_URL || 'http://127.0.0.1:4173';
const args = process.argv.slice(2);
const mode = args.includes('--save') ? 'save' : args.includes('--compare') ? 'compare' : null;
if (!mode) {
  console.error('Usage: node scripts/visual-baseline.mjs --save | --compare [--only=<text>] [--sizes=390,1440]');
  process.exit(2);
}
const only = args.find((arg) => arg.startsWith('--only='))?.slice(7);
const sizes = (args.find((arg) => arg.startsWith('--sizes='))?.slice(8) ?? '390,1440').split(',').map(Number);
const tolerance = Number(process.env.VISUAL_TOLERANCE ?? 0.5);
const heightSlack = Number(process.env.VISUAL_HEIGHT_PX ?? 24);
const heights = { 390: 844, 1440: 900 };

const baselineDir = resolve(root, 'artifacts/visual-baseline');
const currentDir = resolve(root, 'artifacts/visual-current');
const diffDir = resolve(root, 'artifacts/visual-diff');
const outDir = mode === 'save' ? baselineDir : currentDir;
for (const dir of mode === 'save' ? [baselineDir] : [currentDir, diffDir]) mkdirSync(dir, { recursive: true });

const calm = `*, *::before, *::after { animation: none !important; transition: none !important; caret-color: transparent !important; scroll-behavior: auto !important; }
iframe { visibility: hidden !important; }`;

const routes = criticalRoutes.filter(([name, route]) => !only || name.includes(only) || route.includes(only));
const browser = await chromium.launch({ headless: true });
const taken = [];
try {
  for (const width of sizes) {
    const context = await browser.newContext({ viewport: { width, height: heights[width] ?? 900 }, reducedMotion: 'reduce', deviceScaleFactor: 1 });
    const page = await context.newPage();
    for (const [name, route] of routes) {
      await page.goto(`${base}${route}`, { waitUntil: 'networkidle' });
      await page.addStyleTag({ content: calm });
      await settled(page);
      const file = `${name}-${width}.png`;
      await page.screenshot({ path: resolve(outDir, file), fullPage: true });
      taken.push({ name, route, width, file });
    }
    await context.close();
  }

  if (mode === 'save') {
    writeFileSync(resolve(baselineDir, 'manifest.json'), `${JSON.stringify({ base, saved: new Date().toISOString(), shots: taken }, null, 2)}\n`);
    console.log(`Saved ${taken.length} baseline screenshots to artifacts/visual-baseline/ (${routes.length} routes × ${sizes.join(', ')} px).`);
  } else {
    const diffPage = await (await browser.newContext()).newPage();
    const lines = [];
    let failed = 0;
    for (const shot of taken) {
      const before = resolve(baselineDir, shot.file);
      if (!existsSync(before)) { lines.push(`NEW   ${shot.file} (no baseline)`); continue; }
      const result = await diffPage.evaluate(async ([a, b]) => {
        const load = (b64) => new Promise((done, fail) => { const img = new Image(); img.onload = () => done(img); img.onerror = fail; img.src = `data:image/png;base64,${b64}`; });
        const [imgA, imgB] = await Promise.all([load(a), load(b)]);
        const width = Math.max(imgA.width, imgB.width);
        const height = Math.max(imgA.height, imgB.height);
        const pixels = (img) => { const c = document.createElement('canvas'); c.width = width; c.height = height; const g = c.getContext('2d'); g.drawImage(img, 0, 0); return g.getImageData(0, 0, width, height).data; };
        const da = pixels(imgA); const db = pixels(imgB);
        let changed = 0;
        for (let i = 0; i < da.length; i += 4) {
          if (Math.abs(da[i] - db[i]) + Math.abs(da[i + 1] - db[i + 1]) + Math.abs(da[i + 2] - db[i + 2]) > 24) changed += 1;
        }
        return { changed, total: width * height, heightA: imgA.height, heightB: imgB.height };
      }, [readFileSync(before).toString('base64'), readFileSync(resolve(currentDir, shot.file)).toString('base64')]);
      const percent = (result.changed / result.total) * 100;
      const tall = Math.abs(result.heightA - result.heightB);
      const bad = percent > tolerance || tall > heightSlack;
      if (bad) failed += 1;
      lines.push(`${bad ? 'DIFF ' : 'ok   '} ${shot.file}  ${percent.toFixed(2)}% pixels, height ${result.heightA}→${result.heightB}`);
    }
    const summary = `${failed ? 'FAILED' : 'passed'}: ${failed} of ${taken.length} screenshots differ (tolerance ${tolerance}%, height ±${heightSlack}px)`;
    writeFileSync(resolve(diffDir, 'report.txt'), `${lines.join('\n')}\n${summary}\n`);
    console.log(lines.filter((line) => !line.startsWith('ok')).join('\n') || '(no differences)');
    console.log(`${summary}. Full report: artifacts/visual-diff/report.txt; current shots: artifacts/visual-current/.`);
    if (failed) process.exitCode = 1;
  }
} finally {
  await browser.close();
}
