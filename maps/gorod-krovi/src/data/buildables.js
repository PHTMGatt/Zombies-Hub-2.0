const buildables = [
  {
    name: 'Guard of Fafnir (Dragon Shield)',
    type: 'Required Gear',
    steps: [
      'Collect one shield part from the Armory area.',
      'Collect one shield part from the Infirmary area.',
      'Collect the final shield part from the Operations Bunker / Department Store area.',
      'Build the completed Guard of Fafnir at the Operations Bunker workbench.',
    ],
    note: 'The exact part spawn within each area is randomized. The shield is required for the egg progression and one of the silver trophies.',
  },
  {
    name: 'Dragon Network Controller',
    type: 'Quest Assembly',
    steps: [
      'Complete the blue Code Cylinder Groph Module defense from Dragon Command.',
      'Complete the yellow Code Cylinder Groph Module defense from Supply Depot.',
      'Complete the red Code Cylinder Groph Module defense from Tank Factory.',
      'Install all three recovered parts into the generator in the Operations Bunker / Mule Kick area.',
    ],
    note: 'Completing this assembly enables the dragon network so you can ride to the Hatchery / Pack-a-Punch area.',
  },
  {
    name: 'Gauntlet of Siegfried',
    type: 'Quest Specialist',
    steps: [
      'Shoot down the Dragon Egg in the Hatchery and place it in a nest.',
      'Let the dragon breathe on the egg, wait the required rounds, then pick it back up.',
      'Fill the egg with dragon-fire zombie kills, penetration kills, and shield kills.',
      'Complete the Hatchery egg lockdown, wait the required rounds, then place the finished egg at spawn to receive the Gauntlet.',
    ],
    note: 'The Gauntlet is used later for the final trophy and the Groph Module drop challenge.',
  },
];

export default buildables;
