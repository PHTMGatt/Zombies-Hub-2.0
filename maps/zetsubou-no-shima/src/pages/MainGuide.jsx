import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import Footer from '../components/Footer';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { zetsRun } from '../data/zetsRun';
import '../styles/Guide.css';

const BASE = '/maps/zetsubou-no-shima';

const MainGuide = () => {
  const [openStep, setOpenStep] = useState(0);

  return (
    <>
      <Header />
      <main className="zets-main-guide">
        <GuideHero
          kicker="Zetsubou No Shima"
          title="Seeds of Doubt"
          description="A run-first guide rebuilt from the full transcript: setup, Skull of Nan Sapwe, KT-4 / Masamune, all three cogs, elevator descent, and the Giant Thrasher fight in one clean progression."
        >
          <GuideChip>Black Ops III</GuideChip>
          <GuideChip>Trials required</GuideChip>
          <GuideChip>Anywhere But Here! required</GuideChip>
        </GuideHero>

        <GuideCallout label="Before you commit" tone="info" className="zets-guide-note">
          Complete all three Trials, keep a bucket for the colored-water steps, and make sure you have Anywhere But Here! available for the hidden cog room.
        </GuideCallout>

        <GuideSection
          kicker="Run Order"
          title="What do I do next?"
          description="Use the short line while playing. Expand only the step you are currently on when you need the extra detail."
        >
          <GuideStepList>
            {zetsRun.map((step, index) => {
              const isOpen = openStep === index;
              return (
                <button
                  key={step.title}
                  type="button"
                  className={`zets-run-step ${isOpen ? 'is-open' : ''}`}
                  onClick={() => setOpenStep(isOpen ? -1 : index)}
                  aria-expanded={isOpen}
                >
                  <GuideStepCard
                    step={index + 1}
                    label="Main Quest"
                    title={step.title}
                    summary={step.summary}
                  >
                    {isOpen && (
                      <ul className="zets-run-details">
                        {step.details.map((detail) => <li key={detail}>{detail}</li>)}
                      </ul>
                    )}
                  </GuideStepCard>
                </button>
              );
            })}
          </GuideStepList>
        </GuideSection>

        <GuideSection
          kicker="Deep Dives"
          title="Open only what you need"
          description="The original detailed pages stay available as focused references instead of interrupting the main run with walls of text."
          className="zets-reference-section"
        >
          <div className="zets-reference-grid">
            <Link to={`${BASE}/prerequisites`}>Prerequisites</Link>
            <Link to={`${BASE}/reveal-blueprint`}>Blueprint + Elevator</Link>
            <Link to={`${BASE}/cogs`}>Three Cogs</Link>
            <Link to={`${BASE}/buildables`}>Buildables</Link>
            <Link to={`${BASE}/elevator-battle`}>Boss Fight</Link>
            <Link to={`${BASE}/extras`}>Rewards + Extras</Link>
          </div>
        </GuideSection>
      </main>
      <Footer />
    </>
  );
};

export default MainGuide;
