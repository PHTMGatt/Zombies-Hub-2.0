import React from 'react';
import CogGuidePage from '../CogGuidePage';

const CogThree = () => (
  <CogGuidePage
    number="3"
    title="Electrified Zipline Drop"
    description="Charge the Zombie Shield from the completed Trials, electrify the zipline setup, and drop onto the hidden dock for the third cog."
    chips={['All Trials complete', 'Zombie Shield', 'Zipline drop']}
    note={{
      label: 'Failure point',
      body: 'The dangerous part is the drop timing. Missing the hidden dock can down or kill you, so clear the area and set the attempt up before riding.',
    }}
    steps={[
      {
        title: 'Charge the shield',
        summary: 'After completing all three Trials, use the challenge lightning/electric reward to charge the Zombie Shield for this step.',
      },
      {
        title: 'Set the zipline',
        summary: 'Go to the Lab A / Docks zipline and use the electrified-shield setup on the zipline control panel.',
      },
      {
        title: 'Drop onto the hidden dock',
        summary: 'Ride from the Docks side toward Lab A and trigger the drop when you are over the hidden pier.',
        details: [
          'Solo: use the electrified setup, ride the zipline, then melee at the correct point to release onto the dock.',
          'Co-op: one player rides while another activates/electrifies the panel at the correct moment to drop the rider.',
        ],
      },
      {
        title: 'Pick up the cog',
        summary: 'Collect the cog from the hidden dock and return to the main map with the final elevator component.',
      },
    ]}
  />
);

export default CogThree;
