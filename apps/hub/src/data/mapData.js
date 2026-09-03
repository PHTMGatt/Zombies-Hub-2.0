import imageData from '../data/imageData';
import motdCover from '../assets/images/BO2/Mob_Of_The_Dead.webp';

const layoutModules = import.meta.glob(
  '../assets/images/BO*/*.{webp,jpg,png,avif}',
  { eager: true }
);
const dlcModules = import.meta.glob(
  '../assets/images/DLC/*.{png,jpg,webp,avif}',
  { eager: true }
);
const coverModules = import.meta.glob(
  '../assets/images/Maps/*.{jpg,png,webp,avif}',
  { eager: true }
);

function getKey(path) {
  return path
    .split('/')
    .pop()
    .replace(/\.(webp|jpg|png|avif)$/, '')
    .replace(/_/g, ' ')
    .normalize('NFC')
    .toLowerCase();
}

const layouts = {};
for (const p in layoutModules) {
  layouts[getKey(p)] = layoutModules[p].default;
}

const dlcArt = {};
for (const p in dlcModules) {
  dlcArt[getKey(p)] = dlcModules[p].default;
}

const covers = {};
for (const p in coverModules) {
  covers[getKey(p)] = coverModules[p].default;
}

const getCover = (key) => covers[key] || layouts[key] || null;
const getLayout = (key) => layouts[key] || null;

const mapData = [
  {
    name: "Nacht der Untoten",
    slug: "nacht-der-untoten",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("nacht der untoten"),
    layoutImage: getLayout("nacht der untoten"),
    hoverImage: null
  },
  {
    name: "Kino der Toten",
    slug: "kino-der-toten",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("kino der toten"),
    layoutImage: getLayout("kino der toten"),
    hoverImage: null
  },
  {
    name: "Five",
    slug: "five",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("five"),
    layoutImage: getLayout("five"),
    hoverImage: null
  },
  {
    name: "Dead Ops Arcade",
    slug: "dead-ops-arcade",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("dead ops arcade"),
    layoutImage: null,
    hoverImage: null
  },
  {
    name: "Ascension",
    slug: "ascension",
    game: "Black Ops 1",
    dlc: "DLC 1 – First Strike",
    isEasterEgg: true,
    coverImage: getCover("ascension"),
    layoutImage: getLayout("ascension"),
    hoverImage: dlcArt["first strike"]
  },
  {
    name: "Call of the Dead",
    slug: "call-of-the-dead",
    game: "Black Ops 1",
    dlc: "DLC 2 – Escalation",
    isEasterEgg: true,
    coverImage: getCover("call of the dead"),
    layoutImage: getLayout("call of the dead"),
    hoverImage: dlcArt["escalation"]
  },
  {
    name: "Shangri-La",
    slug: "shangri-la",
    game: "Black Ops 1",
    dlc: "DLC 3 – Annihilation",
    isEasterEgg: true,
    coverImage: getCover("shangri la"),
    layoutImage: getLayout("shangri la"),
    hoverImage: dlcArt["annihilation"]
  },
  {
    name: "Moon",
    slug: "moon",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: true,
    coverImage: getCover("moon"),
    layoutImage: getLayout("moon"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Verrückt",
    slug: "verrückt",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("verrückt"),
    layoutImage: getLayout("verrückt"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Shi No Numa",
    slug: "shi-no-numa",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("shi no numa"),
    layoutImage: getLayout("shi no numa"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Der Riese",
    slug: "der-riese",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("der riese"),
    layoutImage: getLayout("der riese"),
    hoverImage: dlcArt["rezurrection"]
  },

  // Black Ops 2 --------------------

  {
    name: "TranZit",
    slug: "tranzit",
    game: "Black Ops 2",
    dlc: "Base Game",
    released: "2012-11-13",
    description: "Travel across Green Run by bus, build key equipment, and complete Tower of Babble by powering the pylon for either Maxis or Richtofen.",
    isEasterEgg: true,
    coverImage: imageData.TranzitCoverMap,
    layoutImage: imageData.TranzitLayout,
    hoverImage: null
  },
  {
    name: "Nuketown Zombies",
    slug: "nuketown-zombies",
    game: "Black Ops 2",
    dlc: "DLC – Nuketown Zombies",
    isEasterEgg: false,
    coverImage: getCover("nuketown zombies"),
    layoutImage: getLayout("nuketown zombies"),
    hoverImage: dlcArt["nuketown"]
  },
  {
    name: "Die Rise",
    slug: "die-rise",
    game: "Black Ops 2",
    dlc: "DLC 1 – Revolution",
    isEasterEgg: true,
    coverImage: getCover("die rise"),
    layoutImage: getLayout("die rise"),
    hoverImage: dlcArt["revolution"]
  },
  {
    name: "Mob of the Dead",
    slug: "mob-of-the-dead",
    game: "Black Ops 2",
    dlc: "DLC 2 – Uprising",
    isEasterEgg: true,
    internalRoute: '/maps/mob-of-the-dead',
    coverImage: motdCover,
    layoutImage: getLayout("mob of the dead"),
    hoverImage: dlcArt["uprising"]
  },
  {
    name: "Buried",
    slug: "buried",
    game: "Black Ops 2",
    dlc: "DLC 3 – Vengeance",
    isEasterEgg: true,
    coverImage: getCover("buried"),
    layoutImage: getLayout("buried"),
    hoverImage: dlcArt["vengeance"]
  },
  {
    name: "Origins",
    slug: "origins",
    game: "Black Ops 2",
    dlc: "DLC 4 – Apocalypse",
    isEasterEgg: true,
    internalRoute: '/maps/origins',
    coverImage: getCover("origins"),
    layoutImage: getLayout("origins"),
    hoverImage: dlcArt["apocalypse"]
  },

  // Black Ops 3 --------------------

  {
    name: "Shadows of Evil",
    slug: "shadows-of-evil",
    game: "Black Ops 3",
    dlc: "Base Game",
    isEasterEgg: true,
    internalRoute: '/maps/shadows-of-evil',
    coverImage: getCover("shadows of evil"),
    layoutImage: getLayout("shadows of evil"),
    hoverImage: null
  },
  {
    name: "The Giant",
    slug: "the-giant",
    game: "Black Ops 3",
    dlc: "DLC – Giant",
    isEasterEgg: true,
    coverImage: getCover("the giant"),
    layoutImage: getLayout("the giant"),
    hoverImage: dlcArt["giant"]
  },
  {
    name: "Dead Ops Arcade II",
    slug: "dead-ops-arcade-ii",
    game: "Black Ops 3",
    dlc: "Bonus",
    isEasterEgg: false,
    coverImage: getCover("dead ops arcade ii"),
    layoutImage: null,
    hoverImage: null
  },
  {
    name: "Der Eisendrache",
    slug: "der-eisendrache",
    game: "Black Ops 3",
    dlc: "DLC 1 – Awakening",
    isEasterEgg: true,
    internalRoute: '/maps/der-eisendrache',
    coverImage: getCover("der eisendrache"),
    layoutImage: getLayout("der eisendrache"),
    hoverImage: dlcArt["awakening"]
  },
  {
    name: "Zetsubou No Shima",
    slug: "zetsubou-no-shima",
    game: "Black Ops 3",
    dlc: "DLC 2 – Eclipse",
    isEasterEgg: true,
    internalRoute: '/maps/zetsubou-no-shima',
    coverImage: getCover("zetsubou no shima"),
    layoutImage: getLayout("zetsubou no shima"),
    hoverImage: dlcArt["eclipse"]
  },
  {
    name: "Gorod Krovi",
    slug: "gorod-krovi",
    game: "Black Ops 3",
    dlc: "DLC 3 – Descent",
    isEasterEgg: true,
    internalRoute: '/maps/gorod-krovi',
    coverImage: getCover("gorod krovi"),
    layoutImage: getLayout("gorod krovi"),
    hoverImage: dlcArt["descent"]
  },
  {
    name: "Revelations",
    slug: "revelations",
    game: "Black Ops 3",
    dlc: "DLC 4 – Salvation",
    isEasterEgg: true,
    internalRoute: '/maps/revelations',
    coverImage: getCover("revelations"),
    layoutImage: getLayout("revelations"),
    hoverImage: dlcArt["salvation"]
  },
  {
    name: "Nacht der Untoten",
    slug: "nacht-der-untoten",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("nacht der untoten"),
    layoutImage: getLayout("nacht der untoten"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Kino der Toten",
    slug: "kino-der-toten",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("kino der toten"),
    layoutImage: getLayout("kino der toten"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Shangri-La",
    slug: "shangri-la",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    coverImage: getCover("shangri la"),
    layoutImage: getLayout("shangri la"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Moon",
    slug: "moon",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    coverImage: getCover("moon"),
    layoutImage: getLayout("moon"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Origins",
    slug: "origins",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    internalRoute: '/maps/origins',
    coverImage: getCover("origins"),
    layoutImage: getLayout("origins"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Shi No Numa",
    slug: "shi-no-numa",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("shi no numa"),
    layoutImage: getLayout("shi no numa"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Verrückt",
    slug: "verrückt",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("verrückt"),
    layoutImage: getLayout("verrückt"),
    hoverImage: dlcArt["zombie chronicles"]
  },
];

export default mapData;
