import React from 'react';
import { useParams, useSearchParams, Link } from 'react-router-dom';
import NotFound from '../../../../shared/ui/NotFound';
import mapInfo from '../data/mapInfo';
import mapData from '../data/mapData';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import '../styles/pageStyles/MapInfo.css';

export default function MapInfo() {
  const { slug } = useParams();
  const [searchParams] = useSearchParams();
  const canonicalSlug = slug.replace(/-chronicles$/, '');
  const requestedGame = searchParams.get('game') || (slug.endsWith('-chronicles') ? 'Black Ops 3' : null);
  const info = mapInfo[slug];

  if (!info) {
    return <NotFound />;
  }

  const variants = mapData.filter(m => m.slug === canonicalSlug);
  const meta = variants.find(m => m.game === requestedGame)
    || variants[0]
    || mapData.find(m => m.name === info.name)
    || {};

  const banner = meta.coverImage || meta.layoutImage;
  const dedicatedRoute = getDedicatedGuideRoute(canonicalSlug);
  const guideRoute = dedicatedRoute || `/easter-eggs/${canonicalSlug}`;
  const hasMainQuest = Boolean(meta.isEasterEgg);
  const releasedLabel = meta.dlc === 'Zombies Chronicles'
    ? 'Black Ops III: Zombies Chronicles (2017)'
    : meta.dlc === 'DLC 4 – Rezurrection'
      ? 'Black Ops: Rezurrection DLC (2011)'
      : info.releasedIn;

  return (
    <div className="map-info-container">
      <div className={`map-info-card${!info.description ? ' no-info' : ''}`}>
        {banner && (
          <div className="map-info-banner-container">
            <img
              src={banner}
              alt={`${info.name} map banner`}
              className="map-info-banner"
            />
            <div className="map-info-banner-overlay">{info.name}</div>
          </div>
        )}

        <div className="map-info-details">
          <h1>{info.name}</h1>
          <div className="info-row">
            {meta.game && <span><strong>Game:</strong> {meta.game}</span>}
            {meta.dlc && <span><strong>DLC:</strong> {meta.dlc}</span>}
          </div>

          <div className="info-row">
            {releasedLabel && <span><strong>Released:</strong> {releasedLabel}</span>}
            {hasMainQuest ? (
              <Link to={guideRoute} className="badge">
                {dedicatedRoute ? '📖 Open Easter Egg Guide' : '🎁 Main Easter Egg'}
              </Link>
            ) : (
              <span className="badge no-egg">No Main Easter Egg</span>
            )}
          </div>

          {info.description && <p className="description">{info.description}</p>}

          <Link to="/allmaps" className="back-link">
            ← Back to Map list
          </Link>
        </div>
      </div>
    </div>
  );
}
