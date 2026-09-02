import React from 'react';
import '../styles/TrophyChallenges.css';

const TrophyChallenges = () => {
  return (
    <main className="rev-page">
      <section className="glass-card trophies-card">
        <h2 className="section-title">Trophy Challenges</h2>
        <p className="section-intro">
          Collect all six silver trophies to proceed with S.O.P.H.I.A.’s tasks.
        </p>
        <div className="trophies-list">
          <div className="trophy-card">
            <h3 className="trophy-title">Gersh Soul/Planet Trophy</h3>
            <p className="trophy-description">
              At Dragon Command entrance, face the statue and shoot its raised hand to reveal the Gersh Soul trophy on the ground.
            </p>
          </div>
          <div className="trophy-card">
            <h3 className="trophy-title">Valkyrie Drone Trophy</h3>
            <p className="trophy-description">
              Use the Guard of Fafnir fireball attack on the exposed pipe outside Double Tap in the Tank Factory to spawn the Valkyrie Drone trophy.
            </p>
          </div>
          <div className="trophy-card">
            <h3 className="trophy-title">Mangler Trophy</h3>
            <p className="trophy-description">
              Activate the laser beam trap in the Supply Depot and wait for it to expire—pick up the Mangler trophy from the newly revealed safe.
            </p>
          </div>
          <div className="trophy-card">
            <h3 className="trophy-title">Group 935 Trophy</h3>
            <p className="trophy-description">
              In the Hatchery sewer, shoot the red light on the ceiling; later return to the Pack-a-Punch toilet to collect the Group 935 trophy.
            </p>
          </div>
          <div className="trophy-card">
            <h3 className="trophy-title">Nuke Trophy</h3>
            <p className="trophy-description">
              From the Supply Depot near Speed Cola, use Dragon Strike on the puddle in the corner to earn the Nuke trophy.
            </p>
          </div>
          <div className="trophy-card">
            <h3 className="trophy-title">Groph Pod Trophy</h3>
            <p className="trophy-description">
              In the Operations Bunker, deploy the Whelp from the Gauntlet of Siegfried, then use the 115 Punch melee attack on the safe to get the Groph Pod trophy.
            </p>
          </div>
        </div>
      </section>
    </main>
  );
};

export default TrophyChallenges;
