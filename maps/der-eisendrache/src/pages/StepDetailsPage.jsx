import React from 'react';
import StepDetails from '../../../../shared/guide/StepDetails';
import deStepDetails from '../data/stepDetails';

// Der Eisendrache "Step details" tab: what the flat main guide leaves out, one section per step (#step-N):
// the bow routes, video links and the safe-code note included. Led by the lobby requirement and the
// "Before you start" line the main guide's header used to carry.
export default function DeStepDetails() {
  return (
    <div className="de-step-details">
      <div className="step-details">
        <h2 className="step-details__title">Before you start</h2>
        <p>Ranked/online: one upgraded bow per player. Local/offline or unranked: all four bows.</p>
        <p>Build the Shield / Ragnarok pieces as they become available, and finish your lobby’s bow requirement before the Keeper ritual.</p>
      </div>
      <StepDetails steps={deStepDetails} title="Step details" />
    </div>
  );
}
