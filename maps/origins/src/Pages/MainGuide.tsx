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
              <img src={SkullIcon} alt="" className="revive-icon" /> Main Steps
            </h2>

            <ol className="origins-main-steps">
              <li><strong>Upgrade all 4 staffs.</strong><span>Finish Ice, Fire, Wind, and Lightning.</span></li>
              <li><strong>Secure the Keys.</strong><span>Wind → Odin, Ice → Freya, Lightning → Thor, Fire → the mound pedestal.</span></li>
              <li><strong>Get the Thunder Fists.</strong><span>Fill the four footprint soul chests, then claim the One Inch Punch reward.</span></li>
              <li><strong>Get G-Strikes.</strong><span>Purify the stone tablet with melee kills and return it clean.</span></li>
              <li><strong>Rain Fire.</strong><span>Press the red button inside the middle robot, then immediately G-Strike the Generator 5 seal.</span></li>
              <li><strong>Unleash the Horde.</strong><span>Send the Maxis Drone into the opened seal and kill the Panzers.</span></li>
              <li><strong>Skewer the Winged Beast.</strong><span>In Zombie Blood, shoot the glowing red plane and kill the invisible pilot.</span></li>
              <li><strong>Wield a Fist of Iron.</strong><span>Punch the glowing Templars in the mound, then collect the upgraded elemental fist.</span></li>
              <li><strong>Raise Hell.</strong><span>Return all four upgraded staffs to the Crazy Place and earn 100 kills.</span></li>
              <li><strong>Freedom.</strong><span>Pick up the Maxis Drone, release it into the Crazy Place beam, and trigger the ending.</span></li>
            </ol>
          </section>

          <section className="guide-section origins-reference-section">
            <h2>
              <img src={SkullIcon} alt="" className="revive-icon" /> Quick Reference
            </h2>
            <ul>
              <li><strong>Soul Chests:</strong> Gen 5 footprint, mound footprint, Gen 6 footprint, and behind Jug.</li>
              <li><strong>Rain Fire:</strong> Be at Gen 5 before pressing the robot button; the timing window is short.</li>
              <li><strong>Zombie Blood:</strong> The Ice Staff bonfire method can create a free one near Pack-a-Punch.</li>
              <li><strong>Final kills:</strong> Put the Fire Staff back in its Crazy Place holder before starting the 100-kill step.</li>
              <li><strong>Ending:</strong> Keep all generators active when recovering the upgraded Maxis Drone.</li>
            </ul>
          </section>
        </div>

        <div className="right-column">
          <section className="guide-section origins-tips-section">
            <h2>
              <img src={SkullIcon} alt="" className="revive-icon" /> Run Tips
            </h2>
            <ul>
              <li>Upgrade staffs and fill soul chests during setup instead of saving everything for late game.</li>
              <li>Save a zombie when you need uninterrupted staff-puzzle or map-setup time.</li>
              <li>Have the Maxis Drone built before Rain Fire.</li>
              <li>Use the staff pages for puzzle images and <strong>Side EEs → Origins Speed Run</strong> for optimized routing.</li>
            </ul>

            <p className="credits">
              <em>MrRoflWaffles – Staff Images</em>
              <br />
              <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">
                Kronorium.com
              </a>
            </p>

            <details className="origins-audio-reference">
              <summary>Atmosphere audio</summary>
              <div className="audio-players">
                <audio controls src={Audio1}></audio>
                <audio controls src={Audio2}></audio>
              </div>
            </details>
          </section>
        </div>
      </div>
    </div>
  );
};

export default MainGuide;
