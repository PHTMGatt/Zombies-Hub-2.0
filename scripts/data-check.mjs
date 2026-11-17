/*
 * Build-time data check (part of npm run check): load each map's guide data the way the app does and fail the
 * build with plain, located messages when something a page needs is missing or wrong.
 *   - figures: the image file exists, its real shape matches the declared width/height, alt text and caption
 *     (rules in shared/figure/figureSchema.js)
 *   - hunts: every Revelations hunt loads into the picker (shared/hunt/hunt.js) with the counts huntData promises
 *   - video clips: whole seconds, end after start, inside their area's section
 *   - Origins staffs: four staff pages, each with a code chart and a staffPuzzleFacts record of the right shape
 * Warnings (shown, build continues) are for things a person must judge, like a clip that starts a second before its
 * area's section. The pure checks are exported for scripts/data-check.test.mjs. Exit 1 on any problem.
 */
import { existsSync, readFileSync } from 'node:fs';
import * as nodeModule from 'node:module';
import path from 'node:path';
import { fileURLToPath, pathToFileURL } from 'node:url';
import { figureProblems } from '../shared/figure/figureSchema.js';
import { imageSize } from './prerender-meta.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// WebP (VP8, VP8L, VP8X), PNG and JPEG sizes, read from the file header.
export function pictureSize(buffer) {
  if (buffer.length > 30 && buffer.toString('ascii', 0, 4) === 'RIFF' && buffer.toString('ascii', 8, 12) === 'WEBP') {
    const chunk = buffer.toString('ascii', 12, 16);
    if (chunk === 'VP8 ') return { width: buffer.readUInt16LE(26) & 0x3fff, height: buffer.readUInt16LE(28) & 0x3fff };
    if (chunk === 'VP8L') {
      const bits = buffer.readUInt32LE(21);
      return { width: (bits & 0x3fff) + 1, height: ((bits >> 14) & 0x3fff) + 1 };
    }
    if (chunk === 'VP8X') return { width: 1 + buffer.readUIntLE(24, 3), height: 1 + buffer.readUIntLE(27, 3) };
  }
  return imageSize(buffer);
}

// figure.src is a file path here (scripts/asset-loader.mjs turns image imports into paths).
export function figureFileProblems(figure, where, { caption = true } = {}) {
  const problems = figureProblems(caption ? figure : { ...figure, caption: figure.caption || '(not needed)' }, where);
  if (!figure.src) return problems;
  if (!existsSync(figure.src)) return [...problems, `${where}: image file ${path.relative(root, figure.src)} is missing`];
  const size = pictureSize(readFileSync(figure.src));
  if (!size) return [...problems, `${where}: cannot read the size of ${path.basename(figure.src)}`];
  if (figure.width && figure.height && Math.abs(size.width / size.height - figure.width / figure.height) > 0.01) {
    problems.push(`${where}: declared ${figure.width}x${figure.height} but ${path.basename(figure.src)} is ${size.width}x${size.height} (wrong shape: the page jumps as it loads)`);
  }
  return problems;
}

// clips: [{ start, end?, label }] in seconds.
export function clipProblems(clips, where) {
  const problems = [];
  for (const { start, end, label } of clips) {
    if (!Number.isInteger(start) || start < 0) problems.push(`${where}: ${label}: start ${start} is not a whole number of seconds`);
    else if (end != null && (!Number.isInteger(end) || end <= start)) problems.push(`${where}: ${label}: end ${end} must be after start ${start}`);
  }
  return problems;
}

// staffPuzzleFacts.js records: the fields every visual direction reads, with the chart file it names.
export function staffFactProblems(key, fact, chartDir) {
  const problems = [];
  const at = `origins ${key} staff facts`;
  for (const field of ['puzzle', 'chart', 'status']) if (typeof fact[field] !== 'string' || !fact[field].trim()) problems.push(`${at}: no ${field}`);
  if (![true, false, null].includes(fact.randomPerGame)) problems.push(`${at}: randomPerGame must be true, false or null (unknown)`);
  if (!Array.isArray(fact.open)) problems.push(`${at}: open must be a list (empty when nothing is open)`);
  const file = fact.chart?.split(':')[0]?.trim();
  if (file && !existsSync(path.join(chartDir, file))) problems.push(`${at}: chart ${file} is not in ${path.relative(root, chartDir)}`);
  if (fact.upgradeSpots) {
    const spots = fact.upgradeSpots;
    if (!spots.steps) problems.push(`${at}: upgradeSpots has no steps`);
    for (const list of ['verifiedPlaces', 'conflictingPlaces']) if (!Array.isArray(spots[list])) problems.push(`${at}: upgradeSpots.${list} must be a list`);
  }
  return problems;
}

export async function collectProblems() {
  const problems = [];
  const warnings = [];
  const load = (file) => import(pathToFileURL(path.join(root, file)).href);

  const shots = await load('maps/revelations/src/data/revReferenceShots.js');
  for (const group of [...shots.servantRocks, ...shots.boneSpots]) {
    group.images.forEach((image, i) => problems.push(...figureFileProblems(image, `revelations ${group.id} picture ${i + 1}`)));
  }
  problems.push(...figureFileProblems(shots.turretShot, 'revelations turret shot'));

  try {
    const { revHunts } = await load('maps/revelations/src/data/huntSets.js');
    const { huntCounts } = await load('maps/revelations/src/data/huntData.js');
    const count = (hunt) => hunt.sets.reduce((sum, set) => sum + set.items.length, 0);
    for (const name of ['bones', 'eggs', 'runes', 'throws']) {
      if (count(revHunts[name]) !== huntCounts[name]) problems.push(`revelations ${name}: ${count(revHunts[name])} spots, huntData says ${huntCounts[name]}`);
    }
    for (const [name, hunt] of Object.entries(revHunts)) {
      for (const set of hunt.sets) {
        const timed = set.items.filter((item) => item.video);
        problems.push(...clipProblems(timed.map((item) => ({ ...item.video, label: `${set.label} · ${item.label}` })), `revelations ${name}`));
        if (!set.video) continue;
        for (const item of timed) {
          const end = item.video.end ?? item.video.start;
          if (item.video.start < set.video.start || end > set.video.end) {
            warnings.push(`revelations ${name}: ${item.label} (${item.video.start}–${end}s) is outside its area ${set.label} (${set.video.start}–${set.video.end}s)`);
          }
        }
      }
    }
  } catch (error) {
    problems.push(`revelations hunts: ${error.message}`);
  }

  const { default: staffPages, STAFF_ORDER } = await load('maps/origins/src/data/originsStaffPages.js');
  const { staffPuzzleFacts } = await load('maps/origins/src/data/staffPuzzleFacts.js');
  if (STAFF_ORDER.length !== 4) problems.push(`origins: ${STAFF_ORDER.length} staffs in STAFF_ORDER, expected 4`);
  for (const key of STAFF_ORDER) {
    const chart = staffPages[key]?.puzzle?.chart;
    if (!chart) problems.push(`origins ${key} staff: no code chart`);
    else problems.push(...figureFileProblems(chart, `origins ${key} staff code chart`, { caption: false }));
    if (!staffPuzzleFacts[key]) problems.push(`origins ${key} staff: no record in staffPuzzleFacts.js`);
    else problems.push(...staffFactProblems(key, staffPuzzleFacts[key], path.join(root, 'maps/origins/src/assets/images')));
  }
  return { problems, warnings };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  // registerHooks (in-thread, Node 22.15+); register is the older off-thread fallback.
  if (nodeModule.registerHooks) nodeModule.registerHooks(await import('./asset-loader.mjs'));
  else nodeModule.register('./asset-loader.mjs', import.meta.url);
  const { problems, warnings } = await collectProblems();
  for (const warning of warnings) console.warn(`Data check warning: ${warning}`);
  if (problems.length) {
    console.error(`Data check: ${problems.length} problem(s)\n- ${problems.join('\n- ')}`);
    process.exitCode = 1;
  } else {
    console.log('Data check passed: figures (files, real sizes, alt, captions), Revelations hunts and clip times, Origins staff charts and facts.');
  }
}
