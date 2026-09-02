const apothiconSteps = [
  {
    title: 'Tombstones + Corruption Engines',
    detail: 'Shoot the four spawn tombstones in positional order (2-3-1-4). A sound cue and small fire flash confirm the code. Then activate all four Corruption Engines so the Nacht console can open the route into the Giant Apothicon.',
    bullets: [
      'Tombstone code: 2 → 3 → 1 → 4.',
      'Activate the Corruption Engines at Spawn, Der Eisendrache, Verrückt, and Mob of the Dead.',
      'Use the Nacht der Untoten console as the Giant Apothicon passes to open the Pack-a-Punch route.',
      'Inside the Apothicon, shoot the three yellow sacs holding Pack-a-Punch so the machine drops.',
    ],
  },
  {
    title: 'Keeper Protector + Required Weapons',
    detail: 'Collect the three Keeper Protector parts and make sure the run has Little Arnies plus the Apothicon Servant. Build the Keeper at Verrückt, Kino, or Der Eisendrache for 5,000 points when the ritual step is ready.',
    bullets: [
      'Keeper parts: gemstone, Keeper head, and flag.',
      'Little Arnies are required for the nine-hole step.',
      'The upgraded Apothicon Servant is required later for the bone step.',
      'A strong Pack-a-Punched bullet weapon is useful for the bone rocks and final fight.',
    ],
  },
  {
    title: 'Upgrade the Apothicon Servant',
    detail: 'Shoot all five blue rocks in the sky with the Apothicon Servant, then Pack-a-Punch it inside the Giant Apothicon for 5,000 points.',
    bullets: [
      'The transcript demonstrates shots from Spawn, Der Eisendrache, Shangri-La/Verrückt, Mob of the Dead, and Nacht.',
      'All five rocks must be hit with the Apothicon Servant before the weapon can be upgraded.',
      'The Thunder Gun is optional but strongly recommended for the later Margwa phases.',
    ],
  },
  {
    title: 'Audio Reel 1 — Keeper Ritual',
    detail: 'Find the triangular ritual rock on one of the three possible jump pads, summon the Keeper Protector, and bring it close enough to begin the ritual. Protect it for three full minutes.',
    bullets: [
      'Triangle-rock jump pads: Shangri-La, Mob of the Dead, or Verrückt.',
      'The Keeper starts the ritual by standing close to the triangular rock.',
      'Protect the Keeper for three full minutes.',
      'Pick up the dropped reel and place it in the Nacht der Untoten radio.',
    ],
  },
  {
    title: 'Audio Reel 2 — Little Arnie Holes',
    detail: 'Inside the Giant Apothicon, throw Little Arnies into all nine wall holes without repeating one. Every set of three holes spawns three Margwas.',
    bullets: [
      'Complete three sets of three holes.',
      'Kill the Margwas after each set; use Max Ammo or GobbleGums if you run out of Arnies.',
      'After all nine Margwas are cleared, collect the reel from the bridge inside the Apothicon.',
      'Place this reel in the radio on the Kino der Toten stage.',
    ],
  },
  {
    title: 'Audio Reel 3 — Six Bones',
    detail: 'Reveal six hidden bones with a Pack-a-Punched bullet weapon, then absorb each bone with the upgraded Apothicon Servant. Finish the body sequence at Nacht.',
    bullets: [
      'Bone areas: Shangri-La, Spawn, Origins, Verrückt, Der Eisendrache, and Nacht.',
      'After all six bones are collected, they appear on the upper floor of Nacht.',
      'Shoot the collected bones with the upgraded Apothicon Servant, then shoot the spawned body as well.',
      'Collect the reel and place it in the radio at the top of the Origins mound.',
    ],
  },
  {
    title: 'Materialize S.O.P.H.I.A.',
    detail: 'Use the laser turret at each Corruption Engine to hit the blue rock behind its teleporting rift. Once all four are complete, return to Nacht and activate S.O.P.H.I.A.',
    bullets: [
      'You need one successful turret shot from each of the four Corruption Engine areas.',
      'The turret aim can be picky; the game kicks you off when the shot registers.',
      'After the fourth hit, activate S.O.P.H.I.A. on Nacht’s upper floor.',
    ],
  },
  {
    title: 'Kronorium + Four Eggs',
    detail: 'Follow S.O.P.H.I.A. to the Kino teleporter, enter Samantha’s room, collect the book from the bed, and place it on the Kino altar. Four eggs now spawn around the map.',
    bullets: [
      'One egg belongs to each major map region.',
      'Take an egg into the center of the Giant Apothicon and collect about 10 zombie souls.',
      'A charged egg becomes a Gateworm.',
      'Repeat until all four eggs have been charged.',
    ],
  },
  {
    title: 'Runes of Creation',
    detail: 'Use each Gateworm to locate its hidden Rune of Creation. The correct placement is identified by a beeping sound. Collect all four runes before entering the symbol room.',
    bullets: [
      'Each major region has three possible rune-placement spots.',
      'Listen for the beeping rather than guessing the placement.',
      'After all four runes are collected, head to Kino and stand on the symbols in the Widow’s Wine room.',
    ],
  },
  {
    title: 'Symbol Room + Summoning Key',
    detail: 'Activate the book in the boss room, memorize the four-symbol order it shows, enter that same order at the back of the room, then survive four sets of two Margwas.',
    bullets: [
      'The symbol order changes every game.',
      'Use the four symbols shown in your inventory/menu as the reference set.',
      'After entering the correct sequence, drop to the center arena.',
      'Clear four Margwa waves with two Margwas per wave to spawn the Summoning Key.',
    ],
  },
  {
    title: 'Seven Summoning Key Throws',
    detail: 'Return to the map and hit all seven required objects with the Summoning Key.',
    bullets: [
      'Kino: chandelier.',
      'Der Eisendrache: clock near the Corruption Engine.',
      'Shangri-La: crystal at the top of the stairs.',
      'Origins: tombstone at the top of the mound.',
      'Mob of the Dead: back of the cell.',
      'Verrückt: fountain.',
      'Nacht der Untoten: red barrel.',
      'When taking the teleporter toward Nacht, melee during the transition to avoid the Summoning Key-loss glitch described in the walkthrough.',
    ],
  },
  {
    title: 'Final Boss — Shadowman',
    detail: 'Return through the Kino teleporter, charge one of the four altars with zombie kills, pick up the Summoning Key, throw it through the ghost of S.O.P.H.I.A., then damage the Shadowman until he is pushed into the Apothicon’s mouth.',
    bullets: [
      'Interact with an altar and kill roughly 10 zombies to charge it.',
      'A powerful bullet weapon or Death Machine makes the Shadowman damage phase easier.',
      'Throw the charged Summoning Key through ghost S.O.P.H.I.A.',
      'Shoot the Shadowman until he is forced into the Apothicon’s mouth.',
      'Interact with the book to trigger the ending.',
    ],
  },
];

export default apothiconSteps;
