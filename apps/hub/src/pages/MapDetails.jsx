import React from 'react';
import { useParams, useSearchParams, Link, Navigate } from 'react-router-dom';
import mapData from '../data/mapData';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import MapCard from '../components/MapCard';
import '../styles/pageStyles/MapDetails.css';
import NotFound from '../../../../shared/ui/NotFound';

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

      <Link to="/allmaps" className="back-link">
        ← Back to Map List
      </Link>
    </div>
  );
}
