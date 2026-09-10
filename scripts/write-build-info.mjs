import { mkdir, writeFile } from 'node:fs/promises';
import path from 'node:path';

const distDir = path.resolve(process.cwd(), 'dist');
const commit =
  process.env.RENDER_GIT_COMMIT ||
  process.env.GITHUB_SHA ||
  'local';
const branch =
  process.env.RENDER_GIT_BRANCH ||
  process.env.GITHUB_REF_NAME ||
  'local';
const source = process.env.RENDER
  ? 'render'
  : process.env.GITHUB_ACTIONS
    ? 'github-actions'
    : 'local';

await mkdir(distDir, { recursive: true });
await writeFile(
  path.join(distDir, 'build-info.json'),
  `${JSON.stringify({ commit, branch, source, builtAt: new Date().toISOString() }, null, 2)}\n`,
  'utf8',
);

console.log(`Build metadata written for ${commit.slice(0, 12)} (${source}).`);
