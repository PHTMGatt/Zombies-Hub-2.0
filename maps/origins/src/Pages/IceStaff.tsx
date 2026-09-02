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
              <li>1st Part: Random dig spot while it’s snowing (Starting Room)</li>
              <li>2nd Part: Random dig spot while it’s snowing (Middle Area)</li>
              <li>3rd Part: Random dig spot while it’s snowing (Church Area)</li>
              <li>Gramophone: Inside the middle excavation site</li>
              <li>Blue Record: In the Ice Tunnel (Right of Church, Gen 6)</li>
            </ul>
          </section>

          <section className="staff-section">
            <h2>
              <img src={ReviveIcon} className="revive-icon" alt="Revive Icon" /> Crazy Place & Code
            </h2>
            <ul>
              <li>Place the Gramophone at the Ice Tunnel (Right of Church, Gen 6)</li>
              <li>Enter The Crazy Place</li>
              <li>Shoot the Ice Code with Ice Staff</li>
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
              <li>Go back to the main map</li>
              <li>Enter the bottom of the Excavation Site</li>
              <li>Rotate the rings using levers until they are all BLUE</li>
              <li>Use the Ice Staff to shoot the blue orb at the bottom</li>
              <li>Go back to the Crazy Place and place the Ice Staff on the blue pedestal</li>
              <li>Kill zombies near the pedestal until the staff is upgraded</li>
            </ul>
          </section>
        </div>
      </div>
    </div>
  );
};

export default IceStaff;
