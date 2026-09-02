// src/data/featuredMaps.js

import AllMapsImg        from '../assets/images/Featured/AllMaps.jpg';
import OriginsImg        from '../assets/images/Featured/Origins.webp';
import RevelationsImg    from '../assets/images/Featured/Rev.jpg';
import MobOfTheDeadImg   from '../assets/images/Featured/MOTD.jpg';
import DerEisendracheImg from '../assets/images/Featured/DE.webp';
import GorodKroviImg     from '../assets/images/Featured/GK.jpg';
import SideEEImg         from '../assets/images/Featured/SideEE.jpg';

const featuredMaps = [
  {
    name: 'All Maps',
    renderLink: '/allmaps',
    slug: null,
    image: AllMapsImg,
  },
  {
    name: 'Origins',
    renderLink: 'https://origins-wtyd.onrender.com',
    slug: 'origins',
    image: OriginsImg,
  },
  {
    name: 'Revelations',
    renderLink: 'https://revelations-guide.onrender.com',
    slug: 'revelations',
    image: RevelationsImg,
  },
  {
    name: 'Mob of the Dead',
    renderLink: 'https://motd-guide.onrender.com',
    slug: 'mob-of-the-dead',
    image: MobOfTheDeadImg,
  },
  {
    name: 'Der Eisendrache',
    renderLink: 'https://der-eisendrache-guide.onrender.com',
    slug: 'der-eisendrache',
    image: DerEisendracheImg,
  },
  {
    name: 'Gorod Krovi',
    renderLink: 'https://gorod-krovi-guide.onrender.com',
    slug: 'gorod-krovi',
    image: GorodKroviImg,
  },
  {
    name: 'Side Easter Eggs',
    renderLink: '/side-easter-eggs',
    slug: null,
    image: SideEEImg,
  },
];

export default featuredMaps;
