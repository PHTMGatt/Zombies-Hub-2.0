import guides from './EasterEggGuides';
import { dedicatedGuideSet } from './dedicatedGuides';
import { getUnlocked, guideProgress, mainAchievementFor } from '../../../../shared/achievements/achievements';
import { progressKey, read } from '../../../../shared/storage';

const hasVideo = (slug) => Boolean(guides.find((guide) => guide.slug === slug)?.videoUrl);

/*
 * What a main Easter Egg card should promise and where it should go, so no card leads to a dead end:
 * tracked guide (with the player's own progress) → video guide → the map's info page.
 */
export function mainEggStatus(map) {
  if (dedicatedGuideSet.has(map.slug)) {
    const achievement = mainAchievementFor(map.slug);
    const progress = guideProgress(map.slug);
    const saved = read(progressKey(map.slug), null);
    let badge = 'Tracked guide';
    if (achievement && getUnlocked()[achievement.id]) badge = '✓ Complete';
    else if (progress?.total && (progress.done > 0 || (saved?.step ?? 1) > 1)) badge = `Step ${saved?.step ?? progress.done + 1} / ${progress.total}`;
    return { badge, kind: 'tracked', to: `/maps/${map.slug}` };
  }
  if (hasVideo(map.slug)) return { badge: 'Video guide', kind: 'video', to: `/easter-eggs/${map.slug}` };
  const search = map.game ? `?game=${encodeURIComponent(map.game)}` : '';
  return { badge: 'No guide yet', kind: 'none', to: `/info/${map.slug}${search}` };
}

export { hasVideo };
