import React from "react";
import FlatGuide from "../../../../shared/guide/FlatGuide";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import originsGuide, { originsTips } from "../data/originsGuide";
import SkullIcon from "../assets/images/Skull.png";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/OGGuide.css";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

// Origins main guide, mockup A (Bryen, 2026-11-21): the OG two-card layout (Main Steps | Tips) over the robot art.
// The steps are the verified flat guide (originsGuide); staff detail lives on the staff tabs.
const MainGuide = () => (
  <div className="main-guide origins-og origins-guide">
    <div className="guide-grid">
      <div className="left-column">
        <section className="guide-section origins-guide__steps" aria-labelledby="origins-main-steps">
          <h2 id="origins-main-steps">
            <img src={SkullIcon} alt="" aria-hidden="true" className="revive-icon" /> Main Steps
          </h2>
          <FlatGuide label="Little Lost Girl" steps={originsGuide} footer={<CompleteEasterEgg mapId="origins" />} />
        </section>
      </div>

      <div className="right-column">
        <section className="guide-section" aria-labelledby="origins-tips">
          <h2 id="origins-tips">
            <img src={SkullIcon} alt="" aria-hidden="true" className="revive-icon" /> Tips
          </h2>
          <ul>
            {originsTips.map((tip) => <li key={tip}>{tip}</li>)}
          </ul>
          <p className="credits origins-guide__credits">
            <em>MrRoflWaffles – Staff Images</em>
            <br />
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
          </p>
          <div className="audio-players">
            <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
            <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
          </div>
        </section>
      </div>
    </div>
  </div>
);

export default MainGuide;
