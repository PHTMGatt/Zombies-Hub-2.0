import React from "react";
import GuideSteps from "../../../../shared/guide/GuideSteps";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import originsGuide from "../data/originsGuide";
import SkullIcon from "../assets/images/Skull.png";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

// Origins UI: one field manual; the historical OG layout remains untouched.
const MainGuide = () => (
  <div className="main-guide origins-guide">
    <div className="origins-guide__inner">
      <section className="origins-guide__run" aria-labelledby="origins-main-steps-title">
        <header className="origins-guide__section-heading origins-guide__section-heading--main">
          <div className="origins-guide__mission">
            <span className="origins-guide__eyebrow">Origins · Main Steps</span>
            <div className="origins-guide__mission-name">
              <img src={SkullIcon} alt="" aria-hidden="true" />
              <h2 id="origins-main-steps-title">Little Lost Girl</h2>
              <span className="origins-guide__mission-count">{originsGuide.length} steps</span>
            </div>
            <p className="origins-guide__mission-description">Follow the sequence. Open a step for its exact staff code, placement or instruction.</p>
          </div>
          <nav className="origins-guide__route" aria-label="Jump to a guide phase">
            <a href="#build-staffs" className="origins-guide__route-link">
              <span className="origins-guide__route-number">01–05</span>
              <strong>Set up</strong>
            </a>
            <a href="#rain-fire" className="origins-guide__route-link">
              <span className="origins-guide__route-number">06–11</span>
              <strong>Finish the EE</strong>
            </a>
          </nav>
        </header>

        <section className="origins-guide__brief" aria-labelledby="origins-brief-title">
          <h3 id="origins-brief-title">Field Notes</h3>
          <ul className="origins-guide__notes">
            <li><strong>Use the downtime</strong><span>Fill the four soul chests as you build the staffs.</span></li>
            <li><strong>Keep one alive</strong><span>Save a zombie while solving staff puzzles and setting up.</span></li>
            <li><strong>Before Rain Fire</strong><span>Have the G-Strike and Maxis Drone ready.</span></li>
          </ul>
        </section>

        <GuideSteps label="Little Lost Girl" steps={originsGuide} collapsibleReferences compactAccordion footer={<CompleteEasterEgg mapId="origins" />} />

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
      </section>
    </div>
  </div>
);

export default MainGuide;
