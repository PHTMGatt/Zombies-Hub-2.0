// One command for a quick browser check: build if needed, start `vite preview` on a free port, wait until it
// really answers, run the route checks at 390×844, 844×390 and 1440×900 (browser-smoke.mjs), stop the server.
//   npm run smoke:quick                   # route checks
//   npm run smoke:quick -- --all          # every browser smoke (the test:browser list)
//   npm run smoke:quick -- --build        # rebuild dist/ first
//   ZH_BROWSER_CHANNEL=chrome npm run smoke:quick   # use installed Chrome instead of Playwright's Chromium
import { spawn } from 'node:child_process';
import { existsSync, readFileSync } from 'node:fs';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

const root = resolve(import.meta.dirname, '..');
const args = process.argv.slice(2);
const npm = process.platform === 'win32' ? 'npm.cmd' : 'npm';
const run = (command, commandArgs, options = {}) => new Promise((done, fail) => {
  const child = spawn(command, commandArgs, { cwd: root, stdio: 'inherit', shell: process.platform === 'win32', ...options });
  child.on('exit', (code) => (code === 0 ? done() : fail(new Error(`${command} ${commandArgs.join(' ')} exited with ${code}`))));
});
const freePort = () => new Promise((done) => {
  const server = createServer().listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(() => done(port));
  });
});
const waitForServer = async (url, timeoutMs = 60000) => {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok && (await response.text()).includes('id="root"')) return;
    } catch { /* not up yet */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`preview server did not answer at ${url} within ${timeoutMs / 1000}s`);
};

if (args.includes('--build') || !existsSync(resolve(root, 'dist/index.html'))) await run(npm, ['run', 'build']);

const port = Number(process.env.SMOKE_PORT) || await freePort();
const base = `http://127.0.0.1:${port}`;
const preview = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'preview', '--host', '127.0.0.1', '--port', String(port), '--strictPort'],
  { cwd: root, stdio: ['ignore', 'pipe', 'inherit'] });
let failed = false;
try {
  await waitForServer(`${base}/`);
  const scripts = args.includes('--all')
    ? [...JSON.parse(readFileSync(resolve(root, 'package.json'), 'utf8')).scripts['test:browser'].matchAll(/scripts\/[\w-]+\.mjs/g)].map(([path]) => path)
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
  preview.kill();
}
process.exit(failed ? 1 : 0);
