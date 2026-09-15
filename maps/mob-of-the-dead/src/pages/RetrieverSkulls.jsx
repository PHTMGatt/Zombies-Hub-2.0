import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { retrieverSteps } from '../data/mobGuide';

export default function RetrieverSkulls() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Hell's Retriever + Skulls + Spoon"
      description="Feed the three Hellhounds, collect Hell's Retriever, grab the five blue skulls for the free Blundergat, then collect the required silver Spoon."
      chips={["3 Hellhounds", '5 blue skulls', 'Silver Spoon required']}
      steps={retrieverSteps}
    />
  );
}
