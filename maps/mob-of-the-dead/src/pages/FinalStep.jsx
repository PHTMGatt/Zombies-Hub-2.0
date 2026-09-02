import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { finalSteps } from '../data/mobGuide';

export default function FinalStep() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Final Afterlife Flight"
      description="Once the code and audio sequence is complete, the rooftop plane becomes the final trigger. No fuel is required for this flight."
      chips={['Co-op required', 'Afterlife flight', 'Weasel showdown']}
      note={{
        label: 'Final requirement',
        body: 'This is the point where a solo run stops. The final bridge fight requires multiple players, and a two- or three-player game needs Weasel present.',
      }}
      steps={finalSteps}
    />
  );
}
