import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { codeSteps } from '../data/mobGuide';

export default function Codes() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Afterlife Codes + Audio Trail"
      description="After the third bridge trip, enter the fixed code sequence in Afterlife and follow the black-and-white audio trail back through Alcatraz."
      chips={['101 · 386 · 872 · 481', 'Afterlife', '5 audio pickups']}
      note={{
        label: 'Code order',
        body: 'Enter 101, 386, 872, then 481. After the fourth code, revive and follow the audio pickups until the screen returns to color.',
      }}
      steps={codeSteps}
    />
  );
}
