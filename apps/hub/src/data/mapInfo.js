const mapInfo = {
  "nacht-der-untoten": {
    name: "Nacht der Untoten",
    releasedIn: "World at War (2008)",
    description:
      "The original Treyarch Zombies survival map: three rooms, boarded windows, the Mystery Box, and the Ray Gun. Nacht is pure survival with no main quest, making it the simplest place to experience the mode's core loop.",
    hasEasterEgg: false
  },
  "kino-der-toten": {
    name: "Kino der Toten",
    releasedIn: "Black Ops (2010)",
    description:
      "A classic Berlin theater map built around a simple power-and-teleporter loop. Kino introduces the Thundergun and Nova Crawlers, with Pack-a-Punch reached through the stage teleporter and several small audio/music Easter Eggs to find.",
    hasEasterEgg: true
  },
  "five": {
    name: "Five",
    releasedIn: "Black Ops (2010)",
    description:
      "Fight through the Pentagon as John F. Kennedy, Richard Nixon, Robert McNamara, and Fidel Castro. DEFCON switches open the Pack-a-Punch room, while the Winter's Howl and Pentagon Thief give the map its distinctive high-pressure style.",
    hasEasterEgg: true
  },
  "dead-ops-arcade": {
    name: "Dead Ops Arcade",
    releasedIn: "Black Ops (2010)",
    description:
      "A hidden top-down twin-stick Zombies mode focused on score, power-ups, treasure, and increasingly chaotic arenas. It plays very differently from round-based Zombies and culminates in the Cosmic Silverback encounter.",
    hasEasterEgg: false
  },
  "ascension": {
    name: "Ascension",
    releasedIn: "Black Ops: First Strike DLC (2011)",
    description:
      "A Soviet cosmodrome map built around Lunar Landers, a launch sequence, and wide training areas. Ascension introduces PhD Flopper, Stamin-Up, the Gersh Device, Matryoshka Dolls, Space Monkeys, and the Casimir Mechanism quest.",
    hasEasterEgg: true
  },
  "call-of-the-dead": {
    name: "Call of the Dead",
    releasedIn: "Black Ops: Escalation DLC (2011)",
    description:
      "A frozen Siberian film set starring Sarah Michelle Gellar, Robert Englund, Danny Trejo, and Michael Rooker, with George A. Romero roaming the map as a persistent boss. The V-R11, Scavenger, icy water, lighthouse, and zipline define the map, while the main quest helps the trapped Ultimis crew.",
    hasEasterEgg: true
  },
  "shangri-la": {
    name: "Shangri-La",
    releasedIn: "Black Ops: Annihilation DLC (2011)",
    description:
      "A tight jungle map packed with traps, tunnels, mine-cart and water-slide travel, Napalm Zombies, Shrieker Zombies, and zombie monkeys. Its main quest uses the Eclipse mechanic and ultimately rewards the Focusing Stone.",
    hasEasterEgg: true
  },
  "moon": {
    name: "Moon",
    releasedIn: "Black Ops: Rezurrection DLC (2011)",
    description:
      "Travel between Area 51 and Griffin Station on the Moon, managing low gravity, PES suits, excavators, and teleportation. The Wave Gun, QED, Hacker, and Big Bang Theory quest make Moon one of the most system-heavy maps in the original Black Ops.",
    hasEasterEgg: true
  },
  "verrückt": {
    name: "Verrückt",
    releasedIn: "World at War: Map Pack 1 (2009)",
    description:
      "A cramped asylum survival map with two separated spawn sides that reconnect after power is turned on. Verrückt introduced the original perk machines and electric traps and is remembered for its fast, aggressive zombies and narrow escape routes.",
    hasEasterEgg: false
  },
  "shi-no-numa": {
    name: "Shi No Numa",
    releasedIn: "World at War: Map Pack 2 (2009)",
    description:
      "A swamp survival map built around a central building and four outer huts with randomized perks. Shi No Numa introduces the Wunderwaffe DG-2, the Flogger, Hellhounds, and the first playable appearance of the classic Ultimis crew lineup.",
    hasEasterEgg: true
  },
  "der-riese": {
    name: "Der Riese",
    releasedIn: "World at War: Map Pack 3 (2009)",
    description:
      "Group 935's factory map introduced Pack-a-Punch and the three-teleporter linking system that became a Zombies staple. The Wunderwaffe DG-2 returns, while the Fly Trap provides the map's signature hidden-object Easter Egg.",
    hasEasterEgg: true
  },
  "tranzit": {
    name: "TranZit",
    releasedIn: "Black Ops II (2012)",
    description:
      "Travel between Bus Depot, Diner, Farm, Power Station, and Town on the bus while Denizens punish long trips through the fog. TranZit introduces buildables on a large scale, including the Jet Gun, Turbine, Zombie Shield, Electric Trap, and Turret, with the Tower of Babble as its main quest.",
    hasEasterEgg: true
  },
  "nuketown-zombies": {
    name: "Nuketown Zombies",
    releasedIn: "Black Ops II (2012)",
    description:
      "A compact survival version of Nuketown set alongside the events of Moon. Perk machines and Pack-a-Punch drop into the map at unpredictable round milestones, forcing players to adapt their setup each game.",
    hasEasterEgg: true
  },
  "die-rise": {
    name: "Die Rise",
    releasedIn: "Black Ops II: Revolution DLC (2013)",
    description:
      "A vertical skyscraper map where elevators, one-way drops, and dangerous jumps are as important as the zombies. Build the Sliquifier and Trample Steam, manage moving perk elevators, and complete the High Maintenance quest with Victis.",
    hasEasterEgg: true
  },
  "mob-of-the-dead": {
    name: "Mob of the Dead",
    releasedIn: "Black Ops II: Uprising DLC (2013)",
    description:
      "Four mobsters are trapped in a supernatural version of Alcatraz and must use Afterlife to power the prison and build the Icarus plane. Hell's Retriever, the Blundergat, Brutus, and the repeating bridge cycle all feed into Pop Goes the Weasel and the choice to break or continue the cycle.",
    hasEasterEgg: true
  },
  "buried": {
    name: "Buried",
    releasedIn: "Black Ops II: Vengeance DLC (2013)",
    description:
      "Victis explores an underground Old West town filled with buildables, chalk weapon drawings, the bank, and the NPC Arthur. The Paralyzer, Time Bomb, haunted mansion, and Resolution 1295 quest give Buried a slower, setup-heavy style with lots of player-controlled shortcuts.",
    hasEasterEgg: true
  },
  "origins": {
    name: "Origins",
    releasedIn: "Black Ops II: Apocalypse DLC (2013)",
    description:
      "Primis fights through Great War trenches around Excavation Site 64 while giant robots cross the battlefield. Six generators power the map, and the four elemental staffs, Crazy Place, Panzer Soldats, Mark IV tank, and Little Lost Girl quest make Origins one of Zombies' deepest setup maps.",
    hasEasterEgg: true
  },
  "shadows-of-evil": {
    name: "Shadows of Evil",
    releasedIn: "Black Ops III (2015)",
    description:
      "Explore Morg City using Beast Mode to open routes, power utilities, and complete four rituals. Margwas, the Apothicon Servant, Apothicon Sword, Rocket Shield, Gateworms, and the Shadowman drive a quest whose full ending requires four players.",
    hasEasterEgg: true
  },
  "the-giant": {
    name: "The Giant",
    releasedIn: "Black Ops III (2015)",
    description:
      "A Black Ops III reimagining of Der Riese starring Primis. Link the three teleporters to Pack-a-Punch, use the Wunderwaffe DG-2, and complete the Fly Trap-style hidden-object quest to unlock the Annihilator specialist weapon.",
    hasEasterEgg: true
  },
  "dead-ops-arcade-ii": {
    name: "Dead Ops Arcade II",
    releasedIn: "Black Ops III (2015)",
    description:
      "The second Dead Ops Arcade keeps the twin-stick score-chasing format while adding new arenas, enemies, power-ups, vehicles, and first-person bonuses. It remains an arcade survival mode rather than a traditional round-based quest map.",
    hasEasterEgg: false
  },
  "der-eisendrache": {
    name: "Der Eisendrache",
    releasedIn: "Black Ops III: Awakening DLC (2016)",
    description:
      "Primis assaults Griffin Castle, feeding three dragons to obtain the Wrath of the Ancients before upgrading it into elemental bows. Wunderspheres, the Death Ray, Ragnarok DG-4, wisp cycles, Keeper ritual, and a dedicated boss fight form the My Brother's Keeper quest.",
    hasEasterEgg: true
  },
  "zetsubou-no-shima": {
    name: "Zetsubou No Shima",
    releasedIn: "Black Ops III: Eclipse DLC (2016)",
    description:
      "A Division 9 island laboratory built around plants, colored water, spores, and underwater routes. The Skull of Nan Sapwe, KT-4/Masamune, Gas Mask, three elevator cogs, and Giant Thrasher fight drive the Seeds of Doubt quest.",
    hasEasterEgg: true
  },
  "gorod-krovi": {
    name: "Gorod Krovi",
    releasedIn: "Black Ops III: Descent DLC (2016)",
    description:
      "Primis enters a war-torn Stalingrad filled with dragons, Manglers, and Valkyrie Drones. Dragon Network travel, Dragon Strike, the Gauntlet of Siegfried, randomized valve/challenge steps, and the dragon/Nikolai boss fight define Love and War.",
    hasEasterEgg: true
  },
  "revelations": {
    name: "Revelations",
    releasedIn: "Black Ops III: Salvation DLC (2016)",
    description:
      "A fractured endgame map combining pieces of earlier Aether locations into one connected space. Corruption Engines, the Giant Apothicon, Keeper Protector, upgraded Apothicon Servant, Runes of Creation, Summoning Key throws, and the Shadowman finale make its main quest highly reference-heavy.",
    hasEasterEgg: true
  },
  "nacht-der-untoten-chronicles": {
    name: "Nacht der Untoten (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "The BO3 remaster of Nacht keeps the original three-room survival layout while adding the modern weapon pool, GobbleGum, and updated presentation. It remains a straightforward survival map without a main quest.",
    hasEasterEgg: false
  },
  "kino-der-toten-chronicles": {
    name: "Kino der Toten (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "Kino rebuilt in the BO3 engine with the original theater, teleporter/Pack-a-Punch loop, Thundergun, and small Easter Eggs intact. BO3 weapons and GobbleGum modernize the setup without changing the map's basic flow.",
    hasEasterEgg: true
  },
  "shangri-la-chronicles": {
    name: "Shangri-La (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "The BO3 remaster preserves Shangri-La's tight jungle layout, Napalm and Shrieker Zombies, 31-79 JGb215, traps, and Eclipse quest. Modern weapons and GobbleGum are layered onto the original mechanics.",
    hasEasterEgg: true
  },
  "moon-chronicles": {
    name: "Moon (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "Moon remastered with BO3 visuals, weapons, GobbleGum, and the original Area 51/Griffin Station systems. Low gravity, excavators, PES suits, the Hacker, Wave Gun, and Big Bang Theory quest remain central.",
    hasEasterEgg: true
  },
  "origins-chronicles": {
    name: "Origins (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "The BO3 remaster of Origins keeps the generators, giant robots, Panzer Soldats, Mark IV tank, four elemental staffs, Crazy Place, and Little Lost Girl quest. The weapon pool and GobbleGum change the setup options, but the core route is still Origins.",
    hasEasterEgg: true
  },
  "shi-no-numa-chronicles": {
    name: "Shi No Numa (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "Shi No Numa rebuilt in the BO3 engine with its central swamp layout, four huts, randomized perks, Flogger, and Wunderwaffe DG-2 intact. BO3 weapons and GobbleGum update the survival experience.",
    hasEasterEgg: true
  },
  "verrückt-chronicles": {
    name: "Verrückt (Chronicles)",
    releasedIn: "Black Ops III: Zombies Chronicles (2017)",
    description:
      "The BO3 remaster keeps Verrückt's split spawn, narrow asylum routes, perk layout, and electric traps while adding BO3 weapons and GobbleGum. It remains a compact survival map without a main quest.",
    hasEasterEgg: false
  }
};

export default mapInfo;
