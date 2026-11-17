import assert from 'node:assert/strict';
import { mkdtemp, mkdir, readdir, readFile, rm, writeFile } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { dedicatedGuideSlugs } from '../apps/hub/src/data/dedicatedGuides.js';
import { routeDescription, routeTitle } from '../apps/hub/src/app/routeMetadata.js';
import { HUB_ROUTES, OG_IMAGE, notFoundHead, rewriteTargets, escapeAttr, escapeText, headFor, imageSize, prerender, prerenderRoutes, runPrerender, siteOrigin, tabPaths } from './prerender-meta.mjs';

const shell = await readFile(new URL('../index.html', import.meta.url), 'utf8');
const origin = siteOrigin(shell);
const meta = (html, key, value) => html.match(new RegExp(`<meta\\b[^>]*${key}="${value}"[^>]*content="([^"]*)"`))?.[1];
const unescape = (text) => text.replace(/&quot;/g, '"').replace(/&lt;/g, '<').replace(/&gt;/g, '>').replace(/&amp;/g, '&');

test('every hub page, every map and every static map tab gets its own share-preview head', () => {
  const routes = prerenderRoutes();
  for (const route of HUB_ROUTES) assert(routes.includes(route), `${route} is prerendered`);
  for (const slug of dedicatedGuideSlugs) {
    assert(routes.includes(`/maps/${slug}`), `/maps/${slug} is prerendered`);
    assert(routes.includes(`/maps/${slug}/step-details`), `/maps/${slug}/step-details is prerendered`);
  }
  assert(routes.includes('/maps/origins/speed-run/prep'), 'nested tabs keep their parent path');
  assert(!routes.some((route) => /[*:]/.test(route)), 'no catch-all or param routes');
  assert(!routes.includes('/maps/mob-of-the-dead/logs'), 'redirect routes are left to their destination');
  assert.equal(new Set(routes).size, routes.length, 'no route is written twice');
});

test('route parsing joins nested paths and skips redirects, params and catch-alls', () => {
  const source = `<Routes><Route element={<Layout />}>
    <Route index element={<Main />} />
    <Route path="speed-run" element={<Run />}>
      <Route path="prep" element={<Prep />} />
    </Route>
    <Route path="old" element={<Navigate to="../new" replace />} />
    <Route path="cogs/:id" element={<Cog />} />
    <Route path="*" element={<NotFound />} />
  </Route></Routes>`;
  assert.deepEqual(tabPaths(source), ['speed-run', 'speed-run/prep']);
});

test('a prerendered head matches what the app sets at runtime for that route', () => {
  for (const route of ['/maps/revelations/step-details', '/maps/origins', '/allmaps']) {
    const html = headFor(shell, route, { origin });
    assert.equal(unescape(html.match(/<title>([^<]*)<\/title>/)[1]), routeTitle(route));
    assert.equal(unescape(meta(html, 'name', 'description')), routeDescription(route));
    assert.equal(unescape(meta(html, 'property', 'og:title')), routeTitle(route));
    assert.equal(unescape(meta(html, 'property', 'og:description')), routeDescription(route));
    assert.equal(meta(html, 'property', 'og:url'), `${origin}${route}`);
    assert.match(html, new RegExp(`<link rel="canonical" href="${origin}${route}" />`));
    assert.equal((html.match(/<title>/g) ?? []).length, 1, 'one title');
    assert.equal((html.match(/property="og:title"/g) ?? []).length, 1, 'one og:title');
    assert.match(html, /<div id="root"><\/div>/, 'the app shell is untouched');
  }
  const maps = headFor(shell, '/maps', { origin });
  assert.equal(meta(maps, 'property', 'og:url'), `${origin}/allmaps`, '/maps shares the All Maps card');
  assert.doesNotMatch(maps, /Page not found/);
});

test('values are escaped, and a map image replaces the shared card only when given', () => {
  const html = headFor('<html><head><title>x</title><meta property="og:image" content="https://zh.test/og-image.png" /></head></html>', '/maps/origins', { image: '/og/origins.png' });
  assert.equal(meta(html, 'property', 'og:image'), 'https://zh.test/og/origins.png');
  assert.equal(meta(html, 'name', 'twitter:image'), 'https://zh.test/og/origins.png');
  const plain = headFor(shell, '/maps/origins', { origin });
  assert.equal(meta(plain, 'property', 'og:image'), `${origin}/og-image.png`);
  // Escaping, on synthetic text (no live title has an & or a quote today).
  assert.equal(escapeText('Fish & Chips <b>'), 'Fish &amp; Chips &lt;b&gt;');
  assert.equal(escapeAttr('Say "hi" & <go>'), 'Say &quot;hi&quot; &amp; &lt;go&gt;');
  for (const route of prerenderRoutes()) {
    const html = headFor(shell, route, { origin });
    assert.doesNotMatch(html.match(/<head>[\s\S]*<\/head>/)[0], /&(?!amp;|lt;|gt;|quot;|#)/, `${route}: no raw & in the head`);
  }
});

test('prerender writes <route>.html and <route>/index.html, sitemap.xml and robots.txt, and leaves the shell generic', async () => {
  const dist = await mkdtemp(path.join(tmpdir(), 'zh-prerender-'));
  try {
    await writeFile(path.join(dist, 'index.html'), shell);
    await mkdir(path.join(dist, 'og'), { recursive: true });
    await writeFile(path.join(dist, 'og', 'revelations.jpg'), '');
    const routes = await prerender(dist);
    assert.equal(await readFile(path.join(dist, 'index.html'), 'utf8'), shell, 'dist/index.html is unchanged');
    for (const route of routes) {
      const parts = route.split('/').filter(Boolean);
      const flat = await readFile(`${path.join(dist, ...parts)}.html`, 'utf8');
      assert.equal(await readFile(path.join(dist, ...parts, 'index.html'), 'utf8'), flat, `${route}: both spellings match`);
      assert.match(flat, /<script type="module"/, `${route} keeps the app scripts`);
    }
    const rev = await readFile(path.join(dist, 'maps', 'revelations', 'index.html'), 'utf8');
    assert.equal(meta(rev, 'property', 'og:image'), `${origin}/og/revelations.jpg`, 'a map with its own card uses it');
    assert.equal(meta(rev, 'name', 'twitter:image'), `${origin}/og/revelations.jpg`);
    assert.equal(meta(rev, 'property', 'og:image:type'), 'image/jpeg');
    assert.equal(unescape(meta(rev, 'property', 'og:image:alt')), routeTitle('/maps/revelations'), 'the card is described as that map');
    const revTab = await readFile(path.join(dist, 'maps', 'revelations', 'step-details', 'index.html'), 'utf8');
    assert.equal(meta(revTab, 'property', 'og:image'), `${origin}/og/revelations.jpg`, "a map's tabs share its card");
    const origins = await readFile(path.join(dist, 'maps', 'origins', 'index.html'), 'utf8');
    assert.equal(meta(origins, 'property', 'og:image'), `${origin}/og-image.png`, 'others keep the shared card');
    assert.equal(meta(origins, 'property', 'og:image:type'), 'image/png');
    assert.equal((origins.match(/og:image:type/g) ?? []).length, 1, 'one og:image:type');
    // Search engines: every canonical page once in sitemap.xml, each matching its page's canonical link; robots.txt points there.
    const sitemap = await readFile(path.join(dist, 'sitemap.xml'), 'utf8');
    const locs = [...sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)].map((match) => match[1]);
    assert.equal(new Set(locs).size, locs.length, 'no page is listed twice');
    assert.deepEqual(locs, ['/', ...routes.filter((route) => route !== '/maps')].map((route) => `${origin}${route}`), 'Home and every canonical page, no alias');
    for (const route of routes) {
      const page = await readFile(path.join(dist, ...route.split('/').filter(Boolean), 'index.html'), 'utf8');
      assert(locs.includes(page.match(/<link rel="canonical" href="([^"]+)"/)[1]), `${route}: its canonical URL is in the sitemap`);
    }
    assert.equal(await readFile(path.join(dist, 'robots.txt'), 'utf8'), `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`);
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test('a prerender failure fails CI; on Render it warns and every routed path still gets the plain SPA shell', async () => {
  const dist = await mkdtemp(path.join(tmpdir(), 'zh-prerender-fail-'));
  const quiet = () => { const lines = []; return { lines, log: { log: (m) => lines.push(['log', m]), warn: (m) => lines.push(['warn', m]), error: (m) => lines.push(['error', m]) } }; };
  const renderYaml = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
  const targets = rewriteTargets(renderYaml);
  try {
    await writeFile(path.join(dist, 'index.html'), shell);
    // A routes file that cannot be read makes the step fail before any per-route file is written.
    const broken = () => { throw new Error('routes file unreadable'); };
    const ci = quiet();
    assert.equal(await runPrerender(dist, { env: {}, log: ci.log, readSource: broken }), 1, 'CI / golive-check: exit 1');
    assert.match(ci.lines[0][1], /FAILED \(routes file unreadable\)/);
    assert.deepEqual(await readdir(dist), ['index.html'], 'CI writes nothing');
    const render = quiet();
    assert.equal(await runPrerender(dist, { env: { RENDER: 'true' }, log: render.log, readSource: broken, renderYaml }), 0, 'Render: exit 0');
    assert.match(render.lines[0][1], /WARNING on the Render build, serving the plain SPA index.html \(routes file unreadable\), \d+ routes get it/);
    // render.yaml rewrites each prerendered path to its .html file: on a failed prerender that file is the plain shell.
    assert(targets.length > 70, 'render.yaml lists the prerendered pages');
    for (const file of [...targets, '/404.html']) assert.equal(await readFile(path.join(dist, ...file.split('/').filter(Boolean)), 'utf8'), shell, `${file} is the plain shell`);
    assert.equal(await readFile(path.join(dist, 'index.html'), 'utf8'), shell, 'the shell is untouched');

    // A write that fails halfway removes what it already wrote; the plain shell then takes those paths.
    await rm(path.join(dist, 'allmaps.html'));
    await rm(path.join(dist, 'maps', 'origins.html'));
    await mkdir(path.join(dist, 'maps', 'origins.html'), { recursive: true }); // a directory where a file must go
    const halfway = quiet();
    assert.equal(await runPrerender(dist, { env: { RENDER: 'true' }, log: halfway.log, renderYaml }), 0);
    assert.match(halfway.lines[0][1], /plain shell copies failed too/, 'says so when even the fallback cannot write');
    assert.equal(await readFile(path.join(dist, 'allmaps.html'), 'utf8'), shell, 'no half-written per-route head is left');
    assert.equal(existsSync(path.join(dist, 'sitemap.xml')), false, 'no sitemap for pages that are not there');
  } finally {
    await rm(dist, { recursive: true, force: true });
  }
});

test('every dedicated map has a share card in public/og: 1200x630 JPEG, under 300 KB; the shared card too', async () => {
  const cards = [...dedicatedGuideSlugs.map((slug) => `public/og/${slug}.jpg`), 'public/og-image.png'];
  for (const card of cards) {
    const buffer = await readFile(new URL(`../${card}`, import.meta.url));
    assert(buffer.length <= OG_IMAGE.maxBytes, `${card} is ${Math.round(buffer.length / 1024)} KB (max ${OG_IMAGE.maxBytes / 1024})`);
    assert.deepEqual(imageSize(buffer), { width: OG_IMAGE.width, height: OG_IMAGE.height }, `${card} is ${OG_IMAGE.width}x${OG_IMAGE.height}`);
  }
});
