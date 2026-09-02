// File: MapCard.jsx

import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import '../styles/compStyles/MapCard.css';

export default function MapCard({
  map,
  isPreview = true,       // controls grid style
  disableLink = false,     // disables routing wrapper
}) {
  const {
    name,
    dlc,
    coverImage,
    layoutImage,
    hoverImage,
    slug,
  } = map;

  // Hover state to control image background behavior
  const [cardHover, setCardHover] = useState(false);
  const [dlcHover, setDlcHover] = useState(false);

  // Determine which background image to show
  let bg = coverImage;
  if (cardHover && layoutImage) bg = layoutImage;
  if (dlcHover && hoverImage)   bg = hoverImage;

  // If disableLink is true, wrap with <div>, otherwise use <Link>
  const Wrapper = disableLink ? 'div' : Link;
  const wrapperProps = disableLink ? {} : { to: `/info/${slug}` };

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
