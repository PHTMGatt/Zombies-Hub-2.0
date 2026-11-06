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
      <section className="origins-guide__run" aria-labelledby="origins-main-steps-title">
        <header className="origins-guide__section-heading origins-guide__section-heading--main">
          <div className="origins-guide__mission">
            <span className="origins-guide__eyebrow">Origins / Little Lost Girl</span>
            <div className="origins-guide__mission-name">
              <img src={SkullIcon} alt="" aria-hidden="true" />
              <h2 id="origins-main-steps-title">Main Steps</h2>
              <span className="origins-guide__mission-count">{originsGuide.length} steps</span>
            </div>
            <p className="origins-guide__mission-description">Your run, start to finish. Open a step when you need the details.</p>
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
        <GuideSteps label="Little Lost Girl" steps={originsGuide} collapsibleReferences compactAccordion footer={<CompleteEasterEgg mapId="origins" />} />
      </section>

      <aside className="origins-guide__sidebar" aria-label="Origins guide tips">
        <section className="origins-guide__tips" aria-labelledby="origins-tips-title">
          <header className="origins-guide__section-heading origins-guide__section-heading--tips">
            <div className="origins-guide__section-heading-label">
              <img src={SkullIcon} alt="" aria-hidden="true" />
              <div>
                <span className="origins-guide__eyebrow">Keep the run moving</span>
                <h2 id="origins-tips-title">Field Notes</h2>
              </div>
            </div>
          </header>
          <ol className="origins-guide__notes">
            <li>
              <strong>Build early</strong>
              <span>Build and upgrade the staffs as early as your run allows.</span>
            </li>
            <li>
              <strong>Do two things at once</strong>
              <span>Fill the four soul chests while you set up, not at the end.</span>
            </li>
            <li>
              <strong>Keep one alive</strong>
              <span>Save a zombie when you need time for staff puzzles.</span>
            </li>
            <li>
              <strong>Before Rain Fire</strong>
              <span>Have the G-Strike and Maxis Drone ready.</span>
            </li>
          </ol>
          <p className="origins-guide__notes-hint">Staff references open inside Steps 1 and 2. Full walkthroughs are in the staff pages above.</p>
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
      </aside>
    </div>
  </div>
);

export default MainGuide;
