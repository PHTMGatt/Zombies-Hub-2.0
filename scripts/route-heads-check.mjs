/*
 * Production routing check, no browser: what a share crawler or search engine gets for each kind of path.
 *   node scripts/route-heads-check.mjs [distDir]       serves distDir with the production server (npm start, scripts/serve-dist.mjs)
 *   ROUTE_CHECK_BASE=https://zombies-hub-2-0.onrender.com node scripts/route-heads-check.mjs   checks the live site
 * Checks: a map tab and a map get their own title and that map's card (og:image), a hub page with a trailing
 * slash gets its head, Home is 200, junk is a real 404 with noindex, a client route still loads the app (200),
 * sitemap.xml and robots.txt are served, and the app's script loads. Exit 1 on any problem.
 */
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeTitle } from '../apps/hub/src/app/routeMetadata.js';
import { escapeText } from './prerender-meta.mjs';
import { distServer } from './serve-dist.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const titleOf = (html) => html.match(/<title>([^<]*)<\/title>/)?.[1];
const metaOf = (html, key, value) => html.match(new RegExp(`<meta\\b[^>]*${key}="${value}"[^>]*content="([^"]*)"`))?.[1];

export async function routeProblems(base) {
  const problems = [];
  const get = async (pathname) => {
    const response = await fetch(`${base}${pathname}`, { redirect: 'manual', headers: { 'User-Agent': 'zh-route-check' } });
    return { status: response.status, type: response.headers.get('content-type') ?? '', text: await response.text() };
  };
  const expect = (label, ok) => { if (!ok) problems.push(label); };

  for (const [pathname, page, card] of [
    ['/maps/origins/ice-staff', '/maps/origins/ice-staff', '/og/origins.jpg'],
    ['/maps/revelations', '/maps/revelations', '/og/revelations.jpg'],
    ['/maps/gorod-krovi/step-details/', '/maps/gorod-krovi/step-details', '/og/gorod-krovi.jpg'],
    ['/allmaps/', '/allmaps', '/og-image.png'],
  ]) {
    const { status, text } = await get(pathname);
    expect(`${pathname}: status ${status}, not 200`, status === 200);
    expect(`${pathname}: title "${titleOf(text)}", not "${routeTitle(page)}"`, titleOf(text) === escapeText(routeTitle(page)));
    const image = metaOf(text, 'property', 'og:image');
    expect(`${pathname}: og:image ${image}, not …${card}`, Boolean(image?.endsWith(card)));
    expect(`${pathname}: carries noindex`, !/name="robots" content="noindex"/.test(text));
  }

  const home = await get('/');
  expect(`/: status ${home.status}`, home.status === 200 && /<div id="root">/.test(home.text));

  for (const pathname of ['/no-such-page', '/wp-login.php']) {
    const { status, text } = await get(pathname);
    expect(`${pathname}: status ${status}, not 404`, status === 404);
    expect(`${pathname}: the 404 page has no noindex`, /name="robots" content="noindex"/.test(text));
    expect(`${pathname}: the 404 page is not the app shell (no "Page not found" page)`, /<div id="root">/.test(text) && /Page not found/.test(titleOf(text) ?? ''));
  }

  const client = await get('/maps/origins/no-such-tab');
  expect(`/maps/origins/no-such-tab: status ${client.status}, the app should load and show its own 404`, client.status === 200 && /<div id="root">/.test(client.text));

  const sitemap = await get('/sitemap.xml');
  expect(`/sitemap.xml: status ${sitemap.status} ${sitemap.type}`, sitemap.status === 200 && /<urlset/.test(sitemap.text));
  const robots = await get('/robots.txt');
  expect(`/robots.txt: status ${robots.status}`, robots.status === 200 && /Sitemap: https?:\/\/\S+\/sitemap\.xml/.test(robots.text));

  const script = home.text.match(/<script type="module"[^>]*src="([^"]+)"/)?.[1];
  const app = script ? await get(script) : { status: 0, type: '' };
  expect(`app script ${script}: status ${app.status} ${app.type}`, app.status === 200 && /javascript/.test(app.type));
  return problems;
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  let base = process.env.ROUTE_CHECK_BASE?.replace(/\/$/, '');
  let server;
  if (!base) {
    server = distServer(path.resolve(process.argv[2] || path.join(root, 'dist')));
    await new Promise((done) => server.listen(0, '127.0.0.1', done));
    base = `http://127.0.0.1:${server.address().port}`;
  }
  try {
    const problems = await routeProblems(base);
    if (problems.length) {
      console.error(`Production routing: ${problems.length} problem(s) at ${base}\n- ${problems.join('\n- ')}`);
      process.exitCode = 1;
    } else console.log(`Production routing OK at ${base}: per-route heads and map cards, trailing slashes, real 404s with noindex, client routes, sitemap, robots, app script`);
  } finally {
    server?.close();
  }
}
