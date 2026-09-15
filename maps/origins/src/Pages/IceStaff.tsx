import React from "react";
import ReviveIcon from "../assets/images/Skull2.png";
import IceIcon from "../assets/images/ice_staff_code.png";
import "../Styles/PageStyles/IceStaff.css";

const IceStaff = () => {
  return (
    <div className="ice-staff">
      <div className="staff-grid">
        <div className="left-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Build the Ice Staff
            </h2>
            <ol className="staff-step-list">
              <li><strong>Blue record:</strong> check the three shelves/tables inside the Generator 2 Tank Station.</li>
              <li><strong>Three parts:</strong> dig while it is snowing. You need one part from the Spawn side, one from No Man&apos;s Land / the middle, and one from the Church side.</li>
              <li><strong>Crystal:</strong> take the Gramophone + blue record to the Ice Tunnel behind the church near Generator 6, then grab the blue crystal in the Crazy Place.</li>
              <li><strong>Build:</strong> assemble the staff on the blue pedestal at the bottom of Excavation.</li>
            </ol>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 1 — Ice Code
            </h2>
            <ol className="staff-step-list">
              <li>Enter the Crazy Place through the Ice portal.</li>
              <li>Read the dot symbol on the wall and shoot the matching symbol on the ceiling.</li>
              <li>Repeat until the ceiling puzzle completes.</li>
            </ol>
            <img src={IceIcon} alt="Origins Ice Staff dot-to-symbol code" className="ice-icon" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 2 — Tombstones
            </h2>
            <ol className="staff-step-list">
              <li><strong>Generator 4:</strong> freeze the gravestone outside the map near the Gen 4 / Jug footprint area, then break it with a bullet weapon.</li>
              <li><strong>Excavation footprint:</strong> freeze the gravestone beside the footprint/soul-box area near the mound, then break it with a bullet weapon.</li>
              <li><strong>Behind Generator 2:</strong> find the gravestone by the downed robot hand on the muddy tank path, freeze it, then break it with a bullet weapon.</li>
            </ol>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="" /> Upgrade 3 — Finish
            </h2>
            <ol className="staff-step-list">
              <li>At the bottom of Excavation, turn every ring light <strong>blue</strong>.</li>
              <li>Shoot the blue orb beneath the rings with the Ice Staff.</li>
              <li>Place the staff on the blue Crazy Place pedestal and kill zombies until it is charged.</li>
              <li>Pick up <strong>Ull&apos;s Arrow</strong>.</li>
            </ol>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IceStaff;
