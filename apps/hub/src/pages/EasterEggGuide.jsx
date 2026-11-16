import React from 'react';
import { useParams, Navigate, Link } from 'react-router-dom';
import guides from '../data/EasterEggGuides';
import { getDedicatedGuideRoute } from '../data/dedicatedGuides';
import NotFound from '../../../../shared/ui/NotFound';
import mapData from '../data/mapData';
import mapInfo from '../data/mapInfo';
import ComingSoon from './ComingSoon';
import { comingSoonSlugs, videoTodoSlugs } from '../data/videoTodo';
import '../styles/compStyles/EggGuideCard.css';

// A main Easter Egg with no video guide yet: title, one line, a clearly empty video card and related maps.
// Facts come from the map's own data; no video id is invented (see data/videoTodo.js).
function VideoPending({ map, slug, guide }) {
  const info = mapInfo[slug];
  const title = guide?.title ?? map?.name ?? info?.name ?? slug;
  const line = (guide?.description ?? map?.description ?? info?.description ?? '').split(/(?<=\.)\s/)[0];
  const game = guide?.game ?? map?.game;
  const related = mapData
    .filter(item => item.isEasterEgg && item.slug !== slug && item.game === game)
    .filter((item, index, all) => all.findIndex(other => other.slug === item.slug) === index)
    .slice(0, 4);
  return (
    <div className="egg-card guide-page">
      <header className="egg-guide__header">
        <span>MAIN EASTER EGG{game ? ` · ${game}` : ''}</span>
        <h1>{title}</h1>
        {line && <p>{line}</p>}
      </header>
      <div className="egg-guide__layout">
        <div className="egg-guide__pending" role="note">Video guide coming soon</div>
        <aside className="egg-guide__sidebar">
          {game && <div className="egg-guide__meta-row"><span>Game</span><strong>{game}</strong></div>}
          {map?.dlc && <div className="egg-guide__meta-row"><span>DLC</span><strong>{map.dlc}</strong></div>}
          {related.length > 0 && (
            <nav className="egg-guide__related" aria-label="Related maps">
              {related.map(item => (
                <Link key={item.slug} to={getDedicatedGuideRoute(item.slug) ?? `/easter-eggs/${item.slug}`} className="egg-card__link">
                  {item.name} →
                </Link>
              ))}
            </nav>
          )}
          <Link to="/easter-eggs" className="egg-card__link">← Easter Egg Maps</Link>
        </aside>
      </div>
    </div>
  );
}

export default function EasterEggGuide() {
  const { slug: requestedSlug } = useParams();
  const slug = requestedSlug.replace(/-chronicles$/, '');
  const dedicatedRoute = getDedicatedGuideRoute(slug);

  if (dedicatedRoute) {
    return <Navigate to={dedicatedRoute} replace />;
  }

  // One route per game for a map in two games: `<slug>` is the original, `<slug>-chronicles` the BO3 remaster.
  const isRemaster = requestedSlug !== slug;
  const variant = mapData.find(item => item.slug === slug && (isRemaster ? item.game === 'Black Ops 3' : true));
  if (comingSoonSlugs.includes(requestedSlug)) return <ComingSoon map={variant} />;
  if (videoTodoSlugs.includes(requestedSlug) && variant?.isEasterEgg) return <VideoPending map={variant} slug={slug} />;

  const guide = guides.find(g => g.slug === slug);
  if (!guide) {
    const map = mapData.find(item => item.slug === slug && item.isEasterEgg);
    return map ? <VideoPending map={map} slug={slug} /> : <NotFound />;
  }

  const match = guide.videoUrl?.match(/(?:\?v=|\/embed\/|\.be\/)([a-zA-Z0-9_-]{11})/);
  const embedUrl = match ? `https://www.youtube.com/embed/${match[1]}?rel=0` : null;

  if (!embedUrl) {
    return <VideoPending map={mapData.find(item => item.slug === slug)} slug={slug} guide={guide} />;
  }

  return (
    <div className="egg-card guide-page">
      <header className="egg-guide__header">
        <span>VIDEO GUIDE</span>
        <h1>{guide.title}</h1>
        <p>{guide.description}</p>
      </header>

      <div className="egg-guide__layout">
        <div className="egg-card__media egg-guide__video">
          <iframe
            src={embedUrl}
            title={`${guide.title} Easter Egg guide`}
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
            allowFullScreen
          />
        </div>

        <aside className="egg-guide__sidebar">
          <div className="egg-guide__meta-row">
            <span>Game</span>
            <strong>{guide.game}</strong>
          </div>
          <div className="egg-guide__meta-row">
            <span>DLC</span>
            <strong>{guide.dlc}</strong>
          </div>
          <div className="egg-guide__meta-row">
            <span>Released</span>
            <strong>{guide.released}</strong>
          </div>

          <Link to="/easter-eggs" className="egg-card__link">
            ← Easter Egg Maps
          </Link>
        </aside>
      </div>
    </div>
  );
}
