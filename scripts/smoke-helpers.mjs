import { spawn } from 'node:child_process';
import { createServer } from 'node:net';
import { resolve } from 'node:path';

// Shared readiness waits for the browser smokes: wait for the page to be done, never for a fixed time.

// Web fonts loaded and two frames painted: late font swaps and the guide's fonts-ready deep-link landing
// (shared/guide/GuideSteps.jsx) have run, so positions read now are final.
export const settled = (page) => page.evaluate(() => document.fonts.ready
  .then(() => new Promise((done) => requestAnimationFrame(() => requestAnimationFrame(done)))));

const root = resolve(import.meta.dirname, '..');

export const freePort = () => new Promise((done) => {
  const server = createServer().listen(0, '127.0.0.1', () => {
    const { port } = server.address();
    server.close(() => done(port));
  });
});

export async function waitForServer(url, timeoutMs = 60000) {
  const deadline = Date.now() + timeoutMs;
  while (Date.now() < deadline) {
    try {
      const response = await fetch(url);
      if (response.ok && (await response.text()).includes('id="root"')) return;
    } catch { /* not up yet */ }
    await new Promise((done) => setTimeout(done, 250));
  }
  throw new Error(`preview server did not answer at ${url} within ${timeoutMs / 1000}s`);
}

// `vite preview` of the built app (dist/, or SMOKE_DIST) on a port; resolves once it serves the app.
export async function startPreview(port, outDir = process.env.SMOKE_DIST || 'dist') {
  const child = spawn(process.execPath, [resolve(root, 'node_modules/vite/bin/vite.js'), 'preview', '--outDir', outDir,
    '--host', '127.0.0.1', '--port', String(port), '--strictPort'], { cwd: root, stdio: ['ignore', 'ignore', 'inherit'] });
  const base = `http://127.0.0.1:${port}`;
  try {
    await waitForServer(`${base}/`);
  } catch (error) {
    child.kill();
    throw error;
  }
  const stop = () => new Promise((done) => {
    if (child.exitCode !== null || child.signalCode !== null) return done();
    child.once('exit', () => done());
    child.kill();
  });
  return { base, stop };
}

// Flat main guides: a step's detail lives on the map's Step details tab, one section per step
// (section[data-step=<step id>]). Opens that tab (if needed) and returns the step's section.
export async function stepDetails(page, base, mapRoute, stepId) {
  const url = `${base}${mapRoute}/step-details`;
  if (!page.url().startsWith(url)) await page.goto(url, { waitUntil: 'networkidle' });
  const section = page.locator(`section.step-details__step[data-step="${stepId}"]`);
  await section.waitFor();
  return section;
}

// Flat guide titles start with a screen-reader-only "Step N:"; this is the visible title.
export const visibleTitle = async (locator) => (await locator.innerText()).replace(/^Step \d+:\s*/, '');
