import AllMapsImg        from '../assets/images/Featured/AllMaps.jpg';
import OriginsImg        from '../assets/images/Featured/Origins.webp';
import RevelationsImg    from '../assets/images/Featured/Rev.jpg';
import MobOfTheDeadImg   from '../assets/images/Featured/MOTD.jpg';
import DerEisendracheImg from '../assets/images/Featured/DE.webp';
import GorodKroviImg     from '../assets/images/Featured/GK.jpg';
import SideEEImg         from '../assets/images/Featured/SideEE.jpg';

const featuredMaps = [
  { name: 'All Maps', renderLink: '/allmaps', slug: null, image: AllMapsImg },
  { name: 'Origins', renderLink: '/maps/origins', slug: 'origins', image: OriginsImg },
  { name: 'Revelations', renderLink: '/maps/revelations', slug: 'revelations', image: RevelationsImg },
  { name: 'Mob of the Dead', renderLink: '/maps/mob-of-the-dead', slug: 'mob-of-the-dead', image: MobOfTheDeadImg },
  { name: 'Der Eisendrache', renderLink: '/maps/der-eisendrache', slug: 'der-eisendrache', image: DerEisendracheImg },
  { name: 'Gorod Krovi', renderLink: '/maps/gorod-krovi', slug: 'gorod-krovi', image: GorodKroviImg },
  { name: 'Side Easter Eggs', renderLink: '/side-easter-eggs', slug: null, image: SideEEImg },
];

export default featuredMaps;
