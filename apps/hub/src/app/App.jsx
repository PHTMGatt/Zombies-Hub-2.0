import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';
import { isDedicatedMapPath } from '../data/dedicatedGuides';

function RootLayout() {
  const { pathname } = useLocation();
  const isDedicatedMapRoute = isDedicatedMapPath(pathname);

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
