export const originsLightningPianoCode = [
  [1, 3, 6],
  [3, 5, 7],
  [2, 4, 6],
];

export const originsLightningSwitches = [
  {
    id: 'spawn',
    shortLabel: 'Spawn',
    location: 'Spawn / Generator 1 stairs',
    direction: 'Left',
    arrow: '←',
    clock: '9 o’clock',
    turnsFromUntouched: 2,
    speedrunOrder: 1,
    speedrunNote: 'Set this immediately at the start of the run; the advanced route turns it while leaving spawn.',
  },
  {
    id: 'gen-2',
    shortLabel: 'Gen 2',
    location: 'Tank Station / Generator 2 back door',
    direction: 'Down',
    arrow: '↓',
    clock: '6 o’clock',
    turnsFromUntouched: 3,
    speedrunOrder: 2,
    speedrunNote: 'Set it while clearing Tank Station for the Ice disc / G-Strike tablet route.',
  },
  {
    id: 'gen-5',
    shortLabel: 'Gen 5',
    location: 'Generator 5, opposite Stamin-Up',
    direction: 'Down',
    arrow: '↓',
    clock: '6 o’clock',
    turnsFromUntouched: 3,
    speedrunOrder: 3,
    speedrunNote: 'Set it on the Gen 5 pass so the later Lightning upgrade does not cost an extra detour.',
  },
  {
    id: 'gen-4',
    shortLabel: 'Gen 4',
    location: 'Generator 4 / Wind Tunnel entrance',
    direction: 'Up',
    arrow: '↑',
    clock: '12 o’clock',
    turnsFromUntouched: 2,
    speedrunOrder: 4,
    speedrunNote: 'Set it when routing through Gen 4 for Wind / Lightning progression.',
  },
  {
    id: 'church-basement',
    shortLabel: 'Church Lower',
    location: 'Church basement, behind the tank',
    direction: 'Right',
    arrow: '→',
    clock: '3 o’clock',
    turnsFromUntouched: 2,
    speedrunOrder: 5,
    speedrunNote: 'Set the lower-church dial while passing through the tank area.',
  },
  {
    id: 'church-upstairs',
    shortLabel: 'Church Upper',
    location: 'Church upstairs, by the repairable window',
    direction: 'Up',
    arrow: '↑',
    clock: '12 o’clock',
    turnsFromUntouched: 1,
    speedrunOrder: 6,
    speedrunNote: 'The advanced route handles this during the church setup before leaving the area.',
  },
  {
    id: 'excavation',
    shortLabel: 'Excavation',
    location: 'Excavation / mound wall on the church-side path',
    direction: 'Up',
    arrow: '↑',
    clock: '12 o’clock',
    turnsFromUntouched: 3,
    speedrunOrder: 7,
    speedrunNote: 'Finish this on a mound pass; it is the seventh required dial.',
  },
];

export const originsLightningSwitchRoute = [...originsLightningSwitches]
  .sort((a, b) => a.speedrunOrder - b.speedrunOrder);

export const originsLightningSwitchVerification = {
  game: 'Black Ops III · Zombies Chronicles · Origins',
  rule: 'Direction means the side the protruding switch handle / knob points toward.',
  clickRule: 'Turn counts assume the switch is still in its untouched match-start position. If you already interacted with it, ignore the count and use the final direction.',
  note: 'The seven dials can be pre-set before the Lightning Staff piano step. They only begin sparking once that upgrade step is active; when active, a correctly positioned dial stops sparking.',
};

export const originsExcavationRingReference = {
  goal: 'Turn all four Excavation ring lights purple, then shoot the purple orb below the rings with the Lightning Staff.',
  levers: [
    'Coming down toward the staff chamber, take the right-side route toward Mule Kick: that lever controls the top ring.',
    'The lever to the left of the large staircase down into the staff chamber controls the second ring.',
    'The two levers on the wooden platforms directly above Mule Kick control the bottom two rings.',
    'The wooden-platform levers can be reached quickly from the Mule Kick shelf by jumping and interacting instead of running the full scaffolding loop.',
  ],
};
