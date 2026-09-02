import React from 'react';
import { Outlet } from 'react-router-dom';
import BowNav from '../../components/BowNav';
import '../../styles/pages/Bows.css';

const Bows: React.FC = () => (
  <main className="bows-page">
    <BowNav />
    <Outlet />
  </main>
);

export default Bows;
