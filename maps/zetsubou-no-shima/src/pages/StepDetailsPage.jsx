import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import zetsStepDetails from '../data/stepDetails';

// Zetsubou "Step details" tab: what the flat main guide leaves out, one section per step (#step-N).
export default function ZetsStepDetails() {
  return (
    <main className="zets-step-details">
      <div className="step-details">
        <p>Every player must finish all three of their own Trials — Cog 3 depends on it.</p>
      </div>
      <StepDetails steps={zetsStepDetails} title="Step details" />
    </main>
  );
}
