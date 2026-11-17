/*
 * npm start: serve dist/ the way production does. Render's static site applies render.yaml's routes: an exact
 * file first, then the first matching rewrite, else 404 with dist/404.html (scripts/render-routes.mjs). This is
 * that logic on node:http (no dependency), for checking the built site locally before a deploy.
 *
 *   node scripts/serve-dist.mjs [distDir]        PORT (default 3000), HOST (default 127.0.0.1)
 */
import { createServer } from 'node:http';
import { existsSync, readFileSync, statSync } from 'node:fs';
import { readFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { RENDER_YAML, parseRoutes, resolveRequest } from './render-routes.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const TYPES = {
  '.html': 'text/html; charset=utf-8', '.js': 'text/javascript; charset=utf-8', '.css': 'text/css; charset=utf-8',
  '.json': 'application/json', '.xml': 'application/xml', '.txt': 'text/plain; charset=utf-8', '.svg': 'image/svg+xml',
  '.png': 'image/png', '.jpg': 'image/jpeg', '.jpeg': 'image/jpeg', '.webp': 'image/webp', '.gif': 'image/gif',
  '.ico': 'image/x-icon', '.woff': 'font/woff', '.woff2': 'font/woff2', '.mp3': 'audio/mpeg', '.mp4': 'video/mp4', '.webmanifest': 'application/manifest+json',
};

export function distServer(distDir, rules = parseRoutes(readFileSync(RENDER_YAML, 'utf8'))) {
  const fileFor = (pathname) => path.join(distDir, ...pathname.split('/').filter(Boolean));
  const isFile = (pathname) => { const file = fileFor(pathname); return file.startsWith(distDir) && existsSync(file) && statSync(file).isFile(); };
  return createServer(async (request, response) => {
    let pathname;
    try { pathname = decodeURIComponent(new URL(request.url, 'http://local').pathname); } catch { pathname = '/'; }
    // Like Render: a direct request for x.html is redirected to its clean URL.
    if (/\.html$/.test(pathname)) {
      response.writeHead(301, { Location: pathname.replace(/(\/index)?\.html$/, '') || '/' });
      return response.end();
    }
    const { status, file } = resolveRequest(rules, pathname, isFile);
    try {
      const body = await readFile(fileFor(file));
      const headers = { 'Content-Type': TYPES[path.extname(file)] ?? 'application/octet-stream', 'X-Content-Type-Options': 'nosniff', 'Accept-Ranges': 'bytes' };
      // Byte ranges, as the host serves them: audio and video ask for ranges and wait on a plain 200.
      const range = status === 200 && request.headers.range?.match(/^bytes=(\d*)-(\d*)$/);
      if (range && (range[1] || range[2])) {
        const start = range[1] ? Number(range[1]) : Math.max(0, body.length - Number(range[2]));
        const end = range[1] && range[2] ? Math.min(Number(range[2]), body.length - 1) : body.length - 1;
        if (start >= body.length || start > end) {
          response.writeHead(416, { 'Content-Range': `bytes */${body.length}` });
          return response.end();
        }
        response.writeHead(206, { ...headers, 'Content-Range': `bytes ${start}-${end}/${body.length}`, 'Content-Length': end - start + 1 });
        return response.end(request.method === 'HEAD' ? undefined : body.subarray(start, end + 1));
      }
      response.writeHead(status, { ...headers, 'Content-Length': body.length });
      response.end(request.method === 'HEAD' ? undefined : body);
    } catch {
      response.writeHead(status === 200 ? 500 : 404, { 'Content-Type': 'text/plain; charset=utf-8' });
      response.end(`${file} is missing from ${path.relative(root, distDir) || distDir}`);
    }
  });
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const distDir = path.resolve(process.argv[2] || path.join(root, 'dist'));
  const port = Number(process.env.PORT) || 3000;
  const host = process.env.HOST || '127.0.0.1';
  distServer(distDir).listen(port, host, () => console.log(`Serving ${path.relative(root, distDir) || distDir} like production at http://${host}:${port}`));
}
