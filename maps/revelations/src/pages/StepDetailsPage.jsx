import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import revStepDetails from '../data/stepDetails';

// Revelations "Step details" tab: what the flat main guide leaves out, one section per step (#step-N).
export default function RevStepDetails() {
  return (
    <div className="rev-page rev-main-guide">
      <StepDetails steps={revStepDetails} title="Step details" />
    </div>
  );
}
