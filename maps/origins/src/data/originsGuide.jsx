import React from 'react';
import LightningSwitchBoard from '../components/LightningSwitchBoard';
import { originsExcavationRingReference } from '../../../../shared/data/originsLightning';
import FireCode from '../assets/images/fire_staff_code.webp';
import IceCode from '../assets/images/ice_staff_code.webp';
import WindCode from '../assets/images/wind_staff_code.webp';
import LightningCode from '../assets/images/lightning_staff_code.webp';

/*
 * Little Lost Girl as guide steps. Every fact here comes from the existing Origins guide, its setup
 * reference and tips, and the four staff pages; this file only reorganises it into
 * what / quick reference / how / problems so Quick and Full mode can share one progression.
 */
const TONE = {
  ice: '#78e8e1',
  fire: '#ff7844',
  wind: '#ffe657',
  lightning: '#d8a8ff',
};

const STAFF_LINKS = [
  { to: '/maps/origins/ice-staff', label: 'Ice Staff', tone: TONE.ice },
  { to: '/maps/origins/fire-staff', label: 'Fire Staff', tone: TONE.fire },
  { to: '/maps/origins/wind-staff', label: 'Wind Staff', tone: TONE.wind },
  { to: '/maps/origins/lightning-staff', label: 'Lightning Staff', tone: TONE.lightning },
];

const staffTasks = (verb) => [
  { id: 'ice', label: `Ice ${verb}`, tone: TONE.ice },
  { id: 'fire', label: `Fire ${verb}`, tone: TONE.fire },
  { id: 'wind', label: `Wind ${verb}`, tone: TONE.wind },
  { id: 'lightning', label: `Lightning ${verb}`, tone: TONE.lightning },
];

const ringProblem = `Can't tell which lever turns which Excavation ring? ${originsExcavationRingReference.levers.slice(0, 3).join(' ')}`;

const originsGuide = [
  {
    id: 'build-staffs',
    title: 'Build the four staffs',
    goal: 'Three parts + the coloured record + the crystal for each staff, then build under Excavation.',
    refs: [
      {
        type: 'tabs',
        label: 'Staff',
        tabs: [
          {
            id: 'ice', label: 'Ice', tone: TONE.ice,
            refs: [{ type: 'facts', items: [
              { k: 'Parts', v: 'Snowy dig sites — spawn trenches, Excavation, Church' },
              { k: 'Blue record', v: 'Tank Station by Gen 2 (3 spawns)' },
              { k: 'Crystal', v: 'Ice Tunnel · Gen 6' },
            ] }],
          },
          {
            id: 'fire', label: 'Fire', tone: TONE.fire,
            refs: [{ type: 'facts', items: [
              { k: 'Part 1', v: 'Gen 6 reward chest (all six generators on)' },
              { k: 'Part 2', v: 'First Panzer drop (normally Round 8)' },
              { k: 'Part 3', v: 'Shoot the orange plane → part lands near the mound' },
              { k: 'Red record', v: 'Church / Gen 6 (3 spawns)' },
              { k: 'Crystal', v: 'Fire Tunnel · near spawn' },
            ] }],
          },
          {
            id: 'wind', label: 'Wind', tone: TONE.wind,
            refs: [{ type: 'facts', items: [
              { k: 'Parts', v: 'Inside the robots — Thor (spawn), Odin (middle), Freya (Church)' },
              { k: 'Yellow record', v: 'Gen 5 · Stamin-Up · Lightning Tunnel entrance' },
              { k: 'Crystal', v: 'Wind Tunnel · Gen 4' },
            ] }],
          },
          {
            id: 'lightning', label: 'Lightning', tone: TONE.lightning,
            refs: [{ type: 'facts', items: [
              { k: 'Part 1', v: 'Tank Church → Gen 2: jump right after Gen 4' },
              { k: 'Part 2', v: 'Tank Gen 2 → Church: jump left onto Excavation scaffolding' },
              { k: 'Part 3', v: 'Tank Gen 2 → Church: jump right just before Church' },
              { k: 'Purple record', v: 'Gen 4 / Jug / Wind Tunnel area' },
              { k: 'Crystal', v: 'Lightning Tunnel · Gen 5' },
            ] }],
          },
        ],
      },
      { type: 'facts', items: [{ k: 'Build', v: 'Matching coloured pedestal beneath the Excavation Site' }] },
    ],
    tasks: staffTasks('built'),
    how: [
      'Collect the three parts for a staff (each staff hides them differently — see the staff tabs).',
      'Find that staff\'s coloured record, then carry it with the Gramophone to the matching tunnel.',
      'Play the record to open the tunnel, enter the Crazy Place, and take the matching crystal.',
      'Build the staff on its coloured pedestal beneath the Excavation Site.',
    ],
    problems: [
      'Build and upgrade the staffs as early as the run allows.',
      'Save a zombie when you need uninterrupted time for staff puzzles or map setup.',
    ],
    links: STAFF_LINKS,
  },
  {
    id: 'upgrade-staffs',
    title: 'Upgrade the staffs',
    goal: 'Solve each staff puzzle, line the Excavation rings to its colour, shoot the orb, charge it in the Crazy Place.',
    refs: [
      {
        type: 'tabs',
        label: 'Staff',
        tabs: [
          {
            id: 'ice', label: 'Ice', tone: TONE.ice,
            refs: [
              { type: 'image', src: IceCode, alt: 'Ice Staff code: blue-dot pillar symbols and their matching ceiling stones', width: 1600, height: 1040 },
              { type: 'list', items: [
                'Crazy Place: match blue-dot pillar → ceiling stone, shoot it',
                'Freeze 3 gravestones → shatter with bullets',
                'Excavation rings all BLUE → shoot the orb',
                'Blue pedestal → kill zombies to charge',
              ] },
            ],
          },
          {
            id: 'fire', label: 'Fire', tone: TONE.fire,
            refs: [
              { type: 'image', src: FireCode, alt: 'Fire Staff code: cauldron symbols and their Church torch numbers', width: 1600, height: 581 },
              { type: 'list', items: [
                'Kill zombies on the Crazy Place grates → light 4 cauldrons',
                'Read the symbols → shoot those numbered Church torches',
                'Excavation rings all RED → shoot the orb',
                'Red pedestal → kill zombies to charge',
              ] },
            ],
          },
          {
            id: 'wind', label: 'Wind', tone: TONE.wind,
            refs: [
              { type: 'image', src: WindCode, alt: 'Wind Staff code: outer to inner ceiling ring symbols', width: 1600, height: 1040 },
              { type: 'list', items: [
                'Crazy Place: shoot the 4 ceiling rings to match the code',
                'Blow all 3 chimneys\' smoke toward Excavation',
                'Excavation rings all YELLOW → shoot the orb',
                'Yellow pedestal → kill zombies to charge',
              ] },
            ],
          },
          {
            id: 'lightning', label: 'Lightning', tone: TONE.lightning,
            refs: [
              { type: 'sequence', label: 'Piano code', items: ['1 · 3 · 6', '3 · 5 · 7', '2 · 4 · 6'], },
              { type: 'image', src: LightningCode, alt: 'Lightning Staff piano chart: first, second and third chords', width: 1600, height: 1040 },
              { type: 'custom', key: 'lightning-switches', render: () => <LightningSwitchBoard /> },
              { type: 'list', items: [
                'Play the 3 chords, set the 7 switches',
                'Excavation rings all PURPLE → shoot the orb',
                'Purple pedestal → kill zombies to charge',
              ] },
            ],
          },
        ],
      },
    ],
    tasks: staffTasks('upgraded'),
    how: [
      'Solve the staff\'s own puzzle using its code chart (each tab shows the chart and the extra steps).',
      'At the Excavation Site, use the four levers to align every ring to the staff\'s colour.',
      'Go below the rings and shoot the orb of that colour with the staff.',
      'Return to the Crazy Place, place the staff on its coloured pedestal, and kill zombies around it until it is fully charged.',
    ],
    problems: [
      ringProblem,
      'Lightning: switches can be set before the piano step; once that step is active, a correct switch stops sparking. The current remembers.',
      'Use the staff pages for full-size puzzle images instead of memorising every code.',
    ],
    links: STAFF_LINKS,
  },
  {
    id: 'secure-keys',
    title: 'Secure the keys',
    goal: 'Put each upgraded staff in its robot, and Fire in the mound pedestal.',
    refs: [
      { type: 'facts', label: 'Staff → place', items: [
        { k: 'Wind', v: 'Odin · middle robot', tone: TONE.wind },
        { k: 'Ice', v: 'Freya · Church / Gen 6 robot', tone: TONE.ice },
        { k: 'Lightning', v: 'Thor · spawn / Gen 1–3 robot', tone: TONE.lightning },
        { k: 'Fire', v: 'Pedestal at the bottom of the mound', tone: TONE.fire },
      ] },
    ],
    tasks: [
      { id: 'wind', label: 'Wind → Odin', tone: TONE.wind },
      { id: 'ice', label: 'Ice → Freya', tone: TONE.ice },
      { id: 'lightning', label: 'Lightning → Thor', tone: TONE.lightning },
      { id: 'fire', label: 'Fire → mound', tone: TONE.fire },
    ],
    how: [
      'Place Wind in Odin (middle robot), Ice in Freya (church / Gen 6 robot), and Lightning in Thor (spawn / Gen 1–3 robot).',
      'Place Fire in the pedestal at the bottom of the mound.',
    ],
  },
  {
    id: 'thunder-fists',
    title: 'Thunder Fists',
    goal: 'Fill the four soul chests in the giant robot footprints, then take One Inch Punch from the reward chest.',
    refs: [
      { type: 'chips', label: 'Soul chests', items: ['Gen 5 footprint', 'Mound footprint', 'Gen 6 footprint', 'Footprint behind Juggernog'] },
    ],
    tasks: [
      { id: 'gen5', label: 'Gen 5 chest' },
      { id: 'mound', label: 'Mound chest' },
      { id: 'gen6', label: 'Gen 6 chest' },
      { id: 'jug', label: 'Juggernog chest' },
    ],
    how: [
      'Fill all four soul chests in the giant robot footprints.',
      'Collect the One Inch Punch / Thunder Fists from the reward chest.',
    ],
    problems: ['Fill the soul chests during setup instead of leaving all four until the end.'],
  },
  {
    id: 'g-strike',
    title: 'G-Strike',
    goal: 'Purify the stone tablet with melee kills in the church, bring it back without touching mud.',
    refs: [
      { type: 'sequence', items: ['Tablet', 'Church melee kills', 'Return — no mud', 'G-Strikes'] },
    ],
    critical: ['Do not step in mud on the way back with the tablet.'],
    how: [
      'Complete the stone-tablet melee purification step in the church.',
      'Return the tablet without stepping in mud to finish the G-Strike setup.',
      'Have the G-Strike grenades before Rain Fire.',
    ],
  },
  {
    id: 'rain-fire',
    title: 'Rain Fire',
    goal: 'Press the button inside the middle robot, then G-Strike the seal by Generator 5 straight away.',
    refs: [
      { type: 'sequence', items: ['Middle robot · open foot', 'Red button', 'G-Strike the seal at Gen 5'] },
    ],
    critical: ['Be at Generator 5 the moment you press the button — the seal must be active when the G-Strike lands.'],
    how: [
      'Enter the middle robot through an open foot and press the red button.',
      'Immediately throw a G-Strike onto the seal by Generator 5.',
    ],
    problems: ['Have the Maxis Drone built and ready before you attempt Rain Fire — the next step needs it at once.'],
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
    how: [
      'Enter Zombie Blood and shoot down the glowing red plane.',
      'Locate and kill the invisible, clockwise-running pilot while still in Zombie Blood.',
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
    how: ['Return all four upgraded staffs to their Crazy Place holders and earn the required 100 kills without removing the staffs.'],
  },
  {
    id: 'freedom',
    title: 'Freedom',
    goal: 'Pick up the Maxis Drone and release it into the Crazy Place beam.',
    refs: [
      { type: 'sequence', items: ['Pick up Maxis Drone', 'Release into the beam', 'Ending'] },
    ],
    how: ['Pick up the Maxis Drone, release it into the beam in the Crazy Place, and trigger the ending.'],
    problems: [
      'Going for the ending cutscene? Keep all generators active when you recover the upgraded Maxis Drone from the pilot sequence.',
      'Marking this final step done unlocks Speedrun mode in the depth switch.',
    ],
  },
];

export default originsGuide;
