import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
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
    hasEasterEgg,
    isEasterEgg,
  } = map;

  const [cardHover, setCardHover] = useState(false);
  const [dlcHover, setDlcHover] = useState(false);

  let bg = coverImage;
  if (cardHover && layoutImage) bg = layoutImage;
  if (dlcHover && hoverImage) bg = hoverImage;

  const Wrapper = disableLink ? 'div' : Link;
  const search = game ? `?game=${encodeURIComponent(game)}` : '';
  const wrapperProps = disableLink
    ? {}
    : {
        to: `/info/${slug}${search}`,
        'aria-label': `Open ${name} map guide`,
      };
  const eeAvailable = Boolean(hasEasterEgg ?? isEasterEgg);

  return (
    <Wrapper
      {...wrapperProps}
      className={`map-card ${isPreview ? 'preview-card' : 'lore-card'}`}
      onMouseEnter={() => setCardHover(true)}
      onMouseLeave={() => {
        setCardHover(false);
        setDlcHover(false);
      }}
      onFocus={() => setCardHover(true)}
      onBlur={() => {
        setCardHover(false);
        setDlcHover(false);
      }}
    >
      <div className="bg-blur" style={{ backgroundImage: `url(${bg})` }} aria-hidden="true" />
      <div className="bg-main" style={{ backgroundImage: `url(${bg})` }} aria-hidden="true" />

      <div className="map-card__meta" aria-hidden="true">
        {game && <span className="map-game-chip">{game.replace('Black Ops ', 'BO')}</span>}
        {eeAvailable && <span className="map-ee-chip">Main EE</span>}
      </div>

      <div className="map-info">
        <div>
          <h3>{name}</h3>
          <p
            className="map-dlc"
            onMouseEnter={event => {
              event.stopPropagation();
              setDlcHover(true);
            }}
            onMouseLeave={event => {
              event.stopPropagation();
              setDlcHover(false);
            }}
          >
            {dlc}
          </p>
        </div>
        {!disableLink && <IoArrowForward className="map-card__arrow" aria-hidden="true" />}
      </div>
    </Wrapper>
  );
}
