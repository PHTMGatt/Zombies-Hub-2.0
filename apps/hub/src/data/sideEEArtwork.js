// Clean widescreen artwork for Side Easter Egg cards and guide headers.
// The Maps/*Cover catalog strips carry a burned-in title banner, so never use them here.
import originsArtwork from '../assets/images/Featured/Origins.webp';
import kinoArtwork from '../assets/images/BO1/Kino_Der_Toten.webp';
import gorodArtwork from '../assets/images/Featured/GK.webp';
import derEisendracheArtwork from '../assets/images/Featured/DE.webp';
import shadowsArtwork from '../assets/images/Featured/SOE.webp';

// `focus` is the object/background position that keeps each scene's subject in frame at any crop.
const sideEEArtwork = {
  'origins-speedrun': { src: originsArtwork, focus: 'center 30%' },
  kino: { src: kinoArtwork, focus: 'center 45%' },
  gk: { src: gorodArtwork, focus: 'center 32%' },
  de: { src: derEisendracheArtwork, focus: 'center 42%' },
  soe: { src: shadowsArtwork, focus: 'center 40%' },
};

export default sideEEArtwork;
