import React from 'react';
import {
  GuideHero,
  GuideSection,
  GuideChip,
} from '../../../../shared/ui/GuideLayout';
import { zetsGear } from '../data/zetsGear';
import '../styles/Buildables.css';

const Buildables = () => (
  <main className="zets-buildables-page">
    <GuideHero
      kicker="Zetsubou No Shima"
      title="Buildables + Wonder Weapon"
      description="Open only the piece you need: Zombie Shield, Gas Mask, KT-4, or the Masamune upgrade."
    >
      <GuideChip>Shield</GuideChip>
      <GuideChip>Gas Mask</GuideChip>
      <GuideChip>KT-4 → Masamune</GuideChip>
    </GuideHero>

    <GuideSection
      kicker="Gear Reference"
      title="Find the missing piece and get back to the run"
      description="Each section keeps spawn regions, the build action, and the important run note together."
    >
      <div className="zets-gear-grid">
        {zetsGear.map((item, index) => (
          <details className="zets-gear-card" key={item.name} open={index === 0}>
            <summary className="zets-gear-card__header">
              <span className="zets-detail-number">{String(index + 1).padStart(2, '0')}</span>
              <div className="zets-gear-card__identity">
                <span className="zets-gear-card__type">{item.type}</span>
                <h3>{item.name}</h3>
              </div>
              <span className="zets-gear-card__toggle" aria-hidden="true">+</span>
            </summary>

            <div className="zets-gear-card__body">
              <ol className="zets-gear-parts">
                {item.parts.map((part) => <li key={part}>{part}</li>)}
              </ol>

              <p className="zets-gear-build"><strong>Build / Upgrade:</strong> {item.build}</p>
              <p className="zets-gear-note">{item.note}</p>
            </div>
          </details>
        ))}
      </div>
    </GuideSection>
  </main>
);

export default Buildables;
