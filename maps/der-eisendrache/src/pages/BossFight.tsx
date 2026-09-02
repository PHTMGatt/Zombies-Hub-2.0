import React from 'react';
import { Link } from 'react-router-dom';
import { deGuide } from '../data/deGuide';
import '../styles/pages/BossFight.css';

const BossFight: React.FC = () => (
  <main className="de-boss-page">
    <header className="de-boss-sheet-header">
      <span>Keeper Boss · No Return</span>
      <h2>Boss Fight Survival Sheet</h2>
      <p>Five phases: Keeper → Panzers → Keeper → Panzers → Keeper. Recharge Ragnaroks between every damage window.</p>
    </header>

    <aside className="de-boss-warning">
      <strong>Electrical charge:</strong>
      <span>Plant a Ragnarok beneath the Keeper to interrupt it. If the stun is missed, get behind a blue pillar before the shockwave.</span>
    </aside>

    <section className="de-boss-mechanic">
      <h3>Keeper damage loop</h3>
      <div className="de-boss-mechanic-grid">
        <div><span>1</span><strong>Watch center</strong><p>Wait for the electrical orb/charge beneath the Keeper.</p></div>
        <div><span>2</span><strong>Plant Ragnarok</strong><p>Drop a charged Ragnarok into the orb directly under the Keeper.</p></div>
        <div><span>3</span><strong>Chest opens</strong><p>The successful stun exposes the glowing chest weak point.</p></div>
        <div><span>4</span><strong>Dump damage</strong><p>Unload upgraded bows and your strongest weapons before it closes.</p></div>
      </div>
    </section>

    <section className="de-boss-order">
      <h3>Fight order</h3>
      <div className="de-boss-phase-grid">
        {deGuide.bossFight.map((phase) => (
          <article key={phase.phase} className={phase.title.includes('Panzer') ? 'is-panzer' : ''}>
            <span>{phase.phase}</span>
            <div>
              <h4>{phase.title}</h4>
              <p>{phase.detail}</p>
            </div>
          </article>
        ))}
      </div>
    </section>

    <section className="de-boss-ending">
      <div>
        <h3>After the Keeper</h3>
        <ol>{deGuide.ending.map((step) => <li key={step}>{step}</li>)}</ol>
      </div>
      <details>
        <summary>Need the full boss video?</summary>
        <div className="de-boss-video">
          <iframe
            src="https://www.youtube.com/embed/NhDv6R5YPEs?start=322&rel=0&modestbranding=1"
            title="Der Eisendrache Keeper boss fight reference"
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>
      </details>
    </section>

    <div className="de-boss-backlink"><Link to="/maps/der-eisendrache">← Main Quest</Link></div>
  </main>
);

export default BossFight;
