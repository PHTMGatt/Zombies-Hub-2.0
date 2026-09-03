import React from 'react';
import { Link } from 'react-router-dom';
import { mobPrerequisites, mobRun } from '../data/mobGuide';
import '../styles/MobMain.css';

const BASE = '/maps/mob-of-the-dead';

const phases = [
  {
    title: 'Build Icarus + Reach the Bridge',
    summary: `${mobRun[0].summary} ${mobRun[1].summary} ${mobRun[2].summary}`,
    to: `${BASE}/plane`,
    link: 'Plane + Bridge',
  },
  {
    title: "Hell's Retriever + Skulls",
    summary: 'Refuel while feeding the three Hellhounds, collect Hell’s Retriever, grab the five blue skulls, and finish the spoon/spork setup.',
    to: `${BASE}/retriever-skulls`,
    link: 'Retriever + Skulls',
  },
  {
    title: 'Third Trip + Afterlife Codes',
    summary: 'Make the third bridge trip, enter all four prisoner numbers—101, 386, 872, 481—in any order, then follow the black-and-white audio trail through Alcatraz.',
    to: `${BASE}/codes`,
    link: 'Codes + Audio',
  },
  {
    title: 'Final Afterlife Flight',
    summary: 'Take the unfueled rooftop plane in Afterlife, revive on the bridge, then complete the Weasel-versus-mobsters showdown.',
    to: `${BASE}/final-step`,
    link: 'Final Fight',
  },
];

const MobMain = () => (
  <main className="mobmain-page">
    <header className="mob-run-header">
      <div>
        <span>MAIN EASTER EGG</span>
        <h2>Pop Goes the Weasel</h2>
      </div>
      <p>Four phases. Open the focused page only when you reach that part of the run.</p>
    </header>

    <div className="mob-run-alert">
      <strong>Player requirement:</strong>
      <span>{mobPrerequisites.join(' ')}</span>
    </div>

    <ol className="mob-run-flow">
      {phases.map((phase, index) => (
        <li key={phase.title}>
          <span className="mob-run-number">{String(index + 1).padStart(2, '0')}</span>
          <div>
            <h3>{phase.title}</h3>
            <p>{phase.summary}</p>
            <Link to={phase.to}>{phase.link} →</Link>
          </div>
        </li>
      ))}
    </ol>
  </main>
);

export default MobMain;
