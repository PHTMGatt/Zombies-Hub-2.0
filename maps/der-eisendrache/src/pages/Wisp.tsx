// 'Wisp.tsx'
// ------------

import React from 'react';
import '../styles/pages/Wisp.css';

const Wisp: React.FC = () => (
  <div className="wisp-page">
    <h1 className="wisp-page__title">Wisp Step – All Spawn Locations</h1>

    <div className="wisp-page__video-embed">
      <iframe
        width="100%"
        height="400"
        src="https://www.youtube.com/embed/NhDv6R5YPEs?start=109&end=150"
        title="Wisp Step Guide – DE"
        frameBorder="0"
        allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
        allowFullScreen
      />
    </div>

    <p className="wisp-page__intro">
      After upgrading your bow (Storm is best), a glowing wisp will spawn in one of eight locations.
      Shoot it with your upgraded bow to proceed. Repeat this four times in one round.
      If you miss or take too long, the step fails and you must restart next round.
    </p>

    <h2 className="wisp-page__subtitle">Wisp Locations:</h2>
    <ol className="wisp-page__list">
      <li className="wisp-page__item"><strong>Radio – Church:</strong> On the table near the crafting bench in the church.</li>
      <li className="wisp-page__item"><strong>Clock – Church:</strong> On the wall left of the Wonderfizz machine.</li>
      <li className="wisp-page__item"><strong>Power Switch:</strong> On the wall just behind the main power switch.</li>
      <li className="wisp-page__item"><strong>Globe – Richtofen’s Room:</strong> On the desk globe in Richtofen’s bedroom.</li>
      <li className="wisp-page__item"><strong>Desk – Above Double Tap:</strong> On the desk with a chalkboard above Double Tap.</li>
      <li className="wisp-page__item"><strong>Car Wheel – Outside Double Tap:</strong> On the broken car’s front wheel nearby.</li>
      <li className="wisp-page__item"><strong>Sink – Quick Revive Room:</strong> On the sink faucet in the starting room.</li>
      <li className="wisp-page__item"><strong>Clock – Bunks Area:</strong> On the desk clock in the underground sleeping area.</li>
    </ol>
  </div>
);

export default Wisp;
