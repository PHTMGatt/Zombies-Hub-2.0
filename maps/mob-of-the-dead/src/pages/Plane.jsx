import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { mobRun } from '../data/mobGuide';

export default function Plane() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Plane + Bridge Trips"
      description="Build Icarus once, then use the refuel cycle to make the three required trips without digging through the rest of the quest."
      chips={["5 plane parts", '3 bridge trips', 'Afterlife setup']}
      note={{
        label: 'Run note',
        body: 'In co-op, each player can carry only one plane part at a time. Place parts on the rooftop plane as you collect them.',
      }}
      steps={[mobRun[0], mobRun[1], mobRun[2], mobRun[4], mobRun[7]]}
    />
  );
}
