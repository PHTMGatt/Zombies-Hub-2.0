import React, { useEffect, useRef } from 'react';
import { NavLink, useLocation } from 'react-router-dom';
import '@fontsource/rajdhani/latin-500.css';
import '@fontsource/rajdhani/latin-600.css';
import '@fontsource/rajdhani/latin-700.css';
import './sys.css';

/*
 * The shared exoskeleton of a map guide: title block, tab list, page, footer. It owns responsive behaviour,
 * spacing, hierarchy, deep links and focus. It does NOT own a map's personality: each map passes its own
 * art, emblem, title wording, tab icons and tab colours, and each candidate system styles a map by name.
 *   design: 'a' OG, 'b' document, 'c' rail (see sys.css)
 *   tabs:   [{ to, label, end, tone, Icon }]   tone = that tab's colour (a staff colour on Origins)
 */
const SYSTEM = { a: 'og', b: 'doc', c: 'rail' };
const trim = (path) => path.replace(/\/+$/, '');

export default function SysShell({ design, mapId, mapLine, questLine, art, emblem, bullet, tabs, navLabel, children }) {
  const { pathname } = useLocation();
  const listRef = useRef(null);
  const here = trim(pathname);
  const current = tabs.find((tab) => (tab.end ? trim(tab.to) === here : here.startsWith(trim(tab.to)))) ?? tabs[0];

  // Where the tab list is one scrolling row (phones), keep the current tab in view. Row only, never the page.
  useEffect(() => {
    const row = listRef.current;
    const active = row?.querySelector('[aria-current="page"]');
    if (!row || !active || row.scrollWidth <= row.clientWidth) return;
    const rowBox = row.getBoundingClientRect();
    const box = active.getBoundingClientRect();
    row.scrollLeft += box.left - rowBox.left - (rowBox.width - box.width) / 2;
  }, [pathname]);

  const vars = {
    '--sys-art': art ? `url(${art})` : 'none',
    '--sys-bullet': bullet ? `url(${bullet})` : 'none',
    '--page-tone': current.tone,
  };

  return (
    <section className={`sys sys--${SYSTEM[design]}`} data-design={design} data-map={mapId} style={vars}>
      <header className="sys-head">
        <div className="sys-head__art" aria-hidden="true" />
        <div className="sys-head__inner">
          {emblem && <img className="sys-head__emblem" src={emblem} alt="" aria-hidden="true" />}
          <h1 className="sys-head__title">
            <span className="sys-head__map">{mapLine}</span>{' '}
            <span className="sys-head__quest">{questLine}</span>
          </h1>
          {emblem && <img className="sys-head__emblem sys-head__emblem--end" src={emblem} alt="" aria-hidden="true" />}
        </div>
      </header>

      <nav className="sys-nav" aria-label={navLabel}>
        <ul className="sys-nav__list" ref={listRef}>
          {tabs.map(({ to, label, end, tone, Icon }) => (
            <li key={to} className="sys-nav__item" style={{ '--tone': tone }}>
              <NavLink to={to} end={end} className="sys-nav__link">
                {Icon && <Icon className="sys-nav__icon" aria-hidden="true" />}
                <span className="sys-nav__label">{label}</span>
              </NavLink>
            </li>
          ))}
        </ul>
      </nav>

      <div className="sys-main">{children}</div>

      <footer className="sys-foot">
        <strong>{mapLine}</strong> <span>{questLine}</span>
      </footer>
    </section>
  );
}
