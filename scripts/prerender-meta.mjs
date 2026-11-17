/*
 * Per-route share previews for a single-page app.
 *
 * Link previews (Discord, iMessage, X, Facebook) never run JavaScript, so they only ever saw the one
 * index.html head. After `vite build`, this writes dist/<route>.html and dist/<route>/index.html for every static route: the
 * same shell (same scripts, same assets) with that route's title, description, og:/twitter: tags and
 * canonical URL. Text comes from apps/hub/src/app/routeMetadata.js, the same source the app's head sync
 * uses at runtime, so the prerendered head and the live head agree. dist/index.html stays the generic
 * shell for Home and client-routed paths; scripts/serve-dist.mjs (npm start) picks the right file per request.
 *
 * og:image: /og/<map>.jpg (1200x630, public/og/) on the map and every one of its tabs when that file exists
 * in dist, otherwise the shared /og-image.png.
 *
 * Usage: node scripts/prerender-meta.mjs [distDir]
 */
import { existsSync, readFileSync } from 'node:fs';
import { mkdir, readFile, rm, writeFile } from 'node:fs/promises';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { routeDescription, routeTitle } from '../apps/hub/src/app/routeMetadata.js';
import { dedicatedGuideSlugs } from '../apps/hub/src/data/dedicatedGuides.js';

const root = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

// Hub pages with a fixed path (apps/hub/src/app/AppRoutes.jsx). /maps redirects to /allmaps in the app,
// but a shared /maps link still deserves the All Maps card.
// Video guide pages and side Easter Egg pages are shared too (apps/hub/src/data/EasterEggGuides.js, sideEE): kept in step by
// scripts/prerender-share-routes.test.mjs. Shangri-La BO1 is the Coming Soon page; its share card is the same generic head.
export const SHARED_PAGES = [
  '/easter-eggs/ascension', '/easter-eggs/call-of-the-dead', '/easter-eggs/moon', '/easter-eggs/tranzit', '/easter-eggs/die-rise',
  '/easter-eggs/buried', '/easter-eggs/the-giant', '/easter-eggs/shangri-la-chronicles',
  '/side-easter-eggs/kino', '/side-easter-eggs/gk', '/side-easter-eggs/de', '/side-easter-eggs/soe', '/side-easter-eggs/origins-speedrun',
];
export const HUB_ROUTES = ['/allmaps', '/maps', '/easter-eggs', '/side-easter-eggs', '/achievements', '/search', '/coming-soon', ...SHARED_PAGES];

// Each dedicated map's routes file lists its tabs as <Route path="…">: keep the static ones.
const ROUTE_FILES = {
  origins: 'maps/origins/routes/OriginsRoutes.jsx',
  'mob-of-the-dead': 'maps/mob-of-the-dead/routes/MobRoutes.jsx',
  'shadows-of-evil': 'maps/shadows-of-evil/routes/ShadowsRoutes.jsx',
  'der-eisendrache': 'maps/der-eisendrache/routes/DerEisendracheRoutes.jsx',
  'zetsubou-no-shima': 'maps/zetsubou-no-shima/routes/ZetsubouRoutes.jsx',
  'gorod-krovi': 'maps/gorod-krovi/routes/GorodRoutes.jsx',
  revelations: 'maps/revelations/routes/RevelationsRoutes.jsx',
};

// Walks <Route> tags in order, joining nested paths (<Route path="speed-run"><Route path="prep" />…).
// Skips catch-alls, params, and redirects (element={<Navigate …>}: the destination has its own head).
export function tabPaths(source) {
  const paths = [];
  const stack = [];
  for (const [tag] of source.matchAll(/<\/Route>|<Route\b(?:[^>{]|\{(?:[^{}]|\{[^{}]*\})*\})*>/g)) {
    if (tag === '</Route>') { stack.pop(); continue; }
    const own = (tag.match(/\bpath="([^"]+)"/)?.[1] ?? '').replace(/^\/+|\/+$/g, '');
    const full = [...stack, own].filter(Boolean).join('/');
    if (!tag.endsWith('/>')) stack.push(own);
    if (own && !full.includes('*') && !full.includes(':') && !/<Navigate\b/.test(tag)) paths.push(full);
  }
  return [...new Set(paths)];
}

export function mapRoutes(readSource = (file) => readFileSync(path.join(root, file), 'utf8')) {
  return dedicatedGuideSlugs.flatMap((slug) => {
    const file = ROUTE_FILES[slug];
    if (!file) throw new Error(`prerender-meta: no routes file listed for /maps/${slug}`);
    return [`/maps/${slug}`, ...tabPaths(readSource(file)).map((tab) => `/maps/${slug}/${tab}`)];
  });
}

export const prerenderRoutes = (readSource) => [...HUB_ROUTES, ...mapRoutes(readSource)];

export const escapeAttr = (value) => String(value).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;').replace(/>/g, '&gt;');
export const escapeText = (value) => String(value).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

// Sets <tag attrName="attrValue" … field="value">, replacing the existing tag or adding it before </head>.
function setTag(html, tag, [attrName, attrValue], field, value) {
  const escapedKey = attrValue.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const pattern = new RegExp(`<${tag}\\b[^>]*\\b${attrName}="${escapedKey}"[^>]*>`, 'i');
  const element = `<${tag} ${attrName}="${attrValue}" ${field}="${escapeAttr(value)}" />`;
  if (pattern.test(html)) return html.replace(pattern, element);
  return html.replace(/<\/head>/i, `  ${element}\n  </head>`);
}

// The site's public origin, read from the shell's absolute og:image URL (one source of truth).
export function siteOrigin(html) {
  const match = html.match(/<meta\b[^>]*property="og:image"[^>]*content="(https?:\/\/[^/"]+)/i);
  if (!match) throw new Error('prerender-meta: index.html needs an absolute og:image URL to know the site origin');
  return match[1];
}

const mapSlug = (route) => route.match(/^\/maps\/([^/]+)/)?.[1];

// Width and height of a JPEG or PNG, read from its header (no image library needed).
export function imageSize(buffer) {
  if (buffer.length > 24 && buffer.readUInt32BE(0) === 0x89504e47) return { width: buffer.readUInt32BE(16), height: buffer.readUInt32BE(20) };
  if (buffer[0] === 0xff && buffer[1] === 0xd8) {
    for (let at = 2; at + 9 < buffer.length;) {
      if (buffer[at] !== 0xff) { at += 1; continue; }
      const marker = buffer[at + 1];
      // SOF0-SOF15 (not DHT C4, JPG C8, DAC CC) carry the frame size.
      if (marker >= 0xc0 && marker <= 0xcf && ![0xc4, 0xc8, 0xcc].includes(marker)) {
        return { height: buffer.readUInt16BE(at + 5), width: buffer.readUInt16BE(at + 7) };
      }
      at += 2 + buffer.readUInt16BE(at + 2);
    }
  }
  return null;
}

// Share cards: what the networks render well (1200x630) and small enough to fetch fast.
export const OG_IMAGE = { width: 1200, height: 630, maxBytes: 300 * 1024 };

// Paths the app redirects: their card (and canonical URL) is the destination's.
export const ALIASES = { '/maps': '/allmaps' };

export function headFor(html, route, { origin = siteOrigin(html), image } = {}) {
  const page = ALIASES[route] ?? route;
  const title = routeTitle(page);
  const description = routeDescription(page);
  const url = `${origin}${page}`;
  let out = html.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>`);
  out = setTag(out, 'meta', ['name', 'description'], 'content', description);
  out = setTag(out, 'meta', ['property', 'og:title'], 'content', title);
  out = setTag(out, 'meta', ['property', 'og:description'], 'content', description);
  out = setTag(out, 'meta', ['property', 'og:url'], 'content', url);
  out = setTag(out, 'link', ['rel', 'canonical'], 'href', url);
  // The card's type, from whichever image the head ends up with (a map's .jpg, or the shared .png).
  const finalImage = image ?? out.match(/property="og:image" content="([^"]+)"/)?.[1] ?? '';
  const type = /\.jpe?g$/i.test(finalImage) ? 'image/jpeg' : /\.png$/i.test(finalImage) ? 'image/png' : '';
  if (type) out = setTag(out, 'meta', ['property', 'og:image:type'], 'content', type);
  if (image) {
    out = setTag(out, 'meta', ['property', 'og:image'], 'content', `${origin}${image}`);
    out = setTag(out, 'meta', ['name', 'twitter:image'], 'content', `${origin}${image}`);
    const slug = mapSlug(route);
    if (slug) out = setTag(out, 'meta', ['property', 'og:image:alt'], 'content', routeTitle(`/maps/${slug}`));
  }
  return out;
}

export const sitemapFor = (origin, routes) => `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
${routes.map((route) => `  <url><loc>${escapeText(`${origin}${route}`)}</loc></url>`).join('\n')}
</urlset>
`;

export const robotsFor = (origin) => `User-agent: *
Allow: /

Sitemap: ${origin}/sitemap.xml
`;

// Builds every head first, then writes: a bad route fails before any file exists. If a write still fails,
// the files already written are removed, so the host serves the plain SPA index.html for every path.
export async function prerender(distDir = path.join(root, 'dist'), readSource) {
  const shell = await readFile(path.join(distDir, 'index.html'), 'utf8');
  const origin = siteOrigin(shell);
  const routes = prerenderRoutes(readSource);
  const pages = routes.map((route) => {
    const slug = mapSlug(route);
    const own = slug && `/og/${slug}.jpg`;
    const image = own && existsSync(path.join(distDir, own)) ? own : undefined;
    const parts = route.split('/').filter(Boolean);
    // Both spellings a static host may look up for /a/b: a/b.html (no trailing slash) and a/b/index.html.
    return { html: headFor(shell, route, { origin, image }), targets: [`${path.join(distDir, ...parts)}.html`, path.join(distDir, ...parts, 'index.html')] };
  });
  // Search engines get Home (the shell itself) and the canonical pages only (an alias's canonical URL is its destination's).
  const canonical = ['/', ...routes.filter((route) => !ALIASES[route])];
  pages.push({ html: sitemapFor(origin, canonical), targets: [path.join(distDir, 'sitemap.xml')] });
  pages.push({ html: robotsFor(origin), targets: [path.join(distDir, 'robots.txt')] });
  pages.push({ html: notFoundHead(shell), targets: [path.join(distDir, '404.html')] });
  const written = [];
  try {
    for (const { html, targets } of pages) {
      for (const target of targets) {
        await mkdir(path.dirname(target), { recursive: true });
        await writeFile(target, html);
        written.push(target);
      }
    }
  } catch (error) {
    await Promise.all(written.map((file) => rm(file, { force: true })));
    throw error;
  }
  return routes;
}

// dist/404.html: what the server sends, with a 404 status, for a path that is no page (scripts/serve-dist.mjs). The same
// app shell, so the app still boots and shows its "Page not found" page, but titled so and kept out of search.
export function notFoundHead(shell) {
  const title = 'Page not found | Zombies Hub 2.0';
  let out = shell.replace(/<title>[\s\S]*?<\/title>/i, `<title>${escapeText(title)}</title>\n    <meta name="robots" content="noindex" />`);
  out = setTag(out, 'meta', ['property', 'og:title'], 'content', title);
  return out.replace(/\s*<link rel="canonical"[^>]*>/i, '').replace(/\s*<meta property="og:url"[^>]*>/i, '');
}

// The CLI step. A failure fails CI and golive-check (exit 1). On Render's production build (RENDER is set)
// it warns and continues: the deploy ships the plain SPA shell, and the server (scripts/serve-dist.mjs) serves it
// for every page, exactly as before this step existed.
export async function runPrerender(distDir, { env = process.env, log = console, readSource } = {}) {
  try {
    const routes = await prerender(distDir, readSource);
    log.log(`prerender-meta: wrote share-preview heads for ${routes.length} routes, sitemap.xml, robots.txt and 404.html`);
    return 0;
  } catch (error) {
    if (env.RENDER) {
      log.warn(`prerender-meta: WARNING on the Render build, serving the plain SPA index.html (${error.message})`);
      return 0;
    }
    log.error(`prerender-meta: FAILED (${error.message})`);
    return 1;
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  process.exitCode = await runPrerender(path.resolve(process.argv[2] || path.join(root, 'dist')));
}
