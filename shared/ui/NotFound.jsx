import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();
  const Heading = /^\/maps\/(origins|mob-of-the-dead|shadows-of-evil|der-eisendrache|zetsubou-no-shima|gorod-krovi|revelations)\//.test(pathname) ? 'h2' : 'h1';
  useEffect(() => {
    document.title = 'Page not found | Zombies Hub 2.0';
    // Keep this page out of search results. Paths under a client route (/maps/…, /easter-eggs/…) are answered
    // with 200 and the app shell, so the tag is added here; a 404.html load already has it, so reuse that one.
    // It leaves with this page either way (Find a map, Return to the Hub).
    let robots = document.querySelector('meta[name="robots"]');
    if (!robots) {
      robots = document.createElement('meta');
      robots.name = 'robots';
      robots.content = 'noindex';
      document.head.appendChild(robots);
    }
    return () => robots.remove();
  }, []);

  return (
    <section className="zh-status-page" data-page-not-found>
      <p className="zh-status-page__eyebrow">404 / OFF THE MAP</p>
      <Heading>This route leads nowhere.</Heading>
      <p>The guide may have moved, or the address may be incomplete. Find your map and pick up where you left off.</p>
      <Link className="zh-status-page__action" to="/allmaps">Find a map</Link>
      <Link to="/">Return to the Hub</Link>
    </section>
  );
}
