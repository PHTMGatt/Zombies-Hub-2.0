import React from "react";
import StepDetails from "../../../../shared/guide/StepDetails";
import originsStepDetails from "../data/stepDetails";

// Origins "Step details" tab: what the flat main guide leaves out, one section per step (#step-N).
const OriginsStepDetails = () => (
  <div className="origins-guide">
    <div className="origins-guide__inner">
      <StepDetails steps={originsStepDetails} title="Step details" />
    </div>
  </div>
);

export default OriginsStepDetails;
