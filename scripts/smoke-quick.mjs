// One command for a quick browser check: build if needed, start `vite preview` on a free port, wait until it
// really answers, run the route checks at 390×844, 844×390 and 1440×900 (browser-smoke.mjs), stop the server.
//   npm run smoke:quick                   # route checks
//   npm run smoke:quick -- --all          # every browser smoke (the test:browser list)
//   npm run smoke:quick -- --build        # rebuild dist/ first
//   ZH_BROWSER_CHANNEL=chrome npm run smoke:quick   # use installed Chrome instead of Playwright's Chromium
import { spawn } from 'node:child_process';
import { existsSync } from 'node:fs';
import { resolve } from 'node:path';
import { freePort, startPreview } from './smoke-helpers.mjs';
import { BROWSER_SMOKES } from './smoke-list.mjs';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (command, commandArgs, options = {}) => new Promise((done, fail) => {
  const child = spawn(command, commandArgs, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', ...options });
  child.on('exit', (code) => (code === 0 ? done() : fail(new Error(`${command} ${commandArgs.join(' ')} exited with ${code}`))));
});
if (args.includes('--build') || !existsSync(resolve(root, 'dist/index.html'))) await run(npm, ['run', 'build']);

const port = Number(process.env.SMOKE_PORT) || await freePort();
let failed = false;
let preview;
try {
  preview = await startPreview(port);
  const { base } = preview;
  const scripts = args.includes('--all')
    ? BROWSER_SMOKES
    : ['scripts/browser-smoke.mjs'];
  const env = { ...process.env, SMOKE_BASE_URL: base };
  for (const script of scripts) {
    console.log(`\n▶ ${script} against ${base}`);
    await run(process.execPath, ['--import', './scripts/playwright-channel.mjs', script], { env, shell: false });
  }
  console.log(`\n✔ ${scripts.length} browser smoke${scripts.length === 1 ? '' : 's'} passed against ${base}`);
} catch (error) {
  failed = true;
  console.error(`\n✘ ${error.message}`);
} finally {
  await preview?.stop();
}
process.exit(failed ? 1 : 0);
