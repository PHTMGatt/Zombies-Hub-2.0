import React from "react";
import OGStaffPage from "../components/OGStaffPage";
import IceCode from "../assets/images/ice_staff_code.webp";

// The original Ice Staff page, line for line.
const IceStaff = () => (
  <OGStaffPage
    staff="ice"
    left={[
      {
        title: "Ice Staff Parts",
        items: [
          "1st Part: Random dig spot while it’s snowing (Starting Room)",
          "2nd Part: Random dig spot while it’s snowing (Middle Area)",
          "3rd Part: Random dig spot while it’s snowing (Church Area)",
          "Gramophone: Inside the middle excavation site",
          "Blue Record: In the Ice Tunnel (Right of Church, Gen 6)",
        ],
      },
      {
        title: "Crazy Place & Code",
        items: [
          "Place the Gramophone at the Ice Tunnel (Right of Church, Gen 6)",
          "Enter The Crazy Place",
          "Shoot the Ice Code with Ice Staff",
        ],
        chart: { src: IceCode, alt: "Ice Code", width: 2000, height: 1300 },
      },
    ]}
    right={[
      {
        title: "Ice Staff Upgrade",
        items: [
          "Go back to the main map",
          "Enter the bottom of the Excavation Site",
          "Rotate the rings using levers until they are all BLUE",
          "Use the Ice Staff to shoot the blue orb at the bottom",
          "Go back to the Crazy Place and place the Ice Staff on the blue pedestal",
          "Kill zombies near the pedestal until the staff is upgraded",
        ],
      },
    ]}
  />
);

export default IceStaff;
