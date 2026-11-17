// src/pages/ComingSoon.jsx

import React from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import mapData from '../data/mapData';
import '../styles/pageStyles/ComingSoon.css';

/*
 * A guide that is not ready yet. It looks intentional: the guide is "in progress", and progress saving is
 * a visible, honestly-unfinished teaser (no fake percentages).
 * Reached as /coming-soon?map=<slug>&game=<game>&guide=main|video, or with a `map` prop.
 */
export default function ComingSoon({ map: mapProp }) {
  const [params] = useSearchParams();
  const slug = params.get('map');
  const game = params.get('game');
  const map = mapProp ?? (slug ? mapData.find((m) => m.slug === slug && (!game || m.game === game)) ?? mapData.find((m) => m.slug === slug) : null);
  const guide = params.get('guide') === 'video' ? 'Video guide' : 'Main guide';
  const mapHref = map ? `/maps/${map.slug}${map.game ? `?game=${encodeURIComponent(map.game)}` : ''}` : null;

  return (
    <div className="coming-soon">
      <section className="coming-soon__panel" aria-labelledby="coming-soon-title">
        <p className="coming-soon__kicker">In progress</p>
        <h1 id="coming-soon-title">{guide} coming soon</h1>
        {map && <p className="coming-soon__map">{map.name} · {map.game}</p>}
        <p className="coming-soon__text">
          We&apos;re building this one.
        </p>

        <div className="coming-soon__teaser" aria-label="Progress saving, coming soon">
          <div className="coming-soon__teaser-head">
            <strong>Progress saving</strong>
            <span>Coming soon</span>
          </div>
          <div className="coming-soon__bar" aria-hidden="true"><i /></div>
          <p>Soon you&apos;ll be able to tick off steps and pick up where you left off.</p>
        </div>

        <p className="coming-soon__links">
          {mapHref && <Link to={mapHref}>← Back to {map.name}</Link>}
          <Link to="/allmaps">All maps</Link>
        </p>
      </section>
    </div>
  );
}
