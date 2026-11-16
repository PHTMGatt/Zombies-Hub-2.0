import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import soeStepDetails from '../data/stepDetails';

// Shadows of Evil "Step details" tab: what the flat main guide leaves out, one section per step (#step-N),
// including the per-game train-symbol note and the Keeper picker.
export default function SoeStepDetails() {
  return (
    <main className="soe-step-details">
      <div className="step-details">
        <p>Solo can defeat the Shadowman; the final train sequence and full ending require four players.</p>
      </div>
      <StepDetails steps={soeStepDetails} title="Step details" />
    </main>
  );
}
