import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import { gorodPrerequisites } from '../data/gorodRun';
import gorodStepDetails from '../data/stepDetails';

// Love and War "Step details" tab: what the flat main guide leaves out, one section per step (#step-N),
// led by the "Before you start" list the main guide used to carry.
export default function GorodStepDetails() {
  return (
    <main className="gorod-step-details">
      <div className="step-details">
        <h2 className="step-details__title">Before you start</h2>
        <ul>{gorodPrerequisites.map((item) => <li key={item}>{item}</li>)}</ul>
      </div>
      <StepDetails steps={gorodStepDetails} title="Step details" />
    </main>
  );
}
