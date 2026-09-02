// src/pages/SideEEInfo.jsx

import React from 'react';
import { useParams, Link, Navigate } from 'react-router-dom';
import imageData from '../data/imageData';
import sideEEs from '../data/sideEE';
import SideEECard from '../components/SideEECard';
import '../styles/SideEE/SideEEInfo.css';

// Static metadata for each side EE map
const SIDE_EE_META = {
  kino: {
    label: 'Kino der Toten',
    cover: imageData.Kino_Der_TotenCover,
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
  gk:  { label: 'Gorod Krovi',     cover: imageData.Gorod_KroviCover },
  de:  { label: 'Der Eisendrache', cover: imageData.Der_EisendracheCover },
  soe: { label: 'Shadows of Evil', cover: imageData.Shadows_Of_EvilCover },
};

export default function SideEEInfo() {
  const { mapKey } = useParams();
  const meta = SIDE_EE_META[mapKey];         // map-level meta (name, cover, etc.)
  const entries = sideEEs[mapKey] || [];     // guide entries (videos or text cards)

  // Fallback: invalid map key
  if (!meta) {
    return (
      <div className="ee-page-wrapper">
        <p>Map not found.</p>
        <Link to="/side-easter-eggs" className="side-ee-info__back-link">
          ← Back to Side Easter Eggs
        </Link>
      </div>
    );
  }

  // Fallback: valid map but no content yet
  if (entries.length === 0) {
    return <Navigate to="/coming-soon" replace />;
  }

  return (
    <div className="ee-page-wrapper">
      {/* Header with background image and title */}
      <div className="side-ee-info">
        <div
          className="side-ee-info__header"
          style={{ backgroundImage: `url(${meta.cover})` }}
        >
          <h1 className="side-ee-info__title">{meta.label}</h1>
        </div>

        <div className="side-ee-info__body">
          {/* Special Kino layout */}
          {mapKey === 'kino' ? (
            <>
              <section className="side-ee-info__section">
                <h2 className="side-ee-info__section-title">Film Reels</h2>
                <p className="side-ee-info__section-intro">{meta.reelsIntro}</p>
                <ul className="side-ee-info__section-list">
                  {meta.reels.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>

              <section className="side-ee-info__section">
                <h2 className="side-ee-info__section-title">Radios</h2>
                <p className="side-ee-info__section-intro">{meta.radiosIntro}</p>
                <ul className="side-ee-info__section-list">
                  {meta.radios.map((item, i) => <li key={i}>{item}</li>)}
                </ul>
              </section>
            </>
          ) : (
            // Render cards or videos for other maps
            entries.map((ee) =>
              ee.videoUrl ? (
                <div key={ee.id} className="side-ee-info__video-wrapper">
                  <iframe
                    src={ee.videoUrl}
                    title={ee.title}
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  />
                </div>
              ) : (
                <SideEECard
                  key={ee.id}
                  title={ee.title}
                  description={ee.description}
                />
              )
            )
          )}

          {/* Back nav */}
          <Link to="/side-easter-eggs" className="side-ee-info__back-link">
            ← Back to Side Easter Eggs
          </Link>
        </div>
      </div>
    </div>
  );
}
