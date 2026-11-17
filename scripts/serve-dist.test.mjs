import assert from 'node:assert/strict';
import { mkdtemp, mkdir, rm, writeFile } from 'node:fs/promises';
import { tmpdir } from 'node:os';
import path from 'node:path';
import test from 'node:test';
import { gunzipSync } from 'node:zlib';
import { cacheControl, distServer, resolvePath } from './serve-dist.mjs';

const files = new Set(['/index.html', '/404.html', '/allmaps.html', '/maps/origins.html', '/maps/origins/ice-staff.html', '/sitemap.xml', '/assets/index-Ab12.js']);
const isFile = (file) => files.has(file);

test('each kind of path gets the right file and status', () => {
  const at = (pathname) => resolvePath(pathname, isFile);
  assert.deepEqual(at('/'), { status: 200, file: '/index.html' });
  for (const [pathname, file] of [['/maps/origins/ice-staff', '/maps/origins/ice-staff.html'], ['/maps/origins/ice-staff/', '/maps/origins/ice-staff.html'], ['/allmaps', '/allmaps.html'], ['/maps/origins', '/maps/origins.html']]) {
    assert.deepEqual(at(pathname), { status: 200, file }, `${pathname}: its own page`);
  }
  assert.deepEqual(at('/sitemap.xml'), { status: 200, file: '/sitemap.xml' });
  assert.deepEqual(at('/assets/index-Ab12.js'), { status: 200, file: '/assets/index-Ab12.js' });
  for (const pathname of ['/maps/origins/no-such-tab', '/maps/kino-der-toten', '/easter-eggs/zz', '/info/nacht', '/side-easter-eggs/zz']) {
    assert.deepEqual(at(pathname), { status: 200, file: '/index.html' }, `${pathname}: client route, the app decides`);
  }
  for (const pathname of ['/no-such-page', '/wp-login.php', '/assets/gone.js', '/allmaps/extra', '/infox']) {
    assert.deepEqual(at(pathname), { status: 404, file: '/404.html' }, `${pathname}: real 404`);
  }
  // A failed prerender (no pages, no 404.html): every path gets the shell, as before.
  assert.deepEqual(resolvePath('/allmaps', (file) => file === '/index.html'), { status: 200, file: '/index.html' });
  assert.deepEqual(resolvePath('/no-such-page', (file) => file === '/index.html'), { status: 200, file: '/index.html' });
});

test('cache headers: hashed assets for a year, pages revalidated', () => {
  assert.equal(cacheControl('/assets/index-Ab12.js', '/assets/index-Ab12.js'), 'public, max-age=31536000, immutable');
  assert.equal(cacheControl('/maps/origins', '/maps/origins.html'), 'no-cache');
  assert.equal(cacheControl('/build-info.json', '/build-info.json'), 'no-cache');
  assert.equal(cacheControl('/sw.js', '/sw.js'), 'no-cache');
  assert.equal(cacheControl('/og/origins.jpg', '/og/origins.jpg'), 'public, max-age=3600');
});

test('the server: statuses, redirects, compression, ETag 304s, byte ranges, no escaping dist', async () => {
  const dist = await mkdtemp(path.join(tmpdir(), 'zh-serve-'));
  const server = distServer(dist);
  try {
    const page = `<!doctype html><title>Ice Staff</title>${'x'.repeat(4000)}`;
    await mkdir(path.join(dist, 'maps', 'origins'), { recursive: true });
    await mkdir(path.join(dist, 'assets'));
    await writeFile(path.join(dist, 'index.html'), '<!doctype html><div id="root"></div>');
    await writeFile(path.join(dist, '404.html'), '<!doctype html><title>Page not found</title>');
    await writeFile(path.join(dist, 'maps', 'origins', 'ice-staff.html'), page);
    await writeFile(path.join(dist, 'assets', 'clip.mp3'), Buffer.from([0, 1, 2, 3, 4, 5, 6, 7, 8, 9]));
    await new Promise((done) => server.listen(0, '127.0.0.1', done));
    const base = `http://127.0.0.1:${server.address().port}`;
    const get = (pathname, headers = {}) => fetch(`${base}${pathname}`, { headers, redirect: 'manual' });

    const ice = await get('/maps/origins/ice-staff', { 'Accept-Encoding': 'identity' });
    assert.equal(ice.status, 200);
    assert.equal(await ice.text(), page);
    assert.equal(ice.headers.get('cache-control'), 'no-cache');
    const etag = ice.headers.get('etag');
    assert.match(etag, /^"[0-9a-f]{40}"$/);
    assert.equal((await get('/maps/origins/ice-staff', { 'If-None-Match': etag })).status, 304, 'unchanged page: 304');

    // Raw response bytes (fetch would decode them): gzip when asked for, and smaller.
    const raw = await new Promise((done) => import('node:http').then(({ get: httpGet }) => httpGet(`${base}/maps/origins/ice-staff`, { headers: { 'Accept-Encoding': 'gzip' } }, (res) => {
      const chunks = []; res.on('data', (c) => chunks.push(c)); res.on('end', () => done({ encoding: res.headers['content-encoding'], body: Buffer.concat(chunks) }));
    })));
    assert.equal(raw.encoding, 'gzip');
    assert(raw.body.length < page.length / 4, 'compressed');
    assert.equal(gunzipSync(raw.body).toString(), page);

    const missing = await get('/no-such-page');
    assert.equal(missing.status, 404);
    assert.match(await missing.text(), /Page not found/);
    const redirect = await get('/maps/origins/ice-staff.html?x=1');
    assert.equal(redirect.status, 301);
    assert.equal(redirect.headers.get('location'), '/maps/origins/ice-staff?x=1');

    const part = await get('/assets/clip.mp3', { Range: 'bytes=2-5' });
    assert.equal(part.status, 206);
    assert.equal(part.headers.get('content-range'), 'bytes 2-5/10');
    assert.deepEqual([...new Uint8Array(await part.arrayBuffer())], [2, 3, 4, 5]);
    assert.equal(part.headers.get('cache-control'), 'public, max-age=31536000, immutable');

    assert.equal((await get('/..%2F..%2Fpackage.json')).status, 404, 'no path outside dist');
    assert.equal((await fetch(`${base}/`, { method: 'POST' })).status, 405);
  } finally {
    server.close();
    await rm(dist, { recursive: true, force: true });
  }
});
