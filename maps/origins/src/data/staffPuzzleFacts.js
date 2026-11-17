/*
 * Origins staff puzzle facts as structured, design-neutral data, with what was checked and against what
 * (CHARLIE, 2026-11-17; details in docs/DESIGN-CONTENT-INPUT.md). The page data stays in originsStaffPages.js;
 * this file is the verification layer any visual direction can read. Sources: S3 = codzombiesguides.com Origins,
 * S4 = Bryen's Drive heritage notes (2026-11-05), repo chart = the webp in ../assets/images/ (viewed by eye).
 * `randomPerGame`: true = the game changes it every match, false = fixed, null = no source says.
 */
export const staffPuzzleFacts = {
  ice: {
    puzzle: 'Match each floating pillar symbol to its ceiling tile, then shoot the tile.',
    randomPerGame: true,
    chart: 'ice_staff_code.webp: 12 pairs, dot pattern → ceiling stone symbol',
    status: 'The idea matches S3. The 12 pairings are image-only in every source: not checkable against text.',
    open: ['Compare the 12 chart pairs with Drive heritage photo 1000004815 (OCR returned nothing).'],
    upgradeSpots: {
      steps: 'Freeze three gravestones with the Ice Staff, then break each with a bullet weapon.',
      verifiedPlaces: ['Near Generator 2 outside the map, next to the destroyed Giant / fallen robot (S3 + S4 agree)'],
      conflictingPlaces: ['Near the footprint opposite the KN-44 wall buy (S3 only)', 'Right of the KN-44 wall buy (S3 only)', 'Above the Pack-a-Punch soul box and Generator 4 soul box (S4 only)'],
    },
  },
  fire: {
    puzzle: 'Four lit symbols upstairs in the church become four numbered torches in the basement; shoot them with the Fire Staff quickly (they stay lit briefly), any order.',
    randomPerGame: null,
    chart: 'fire_staff_code.webp: 11, 5, 9, 7, 6, 3, blood',
    status: 'Chart verified: its seven numbers 11-5-9-7-6-3-4 match the heritage decode list exactly (blood = 4, shot first in S4). 4 always being one of the four is S4 only.',
    open: [],
  },
  wind: {
    puzzle: 'Shoot the four ceiling rings with the Wind Staff until their symbols match the code.',
    randomPerGame: null,
    chart: 'wind_staff_code.webp: outer to inner, four symbols',
    status: 'Rings and "match the symbols" agree with S3; the symbols are the same set as the Ice tiles (S3 forum). Whether the order changes per game is stated nowhere; no heritage note covers it.',
    open: ['Confirm whether the Wind code is fixed or random.'],
    upgradeSpots: {
      steps: 'Turn all three smoking stone balls so their smoke points at the Excavation Site.',
      verifiedPlaces: ['Near Generator 4, between the generator and the Wind Tunnel', 'Outside the window left of Stamin-Up (Generator 5)', 'Outside the map, left of the tank path when returning to the church (tank entrance)'],
      conflictingPlaces: [],
    },
  },
  lightning: {
    puzzle: 'Shoot the bottom-row purple triangles (numbered 1-7, left to right) in three chords.',
    randomPerGame: false,
    chords: [[1, 3, 6], [3, 5, 7], [2, 4, 6]],
    chart: 'lightning_staff_code.webp: first 1-3-6, second 3-5-7, third 2-4-6',
    status: 'Verified three ways: chart image, S3, S4. Wait for sparks to fade between chords; a mistake needs three random top-row shots, then resume.',
    open: [],
    switches: 'Seven dial panels (Spawn, Generator 2 back door, Generator 5, Generator 4, church basement behind the tank, church upstairs, Excavation wall); same seven places in S4. Dial positions are image-only in S3 and come from the repo table shared/data/originsLightning.js.',
  },
};
export const STAFF_FACT_IDS = Object.keys(staffPuzzleFacts);
