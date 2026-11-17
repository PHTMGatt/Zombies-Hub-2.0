import { mainEggStatus } from '../data/guideStatus';
import React, { useEffect, useRef, useState } from 'react';
import { Link } from 'react-router-dom';
import { IoArrowForward } from 'react-icons/io5';
import '../styles/compStyles/MapCard.css';

// Card art is a CSS background, which the browser never lazy-loads: a catalog of 30 cards fetched every
// cover up front. A card attaches its art only once it is within a screen or so of the viewport.
function useNearViewport() {
  const ref = useRef(null);
  const [near, setNear] = useState(() => typeof IntersectionObserver === 'undefined');
  useEffect(() => {
    if (near || !ref.current) return undefined;
    const observer = new IntersectionObserver((entries) => {
      if (entries.some((entry) => entry.isIntersecting)) {
        setNear(true);
        observer.disconnect();
      }
    }, { rootMargin: '600px 0px' });
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [near]);
  return [ref, near];
}

export default function MapCard({
  map,
  isPreview = true,
  disableLink = false,
  to,
  badge,
  badgeKind,
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
  const [cardRef, nearViewport] = useNearViewport();

  let bg = coverImage;
  if (cardHover && layoutImage) bg = layoutImage;
  if (dlcHover && hoverImage) bg = hoverImage;
  const artStyle = nearViewport && bg ? { backgroundImage: `url(${bg})` } : undefined;

  const Wrapper = disableLink ? 'div' : Link;
  const search = game ? `?game=${encodeURIComponent(game)}` : '';
  const destination = to || `/info/${slug}${search}`;
  const wrapperProps = disableLink
    ? {}
    : {
        to: destination,
        'aria-label': badge ? `${name} — ${badge}` : `Open ${name} map guide`,
      };
  const eeAvailable = Boolean(hasEasterEgg ?? isEasterEgg);
  // Honest chip: only a map with a full guide says "Main EE"; video-only says "Video guide"; no guide is muted "Coming soon".
  const eeStatus = eeAvailable ? mainEggStatus(map) : null;
  const eeChip = eeStatus && { text: { tracked: 'Main EE', video: 'Video guide', none: 'Coming soon' }[eeStatus.kind], kind: eeStatus.kind };

  return (
    <Wrapper
      {...wrapperProps}
      ref={cardRef}
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
      <div className="bg-blur" style={artStyle} aria-hidden="true" />
      <div className="bg-main" style={artStyle} aria-hidden="true" />

      <div className="map-card__meta" aria-hidden="true">
        {game && <span className="map-game-chip">{game.replace('Black Ops ', 'BO')}</span>}
        {badge
          ? <span className={`map-ee-chip map-ee-chip--${badgeKind}`}>{badge}</span>
          : eeChip && <span className={`map-ee-chip map-ee-chip--${eeChip.kind}`}>{eeChip.text}</span>}
      </div>

      <div className="map-info">
        <div>
          <h2>{name}</h2>
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
