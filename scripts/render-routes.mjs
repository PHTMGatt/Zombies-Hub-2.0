/*
 * The production routing rules (render.yaml `routes:`), generated from the prerendered route list.
 *
 * Render's static site serves a file whose path matches the request exactly (/sitemap.xml, /assets/…), and only
 * then applies the rules, first match wins. A rewrite's destination is served as is (no clean-URL redirect), but
 * a request for /x.html is 301'd to /x, so every prerendered page needs its own rule:
 *   1. /maps/origins/ice-staff (and the trailing-slash form) → /maps/origins/ice-staff.html: its own share head.
 *   2. Client-routed paths with no prerendered file (guide params, map sub-routes) → /index.html, as before.
 *   3. Anything else matches no rule: Render answers 404 with dist/404.html (the app shell, noindex, which
 *      still shows the app's "Page not found" page).
 * Before this, one `/* → /index.html` rule answered every path with the generic head and a 200.
 *
 *   node scripts/render-routes.mjs --write   rewrite the routes: block in render.yaml
 *   node scripts/render-routes.mjs --check   exit 1 if render.yaml is out of date (unit tests do this too)
 */
import { readFileSync, writeFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { prerenderRoutes } from './prerender-meta.mjs';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
export const RENDER_YAML = path.join(root, 'render.yaml');

// Client routes with params or nested apps (apps/hub/src/app/AppRoutes.jsx): easter-eggs/:slug, info/:slug,
// side-easter-eggs/:mapKey, maps/:slug and maps/<map>/*. Unknown paths under them get the app's own 404 page.
export const SPA_PREFIXES = ['/easter-eggs/', '/info/', '/side-easter-eggs/', '/maps/'];

export function renderRoutes(readSource) {
  const rules = [];
  for (const route of prerenderRoutes(readSource)) {
    for (const source of [route, `${route}/`]) rules.push({ type: 'rewrite', source, destination: `${route}.html` });
  }
  for (const prefix of SPA_PREFIXES) rules.push({ type: 'rewrite', source: `${prefix}*`, destination: '/index.html' });
  return rules;
}

export const routesBlock = (rules) => `    routes:\n${rules.map((rule) => `      - type: ${rule.type}\n        source: ${rule.source}\n        destination: ${rule.destination}\n`).join('')}`;

const BLOCK = /^ {4}routes:\n(?: {6}- type: .+\n {8}source: .+\n {8}destination: .+\n)*/m;

const lf = (text) => text.replace(/\r\n/g, '\n'); // the checkout may use CRLF (git autocrlf)

export function parseRoutes(yaml) {
  const block = lf(yaml).match(BLOCK)?.[0];
  if (!block) throw new Error('render.yaml has no routes: block');
  return [...block.matchAll(/- type: (\S+)\n {8}source: (\S+)\n {8}destination: (\S+)/g)].map(([, type, source, destination]) => ({ type, source, destination }));
}

export function withRoutes(yaml, rules) {
  const next = lf(yaml).replace(BLOCK, routesBlock(rules));
  return yaml.includes('\r\n') ? next.replace(/\n/g, '\r\n') : next;
}

// Render's order: an exact file, else the first matching rule (`*` matches the rest of the path), else 404.html.
export function resolveRequest(rules, pathname, isFile) {
  if (pathname !== '/' && isFile(pathname)) return { status: 200, file: pathname };
  if (pathname === '/') return { status: 200, file: '/index.html' };
  for (const rule of rules) {
    const matches = rule.source.endsWith('*') ? pathname.startsWith(rule.source.slice(0, -1)) : pathname === rule.source;
    if (matches && rule.type === 'rewrite') return { status: 200, file: rule.destination };
  }
  return { status: 404, file: '/404.html' };
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const yaml = readFileSync(RENDER_YAML, 'utf8');
  const next = withRoutes(yaml, renderRoutes());
  if (process.argv.includes('--write')) {
    writeFileSync(RENDER_YAML, next);
    console.log(`render.yaml: ${renderRoutes().length} routes`);
  } else if (next !== yaml) {
    console.error('render.yaml routes are out of date: run node scripts/render-routes.mjs --write');
    process.exitCode = 1;
  } else console.log('render.yaml routes are up to date');
}
