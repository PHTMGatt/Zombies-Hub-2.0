const names = {
  origins: 'Origins', 'mob-of-the-dead': 'Mob of the Dead',
  'shadows-of-evil': 'Shadows of Evil', 'der-eisendrache': 'Der Eisendrache',
  'zetsubou-no-shima': 'Zetsubou No Shima', 'gorod-krovi': 'Gorod Krovi',
  revelations: 'Revelations', 'origins-speedrun': 'Origins Speed Run',
  kino: 'Kino der Toten', gk: 'Gorod Krovi', de: 'Der Eisendrache', soe: 'Shadows of Evil',
  'fire-staff': 'Fire Staff', 'ice-staff': 'Ice Staff', 'wind-staff': 'Wind Staff',
  'lightning-staff': 'Lightning Staff', '1': 'Cog One', '2': 'Cog Two', '3': 'Cog Three',
};
const labels = {
  '/': 'Maps, Easter Eggs & Guides', '/allmaps': 'All Maps',
  '/easter-eggs': 'Main Easter Egg Guides', '/side-easter-eggs': 'Side Easter Eggs',
  '/coming-soon': 'Guide in progress', '/achievements': 'Achievements', '/search': 'Search',
};
const displayName = (slug) => names[slug] || slug.replace(/([a-z])([A-Z])/g, '$1 $2')
  .split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

export function routeTitle(pathname) {
  const path = pathname.replace(/\/+$/, '') || '/';
  if (labels[path]) return `${labels[path]} | Zombies Hub 2.0`;
  const [, section, map, ...detail] = path.split('/');
  if (['maps', 'info', 'easter-eggs', 'side-easter-eggs'].includes(section) && map) {
    const parts = detail.length ? [displayName(detail.at(-1)), displayName(map)] : [displayName(map)];
    if (section === 'side-easter-eggs') parts.push('Side Easter Eggs');
    return `${parts.join(' | ')} | Zombies Hub 2.0`;
  }
  return 'Page not found | Zombies Hub 2.0';
}
