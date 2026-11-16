import React from "react";
import { Link } from "react-router-dom";
import StaffPage from "../components/StaffPage";
import LightningSwitchBoard from "../components/LightningSwitchBoard";
import ElectricalPanel from "../components/ElectricalPanel";
import originsStaffPages from "../data/originsStaffPages";

// Lightning's puzzle is the piano chords plus the seven switches; the switch board's only home is here.
const LightningStaff = () => (
  <StaffPage
    staff={originsStaffPages.lightning}
    tools={(
      <LightningSwitchBoard
        id="switches"
        showLocations
        extraSlot={(
          <Link to="/maps/origins/speed-run/lightning">
            <strong>Speed Run route →</strong>
            <small>Switch order, turn counts, and skips</small>
          </Link>
        )}
      />
    )}
    extra={<ElectricalPanel />}
  />
);

export default LightningStaff;
