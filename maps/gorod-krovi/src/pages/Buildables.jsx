import React from 'react';
import buildables from '../data/buildables';
import '../styles/Buildables.css';

const Buildables = () => (
  <main className="gorod-buildables-page">
    <header className="gorod-sheet-header">
      <span>Quest Gear</span>
      <h2>Buildables + Gear</h2>
      <p>Only the equipment that matters to Love and War. Find the piece you need, build it, and get back to the run.</p>
    </header>

    <div className="gorod-buildables-grid">
      {buildables.map((item, index) => (
        <section className="gorod-buildable-card" key={item.name}>
          <div className="gorod-buildable-card__header">
            <span className="gorod-buildable-card__number">{index + 1}</span>
            <div>
              <span className="gorod-buildable-card__type">{item.type}</span>
              <h3>{item.name}</h3>
            </div>
          </div>

          <ol>
            {item.steps.map((step) => <li key={step}>{step}</li>)}
          </ol>

          {item.note && <p className="gorod-buildable-card__note">{item.note}</p>}
        </section>
      ))}
    </div>
  </main>
);

export default Buildables;
