import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import process from 'node:process';
import { pathToFileURL } from 'node:url';

const ROOT = process.cwd();
const SOURCE_ROOTS = ['apps', 'maps', 'shared'];
const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const TEXT_EXTENSIONS = new Set([...CODE_EXTENSIONS, '.css']);
const failures = [];

const legacyRenderHosts = /(?:motd-guide|origins-wtyd|der-eisendrache-guide|zetsubou-guide|gorod-krovi-guide|revelations-guide)\.onrender\.com/i;
const legacyRouteFields = /\b(?:renderLink|renderUrl)\b/;
const rootRelativeCssAsset = /url\(\s*['"]?\/(?:src|images)\//i;

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (['node_modules', 'dist', 'legacy'].includes(entry.name)) continue;

    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) files.push(fullPath);
  }

  return files;
}

for (const rootName of SOURCE_ROOTS) {
  const files = await walk(join(ROOT, rootName));

  for (const file of files) {
    const rel = relative(ROOT, file).replaceAll('\\', '/');
    const source = await readFile(file, 'utf8');

    if (CODE_EXTENSIONS.has(extname(file))) {
      const defaultExports = source.match(/\bexport\s+default\b/g) ?? [];
      if (defaultExports.length > 1) {
        failures.push(`${rel}: ${defaultExports.length} default exports`);
      }

      if (legacyRouteFields.test(source)) {
        failures.push(`${rel}: legacy Render route field still present`);
      }

      if (legacyRenderHosts.test(source)) {
        failures.push(`${rel}: legacy standalone Render URL still present`);
      }
    }

    if (extname(file) === '.css' && rootRelativeCssAsset.test(source)) {
      failures.push(`${rel}: root-relative migrated CSS asset path still present`);
    }

    const isMapChrome = /^maps\/[^/]+\/src\/components\/(Header|Footer)\.(jsx?|tsx?)$/.test(rel);
    if (isMapChrome && /Zombies Hub 2\.0/i.test(source)) {
      failures.push(`${rel}: repeated "Zombies Hub 2.0" branding in map chrome`);
    }
  }
}


async function verifyGorodValveSolutions() {
  const valveFile = join(ROOT, 'maps/gorod-krovi/src/data/valveSolutions.js');
  const { default: solutions } = await import(pathToFileURL(valveFile).href);

  const connections = {
    'Armory': { 1: 'Supply Depot', 2: 'Tank Factory', 3: 'Department Store' },
    'Department Store': { 1: 'Armory', 2: 'Infirmary', 3: 'Dragon Command' },
    'Dragon Command': { 1: 'Supply Depot', 2: 'Department Store', 3: 'Infirmary' },
    'Supply Depot': { 1: 'Dragon Command', 2: 'Armory', 3: 'Tank Factory' },
    'Infirmary': { 1: 'Department Store', 2: 'Tank Factory', 3: 'Dragon Command' },
    'Tank Factory': { 1: 'Infirmary', 2: 'Supply Depot', 3: 'Armory' },
  };

  const locations = Object.keys(connections);
  const expectedPairs = locations.length * (locations.length - 1);

  if (solutions.length !== expectedPairs) {
    failures.push(`Gorod valve solver: expected ${expectedPairs} start/end combinations, found ${solutions.length}`);
  }

  const seenPairs = new Set();

  for (const solution of solutions) {
    const pairKey = `${solution.start} -> ${solution.end}`;
    if (seenPairs.has(pairKey)) failures.push(`Gorod valve solver: duplicate combination ${pairKey}`);
    seenPairs.add(pairKey);

    if (!connections[solution.start] || !connections[solution.end] || solution.start === solution.end) {
      failures.push(`Gorod valve solver: invalid endpoints ${pairKey}`);
      continue;
    }

    const settings = solution.valves ?? {};
    if (Object.keys(settings).length !== 5) {
      failures.push(`Gorod valve solver: ${pairKey} should have five routing settings before the endpoint`);
      continue;
    }

    const visited = [solution.start];
    let current = solution.start;

    for (let hop = 0; hop < 5; hop += 1) {
      const setting = settings[current];
      const next = connections[current]?.[setting];

      if (!next) {
        failures.push(`Gorod valve solver: ${pairKey} has invalid setting ${String(setting)} at ${current}`);
        break;
      }

      if (visited.includes(next)) {
        failures.push(`Gorod valve solver: ${pairKey} repeats ${next} before reaching the cylinder`);
        break;
      }

      visited.push(next);
      current = next;
    }

    if (visited.length === 6 && current !== solution.end) {
      failures.push(`Gorod valve solver: ${pairKey} ends at ${current}, not the cylinder`);
    }

    if (visited.length === 6 && new Set(visited).size !== 6) {
      failures.push(`Gorod valve solver: ${pairKey} does not visit all six valves exactly once`);
    }
  }
}

await verifyGorodValveSolutions();

if (failures.length) {
  console.error('\nZombies Hub verification failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('');
  process.exit(1);
}

console.log('Zombies Hub source verification passed.');
