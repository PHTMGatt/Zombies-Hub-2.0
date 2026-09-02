import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { mobPrerequisites, mobRun } from '../data/mobGuide';
import '../styles/MobMain.css';

const BASE = '/maps/mob-of-the-dead';

const phases = [
  {
    title: 'Build Icarus + Reach the Bridge',
    summary: `${mobRun[0].summary} ${mobRun[1].summary} ${mobRun[2].summary}`,
    to: `${BASE}/plane`,
    link: 'Open Plane Guide',
  },
  {
    title: "Hell's Retriever + Skulls",
    summary: 'Refuel while feeding the three Hellhounds, collect Hell’s Retriever, grab the five blue skulls, and finish the spoon/spork setup.',
    to: `${BASE}/retriever-skulls`,
    link: 'Open Retriever + Skulls',
  },
  {
    title: 'Third Trip + Afterlife Codes',
    summary: 'Make the third bridge trip, enter 101 → 386 → 872 → 481 in Afterlife, then follow the black-and-white audio trail back through Alcatraz.',
    to: `${BASE}/codes`,
    link: 'Open Codes + Audio',
  },
  {
    title: 'Final Afterlife Flight',
    summary: 'Take the unfueled rooftop plane in Afterlife, revive on the bridge, then complete the Weasel-versus-mobsters showdown.',
    to: `${BASE}/final-step`,
    link: 'Open Final Fight',
  },
];

const MobMain = () => (
  <main className="mobmain-page">
    <GuideHero
      kicker="Mob of the Dead"
      title="Pop Goes the Weasel"
      description="Use this page as the run roadmap. Open the focused section only when you reach that part of the quest."
    >
      <GuideChip>2+ players to finish</GuideChip>
      <GuideChip>Alcatraz</GuideChip>
    </GuideHero>

    <GuideCallout label="Player requirement" tone="info" className="mob-prereq-callout">
      {mobPrerequisites.join(' ')}
    </GuideCallout>

    <GuideSection kicker="Main Run" title="Four phases">
      <GuideStepList className="zh-guide-step-list--roadmap">
        {phases.map((phase, index) => (
          <GuideStepCard
            key={phase.title}
            step={index + 1}
            label="Main Quest"
            title={phase.title}
            summary={phase.summary}
          >
            <Link className="mob-phase-link" to={phase.to}>{phase.link} →</Link>
          </GuideStepCard>
        ))}
      </GuideStepList>
    </GuideSection>
  </main>
);

export default MobMain;
