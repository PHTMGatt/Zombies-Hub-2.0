import React from "react";
import ReviveIcon from "../assets/images/Skull2.png";
import FireCode from "../assets/images/fire_staff_code.png";
import "../Styles/PageStyles/FireStaff.css";

const FireStaff = () => {
  return (
    <div className="fire-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Build the Fire Staff
            </h2>
            <ol className="staff-step-list">
              <li><strong>Generator 6 part:</strong> activate Gen 6, then collect the Fire part from its Rituals of the Ancients reward chest.</li>
              <li><strong>Glowing plane part:</strong> shoot down the orange/red glowing plane. The part lands on the walkway between the Excavation robot footprints.</li>
              <li><strong>Panzer part:</strong> kill the first Panzersoldat, which first appears on round 8.</li>
              <li><strong>Red record:</strong> check the church pews, the boxes by Generator 6, or the boxes between the tank and church stairs.</li>
              <li><strong>Crystal:</strong> take the Gramophone + red record to the Fire Tunnel between Spawn and Generator 3, then grab the red crystal in the Crazy Place.</li>
              <li><strong>Build:</strong> assemble the staff on the red pedestal at the bottom of Excavation.</li>
            </ol>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 1 — Fire Puzzle
            </h2>
            <ol className="staff-step-list">
              <li>Enter the Crazy Place with the Fire Staff.</li>
              <li>Kill zombies on the fire grates until all four nearby cauldrons are burning.</li>
              <li>Go to the church and read the illuminated Fire symbols.</li>
              <li>Use the reference below to convert those symbols, then shoot the matching numbered torches in the church basement with the Fire Staff.</li>
            </ol>
            <p className="staff-inline-note">The torch labels are fixed, but the four torches you shoot depend on the symbols shown in your game. Do not treat 11 · 5 · 9 · 7 · 6 · 3 · 4 as a shoot-in-order code.</p>
            <img src={FireCode} alt="Origins Fire Staff symbol and torch-number reference" className="fire-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 2 — Finish
            </h2>
            <ol className="staff-step-list">
              <li>Go to the bottom of Excavation and use the four levers until every ring light is <strong>red</strong>.</li>
              <li>Shoot the red orb beneath the rings with the Fire Staff.</li>
              <li>Return to the Crazy Place and place the staff on the red pedestal.</li>
              <li>Kill zombies in the Crazy Place until the HUD shows the staff is charged, then pick up <strong>Kagutsuchi&apos;s Blood</strong>.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default FireStaff;
