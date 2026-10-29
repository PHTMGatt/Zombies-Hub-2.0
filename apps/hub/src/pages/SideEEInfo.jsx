import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import sideEEArtwork from '../data/sideEEArtwork';
import sideEEs from '../data/sideEE';
import SideEECard from '../components/SideEECard';
import NotFound from '../../../../shared/ui/NotFound';
import '../styles/SideEE/SideEEInfo.css';

const SIDE_EE_META = {
  'origins-speedrun': { label: 'Origins Speed Run', artwork: sideEEArtwork['origins-speedrun'] },
  kino: {
    label: 'Kino der Toten',
    artwork: sideEEArtwork.kino,
    reelsIntro: 'Three film reels spawn randomly in these rooms after you teleport to Pack-a-Punch:',
    reels: [
      'Samantha’s Room – on the table, bed, or leaning against the rocking chair.',
      'Dentist’s Office – on the cart next to the chair or on one of the two counters.',
      'Conference Room – on the TV, under the projector, or on the table in front of you.',
    ],
    radiosIntro: 'Two hidden radios can be activated by shooting or explosive-activating:',
    radios: [
      'Radio 1 – inside the theater chandelier.',
      'Radio 2 – atop the tower visible from the alley by the Double Tap Root Beer perk machine.',
    ],
  },
  gk: { label: 'Gorod Krovi', artwork: sideEEArtwork.gk },
  de: { label: 'Der Eisendrache', artwork: sideEEArtwork.de },
  soe: { label: 'Shadows of Evil', artwork: sideEEArtwork.soe },
};

export default function SideEEInfo() {
  const { mapKey } = useParams();
  const meta = SIDE_EE_META[mapKey];
  const entries = sideEEs[mapKey] || [];

  if (!meta) {
    return (
      <NotFound />
    );
  }

  // The speed run moved into the Origins guide; keep the old address working.
  if (mapKey === 'origins-speedrun') {
    return <Navigate to="/maps/origins/speed-run" replace />;
  }

  if (entries.length === 0) {
    return <Navigate to="/coming-soon" replace />;
  }

  return (
    <div className="side-ee-info-page">
      <div className="side-ee-info">
        <div className="side-ee-info__header" style={{ backgroundImage: `url(${meta.artwork.src})`, backgroundPosition: meta.artwork.focus }}>
          <h1 className="side-ee-info__title">{meta.label}</h1>
        </div>

        <div className="side-ee-info__body">
          {mapKey === 'kino' ? (
            <>
              <section className="side-ee-info__section">
                <h2 className="side-ee-info__section-title">Film Reels</h2>
                <p className="side-ee-info__section-intro">{meta.reelsIntro}</p>
                <ul className="side-ee-info__section-list">
                  {meta.reels.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>

              <section className="side-ee-info__section">
                <h2 className="side-ee-info__section-title">Radios</h2>
                <p className="side-ee-info__section-intro">{meta.radiosIntro}</p>
                <ul className="side-ee-info__section-list">
                  {meta.radios.map((item) => <li key={item}>{item}</li>)}
                </ul>
              </section>
            </>
          ) : (
            entries.map((ee) => (
              ee.videoUrl ? (
                <section key={ee.id} className="side-ee-info__section">
                  <h2 className="side-ee-info__section-title">{ee.title}</h2>
                  {ee.description && <p>{ee.description}</p>}
                  <div className="side-ee-info__video-wrapper">
                  <iframe
                    src={ee.videoUrl}
                    title={ee.title}
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                  </div>
                  <p><a href={ee.videoUrl.replace('/embed/', '/watch?v=')} target="_blank" rel="noopener noreferrer">Open the walkthrough on YouTube</a> if the embedded video is unavailable.</p>
                </section>
              ) : (
                <SideEECard key={ee.id} title={ee.title} description={ee.description} />
              )
            ))
          )}

          <Link to="/side-easter-eggs" className="side-ee-info__back-link">← Back to Side Easter Eggs</Link>
        </div>
      </div>
    </div>
  );
}
