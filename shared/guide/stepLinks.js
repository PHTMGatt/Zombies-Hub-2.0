/*
 * Main guide ↔ tab links. The main guide holds only the Easter Egg steps; the tabs (staffs, bows, parts,
 * codes…) own the detail. A step links into a tab section, and the tab links back to that step.
 *
 * A step (or one of its tab variants) lists links as:
 *   links: [{ to: '/maps/der-eisendrache/bows/fire', section: 'parts', label: 'Fire Bow parts', tone }]
 *   - to       the tab's route (absolute, as today)
 *   - section  optional id of the element on the tab page to land on (rendered as #section)
 *   - label    link text; tone: optional accent colour
 *
 * stepLinkHref() adds ?from=<step id> so the tab page can offer "Back to step N" (BackToStep.jsx).
 * The origin lives in the URL, not in history state: a reload or a shared link keeps it.
 */
export const FROM_PARAM = 'from';
const STEP_ID = /^[a-z0-9][a-z0-9-]*$/i;

export function stepLinkHref(link, stepId) {
  const [beforeHash, existingHash = ''] = link.to.split('#');
  const [pathname, query = ''] = beforeHash.split('?');
  const params = new URLSearchParams(query);
  if (stepId && STEP_ID.test(stepId)) params.set(FROM_PARAM, stepId);
  const search = params.toString();
  const hash = link.section ?? existingHash;
  return `${pathname}${search ? `?${search}` : ''}${hash ? `#${hash}` : ''}`;
}

// The step a tab page was opened from, only if it is one of `steps` (never trust the raw param).
export function stepOrigin(search, steps) {
  const id = new URLSearchParams(search).get(FROM_PARAM);
  if (!id || !STEP_ID.test(id)) return null;
  const index = steps.findIndex((step) => step.id === id);
  return index < 0 ? null : { step: steps[index], number: index + 1 };
}
