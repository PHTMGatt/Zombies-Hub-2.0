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
              <li>Craft All Staffs (Ice, Fire, Wind, Lightning)</li>
              <li>Upgrade all staffs</li>
              <li>Place staffs inside robots: Lightning to spawn (Thor), Wind to Middle (Odin), Ice to Church (Freya)</li>
              <li>Obtain Air Strike Monkeys</li>
              <li>Enter accessible robot and press red button, then throw air-strike at Gen5</li>
              <li>Obtain Maxis Drone and throw it into the hole</li>
              <li>Kill 10 to 15 Panzer Soldiers</li>
              <li>Punch white-arm zombies under Pack-a-Punch until rock drops</li>
              <li>Kill the zombie while in Zombie Blood mode (clockwise runner)</li>
              <li>Enter Agartha and get 50–100 kills with Thunder Fists (achievement)</li>
              <li>If you want the cutscene, throw Maxis into the sky while in Agartha</li>
            </ul>
          </section>

          <section className="guide-section">
            <h2>
              <img src={SkullIcon} alt="Icon" className="revive-icon" /> Elemental Fist
            </h2>
            <ul>
              <li>Obtain Thunder Fists (fill all 4 soul boxes with 50 kills)</li>
              <li>Get stone at tank station, purify with souls in church, bring back without touching mud</li>
              <li>Have all upgraded staffs</li>
              <li>Release 10–15 Panzers</li>
              <li>Destroy plane in Zombie Blood mode</li>
              <li>Place Staffs in Freya, Odin, Thor</li>
              <li>Punch white-arm zombies under Pack-a-Punch and get stone (everyone must do this)</li>
            </ul>
          </section>
        </div>

        <div className="right-column">
          <section className="guide-section">
            <h2>
              <img src={SkullIcon} alt="Icon" className="revive-icon" /> Tips
            </h2>
            <ul>
              <li>Get Juggernog before round 8</li>
              <li>Get staffs early</li>
              <li>Leave a zombie to get all staffs and upgrade them</li>
              <li>Fill soul boxes early and obtain Thunder Fists before round 18</li>
              <li>Use upgraded staffs to revive teammates with D-Pad</li>
              <li>
                <em>
                  <u>Get These PERKS</u>
                </em>
              </li>
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
