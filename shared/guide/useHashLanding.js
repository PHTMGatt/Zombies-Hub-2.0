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

/*
 * Lands a deep link (#<id>) on its element once a lazily loaded map has rendered it. The app shell's own
 * hash scroll runs before the map chunk exists, so this finishes the job: it waits for web fonts (a late
 * font swap moves the target after the scroll), jumps without animating, and nudges the target clear of
 * anything pinned. An old ?ref=<id> link counts too: the app shell rewrites it to #<id>, but this may
 * render first. Only ids in `ids` are handled.
 */
export default function useHashLanding(ids) {
  const { hash, search } = useLocation();
  const key = ids.join('|');

  useEffect(() => {
    const id = fragmentId(hash) || new URLSearchParams(search).get('ref');
    if (!id || !key.split('|').includes(id)) return undefined;
    let cancelled = false;
    const land = () => {
      const target = document.getElementById(id);
      if (cancelled || !target) return;
      target.scrollIntoView({ block: 'start', behavior: 'instant' });
      const overlap = pinnedBottom() + 12 - target.getBoundingClientRect().top;
      if (overlap > 0) window.scrollBy({ top: -overlap, behavior: 'instant' });
    };
    land();
    (document.fonts?.ready ?? Promise.resolve()).then(() => requestAnimationFrame(land));
    return () => { cancelled = true; };
  }, [hash, search, key]);
}
