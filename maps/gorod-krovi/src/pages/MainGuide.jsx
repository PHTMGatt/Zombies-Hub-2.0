import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  GuideHero,
  GuideSection,
  GuideStepList,
  GuideStepCard,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { gorodPrerequisites, gorodRun } from '../data/gorodRun';
import '../styles/MainGuide.css';

const BASE = '/maps/gorod-krovi';

const MainGuide = () => {
  const [openStep, setOpenStep] = useState(0);

  return (
    <main className="gorod-main-guide">
      <GuideHero
        kicker="Gorod Krovi"
        title="Love and War"
        description="A run-first version of the Easter Egg built from the full solo walkthrough: Dragon Network, Dragon Strike, egg and Gauntlet, valves, KRONOS, trophies, S.O.P.H.I.A. challenges, and both boss phases."
      >
        <GuideChip>Solo + Co-op</GuideChip>
        <GuideChip>Stalingrad</GuideChip>
        <GuideChip>Main Easter Egg</GuideChip>
      </GuideHero>

      <GuideCallout label="Before you start" tone="info" className="gorod-guide-note">
        <ul className="gorod-prereq-list">
          {gorodPrerequisites.map((item) => <li key={item}>{item}</li>)}
        </ul>
      </GuideCallout>

      <GuideSection
        kicker="Run Order"
        title="What do I do next?"
        description="The main page now stays short enough to use during a game. Open the current objective only when you need its extra setup details."
      >
        <GuideStepList>
          {gorodRun.map((step, index) => {
            const isOpen = openStep === index;

            return (
              <button
                key={step.title}
                type="button"
                className={`gorod-run-step ${isOpen ? 'is-open' : ''}`}
                onClick={() => setOpenStep(isOpen ? -1 : index)}
                aria-expanded={isOpen}
              >
                <GuideStepCard
                  step={index + 1}
                  label={index >= 8 ? 'Boss Fight' : 'Main Quest'}
                  title={step.title}
                  summary={step.summary}
                >
                  {isOpen && (
                    <ul className="gorod-step-details">
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
        kicker="Quick Tools"
        title="Open the detailed section only when needed"
        description="Keep the main run clean; use these for the randomized or location-heavy parts."
        className="gorod-tools-section"
      >
        <div className="gorod-tool-grid">
          <Link to={`${BASE}/valves`}>
            <strong>Valve Solver</strong>
            <span>Set the six valve dials from your green-light and cylinder locations.</span>
          </Link>
          <Link to={`${BASE}/trophies`}>
            <strong>Trophies + Challenges</strong>
            <span>Six trophy locations and the S.O.P.H.I.A. challenge references.</span>
          </Link>
          <Link to={`${BASE}/buildables`}>
            <strong>Buildables</strong>
            <span>Shield and supporting buildable references without interrupting the run.</span>
          </Link>
          <Link to={`${BASE}/boss`}>
            <strong>Boss Fight</strong>
            <span>Dragon and Nikolai phases in one focused battle page.</span>
          </Link>
        </div>
      </GuideSection>
    </main>
  );
};

export default MainGuide;
