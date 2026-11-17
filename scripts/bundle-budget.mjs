/*
 * Bundle-size budget, checked on every build (npm run compile, so CI and Render enforce it).
 *
 * Sizes are gzip -9 bytes, what a phone on a slow network actually downloads.
 * - entry: the JS and CSS dist/index.html loads up front (every route pays for it).
 * - flat guide: the lazy chunk holding the flat main guide and the Step details tab (FlatGuide +
 *   StepDetails), found by their class names, plus its CSS. It must stay out of the entry chunk.
 * Budgets sit about 10-30% over the sizes measured on 2026-11-16 (entry JS 102.8 KB, entry CSS 6.0 KB with the shared map tab bar,
 * flat-guide JS 1.9 KB, CSS 1.0 KB): room for normal work, a failure for an accidental heavy import.
 * Raise a budget deliberately, in the same commit as the change that needs it.
 *
 * Usage: node scripts/bundle-budget.mjs [distDir]
 */
import { readdir, readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { gzipSync } from 'node:zlib';

export const BUDGETS = {
  'entry js': 115_000,
  'entry css': 8_000,
  'flat guide js': 4_000,
  'flat guide css': 2_000,
};

// Markers that only the flat guide / Step details code contains.
export const FLAT_MARKERS = ['flat-guide__list', 'step-details__step'];

const gz = (buffer) => gzipSync(buffer, { level: 9 }).length;

export async function measure(distDir) {
  const html = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const entryFiles = (kind) => [...html.matchAll(kind === 'js'
    ? /<script\b[^>]*type="module"[^>]*src="\/([^"]+\.js)"/g
    : /<link\b[^>]*rel="stylesheet"[^>]*href="\/([^"]+\.css)"/g)].map((match) => match[1]);
  const sizeOf = async (files) => (await Promise.all(files.map(async (file) => gz(await readFile(path.join(distDir, file)))))).reduce((a, b) => a + b, 0);

  const assets = path.join(distDir, 'assets');
  const names = await readdir(assets);
  const js = names.filter((name) => name.endsWith('.js'));
  const flatJs = [];
  for (const name of js) {
    const text = await readFile(path.join(assets, name), 'utf8');
    if (FLAT_MARKERS.some((marker) => text.includes(marker))) flatJs.push(`assets/${name}`);
  }
  // A lazy chunk's CSS is emitted under the chunk's name (StepDetails-<hash>.js → StepDetails-<hash>.css).
  // Vite's hash is 8 characters and may itself contain "-".
  const stem = (name) => name.replace(/-[\w-]{8}\.(js|css)$/, '');
  const stems = new Set(flatJs.map((file) => stem(path.basename(file))));
  const flatCss = names.filter((name) => name.endsWith('.css') && stems.has(stem(name))).map((name) => `assets/${name}`);
  const entryJs = entryFiles('js');
  return {
    files: { entryJs, flatJs, flatCss },
    sizes: {
      'entry js': await sizeOf(entryJs),
      'entry css': await sizeOf(entryFiles('css')),
      'flat guide js': await sizeOf(flatJs),
      'flat guide css': await sizeOf(flatCss),
    },
  };
}

export function check({ files, sizes }, budgets = BUDGETS) {
  const problems = [];
  if (!files.entryJs.length) problems.push('no entry script found in index.html');
  if (!files.flatJs.length) problems.push(`no chunk contains the flat guide markers (${FLAT_MARKERS.join(', ')})`);
  const inEntry = files.flatJs.filter((file) => files.entryJs.includes(file));
  if (inEntry.length) problems.push(`the flat guide code is in the entry chunk (${inEntry.join(', ')}); keep it lazy`);
  for (const [name, limit] of Object.entries(budgets)) {
    if (sizes[name] > limit) problems.push(`${name}: ${sizes[name]} B gzip, over its ${limit} B budget`);
  }
  return problems;
}

// The CLI step. Over budget fails CI and golive-check (exit 1). On Render's production build (RENDER is set)
// it only warns: a size regression must never block a deploy of a fix; CI has already reported it.
export async function runBudget(distDir, { env = process.env, log = console } = {}) {
  let problems;
  let line = '';
  try {
    const result = await measure(distDir);
    problems = check(result);
    line = Object.entries(result.sizes).map(([name, size]) => `${name} ${(size / 1000).toFixed(1)}/${(BUDGETS[name] / 1000).toFixed(1)} KB`).join(', ');
  } catch (error) {
    problems = [`could not measure dist: ${error.message}`];
  }
  if (!problems.length) {
    log.log(`bundle-budget: ok (${line}, gzip)`);
    return 0;
  }
  const report = `(${line || 'not measured'})\n- ${problems.join('\n- ')}`;
  if (env.RENDER) {
    log.warn(`bundle-budget: WARNING on the Render build, deploy continues ${report}`);
    return 0;
  }
  log.error(`bundle-budget: FAILED ${report}`);
  return 1;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runBudget(path.resolve(process.argv[2] || 'dist'));
}
