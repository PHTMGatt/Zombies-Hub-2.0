import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation, useNavigationType } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import '../../../../shared/ui/MapChrome.css';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';
import { isDedicatedMapPath } from '../data/dedicatedGuides';

// New pages open at the top (back/forward keeps the browser's position), and
// the active map tab is scrolled into view inside its phone tab strip.
function useRouteViewport(pathname, hash) {
  const navigationType = useNavigationType();

  useLayoutEffect(() => {
    if (navigationType !== 'POP' && !hash) window.scrollTo(0, 0);

    const active = document.querySelector('.zh-map-tabs a[aria-current="page"]');
    const strip = active?.closest('.zh-map-tabs');
    if (strip && strip.scrollWidth > strip.clientWidth) {
      const tab = active.getBoundingClientRect();
      const box = strip.getBoundingClientRect();
      strip.scrollLeft += tab.left - box.left - (strip.clientWidth - tab.width) / 2;
    }
  }, [pathname, hash, navigationType]);
}

function RootLayout() {
  const { pathname, hash } = useLocation();
  const isDedicatedMapRoute = isDedicatedMapPath(pathname);
  useRouteViewport(pathname, hash);

  return (
    <div className="zh-app">
      <HubHeader />
      <main className="zh-main">
        <div className={isDedicatedMapRoute ? 'map-route-host' : 'hub-content'}>
          <Outlet />
        </div>
      </main>
      {!isDedicatedMapRoute && <HubFooter />}
    </div>
  );
}

export default function App() {
  return <AppRoutes RootLayout={RootLayout} />;
}
