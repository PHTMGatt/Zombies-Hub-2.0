const RAW = 'https://raw.githubusercontent.com/PHTMGatt/Zombies-Hub/main/src/assets/images/Featured';

const featuredMaps = [
  { name: 'All Maps', to: '/allmaps', image: `${RAW}/AllMaps.jpg`, featured: true },
  { name: 'Origins', to: '/maps/origins', image: `${RAW}/Origins.webp` },
  { name: 'Revelations', to: '/maps/revelations', image: `${RAW}/Rev.jpg` },
  { name: 'Mob of the Dead', to: '/maps/mob-of-the-dead', image: `${RAW}/MOTD.jpg` },
  { name: 'Der Eisendrache', to: '/maps/der-eisendrache', image: `${RAW}/DE.webp` },
  { name: 'Gorod Krovi', to: '/maps/gorod-krovi', image: `${RAW}/GK.jpg` },
  { name: 'Side Easter Eggs', to: '/side-easter-eggs', image: `${RAW}/SideEE.jpg` },
];

export default featuredMaps;
