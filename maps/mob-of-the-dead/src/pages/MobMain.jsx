// src/pages/MobMain.jsx
import React from 'react';
import '../styles/MobMain.css';
import TriviaHover from '../components/TriviaHover';

const MobMain = () => (
  <main className="mobmain-page">
    {/* Intro */}
    <section className="intro">
      <h2>Welcome to Mob of the Dead</h2>
      <p>
        Pop Goes the Weasel is the ultimate Easter Egg in Alcatraz. Follow these five
        steps in order to unlock powerful weapons, secret audio logs, and the final showdown.
      </p>
    </section>

    {/* Steps overview */}
    <section className="overview-steps">
      <ol>
        <li>
          <strong>Free Blundergat:</strong> Feed all three Cerberus heads, collect the
          five blue skulls, and pick up your free Blundergat from the Warden’s Office.
        </li>
        <li>
          <strong>Obtain the Spoon:</strong> Destroy the poster in Afterlife,
          grab the spirit spoon, and confirm with Brutus’s laugh.
        </li>
        <li>
          <strong>Hell’s Redeemer Upgrade:</strong> Throw Retriever into lava,
          survive a round, and collect the upgraded Hell’s Redeemer.
        </li>
        <li>
          <strong>Listen to the Logs:</strong> Enter Afterlife repeatedly to dial codes
          (101, 481, 386, 872) and hear all five secret recordings.
        </li>
        <li>
          <strong>Final Showdown:</strong> Board the plane in Afterlife, revive on the
          island, and choose to break—or continue—the cycle in a climactic battle.
        </li>
      </ol>
    </section>

    {/* Trivia hovers */}
    <section className="trivia-section">
      <h3>Did You Know?</h3>
      <div className="trivia-list">
        <TriviaHover
          title="Broken cycle is canon…"
          details="As of Blood of the Dead, the ending where Weasel kills the other mobsters (breaking the cycle) is official lore."
        />
        <TriviaHover
          title="Free Blundergat glitch…"
          details="If you grab the skulls before ever visiting the bridge, they won't spawn until your first trip out."
        />
      </div>
    </section>
  </main>
);

export default MobMain;
