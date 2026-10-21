import React from 'react';
import { GuideRun } from '../../../../shared/ui/GuideRun';
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

const theme = {
  accent: '#ffc940',
  'accent-2': '#e1910f',
  'on-accent': '#1c1202',
  text: '#fff8ea',
  muted: '#e4dccb',
  panel: 'rgba(14, 11, 6, 0.86)',
  line: 'rgba(240, 179, 33, 0.2)',
};

const MobMain = () => (
  <main className="mobmain-page">
    <GuideRun
      runId="mob-of-the-dead"
      title="Pop Goes the Weasel"
      intro="Four phases. Open the focused page only when you reach that part of the run."
      alert={{ label: 'Player requirement', text: mobPrerequisites.join(' ') }}
      phases={phases}
      theme={theme}
    />
  </main>
);

export default MobMain;
