import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { codeSteps } from '../data/mobGuide';

export default function Codes() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Afterlife Codes + Audio Trail"
      description="After the third bridge trip, enter all four prisoner numbers in Afterlife and follow the black-and-white audio trail back through Alcatraz."
      chips={['101 · 386 · 872 · 481', 'Any code order', '5 audio pickups']}
      note={{
        label: 'Code rule',
        body: 'All four numbers must be accepted, but they do not have to be entered in a specific order or in one Afterlife session.',
      }}
      steps={codeSteps}
    />
  );
}
