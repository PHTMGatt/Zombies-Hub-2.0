export const deGuide = {
  videoId: 'NhDv6R5YPEs',
  credit: {
    author: 'CodenamePizza',
    link: 'https://youtube.com/@codenamepizza',
  },
  preflight: [
    'Turn on power and open the route through the castle.',
    'Feed all three dragon heads and collect the Wrath of the Ancients.',
    'Build the Rocket Shield when convenient and start collecting Ragnarok DG-4 parts early.',
    'Upgrade the bow or bows required for your game. Solo normally needs one upgraded bow; co-op normally needs one per player.',
    'Activate the Death Ray at least once before the quest reaches the fuse and safe sequence.',
  ],
  phases: [
    {
      id: 'setup',
      kicker: 'Phase 1',
      title: 'Wrath of the Ancients & Bow Upgrade',
      summary: 'Get the base bow, choose your upgrade path, and prepare the pieces the quest will ask for later.',
      time: '00:30',
      steps: [
        {
          title: 'Feed the three dragons',
          detail: 'Kill zombies one at a time in front of the dragon heads in the Courtyard, Mission Control, and Undercroft. Each dragon eats eight zombies and crumbles when full.',
        },
        {
          title: 'Claim Wrath of the Ancients',
          detail: 'After all three dragons are finished, collect the bow from the Family Crypt / Knight’s Tomb room above the Undercroft.',
        },
        {
          title: 'Upgrade your bow',
          detail: 'Use the dedicated Bows section for Storm, Fire, Wolf, or Void. Finish the required upgrade before starting the wisp cycle.',
        },
      ],
    },
    {
      id: 'first-wisps',
      kicker: 'Phase 2',
      title: 'First Wisp Cycle & First Time Travel',
      summary: 'Prime the teleporter, find four active wisps, and raid the past laboratory for the first quest items.',
      time: '02:01',
      warning: 'Use the BASE Wrath of the Ancients on the six teleporter prongs. The wisps themselves are shot with an upgraded bow.',
      steps: [
        {
          title: 'Prime all six teleporter prongs',
          detail: 'At the teleporter, shoot the six electrical prongs above it with the base bow until they glow orange/gold and the audio cue plays.',
        },
        {
          title: 'Shoot four wisps',
          detail: 'One wisp is active at a time across eight possible objects. Find and shoot four with an upgraded bow before the timer expires. The teleporter turns purple when the cycle is complete.',
        },
        {
          title: 'Travel together',
          detail: 'All players enter the purple teleporter together. Inside the past laboratory, move quickly before the return sequence begins.',
        },
        {
          title: 'Take the Soul Canister and fuses',
          detail: 'Pick up the blue Soul Canister and the small fuses. You will use them later at the Moon Pyramid Device and Death Ray.',
        },
        {
          title: 'Memorize the safe code',
          detail: 'Read Dr. Groph’s three safe symbols from top to bottom. The combination changes between games, so record it before leaving.',
        },
      ],
    },
    {
      id: 'safe',
      kicker: 'Phase 3',
      title: 'Death Ray, Safe & Simon Says',
      summary: 'Turn the pieces from the first time-travel trip into the safe contents, then complete both memory terminals.',
      time: '02:45',
      steps: [
        {
          title: 'Kill the returning Panzer',
          detail: 'A Panzersoldat appears after the first trip. Kill it, then continue setting up the Death Ray.',
        },
        {
          title: 'Install the fuses and set Protect',
          detail: 'Insert the small fuses into the Death Ray panel on the Clock Tower side and flip the Death Ray lever to Protect.',
        },
        {
          title: 'Enter the safe code',
          detail: 'Use the Clock Tower terminal to enter the three symbols you memorized in the past. A correct entry opens the safe in the teleporter room.',
        },
        {
          title: 'Loot the safe',
          detail: 'Collect the two large Tesla coils/fuses and the key card/floppy-style quest item from the opened safe.',
        },
        {
          title: 'Install the large coils',
          detail: 'Place the two large coils into the Death Ray pylons, switch the system back to Destroy, and use the key card at the terminal.',
        },
        {
          title: 'Complete both Simon Says terminals',
          detail: 'Repeat the flashing symbol sequence at the Clock Tower terminal and again at the Rocket Platform terminal. Hellhounds may pressure you while the puzzle is active.',
        },
        {
          title: 'Bring Dempsey’s pod down',
          detail: 'Press the green Death Ray button after both terminals are solved. The rocket/pod crashes into the courtyard.',
        },
        {
          title: 'TAKE THE VRIL GENERATOR',
          detail: 'Pick up the Vril Generator / Golden Rod from the crashed pod wreckage. It is easy to miss because the game does not make this pickup obvious.',
          danger: true,
        },
      ],
    },
    {
      id: 'second-wisps',
      kicker: 'Phase 4',
      title: 'Second Wisp Cycle & Keeper Stone',
      summary: 'Repeat the teleporter puzzle, return to the past, and retrieve the stone required for the Keeper ritual.',
      time: '03:37',
      steps: [
        {
          title: 'Prime the teleporter again',
          detail: 'Repeat the six-prong activation and complete another four-wisp cycle. The eight possible wisp objects are the same as the first cycle.',
        },
        {
          title: 'Return to the past laboratory',
          detail: 'Take the purple teleporter again with all players present.',
        },
        {
          title: 'Open the Keeper Stone case',
          detail: 'Use the quest computer/key-card interaction in the past to open the case, then collect the Keeper Stone / tablet before returning.',
        },
      ],
    },
    {
      id: 'keeper',
      kicker: 'Phase 5',
      title: 'Ghost Keeper Ritual',
      summary: 'Summon the Keeper, follow it around the castle, and fill four ritual sites with the bow it asks for.',
      time: '03:59',
      steps: [
        {
          title: 'Summon the Keeper',
          detail: 'Place the Vril Generator into the socket beneath the resting knight in the Family Crypt. A ghostly Keeper appears and begins moving through the map.',
        },
        {
          title: 'Follow it to each ritual circle',
          detail: 'The Keeper stops at four locations around the castle. Stand inside the white circle and watch the edge of the screen for the color that identifies the required upgraded bow.',
        },
        {
          title: 'Feed each circle with bow kills',
          detail: 'While a player stands in the circle, kill zombies with the requested upgraded bow. The zombies do not need to be standing inside the circle themselves.',
        },
        {
          title: 'Place the Keeper Stone at Double Tap',
          detail: 'At the Double Tap ritual location, insert the Keeper Stone into its wall/lamppost slot so the ritual can continue.',
        },
        {
          title: 'Finish all four locations',
          detail: 'When the final site is charged, the Keeper becomes solid and returns to the Undercroft / Moon Pyramid Device.',
        },
      ],
    },
    {
      id: 'mpd',
      kicker: 'Phase 6',
      title: 'Open the MPD & Prepare the Boss',
      summary: 'Finish the Moon Pyramid Device setup and make sure every player is ready before starting the no-return boss entry.',
      time: '04:15',
      steps: [
        {
          title: 'Insert the Soul Canister',
          detail: 'Place the blue Soul Canister from the first time-travel trip into the empty corner of the Moon Pyramid Device.',
        },
        {
          title: 'Finish every Ragnarok DG-4',
          detail: 'Every player needs a completed Ragnarok DG-4 before entering the boss fight. Use the Gear page if a part is still missing.',
        },
        {
          title: 'Gear up before entry',
          detail: 'Buy perks, refill ammo, repair shields, and make sure your upgraded bow is ready. Once everyone plants Ragnaroks on the pyramid tiles, the fight begins.',
        },
        {
          title: 'Plant the Ragnaroks together',
          detail: 'Each player places a Ragnarok on a separate anti-gravity / pyramid tile to trigger the teleport into the Keeper boss arena.',
        },
      ],
    },
  ],
  bossFight: [
    {
      phase: '1',
      title: 'Keeper Damage Phase',
      detail: 'Watch for the electrical orb beneath the Keeper in the center. Plant a Ragnarok into the orb / directly beneath the Keeper to stun it, then unload into the glowing open chest.',
      time: '05:22',
    },
    {
      phase: '2',
      title: 'Panzer & Skeleton Wave',
      detail: 'Clear the Panzers and skeletons while recharging the Ragnaroks. Use the Max Ammo from the transition to reset before the next damage phase.',
      time: '05:52',
    },
    {
      phase: '3',
      title: 'Second Keeper Damage Phase',
      detail: 'Repeat the Ragnarok stun and chest damage. Hellhounds begin adding pressure, so keep the arena controlled instead of tunnel-visioning the Keeper.',
      time: '06:00',
    },
    {
      phase: '4',
      title: 'Second Panzer Wave',
      detail: 'Clear the next Panzer wave, refill the Ragnaroks again, and prepare for the final Keeper cycle.',
      time: '06:08',
    },
    {
      phase: '5',
      title: 'Final Keeper Damage Phase',
      detail: 'Land the third successful Ragnarok stun and finish the glowing chest. In co-op, be ready for extra enemies during the final damage window.',
      time: '06:14',
    },
  ],
  ending: [
    'After the Keeper dies, return to the Moon Pyramid Device and collect the Summoning Key when it becomes available.',
    'Carry the Summoning Key to the terminal outside the Clock Tower — the same general terminal area used during the safe / memory sequence.',
    'Interact with the terminal to trigger the ending and destroy Griffin Station.',
  ],
};
