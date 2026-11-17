import { useSearchParams } from 'react-router-dom';

/*
 * Guide-system preview switch (2026-11-16). ?design=a|b|c shows a map in one of the three candidate systems and
 * is remembered for the tab; ?design=off goes back to the live look. Returns '' when no preview is on, so the
 * live pages are untouched. Works only on this machine or the home network, never on the public site: an
 * unapproved look must not be reachable in production. Remove with the two losing systems once one is chosen.
 */
const KEY = 'zh-design';
const VALID = /^[abc]$/;
const PRIVATE_HOST = /^(localhost$|127\.|\[::1\]$|10\.|192\.168\.|172\.(1[6-9]|2\d|3[01])\.)/;

export default function useDesign() {
  const [params] = useSearchParams();
  if (typeof window === 'undefined' || !PRIVATE_HOST.test(window.location.hostname)) return '';
  const asked = params.get('design');
  try {
    if (asked === 'off') window.sessionStorage.removeItem(KEY);
    else if (VALID.test(asked || '')) window.sessionStorage.setItem(KEY, asked);
    const stored = window.sessionStorage.getItem(KEY) || '';
    return VALID.test(stored) ? stored : '';
  } catch {
    return VALID.test(asked || '') ? asked : '';
  }
}
