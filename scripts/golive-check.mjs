/*
 * npm run golive-check: one command that says whether claude-forge is safe to merge to main.
 *
 * Runs, in order, and prints a PASS/FAIL table (exit 1 on any FAIL):
 *   unit tests (incl. flat-guide shape, content preservation, CSS scope, prerender + budget tests)
 *   source verification · production build · per-route share heads · bundle budget · build info
 *   per-route meta check on the built dist (every prerendered page: title, description, og:url, canonical in
 *   sitemap.xml, og:image file; robots.txt points at the sitemap)
 *   every browser smoke in `npm run test:browser` (7 maps, Coming Soon / empty maps, step links, offline,
 *   content preservation, …) plus the link/anchor check and the a11y smoke, against a local preview of dist.
 * A failing step does not stop the run: you get the whole table. Each step's last lines are printed on FAIL.
 *
 * Options: ZH_BROWSER_CHANNEL=chrome uses the installed Chrome for the smokes (see playwright-channel.mjs).
 *          GOLIVE_SKIP_BUILD=1 reuses an existing build (faster re-runs; the build rows show SKIP).
 *          GOLIVE_DIST=artifacts/golive builds and serves that folder instead of dist/.
 */
import { spawnSync } from 'node:child_process';
import { readFileSync, existsSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeDescription, routeTitle } from '../apps/hub/src/app/routeMetadata.js';
import { ALIASES, OG_IMAGE, imageSize, prerenderRoutes } from './prerender-meta.mjs';
import { freePort, startPreview, viteBin } from './smoke-helpers.mjs';
import { BROWSER_SMOKES } from './smoke-list.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
// GOLIVE_DIST builds into another folder (e.g. artifacts/golive) so a dev preview of dist/ keeps running.
const dist = path.resolve(root, process.env.GOLIVE_DIST || 'dist');
const defaultDist = dist === path.join(root, 'dist');
const rows = [];

function run(label, args, env = {}) {
  const started = Date.now();
  const result = spawnSync(process.execPath, args, { cwd: root, env: { ...process.env, ...env }, encoding: 'utf8', maxBuffer: 64 * 1024 * 1024 });
  const ok = result.status === 0;
  const output = `${result.stdout ?? ''}${result.stderr ?? ''}`.trim();
  rows.push({ label, status: ok ? 'PASS' : 'FAIL', seconds: (Date.now() - started) / 1000, detail: ok ? '' : output.split('\n').slice(-15).join('\n') });
  process.stdout.write(`${ok ? 'PASS' : 'FAIL'}  ${label}\n`);
  return ok;
}

function skip(label, why) {
  rows.push({ label, status: 'SKIP', seconds: 0, detail: why });
  process.stdout.write(`SKIP  ${label} (${why})\n`);
}

async function check(label, fn) {
  const started = Date.now();
  let problems;
  try { problems = await fn(); } catch (error) { problems = [error.message]; }
  rows.push({ label, status: problems.length ? 'FAIL' : 'PASS', seconds: (Date.now() - started) / 1000, detail: problems.slice(0, 15).join('\n') });
  process.stdout.write(`${problems.length ? 'FAIL' : 'PASS'}  ${label}\n`);
}

const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
const escapeAttr = (value) => escapeText(value).replace(/"/g, '&quot;');

// Every prerendered page in dist carries its own head; its og:image is a built 1200x630 card under 300 KB,
// and a map's pages use that map's own card.
async function metaProblems() {
  const problems = [];
  const cards = new Map(); // og:image path → '' when fine, else what is wrong (each card is read once)
  const sitemapFile = path.join(dist, 'sitemap.xml');
  const sitemap = existsSync(sitemapFile) ? new Set([...readFileSync(sitemapFile, 'utf8').matchAll(/<loc>([^<]+)<\/loc>/g)].map((m) => m[1])) : null;
  if (!sitemap) problems.push('no sitemap.xml in dist');
  const robots = existsSync(path.join(dist, 'robots.txt')) ? readFileSync(path.join(dist, 'robots.txt'), 'utf8') : '';
  if (!/^Sitemap: https?:\/\/\S+\/sitemap\.xml$/m.test(robots)) problems.push('robots.txt is missing or does not point at the sitemap');
  for (const route of prerenderRoutes()) {
    const page = ALIASES[route] ?? route;
    const file = path.join(dist, ...route.split('/').filter(Boolean), 'index.html');
    if (!existsSync(file)) { problems.push(`${route}: no ${path.relative(root, file)}`); continue; }
    const html = await readFile(file, 'utf8');
    if (!html.includes(`<title>${escapeText(routeTitle(page))}</title>`)) problems.push(`${route}: title is not "${routeTitle(page)}"`);
    if (!html.includes(`name="description" content="${escapeAttr(routeDescription(page))}"`)) problems.push(`${route}: description does not match the route`);
    const url = html.match(/property="og:url" content="([^"]+)"/)?.[1];
    if (!url || new URL(url).pathname !== page) problems.push(`${route}: og:url is ${url ?? 'missing'}`);
    const canonical = html.match(/<link rel="canonical" href="([^"]+)"/)?.[1];
    if (canonical !== url) problems.push(`${route}: canonical is ${canonical ?? 'missing'}, not its og:url`);
    else if (sitemap && !sitemap.has(canonical)) problems.push(`${route}: ${canonical} is not in sitemap.xml`);
    const image = html.match(/property="og:image" content="([^"]+)"/)?.[1];
    if (!image) problems.push(`${route}: no og:image`);
    else {
      const imagePath = new URL(image).pathname;
      const slug = route.match(/^\/maps\/([^/]+)/)?.[1];
      if (slug && imagePath !== `/og/${slug}.jpg`) problems.push(`${route}: og:image is ${imagePath}, not the map's card /og/${slug}.jpg`);
      const file = path.join(dist, imagePath);
      if (!existsSync(file)) problems.push(`${route}: og:image ${imagePath} is not in dist`);
      else if (!cards.has(imagePath)) {
        const buffer = readFileSync(file);
        const size = imageSize(buffer);
        cards.set(imagePath, buffer.length > OG_IMAGE.maxBytes ? `${Math.round(buffer.length / 1024)} KB (max ${OG_IMAGE.maxBytes / 1024})`
          : size?.width !== OG_IMAGE.width || size?.height !== OG_IMAGE.height ? `${size ? `${size.width}x${size.height}` : 'unreadable'}, not ${OG_IMAGE.width}x${OG_IMAGE.height}` : '');
      }
      if (cards.get(imagePath)) problems.push(`${route}: og:image ${imagePath} is ${cards.get(imagePath)}`);
      const type = html.match(/property="og:image:type" content="([^"]+)"/)?.[1];
      const expected = /\.jpe?g$/i.test(imagePath) ? 'image/jpeg' : /\.png$/i.test(imagePath) ? 'image/png' : null;
      if (expected && type !== expected) problems.push(`${route}: og:image:type is ${type ?? 'missing'}, not ${expected}`);
    }
    if (!/<script type="module"[^>]*src="\/assets\//.test(html)) problems.push(`${route}: the app script is missing`);
  }
  return problems;
}

const smokes = [...BROWSER_SMOKES];
smokes.push('scripts/links-browser-smoke.mjs', 'scripts/a11y-browser-smoke.mjs');
const smokeArgs = (script) => ['--import', './scripts/playwright-channel.mjs', script];

// Same set as `npm test` (node expands the glob itself).
run('unit tests (flat shape, content, CSS scope, prerender, budget)', ['--test', 'scripts/*.test.mjs']);

if (process.env.GOLIVE_SKIP_BUILD) {
  for (const label of ['source verification', 'production build', 'per-route share heads', 'bundle budget', 'build info']) skip(label, 'GOLIVE_SKIP_BUILD');
} else {
  run('source verification', ['scripts/verify.mjs']);
  const built = run('production build', [viteBin(root), 'build', '--outDir', dist, '--emptyOutDir']);
  if (built) {
    run('per-route share heads', ['scripts/prerender-meta.mjs', dist], { RENDER: '' });
    run('bundle budget', ['scripts/bundle-budget.mjs', dist], { RENDER: '' });
    if (defaultDist) run('build info', ['scripts/write-build-info.mjs']);
    else skip('build info', 'writes dist/ only');
  } else {
    for (const label of ['per-route share heads', 'bundle budget', 'build info']) skip(label, 'build failed');
  }
}

if (!existsSync(path.join(dist, 'index.html'))) {
  skip('per-route meta in dist', 'no dist/');
  for (const script of smokes) skip(script, 'no dist/');
} else {
  await check(`per-route meta in dist (${prerenderRoutes().length} routes)`, metaProblems);
  const server = await startPreview(await freePort(), dist);
  try {
    for (const script of smokes) run(script.replace(/^scripts\//, ''), smokeArgs(script), { SMOKE_BASE_URL: server.base, SMOKE_DIST: dist });
  } finally {
    await server.stop();
  }
}

const width = Math.max(...rows.map((row) => row.label.length));
const line = '─'.repeat(width + 18);
console.log(`\n${line}\n${'CHECK'.padEnd(width)}  RESULT    TIME\n${line}`);
for (const row of rows) console.log(`${row.label.padEnd(width)}  ${row.status.padEnd(6)}  ${row.seconds.toFixed(0).padStart(4)}s`);
console.log(line);
const failed = rows.filter((row) => row.status === 'FAIL');
const skipped = rows.filter((row) => row.status === 'SKIP');
for (const row of failed) console.log(`\n✖ ${row.label}\n${row.detail.replace(/^/gm, '    ')}`);
console.log(`\n${failed.length ? 'NOT READY' : skipped.length ? 'PASS WITH SKIPS' : 'READY'}: ${rows.length - failed.length - skipped.length} pass, ${failed.length} fail, ${skipped.length} skipped`);
process.exit(failed.length ? 1 : 0);
