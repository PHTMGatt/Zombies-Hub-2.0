// 'Parts.tsx'
// -------------

import React from 'react';
import '../styles/pages/Parts.css';

const Parts: React.FC = () => (
  <div className="parts-page">
    <h1 className="parts-page__title">Parts & Equipment</h1>

    <section className="parts-page__section">
      <h2 className="parts-page__subtitle">Rocket Shield</h2>
      <ul className="parts-page__list">
        <li className="parts-page__item">Church: Left side near Speed Cola</li>
        <li className="parts-page__item">Courtyard: By Double Tap/Mystery Box area</li>
        <li className="parts-page__item">Undercroft: Below Knight Room stairs</li>
      </ul>
    </section>

    <section className="parts-page__section">
      <h2 className="parts-page__subtitle">Ragnarok DG-4</h2>
      <ul className="parts-page__list">
        <li className="parts-page__item">Kill a Panzer to drop a part</li>
        <li className="parts-page__item">Use Death Ray and collect the floating part via Wundersphere</li>
        <li className="parts-page__item">
          Wait for a Rocket Test → flip switch near Pack-a-Punch → collect the part in the teleporter
        </li>
      </ul>
    </section>

    <section className="parts-page__section">
      <h2 className="parts-page__subtitle">Golden Plunger (Optional)</h2>
      <ol className="parts-page__list parts-page__list--ordered">
        <li className="parts-page__item">Use Storm Bow to blow open the Clock Tower wall</li>
        <li className="parts-page__item">Place Ragnaroks and activate the switch under the stairs</li>
        <li className="parts-page__item">Listen and stop the clock at 9:35 (use sound cues)</li>
        <li className="parts-page__item">Wall run in the Pyramid Room while zero gravity is on</li>
        <li className="parts-page__item">Pick up the Golden Plunger from the time-travel room table</li>
      </ol>
    </section>

    <section className="parts-page__section">
      <h2 className="parts-page__subtitle">Video Guides</h2>
      <ul className="parts-page__list">
        <li className="parts-page__item">
          <a
            className="parts-page__video-link"
            href="https://www.youtube.com/watch?v=Dg8pX6MwbVo"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch: All Parts Video Guide
          </a>
        </li>
        <li className="parts-page__item">
          <a
            className="parts-page__video-link"
            href="https://www.youtube.com/watch?v=jGSTfe_yc0M"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch: Panzer Helmet Guide
          </a>
        </li>
        <li className="parts-page__item">
          <a
            className="parts-page__video-link"
            href="https://www.youtube.com/watch?v=00sYn4Bj1hM"
            target="_blank"
            rel="noopener noreferrer"
          >
            Watch: Golden Plunger Guide
          </a>
        </li>
      </ul>
    </section>
  </div>
);

export default Parts;
