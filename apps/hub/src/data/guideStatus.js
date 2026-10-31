import guides from './EasterEggGuides';
import { dedicatedGuideSet } from './dedicatedGuides';
import { getUnlocked, mainAchievementFor } from '../../../../shared/achievements/achievements';

const hasVideo = (slug) => Boolean(guides.find((guide) => guide.slug === slug)?.videoUrl);

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
  if (hasVideo(map.slug)) return { badge: 'Video guide', kind: 'video', to: `/easter-eggs/${map.slug}` };
  const search = map.game ? `?game=${encodeURIComponent(map.game)}` : '';
  return { badge: 'No guide yet', kind: 'none', to: `/info/${map.slug}${search}` };
}

export { hasVideo };
