// Kino der Toten side Easter Eggs (BO1). The single source for the Kino page's tracked checklist.
// Rooms and spots are unchanged from the original notes: four possible teleport rooms, three reels per match.
export const kinoReelRooms = [
  { k: 'Samantha’s Room (intact)', v: 'Table, bed, or against the rocking chair' },
  { k: 'Samantha’s Room (destroyed)', v: 'Bed, overturned table, or near the window' },
  { k: 'Dentist’s Office', v: 'Cart next to the chair, or the counters' },
  { k: 'Conference Room', v: 'On the TV, under the projector, or on the table' },
];

export const kinoSteps = [
  {
    id: 'reels',
    title: 'Three film reels',
    goal: 'After each teleport from Pack-a-Punch, check the room for a reel. Four possible rooms; three reels spawn per match.',
    refs: [{ type: 'facts', label: 'Teleport rooms', items: kinoReelRooms }],
    tasks: [
      { id: 'r1', label: 'Reel 1' },
      { id: 'r2', label: 'Reel 2' },
      { id: 'r3', label: 'Reel 3' },
      { id: 'film', label: 'Film played', hint: 'Back at the Pack-a-Punch projector, press Use' },
      { id: 'rocket', label: 'Rocket launched', hint: 'After the next teleport it appears in the Conference Room — shoot it' },
    ],
  },
  {
    id: 'radios',
    title: 'Two hidden radios',
    goal: 'Shoot or throw an explosive at each radio to activate it.',
    tasks: [
      { id: 'chandelier', label: 'Chandelier', hint: 'Tucked inside the theater’s chandelier' },
      { id: 'tower', label: 'Tower', hint: 'Top of the tower seen from the alley by Double Tap Root Beer (interact)' },
    ],
  },
];

// Listing entries (the side-EE index counts these).
export default kinoSteps.map(({ id, title }) => ({ id: `kino-${id}`, title }));
