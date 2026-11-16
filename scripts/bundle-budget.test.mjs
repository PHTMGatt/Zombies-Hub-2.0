import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { randomBytes } from 'node:crypto';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { BUDGETS, check, measure, runBudget } from './bundle-budget.mjs';

// A tiny fake dist: an entry script + stylesheet and a lazy StepDetails chunk (hash with a "-" in it).
async function fakeDist({ flatInEntry = false, entryPadding = 0 } = {}) {
  const dist = await mkdtemp(path.join(tmpdir(), 'zh-budget-'));
  await mkdir(path.join(dist, 'assets'));
  await writeFile(path.join(dist, 'index.html'), '<script type="module" crossorigin src="/assets/index-Ab12_x9Z.js"></script><link rel="stylesheet" crossorigin href="/assets/index-Zz00aa11.css">');
  // Random bytes do not compress, so the padding counts in full against the gzip budget.
  const padding = entryPadding ? randomBytes(entryPadding).toString('base64') : '';
  await writeFile(path.join(dist, 'assets', 'index-Ab12_x9Z.js'), `console.log("app");${flatInEntry ? '"flat-guide__list"' : ''}/*${padding}*/`);
  await writeFile(path.join(dist, 'assets', 'index-Zz00aa11.css'), 'body{margin:0}');
  await writeFile(path.join(dist, 'assets', 'StepDetails-CXXHr-HU.js'), 'export default "step-details__step flat-guide__list";');
  await writeFile(path.join(dist, 'assets', 'StepDetails-BtXDTcs4.css'), '.flat-guide__list{margin:0}');
  return dist;
}

test('finds the entry files and the lazy flat-guide chunk with its CSS', async () => {
  const dist = await fakeDist();
  try {
    const result = await measure(dist);
    assert.deepEqual(result.files.entryJs, ['assets/index-Ab12_x9Z.js']);
    assert.deepEqual(result.files.flatJs, ['assets/StepDetails-CXXHr-HU.js']);
    assert.deepEqual(result.files.flatCss, ['assets/StepDetails-BtXDTcs4.css'], 'a hash containing "-" still pairs JS with its CSS');
    for (const name of Object.keys(BUDGETS)) assert(result.sizes[name] > 0, `${name} is measured`);
    assert.deepEqual(check(result), []);
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test('fails when the flat guide lands in the entry chunk or a budget is blown', async () => {
  const inEntry = await fakeDist({ flatInEntry: true });
  const heavy = await fakeDist({ entryPadding: 120_000 });
  try {
    assert.match(check(await measure(inEntry)).join('\n'), /in the entry chunk/);
    assert.match(check(await measure(heavy)).join('\n'), /entry js: \d+ B gzip, over its 115000 B budget/);
  } finally {
    await rm(inEntry, { recursive: true, force: true });
    await rm(heavy, { recursive: true, force: true });
  }
});

test('fails loudly when the markers disappear instead of passing on zero bytes', () => {
  const problems = check({ files: { entryJs: ['assets/index.js'], flatJs: [], flatCss: [] }, sizes: { 'entry js': 1, 'entry css': 1, 'flat guide js': 0, 'flat guide css': 0 } });
  assert.match(problems.join('\n'), /no chunk contains the flat guide markers/);
});

test('over budget fails CI but only warns on the Render build (the deploy goes on)', async () => {
  const heavy = await fakeDist({ entryPadding: 120_000 });
  const quiet = () => { const lines = []; return { lines, log: { log: (m) => lines.push(['log', m]), warn: (m) => lines.push(['warn', m]), error: (m) => lines.push(['error', m]) } }; };
  try {
    const ci = quiet();
    assert.equal(await runBudget(heavy, { env: {}, log: ci.log }), 1, 'CI / golive-check: exit 1');
    assert.match(ci.lines[0][1], /FAILED/);
    const render = quiet();
    assert.equal(await runBudget(heavy, { env: { RENDER: 'true' }, log: render.log }), 0, 'Render: exit 0');
    assert.equal(render.lines[0][0], 'warn');
    assert.match(render.lines[0][1], /WARNING on the Render build, deploy continues/);
    assert.equal(await runBudget(path.join(heavy, 'missing'), { env: { RENDER: 'true' }, log: quiet().log }), 0, 'Render: an unreadable dist only warns');
  } finally {
    await rm(heavy, { recursive: true, force: true });
  }
});
