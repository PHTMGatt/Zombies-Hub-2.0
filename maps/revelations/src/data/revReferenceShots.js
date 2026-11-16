/*
 * Revelations reference screenshots that used to sit inside the Main Guide steps. The Main Guide is the Easter Egg
 * steps only; these belong to the tabs: servantRocks → Apothicon Upgrade (#servant-rocks), boneSpots and
 * turretShot → Egg Locations (#bone-spots, #turret-shot). The repo's own in-game captures, unchanged.
 * Moved verbatim from revGuideSteps.jsx; every alt text and caption is as it was.
 */
import servantSpawn from '../assets/rev-ref/servant-spawn.webp';
import servantSpawnAim from '../assets/rev-ref/servant-spawn-aim.webp';
import servantShang from '../assets/rev-ref/servant-shang.webp';
import servantShangAim from '../assets/rev-ref/servant-shang-aim.webp';
import servantVerruckt from '../assets/rev-ref/servant-verruckt.webp';
import servantVerrucktAim from '../assets/rev-ref/servant-verruckt-aim.webp';
import servantMotd from '../assets/rev-ref/servant-motd.webp';
import servantMotdAim from '../assets/rev-ref/servant-motd-aim.webp';
import servantNacht from '../assets/rev-ref/servant-nacht.webp';
import servantNachtAim from '../assets/rev-ref/servant-nacht-aim.webp';
import boneSpawn from '../assets/rev-ref/bone-spawn.webp';
import boneShang from '../assets/rev-ref/bone-shang.webp';
import boneOrigins from '../assets/rev-ref/bone-origins.webp';
import boneVerruckt from '../assets/rev-ref/bone-verruckt.webp';
import boneDe from '../assets/rev-ref/bone-de.webp';
import boneNacht from '../assets/rev-ref/bone-nacht.webp';
import bonesAbsorb from '../assets/rev-ref/bones-absorb.webp';
import turretBeam from '../assets/rev-ref/turret-beam.webp';

const IMG = { width: 1280, height: 720 };

const rock = (id, label, wide, aim) => ({
  id,
  label,
  images: [
    { src: aim, alt: `Aiming the Apothicon Servant at the blue rock — ${label}`, caption: 'Aim here', ...IMG },
    { src: wide, alt: `Blue rock in the sky — ${label}`, caption: 'Where you stand', ...IMG },
  ],
});
const bone = (id, label, src) => ({
  id,
  label,
  images: [{ src, alt: `Bone spot — ${label}`, caption: `${label}: shoot it with a Pack-a-Punched bullet weapon`, ...IMG }],
});

export const servantRocks = [
  rock('spawn', 'Spawn', servantSpawn, servantSpawnAim),
  rock('shang', 'Shangri-La', servantShang, servantShangAim),
  rock('verruckt', 'Verrückt', servantVerruckt, servantVerrucktAim),
  rock('motd', 'Mob of the Dead', servantMotd, servantMotdAim),
  rock('nacht', 'Nacht', servantNacht, servantNachtAim),
];

export const boneSpots = [
  bone('spawn', 'Spawn', boneSpawn),
  bone('shang', 'Shangri-La', boneShang),
  bone('origins', 'Origins', boneOrigins),
  bone('verruckt', 'Verrückt', boneVerruckt),
  bone('de', 'Der Eisendrache', boneDe),
  bone('nacht', 'Nacht', boneNacht),
  { id: 'absorb', label: 'Absorbing', images: [{ src: bonesAbsorb, alt: 'Absorbing a revealed bone with the upgraded Apothicon Servant', caption: 'Then absorb it with the upgraded Servant', ...IMG }] },
];

export const turretShot = { src: turretBeam, alt: 'Laser turret firing at the blue rock behind a rift', caption: 'Turret shot', ...IMG };
