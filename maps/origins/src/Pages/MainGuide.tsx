import React from "react";
import SkullIcon from "../assets/images/Skull.png";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

const MainGuide = () => {
  return (
    <div className="main-guide">
      <div className="guide-grid">
        <div className="left-column">
          <section className="guide-section">
            <h2>
              <img src={SkullIcon} alt="Icon" className="revive-icon" /> Main Steps
            </h2>
            <ul>
              <li><strong>Build + Upgrade:</strong> Craft and fully upgrade Ice, Fire, Wind, and Lightning.</li>
              <li><strong>Secure the Keys:</strong> Place Wind in Odin (middle robot), Ice in Freya (church / Gen 6 robot), Lightning in Thor (spawn / Gen 1–3 robot), and Fire in the pedestal at the bottom of the mound.</li>
              <li><strong>Thunder Fists:</strong> Fill all four soul chests in the giant robot footprints, then collect the One Inch Punch / Thunder Fists from the reward chest.</li>
              <li><strong>G-Strike:</strong> Complete the stone-tablet melee purification step and obtain the G-Strike grenades before Rain Fire.</li>
              <li><strong>Rain Fire:</strong> Enter the middle robot through an open foot, press the red button, then immediately throw a G-Strike onto the seal by Generator 5.</li>
              <li><strong>Unleash the Horde:</strong> As soon as the seal opens, send the Maxis Drone into the hole and defeat the Panzer Soldiers that spawn.</li>
              <li><strong>Skewer the Winged Beast:</strong> Enter Zombie Blood, shoot down the glowing red plane, then locate and kill the invisible clockwise-running pilot in Zombie Blood.</li>
              <li><strong>Wield a Fist of Iron:</strong> In the mound, use the One Inch Punch on the glowing/white-fist Templar zombies until the upgrade is complete, then collect the upgraded elemental fist.</li>
              <li><strong>Raise Hell:</strong> Return all four upgraded staffs to their Crazy Place holders and earn the required 100 kills without removing the staffs.</li>
              <li><strong>Freedom:</strong> Pick up the Maxis Drone, release it into the beam in the Crazy Place, and trigger the ending.</li>
            </ul>
          </section>

          <section className="guide-section">
            <h2>
              <img src={SkullIcon} alt="Icon" className="revive-icon" /> Setup Reference
            </h2>
            <ul>
              <li><strong>Soul Chests:</strong> Generator 5 footprint, mound footprint, Generator 6 footprint, and the footprint behind Juggernog.</li>
              <li><strong>G-Strike Tablet:</strong> Purify the tablet with melee kills in the church, then return it without stepping in mud to finish the G-Strike setup.</li>
              <li><strong>Rain Fire Timing:</strong> Be ready at Generator 5 immediately after pressing the robot button so the G-Strike lands on the seal while it is active.</li>
              <li><strong>Zombie Blood:</strong> If the Panzers do not give you one naturally, the Ice Staff bonfire method can produce a free Zombie Blood near Pack-a-Punch.</li>
              <li><strong>Final 100 Kills:</strong> Make sure the Fire Staff is back in its Crazy Place holder before starting the final kill step.</li>
              <li><strong>Ending Check:</strong> Keep all generators active when you recover the upgraded Maxis Drone from the pilot sequence if you are going for the ending cutscene.</li>
            </ul>
          </section>
        </div>

        <div className="right-column">
          <section className="guide-section">
            <h2>
              <img src={SkullIcon} alt="Icon" className="revive-icon" /> Tips
            </h2>
            <ul>
              <li>Build and upgrade the staffs as early as the run allows.</li>
              <li>Fill the soul chests during setup instead of leaving all four until the end.</li>
              <li>Save a zombie when you need uninterrupted time for staff puzzles or map setup.</li>
              <li>Have the Maxis Drone built and ready before you attempt Rain Fire.</li>
              <li>Use the dedicated staff pages for puzzle images instead of trying to memorize every code from the main guide.</li>
              <li>The future Interactive / Speedrun Guide will keep optimized routing separate from this standard quest guide.</li>
            </ul>
            <p className="credits">
              <em>MrRoflWaffles – Staff Images</em>
              <br />
              <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">
                Kronorium.com
              </a>
            </p>
            <div className="audio-players">
              <audio controls src={Audio1}></audio>
              <audio controls src={Audio2}></audio>
            </div>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainGuide;
