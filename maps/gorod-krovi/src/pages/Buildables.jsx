import React from 'react';
import buildables from '../data/buildables';
import {
  GuideHero,
  GuideSection,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import '../styles/Buildables.css';

const Buildables = () => (
  <main className="gorod-buildables-page">
    <GuideHero
      kicker="Gorod Krovi"
      title="Buildables + Quest Gear"
      description="Only the gear that matters to Love and War: the Guard of Fafnir, the Dragon Network Controller, and the Gauntlet of Siegfried."
    >
      <GuideChip>Shield</GuideChip>
      <GuideChip>Dragon network</GuideChip>
      <GuideChip>Siegfried</GuideChip>
    </GuideHero>

    <GuideSection
      kicker="Gear Reference"
      title="Build it, then get back to the run"
      description="This page stays intentionally compact so you can find the missing part of your setup without turning the guide into a wiki."
    >
      <div className="gorod-buildables-grid">
        {buildables.map((item, index) => (
          <article className="gorod-buildable-card" key={item.name}>
            <div className="gorod-buildable-card__header">
              <span className="gorod-buildable-card__number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="gorod-buildable-card__type">{item.type}</span>
                <h3>{item.name}</h3>
              </div>
            </div>

            <ol>
              {item.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>

            {item.note && <p className="gorod-buildable-card__note">{item.note}</p>}
          </article>
        ))}
      </div>
    </GuideSection>
  </main>
);

export default Buildables;
