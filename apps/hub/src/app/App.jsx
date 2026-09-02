import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';

function RootLayout() {
  const { pathname } = useLocation();
  const isMapRoute = pathname.startsWith('/maps/');

  return (
    <div className="zh-app">
      <HubHeader />
      <main className="zh-main">
        <Outlet />
      </main>
      {!isMapRoute && <HubFooter />}
    </div>
  );
}

export default function App() {
  return <AppRoutes RootLayout={RootLayout} />;
}
