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
import '../styles/pages/BossFight.css';

const BossFight: React.FC = () => (
  <main className="de-boss-page">
    <GuideHero
      kicker="Keeper Boss · No-Return Phase"
      title="Boss Fight Survival Sheet"
      description="Keep this page open once the Ragnaroks hit the Pyramid tiles. The fight is five phases: Keeper, Panzers, Keeper, Panzers, Keeper."
    >
      <GuideChip>5 phases</GuideChip>
      <GuideChip>Ragnarok stun</GuideChip>
      <GuideChip>3 Keeper damage windows</GuideChip>
    </GuideHero>

    <GuideCallout label="Instant-down attack" tone="warning" className="de-boss-critical">
      If the Keeper’s electrical charge is not interrupted with a Ragnarok, get behind one of the blue pillars immediately. The shockwave can down you regardless of perks.
    </GuideCallout>

    <GuideSection
      kicker="The Mechanic"
      title="How every Keeper damage phase works"
      description="Do not waste ammo shooting the Keeper while the chest is closed. The entire fight revolves around creating the damage window."
    >
      <div className="de-boss-mechanic-grid">
        <div><span>1</span><strong>Watch center</strong><p>Look for the electrical orb / charge forming beneath the Keeper.</p></div>
        <div><span>2</span><strong>Plant Ragnarok</strong><p>Place a charged Ragnarok into the orb / directly beneath the Keeper to interrupt and stun it.</p></div>
        <div><span>3</span><strong>Chest opens</strong><p>The Keeper exposes a glowing chest weak point when the stun lands correctly.</p></div>
        <div><span>4</span><strong>Dump damage</strong><p>Unload your strongest weapons and upgraded bows into the open chest until the phase ends.</p></div>
      </div>
    </GuideSection>

    <GuideSection kicker="Fight Order" title="Five phases — no guessing">
      <GuideStepList>
        {deGuide.bossFight.map((phase) => (
          <GuideStepCard
            key={phase.phase}
            step={phase.phase}
            label={`Video ${phase.time}`}
            title={phase.title}
            summary={phase.detail}
            className={phase.title.includes('Panzer') ? 'de-boss-step de-boss-step--panzer' : 'de-boss-step'}
          />
        ))}
      </GuideStepList>
    </GuideSection>

    <GuideSection kicker="Between Damage Windows" title="Panzer control">
      <div className="de-boss-tactic-grid">
        <article>
          <strong>Do not split the arena</strong>
          <p>Keep the team’s attention on the same threats. A loose Panzer behind somebody is more dangerous than a slightly slower kill.</p>
        </article>
        <article>
          <strong>Recharge the Ragnaroks</strong>
          <p>The add phases exist to refill your specialist weapons. Do not enter the next Keeper charge without a ready Ragnarok.</p>
        </article>
        <article>
          <strong>Use the Max Ammo</strong>
          <p>Transition ammo drops are your reset. Reload first, then take the pickup when possible so the next damage phase starts clean.</p>
        </article>
        <article>
          <strong>Expect dogs later</strong>
          <p>Hellhounds add pressure in the later Keeper phases. Clear space before committing to chest damage.</p>
        </article>
      </div>
    </GuideSection>

    <GuideSection kicker="After Phase 5" title="The run is not finished yet">
      <GuideStepList>
        {deGuide.ending.map((step, index) => (
          <GuideStepCard
            key={step}
            step={index + 1}
            label="Ending"
            title={index === 0 ? 'Collect the Summoning Key' : index === 1 ? 'Take it to the Clock Tower terminal' : 'Trigger the final sequence'}
            summary={step}
          />
        ))}
      </GuideStepList>
      <div className="de-boss-backlink">
        <Link to="/maps/der-eisendrache">← Back to Main Quest</Link>
      </div>
    </GuideSection>

    <GuideSection kicker="Video Reference" title="Full boss sequence">
      <div className="de-boss-video">
        <iframe
          src="https://www.youtube.com/embed/NhDv6R5YPEs?start=322&rel=0&modestbranding=1"
          title="Der Eisendrache Keeper boss fight reference"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
        />
      </div>
    </GuideSection>
  </main>
);

export default BossFight;
