export const mobPrerequisites = [
  'You can complete the quest up to the final step solo, but the full Easter Egg requires at least two players.',
  'In a two- or three-player game, one player must be Weasel for the final bridge showdown.',
  'Play on Original difficulty; Pop Goes the Weasel does not activate on Easy.',
];

export const mobRun = [
  {
    title: "Get the Warden's Key",
    summary: 'Locate the key above either the Cafeteria entrance or the Warden’s Office, then use Afterlife to lower it.',
    details: [
      'Cafeteria spawn: the key hangs above the Cafeteria / Showers entrance.',
      "Warden's Office spawn: the key hangs outside the office near the Citadel entrance.",
      'Enter the nearby Afterlife doorway and shock the highlighted generator so the key lowers to the floor.',
    ],
  },
  {
    title: 'Build the Plane',
    summary: 'Collect the five Icarus parts, place them on the rooftop plane, then fly to the Golden Gate Bridge for the first time.',
    details: [
      'Uniforms — Showers / laundry: unlock the washer area with the Warden’s Key, power the machine in Afterlife, start the wash, survive the lockdown, then collect the part.',
      'Rigging — Citadel Tunnels: unlock the number panel, read the three glowing numbers while in Afterlife, enter them on the panel, then collect the lowered elevator part.',
      'Tanks — Docks: unlock the outer gate with the Warden’s Key and use the Afterlife voltmeter to open the inner gate to the tanks.',
      "Engine — Warden's Office: shock all three generators in the Docks generator room to disable the electrified office gate, then collect the engine.",
      'Control Valve — Infirmary: use the Warden’s Key on the glowing green case near the Cerberus head / roof access.',
      'Roof access: from the Infirmary, enter Afterlife, take the blue doorway to the roof, and shock the roof-door voltmeter.',
    ],
  },
  {
    title: 'First Bridge Trip',
    summary: 'Take the completed plane to the Golden Gate Bridge, use Pack-a-Punch if needed, then return to Alcatraz on the electric chairs.',
    details: [
      'Brutus can spawn on the bridge, so clear enough space to use Pack-a-Punch and the chairs safely.',
      'After returning to the prison, the five fuel cans replace the plane parts on the following round.',
    ],
  },
  {
    title: "Refuel + Unlock Hell's Retriever",
    summary: 'Collect the five fuel cans while feeding all three Cerberus heads with six zombie souls each.',
    details: [
      'Fuel cans respawn at or near the original plane-part locations; return all five to the rooftop plane before the next trip.',
      'Feed the Cerberus heads in the Broadway Cell Block, the Infirmary, and the Docks.',
      "After all three heads disappear, collect Hell's Retriever from the opened alcove in the Citadel Tunnels between the Showers and the spiral staircase.",
    ],
  },
  {
    title: 'Second Bridge Trip',
    summary: 'Refuel the plane, make the second bridge round-trip, then return to Alcatraz and prepare fuel for trip three.',
    details: [
      'After returning, advance the round so the five fuel cans repopulate at the plane-part locations.',
      "Keep Hell's Retriever equipped because the skull and spoon steps require it.",
    ],
  },
  {
    title: 'Collect the Five Blue Skulls',
    summary: "Use Hell's Retriever to collect all five hidden skulls and spawn the free Blundergat in the Warden's Office.",
    details: [
      'Cell Block / Library: inside the toilet of the open cell.',
      'Docks: on the third wooden pier pillar.',
      'Juggernog: on the lamp post outside the perk area.',
      'Rooftop: on the far edge behind the plane.',
      "Outside the Warden's Office: on the power-line pole visible from the office window.",
      'The skulls are visible in Afterlife, but collect them while alive by throwing Hell’s Retriever through their positions.',
    ],
  },
  {
    title: 'Collect the Required Spoons',
    summary: "Use Hell's Retriever on the poster outside the Warden's Office, shock the hidden spoon in Afterlife, then retrieve the cafeteria spoon.",
    details: [
      'Throw Hell’s Retriever at the poster in the cell row near the Warden’s Office to reveal the Afterlife symbol and doorway.',
      'Enter Afterlife through the revealed blue doorway and shock the spoon on the floor until it disappears and you hear the laugh.',
      'At the Cafeteria window, throw Hell’s Retriever at the spoon on the table to collect it and finish the required spoon step.',
      'The Golden Spork upgrade is a separate optional side quest; the cafeteria pickup itself is the regular spoon.',
    ],
  },
  {
    title: 'Third Bridge Trip',
    summary: 'Refuel the plane and complete the third bridge round-trip. The Citadel number panel can now unlock the final story sequence.',
    details: [
      'After returning, the Citadel number panel should be cycling rapidly; if it is not, confirm that all three bridge round-trips are complete.',
    ],
  },
  {
    title: 'Enter the Afterlife Codes',
    summary: 'In Afterlife, enter all four prisoner numbers: 101, 386, 872, and 481. They do not need to be entered in a specific order.',
    details: [
      'You may split the four numbers across more than one Afterlife session if needed.',
      'After all four have been accepted, the screen turns black and white and Stanley Ferguson’s narration begins.',
      'Listen for the narration to finish before following the headphone pickups.',
    ],
  },
  {
    title: 'Follow the Audio Trail',
    summary: 'Collect all five headphone pickups in order from the Citadel Tunnels toward the rooftop, listening to each recording before the next appears.',
    details: [
      'Citadel Tunnels: staircase leading up from the spiral staircase.',
      'Double Tap: the room around the perk on the route back toward the Cell Blocks.',
      "Cell Blocks: the walkway between the Warden's Office and Cafeteria.",
      'Infirmary: near the entrance from the upper Cell Blocks.',
      'Roof access: the staircase / doorway leading onto the rooftop.',
    ],
  },
  {
    title: 'Final Afterlife Flight',
    summary: 'Enter Afterlife and interact with the rooftop plane. It does not need fuel; the team is transported to the bridge in Afterlife.',
    details: [
      'This final flight cannot be completed solo.',
      'There is no normal boarding prompt; interact with the plane while in Afterlife.',
      'Revive yourselves from the electric chairs on the bridge to begin the final showdown.',
    ],
  },
  {
    title: 'Break or Continue the Cycle',
    summary: 'The final fight is Weasel versus the other mobsters. Weasel wins by killing the others; the others win by killing Weasel.',
    details: [
      'Weasel is ignored by the zombies during the showdown and has increased durability to offset being outnumbered.',
      'If Weasel wins, the cycle is broken; if the other mobsters kill Weasel, the cycle continues.',
      'Either outcome completes Pop Goes the Weasel and ends the game.',
    ],
  },
];

export const planeParts = mobRun[1].details;
export const retrieverSteps = [mobRun[3], mobRun[5], mobRun[6]];
export const codeSteps = [mobRun[8], mobRun[9]];
export const finalSteps = [mobRun[10], mobRun[11]];
