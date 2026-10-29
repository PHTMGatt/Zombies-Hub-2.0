import React from 'react';
import CogGuidePage from '../CogGuidePage';

const CogTwo = () => (
  <CogGuidePage
    number="2"
    title="AA Cannon Plane"
    description="Grow the artillery-shell plant with the full three-round Blue Water + KT-4/Masamune cycle, load the AA cannon, shoot down the cargo plane, and watch where the cog lands."
    chips={['Blue Water x3 rounds', 'KT-4 / Masamune', 'AA cannon']}
    note={{
      label: 'Important',
      body: 'The artillery-shell plant is not just a Blue Water plant: water it and shoot it once with the KT-4 or Masamune each round for three rounds. If the finished pod does not contain the shell, repeat the plant cycle.',
    }}
    steps={[
      {
        title: 'Grow the artillery-shell plant',
        summary: 'Plant a seed, water it with Blue Water and shoot it once with the KT-4 or Masamune each round for three rounds. Open the finished pod and collect the artillery shell if it spawned.',
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
