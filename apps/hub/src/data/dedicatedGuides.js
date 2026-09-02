export const dedicatedGuideSlugs = [
  'origins',
  'mob-of-the-dead',
  'shadows-of-evil',
  'der-eisendrache',
  'zetsubou-no-shima',
  'gorod-krovi',
  'revelations',
];

export const dedicatedGuideSet = new Set(dedicatedGuideSlugs);

export const dedicatedMapPrefixes = dedicatedGuideSlugs.map(
  slug => `/maps/${slug}`,
);

export function getDedicatedGuideRoute(slug) {
  return dedicatedGuideSet.has(slug) ? `/maps/${slug}` : null;
}

export function isDedicatedMapPath(pathname) {
  return dedicatedMapPrefixes.some(
    prefix => pathname === prefix || pathname.startsWith(`${prefix}/`),
  );
}
