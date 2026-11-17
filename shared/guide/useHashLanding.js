import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

// A mistyped or truncated link (#100%) must never take the guide down.
const fragmentId = (hash) => {
  try {
    return decodeURIComponent(hash.slice(1));
  } catch {
    return '';
  }
};

// Bottom edge of whatever is pinned over the page: the hub bar, a pinned map header, or any element a
// map marks with data-pinned (e.g. a map nav row that stays under the hub bar).
const pinnedBottom = () => Math.max(0, ...[...document.querySelectorAll('.hub-header, .map-module header, .map-module [data-pinned]')]
  .filter((element) => ['fixed', 'sticky'].includes(getComputedStyle(element).position))
  .map((element) => element.getBoundingClientRect().bottom));

// Lands on #id: waits (up to 8s) for a lazily rendered target, jumps without animating, nudges it clear of
// anything pinned, lands again once web fonts settle, and stands down once the reader scrolls or taps.
function landOn(id) {
  let cancelled = false;
  let observer;
  const land = () => {
    const target = document.getElementById(id);
    if (cancelled || !target) return Boolean(target);
    target.scrollIntoView({ block: 'start', behavior: 'instant' });
    const overlap = pinnedBottom() + 12 - target.getBoundingClientRect().top;
    if (overlap > 0) window.scrollBy({ top: -overlap, behavior: 'instant' });
    return true;
  };
  const settle = () => (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(land));
  if (land()) settle();
  else {
    observer = new MutationObserver(() => {
      if (!document.getElementById(id)) return;
      observer.disconnect();
      land();
      settle();
    });
    observer.observe(document.body, { childList: true, subtree: true });
    setTimeout(() => observer.disconnect(), 8000);
  }
  const stop = () => { cancelled = true; observer?.disconnect(); };
  const inputs = ['wheel', 'touchstart', 'keydown', 'pointerdown'];
  inputs.forEach((type) => window.addEventListener(type, stop, { once: true, passive: true }));
  return () => {
    stop();
    inputs.forEach((type) => window.removeEventListener(type, stop));
  };
}

/*
 * Lands a deep link (#<id>) on its element once a lazily loaded map has rendered it. The app shell's own
 * hash scroll runs before the map chunk exists, so this finishes the job. An old ?ref=<id> link counts
 * too: the app shell rewrites it to #<id>, but this may render first. Only ids in `ids` are handled; with
 * no `ids`, any element on the page with that id.
 */
export default function useHashLanding(ids) {
  const { hash, search } = useLocation();
  const key = ids ? ids.join('|') : null;

  useEffect(() => {
    const id = fragmentId(hash) || new URLSearchParams(search).get('ref');
    if (!id || (key !== null && !key.split('|').includes(id))) return undefined;
    return landOn(id);
  }, [hash, search, key]);
}

// The app shell's landing for every map page: a tab section (/maps/<map>/<tab>#section, where main-guide
// step links point) and a main-guide step (/maps/<map>#<step>, where "Back to step N" points). The flat
// main guide has no landing of its own; a guide that still lands itself just lands on the same target.
export function useTabSectionLanding() {
  const { pathname, hash, search } = useLocation();
  useEffect(() => {
    // An old ?ref=<id> link counts too: its redirect to #id can land before the router reports the new hash.
    const id = fragmentId(hash) || new URLSearchParams(search).get('ref');
    if (!id || !/^\/maps\/[^/]+/.test(pathname)) return undefined;
    return landOn(id);
  }, [pathname, hash, search]);
}
