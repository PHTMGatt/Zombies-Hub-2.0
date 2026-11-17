import assert from 'node:assert/strict';
import { mkdtemp, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { readFileSync } from 'node:fs';
import { execFileSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { clipProblems, figureFileProblems, pictureSize, staffFactProblems } from './data-check.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const bone = path.join(root, 'maps/revelations/src/assets/rev-ref/bone-spawn.webp');
const chart = path.join(root, 'maps/origins/src/assets/images/ice_staff_code.webp');

test('pictureSize reads WebP headers (the repo’s own screenshots and charts)', () => {
  assert.deepEqual(pictureSize(readFileSync(bone)), { width: 1280, height: 720 });
  assert.deepEqual(pictureSize(readFileSync(chart)), { width: 1600, height: 1040 });
  assert.equal(pictureSize(Buffer.from('not an image')), null);
});

test('figure files: missing file, wrong shape and missing caption are build errors with the figure named', async () => {
  const ok = { src: bone, alt: 'Bone above the spawn church candle', caption: 'Shoot it', width: 1280, height: 720 };
  assert.deepEqual(figureFileProblems(ok, 'rev bone'), []);
  assert.deepEqual(figureFileProblems({ ...ok, width: 1280, height: 1280 }, 'rev bone'), ['rev bone: declared 1280x1280 but bone-spawn.webp is 1280x720 (wrong shape: the page jumps as it loads)']);
  assert.deepEqual(figureFileProblems({ ...ok, width: 640, height: 360 }, 'rev bone'), [], 'same shape, smaller declared size is fine');
  assert.deepEqual(figureFileProblems({ ...ok, src: path.join(root, 'nope.webp') }, 'rev bone'), ['rev bone: image file nope.webp is missing']);
  assert.deepEqual(figureFileProblems({ ...ok, caption: '' }, 'rev bone'), ['rev bone: no caption']);
  assert.deepEqual(figureFileProblems({ ...ok, caption: '' }, 'chart', { caption: false }), [], 'charts may go without a caption');
  const dir = await mkdtemp(path.join(tmpdir(), 'zh-data-'));
  try {
    await writeFile(path.join(dir, 'junk.webp'), 'junk');
    assert.deepEqual(figureFileProblems({ ...ok, src: path.join(dir, 'junk.webp') }, 'x'), ['x: cannot read the size of junk.webp']);
  } finally {
    await rm(dir, { recursive: true, force: true });
  }
});

test('clip times: whole seconds, end after start', () => {
  assert.deepEqual(clipProblems([{ start: 10, end: 12, label: 'A' }, { start: 5, label: 'B' }], 'rev'), []);
  assert.deepEqual(clipProblems([{ start: 10, end: 10, label: 'A' }], 'rev'), ['rev: A: end 10 must be after start 10']);
  assert.deepEqual(clipProblems([{ start: 1.5, label: 'B' }], 'rev'), ['rev: B: start 1.5 is not a whole number of seconds']);
  assert.deepEqual(clipProblems([{ start: -1, label: 'C' }], 'rev'), ['rev: C: start -1 is not a whole number of seconds']);
});

test('staff puzzle facts: required fields, a known randomPerGame, a chart file that exists', () => {
  const dir = path.join(root, 'maps/origins/src/assets/images');
  const ok = { puzzle: 'Match symbols', randomPerGame: null, chart: 'ice_staff_code.webp: 12 pairs', status: 'Checked', open: [] };
  assert.deepEqual(staffFactProblems('ice', ok, dir), []);
  assert.deepEqual(staffFactProblems('ice', { ...ok, randomPerGame: 'maybe' }, dir), ['origins ice staff facts: randomPerGame must be true, false or null (unknown)']);
  assert.deepEqual(staffFactProblems('ice', { ...ok, status: '' }, dir), ['origins ice staff facts: no status']);
  assert.deepEqual(staffFactProblems('ice', { ...ok, chart: 'gone.webp: x' }, dir), [`origins ice staff facts: chart gone.webp is not in ${path.join('maps', 'origins', 'src', 'assets', 'images')}`]);
  assert.deepEqual(staffFactProblems('ice', { ...ok, upgradeSpots: { steps: 'x', verifiedPlaces: [] } }, dir), ['origins ice staff facts: upgradeSpots.conflictingPlaces must be a list']);
});

test('the real guide data passes the build-time check', () => {
  const out = execFileSync(process.execPath, [path.join(root, 'scripts/data-check.mjs')], { encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] });
  assert.match(out, /Data check passed/);
});
