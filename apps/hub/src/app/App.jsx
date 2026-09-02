import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';

const dedicatedMapPrefixes = [
  '/maps/origins',
  '/maps/mob-of-the-dead',
  '/maps/der-eisendrache',
  '/maps/zetsubou-no-shima',
  '/maps/gorod-krovi',
  '/maps/revelations',
];

function RootLayout() {
  const { pathname } = useLocation();
  const isDedicatedMapRoute = dedicatedMapPrefixes.some(prefix =>
    pathname === prefix || pathname.startsWith(`${prefix}/`),
  );

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
