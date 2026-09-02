import React from 'react';
import { Outlet } from 'react-router-dom';
import AppRoutes from './AppRoutes';
import HubHeader from '../components/HubHeader';
import HubFooter from '../components/HubFooter';

function RootLayout() {
  return (
    <div className="zh-app">
      <HubHeader />
      <main className="zh-main">
        <Outlet />
      </main>
      <HubFooter />
    </div>
  );
}

export default function App() {
  return <AppRoutes RootLayout={RootLayout} />;
}
