import React from 'react';
import CogGuidePage from '../CogGuidePage';

const CogTwo = () => (
  <CogGuidePage
    number="2"
    title="AA Cannon Plane"
    description="Grow the artillery-shell plant, load the AA cannon, shoot down the cargo plane, and watch where the cog lands."
    chips={['Plant step', 'Artillery shell', 'AA cannon']}
    note={{
      label: 'Important',
      body: 'If you miss the cargo plane shot, you need another artillery shell. Watch the plane and the falling cog carefully so you do not waste time searching the wrong area.',
    }}
    steps={[
      {
        title: 'Grow the artillery-shell plant',
        summary: 'Use the required plant setup and KT-4 / Masamune progression to produce the artillery shell for the AA cannon.',
      },
      {
        title: 'Load the AA cannon',
        summary: 'Take the shell to the large Anti-Aircraft gun and load it before the cargo plane makes its pass.',
      },
      {
        title: 'Shoot down the cargo plane',
        summary: 'Fire the AA cannon when the plane is in position, then immediately watch the falling cog.',
        details: [
          'Possible landing area: outside the bunker.',
          'Possible landing area: Green Water side.',
          'Possible landing area: Blue Water side near the spider cage.',
        ],
      },
      {
        title: 'Recover the cog',
        summary: 'Go to the landing area you saw and pick up the cog before moving on to the elevator.',
      },
    ]}
  />
);

export default CogTwo;
