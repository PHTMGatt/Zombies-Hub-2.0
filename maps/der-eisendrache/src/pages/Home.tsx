import React from 'react';
import { Link } from 'react-router-dom';
import {
  GuideCallout,
  GuideChip,
  GuideHero,
  GuideSection,
  GuideStepCard,
  GuideStepList,
} from '../../../../shared/ui/GuideLayout';
import { deGuide } from '../data/deGuide';
import '../styles/pages/Home.css';

const BASE = '/maps/der-eisendrache';

const Home: React.FC = () => {
  return (
    <main className="de-home-page">
      <GuideHero
        kicker="Der Eisendrache"
        title="My Brother’s Keeper"
        description="Five major phases. Open Bows, Wisps, Gear, or Boss only when that part of the run starts."
      >
        <GuideChip>Solo + Co-op</GuideChip>
      </GuideHero>

      <GuideCallout label="Run setup">
        Feed all three dragons, collect Wrath of the Ancients, start Shield/Ragnarok parts early, and choose the bow upgrade(s) your lobby needs.
      </GuideCallout>

      <GuideSection kicker="Main Run" title="Five phases">
        <GuideStepList className="zh-guide-step-list--roadmap">
          {deGuide.phases.map((phase, index) => (
            <GuideStepCard
              key={phase.id}
              step={index + 1}
              label={phase.kicker}
              title={phase.title}
              summary={phase.summary}
            />
          ))}
        </GuideStepList>
      </GuideSection>

      <GuideSection kicker="Focused Guides" title="Open only what you need">
        <div className="de-quick-links">
          <Link to={`${BASE}/bows`}>Bows <span>Base + four upgrades</span></Link>
          <Link to={`${BASE}/wisp`}>Wisps <span>Both cycles + locations</span></Link>
          <Link to={`${BASE}/parts`}>Gear <span>Shield + Ragnarok DG-4</span></Link>
          <Link to={`${BASE}/boss`}>Boss <span>Keeper fight + ending</span></Link>
        </div>
      </GuideSection>
    </main>
  );
};

export default Home;
