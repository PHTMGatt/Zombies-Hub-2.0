import React, { useLayoutEffect } from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';
import { isDedicatedMapPath } from '../data/dedicatedGuides';

function RootLayout() {
  const { pathname, hash } = useLocation();
  const isDedicatedMapRoute = isDedicatedMapPath(pathname);

  useLayoutEffect(() => {
    if (hash) {
      const target = document.getElementById(hash.slice(1));
      if (target) target.scrollIntoView({ block: 'start' });
      return;
    }

    window.scrollTo({ top: 0, left: 0, behavior: 'auto' });
  }, [pathname, hash]);

  return (
    <div className="zh-app">
      <a className="zh-skip-link" href="#zh-main">Skip to guide</a>
      <HubHeader />
      <main className="zh-main" id="zh-main" tabIndex="-1">
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
