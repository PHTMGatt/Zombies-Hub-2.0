import { readdir, readFile } from 'node:fs/promises';
import { extname, join, relative } from 'node:path';
import process from 'node:process';

const ROOT = process.cwd();
const SOURCE_ROOTS = ['apps', 'maps', 'shared'];
const CODE_EXTENSIONS = new Set(['.js', '.jsx', '.ts', '.tsx']);
const TEXT_EXTENSIONS = new Set([...CODE_EXTENSIONS, '.css']);
const LEGACY_RENDER_HOSTS = [
  'origins-wtyd.onrender.com',
  'motd-guide.onrender.com',
  'der-eisendrache-guide.onrender.com',
  'zetsubou-guide.onrender.com',
  'gorod-krovi-guide.onrender.com',
  'revelations-guide.onrender.com',
];
const failures = [];

async function walk(directory) {
  const entries = await readdir(directory, { withFileTypes: true });
  const files = [];

  for (const entry of entries) {
    if (entry.name === 'node_modules' || entry.name === 'dist') continue;
    const fullPath = join(directory, entry.name);
    if (entry.isDirectory()) files.push(...await walk(fullPath));
    else if (TEXT_EXTENSIONS.has(extname(entry.name))) files.push(fullPath);
  }

  return files;
}

function isRuntimeSource(rel) {
  return rel.startsWith('apps/hub/src/')
    || /^maps\/[^/]+\/(src|routes)\//.test(rel)
    || rel.startsWith('shared/');
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
    }

    const isMapChrome = /^maps\/[^/]+\/src\/components\/(Header|Footer)\.(jsx?|tsx?)$/.test(rel);
    if (isMapChrome && /Zombies Hub 2\.0/i.test(source)) {
      failures.push(`${rel}: repeated \"Zombies Hub 2.0\" branding in map chrome`);
    }

    if (isRuntimeSource(rel)) {
      for (const host of LEGACY_RENDER_HOSTS) {
        if (source.includes(host)) {
          failures.push(`${rel}: runtime code still references legacy Render host ${host}`);
        }
      }
    }
  }
}

if (failures.length) {
  console.error('\nZombies Hub verification failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  console.error('');
  process.exit(1);
}

console.log('Zombies Hub source verification passed.');
