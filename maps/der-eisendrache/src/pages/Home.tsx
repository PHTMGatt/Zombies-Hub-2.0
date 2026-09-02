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
        description="Use this page as the full-run roadmap. Open Bows, Wisps, Gear, or Boss only when that phase starts."
      >
        <GuideChip>Solo + Co-op</GuideChip>
        <GuideChip>Black Ops III</GuideChip>
      </GuideHero>

      <GuideCallout label="Run setup">
        Feed all three dragons, collect the Wrath of the Ancients, start the Shield/Ragnarok parts early, and choose the bow upgrade(s) your lobby needs.
      </GuideCallout>

      <GuideSection kicker="Main Run" title="Five phases">
        <GuideStepList>
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

      <GuideSection kicker="Focused Guides" title="Open the detail only when you need it">
        <div className="de-quick-links">
          <Link to={`${BASE}/bows`}>Bows <span>Base + all four upgrades</span></Link>
          <Link to={`${BASE}/wisp`}>Wisps <span>Both wisp cycles + locations</span></Link>
          <Link to={`${BASE}/parts`}>Gear <span>Shield + Ragnarok DG-4</span></Link>
          <Link to={`${BASE}/boss`}>Boss <span>Keeper fight + ending</span></Link>
        </div>
      </GuideSection>
    </main>
  );
};

export default Home;
