/*
 * npm start (production, Render web service): serve dist/ so that every page reaches visitors and crawlers with its
 * own head, and wrong addresses are real 404s. Plain node:http, no dependency.
 *
 * Which file a request gets, decided from what is in dist (so it can never drift from the build):
 *   1. an exact file (/assets/…, /sitemap.xml, /og/origins.jpg)
 *   2. a prerendered page: /maps/origins/ice-staff or …/ice-staff/ → dist/maps/origins/ice-staff.html (its own
 *      title, description and share card, scripts/prerender-meta.mjs); / → dist/index.html
 *   3. a client-routed path with no page of its own (/maps/…, /easter-eggs/…, /info/…, /side-easter-eggs/…) → the
 *      app shell, 200; the app shows its own 404 page for unknown ones
 *   4. anything else → 404 with dist/404.html (the app shell titled Page not found, noindex)
 * A request for x.html is redirected to its clean URL. A failed prerender ships only the shell and no 404.html:
 * then the shell answers every path with 200, as before per-route pages existed.
 *
 * Like `serve` before it: gzip (and br) for text, a content ETag with 304s, byte ranges for audio and video. Plus
 * cache headers: hashed /assets/* immutable for a year, pages and build-info.json revalidated on every load.
 *
 *   node scripts/serve-dist.mjs [distDir]     PORT (Render sets it; default 3000), HOST (default 0.0.0.0)
 */
import { createServer } from 'node:http';
import { createHash } from 'node:crypto';
import { existsSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { brotliCompressSync, constants, gzipSync } from 'node:zlib';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Client routes with params or nested apps (apps/hub/src/app/AppRoutes.jsx).
export const SPA_PREFIXES = ['/maps/', '/easter-eggs/', '/info/', '/side-easter-eggs/'];

const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.mjs': 'text/javascript; charset=utf-8',
  '.css': 'text/css; charset=utf-8', '.json': 'application/json; charset=utf-8', '.xml': 'application/xml; charset=utf-8',
  '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml', '.webmanifest': 'application/manifest+json',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.avif': 'image/avif', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.ttf': 'font/ttf', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webm': 'video/webm',
};
const COMPRESSIBLE = /^(text\/|application\/(json|xml|manifest\+json)|image\/svg\+xml)/;

export function cacheControl(urlPath, file) {
  if (urlPath.startsWith('/assets/')) return 'public, max-age=31536000, immutable'; // content-hashed names
  if (file.endsWith('.html') || ['/build-info.json', '/sw.js'].includes(urlPath)) return 'no-cache';
  return 'public, max-age=3600';
}

// Which file answers a path, and with what status (see the list at the top).
export function resolvePath(pathname, isFile) {
  if (pathname === '/' || pathname === '') return { status: 200, file: '/index.html' };
  if (isFile(pathname)) return { status: 200, file: pathname };
  const page = pathname.replace(/\/+$/, '');
  if (page && isFile(`${page}.html`)) return { status: 200, file: `${page}.html` };
  if (SPA_PREFIXES.some((prefix) => `${page}/`.startsWith(prefix))) return { status: 200, file: '/index.html' };
  // No 404.html means the prerender step did not run (it writes the pages and 404.html together): serve the shell
  // for every path, as before, rather than 404 real pages.
  return isFile('/404.html') ? { status: 404, file: '/404.html' } : { status: 200, file: '/index.html' };
}

export function distServer(distDir) {
  const fileFor = (urlPath) => path.join(distDir, ...urlPath.split('/').filter(Boolean));
  const isFile = (urlPath) => {
    const file = fileFor(urlPath);
    if (file !== distDir && !file.startsWith(distDir + path.sep)) return false; // no climbing out of dist
    try { return statSync(file).isFile(); } catch { return false; }
  };
  const cache = new Map(); // file → { body, etag, gzip?, br? } (dist does not change while the server runs)
  const load = async (file) => {
    if (!cache.has(file)) {
      const body = await readFile(fileFor(file));
      cache.set(file, { body, etag: `"${createHash('sha1').update(body).digest('hex')}"` });
    }
    return cache.get(file);
  };

  return createServer(async (request, response) => {
    if (!['GET', 'HEAD'].includes(request.method)) {
      response.writeHead(405, { Allow: 'GET, HEAD' });
      return response.end();
    }
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname); } catch { pathname = '/'; }
    if (/\.html$/.test(pathname)) {
      const query = new URL(request.url, 'http://local').search;
      response.writeHead(301, { Location: `${pathname.replace(/(\/index)?\.html$/, '') || '/'}${query}` });
      return response.end();
    }

    const { status, file } = resolvePath(pathname, isFile);
    let entry;
    try { entry = await load(file); } catch {
      response.writeHead(500, { 'Content-Type': 'text/plain; charset=utf-8' });
      return response.end(`${file} is missing from dist`);
    }
    const type = TYPES[path.extname(file)] ?? 'application/octet-stream';
    const headers = {
      'Content-Type': type, 'Cache-Control': cacheControl(pathname, file), ETag: entry.etag, 'Accept-Ranges': 'bytes',
      'X-Content-Type-Options': 'nosniff', 'Referrer-Policy': 'strict-origin-when-cross-origin', Vary: 'Accept-Encoding',
    };
    if (status === 200 && request.headers['if-none-match'] === entry.etag) {
      response.writeHead(304, headers);
      return response.end();
    }

    // Byte ranges: audio and video ask for them and stall on a plain 200.
    const range = status === 200 && request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
    if (range && (range[1] || range[2])) {
      const size = entry.body.length;
      const start = range[1] ? Number(range[1]) : Math.max(0, size - Number(range[2]));
      const end = range[1] && range[2] ? Math.min(Number(range[2]), size - 1) : size - 1;
      if (start >= size || start > end) {
        response.writeHead(416, { 'Content-Range': `bytes */${size}` });
        return response.end();
      }
      response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${size}`, 'Content-Length': end - start + 1 });
      return response.end(request.method === 'HEAD' ? undefined : entry.body.subarray(start, end + 1));
    }

    let body = entry.body;
    const accepts = String(request.headers['accept-encoding'] ?? '');
    if (COMPRESSIBLE.test(type) && body.length > 1024) {
      const encoding = /\bbr\b/.test(accepts) ? 'br' : /\bgzip\b/.test(accepts) ? 'gzip' : null;
      if (encoding) {
        entry[encoding] ??= encoding === 'br'
          ? brotliCompressSync(body, { params: { [constants.BROTLI_PARAM_QUALITY]: 5, [constants.BROTLI_PARAM_SIZE_HINT]: body.length } })
          : gzipSync(body, { level: 6 });
        body = entry[encoding];
        headers['Content-Encoding'] = encoding;
      }
    }
    response.writeHead(status, { ...headers, 'Content-Length': body.length });
    response.end(request.method === 'HEAD' ? undefined : body);
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const distDir = path.resolve(process.argv[2] || path.join(root, 'dist'));
  if (!existsSync(path.join(distDir, 'index.html'))) {
    console.error(`serve-dist: ${distDir} has no index.html (run npm run build first)`);
    process.exit(1);
  }
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '0.0.0.0';
  distServer(distDir).listen(port, host, () => console.log(`serve-dist: ${path.relative(root, distDir) || distDir} on http://${host}:${port}`));
}
