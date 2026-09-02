export const mobPrerequisites = [
  'You can complete the quest up to the final step solo, but the full Easter Egg requires at least two players.',
  'In a two- or three-player game, one player must be Weasel for the final bridge showdown.',
];

export const mobRun = [
  {
    title: "Get the Warden's Key",
    summary: 'Locate the key in one of its two possible spawn positions and use Afterlife to shock the box so the key drops.',
    details: [
      'Possible side: outside the left side of spawn.',
      "Possible side: toward the Warden's Office.",
      'Use the nearby Afterlife box, enter the opened path, and shock the electrical box holding the key.',
    ],
  },
  {
    title: 'Build the Plane',
    summary: 'Collect all five plane parts, place them on the rooftop plane, then fly to the Golden Gate Bridge for the first time.',
    details: [
      'Showers / laundry part: power the laundry room in Afterlife, activate the washer, survive the lockdown, then collect the part.',
      'Rooftop part: unlock roof access in Afterlife and collect the nearby plane part.',
      'Citadel Tunnel part: reveal the three glowing numbers in Afterlife, enter them on the lower panel, then collect the timed part.',
      'Docks gas canister: use Afterlife to remove the electrical gate blocking the part.',
      "Warden's Office engine: shock the three dock generators, then open the Warden's Office path in Afterlife and collect the part.",
    ],
  },
  {
    title: 'First Bridge Trip',
    summary: 'Take the completed plane to the bridge, kill the Warden, clear the round, then return on the electric chairs.',
    details: [
      'Wait until the round number turns white before taking the electric chairs back.',
      'Returning at the round transition lets the fuel cans repopulate immediately.',
    ],
  },
  {
    title: "Refuel + Unlock Hell's Retriever",
    summary: 'Collect the five fuel cans while feeding all three Hellhound heads with six zombie souls each.',
    details: [
      'Fuel cans respawn near the original plane-part locations; the Citadel fuel can is in front of the number panel rather than deep underground.',
      'Feed the Hellhounds near spawn, the docks, and the rooftop.',
      "After all three heads disappear, collect Hell's Retriever near the showers.",
    ],
  },
  {
    title: 'Second Bridge Trip',
    summary: 'Refuel the plane, return to the bridge, clear the round, and come back to Alcatraz for the skull/spoon setup.',
    details: [
      'After returning, refuel the plane one more time for the third trip.',
      "Keep Hell's Retriever equipped because the next step requires it.",
    ],
  },
  {
    title: 'Collect the Five Blue Skulls',
    summary: "Use Hell's Retriever to collect all five hidden skulls and spawn the free Blundergat in the Warden's Office.",
    details: [
      'Jail cell just outside spawn.',
      'Podium in the docks.',
      'Lamp post outside Juggernog.',
      'Rooftop near the plane.',
      "Pylon outside the Warden's Office window near Speed Cola.",
    ],
  },
  {
    title: 'Complete the Spoon / Spork Step',
    summary: "Throw Hell's Retriever at the poster outside the Warden's Office, shock the spoon in Afterlife, then collect the golden spork in the cafeteria.",
    details: [
      'The poster opens an Afterlife-only passage.',
      'Shock the spoon until it disappears and you hear the laugh.',
      "Throw Hell's Retriever at the golden spork in the cafeteria window to collect it.",
    ],
  },
  {
    title: 'Third Bridge Trip',
    summary: 'Take the plane to the bridge for the third time. You do not need to clear the round before returning to the prison.',
    details: [
      'After returning, the Citadel number panel will be rapidly flickering and ready for the Afterlife code step.',
    ],
  },
  {
    title: 'Enter the Afterlife Codes',
    summary: 'In Afterlife, enter the four code sets in order: 101, 386, 872, 481.',
    details: [
      'After the final code, revive yourself and the screen turns black and white.',
      'The story audio sequence now begins.',
    ],
  },
  {
    title: 'Follow the Audio Trail',
    summary: 'Walk through each headphone/audio pickup in order until the story sequence ends and color returns to the screen.',
    details: [
      'Stairs beside the Citadel Tunnel.',
      'Room just outside Double Tap.',
      'Catwalk.',
      'Top of the stairs on the upper floor.',
      'Rooftop just after the first roof door.',
    ],
  },
  {
    title: 'Final Afterlife Flight',
    summary: 'Enter Afterlife and interact with the rooftop plane. It does not need fuel; the team is transported to the bridge in Afterlife.',
    details: [
      'This final flight cannot be completed solo.',
      'Revive on the bridge to begin the final fight.',
    ],
  },
  {
    title: 'Break or Continue the Cycle',
    summary: 'The final fight is Weasel versus the other mobsters. Weasel wins by killing the others; the others win by killing Weasel.',
    details: [
      'Weasel is safe from the zombies during the showdown.',
      'The other players must deal with zombies while trying to kill Weasel.',
    ],
  },
];

export const planeParts = mobRun[1].details;
export const retrieverSteps = [mobRun[3], mobRun[5], mobRun[6]];
export const codeSteps = [mobRun[8], mobRun[9]];
export const finalSteps = [mobRun[10], mobRun[11]];
