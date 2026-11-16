import AllMapsImg        from '../assets/images/Featured/AllMaps.webp';
import OriginsImg        from '../assets/images/Featured/Origins.webp';
import RevelationsImg    from '../assets/images/Featured/Rev.webp';
import MobOfTheDeadImg   from '../assets/images/Featured/MOTD.webp';
import DerEisendracheImg from '../assets/images/Featured/DE.webp';
import GorodKroviImg     from '../assets/images/Featured/GK.webp';
import SideEEImg         from '../assets/images/Featured/SideEE.webp';
import { getDedicatedGuideRoute } from './dedicatedGuides';
import mapData from './mapData';

// Maps without a dedicated featured picture use their catalog cover.
const coverOf = (slug) => mapData.find((m) => m.slug === slug)?.coverImage;

const featuredMaps = [
  { name: 'All Maps', route: '/allmaps', image: AllMapsImg },
  { name: 'Origins', route: getDedicatedGuideRoute('origins'), image: OriginsImg },
  { name: 'Revelations', route: getDedicatedGuideRoute('revelations'), image: RevelationsImg },
  { name: 'Mob of the Dead', route: getDedicatedGuideRoute('mob-of-the-dead'), image: MobOfTheDeadImg },
  { name: 'Der Eisendrache', route: getDedicatedGuideRoute('der-eisendrache'), image: DerEisendracheImg },
  { name: 'Gorod Krovi', route: getDedicatedGuideRoute('gorod-krovi'), image: GorodKroviImg },
  { name: 'Zetsubou No Shima', route: getDedicatedGuideRoute('zetsubou-no-shima'), image: coverOf('zetsubou-no-shima') },
  { name: 'Shadows of Evil', route: getDedicatedGuideRoute('shadows-of-evil'), image: coverOf('shadows-of-evil') },
  { name: 'Side Easter Eggs', route: '/side-easter-eggs', image: SideEEImg },
];

export default featuredMaps;
