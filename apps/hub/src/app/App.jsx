import React, { Suspense, useEffect, useLayoutEffect, useRef, useState } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';
import { isDedicatedMapPath } from '../data/dedicatedGuides';
import { routeDescription, routeTitle } from './routeMetadata';
import RouteBoundary from '../../../../shared/ui/RouteBoundary';
import AchievementToast from '../../../../shared/achievements/AchievementToast';
import { backfillLegacyMainAchievements } from '../../../../shared/achievements/achievements';
import { useTabSectionLanding } from '../../../../shared/guide/useHashLanding';

// Keeps the head in step with the route: search engines that run JS and in-app link previews read these.
function setHeadTag(tag, key, value, attribute = 'content') {
  const [name, id] = key;
  let element = document.head.querySelector(`${tag}[${name}="${id}"]`);
  if (!element) {
    element = document.createElement(tag);
    element.setAttribute(name, id);
    document.head.appendChild(element);
  }
  element.setAttribute(attribute, value);
}

function syncHead(pathname) {
  const title = routeTitle(pathname);
  const description = routeDescription(pathname);
  const url = `${window.location.origin}${pathname.replace(/\/+$/, '') || '/'}`;
  document.title = title;
  setHeadTag('meta', ['name', 'description'], description);
  setHeadTag('meta', ['property', 'og:title'], title);
  setHeadTag('meta', ['property', 'og:description'], description);
  setHeadTag('meta', ['property', 'og:url'], url);
  setHeadTag('link', ['rel', 'canonical'], url, 'href');
}

// While a route's code loads, the footer is left out: drawn under the short loading note, it would jump
// once the page arrives (a layout shift). The note reports when it is on screen.
function RouteLoading({ onShow }) {
  useLayoutEffect(() => {
    onShow(true);
    return () => onShow(false);
  }, [onShow]);
  return <div className="zh-status-page" role="status" aria-live="polite">Loading your guide…</div>;
}

function RootLayout() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const isDedicatedMapRoute = isDedicatedMapPath(pathname);
  const mainRef = useRef(null);
  const previousPathRef = useRef(pathname);
  const [routeLoading, setRouteLoading] = useState(false);
  useTabSectionLanding();

  // Links from before step anchors (/maps/<map>?ref=<stepId>) land on the same step.
  useLayoutEffect(() => {
    const legacyRef = pathname.startsWith('/maps/') ? new URLSearchParams(search).get('ref') : null;
    if (legacyRef) navigate(`${pathname}#${encodeURIComponent(legacyRef)}`, { replace: true });
  }, [pathname, search, navigate]);

  useLayoutEffect(() => {
    syncHead(pathname);
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  // Runs finished under the old step tracker are credited once, silently.
  useEffect(() => {
    backfillLegacyMainAchievements();
  }, []);

  useEffect(() => {
    const pathChanged = previousPathRef.current !== pathname;
    previousPathRef.current = pathname;
    if (pathChanged && !hash) mainRef.current?.focus({ preventScroll: true });
  }, [pathname, hash]);

  return (
    <div className="zh-app">
      <a className="zh-skip-link" href="#zh-main">Skip to guide</a>
      <HubHeader />
      <main ref={mainRef} className="zh-main" id="zh-main" tabIndex="-1">
        <div className={isDedicatedMapRoute ? 'map-route-host' : 'hub-content'}>
          <RouteBoundary key={pathname}>
            <Suspense fallback={<RouteLoading onShow={setRouteLoading} />}>
              <Outlet />
            </Suspense>
          </RouteBoundary>
        </div>
      </main>
      {!isDedicatedMapRoute && !routeLoading && <HubFooter />}
      <AchievementToast />
    </div>
  );
}

export default function App() {
  return <AppRoutes RootLayout={RootLayout} />;
}
