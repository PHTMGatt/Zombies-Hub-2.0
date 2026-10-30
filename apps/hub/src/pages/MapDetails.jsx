import React from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import mapData from '../data/mapData';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import MapCard from '../components/MapCard';
import { mainEggStatus } from '../data/guideStatus';
import '../styles/pageStyles/MapDetails.css';
import NotFound from '../../../../shared/ui/NotFound';

// Non-dedicated maps with a side Easter Egg page.
const SIDE_EE = { 'kino-der-toten': 'kino' };

export default function MapDetails() {
  const { slug: requestedSlug } = useParams();
  const slug = requestedSlug.replace(/-chronicles$/, '');
  const [searchParams] = useSearchParams();
  const requestedGame = searchParams.get('game') || (requestedSlug.endsWith('-chronicles') ? 'Black Ops 3' : null);
  const dedicatedRoute = getDedicatedGuideRoute(slug);

  if (dedicatedRoute) {
    return <Navigate to={dedicatedRoute} replace />;
  }

  const variants = mapData.filter(m => m.slug === slug);
  const map = variants.find(m => m.game === requestedGame) || variants[0];

  if (!map) {
    return <NotFound />;
  }

  return (
    <div className="map-details-wrapper">
      <div className="map-details-header">
        <h1>{map.name}</h1>
      </div>

      <MapCard map={map} isPreview={false} disableLink />

      {/* Never a dead end: the map's info, and its main Easter Egg when there is something to open. */}
      <nav className="map-details-actions" aria-label={`${map.name} pages`}>
        <Link to={`/info/${map.slug}${map.game ? `?game=${encodeURIComponent(map.game)}` : ''}`}>Map info</Link>
        {map.isEasterEgg && mainEggStatus(map).kind === 'video' && (
          <Link to={`/easter-eggs/${map.slug}`}>Main Easter Egg video</Link>
        )}
        {SIDE_EE[map.slug] && <Link to={`/side-easter-eggs/${SIDE_EE[map.slug]}`}>Side Easter Eggs</Link>}
        <Link to="/allmaps">← All maps</Link>
      </nav>
    </div>
  );
}
