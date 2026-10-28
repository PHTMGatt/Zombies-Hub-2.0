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
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Ice Staff Parts
            </h2>
            <ul>
              <li><strong>Part 1:</strong> Dig snowy dig sites in the spawn / starting trenches.</li>
              <li><strong>Part 2:</strong> Dig snowy dig sites around the middle / Excavation area.</li>
              <li><strong>Part 3:</strong> Dig snowy dig sites around the Church area.</li>
              <li><strong>Blue Record:</strong> Check the three spawn points inside the Tank Station by Generator 2.</li>
              <li><strong>Crystal:</strong> Take the blue record and Gramophone to the Ice Tunnel by Generator 6, enter the Crazy Place, and collect the blue crystal.</li>
              <li><strong>Build:</strong> Use the blue pedestal beneath the Excavation Site.</li>
            </ul>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Crazy Place & Code
            </h2>
            <ul>
              <li>Return through the Ice Tunnel and enter the Crazy Place with the Ice Staff.</li>
              <li>Use the code chart to match the blue-dot pillar symbol to the correct ceiling stone.</li>
              <li>Shoot each matching ceiling stone with the Ice Staff until the puzzle completes.</li>
            </ul>
            <img src={IceIcon} alt="Ice Code" className="ice-icon" />
          </section>
        </div>

        <div className="right-column">
          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Ice Staff Upgrade
            </h2>
            <ul>
              <li>Find all three gravestones on the main map, freeze each one with the Ice Staff, then shoot the frozen stone with a normal bullet weapon to break it.</li>
              <li>At the Excavation Site, use the four levers to align every ring to BLUE.</li>
              <li>Go below the rings and shoot the blue orb with the Ice Staff.</li>
              <li>Return to the Crazy Place and place the Ice Staff on the blue pedestal.</li>
              <li>Kill zombies around the pedestal until the staff is fully charged, then pick it up.</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IceStaff;
