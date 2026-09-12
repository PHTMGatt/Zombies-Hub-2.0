import AllMapsImg        from '../assets/images/Featured/AllMaps.jpg';
import OriginsImg        from '../assets/images/Featured/Origins.webp';
import RevelationsImg    from '../assets/images/Featured/Rev.jpg';
import MobOfTheDeadImg   from '../assets/images/Featured/MOTD.jpg';
import DerEisendracheImg from '../assets/images/Featured/DE.webp';
import GorodKroviImg     from '../assets/images/Featured/GK.jpg';
import SideEEImg         from '../assets/images/Featured/SideEE.jpg';
import { getDedicatedGuideRoute } from './dedicatedGuides';

const featuredMaps = [
  { name: 'All Maps', route: '/allmaps', image: AllMapsImg },
  { name: 'Origins', route: getDedicatedGuideRoute('origins'), image: OriginsImg },
  { name: 'Revelations', route: getDedicatedGuideRoute('revelations'), image: RevelationsImg },
  { name: 'Mob of the Dead', route: getDedicatedGuideRoute('mob-of-the-dead'), image: MobOfTheDeadImg },
  { name: 'Der Eisendrache', route: getDedicatedGuideRoute('der-eisendrache'), image: DerEisendracheImg },
  { name: 'Gorod Krovi', route: getDedicatedGuideRoute('gorod-krovi'), image: GorodKroviImg },
  { name: 'Side Easter Eggs', route: '/side-easter-eggs', image: SideEEImg },
];

export default featuredMaps;
