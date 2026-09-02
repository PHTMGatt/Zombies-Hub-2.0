// src/pages/Bows/BaseBow.tsx
// ---------------------------

import React from 'react';
import '../../styles/pages/Bows.css';

const BaseBow: React.FC = () => (
  <div className="bows-content">
    <h1>Base Bow</h1>
    <p>
      The first step toward upgrading any bow is to feed the three dragons scattered
      around the map. Here’s how:
    </p>
    <ol>
      <li>
        <strong>Find each dragon:</strong>
        <ul>
          <li>Church (near the balcony above Speed Cola)</li>
          <li>Pyramid Room (on the lower level)</li>
          <li>Under the courtyard ledge (by Double Tap)</li>
        </ul>
      </li>
      <li>Get 6 kills in front of each dragon one at a time.</li>
      <li>
        After each 6th kill, the dragon’s throat will crack open — interact to collect
        your arrow.
      </li>
      <li>
        Once all three arrows are collected, place them in the central pedestal in the
        Pyramid Room.
      </li>
      <li>
        Interact with the pedestal to receive the <em>Base Bow</em>.
      </li>
      <li>
        You can now charge this bow by holding your fire button until it glows.
      </li>
    </ol>
    <p>
      Use this bow to start any of the four upgrade quests (Storm, Fire, Wolf, or Void).
    </p>
  </div>
);

export default BaseBow;
