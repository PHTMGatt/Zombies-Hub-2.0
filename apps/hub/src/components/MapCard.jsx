// File: MapCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/compStyles/MapCard.css';

export default function MapCard({
  map,
  isPreview = true,
  disableLink = false,
}) {
  const {
    name,
    game,
    dlc,
    coverImage,
    layoutImage,
    hoverImage,
    slug,
  } = map;

  const [cardHover, setCardHover] = useState(false);
  const [dlcHover, setDlcHover] = useState(false);

  let bg = coverImage;
  if (cardHover && layoutImage) bg = layoutImage;
  if (dlcHover && hoverImage) bg = hoverImage;

  const Wrapper = disableLink ? 'div' : Link;
  const search = game ? `?game=${encodeURIComponent(game)}` : '';
  const wrapperProps = disableLink ? {} : { to: `/info/${slug}${search}` };

  return (
    <Wrapper
      {...wrapperProps}
      className={`map-card ${isPreview ? 'preview-card' : 'lore-card'}`}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => {
        setCardHover(false);
        setDlcHover(false);
      }}
    >
      <div className="bg-blur" style={{ backgroundImage: `url(${bg})` }} />
      <div className="bg-main" style={{ backgroundImage: `url(${bg})` }} />

      <div className="map-info">
        <h3>{name}</h3>
        <p
          className="map-dlc"
          onMouseEnter={e => { e.stopPropagation(); setDlcHover(true); }}
          onMouseLeave={e => { e.stopPropagation(); setDlcHover(false); }}
        >
          {dlc}
        </p>
      </div>
    </Wrapper>
  );
}
