import React from "react";
import ReviveIcon from "../assets/images/Skull2.png";
import WindCode from "../assets/images/wind_staff_code.png";
import "../Styles/PageStyles/WindStaff.css";

const WindStaff = () => {
  return (
    <div className="wind-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Build the Wind Staff
            </h2>
            <ol className="staff-step-list">
              <li><strong>Three parts:</strong> enter each Giant Robot through a glowing foot and collect the part from its head — Thor at Spawn, Odin in the middle, and Freya by the church.</li>
              <li><strong>Yellow record:</strong> check by Stamin-Up, the boxes near the Lightning Tunnel, or the table just inside the Lightning Tunnel at Generator 5.</li>
              <li><strong>Crystal:</strong> take the Gramophone + yellow record to the Wind Tunnel near Generator 4, then grab the yellow crystal in the Crazy Place.</li>
              <li><strong>Build:</strong> assemble the staff on the yellow pedestal at the bottom of Excavation.</li>
            </ol>
          </section>

          <section className="staff-section image-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 1 — Wind Code
            </h2>
            <p className="staff-inline-note">In the Crazy Place, shoot the four symbol rings above the Wind portal until they match this fixed arrangement.</p>
            <img src={WindCode} alt="Origins Wind Staff Crazy Place symbol code" className="wind-code" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 2 — Redirect Smoke
            </h2>
            <ol className="staff-step-list">
              <li><strong>Generator 4 / Jug:</strong> shoot the smoking stone so the smoke points toward Excavation.</li>
              <li><strong>Generator 5 / Stamin-Up:</strong> redirect the second smoke plume toward Excavation.</li>
              <li><strong>Behind the church:</strong> follow the muddy tank-return path and redirect the third smoke plume toward Excavation.</li>
            </ol>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 3 — Finish
            </h2>
            <ol className="staff-step-list">
              <li>At the bottom of Excavation, turn every ring light <strong>yellow</strong>.</li>
              <li>Shoot the yellow orb beneath the rings with the Wind Staff.</li>
              <li>Place the staff on the yellow Crazy Place pedestal and kill zombies until it is charged.</li>
              <li>Pick up <strong>Boreas&apos; Fury</strong>.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default WindStaff;
