/*
 * Zombies Hub offline support: a guide opened once still reads on a bad connection mid-game.
 *
 * - Page loads (navigations): network first. If the network fails or takes longer than NAVIGATION_TIMEOUT_MS,
 *   the last app shell (index.html) from the cache is used, so the app still starts.
 * - /assets/* (Vite output, content-hashed, never changes under one name): cache first, saved as they are
 *   fetched, so every page, script and picture already viewed works offline. Trimmed to MAX_ASSETS entries.
 * - Everything else (build-info.json, other sites such as YouTube) is left to the network.
 *
 * Bump VERSION to drop every cache on the next visit. To retire the worker, replace this file with one that
 * calls self.registration.unregister().
 */
const VERSION = 'v1';
const SHELL_CACHE = `zh-shell-${VERSION}`;
const ASSET_CACHE = `zh-assets-${VERSION}`;
const SHELL_URL = '/index.html';
const NAVIGATION_TIMEOUT_MS = 4000;
const MAX_ASSETS = 400;

self.addEventListener('install', (event) => {
  event.waitUntil(caches.open(SHELL_CACHE).then((cache) => cache.add(new Request(SHELL_URL, { cache: 'reload' }))));
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keep = new Set([SHELL_CACHE, ASSET_CACHE]);
    await Promise.all((await caches.keys()).filter((key) => key.startsWith('zh-') && !keep.has(key)).map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

const withTimeout = (promise, ms) => new Promise((resolve, reject) => {
  const timer = setTimeout(() => reject(new Error('timeout')), ms);
  promise.then((value) => { clearTimeout(timer); resolve(value); }, (error) => { clearTimeout(timer); reject(error); });
});

async function trimAssets(cache) {
  const keys = await cache.keys();
  await Promise.all(keys.slice(0, Math.max(0, keys.length - MAX_ASSETS)).map((key) => cache.delete(key)));
}

async function navigation(request) {
  const cache = await caches.open(SHELL_CACHE);
  const network = fetch(request);
  try {
    const response = await withTimeout(network, NAVIGATION_TIMEOUT_MS);
    // Every route is the same SPA shell: keep the newest copy for offline starts.
    if (response.ok) cache.put(SHELL_URL, response.clone());
    return response;
  } catch {
    const cached = await cache.match(SHELL_URL);
    if (cached) {
      // Still refresh the shell in the background if the slow network answers after all.
      network.then((response) => response.ok && cache.put(SHELL_URL, response.clone())).catch(() => {});
      return cached;
    }
    return network;
  }
}

async function asset(request) {
  const cache = await caches.open(ASSET_CACHE);
  const cached = await cache.match(request);
  if (cached) return cached;
  const response = await fetch(request);
  if (response.ok && response.type === 'basic') {
    await cache.put(request, response.clone());
    trimAssets(cache).catch(() => {});
  }
  return response;
}

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;
  const url = new URL(request.url);
  if (url.origin !== self.location.origin) return;
  if (request.mode === 'navigate') {
    event.respondWith(navigation(request));
  } else if (url.pathname.startsWith('/assets/')) {
    event.respondWith(asset(request));
  }
});
