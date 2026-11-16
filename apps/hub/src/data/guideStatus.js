import guides from './EasterEggGuides';
import { dedicatedGuideSet } from './dedicatedGuides';
import { getUnlocked, mainAchievementFor } from '../../../../shared/achievements/achievements';

const hasVideoSlug = (slug) => Boolean(guides.find((guide) => guide.slug === slug)?.videoUrl);
// A map in two games has one route per game: the BO3 remaster uses `<slug>-chronicles` when it has its own guide entry.
const routeSlug = (map) => (map.game === 'Black Ops 3' && guides.some((guide) => guide.slug === `${map.slug}-chronicles`) ? `${map.slug}-chronicles` : map.slug);

/*
 * What a main Easter Egg card should promise and where it should go, so no card leads to a dead end:
 * full step guide (✓ once its achievement is earned) → video guide → the map's info page.
 * The `tracked` kind name is kept for the chip's styling hook; nothing is tracked.
 */
export function mainEggStatus(map) {
  if (dedicatedGuideSet.has(map.slug)) {
    const achievement = mainAchievementFor(map.slug);
    const badge = achievement && getUnlocked()[achievement.id] ? '✓ Complete' : 'Full guide';
    return { badge, kind: 'tracked', to: `/maps/${map.slug}` };
  }
  if (hasVideoSlug(routeSlug(map))) return { badge: 'Video guide', kind: 'video', to: `/easter-eggs/${routeSlug(map)}` };
  const search = map.game ? `?game=${encodeURIComponent(map.game)}` : '';
  return { badge: 'No guide yet', kind: 'none', to: `/info/${map.slug}${search}` };
}

// hasVideo(slug) for a slug alone; hasVideo(slug, map) is route-aware (the BO3 remaster's own entry).
const hasVideo = (slug, map) => hasVideoSlug(map ? routeSlug(map) : slug);
export { hasVideo };
