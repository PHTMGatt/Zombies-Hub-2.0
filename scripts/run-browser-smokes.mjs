/*
 * npm run test:browser: every browser smoke (scripts/smoke-list.mjs) against SMOKE_BASE_URL (default 127.0.0.1:4173).
 *
 * Locally they run one after another, exactly as before. With CI set (GitHub Actions sets CI=true) they run
 * SMOKE_JOBS at a time (default 3, on the 4-vCPU runner) so the suite fits the job's time limit; each smoke has
 * its own browser and the smokes share nothing but the read-only preview server. The content-preservation smoke
 * always runs last, on its own. Each smoke's output is printed when it finishes; a failing smoke does not stop
 * the others, and the run exits 1 if any failed. SMOKE_JOBS=1 forces one at a time anywhere.
 */
import { spawn } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { BROWSER_SMOKES, LAST_SMOKE } from './smoke-list.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const jobs = Math.max(1, Number(process.env.SMOKE_JOBS) || (process.env.CI ? 3 : 1));
const started = Date.now();
const results = [];

function runSmoke(script) {
  return new Promise((done) => {
    const begin = Date.now();
    // Same node flags as this process (e.g. --import ./scripts/playwright-channel.mjs).
    const child = spawn(process.execPath, [...process.execArgv, script], { cwd: root, env: process.env });
    let output = '';
    child.stdout.on('data', (chunk) => { output += chunk; if (jobs === 1) process.stdout.write(chunk); });
    child.stderr.on('data', (chunk) => { output += chunk; if (jobs === 1) process.stderr.write(chunk); });
    child.on('close', (code) => {
      const seconds = (Date.now() - begin) / 1000;
      const passed = code === 0;
      if (jobs > 1) process.stdout.write(`${output.trimEnd()}\n`);
      process.stdout.write(`${passed ? 'PASS' : 'FAIL'}  ${script}  ${seconds.toFixed(0)}s\n\n`);
      results.push({ script, passed, seconds });
      done();
    });
  });
}

async function pool(scripts) {
  const queue = [...scripts];
  await Promise.all(Array.from({ length: Math.min(jobs, queue.length) }, async () => {
    while (queue.length) await runSmoke(queue.shift());
  }));
}

console.log(`${BROWSER_SMOKES.length} browser smokes, ${jobs === 1 ? 'one at a time' : `${jobs} at a time`}\n`);
await pool(BROWSER_SMOKES.filter((script) => script !== LAST_SMOKE));
if (BROWSER_SMOKES.includes(LAST_SMOKE)) await runSmoke(LAST_SMOKE);

const failed = results.filter((result) => !result.passed);
console.log(`${results.length - failed.length}/${results.length} browser smokes passed in ${((Date.now() - started) / 1000).toFixed(0)}s${failed.length ? `; FAILED: ${failed.map((result) => result.script).join(', ')}` : ''}`);
process.exit(failed.length ? 1 : 0);
