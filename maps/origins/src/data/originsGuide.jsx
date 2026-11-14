/*
 * Little Lost Girl as guide steps: the Easter Egg sequence only. Canonical step names follow the
 * original Easter Egg (Secure the Keys, Ascend from Darkness, Rain Fire, Unleash the Horde, Skewer the
 * Winged Beast, Wield a Fist of Iron, Raise Hell, Freedom); Build the Staffs, Thunder Fists and G-Strike
 * are the prerequisites that sit between them. Everything about building or upgrading a staff lives on
 * that staff's page (originsStaffPages.js), never here.
 */
// Staff colours for the placement facts in Ascend from Darkness.
const TONE = {
  ice: '#78e8e1',
  fire: '#ff7844',
  wind: '#ffe657',
  lightning: '#d8a8ff',
};

const originsGuide = [
  {
    id: 'build-staffs',
    title: 'Build the Staffs',
    goal: 'Build all four elemental staffs before continuing.',
  },
  {
    id: 'upgrade-staffs',
    title: 'Secure the Keys',
    goal: 'Upgrade all four staffs before continuing.',
    // User-provided source (Origins Easter Egg guide), 2026-11-02.
    critical: ['After every staff is built, all generators must be on at the same time at least once, or the next step will not start.'],
  },
  {
    id: 'secure-keys',
    title: 'Ascend from Darkness',
    goal: 'Put each upgraded staff in its robot, and Fire in the mound pedestal.',
    refs: [
      { type: 'facts', label: 'Staff → place', items: [
        { k: 'Wind', v: 'Odin · middle robot', tone: TONE.wind },
        { k: 'Ice', v: 'Freya · Church / Gen 6 robot', tone: TONE.ice },
        { k: 'Lightning', v: 'Thor · spawn / Gen 1–3 robot', tone: TONE.lightning },
        { k: 'Fire', v: 'Pedestal at the bottom of the mound', tone: TONE.fire },
      ] },
    ],
    how: [
      // User-provided source (Origins Easter Egg guide), 2026-11-02.
      'The staffs can go in any order. They stay locked in place until the step completes, then return to their Excavation pedestals.',
    ],
  },
  {
    id: 'thunder-fists',
    title: 'Thunder Fists',
    goal: 'Fill the four soul chests in the giant robot footprints, then take One Inch Punch from the reward chest.',
    refs: [
      // 2026-11-14: "Gen 6 footprint" corrected to the Church path footprint. Wiki and both video guides
      // agree no chest is at Generator 6 (research:zombies:2026-11-13, origins.md disagreement 5).
      { type: 'chips', label: 'Soul chests', items: ['Gen 5 footprint', 'Mound footprint', 'Church path footprint', 'Footprint behind Juggernog'] },
    ],
  },
  {
    id: 'g-strike',
    title: 'G-Strike',
    // 2026-11-14, review M4: the goal and the walk back now match the two melee batches (origins.md, G-Strike).
    goal: 'Take the tablet from the Tank Station, purify it with melee kills at the church basin, carry it back without touching mud, then melee kill again at the table.',
    refs: [
      { type: 'sequence', items: ['Tablet', 'Church melee kills', 'Return — no mud', 'Table melee kills', 'G-Strikes'] },
    ],
    critical: ['Do not step in mud on the way back with the tablet.'],
    how: [
      // 2026-11-14, from the Wiki + MrRoflWaffles cross-check (research:zombies:2026-11-13): where the
      // tablet starts, and the second melee batch the old text left out.
      'Take the dirty stone tablet from the Tank Station table by Generator 2, left of the back door.',
      'In the church, put it in the holy-water basin and get about 20 melee kills next to it.',
      'Carry it back to the Tank Station without stepping in mud (mud means rinsing it at the basin again).',
      'Back at the Tank Station, put it on the table and get about 20 more melee kills next to it. The G-Strikes appear on the table.',
      'Have the G-Strike grenades before Rain Fire.',
    ],
  },
  {
    id: 'rain-fire',
    title: 'Rain Fire',
    // 2026-11-14, review M5: any robot in co-op, Odin solo (origins.md, step 3 and disagreement 15), so the
    // goal and the always-shown warning no longer ask a solo player to be in two places at once.
    goal: 'Press the red button in a robot’s head, then land a G-Strike on the seal behind Generator 5 straight away.',
    refs: [
      { type: 'sequence', items: ['Middle robot · open foot', 'Red button', 'G-Strike the seal at Gen 5'] },
    ],
    critical: ['The G-Strike must land right after the press: in co-op, have the thrower waiting at the seal; solo, use Odin, then drop out, run and throw. A miss wastes the G-Strike.'],
    how: [
      'Enter the middle robot through an open foot and press the red button.',
      'Immediately throw a G-Strike onto the seal by Generator 5.',
    ],
    problems: [
      'Have the Maxis Drone built and ready before you attempt Rain Fire — the next step needs it at once.',
      // 2026-11-14, Wiki + MrRoflWaffles (research:zombies:2026-11-13, disagreement 15).
      'Co-op: any robot works, one player presses and another throws. Solo: use the middle robot (Odin), press, drop out and throw.',
    ],
  },
  {
    id: 'unleash-horde',
    title: 'Unleash the Horde',
    goal: 'Send the Maxis Drone into the opened seal, then kill the Panzers that spawn.',
    refs: [
      { type: 'sequence', items: ['Seal opens', 'Maxis Drone into the hole', 'Kill the Panzers'] },
    ],
    how: ['As soon as the seal opens, send the Maxis Drone into the hole and defeat the Panzer Soldiers that spawn.'],
  },
  {
    id: 'winged-beast',
    title: 'Skewer the Winged Beast',
    goal: 'In Zombie Blood, shoot down the glowing red plane and kill the invisible pilot.',
    refs: [
      { type: 'sequence', items: ['Zombie Blood', 'Shoot the red plane', 'Kill the pilot'] },
      { type: 'facts', items: [{ k: 'Pilot', v: 'Invisible · runs clockwise · stay in Zombie Blood' }] },
    ],
    problems: ['No Zombie Blood from the Panzers? The Ice Staff bonfire method can produce a free one near Pack-a-Punch.'],
  },
  {
    id: 'fist-of-iron',
    title: 'Wield a Fist of Iron',
    goal: 'In the mound, One Inch Punch the glowing Templar zombies until the fist upgrades.',
    refs: [
      { type: 'sequence', items: ['Mound', 'One Inch Punch glowing Templars', 'Collect the upgraded fist'] },
    ],
    // User-provided source (Origins Easter Egg guide), 2026-11-02.
    critical: ['Every player needs the Iron Fist. Do not hit Templars still climbing in through the walls: the tablet can drop out of reach and end the Easter Egg.'],
    how: ['In the mound, use the One Inch Punch on the glowing / white-fist Templar zombies until the upgrade is complete, then collect the upgraded elemental fist.'],
  },
  {
    id: 'raise-hell',
    title: 'Raise Hell',
    goal: 'All four upgraded staffs in their Crazy Place holders, then 100 kills without removing them.',
    refs: [
      { type: 'sequence', items: ['4 staffs in Crazy Place holders', '100 kills'] },
    ],
    critical: ['The Fire Staff must be back in its Crazy Place holder before the 100 kills — and never take a staff out.'],
  },
  {
    id: 'freedom',
    title: 'Freedom',
    goal: 'Pick up the Maxis Drone and release it into the Crazy Place beam.',
    refs: [
      { type: 'sequence', items: ['Pick up Maxis Drone', 'Release into the beam', 'Ending'] },
    ],
    how: [
      'Pick up the Maxis Drone, release it into the beam in the Crazy Place, and trigger the ending.',
      // User-provided source (Origins Easter Egg guide), 2026-11-02.
      'Once the drone rises into the portal, hold the action button on the blue rock in the centre to end the game.',
    ],
    problems: [
      'Going for the ending cutscene? Keep all generators active when you recover the upgraded Maxis Drone from the pilot sequence.',
    ],
  },
];

/* Run strategy for the Tips column: advice, not requirements (requirements live in their step). */
export const originsTips = [
  'Build and upgrade the staffs as early as the run allows.',
  'Fill the soul chests during setup instead of leaving all four until the end.',
  'Save a zombie when you need uninterrupted time for staff puzzles or map setup.',
];

export default originsGuide;
