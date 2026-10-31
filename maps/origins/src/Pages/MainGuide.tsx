import React from "react";
import GuideSteps from "../../../../shared/guide/GuideSteps";
import originsGuide from "../data/originsGuide";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

const MainGuide = () => (
  <div className="main-guide origins-guide">
    <div className="origins-guide__inner">
      <GuideSteps label="Little Lost Girl" steps={originsGuide} />

      {/* Credits and the two radio clips are extras: tucked away so they never sit between the step and play. */}
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
    </div>
  </div>
);

export default MainGuide;
