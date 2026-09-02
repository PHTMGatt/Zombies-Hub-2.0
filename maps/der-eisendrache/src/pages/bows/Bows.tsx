// 'Bows.tsx'
// -------------

import React from 'react';
import { Outlet } from 'react-router-dom';
import BowNav from '../../components/BowNav';
import '../../styles/pages/Bows.css';

const Bows: React.FC = () => (
  <div className="bows-page">
    <BowNav />
    <div className="bows-page__outlet">
      <Outlet />
    </div>
  </div>
);

export default Bows;
