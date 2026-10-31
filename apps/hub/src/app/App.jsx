import React, { Suspense, useEffect, useLayoutEffect, useRef } from 'react';
import { Outlet, useLocation, useNavigate } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';
import { isDedicatedMapPath } from '../data/dedicatedGuides';
import { routeTitle } from './routeMetadata';
import RouteBoundary from '../../../../shared/ui/RouteBoundary';
import AchievementToast from '../../../../shared/achievements/AchievementToast';
import { backfillLegacyMainAchievements } from '../../../../shared/achievements/achievements';

function RootLayout() {
  const { pathname, hash, search } = useLocation();
  const navigate = useNavigate();
  const isDedicatedMapRoute = isDedicatedMapPath(pathname);
  const mainRef = useRef(null);
  const previousPathRef = useRef(pathname);

  // Links from before step anchors (/maps/<map>?ref=<stepId>) land on the same step.
  useLayoutEffect(() => {
    const legacyRef = pathname.startsWith('/maps/') ? new URLSearchParams(search).get('ref') : null;
    if (legacyRef) navigate(`${pathname}#${encodeURIComponent(legacyRef)}`, { replace: true });
  }, [pathname, search, navigate]);

  useLayoutEffect(() => {
    document.title = routeTitle(pathname);
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
            <Suspense fallback={<div className="zh-status-page" role="status" aria-live="polite">Loading your guide…</div>}>
              <Outlet />
            </Suspense>
          </RouteBoundary>
        </div>
      </main>
      {!isDedicatedMapRoute && <HubFooter />}
      <AchievementToast />
    </div>
  );
}

export default function App() {
  return <AppRoutes RootLayout={RootLayout} />;
}
