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
    summary: 'Find the green-lit valve and the Master Code Cylinder, use the valve solution to set the six dials, then take the released cylinder to S.O.P.H.I.A.',
    details: [
      'The green-light/cylinder combination changes, so use the dedicated Valve Solver rather than memorizing one arrangement.',
      'Once the dials are set correctly, the cylinder releases and can be inserted at Dragon Command.',
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
      'Tank Factory: use the shield blast on the trophy window.',
      'Dragon Command exterior: shoot the trophy down onto the rock.',
      'Supply Depot exterior: Dragon Strike the puddle.',
      'Supply Depot: activate the trap and collect the trophy after the trap ends.',
      'Pack-a-Punch/Hatchery: collect the toilet trophy.',
      'Mule Kick room: use the Gauntlet melee on the safe for the sixth trophy.',
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
    location: 'Tank Factory',
    method: 'Use the Dragon Shield blast on the trophy window to knock the trophy loose.',
  },
  {
    location: 'Outside Dragon Command',
    method: 'Shoot the trophy down so it lands on the rock below.',
  },
  {
    location: 'Outside Supply Depot',
    method: 'Place a Dragon Strike on the puddle to reveal the trophy.',
  },
  {
    location: 'Supply Depot',
    method: 'Activate the laser trap and collect the trophy after the trap finishes.',
  },
  {
    location: 'Pack-a-Punch / Hatchery',
    method: 'Collect the trophy from the toilet after the sewer-light setup has been completed.',
  },
  {
    location: 'Mule Kick room safe',
    method: 'After earning the Gauntlet of Siegfried, use its melee attack on the safe to reveal the sixth trophy.',
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
    summary: 'Activate the arena and survive until Nikolai fires on the dragon. When a wounded weak point opens, focus the Ray Gun Mark 3 on that exposed area.',
    details: [
      'Keep the shield between you and incoming dragon fire when repositioning.',
      'Repeat the exposed-weak-point cycle as the dragon lands at its different positions.',
      'After the final weak point is destroyed, the dragon dies and the Nikolai phase begins.',
    ],
  },
  {
    title: 'Nikolai Phase',
    summary: 'Use In Plain Sight as the phase begins, destroy the exposed mech weak points, then shoot the center when it opens.',
    details: [
      'The walkthrough focuses the lit mech sections and the upper left/right weak points first.',
      'Once those are destroyed, the middle opens for the finishing damage.',
    ],
  },
];
