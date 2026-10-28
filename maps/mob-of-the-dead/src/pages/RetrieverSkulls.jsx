import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { retrieverSteps } from '../data/mobGuide';

export default function RetrieverSkulls() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Hell's Retriever + Skulls + Spoons"
      description="Feed the three Cerberus heads, collect Hell's Retriever, use it to grab the five blue skulls, then complete the two required spoon pickups."
      chips={["3 Cerberus heads", '5 blue skulls', '2 spoons']}
      steps={retrieverSteps}
    />
  );
}
