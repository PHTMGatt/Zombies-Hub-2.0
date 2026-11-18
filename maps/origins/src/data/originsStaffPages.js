import { originsLightningPianoCode } from '../../../../shared/data/originsLightning';
import FireCode from '../assets/images/fire_staff_code.webp';
import IceCode from '../assets/images/ice_staff_code.webp';
import WindCode from '../assets/images/wind_staff_code.webp';
import LightningCode from '../assets/images/lightning_staff_code.webp';

/*
 * The four Origins staff pages as data: Build → Puzzle → Upgrade.
 * Every line is copied verbatim from the staff pages as they were before the field-sheet redesign
 * (scripts/fixtures/origins-staff-pages.baseline.json checks it); only labels lose their trailing colon.
 * 2026-11-15: the lines the accuracy audit found wrong or missing were corrected (claude-command-center
 * docs/research/zombies/origins-revelations-audit.md, Origins #1-#3, #8, #9, #11); each old line is in
 * scripts/fixtures/approved-removals.json and the baseline now holds the corrected wording.
 * Chart alt text describes each chart's structure and never transcribes it: the image is the reference.
 *
 * Upgrade steps are strings, or { label, text } where the old page led the line with a bold label.
 * `anyOrder` holds steps the player may do in any order (shown unnumbered, labelled "Any order").
 * `ring` is the colour all four Excavation rings are turned to before shooting that staff's orb.
 */
// Audit Origins #1 (Wiki Gramophone + Accelerated Ideas): every staff needs the Gramophone and the black
// record before its crystal and pedestal can be reached, and no page said where either one is.
const GRAMOPHONE = [
  { k: 'Gramophone', v: 'On the floor inside the Excavation, next to a table.' },
  { k: 'Black Record', v: 'Around the outside of the Excavation: by the Excavation sign, in the wheelbarrow by Pack-a-Punch, or in the trench by the church debris. Play it on the table inside the Excavation to open the stairs down to the staff pedestals.' },
];

const originsStaffPages = {
  ice: {
    id: 'ice',
    name: 'Ice',
    ring: { word: 'BLUE', orb: 'blue' },
    build: [
      { k: 'Part 1', v: 'Dig snowy dig sites in the spawn / starting trenches.' },
      { k: 'Part 2', v: 'Dig snowy dig sites around the middle / Excavation area.' },
      { k: 'Part 3', v: 'Dig snowy dig sites around the Church area.' },
      { k: 'Blue Record', v: 'Check the three spawn points inside the Tank Station by Generator 2.' },
      ...GRAMOPHONE,
      { k: 'Crystal', v: 'Take the blue record and Gramophone to the Ice Tunnel by Generator 6, enter the Crazy Place, and collect the blue crystal.' },
      { k: 'Build', v: 'Use the blue pedestal beneath the Excavation Site.' },
    ],
    puzzle: {
      chart: { src: IceCode, width: 1600, height: 1040, alt: 'Ice Staff code: blue-dot pillar symbols and their matching ceiling stones' },
      steps: [
        'Return through the Ice Tunnel and enter the Crazy Place with the Ice Staff.',
        'Use the code chart to match the blue-dot pillar symbol to the correct ceiling stone.',
        'Shoot each matching ceiling stone with the Ice Staff until the puzzle completes.',
      ],
      // User-provided, 2026-10-31: the displayed pillar sequence is game-dependent.
      note: 'The pillar order is different every game. Follow the order the game shows, and use the chart to turn each dot pattern into its ceiling stone.',
    },
    upgrade: {
      // User-confirmed, 2026-10-31: the three gravestones can be done in any order.
      anyOrder: {
        label: 'Any order',
        text: 'Find all three gravestones on the main map, freeze each one with the Ice Staff, then shoot the frozen stone with a normal bullet weapon to break it.',
      },
      steps: [
        'At the Excavation Site, use the four levers to align every ring to BLUE.',
        'Go below the rings and shoot the blue orb with the Ice Staff.',
        'Return to the Crazy Place and place the Ice Staff on the blue pedestal.',
        'Kill zombies around the pedestal until the staff is fully charged, then pick it up.',
      ],
    },
  },

  fire: {
    id: 'fire',
    name: 'Fire',
    ring: { word: 'RED', orb: 'red' },
    build: [
      // Audit Origins #8: the box opens when Generator 6 is powered; the six-generator challenge pays a Max Ammo.
      { k: 'Part 1', v: 'Power Generator 6, then take the part from the reward chest beside it.' },
      { k: 'Part 2', v: 'Kill the first Panzer Soldat (normally Round 8) and pick up the part it drops.' },
      { k: 'Part 3', v: 'After the church path is open, shoot down the orange glowing plane and collect the fallen part near the Excavation mound.' },
      { k: 'Red Record', v: 'Check its three spawn points in the Church / Generator 6 area.' },
      ...GRAMOPHONE,
      { k: 'Crystal', v: 'Take the red record and Gramophone to the Fire Tunnel near spawn, enter the Crazy Place, and collect the red crystal.' },
      { k: 'Build', v: 'Use the red pedestal beneath the Excavation Site.' },
    ],
    puzzle: {
      chart: { src: FireCode, width: 1600, height: 581, alt: 'Fire Staff code: cauldron symbols and their Church torch numbers' },
      // Audit Origins #2 and #3: only Fire Staff kills count; the lit symbols are upstairs in the Church and
      // the torches in its basement. "before the puzzle resets" is kept as it was: the audit could neither
      // confirm nor rule out a reset.
      steps: [
        'In the Crazy Place, kill about 30 zombies with the Fire Staff while they stand on the metal grates, until all four cauldrons are lit.',
        'Go upstairs in the Church: four symbols are lit on the far wall. Turn each into a number with the chart.',
        'In the Church basement (where the tank parks), light the four matching numbered torches with the Fire Staff before the puzzle resets. 4 is always one of them; its torch has a bloodstain instead of a chalk number.',
      ],
      // Grey-83: multiple independent guides agree the four torches may be lit in any order.
      // Keep this as a quick-reference note; don't alter verified baseline quest text.
      note: 'ANY ORDER: light the four indicated torches quickly. Blood-marked #4 is included, but does not have to be first.',
    },
    upgrade: {
      steps: [
        'At the Excavation Site, use the four levers to align every ring to RED.',
        'Go below the rings and shoot the red orb with the Fire Staff.',
        'Return to the Crazy Place and place the Fire Staff on the red pedestal.',
        'Kill zombies around the pedestal until the staff is fully charged, then pick it up.',
      ],
    },
  },

  wind: {
    id: 'wind',
    name: 'Wind',
    ring: { word: 'YELLOW', orb: 'yellow' },
    build: [
      { k: 'Part 1', v: 'Enter Thor, the robot that walks through the spawn-side trenches.' },
      { k: 'Part 2', v: 'Enter Odin, the robot that crosses the middle / Excavation area.' },
      { k: 'Part 3', v: 'Enter Freya, the robot that walks through the Church area.' },
      { k: 'Yellow Record', v: 'Check the Generator 5 area, including Stamin-Up and the Lightning Tunnel entrance.' },
      ...GRAMOPHONE,
      { k: 'Crystal', v: 'Take the yellow record and Gramophone to the Wind Tunnel near Generator 4, enter the Crazy Place, and collect the yellow crystal.' },
      { k: 'Build', v: 'Use the yellow pedestal beneath the Excavation Site.' },
    ],
    puzzle: {
      chart: { src: WindCode, width: 1600, height: 1040, alt: 'Wind Staff code: outer to inner ceiling ring symbols' },
      steps: [
        'In the Crazy Place, shoot the four ceiling rings with the Wind Staff until the symbols match the Wind puzzle code.',
      ],
    },
    upgrade: {
      steps: [
        // Audit Origins #9: the map key calls them smoke balls (Wiki: "three smoking stone balls").
        'Return to the main map and use the Wind Staff on all three smoking stone balls so their smoke points toward the Excavation Site.',
        'At the Excavation Site, use the four levers to align every ring to YELLOW.',
        'Go below the rings and shoot the yellow orb with the Wind Staff.',
        'Return to the Crazy Place and place the Wind Staff on the yellow pedestal.',
        'Kill zombies around the pedestal until the staff is fully charged, then pick it up.',
      ],
    },
  },

  lightning: {
    id: 'lightning',
    name: 'Lightning',
    ring: { word: 'PURPLE', orb: 'purple' },
    build: [
      // Audit Origins #11: one wording with the map pin (originsPlaces.js), the Wiki's.
      { k: 'Part 1', v: 'Tank Church → Gen 2, jump right onto the cut-off wooden stairs before the trench to Generator 2.' },
      { k: 'Part 2', v: 'Tank Gen 2 → Church, jump left onto Excavation scaffolding.' },
      { k: 'Part 3', v: 'Tank Gen 2 → Church, jump right just before Church.' },
      { k: 'Purple Record', v: 'Generator 4 / Jug / Wind Tunnel area.' },
      ...GRAMOPHONE,
      { k: 'Crystal', v: 'Open the Lightning Tunnel beside Generator 5 with the Gramophone + purple record, then grab the purple crystal in the Crazy Place.' },
      { k: 'Build', v: 'Under Excavation.' },
    ],
    puzzle: {
      chart: { src: LightningCode, width: 1600, height: 1040, alt: 'Lightning Staff piano chart: first, second and third chords' },
      pianoCode: originsLightningPianoCode.map((chord) => chord.join('-')),
      steps: ['Play the three piano chords shown in the piano code.', 'Set the seven switches using the dials below.'],
    },
    upgrade: {
      steps: [
        { label: 'Excavation', text: 'line all four rings purple → shoot the orb with the Lightning Staff.' },
        'Place the staff on the purple Crazy Place pedestal → kill zombies to fill it with souls.',
      ],
    },
  },
};

export const STAFF_ORDER = ['ice', 'fire', 'wind', 'lightning'];
export default originsStaffPages;
