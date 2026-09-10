import process from 'node:process';

const baseUrl = process.env.ZH_SMOKE_BASE_URL || 'https://zombies-hub-2-0.onrender.com';
const expectedSha = process.env.ZH_EXPECTED_SHA?.trim();
const routes = [
  '/',
  '/allmaps',
  '/easter-eggs',
  '/side-easter-eggs',
  '/side-easter-eggs/origins-speedrun',
  '/maps/origins',
  '/maps/mob-of-the-dead',
  '/maps/shadows-of-evil',
  '/maps/der-eisendrache',
  '/maps/zetsubou-no-shima',
  '/maps/gorod-krovi',
  '/maps/revelations',
];

const failures = [];

async function fetchWithTimeout(url, timeoutMs = 15_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  try {
    return await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: { 'user-agent': 'zombies-hub-smoke-check/2.0' },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function waitForBuildInfo() {
  const attempts = expectedSha ? 18 : 1;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const response = await fetchWithTimeout(new URL('/build-info.json', baseUrl));
      if (response.ok) {
        const info = await response.json();
        if (!expectedSha || info.commit === expectedSha || info.commit?.startsWith(expectedSha)) {
          return info;
        }
        console.log(`Waiting for Render: live ${String(info.commit).slice(0, 12)}, expected ${expectedSha.slice(0, 12)} (${attempt}/${attempts})`);
      }
    } catch (error) {
      console.log(`Build info check ${attempt}/${attempts} failed: ${error.message}`);
    }

    if (attempt < attempts) await new Promise((resolve) => setTimeout(resolve, 10_000));
  }

  throw new Error(expectedSha
    ? `Render did not reach expected commit ${expectedSha.slice(0, 12)} in time.`
    : 'Could not read live build-info.json.');
}

let buildInfo = null;
try {
  buildInfo = await waitForBuildInfo();
  console.log(`Live build: ${String(buildInfo.commit).slice(0, 12)} · ${buildInfo.source} · ${buildInfo.builtAt}`);
} catch (error) {
  failures.push(error.message);
}

for (const route of routes) {
  const url = new URL(route, baseUrl);
  try {
    const response = await fetchWithTimeout(url);
    const text = await response.text();
    const healthy = response.ok && text.includes('id="root"');

    if (!healthy) {
      failures.push(`${route}: HTTP ${response.status} or missing React root`);
      console.error(`FAIL ${route} -> ${response.status}`);
    } else {
      console.log(`PASS ${route} -> ${response.status}`);
    }
  } catch (error) {
    failures.push(`${route}: ${error.message}`);
    console.error(`FAIL ${route} -> ${error.message}`);
  }
}

if (failures.length) {
  console.error('\nLive smoke test failed:\n');
  for (const failure of failures) console.error(`- ${failure}`);
  process.exit(1);
}

console.log(`\nLive smoke test passed for ${routes.length} critical routes.`);
