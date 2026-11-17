import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import { mobPrerequisites } from '../data/mobGuide';
import mobStepDetails from '../data/stepDetails';

// Mob of the Dead "Step details" tab: what the flat main guide leaves out, one section per step (#step-N),
// led by the run requirements the main guide's header and "Before you start" panel used to carry.
export default function MobStepDetails() {
  return (
    <main className="mob-step-details">
      <div className="step-details">
        <h2 className="step-details__title">Before you start</h2>
        <p>Original difficulty only. Solo can go as far as the final flight; the finale needs two or more players.</p>
        <ul>{mobPrerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <StepDetails steps={mobStepDetails} title="Step details" />
    </main>
  );
}
