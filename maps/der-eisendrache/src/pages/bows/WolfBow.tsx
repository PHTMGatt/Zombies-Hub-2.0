// 'WolfBow.tsx'
// -------------

import React from 'react';
import '../../styles/pages/Bows.css';

const WolfBow: React.FC = () => (
  <div className="bows-page__outlet">
    <h1>Wolf Bow – Wolf</h1>

    <div className="video-container">
      <iframe
        src="https://www.youtube.com/embed/9xBsUQrpDag?start=127"
        title="Wolf Bow Guide – MrTLexify"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    <ol>
      <li>Activate the four paintings around the map in this order: Throne → Horseback → Battlefield → Cowering King.</li>
      <li>Collect the broken arrow from the wall in the Undercroft near the pyramid.</li>
      <li>Travel to the rocket test site and shoot the red flag to drop the wolf skull.</li>
      <li>Place the skull on the skeleton near the pyramid to summon the ghost wolf.</li>
      <li>Follow the ghost wolf to 3 dig spots and collect souls at each one (~10 kills per site).</li>
      <li>After the final dig, activate anti-gravity and wall-run to shoot two arrow shots at the marked symbol.</li>
      <li>A platform will appear — jump on it and interact to receive the reforged arrow.</li>
      <li>Place the reforged arrow in the pyramid forge and collect ~20 zombie souls.</li>
      <li>Once fully charged, claim the upgraded Wolf Bow.</li>
    </ol>
  </div>
);

export default WolfBow;
