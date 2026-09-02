export const zetsGear = [
  {
    name: 'Zombie Shield',
    type: 'Required quest gear',
    parts: [
      'Lab A: one shield piece spawns on the pillars directly underneath Lab A, around the Kuda wall-buy area.',
      'Lab B: one shield piece spawns on one of the large trees outside the Lab B / Green Water side.',
      'Bunker AA Platform: the final piece spawns in the Anti-Aircraft room immediately to the right after entering the bunker.',
    ],
    build: 'Craft the shield at any available buildable workbench. The walkthrough routes the build during the Green Water side setup.',
    note: 'Keep a usable shield. After all three Trials are complete, the shield is electrified for the zipline cog step.',
  },
  {
    name: 'Gas Mask',
    type: 'Required endgame gear',
    parts: [
      'Plane / Propeller Trap area: collect the cable/tubing piece around the crashed plane and nearby Mystery Box rock area.',
      'Lab B / Green Water: collect the face-mask piece from the boxes around the green water, plant-growing spot, or nearby perk machine.',
      'Docks / lower zipline area: collect the filtration/respirator piece in the lower bunker-docks section near the zipline and challenge pedestal.',
    ],
    build: 'Take all three pieces to a buildable workbench and craft the Gas Mask.',
    note: 'Replace it with a fresh mask before the elevator descent. The mask also makes the long underwater Masamune plant step much safer.',
  },
  {
    name: 'KT-4',
    type: 'Wonder Weapon',
    parts: [
      'Glowing scientist zombie: kill the glowing scientist and pick up the dropped vial.',
      'Lab A spider cage: on a spider round, trap a live spider in the cage and activate the machine to extract the venom/syringe component.',
      'Deep underwater bunker route: swim down the submerged passage and collect the plant component at the bottom.',
    ],
    build: 'Build the KT-4 at its workbench after collecting all three components.',
    note: 'The KT-4 is required for the plant progression and is later upgraded into the Masamune.',
  },
  {
    name: 'Masamune',
    type: 'KT-4 upgrade',
    parts: [
      'Rainbow-water plant: Mesmerize the hidden underwater wall/rock, plant a seed, and water it with rainbow water across the required growth cycles before collecting the upgraded plant ingredient.',
      'Giant Spider pincer: use the KT-4 to clear the webbed entrance, defeat the giant spider, and collect its pincer before leaving.',
      'Electrified-shield vial: after all Trials are complete, electrify the shield and use it on the Lab B cage/control setup to obtain the Divinium vial.',
    ],
    build: 'Return the upgrade ingredients to the KT-4 workbench and collect the Masamune.',
    note: 'The Masamune is required for the final elevator/boss sequence and helps produce the artillery-shell plant for Cog 2.',
  },
];
