export const gorodRun = [
  {
    title: 'Power + Dragon Network Controller',
    summary: 'Turn on power at Dragon Command, complete the blue, yellow, and red code-cylinder Groph Module defenses, then install all three recovered parts in the generator by Mule Kick.',
    details: [
      'Blue cylinder → blue terminal at Dragon Command.',
      'Yellow cylinder → yellow terminal at Supply Depot.',
      'Red cylinder → red terminal at Tank Factory.',
      'Follow each green Groph Module beam, defend the module with zombie kills, and collect the part after it opens.',
    ],
  },
  {
    title: 'Ride the Dragon + Get Dragon Strike',
    summary: 'Call the dragon, fly to the Pack-a-Punch/Hatchery area, and survive the four-direction lockdown to claim Dragon Strike.',
    details: [
      'The final lockdown wave opens all directions at once.',
      'Clear the zombies and Manglers, then pick up Dragon Strike from its terminal.',
    ],
  },
  {
    title: 'Incubate the Dragon Egg + Earn Siegfried',
    summary: 'Shoot down the egg in the Hatchery, place it in a nest, let the dragon breathe on it, then complete its kill requirements and the Hatchery egg lockdown.',
    details: [
      'After incubation, fill the egg with dragon-fire zombie kills, penetration kills, and shield kills.',
      'Place the charged egg in the Hatchery terminal and complete the lockdown.',
      'After the required round wait, collect the egg at spawn to receive the Gauntlet of Siegfried.',
    ],
  },
  {
    title: 'Solve the Valve Network',
    summary: 'Power the valve generator with a disabled Valkyrie, then route airflow from the green valve through all six locations to the Master Code Cylinder.',
    details: [
      'Hatchery basement: stand by the generator/radiator under the green tarp and shoot both arms off a Valkyrie so it crashes into the unit. The valve timer starts when the generator powers on.',
      'Find the green-lit starting valve and the valve containing the Master Code Cylinder, then use the dedicated Valve Solver.',
      'Set the five routing valves shown by the solver; the cylinder valve is the sixth/end valve and does not need a routing setting.',
      'When the airflow reaches the cylinder, collect it and insert it at S.O.P.H.I.A. in Dragon Command.',
    ],
  },
  {
    title: 'Spell KRONOS',
    summary: 'Use bullets to rotate S.O.P.H.I.A.’s letter wheels until they spell KRONOS, then confirm the code.',
    details: [
      'Avoid accidental Widow’s Wine or Electric Cherry effects while setting the letters because they can rotate the wheels.',
    ],
  },
  {
    title: 'Collect the Six Trophies',
    summary: 'Gather all six silver trophies around Stalingrad, including the final safe trophy unlocked with the Gauntlet of Siegfried, then place the set at Dragon Command.',
    details: [
      'Gersh trophy: shoot the raised statue hand across from Dragon Command; collect the trophy where it falls below.',
      'Valkyrie trophy: fire the Guard of Fafnir at the left window beside Double Tap so the trophy ejects next to the perk.',
      'Bomb trophy: use Dragon Strike on the puddle outside Supply Depot.',
      'Mangler trophy: activate the giant laser trap inside Supply Depot; collect the trophy after the trap exposes it.',
      'Group 935 trophy: shoot the red light during the sewer ride from the Hatchery, then collect the trophy from the Hatchery toilet.',
      'Groph Pod trophy: send the Gauntlet whelp at the Operations Bunker safe, then heavy-melee the safe with the Gauntlet to open it.',
    ],
  },
  {
    title: 'Complete S.O.P.H.I.A.’s Challenges',
    summary: 'Complete the randomized challenge set shown by the lit trophies. The final motherboard lockdown challenge always comes last.',
    details: [
      'Gersh: find and repeatedly shoot the floating orb until it returns to Dragon Command.',
      'Bombs: memorize the flashed location order and disable the terminals in that same order.',
      'Mangler escort: break the green-eyed Mangler’s shoulder armor and walk him onto the Dragon Command circle without killing him.',
      'Valkyrie escort: stay with the injured drone and escort it from spawn toward Dragon Command without damaging it.',
      'Groph drop: defend the called-out module, then use the Gauntlet dragon to retrieve the drop and return it to S.O.P.H.I.A.',
      'Final lockdown: take the motherboard to the Hatchery computer, survive the Manglers, retrieve it, and return it to S.O.P.H.I.A.',
    ],
  },
  {
    title: 'Take the Power Core + Open the Boss Fight',
    summary: 'After the final challenge, collect S.O.P.H.I.A.’s Power Core, complete the Gauntlet interaction at spawn, return to S.O.P.H.I.A., and enter the newly opened boss-fight route.',
    details: [
      'Before entering, the transcript recommends strong perks, a Pack-a-Punched Ray Gun Mark 3, a fresh shield, and In Plain Sight.',
    ],
  },
  {
    title: 'Kill the Dragon',
    summary: 'In the first boss phase, let Nikolai expose each dragon weak point as it lands, then damage the wounded areas with the Ray Gun Mark 3.',
    details: [
      'Use the shield to protect yourself from the dragon’s fire.',
      'Repeat the weak-point cycle across the dragon’s landing positions until the dragon dies.',
    ],
  },
  {
    title: 'Defeat Nikolai',
    summary: 'Trigger In Plain Sight, destroy Nikolai’s exposed mech weak points with the Ray Gun Mark 3, then finish the center once it opens.',
    details: [
      'The walkthrough targets the lit weak points and upper left/right sections before the center opens for the finish.',
    ],
  },
];

export const gorodPrerequisites = [
  'Solo or co-op compatible.',
  'Keep the shield available throughout the run; it is required for the egg and trophy progression.',
  'Ray Gun Mark 3 is strongly recommended for the S.O.P.H.I.A. challenges and boss fight.',
];

export const gorodTrophies = [
  {
    location: 'Gersh — Dragon Command exterior',
    method: 'Shoot the raised statue hand on the building across from Dragon Command. The trophy falls to the ground below.',
  },
  {
    location: 'Valkyrie — Double Tap',
    method: 'Use the Guard of Fafnir fireball on the left window beside Double Tap. The shot hits the pipe behind it and ejects the trophy beside the perk.',
  },
  {
    location: 'Bomb — Outside Supply Depot',
    method: 'Place a Dragon Strike on the puddle below the overhead Armory / Supply Depot walkway to reveal the trophy.',
  },
  {
    location: 'Mangler — Supply Depot',
    method: 'Activate the giant laser trap and collect the trophy from the floor/wall opening after the trap finishes.',
  },
  {
    location: 'Group 935 — Hatchery',
    method: 'During the sewer ride back from the Hatchery, shoot the red ceiling light. Return to the Hatchery and collect the trophy from the toilet.',
  },
  {
    location: 'Groph Pod — Operations Bunker safe',
    method: 'Send the Gauntlet of Siegfried whelp at the safe, then heavy-melee the safe with the Gauntlet to open it.',
  },
];

export const gorodChallenges = [
  {
    title: 'Gersh Orb',
    objective: 'Find the floating orb, damage it, follow its teleports, and repeat until it returns to Dragon Command.',
    tip: 'The Pack-a-Punched Ray Gun Mark 3 makes the repeated damage windows much easier.',
  },
  {
    title: 'Bomb Sequence',
    objective: 'Watch the Dragon Command screen, memorize the flashed location order, then disable every terminal in that same order.',
    tip: 'Write or screenshot the sequence before leaving Dragon Command if needed.',
  },
  {
    title: 'Mangler Escort',
    objective: 'Find the green-eyed Mangler, break the correct shoulder armor, then walk him onto the Dragon Command circle without killing him.',
    tip: 'Use a normal un-Pack-a-Punched bullet weapon for the shoulder shot and keep stray bullets away from the Mangler afterward.',
  },
  {
    title: 'Valkyrie Escort',
    objective: 'Find the injured Valkyrie at the back of spawn and stay with it while it travels toward Dragon Command.',
    tip: 'Avoid Widow’s Wine and Electric Cherry effects near the drone because accidental damage can fail the challenge.',
  },
  {
    title: 'Groph Module Drop',
    objective: 'Go to the location called out on screen, defend the Groph Module, then use the Gauntlet dragon to collect its drop and return it to S.O.P.H.I.A.',
    tip: 'The called-out module can be at Dragon Command, Tank Factory, or Supply Depot.',
  },
  {
    title: 'Motherboard Lockdown',
    objective: 'Take the motherboard to the Hatchery computer, survive the Mangler lockdown, retrieve the motherboard, and return it to S.O.P.H.I.A.',
    tip: 'This is always the final challenge in the walkthrough sequence.',
  },
];

export const gorodBossPhases = [
  {
    title: 'Dragon Phase',
    summary: 'Activate the arena and wait for Nikolai to harpoon the dragon. Damage each of the three exposed wounds — wing, belly, and neck — when it glows orange.'
    details: [
      'Keep the shield between you and incoming dragon fire when repositioning.',
      'Repeat the harpoon → exposed orange wound → damage cycle until all three dragon weak points are destroyed.',
      'After the final weak point is destroyed, the dragon dies and the Nikolai phase begins.',
    ],
  },
  {
    title: 'Nikolai Phase',
    summary: 'Use In Plain Sight if available, destroy Nikolai’s four glowing power cores, then damage the center core beneath the pilot seat when it opens.'
    details: [
      'Keep moving around the arena and target the four yellow power cores whenever you have a clean angle.',
      'After all four are destroyed, the center core beneath Nikolai opens for the finishing damage.',
    ],
  },
];
