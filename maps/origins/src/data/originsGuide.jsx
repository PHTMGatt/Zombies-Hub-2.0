/*
 * Little Lost Girl, main guide: a FLAT list (Bryen, 2026-11-16). Each step is { id, title, goal, links }:
 * number, title, one short line, small links. Warnings, how-to lines, troubleshooting and reference lists
 * moved to the Step details tab (stepDetails.js, section #step-N); staff build/upgrade steps live
 * on the staff pages (originsStaffPages.js). Canonical step names follow the original Easter Egg.
 */
/* Run strategy: advice, not requirements (requirements live in their step). Shown in Step details. */
const TIP_EARLY = 'Build and upgrade the staffs as early as the run allows.';
const TIP_SOULS = 'Fill the soul chests during setup instead of leaving all four until the end.';
const TIP_ZOMBIE = 'Save a zombie when you need uninterrupted time for staff puzzles or map setup.';
export const originsTips = [TIP_EARLY, TIP_SOULS, TIP_ZOMBIE];

const DETAILS = '/maps/origins/step-details';

const originsGuide = [
  {
    id: 'build-staffs',
    title: 'Build the Staffs',
    goal: 'Build all four elemental staffs before continuing.',
    links: [{ to: '/maps/origins/ice-staff', section: 'build', label: 'All four staffs: build' }, { to: DETAILS, section: 'step-1', label: 'Step details' }],
  },
  {
    id: 'upgrade-staffs',
    title: 'Secure the Keys',
    goal: 'Upgrade all four staffs. Every generator must be on at once at least once, or the next step won’t start.',
    links: [{ to: '/maps/origins/ice-staff', section: 'puzzle', label: 'All four staffs: upgrade steps' }, { to: DETAILS, section: 'step-2', label: 'Step details' }],
  },
  {
    id: 'secure-keys',
    title: 'Ascend from Darkness',
    goal: 'Wind→Odin, Ice→Freya, Lightning→Thor, Fire→mound pedestal. All six generators must be on when the last staff goes in.',
    links: [{ to: DETAILS, section: 'step-3', label: 'Step details' }],
  },
  {
    id: 'thunder-fists',
    title: 'Thunder Fists',
    goal: 'Fill the four soul chests (Gen 5, mound, church path, behind Jug) for One Inch Punch.',
    links: [{ to: DETAILS, section: 'step-4', label: 'Step details' }],
  },
  {
    id: 'g-strike',
    title: 'G-Strike',
    goal: 'Purify the tablet at the church basin, carry it back with no mud, purify again at the Tank Station table: G-Strikes.',
    links: [{ to: DETAILS, section: 'step-5', label: 'Step details' }],
  },
  {
    id: 'rain-fire',
    title: 'Rain Fire',
    goal: 'Shoot open a robot’s lit foot (solo: Odin), press the red button in its head, then G-Strike the seal behind Gen 5 at once.',
    links: [{ to: DETAILS, section: 'step-6', label: 'Step details' }],
  },
  {
    id: 'unleash-horde',
    title: 'Unleash the Horde',
    goal: 'Send the Maxis Drone into the opened seal, then kill the Panzers.',
    links: [{ to: DETAILS, section: 'step-7', label: 'Step details' }],
  },
  {
    id: 'winged-beast',
    title: 'Skewer the Winged Beast',
    goal: 'In Zombie Blood shoot down the plane glowing yellow, kill the invisible pilot, then take the Maxis Drone the pilot drops.',
    links: [{ to: DETAILS, section: 'step-8', label: 'Step details' }],
  },
  {
    id: 'fist-of-iron',
    title: 'Wield a Fist of Iron',
    goal: 'In the mound, One Inch Punch the glowing Templars until the fist upgrades. Every player needs the Iron Fist.',
    links: [{ to: DETAILS, section: 'step-9', label: 'Step details' }],
  },
  {
    id: 'raise-hell',
    title: 'Raise Hell',
    goal: 'Put all four upgraded staffs in the Crazy Place holders, then get 100 kills without removing any.',
    links: [{ to: DETAILS, section: 'step-10', label: 'Step details' }],
  },
  {
    id: 'freedom',
    title: 'Freedom',
    goal: 'Release the Maxis Drone into the Crazy Place beam, then hold the action button on the centre blue rock.',
    links: [{ to: DETAILS, section: 'step-11', label: 'Step details' }],
  },
];

export default originsGuide;
