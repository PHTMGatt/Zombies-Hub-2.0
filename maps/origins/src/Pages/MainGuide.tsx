import React from "react";
import { GuideRun } from "../../../../shared/ui/GuideRun";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";
const BASE = "/maps/origins";

const phases = [
  {
    title: "Build + Upgrade",
    summary: "Craft and fully upgrade Ice, Fire, Wind, and Lightning.",
    to: `${BASE}/ice-staff`,
    link: "Staff Guides",
  },
  {
    title: "Secure the Keys",
    summary: "Place Wind in Odin (middle robot), Ice in Freya (church / Gen 6 robot), Lightning in Thor (spawn / Gen 1–3 robot), and Fire in the pedestal at the bottom of the mound.",
  },
  {
    title: "Thunder Fists",
    summary: "Fill all four soul chests in the giant robot footprints, then collect the One Inch Punch / Thunder Fists from the reward chest.",
    notesLabel: "Soul chest locations",
    notes: ["Generator 5 footprint, mound footprint, Generator 6 footprint, and the footprint behind Juggernog."],
  },
  {
    title: "G-Strike",
    summary: "Complete the stone-tablet melee purification step and obtain the G-Strike grenades before Rain Fire.",
    notesLabel: "Tablet steps",
    notes: ["Purify the tablet with melee kills in the church, then return it without stepping in mud to finish the G-Strike setup."],
  },
  {
    title: "Rain Fire",
    summary: "Enter the middle robot through an open foot, press the red button, then immediately throw a G-Strike onto the seal by Generator 5.",
    notesLabel: "Timing",
    notes: ["Be ready at Generator 5 immediately after pressing the robot button so the G-Strike lands on the seal while it is active."],
  },
  {
    title: "Unleash the Horde",
    summary: "As soon as the seal opens, send the Maxis Drone into the hole and defeat the Panzer Soldiers that spawn.",
  },
  {
    title: "Skewer the Winged Beast",
    summary: "Enter Zombie Blood, shoot down the glowing red plane, then locate and kill the invisible clockwise-running pilot in Zombie Blood.",
    notesLabel: "Zombie Blood",
    notes: ["If the Panzers do not give you one naturally, the Ice Staff bonfire method can produce a free Zombie Blood near Pack-a-Punch."],
  },
  {
    title: "Wield a Fist of Iron",
    summary: "In the mound, use the One Inch Punch on the glowing/white-fist Templar zombies until the upgrade is complete, then collect the upgraded elemental fist.",
  },
  {
    title: "Raise Hell",
    summary: "Return all four upgraded staffs to their Crazy Place holders and earn the required 100 kills without removing the staffs.",
    notesLabel: "Before the 100 kills",
    notes: ["Make sure the Fire Staff is back in its Crazy Place holder before starting the final kill step."],
  },
  {
    title: "Freedom",
    summary: "Pick up the Maxis Drone, release it into the beam in the Crazy Place, and trigger the ending.",
    notesLabel: "Ending check",
    notes: ["Keep all generators active when you recover the upgraded Maxis Drone from the pilot sequence if you are going for the ending cutscene."],
  },
];

const tips = [
  "Build and upgrade the staffs as early as the run allows.",
  "Fill the soul chests during setup instead of leaving all four until the end.",
  "Save a zombie when you need uninterrupted time for staff puzzles or map setup.",
  "Have the Maxis Drone built and ready before you attempt Rain Fire.",
  "Use the dedicated staff pages for puzzle images instead of trying to memorize every code from the main guide.",
  "The future Interactive / Speedrun Guide will keep optimized routing separate from this standard quest guide.",
];

const theme = {
  accent: "#7cc8ff",
  "accent-2": "#3f9fe6",
  "on-accent": "#04101c",
  text: "#f2f8ff",
  muted: "#cfe0f2",
  panel: "rgba(3, 9, 16, 0.86)",
  line: "rgba(109, 194, 255, 0.2)",
};

const MainGuide = () => {
  return (
    <div className="main-guide">
      <GuideRun
        runId="origins"
        title="Little Lost Girl"
        intro="Ten steps. Staff puzzles live on their own pages; open them only when you reach that staff."
        alert={{ label: "Do early", text: "Build and upgrade all four staffs, fill the soul chests during setup, and have the Maxis Drone ready before Rain Fire." }}
        phases={phases}
        theme={theme}
      >
        <details className="origins-extra">
          <summary>Tips</summary>
          <ul>
            {tips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
        </details>

        <details className="origins-extra">
          <summary>Audio + credits</summary>
          <div className="audio-players">
            <audio controls preload="none" src={Audio1}></audio>
            <audio controls preload="none" src={Audio2}></audio>
          </div>
          <p className="credits">
            <em>MrRoflWaffles – Staff Images</em>
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">
              Kronorium.com
            </a>
          </p>
        </details>
      </GuideRun>
    </div>
  );
};

export default MainGuide;
