import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import TriviaHover from '../components/TriviaHover';
import '../styles/MobMain.css';

const guideSteps = [
  {
    title: 'Free Blundergat',
    summary: 'Feed all three Cerberus heads, collect the five blue skulls, and pick up your free Blundergat from the Warden’s Office.',
  },
  {
    title: 'Obtain the Spoon',
    summary: 'Destroy the poster in Afterlife, grab the spirit spoon, and confirm with Brutus’s laugh.',
  },
  {
    title: 'Hell’s Redeemer Upgrade',
    summary: 'Throw Retriever into lava, survive a round, and collect the upgraded Hell’s Redeemer.',
  },
  {
    title: 'Listen to the Logs',
    summary: 'Enter Afterlife repeatedly to dial codes (101, 481, 386, 872) and hear all five secret recordings.',
  },
  {
    title: 'Final Showdown',
    summary: 'Board the plane in Afterlife, revive on the island, and choose to break—or continue—the cycle in a climactic battle.',
  },
];

const MobMain = () => (
  <main className="mobmain-page">
    <GuideHero
      kicker="Mob of the Dead"
      title="Pop Goes the Weasel"
      description="A quick, playable overview of the current guide flow. Use the local navigation above when you need the full instructions for a specific objective."
    >
      <GuideChip>Alcatraz</GuideChip>
      <GuideChip>Main Easter Egg</GuideChip>
      <GuideChip>Quick-reference layout</GuideChip>
    </GuideHero>

    <GuideSection
      kicker="Guide Flow"
      title="What do I do next?"
      description="The overview stays intentionally short. Each objective has its own dedicated page so you can get the detail only when you need it."
    >
      <GuideStepList>
        {guideSteps.map((item, index) => (
          <GuideStepCard
            key={item.title}
            step={index + 1}
            label="Objective"
            title={item.title}
            summary={item.summary}
          />
        ))}
      </GuideStepList>
    </GuideSection>

    <GuideSection
      kicker="Extra Context"
      title="Did You Know?"
      description="Optional lore and map notes stay separate from the playable Easter Egg instructions."
      className="mob-trivia-guide-section"
    >
      <div className="trivia-list">
        <TriviaHover
          title="Broken cycle is canon…"
          details="As of Blood of the Dead, the ending where Weasel kills the other mobsters (breaking the cycle) is official lore."
        />
        <TriviaHover
          title="Free Blundergat glitch…"
          details="If you grab the skulls before ever visiting the bridge, they won't spawn until your first trip out."
        />
      </div>
    </GuideSection>
  </main>
);

export default MobMain;
