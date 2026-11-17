import React from "react";
import FlatGuide from "../../../../shared/guide/FlatGuide";
import CompleteEasterEgg from "../../../../shared/achievements/CompleteEasterEgg";
import originsGuide from "../data/originsGuide";
import Audio1 from "../assets/audio/origins_robot.mp3";
import Audio2 from "../assets/audio/zombie_intro.mp3";
import "../Styles/PageStyles/MainGuide.css";

const KRONORIUM_URL = "https://kronorium.com/";

// Origins main guide: the Easter Egg steps in order, one line each. Staff detail lives on the staff pages.
const MainGuide = () => (
  <div className="main-guide origins-guide">
    <div className="origins-guide__inner">
      <FlatGuide label="Little Lost Girl" steps={originsGuide} footer={<CompleteEasterEgg mapId="origins" />} />
      <p className="origins-guide__credits credits">
        <em>MrRoflWaffles – Staff Images</em> · <a href={KRONORIUM_URL} target="_blank" rel="noreferrer">Kronorium.com</a>
      </p>
      <div className="audio-players">
        <audio controls aria-label="Origins robot radio message" src={Audio1} preload="none"></audio>
        <audio controls aria-label="Origins zombie intro" src={Audio2} preload="none"></audio>
      </div>
    </div>
  </div>
);

export default MainGuide;
