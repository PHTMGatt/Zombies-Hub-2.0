import React from "react";
import GuideSteps from "../../../../shared/guide/GuideSteps";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import originsGuide from "../data/originsGuide";
import SkullIcon from "../assets/images/Skull.png";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

const MainGuide = () => (
  <div className="main-guide origins-guide">
    <div className="origins-guide__inner">
      <div className="origins-guide__run">
        <div className="origins-guide__section-heading">
          <img src={SkullIcon} alt="" aria-hidden="true" />
          <h2>Main Steps</h2>
        </div>
        <GuideSteps label="Little Lost Girl" steps={originsGuide} collapsibleReferences footer={<CompleteEasterEgg mapId="origins" />} />
      </div>

      <aside className="origins-guide__sidebar" aria-label="Origins guide tips">
        <section className="origins-guide__tips">
          <div className="origins-guide__section-heading">
            <img src={SkullIcon} alt="" aria-hidden="true" />
            <h2>Tips</h2>
          </div>
          <ul>
            <li>Build and upgrade the staffs as early as your run allows.</li>
            <li>Fill the four soul chests while you set up, not at the end.</li>
            <li>Save a zombie when you need time for staff puzzles.</li>
            <li>Have the G-Strike and Maxis Drone ready before Rain Fire.</li>
            <li>Tap a staff under Build or Upgrade to reveal its original reference. Use the staff pages for the full walkthrough.</li>
          </ul>
        </section>

        {/* Secondary extras never interrupt the sequence. */}
        <details className="origins-guide__credits">
          <summary>Credits + radio audio</summary>
          <p className="credits">
            <em>MrRoflWaffles – Staff Images</em>
            <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
          </p>
          <div className="audio-players">
            <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
            <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
          </div>
        </details>
      </aside>
    </div>
  </div>
);

export default MainGuide;
