import React from 'react';
import '../styles/MainGuide.css';

const MainGuide = () => (
  <main className="main-guide-page">
    <article className="glass-card main-guide-card">
      <h1 className="main-guide-title">Love and War</h1>
      <p className="main-guide-subtext">
        Love and War is the main Easter Egg on Gorod Krovi in Call of Duty: Black Ops III. While complex and multi-phased, it can be completed solo or co-op — teamwork helps speed up its randomized challenges.
      </p>

      <section id="prerequisites">
        <h3>Prerequisites</h3>
        <ul>
          <li>Turn on the Power</li>
          <li>Build the Guard of Fafnir</li>
          <li>Assemble the Dragon Network Controller</li>
          <li>Obtain the Dragon Strike</li>
          <li>Obtain the Gauntlet of Siegfried</li>
          <li>Optional: Complete Dragon Wings & Mangler Helmet challenges</li>
        </ul>
      </section>

      <section id="step-1">
        <h3>Step 1: Power Up & Obtain Dragon Egg</h3>
        <p>
          In the Hatchery basement, destroy a Valkyrie Drone near the covered generator (under a green/black tarp) to activate it. Then shoot down the green-scaled Dragon Egg on the rafters, pick it up, and place it in any Nest to begin incubation. This also starts a 5-minute timer for Step 2.
        </p>
        <p>
          <strong>Advanced method:</strong> On Round 3, power on at Dragon Command and interact with S.O.P.H.I.A. early so Code Cylinders drop sooner. By Round 6–7, retrieve and nest the Egg; complete Gauntlet of Siegfried trials by Round 10–11 for optimal pacing.
        </p>
      </section>

      <section id="step-2">
        <h3>Step 2: Interact with Valves</h3>
        <p>
          There are six valves around the map—one whistles and holds the Master Code Cylinder. Leave the whistling valve untouched (green), rotate the other five until they glow blue (air flowing), then retrieve the cylinder and return it to S.O.P.H.I.A.
        </p>
      </section>

      <section id="step-3">
        <h3>Step 3: Crack S.O.P.H.I.A.’s Code</h3>
        <p>
          Spell “KRONOS” by shooting each letter on the spin wheels (avoid the centers), then press the interact button. If incorrect, wait for the next round to retry.
        </p>
      </section>

      <section id="step-4">
        <h3>Step 4: Collect Six Silver Trophies</h3>
        <ul>
          <li><strong>Gersh Soul/Planet Trophy:</strong> Shoot the right-hand statue at Dragon Command entrance.</li>
          <li><strong>Valkyrie Drone Trophy:</strong> Use Guard of Fafnir fireball on the Tank Factory pipe outside Double Tap.</li>
          <li><strong>Mangler Trophy:</strong> Let the Supply Depot laser trap expire; pick up the revealed trophy.</li>
          <li><strong>Group 935 Trophy:</strong> In the sewer pipe, shoot the red light; later check the Pack-a-Punch toilet.</li>
          <li><strong>Nuke Trophy:</strong> Dragon Strike the puddle outside Supply Depot near Speed Cola.</li>
          <li><strong>Groph Pod Trophy:</strong> Punch the safe in Operations Bunker with the Gauntlet’s 115 Punch (after launching the Whelp).</li>
        </ul>
      </section>

      <section id="step-5">
        <h3>Step 5: S.O.P.H.I.A.’s Six Tasks</h3>
        <ol>
          <li><strong>Simon Says Boom!</strong> Defuse bombs in the slow flash order within the time limit.</li>
          <li><strong>Capture Gersh:</strong> Shoot the yellow orb until it glows purple; follow it to Dragon Command.</li>
          <li><strong>Escort the Mangler:</strong> Guide the green-eyed Mangler to the pad without killing it.</li>
          <li><strong>Escort the Valkyrie Drone:</strong> Stay close and lead the damaged drone through its path.</li>
          <li><strong>Protect the Groph Pod:</strong> Defend the pod (no zombies spawn solo), then send the Whelp to retrieve cargo.</li>
          <li><strong>Information Download:</strong> Use the key card in the Hatchery terminal, survive the Mangler lockdown, then return the card to S.O.P.H.I.A.</li>
        </ol>
      </section>

      <section id="step-6">
        <h3>Step 6: Free Original Nikolai</h3>
        <p>
          Interact with S.O.P.H.I.A. to receive the power core. In Belinski Square, launch the Whelp at Nikolai’s mech to install it, then return to S.O.P.H.I.A. to detach and trigger the boss fight.
        </p>
      </section>

      <section id="step-7">
        <h3>Step 7: The Boss Fight</h3>
        <p>
          See the dedicated Boss Fight section for detailed phase-by-phase strategy.
        </p>
      </section>
    </article>
  </main>
);

export default MainGuide;
