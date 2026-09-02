import React from 'react';
import CogGuidePage from '../CogGuidePage';

const CogOne = () => (
  <CogGuidePage
    number="1"
    title="Anywhere But Here! Room"
    description="The cleanest cog: once the elevator quest is active, use the required GobbleGum to reach the hidden room and take the cog."
    chips={['Anywhere But Here!', 'Hidden room', 'Fast pickup']}
    note={{
      label: 'Requirement',
      body: 'Bring Anywhere But Here! into the game before you reach this point. Without it, you cannot complete the full Easter Egg run.',
    }}
    steps={[
      {
        title: 'Activate the elevator quest',
        summary: 'Reveal the hidden blueprint and elevator machinery with the Skull of Nan Sapwe so the three-cog objective is active.',
      },
      {
        title: 'Use Anywhere But Here!',
        summary: 'Trigger the GobbleGum to reach the hidden cog room above the Lab A side of the map.',
      },
      {
        title: 'Grab the cog',
        summary: 'Pick up the cog from inside the hidden room, then exit and continue routing the other two cog objectives.',
      },
    ]}
  />
);

export default CogOne;
