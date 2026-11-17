import assert from 'node:assert/strict';
import { readFile } from 'node:fs/promises';
import test from 'node:test';
import { notFoundHead, prerenderRoutes } from './prerender-meta.mjs';
import { SPA_PREFIXES, parseRoutes, renderRoutes, resolveRequest, withRoutes } from './render-routes.mjs';

const yaml = await readFile(new URL('../render.yaml', import.meta.url), 'utf8');
const rules = parseRoutes(yaml);

test('render.yaml routes match the prerendered pages (run node scripts/render-routes.mjs --write after adding a page)', () => {
  assert.deepEqual(rules, renderRoutes());
  assert.equal(withRoutes(yaml, renderRoutes()), yaml, 'regenerating changes nothing');
  assert(!rules.some((rule) => rule.source === '/*'), 'no catch-all: unknown paths get a real 404');
});

test('each path type reaches the right file, as Render resolves it', () => {
  const files = new Set(['/sitemap.xml', '/robots.txt', '/og/origins.jpg', '/assets/index-abc.js']);
  const at = (pathname) => resolveRequest(rules, pathname, (file) => files.has(file));
  // Every prerendered page, with or without a trailing slash, gets its own head.
  for (const route of prerenderRoutes()) {
    assert.deepEqual(at(route), { status: 200, file: `${route}.html` }, route);
    assert.deepEqual(at(`${route}/`), { status: 200, file: `${route}.html` }, `${route}/`);
  }
  assert.deepEqual(at('/'), { status: 200, file: '/index.html' });
  for (const file of files) assert.deepEqual(at(file), { status: 200, file }, `${file} is served as a file`);
  // Client routes with no prerendered file still load the app (its own 404 page for unknown ones).
  for (const pathname of ['/easter-eggs/not-a-map', '/info/nacht-der-untoten', '/side-easter-eggs/zz', '/maps/kino-der-toten', '/maps/origins/no-such-tab', '/maps/der-eisendrache/bows/fire/x']) {
    assert.deepEqual(at(pathname), { status: 200, file: '/index.html' }, pathname);
  }
  // Anything else is a real 404 (with the app shell as 404.html).
  for (const pathname of ['/no-such-page', '/wp-admin', '/allmaps/extra', '/index']) assert.deepEqual(at(pathname), { status: 404, file: '/404.html' }, pathname);
  assert.deepEqual(SPA_PREFIXES.map((prefix) => at(prefix.slice(0, -1)).status), [200, 404, 200, 200], '/info alone is not a page; the others are');
});

test('404.html is the app shell, titled Page not found and kept out of search', async () => {
  const shell = await readFile(new URL('../index.html', import.meta.url), 'utf8');
  const html = notFoundHead(shell);
  assert.match(html, /<title>Page not found \| Zombies Hub 2.0<\/title>/);
  assert.equal((html.match(/name="robots" content="noindex"/g) ?? []).length, 1, 'one noindex');
  assert.doesNotMatch(html, /rel="canonical"|property="og:url"/, 'no canonical URL for a page that does not exist');
  assert.match(html, /<div id="root"><\/div>/, 'the app still boots and shows its Page not found page');
  assert.equal(html.match(/<script[^>]*src="[^"]+"/g)?.join(), shell.match(/<script[^>]*src="[^"]+"/g)?.join(), 'same scripts');
});
