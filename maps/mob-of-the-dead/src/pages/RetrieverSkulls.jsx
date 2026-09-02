import React from 'react';
import MobSectionPage from '../components/MobSectionPage';
import { retrieverSteps } from '../data/mobGuide';

export default function RetrieverSkulls() {
  return (
    <MobSectionPage
      kicker="Mob of the Dead"
      title="Hell's Retriever + Skulls"
      description="Feed the three Hellhounds, collect Hell's Retriever, use it to grab the five blue skulls, then complete the spoon/spork setup."
      chips={["3 Hellhounds", '5 blue skulls', "Hell's Retriever"]}
      steps={retrieverSteps}
    />
  );
}
