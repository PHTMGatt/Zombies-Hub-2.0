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
      description="The four pieces of gear that matter to the Seeds of Doubt run: Zombie Shield, Gas Mask, KT-4, and the Masamune upgrade."
    >
      <GuideChip>Shield</GuideChip>
      <GuideChip>Gas Mask</GuideChip>
      <GuideChip>KT-4 → Masamune</GuideChip>
    </GuideHero>

    <GuideSection
      kicker="Gear Reference"
      title="Find the missing piece and get back to the run"
      description="Each card separates spawn regions, build/upgrade action, and the reason the item matters later."
    >
      <div className="zets-gear-grid">
        {zetsGear.map((item, index) => (
          <article className="zets-gear-card" key={item.name}>
            <div className="zets-gear-card__header">
              <span className="zets-detail-number">{String(index + 1).padStart(2, '0')}</span>
              <div>
                <span className="zets-gear-card__type">{item.type}</span>
                <h3>{item.name}</h3>
              </div>
            </div>

            <ol className="zets-gear-parts">
              {item.parts.map((part) => <li key={part}>{part}</li>)}
            </ol>

            <p className="zets-gear-build"><strong>Build / Upgrade:</strong> {item.build}</p>
            <p className="zets-gear-note">{item.note}</p>
          </article>
        ))}
      </div>
    </GuideSection>
  </main>
);

export default Buildables;
