import React, { useState } from 'react';
import {
  GuideHero,
  GuideSection,
  GuideCallout,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { gorodChallenges, gorodTrophies } from '../data/gorodRun';
import '../styles/TrophyChallenges.css';

const TrophyChallenges = () => {
  const [view, setView] = useState('trophies');

  return (
    <main className="gorod-trophies-page">
      <GuideHero
        kicker="Gorod Krovi"
        title="Trophies + S.O.P.H.I.A. Challenges"
        description="Keep the two most location-heavy parts of Love and War in one focused reference instead of burying them inside the main run."
      >
        <GuideChip>6 trophies</GuideChip>
        <GuideChip>6 challenges</GuideChip>
        <GuideChip>Randomized challenge order</GuideChip>
      </GuideHero>

      <div className="gorod-reference-toggle" role="tablist" aria-label="Gorod Krovi reference type">
        <button
          type="button"
          role="tab"
          aria-selected={view === 'trophies'}
          className={view === 'trophies' ? 'is-active' : ''}
          onClick={() => setView('trophies')}
        >
          Six Trophies
        </button>
        <button
          type="button"
          role="tab"
          aria-selected={view === 'challenges'}
          className={view === 'challenges' ? 'is-active' : ''}
          onClick={() => setView('challenges')}
        >
          S.O.P.H.I.A. Challenges
        </button>
      </div>

      {view === 'trophies' ? (
        <GuideSection
          kicker="Silver Trophies"
          title="Collect all six"
          description="After KRONOS, gather the full set and place the trophies into the Dragon Command challenge board."
        >
          <div className="gorod-trophy-grid">
            {gorodTrophies.map((trophy, index) => (
              <article className="gorod-reference-card" key={trophy.location}>
                <span className="gorod-reference-number">{String(index + 1).padStart(2, '0')}</span>
                <div>
                  <h3>{trophy.location}</h3>
                  <p>{trophy.method}</p>
                </div>
              </article>
            ))}
          </div>
        </GuideSection>
      ) : (
        <>
          <GuideCallout label="Important" tone="info" className="gorod-challenge-note">
            The five main challenge types can appear in a different order. The motherboard lockdown is the final challenge in the walkthrough sequence.
          </GuideCallout>

          <GuideSection
            kicker="Challenge Board"
            title="Recognize the task, then execute"
            description="Each card gives you the objective and the one thing most likely to make the challenge fail."
          >
            <div className="gorod-challenge-grid">
              {gorodChallenges.map((challenge, index) => (
                <article className="gorod-reference-card gorod-challenge-card" key={challenge.title}>
                  <span className="gorod-reference-number">{String(index + 1).padStart(2, '0')}</span>
                  <div>
                    <h3>{challenge.title}</h3>
                    <p>{challenge.objective}</p>
                    <span className="gorod-reference-tip">Tip: {challenge.tip}</span>
                  </div>
                </article>
              ))}
            </div>
          </GuideSection>
        </>
      )}
    </main>
  );
};

export default TrophyChallenges;
