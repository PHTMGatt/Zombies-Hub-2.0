// 'VoidBow.tsx'
// --------------

import React from 'react';
import '../../styles/pages/Bows.css';

const VoidBow: React.FC = () => (
  <div className="bows-page__outlet">
    <h1>Void Bow</h1>

    <div className="video-container">
      <iframe
        src="https://www.youtube.com/embed/9xBsUQrpDag?start=221"
        title="Void Bow Guide – MrTLexify"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    <ol>
      <li>Shoot the purple symbol above Double Tap to spawn the quest item.</li>
      <li>Get a melee kill near the purple tile and activate the Keeper urn.</li>
      <li>Find 6 skulls around the map and interact with the Keeper's urn afterward.</li>
      <li>Make 6 crawlers and feed them to the urn to hear the Keeper’s 3-word name.</li>
      <li>Match each word to a statue with the correct symbol, then memorize the second symbol set.</li>
      <li>Kill zombies until they drop 3 matching glyphs, then shoot them in order on the floor.</li>
      <li>If correct, the Keeper will say “That is my name” — interact to collect the reforged arrow.</li>
      <li>Place it in the pyramid and gather ~20 souls to complete the Void Bow upgrade.</li>
    </ol>
  </div>
);

export default VoidBow;
