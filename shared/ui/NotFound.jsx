import React, { useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function NotFound() {
  const { pathname } = useLocation();
  const Heading = /^\/maps\/(origins|mob-of-the-dead|shadows-of-evil|der-eisendrache|zetsubou-no-shima|gorod-krovi|revelations)\//.test(pathname) ? 'h2' : 'h1';
  useEffect(() => {
    document.title = 'Page not found | Zombies Hub 2.0';
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
