import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

/*
 * Keyboard users: when a link lands on #something (a "Step details →" link, "Back to step N", a pasted deep link),
 * the page scrolls there but focus stays where it was (or on <body>), so the next Tab jumps back to the top.
 * This moves focus to the target without scrolling (the landing code already scrolls) and without changing how it looks
 * (the target gets tabindex="-1" and no outline; the :target styles already mark it). `ready` lets a page wait until
 * its content exists.
 */
export default function useHashFocus(ready = true) {
  const { hash, pathname } = useLocation();
  useEffect(() => {
    if (!ready || !hash || hash.length < 2) return undefined;
    const frame = requestAnimationFrame(() => {
      const target = document.getElementById(decodeURIComponent(hash.slice(1)));
      if (!target) return;
      if (!target.hasAttribute('tabindex') && !/^(A|BUTTON|INPUT|SELECT|TEXTAREA)$/.test(target.tagName)) {
        target.setAttribute('tabindex', '-1');
        target.style.outline = 'none';
      }
      target.focus({ preventScroll: true });
    });
    return () => cancelAnimationFrame(frame);
  }, [hash, pathname, ready]);
}
