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
    speedrunOrder: 4,
    speedrunNote: 'Set it when routing through Gen 4 for Wind / Lightning progression.',
  },
  {
    id: 'church-basement',
    shortLabel: 'Church ↓',
    location: 'Church basement, behind the tank',
    direction: 'Right',
    arrow: '→',
    clock: '3 o’clock',
    speedrunOrder: 5,
    speedrunNote: 'Set the lower-church dial while passing through the tank area.',
  },
  {
    id: 'church-upstairs',
    shortLabel: 'Church ↑',
    location: 'Church upstairs',
    direction: 'Up',
    arrow: '↑',
    clock: '12 o’clock',
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
    speedrunOrder: 7,
    speedrunNote: 'Finish this on a mound pass; it is the seventh required dial.',
  },
];

export const originsLightningSwitchRoute = [...originsLightningSwitches]
  .sort((a, b) => a.speedrunOrder - b.speedrunOrder);

export const originsLightningSwitchVerification = {
  game: 'Black Ops III · Zombies Chronicles · Origins',
  rule: 'Direction means the side the protruding switch handle / knob points toward.',
  note: 'These seven dials can be pre-set before the Lightning Staff piano step; once the upgrade step is active, a correctly positioned dial stops sparking.',
};
