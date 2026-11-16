/*
 * The same map under another name in another game (different slugs, so not covered by the "-chronicles" variants).
 * Shown on the map's info page as "Same map in other games". Each pair is linked in both directions.
 */
export const sameMapPairs = [
  ['der-riese', 'the-giant'],
  ['dead-ops-arcade', 'dead-ops-arcade-ii'],
];

export const sameMapSlugs = (slug) => sameMapPairs.flatMap(([a, b]) => (a === slug ? [b] : b === slug ? [a] : []));
