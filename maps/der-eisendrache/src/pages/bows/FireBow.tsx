// 'FireBow.tsx'
// --------------

import React from 'react';
import '../../styles/pages/Bows.css';

const FireBow: React.FC = () => (
  <div className="bows-page__outlet">
    <h1>Fire Bow – Fire</h1>

    <div className="video-container">
      <iframe
        src="https://www.youtube.com/embed/2lA6-UH6Qjo?start=0"
        title="Fire Bow Guide – TheRealGamer"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    <ol>
      <li>Get Wrath of the Ancients and shoot the red symbol near the Clock Tower to start the quest.</li>
      <li>Wait for the rocket test to finish, then shoot the glowing rock at the rocket site.</li>
      <li>Use Wunderspheres to hit 3 glowing circles mid-air with charged arrows.</li>
      <li>Stand in each circle and collect kills until they charge with energy.</li>
      <li>Return to the Clock Tower, spin the wheel to get a symbol, and shoot your arrow into the matching fireplace.</li>
      <li>Land the shot in the fireplace, then interact to spawn the reforged arrow.</li>
      <li>Grab the arrow from the Death Ray, place it in the pyramid forge, and collect ~20 souls.</li>
      <li>Once charged, retrieve the upgraded Fire Bow.</li>
    </ol>
  </div>
);

export default FireBow;
