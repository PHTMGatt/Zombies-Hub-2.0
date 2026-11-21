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

// Layout art is keyed by game folder + name ("BO1/kino der toten"): several maps exist in more than one game
// under the same file name, and a name-only key let the last folder overwrite the others.
const getFolder = (path) => path.split('/').slice(-2, -1)[0];

const layouts = {};
for (const p in layoutModules) {
  layouts[`${getFolder(p)}/${getKey(p)}`] = layoutModules[p].default;
}

const dlcArt = {};
for (const p in dlcModules) {
  dlcArt[getKey(p)] = dlcModules[p].default;
}

const covers = {};
for (const p in coverModules) {
  covers[getKey(p)] = coverModules[p].default;
}

// `folder` is the map's game folder (BO1, BO2, BO3). World at War has none and borrows the Black Ops 1 art.
const getLayout = (folder, key) => layouts[`${folder}/${key}`] || null;
const getCover = (folder, key) => covers[key] || getLayout(folder, key);

const mapData = [
  {
    name: "Nacht der Untoten",
    slug: "nacht-der-untoten",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("BO1", "nacht der untoten"),
    layoutImage: getLayout("BO1", "nacht der untoten"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Kino der Toten",
    slug: "kino-der-toten",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("BO1", "kino der toten"),
    layoutImage: getLayout("BO1", "kino der toten"),
    hoverImage: null
  },
  {
    name: "Five",
    slug: "five",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("BO1", "five"),
    layoutImage: getLayout("BO1", "five"),
    hoverImage: null
  },
  {
    name: "Dead Ops Arcade",
    slug: "dead-ops-arcade",
    game: "Black Ops 1",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("BO1", "dead ops arcade"),
    layoutImage: null,
    hoverImage: null
  },
  {
    name: "Ascension",
    slug: "ascension",
    game: "Black Ops 1",
    dlc: "DLC 1 – First Strike",
    isEasterEgg: true,
    coverImage: getCover("BO1", "ascension"),
    layoutImage: getLayout("BO1", "ascension"),
    hoverImage: dlcArt["first strike"]
  },
  {
    name: "Call of the Dead",
    slug: "call-of-the-dead",
    game: "Black Ops 1",
    dlc: "DLC 2 – Escalation",
    isEasterEgg: true,
    coverImage: getCover("BO1", "call of the dead"),
    layoutImage: getLayout("BO1", "call of the dead"),
    hoverImage: dlcArt["escalation"]
  },
  {
    name: "Shangri-La",
    slug: "shangri-la",
    game: "Black Ops 1",
    dlc: "DLC 3 – Annihilation",
    isEasterEgg: true,
    coverImage: getCover("BO1", "shangri la"),
    layoutImage: getLayout("BO1", "shangri la"),
    hoverImage: dlcArt["annihilation"]
  },
  {
    name: "Moon",
    slug: "moon",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: true,
    coverImage: getCover("BO1", "moon"),
    layoutImage: getLayout("BO1", "moon"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Verrückt",
    slug: "verrückt",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("BO1", "verrückt"),
    layoutImage: getLayout("BO1", "verrückt"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Shi No Numa",
    slug: "shi-no-numa",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("BO1", "shi no numa"),
    layoutImage: getLayout("BO1", "shi no numa"),
    hoverImage: dlcArt["rezurrection"]
  },
  {
    name: "Der Riese",
    slug: "der-riese",
    game: "Black Ops 1",
    dlc: "DLC 4 – Rezurrection",
    isEasterEgg: false,
    coverImage: getCover("BO1", "der riese"),
    layoutImage: getLayout("BO1", "der riese"),
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
    coverImage: getCover("BO2", "nuketown zombies"),
    layoutImage: getLayout("BO2", "nuketown zombies"),
    hoverImage: dlcArt["nuketown"]
  },
  {
    name: "Die Rise",
    slug: "die-rise",
    game: "Black Ops 2",
    dlc: "DLC 1 – Revolution",
    isEasterEgg: true,
    coverImage: getCover("BO2", "die rise"),
    layoutImage: getLayout("BO2", "die rise"),
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
    layoutImage: getLayout("BO2", "mob of the dead"),
    hoverImage: dlcArt["uprising"]
  },
  {
    name: "Buried",
    slug: "buried",
    game: "Black Ops 2",
    dlc: "DLC 3 – Vengeance",
    isEasterEgg: true,
    coverImage: getCover("BO2", "buried"),
    layoutImage: getLayout("BO2", "buried"),
    hoverImage: dlcArt["vengeance"]
  },
  {
    name: "Origins",
    slug: "origins",
    game: "Black Ops 2",
    dlc: "DLC 4 – Apocalypse",
    isEasterEgg: true,
    internalRoute: '/maps/origins',
    coverImage: getCover("BO2", "origins"),
    layoutImage: getLayout("BO2", "origins"),
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
    coverImage: getCover("BO3", "shadows of evil"),
    layoutImage: getLayout("BO3", "shadows of evil"),
    hoverImage: null
  },
  {
    name: "The Giant",
    slug: "the-giant",
    game: "Black Ops 3",
    dlc: "DLC – Giant",
    isEasterEgg: true,
    coverImage: getCover("BO3", "the giant"),
    layoutImage: getLayout("BO3", "the giant"),
    hoverImage: dlcArt["giant"]
  },
  {
    name: "Dead Ops Arcade II",
    slug: "dead-ops-arcade-ii",
    game: "Black Ops 3",
    dlc: "Bonus",
    isEasterEgg: false,
    coverImage: getCover("BO3", "dead ops arcade ii"),
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
    coverImage: getCover("BO3", "der eisendrache"),
    layoutImage: getLayout("BO3", "der eisendrache"),
    hoverImage: dlcArt["awakening"]
  },
  {
    name: "Zetsubou No Shima",
    slug: "zetsubou-no-shima",
    game: "Black Ops 3",
    dlc: "DLC 2 – Eclipse",
    isEasterEgg: true,
    internalRoute: '/maps/zetsubou-no-shima',
    coverImage: getCover("BO3", "zetsubou no shima"),
    layoutImage: getLayout("BO3", "zetsubou no shima"),
    hoverImage: dlcArt["eclipse"]
  },
  {
    name: "Gorod Krovi",
    slug: "gorod-krovi",
    game: "Black Ops 3",
    dlc: "DLC 3 – Descent",
    isEasterEgg: true,
    internalRoute: '/maps/gorod-krovi',
    coverImage: getCover("BO3", "gorod krovi"),
    layoutImage: getLayout("BO3", "gorod krovi"),
    hoverImage: dlcArt["descent"]
  },
  {
    name: "Revelations",
    slug: "revelations",
    game: "Black Ops 3",
    dlc: "DLC 4 – Salvation",
    isEasterEgg: true,
    internalRoute: '/maps/revelations',
    coverImage: getCover("BO3", "revelations"),
    layoutImage: getLayout("BO3", "revelations"),
    hoverImage: dlcArt["salvation"]
  },
  {
    name: "Nacht der Untoten",
    slug: "nacht-der-untoten",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("BO3", "nacht der untoten"),
    layoutImage: getLayout("BO3", "nacht der untoten"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Kino der Toten",
    slug: "kino-der-toten",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("BO3", "kino der toten"),
    layoutImage: getLayout("BO3", "kino der toten"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Shangri-La",
    slug: "shangri-la",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    coverImage: getCover("BO3", "shangri la"),
    layoutImage: getLayout("BO3", "shangri la"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Moon",
    slug: "moon",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    coverImage: getCover("BO3", "moon"),
    layoutImage: getLayout("BO3", "moon"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Origins",
    slug: "origins",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: true,
    internalRoute: '/maps/origins',
    coverImage: getCover("BO3", "origins"),
    layoutImage: getLayout("BO3", "origins"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Shi No Numa",
    slug: "shi-no-numa",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("BO3", "shi no numa"),
    layoutImage: getLayout("BO3", "shi no numa"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  {
    name: "Verrückt",
    slug: "verrückt",
    game: "Black Ops 3",
    dlc: "Zombies Chronicles",
    isEasterEgg: false,
    coverImage: getCover("BO3", "verrückt"),
    layoutImage: getLayout("BO3", "verrückt"),
    hoverImage: dlcArt["zombie chronicles"]
  },
  // World at War originals. Entries only (no guide): the later Black Ops versions below are the ones with art and guides.
  {
    name: "Nacht der Untoten",
    slug: "nacht-der-untoten",
    game: "World at War",
    dlc: "Base Game",
    isEasterEgg: false,
    coverImage: getCover("BO1", "nacht der untoten"),
    layoutImage: getLayout("BO1", "nacht der untoten"),
    hoverImage: null
  },
  {
    name: "Verrückt",
    slug: "verrückt",
    game: "World at War",
    dlc: "Map Pack 1",
    isEasterEgg: false,
    coverImage: getCover("BO1", "verrückt"),
    layoutImage: getLayout("BO1", "verrückt"),
    hoverImage: null
  },
  {
    name: "Shi No Numa",
    slug: "shi-no-numa",
    game: "World at War",
    dlc: "Map Pack 2",
    isEasterEgg: false,
    coverImage: getCover("BO1", "shi no numa"),
    layoutImage: getLayout("BO1", "shi no numa"),
    hoverImage: null
  },
  {
    name: "Der Riese",
    slug: "der-riese",
    game: "World at War",
    dlc: "Map Pack 3",
    isEasterEgg: false,
    coverImage: getCover("BO1", "der riese"),
    layoutImage: getLayout("BO1", "der riese"),
    hoverImage: null
  },
];

export default mapData;
