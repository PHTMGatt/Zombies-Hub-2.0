import React from 'react';
import '../styles/pages/Parts.css';

const shieldZones = [
  {
    title: 'Lower Courtyard / Gate Trap',
    spots: ['Crates past the Gate Trap', 'Lower stair / Landing Pad area', 'Stairs toward Death Ray / Bastion'],
  },
  {
    title: 'Clock Tower / Mission Control',
    spots: ['Crates/wall near Mission Control entrance', 'Seated corpse / desk in Clock Tower area', 'Lower side of Clock Tower stairs'],
  },
  {
    title: 'Undercroft — Anti-Gravity',
    spots: ['Above the Pack-a-Punch teleporter position', 'Above the Rocket Test teleporter doorway', 'High on Pyramid metalwork / above a bow altar'],
  },
];

const ragnarokSteps = [
  ['Panzer Part', 'Kill the first Panzersoldat and collect the dropped Ragnarok part.'],
  ['Death Ray Part', 'Activate the Death Ray, then use the correct Wundersphere route to catch the floating part above the Bastion.'],
  ['Rocket Test Part', 'During a Rocket Test, arm the stair switch, survive in the bunker, then interact with the green teleporter console to spawn the part.'],
  ['Build It', 'Take all three pieces to a workbench. Make sure every player has Ragnaroks before the boss-entry tiles.'],
];

const Parts: React.FC = () => (
  <main className="de-parts-page">
    <header className="de-sheet-header">
      <span>Gear & Buildables</span>
      <h2>Shield + Ragnarok DG-4</h2>
      <p>Grab the setup you need and get back to the Easter Egg. The Ragnaroks are required for boss entry; the Shield is worth building early.</p>
    </header>

    <section className="de-gear-section">
      <div className="de-gear-section__title">
        <h3>Rocket Shield</h3>
        <span>3 parts · 3 zones</span>
      </div>
      <div className="de-parts-zone-grid">
        {shieldZones.map((zone, index) => (
          <article key={zone.title} className="de-parts-zone-card">
            <span className="de-parts-zone-card__number">{index + 1}</span>
            <div>
              <h4>{zone.title}</h4>
              <ul>{zone.spots.map((spot) => <li key={spot}>{spot}</li>)}</ul>
            </div>
          </article>
        ))}
      </div>
      <p className="de-inline-note"><strong>Build bench:</strong> Church, Gatehouse / above Double Tap, or the Undercroft.</p>
    </section>

    <section className="de-gear-section">
      <div className="de-gear-section__title">
        <h3>Ragnarok DG-4</h3>
        <span>Required for boss entry</span>
      </div>
      <div className="de-ragnarok-grid">
        {ragnarokSteps.map(([title, body], index) => (
          <article key={title} className="de-ragnarok-step">
            <span>{index + 1}</span>
            <div><h4>{title}</h4><p>{body}</p></div>
          </article>
        ))}
      </div>
    </section>

    <section className="de-gear-section de-setup-strip">
      <div><strong>Low Gravity</strong><span>Stand on all four Pyramid floor plates so anti-gravity cycles become available.</span></div>
      <div><strong>Pack-a-Punch</strong><span>Move the three teleporter pieces into position early so weapon upgrades are ready before the boss.</span></div>
      <a href="https://www.youtube.com/watch?v=jGSTfe_yc0M" target="_blank" rel="noopener noreferrer">Panzer Helmet ↗</a>
      <a href="https://www.youtube.com/watch?v=00sYn4Bj1hM" target="_blank" rel="noopener noreferrer">Golden Plunger ↗</a>
    </section>
  </main>
);

export default Parts;
