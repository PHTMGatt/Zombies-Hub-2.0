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
const sleep = (ms) => new Promise((resolve) => setTimeout(resolve, ms));

async function fetchWithTimeout(url, timeoutMs = 12_000) {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    return await fetch(url, {
      redirect: 'follow',
      cache: 'no-store',
      signal: controller.signal,
      headers: {
        'cache-control': 'no-cache',
        'user-agent': 'zombies-hub-smoke-check/2.0',
      },
    });
  } finally {
    clearTimeout(timeout);
  }
}

async function warmProduction() {
  const url = new URL('/', baseUrl);

  for (let attempt = 1; attempt <= 2; attempt += 1) {
    try {
      const response = await fetchWithTimeout(url, 20_000);
      if (response.ok) {
        console.log(`Production warm-up passed on attempt ${attempt}/2.`);
        return;
      }
      console.log(`Production warm-up ${attempt}/2 returned HTTP ${response.status}.`);
    } catch (error) {
      console.log(`Production warm-up ${attempt}/2 failed: ${error.message}`);
    }

    if (attempt < 2) await sleep(3_000);
  }

  console.log('Production warm-up did not complete; continuing to explicit smoke checks.');
}

async function waitForBuildInfo() {
  const attempts = expectedSha ? 12 : 4;
  const retryDelay = expectedSha ? 8_000 : 3_000;

  for (let attempt = 1; attempt <= attempts; attempt += 1) {
    try {
      const url = new URL('/build-info.json', baseUrl);
      url.searchParams.set('_smoke', `${Date.now()}-${attempt}`);

      const response = await fetchWithTimeout(url);
      if (response.ok) {
        const body = await response.text();

        try {
          const info = JSON.parse(body);
          if (!expectedSha || info.commit === expectedSha || info.commit?.startsWith(expectedSha)) {
            return info;
          }

          console.log(
            `Waiting for Render: live ${String(info.commit).slice(0, 12)}, expected ${expectedSha.slice(0, 12)} (${attempt}/${attempts})`,
          );
        } catch {
          console.log(
            `Build info check ${attempt}/${attempts} returned non-JSON content (${response.headers.get('content-type') || 'unknown type'}).`,
          );
        }
      } else {
        console.log(`Build info check ${attempt}/${attempts} returned HTTP ${response.status}.`);
      }
    } catch (error) {
      console.log(`Build info check ${attempt}/${attempts} failed: ${error.message}`);
    }

    if (attempt < attempts) await sleep(retryDelay);
  }

  throw new Error(
    expectedSha
      ? `Render did not reach expected commit ${expectedSha.slice(0, 12)} in time.`
      : 'Could not read live build-info.json after retries.',
  );
}

await warmProduction();

let buildInfo = null;
try {
  buildInfo = await waitForBuildInfo();
  console.log(
    `Live build: ${String(buildInfo.commit).slice(0, 12)} · ${buildInfo.source} · ${buildInfo.builtAt}`,
  );
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
