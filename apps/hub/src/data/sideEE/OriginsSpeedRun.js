const videoId = '-li89mVRqSY';

export const originsSpeedRunVideo = {
  title: 'BO3 Origins Speedrun Route',
  url: `https://youtu.be/${videoId}`,
  timestampUrl: (seconds) => `https://youtu.be/${videoId}?t=${seconds}`,
};

export const originsSpeedRun = {
  intro:
    'A compact Black Ops 3 Origins speedrun reference built from the advanced route in the linked walkthrough. Use the normal Origins guide for puzzle solutions; this page is about routing, robot/snow timing, skips, staff dupes, and the ending setup.',

  loadout: [
    'GobbleGums: Raindrops, Extra Credit, Nukes, Perkaholic, Self-Medication.',
    'Keep the Mauser. For tank-skip routes, Pack-a-Punch it into the Boomhilda before the Lightning section.',
    'Set attachments for the VMP and M8A7; both are useful wall buys during the run.',
    'Keep track of Mule Kick weapon order. The route intentionally manipulates staff slots later.',
  ],

  quickRules: [
    {
      label: 'Snow',
      text: 'Round 3 snow is possible; either round 4 or 5 is guaranteed. Dig constantly even off-snow because failed digs improve later Ice-part odds.',
    },
    {
      label: 'Robots',
      text: 'Robots begin around 1:00 and repeat roughly every 2 minutes. The robot is decided about 20 seconds before it spawns.',
    },
    {
      label: 'Trios',
      text: 'Robot trios alter the next cycle timing by about 10 seconds. Round timing can be used to skip an unwanted trio cycle.',
    },
    {
      label: 'Reset pace',
      text: 'For this WR-style route, an early Odin at Gen 2 or missing both round-3 and round-4 snow is treated as a reset condition.',
    },
  ],

  hildalessLightning: {
    title: 'Hildaless First Lightning Piece',
    videoUrl: 'https://youtu.be/zUwv9CWpNck',
    summary:
      'Optional advanced first-piece route that uses movement and death-barrier timing instead of the tank or Boomhilda.',
    steps: [
      'Set max FPS below 110; the demonstrated setup uses about 100 FPS and notes that lower values can make the movement easier.',
      'Run straight at the wall near the first Lightning-piece area. Near the corner, jump and hold the movement input to climb onto the edge.',
      'Aim roughly toward the wooden platform and hold forward briefly along the edge.',
      'Face the final wall, run, and jump as late as possible to get onto the piece area.',
      'Use a consistent timer reference for the death barrier. In the demonstrated setup, checks repeat on roughly three-second intervals; begin the final run just before the next check to maximize the safe window.',
      'Reach the wooden stairs before the following check and favor the left side, where the death barrier disables sooner.',
      'Grab the Lightning Staff piece and rejoin the normal route.',
    ],
    warning:
      'Practice this separately before using it in a run. If the timing is inconsistent, use the normal tank route or the Boomhilda skip instead.',
  },

  route: [
    {
      id: 'opening',
      title: 'Opening + Gen 1 / 3 / 2',
      timestamp: 59,
      summary: 'Set the run with money, early round nukes, the first Wind part, the spawn Ice piece, Ice disc, G-Strike tablet, and Lightning dial progress.',
      details: [
        'Spawn: grab the Maxis Drone brain, spin the spawn Lightning dial twice, hit GobbleGum, then start Gen 1.',
        'Go Gen 3 first, grab the shovel, and dig the Gen 3 trench spot on the way.',
        'At Gen 2, watch the first robot while finishing the generator and clearing Tank Station collectibles.',
        'Desired exit state: Thor/spawn Wind piece, spawn Ice piece, Ice disc, and G-Strike tablet.',
        'Do not burn the round-4 zombies if you need them for the G-Strike tablet.',
      ],
    },
    {
      id: 'wind-cycle',
      title: 'Ice + Wind Staff / Robot Cycle',
      timestamp: 545,
      summary: 'Build Ice, manage Freya/Odin, charge G-Strikes, and finish the Wind Staff with a 4-cycle as the preferred route.',
      details: [
        'At the mound grab the Gramophone, then work Gen 5 and church while digging for the middle Ice piece.',
        'Use church zombies to charge the G-Strike tablet and collect the church Ice piece during snow.',
        'A build time around 6:45 or faster can allow the Ice puzzle before catching Odin.',
        '4-cycle: preferred clean route. 5-cycle: finish G-Strikes at Gen 2, then catch Odin fifth. 3-cycle: catch Odin early and route around Freya as the third robot.',
        'Target a fresh round 7 when leaving the mound with Wind built.',
      ],
    },
    {
      id: 'lightning',
      title: 'Lightning Staff Route',
      timestamp: 873,
      summary: 'Choose the fast Boomhilda tank-skip route, the safer normal tank route, or the hildaless first-piece route, then leave with all three Lightning pieces and Self-Medication ready.',
      details: [
        'Tank-skip route: use controlled Boomhilda boosts to reach the Lightning-part ledges, disable the death barrier, and collect the parts without riding the full tank route.',
        'Self-Medication protects the skip route if the death barrier downs you and a nearby zombie triggers the revive condition.',
        'Safe route: use the Fire portal, exit through Ice, send the tank, do Gen 4 while it moves, and board only when needed to reduce cooldown time.',
        'Hildaless alternate: the first Lightning piece can be reached with movement + FPS/death-barrier timing instead of the tank or Boomhilda. Use the dedicated hildaless box below for the sequence.',
        'Use the Lightning switch reference below for the seven dial directions instead of stopping the run to remember them.',
      ],
    },
    {
      id: 'dupe-one',
      title: 'Staff Dupe #1 — Ice + Wind',
      timestamp: 1104,
      summary: 'Use Self-Medication + Quick Revive + Mule Kick timing to leave the mound holding Ice and Wind while creating the duplicate Ice Staff needed later.',
      details: [
        'Build the Fire Staff but leave it in the holder.',
        'Swap Wind for Ice, down yourself, and revive with Self-Medication.',
        'During the remaining Quick Revive window, trade Ice for Wind and hold your non-Mule-Kick gun.',
        'When Quick Revive finishes, the game returns the Ice Staff while you keep Wind; a duplicate Ice Staff remains in the mound.',
      ],
    },
    {
      id: 'templars',
      title: 'Round 10 Templars + Staff Dupe #2',
      timestamp: 1339,
      summary: 'Transfer Ice/Wind, handle the generator Templars, then duplicate Fire + Lightning and start the final upgrade cycle.',
      details: [
        'Transfer Ice and Wind through the Lightning tunnel and collect the Lightning crystal.',
        'Use G-Strikes for most Templar generator attacks; Gen 1 is especially bad for top pace.',
        'Buy a wall weapon before the second dupe. Fire → down/Self-Med → build Lightning → trade Fire for Lightning → hold the wall gun through Quick Revive.',
        'From here, cycle GobbleGum for Nukes and another Self-Medication charge for the ending skip.',
      ],
    },
    {
      id: 'upgrades',
      title: 'Finish All Staff Upgrades',
      timestamp: 1755,
      summary: 'Fill Fire souls, solve Lightning while the exit opens, finish Ice/Wind, and manipulate the round-13 soul count for a faster final upgrade.',
      details: [
        'Leave the Gramophone at Wind for the rest of the game.',
        'Use 32 zombies for the Fire cauldrons, then solve Lightning while the Ice exit portal builds.',
        'Kill roughly 7–8 additional zombies while moving to finish Ice/Wind progress.',
        'Round 13 has 39 regular zombies against a 40-soul need; a dig-site zombie can remove the extra round-change requirement.',
        'A precisely timed pre-Nuke can kill Templars before normal zombies spawn, preserving the souls you need.',
      ],
    },
    {
      id: 'ending',
      title: 'Soul Boxes + Ending Setup',
      timestamp: null,
      summary: 'Build Maxis, fill the early soul boxes, prepare the useful Rain Fire cycle, and make sure Self-Medication is ready for the final exploit.',
      details: [
        'A common route fills three soul boxes before the first useful Rain Fire cycle.',
        'Start with the Gen 4 box, then church, while using safe GobbleGum windows to find the next Self-Medication.',
        'Each box is roughly 30 souls; simultaneous kills can occasionally undercount, so confirm completion before leaving.',
      ],
    },
    {
      id: 'afd-skip',
      title: 'Fire Staff / Ascend From Darkness Skip',
      timestamp: null,
      summary: 'Use the duplicated Fire/Ice weapon state and repeated revive windows to count all four staff placements without running the full intended AFD sequence.',
      details: [
        'Place Fire in the AFD pedestal, then collect the visually hidden duplicate Fire Staff from its original holder.',
        'Down near the Thompson wall buy; during revive, trade the non-Mule-Kick wall weapon for the duplicate Ice Staff and immediately hold the Thompson.',
        'Quick Revive returns another Fire Staff. Repeat the down/revive placement sequence until all four pedestal slots register.',
        'This is the most timing-sensitive section of the route; use the linked video if the text timing is unclear.',
      ],
    },
  ],
};

export default originsSpeedRun;
